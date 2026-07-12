// ============================================================
// Service Worker - Xpert PWA (نسخة محسّنة)
// ============================================================

// ⚠️ مهم: زيد رقم النسخة (v2, v3...) كل مرة كتبدل فيها ملفات الموقع
// باش يجبر المتصفح يحيّد الكاش القديم
const CACHE_NAME = 'xpert-v2';

// استعملنا مسارات نسبية (بدون /TermuXpert-WEB/) باش تخدم فأي مكان تستضاف فيه
const urlsToCache = [
    './',
    './index.html',
    './subjects.html',
    './subject.html',
    './assets/css/style.css',
    './assets/css/lesson-common.css',
    './assets/css/global-control.css',
    './assets/js/script.js',
    './assets/js/protection.js',
    './assets/images/profile.png'
];

// تثبيت Service Worker
self.addEventListener('install', function(event) {
    self.skipWaiting(); // يفعّل النسخة الجديدة مباشرة بلا ما ينتظر
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('✅ Service Worker - التخزين المؤقت');
                return cache.addAll(urlsToCache);
            })
    );
});

// اعتراض الطلبات: Network-First للصفحات HTML، Cache-First للباقي
self.addEventListener('fetch', function(event) {
    const isHTML = event.request.mode === 'navigate' ||
                   (event.request.headers.get('accept') || '').includes('text/html');

    if (isHTML) {
        // دائماً جرب تجيب النسخة الجديدة من النت أولاً
        event.respondWith(
            fetch(event.request)
                .then(function(response) {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
                    return response;
                })
                .catch(function() {
                    // إذا ما كانش نت، رجع للنسخة المخزنة كحل بديل
                    return caches.match(event.request);
                })
        );
    } else {
        // ملفات CSS/JS/صور: كاش أولاً (أسرع)
        event.respondWith(
            caches.match(event.request)
                .then(function(response) {
                    return response || fetch(event.request);
                })
        );
    }
});

// تحديث Service Worker: حذف الكاش القديم + الاستيلاء على الصفحات المفتوحة فوراً
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
