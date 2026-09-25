// ============================================================
// script.js - الوظائف العامة للموقع
// ============================================================

// ============================================================
// THEME TOGGLE (Dark / Light)
// ملاحظة: التفعيل المبكر (بلا وميض) خاصو يتدار عبر inline script صغير
// فـ <head> ديال كل صفحة (شوف THEME_INIT_SNIPPET فالتعليمات) - هوما اللي
// كيحطو data-theme على <html> قبل ما يتحمل الـ CSS. الجزء لي تحت غير
// كيدير sync ديال الزر + احفظ الاختيار.
// ============================================================
(function() {
    var STORAGE_KEY = 'xpert-theme';

    function getStoredTheme() {
        try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
    }
    function setStoredTheme(value) {
        try { localStorage.setItem(STORAGE_KEY, value); } catch (e) {}
    }
    function applyTheme(theme) {
        if (theme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
        var btn = document.getElementById('themeToggle');
        if (btn) btn.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
        var meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute('content', theme === 'light' ? '#2F8F89' : '#45A29E');
    }

    // الصفحة توصل هنا ب data-theme محطوطة من قبل (من الـ inline script فالـ head)،
    // غير كنأكدو التزامن مع الزر ومع meta theme-color.
    var current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    applyTheme(current);

    document.addEventListener('DOMContentLoaded', function() {
        var btn = document.getElementById('themeToggle');
        if (!btn) return;
        applyTheme(document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark');
        btn.addEventListener('click', function() {
            var next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
            applyTheme(next);
            setStoredTheme(next);
        });
    });
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
// PWA INSTALL BUTTON (مركزي - كيخدم فكل الصفحات، بلا تكرار)
// window.XpertPWAInstall() معروضة عالمياً باش أي زر آخر (بحال
// الزر الكبير فـ installation.html) يقدر يستدعيها.
// ============================================================
(function () {
    var installBtn = document.getElementById('pwaInstallBtn');
    var deferredPrompt = null;
    var isIOS = /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase());
    var isStandalone = window.matchMedia('(display-mode: standalone)').matches
        || navigator.standalone === true;

    function showBtn() { if (installBtn) installBtn.classList.add('show'); }
    function hideBtn() { if (installBtn) installBtn.classList.remove('show'); }

    if (!isStandalone) {
        window.addEventListener('beforeinstallprompt', function (e) {
            e.preventDefault();
            deferredPrompt = e;
            showBtn();
        });

        window.addEventListener('appinstalled', function () {
            hideBtn();
            deferredPrompt = null;
        });

        // iOS Safari : ماكاينش beforeinstallprompt → نعرضو الزر ديما
        if (isIOS) showBtn();
    }

    async function triggerInstall() {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            var choice = await deferredPrompt.userChoice;
            console.log('PWA install: ' + choice.outcome);
            deferredPrompt = null;
            hideBtn();
            return choice.outcome;
        } else if (isIOS) {
            alert('لتثبيت التطبيق على iPhone/iPad:\n1. اضغط على أيقونة المشاركة (Share) بالأسفل\n2. اختر "إضافة إلى الشاشة الرئيسية"');
            return 'ios-instructions';
        } else if (isStandalone) {
            alert('التطبيق مثبّت ديجا! ✅');
            return 'already-installed';
        } else {
            alert('التثبيت غير متاح حالياً فهاد المتصفح. جرّب من قائمة المتصفح (⋮) واختر "تثبيت التطبيق".');
            return 'unavailable';
        }
    }

    window.XpertPWAInstall = triggerInstall;
    if (installBtn) installBtn.addEventListener('click', triggerInstall);
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
    // ملاحظة: الرموز الرياضية المتحركة (.sidebar-math-bg) كانت كتبدا
    // فنفس اللحظة ديال فتح السايدبار، وكانت كتتنافس مع أنيميشن الانزلاق
    // (backdrop-filter + blur + box-shadow) على نفس الـframes، وهذا كان
    // كيدي إحساس بالثقل خصوصا فالقسم السفلي. دابا كنستناو transitionend
    // ديال الانزلاق قبل ما نشغلو الديكور عبر كلاس decor-ready.
    function openSidebar() {
        sidebar.classList.add('open');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        menuToggle.classList.add('active');
        menuToggle.setAttribute('aria-expanded', 'true');
        document.dispatchEvent(new CustomEvent('sidebar:opened'));

        var decorStarted = false;
        function startDecor() {
            if (decorStarted) return;
            decorStarted = true;
            sidebar.classList.add('decor-ready');
        }
        sidebar.addEventListener('transitionend', function onEnd(e) {
            if (e.target !== sidebar || e.propertyName !== 'transform') return;
            sidebar.removeEventListener('transitionend', onEnd);
            startDecor();
        });
        // fallback (WebViews قديمة اللي ممكن ما تطلقش transitionend بشكل موثوق)
        setTimeout(startDecor, 400);
    }

    function closeSidebar() {
        sidebar.classList.remove('open');
        sidebar.classList.remove('decor-ready');
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

    // كنطبّعو المسار: كنشيلو "index.html"، وأي ".html" فالأخر، وأي "/"
    // زايدة فالأخر - باش المقارنة تخدم سواء كان الرابط فيه ".html"
    // (محلياً) أو بلاها (production فـ Cloudflare Pages كيحيدها
    // أوتوماتيكياً بريدايركت 308: /subjects.html -> /subjects).
    function normalizePath(p) {
        return p
            .replace(/\/index\.html$/, '/')
            .replace(/\.html$/, '')
            .replace(/\/+$/, '') || '/';
    }
    const currentNorm = normalizePath(currentPath);

    document.querySelectorAll('.sidebar-link').forEach(function (link) {
        const href = link.getAttribute('href');
        if (!href) return;

        const linkNorm = normalizePath(link.pathname);

        // Accueil (index) - كنقارنو المسار المطبّع ديال الرابط مع
        // المسار الحالي المطبّع، باش يخدم بـ.html أو بلاها.
        if (href.includes('index.html') && linkNorm === currentNorm) {
            link.classList.add('active');
        }
        // Matières
        else if (href.includes('subjects.html') && linkNorm === currentNorm) {
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
        // terms, privacy...) - كيقارن آخر جزء من المسار المطبّع مع
        // data-page ديال الرابط، بلا الاعتماد على ".html".
        else if (link.dataset.page) {
            const lastSegment = currentNorm.split('/').pop();
            if (lastSegment === link.dataset.page) {
                link.classList.add('active');
            }
        }
    });

    // ====== Activation de la matière ======
    // كنجيبو المادة الحالية إما من ?subject=... (فـsubject.html) أو من
    // المسار نفسو /content/<matiere>/... (دروس/سلاسل/تمارين) - قبل هاد
    // الإصلاح، البطاقة الملونة كانت كتبان غير فـsubject.html وكتختفي
    // بمجرد ما تدخل لدرس، لأن صفحات الدروس ماعندهاش ?subject= فالـURL.
    let currentSubject = null;
    if (currentSearch.includes('subject=')) {
        currentSubject = new URLSearchParams(currentSearch).get('subject');
    } else {
        const subjectMatch = currentPath.match(/\/content\/(math|physique|chimie)\//);
        if (subjectMatch) currentSubject = subjectMatch[1];
    }

    document.querySelectorAll('.subject-card').forEach(function (card) {
        const href = card.getAttribute('href');
        if (href && currentSubject && href.includes('subject=' + currentSubject)) {
            card.style.borderColor = 'rgba(78,205,196,0.3)';
            card.style.background = 'rgba(78,205,196,0.05)';
        }
    });

    console.log('✅ Sidebar v3.0 initialisée');
});

// ============================================================
// XpertAnimateLegalPage() - أنيميشن دخول مشتركة لصفحات المعلومات
// القانونية/الثابتة (terms.html / installation.html / support.html /
// about.html). القيم الابتدائية (opacity:0) معرّفة فـ legal.css،
// وهاد الدالة هي اللي كتكشفها. سريعة عمدا (~0.7s إجمالي) باش ماتأثرش
// على LCP.
// ============================================================
function XpertAnimateLegalPage(pageName) {
    if (typeof gsap === 'undefined') {
        document.querySelectorAll('#legalWrap, .legal-hero, .legal-section').forEach(function (el) {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
        console.warn('⚠️ GSAP غير محمل - عرض مباشر لـ ' + pageName);
        return;
    }

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.to('#legalWrap', { opacity: 1, y: 0, duration: 0.4 })
      .to('.legal-hero', { opacity: 1, y: 0, duration: 0.35 }, '-=0.2')
      .to('.legal-section', { opacity: 1, y: 0, duration: 0.3, stagger: 0.08 }, '-=0.15')
      .call(function () {
          console.log('✅ ' + pageName + ' - Animation jouée');
      });
}
window.XpertAnimateLegalPage = XpertAnimateLegalPage;

// ====== XPERT LOADER START (add-xpert-loader.js) ======
(function () {
    'use strict';

    var loader = document.getElementById('xpertLoader');
    if (!loader) return; // الصفحة ماعندهاش لودر

    // مدة دنيا (بالميلي ثانية): اللودر خاصو يبان دائما بيها حتى لو
    // الصفحة تحملت بزربة زيادة - باش ما يكونش تشوه بصري (ظهور
    // واختفاء فبرقة العين).
    // ⚠️ TEST: مزيدة لـ 10 ثواني دابا باش تقدر تشوف الشكل والحركة
    // مزيان. رجعها لـ 500 (نصف ثانية) ملي تسالي من التجربة.
    var MIN_DISPLAY = 200;
    var start = performance.now();
    var hidden = false;

    function reallyHide() {
        loader.classList.add('xpert-loader-hide');
        document.body.classList.add('xpert-loaded');
    }

    function hideLoader() {
        if (hidden) return;
        hidden = true;
        var elapsed = performance.now() - start;
        var wait = Math.max(0, MIN_DISPLAY - elapsed);
        setTimeout(reallyHide, wait);
    }

    // كنعتمدو على DOMContentLoaded (الـ DOM جاهز) بلا ما نتسناو
    // 'load' اللي كيتسنى الصور والموارد كاملين.
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', hideLoader);
    } else {
        hideLoader();
    }

    // حماية: إيلا لسبب ما DOMContentLoaded ماجاش، نخبيو بالقوة
    setTimeout(hideLoader, 1500);
})();
// ====== XPERT LOADER END ======

