/* ============================================================
   figuresvt_ex2.js — Devoir Surveillé N°1 (Modèle 2)
   Exercice 2 : Fonction périodique et paire

   f est définie sur ℝ, périodique de période T=2, paire,
   avec f(x) = x pour tout x ∈ [0,1].
   ⇒ f(x) = distance de x à l'entier pair le plus proche
          (fonction "triangle", en dents de scie symétrique).

   Figure dessinée :
     - graphPeriodique : représentation de f sur [-5, 5]
       (question 2).
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
        return { sx: sx, sy: sy, x0: x0, y0: y0 };
    }
    function dot(svg, cx, cy, color, r) {
        svg.appendChild(el('circle', { cx: cx, cy: cy, r: r || 3, fill: color, stroke: '#0D1117', 'stroke-width': 1 }));
    }

    // f(x) = distance de x à l'entier pair le plus proche = |x - 2*round(x/2)|
    function fPeriodique(x) {
        var n = Math.round(x / 2);
        return Math.abs(x - 2 * n);
    }

    /* ============================================================
       graphPeriodique : représentation de f sur [-5, 5]
       ============================================================ */
    function drawGraphPeriodique(svg) {
        var w = 380, h = 210;
        setResponsive(svg, w, h);
        clear(svg);
        var ax = drawAxes(svg, {
            pad: { l: 26, r: 16, t: 16, b: 24 }, w: w, h: h,
            xmin: -5.4, xmax: 5.4, ymin: -0.35, ymax: 1.35, gridStep: 1,
            xLabel: 'x', yLabel: 'y'
        });

        // Tracé "triangle" morceau par morceau (segments entre entiers)
        var d = '';
        for (var k = -6; k <= 5; k++) {
            var x1 = k, x2 = k + 1;
            if (x2 < -5 || x1 > 5) continue;
            var seg = 'M' + ax.sx(Math.max(x1, -5)).toFixed(2) + ',' + ax.sy(fPeriodique(Math.max(x1, -5))).toFixed(2) +
                      ' L' + ax.sx(Math.min(x2, 5)).toFixed(2) + ',' + ax.sy(fPeriodique(Math.min(x2, 5))).toFixed(2) + ' ';
            d += seg;
        }
        svg.appendChild(el('path', { d: d, fill: 'none', stroke: '#FF6B6B', 'stroke-width': 2.4, 'stroke-linejoin': 'round' }));

        // Marqueurs aux sommets entiers dans [-5,5]
        for (var xi = -5; xi <= 5; xi++) {
            dot(svg, ax.sx(xi), ax.sy(fPeriodique(xi)), '#FF6B6B', 3);
        }

        // Repère visuel d'une période T = 2 (entre x=0 et x=2)
        svg.appendChild(el('line', { x1: ax.sx(0), y1: ax.sy(1.22), x2: ax.sx(2), y2: ax.sy(1.22), stroke: '#4ECDC4', 'stroke-width': 1.4 }));
        svg.appendChild(el('line', { x1: ax.sx(0), y1: ax.sy(1.15), x2: ax.sx(0), y2: ax.sy(1.29), stroke: '#4ECDC4', 'stroke-width': 1.4 }));
        svg.appendChild(el('line', { x1: ax.sx(2), y1: ax.sy(1.15), x2: ax.sx(2), y2: ax.sy(1.29), stroke: '#4ECDC4', 'stroke-width': 1.4 }));
        svg.appendChild(text(ax.sx(1), ax.sy(1.22) - 6, 'T = 2', { fill: '#4ECDC4', 'font-size': 10, 'text-anchor': 'middle' }));
    }

    function init() {
        var svg = document.getElementById('graphPeriodique');
        if (svg) {
            try { drawGraphPeriodique(svg); } catch (e) { console.error('figuresvt_ex2:', e); }
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    window.addEventListener('resize', init);
})();
