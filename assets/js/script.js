// ============================================================
// script.js - الوظائف العامة للموقع (نسخة محسنة)
// ============================================================

// ====== زر العودة للأعلى (نسخة واحدة فقط) ======
(function() {
    // التحقق من وجود الزر مسبقاً
    if (document.querySelector('.scroll-top-btn')) {
        console.log('ℹ️ Scroll button already exists');
        return;
    }
    
    var scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-top-btn';
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollBtn.setAttribute('aria-label', 'Retour en haut');
    scrollBtn.style.display = 'none';
    document.body.appendChild(scrollBtn);

    var isVisible = false;

    window.addEventListener('scroll', function() {
        if (window.scrollY > 300 && !isVisible) {
            scrollBtn.style.display = 'flex';
            scrollBtn.style.opacity = '1';
            scrollBtn.style.transform = 'translateY(0)';
            isVisible = true;
        } else if (window.scrollY <= 300 && isVisible) {
            scrollBtn.style.opacity = '0';
            scrollBtn.style.transform = 'translateY(20px)';
            setTimeout(function() {
                if (!isVisible) {
                    scrollBtn.style.display = 'none';
                }
            }, 300);
            isVisible = false;
        }
    }, { passive: true });

    scrollBtn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();

// ====== شريط تقدم القراءة ======
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

// ====== تأثير القائمة عند التمرير ======
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

// ====== تأثيرات عند تحميل الصفحة ======
document.addEventListener('DOMContentLoaded', function() {
    document.body.classList.add('page-transition');
    setTimeout(function() {
        document.body.classList.remove('page-transition');
    }, 1000);
});

console.log('✅ Xpert - Scripts chargés avec succès !');

// ============================================================
// خلفية الزليج - دوال مشتركة
// ============================================================
window.runZellijAnimation = function() {
    const overlay = document.getElementById('overlayProtection');
    if (overlay) overlay.classList.add('active');
    
    gsap.set('.moroccan-bg', { opacity: 0 });
    gsap.set('.moroccan-shadow', { opacity: 0 });
    gsap.set('.moroccan-star', { opacity: 0 });
    gsap.set('.geo-pattern', { opacity: 0 });
    
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    
    tl
        .to('.moroccan-bg', { opacity: 0.6, duration: 2, ease: 'power1.out' })
        .to('.moroccan-shadow', { opacity: 0.08, duration: 2, ease: 'power1.out' }, '-=1.4')
        .to('.moroccan-star', { opacity: 0.04, duration: 2, ease: 'power1.out' }, '-=1.4')
        .to('.geo-pattern', { opacity: 0.03, duration: 2, stagger: 0.08, ease: 'power1.out' }, '-=1.6')
        .call(() => {
            if (overlay) {
                overlay.classList.remove('active');
                overlay.classList.add('hidden');
                overlay.style.display = 'none';
                overlay.style.pointerEvents = 'none';
            }
        });
    
    gsap.to('.moroccan-bg', { opacity: 0.8, duration: 4, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('.moroccan-star', { rotation: 360, duration: 30, repeat: -1, ease: 'none' });
    gsap.to('.geo-pattern-1', { x: 25, y: 12, duration: 5, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('.geo-pattern-2', { x: -25, y: -12, duration: 5, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1.2 });
};

window.showZellijDirect = function() {
    gsap.set('.moroccan-bg', { opacity: 0.6 });
    gsap.set('.moroccan-shadow', { opacity: 0.08 });
    gsap.set('.moroccan-star', { opacity: 0.04 });
    gsap.set('.geo-pattern', { opacity: 0.03 });
    
    gsap.to('.moroccan-bg', { opacity: 0.8, duration: 4, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('.moroccan-star', { rotation: 360, duration: 30, repeat: -1, ease: 'none' });
    gsap.to('.geo-pattern-1', { x: 25, y: 12, duration: 5, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('.geo-pattern-2', { x: -25, y: -12, duration: 5, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1.2 });
    
    const overlay = document.getElementById('overlayProtection');
    if (overlay) {
        overlay.classList.remove('active');
        overlay.classList.add('hidden');
        overlay.style.display = 'none';
        overlay.style.pointerEvents = 'none';
    }
};

console.log('✅ Zellij background functions loaded');
