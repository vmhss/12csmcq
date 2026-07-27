/* firebase-messaging-sw.js
   Handles push notifications while the app/tab is CLOSED or in the
   background. Must be hosted at the site root (same folder as index.html)
   so its scope covers the whole site. Registered from script.js via:
     navigator.serviceWorker.register('firebase-messaging-sw.js')
*/
importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-messaging-compat.js');

// Same public config used in script.js — safe to expose client-side.
firebase.initializeApp({
  apiKey: "AIzaSyC2pLr4kRH26bkOM73JW-Us6X029qaDp0E",
  authDomain: "onemarkvmhss.firebaseapp.com",
  projectId: "onemarkvmhss",
  storageBucket: "onemarkvmhss.firebasestorage.app",
  messagingSenderId: "372823957264",
  appId: "1:372823957264:web:a1a8742ff4a1caaab80f95"
});

const messaging = firebase.messaging();

// Fired when a push arrives and the app is NOT in the foreground.
messaging.onBackgroundMessage((payload) => {
  const title = payload?.notification?.title || payload?.data?.title || '📅 Test Reminder';
  const body = payload?.notification?.body || payload?.data?.body || '';
  self.registration.showNotification(title, {
    body,
    icon: 'icon-192.png',
    badge: 'icon-192.png',
    data: { url: self.registration.scope }
  });
});

// Focus/open the app when the notification is tapped.
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(targetUrl) && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(targetUrl);
    })
  );
});
