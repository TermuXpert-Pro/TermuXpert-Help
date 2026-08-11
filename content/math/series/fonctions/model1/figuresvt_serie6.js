// ============================================================
// figuresvt_serie6.js
// شكل Série 6 (fonctions) — Composée - Fonctions réciproques.
// ملف مستقل بالكامل: بلا svg-utils.js وبلا أي مكتبة مشتركة أخرى.
//
// الشكل (حسب الـ id فـ serie6.html):
//   #graph42 → Ex.42 : f périodique de période T=2, avec
//              f(x) = 2x - x² sur [0;2], tracée sur [-2;8]
//              (المنحنى كيتكرر فعلياً كل 2 وحدات، ماشي مرة وحدة).
// ============================================================
(function () {
    'use strict';
    var NS = 'http://www.w3.org/2000/svg';
    var COLORS = {
        axis: '#2A2A3E',
        grid: '#1A1A2E',
        curve: '#4ECDC4',
        asym: '#FF6B6B',
        muted: '#888888'
    };

    function el(tag, attrs) {
        var e = document.createElementNS(NS, tag);
        for (var k in attrs) e.setAttribute(k, attrs[k]);
        return e;
    }

    function forceStyle(node, props) {
        var s = 'opacity:1 !important;visibility:visible !important;' +
            'display:inline !important;pointer-events:none;';
        for (var k in props) {
            if (props[k] === undefined || props[k] === null) continue;
            s += k + ':' + props[k] + ' !important;';
        }
        node.setAttribute('style', s);
    }

    function setupSVG(id, range) {
        var svg = document.getElementById(id);
        if (!svg) return null;
        var xMin = range.xMin, xMax = range.xMax, yMin = range.yMin, yMax = range.yMax;
        while (svg.firstChild) svg.removeChild(svg.firstChild);
        svg.setAttribute('viewBox', xMin + ' ' + (-yMax) + ' ' + (xMax - xMin) + ' ' + (yMax - yMin));
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        svg.setAttribute('width', '100%');
        svg.removeAttribute('height');
        svg.setAttribute('style',
            'display:block !important;width:100% !important;max-width:420px !important;' +
            'height:auto !important;max-height:46vh !important;margin:0 auto !important;' +
            'background:#0D1117 !important;border-radius:4px !important;overflow:hidden !important;'
        );
        var fs = Math.max(xMax - xMin, yMax - yMin) / 20;
        return { svg: svg, xMin: xMin, xMax: xMax, yMin: yMin, yMax: yMax, fs: fs };
    }

    function note(s, text, x, y, opts) {
        opts = opts || {};
        var t = el('text', {
            x: x, y: y,
            'font-size': opts.fontSize || s.fs,
            'font-family': 'Arial, sans-serif',
            'text-anchor': opts.anchor || 'start'
        });
        forceStyle(t, { fill: opts.color || COLORS.muted });
        t.textContent = text;
        s.svg.appendChild(t);
    }

    function axes(s) {
        var ax = el('line', { x1: s.xMin, y1: 0, x2: s.xMax, y2: 0 });
        var ay = el('line', { x1: 0, y1: -s.yMin, x2: 0, y2: -s.yMax });
        forceStyle(ax, { stroke: COLORS.axis, 'stroke-width': 0.03 });
        forceStyle(ay, { stroke: COLORS.axis, 'stroke-width': 0.03 });
        s.svg.appendChild(ax);
        s.svg.appendChild(ay);
    }

    // خطوط شاقولية عند كل حد ديال الفترة (n×T) باش تبان التكرار بوضوح
    function periodMarkers(s, period, xMin, xMax) {
        for (var k = Math.ceil(xMin / period) * period; k <= xMax; k += period) {
            var l = el('line', { x1: k, y1: -s.yMin, x2: k, y2: -s.yMax });
            forceStyle(l, { stroke: COLORS.asym, 'stroke-width': 0.015, 'stroke-dasharray': '0.06 0.05' });
            s.svg.appendChild(l);
        }
    }

    function curve(s, fn, xStart, xEnd, opts) {
        opts = opts || {};
        var steps = opts.steps || 500;
        var d = '';
        for (var i = 0; i <= steps; i++) {
            var x = xStart + (xEnd - xStart) * i / steps;
            var y = fn(x);
            if (!isFinite(y)) continue;
            d += (d === '' ? 'M' : 'L') + x + ',' + (-y) + ' ';
        }
        var p = el('path', { d: d });
        forceStyle(p, { stroke: opts.color || COLORS.curve, fill: 'none', 'stroke-width': 0.018, 'stroke-linecap': 'round' });
        s.svg.appendChild(p);
    }

    // ------------------------------------------------------------
    // Ex.42 — f périodique T=2, f(x)=2x-x² sur [0;2], tracée sur [-2;8]
    // ------------------------------------------------------------
    function drawGraph42() {
        var s = setupSVG('graph42', { xMin: -2, xMax: 8, yMin: -0.5, yMax: 1.5 });
        if (!s) return;
        periodMarkers(s, 2, s.xMin, s.xMax);
        axes(s);
        var periodic = function (x) {
            var t = x - 2 * Math.floor(x / 2); // t دائماً فـ [0;2[
            return 2 * t - t * t;
        };
        curve(s, periodic, -2, 8, {});
        note(s, 'Période T = 2', s.xMin + s.fs * 0.2, s.yMax - s.fs * 0.5, { color: COLORS.muted, fontSize: s.fs * 0.7 });
    }

    function initFigures() {
        drawGraph42();
    }

    window.XpertFiguresSerie6 = { initFigures: initFigures };

    document.addEventListener('DOMContentLoaded', function () {
        setTimeout(initFigures, 150);
    });
})();
