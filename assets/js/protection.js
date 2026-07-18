/**
 * ============================================================
 * protection.js - حماية الصور + منع الزوم
 * التحديث: النصوص والصيغ الرياضية بقات قابلة للتحديد والنسخ
 * الحماية بقات غير على: سحب/حفظ الصور، القائمة المختصرة عليها
 * + منع تكبير/تصغير الشاشة (pinch-zoom, gesture, dblclick, ctrl+wheel)
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

    // ============================================================
    // 4. منع تكبير/تصغير الشاشة (pinch-zoom, gesture, dblclick, ctrl+wheel)
    // ============================================================

    document.addEventListener('touchmove', function(e) {
        if (e.touches.length > 1) e.preventDefault();
    }, { passive: false });

    document.addEventListener('gesturestart', function(e) {
        e.preventDefault();
    }, { passive: false });

    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(e) {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) e.preventDefault();
        lastTouchEnd = now;
    }, { passive: false });

    document.addEventListener('wheel', function(e) {
        if (e.ctrlKey) e.preventDefault();
    }, { passive: false });

    console.log('✅ Protection.js - حماية الصور + منع الزوم (النصوص قابلة للنسخ)');

})();
