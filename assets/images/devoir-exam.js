/* ============================================================
   devoir-exam.js
   منطق مشترك لكل صفحات الفروض (content/[matiere]/devoirs/[id]/model[n]/index.html):
   - زر FAB عائم، ضغطة وحدة كتبدل عرض كل الحلول
   - الحلول كتظهر بشكل متتالي وسلس (staggered fade + slide)، ماشي دفعة وحدة
   يتطلب أن تكون كل الحلول معلّمة بـ: class="solution-box"
   ============================================================ */
(function () {
    'use strict';

    // أقصى تأخير إجمالي (ms) باش الظهور المتتالي يبقى مريح حتى مع عدد كبير من الأسئلة
    var STAGGER_STEP = 45;
    var STAGGER_MAX_DELAY = 500;
    var HIDE_DELAY = 380; // كيوازي مدة الترانزيشن فـ devoir.css

    function buildUI() {
        var fab = document.createElement('button');
        fab.id = 'devoirFab';
        fab.className = 'devoir-fab';
        fab.type = 'button';
        fab.setAttribute('aria-label', 'عرض التصحيح');
        fab.innerHTML =
            '<span class="devoir-fab-icon"><i class="fas fa-eye"></i></span>' +
            '<span class="devoir-fab-label">عرض التصحيح</span>';
        document.body.appendChild(fab);
        return fab;
    }

    function updateFabState(fab, showing) {
        fab.querySelector('.devoir-fab-icon i').className = showing ? 'fas fa-eye-slash' : 'fas fa-eye';
        fab.querySelector('.devoir-fab-label').textContent = showing ? 'إخفاء التصحيح' : 'عرض التصحيح';
        fab.setAttribute('aria-label', showing ? 'إخفاء التصحيح' : 'عرض التصحيح');
    }

    function revealSolutions(boxes) {
        boxes.forEach(function (box, i) {
            box.classList.add('show');
            // فرض reflow باش الترانزيشن يخدم حتى بعد display:block مباشرة
            void box.offsetWidth;
            var delay = Math.min(i * STAGGER_STEP, STAGGER_MAX_DELAY);
            window.setTimeout(function () {
                box.classList.add('visible');
            }, delay);
        });
    }

    function hideSolutions(boxes) {
        boxes.forEach(function (box) {
            box.classList.remove('visible');
        });
        // كنستناو نهاية الترانزيشن قبل ما نرجعو display:none باش الأنيميشن يبان
        window.setTimeout(function () {
            boxes.forEach(function (box) {
                box.classList.remove('show');
            });
        }, HIDE_DELAY);
    }

    function toggleCorrections(fab) {
        var boxes = Array.prototype.slice.call(document.querySelectorAll('.solution-box'));
        var showing = !document.body.classList.contains('devoir-show-corrections');
        document.body.classList.toggle('devoir-show-corrections', showing);
        updateFabState(fab, showing);

        if (showing) {
            revealSolutions(boxes);
        } else {
            hideSolutions(boxes);
        }

        if (window.MathJax && MathJax.typesetPromise) {
            MathJax.typesetPromise().catch(function () {});
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        var fab = buildUI();
        fab.addEventListener('click', function () {
            toggleCorrections(fab);
        });
    });
})();
