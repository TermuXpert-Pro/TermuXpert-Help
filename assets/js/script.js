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

    // إظهار/إخفاء الزر حسب التمرير
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });

    // العودة للأعلى عند النقر
    scrollBtn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();

// ====== شريط تقدم القراءة (محسّن) ======
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
    
    // حركات مستمرة
    gsap.to('.moroccan-bg', { opacity: 0.8, duration: 4, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('.moroccan-star', { rotation: 360, duration: 30, repeat: -1, ease: 'none' });
    gsap.to('.geo-pattern-1', { x: 25, y: 12, duration: 5, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('.geo-pattern-2', { x: -25, y: -12, duration: 5, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1.2 });
}

function showZellijDirect() {
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
}

console.log('✅ Zellij background functions loaded');

// ============================================================
// حماية المحتوى - Content Protection
// ============================================================

(function() {
    'use strict';

    // ====== منع النقر الأيمن ======
    document.addEventListener('contextmenu', function(e) {
        // السماح بالنقر الأيمن فقط في حقول الإدخال
        if (e.target.closest('input, textarea, [contenteditable="true"]')) {
            return true;
        }
        e.preventDefault();
        showProtectionToast('🚫 النسخ غير مسموح - Xpert');
        return false;
    });

    // ====== منع اختصارات النسخ والحفظ ======
    document.addEventListener('keydown', function(e) {
        // السماح في حقول الإدخال
        if (e.target.closest('input, textarea, [contenteditable="true"]')) {
            return true;
        }
        
        const key = e.key;
        const ctrl = e.ctrlKey;
        const shift = e.shiftKey;
        
        // منع Ctrl+C, Ctrl+X, Ctrl+V
        if (ctrl && ['c', 'C', 'x', 'X', 'v', 'V'].includes(key)) {
            e.preventDefault();
            showProtectionToast('🚫 النسخ غير مسموح - Xpert');
            return false;
        }
        
        // منع Ctrl+S (حفظ الصفحة)
        if (ctrl && (key === 's' || key === 'S')) {
            e.preventDefault();
            showProtectionToast('🚫 حفظ الصفحة غير مسموح - Xpert');
            return false;
        }
        
        // منع Ctrl+U (عرض المصدر)
        if (ctrl && (key === 'u' || key === 'U')) {
            e.preventDefault();
            showProtectionToast('🚫 عرض المصدر غير مسموح - Xpert');
            return false;
        }
        
        // منع Ctrl+P (طباعة)
        if (ctrl && (key === 'p' || key === 'P')) {
            e.preventDefault();
            showProtectionToast('🚫 الطباعة غير مسموحة - Xpert');
            return false;
        }
        
        // منع Ctrl+Shift+I, Ctrl+Shift+J
        if (ctrl && shift && ['I', 'i', 'J', 'j'].includes(key)) {
            e.preventDefault();
            showProtectionToast('🚫 أدوات المطور مقيدة - Xpert');
            return false;
        }
        
        // منع F12
        if (key === 'F12') {
            e.preventDefault();
            showProtectionToast('🚫 أدوات المطور مقيدة - Xpert');
            return false;
        }
    });

    // ====== منع سحب الصور ======
    document.querySelectorAll('img').forEach(function(img) {
        img.setAttribute('draggable', 'false');
        img.setAttribute('ondragstart', 'return false');
        img.addEventListener('dragstart', function(e) {
            e.preventDefault();
            return false;
        });
    });

    // ====== رسالة منبثقة للحماية ======
    function showProtectionToast(message) {
        // إزالة أي رسالة سابقة
        const oldToast = document.querySelector('.toast-protection');
        if (oldToast) oldToast.remove();
        
        const toast = document.createElement('div');
        toast.className = 'toast-protection';
        toast.textContent = message;
        Object.assign(toast.style, {
            position: 'fixed',
            bottom: '100px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(255, 107, 107, 0.9)',
            color: '#FFFFFF',
            padding: '12px 24px',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '600',
            zIndex: '10001',
            boxShadow: '0 4px 20px rgba(255, 107, 107, 0.3)',
            backdropFilter: 'blur(10px)',
            fontFamily: "'Inter', 'Cairo', sans-serif",
            opacity: '0',
            transition: 'opacity 0.3s ease, transform 0.3s ease',
            pointerEvents: 'none'
        });
        document.body.appendChild(toast);
        
        // ظهور الرسالة
        setTimeout(function() {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(-50%) translateY(0)';
        }, 50);
        
        // اختفاء الرسالة
        setTimeout(function() {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-50%) translateY(20px)';
            setTimeout(function() {
                toast.remove();
            }, 400);
        }, 2500);
    }

    console.log('✅ Content protection activated');
})();


// ====== رسالة تحذيرية في Console ======
console.log('%c🚫 Xpert - Contenu protégé', 'font-size: 20px; font-weight: bold; color: #FF6B6B;');
console.log('%c⚠️ Toute copie ou reproduction non autorisée est interdite', 'font-size: 14px; color: #F4D03F;');
console.log('%c📚 Xpert © 2026 - 1 Bac Sciences Expérimentales', 'font-size: 12px; color: #4ECDC4;');

