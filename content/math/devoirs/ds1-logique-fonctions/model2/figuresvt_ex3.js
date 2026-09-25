/* ============================================================
   Exercice 3 : Étude de fonction (Modèle 2)
   g(x) = (3x-1)/(x-2) = 3 + 5/(x-2)
   Centre de symétrie I(2,3) ; asymptotes x=2 et y=3.
   Fichier autonome (self-contained).

   Figure dessinée :
     - graphCg : tracé de l'hyperbole (Cg), avec ses deux
                 asymptotes et son centre de symétrie.
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
        svg.appendChild(el('line', { x1: x1, y1: y1, x2: x2, y2: y2, stroke: color, 'stroke-width': 1.2, 'stroke-dasharray': '5,4' }));
    }
    function dot(svg, cx, cy, color, r) {
        svg.appendChild(el('circle', { cx: cx, cy: cy, r: r || 3.4, fill: color, stroke: '#0D1117', 'stroke-width': 1 }));
    }

    var g = function (x) { return 3 + 5 / (x - 2); };

    function drawGraphCg(svg) {
        var w = 360, h = 280;
        setResponsive(svg, w, h);
        clear(svg);
        var ax = drawAxes(svg, {
            pad: { l: 30, r: 16, t: 18, b: 26 }, w: w, h: h,
            xmin: -1.5, xmax: 5.5, ymin: -2, ymax: 8, gridStep: 1,
            xLabel: 'x', yLabel: 'y'
        });

        // Asymptotes x=2 et y=3
        dashLine(svg, ax.sx(2), ax.sy(-2), ax.sx(2), ax.sy(8), '#8B96A5');
        dashLine(svg, ax.sx(-1.5), ax.sy(3), ax.sx(5.5), ax.sy(3), '#8B96A5');
        svg.appendChild(text(ax.sx(2) + 6, ax.sy(8) + 10, 'x = 2', { fill: '#8B96A5', 'font-size': 10.5 }));
        svg.appendChild(text(ax.sx(5.5) - 4, ax.sy(3) - 6, 'y = 3', { fill: '#8B96A5', 'font-size': 10.5, 'text-anchor': 'end' }));

        // Deux branches de l'hyperbole
        svg.appendChild(el('path', { d: pathFromFn(ax.sx, ax.sy, g, -1.4, 1.85), fill: 'none', stroke: '#BB8FCE', 'stroke-width': 2.4 }));
        svg.appendChild(el('path', { d: pathFromFn(ax.sx, ax.sy, g, 2.15, 5.4), fill: 'none', stroke: '#BB8FCE', 'stroke-width': 2.4 }));

        // Centre de symétrie I(2,3)
        dot(svg, ax.sx(2), ax.sy(3), '#4ECDC4', 4);
        svg.appendChild(text(ax.sx(2) + 8, ax.sy(3) - 8, 'I(2 ; 3)', { fill: '#4ECDC4', 'font-size': 11, 'font-weight': 700 }));

        // Point d'annulation (1/3 ; 0)
        dot(svg, ax.sx(1 / 3), ax.sy(0), '#F4D03F', 3.4);
        svg.appendChild(text(ax.sx(1 / 3) + 6, ax.sy(0) + 16, '1/3', { fill: '#F4D03F', 'font-size': 10 }));

        svg.appendChild(text(w - 14, 20, '(Cg)', { fill: '#BB8FCE', 'font-size': 12, 'font-weight': 700, 'text-anchor': 'end' }));
    }

    function init() {
        var svg = document.getElementById('graphCg');
        if (svg) {
            try { drawGraphCg(svg); } catch (e) { console.error('figuresvt_ex3 (model2):', e); }
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.addEventListener('resize', init);
})();

