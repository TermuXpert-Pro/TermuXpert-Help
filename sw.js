// ============================================================
// Service Worker - Xpert PWA
// ============================================================

const CACHE_NAME = 'xpert-v1';
const urlsToCache = [
    '/TermuXpert-WEB/',
    '/TermuXpert-WEB/index.html',
    '/TermuXpert-WEB/subjects.html',
    '/TermuXpert-WEB/subject.html',
    '/TermuXpert-WEB/assets/css/style.css',
    '/TermuXpert-WEB/assets/css/lesson-common.css',
    '/TermuXpert-WEB/assets/css/global-control.css',
    '/TermuXpert-WEB/assets/js/script.js',
    '/TermuXpert-WEB/assets/js/protection.js',
    '/TermuXpert-WEB/assets/images/profile.png'
];

// تثبيت Service Worker
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('✅ Service Worker - التخزين المؤقت');
                return cache.addAll(urlsToCache);
            })
    );
});

// اعتراض الطلبات
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});

// تحديث Service Worker
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
        })
    );
});
