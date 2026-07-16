// ============================================================
// script.js - الوظائف العامة للموقع
// ============================================================

(function() {
    var progressBar = document.getElementById('progressBar');
    if (!progressBar) {
        progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progressBar.id = 'progressBar';
        document.body.appendChild(progressBar);
    }

    function updateProgress() {
        var scrollTop = window.scrollY;
        var docHeight = document.documentElement.scrollHeight - window.innerHeight;
        var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = Math.min(progress, 100) + '%';
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress, { passive: true });
    updateProgress();
})();

document.addEventListener('DOMContentLoaded', function() {
    document.body.classList.add('page-transition');
    setTimeout(function() {
        document.body.classList.remove('page-transition');
    }, 1000);
});

console.log('✅ Xpert - Scripts chargés avec succès !');

// ============================================================
// Service Worker registration (centralisé - anciennement dupliqué
// dans chaque page individuellement, 52 fois)
// ============================================================
(function() {
    if (!('serviceWorker' in navigator)) return;

    // On déduit l'URL de sw.js et le scope à partir de l'emplacement
    // réel de script.js, pour que ça marche peu importe la profondeur
    // de la page (racine ou content/xxx/xxx/xxx/xxx.html).
    var scriptEl = document.currentScript || (function() {
        var scripts = document.getElementsByTagName('script');
        return scripts[scripts.length - 1];
    })();

    var src = scriptEl.src || '';
    var base = src.replace(/assets\/js\/script\.js.*$/, '');

    if (!base) {
        console.log('❌ Service Worker: impossible de déterminer le chemin de base');
        return;
    }

    var swUrl = base + 'sw.js';

    window.addEventListener('load', function() {
        navigator.serviceWorker.register(swUrl, { scope: base })
            .then(function(reg) { console.log('✅ Service Worker enregistré'); })
            .catch(function(err) { console.log('❌ Service Worker échoué:', err); });
    });
})();

// ============================================================
// SIDEBAR - تصميم مبتكر
// ============================================================

document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const navbar = document.getElementById('navbar');

    // ملاحظة: تم حذف الاعتماد على closeBtn (id="sidebarClose") لأنه
    // ماكاينش هاد الزر فـ navbar.html الحالي. الإغلاق كيتم عبر
    // الـ overlay، ESC، أو الضغط على menuToggle نفسو (toggle).
    if (!menuToggle || !sidebar || !overlay) return;

    // ====== Scroll effect ======
    window.addEventListener('scroll', function () {
        if (window.scrollY > 30) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });

    // ====== Fonctions ======
    function openSidebar() {
        sidebar.classList.add('open');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        menuToggle.classList.add('active');
        menuToggle.setAttribute('aria-expanded', 'true');
        document.dispatchEvent(new CustomEvent('sidebar:opened'));
    }

    function closeSidebar() {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.dispatchEvent(new CustomEvent('sidebar:closed'));
    }

    // ====== Events ======
    menuToggle.addEventListener('click', function (e) {
        e.stopPropagation();
        if (sidebar.classList.contains('open')) {
            closeSidebar();
        } else {
            openSidebar();
        }
    });

    overlay.addEventListener('click', closeSidebar);

    // ====== ESC ======
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeSidebar();
    });

    // ====== Fermeture sur grand écran ======
    let resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            if (window.innerWidth > 1024 && sidebar.classList.contains('open')) {
                closeSidebar();
            }
        }, 300);
    });

    // ====== Empêcher la fermeture ======
    sidebar.addEventListener('click', function (e) {
        e.stopPropagation();
    });

    // ====== Fermeture après navigation ======
    document.querySelectorAll('.sidebar-link, .subject-card').forEach(function (link) {
        link.addEventListener('click', function () {
            setTimeout(closeSidebar, 200);
        });
    });

    // ====== Activation du lien actif ======
    const currentPath = window.location.pathname;
    const currentSearch = window.location.search;

    // كنشيلو "index.html" وأي "/" فالأخر باش نقارنو المسارات بشكل
    // مستقل عن العمق - هكذا صفحة الجذر ("/" أو "/index.html") غادي
    // تعطي نفس القيمة، وصفحة فرعية بحال "/content/math/serie1/index.html"
    // (اللي هي واحدة من 108 صفحة اسمها index.html بالضبط) ماغاديش تلتبس
    // بالصفحة الرئيسية.
    function normalizePath(p) {
        return p.replace(/index\.html$/, '').replace(/\/+$/, '') || '/';
    }
    const currentNorm = normalizePath(currentPath);

    document.querySelectorAll('.sidebar-link').forEach(function (link) {
        const href = link.getAttribute('href');
        if (!href) return;

        // Accueil (index) - كنقارنو المسار المطلق المحلول من طرف
        // المتصفح لهاد الرابط (link.pathname) مع المسار الحالي، بعد
        // التطبيع - ماشي endsWith('index.html') اللي كان كيطابق
        // بالغلط أي واحدة من 108 صفحة اسمها index.html فالموقع.
        if (href.includes('index.html') && normalizePath(link.pathname) === currentNorm) {
            link.classList.add('active');
        }
        // Matières
        else if (href.includes('subjects.html') && currentPath.includes('subjects.html')) {
            link.classList.add('active');
        }
        // Calendrier (AJOUT)
        else if (href.includes('calendrier.html') && currentPath.includes('calendrier.html')) {
            link.classList.add('active');
        }
        // Matière spécifique (subject.html?subject=...)
        else if (href.includes('subject.html') && currentSearch.includes('subject=')) {
            const subject = new URLSearchParams(currentSearch).get('subject');
            if (href.includes('subject=' + subject)) {
                link.classList.add('active');
            }
        }
        // Pages générales via data-page (about, support, installation,
        // terms, privacy...) - كيقارن اسم الصفحة الحالية مع data-page
        // ديال الرابط، بلا ما نكرر else if خاصة بكل صفحة
        else if (link.dataset.page && currentPath.endsWith('/' + link.dataset.page + '.html')) {
            link.classList.add('active');
        }
    });

    // ====== Activation de la matière ======
    document.querySelectorAll('.subject-card').forEach(function (card) {
        const href = card.getAttribute('href');
        if (href && currentSearch.includes('subject=')) {
            const subject = new URLSearchParams(currentSearch).get('subject');
            if (href.includes('subject=' + subject)) {
                card.style.borderColor = 'rgba(78,205,196,0.3)';
                card.style.background = 'rgba(78,205,196,0.05)';
            }
        }
    });

    console.log('✅ Sidebar v3.0 initialisée');
});
