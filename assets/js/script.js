// ============================================================
// script.js - الوظائف العامة للموقع (محسّن)
// ============================================================

// ====== زر العودة للأعلى ======
(function() {
    var scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-top-btn';
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollBtn.setAttribute('aria-label', 'Retour en haut');
    document.body.appendChild(scrollBtn);

    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });

    scrollBtn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();

// ====== شريط تقدم القراءة ======
(function() {
    var progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    progressBar.id = 'progressBar';
    document.body.appendChild(progressBar);

    function updateProgress() {
        var scrollTop = window.scrollY;
        var docHeight = document.documentElement.scrollHeight - window.innerHeight;
        var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = Math.min(progress, 100) + '%';
    }

    window.addEventListener('scroll', updateProgress);
    window.addEventListener('resize', updateProgress);
    updateProgress();
})();

// ====== تأثير القائمة عند التمرير ======
window.addEventListener('scroll', function() {
    var navbar = document.getElementById('navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});

// ====== تأثيرات عند تحميل الصفحة ======
document.addEventListener('DOMContentLoaded', function() {
    document.body.classList.add('page-transition');
    setTimeout(function() {
        document.body.classList.remove('page-transition');
    }, 1000);
});

console.log('✅ Xpert - Scripts chargés avec succès !');

// ============================================================
// خلفية الزليج - مدمجة مع script.js
// ============================================================

function runZellijAnimation() {
    const overlay = document.getElementById('overlayProtection');
    
    if (overlay) {
        overlay.style.display = 'block';
        overlay.style.opacity = '1';
        overlay.style.pointerEvents = 'all';
        overlay.classList.remove('hidden');
        overlay.classList.add('active');
    }
    
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
                overlay.style.opacity = '0';
                overlay.style.pointerEvents = 'none';
                console.log('✅ Overlay protection removed');
            }
        });
    
    gsap.to('.moroccan-bg', { opacity: 0.8, duration: 4, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('.moroccan-star', { rotation: 360, duration: 30, repeat: -1, ease: 'none' });
    gsap.to('.geo-pattern-1', { x: 25, y: 12, duration: 5, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('.geo-pattern-2', { x: -25, y: -12, duration: 5, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1.2 });
}

function showZellijDirect() {
    const overlay = document.getElementById('overlayProtection');
    
    if (overlay) {
        overlay.classList.remove('active');
        overlay.classList.add('hidden');
        overlay.style.display = 'none';
        overlay.style.opacity = '0';
        overlay.style.pointerEvents = 'none';
    }
    
    gsap.set('.moroccan-bg', { opacity: 0.6 });
    gsap.set('.moroccan-shadow', { opacity: 0.08 });
    gsap.set('.moroccan-star', { opacity: 0.04 });
    gsap.set('.geo-pattern', { opacity: 0.03 });
    
    gsap.to('.moroccan-bg', { opacity: 0.8, duration: 4, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('.moroccan-star', { rotation: 360, duration: 30, repeat: -1, ease: 'none' });
    gsap.to('.geo-pattern-1', { x: 25, y: 12, duration: 5, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('.geo-pattern-2', { x: -25, y: -12, duration: 5, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1.2 });
}

console.log('✅ Zellij background functions loaded');

// ============================================================
// 🔒 حماية كاملة - مدمجة في script.js (بدون تكرار)
// ============================================================

(function() {
    'use strict';

    // ====== 1. منع النقر الأيمن ======
    document.addEventListener('contextmenu', function(e) {
        if (e.target.closest('input, textarea, [contenteditable="true"]')) {
            return true;
        }
        e.preventDefault();
        return false;
    });

    // ====== 2. منع اختصارات لوحة المفاتيح ======
    document.addEventListener('keydown', function(e) {
        if (e.target.closest('input, textarea, [contenteditable="true"]')) {
            return true;
        }
        
        const ctrl = e.ctrlKey;
        const key = e.key;
        
        // منع Ctrl+C, Ctrl+X, Ctrl+V
        if (ctrl && ['c', 'C', 'x', 'X', 'v', 'V'].includes(key)) {
            e.preventDefault();
            return false;
        }
        
        // منع Ctrl+S (حفظ)
        if (ctrl && (key === 's' || key === 'S')) {
            e.preventDefault();
            return false;
        }
        
        // منع Ctrl+U (مصدر الصفحة)
        if (ctrl && (key === 'u' || key === 'U')) {
            e.preventDefault();
            return false;
        }
        
        // منع Ctrl+P (طباعة)
        if (ctrl && (key === 'p' || key === 'P')) {
            e.preventDefault();
            return false;
        }
        
        // منع F12 (أدوات المطور)
        if (key === 'F12') {
            e.preventDefault();
            return false;
        }
        
        // منع Ctrl+Shift+I (أدوات المطور)
        if (ctrl && e.shiftKey && ['I', 'i', 'J', 'j'].includes(key)) {
            e.preventDefault();
            return false;
        }
    });

    // ====== 3. منع سحب النصوص ======
    document.addEventListener('dragstart', function(e) {
        if (!e.target.closest('input, textarea, [contenteditable="true"]')) {
            e.preventDefault();
            return false;
        }
    });

    // ====== 4. منع تحديد النصوص ======
    document.addEventListener('selectstart', function(e) {
        if (!e.target.closest('input, textarea, [contenteditable="true"]')) {
            e.preventDefault();
            return false;
        }
    });

    // ====== 5. منع النسخ ======
    document.addEventListener('copy', function(e) {
        if (!e.target.closest('input, textarea, [contenteditable="true"]')) {
            e.preventDefault();
            return false;
        }
    });

    // ====== 6. منع الضغط المطول (Long Press) ======
    document.addEventListener('touchstart', function(e) {
        if (e.target.closest('input, textarea, [contenteditable="true"]')) {
            return true;
        }
        // لا نمنع اللمس بالكامل، فقط نمنع القائمة
        // نستخدم preventDefault فقط للعناصر غير القابلة للتحرير
    }, { passive: false });

    console.log('🔒 Protection complète activée (script.js)');
})();

console.log('%c📚 Xpert © 2026 - 1 Bac Sciences Expérimentales', 'font-size: 14px; color: #4ECDC4;');
