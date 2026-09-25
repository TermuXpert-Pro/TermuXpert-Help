/* ============================================================
   Exercice 2 : Fonction périodique (Modèle 2)
   f périodique de période T=2, paire, f(x)=1-x sur [0,1].
   Fichier autonome (self-contained).

   Figure dessinée :
     - graphPeriodique : tracé de f sur [-5, 5] (onde "en tentes").
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
        return { sx: sx, sy: sy, x0: x0, y0: y0 };
    }

    /* f(x) = 1 - dist(x, plus proche multiple pair) ... implémentation directe : */
    function fPeriodic(x) {
        // Ramener x dans [-1, 1] par périodicité de 2
        var t = x - 2 * Math.round(x / 2);
        // t ∈ [-1,1] ; par parité, f(t) = f(|t|) = 1 - |t|
        return 1 - Math.abs(t);
    }

    function drawGraphPeriodique(svg) {
        var w = 380, h = 220;
        setResponsive(svg, w, h);
        clear(svg);
        var ax = drawAxes(svg, {
            pad: { l: 26, r: 16, t: 18, b: 26 }, w: w, h: h,
            xmin: -5.4, xmax: 5.4, ymin: -0.3, ymax: 1.4, gridStep: 1,
            xLabel: 'x', yLabel: 'y'
        });

        var d = '';
        var steps = 400;
        for (var i = 0; i <= steps; i++) {
            var x = -5.3 + (10.6) * i / steps;
            var y = fPeriodic(x);
            d += (i === 0 ? 'M' : 'L') + ax.sx(x).toFixed(2) + ',' + ax.sy(y).toFixed(2) + ' ';
        }
        svg.appendChild(el('path', { d: d, fill: 'none', stroke: '#4ECDC4', 'stroke-width': 2.2 }));

        // Repères pointillés sur les pics (x pair) et les creux (x impair)
        [-4, -2, 0, 2, 4].forEach(function (xv) {
            svg.appendChild(el('circle', { cx: ax.sx(xv), cy: ax.sy(1), r: 2.6, fill: '#F4D03F' }));
        });
        [-5, -3, -1, 1, 3, 5].forEach(function (xv) {
            svg.appendChild(el('circle', { cx: ax.sx(xv), cy: ax.sy(0), r: 2.6, fill: '#FF6B6B' }));
        });

        svg.appendChild(text(w / 2, 16, 'f périodique (T=2), paire, f(x)=1-x sur [0,1]', { fill: '#8B96A5', 'font-size': 10.5, 'text-anchor': 'middle' }));
    }

    function init() {
        var svg = document.getElementById('graphPeriodique');
        if (svg) {
            try { drawGraphPeriodique(svg); } catch (e) { console.error('figuresvt_ex2 (model2):', e); }
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.addEventListener('resize', init);
})();

