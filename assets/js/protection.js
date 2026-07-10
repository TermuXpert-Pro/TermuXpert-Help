// ============================================================
// protection.js - حماية المحتوى (بدون رسائل)
// ============================================================

(function() {
    'use strict';

    // منع النقر الأيمن (بدون رسالة)
    document.addEventListener('contextmenu', function(e) {
        if (!e.target.closest('input, textarea, [contenteditable="true"]')) {
            e.preventDefault();
            return false;
        }
    });

    // منع اختصارات النسخ (بدون رسالة)
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

    // منع سحب الصور
    document.querySelectorAll('img').forEach(img => {
        img.draggable = false;
        img.addEventListener('dragstart', e => e.preventDefault());
    });

    console.log('✅ Protection.js chargé (mode silencieux)');
})();

