/* ============================================================
   figuresvt_p1.js — Figures SVG pour Partie 1
   "Grandeurs physiques liées à la quantité de matière"
   Fichier 100% autonome : aucune dépendance externe (pas de svg-utils.js).
   ============================================================ */
(function () {
    'use strict';
    var SVGNS = 'http://www.w3.org/2000/svg';

    // ---------- Helpers locaux (dupliqués volontairement dans chaque partN) ----------
    function el(tag, attrs) {
        var e = document.createElementNS(SVGNS, tag);
        if (attrs) {
            for (var k in attrs) {
                if (Object.prototype.hasOwnProperty.call(attrs, k)) {
                    e.setAttribute(k, attrs[k]);
                }
            }
        }
        return e;
    }

    function txt(x, y, str, attrs) {
        var base = { x: x, y: y, 'font-family': "'Cairo','Tajawal',sans-serif" };
        if (attrs) { for (var k in attrs) { base[k] = attrs[k]; } }
        var t = el('text', base);
        t.textContent = str;
        return t;
    }

    function clearSvg(svg) {
        while (svg.firstChild) { svg.removeChild(svg.firstChild); }
    }

    function arrow(g, x1, y1, x2, y2, color, sw) {
        color = color || '#E6EDF3';
        sw = sw || 0.09;
        g.appendChild(el('line', { x1: x1, y1: y1, x2: x2, y2: y2, stroke: color, 'stroke-width': sw }));
        var dx = x2 - x1, dy = y2 - y1;
        var len = Math.sqrt(dx * dx + dy * dy) || 1;
        var ux = dx / len, uy = dy / len;
        var headLen = 0.42, headW = 0.22;
        var bx = x2 - ux * headLen, by = y2 - uy * headLen;
        var px = -uy, py = ux;
        var p1 = (bx + px * headW) + ',' + (by + py * headW);
        var p2 = (bx - px * headW) + ',' + (by - py * headW);
        var p3 = x2 + ',' + y2;
        g.appendChild(el('polygon', { points: p1 + ' ' + p2 + ' ' + p3, fill: color }));
    }

    // Palette du site
    var COLOR_GOLD = '#F4D03F';
    var COLOR_GREEN = '#4ECDC4';
    var COLOR_RED = '#FF6B6B';
    var COLOR_PURPLE = '#BB8FCE';
    var COLOR_TEXT = '#E6EDF3';
    var COLOR_MUTED = '#8B949E';
    var COLOR_PANEL = '#161B22';

    // ============================================================
    // Figure 1 : graphMole — "1 mole = 6,02×10^23 entités"
    // viewBox 0 0 28 12
    // ============================================================
    function drawGraphMole() {
        var svg = document.getElementById('graphMole');
        if (!svg) { return; }
        clearSvg(svg);
        var g = el('g', {});
        svg.appendChild(g);

        // ---- Flacon (échantillon macroscopique) à gauche ----
        g.appendChild(el('path', {
            d: 'M2,2.5 L2,8.7 Q2,9.5 2.8,9.5 L8.2,9.5 Q9,9.5 9,8.7 L9,2.5',
            fill: 'none', stroke: COLOR_MUTED, 'stroke-width': 0.14, 'stroke-linecap': 'round'
        }));
        g.appendChild(el('path', {
            d: 'M2.15,5.2 L2.15,8.6 Q2.15,9.35 2.85,9.35 L8.15,9.35 Q8.85,9.35 8.85,8.6 L8.85,5.2 Z',
            fill: COLOR_GREEN, opacity: 0.16
        }));
        var flaskDots = [[4,7.4],[5.1,8.2],[6.6,7.6],[4.6,6.2],[7.1,6.6],[5.6,5.7],[6.2,8.6],[3.4,6.3]];
        flaskDots.forEach(function (p) {
            g.appendChild(el('circle', { cx: p[0], cy: p[1], r: 0.22, fill: COLOR_GREEN, opacity: 0.9 }));
        });
        g.appendChild(txt(5.5, 1.5, 'Échantillon macroscopique', { 'text-anchor': 'middle', 'font-size': 0.42, fill: COLOR_MUTED }));
        g.appendChild(txt(5.5, 10.65, '1 mole de substance X', { 'text-anchor': 'middle', 'font-size': 0.55, fill: COLOR_GOLD, 'font-weight': 700 }));

        // ---- Flèche + libellé ----
        arrow(g, 9.7, 6, 16.0, 6, COLOR_TEXT, 0.1);
        g.appendChild(txt(12.85, 5.25, 'contient', { 'text-anchor': 'middle', 'font-size': 0.4, fill: COLOR_TEXT }));

        // ---- Zoom microscopique à droite ----
        g.appendChild(el('circle', { cx: 21, cy: 6, r: 4.0, fill: COLOR_PANEL, stroke: COLOR_MUTED, 'stroke-width': 0.1, 'stroke-dasharray': '0.28,0.22' }));

        function ring(count, radius, opacity, phase) {
            for (var i = 0; i < count; i++) {
                var a = (2 * Math.PI * i / count) + phase;
                var x = 21 + radius * Math.cos(a);
                var y = 6 + radius * Math.sin(a);
                g.appendChild(el('circle', { cx: x, cy: y, r: 0.15, fill: COLOR_GREEN, opacity: opacity }));
            }
        }
        g.appendChild(el('circle', { cx: 21, cy: 6, r: 0.15, fill: COLOR_GREEN, opacity: 0.9 }));
        ring(6, 1.1, 0.9, 0.2);
        ring(14, 2.3, 0.8, 0.45);
        ring(22, 3.4, 0.62, 0.1);

        g.appendChild(txt(21, 1.5, 'Vue microscopique (zoom)', { 'text-anchor': 'middle', 'font-size': 0.42, fill: COLOR_MUTED }));
        g.appendChild(txt(21, 10.6, 'N = 6,02 × 10²³ entités', { 'text-anchor': 'middle', 'font-size': 0.55, fill: COLOR_GOLD, 'font-weight': 700 }));
        g.appendChild(txt(21, 11.35, "(Nombre d'Avogadro NA)", { 'text-anchor': 'middle', 'font-size': 0.36, fill: COLOR_MUTED }));
    }

    // ============================================================
    // Figure 2 : graphRelation — n(H2O) = m(H2O) / M(H2O)
    // viewBox 0 0 25.2 8.4
    // ============================================================
    function drawGraphRelation() {
        var svg = document.getElementById('graphRelation');
        if (!svg) { return; }
        clearSvg(svg);
        var g = el('g', {});
        svg.appendChild(g);

        // ---- Bécher d'eau (masse) à gauche ----
        g.appendChild(el('path', {
            d: 'M2,1.6 L2,6.1 Q2,6.8 2.7,6.8 L7.3,6.8 Q8,6.8 8,6.1 L8,1.6',
            fill: 'none', stroke: COLOR_MUTED, 'stroke-width': 0.13
        }));
        g.appendChild(el('path', {
            d: 'M2.15,3.6 L2.15,6.0 Q2.15,6.65 2.8,6.65 L7.2,6.65 Q7.85,6.65 7.85,6.0 L7.85,3.6 Z',
            fill: COLOR_GREEN, opacity: 0.22
        }));
        var dots1 = [[3.5,5.2],[4.6,4.4],[5.8,5.0],[6.6,4.3],[4.2,5.7],[6,5.8]];
        dots1.forEach(function (p) { g.appendChild(el('circle', { cx: p[0], cy: p[1], r: 0.2, fill: COLOR_GREEN, opacity: 0.9 })); });
        g.appendChild(txt(5, 1.05, 'Échantillon d\u2019eau (H\u2082O)', { 'text-anchor': 'middle', 'font-size': 0.42, fill: COLOR_MUTED }));
        g.appendChild(txt(5, 7.65, 'masse m(H\u2082O), en g', { 'text-anchor': 'middle', 'font-size': 0.48, fill: COLOR_TEXT, 'font-weight': 700 }));

        // ---- Flèche centrale avec formule ----
        arrow(g, 8.8, 4.2, 15.6, 4.2, COLOR_TEXT, 0.1);
        g.appendChild(txt(12.2, 2.85, 'n(H\u2082O) = m(H\u2082O) / M(H\u2082O)', { 'text-anchor': 'middle', 'font-size': 0.52, fill: COLOR_GOLD, 'font-weight': 700 }));
        g.appendChild(txt(12.2, 5.55, 'M(H\u2082O) = 18 g.mol\u207B\u00B9', { 'text-anchor': 'middle', 'font-size': 0.38, fill: COLOR_MUTED }));

        // ---- Résultat : quantité de matière à droite ----
        g.appendChild(el('rect', { x: 16.6, y: 1.9, width: 6.2, height: 4.4, rx: 0.4, fill: COLOR_PANEL, stroke: COLOR_GOLD, 'stroke-width': 0.1 }));
        g.appendChild(txt(19.7, 3.7, 'n(H\u2082O)', { 'text-anchor': 'middle', 'font-size': 0.62, fill: COLOR_GOLD, 'font-weight': 700 }));
        g.appendChild(txt(19.7, 5.0, 'en mol', { 'text-anchor': 'middle', 'font-size': 0.4, fill: COLOR_MUTED }));
        g.appendChild(txt(19.7, 1.05, 'Quantité de matière', { 'text-anchor': 'middle', 'font-size': 0.42, fill: COLOR_MUTED }));
        g.appendChild(txt(19.7, 7.65, 'résultat en mol', { 'text-anchor': 'middle', 'font-size': 0.38, fill: COLOR_TEXT }));
    }

    // ============================================================
    // Figure 3 : graphCompareMoles — même masse (100 g), n différents
    // viewBox 0 0 12 9
    // ============================================================
    function drawGraphCompareMoles() {
        var svg = document.getElementById('graphCompareMoles');
        if (!svg) { return; }
        clearSvg(svg);
        var g = el('g', {});
        svg.appendChild(g);

        var baseY = 7.0, topY = 1.0, scale = (baseY - topY) / 6; // 6 mol max
        // axe Y
        g.appendChild(el('line', { x1: 1.5, y1: 0.8, x2: 1.5, y2: baseY, stroke: COLOR_MUTED, 'stroke-width': 0.06 }));
        g.appendChild(el('line', { x1: 1.5, y1: baseY, x2: 11.5, y2: baseY, stroke: COLOR_MUTED, 'stroke-width': 0.06 }));
        [0, 2, 4, 6].forEach(function (v) {
            var y = baseY - v * scale;
            g.appendChild(el('line', { x1: 1.5, y1: y, x2: 11.5, y2: y, stroke: COLOR_MUTED, 'stroke-width': 0.03, opacity: 0.3 }));
            g.appendChild(txt(1.2, y + 0.12, String(v), { 'text-anchor': 'end', 'font-size': 0.32, fill: COLOR_MUTED }));
        });
        g.appendChild(txt(1.5, 0.55, 'n (mol)', { 'text-anchor': 'start', 'font-size': 0.34, fill: COLOR_MUTED }));

        // Barre eau
        var nEau = 5.56, nFer = 1.78;
        var barW = 2.8;
        var xEau = 2.97, xFer = 7.24;
        var hEau = nEau * scale, hFer = nFer * scale;
        g.appendChild(el('rect', { x: xEau, y: baseY - hEau, width: barW, height: hEau, fill: COLOR_GREEN, opacity: 0.85, rx: 0.08 }));
        g.appendChild(el('rect', { x: xFer, y: baseY - hFer, width: barW, height: hFer, fill: COLOR_RED, opacity: 0.85, rx: 0.08 }));

        g.appendChild(txt(xEau + barW / 2, baseY - hEau - 0.3, '5,56 mol', { 'text-anchor': 'middle', 'font-size': 0.4, fill: COLOR_GOLD, 'font-weight': 700 }));
        g.appendChild(txt(xFer + barW / 2, baseY - hFer - 0.3, '1,78 mol', { 'text-anchor': 'middle', 'font-size': 0.4, fill: COLOR_GOLD, 'font-weight': 700 }));

        g.appendChild(txt(xEau + barW / 2, baseY + 0.5, 'Eau (H\u2082O)', { 'text-anchor': 'middle', 'font-size': 0.36, fill: COLOR_TEXT, 'font-weight': 700 }));
        g.appendChild(txt(xEau + barW / 2, baseY + 0.9, '100 g', { 'text-anchor': 'middle', 'font-size': 0.32, fill: COLOR_MUTED }));
        g.appendChild(txt(xFer + barW / 2, baseY + 0.5, 'Fer (Fe)', { 'text-anchor': 'middle', 'font-size': 0.36, fill: COLOR_TEXT, 'font-weight': 700 }));
        g.appendChild(txt(xFer + barW / 2, baseY + 0.9, '100 g', { 'text-anchor': 'middle', 'font-size': 0.32, fill: COLOR_MUTED }));
    }

    // ---------- Initialisation ----------
    function initAll() {
        drawGraphMole();
        drawGraphRelation();
        drawGraphCompareMoles();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAll);
    } else {
        initAll();
    }
})();
