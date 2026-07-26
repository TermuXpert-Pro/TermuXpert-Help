/* ============================================================
   figuresvt_ex1.js — Devoir Surveillé N°1 (Physique-Chimie)
   Exercice 1 : Rotation d'un solide autour d'un axe fixe
   Fichier autonome (self-contained) : aucune dépendance à une
   librairie partagée (svg-utils.js).

   Figures dessinées :
     - fig1_wheel  : roue en rotation uniforme (point A, R, ω, v)
     - fig1_graph  : graphe s(t) du disque (droite passant par
                     (0,1 ; 0,4) et (0,2 ; 0,8))
   ============================================================ */
(function () {
    'use strict';
    var NS = 'http://www.w3.org/2000/svg';

    function el(tag, attrs) {
        var e = document.createElementNS(NS, tag);
        for (var k in attrs) { if (attrs.hasOwnProperty(k)) e.setAttribute(k, attrs[k]); }
        return e;
    }
    function text(x, y, str, attrs) {
        var t = el('text', Object.assign({ x: x, y: y, 'font-family': "'Cairo','Segoe UI',sans-serif" }, attrs || {}));
        t.textContent = str;
        return t;
    }
    function setResponsive(svg, w, h) {
        svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        svg.removeAttribute('width');
        svg.removeAttribute('height');
        svg.style.width = '100%';
        svg.style.height = 'auto';
        svg.style.display = 'block';
    }
    function clear(svg) { while (svg.firstChild) svg.removeChild(svg.firstChild); }
    function addArrowMarker(svg, id, color) {
        var defs = svg.querySelector('defs');
        if (!defs) { defs = el('defs', {}); svg.appendChild(defs); }
        var m = el('marker', { id: id, markerWidth: 7, markerHeight: 7, refX: 5.5, refY: 3.5, orient: 'auto' });
        m.appendChild(el('path', { d: 'M0,0 L7,3.5 L0,7 Z', fill: color }));
        defs.appendChild(m);
    }
    function scaleFn(vmin, vmax, pmin, pmax) {
        return function (v) { return pmin + (v - vmin) * (pmax - pmin) / (vmax - vmin); };
    }
    function dashLine(svg, x1, y1, x2, y2, color) {
        svg.appendChild(el('line', { x1: x1, y1: y1, x2: x2, y2: y2, stroke: color, 'stroke-width': 1, 'stroke-dasharray': '4,3' }));
    }
    function dot(svg, cx, cy, color, r) {
        svg.appendChild(el('circle', { cx: cx, cy: cy, r: r || 3.4, fill: color, stroke: '#0D1117', 'stroke-width': 1 }));
    }

    /* ============================================================
       fig1_wheel : roue en rotation uniforme autour de (Δ)
       Montre le centre O, le point A à la périphérie, le rayon R,
       la vitesse angulaire ω (flèche courbe) et la vitesse
       linéaire tangentielle v en A.
       ============================================================ */
    function drawWheel(svg) {
        var w = 340, h = 260;
        setResponsive(svg, w, h);
        clear(svg);
        svg.id = svg.id || 'fig1_wheel';
        addArrowMarker(svg, svg.id + '_arrowV', '#4ECDC4');
        addArrowMarker(svg, svg.id + '_arrowOmega', '#F4D03F');

        var cx = 150, cy = 130, R = 85;

        // Axe fixe (Δ) : ligne pointillée verticale passant par O
        dashLine(svg, cx, 25, cx, h - 20, '#8B96A5');
        svg.appendChild(text(cx + 8, 34, '(Δ)', { fill: '#8B96A5', 'font-size': 11, 'font-style': 'italic' }));

        // Roue (cercle)
        svg.appendChild(el('circle', { cx: cx, cy: cy, r: R, fill: 'none', stroke: '#3A4552', 'stroke-width': 2.4 }));
        svg.appendChild(el('circle', { cx: cx, cy: cy, r: R * 0.15, fill: 'none', stroke: '#3A4552', 'stroke-width': 1.4 }));

        // Centre O
        dot(svg, cx, cy, '#BB8FCE', 3.5);
        svg.appendChild(text(cx - 16, cy + 4, 'O', { fill: '#BB8FCE', 'font-size': 12, 'font-weight': 700 }));

        // Rayon OA (A à 25° au-dessus de l'horizontale à droite)
        var angA = -25 * Math.PI / 180;
        var Ax = cx + R * Math.cos(angA);
        var Ay = cy + R * Math.sin(angA);
        svg.appendChild(el('line', { x1: cx, y1: cy, x2: Ax, y2: Ay, stroke: '#8B96A5', 'stroke-width': 1.3, 'stroke-dasharray': '3,3' }));
        svg.appendChild(text((cx + Ax) / 2 - 4, (cy + Ay) / 2 - 8, 'R', { fill: '#8B96A5', 'font-size': 11, 'font-style': 'italic' }));

        // Point A
        dot(svg, Ax, Ay, '#F4D03F', 4.4);
        svg.appendChild(text(Ax + 10, Ay - 4, 'A', { fill: '#F4D03F', 'font-size': 13, 'font-weight': 700 }));

        // Vitesse linéaire v (tangente au cercle en A, sens du mouvement horaire)
        var tanAngle = angA - Math.PI / 2;
        var vx = Ax + 46 * Math.cos(tanAngle);
        var vy = Ay + 46 * Math.sin(tanAngle);
        svg.appendChild(el('line', { x1: Ax, y1: Ay, x2: vx, y2: vy, stroke: '#4ECDC4', 'stroke-width': 2.2, 'marker-end': 'url(#' + svg.id + '_arrowV)' }));
        svg.appendChild(text(vx + 6, vy + 2, 'v', { fill: '#4ECDC4', 'font-size': 13, 'font-weight': 700, 'font-style': 'italic' }));

        // Flèche courbe ω autour de O (sens horaire)
        var r2 = R + 22;
        var a1 = -70 * Math.PI / 180, a2 = 10 * Math.PI / 180;
        var sx1 = cx + r2 * Math.cos(a1), sy1 = cy + r2 * Math.sin(a1);
        var sx2 = cx + r2 * Math.cos(a2), sy2 = cy + r2 * Math.sin(a2);
        svg.appendChild(el('path', {
            d: 'M ' + sx1.toFixed(1) + ',' + sy1.toFixed(1) + ' A ' + r2 + ',' + r2 + ' 0 0 1 ' + sx2.toFixed(1) + ',' + sy2.toFixed(1),
            fill: 'none', stroke: '#F4D03F', 'stroke-width': 2, 'marker-end': 'url(#' + svg.id + '_arrowOmega)'
        }));
        svg.appendChild(text(cx + r2 + 6, cy - r2 * 0.55, 'ω', { fill: '#F4D03F', 'font-size': 14, 'font-weight': 700, 'font-style': 'italic' }));

        svg.appendChild(text(w / 2, h - 6, 'Mouvement circulaire uniforme du point A', { fill: '#8B96A5', 'font-size': 9.5, 'text-anchor': 'middle' }));
    }

    /* ============================================================
       fig1_graph : s(t) — droite passant par (0,1 ; 0,4) et
       (0,2 ; 0,8), avec s0 = 0.
       ============================================================ */
    function drawGraph(svg) {
        var w = 340, h = 240;
        setResponsive(svg, w, h);
        clear(svg);
        svg.id = svg.id || 'fig1_graph';
        var axisColor = '#3A4552';
        var pad = { l: 40, r: 20, t: 18, b: 34 };
        var xmin = 0, xmax = 0.3, ymin = 0, ymax = 1.2;
        var sx = scaleFn(xmin, xmax, pad.l, w - pad.r);
        var sy = scaleFn(ymin, ymax, h - pad.b, pad.t);

        addArrowMarker(svg, svg.id + '_arrowX', axisColor);
        addArrowMarker(svg, svg.id + '_arrowY', axisColor);

        // Grille légère
        [0.1, 0.2].forEach(function (gx) {
            svg.appendChild(el('line', { x1: sx(gx), y1: sy(ymin), x2: sx(gx), y2: sy(ymax), stroke: '#1C2530', 'stroke-width': 1 }));
        });
        [0.4, 0.8].forEach(function (gy) {
            svg.appendChild(el('line', { x1: sx(xmin), y1: sy(gy), x2: sx(xmax), y2: sy(gy), stroke: '#1C2530', 'stroke-width': 1 }));
        });

        // Axes
        svg.appendChild(el('line', { x1: sx(xmin), y1: sy(0), x2: sx(xmax) + 6, y2: sy(0), stroke: axisColor, 'stroke-width': 1.4, 'marker-end': 'url(#' + svg.id + '_arrowX)' }));
        svg.appendChild(el('line', { x1: sx(0), y1: sy(ymin), x2: sx(0), y2: sy(ymax) - 6, stroke: axisColor, 'stroke-width': 1.4, 'marker-end': 'url(#' + svg.id + '_arrowY)' }));
        svg.appendChild(text(sx(xmax) + 8, sy(0) + 4, 't(s)', { fill: '#8B96A5', 'font-size': 10.5, 'font-style': 'italic' }));
        svg.appendChild(text(sx(0) - 8, sy(ymax) - 10, 's(m)', { fill: '#8B96A5', 'font-size': 10.5, 'font-style': 'italic', 'text-anchor': 'end' }));

        // Droite s(t) = 4t
        var fn = function (t) { return 4 * t; };
        var d = 'M' + sx(0).toFixed(2) + ',' + sy(fn(0)).toFixed(2) + ' L' + sx(0.28).toFixed(2) + ',' + sy(fn(0.28)).toFixed(2);
        svg.appendChild(el('path', { d: d, fill: 'none', stroke: '#4ECDC4', 'stroke-width': 2.4 }));

        // Repères pointillés vers les 2 points connus
        [[0.1, 0.4], [0.2, 0.8]].forEach(function (p) {
            dashLine(svg, sx(p[0]), sy(0), sx(p[0]), sy(p[1]), '#F4D03F');
            dashLine(svg, sx(0), sy(p[1]), sx(p[0]), sy(p[1]), '#F4D03F');
            dot(svg, sx(p[0]), sy(p[1]), '#F4D03F', 3.6);
        });

        // Graduations
        [0.1, 0.2].forEach(function (gx) {
            svg.appendChild(text(sx(gx), sy(0) + 16, String(gx).replace('.', ','), { fill: '#8B96A5', 'font-size': 9.5, 'text-anchor': 'middle' }));
        });
        [0.4, 0.8].forEach(function (gy) {
            svg.appendChild(text(sx(0) - 8, sy(gy) + 3, String(gy).replace('.', ','), { fill: '#8B96A5', 'font-size': 9.5, 'text-anchor': 'end' }));
        });

        svg.appendChild(text(w - 16, 24, 's(t) = 4t', { fill: '#4ECDC4', 'font-size': 11, 'font-weight': 700, 'text-anchor': 'end' }));
    }

    /* ---------- Initialisation ---------- */
    function init() {
        var map = { fig1_wheel: drawWheel, fig1_graph: drawGraph };
        Object.keys(map).forEach(function (id) {
            var svg = document.getElementById(id);
            if (svg) {
                try { map[id](svg); } catch (e) { console.error('figuresvt_ex1:', id, e); }
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    window.addEventListener('resize', init);
})();
