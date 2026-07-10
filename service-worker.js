// ============================================================
// Service Worker - Xpert PWA
// ============================================================

const CACHE_NAME = 'xpert-v1';
const ASSETS = [
    '/TermuXpert-WEB/',
    '/TermuXpert-WEB/index.html',
    '/TermuXpert-WEB/subjects.html',
    '/TermuXpert-WEB/subject.html',
    '/TermuXpert-WEB/assets/css/style.css',
    '/TermuXpert-WEB/assets/css/lesson-common.css',
    '/TermuXpert-WEB/assets/css/global-control.css',
    '/TermuXpert-WEB/assets/js/script.js',
    '/TermuXpert-WEB/assets/images/profile.png',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js',
    'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js'
];

// التثبيت - تخزين الملفات في الكاش
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('📦 Service Worker - Caching assets');
                return cache.addAll(ASSETS);
            })
            .then(() => self.skipWaiting())
    );
});

// التنشيط - تنظيف الكاش القديم
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            );
        }).then(() => self.clients.claim())
    );
});

// اعتراض الطلبات - استراتيجية Cache First مع Fallback
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    
    // تجاهل طلبات MathJax و GSAP (نستخدم CDN مع استراتيجية مختلفة)
    if (url.hostname.includes('cdnjs') || url.hostname.includes('jsdelivr')) {
        event.respondWith(
            caches.match(event.request)
                .then(response => response || fetch(event.request))
        );
        return;
    }
    
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // إذا وجد في الكاش، أعده
                if (response) {
                    return response;
                }
                // وإلا، حمله من الشبكة وخزنه
                return fetch(event.request)
                    .then(response => {
                        const responseClone = response.clone();
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseClone);
                            });
                        return response;
                    })
                    .catch(() => {
                        // إذا فشل كل شيء، أعد صفحة الخطأ
                        return new Response('⚠️ Hors ligne - Veuillez vérifier votre connexion', {
                            status: 503,
                            statusText: 'Service Unavailable'
                        });
                    });
            })
    );
});
