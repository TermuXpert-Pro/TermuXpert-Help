// ============================================================
// SIDEBAR - القائمة الجانبية المتطورة
// ============================================================

document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const closeBtn = document.getElementById('sidebarClose');
    const navbar = document.getElementById('navbar');

    if (!menuToggle || !sidebar || !overlay || !closeBtn) return;

    // ====== Scroll effect ======
    let lastScroll = 0;
    window.addEventListener('scroll', function () {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 30) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    }, { passive: true });

    // ====== Fonctions ======
    function openSidebar() {
        sidebar.classList.add('open');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        menuToggle.classList.add('active');
        menuToggle.setAttribute('aria-expanded', 'true');
    }

    function closeSidebar() {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
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

    closeBtn.addEventListener('click', closeSidebar);
    overlay.addEventListener('click', closeSidebar);

    // ====== ESC ======
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeSidebar();
    });

    // ====== Fermeture automatique sur grand écran ======
    let resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            if (window.innerWidth > 1024 && sidebar.classList.contains('open')) {
                closeSidebar();
            }
        }, 300);
    });

    // ====== Empêcher la fermeture en cliquant à l'intérieur ======
    sidebar.addEventListener('click', function (e) {
        e.stopPropagation();
    });

    // ====== Fermeture après navigation (mobile) ======
    document.querySelectorAll('.sidebar-link').forEach(function (link) {
        link.addEventListener('click', function () {
            // Si c'est un lien interne, fermer après un court délai
            if (this.getAttribute('href') && !this.getAttribute('href').startsWith('#')) {
                setTimeout(closeSidebar, 200);
            }
        });
    });

    // ====== Activation du lien actif ======
    const currentPath = window.location.pathname;
    const currentSearch = window.location.search;

    document.querySelectorAll('.sidebar-link').forEach(function (link) {
        const href = link.getAttribute('href');
        if (href) {
            // Vérifier si c'est la page actuelle
            if (href.includes('index.html') && currentPath.endsWith('index.html')) {
                link.classList.add('active');
            } else if (href.includes('subjects.html') && currentPath.includes('subjects.html')) {
                link.classList.add('active');
            } else if (href.includes('subject.html') && currentSearch.includes('subject=')) {
                const subject = new URLSearchParams(currentSearch).get('subject');
                if (href.includes('subject=' + subject)) {
                    link.classList.add('active');
                }
            }
        }
    });

    // ====== Effet de particules (optionnel) ======
    console.log('✅ Sidebar v2.0 initialisée');
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
