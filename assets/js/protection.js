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
    
    document.querySelectorAll('img, svg, canvas, video, iframe').forEach(function(el) {
        el.addEventListener('dragstart', function(e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }, { passive: false });
        el.addEventListener('drag', function(e) {
            e.preventDefault();
            return false;
        }, { passive: false });
        el.addEventListener('dragend', function(e) {
            e.preventDefault();
            return false;
        }, { passive: false });
    });

    // ============================================================
    // 6. منع الضغط المطول (Long Press)
    // ============================================================
    
    document.querySelectorAll('a, img, button, .card, .command-card').forEach(function(el) {
        el.addEventListener('touchstart', function(e) {
            this._touchTimer = setTimeout(function() {
                e.preventDefault();
                return false;
            }, 300);
        }, { passive: true });
        el.addEventListener('touchend', function(e) {
            if (this._touchTimer) {
                clearTimeout(this._touchTimer);
                this._touchTimer = null;
            }
        }, { passive: true });
        el.addEventListener('touchmove', function(e) {
            if (this._touchTimer) {
                clearTimeout(this._touchTimer);
                this._touchTimer = null;
            }
        }, { passive: true });
        el.addEventListener('touchcancel', function(e) {
            if (this._touchTimer) {
                clearTimeout(this._touchTimer);
                this._touchTimer = null;
            }
        }, { passive: true });
    });

    document.querySelectorAll('img').forEach(function(img) {
        img.addEventListener('touchstart', function(e) {
            e.preventDefault();
            return false;
        }, { passive: false });
        img.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            return false;
        }, { passive: false });
    });

    // ============================================================
    // 7. منع اختصارات لوحة المفاتيح
    // ============================================================
    
    document.addEventListener('keydown', function(e) {
        const ctrl = e.ctrlKey || e.metaKey;
        const key = e.key.toLowerCase();
        const forbidden = ['c', 'u', 's', 'p', 'v', 'x', 'a'];
        if (ctrl && forbidden.includes(key)) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
        if (e.key === 'F12') {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
        if (ctrl && e.shiftKey && (key === 'i' || key === 'j' || key === 'c')) {
            e.preventDefault();
            return false;
        }
        if (key === 'printscreen') {
            e.preventDefault();
            return false;
        }
    }, { passive: false });

    // ============================================================
    // 8. منع النسخ من القوائم
    // ============================================================
    
    document.addEventListener('copy', function(e) {
        e.preventDefault();
        return false;
    }, { capture: true, passive: false });

    // ============================================================
    // 9. منع حفظ الصور عبر السحب
    // ============================================================
    
    document.addEventListener('dragleave', function(e) {
        e.preventDefault();
        return false;
    }, { passive: false });

    document.addEventListener('dragover', function(e) {
        e.preventDefault();
        return false;
    }, { passive: false });

    // ============================================================
    // 10. منع فتح الصورة في تبويب جديد
    // ============================================================
    
    document.querySelectorAll('img').forEach(function(img) {
        img.addEventListener('click', function(e) {
            e.preventDefault();
            return false;
        }, { passive: false });
        img.addEventListener('mousedown', function(e) {
            if (e.button === 1 || e.button === 2) {
                e.preventDefault();
                return false;
            }
        }, { passive: false });
    });

    // ============================================================
    // 11. منع view-source:
    // ============================================================
    
    if (window.location.protocol === 'view-source:') {
        window.location.href = window.location.href.replace('view-source:', '');
    }

    console.log('✅ Protection.js - Système de protection avancé activé');

})();
