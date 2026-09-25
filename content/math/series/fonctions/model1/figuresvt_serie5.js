// ============================================================
// figuresvt_serie5.js
// أشكال Série 5 (fonctions) — Généralités sur les fonctions
// (exercices 31 à 40).
// ملف مستقل بالكامل: بلا svg-utils.js وبلا أي مكتبة مشتركة أخرى.
// كل الدوال المساعدة معرّفة محلياً هنا فقط، وكل رسم مبني من
// المعطيات نفسها ديال السؤال (الدالة، الاتجاه، الخط المقارب).
//
// الأشكال (حسب الـ id فـ serie5.html):
//   #graph31 → Ex.31 : f(x) = (2x+1)/(x-1)   (asym. x=1, y=2 ، décroissante)
//   #graph32 → Ex.32 : g(x) = -x/(x-2)        (asym. x=2, y=-1 ، croissante)
//   #graph33 → Ex.33 : f(x) = (1/4)x³         (croissante sur ℝ)
//   #graph34 → Ex.34 : f(x) = √(x+2)          (D_f=[-2,+∞[، croissante)
//   #graph40 → Ex.40 : h(x) = √(1-x)          (D_h=]-∞,1]، décroissante)
// ============================================================
(function () {
    'use strict';
    var NS = 'http://www.w3.org/2000/svg';
    var COLORS = {
        axis: '#2A2A3E',
        grid: '#1A1A2E',
        curve: '#4ECDC4',
        asym: '#FF6B6B',
        text: '#FFFFFF',
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
            'display:block !important;width:100% !important;max-width:380px !important;' +
            'height:auto !important;max-height:46vh !important;margin:0 auto !important;' +
            'background:#0D1117 !important;border-radius:4px !important;overflow:hidden !important;'
        );
        var fs = Math.max(xMax - xMin, yMax - yMin) / 20;
        return { svg: svg, xMin: xMin, xMax: xMax, yMin: yMin, yMax: yMax, fs: fs };
    }

    function grid(s) {
        var g = el('g', {});
        var i;
        for (i = Math.ceil(s.xMin); i <= Math.floor(s.xMax); i++) {
            if (i === 0) continue;
            var lx = el('line', { x1: i, y1: -s.yMin, x2: i, y2: -s.yMax });
            forceStyle(lx, { stroke: COLORS.grid, 'stroke-width': 0.02 });
            g.appendChild(lx);
        }
        for (i = Math.ceil(s.yMin); i <= Math.floor(s.yMax); i++) {
            if (i === 0) continue;
            var ly = el('line', { x1: s.xMin, y1: -i, x2: s.xMax, y2: -i });
            forceStyle(ly, { stroke: COLORS.grid, 'stroke-width': 0.02 });
            g.appendChild(ly);
        }
        s.svg.appendChild(g);
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
        forceStyle(ax, { stroke: COLORS.axis, 'stroke-width': 0.05 });
        forceStyle(ay, { stroke: COLORS.axis, 'stroke-width': 0.05 });
        s.svg.appendChild(ax);
        s.svg.appendChild(ay);

        var ah = s.fs * 0.4;
        var arx = el('polygon', { points: s.xMax + ',0 ' + (s.xMax - ah) + ',' + (ah / 2) + ' ' + (s.xMax - ah) + ',' + (-ah / 2) });
        var ary = el('polygon', { points: '0,' + (-s.yMax) + ' ' + (-ah / 2) + ',' + (-s.yMax + ah) + ' ' + (ah / 2) + ',' + (-s.yMax + ah) });
        forceStyle(arx, { fill: COLORS.curve, stroke: 'none' });
        forceStyle(ary, { fill: COLORS.curve, stroke: 'none' });
        s.svg.appendChild(arx);
        s.svg.appendChild(ary);

        note(s, 'x', s.xMax - ah, -s.fs * 0.6, { color: COLORS.curve });
        note(s, 'y', s.fs * 0.5, -s.yMax + ah * 1.5, { color: COLORS.curve });
    }

    function curve(s, fn, xStart, xEnd, opts) {
        opts = opts || {};
        var steps = opts.steps || 300;
        var d = '';
        for (var i = 0; i <= steps; i++) {
            var x = xStart + (xEnd - xStart) * i / steps;
            var y = fn(x);
            if (!isFinite(y)) continue;
            d += (d === '' ? 'M' : 'L') + x + ',' + (-y) + ' ';
        }
        var p = el('path', { d: d });
        forceStyle(p, { stroke: opts.color || COLORS.curve, fill: 'none', 'stroke-width': 0.045, 'stroke-linecap': 'round' });
        s.svg.appendChild(p);
    }

    function asymptote(s, opts) {
        if (opts.x !== undefined) {
            var lx = el('line', { x1: opts.x, y1: -s.yMin, x2: opts.x, y2: -s.yMax });
            forceStyle(lx, { stroke: COLORS.asym, 'stroke-width': 0.03, 'stroke-dasharray': '0.12 0.1' });
            s.svg.appendChild(lx);
            if (opts.label) note(s, opts.label, opts.x + s.fs * 0.25, -s.yMax + s.fs * 1.2, { color: COLORS.asym, fontSize: s.fs * 0.8 });
        }
        if (opts.y !== undefined) {
            var ly = el('line', { x1: s.xMin, y1: -opts.y, x2: s.xMax, y2: -opts.y });
            forceStyle(ly, { stroke: COLORS.asym, 'stroke-width': 0.03, 'stroke-dasharray': '0.12 0.1' });
            s.svg.appendChild(ly);
            if (opts.label) note(s, opts.label, s.xMax - s.fs * 3, -opts.y - s.fs * 0.35, { color: COLORS.asym, fontSize: s.fs * 0.8 });
        }
    }

    function point(s, x, y, opts) {
        opts = opts || {};
        var p = el('circle', { cx: x, cy: -y, r: opts.radius || s.fs * 0.22 });
        forceStyle(p, { fill: opts.color || COLORS.curve, stroke: 'none' });
        s.svg.appendChild(p);
    }

    // ------------------------------------------------------------
    // Ex.31 — f(x) = (2x+1)/(x-1), D_f=ℝ\{1}, décroissante, asym. x=1,y=2
    // ------------------------------------------------------------
    function drawGraph31() {
        var s = setupSVG('graph31', { xMin: -6, xMax: 8, yMin: -8, yMax: 10 });
        if (!s) return;
        grid(s); axes(s);
        asymptote(s, { x: 1, label: 'x=1' });
        asymptote(s, { y: 2, label: 'y=2' });
        curve(s, function (x) { return (2 * x + 1) / (x - 1); }, -6, 0.85, {});
        curve(s, function (x) { return (2 * x + 1) / (x - 1); }, 1.15, 8, {});
        note(s, 'f(x) = (2x+1)/(x-1)', s.xMin + s.fs * 0.3, s.yMax - s.fs * 0.7, { color: COLORS.muted, fontSize: s.fs * 0.65 });
    }

    // ------------------------------------------------------------
    // Ex.32 — g(x) = -x/(x-2), D_g=ℝ\{2}, croissante, asym. x=2,y=-1
    // ------------------------------------------------------------
    function drawGraph32() {
        var s = setupSVG('graph32', { xMin: -6, xMax: 8, yMin: -8, yMax: 8 });
        if (!s) return;
        grid(s); axes(s);
        asymptote(s, { x: 2, label: 'x=2' });
        asymptote(s, { y: -1, label: 'y=-1' });
        curve(s, function (x) { return -x / (x - 2); }, -6, 1.85, {});
        curve(s, function (x) { return -x / (x - 2); }, 2.15, 8, {});
        note(s, 'g(x) = -x/(x-2)', s.xMin + s.fs * 0.3, s.yMax - s.fs * 0.7, { color: COLORS.muted, fontSize: s.fs * 0.7 });
    }

    // ------------------------------------------------------------
    // Ex.33 — f(x) = (1/4)x³, D_f=ℝ, strictement croissante
    // ------------------------------------------------------------
    function drawGraph33() {
        var s = setupSVG('graph33', { xMin: -3, xMax: 3, yMin: -8, yMax: 8 });
        if (!s) return;
        grid(s); axes(s);
        curve(s, function (x) { return 0.25 * x * x * x; }, -3, 3, {});
        note(s, 'f(x) = ¼x³', s.xMin + s.fs * 0.3, s.yMax - s.fs * 0.8, { color: COLORS.muted, fontSize: s.fs * 0.75 });
    }

    // ------------------------------------------------------------
    // Ex.34 — f(x) = √(x+2), D_f=[-2,+∞[, strictement croissante
    // ------------------------------------------------------------
    function drawGraph34() {
        var s = setupSVG('graph34', { xMin: -3, xMax: 8, yMin: -1, yMax: 4 });
        if (!s) return;
        grid(s); axes(s);
        curve(s, function (x) { return Math.sqrt(x + 2); }, -2, 8, {});
        point(s, -2, 0, {});
        note(s, 'f(x) = √(x+2)', s.xMin + s.fs * 0.3, s.yMax - s.fs * 0.7, { color: COLORS.muted, fontSize: s.fs * 0.85 });
    }

    // ------------------------------------------------------------
    // Ex.40 — h(x) = √(1-x), D_h=]-∞,1], strictement décroissante
    // ------------------------------------------------------------
    function drawGraph40() {
        var s = setupSVG('graph40', { xMin: -8, xMax: 3, yMin: -1, yMax: 4 });
        if (!s) return;
        grid(s); axes(s);
        curve(s, function (x) { return Math.sqrt(1 - x); }, -8, 1, {});
        point(s, 1, 0, {});
        note(s, 'h(x) = √(1-x)', s.xMin + s.fs * 0.3, s.yMax - s.fs * 0.7, { color: COLORS.muted, fontSize: s.fs * 0.85 });
    }

    function initFigures() {
        drawGraph31();
        drawGraph32();
        drawGraph33();
        drawGraph34();
        drawGraph40();
    }

    window.XpertFiguresSerie5 = { initFigures: initFigures };

    document.addEventListener('DOMContentLoaded', function () {
        setTimeout(initFigures, 150);
    });
})();

