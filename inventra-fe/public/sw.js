self.addEventListener('push', function (event) {
  if (!event.data) return;
  try {
    const data = event.data.json();
    const title = data.title || 'Notifikasi Inventra';
    const options = {
      body: data.body || '',
      icon: data.icon || '/images/logo/logo.svg',
      badge: '/images/logo/logo.svg',
      data: {
        url: data.url || '/',
      },
    };
    event.waitUntil(self.registration.showNotification(title, options));
  } catch (e) {
    const text = event.data.text();
    event.waitUntil(
      self.registration.showNotification('Notifikasi Inventra', {
        body: text,
        icon: '/images/logo/logo.svg',
      })
    );
  }
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      const targetUrl = event.notification.data?.url || '/';
      for (const client of clientList) {
        if (client.url && client.focus) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
