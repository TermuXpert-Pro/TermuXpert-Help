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

(function() {
    var navbar = document.getElementById('navbar');
    if (!navbar) return;
    
    function updateNavbar() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    
    window.addEventListener('scroll', updateNavbar, { passive: true });
    updateNavbar();
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
// SIDEBAR - القائمة الجانبية
// ============================================================

document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const closeBtn = document.getElementById('sidebarClose');

    // التأكد من وجود العناصر
    if (!menuToggle || !sidebar || !overlay || !closeBtn) return;

    function openSidebar() {
        sidebar.classList.add('open');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeSidebar() {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // فتح القائمة
    menuToggle.addEventListener('click', openSidebar);

    // إغلاق القائمة
    closeBtn.addEventListener('click', closeSidebar);
    overlay.addEventListener('click', closeSidebar);

    // إغلاق عند الضغط على ESC
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeSidebar();
        }
    });

    // إغلاق القائمة عند تغيير حجم النافذة (اختياري)
    let resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            if (window.innerWidth > 768 && sidebar.classList.contains('open')) {
                closeSidebar();
            }
        }, 300);
    });

    // منع إغلاق القائمة عند النقر داخلها
    sidebar.addEventListener('click', function (e) {
        e.stopPropagation();
    });

    // إغلاق القائمة عند النقر على رابط داخلها (للموبايل)
    document.querySelectorAll('.sidebar-menu a').forEach(function (link) {
        link.addEventListener('click', function () {
            // نؤخر الإغلاق قليلاً ليتسنى للمتصفح متابعة الرابط
            setTimeout(closeSidebar, 150);
        });
    });
});


// ============================================================
// SIDEBAR - القائمة الجانبية
// ============================================================

document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const closeBtn = document.getElementById('sidebarClose');

    // التأكد من وجود العناصر
    if (!menuToggle || !sidebar || !overlay || !closeBtn) return;

    function openSidebar() {
        sidebar.classList.add('open');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeSidebar() {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // فتح القائمة
    menuToggle.addEventListener('click', openSidebar);

    // إغلاق القائمة
    closeBtn.addEventListener('click', closeSidebar);
    overlay.addEventListener('click', closeSidebar);

    // إغلاق عند الضغط على ESC
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeSidebar();
        }
    });

    // إغلاق القائمة عند تغيير حجم النافذة
    let resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            if (window.innerWidth > 768 && sidebar.classList.contains('open')) {
                closeSidebar();
            }
        }, 300);
    });

    // منع إغلاق القائمة عند النقر داخلها
    sidebar.addEventListener('click', function (e) {
        e.stopPropagation();
    });

    // إغلاق القائمة عند النقر على رابط داخلها
    document.querySelectorAll('.sidebar-menu a').forEach(function (link) {
        link.addEventListener('click', function () {
            setTimeout(closeSidebar, 150);
        });
    });

    // ====== تفعيل الرابط النشط ======
    // تحديد المادة الحالية من URL
    const currentUrl = new URL(window.location.href);
    const subjectParam = currentUrl.searchParams.get('subject');
    
    if (subjectParam) {
        document.querySelectorAll('.sidebar-menu a').forEach(function (link) {
            if (link.href.includes('subject=' + subjectParam)) {
                link.style.borderLeftColor = 'var(--accent)';
                link.style.color = 'var(--text-primary)';
                link.style.background = 'rgba(78, 205, 196, 0.06)';
            }
        });
    }

    console.log('✅ Sidebar initialisée');
});
