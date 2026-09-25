/* ============================================================
   Exercice 3 : Étude de fonctions (Modèle 3)
   f(x) = (1/3)x³ ,  g(x) = √(x+2)
   Point d'intersection unique α ∈ ]1,2[ (racine de f=g), α ≈ 1,8.
   Fichier autonome (self-contained) : aucune dépendance à une
   librairie partagée (svg-utils.js).

   Figures dessinées :
     - graphEx3     : question 1c, tracé de (Cf) et (Cg).
     - graphIneqEx3 : question 2c, résolution graphique de
                      x³-3√(x+2) > 0  ⇔  f(x) > g(x).
                      Solution : S = ]α, +∞[.
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
        steps = steps || 100;
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

    var f = function (x) { return (1 / 3) * x * x * x; };
    var g = function (x) { return Math.sqrt(x + 2); };
    var ALPHA = 1.8; // racine approchée de f(x) = g(x), avec 1 < α < 2

    var WIN = { xmin: -2.6, xmax: 3, ymin: -2.2, ymax: 5.2 };

    /* ============================================================
       graphEx3 : question 1c — tracé de (Cf) et (Cg)
       ============================================================ */
    function drawGraphEx3(svg) {
        var w = 380, h = 330;
        setResponsive(svg, w, h);
        clear(svg);
        var ax = drawAxes(svg, {
            pad: { l: 30, r: 18, t: 18, b: 26 }, w: w, h: h,
            xmin: WIN.xmin, xmax: WIN.xmax, ymin: WIN.ymin, ymax: WIN.ymax, gridStep: 1,
            xLabel: 'x', yLabel: 'y'
        });

        svg.appendChild(el('path', { d: pathFromFn(ax.sx, ax.sy, f, WIN.xmin + 0.05, WIN.xmax - 0.05), fill: 'none', stroke: '#FF6B6B', 'stroke-width': 2.4 }));
        svg.appendChild(el('path', { d: pathFromFn(ax.sx, ax.sy, g, -2, WIN.xmax - 0.05), fill: 'none', stroke: '#F4D03F', 'stroke-width': 2.4 }));

        // Point d'intersection approché A(α ; f(α))
        dashLine(svg, ax.sx(ALPHA), ax.sy(f(ALPHA)), ax.sx(ALPHA), ax.y0, '#4ECDC4');
        dot(svg, ax.sx(ALPHA), ax.sy(f(ALPHA)), '#4ECDC4', 4);
        svg.appendChild(text(ax.sx(ALPHA) + 8, ax.sy(f(ALPHA)) - 8, 'α', { fill: '#4ECDC4', 'font-size': 13, 'font-style': 'italic', 'font-weight': 700 }));

        svg.appendChild(text(ax.sx(2.3), ax.sy(f(2.3)) - 10, '(Cf)', { fill: '#FF6B6B', 'font-size': 12, 'font-weight': 700 }));
        svg.appendChild(text(ax.sx(-1.8), ax.sy(g(-1.8)) + 16, '(Cg)', { fill: '#F4D03F', 'font-size': 12, 'font-weight': 700 }));
    }

    /* ============================================================
       graphIneqEx3 : question 2c — résoudre x³-3√(x+2) > 0
       ⇔ f(x) > g(x) ⇔ (Cf) au-dessus de (Cg)
       Solution : S = ]α, +∞[
       ============================================================ */
    function drawGraphIneqEx3(svg) {
        var w = 380, h = 300;
        setResponsive(svg, w, h);
        clear(svg);
        var ax = drawAxes(svg, {
            pad: { l: 30, r: 18, t: 18, b: 30 }, w: w, h: h,
            xmin: WIN.xmin, xmax: WIN.xmax, ymin: WIN.ymin, ymax: WIN.ymax, gridStep: 1,
            xLabel: 'x', yLabel: 'y'
        });

        // Zone hachurée où (Cf) est au-dessus de (Cg) : x ∈ [α, xmax]
        var top = pathFromFn(ax.sx, ax.sy, f, ALPHA, WIN.xmax - 0.05, 40);
        var bottomRev = pathFromFn(ax.sx, ax.sy, g, WIN.xmax - 0.05, ALPHA, 40).replace('M', 'L');
        svg.appendChild(el('path', { d: top + bottomRev + ' Z', fill: 'rgba(78,205,196,0.16)', stroke: 'none' }));

        svg.appendChild(el('path', { d: pathFromFn(ax.sx, ax.sy, f, WIN.xmin + 0.05, WIN.xmax - 0.05), fill: 'none', stroke: '#FF6B6B', 'stroke-width': 2.2, opacity: 0.85 }));
        svg.appendChild(el('path', { d: pathFromFn(ax.sx, ax.sy, g, -2, WIN.xmax - 0.05), fill: 'none', stroke: '#F4D03F', 'stroke-width': 2.2, opacity: 0.85 }));

        svg.appendChild(text(ax.sx(2.3), ax.sy(f(2.3)) - 10, '(Cf)', { fill: '#FF6B6B', 'font-size': 11 }));
        svg.appendChild(text(ax.sx(-1.8), ax.sy(g(-1.8)) + 16, '(Cg)', { fill: '#F4D03F', 'font-size': 11 }));

        // Repère de α et de la solution S = ]α, +∞[
        dashLine(svg, ax.sx(ALPHA), ax.sy(f(ALPHA)), ax.sx(ALPHA), ax.y0, '#4ECDC4');
        dot(svg, ax.sx(ALPHA), ax.y0, '#4ECDC4', 4);
        svg.appendChild(el('line', { x1: ax.sx(ALPHA), y1: ax.y0, x2: ax.sx(WIN.xmax - 0.05), y2: ax.y0, stroke: '#4ECDC4', 'stroke-width': 4 }));
        svg.appendChild(text(ax.sx(ALPHA) - 4, ax.y0 + 20, 'α', { fill: '#4ECDC4', 'font-size': 12, 'font-style': 'italic', 'font-weight': 700, 'text-anchor': 'middle' }));
        svg.appendChild(text((ax.sx(ALPHA) + ax.sx(WIN.xmax)) / 2, ax.y0 + 20, 'S = ]α, +∞[', { fill: '#4ECDC4', 'font-size': 11, 'font-weight': 700, 'text-anchor': 'middle' }));
    }

    function init() {
        var map = {
            graphEx3: drawGraphEx3,
            graphIneqEx3: drawGraphIneqEx3
        };
        Object.keys(map).forEach(function (id) {
            var svg = document.getElementById(id);
            if (svg) {
                try { map[id](svg); } catch (e) { console.error('figuresvt_ex3 (model3):', id, e); }
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

