// My Journey — service worker (recebe o push e mostra na tela bloqueada)
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

self.addEventListener("push", (event) => {
  let d = {};
  try { d = event.data ? event.data.json() : {}; } catch (_) { d = { body: event.data ? event.data.text() : "" }; }
  const title = d.title || "My Journey";
  // d.url é relativo ao app (ex.: "?feito=orar&t=07:00"): ao tocar, abre já perguntando "Feito?"
  let url = self.registration.scope;
  try { if (d.url && d.url !== "/") url = new URL(d.url, self.registration.scope).href; } catch (_) {}
  const options = {
    body: d.body || "",
    icon: "icon-192.png",
    badge: "icon-192.png",
    vibrate: [90, 40, 90],
    data: { url },
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || self.registration.scope;
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((cs) => {
      for (const c of cs) { if ("focus" in c) { c.navigate(url); return c.focus(); } }
      return self.clients.openWindow(url);
    })
  );
});
