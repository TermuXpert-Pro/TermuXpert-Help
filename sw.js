// ============================================================
// Service Worker - Xpert PWA
// ============================================================

const CACHE_NAME = 'xpert-a6be8fa2';

// ====== App Shell فقط ======
const urlsToCache = [
    '/',
    './index.html',
    './subjects.html',
    './subject.html',
    './calendrier.html',
    './assets/css/style.css',
    './assets/css/lesson-common.css',
    './assets/css/global-control.css',
    './assets/js/script.js',
    './assets/js/protection.js',
    './assets/images/profile.webp',
    './manifest.json',
    './assets/images/icon-192.png',
    './assets/images/icon-512.png'
];

// صفحة بسيطة كتبان إلا كانت الصفحة المطلوبة ماشي مخزنة وما كاينش نت
const OFFLINE_FALLBACK = `
<!DOCTYPE html>
<html lang="fr" dir="ltr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Hors ligne - Xpert</title>
<style>
    body { font-family: sans-serif; background:#0B0C10; color:#E8E8E8; display:flex; align-items:center; justify-content:center; height:100vh; margin:0; text-align:center; padding:20px; }
    div { max-width: 340px; }
    h1 { font-size: 20px; color:#4ECDC4; }
    p { font-size: 14px; color:#9CA3AF; }
</style>
</head>
<body>
    <div>
        <h1>📡 لا يوجد اتصال بالإنترنت</h1>
        <p>هاذ الصفحة ماشي محفوظة عندك للقراءة بدون نت. زرها مرة وحدة وانت متصل باش تقدر تفتحها لاحقاً بدون نت.</p>
    </div>
</body>
</html>`;

// تثبيت Service Worker
self.addEventListener('install', function(event) {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('✅ Service Worker - التخزين المؤقت (App Shell)');
                return cache.addAll(urlsToCache);
            })
    );
});

// اعتراض الطلبات
self.addEventListener('fetch', function(event) {
    // غير طلبات GET كيتخزنو فالكاش (POST وغيرها كيمشيو للشبكة مباشرة)
    if (event.request.method !== 'GET') return;

    const isHTML = event.request.mode === 'navigate' ||
                   (event.request.headers.get('accept') || '').includes('text/html');

    if (isHTML) {
        // Network-First + تخزين تلقائي لكل صفحة تتزار
        event.respondWith(
            fetch(event.request)
                .then(function(response) {
                    if (response && response.status === 200) {
                        const clone = response.clone();
                        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
                    }
                    return response;
                })
                .catch(function() {
                    return caches.match(event.request).then(function(cached) {
                        if (cached) return cached;
                        return new Response(OFFLINE_FALLBACK, {
                            headers: { 'Content-Type': 'text/html; charset=UTF-8' }
                        });
                    });
                })
        );
    } else {
        // Stale-While-Revalidate بالنسبة لملفات CSS/JS والأسيتس
        event.respondWith(
            caches.match(event.request)
                .then(function(cached) {
                    const fetchPromise = fetch(event.request).then(function(networkResponse) {
                        if (networkResponse && networkResponse.status === 200) {
                            const clone = networkResponse.clone();
                            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
                        }
                        return networkResponse;
                    }).catch(function() {
                        return cached;
                    });

                    return cached || fetchPromise;
                })
        );
    }
});

// تحديث Service Worker: حذف الكاش القديم + الاستيلاء الفوري
self.addEventListener('activate', function(event) {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        console.log('🗑️ حذف كاش قديم:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

