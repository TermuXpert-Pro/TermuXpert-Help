/* ============================================================
   overlay-script.js - سكريبت طبقة الحماية
   ============================================================ */

document.addEventListener('DOMContentLoaded', function() {
    const overlay = document.getElementById('overlayProtection');
    
    // ====== تفعيل طبقة الحماية ======
    window.activateOverlay = function() {
        if (overlay) {
            overlay.classList.add('active');
            overlay.classList.remove('hidden');
            overlay.style.display = 'block';
            overlay.style.pointerEvents = 'all';
        }
    };
    
    // ====== إزالة طبقة الحماية ======
    window.removeOverlay = function(duration = 0.5) {
        if (overlay) {
            overlay.classList.add('fade-out');
            setTimeout(function() {
                overlay.classList.remove('active', 'fade-out');
                overlay.classList.add('hidden');
                overlay.style.display = 'none';
                overlay.style.pointerEvents = 'none';
            }, duration * 1000);
        }
    };
    
    console.log('✅ Overlay protection loaded!');
});
