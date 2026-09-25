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

    // f(x) = x^2 + 2x sur R+ ; g(x) = -1 + sqrt(1+x) sur R+ ; réciproques
    function f9(x) { return x * x + 2 * x; }
    function g9(x) { return -1 + Math.sqrt(1 + x); }

    /* ============================================================
       graphF : f(x) = x^2+2x croissante sur R+
       ============================================================ */
    function drawGraphF(svg) {
        var w = 360, h = 200;
        setResponsive(svg, w, h);
        clear(svg);
        var ax = drawAxes(svg, {
            pad: { l: 28, r: 16, t: 16, b: 24 }, w: w, h: h,
            xmin: -0.4, xmax: 2.6, ymin: -0.4, ymax: 8.5, gridStep: 2,
            xLabel: 'x', yLabel: 'y'
        });
        svg.appendChild(el('path', { d: pathFromFn(ax.sx, ax.sy, f9, 0, 2.4, 100), fill: 'none', stroke: '#4ECDC4', 'stroke-width': 2.4 }));
        dot(svg, ax.sx(0), ax.sy(0), '#4ECDC4', 3.5);
        svg.appendChild(text(ax.sx(1.3), ax.sy(f9(1.3)) - 10, 'f croissante \u2197', { fill: '#F4D03F', 'font-size': 10 }));
    }

    /* ============================================================
       graphG : g(x) = -1+√(1+x) croissante sur R+
       ============================================================ */
    function drawGraphG(svg) {
        var w = 360, h = 200;
        setResponsive(svg, w, h);
        clear(svg);
        var ax = drawAxes(svg, {
            pad: { l: 28, r: 16, t: 16, b: 24 }, w: w, h: h,
            xmin: -0.6, xmax: 8.5, ymin: -0.4, ymax: 2.2, gridStep: 2,
            xLabel: 'x', yLabel: 'y'
        });
        svg.appendChild(el('path', { d: pathFromFn(ax.sx, ax.sy, g9, 0, 8, 100), fill: 'none', stroke: '#4ECDC4', 'stroke-width': 2.4 }));
        dot(svg, ax.sx(0), ax.sy(0), '#4ECDC4', 3.5);
        svg.appendChild(text(ax.sx(4.5), ax.sy(g9(4.5)) - 12, 'g croissante \u2197', { fill: '#F4D03F', 'font-size': 10 }));
    }

    /* ============================================================
       graphSym : Cf, Cg et y=x — symétrie (fonctions réciproques)
       ============================================================ */
    function drawGraphSym(svg) {
        var w = 400, h = 260;
        setResponsive(svg, w, h);
        clear(svg);
        var ax = drawAxes(svg, {
            pad: { l: 30, r: 16, t: 16, b: 26 }, w: w, h: h,
            xmin: -0.6, xmax: 5.2, ymin: -0.6, ymax: 5.2, gridStep: 1,
            xLabel: 'x', yLabel: 'y'
        });
        // droite y = x
        svg.appendChild(el('line', { x1: ax.sx(-0.6), y1: ax.sy(-0.6), x2: ax.sx(5.2), y2: ax.sy(5.2), stroke: '#FF6B6B', 'stroke-width': 1.6, 'stroke-dasharray': '5,4' }));
        svg.appendChild(text(ax.sx(4.5), ax.sy(4.5) - 8, 'y = x', { fill: '#FF6B6B', 'font-size': 10.5 }));

        // Cf en bleu (teal), restreinte à f(x) <= 5.2 (x <= ~1.49)
        svg.appendChild(el('path', { d: pathFromFn(ax.sx, ax.sy, f9, 0, 1.49, 90), fill: 'none', stroke: '#4ECDC4', 'stroke-width': 2.4 }));
        svg.appendChild(text(ax.sx(1.3) + 6, ax.sy(f9(1.3)) - 6, 'C_f', { fill: '#4ECDC4', 'font-size': 11, 'font-weight': 700 }));

        // Cg en vert-clair (utilise F4D03F pour contraste), restreinte à g(x) <= 5.2
        svg.appendChild(el('path', { d: pathFromFn(ax.sx, ax.sy, g9, 0, 5, 100), fill: 'none', stroke: '#4D9DE0', 'stroke-width': 2.4 }));
        svg.appendChild(text(ax.sx(5) - 4, ax.sy(g9(5)) - 6, 'C_g', { fill: '#4D9DE0', 'font-size': 11, 'font-weight': 700, 'text-anchor': 'end' }));

        dot(svg, ax.sx(0), ax.sy(0), '#8B96A5', 3);
    }

    /* ---------- Initialisation ---------- */
    function init() {
        var map = { graphF: drawGraphF, graphG: drawGraphG, graphSym: drawGraphSym };
        Object.keys(map).forEach(function (id) {
            var svg = document.getElementById(id);
            if (svg) {
                try { map[id](svg); } catch (e) { console.error('figuresvt_p9:', id, e); }
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

