// ============================================================
// script.js - الوظائف العامة للموقع
// ============================================================

// ====== زر العودة للأعلى ======
(function() {
    // إنشاء زر العودة للأعلى
    var scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-top-btn';
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollBtn.setAttribute('aria-label', 'Retour en haut');
    document.body.appendChild(scrollBtn);

    // إظهار/إخفاء الزر حسب التمرير
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });

    // العودة للأعلى عند النقر
    scrollBtn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();

// ====== شريط تقدم القراءة ======
(function() {
    // إنشاء شريط التقدم
    var progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    progressBar.id = 'progressBar';
    document.body.appendChild(progressBar);

    // تحديث شريط التقدم عند التمرير
    window.addEventListener('scroll', function() {
        var scrollTop = window.scrollY;
        var docHeight = document.documentElement.scrollHeight - window.innerHeight;
        var progress = (scrollTop / docHeight) * 100;
        progressBar.style.width = progress + '%';
    });
})();

// ====== تأثير القائمة عند التمرير ======
window.addEventListener('scroll', function() {
    var navbar = document.getElementById('navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});

// ====== تأثيرات عند تحميل الصفحة ======
document.addEventListener('DOMContentLoaded', function() {
    // إضافة تأثير انتقالي للصفحة
    document.body.classList.add('page-transition');
    
    // إزالة الفئة بعد ثانية
    setTimeout(function() {
        document.body.classList.remove('page-transition');
    }, 1000);
});

console.log('✅ Xpert - Scripts chargés avec succès !');
