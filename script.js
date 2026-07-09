/* ============================================================
   script.js - الوظائف العامة للموقع (مبسط)
   ============================================================ */

document.addEventListener('DOMContentLoaded', function() {

    // ====== زر العودة للأعلى ======
    (function() {
        var scrollBtn = document.createElement('button');
        scrollBtn.className = 'scroll-top-btn';
        scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        scrollBtn.setAttribute('aria-label', 'Retour en haut');
        document.body.appendChild(scrollBtn);

        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                scrollBtn.classList.add('visible');
            } else {
                scrollBtn.classList.remove('visible');
            }
        });

        scrollBtn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    })();

    // ====== شريط التقدم ======
    (function() {
        var progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progressBar.id = 'progressBar';
        document.body.appendChild(progressBar);

        function updateProgress() {
            var scrollTop = window.scrollY;
            var docHeight = document.documentElement.scrollHeight - window.innerHeight;
            var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            progressBar.style.width = Math.min(progress, 100) + '%';
        }

        window.addEventListener('scroll', updateProgress);
        window.addEventListener('resize', updateProgress);
        updateProgress();
    })();

    // ====== تأثير القائمة عند التمرير ======
    window.addEventListener('scroll', function() {
        var navbar = document.getElementById('navbar');
        if (navbar) {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        }
    });

    console.log('✅ Xpert - Scripts chargés avec succès !');
});
