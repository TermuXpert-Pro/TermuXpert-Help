// ============================================================
// Service Worker - Xpert PWA
// ============================================================

// ⚠️ رقم النسخة كيتجدد تلقائياً من utils/build.js (hash ديال محتوى
// الملفات الأساسية) - ما خاصكش تبدلها يدوياً، غير شغل: node utils/build.js
const CACHE_NAME = 'xpert-2328f228';

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
    './assets/images/profile.png',

    // ====== دروس الفيزياء ======
    './content/physique/lessons/rotation-solide/index.html',
    './content/physique/lessons/rotation-solide/part1.html',
    './content/physique/lessons/rotation-solide/part2.html',
    './content/physique/lessons/rotation-solide/part3.html',
    './content/physique/lessons/rotation-solide/part4.html',
    './content/physique/lessons/rotation-solide/part5.html',
    './content/physique/lessons/rotation-solide/part6.html',
    './content/physique/lessons/travail-energie-cinetique/index.html',
    './content/physique/lessons/travail-energie-cinetique/part1.html',
    './content/physique/lessons/travail-energie-cinetique/part2.html',
    './content/physique/lessons/travail-energie-cinetique/part3.html',
    './content/physique/lessons/travail-energie-cinetique/part4.html',
    './content/physique/lessons/travail-energie-cinetique/part5.html',
    './content/physique/lessons/travail-energie-cinetique/part6.html',
    './content/physique/lessons/travail-puissance/index.html',
    './content/physique/lessons/travail-puissance/part1.html',
    './content/physique/lessons/travail-puissance/part2.html',
    './content/physique/lessons/travail-puissance/part3.html',
    './content/physique/lessons/travail-puissance/part4.html',
    './content/physique/lessons/travail-puissance/part5.html',

    // ====== سلاسل الفيزياء ======
    './content/physique/series/rotation-solide/index.html',
    './content/physique/series/rotation-solide/serie1.html',
    './content/physique/series/travail-energie-cinetique/index.html',
    './content/physique/series/travail-energie-cinetique/serie1.html',
    './content/physique/series/travail-puissance/index.html',
    './content/physique/series/travail-puissance/serie1.html',

    // ====== تمارين الفيزياء ======
    './content/physique/exercises/rotation-solide/index.html',
    './content/physique/exercises/rotation-solide/exercice1.html',
    './content/physique/exercises/rotation-solide/exercice2.html',
    './content/physique/exercises/rotation-solide/exercice3.html',
    './content/physique/exercises/rotation-solide/exercice4.html',
    './content/physique/exercises/rotation-solide/exercice5.html',
    './content/physique/exercises/rotation-solide/exercice6.html',
    './content/physique/exercises/travail-energie-cinetique/index.html',
    './content/physique/exercises/travail-energie-cinetique/exercice1.html',
    './content/physique/exercises/travail-energie-cinetique/exercice2.html',
    './content/physique/exercises/travail-energie-cinetique/exercice3.html',
    './content/physique/exercises/travail-energie-cinetique/exercice4.html',
    './content/physique/exercises/travail-energie-cinetique/exercice5.html',
    './content/physique/exercises/travail-energie-cinetique/exercice6.html',
    './content/physique/exercises/travail-energie-cinetique/exercice7.html',
    './content/physique/exercises/travail-energie-cinetique/exercice8.html',
    './content/physique/exercises/travail-energie-cinetique/exercice9.html',
    './content/physique/exercises/travail-puissance/index.html',
    './content/physique/exercises/travail-puissance/exercice1.html',
    './content/physique/exercises/travail-puissance/exercice2.html',
    './content/physique/exercises/travail-puissance/exercice3.html',
    './content/physique/exercises/travail-puissance/exercice4.html',
    './content/physique/exercises/travail-puissance/exercice5.html',
    './content/physique/exercises/travail-puissance/exercice6.html',
    './content/physique/exercises/travail-puissance/exercice7.html',
    './content/physique/exercises/travail-puissance/exercice8.html',

    // ====== دروس الكيمياء ======
    './content/chimie/lessons/concentration-solutions/index.html',
    './content/chimie/lessons/concentration-solutions/part1.html',
    './content/chimie/lessons/concentration-solutions/part2.html',
    './content/chimie/lessons/concentration-solutions/part3.html',
    './content/chimie/lessons/mesure-chimie/index.html',
    './content/chimie/lessons/mesure-chimie/part1.html',
    './content/chimie/lessons/mesure-chimie/part2.html',
    './content/chimie/lessons/mesure-chimie/part3.html',
    './content/chimie/lessons/quantite-matiere/index.html',
    './content/chimie/lessons/quantite-matiere/part1.html',
    './content/chimie/lessons/quantite-matiere/part2.html',
    './content/chimie/lessons/quantite-matiere/part3.html',
    './content/chimie/lessons/quantite-matiere/part4.html',

    // ====== دروس الرياضيات ======
    './content/math/lessons/barycentre/index.html',
    './content/math/lessons/barycentre/part1.html',
    './content/math/lessons/barycentre/part2.html',
    './content/math/lessons/barycentre/part3.html',
    './content/math/lessons/barycentre/part4.html',
    './content/math/lessons/fonctions/index.html',
    './content/math/lessons/fonctions/part1.html',
    './content/math/lessons/fonctions/part2.html',
    './content/math/lessons/fonctions/part3.html',
    './content/math/lessons/fonctions/part4.html',
    './content/math/lessons/fonctions/part5.html',
    './content/math/lessons/fonctions/part6.html',
    './content/math/lessons/logique/index.html',
    './content/math/lessons/logique/part1.html',
    './content/math/lessons/logique/part2.html',
    './content/math/lessons/logique/part3.html',
    './content/math/lessons/logique/part4.html',
    './content/math/lessons/logique/part5.html',

    // ====== سلاسل الرياضيات ======
    './content/math/series/barycentre/index.html',
    './content/math/series/barycentre/serie1.html',
    './content/math/series/barycentre/serie2.html',
    './content/math/series/barycentre/serie3.html',
    './content/math/series/barycentre/serie4.html',
    './content/math/series/barycentre/serie5.html',
    './content/math/series/barycentre/serie6.html',
    './content/math/series/fonctions/index.html',
    './content/math/series/fonctions/serie1.html',
    './content/math/series/fonctions/serie2.html',
    './content/math/series/fonctions/serie3.html',
    './content/math/series/fonctions/serie4.html',
    './content/math/series/fonctions/serie5.html',
    './content/math/series/fonctions/serie6.html',
    './content/math/series/fonctions/serie7.html',
    './content/math/series/logique/index.html',
    './content/math/series/logique/serie1.html',
    './content/math/series/logique/serie2.html',
    './content/math/series/logique/serie3.html',
    './content/math/series/logique/serie4.html',
    './content/math/series/logique/serie5.html',

    // ====== تمارين الرياضيات ======
    './content/math/exercises/barycentre/index.html',
    './content/math/exercises/barycentre/exercice1.html',
    './content/math/exercises/barycentre/exercice2.html',
    './content/math/exercises/barycentre/exercice3.html',
    './content/math/exercises/barycentre/exercice4.html',
    './content/math/exercises/barycentre/exercice5.html',
    './content/math/exercises/barycentre/exercice6.html',
    './content/math/exercises/barycentre/exercice7.html',
    './content/math/exercises/barycentre/exercice8.html',
    './content/math/exercises/fonctions/index.html',
    './content/math/exercises/fonctions/exercice1.html',
    './content/math/exercises/fonctions/exercice2.html',
    './content/math/exercises/fonctions/exercice3.html',
    './content/math/exercises/fonctions/exercice4.html',
    './content/math/exercises/fonctions/exercice5.html',
    './content/math/exercises/fonctions/exercice6.html',
    './content/math/exercises/fonctions/exercice7.html',
    './content/math/exercises/fonctions/exercice8.html',
    './content/math/exercises/fonctions/exercice9.html',
    './content/math/exercises/fonctions/exercice10.html',
    './content/math/exercises/logique/index.html',
    './content/math/exercises/logique/exercice1.html',
    './content/math/exercises/logique/exercice2.html',
    './content/math/exercises/logique/exercice3.html',
    './content/math/exercises/logique/exercice4.html',
    './content/math/exercises/logique/exercice5.html',
    './content/math/exercises/logique/exercice6.html',
    './content/math/exercises/logique/exercice7.html',
    './content/math/exercises/logique/exercice8.html'
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
                console.log('✅ Service Worker - التخزين المؤقت');
                return cache.addAll(urlsToCache);
            })
    );
});

// اعتراض الطلبات
self.addEventListener('fetch', function(event) {
    const isHTML = event.request.mode === 'navigate' ||
                   (event.request.headers.get('accept') || '').includes('text/html');

    if (isHTML) {
        // Network-First + تخزين تلقائي لكل صفحة تتزار (بما فيها صفحات الدروس)
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
        // ملفات CSS/JS/صور: كاش أولاً
        event.respondWith(
            caches.match(event.request)
                .then(function(response) {
                    return response || fetch(event.request);
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
