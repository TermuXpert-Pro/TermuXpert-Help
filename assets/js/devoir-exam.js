/* ============================================================
   devoir-exam.js
   Logique commune à toutes les pages de devoirs (content/[matiere]/devoirs/[id]/model[n]/index.html) :

   1) Bouton FAB flottant -> au clic, un menu d'options s'affiche :
      - "Passer l'examen" : mode simulation du devoir avec un vrai compte à rebours (2 heures)
      - "Afficher / masquer la correction" : ancien comportement (basculer l'affichage des solutions)

   2) Mode "Passer l'examen" :
      - Carte de conseil avant de commencer + explication des règles du chronomètre
      - Chronomètre flottant fixe (petite carte comme le FAB) qui reste visible au-dessus du contenu
        même en faisant défiler la page ; sa couleur change progressivement à mesure que le temps diminue,
        et clignote durant les 10 dernières minutes comme avertissement
      - À la fin du temps ou en appuyant sur "Arrêter" : les solutions s'affichent automatiquement
        avec un message approprié (félicitations ou notification d'arrêt anticipé)
      - Toutes les 30 minutes de concentration : pause automatique + proposition d'une pause de 15 minutes
        (même logique de dégradé de couleur + clignotement durant les 5 dernières minutes)

   Dans ce mode, le devoir est "passé" sans aucune interaction écrite avec la page (pas de champs
   de réponse) -- le seul objectif est de simuler les conditions réelles de l'examen dans le temps.

   Nécessite que toutes les solutions soient marquées avec : class="solution-box"
   ============================================================ */
(function () {
    'use strict';

    // ====== Réglages généraux pour l'affichage progressif des solutions (ancien comportement conservé) ======
    var STAGGER_STEP = 45;
    var STAGGER_MAX_DELAY = 500;
    var HIDE_DELAY = 380;

    // ====== Réglages du mode examen ======
    var EXAM_DURATION = 2 * 60 * 60;      // 2 heures en secondes
    var BREAK_CHECK_INTERVAL = 30 * 60;   // Toutes les 30 minutes de concentration
    var BREAK_DURATION = 15 * 60;         // Pause de 15 minutes
    var EXAM_PULSE_THRESHOLD = 10 * 60;   // Clignote durant les 10 dernières minutes du devoir
    var BREAK_PULSE_THRESHOLD = 5 * 60;   // Clignote durant les 5 dernières minutes de la pause

    // Couleurs dégradées du chronomètre (turquoise -> doré -> rouge) selon l'identité du site
    var COLOR_SAFE = { r: 78, g: 205, b: 196 };
    var COLOR_MID = { r: 244, g: 208, b: 63 };
    var COLOR_DANGER = { r: 255, g: 107, b: 107 };

    // ====== Outil de test : accélération du temps (×1 par défaut, pour les tests uniquement) ======
    var TIME_SPEEDS = [1, 5, 20, 60, 300];
    var speedIndex = 0;

    // ====== État général ======
    var state = 'idle'; // idle | running | break | finished
    var examRemaining = EXAM_DURATION;
    var breakCheckRemaining = BREAK_CHECK_INTERVAL;
    var breakRemaining = BREAK_DURATION;
    var tickInterval = null;

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

    function pad2(n) {
        return n < 10 ? '0' + n : '' + n;
    }

    function formatTime(totalSeconds, withHours) {
        totalSeconds = Math.max(0, totalSeconds);
        var h = Math.floor(totalSeconds / 3600);
        var m = Math.floor((totalSeconds % 3600) / 60);
        var s = totalSeconds % 60;
        if (withHours) {
            return pad2(h) + ':' + pad2(m) + ':' + pad2(s);
        }
        return pad2(m) + ':' + pad2(s);
    }

    function lerp(a, b, t) {
        return Math.round(a + (b - a) * t);
    }

    function colorForPercent(percent) {
        // percent : 1 (début/temps complet) -> 0 (fin)
        var c1, c2, t;
        if (percent > 0.5) {
            c1 = COLOR_SAFE; c2 = COLOR_MID;
            t = 1 - ((percent - 0.5) / 0.5);
        } else {
            c1 = COLOR_MID; c2 = COLOR_DANGER;
            t = 1 - (percent / 0.5);
        }
        return {
            r: lerp(c1.r, c2.r, t),
            g: lerp(c1.g, c2.g, t),
            b: lerp(c1.b, c2.b, t)
        };
    }

    function applyTimerColor(card, remaining, total, pulseThreshold) {
        var percent = total > 0 ? Math.max(0, Math.min(1, remaining / total)) : 0;
        var c = colorForPercent(percent);
        var rgb = c.r + ',' + c.g + ',' + c.b;
        card.style.setProperty('--devoir-timer-rgb', rgb);
        card.classList.toggle('devoir-timer-pulse', remaining <= pulseThreshold && remaining > 0);
    }

    /* ---------------------------------------------------------
       Solutions : affichage / masquage (comportement de base conservé)
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

        var examBtn = el('button', 'devoir-fab-menu-item devoir-fab-menu-exam');
        examBtn.type = 'button';
        examBtn.id = 'devoirMenuExamBtn';
        examBtn.innerHTML = '<i class="fas fa-graduation-cap"></i><span>Passer l\'examen</span>';

        var solBtn = el('button', 'devoir-fab-menu-item devoir-fab-menu-solutions');
        solBtn.type = 'button';
        solBtn.id = 'devoirMenuSolBtn';
        solBtn.innerHTML = '<i class="fas fa-eye"></i><span>Afficher la correction</span>';

        menu.appendChild(examBtn);
        menu.appendChild(solBtn);
        document.body.appendChild(menu);

        examBtn.addEventListener('click', function () {
            closeMenu();
            handleExamMenuClick();
        });
        solBtn.addEventListener('click', function () {
            closeMenu();
            toggleCorrections();
        });

        return { menu: menu, examBtn: examBtn, solBtn: solBtn };
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
        els.solBtn.querySelector('span:last-child').textContent = showingSolutions ? 'Masquer la correction' : 'Afficher la correction';
        els.solBtn.querySelector('i').className = showingSolutions ? 'fas fa-eye-slash' : 'fas fa-eye';

        // Pendant que l'examen est en cours (chronomètre actif ou pause), impossible
        // de voir la correction depuis le FAB : ça n'aurait aucun sens de la proposer
        // avant d'avoir terminé ou arrêté le devoir.
        var duringExam = (state === 'running' || state === 'break');
        els.solBtn.style.display = duringExam ? 'none' : '';

        var examLabel = els.examBtn.querySelector('span:last-child');
        var examIcon = els.examBtn.querySelector('i');
        if (state === 'running' || state === 'break') {
            examLabel.textContent = 'Arrêter l\'examen';
            examIcon.className = 'fas fa-hand';
        } else if (state === 'finished') {
            examLabel.textContent = 'Repasser l\'examen';
            examIcon.className = 'fas fa-rotate-right';
        } else {
            examLabel.textContent = 'Passer l\'examen';
            examIcon.className = 'fas fa-graduation-cap';
        }
    }

    function handleExamMenuClick() {
        if (state === 'running' || state === 'break') {
            askConfirm({
                icon: 'fas fa-circle-pause',
                title: 'Arrêter le devoir ?',
                text: 'Si tu arrêtes maintenant, le chronomètre s\'arrêtera et les solutions s\'afficheront immédiatement. Es-tu sûr(e) ?',
                cancelLabel: 'Continuer le devoir',
                confirmLabel: 'Oui, arrêter',
                onConfirm: function () { stopExam('manual'); }
            });
        } else if (state === 'finished') {
            resetExam();
            openAdviceModal();
        } else {
            openAdviceModal();
        }
    }

    /* ---------------------------------------------------------
       Fenêtre modale générique (Overlay + Card) utilisée pour :
       la carte de conseil / la proposition de pause / la fin de pause
    --------------------------------------------------------- */
    function buildModal(id) {
        var overlay = el('div', 'devoir-modal-overlay');
        overlay.id = id;
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');

        var card = el('div', 'devoir-modal-card');
        overlay.appendChild(card);
        document.body.appendChild(overlay);
        return { overlay: overlay, card: card };
    }

    function openModal(overlay) {
        overlay.classList.add('open');
        document.body.classList.add('devoir-modal-lock');
    }

    function closeModal(overlay) {
        overlay.classList.remove('open');
        document.body.classList.remove('devoir-modal-lock');
    }

    function renderAdviceCard(card) {
        card.innerHTML =
            '<div class="devoir-modal-icon devoir-modal-icon-tip"><i class="fas fa-lightbulb"></i></div>' +
            '<h3 class="devoir-modal-title">Conseil avant de commencer</h3>' +
            '<p class="devoir-modal-text">' +
                'Commence toujours par les questions qui te semblent <b>faciles</b>, pour ne pas perdre ' +
                'ton temps sur les questions difficiles sans résultat. Organise ton temps intelligemment et fais confiance à tes capacités.' +
            '</p>' +
            '<div class="devoir-modal-notes">' +
                '<div class="devoir-modal-note">' +
                    '<i class="fas fa-hourglass-half"></i>' +
                    '<span>Un chronomètre affichera la durée officielle du devoir : <b>deux heures</b>. ' +
                    'À la fin, les solutions s\'afficheront automatiquement pour que tu vérifies tes réponses.</span>' +
                '</div>' +
                '<div class="devoir-modal-note">' +
                    '<i class="fas fa-hand"></i>' +
                    '<span>Si tu termines avant la fin du temps imparti, appuie sur le bouton <b>« Arrêter »</b> ' +
                    'et les solutions s\'afficheront immédiatement.</span>' +
                '</div>' +
            '</div>' +
            '<button type="button" class="devoir-modal-btn devoir-modal-btn-primary" id="devoirAdviceStartBtn">' +
                'D\'accord, commençons <i class="fas fa-arrow-left"></i>' +
            '</button>';
    }

    function renderBreakOfferCard(card) {
        card.innerHTML =
            '<div class="devoir-modal-icon devoir-modal-icon-break" style="font-size:24px;">☕</div>' +
            '<h3 class="devoir-modal-title">Il est temps de faire une petite pause</h3>' +
            '<p class="devoir-modal-text">' +
                'Tu t\'es concentré pendant <b>30 minutes</b> d\'affilée ! Veux-tu faire une pause courte ' +
                'de <b>15 minutes</b> pour te ressourcer ?' +
            '</p>' +
            '<div class="devoir-modal-actions">' +
                '<button type="button" class="devoir-modal-btn devoir-modal-btn-primary" id="devoirBreakYesBtn">' +
                    '<i class="fas fa-check-circle"></i> Oui, je veux faire une pause' +
                '</button>' +
                '<button type="button" class="devoir-modal-btn devoir-modal-btn-secondary" id="devoirBreakNoBtn">' +
                    'Non, continuer le devoir' +
                '</button>' +
            '</div>';
    }

    function renderBreakEndCard(card) {
        card.innerHTML =
            '<div class="devoir-modal-icon devoir-modal-icon-resume"><i class="fas fa-bolt"></i></div>' +
            '<h3 class="devoir-modal-title">La pause est terminée</h3>' +
            '<p class="devoir-modal-text">' +
                'Nous espérons que tu t\'es bien reposé et que tu as retrouvé ton énergie. Il est temps de ' +
                'reprendre ton devoir avec concentration, il te reste assez de temps pour le terminer avec succès.' +
            '</p>' +
            '<div class="devoir-modal-actions">' +
                '<button type="button" class="devoir-modal-btn devoir-modal-btn-primary" id="devoirBreakResumeBtn">' +
                    'Continuer le devoir <i class="fas fa-arrow-left"></i>' +
                '</button>' +
                '<button type="button" class="devoir-modal-btn devoir-modal-btn-secondary" id="devoirBreakStayBtn">' +
                    'Annuler, rester en pause' +
                '</button>' +
            '</div>';
    }

    /* ---------------------------------------------------------
       Fenêtre de confirmation générique (icône / titre / texte / libellés
       configurables) -- utilisée pour : quitter pendant l'examen ou la pause
       (lien "Retour aux modèles", bouton retour du système) et pour confirmer
       l'arrêt manuel du devoir (bouton d'arrêt de la carte du chronomètre)
    --------------------------------------------------------- */
    var confirmModalPending = null;

    function buildConfirmModal() {
        var overlay = el('div', 'devoir-modal-overlay');
        overlay.id = 'devoirConfirmModal';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');

        var card = el('div', 'devoir-modal-card');
        overlay.appendChild(card);
        document.body.appendChild(overlay);
        return { overlay: overlay, card: card };
    }

    function renderConfirmCard(card, opts) {
        card.innerHTML =
            '<div class="devoir-modal-icon devoir-modal-icon-danger"><i class="' + opts.icon + '"></i></div>' +
            '<h3 class="devoir-modal-title">' + opts.title + '</h3>' +
            '<p class="devoir-modal-text">' + opts.text + '</p>' +
            '<div class="devoir-modal-actions">' +
                '<button type="button" class="devoir-modal-btn devoir-modal-btn-primary" id="devoirConfirmCancelBtn">' +
                    opts.cancelLabel +
                '</button>' +
                '<button type="button" class="devoir-modal-btn devoir-modal-btn-secondary" id="devoirConfirmOkBtn">' +
                    opts.confirmLabel +
                '</button>' +
            '</div>';
        document.getElementById('devoirConfirmCancelBtn').addEventListener('click', function () {
            confirmModalPending = null;
            closeModal(els.confirmModal.overlay);
        });
        document.getElementById('devoirConfirmOkBtn').addEventListener('click', function () {
            var cb = confirmModalPending;
            confirmModalPending = null;
            closeModal(els.confirmModal.overlay);
            if (cb) cb();
        });
    }

    function askConfirm(opts) {
        confirmModalPending = opts.onConfirm;
        renderConfirmCard(els.confirmModal.card, opts);
        openModal(els.confirmModal.overlay);
    }

    // Confirmation de sortie pendant l'examen ou la pause : le libellé "rester"
    // s'adapte selon que l'utilisateur est en train de faire le devoir ou de jouer.
    function askExitConfirm(onConfirm) {
        var inBreak = (state === 'break');
        askConfirm({
            icon: 'fas fa-triangle-exclamation',
            title: inBreak ? 'Tu es en pause (jeu en cours)' : 'Tu es en mode examen',
            text: inBreak
                ? 'Tu es en train de jouer pendant ta pause. Si tu quittes maintenant, l\'examen sera arrêté et les solutions s\'afficheront.'
                : 'Le chronomètre est toujours en cours. Si tu quittes maintenant, l\'examen sera arrêté et les solutions s\'afficheront.',
            cancelLabel: inBreak ? 'Rester' : 'Continuer l\'examen',
            confirmLabel: 'Oui, quitter',
            onConfirm: onConfirm
        });
    }

    /* ---------------------------------------------------------
       Garde du bouton retour du système (navigateur / geste Android) :
       tant que l'examen ou la pause est en cours, une tentative de retour
       est interceptée et remplacée par la fenêtre de confirmation ci-dessus.
    --------------------------------------------------------- */
    var systemBackGuardActive = false;

    function onSystemBackAttempt() {
        if (state === 'running' || state === 'break') {
            // Neutralise le retour en ré-empilant un état, en attendant la décision de l'utilisateur
            window.history.pushState({ devoirExamGuard: true }, document.title, window.location.href);
            askExitConfirm(function () {
                systemBackGuardActive = false;
                window.removeEventListener('popstate', onSystemBackAttempt);
                window.history.back();
            });
        } else {
            systemBackGuardActive = false;
            window.removeEventListener('popstate', onSystemBackAttempt);
        }
    }

    function installSystemBackGuard() {
        if (systemBackGuardActive) return;
        systemBackGuardActive = true;
        window.history.pushState({ devoirExamGuard: true }, document.title, window.location.href);
        window.addEventListener('popstate', onSystemBackAttempt);
    }

    function removeSystemBackGuard() {
        if (!systemBackGuardActive) return;
        systemBackGuardActive = false;
        window.removeEventListener('popstate', onSystemBackAttempt);
    }

    /* ---------------------------------------------------------
       Bannière de résultat (félicitations / arrêt anticipé) -- affichée au-dessus des solutions
    --------------------------------------------------------- */
    function showResultBanner(type) {
        var old = document.getElementById('devoirResultBanner');
        if (old) old.remove();

        var banner = el('div', 'devoir-result-banner ' + (type === 'finished' ? 'devoir-result-success' : 'devoir-result-stopped'));
        banner.id = 'devoirResultBanner';

        if (type === 'finished') {
            banner.innerHTML =
                '<div class="devoir-result-icon"><i class="fas fa-champagne-glasses"></i></div>' +
                '<div class="devoir-result-text">' +
                    '<strong>Félicitations ! Tu as terminé le devoir</strong>' +
                    '<span>Les solutions sont maintenant affichées, vérifie tes réponses avec attention.</span>' +
                '</div>';
        } else {
            banner.innerHTML =
                '<div class="devoir-result-icon"><i class="fas fa-circle-pause"></i></div>' +
                '<div class="devoir-result-text">' +
                    '<strong>Tu as arrêté le chronomètre</strong>' +
                    '<span>Il semble que tu aies terminé plus tôt ! Les solutions sont maintenant affichées, vérifie tes réponses.</span>' +
                '</div>';
        }

        var closeBtn = el('button', 'devoir-result-close');
        closeBtn.type = 'button';
        closeBtn.setAttribute('aria-label', 'Fermer');
        closeBtn.innerHTML = '<i class="fas fa-xmark"></i>';
        closeBtn.addEventListener('click', function () {
            banner.classList.remove('visible');
            window.setTimeout(function () { banner.remove(); }, 300);
        });
        banner.appendChild(closeBtn);

        var container = document.querySelector('.lesson-container') || document.body;
        container.insertBefore(banner, container.firstChild);
        void banner.offsetWidth;
        banner.classList.add('visible');
        banner.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    /* ---------------------------------------------------------
       Carte du chronomètre flottant (mode examen / mode pause)
    --------------------------------------------------------- */
    function buildTimerCard() {
        var card = el('div', 'devoir-timer-card');
        card.id = 'devoirTimerCard';
        card.setAttribute('role', 'status');
        card.innerHTML =
            '<span class="devoir-timer-icon"><i class="fas fa-hourglass-half"></i></span>' +
            '<span class="devoir-timer-info">' +
                '<span class="devoir-timer-label">Temps restant pour le devoir</span>' +
                '<span class="devoir-timer-value">00:00:00</span>' +
            '</span>' +
            '<button type="button" class="devoir-timer-speed" id="devoirTimerSpeedBtn" aria-label="Vitesse du test">' +
                '<i class="fas fa-forward"></i><span>1×</span>' +
            '</button>' +
            '<button type="button" class="devoir-timer-return" id="devoirTimerReturnBtn" aria-label="Terminer la pause et revenir au devoir">' +
                '<i class="fas fa-door-open"></i><span>Reprendre</span>' +
            '</button>' +
            '<button type="button" class="devoir-timer-stop" id="devoirTimerStopBtn" aria-label="Arrêter le devoir">' +
                '<i class="fas fa-stop"></i>' +
            '</button>';
        document.body.appendChild(card);
        return card;
    }

    function setTimerCardMode(mode) {
        // mode: 'exam' | 'break'
        els.timerCard.classList.toggle('devoir-timer-card-break', mode === 'break');
        var iconEl = els.timerCard.querySelector('.devoir-timer-icon i');
        var labelEl = els.timerCard.querySelector('.devoir-timer-label');
        var stopBtn = els.timerCard.querySelector('.devoir-timer-stop');
        if (mode === 'break') {
            iconEl.className = 'fas fa-mug-hot';
            labelEl.textContent = 'Temps de pause';
            stopBtn.style.display = 'none';
        } else {
            iconEl.className = 'fas fa-hourglass-half';
            labelEl.textContent = 'Temps restant pour le devoir';
            stopBtn.style.display = '';
        }
    }

    function updateTimerCardDisplay() {
        var valueEl = els.timerCard.querySelector('.devoir-timer-value');
        if (state === 'break') {
            valueEl.textContent = formatTime(breakRemaining, false);
            applyTimerColor(els.timerCard, breakRemaining, BREAK_DURATION, BREAK_PULSE_THRESHOLD);
        } else {
            valueEl.textContent = formatTime(examRemaining, true);
            applyTimerColor(els.timerCard, examRemaining, EXAM_DURATION, EXAM_PULSE_THRESHOLD);
        }
    }

    function updateSpeedLabel() {
        var btn = els.timerCard.querySelector('.devoir-timer-speed');
        var label = btn.querySelector('span');
        var speed = TIME_SPEEDS[speedIndex];
        label.textContent = speed + '×';
        btn.classList.toggle('devoir-timer-speed-active', speed !== 1);
        btn.setAttribute('aria-label', 'Vitesse actuelle du test : ' + speed + '×');
    }

    function cycleSpeed() {
        speedIndex = (speedIndex + 1) % TIME_SPEEDS.length;
        updateSpeedLabel();
    }

    function showTimerCard() {
        els.timerCard.classList.add('visible');
    }

    function hideTimerCard() {
        els.timerCard.classList.remove('visible');
    }

    /* ---------------------------------------------------------
       Jeu de pause (Cross Math) : s'affiche à la place du devoir,
       uniquement pendant la pause
    --------------------------------------------------------- */
    var breakGame = (function () {
        var gridEl = null;
        var trayEl = null;
        var totalBlanks = 0;
        var solvedCount = 0;

        function randInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        // Choisit, pour une ligne donnée, si l'une de ses cases intérieures
        // (l'opérateur, le second nombre B, ou le signe "=") devient elle aussi
        // une case à trous -- en plus des deux extrémités qui restent toujours
        // des trous (elles servent de points de jonction entre les branches).
        // Ceci crée de la variété : les trous ne se retrouvent plus uniquement
        // "aux coins" des formes, et les symboles mathématiques (+ - × ÷ =)
        // peuvent eux aussi être à deviner, pas seulement des nombres.
        function pickExtraBlankSlot() {
            var r = Math.random();
            if (r < 0.45) return 0;   // aucune case intérieure supplémentaire
            if (r < 0.65) return 1;   // l'opérateur (+ - × ÷)
            if (r < 0.85) return 2;   // le second nombre (B)
            return 3;                // le signe "="
        }

        function computeLine(knownA) {
            var A, aIsBlank;
            if (knownA === null || knownA === undefined) {
                A = randInt(2, 9);
                aIsBlank = false;
            } else {
                A = knownA;
                aIsBlank = true;
            }

            var opsPool = ['+', '-', '×'];
            var op = opsPool[randInt(0, 2)];
            var B, C;

            if (op === '+') {
                B = randInt(1, 9);
                C = A + B;
            } else if (op === '-') {
                if (A < 2) {
                    op = '+';
                    B = randInt(1, 9);
                    C = A + B;
                } else {
                    B = randInt(1, A - 1);
                    C = A - B;
                }
            } else {
                B = randInt(1, 4);
                C = A * B;
            }

            return { A: A, op: op, B: B, C: C, aIsBlank: aIsBlank };
        }

        function makeEmptyGrid(rows, cols) {
            var g = [];
            for (var r = 0; r < rows; r++) {
                var row = [];
                for (var c = 0; c < cols; c++) row.push('gap');
                g.push(row);
            }
            return g;
        }

        function cellFor(value, isBlank) {
            return isBlank ? { blank: true, answer: value } : String(value);
        }

        function placeHorizontal(grid, row, colStart, line) {
            var slot = pickExtraBlankSlot();
            grid[row][colStart + 0] = cellFor(line.A, line.aIsBlank);
            grid[row][colStart + 1] = slot === 1 ? { blank: true, answer: line.op } : line.op;
            grid[row][colStart + 2] = slot === 2 ? { blank: true, answer: String(line.B) } : String(line.B);
            grid[row][colStart + 3] = slot === 3 ? { blank: true, answer: '=' } : '=';
            grid[row][colStart + 4] = { blank: true, answer: line.C };
        }

        function placeVertical(grid, col, rowStart, line) {
            var slot = pickExtraBlankSlot();
            grid[rowStart + 0][col] = cellFor(line.A, line.aIsBlank);
            grid[rowStart + 1][col] = slot === 1 ? { blank: true, answer: line.op } : line.op;
            grid[rowStart + 2][col] = slot === 2 ? { blank: true, answer: String(line.B) } : String(line.B);
            grid[rowStart + 3][col] = slot === 3 ? { blank: true, answer: '=' } : '=';
            grid[rowStart + 4][col] = { blank: true, answer: line.C };
        }

        // Variantes "inversées" : la valeur A est placée au point de départ partagé,
        // et la ligne se déploie vers la gauche / vers le haut. Permet de construire
        // des formes à plusieurs branches (étoiles, croix) à partir d'un même point central.
        function placeHorizontalRev(grid, row, colStart, line) {
            var slot = pickExtraBlankSlot();
            grid[row][colStart - 0] = cellFor(line.A, line.aIsBlank);
            grid[row][colStart - 1] = slot === 1 ? { blank: true, answer: line.op } : line.op;
            grid[row][colStart - 2] = slot === 2 ? { blank: true, answer: String(line.B) } : String(line.B);
            grid[row][colStart - 3] = slot === 3 ? { blank: true, answer: '=' } : '=';
            grid[row][colStart - 4] = { blank: true, answer: line.C };
        }

        function placeVerticalRev(grid, col, rowStart, line) {
            var slot = pickExtraBlankSlot();
            grid[rowStart - 0][col] = cellFor(line.A, line.aIsBlank);
            grid[rowStart - 1][col] = slot === 1 ? { blank: true, answer: line.op } : line.op;
            grid[rowStart - 2][col] = slot === 2 ? { blank: true, answer: String(line.B) } : String(line.B);
            grid[rowStart - 3][col] = slot === 3 ? { blank: true, answer: '=' } : '=';
            grid[rowStart - 4][col] = { blank: true, answer: line.C };
        }

        /* ---------------------------------------------------------
           Réglages partagés de taille (utilisés à la fois pour vérifier
           qu'une forme rentre dans l'écran ET pour calculer la taille
           réelle des cases à l'affichage -- toujours les mêmes valeurs
           des deux côtés pour ne jamais faire déborder / disparaître
           des cases hors de l'écran).
        --------------------------------------------------------- */
        var GRID_GAP = 5;
        var MIN_CELL = 20;
        var MAX_CELL = 62;
        var RESERVE_H = 230; // titre + sous-titre + plateau + bouton

        function fitsScreen(def) {
            var availW = Math.min(window.innerWidth - 24, 1400) - (def.cols - 1) * GRID_GAP;
            var availH = Math.max(window.innerHeight - RESERVE_H, 160) - (def.rows - 1) * GRID_GAP;
            var byW = Math.floor(availW / def.cols);
            var byH = Math.floor(availH / def.rows);
            return byW >= MIN_CELL && byH >= MIN_CELL;
        }

        function countBlanksInDef(def) {
            var n = 0;
            for (var r = 0; r < def.rows; r++) {
                for (var c = 0; c < def.cols; c++) {
                    var v = def.grid[r][c];
                    if (v && typeof v === 'object' && v.blank) n++;
                }
            }
            return n;
        }

        /* ---------------------------------------------------------
           Générateur procédural : construit une forme en "branchant"
           des lignes les unes aux autres (comme un arbre), en alternant
           systématiquement horizontal/vertical à chaque branchement.
           Comme le nombre, la position et la direction des branches sont
           aléatoires à chaque fois, ceci produit des dizaines de milliers
           de formes différentes (bien plus que 50), toujours cohérentes
           et solvables, et toujours dimensionnées pour rentrer à l'écran.
        --------------------------------------------------------- */
        var PROC_DIRS = {
            right: { dr: 0, dc: 1, axis: 'h' },
            left:  { dr: 0, dc: -1, axis: 'h' },
            down:  { dr: 1, dc: 0, axis: 'v' },
            up:    { dr: -1, dc: 0, axis: 'v' }
        };

        function keyOf(r, c) { return r + ',' + c; }

        function canPlaceLine(cells, r0, c0, dr, dc) {
            for (var i = 1; i <= 4; i++) {
                if (Object.prototype.hasOwnProperty.call(cells, keyOf(r0 + dr * i, c0 + dc * i))) {
                    return false;
                }
            }
            return true;
        }

        function placeLineSparse(cells, r0, c0, dr, dc, line) {
            var slot = pickExtraBlankSlot();
            cells[keyOf(r0, c0)] = { blank: true, answer: line.A };
            cells[keyOf(r0 + dr, c0 + dc)] = slot === 1 ? { blank: true, answer: line.op } : line.op;
            cells[keyOf(r0 + 2 * dr, c0 + 2 * dc)] = slot === 2 ? { blank: true, answer: String(line.B) } : String(line.B);
            cells[keyOf(r0 + 3 * dr, c0 + 3 * dc)] = slot === 3 ? { blank: true, answer: '=' } : '=';
            cells[keyOf(r0 + 4 * dr, c0 + 4 * dc)] = { blank: true, answer: line.C };
        }

        function buildProceduralTemplateOnce(minSeg, maxSeg) {
            var cells = {};
            var firstDirName = Math.random() < 0.5 ? 'right' : 'down';
            var firstDir = PROC_DIRS[firstDirName];
            var first = computeLine(null);
            placeLineSparse(cells, 0, 0, firstDir.dr, firstDir.dc, first);

            var endpoints = [
                { r: 0, c: 0, value: first.A, axis: firstDir.axis },
                { r: firstDir.dr * 4, c: firstDir.dc * 4, value: first.C, axis: firstDir.axis }
            ];

            var segmentsLeft = randInt(minSeg, maxSeg);
            var attempts = 0;
            var maxAttempts = segmentsLeft * 6;

            while (segmentsLeft > 0 && attempts < maxAttempts && endpoints.length > 0) {
                attempts++;
                var idx = randInt(0, endpoints.length - 1);
                var ep = endpoints[idx];
                var candidateNames = ep.axis === 'h' ? ['up', 'down'] : ['left', 'right'];
                if (Math.random() < 0.5) candidateNames.reverse();

                var placed = false;
                for (var k = 0; k < candidateNames.length; k++) {
                    var d = PROC_DIRS[candidateNames[k]];
                    if (canPlaceLine(cells, ep.r, ep.c, d.dr, d.dc)) {
                        var newLine = computeLine(ep.value);
                        placeLineSparse(cells, ep.r, ep.c, d.dr, d.dc, newLine);
                        endpoints.push({
                            r: ep.r + d.dr * 4,
                            c: ep.c + d.dc * 4,
                            value: newLine.C,
                            axis: d.axis
                        });
                        placed = true;
                        break;
                    }
                }

                if (placed) {
                    segmentsLeft--;
                    // Une même intersection peut parfois repartir dans une 3e direction
                    // (effet étoile), sinon elle est "consommée".
                    if (Math.random() < 0.72) endpoints.splice(idx, 1);
                } else {
                    endpoints.splice(idx, 1);
                }
            }

            var minR = Infinity, maxR = -Infinity, minC = Infinity, maxC = -Infinity;
            var keys = Object.keys(cells);
            for (var i = 0; i < keys.length; i++) {
                var parts = keys[i].split(',');
                var r = parseInt(parts[0], 10), c = parseInt(parts[1], 10);
                if (r < minR) minR = r;
                if (r > maxR) maxR = r;
                if (c < minC) minC = c;
                if (c > maxC) maxC = c;
            }

            var rows = maxR - minR + 1;
            var cols = maxC - minC + 1;
            var grid = makeEmptyGrid(rows, cols);
            for (var j = 0; j < keys.length; j++) {
                var p = keys[j].split(',');
                grid[parseInt(p[0], 10) - minR][parseInt(p[1], 10) - minC] = cells[keys[j]];
            }

            return { rows: rows, cols: cols, grid: grid };
        }

        function buildProceduralPuzzle(minSeg, maxSeg, depth) {
            minSeg = minSeg || 5;
            maxSeg = maxSeg || 13;
            depth = depth || 0;
            var def = buildProceduralTemplateOnce(minSeg, maxSeg);
            if (fitsScreen(def) && countBlanksInDef(def) >= 5) return def;
            if (depth >= 5) return buildSnakeTemplate();
            // Ne rentre pas à l'écran : on réessaie avec une forme un peu plus petite
            var newMax = Math.max(minSeg, maxSeg - 2);
            return buildProceduralPuzzle(minSeg, newMax, depth + 1);
        }

        function combineSideBySide(defA, defB, gapCols) {
            gapCols = gapCols || 1;
            var rows = Math.max(defA.rows, defB.rows);
            var cols = defA.cols + gapCols + defB.cols;
            var grid = makeEmptyGrid(rows, cols);
            for (var r = 0; r < defA.rows; r++) {
                for (var c = 0; c < defA.cols; c++) grid[r][c] = defA.grid[r][c];
            }
            var offset = defA.cols + gapCols;
            for (var r2 = 0; r2 < defB.rows; r2++) {
                for (var c2 = 0; c2 < defB.cols; c2++) grid[r2][offset + c2] = defB.grid[r2][c2];
            }
            return { rows: rows, cols: cols, grid: grid };
        }

        function buildPlusTemplate() {
            var rows = 7, cols = 5;
            var grid = makeEmptyGrid(rows, cols);
            var line1 = computeLine(null);
            placeHorizontal(grid, 2, 0, line1);
            var line2 = computeLine(line1.C);
            placeVertical(grid, 4, 2, line2);
            return { rows: rows, cols: cols, grid: grid };
        }

        function buildHTemplate() {
            var rows = 5, cols = 5;
            var grid = makeEmptyGrid(rows, cols);
            var line1 = computeLine(null);
            placeHorizontal(grid, 0, 0, line1);
            var line2a = computeLine(line1.A);
            placeVertical(grid, 0, 0, line2a);
            var line2b = computeLine(line1.C);
            placeVertical(grid, 4, 0, line2b);
            return { rows: rows, cols: cols, grid: grid };
        }

        function buildSnakeTemplate() {
            var rows = 5, cols = 9;
            var grid = makeEmptyGrid(rows, cols);
            var line1 = computeLine(null);
            placeHorizontal(grid, 0, 0, line1);
            var line2 = computeLine(line1.C);
            placeVertical(grid, 4, 0, line2);
            var line3 = computeLine(line2.C);
            placeHorizontal(grid, 4, 4, line3);
            return { rows: rows, cols: cols, grid: grid };
        }

        function buildStarTemplate() {
            // Étoile à 4 branches : les 4 lignes partent toutes du même nombre central
            var rows = 9, cols = 9;
            var grid = makeEmptyGrid(rows, cols);
            var center = randInt(2, 9);

            var right = computeLine(center);
            placeHorizontal(grid, 4, 4, right);
            var left = computeLine(center);
            placeHorizontalRev(grid, 4, 4, left);
            var down = computeLine(center);
            placeVertical(grid, 4, 4, down);
            var up = computeLine(center);
            placeVerticalRev(grid, 4, 4, up);

            return { rows: rows, cols: cols, grid: grid };
        }

        function buildLongSnakeTemplate() {
            // Grand serpentin en zigzag sur 4 segments
            var rows = 9, cols = 9;
            var grid = makeEmptyGrid(rows, cols);
            var line1 = computeLine(null);
            placeHorizontal(grid, 0, 0, line1);
            var line2 = computeLine(line1.C);
            placeVertical(grid, 4, 0, line2);
            var line3 = computeLine(line2.C);
            placeHorizontal(grid, 4, 4, line3);
            var line4 = computeLine(line3.C);
            placeVertical(grid, 8, 4, line4);
            return { rows: rows, cols: cols, grid: grid };
        }

        function buildDoubleCrossTemplate() {
            // Deux étoiles à 4 branches côte à côte : grille large, beaucoup de nombres et de trous
            var rows = 9, cols = 15;
            var grid = makeEmptyGrid(rows, cols);

            function makeCross(centerCol) {
                var center = randInt(2, 9);
                var right = computeLine(center);
                placeHorizontal(grid, 4, centerCol, right);
                var left = computeLine(center);
                placeHorizontalRev(grid, 4, centerCol, left);
                var down = computeLine(center);
                placeVertical(grid, centerCol, 4, down);
                var up = computeLine(center);
                placeVerticalRev(grid, centerCol, 4, up);
            }

            makeCross(4);
            makeCross(10);
            return { rows: rows, cols: cols, grid: grid };
        }

        function generatePuzzle() {
            var roll = Math.random();
            var def;
            if (roll < 0.12) {
                def = combineSideBySide(buildProceduralPuzzle(4, 8), buildProceduralPuzzle(4, 8), 1);
                if (!fitsScreen(def)) def = buildProceduralPuzzle(5, 11);
            } else if (roll < 0.85) {
                def = buildProceduralPuzzle(5, 13);
            } else {
                var templates = [
                    buildPlusTemplate,
                    buildHTemplate,
                    buildSnakeTemplate,
                    buildStarTemplate,
                    buildLongSnakeTemplate,
                    buildDoubleCrossTemplate
                ];
                def = templates[randInt(0, templates.length - 1)]();
                if (!fitsScreen(def)) def = buildSnakeTemplate();
            }
            return def;
        }

        var OPS = ['+', '-', '=', '×', '÷'];
        var currentDef = null;

        function computeCellSize(def) {
            var availW = Math.min(window.innerWidth - 24, 1400) - (def.cols - 1) * GRID_GAP;
            var availH = Math.max(window.innerHeight - RESERVE_H, 160) - (def.rows - 1) * GRID_GAP;
            var byW = Math.floor(availW / def.cols);
            var byH = Math.floor(availH / def.rows);
            var size = Math.min(byW, byH, MAX_CELL);
            return Math.max(size, MIN_CELL);
        }

        function applyGridSizing(def) {
            var cell = computeCellSize(def);
            gridEl.style.setProperty('--cell-size', cell + 'px');
            gridEl.style.gridTemplateColumns = 'repeat(' + def.cols + ', var(--cell-size))';
            gridEl.style.gridTemplateRows = 'repeat(' + def.rows + ', var(--cell-size))';
        }

        function buildGridDom(def) {
            currentDef = def;
            applyGridSizing(def);
            gridEl.innerHTML = '';
            gridEl.classList.remove('win-glow');
            totalBlanks = 0;

            for (var r = 0; r < def.rows; r++) {
                for (var c = 0; c < def.cols; c++) {
                    var val = def.grid[r][c];
                    var cellEl = document.createElement('div');

                    if (val === 'gap') {
                        cellEl.className = 'bg-cell gap';
                    } else if (val && typeof val === 'object' && val.blank) {
                        cellEl.className = 'bg-cell blank';
                        cellEl.dataset.answer = val.answer;
                        totalBlanks++;
                    } else if (OPS.indexOf(val) !== -1) {
                        cellEl.className = 'bg-cell op';
                        cellEl.textContent = val;
                    } else {
                        cellEl.className = 'bg-cell fixed';
                        cellEl.textContent = val;
                    }
                    gridEl.appendChild(cellEl);
                }
            }
        }

        function renderTrayDom(def) {
            trayEl.innerHTML = '';
            var pool = [];
            for (var r = 0; r < def.rows; r++) {
                for (var c = 0; c < def.cols; c++) {
                    var val = def.grid[r][c];
                    if (val && typeof val === 'object' && val.blank) pool.push(val.answer);
                }
            }
            for (var i = pool.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var tmp = pool[i]; pool[i] = pool[j]; pool[j] = tmp;
            }
            pool.forEach(function (val, idx) {
                var tile = document.createElement('div');
                tile.className = 'bg-tile';
                tile.dataset.value = val;
                tile.dataset.tileId = 'bg-tile-' + idx;
                tile.textContent = val;
                trayEl.appendChild(tile);
                makeDraggable(tile);
            });
        }

        // Distance (en px) en dessous de laquelle une case vide "réagit" (effet d'aimantation)
        // au passage de la pièce que l'on fait glisser au-dessus d'elle.
        var NEAR_THRESHOLD = 46;

        function makeDraggable(tile) {
            tile.addEventListener('pointerdown', function (e) {
                if (tile.classList.contains('hidden-tile')) return;
                e.preventDefault();

                var rect = tile.getBoundingClientRect();
                var offsetX = e.clientX - rect.left;
                var offsetY = e.clientY - rect.top;
                var halfW = rect.width / 2;
                var halfH = rect.height / 2;

                var ghost = tile.cloneNode(true);
                ghost.classList.add('ghost');
                ghost.style.width = rect.width + 'px';
                ghost.style.height = rect.height + 'px';
                ghost.style.left = rect.left + 'px';
                ghost.style.top = rect.top + 'px';
                document.body.appendChild(ghost);

                tile.classList.add('hidden-tile');

                // Cases encore vides : on surveille la distance de chacune par rapport
                // à la pièce déplacée pour déclencher l'effet "near" sur la plus proche.
                var openBlanks = Array.prototype.slice.call(
                    gridEl.querySelectorAll('.bg-cell.blank:not(.correct)')
                );
                var nearEl = null;

                function updateNear(centerX, centerY) {
                    var closest = null;
                    var closestDist = NEAR_THRESHOLD;
                    for (var i = 0; i < openBlanks.length; i++) {
                        var r = openBlanks[i].getBoundingClientRect();
                        var dx = centerX - (r.left + r.width / 2);
                        var dy = centerY - (r.top + r.height / 2);
                        var dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist < closestDist) {
                            closestDist = dist;
                            closest = openBlanks[i];
                        }
                    }
                    if (closest !== nearEl) {
                        if (nearEl) nearEl.classList.remove('near');
                        if (closest) closest.classList.add('near');
                        nearEl = closest;
                    }
                }

                function onMove(ev) {
                    var left = ev.clientX - offsetX;
                    var top = ev.clientY - offsetY;
                    ghost.style.left = left + 'px';
                    ghost.style.top = top + 'px';
                    updateNear(left + halfW, top + halfH);
                }
                function onUp(ev) {
                    document.removeEventListener('pointermove', onMove);
                    document.removeEventListener('pointerup', onUp);
                    ghost.style.display = 'none';
                    var dropEl = document.elementFromPoint(ev.clientX, ev.clientY);
                    ghost.remove();
                    if (nearEl) nearEl.classList.remove('near');
                    var blank = dropEl ? dropEl.closest('.bg-cell.blank') : null;
                    handleDrop(tile, blank);
                }
                document.addEventListener('pointermove', onMove);
                document.addEventListener('pointerup', onUp);
            });
        }

        function handleDrop(tile, blankEl) {
            if (!blankEl || blankEl.classList.contains('correct')) {
                tile.classList.remove('hidden-tile');
                return;
            }
            var answer = String(blankEl.dataset.answer);
            var val = String(tile.dataset.value);

            if (val === answer) {
                blankEl.textContent = val;
                blankEl.classList.add('filled', 'correct');
                solvedCount++;
                tile.remove();
                if (solvedCount === totalBlanks) onWin();
            } else {
                blankEl.classList.add('wrong-shake');
                window.setTimeout(function () { blankEl.classList.remove('wrong-shake'); }, 400);
                tile.classList.remove('hidden-tile');
            }
        }

        function onWin() {
            gridEl.classList.add('win-glow');
            window.setTimeout(function () {
                newPuzzle();
            }, 1400);
        }

        function newPuzzle() {
            if (!gridEl || !trayEl) return;
            solvedCount = 0;
            var def = generatePuzzle();
            buildGridDom(def);
            renderTrayDom(def);
        }

        function init(gEl, tEl) {
            gridEl = gEl;
            trayEl = tEl;
            window.addEventListener('resize', function () {
                if (currentDef) applyGridSizing(currentDef);
            });
        }

        return { init: init, newPuzzle: newPuzzle };
    })();

    /* ---------------------------------------------------------
       Jeu de pause (Mémoire) : deuxième jeu possible pendant la pause,
       tiré au sort avec le "Cross Math" ci-dessus à chaque nouvelle pause.
       Grille fixe 4x4 (16 cartes / 8 paires), symboles de maths, physique
       et chimie (au lieu de fruits), tirés aléatoirement à chaque partie
       parmi une réserve plus large -- donc des symboles différents à
       chaque nouvelle pause. Mêmes principes techniques que le jeu
       Cross Math : taille des cases recalculée en JS pour tenir sur tous
       les écrans, et relance automatique (avec effet de lueur) une fois
       la grille terminée.
    --------------------------------------------------------- */
    var memoryGame = (function () {
        var boardEl = null;
        var PAIRS_COUNT = 8; // 4x4 = 16 cartes

        // Réserve de symboles : maths, physique, chimie. Plus large que
        // PAIRS_COUNT afin qu'un sous-ensemble différent soit tiré à
        // chaque nouvelle partie / pause.
        var SYMBOLS_POOL = [
            '∫', '∑', '√', 'π', '∞', 'Δ', 'θ', 'α', 'β', '±', '∈', '∀',
            '∂', '∇', '∅', '⊂', '∩', '∪', '∃', '≈', '°', '∴', 'x²', 'x³',
            '⚛️', '⚡', '🧲', '🔭', '🌡️', 'λ', 'F=ma', 'E=mc²',
            '🔋', '🌀', '🛰️', 'Ω', 'v=d/t', 'P=UI', 'g=9.8', 'Hz',
            '⚗️', '🧪', '🔬', '💧', '🔥', 'H₂O', 'NaCl', 'CO₂',
            '⚖️', '🧬', 'pH', 'Fe²⁺', 'Cu', 'O₃', 'CH₄', 'Δh'
        ];

        var GRID_GAP = 10;
        var MIN_CELL = 56;
        var MAX_CELL = 100;
        var RESERVE_H = 230;

        var flipped = [];
        var matchedCount = 0;
        var lockBoard = false;

        function randInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        function shuffle(arr) {
            for (var i = arr.length - 1; i > 0; i--) {
                var j = randInt(0, i);
                var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
            }
            return arr;
        }

        function computeCellSize() {
            var cols = 4, rows = 4;
            var availW = Math.min(window.innerWidth - 24, 1400) - (cols - 1) * GRID_GAP;
            var availH = Math.max(window.innerHeight - RESERVE_H, 160) - (rows - 1) * GRID_GAP;
            var byW = Math.floor(availW / cols);
            var byH = Math.floor(availH / rows);
            var size = Math.min(byW, byH, MAX_CELL);
            return Math.max(size, MIN_CELL);
        }

        function applySizing() {
            if (!boardEl) return;
            var cell = computeCellSize();
            boardEl.style.setProperty('--mem-cell-size', cell + 'px');
            boardEl.style.gridTemplateColumns = 'repeat(4, var(--mem-cell-size))';
            boardEl.style.gridTemplateRows = 'repeat(4, var(--mem-cell-size))';
        }

        function buildDeck() {
            var pool = shuffle(SYMBOLS_POOL.slice());
            var chosen = pool.slice(0, PAIRS_COUNT);
            return shuffle(chosen.concat(chosen));
        }

        function buildDom() {
            if (!boardEl) return;
            boardEl.innerHTML = '';
            boardEl.classList.remove('win-glow');
            matchedCount = 0;
            flipped = [];
            lockBoard = false;
            applySizing();

            var deck = buildDeck();
            deck.forEach(function (symbol) {
                var card = el('div', 'devoir-break-memory-card');
                var frontClass = 'devoir-break-memory-face devoir-break-memory-front' +
                    (String(symbol).length > 2 ? ' wide' : '');
                card.innerHTML =
                    '<div class="devoir-break-memory-inner">' +
                        '<div class="devoir-break-memory-face devoir-break-memory-back"><i class="fas fa-question"></i></div>' +
                        '<div class="' + frontClass + '">' + symbol + '</div>' +
                    '</div>';
                card.dataset.symbol = symbol;
                card.addEventListener('click', function () { onCardClick(card); });
                boardEl.appendChild(card);
            });
        }

        function onCardClick(card) {
            if (lockBoard) return;
            if (card.classList.contains('flipped') || card.classList.contains('matched')) return;

            card.classList.add('flipped');
            flipped.push(card);

            if (flipped.length === 2) {
                lockBoard = true;
                checkMatch();
            }
        }

        function checkMatch() {
            var a = flipped[0], b = flipped[1];
            var isMatch = a.dataset.symbol === b.dataset.symbol;

            if (isMatch) {
                window.setTimeout(function () {
                    a.classList.add('matched');
                    b.classList.add('matched');
                    matchedCount++;
                    flipped = [];
                    lockBoard = false;
                    if (matchedCount === PAIRS_COUNT) onWin();
                }, 350);
            } else {
                a.classList.add('wrong');
                b.classList.add('wrong');
                window.setTimeout(function () {
                    a.classList.remove('flipped', 'wrong');
                    b.classList.remove('flipped', 'wrong');
                    flipped = [];
                    lockBoard = false;
                }, 800);
            }
        }

        function onWin() {
            boardEl.classList.add('win-glow');
            window.setTimeout(function () {
                newGame();
            }, 1400);
        }

        function newGame() {
            buildDom();
        }

        function init(bEl) {
            boardEl = bEl;
            window.addEventListener('resize', function () {
                if (boardEl && boardEl.classList.contains('active')) applySizing();
            });
        }

        return { init: init, newGame: newGame };
    })();

    // Les deux jeux de pause possibles : l'un des deux est tiré au sort
    // à chaque nouvelle pause (voir showBreakGame).
    var BREAK_GAME_VARIANTS = [
        {
            icon: 'fas fa-puzzle-piece',
            title: 'C\'est la pause ! Amuse-toi un peu',
            subtitle: 'Résous cette grille de calcul pour que le temps passe plus vite, et retourne à ton devoir reposé(e) et concentré(e).'
        },
        {
            icon: 'fas fa-brain',
            title: 'C\'est la pause ! Teste ta mémoire',
            subtitle: 'Retrouve toutes les paires de symboles de maths, physique et chimie pour que le temps passe plus vite, et retourne à ton devoir reposé(e) et concentré(e).'
        }
    ];

    function buildBreakGameOverlay() {
        var overlay = el('div', 'devoir-break-game-overlay');
        overlay.id = 'devoirBreakGameOverlay';
        overlay.innerHTML =
            '<div class="devoir-break-game-card">' +
                '<div class="devoir-break-game-icon" id="devoirBreakGameIcon"><i class="fas fa-puzzle-piece"></i></div>' +
                '<h3 class="devoir-break-game-title" id="devoirBreakGameTitle">C\'est la pause ! Amuse-toi un peu</h3>' +
                '<p class="devoir-break-game-subtitle" id="devoirBreakGameSubtitle">Résous cette grille de calcul pour que le temps passe plus vite, et retourne à ton devoir reposé(e) et concentré(e).</p>' +
                '<div class="devoir-break-crossmath" id="devoirBreakCrossMath">' +
                    '<div class="devoir-break-game-grid" id="devoirBreakGameGrid"></div>' +
                    '<div class="devoir-break-game-tray" id="devoirBreakGameTray"></div>' +
                '</div>' +
                '<div class="devoir-break-memory-board" id="devoirBreakMemoryBoard"></div>' +
            '</div>';
        document.body.appendChild(overlay);
        return overlay;
    }

    function showBreakGame() {
        if (!els.breakGameOverlay) return;

        var crossEl = document.getElementById('devoirBreakCrossMath');
        var memEl = document.getElementById('devoirBreakMemoryBoard');
        var iconEl = document.getElementById('devoirBreakGameIcon');
        var titleEl = document.getElementById('devoirBreakGameTitle');
        var subEl = document.getElementById('devoirBreakGameSubtitle');

        var useMemory = Math.random() < 0.5;
        var variant = BREAK_GAME_VARIANTS[useMemory ? 1 : 0];

        if (iconEl) iconEl.innerHTML = '<i class="' + variant.icon + '"></i>';
        if (titleEl) titleEl.textContent = variant.title;
        if (subEl) subEl.textContent = variant.subtitle;

        if (useMemory) {
            if (crossEl) crossEl.classList.remove('active');
            if (memEl) memEl.classList.add('active');
            memoryGame.newGame();
        } else {
            if (memEl) memEl.classList.remove('active');
            if (crossEl) crossEl.classList.add('active');
            breakGame.newPuzzle();
        }

        els.breakGameOverlay.classList.add('open');
        document.body.classList.add('devoir-break-game-lock');
    }

    function hideBreakGame() {
        if (!els.breakGameOverlay) return;
        els.breakGameOverlay.classList.remove('open');
        document.body.classList.remove('devoir-break-game-lock');
    }

    /* ---------------------------------------------------------
       Moteur temporel (Tick loop)
    --------------------------------------------------------- */
    function startTicking() {
        stopTicking();
        tickInterval = window.setInterval(tick, 1000);
    }

    function stopTicking() {
        if (tickInterval) {
            window.clearInterval(tickInterval);
            tickInterval = null;
        }
    }

    function tick() {
        var speed = TIME_SPEEDS[speedIndex];
        if (state === 'running') {
            examRemaining -= speed;
            breakCheckRemaining -= speed;
            updateTimerCardDisplay();

            if (examRemaining <= 0) {
                finishExam();
                return;
            }
            if (breakCheckRemaining <= 0) {
                offerBreak();
                return;
            }
        } else if (state === 'break') {
            breakRemaining -= speed;
            updateTimerCardDisplay();

            if (breakRemaining <= 0) {
                endBreak();
            }
        }
    }

    /* ---------------------------------------------------------
       Cycle de vie de l'examen
    --------------------------------------------------------- */
    function openAdviceModal() {
        renderAdviceCard(els.adviceModal.card);
        openModal(els.adviceModal.overlay);
        document.getElementById('devoirAdviceStartBtn').addEventListener('click', function () {
            closeModal(els.adviceModal.overlay);
            startExam();
        });
    }

    function startExam() {
        state = 'running';
        examRemaining = EXAM_DURATION;
        breakCheckRemaining = BREAK_CHECK_INTERVAL;
        setTimerCardMode('exam');
        updateTimerCardDisplay();
        showTimerCard();
        startTicking();
        syncMenuLabels();
        installSystemBackGuard();
    }

    function offerBreak() {
        stopTicking();
        renderBreakOfferCard(els.breakOfferModal.card);
        openModal(els.breakOfferModal.overlay);

        document.getElementById('devoirBreakYesBtn').addEventListener('click', function () {
            closeModal(els.breakOfferModal.overlay);
            startBreak();
        });
        document.getElementById('devoirBreakNoBtn').addEventListener('click', function () {
            closeModal(els.breakOfferModal.overlay);
            breakCheckRemaining = BREAK_CHECK_INTERVAL;
            startTicking();
        });
    }

    function startBreak() {
        state = 'break';
        breakRemaining = BREAK_DURATION;
        setTimerCardMode('break');
        updateTimerCardDisplay();
        startTicking();
        syncMenuLabels();
        showBreakGame();
    }

    function endBreak() {
        stopTicking();
        renderBreakEndCard(els.breakEndModal.card);
        openModal(els.breakEndModal.overlay);

        document.getElementById('devoirBreakResumeBtn').addEventListener('click', function () {
            closeModal(els.breakEndModal.overlay);
            hideBreakGame();
            state = 'running';
            breakCheckRemaining = BREAK_CHECK_INTERVAL;
            setTimerCardMode('exam');
            updateTimerCardDisplay();
            startTicking();
            syncMenuLabels();
        });

        document.getElementById('devoirBreakStayBtn').addEventListener('click', function () {
            closeModal(els.breakEndModal.overlay);
            // Annule la fin de pause : utile si "Reprendre" a été pressé par erreur.
            // Le temps restant n'est pas modifié, il continue simplement à décompter
            // exactement là où il en était (ex : il restait 10 min, il reste 10 min).
            updateTimerCardDisplay();
            startTicking();
        });
    }

    function finishExam() {
        stopTicking();
        state = 'finished';
        hideTimerCard();
        setSolutionsVisible(true);
        showResultBanner('finished');
        syncMenuLabels();
        removeSystemBackGuard();
    }

    function stopExam(reason) {
        stopTicking();
        state = 'finished';
        hideTimerCard();
        // Fermer toute fenêtre de pause ouverte lors d'un arrêt manuel
        closeModal(els.breakOfferModal.overlay);
        closeModal(els.breakEndModal.overlay);
        hideBreakGame();
        setSolutionsVisible(true);
        showResultBanner('stopped');
        syncMenuLabels();
        removeSystemBackGuard();
    }

    function resetExam() {
        state = 'idle';
        examRemaining = EXAM_DURATION;
        breakCheckRemaining = BREAK_CHECK_INTERVAL;
        breakRemaining = BREAK_DURATION;
        hideTimerCard();
        hideBreakGame();
        setSolutionsVisible(false);
        var banner = document.getElementById('devoirResultBanner');
        if (banner) banner.remove();
        syncMenuLabels();
        removeSystemBackGuard();
    }

    /* ---------------------------------------------------------
       Initialisation
    --------------------------------------------------------- */
    document.addEventListener('DOMContentLoaded', function () {
        els.fab = buildFab();
        var menuParts = buildMenu();
        els.menu = menuParts.menu;
        els.examBtn = menuParts.examBtn;
        els.solBtn = menuParts.solBtn;

        els.timerCard = buildTimerCard();
        els.adviceModal = buildModal('devoirAdviceModal');
        els.breakOfferModal = buildModal('devoirBreakOfferModal');
        els.breakEndModal = buildModal('devoirBreakEndModal');

        els.confirmModal = buildConfirmModal();

        var backLink = document.querySelector('a.back-btn');
        if (backLink) {
            backLink.addEventListener('click', function (e) {
                if (state === 'running' || state === 'break') {
                    e.preventDefault();
                    askExitConfirm(function () {
                        window.location.href = backLink.getAttribute('href');
                    });
                }
            });
        }

        els.breakGameOverlay = buildBreakGameOverlay();
        breakGame.init(
            document.getElementById('devoirBreakGameGrid'),
            document.getElementById('devoirBreakGameTray')
        );
        memoryGame.init(document.getElementById('devoirBreakMemoryBoard'));

        els.fab.addEventListener('click', function (e) {
            e.stopPropagation();
            toggleMenu();
        });

        document.getElementById('devoirTimerStopBtn').addEventListener('click', function () {
            askConfirm({
                icon: 'fas fa-circle-pause',
                title: 'Arrêter le devoir ?',
                text: 'Si tu arrêtes maintenant, le chronomètre s\'arrêtera et les solutions s\'afficheront immédiatement. Es-tu sûr(e) ?',
                cancelLabel: 'Continuer le devoir',
                confirmLabel: 'Oui, arrêter',
                onConfirm: function () { stopExam('manual'); }
            });
        });
        document.getElementById('devoirTimerReturnBtn').addEventListener('click', function () {
            if (state === 'break') endBreak();
        });
        document.getElementById('devoirTimerSpeedBtn').addEventListener('click', function (e) {
            e.stopPropagation();
            cycleSpeed();
        });
        updateSpeedLabel();

        syncMenuLabels();
    });
})();
