/* ============================================================
   figuresvt_p3.js — Figures SVG pour Partie 3
   "Les gaz : Boyle-Mariotte, gaz parfaits, volume molaire"
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
        var headLen = 0.32, headW = 0.17;
        var bx = x2 - ux * headLen, by = y2 - uy * headLen;
        var px = -uy, py = ux;
        var p1 = (bx + px * headW) + ',' + (by + py * headW);
        var p2 = (bx - px * headW) + ',' + (by - py * headW);
        var p3 = x2 + ',' + y2;
        g.appendChild(el('polygon', { points: p1 + ' ' + p2 + ' ' + p3, fill: color }));
    }

    var COLOR_GOLD = '#F4D03F';
    var COLOR_GREEN = '#4ECDC4';
    var COLOR_RED = '#FF6B6B';
    var COLOR_PURPLE = '#BB8FCE';
    var COLOR_BLUE = '#4D9DE0';
    var COLOR_TEXT = '#E6EDF3';
    var COLOR_MUTED = '#8B949E';
    var COLOR_PANEL = '#161B22';

    // ============================================================
    // Figure 1 : schemaBoyle — seringue + manomètre, V diminue -> P augmente
    // viewBox 0 0 20 8.8
    // ============================================================
    function drawSchemaBoyle() {
        var svg = document.getElementById('schemaBoyle');
        if (!svg) { return; }
        clearSvg(svg);
        var g = el('g', {});
        svg.appendChild(g);

        function manometer(cx, cy, needleAngleDeg, pressureLabel) {
            g.appendChild(el('circle', { cx: cx, cy: cy, r: 0.85, fill: COLOR_PANEL, stroke: COLOR_MUTED, 'stroke-width': 0.09 }));
            var rad = needleAngleDeg * Math.PI / 180;
            var nx = cx + 0.62 * Math.cos(rad);
            var ny = cy + 0.62 * Math.sin(rad);
            g.appendChild(el('line', { x1: cx, y1: cy, x2: nx, y2: ny, stroke: COLOR_RED, 'stroke-width': 0.08 }));
            g.appendChild(el('circle', { cx: cx, cy: cy, r: 0.08, fill: COLOR_RED }));
            g.appendChild(txt(cx, cy + 1.35, pressureLabel, { 'text-anchor': 'middle', 'font-size': 0.36, fill: COLOR_TEXT, 'font-weight': 700 }));
        }

        function syringe(xStart, gasWidth, dotCount, dotR) {
            var barrelW = 6.6, barrelH = 2.2, y0 = 3.9;
            // corps de la seringue
            g.appendChild(el('rect', { x: xStart, y: y0, width: barrelW, height: barrelH, rx: 0.15, fill: 'none', stroke: COLOR_MUTED, 'stroke-width': 0.1 }));
            // gaz (zone comprimée ou détendue)
            g.appendChild(el('rect', { x: xStart + 0.12, y: y0 + 0.12, width: gasWidth, height: barrelH - 0.24, fill: COLOR_GREEN, opacity: 0.14 }));
            // molécules de gaz réparties dans la largeur gasWidth (grille régulière)
            var cols = Math.ceil(Math.sqrt(dotCount * (gasWidth / barrelH)));
            var rows = Math.ceil(dotCount / cols);
            var idx = 0;
            for (var r = 0; r < rows && idx < dotCount; r++) {
                for (var c = 0; c < cols && idx < dotCount; c++) {
                    var px = xStart + 0.4 + (gasWidth - 0.8) * (cols === 1 ? 0.5 : c / (cols - 1));
                    var py = y0 + 0.45 + (barrelH - 0.9) * (rows === 1 ? 0.5 : r / (rows - 1));
                    g.appendChild(el('circle', { cx: px, cy: py, r: dotR, fill: COLOR_GREEN, opacity: 0.85 }));
                    idx++;
                }
            }
            // piston
            var pistonX = xStart + gasWidth + 0.2;
            g.appendChild(el('rect', { x: pistonX, y: y0 - 0.15, width: 0.22, height: barrelH + 0.3, fill: COLOR_MUTED }));
            // tige + poignée
            g.appendChild(el('line', { x1: pistonX + 0.22, y1: y0 + barrelH / 2, x2: xStart + barrelW + 0.7, y2: y0 + barrelH / 2, stroke: COLOR_MUTED, 'stroke-width': 0.09 }));
            g.appendChild(el('rect', { x: xStart + barrelW + 0.55, y: y0 + barrelH / 2 - 0.5, width: 0.22, height: 1.0, fill: COLOR_MUTED }));
            // tube vers le manomètre
            g.appendChild(el('line', { x1: xStart + 0.3, y1: y0, x2: xStart + 0.3, y2: y0 - 1.0, stroke: COLOR_MUTED, 'stroke-width': 0.08 }));
        }

        // ---- État 1 : grand volume, pression faible ----
        manometer(2.3, 1.7, 200, '');
        syringe(1.0, 4.6, 10, 0.14);
        g.appendChild(txt(4.8, 7.2, 'État 1 : grand volume', { 'text-anchor': 'middle', 'font-size': 0.44, fill: COLOR_GOLD, 'font-weight': 700 }));
        g.appendChild(txt(4.8, 7.75, 'Pression P\u2081 faible', { 'text-anchor': 'middle', 'font-size': 0.36, fill: COLOR_MUTED }));

        // ---- Flèche centrale ----
        arrow(g, 9.9, 5.0, 12.3, 5.0, COLOR_TEXT, 0.09);
        g.appendChild(txt(11.1, 4.35, 'on comprime', { 'text-anchor': 'middle', 'font-size': 0.38, fill: COLOR_TEXT }));

        // ---- État 2 : volume réduit, pression élevée ----
        manometer(14.6, 1.7, -20, '');
        syringe(13.3, 1.8, 10, 0.14);
        g.appendChild(txt(17.1, 7.2, 'État 2 : volume réduit', { 'text-anchor': 'middle', 'font-size': 0.44, fill: COLOR_GOLD, 'font-weight': 700 }));
        g.appendChild(txt(17.1, 7.75, 'Pression P\u2082 élevée', { 'text-anchor': 'middle', 'font-size': 0.36, fill: COLOR_MUTED }));
    }

    // ============================================================
    // Figure 2 : graphBoyle — courbe P = f(V), P.V = 10 (bar.L)
    // viewBox 0 0 14.2 6.8
    // ============================================================
    function drawGraphBoyle() {
        var svg = document.getElementById('graphBoyle');
        if (!svg) { return; }
        clearSvg(svg);
        var g = el('g', {});
        svg.appendChild(g);

        var x0 = 2.0, xMaxV = 11, yBase = 6.0, yMaxP = 5, plotW = 11, plotH = 5;
        function svgX(v) { return x0 + v * (plotW / xMaxV); }
        function svgY(p) { return yBase - p * (plotH / yMaxP); }

        // axes
        g.appendChild(el('line', { x1: x0, y1: 0.6, x2: x0, y2: yBase, stroke: COLOR_MUTED, 'stroke-width': 0.05 }));
        g.appendChild(el('line', { x1: x0, y1: yBase, x2: x0 + plotW + 0.4, y2: yBase, stroke: COLOR_MUTED, 'stroke-width': 0.05 }));

        [0, 2, 4, 6, 8, 10].forEach(function (v) {
            var x = svgX(v);
            g.appendChild(el('line', { x1: x, y1: yBase, x2: x, y2: yBase + 0.12, stroke: COLOR_MUTED, 'stroke-width': 0.04 }));
            g.appendChild(txt(x, yBase + 0.42, String(v), { 'text-anchor': 'middle', 'font-size': 0.3, fill: COLOR_MUTED }));
        });
        [0, 1, 2, 3, 4, 5].forEach(function (p) {
            var y = svgY(p);
            g.appendChild(el('line', { x1: x0 - 0.12, y1: y, x2: x0, y2: y, stroke: COLOR_MUTED, 'stroke-width': 0.04 }));
            if (p > 0) { g.appendChild(el('line', { x1: x0, y1: y, x2: x0 + plotW + 0.4, y2: y, stroke: COLOR_MUTED, 'stroke-width': 0.025, opacity: 0.25 })); }
            g.appendChild(txt(x0 - 0.25, y + 0.1, String(p), { 'text-anchor': 'end', 'font-size': 0.3, fill: COLOR_MUTED }));
        });
        g.appendChild(txt(x0 + plotW + 0.4, yBase + 0.55, 'V (L)', { 'text-anchor': 'end', 'font-size': 0.36, fill: COLOR_TEXT, 'font-weight': 700 }));
        g.appendChild(txt(x0 - 0.25, 0.55, 'P (bar)', { 'text-anchor': 'start', 'font-size': 0.36, fill: COLOR_TEXT, 'font-weight': 700 }));

        // courbe P = 10 / V pour V de 2 à 11 (domaine où P <= 5)
        var pts = [];
        for (var v = 2.0; v <= 11.001; v += 0.25) {
            var p = 10 / v;
            pts.push(svgX(v) + ',' + svgY(p));
        }
        g.appendChild(el('polyline', { points: pts.join(' '), fill: 'none', stroke: COLOR_GREEN, 'stroke-width': 0.09 }));

        // points du tableau
        var table = [[10.0, 1], [5.00, 2], [3.33, 3], [2.50, 4]];
        table.forEach(function (row) {
            var cx = svgX(row[0]), cy = svgY(row[1]);
            g.appendChild(el('circle', { cx: cx, cy: cy, r: 0.11, fill: COLOR_GOLD }));
        });

        g.appendChild(txt(svgX(6.5), svgY(4.6), 'P \u00D7 V = 10 (bar.L)', { 'text-anchor': 'middle', 'font-size': 0.36, fill: COLOR_GOLD, 'font-weight': 700 }));
    }

    // ============================================================
    // Figure 3 : graphAvogadro — même Vm pour tous les gaz
    // viewBox 0 0 18 10
    // ============================================================
    function drawGraphAvogadro() {
        var svg = document.getElementById('graphAvogadro');
        if (!svg) { return; }
        clearSvg(svg);
        var g = el('g', {});
        svg.appendChild(g);

        g.appendChild(txt(9, 0.8, 'Mêmes conditions : même température T, même pression P', { 'text-anchor': 'middle', 'font-size': 0.4, fill: COLOR_MUTED }));
        g.appendChild(el('line', { x1: 2.2, y1: 1.6, x2: 15.8, y2: 1.6, stroke: COLOR_GOLD, 'stroke-width': 0.05, 'stroke-dasharray': '0.16,0.16' }));
        g.appendChild(txt(9, 1.35, 'V\u2081 = V\u2082 = V\u2083 = V\u2098', { 'text-anchor': 'middle', 'font-size': 0.34, fill: COLOR_GOLD }));

        var gases = [
            { cx: 3.5, formula: 'O\u2082', M: '32 g.mol\u207B\u00B9', color: COLOR_BLUE, diatomic: true },
            { cx: 9.0, formula: 'N\u2082', M: '28 g.mol\u207B\u00B9', color: COLOR_GREEN, diatomic: true },
            { cx: 14.5, formula: 'He', M: '4 g.mol\u207B\u00B9', color: COLOR_PURPLE, diatomic: false }
        ];

        gases.forEach(function (gas) {
            var w = 3.0, h = 4.0, x = gas.cx - w / 2, y = 2.0;
            g.appendChild(el('rect', { x: x, y: y, width: w, height: h, rx: 0.35, fill: COLOR_PANEL, stroke: COLOR_MUTED, 'stroke-width': 0.08 }));

            // molécules à l'intérieur (motif régulier, non aléatoire)
            if (gas.diatomic) {
                var pairs = [[gas.cx - 0.9, 2.9], [gas.cx + 0.7, 3.3], [gas.cx - 0.3, 4.2], [gas.cx + 0.9, 4.9], [gas.cx - 0.9, 5.3]];
                pairs.forEach(function (p) {
                    g.appendChild(el('line', { x1: p[0] - 0.22, y1: p[1], x2: p[0] + 0.22, y2: p[1], stroke: gas.color, 'stroke-width': 0.1 }));
                    g.appendChild(el('circle', { cx: p[0] - 0.22, cy: p[1], r: 0.17, fill: gas.color }));
                    g.appendChild(el('circle', { cx: p[0] + 0.22, cy: p[1], r: 0.17, fill: gas.color }));
                });
            } else {
                var atoms = [[gas.cx - 0.9, 2.9], [gas.cx + 0.6, 3.2], [gas.cx - 0.2, 3.9], [gas.cx + 0.9, 4.4], [gas.cx - 0.8, 4.7], [gas.cx + 0.3, 5.2], [gas.cx - 0.3, 5.6]];
                atoms.forEach(function (p) {
                    g.appendChild(el('circle', { cx: p[0], cy: p[1], r: 0.19, fill: gas.color }));
                });
            }

            g.appendChild(txt(gas.cx, 6.7, gas.formula, { 'text-anchor': 'middle', 'font-size': 0.55, fill: COLOR_TEXT, 'font-weight': 700 }));
            g.appendChild(txt(gas.cx, 7.35, 'M = ' + gas.M, { 'text-anchor': 'middle', 'font-size': 0.36, fill: COLOR_MUTED }));
            g.appendChild(txt(gas.cx, 7.8, 'n = 1 mol', { 'text-anchor': 'middle', 'font-size': 0.32, fill: COLOR_MUTED }));
        });

        g.appendChild(txt(9, 9.3, 'Même volume molaire V\u2098 pour les 3 gaz', { 'text-anchor': 'middle', 'font-size': 0.46, fill: COLOR_GOLD, 'font-weight': 700 }));
    }

    function initAll() {
        drawSchemaBoyle();
        drawGraphBoyle();
        drawGraphAvogadro();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAll);
    } else {
        initAll();
    }
})();

