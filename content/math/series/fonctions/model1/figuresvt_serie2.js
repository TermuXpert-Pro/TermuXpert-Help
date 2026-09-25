// ============================================================
// figuresvt_serie2.js
// أشكال Série 2 (fonctions) — Variations - Taux d'accroissement.
// ملف مستقل بالكامل: لا استيراد من svg-utils.js ولا من أي مكتبة
// مشتركة أخرى. كل الدوال المساعدة (بناء الـ SVG، الشبكة، المحاور،
// المنحنى، الخط المقارب، التعليق النصي) معرّفة محلياً هنا فقط.
//
// كل رسم مبني من جديد انطلاقاً من معطيات السؤال نفسه (الدالة،
// المجال، الخطوط المقاربة) وليس من أي رسم سابق.
//
// الأشكال (حسب الـ id فـ serie2.html):
//   #graphHyperbole      → تمرين 5.2 : g(x) = 2/x
//                          (décroissante sur ]-∞,0[ et sur ]0,+∞[)
//   #graphParabole        → تمرين 6   : f(x) = 3x² + 2
//                          (minimum en S(0 ; 2))
//   #graphHomographique   → تمرين 7   : g(x) = x/(x+1)
//                          (asymptotes x = -1 et y = 1, croissante)
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

    // style inline بـ !important باش ما يتأثرش بأي CSS عام ديال الموقع
    function forceStyle(node, props) {
        var s = 'opacity:1 !important;visibility:visible !important;' +
            'display:inline !important;pointer-events:none;';
        for (var k in props) {
            if (props[k] === undefined || props[k] === null) continue;
            s += k + ':' + props[k] + ' !important;';
        }
        node.setAttribute('style', s);
    }

    // كيبني viewBox رياضي (y مقلوبة تلقائياً) ويرجع state كامل
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

    function axes(s, opts) {
        opts = opts || {};
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

        if (opts.labels !== false) {
            note(s, 'x', s.xMax - ah, -s.fs * 0.6, { color: COLORS.curve });
            note(s, 'y', s.fs * 0.5, -s.yMax + ah * 1.5, { color: COLORS.curve });
        }
    }

    // يرسم منحنى y = fn(x) بين xStart و xEnd بواسطة polyline دقيق
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

    // ------------------------------------------------------------
    // Exercice 5.2 — g(x) = 2/x
    // D_g = ℝ*, décroissante sur ]-∞,0[ et sur ]0,+∞[ (hyperbole)
    // ------------------------------------------------------------
    function drawHyperbole() {
        var s = setupSVG('graphHyperbole', { xMin: -6, xMax: 6, yMin: -4, yMax: 4 });
        if (!s) return;
        grid(s);
        axes(s);
        // cutoff x=0.5 : g(0.5)=4 (bord haut) — coupe nette à la marge
        curve(s, function (x) { return 2 / x; }, -6, -0.5, {});
        curve(s, function (x) { return 2 / x; }, 0.5, 6, {});
        note(s, 'g(x) = 2/x', s.xMin + s.fs * 0.4, s.yMax - s.fs * 0.7, { color: COLORS.muted, fontSize: s.fs * 0.85 });
    }

    // ------------------------------------------------------------
    // Exercice 6 — f(x) = 3x² + 2
    // D_f = ℝ, minimum au sommet S(0 ; 2) (parabole)
    // ------------------------------------------------------------
    function drawParabole() {
        var s = setupSVG('graphParabole', { xMin: -1.7, xMax: 1.7, yMin: -1, yMax: 10.5 });
        if (!s) return;
        grid(s);
        axes(s);
        curve(s, function (x) { return 3 * x * x + 2; }, -1.6, 1.6, {});
        var pt = el('circle', { cx: 0, cy: -2, r: s.fs * 0.28 });
        forceStyle(pt, { fill: COLORS.curve, stroke: 'none' });
        s.svg.appendChild(pt);
        note(s, 'S(0;2)', s.fs * 0.5, -2 - s.fs * 0.5, { color: COLORS.text, fontSize: s.fs * 0.8 });
        note(s, 'f(x) = 3x² + 2', s.xMin + s.fs * 0.3, s.yMax - s.fs * 0.9, { color: COLORS.muted, fontSize: s.fs * 0.7 });
    }

    // ------------------------------------------------------------
    // Exercice 7 — g(x) = x/(x+1)
    // D_g = ℝ \ {-1}, asymptotes x=-1 et y=1, strictement croissante
    // ------------------------------------------------------------
    function drawHomographique() {
        var s = setupSVG('graphHomographique', { xMin: -6, xMax: 6, yMin: -4, yMax: 4 });
        if (!s) return;
        grid(s);
        axes(s);
        asymptote(s, { x: -1, label: 'x=-1' });
        asymptote(s, { y: 1, label: 'y=1' });
        // branche gauche (x<-1) : g(-1.34)≈4 (bord haut) → coupe à -1.34
        curve(s, function (x) { return x / (x + 1); }, -6, -1.34, {});
        // branche droite (x>-1) : g(-0.8)=-4 (bord bas) → coupe à -0.8
        curve(s, function (x) { return x / (x + 1); }, -0.8, 6, {});
        note(s, 'g(x) = x/(x+1)', s.xMin + s.fs * 0.4, s.yMax - s.fs * 0.7, { color: COLORS.muted, fontSize: s.fs * 0.85 });
    }

    function initFigures() {
        drawHyperbole();
        drawParabole();
        drawHomographique();
    }

    window.XpertFiguresSerie2 = { initFigures: initFigures };

    document.addEventListener('DOMContentLoaded', function () {
        setTimeout(initFigures, 150);
    });
})();

