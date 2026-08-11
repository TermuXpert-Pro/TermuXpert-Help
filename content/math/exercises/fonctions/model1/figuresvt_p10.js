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

    var PI = Math.PI;
    function fCos(x) { return Math.cos(x); }
    function f10(x) { return 2 * Math.cos(x) - x; }
    function g10(x) { return f10(4 * x); }
    function h10(x) { return Math.pow(f10(x), 2); }

    /* ============================================================
       graphCos : cos(x) décroissante sur [0, π]
       ============================================================ */
    function drawGraphCos(svg) {
        var w = 360, h = 165;
        setResponsive(svg, w, h);
        clear(svg);
        var ax = drawAxes(svg, {
            pad: { l: 26, r: 16, t: 14, b: 24 }, w: w, h: h,
            xmin: -0.3, xmax: PI + 0.3, ymin: -1.3, ymax: 1.3, gridStep: 1,
            grid: false,
            xLabel: 'x', yLabel: 'y'
        });
        svg.appendChild(el('path', { d: pathFromFn(ax.sx, ax.sy, fCos, 0, PI, 80), fill: 'none', stroke: '#4ECDC4', 'stroke-width': 2.4 }));
        dot(svg, ax.sx(0), ax.sy(1), '#F4D03F', 3.5);
        dot(svg, ax.sx(PI), ax.sy(-1), '#F4D03F', 3.5);
        svg.appendChild(text(ax.sx(0) + 4, ax.sy(1) - 6, '1', { fill: '#F4D03F', 'font-size': 9.5 }));
        svg.appendChild(text(ax.sx(PI) - 4, ax.sy(-1) + 14, '-1', { fill: '#F4D03F', 'font-size': 9.5, 'text-anchor': 'end' }));
        svg.appendChild(text(ax.sx(PI), ax.sy(-1.3) + 14, '\u03C0', { fill: '#8B96A5', 'font-size': 11, 'text-anchor': 'middle' }));
        svg.appendChild(text(ax.sx(PI / 2), ax.sy(fCos(PI / 2)) + 16, 'cos décroissante \u2198', { fill: '#F4D03F', 'font-size': 9.5, 'text-anchor': 'middle' }));
    }

    /* ============================================================
       graphF10 : f(x) = 2cos(x) - x décroissante sur [0, π]
       ============================================================ */
    function drawGraphF10(svg) {
        var w = 360, h = 200;
        setResponsive(svg, w, h);
        clear(svg);
        var ax = drawAxes(svg, {
            pad: { l: 28, r: 16, t: 16, b: 24 }, w: w, h: h,
            xmin: -0.3, xmax: PI + 0.3, ymin: -6, ymax: 2.5, gridStep: 2,
            grid: false,
            xLabel: 'x', yLabel: 'y'
        });
        svg.appendChild(el('path', { d: pathFromFn(ax.sx, ax.sy, f10, 0, PI, 90), fill: 'none', stroke: '#4ECDC4', 'stroke-width': 2.4 }));
        dot(svg, ax.sx(0), ax.sy(f10(0)), '#FF6B6B', 3.5);
        dot(svg, ax.sx(PI), ax.sy(f10(PI)), '#FF6B6B', 3.5);
        svg.appendChild(text(ax.sx(0) + 4, ax.sy(f10(0)) - 6, '2', { fill: '#FF6B6B', 'font-size': 9.5 }));
        svg.appendChild(text(ax.sx(PI) - 4, ax.sy(f10(PI)) + 14, '-\u03C0-2', { fill: '#FF6B6B', 'font-size': 9.5, 'text-anchor': 'end' }));
        svg.appendChild(text(ax.sx(1.5), ax.sy(f10(1.5)) - 12, 'f décroissante \u2198', { fill: '#F4D03F', 'font-size': 9.5 }));
    }

    /* ============================================================
       graphG10 : g(x) = f(4x) décroissante sur [0, π/4]
       ============================================================ */
    function drawGraphG10(svg) {
        var w = 360, h = 200;
        setResponsive(svg, w, h);
        clear(svg);
        var xmax = PI / 4;
        var ax = drawAxes(svg, {
            pad: { l: 28, r: 16, t: 16, b: 24 }, w: w, h: h,
            xmin: -0.05, xmax: xmax + 0.08, ymin: -1.2, ymax: 2.3, gridStep: 1,
            grid: false,
            xLabel: 'x', yLabel: 'y'
        });
        svg.appendChild(el('path', { d: pathFromFn(ax.sx, ax.sy, g10, 0, xmax, 90), fill: 'none', stroke: '#4ECDC4', 'stroke-width': 2.4 }));
        dot(svg, ax.sx(0), ax.sy(g10(0)), '#FF6B6B', 3.5);
        dot(svg, ax.sx(xmax), ax.sy(g10(xmax)), '#FF6B6B', 3.5);
        svg.appendChild(text(ax.sx(0) + 4, ax.sy(g10(0)) - 6, '2', { fill: '#FF6B6B', 'font-size': 9.5 }));
        svg.appendChild(text(ax.sx(xmax), ax.sy(-1.2) + 14, '\u03C0/4', { fill: '#8B96A5', 'font-size': 10.5, 'text-anchor': 'middle' }));
        svg.appendChild(text(ax.sx(xmax / 2), ax.sy(g10(xmax / 2)) - 12, 'g décroissante \u2198', { fill: '#F4D03F', 'font-size': 9.5, 'text-anchor': 'middle' }));
    }

    /* ============================================================
       graphH10 : h(x) = (2cos(x)-x)^2 décroissante sur [0, π/4]
       ============================================================ */
    function drawGraphH10(svg) {
        var w = 360, h = 200;
        setResponsive(svg, w, h);
        clear(svg);
        var xmax = PI / 4;
        var ymax = h10(0) + 0.5;
        var ax = drawAxes(svg, {
            pad: { l: 28, r: 16, t: 16, b: 24 }, w: w, h: h,
            xmin: -0.05, xmax: xmax + 0.08, ymin: 0, ymax: ymax, gridStep: 1,
            grid: false,
            xLabel: 'x', yLabel: 'y'
        });
        svg.appendChild(el('path', { d: pathFromFn(ax.sx, ax.sy, h10, 0, xmax, 90), fill: 'none', stroke: '#4ECDC4', 'stroke-width': 2.4 }));
        dot(svg, ax.sx(0), ax.sy(h10(0)), '#FF6B6B', 3.5);
        dot(svg, ax.sx(xmax), ax.sy(h10(xmax)), '#FF6B6B', 3.5);
        svg.appendChild(text(ax.sx(0) + 4, ax.sy(h10(0)) - 6, '4', { fill: '#FF6B6B', 'font-size': 9.5 }));
        svg.appendChild(text(ax.sx(xmax), ax.sy(0) + 14, '\u03C0/4', { fill: '#8B96A5', 'font-size': 10.5, 'text-anchor': 'middle' }));
        svg.appendChild(text(ax.sx(xmax / 2), ax.sy(h10(xmax / 2)) - 12, 'h décroissante \u2198', { fill: '#F4D03F', 'font-size': 9.5, 'text-anchor': 'middle' }));
    }

    /* ---------- Initialisation ---------- */
    function init() {
        var map = { graphCos: drawGraphCos, graphF10: drawGraphF10, graphG10: drawGraphG10, graphH10: drawGraphH10 };
        Object.keys(map).forEach(function (id) {
            var svg = document.getElementById(id);
            if (svg) {
                try { map[id](svg); } catch (e) { console.error('figuresvt_p10:', id, e); }
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
