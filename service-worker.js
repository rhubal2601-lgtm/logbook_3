const C='logbook-v3',F=['./','index.html','style.css','app.js','gear.js','manifest.webmanifest','icon-192.png','icon-512.png'];
self.oninstall=e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F)));self.skipWaiting()};
self.onactivate=e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))));
self.onfetch=e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
