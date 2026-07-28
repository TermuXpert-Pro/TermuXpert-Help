/* ============================================================
   figuresvt_p2.js
   Figures SVG — Partie 2 : Variation de Epp - État de référence - Relation W(P)
   Fichier autonome (aucune dépendance externe / aucune librairie partagée).
   ============================================================ */
(function () {
    'use strict';

    var SVG_NS = 'http://www.w3.org/2000/svg';

    /* ---------- Helpers internes (propres à ce fichier) ---------- */

    function el(tag, attrs) {
        var e = document.createElementNS(SVG_NS, tag);
        for (var k in attrs) {
            if (Object.prototype.hasOwnProperty.call(attrs, k)) {
                e.setAttribute(k, attrs[k]);
            }
        }
        return e;
    }

    function text(x, y, str, attrs) {
        var t = el('text', Object.assign({ x: x, y: y, 'font-family': 'Arial, sans-serif' }, attrs || {}));
        t.textContent = str;
        return t;
    }

    function line(x1, y1, x2, y2, attrs) {
        return el('line', Object.assign({ x1: x1, y1: y1, x2: x2, y2: y2 }, attrs || {}));
    }

    function arrowHead(x, y, dir, color, size) {
        // dir: 'up' | 'down'
        size = size || 6;
        var g = el('g', {});
        if (dir === 'up') {
            g.appendChild(line(x, y, x - size * 0.7, y + size, { stroke: color, 'stroke-width': 2, 'stroke-linecap': 'round' }));
            g.appendChild(line(x, y, x + size * 0.7, y + size, { stroke: color, 'stroke-width': 2, 'stroke-linecap': 'round' }));
        } else {
            g.appendChild(line(x, y, x - size * 0.7, y - size, { stroke: color, 'stroke-width': 2, 'stroke-linecap': 'round' }));
            g.appendChild(line(x, y, x + size * 0.7, y - size, { stroke: color, 'stroke-width': 2, 'stroke-linecap': 'round' }));
        }
        return g;
    }

    function background(svg, w, h) {
        svg.appendChild(el('rect', { x: 0, y: 0, width: w, height: h, fill: '#0D1117' }));
    }

    function clear(svg) {
        while (svg.firstChild) svg.removeChild(svg.firstChild);
    }

    var COLORS = {
        red: '#FF6B6B',
        teal: '#4ECDC4',
        gold: '#F4D03F',
        purple: '#BB8FCE',
        yellow: '#FFD93D',
        green: '#A8FF78',
        muted: '#888888',
        line: '#2A2A3E',
        white: '#FFFFFF'
    };

    /* ============================================================
       Figure 1 : graphReference
       État de référence : point M (altitude z) au-dessus du niveau
       de référence zref (Epp = 0). h = z - zref.
       ============================================================ */
    function drawGraphReference() {
        var svg = document.getElementById('graphReference');
        if (!svg) return;
        var w = 400, h = 200;
        clear(svg);
        svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
        background(svg, w, h);

        var groundY = 175;
        var cx = w / 2 - 40;

        // Sol
        svg.appendChild(el('rect', { x: 0, y: groundY, width: w, height: h - groundY, fill: COLORS.line }));
        svg.appendChild(text(15, groundY + 14, 'Sol', { fill: COLORS.muted, 'font-size': 10 }));

        // Axe vertical Oz
        svg.appendChild(line(cx, groundY, cx, 20, { stroke: COLORS.teal, 'stroke-width': 2 }));
        svg.appendChild(arrowHead(cx, 20, 'up', COLORS.teal, 6));
        svg.appendChild(text(cx + 10, 26, 'z', { fill: COLORS.teal, 'font-size': 13, 'font-style': 'italic', 'font-weight': 'bold' }));

        // Ligne de référence zref (pointillé jaune) — état où Epp = 0
        var yRef = groundY - 55;
        svg.appendChild(line(cx - 45, yRef, cx + 95, yRef, { stroke: COLORS.gold, 'stroke-width': 2, 'stroke-dasharray': '6,4' }));
        svg.appendChild(text(cx + 100, yRef + 4, 'z = z_réf', { fill: COLORS.gold, 'font-size': 11 }));
        svg.appendChild(text(cx + 100, yRef + 18, '(Epp = 0)', { fill: COLORS.white, 'font-size': 10 }));
        svg.appendChild(text(cx + 55, yRef - 6, 'Epp = 0', { fill: COLORS.green, 'font-size': 10 }));

        // Point M au-dessus (altitude z)
        var yM = groundY - 120;
        svg.appendChild(el('circle', { cx: cx - 55, cy: yM, r: 5, fill: COLORS.red }));
        svg.appendChild(text(cx - 100, yM - 10, 'M (z)', { fill: COLORS.white, 'font-size': 11, 'font-weight': 'bold' }));
        svg.appendChild(text(cx - 30, yM - 6, 'Epp > 0', { fill: COLORS.red, 'font-size': 10 }));

        // Flèche h = z - zref entre zref et M
        var arrowX = cx - 30;
        svg.appendChild(line(arrowX, yRef, arrowX, yM, { stroke: COLORS.yellow, 'stroke-width': 1.5 }));
        svg.appendChild(arrowHead(arrowX, yM, 'up', COLORS.yellow, 5));
        svg.appendChild(arrowHead(arrowX, yRef, 'down', COLORS.yellow, 5));
        svg.appendChild(text(cx - 95, (yRef + yM) / 2 + 4, 'h = z - z_réf', { fill: COLORS.muted, 'font-size': 9.5 }));
    }

    /* ============================================================
       Figure 2 : graphVariation
       Variation de Epp entre A (zA, bas) et B (zB, haut).
       Δz = zB - zA > 0  ⇒  ΔEpp > 0
       ============================================================ */
    function drawGraphVariation() {
        var svg = document.getElementById('graphVariation');
        if (!svg) return;
        var w = 400, h = 200;
        clear(svg);
        svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
        background(svg, w, h);

        var groundY = 175;
        var cx = w / 2 - 30;

        // Sol
        svg.appendChild(el('rect', { x: 0, y: groundY, width: w, height: h - groundY, fill: COLORS.line }));
        svg.appendChild(text(15, groundY + 14, 'Sol', { fill: COLORS.muted, 'font-size': 10 }));

        // Axe vertical Oz
        svg.appendChild(line(cx, groundY, cx, 20, { stroke: COLORS.teal, 'stroke-width': 2 }));
        svg.appendChild(arrowHead(cx, 20, 'up', COLORS.teal, 6));
        svg.appendChild(text(cx + 10, 26, 'z', { fill: COLORS.teal, 'font-size': 13, 'font-style': 'italic', 'font-weight': 'bold' }));

        // Point A (bas)
        var yA = groundY - 55;
        svg.appendChild(el('circle', { cx: cx - 55, cy: yA, r: 5, fill: COLORS.teal }));
        svg.appendChild(text(cx - 100, yA - 10, 'A (z\u2090)', { fill: COLORS.white, 'font-size': 11, 'font-weight': 'bold' }));

        // Point B (haut)
        var yB = groundY - 130;
        svg.appendChild(el('circle', { cx: cx - 55, cy: yB, r: 5, fill: COLORS.gold }));
        svg.appendChild(text(cx - 100, yB - 10, 'B (z\u1D66)', { fill: COLORS.white, 'font-size': 11, 'font-weight': 'bold' }));

        // Flèche de variation Δz (montée de A vers B)
        var arrowX = cx - 25;
        svg.appendChild(line(arrowX, yA, arrowX, yB, { stroke: COLORS.yellow, 'stroke-width': 2 }));
        svg.appendChild(arrowHead(arrowX, yB, 'up', COLORS.yellow, 6));
        svg.appendChild(text(cx - 20, (yA + yB) / 2, 'Δz = z\u1D66 - z\u2090 > 0', { fill: COLORS.yellow, 'font-size': 10 }));

        // Étiquette résultat
        svg.appendChild(text(18, 25, 'ΔEpp = mg(z\u1D66 - z\u2090) > 0', { fill: COLORS.red, 'font-size': 12, 'font-weight': 'bold' }));
    }

    /* ============================================================
       Figure 3 : graphRelation
       Relation ΔEpp = -W(P) : chute de A (haut) vers B (bas),
       poids P orienté vers le bas.
       ============================================================ */
    function drawGraphRelation() {
        var svg = document.getElementById('graphRelation');
        if (!svg) return;
        var w = 400, h = 200;
        clear(svg);
        svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
        background(svg, w, h);

        var groundY = 175;
        var cx = w / 2 - 60;

        // Sol
        svg.appendChild(el('rect', { x: 0, y: groundY, width: w, height: h - groundY, fill: COLORS.line }));
        svg.appendChild(text(15, groundY + 14, 'Sol', { fill: COLORS.muted, 'font-size': 10 }));

        // Axe vertical Oz
        svg.appendChild(line(cx, groundY, cx, 20, { stroke: COLORS.teal, 'stroke-width': 2 }));
        svg.appendChild(arrowHead(cx, 20, 'up', COLORS.teal, 6));
        svg.appendChild(text(cx + 10, 26, 'z', { fill: COLORS.teal, 'font-size': 13, 'font-style': 'italic', 'font-weight': 'bold' }));

        // Point A (en haut, avant la chute)
        var yA = groundY - 125;
        svg.appendChild(el('circle', { cx: cx - 35, cy: yA, r: 5, fill: COLORS.teal }));
        svg.appendChild(text(cx - 55, yA - 10, 'A', { fill: COLORS.white, 'font-size': 12, 'font-weight': 'bold' }));

        // Point B (en bas, après la chute)
        var yB = groundY - 45;
        svg.appendChild(el('circle', { cx: cx - 35, cy: yB, r: 5, fill: COLORS.gold }));
        svg.appendChild(text(cx - 55, yB + 18, 'B', { fill: COLORS.white, 'font-size': 12, 'font-weight': 'bold' }));

        // Flèche du poids P (verticale, orientée vers le bas, de A vers B)
        var arrowX = cx + 30;
        svg.appendChild(line(arrowX, yA, arrowX, yB, { stroke: COLORS.red, 'stroke-width': 2.5 }));
        svg.appendChild(arrowHead(arrowX, yB, 'down', COLORS.red, 7));
        svg.appendChild(text(arrowX + 10, (yA + yB) / 2, 'P', { fill: COLORS.red, 'font-size': 13, 'font-style': 'italic', 'font-weight': 'bold' }));

        // Trajectoire pointillée reliant A à B (chute)
        svg.appendChild(line(cx - 35, yA + 6, cx - 35, yB - 6, { stroke: COLORS.muted, 'stroke-width': 1, 'stroke-dasharray': '3,3' }));

        // Étiquettes de résultat (en haut à gauche, hors de la zone du dessin)
        svg.appendChild(text(150, 25, 'Epp(A) > Epp(B)', { fill: COLORS.gold, 'font-size': 11, 'font-weight': 'bold' }));
        svg.appendChild(text(150, 42, 'W(P) = Epp(A) - Epp(B) > 0', { fill: COLORS.red, 'font-size': 11, 'font-weight': 'bold' }));
        svg.appendChild(text(150, 59, 'ΔEpp = -W(P)', { fill: COLORS.muted, 'font-size': 10 }));
    }

    /* ---------- Initialisation ---------- */
    function initAll() {
        drawGraphReference();
        drawGraphVariation();
        drawGraphRelation();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAll);
    } else {
        initAll();
    }
})();
