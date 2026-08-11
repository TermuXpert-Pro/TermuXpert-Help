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
    function pathFromFn(sx, sy, fn, xmin, xmax, steps, skipIf) {
        var d = '';
        var started = false;
        for (var i = 0; i <= steps; i++) {
            var x = xmin + (xmax - xmin) * i / steps;
            var y;
            try { y = fn(x); } catch (e) { y = null; }
            if (y === null || y === undefined || isNaN(y) || (skipIf && skipIf(x, y))) {
                started = false;
                continue;
            }
            var px = sx(x), py = sy(y);
            d += (started ? ' L' : ' M') + px.toFixed(2) + ',' + py.toFixed(2);
            started = true;
        }
        return d.trim();
    }

    /* ============================================================
       graphParite : f(x) = cos(pi x) sur [-3,3] — symétrie / axe des ordonnées
       ============================================================ */
    function drawGraphParite(svg) {
        var w = 360, h = 200;
        setResponsive(svg, w, h);
        clear(svg);
        var f = function (x) { return Math.cos(Math.PI * x); };
        var ax = drawAxes(svg, {
            pad: { l: 26, r: 16, t: 16, b: 24 }, w: w, h: h,
            xmin: -3.3, xmax: 3.3, ymin: -1.35, ymax: 1.35, gridStep: 1,
            xLabel: 'x', yLabel: 'y'
        });
        svg.appendChild(el('path', { d: pathFromFn(ax.sx, ax.sy, f, -3, 3, 160), fill: 'none', stroke: '#4ECDC4', 'stroke-width': 2.4 }));

        // Deux points symétriques par rapport à l'axe des ordonnées, ex a = 1.4
        var a = 1.4;
        dot(svg, ax.sx(a), ax.sy(f(a)), '#F4D03F', 3.6);
        dot(svg, ax.sx(-a), ax.sy(f(-a)), '#F4D03F', 3.6);
        svg.appendChild(el('line', { x1: ax.sx(-a), y1: ax.sy(f(-a)), x2: ax.sx(a), y2: ax.sy(f(a)), stroke: '#F4D03F', 'stroke-width': 1, 'stroke-dasharray': '3,3' }));
        svg.appendChild(text(ax.sx(a) + 6, ax.sy(f(a)) - 6, 'f(x)', { fill: '#F4D03F', 'font-size': 9.5 }));
        svg.appendChild(text(ax.sx(-a) - 6, ax.sy(f(-a)) - 6, 'f(-x)', { fill: '#F4D03F', 'font-size': 9.5, 'text-anchor': 'end' }));

        svg.appendChild(text(ax.sx(0), ax.sy(1.35) + 2, 'axe de symétrie', { fill: '#8B96A5', 'font-size': 9, 'text-anchor': 'middle' }));
        svg.appendChild(el('line', { x1: ax.sx(0), y1: ax.sy(1.28), x2: ax.sx(0), y2: ax.sy(-1.28), stroke: '#8B96A5', 'stroke-width': 0.8, 'stroke-dasharray': '2,3' }));
    }

    /* ============================================================
       graphPeriodique : f(x) = cos(pi x) sur [-5,5] — période T=2
       ============================================================ */
    function drawGraphPeriodique(svg) {
        var w = 380, h = 200;
        setResponsive(svg, w, h);
        clear(svg);
        var f = function (x) { return Math.cos(Math.PI * x); };
        var ax = drawAxes(svg, {
            pad: { l: 24, r: 16, t: 18, b: 24 }, w: w, h: h,
            xmin: -5.4, xmax: 5.4, ymin: -1.4, ymax: 1.55, gridStep: 1,
            xLabel: 'x', yLabel: 'y'
        });
        svg.appendChild(el('path', { d: pathFromFn(ax.sx, ax.sy, f, -5, 5, 260), fill: 'none', stroke: '#4ECDC4', 'stroke-width': 2.2 }));

        // Repère de la période T=2 entre x=0 et x=2
        var yBar = 1.32;
        svg.appendChild(el('line', { x1: ax.sx(0), y1: ax.sy(yBar), x2: ax.sx(2), y2: ax.sy(yBar), stroke: '#F4D03F', 'stroke-width': 1.4 }));
        svg.appendChild(el('line', { x1: ax.sx(0), y1: ax.sy(yBar - 0.08), x2: ax.sx(0), y2: ax.sy(yBar + 0.08), stroke: '#F4D03F', 'stroke-width': 1.4 }));
        svg.appendChild(el('line', { x1: ax.sx(2), y1: ax.sy(yBar - 0.08), x2: ax.sx(2), y2: ax.sy(yBar + 0.08), stroke: '#F4D03F', 'stroke-width': 1.4 }));
        svg.appendChild(text(ax.sx(1), ax.sy(yBar) - 6, 'T = 2', { fill: '#F4D03F', 'font-size': 10.5, 'text-anchor': 'middle', 'font-weight': 700 }));

        // Un second motif identique plus loin, pour visualiser la répétition
        svg.appendChild(el('line', { x1: ax.sx(2), y1: ax.sy(yBar), x2: ax.sx(4), y2: ax.sy(yBar), stroke: '#F4D03F', 'stroke-width': 1.4, opacity: 0.5 }));
        svg.appendChild(el('line', { x1: ax.sx(4), y1: ax.sy(yBar - 0.08), x2: ax.sx(4), y2: ax.sy(yBar + 0.08), stroke: '#F4D03F', 'stroke-width': 1.4, opacity: 0.5 }));

        // points repères identiques (points de "motif" répété)
        [-4, -2, 0, 2, 4].forEach(function (xi) { dot(svg, ax.sx(xi), ax.sy(f(xi)), '#FF6B6B', 3); });
    }

    /* ---------- Initialisation ---------- */
    function init() {
        var map = { graphParite: drawGraphParite, graphPeriodique: drawGraphPeriodique };
        Object.keys(map).forEach(function (id) {
            var svg = document.getElementById(id);
            if (svg) {
                try { map[id](svg); } catch (e) { console.error('figuresvt_p1:', id, e); }
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
