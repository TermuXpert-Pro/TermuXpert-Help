/* ============================================================
   figuresvt_p4.js — Partie 4 : Période - Fréquence - Mouvement uniforme
   Fichier autonome (aucune dépendance externe / aucun import partagé).
   ============================================================ */
(function () {
    'use strict';

    var NS = 'http://www.w3.org/2000/svg';

    function el(tag, attrs) {
        var e = document.createElementNS(NS, tag);
        for (var k in attrs) {
            if (Object.prototype.hasOwnProperty.call(attrs, k)) {
                e.setAttribute(k, attrs[k]);
            }
        }
        return e;
    }

    function txt(x, y, str, attrs) {
        var a = Object.assign({ x: x, y: y, 'font-family': "'Tajawal','Cairo',Arial,sans-serif" }, attrs || {});
        var t = el('text', a);
        t.textContent = str;
        return t;
    }

    function polar(cx, cy, r, deg) {
        var rad = deg * Math.PI / 180;
        return { x: cx + r * Math.cos(rad), y: cy - r * Math.sin(rad) };
    }

    function arcPath(cx, cy, r, deg1, deg2) {
        var p1 = polar(cx, cy, r, deg1);
        var p2 = polar(cx, cy, r, deg2);
        var diff = deg2 - deg1;
        var large = Math.abs(diff) > 180 ? 1 : 0;
        var sweep = diff > 0 ? 0 : 1;
        return 'M ' + p1.x.toFixed(2) + ',' + p1.y.toFixed(2) +
            ' A ' + r + ',' + r + ' 0 ' + large + ',' + sweep + ' ' +
            p2.x.toFixed(2) + ',' + p2.y.toFixed(2);
    }

    function addArrow(defs, id, color) {
        var m = el('marker', { id: id, markerWidth: 7, markerHeight: 7, refX: 5.5, refY: 3, orient: 'auto', markerUnits: 'strokeWidth' });
        var p = el('path', { d: 'M0,0 L6,3 L0,6 Z', fill: color });
        m.appendChild(p);
        defs.appendChild(m);
    }

    function clearSvg(svg) {
        while (svg.firstChild) svg.removeChild(svg.firstChild);
        svg.setAttribute('viewBox', '0 0 400 260');
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    }

    /* ------------------------------------------------------------
       Figure 1 : graphPeriode
       Un tour complet (2π) effectué pendant la durée T, avec une
       frise chronologique en dessous marquant le début et la fin du tour.
       ------------------------------------------------------------ */
    function drawGraphPeriode() {
        var svg = document.getElementById('graphPeriode');
        if (!svg) return;
        clearSvg(svg);

        var defs = el('defs');
        addArrow(defs, 'p4p_arrowGold', '#F4D03F');
        addArrow(defs, 'p4p_arrowTeal', '#4ECDC4');
        svg.appendChild(defs);

        var cx = 175, cy = 100, r = 68;

        svg.appendChild(el('circle', { cx: cx, cy: cy, r: r, fill: 'none', stroke: '#4ECDC4', 'stroke-width': 1.4, opacity: 0.5 }));
        svg.appendChild(el('circle', { cx: cx, cy: cy, r: 3, fill: '#E8E8E8' }));

        // Tour presque complet (359°) pour représenter "un tour" avec une pointe de flèche
        svg.appendChild(el('path', { d: arcPath(cx, cy, r, 90, 90 - 358), fill: 'none', stroke: '#F4D03F', 'stroke-width': 3, 'marker-end': 'url(#p4p_arrowGold)' }));

        // Point M au départ = point d'arrivée (haut du cercle)
        var start = polar(cx, cy, r, 90);
        svg.appendChild(el('circle', { cx: start.x, cy: start.y, r: 4.5, fill: '#4ECDC4' }));
        svg.appendChild(txt(start.x + 8, start.y - 4, 'M (départ = arrivée)', { 'font-size': 9.5, fill: '#4ECDC4', 'font-weight': '700' }));

        svg.appendChild(txt(cx - 14, cy + 4, '2π', { 'font-size': 13, fill: '#F4D03F', 'font-weight': '700' }));

        // Frise chronologique en dessous
        var lineY = 208, xStart = 60, xEnd = 340;
        svg.appendChild(el('line', { x1: xStart, y1: lineY, x2: xEnd, y2: lineY, stroke: '#9aa0a6', 'stroke-width': 1.4 }));
        svg.appendChild(el('line', { x1: xStart, y1: lineY - 6, x2: xStart, y2: lineY + 6, stroke: '#9aa0a6', 'stroke-width': 1.4 }));
        svg.appendChild(el('line', { x1: xEnd, y1: lineY - 6, x2: xEnd, y2: lineY + 6, stroke: '#9aa0a6', 'stroke-width': 1.4 }));
        svg.appendChild(txt(xStart - 4, lineY + 20, 't₀ = 0', { 'font-size': 10, fill: '#9aa0a6' }));
        svg.appendChild(txt(xEnd - 8, lineY + 20, 't₀ + T', { 'font-size': 10, fill: '#9aa0a6' }));

        // Accolade T au-dessus de la frise
        var midX = (xStart + xEnd) / 2;
        svg.appendChild(el('path', {
            d: 'M ' + xStart + ',' + (lineY - 14) + ' Q ' + midX + ',' + (lineY - 26) + ' ' + xEnd + ',' + (lineY - 14),
            fill: 'none', stroke: '#F4D03F', 'stroke-width': 1.4
        }));
        svg.appendChild(txt(midX - 6, lineY - 30, 'T', { 'font-size': 14, fill: '#F4D03F', 'font-weight': '700' }));

        svg.appendChild(txt(20, 246, 'T : durée d\'un tour complet (Δθ = 2π rad)', { 'font-size': 10, fill: '#B8860B', 'font-weight': '700' }));
    }

    /* ------------------------------------------------------------
       Figure 2 : graphUniforme
       θ = f(t) pour un mouvement uniforme : exemple numérique
       ω = 2 rad/s, θ0 = π/4 rad  →  θ = 2t + π/4
       ------------------------------------------------------------ */
    function drawGraphUniforme() {
        var svg = document.getElementById('graphUniforme');
        if (!svg) return;
        clearSvg(svg);

        var defs = el('defs');
        addArrow(defs, 'p4u_arrowGray', '#9aa0a6');
        svg.appendChild(defs);

        // Repère cartésien
        var ox = 55, oy = 210;      // origine du repère (bas-gauche)
        var xMax = 350, yMax = 24;  // limites des axes
        var tMaxData = 3.5;         // s
        var thetaMaxData = 8;       // rad (0.785 + 2*3.5=7.785 ~ arrondi à 8)

        function toX(t) { return ox + (t / tMaxData) * (xMax - ox); }
        function toY(theta) { return oy - (theta / thetaMaxData) * (oy - yMax); }

        // Axes
        svg.appendChild(el('line', { x1: ox, y1: oy, x2: xMax, y2: oy, stroke: '#9aa0a6', 'stroke-width': 1.3, 'marker-end': 'url(#p4u_arrowGray)' }));
        svg.appendChild(el('line', { x1: ox, y1: oy, x2: ox, y2: yMax, stroke: '#9aa0a6', 'stroke-width': 1.3, 'marker-end': 'url(#p4u_arrowGray)' }));
        svg.appendChild(txt(xMax - 8, oy + 18, 't (s)', { 'font-size': 11, fill: '#9aa0a6' }));
        svg.appendChild(txt(ox - 30, yMax + 4, 'θ (rad)', { 'font-size': 11, fill: '#9aa0a6' }));

        // Graduations t : 0,1,2,3
        [0, 1, 2, 3].forEach(function (t) {
            var x = toX(t);
            svg.appendChild(el('line', { x1: x, y1: oy - 3, x2: x, y2: oy + 3, stroke: '#9aa0a6', 'stroke-width': 1 }));
            svg.appendChild(txt(x - 3, oy + 16, String(t), { 'font-size': 9, fill: '#9aa0a6' }));
        });
        // Graduations theta : 0,2,4,6,8
        [0, 2, 4, 6, 8].forEach(function (v) {
            var y = toY(v);
            svg.appendChild(el('line', { x1: ox - 3, y1: y, x2: ox + 3, y2: y, stroke: '#9aa0a6', 'stroke-width': 1 }));
            svg.appendChild(txt(ox - 20, y + 3, String(v), { 'font-size': 9, fill: '#9aa0a6' }));
        });

        // Droite theta = 2t + pi/4
        var theta0 = Math.PI / 4;
        var omega = 2;
        var t1 = 0, t2 = 3;
        var y1v = theta0 + omega * t1;
        var y2v = theta0 + omega * t2;
        svg.appendChild(el('line', { x1: toX(t1), y1: toY(y1v), x2: toX(t2), y2: toY(y2v), stroke: '#4ECDC4', 'stroke-width': 2.2 }));

        // Point à t=0 (intercept theta0) et t=3 (valeur calculée 6.785)
        svg.appendChild(el('circle', { cx: toX(0), cy: toY(theta0), r: 4, fill: '#F4D03F' }));
        svg.appendChild(txt(toX(0) + 6, toY(theta0) - 6, 'θ₀ = π/4', { 'font-size': 9.5, fill: '#F4D03F', 'font-weight': '700' }));

        svg.appendChild(el('circle', { cx: toX(3), cy: toY(y2v), r: 4, fill: '#FF6B6B' }));
        svg.appendChild(txt(toX(3) - 60, toY(y2v) - 8, 'θ(3) = 6.785', { 'font-size': 9.5, fill: '#FF6B6B', 'font-weight': '700' }));

        // Pointillés vers les axes pour le point t=3
        svg.appendChild(el('line', { x1: toX(3), y1: toY(y2v), x2: toX(3), y2: oy, stroke: '#FF6B6B', 'stroke-width': 1, 'stroke-dasharray': '3,3', opacity: 0.6 }));
        svg.appendChild(el('line', { x1: ox, y1: toY(y2v), x2: toX(3), y2: toY(y2v), stroke: '#FF6B6B', 'stroke-width': 1, 'stroke-dasharray': '3,3', opacity: 0.6 }));

        svg.appendChild(txt(ox + 6, yMax - 8, 'θ = 2t + π/4  (pente = ω = 2 rad/s)', { 'font-size': 10, fill: '#B8860B', 'font-weight': '700' }));
    }

    function init() {
        drawGraphPeriode();
        drawGraphUniforme();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
