// ============================================================
// Service Worker - Xpert PWA
// ============================================================

// ⚠️ رقم النسخة كيتجدد تلقائياً من utils/build.js (hash ديال محتوى
// الملفات الأساسية) - ما خاصكش تبدلها يدوياً، غير شغل: node utils/build.js
const CACHE_NAME = 'xpert-b4c60d0d';

// ====== App Shell فقط ======
// هادي غير الصفحات/الملفات الأساسية اللي خاصها تكون جاهزة من أول
// تشغيل للموقع (بلا نت). صفحات الدروس/السلاسل/التمارين ماشي هنا -
// كيتخزنو تلقائياً (runtime caching) أول ما الزائر يفتح كل وحدة،
// باش ما يتحملش مئات الصفحات دفعة وحدة عند أول زيارة (شوف fetch
// handler تحت). هاد التغيير كيخلي الموقع يبقى خفيف فأول تحميل حتى
// ولو عدد الصفحات زاد لـ500+ صفحة.
const urlsToCache = [
    './',
    './index.html',
    './subjects.html',
    './subject.html',
    './calendrier.html',
    './assets/css/style.css',
    './assets/css/lesson-common.css',
    './assets/css/global-control.css',
    './assets/js/script.js',
    './assets/js/protection.js',
    './assets/images/profile.png',
    './manifest.json',
    './assets/images/icon-192.png',
    './assets/images/icon-512.png',
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
        <p>هاذ الصفحة ماشي محفوظة عندك للقراءة بدون نت. زرها مرة وحدة ومنت متصل باش تقدر تفتحها لاحقاً بدون نت.</p>
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
        // Network-First + تخزين تلقائي لكل صفحة تتزار (بما فيها صفحات
        // الدروس/السلاسل/التمارين) - هادي اللي كتعوض precache الشامل:
        // الصفحة كتتخزن غير أول ما الزائر يفتحها فعليا.
        event.respondWith(
            fetch(event.request)
                .then(function(response) {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
                    return response;
                })
                .catch(function() {
                    return caches.match(event.request).then(function(cached) {
                        if (cached) return cached;
                        // الصفحة ماشي مخزنة وما كاينش نت
                        return new Response(OFFLINE_FALLBACK, {
                            headers: { 'Content-Type': 'text/html; charset=UTF-8' }
                        });
                    });
                })
        );
    } else {
        // ملفات CSS/JS/صور: كاش أولاً، وإلا ماكانتش مخزنة كنجيبوها
        // من الشبكة ونخزنوها للمرة الجاية (stale-while-revalidate خفيف)
        event.respondWith(
            caches.match(event.request)
                .then(function(cached) {
                    if (cached) return cached;
                    return fetch(event.request).then(function(response) {
                        // كنخزنو غير الردود الصحيحة (تفادي تخزين أخطاء الشبكة)
                        if (response && response.status === 200) {
                            const clone = response.clone();
                            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
                        }
                        return response;
                    }).catch(function() {
                        // ملف صورة/CSS/JS ماشي مخزن وما كاينش نت - نخليو الطلب يفشل عادي
                        return new Response('', { status: 408, statusText: 'Offline' });
                    });
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
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});
