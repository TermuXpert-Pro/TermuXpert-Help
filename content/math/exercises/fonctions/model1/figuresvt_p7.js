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

    /* ---------- Petit outil : boîte + flèche pour schéma de composition ---------- */
    function box(svg, cx, cy, w, h, label, color) {
        svg.appendChild(el('rect', { x: cx - w / 2, y: cy - h / 2, width: w, height: h, rx: 8, fill: '#0D1117', stroke: color, 'stroke-width': 1.6 }));
        var fs = label.length > 16 ? 9.5 : 11.5;
        svg.appendChild(text(cx, cy + 4, label, { fill: color, 'font-size': fs, 'text-anchor': 'middle', 'font-weight': 700 }));
    }
    function arrowRight(svg, x1, x2, y, label, color) {
        addArrowMarker(svg, svg.id + '_arr_' + Math.round(x1), color);
        svg.appendChild(el('line', { x1: x1, y1: y, x2: x2 - 4, y2: y, stroke: color, 'stroke-width': 1.6, 'marker-end': 'url(#' + svg.id + '_arr_' + Math.round(x1) + ')' }));
        svg.appendChild(text((x1 + x2) / 2, y - 8, label, { fill: color, 'font-size': 11, 'text-anchor': 'middle', 'font-style': 'italic' }));
    }
    function drawFlow(svg, labels) {
        // labels = { in, mid, out, vName, uName }
        var w = 400, h = 130;
        setResponsive(svg, w, h);
        clear(svg);
        var y = h / 2;
        var bh = 40;
        var bw1 = 46, x1 = 31;
        var bw2 = 116, x2 = 142;
        var bw3 = 176, x3 = 304;
        box(svg, x1, y, bw1, bh, labels['in'], '#4ECDC4');
        box(svg, x2, y, bw2, bh, labels['mid'], '#F4D03F');
        box(svg, x3, y, bw3, bh, labels['out'], '#FF6B6B');
        arrowRight(svg, x1 + bw1 / 2, x2 - bw2 / 2, y, labels.vName, '#F4D03F');
        arrowRight(svg, x2 + bw2 / 2, x3 - bw3 / 2, y, labels.uName, '#FF6B6B');
    }

    function drawFlow1(svg) {
        drawFlow(svg, { in: 'x', mid: 'v(x) = 1-2x', out: 'u(v(x)) = \u221A(1-2x)', vName: 'v', uName: 'u' });
    }
    function drawFlow2(svg) {
        drawFlow(svg, { in: 'x', mid: 'v(x) = 2x+1', out: 'u(v(x)) = (2x+1)\u00B2', vName: 'v', uName: 'u' });
    }
    function drawFlow3(svg) {
        drawFlow(svg, { in: 'x', mid: 'v(x) = |x|', out: 'u(v(x)) = |x|-2', vName: 'v', uName: 'u' });
    }
    function drawFlow4(svg) {
        drawFlow(svg, { in: 'x', mid: 'v(x) = x\u00B2+3', out: 'u(v(x)) = 2\u221A(x\u00B2+3)', vName: 'v', uName: 'u' });
    }

    /* ---------- Initialisation ---------- */
    function init() {
        var map = { flow1: drawFlow1, flow2: drawFlow2, flow3: drawFlow3, flow4: drawFlow4 };
        Object.keys(map).forEach(function (id) {
            var svg = document.getElementById(id);
            if (svg) {
                try { map[id](svg); } catch (e) { console.error('figuresvt_p7:', id, e); }
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
