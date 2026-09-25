/* ============================================================
   figuresvt_p3.js — Partie 3 : Barycentre de quatre points pondérés
   ملف مستقل بالكامل (self-contained) — لا يعتمد على أي مكتبة مشتركة.
   يرسم: parallelogramGraph, bary4Graph, assoc4Graph, coord4Graph
   ============================================================ */
(function () {
    'use strict';
    var NS = 'http://www.w3.org/2000/svg';

    function el(tag, attrs) {
        var e = document.createElementNS(NS, tag);
        for (var k in attrs) { if (attrs.hasOwnProperty(k)) e.setAttribute(k, attrs[k]); }
        return e;
    }
    function txt(x, y, str, opts) {
        opts = opts || {};
        var t = el('text', {
            x: x, y: y, 'text-anchor': opts.anchor || 'middle',
            'font-family': "'Cairo','Segoe UI',sans-serif",
            'font-size': opts.size || 13,
            'font-weight': opts.weight || '600',
            fill: opts.color || '#E6EDF3'
        });
        t.textContent = str;
        return t;
    }
    function initSVG(id, w, h) {
        var svg = document.getElementById(id);
        if (!svg) return null;
        while (svg.firstChild) svg.removeChild(svg.firstChild);
        svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
        svg.setAttribute('width', '100%');
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        svg.style.height = 'auto';
        svg.style.display = 'block';
        svg.style.margin = '0 auto';
        return svg;
    }
    function arrowMarker(svg, id, color) {
        var defs = svg.querySelector('defs');
        if (!defs) { defs = el('defs', {}); svg.appendChild(defs); }
        var m = el('marker', {
            id: id, markerWidth: 8, markerHeight: 8, refX: 6, refY: 3,
            orient: 'auto', markerUnits: 'strokeWidth'
        });
        m.appendChild(el('path', { d: 'M0,0 L7,3 L0,6 Z', fill: color }));
        defs.appendChild(m);
    }
    function point(svg, x, y, color, r) {
        svg.appendChild(el('circle', { cx: x, cy: y, r: r || 5, fill: color, stroke: '#0D1117', 'stroke-width': 1.5 }));
    }
    function seg(svg, x1, y1, x2, y2, color, w, dash) {
        var a = { x1: x1, y1: y1, x2: x2, y2: y2, stroke: color, 'stroke-width': w || 1.5 };
        if (dash) a['stroke-dasharray'] = dash;
        svg.appendChild(el('line', a));
    }
    function vec(svg, x1, y1, x2, y2, color, markerId, w) {
        svg.appendChild(el('line', {
            x1: x1, y1: y1, x2: x2, y2: y2, stroke: color, 'stroke-width': w || 2,
            'marker-end': 'url(#' + markerId + ')'
        }));
    }
    function poly(svg, pts, stroke, fill) {
        svg.appendChild(el('polygon', { points: pts.map(function (p) { return p[0] + ',' + p[1]; }).join(' '), stroke: stroke || '#30363D', 'stroke-width': 1.5, fill: fill || 'none' }));
    }
    function bary(pts, w) {
        var s = w.reduce(function (a, b) { return a + b; }, 0);
        var x = 0, y = 0;
        for (var i = 0; i < pts.length; i++) { x += w[i] * pts[i][0]; y += w[i] * pts[i][1]; }
        return [x / s, y / s];
    }

    /* ============================================================
       1) parallelogramGraph — ABCD parallélogramme, O = intersection
          des diagonales = isobarycentre de A,B,C,D
       ============================================================ */
    function drawParallelogramGraph() {
        var W = 460, H = 300;
        var svg = initSVG('parallelogramGraph', W, H);
        if (!svg) return;
        var A = [80, 250], B = [320, 250], C = [380, 80], D = [140, 80];
        var O = [(A[0] + C[0]) / 2, (A[1] + C[1]) / 2];
        var G1 = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2];
        var G2 = [(C[0] + D[0]) / 2, (C[1] + D[1]) / 2];

        poly(svg, [A, B, C, D], '#4ECDC4');
        seg(svg, A[0], A[1], C[0], C[1], '#8B949E', 1.2, '4,3');
        seg(svg, B[0], B[1], D[0], D[1], '#8B949E', 1.2, '4,3');

        point(svg, G1[0], G1[1], '#BB8FCE', 4.5);
        point(svg, G2[0], G2[1], '#BB8FCE', 4.5);
        point(svg, A[0], A[1], '#E6EDF3', 5.5);
        point(svg, B[0], B[1], '#E6EDF3', 5.5);
        point(svg, C[0], C[1], '#E6EDF3', 5.5);
        point(svg, D[0], D[1], '#E6EDF3', 5.5);
        point(svg, O[0], O[1], '#F4D03F', 6.5);

        svg.appendChild(txt(A[0] - 14, A[1] + 18, 'A', { size: 15, color: '#E6EDF3', weight: '700' }));
        svg.appendChild(txt(B[0] + 14, B[1] + 18, 'B', { size: 15, color: '#E6EDF3', weight: '700' }));
        svg.appendChild(txt(C[0] + 14, C[1] - 10, 'C', { size: 15, color: '#E6EDF3', weight: '700' }));
        svg.appendChild(txt(D[0] - 14, D[1] - 10, 'D', { size: 15, color: '#E6EDF3', weight: '700' }));
        svg.appendChild(txt(G1[0], G1[1] + 18, 'G₁', { size: 10.5, color: '#BB8FCE', weight: '700' }));
        svg.appendChild(txt(G2[0], G2[1] - 10, 'G₂', { size: 10.5, color: '#BB8FCE', weight: '700' }));
        svg.appendChild(txt(O[0] + 16, O[1] - 8, 'O', { size: 14, color: '#F4D03F', weight: '700' }));
        svg.appendChild(txt(W / 2, 24, 'O = isobarycentre de A, B, C, D', { size: 12, color: '#8B949E' }));
    }

    /* ============================================================
       2) bary4Graph — G isobarycentre de {(A,1),(B,1),(C,1),(D,1)}
          quadrilatère quelconque (≠ parallélogramme)
       ============================================================ */
    function drawBary4Graph() {
        var W = 440, H = 300;
        var svg = initSVG('bary4Graph', W, H);
        if (!svg) return;
        var A = [70, 260], B = [340, 220], C = [300, 60], D = [120, 90];
        var G = bary([A, B, C, D], [1, 1, 1, 1]);

        poly(svg, [A, B, C, D], '#30363D');
        seg(svg, A[0], A[1], C[0], C[1], '#8B949E', 1, '3,3');
        seg(svg, B[0], B[1], D[0], D[1], '#8B949E', 1, '3,3');

        point(svg, A[0], A[1], '#E6EDF3', 5.5);
        point(svg, B[0], B[1], '#E6EDF3', 5.5);
        point(svg, C[0], C[1], '#E6EDF3', 5.5);
        point(svg, D[0], D[1], '#E6EDF3', 5.5);
        point(svg, G[0], G[1], '#4ECDC4', 6.5);

        svg.appendChild(txt(A[0] - 18, A[1] + 8, 'A(1)', { size: 11.5, color: '#E6EDF3', weight: '700' }));
        svg.appendChild(txt(B[0] + 20, B[1] + 4, 'B(1)', { size: 11.5, color: '#E6EDF3', weight: '700' }));
        svg.appendChild(txt(C[0] + 8, C[1] - 12, 'C(1)', { size: 11.5, color: '#E6EDF3', weight: '700' }));
        svg.appendChild(txt(D[0] - 18, D[1] - 8, 'D(1)', { size: 11.5, color: '#E6EDF3', weight: '700' }));
        svg.appendChild(txt(G[0] + 18, G[1] - 6, 'G', { size: 14, color: '#4ECDC4', weight: '700' }));
        svg.appendChild(txt(W / 2, 22, 'G isobarycentre de {(A,1),(B,1),(C,1),(D,1)}', { size: 11.5, color: '#8B949E' }));
    }

    /* ============================================================
       3) assoc4Graph — Associativité
          G1 = bary{(A,2),(B,3)} (sur [AB]) ; G2 = bary{(C,1),(D,4)} (sur [CD])
          G  = bary{(G1,5),(G2,5)} = milieu[G1G2]
       ============================================================ */
    function drawAssoc4Graph() {
        var W = 440, H = 300;
        var svg = initSVG('assoc4Graph', W, H);
        if (!svg) return;
        var A = [60, 250], B = [300, 250], C = [340, 80], D = [100, 80];
        var G1 = bary([A, B], [2, 3]);
        var G2 = bary([C, D], [1, 4]);
        var G = bary([G1, G2], [5, 5]);

        seg(svg, A[0], A[1], B[0], B[1], '#30363D', 1.3);
        seg(svg, C[0], C[1], D[0], D[1], '#30363D', 1.3);
        seg(svg, A[0], A[1], D[0], D[1], '#1C2128', 1);
        seg(svg, B[0], B[1], C[0], C[1], '#1C2128', 1);
        seg(svg, G1[0], G1[1], G2[0], G2[1], '#F4D03F', 1.6, '5,4');

        point(svg, A[0], A[1], '#E6EDF3', 5);
        point(svg, B[0], B[1], '#E6EDF3', 5);
        point(svg, C[0], C[1], '#E6EDF3', 5);
        point(svg, D[0], D[1], '#E6EDF3', 5);
        point(svg, G1[0], G1[1], '#BB8FCE', 6);
        point(svg, G2[0], G2[1], '#4ECDC4', 6);
        point(svg, G[0], G[1], '#FF6B6B', 6.5);

        svg.appendChild(txt(A[0] - 14, A[1] + 18, 'A(2)', { size: 11, color: '#E6EDF3', weight: '700' }));
        svg.appendChild(txt(B[0] + 16, B[1] + 18, 'B(3)', { size: 11, color: '#E6EDF3', weight: '700' }));
        svg.appendChild(txt(C[0] + 16, C[1] - 10, 'C(1)', { size: 11, color: '#E6EDF3', weight: '700' }));
        svg.appendChild(txt(D[0] - 14, D[1] - 10, 'D(4)', { size: 11, color: '#E6EDF3', weight: '700' }));
        svg.appendChild(txt(G1[0], G1[1] + 18, 'G₁(5)', { size: 10.5, color: '#BB8FCE', weight: '700' }));
        svg.appendChild(txt(G2[0], G2[1] - 10, 'G₂(5)', { size: 10.5, color: '#4ECDC4', weight: '700' }));
        svg.appendChild(txt(G[0] + 20, G[1], 'G', { size: 14, color: '#FF6B6B', weight: '700' }));
        svg.appendChild(txt(W / 2, 22, 'G₁ sur [AB], G₂ sur [CD]  →  G = milieu [G₁G₂]', { size: 11, color: '#8B949E' }));
    }

    /* ============================================================
       4) coord4Graph — A(0,0) B(3,0) C(3,3) D(0,3) ; poids (1,2,3,4)
          G(1.5 ; 2.1)
       ============================================================ */
    function drawCoord4Graph() {
        var W = 400, H = 340;
        var svg = initSVG('coord4Graph', W, H);
        if (!svg) return;
        arrowMarker(svg, 'c4-arr-x', '#8B949E');
        arrowMarker(svg, 'c4-arr-y', '#8B949E');

        var ox = 70, oy = 290, unit = 60;
        function px(x) { return ox + x * unit; }
        function py(y) { return oy - y * unit; }

        for (var i = 0; i <= 4; i++) seg(svg, px(i), py(-0.5), px(i), py(4), '#1C2128', 1);
        for (var j = 0; j <= 4; j++) seg(svg, px(-0.5), py(j), px(4), py(j), '#1C2128', 1);

        vec(svg, px(-0.5), py(0), px(4) + 12, py(0), '#8B949E', 'c4-arr-x', 1.4);
        vec(svg, px(0), py(-0.5), px(0), py(4) + 12, '#8B949E', 'c4-arr-y', 1.4);
        svg.appendChild(txt(px(4) + 14, py(0) - 8, 'x', { size: 12, color: '#8B949E' }));
        svg.appendChild(txt(px(0) + 14, py(4) + 10, 'y', { size: 12, color: '#8B949E' }));
        svg.appendChild(txt(px(0) - 10, py(0) + 16, 'O', { size: 12, color: '#8B949E' }));

        var A = [0, 0], B = [3, 0], C = [3, 3], D = [0, 3];
        var G = [1.5, 2.1];

        poly(svg, [A, B, C, D].map(function (p) { return [px(p[0]), py(p[1])]; }), '#30363D');

        point(svg, px(A[0]), py(A[1]), '#E6EDF3', 5);
        point(svg, px(B[0]), py(B[1]), '#E6EDF3', 5);
        point(svg, px(C[0]), py(C[1]), '#E6EDF3', 5);
        point(svg, px(D[0]), py(D[1]), '#E6EDF3', 5);
        point(svg, px(G[0]), py(G[1]), '#4ECDC4', 6);

        seg(svg, px(G[0]), py(G[1]), px(G[0]), py(0), '#4ECDC4', 1, '3,3');
        seg(svg, px(G[0]), py(G[1]), px(0), py(G[1]), '#4ECDC4', 1, '3,3');

        svg.appendChild(txt(px(A[0]) - 6, py(A[1]) + 16, 'A(0;0) — 1', { size: 10.5, color: '#E6EDF3', weight: '700', anchor: 'end' }));
        svg.appendChild(txt(px(B[0]) + 6, py(B[1]) + 16, 'B(3;0) — 2', { size: 10.5, color: '#E6EDF3', weight: '700', anchor: 'start' }));
        svg.appendChild(txt(px(C[0]) + 6, py(C[1]) - 8, 'C(3;3) — 3', { size: 10.5, color: '#E6EDF3', weight: '700', anchor: 'start' }));
        svg.appendChild(txt(px(D[0]) - 6, py(D[1]) - 8, 'D(0;3) — 4', { size: 10.5, color: '#E6EDF3', weight: '700', anchor: 'end' }));
        svg.appendChild(txt(px(G[0]) + 8, py(G[1]) - 10, 'G(1,5 ; 2,1)', { size: 11.5, color: '#4ECDC4', weight: '700', anchor: 'start' }));
    }

    document.addEventListener('DOMContentLoaded', function () {
        drawParallelogramGraph();
        drawBary4Graph();
        drawAssoc4Graph();
        drawCoord4Graph();
    });
})();

