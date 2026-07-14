// ============================================================
// SIDEBAR - القائمة الجانبية
// ملف مستقل خاص بالـ Sidebar
// ============================================================

(function() {
    'use strict';

    // انتظار تحميل الصفحة بالكامل
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSidebar);
    } else {
        initSidebar();
    }

    function initSidebar() {
        const menuToggle = document.getElementById('menuToggle');
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        const closeBtn = document.getElementById('sidebarClose');
        const navbar = document.getElementById('navbar');

        // التحقق من وجود العناصر
        if (!menuToggle || !sidebar || !overlay || !closeBtn) {
            console.warn('⚠️ Sidebar: Éléments manquants');
            return;
        }

        // ====== متغيرات الحالة ======
        let isOpen = false;

        // ====== Scroll effect ======
        if (navbar) {
            window.addEventListener('scroll', function() {
                if (window.scrollY > 30) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            }, { passive: true });
        }

        // ====== Fonctions ======
        function openSidebar() {
            sidebar.classList.add('open');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            menuToggle.classList.add('active');
            menuToggle.setAttribute('aria-expanded', 'true');
            isOpen = true;
        }

        function closeSidebar() {
            sidebar.classList.remove('open');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            isOpen = false;
        }

        function toggleSidebar() {
            if (isOpen) {
                closeSidebar();
            } else {
                openSidebar();
            }
        }

        // ====== Events ======
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleSidebar();
        });

        closeBtn.addEventListener('click', closeSidebar);
        overlay.addEventListener('click', closeSidebar);

        // ====== ESC ======
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && isOpen) {
                closeSidebar();
            }
        });

        // ====== Fermeture sur grand écran ======
        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                if (window.innerWidth > 1024 && isOpen) {
                    closeSidebar();
                }
            }, 300);
        });

        // ====== Empêcher la fermeture ======
        sidebar.addEventListener('click', function(e) {
            e.stopPropagation();
        });

        // ====== Fermeture après navigation (mobile) ======
        document.querySelectorAll('.sidebar-link, .subject-card').forEach(function(link) {
            link.addEventListener('click', function() {
                // Fermer après un court délai pour laisser le temps à la navigation
                setTimeout(closeSidebar, 200);
            });
        });

        // ====== Activation du lien actif ======
        const currentPath = window.location.pathname;
        const currentSearch = window.location.search;

        document.querySelectorAll('.sidebar-link').forEach(function(link) {
            const href = link.getAttribute('href');
            if (href) {
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

        // ====== Activation de la matière ======
        document.querySelectorAll('.subject-card').forEach(function(card) {
            const href = card.getAttribute('href');
            if (href && currentSearch.includes('subject=')) {
                const subject = new URLSearchParams(currentSearch).get('subject');
                if (href.includes('subject=' + subject)) {
                    card.style.borderColor = 'rgba(78,205,196,0.3)';
                    card.style.background = 'rgba(78,205,196,0.05)';
                }
            }
        });

        // ====== Nettoyage ======
        console.log('✅ Sidebar v3.0 initialisée');
    }

})();