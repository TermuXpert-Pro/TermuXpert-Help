/* ============================================================
   figuresvt_p2.js — Figures SVG pour Partie 2
   "Masse volumique et densité"
   Fichier 100% autonome : aucune dépendance externe (pas de svg-utils.js).
   ============================================================ */
(function () {
    'use strict';
    var SVGNS = 'http://www.w3.org/2000/svg';

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
        var headLen = 0.36, headW = 0.19;
        var bx = x2 - ux * headLen, by = y2 - uy * headLen;
        var px = -uy, py = ux;
        var p1 = (bx + px * headW) + ',' + (by + py * headW);
        var p2 = (bx - px * headW) + ',' + (by - py * headW);
        var p3 = x2 + ',' + y2;
        g.appendChild(el('polygon', { points: p1 + ' ' + p2 + ' ' + p3, fill: color }));
    }

    var COLOR_GOLD = '#F4D03F';
    var COLOR_GREEN = '#4ECDC4';
    var COLOR_BLUE = '#4D9DE0';
    var COLOR_PURPLE = '#BB8FCE';
    var COLOR_TEXT = '#E6EDF3';
    var COLOR_MUTED = '#8B949E';
    var COLOR_PANEL = '#161B22';

    // ============================================================
    // Figure 1 : schemaMasseeVolumique — rho = m / V
    // viewBox 0 0 18 9.8
    // ============================================================
    function drawSchemaMasseVolumique() {
        var svg = document.getElementById('schemaMasseeVolumique');
        if (!svg) { return; }
        clearSvg(svg);
        var g = el('g', {});
        svg.appendChild(g);

        // ---- Éprouvette graduée (volume V) ----
        g.appendChild(el('rect', { x: 2, y: 1.0, width: 4, height: 5.3, fill: 'none', stroke: COLOR_MUTED, 'stroke-width': 0.12 }));
        g.appendChild(el('rect', { x: 2.15, y: 3.0, width: 3.7, height: 3.15, fill: COLOR_BLUE, opacity: 0.28 }));
        // graduations
        [2.0, 3.6, 5.2].forEach(function (y) {
            g.appendChild(el('line', { x1: 2, y1: y, x2: 2.5, y2: y, stroke: COLOR_MUTED, 'stroke-width': 0.06 }));
        });
        // bracket du volume V
        g.appendChild(el('line', { x1: 6.5, y1: 3.0, x2: 6.5, y2: 6.3, stroke: COLOR_GOLD, 'stroke-width': 0.07 }));
        g.appendChild(el('line', { x1: 6.3, y1: 3.0, x2: 6.7, y2: 3.0, stroke: COLOR_GOLD, 'stroke-width': 0.07 }));
        g.appendChild(el('line', { x1: 6.3, y1: 6.3, x2: 6.7, y2: 6.3, stroke: COLOR_GOLD, 'stroke-width': 0.07 }));
        g.appendChild(txt(7.1, 4.8, 'V', { 'text-anchor': 'start', 'font-size': 0.5, fill: COLOR_GOLD, 'font-weight': 700 }));
        g.appendChild(txt(4, 6.95, 'Volume V', { 'text-anchor': 'middle', 'font-size': 0.42, fill: COLOR_TEXT }));

        // ---- Icône masse (poids) ----
        g.appendChild(el('path', { d: 'M11.2,2.0 Q11.2,1.1 12,1.1 Q12.8,1.1 12.8,2.0', fill: 'none', stroke: COLOR_MUTED, 'stroke-width': 0.1 }));
        g.appendChild(el('circle', { cx: 12, cy: 3.6, r: 1.65, fill: COLOR_PANEL, stroke: COLOR_MUTED, 'stroke-width': 0.1 }));
        g.appendChild(txt(12, 3.85, 'm', { 'text-anchor': 'middle', 'font-size': 0.75, fill: COLOR_TEXT, 'font-weight': 700 }));
        g.appendChild(txt(12, 6.95, 'masse m', { 'text-anchor': 'middle', 'font-size': 0.42, fill: COLOR_TEXT }));

        // ---- Flèches convergentes vers la formule ----
        arrow(g, 5.3, 7.3, 7.0, 7.75, COLOR_MUTED, 0.06);
        arrow(g, 12, 5.4, 9.7, 7.75, COLOR_MUTED, 0.06);

        // ---- Formule ----
        g.appendChild(el('rect', { x: 5.6, y: 7.75, width: 6.8, height: 1.85, rx: 0.3, fill: COLOR_PANEL, stroke: COLOR_GOLD, 'stroke-width': 0.1 }));
        g.appendChild(txt(9, 8.65, '\u03C1 = m / V', { 'text-anchor': 'middle', 'font-size': 0.6, fill: COLOR_GOLD, 'font-weight': 700 }));
        g.appendChild(txt(9, 9.35, '(g.mL\u207B\u00B9 ou kg.m\u207B\u00B3)', { 'text-anchor': 'middle', 'font-size': 0.32, fill: COLOR_MUTED }));
    }

    // ============================================================
    // Figure 2 : schemaDensite — d = m / m_eau (même volume V)
    // viewBox 0 0 15.5 9.8
    // ============================================================
    function drawSchemaDensite() {
        var svg = document.getElementById('schemaDensite');
        if (!svg) { return; }
        clearSvg(svg);
        var g = el('g', {});
        svg.appendChild(g);

        g.appendChild(txt(7.75, 0.7, 'Même volume V', { 'text-anchor': 'middle', 'font-size': 0.42, fill: COLOR_MUTED }));
        g.appendChild(el('line', { x1: 3.25, y1: 0.95, x2: 11.75, y2: 0.95, stroke: COLOR_MUTED, 'stroke-width': 0.05, 'stroke-dasharray': '0.15,0.15' }));

        // ---- Récipient Eau (référence) ----
        g.appendChild(el('rect', { x: 1.5, y: 1.3, width: 3.5, height: 5.0, fill: 'none', stroke: COLOR_MUTED, 'stroke-width': 0.12 }));
        g.appendChild(el('rect', { x: 1.65, y: 1.45, width: 3.2, height: 4.7, fill: COLOR_BLUE, opacity: 0.4 }));
        g.appendChild(txt(3.25, 4.0, 'Eau', { 'text-anchor': 'middle', 'font-size': 0.46, fill: COLOR_TEXT, 'font-weight': 700 }));
        g.appendChild(txt(3.25, 6.9, 'm\u2091\u2090\u1D64 (référence)', { 'text-anchor': 'middle', 'font-size': 0.36, fill: COLOR_TEXT }));

        // ---- Récipient substance X ----
        g.appendChild(el('rect', { x: 10.5, y: 1.3, width: 3.5, height: 5.0, fill: 'none', stroke: COLOR_MUTED, 'stroke-width': 0.12 }));
        g.appendChild(el('rect', { x: 10.65, y: 1.45, width: 3.2, height: 4.7, fill: COLOR_PURPLE, opacity: 0.4 }));
        g.appendChild(txt(12.25, 4.0, 'X', { 'text-anchor': 'middle', 'font-size': 0.46, fill: COLOR_TEXT, 'font-weight': 700 }));
        g.appendChild(txt(12.25, 6.9, 'm (substance)', { 'text-anchor': 'middle', 'font-size': 0.36, fill: COLOR_TEXT }));

        // ---- Flèches vers la formule ----
        arrow(g, 3.6, 6.9, 5.3, 7.6, COLOR_MUTED, 0.06);
        arrow(g, 11.9, 6.9, 10.2, 7.6, COLOR_MUTED, 0.06);

        // ---- Formule ----
        g.appendChild(el('rect', { x: 4.2, y: 7.6, width: 7.1, height: 1.85, rx: 0.3, fill: COLOR_PANEL, stroke: COLOR_GOLD, 'stroke-width': 0.1 }));
        g.appendChild(txt(7.75, 8.5, 'd = m / m\u2091\u2090\u1D64', { 'text-anchor': 'middle', 'font-size': 0.55, fill: COLOR_GOLD, 'font-weight': 700 }));
        g.appendChild(txt(7.75, 9.2, '(nombre sans unité)', { 'text-anchor': 'middle', 'font-size': 0.3, fill: COLOR_MUTED }));
    }

    function initAll() {
        drawSchemaMasseVolumique();
        drawSchemaDensite();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAll);
    } else {
        initAll();
    }
})();

