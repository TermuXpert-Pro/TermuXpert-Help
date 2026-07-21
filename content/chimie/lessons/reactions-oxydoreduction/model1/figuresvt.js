// ============================================================
// figuresvt.js — Partie 1 : Transfert d'électrons (Oxydo-réduction)
// يستعمل SvgUtils (لازم يتحمل قبل هاذ الملف). كل رسم مبني على
// نظام إحداثيات رياضي عبر setupSVG، حتى إلى ماكانش "منحنى" رياضي
// كلاسيكي، باش نستافدو من الدقة و التموضع الدقيق للنصوص والأشكال.
// ============================================================

(function () {
    if (typeof SvgUtils === 'undefined') return;

    // ------------------------------------------------------------
    // Helper: نص مركّز (centré) بخط عريض اختياري — كيستافد من
    // opts.anchor اللي زدنا فـ drawNote
    // ------------------------------------------------------------
    function label(s, text, x, y, opts) {
        SvgUtils.drawNote(s, text, x, y, Object.assign({ anchor: 'middle' }, opts));
    }

    // ============================================================
    // FIGURE 1 — Schéma de l'expérience : lame de Zn dans CuSO4(aq)
    // (Section 1 — n'existait pas dans la version canvas, ajoutée
    // car le protocole + observations méritent un visuel "avant/après")
    // ============================================================
    function drawTubeExperiment(svgId) {
        const s = SvgUtils.setupSVG(svgId, { xMin: 0, xMax: 24, yMin: 0, yMax: 13 });
        if (!s) return;

        function tube(cx, liquidColor, liquidOpacity, showRust) {
            const width = 4.2, x = cx - width / 2;
            const yTop = 10.4, height = 7.2;
            const yBottom = yTop - height;

            // ---- Corps du tube (forme "pilule" = tube à essai simplifié)
            SvgUtils.drawRect(s, x, yTop, width, height, {
                rx: width / 2,
                color: '#5A6B7A',
                lineWidth: 1.4
            });
            // ---- Liquide à l'intérieur (légèrement plus petit que le tube)
            const pad = 0.22;
            SvgUtils.drawRect(s, x + pad, yTop - pad, width - 2 * pad, height - 2 * pad - 0.3, {
                rx: (width - 2 * pad) / 2,
                fill: liquidColor,
                opacity: liquidOpacity,
                color: 'none'
            });
            // ---- Ligne de surface du liquide
            SvgUtils.drawLine(s, x + pad, yTop - 1.3, x + width - pad, yTop - 1.3, {
                color: liquidColor, lineWidth: 1
            });

            // ---- Lame de zinc (dépasse du liquide)
            const stripX = cx - 0.32, stripW = 0.64;
            SvgUtils.drawRect(s, stripX, yTop + 0.9, stripW, height - 1.6, {
                fill: '#B9C2C9',
                color: '#7C8892',
                lineWidth: 1
            });
            label(s, 'Zn', cx, yTop + 1.35, { color: '#2A2A3E', fontSize: 0.62, weight: 'bold' });

            // ---- Dépôt rouge-brun sur la lame (seulement "après")
            if (showRust) {
                const dots = [
                    [-0.05, yBottom + 2.3], [0.18, yBottom + 1.9], [-0.2, yBottom + 1.6],
                    [0.05, yBottom + 1.3], [-0.15, yBottom + 1.0], [0.15, yBottom + 0.7]
                ];
                dots.forEach(([dx, dy]) => {
                    SvgUtils.drawCircle(s, cx + dx, dy, 0.16, { fill: '#B5651D', color: 'none' });
                });
            }
            return { x, yTop, yBottom, width };
        }

        // ---- Tube "Avant"
        const t1 = tube(6, '#3B82C4', 0.85, false);
        label(s, 'Avant réaction', 6, 12.1, { color: '#F4D03F', fontSize: 0.78, weight: 'bold' });
        label(s, 'CuSO₄(aq) bleue', 6, t1.yBottom - 0.7, { color: '#3B82C4', fontSize: 0.55 });
        label(s, '+ lame de Zn', 6, t1.yBottom - 1.4, { color: '#888', fontSize: 0.5 });

        // ---- Flèche de transformation
        SvgUtils.drawVector(s, 9.3, 7.2, 14.7, 7.2, { color: '#F4D03F', arrowSize: 0.55, lineWidth: 2 });
        label(s, 'réaction', 12, 7.9, { color: '#F4D03F', fontSize: 0.55, italic: true });

        // ---- Tube "Après"
        const t2 = tube(18, '#3B82C4', 0.12, true);
        label(s, 'Après réaction', 18, 12.1, { color: '#F4D03F', fontSize: 0.78, weight: 'bold' });
        label(s, 'Solution incolore', 18, t2.yBottom - 0.7, { color: '#888', fontSize: 0.55 });
        label(s, 'Dépôt rouge-brun (Cu)', 18, t2.yBottom - 1.4, { color: '#B5651D', fontSize: 0.5, weight: 'bold' });

        // ---- petit trait pointant vers le dépôt
        SvgUtils.drawLine(s, 18, t2.yBottom - 1.1, 18.35, t2.yBottom + 1.0, { color: '#B5651D', lineWidth: 1, dashed: true, dashPattern: [3, 2] });
    }

    // ============================================================
    // FIGURE générique — schéma de transfert d'électrons entre
    // un réducteur (cède des e⁻) et un oxydant (capte des e⁻)
    // Réutilisée pour Zn/Cu²⁺, Cu/Ag⁺ et le schéma "concept"
    // ============================================================
    function drawElectronTransfer(svgId, cfg) {
        const nEq = cfg.equations.length;
        const yMax = nEq >= 3 ? 10.5 : 9.2;
        const s = SvgUtils.setupSVG(svgId, { xMin: 0, xMax: 22, yMin: 0, yMax });
        if (!s) return;

        const cy = yMax - 2.7;
        const r = 1.55;

        // ---- Espèce réductrice (gauche)
        SvgUtils.drawCircle(s, 4.3, cy, r, {
            fill: cfg.leftColor || '#4ECDC4', opacity: 0.18, color: cfg.leftColor || '#4ECDC4', lineWidth: 2
        });
        label(s, cfg.leftFormula, 4.3, cy + 0.18, { color: cfg.leftColor || '#4ECDC4', fontSize: 0.95, weight: 'bold' });
        label(s, 'Réducteur', 4.3, cy - r - 0.85, { color: '#AAAAAA', fontSize: 0.58, weight: 'bold' });
        label(s, cfg.leftSub || 'cède des e⁻', 4.3, cy - r - 1.5, { color: '#888888', fontSize: 0.5 });

        // ---- Espèce oxydante (droite)
        SvgUtils.drawCircle(s, 17.7, cy, r, {
            fill: cfg.rightColor || '#FF6B6B', opacity: 0.18, color: cfg.rightColor || '#FF6B6B', lineWidth: 2
        });
        label(s, cfg.rightFormula, 17.7, cy + 0.18, { color: cfg.rightColor || '#FF6B6B', fontSize: 0.95, weight: 'bold' });
        label(s, 'Oxydant', 17.7, cy - r - 0.85, { color: '#AAAAAA', fontSize: 0.58, weight: 'bold' });
        label(s, cfg.rightSub || 'capte des e⁻', 17.7, cy - r - 1.5, { color: '#888888', fontSize: 0.5 });

        // ---- Flèche de transfert d'électrons
        SvgUtils.drawVector(s, 6.1, cy, 15.9, cy, {
            color: '#F4D03F', arrowSize: 0.6, lineWidth: 2.2
        });
        label(s, cfg.electronLabel || 'e⁻', 11, cy + 0.75, { color: '#F4D03F', fontSize: 0.68, weight: 'bold' });

        // ---- Ligne de séparation
        SvgUtils.drawLine(s, 1.2, cy - r - 2.05, 20.8, cy - r - 2.05, { color: '#2A2A3E', lineWidth: 1 });

        // ---- Équations (demi-équations + bilan éventuel)
        let ey = cy - r - 2.75;
        cfg.equations.forEach(eq => {
            label(s, eq.text, 11, ey, { color: eq.color || '#DDDDDD', fontSize: 0.62 });
            ey -= 0.85;
        });
    }

    function drawZnCuScheme(svgId) {
        drawElectronTransfer(svgId, {
            leftFormula: 'Zn', leftColor: '#4ECDC4', leftSub: '(cède 2 e⁻)',
            rightFormula: 'Cu²⁺', rightColor: '#FF6B6B', rightSub: '(capte 2 e⁻)',
            electronLabel: '2 e⁻',
            equations: [
                { text: 'Zn(s) → Zn²⁺(aq) + 2 e⁻   (oxydation)', color: '#4ECDC4' },
                { text: 'Cu²⁺(aq) + 2 e⁻ → Cu(s)   (réduction)', color: '#FF6B6B' }
            ]
        });
    }

    function drawCuAgScheme(svgId) {
        drawElectronTransfer(svgId, {
            leftFormula: 'Cu', leftColor: '#4ECDC4', leftSub: '(cède 2 e⁻)',
            rightFormula: 'Ag⁺', rightColor: '#FF6B6B', rightSub: '(capte 1 e⁻)',
            electronLabel: '2 e⁻',
            equations: [
                { text: 'Cu(s) → Cu²⁺(aq) + 2 e⁻   (oxydation)', color: '#4ECDC4' },
                { text: '2 Ag⁺(aq) + 2 e⁻ → 2 Ag(s)   (réduction)', color: '#FF6B6B' },
                { text: 'Bilan : Cu(s) + 2 Ag⁺(aq) → Cu²⁺(aq) + 2 Ag(s)', color: '#F4D03F' }
            ]
        });
    }

    // ============================================================
    // FIGURE — Schéma conceptuel générique Oxydant / Réducteur
    // (Section 3 — ajoutée pour illustrer la définition abstraite
    // avant les exemples chiffrés)
    // ============================================================
    function drawConceptScheme(svgId) {
        drawElectronTransfer(svgId, {
            leftFormula: 'Réd', leftColor: '#4ECDC4', leftSub: 'perd des e⁻ → oxydé',
            rightFormula: 'Ox', rightColor: '#FF6B6B', rightSub: 'gagne des e⁻ → réduit',
            electronLabel: 'n e⁻',
            equations: [
                { text: 'Réd → Ox′ + n e⁻   (le réducteur est oxydé)', color: '#4ECDC4' },
                { text: 'Ox + n e⁻ → Réd′   (l\'oxydant est réduit)', color: '#FF6B6B' }
            ]
        });
    }

    // ============================================================
    // Initialisation — كل دالة كتفحص وجود العنصر بنفسها فـ SvgUtils
    // (setupSVG كترجع null إلى ماكانش، فالدوال كتوقف بأمان)
    // ============================================================
    document.addEventListener('DOMContentLoaded', function () {
        setTimeout(function () {
            drawTubeExperiment('figExperienceZnCu');
            drawZnCuScheme('figRedoxZnCu');
            drawConceptScheme('figConceptOxRed');
            drawCuAgScheme('figRedoxCuAg');
        }, 250);
    });
})();
