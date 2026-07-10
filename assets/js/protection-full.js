// ============================================================
// protection-full.js - حماية كاملة للنصوص
// ============================================================

(function() {
    'use strict';

    // منع النقر الأيمن
    document.addEventListener('contextmenu', function(e) {
        if (!e.target.closest('input, textarea, [contenteditable="true"]')) {
            e.preventDefault();
            return false;
        }
    });

    // منع اختصارات النسخ
    document.addEventListener('keydown', function(e) {
        if (e.target.closest('input, textarea, [contenteditable="true"]')) return true;
        
        const ctrl = e.ctrlKey;
        const key = e.key;
        
        if (ctrl && ['c', 'C', 'x', 'X', 'v', 'V', 's', 'S', 'u', 'U', 'p', 'P'].includes(key)) {
            e.preventDefault();
            return false;
        }
        
        if (key === 'F12' || (ctrl && e.shiftKey && ['I', 'i', 'J', 'j'].includes(key))) {
            e.preventDefault();
            return false;
        }
    });

    // منع سحب النصوص
    document.addEventListener('dragstart', function(e) {
        if (!e.target.closest('input, textarea, [contenteditable="true"]')) {
            e.preventDefault();
            return false;
        }
    });

    // منع تحديد النصوص
    document.addEventListener('selectstart', function(e) {
        if (!e.target.closest('input, textarea, [contenteditable="true"]')) {
            e.preventDefault();
            return false;
        }
    });

    // منع النسخ
    document.addEventListener('copy', function(e) {
        if (!e.target.closest('input, textarea, [contenteditable="true"]')) {
            e.preventDefault();
            return false;
        }
    });

    console.log('🔒 Protection-full.js chargée');
})();

// ============================================================
// 🔒 منع الضغط المطول (Long Press)
// ============================================================

(function() {
    'use strict';

    // منع ظهور القائمة عند الضغط المطول على النصوص
    document.addEventListener('touchstart', function(e) {
        if (e.target.closest('input, textarea, [contenteditable="true"]')) {
            return true;
        }
        // منع ظهور قائمة النسخ عند الضغط المطول
        e.preventDefault();
        return false;
    }, { passive: false });

    // منع ظهور قائمة السياق عند الضغط المطول
    document.addEventListener('contextmenu', function(e) {
        if (e.target.closest('input, textarea, [contenteditable="true"]')) {
            return true;
        }
        e.preventDefault();
        return false;
    });

    // منع تحديد النصوص باللمس
    document.addEventListener('touchmove', function(e) {
        if (e.target.closest('input, textarea, [contenteditable="true"]')) {
            return true;
        }
        // لا نمنع التمرير، فقط نمنع التحديد
    }, { passive: true });

    // منع اختصارات النسخ عند الضغط المطول
    document.addEventListener('copy', function(e) {
        if (e.target.closest('input, textarea, [contenteditable="true"]')) {
            return true;
        }
        e.preventDefault();
        return false;
    });

    console.log('🔒 Protection Long Press activée');
})();

