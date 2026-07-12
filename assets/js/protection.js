/**
 * ============================================================
 * protection.js - حماية الصور فقط (نسخة محسّنة)
 * التحديث: النصوص والصيغ الرياضية بقات قابلة للتحديد والنسخ
 * الحماية بقات غير على: سحب/حفظ الصور، القائمة المختصرة عليها
 * ============================================================
 */

(function() {
    'use strict';

    // ============================================================
    // 1. حماية الصور فقط (بدون التأثير على النصوص)
    // ============================================================

    const style = document.createElement('style');
    style.textContent = `
        img, svg, canvas, video, iframe {
            -webkit-user-drag: none !important;
            -moz-user-drag: none !important;
            -ms-user-drag: none !important;
            user-drag: none !important;
            -webkit-touch-callout: none !important;
            touch-action: pan-y !important;
        }
        img::selection, svg::selection, canvas::selection {
            background: transparent !important;
            color: transparent !important;
        }
        /* تحسين مظهر التحديد للنصوص بدل منعه */
        ::selection {
            background: rgba(78, 205, 196, 0.3);
        }
    `;
    document.head.appendChild(style);

    // ============================================================
    // 2. منع سحب/حفظ الصور فقط
    // ============================================================

<<<<<<< HEAD
    document.querySelectorAll('img, svg, canvas, video, iframe').forEach(function(el) {
        el.addEventListener('dragstart', function(e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }, { passive: false });
    });

    // ============================================================
    // 3. منع القائمة المختصرة على الصور فقط (باقي الصفحة عادي)
    // ============================================================

    document.querySelectorAll('img').forEach(function(img) {
        img.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            return false;
        }, { passive: false });

        // منع الضغط المطول لحفظ الصورة على الهاتف
        let touchTimer;
        img.addEventListener('touchstart', function(e) {
            touchTimer = setTimeout(function() {
                e.preventDefault();
            }, 300);
        }, { passive: true });
        img.addEventListener('touchend', function() {
            clearTimeout(touchTimer);
        }, { passive: true });
        img.addEventListener('touchmove', function() {
            clearTimeout(touchTimer);
        }, { passive: true });
    });

    console.log('✅ Protection.js - حماية الصور فقط (النصوص قابلة للنسخ)');

})();
n(el) {
        el.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }, { passive: false });
    });

    // ============================================================
    // 4. منع نسخ النصوص
    // ============================================================
    
    document.addEventListener('copy', function(e) {
        e.preventDefault();
        e.clipboardData.setData('text/plain', '');
        return false;
    }, { passive: false });

    document.addEventListener('cut', function(e) {
        e.preventDefault();
        e.clipboardData.setData('text/plain', '');
        return false;
    }, { passive: false });

    document.addEventListener('dragstart', function(e) {
        e.preventDefault();
        return false;
    }, { passive: false });

    document.addEventListener('drop', function(e) {
        e.preventDefault();
        return false;
    }, { passive: false });

    // ============================================================
    // 5. منع سحب الصور
    // ============================================================
    
=======
>>>>>>> 6a53e4c (🗑️ إزالة رسالة التحذير من الصفحة الرئيسية)
    document.querySelectorAll('img, svg, canvas, video, iframe').forEach(function(el) {
        el.addEventListener('dragstart', function(e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }, { passive: false });
    });

    // ============================================================
    // 3. منع القائمة المختصرة على الصور فقط (باقي الصفحة عادي)
    // ============================================================

    document.querySelectorAll('img').forEach(function(img) {
        img.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            return false;
        }, { passive: false });

        // منع الضغط المطول لحفظ الصورة على الهاتف
        let touchTimer;
        img.addEventListener('touchstart', function(e) {
            touchTimer = setTimeout(function() {
                e.preventDefault();
            }, 300);
        }, { passive: true });
        img.addEventListener('touchend', function() {
            clearTimeout(touchTimer);
        }, { passive: true });
        img.addEventListener('touchmove', function() {
            clearTimeout(touchTimer);
        }, { passive: true });
    });

    console.log('✅ Protection.js - حماية الصور فقط (النصوص قابلة للنسخ)');

})();

