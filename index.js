/**
 * Cloud Function: sendTestReminders
 * Runs every 5 minutes. Looks for documents in `testReminders` whose
 * `sendAt` time has passed and `sent` is still false, sends a push
 * notification to every device token registered by students who match
 * the reminder's target class, then marks the reminder as sent.
 *
 * Deploy with:  firebase deploy --only functions
 * Requires the Blaze (pay-as-you-go) plan — Cloud Scheduler and outbound
 * calls are not available on the free Spark plan. In practice, running
 * this every 5 minutes costs a tiny fraction of a cent per month.
 */
const { onSchedule } = require('firebase-functions/v2/scheduler');
const { setGlobalOptions } = require('firebase-functions/v2');
const admin = require('firebase-admin');

admin.initializeApp();
setGlobalOptions({ maxInstances: 2 });

const db = admin.firestore();

exports.sendTestReminders = onSchedule('every 5 minutes', async () => {
  const now = admin.firestore.Timestamp.now();

  const dueSnap = await db.collection('testReminders')
    .where('sent', '==', false)
    .where('sendAt', '<=', now)
    .get();

  if (dueSnap.empty) {
    console.log('No due reminders.');
    return;
  }

  for (const reminderDoc of dueSnap.docs) {
    const reminder = reminderDoc.data();
    console.log(`Processing reminder "${reminder.title}" (${reminderDoc.id})`);

    // Find target students
    let studentsQuery = db.collection('students');
    if (reminder.targetClass && reminder.targetClass !== 'all') {
      studentsQuery = studentsQuery.where('cls', '==', reminder.targetClass);
    }
    const studentsSnap = await studentsQuery.get();

    // Collect all tokens + a map of token -> student doc id (to clean up later)
    const tokenOwners = new Map(); // token -> studentDocId
    studentsSnap.forEach(doc => {
      const tokens = doc.data().fcmTokens || [];
      tokens.forEach(t => tokenOwners.set(t, doc.id));
    });

    const allTokens = Array.from(tokenOwners.keys());
    if (allTokens.length === 0) {
      console.log(`No subscribed devices for "${reminder.title}" — marking sent anyway.`);
      await reminderDoc.ref.set({ sent: true, sentCount: 0, sentAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
      continue;
    }

    const notificationTitle = reminder.title || '📅 Test Reminder';
    const testTimeStr = reminder.testAt && reminder.testAt.toDate
      ? reminder.testAt.toDate().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
      : '';
    const notificationBody = reminder.message
      ? reminder.message
      : `Your test is at ${testTimeStr}. Good luck!`;

    // FCM allows max 500 tokens per multicast call — chunk it.
    const chunks = [];
    for (let i = 0; i < allTokens.length; i += 500) chunks.push(allTokens.slice(i, i + 500));

    let sentCount = 0;
    const deadTokens = [];

    for (const chunk of chunks) {
      const message = {
        tokens: chunk,
        notification: { title: notificationTitle, body: notificationBody },
        data: { type: 'test_reminder', reminderId: reminderDoc.id },
        webpush: {
          fcmOptions: { link: '/' },
          notification: { icon: 'icon-192.png' }
        }
      };
      const res = await admin.messaging().sendEachForMulticast(message);
      sentCount += res.successCount;
      res.responses.forEach((r, i) => {
        if (!r.success) {
          const code = r.error && r.error.code;
          if (code === 'messaging/invalid-registration-token' ||
              code === 'messaging/registration-token-not-registered') {
            deadTokens.push(chunk[i]);
          }
        }
      });
    }

    // Clean up dead tokens from student docs
    for (const token of deadTokens) {
      const studentId = tokenOwners.get(token);
      if (studentId) {
        await db.collection('students').doc(studentId).set({
          fcmTokens: admin.firestore.FieldValue.arrayRemove(token)
        }, { merge: true }).catch(() => {});
      }
    }

    await reminderDoc.ref.set({
      sent: true,
      sentCount,
      sentAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    console.log(`Sent "${reminder.title}" to ${sentCount}/${allTokens.length} device(s).`);
  }
});
