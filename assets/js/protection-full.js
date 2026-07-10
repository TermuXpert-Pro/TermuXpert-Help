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

    // منع ظهور القائمة عند الضغط المطول
    document.addEventListener('touchstart', function(e) {
        if (e.target.closest('input, textarea, [contenteditable="true"]')) {
            return true;
        }
        e.preventDefault();
        return false;
    }, { passive: false });

    // منع ظهور قائمة السياق
    document.addEventListener('contextmenu', function(e) {
        if (e.target.closest('input, textarea, [contenteditable="true"]')) {
            return true;
        }
        e.preventDefault();
        return false;
    });

    // منع النسخ
    document.addEventListener('copy', function(e) {
        if (e.target.closest('input, textarea, [contenteditable="true"]')) {
            return true;
        }
        e.preventDefault();
        return false;
    });

    console.log('🔒 Protection Long Press activée');
})();

// ============================================================
// 🔧 إزالة طبقة الحماية تلقائياً
// ============================================================

(function() {
    'use strict';

    // التأكد من إخفاء طبقة الحماية عند تحميل الصفحة
    document.addEventListener('DOMContentLoaded', function() {
        const overlay = document.getElementById('overlayProtection');
        if (overlay) {
            setTimeout(function() {
                overlay.classList.remove('active');
                overlay.classList.add('hidden');
                overlay.style.display = 'none';
                overlay.style.opacity = '0';
                overlay.style.pointerEvents = 'none';
                console.log('✅ Overlay protection removed (auto-cleanup)');
            }, 500);
        }
    });

    // إزالة الطبقة أيضاً عند ضغط أي زر
    document.addEventListener('click', function(e) {
        const overlay = document.getElementById('overlayProtection');
        if (overlay && overlay.style.display !== 'none') {
            overlay.classList.remove('active');
            overlay.classList.add('hidden');
            overlay.style.display = 'none';
            overlay.style.opacity = '0';
            overlay.style.pointerEvents = 'none';
        }
    });

    console.log('🔧 Auto-cleanup for overlay protection activated');
})();

