/**
 * ============================================================
 * protection.js - حماية متقدمة للمحتوى
 * منع النسخ، التحديد، القوائم، سحب الصور، الضغط المطول
 * ============================================================
 */

(function() {
    'use strict';

    // ============================================================
    // 1. منع تحديد النصوص (Selection)
    // ============================================================
    
    const style = document.createElement('style');
    style.textContent = `
        * {
            -webkit-user-select: none !important;
            -moz-user-select: none !important;
            -ms-user-select: none !important;
            user-select: none !important;
            -webkit-touch-callout: none !important;
            -webkit-tap-highlight-color: transparent !important;
        }
        input, textarea, [contenteditable="true"] {
            -webkit-user-select: text !important;
            -moz-user-select: text !important;
            -ms-user-select: text !important;
            user-select: text !important;
        }
        img, svg, canvas, video, iframe {
            -webkit-user-drag: none !important;
            -moz-user-drag: none !important;
            -ms-user-drag: none !important;
            user-drag: none !important;
            -webkit-touch-callout: none !important;
            pointer-events: none !important;
            touch-action: none !important;
        }
        img {
            -webkit-touch-callout: none !important;
            touch-callout: none !important;
            pointer-events: none !important;
        }
        body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }
    `;
    document.head.appendChild(style);

    // ============================================================
    // 2. منع تحديد النصوص
    // ============================================================
    
    document.addEventListener('selectstart', function(e) {
        e.preventDefault();
        return false;
    }, { passive: false });

    document.addEventListener('selectionchange', function(e) {
        if (window.getSelection) {
            window.getSelection().removeAllRanges();
        }
    }, { passive: true });

    document.querySelectorAll('*').forEach(function(el) {
        el.addEventListener('selectstart', function(e) {
            e.preventDefault();
            return false;
        }, { passive: false });
    });

    // ============================================================
    // 3. منع القائمة المختصرة (النقر الأيمن)
    // ============================================================
    
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }, { passive: false });

    document.querySelectorAll('*').forEach(function(el) {
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
