/* ============================================================
   Exercice 1 : Logique mathématique (Modèle 3)
   Fichier autonome (self-contained) : aucune dépendance à une
   librairie partagée (svg-utils.js).

   Figure dessinée :
     - fig1_3 : comparaison des courbes y=√(x²+4x+7) et y=x+2
                (question 3, proposition T), montrant qu'elles
                ne coïncident jamais — contre-exemple en x=0.
   ============================================================ */
(function () {
    'use strict';
    var NS = 'http://www.w3.org/2000/svg';

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
    function dashLine(svg, x1, y1, x2, y2, color) {
        svg.appendChild(el('line', { x1: x1, y1: y1, x2: x2, y2: y2, stroke: color, 'stroke-width': 1, 'stroke-dasharray': '4,3' }));
    }
    function dot(svg, cx, cy, color, r) {
        svg.appendChild(el('circle', { cx: cx, cy: cy, r: r || 3.4, fill: color, stroke: '#0D1117', 'stroke-width': 1 }));
    }

    /* ============================================================
       fig1_3 : y=√(x²+4x+7) (courbe) vs y=x+2 (droite)
       Contre-exemple visible en x=0 : √7 ≈ 2,65 alors que 0+2 = 2.
       ============================================================ */
    function drawFig1_3(svg) {
        var w = 360, h = 230;
        setResponsive(svg, w, h);
        clear(svg);
        var ax = drawAxes(svg, {
            pad: { l: 30, r: 16, t: 18, b: 26 }, w: w, h: h,
            xmin: -3.2, xmax: 2.2, ymin: -0.6, ymax: 5.2, gridStep: 1,
            xLabel: 'x', yLabel: 'y'
        });

        var curve = function (x) { return Math.sqrt(x * x + 4 * x + 7); };
        var line = function (x) { return x + 2; };

        svg.appendChild(el('path', { d: pathFromFn(ax.sx, ax.sy, curve, -3.15, 2.15), fill: 'none', stroke: '#4ECDC4', 'stroke-width': 2.4 }));
        svg.appendChild(el('path', { d: pathFromFn(ax.sx, ax.sy, line, -3.15, 2.15), fill: 'none', stroke: '#F4D03F', 'stroke-width': 2.2 }));

        // Repère du contre-exemple x = 0
        dashLine(svg, ax.sx(0), ax.sy(curve(0)), ax.sx(0), ax.y0, '#FF6B6B');
        dot(svg, ax.sx(0), ax.sy(curve(0)), '#4ECDC4', 3.6);
        dot(svg, ax.sx(0), ax.sy(line(0)), '#F4D03F', 3.6);
        svg.appendChild(text(ax.sx(0) + 8, ax.sy(curve(0)) - 6, '√7 ≈ 2,65', { fill: '#4ECDC4', 'font-size': 10.5, 'font-weight': 700 }));
        svg.appendChild(text(ax.sx(0) + 8, ax.sy(line(0)) + 16, '0+2 = 2', { fill: '#F4D03F', 'font-size': 10.5, 'font-weight': 700 }));

        svg.appendChild(text(ax.sx(-3), ax.sy(curve(-3)) - 8, 'y=√(x²+4x+7)', { fill: '#4ECDC4', 'font-size': 10 }));
        svg.appendChild(text(ax.sx(1.2), ax.sy(line(1.2)) + 16, 'y=x+2', { fill: '#F4D03F', 'font-size': 10 }));
    }

    function init() {
        var svg = document.getElementById('fig1_3');
        if (svg) {
            try { drawFig1_3(svg); } catch (e) { console.error('figuresvt_ex1 (model3):', e); }
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.addEventListener('resize', init);
})();
