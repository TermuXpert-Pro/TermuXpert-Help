/* ============================================================
   Exercice 1 : Logique mathématique (Modèle 2)
   Fichier autonome (self-contained) : aucune dépendance à une
   librairie partagée (svg-utils.js).

   Figures dessinées :
     - fig1_2 : comparaison de 3^n et 1+2n (question 2, récurrence).
     - fig1_5 : courbe y ↦ y²+3, toujours strictement positive
                (question 5, existence).
   ============================================================ */
(function () {
    'use strict';
    var NS = 'http://www.w3.org/2000/svg';

    /* ---------- Utilitaires SVG de base ---------- */
    function el(tag, attrs) {
        var e = document.createElementNS(NS, tag);
        for (var k in attrs) {
            if (attrs.hasOwnProperty(k)) e.setAttribute(k, attrs[k]);
        }
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
    function drawAxes(svg, opts) {
        var pad = opts.pad, w = opts.w, h = opts.h;
        var xmin = opts.xmin, xmax = opts.xmax, ymin = opts.ymin, ymax = opts.ymax;
        var sx = scaleFn(xmin, xmax, pad.l, w - pad.r);
        var sy = scaleFn(ymin, ymax, h - pad.b, pad.t);
        var axisColor = '#3A4552';
        addArrowMarker(svg, svg.id + '_arrowX', axisColor);
        addArrowMarker(svg, svg.id + '_arrowY', axisColor);
        if (opts.grid !== false) {
            var gStep = opts.gridStep || 1;
            for (var gx = Math.ceil(xmin / gStep) * gStep; gx <= xmax; gx += gStep) {
                svg.appendChild(el('line', { x1: sx(gx), y1: sy(ymin), x2: sx(gx), y2: sy(ymax), stroke: '#1C2530', 'stroke-width': 1 }));
            }
            for (var gy = Math.ceil(ymin / gStep) * gStep; gy <= ymax; gy += gStep) {
                svg.appendChild(el('line', { x1: sx(xmin), y1: sy(gy), x2: sx(xmax), y2: sy(gy), stroke: '#1C2530', 'stroke-width': 1 }));
            }
        }
        var x0 = sx(Math.max(xmin, Math.min(0, xmax)));
        var y0 = sy(Math.max(ymin, Math.min(0, ymax)));
        svg.appendChild(el('line', { x1: sx(xmin), y1: y0, x2: sx(xmax) + 6, y2: y0, stroke: axisColor, 'stroke-width': 1.4, 'marker-end': 'url(#' + svg.id + '_arrowX)' }));
        svg.appendChild(el('line', { x1: x0, y1: sy(ymin), x2: x0, y2: sy(ymax) - 6, stroke: axisColor, 'stroke-width': 1.4, 'marker-end': 'url(#' + svg.id + '_arrowY)' }));
        svg.appendChild(text(sx(xmax) + 8, y0 + 4, opts.xLabel || 'x', { fill: '#8B96A5', 'font-size': 11, 'font-style': 'italic' }));
        svg.appendChild(text(x0 + 8, sy(ymax) - 10, opts.yLabel || 'y', { fill: '#8B96A5', 'font-size': 11, 'font-style': 'italic' }));
        svg.appendChild(text(x0 - 8, y0 + 14, '0', { fill: '#8B96A5', 'font-size': 10, 'text-anchor': 'end' }));
        return { sx: sx, sy: sy, x0: x0, y0: y0 };
    }
    function pathFromFn(sx, sy, fn, x1, x2, steps) {
        steps = steps || 80;
        var d = '';
        for (var i = 0; i <= steps; i++) {
            var x = x1 + (x2 - x1) * i / steps;
            var y = fn(x);
            d += (i === 0 ? 'M' : 'L') + sx(x).toFixed(2) + ',' + sy(y).toFixed(2) + ' ';
        }
        return d;
    }
    function dot(svg, cx, cy, color, r) {
        svg.appendChild(el('circle', { cx: cx, cy: cy, r: r || 3.4, fill: color, stroke: '#0D1117', 'stroke-width': 1 }));
    }

    /* ============================================================
       fig1_2 : comparaison de 3^n et 1+2n (n entier de 0 à 4)
       ============================================================ */
    function drawFig1_2(svg) {
        var w = 360, h = 230;
        setResponsive(svg, w, h);
        clear(svg);
        var ax = drawAxes(svg, {
            pad: { l: 30, r: 16, t: 18, b: 26 }, w: w, h: h,
            xmin: -0.4, xmax: 4.4, ymin: -3, ymax: 82, gridStep: 20,
            xLabel: 'n', yLabel: 'y'
        });

        var ns = [0, 1, 2, 3, 4];
        var pow3 = ns.map(function (n) { return Math.pow(3, n); });
        var lin = ns.map(function (n) { return 1 + 2 * n; });

        // Courbe (points reliés) de 3^n
        var dPow = '';
        ns.forEach(function (n, i) { dPow += (i === 0 ? 'M' : 'L') + ax.sx(n).toFixed(2) + ',' + ax.sy(pow3[i]).toFixed(2) + ' '; });
        svg.appendChild(el('path', { d: dPow, fill: 'none', stroke: '#FF6B6B', 'stroke-width': 2.2 }));
        ns.forEach(function (n, i) { dot(svg, ax.sx(n), ax.sy(pow3[i]), '#FF6B6B', 3.2); });

        // Droite (points reliés) de 1+2n
        var dLin = '';
        ns.forEach(function (n, i) { dLin += (i === 0 ? 'M' : 'L') + ax.sx(n).toFixed(2) + ',' + ax.sy(lin[i]).toFixed(2) + ' '; });
        svg.appendChild(el('path', { d: dLin, fill: 'none', stroke: '#F4D03F', 'stroke-width': 2.2 }));
        ns.forEach(function (n, i) { dot(svg, ax.sx(n), ax.sy(lin[i]), '#F4D03F', 3.2); });

        svg.appendChild(text(w - 14, 20, '3ⁿ', { fill: '#FF6B6B', 'font-size': 12, 'font-weight': 700, 'text-anchor': 'end' }));
        svg.appendChild(text(w - 14, 36, '1+2n', { fill: '#F4D03F', 'font-size': 12, 'font-weight': 700, 'text-anchor': 'end' }));
    }

    /* ============================================================
       fig1_5 : y ↦ y²+3, toujours strictement positive
       ============================================================ */
    function drawFig1_5(svg) {
        var w = 360, h = 220;
        setResponsive(svg, w, h);
        clear(svg);
        var ax = drawAxes(svg, {
            pad: { l: 30, r: 16, t: 18, b: 26 }, w: w, h: h,
            xmin: -3.2, xmax: 3.2, ymin: -1, ymax: 12, gridStep: 2,
            xLabel: 'y', yLabel: 'z'
        });
        var f = function (y) { return y * y + 3; };

        svg.appendChild(el('line', { x1: ax.sx(-3.2), y1: ax.y0, x2: ax.sx(3.2), y2: ax.y0, stroke: '#8B96A5', 'stroke-width': 1, 'stroke-dasharray': '4,3' }));
        svg.appendChild(el('path', { d: pathFromFn(ax.sx, ax.sy, f, -3, 3), fill: 'none', stroke: '#4ECDC4', 'stroke-width': 2.4 }));
        dot(svg, ax.sx(0), ax.sy(3), '#FF6B6B', 4);
        svg.appendChild(text(ax.sx(0) + 8, ax.sy(3) - 8, 'min = 3', { fill: '#FF6B6B', 'font-size': 10.5, 'font-weight': 700 }));
        svg.appendChild(text(w - 14, 20, 'z = y²+3', { fill: '#4ECDC4', 'font-size': 11.5, 'text-anchor': 'end' }));
    }

    /* ---------- Initialisation ---------- */
    function init() {
        var map = {
            fig1_2: drawFig1_2,
            fig1_5: drawFig1_5
        };
        Object.keys(map).forEach(function (id) {
            var svg = document.getElementById(id);
            if (svg) {
                try { map[id](svg); } catch (e) { console.error('figuresvt_ex1 (model2):', id, e); }
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

