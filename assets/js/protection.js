// ============================================================
// protection.js - حماية متقدمة للمحتوى
// ============================================================

(function() {
    'use strict';

    // منع النقر الأيمن
    document.addEventListener('contextmenu', function(e) {
        if (!e.target.closest('input, textarea, [contenteditable="true"]')) {
            e.preventDefault();
            showToast('🚫 النسخ غير مسموح');
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
            showToast('🚫 غير مسموح');
            return false;
        }
        
        if (key === 'F12' || (ctrl && e.shiftKey && ['I', 'i', 'J', 'j'].includes(key))) {
            e.preventDefault();
            showToast('🚫 مقيد');
            return false;
        }
    });

    // منع سحب الصور
    document.querySelectorAll('img').forEach(img => {
        img.draggable = false;
        img.addEventListener('dragstart', e => e.preventDefault());
    });

    // رسالة منبثقة
    function showToast(msg) {
        const t = document.createElement('div');
        t.textContent = msg;
        Object.assign(t.style, {
            position: 'fixed', bottom: '100px', left: '50%',
            transform: 'translateX(-50%)', background: 'rgba(255,107,107,0.9)',
            color: '#fff', padding: '10px 20px', borderRadius: '10px',
            zIndex: '99999', fontSize: '14px', fontWeight: '600',
            opacity: '0', transition: 'opacity 0.3s ease'
        });
        document.body.appendChild(t);
        setTimeout(() => t.style.opacity = '1', 50);
        setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 400); }, 2500);
    }

    console.log('✅ Protection.js chargé');
})();
