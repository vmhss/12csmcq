[README-notifications.md](https://github.com/user-attachments/files/30409228/README-notifications.md)
# Test Reminder Push Notifications — Setup Guide

This adds **real push notifications** for test reminders — students get
notified even if the app/browser is fully closed, at a date & time you
(the teacher/admin) set from the Admin panel.

## How it works

1. A student signs in with Google and turns on **Settings → Test
   Reminders**. The app registers their device with Firebase Cloud
   Messaging (FCM) and stores the device token on their student record.
2. An admin (one of the emails in `ADMIN_EMAILS`) opens **Admin → 📅
   Schedule Test Reminder**, sets a title, test date/time, target class,
   and how long before the test to notify.
3. A Cloud Function (`functions/index.js`) runs every 5 minutes, checks
   for reminders that are due, and pushes a notification to every
   registered device for the matching class.

Because sending actually happens on a timer, notifications land within
~5 minutes of the scheduled send time — plenty precise for "remind them
30 minutes before an 8 PM test."

## One-time setup (you only need to do this once)

### 1. Upgrade to the Blaze plan
Cloud Functions' scheduler needs the pay-as-you-go **Blaze** plan.
Firebase Console → your project → ⚙️ → Usage and billing → Modify plan.
The scheduled function here runs ~8,640 times/month doing almost nothing
most of the time — this stays well within the free monthly quota
(2M invocations), so realistically you will not be charged.

### 2. Generate a Web Push (VAPID) key
Firebase Console → ⚙️ Project Settings → **Cloud Messaging** tab →
"Web configuration" → **Generate key pair**. Copy the key.

Open `script.js` and paste it in:
```js
const FCM_VAPID_KEY = "PASTE_YOUR_VAPID_KEY_HERE";
```

### 3. Deploy the Cloud Function
From your project root (where `firebase.json` lives — run `firebase
init` once if you don't have one yet, choosing "Functions" and
JavaScript):

```bash
npm install -g firebase-tools      # if you don't have it
firebase login
firebase deploy --only functions
```

This uses the `functions/index.js` and `functions/package.json` files
included here.

### 4. Update your Firestore security rules
Add these rules (merge with whatever you already have):

```
match /students/{uid} {
  allow read: if request.auth != null;
  allow write: if request.auth != null && request.auth.uid == uid;
}

match /testReminders/{id} {
  allow read: if request.auth != null;
  allow create, update, delete: if request.auth != null
    && request.auth.token.email in [
      'immortalassassin064@gmail.com',
      'magnate2242@gmail.com'
    ];
}
```
(The Cloud Function itself uses the Admin SDK, which bypasses these
rules entirely — this is only for what the browser is allowed to do.)

### 5. Add the app icon (if you don't already have one)
`firebase-messaging-sw.js` and the foreground handler reference
`icon-192.png` at the site root for the notification icon. Add a
192×192 PNG there, or change the filename in `firebase-messaging-sw.js`
and `script.js` to an icon you already have.

## Files added/changed

| File | What changed |
|---|---|
| `index.html` | Firebase Messaging SDK script tag, "Test Reminders" toggle in Settings, "Schedule Test Reminder" panel in Admin |
| `script.js` | Token registration, permission handling, foreground message toast, admin scheduling/listing functions |
| `styles.css` | Small `.admin-field label` rule for the new admin form |
| `firebase-messaging-sw.js` | **New file** — handles push while the app is closed |
| `functions/index.js` | **New file** — the scheduled Cloud Function that sends the pushes |
| `functions/package.json` | **New file** — dependencies for the function |

## Limitations to know about

- **Guest mode students can't get push reminders.** Push notifications
  are tied to a Firestore student record reachable by class, and guest
  progress only lives in that browser's `localStorage`. The Settings
  panel explains this and prompts guests to sign in with Google.
- **iOS Safari** requires the site to be **added to the Home Screen**
  (installed as a PWA) before push notifications work at all — this is
  an Apple platform restriction, not something fixable in code.
- If a student denies the browser notification permission, the toggle
  will show as blocked; they need to re-allow it in their browser's
  site settings.
