/* ============================================================
   devoir-exam.js
   Logique commune à toutes les pages de devoirs
   (content/[matiere]/devoirs/[id]/model[n]/index.html) :

   Bouton FAB flottant -> menu avec une seule option :
      - "Afficher / masquer la correction" : bascule l'affichage
        progressif des solutions (fade + slide en cascade)

   Nécessite que toutes les solutions soient marquées avec :
   class="solution-box"

   (Le mode "Passer l'examen" - chronomètre, pauses, jeux
   d'attente, bannière de résultat - a été retiré définitivement.)
   ============================================================ */
(function () {
    'use strict';

    // ====== Réglages de l'affichage progressif des solutions ======
    var STAGGER_STEP = 45;
    var STAGGER_MAX_DELAY = 500;
    var HIDE_DELAY = 380;

    // ====== Références des éléments DOM ======
    var els = {};

    /* ---------------------------------------------------------
       Fonctions utilitaires
    --------------------------------------------------------- */
    function el(tag, className, html) {
        var node = document.createElement(tag);
        if (className) node.className = className;
        if (html !== undefined) node.innerHTML = html;
        return node;
    }

    /* ---------------------------------------------------------
       Solutions : affichage / masquage
    --------------------------------------------------------- */
    function getSolutionBoxes() {
        return Array.prototype.slice.call(document.querySelectorAll('.solution-box'));
    }

    function revealSolutions(boxes) {
        boxes.forEach(function (box, i) {
            box.classList.add('show');
            void box.offsetWidth;
            var delay = Math.min(i * STAGGER_STEP, STAGGER_MAX_DELAY);
            window.setTimeout(function () {
                box.classList.add('visible');
            }, delay);
        });
        if (window.MathJax && MathJax.typesetPromise) {
            MathJax.typesetPromise().catch(function () {});
        }
    }

    function hideSolutionsBoxes(boxes) {
        boxes.forEach(function (box) {
            box.classList.remove('visible');
        });
        window.setTimeout(function () {
            boxes.forEach(function (box) {
                box.classList.remove('show');
            });
        }, HIDE_DELAY);
    }

    function setSolutionsVisible(showing) {
        document.body.classList.toggle('devoir-show-corrections', showing);
        var boxes = getSolutionBoxes();
        if (showing) {
            revealSolutions(boxes);
        } else {
            hideSolutionsBoxes(boxes);
        }
        syncMenuLabels();
    }

    function toggleCorrections() {
        var showing = !document.body.classList.contains('devoir-show-corrections');
        setSolutionsVisible(showing);
    }

    /* ---------------------------------------------------------
       Bouton FAB + menu d'options
    --------------------------------------------------------- */
    function buildFab() {
        var fab = el('button', 'devoir-fab');
        fab.id = 'devoirFab';
        fab.type = 'button';
        fab.setAttribute('aria-label', 'Options du devoir');
        fab.setAttribute('aria-haspopup', 'true');
        fab.setAttribute('aria-expanded', 'false');
        fab.innerHTML =
            '<span class="devoir-fab-icon"><i class="fas fa-clipboard-list"></i></span>' +
            '<span class="devoir-fab-label">Options du devoir</span>';
        document.body.appendChild(fab);
        return fab;
    }

    function buildMenu() {
        var menu = el('div', 'devoir-fab-menu');
        menu.id = 'devoirFabMenu';
        menu.setAttribute('role', 'menu');

        var solBtn = el('button', 'devoir-fab-menu-item devoir-fab-menu-solutions');
        solBtn.type = 'button';
        solBtn.id = 'devoirMenuSolBtn';
        solBtn.innerHTML = '<i class="fas fa-eye"></i><span>Afficher la correction</span>';

        menu.appendChild(solBtn);
        document.body.appendChild(menu);

        solBtn.addEventListener('click', function () {
            closeMenu();
            toggleCorrections();
        });

        return { menu: menu, solBtn: solBtn };
    }

    function openMenu() {
        els.menu.classList.add('open');
        els.fab.setAttribute('aria-expanded', 'true');
        document.addEventListener('click', onDocClickCloseMenu, true);
    }

    function closeMenu() {
        els.menu.classList.remove('open');
        els.fab.setAttribute('aria-expanded', 'false');
        document.removeEventListener('click', onDocClickCloseMenu, true);
    }

    function onDocClickCloseMenu(e) {
        if (els.menu.contains(e.target) || els.fab.contains(e.target)) return;
        closeMenu();
    }

    function toggleMenu() {
        if (els.menu.classList.contains('open')) {
            closeMenu();
        } else {
            syncMenuLabels();
            openMenu();
        }
    }

    function syncMenuLabels() {
        var showingSolutions = document.body.classList.contains('devoir-show-corrections');
        els.solBtn.querySelector('span:last-child').textContent =
            showingSolutions ? 'Masquer la correction' : 'Afficher la correction';
        els.solBtn.querySelector('i').className =
            showingSolutions ? 'fas fa-eye-slash' : 'fas fa-eye';
    }

    /* ---------------------------------------------------------
       Initialisation
    --------------------------------------------------------- */
    document.addEventListener('DOMContentLoaded', function () {
        els.fab = buildFab();
        var menuParts = buildMenu();
        els.menu = menuParts.menu;
        els.solBtn = menuParts.solBtn;

        els.fab.addEventListener('click', function (e) {
            e.stopPropagation();
            toggleMenu();
        });

        syncMenuLabels();
    });
})();

