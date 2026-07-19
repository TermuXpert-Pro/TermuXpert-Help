/**
 * ============================================================
 * protection.js - حماية الصور + منع التكبير (زووم) فـ جميع الأجهزة
 * التحديث: النصوص والصيغ الرياضية بقات قابلة للتحديد والنسخ
 * الحماية بقات غير على: سحب/حفظ الصور، القائمة المختصرة عليها
 * + منع الزووم بجميع الطرق (لمس، فأرة، كيبورد) فـ كل الأجهزة
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
        html {
            touch-action: pan-x pan-y !important;
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
    // 4. منع التكبير (زووم) - الهاتف: pinch + double-tap
    // ============================================================

    // منع pinch-zoom بإصبعين (touchmove بأكثر من نقطة لمس واحدة)
    document.addEventListener('touchmove', function(e) {
        if (e.touches.length > 1) {
            e.preventDefault();
        }
    }, { passive: false });

    // منع double-tap zoom
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(e) {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
            e.preventDefault();
        }
        lastTouchEnd = now;
    }, { passive: false });

    // ============================================================
    // 5. منع التكبير (زووم) - الكمبيوتر: Ctrl+Scroll / Ctrl+/-/0 / trackpad pinch
    // ============================================================

    // منع Ctrl + عجلة الفأرة (Windows/Linux/Chrome zoom)
    window.addEventListener('wheel', function(e) {
        if (e.ctrlKey) {
            e.preventDefault();
        }
    }, { passive: false });

    // منع Ctrl+ / Ctrl- / Ctrl0 / Ctrl+= من الكيبورد
    window.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && ['+', '-', '=', '0'].indexOf(e.key) !== -1) {
            e.preventDefault();
        }
    }, { passive: false });

    // منع pinch-zoom بـ trackpad فـ Safari (macOS)
    ['gesturestart', 'gesturechange', 'gestureend'].forEach(function(evt) {
        document.addEventListener(evt, function(e) {
            e.preventDefault();
        }, { passive: false });
    });

    console.log('✅ Protection.js - حماية الصور + منع الزووم فـ جميع الأجهزة');

})();
