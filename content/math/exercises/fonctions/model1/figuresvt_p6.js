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

    /* ---------- Petit outil : droite graduée horizontale ---------- */
    function numberLine(svg, y, xminPx, xmaxPx, sx, ticks) {
        var axisColor = '#3A4552';
        addArrowMarker(svg, svg.id + '_arrN', axisColor);
        svg.appendChild(el('line', { x1: xminPx, y1: y, x2: xmaxPx + 8, y2: y, stroke: axisColor, 'stroke-width': 1.6, 'marker-end': 'url(#' + svg.id + '_arrN)' }));
        ticks.forEach(function (t) {
            var px = sx(t.v);
            svg.appendChild(el('line', { x1: px, y1: y - 5, x2: px, y2: y + 5, stroke: axisColor, 'stroke-width': 1.2 }));
            svg.appendChild(text(px, y + 18, t.label, { fill: '#8B96A5', 'font-size': 10.5, 'text-anchor': 'middle' }));
        });
    }
    function openCircle(svg, cx, cy, color) {
        svg.appendChild(el('circle', { cx: cx, cy: cy, r: 4.2, fill: '#0D1117', stroke: color, 'stroke-width': 2 }));
    }
    function filledCircle(svg, cx, cy, color) {
        svg.appendChild(el('circle', { cx: cx, cy: cy, r: 4.2, fill: color, stroke: color, 'stroke-width': 2 }));
    }

    /* ============================================================
       domFG : construction de D_{f∘g} = ]-∞,-2[
       D_g = R\{-2} ; condition g(x)≥1 ⟺ x<-2
       ============================================================ */
    function drawDomFG(svg) {
        var w = 360, h = 175;
        setResponsive(svg, w, h);
        clear(svg);
        var padL = 24, padR = 24;
        var xmin = -5.5, xmax = 3.5;
        var sx = scaleFn(xmin, xmax, padL, w - padR);
        var ticks = [{ v: -4, label: '-4' }, { v: -2, label: '-2' }, { v: 0, label: '0' }, { v: 2, label: '2' }];

        // Ligne 1 : D_g = R \ {-2}
        svg.appendChild(text(padL, 24, 'D_g = ℝ \\ {-2}', { fill: '#8B96A5', 'font-size': 11 }));
        var y1 = 38;
        svg.appendChild(el('line', { x1: sx(xmin), y1: y1, x2: sx(xmax) + 8, y2: y1, stroke: '#4ECDC4', 'stroke-width': 3, 'stroke-linecap': 'round' }));
        openCircle(svg, sx(-2), y1, '#4ECDC4');
        numberLine(svg, y1 + 26, sx(xmin), sx(xmax), sx, ticks);

        // Ligne 2 : condition g(x) >= 1  <=>  x < -2
        svg.appendChild(text(padL, 96, 'g(x) \u2265 1  \u27FA  x < -2', { fill: '#8B96A5', 'font-size': 11 }));
        var y2 = 110;
        svg.appendChild(el('line', { x1: sx(xmin), y1: y2, x2: sx(-2), y2: y2, stroke: '#F4D03F', 'stroke-width': 3, 'stroke-linecap': 'round' }));
        openCircle(svg, sx(-2), y2, '#F4D03F');

        // Résultat : intersection = ]-inf,-2[
        svg.appendChild(text(padL, 140, 'D_{f∘g} = ]-\u221E, -2[', { fill: '#FF6B6B', 'font-size': 12, 'font-weight': 700 }));
        var y3 = 154;
        svg.appendChild(el('line', { x1: sx(xmin), y1: y3, x2: sx(-2), y2: y3, stroke: '#FF6B6B', 'stroke-width': 4, 'stroke-linecap': 'round' }));
        openCircle(svg, sx(-2), y3, '#FF6B6B');
    }

    /* ============================================================
       domGF : construction de D_{g∘f} = [1,+∞[
       D_f = [1,+∞[ ; condition f(x)+2≠0 toujours vraie
       ============================================================ */
    function drawDomGF(svg) {
        var w = 360, h = 150;
        setResponsive(svg, w, h);
        clear(svg);
        var padL = 24, padR = 24;
        var xmin = -1, xmax = 5.5;
        var sx = scaleFn(xmin, xmax, padL, w - padR);
        var ticks = [{ v: 0, label: '0' }, { v: 1, label: '1' }, { v: 3, label: '3' }, { v: 5, label: '5' }];

        // Ligne 1 : D_f = [1,+inf[
        svg.appendChild(text(padL, 24, 'D_f = [1, +\u221E[', { fill: '#8B96A5', 'font-size': 11 }));
        var y1 = 38;
        svg.appendChild(el('line', { x1: sx(1), y1: y1, x2: sx(xmax) + 8, y2: y1, stroke: '#4ECDC4', 'stroke-width': 3, 'stroke-linecap': 'round' }));
        filledCircle(svg, sx(1), y1, '#4ECDC4');
        numberLine(svg, y1 + 26, sx(xmin), sx(xmax), sx, ticks);

        // Note : condition toujours vérifiée
        svg.appendChild(text(padL, 96, 'f(x)+2 \u2260 0 : toujours vraie sur D_f', { fill: '#8B96A5', 'font-size': 11 }));

        // Résultat
        svg.appendChild(text(padL, 122, 'D_{g∘f} = [1, +\u221E[', { fill: '#FF6B6B', 'font-size': 12, 'font-weight': 700 }));
        var y3 = 136;
        svg.appendChild(el('line', { x1: sx(1), y1: y3, x2: sx(xmax) + 8, y2: y3, stroke: '#FF6B6B', 'stroke-width': 4, 'stroke-linecap': 'round' }));
        filledCircle(svg, sx(1), y3, '#FF6B6B');
    }

    /* ---------- Initialisation ---------- */
    function init() {
        var map = { domFG: drawDomFG, domGF: drawDomGF };
        Object.keys(map).forEach(function (id) {
            var svg = document.getElementById(id);
            if (svg) {
                try { map[id](svg); } catch (e) { console.error('figuresvt_p6:', id, e); }
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
