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

    // f(x) = x*sqrt(4-x^2), Df = [-2,2]
    function f4(x) {
        var u = 4 - x * x;
        if (u < 0) return null;
        return x * Math.sqrt(u);
    }

    /* ============================================================
       graphParite4 : f impaire — symétrie / origine
       ============================================================ */
    function drawGraphParite4(svg) {
        var w = 360, h = 210;
        setResponsive(svg, w, h);
        clear(svg);
        var ax = drawAxes(svg, {
            pad: { l: 26, r: 16, t: 16, b: 24 }, w: w, h: h,
            xmin: -2.5, xmax: 2.5, ymin: -2.5, ymax: 2.5, gridStep: 1,
            xLabel: 'x', yLabel: 'y'
        });
        svg.appendChild(el('path', { d: pathFromFn(ax.sx, ax.sy, f4, -2, 2, 120), fill: 'none', stroke: '#4ECDC4', 'stroke-width': 2.4 }));

        var a = 1.3;
        dot(svg, ax.sx(a), ax.sy(f4(a)), '#F4D03F', 3.6);
        dot(svg, ax.sx(-a), ax.sy(f4(-a)), '#F4D03F', 3.6);
        svg.appendChild(el('line', { x1: ax.sx(-a), y1: ax.sy(f4(-a)), x2: ax.sx(a), y2: ax.sy(f4(a)), stroke: '#F4D03F', 'stroke-width': 1, 'stroke-dasharray': '3,3' }));
        dot(svg, ax.sx(0), ax.sy(0), '#FF6B6B', 3);
        svg.appendChild(text(ax.sx(0) + 6, ax.sy(0) - 8, 'symétrie / origine', { fill: '#FF6B6B', 'font-size': 9 }));
        svg.appendChild(text(ax.sx(a) + 6, ax.sy(f4(a)) - 4, 'f(x)', { fill: '#F4D03F', 'font-size': 9.5 }));
        svg.appendChild(text(ax.sx(-a) - 6, ax.sy(f4(-a)) + 12, '-f(x)=f(-x)', { fill: '#F4D03F', 'font-size': 9, 'text-anchor': 'end' }));
    }

    /* ============================================================
       graphMax4 : max M=2 en x=√2, min -2 en x=-√2
       ============================================================ */
    function drawGraphMax4(svg) {
        var w = 360, h = 210;
        setResponsive(svg, w, h);
        clear(svg);
        var ax = drawAxes(svg, {
            pad: { l: 26, r: 16, t: 16, b: 24 }, w: w, h: h,
            xmin: -2.5, xmax: 2.5, ymin: -2.5, ymax: 2.5, gridStep: 1,
            xLabel: 'x', yLabel: 'y'
        });
        svg.appendChild(el('path', { d: pathFromFn(ax.sx, ax.sy, f4, -2, 2, 120), fill: 'none', stroke: '#4ECDC4', 'stroke-width': 2.4 }));

        var r2 = Math.SQRT2;
        // Max en x=sqrt(2)
        svg.appendChild(el('line', { x1: ax.sx(r2), y1: ax.sy(2), x2: ax.sx(r2), y2: ax.sy(0), stroke: '#FF6B6B', 'stroke-width': 1, 'stroke-dasharray': '3,3' }));
        svg.appendChild(el('line', { x1: ax.sx(0), y1: ax.sy(2), x2: ax.sx(r2), y2: ax.sy(2), stroke: '#FF6B6B', 'stroke-width': 1, 'stroke-dasharray': '3,3' }));
        dot(svg, ax.sx(r2), ax.sy(2), '#FF6B6B', 4);
        svg.appendChild(text(ax.sx(r2) + 6, ax.sy(2) - 4, 'Max M=2 (√2, 2)', { fill: '#FF6B6B', 'font-size': 9.5, 'font-weight': 700 }));

        // Min en x=-sqrt(2)
        svg.appendChild(el('line', { x1: ax.sx(-r2), y1: ax.sy(-2), x2: ax.sx(-r2), y2: ax.sy(0), stroke: '#BB8FCE', 'stroke-width': 1, 'stroke-dasharray': '3,3' }));
        svg.appendChild(el('line', { x1: ax.sx(0), y1: ax.sy(-2), x2: ax.sx(-r2), y2: ax.sy(-2), stroke: '#BB8FCE', 'stroke-width': 1, 'stroke-dasharray': '3,3' }));
        dot(svg, ax.sx(-r2), ax.sy(-2), '#BB8FCE', 4);
        svg.appendChild(text(ax.sx(-r2) - 6, ax.sy(-2) + 14, 'Min (-√2, -2)', { fill: '#BB8FCE', 'font-size': 9.5, 'text-anchor': 'end', 'font-weight': 700 }));
    }

    /* ---------- Initialisation ---------- */
    function init() {
        var map = { graphParite4: drawGraphParite4, graphMax4: drawGraphMax4 };
        Object.keys(map).forEach(function (id) {
            var svg = document.getElementById(id);
            if (svg) {
                try { map[id](svg); } catch (e) { console.error('figuresvt_p4:', id, e); }
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

