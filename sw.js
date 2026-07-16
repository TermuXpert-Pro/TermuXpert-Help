// ============================================================
// Service Worker - Xpert PWA
// ============================================================

// ⚠️ رقم النسخة كيتجدد تلقائياً من utils/build.js (hash ديال محتوى
// الملفات الأساسية) - ما خاصكش تبدلها يدوياً، غير شغل: node utils/build.js
const CACHE_NAME = 'xpert-0753255c';

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

    // ====== دروس الكيمياء ======
    './content/chimie/lessons/chimie-organique/index.html',
    './content/chimie/lessons/concentration-solutions/index.html',
    './content/chimie/lessons/concentration-solutions/model1/index.html',
    './content/chimie/lessons/concentration-solutions/model1/part1.html',
    './content/chimie/lessons/concentration-solutions/model1/part2.html',
    './content/chimie/lessons/concentration-solutions/model1/part3.html',
    './content/chimie/lessons/conductimetrie/index.html',
    './content/chimie/lessons/dosages-directs/index.html',
    './content/chimie/lessons/groupes-caracteristiques/index.html',
    './content/chimie/lessons/mesure-chimie/index.html',
    './content/chimie/lessons/mesure-chimie/model1/index.html',
    './content/chimie/lessons/mesure-chimie/model1/part1.html',
    './content/chimie/lessons/mesure-chimie/model1/part2.html',
    './content/chimie/lessons/mesure-chimie/model1/part3.html',
    './content/chimie/lessons/modification-squelette/index.html',
    './content/chimie/lessons/molecules-organiques/index.html',
    './content/chimie/lessons/quantite-matiere/index.html',
    './content/chimie/lessons/quantite-matiere/model1/index.html',
    './content/chimie/lessons/quantite-matiere/model1/part1.html',
    './content/chimie/lessons/quantite-matiere/model1/part2.html',
    './content/chimie/lessons/quantite-matiere/model1/part3.html',
    './content/chimie/lessons/quantite-matiere/model1/part4.html',
    './content/chimie/lessons/reactions-acido-basiques/index.html',
    './content/chimie/lessons/reactions-oxydoreduction/index.html',
    './content/chimie/lessons/suivi-transformation/index.html',

    // ====== دروس الرياضيات ======
    './content/math/lessons/barycentre/index.html',
    './content/math/lessons/barycentre/model1/index.html',
    './content/math/lessons/barycentre/model1/part1.html',
    './content/math/lessons/barycentre/model1/part2.html',
    './content/math/lessons/barycentre/model1/part3.html',
    './content/math/lessons/barycentre/model1/part4.html',
    './content/math/lessons/calcul-trigonometrique/index.html',
    './content/math/lessons/derivation/index.html',
    './content/math/lessons/etude-fonctions/index.html',
    './content/math/lessons/fonctions/index.html',
    './content/math/lessons/fonctions/model1/index.html',
    './content/math/lessons/fonctions/model1/part1.html',
    './content/math/lessons/fonctions/model1/part2.html',
    './content/math/lessons/fonctions/model1/part3.html',
    './content/math/lessons/fonctions/model1/part4.html',
    './content/math/lessons/fonctions/model1/part5.html',
    './content/math/lessons/fonctions/model1/part6.html',
    './content/math/lessons/geometrie-espace/index.html',
    './content/math/lessons/limites-fonctions/index.html',
    './content/math/lessons/logique/index.html',
    './content/math/lessons/logique/model1/index.html',
    './content/math/lessons/logique/model1/part1.html',
    './content/math/lessons/logique/model1/part2.html',
    './content/math/lessons/logique/model1/part3.html',
    './content/math/lessons/logique/model1/part4.html',
    './content/math/lessons/logique/model1/part5.html',
    './content/math/lessons/produit-scalaire/index.html',
    './content/math/lessons/rotation-plan/index.html',
    './content/math/lessons/suites-numeriques/index.html',

    // ====== سلاسل الرياضيات ======
    './content/math/series/barycentre/index.html',
    './content/math/series/barycentre/model1/index.html',
    './content/math/series/barycentre/model1/serie1.html',
    './content/math/series/barycentre/model1/serie2.html',
    './content/math/series/barycentre/model1/serie3.html',
    './content/math/series/barycentre/model1/serie4.html',
    './content/math/series/barycentre/model1/serie5.html',
    './content/math/series/barycentre/model1/serie6.html',
    './content/math/series/fonctions/index.html',
    './content/math/series/fonctions/model1/index.html',
    './content/math/series/fonctions/model1/serie1.html',
    './content/math/series/fonctions/model1/serie2.html',
    './content/math/series/fonctions/model1/serie3.html',
    './content/math/series/fonctions/model1/serie4.html',
    './content/math/series/fonctions/model1/serie5.html',
    './content/math/series/fonctions/model1/serie6.html',
    './content/math/series/fonctions/model1/serie7.html',
    './content/math/series/logique/index.html',
    './content/math/series/logique/model1/index.html',
    './content/math/series/logique/model1/serie1.html',
    './content/math/series/logique/model1/serie2.html',
    './content/math/series/logique/model1/serie3.html',
    './content/math/series/logique/model1/serie4.html',
    './content/math/series/logique/model1/serie5.html',

    // ====== تمارين الرياضيات ======
    './content/math/exercises/barycentre/index.html',
    './content/math/exercises/barycentre/model1/exercice1.html',
    './content/math/exercises/barycentre/model1/exercice2.html',
    './content/math/exercises/barycentre/model1/exercice3.html',
    './content/math/exercises/barycentre/model1/exercice4.html',
    './content/math/exercises/barycentre/model1/exercice5.html',
    './content/math/exercises/barycentre/model1/exercice6.html',
    './content/math/exercises/barycentre/model1/exercice7.html',
    './content/math/exercises/barycentre/model1/exercice8.html',
    './content/math/exercises/barycentre/model1/index.html',
    './content/math/exercises/fonctions/index.html',
    './content/math/exercises/fonctions/model1/exercice1.html',
    './content/math/exercises/fonctions/model1/exercice10.html',
    './content/math/exercises/fonctions/model1/exercice2.html',
    './content/math/exercises/fonctions/model1/exercice3.html',
    './content/math/exercises/fonctions/model1/exercice4.html',
    './content/math/exercises/fonctions/model1/exercice5.html',
    './content/math/exercises/fonctions/model1/exercice6.html',
    './content/math/exercises/fonctions/model1/exercice7.html',
    './content/math/exercises/fonctions/model1/exercice8.html',
    './content/math/exercises/fonctions/model1/exercice9.html',
    './content/math/exercises/fonctions/model1/index.html',
    './content/math/exercises/logique/index.html',
    './content/math/exercises/logique/model1/exercice1.html',
    './content/math/exercises/logique/model1/exercice2.html',
    './content/math/exercises/logique/model1/exercice3.html',
    './content/math/exercises/logique/model1/exercice4.html',
    './content/math/exercises/logique/model1/exercice5.html',
    './content/math/exercises/logique/model1/exercice6.html',
    './content/math/exercises/logique/model1/exercice7.html',
    './content/math/exercises/logique/model1/exercice8.html',
    './content/math/exercises/logique/model1/index.html',

    // ====== دروس الفيزياء ======
    './content/physique/lessons/champ-magnetique-courant/index.html',
    './content/physique/lessons/champ-magnetique/index.html',
    './content/physique/lessons/circuit-electrique/index.html',
    './content/physique/lessons/energie-potentielle-mecanique/index.html',
    './content/physique/lessons/forces-laplace/index.html',
    './content/physique/lessons/instruments-optiques/index.html',
    './content/physique/lessons/lentille-convergente/index.html',
    './content/physique/lessons/miroir-plan/index.html',
    './content/physique/lessons/rotation-solide/index.html',
    './content/physique/lessons/rotation-solide/model1/index.html',
    './content/physique/lessons/rotation-solide/model1/part1.html',
    './content/physique/lessons/rotation-solide/model1/part2.html',
    './content/physique/lessons/rotation-solide/model1/part3.html',
    './content/physique/lessons/rotation-solide/model1/part4.html',
    './content/physique/lessons/rotation-solide/model1/part5.html',
    './content/physique/lessons/rotation-solide/model1/part6.html',
    './content/physique/lessons/travail-energie-cinetique/index.html',
    './content/physique/lessons/travail-energie-cinetique/model1/index.html',
    './content/physique/lessons/travail-energie-cinetique/model1/part1.html',
    './content/physique/lessons/travail-energie-cinetique/model1/part2.html',
    './content/physique/lessons/travail-energie-cinetique/model1/part3.html',
    './content/physique/lessons/travail-energie-cinetique/model1/part4.html',
    './content/physique/lessons/travail-energie-cinetique/model1/part5.html',
    './content/physique/lessons/travail-energie-cinetique/model1/part6.html',
    './content/physique/lessons/travail-energie-interne/index.html',
    './content/physique/lessons/travail-puissance/index.html',
    './content/physique/lessons/travail-puissance/model1/index.html',
    './content/physique/lessons/travail-puissance/model1/part1.html',
    './content/physique/lessons/travail-puissance/model1/part2.html',
    './content/physique/lessons/travail-puissance/model1/part3.html',
    './content/physique/lessons/travail-puissance/model1/part4.html',
    './content/physique/lessons/travail-puissance/model1/part5.html',
    './content/physique/lessons/visibilite-objet/index.html',

    // ====== سلاسل الفيزياء ======
    './content/physique/series/rotation-solide/index.html',
    './content/physique/series/rotation-solide/model1/index.html',
    './content/physique/series/rotation-solide/model1/serie1.html',
    './content/physique/series/travail-energie-cinetique/index.html',
    './content/physique/series/travail-energie-cinetique/model1/index.html',
    './content/physique/series/travail-energie-cinetique/model1/serie1.html',
    './content/physique/series/travail-puissance/index.html',
    './content/physique/series/travail-puissance/model1/index.html',
    './content/physique/series/travail-puissance/model1/serie1.html',

    // ====== تمارين الفيزياء ======
    './content/physique/exercises/rotation-solide/index.html',
    './content/physique/exercises/rotation-solide/model1/exercice1.html',
    './content/physique/exercises/rotation-solide/model1/exercice2.html',
    './content/physique/exercises/rotation-solide/model1/exercice3.html',
    './content/physique/exercises/rotation-solide/model1/exercice4.html',
    './content/physique/exercises/rotation-solide/model1/exercice5.html',
    './content/physique/exercises/rotation-solide/model1/exercice6.html',
    './content/physique/exercises/rotation-solide/model1/index.html',
    './content/physique/exercises/travail-energie-cinetique/index.html',
    './content/physique/exercises/travail-energie-cinetique/model1/exercice1.html',
    './content/physique/exercises/travail-energie-cinetique/model1/exercice2.html',
    './content/physique/exercises/travail-energie-cinetique/model1/exercice3.html',
    './content/physique/exercises/travail-energie-cinetique/model1/exercice4.html',
    './content/physique/exercises/travail-energie-cinetique/model1/exercice5.html',
    './content/physique/exercises/travail-energie-cinetique/model1/exercice6.html',
    './content/physique/exercises/travail-energie-cinetique/model1/exercice7.html',
    './content/physique/exercises/travail-energie-cinetique/model1/exercice8.html',
    './content/physique/exercises/travail-energie-cinetique/model1/exercice9.html',
    './content/physique/exercises/travail-energie-cinetique/model1/index.html',
    './content/physique/exercises/travail-puissance/index.html',
    './content/physique/exercises/travail-puissance/model1/exercice1.html',
    './content/physique/exercises/travail-puissance/model1/exercice2.html',
    './content/physique/exercises/travail-puissance/model1/exercice3.html',
    './content/physique/exercises/travail-puissance/model1/exercice4.html',
    './content/physique/exercises/travail-puissance/model1/exercice5.html',
    './content/physique/exercises/travail-puissance/model1/exercice6.html',
    './content/physique/exercises/travail-puissance/model1/exercice7.html',
    './content/physique/exercises/travail-puissance/model1/exercice8.html',
    './content/physique/exercises/travail-puissance/model1/index.html',
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

