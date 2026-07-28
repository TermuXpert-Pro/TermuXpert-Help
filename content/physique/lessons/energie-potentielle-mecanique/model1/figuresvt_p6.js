/* ============================================================
   figuresvt_p6.js
   Figures SVG — Partie 6 : Résumé complet
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

    function arrowHead(x, y, angleDeg, color, size) {
        size = size || 6;
        var rad = angleDeg * Math.PI / 180;
        var back = rad + Math.PI;
        var a1 = back - 0.4, a2 = back + 0.4;
        var p1x = x + size * Math.cos(a1), p1y = y + size * Math.sin(a1);
        var p2x = x + size * Math.cos(a2), p2y = y + size * Math.sin(a2);
        return el('polygon', { points: x + ',' + y + ' ' + p1x + ',' + p1y + ' ' + p2x + ',' + p2y, fill: color });
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
        yellow: '#FFD93D',
        muted: '#888888',
        line: '#2A2A3E',
        white: '#FFFFFF'
    };

    /* ============================================================
       Figure : graphResume
       Synthèse visuelle de la conservation de l'énergie mécanique :
       chute de A (haut) vers B (bas), Epp(A) > Epp(B), Ec(A) < Ec(B),
       Em(A) = Em(B) = constante.
       ============================================================ */
    function drawGraphResume() {
        var svg = document.getElementById('graphResume');
        if (!svg) return;
        var w = 400, h = 200;
        clear(svg);
        svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
        background(svg, w, h);

        var groundY = 175;
        var cx = w / 2 + 10;

        // Sol
        svg.appendChild(el('rect', { x: 0, y: groundY, width: w, height: h - groundY, fill: COLORS.line }));
        svg.appendChild(text(15, groundY + 14, 'Sol', { fill: COLORS.muted, 'font-size': 10 }));

        // Axe vertical Oz
        svg.appendChild(line(cx, groundY, cx, 20, { stroke: COLORS.teal, 'stroke-width': 2 }));
        svg.appendChild(arrowHead(cx, 20, -90, COLORS.teal, 6));
        svg.appendChild(text(cx + 10, 26, 'z', { fill: COLORS.teal, 'font-size': 13, 'font-style': 'italic', 'font-weight': 'bold' }));

        // Point A (en haut de la chute)
        var yA = groundY - 120;
        svg.appendChild(el('circle', { cx: cx - 45, cy: yA, r: 5, fill: COLORS.teal }));
        svg.appendChild(text(cx - 90, yA - 10, 'A (z\u2090)', { fill: COLORS.white, 'font-size': 11, 'font-weight': 'bold' }));

        // Point B (en bas de la chute)
        var yB = groundY - 45;
        svg.appendChild(el('circle', { cx: cx - 45, cy: yB, r: 5, fill: COLORS.gold }));
        svg.appendChild(text(cx - 90, yB + 18, 'B (z\u1D66)', { fill: COLORS.white, 'font-size': 11, 'font-weight': 'bold' }));

        // Trajectoire pointillée A -> B
        svg.appendChild(line(cx - 45, yA + 6, cx - 45, yB - 6, { stroke: COLORS.muted, 'stroke-width': 1, 'stroke-dasharray': '3,3' }));

        // Vecteur poids P
        var px = cx + 10;
        svg.appendChild(line(px, yA, px, yB, { stroke: COLORS.red, 'stroke-width': 2.5 }));
        svg.appendChild(arrowHead(px, yB, 90, COLORS.red, 7));
        svg.appendChild(text(px + 8, (yA + yB) / 2, 'P', { fill: COLORS.red, 'font-size': 13, 'font-style': 'italic', 'font-weight': 'bold' }));

        // Ligne pointillée "Em = constante"
        var emY = yA + 30;
        svg.appendChild(line(cx - 90, emY, cx + 90, emY, { stroke: COLORS.yellow, 'stroke-width': 1.5, 'stroke-dasharray': '4,4' }));
        svg.appendChild(text(cx + 95, emY + 4, 'Em = constante', { fill: COLORS.yellow, 'font-size': 9.5 }));

        // Étiquettes de synthèse
        svg.appendChild(text(20, 25, 'Epp(A) > Epp(B)', { fill: COLORS.gold, 'font-size': 11, 'font-weight': 'bold' }));
        svg.appendChild(text(20, 42, 'Ec(A) < Ec(B)', { fill: COLORS.teal, 'font-size': 11, 'font-weight': 'bold' }));
        svg.appendChild(text(20, 59, 'Em(A) = Em(B)', { fill: COLORS.yellow, 'font-size': 11, 'font-weight': 'bold' }));
        svg.appendChild(text(20, 76, "Conservation de l'énergie mécanique", { fill: COLORS.muted, 'font-size': 9.5 }));
    }

    /* ---------- Initialisation ---------- */
    function initAll() {
        drawGraphResume();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAll);
    } else {
        initAll();
    }
})();
