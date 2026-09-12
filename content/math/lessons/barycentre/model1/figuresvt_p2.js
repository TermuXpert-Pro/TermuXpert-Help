/* ============================================================
   figuresvt_p2.js — Partie 2 : Barycentre de trois points pondérés
   ملف مستقل بالكامل (self-contained) — لا يعتمد على أي مكتبة مشتركة.
   يرسم: bary3Graph, caract3Graph, assocGraph, gravityGraph, coordGraph
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

    /* Triangle de référence commun à plusieurs figures de cette partie
       A(60,260) B(340,260) C(200,60) — poids (1,2,3) */
    var A = [60, 260], B = [340, 260], C = [200, 60];
    function bary(pts, w) {
        var s = w.reduce(function (a, b) { return a + b; }, 0);
        var x = 0, y = 0;
        for (var i = 0; i < pts.length; i++) { x += w[i] * pts[i][0]; y += w[i] * pts[i][1]; }
        return [x / s, y / s];
    }

    /* ============================================================
       1) bary3Graph — G barycentre de {(A,1),(B,2),(C,3)}
       ============================================================ */
    function drawBary3Graph() {
        var W = 420, H = 300;
        var svg = initSVG('bary3Graph', W, H);
        if (!svg) return;
        var G = bary([A, B, C], [1, 2, 3]);

        poly(svg, [A, B, C], '#30363D');
        seg(svg, A[0], A[1], G[0], G[1], '#8B949E', 1, '3,3');
        seg(svg, B[0], B[1], G[0], G[1], '#8B949E', 1, '3,3');
        seg(svg, C[0], C[1], G[0], G[1], '#8B949E', 1, '3,3');

        point(svg, A[0], A[1], '#E6EDF3', 5.5);
        point(svg, B[0], B[1], '#E6EDF3', 5.5);
        point(svg, C[0], C[1], '#E6EDF3', 5.5);
        point(svg, G[0], G[1], '#4ECDC4', 6.5);

        svg.appendChild(txt(A[0] - 18, A[1] + 6, 'A', { size: 15, color: '#E6EDF3', weight: '700' }));
        svg.appendChild(txt(A[0] - 18, A[1] + 22, '(1)', { size: 10.5, color: '#8B949E' }));
        svg.appendChild(txt(B[0] + 18, B[1] + 6, 'B', { size: 15, color: '#E6EDF3', weight: '700' }));
        svg.appendChild(txt(B[0] + 18, B[1] + 22, '(2)', { size: 10.5, color: '#8B949E' }));
        svg.appendChild(txt(C[0], C[1] - 14, 'C', { size: 15, color: '#E6EDF3', weight: '700' }));
        svg.appendChild(txt(C[0] + 26, C[1] - 14, '(3)', { size: 10.5, color: '#8B949E' }));
        svg.appendChild(txt(G[0] + 18, G[1] - 8, 'G', { size: 14, color: '#4ECDC4', weight: '700' }));
        svg.appendChild(txt(W / 2, 24, 'G barycentre de {(A,1), (B,2), (C,3)}', { size: 12.5, color: '#8B949E' }));
    }

    /* ============================================================
       2) caract3Graph — a MA + b MB + c MC = (a+b+c) MG
       ============================================================ */
    function drawCaract3Graph() {
        var W = 460, H = 300;
        var svg = initSVG('caract3Graph', W, H);
        if (!svg) return;
        arrowMarker(svg, 'c3-arr-purple', '#BB8FCE');
        arrowMarker(svg, 'c3-arr-teal', '#4ECDC4');
        arrowMarker(svg, 'c3-arr-blue', '#66FCF1');
        arrowMarker(svg, 'c3-arr-gold', '#F4D03F');
        var G = bary([A, B, C], [1, 2, 3]);
        var M = [400, 130];

        poly(svg, [A, B, C], '#30363D');

        vec(svg, M[0], M[1], A[0], A[1], '#BB8FCE', 'c3-arr-purple');
        vec(svg, M[0], M[1], B[0], B[1], '#4ECDC4', 'c3-arr-teal');
        vec(svg, M[0], M[1], C[0], C[1], '#66FCF1', 'c3-arr-blue');
        vec(svg, M[0], M[1], G[0], G[1], '#F4D03F', 'c3-arr-gold', 2.4);

        point(svg, A[0], A[1], '#E6EDF3', 5.5);
        point(svg, B[0], B[1], '#E6EDF3', 5.5);
        point(svg, C[0], C[1], '#E6EDF3', 5.5);
        point(svg, G[0], G[1], '#F4D03F', 6);
        point(svg, M[0], M[1], '#FF6B6B', 5.5);

        svg.appendChild(txt(A[0] - 16, A[1] + 6, 'A', { size: 14, color: '#E6EDF3', weight: '700' }));
        svg.appendChild(txt(B[0] + 16, B[1] + 6, 'B', { size: 14, color: '#E6EDF3', weight: '700' }));
        svg.appendChild(txt(C[0], C[1] - 12, 'C', { size: 14, color: '#E6EDF3', weight: '700' }));
        svg.appendChild(txt(G[0] - 16, G[1] + 14, 'G', { size: 13, color: '#F4D03F', weight: '700' }));
        svg.appendChild(txt(M[0] + 14, M[1] - 8, 'M', { size: 15, color: '#FF6B6B', weight: '700' }));
        svg.appendChild(txt(W / 2, 22, 'MA + 2MB + 3MC = 6MG  (quel que soit M)', { size: 12, color: '#8B949E' }));
    }

    /* ============================================================
       3) assocGraph — Associativité
          G2 = bary{(A,1),(B,2)} (sur [AB]) ; G = bary{(G2,3),(C,3)} = milieu[G2C]
       ============================================================ */
    function drawAssocGraph() {
        var W = 420, H = 300;
        var svg = initSVG('assocGraph', W, H);
        if (!svg) return;
        var G2 = bary([A, B], [1, 2]);
        var G = bary([G2, C], [3, 3]);

        poly(svg, [A, B, C], '#30363D');
        seg(svg, G2[0], G2[1], C[0], C[1], '#F4D03F', 1.6, '5,4');

        point(svg, A[0], A[1], '#E6EDF3', 5.5);
        point(svg, B[0], B[1], '#E6EDF3', 5.5);
        point(svg, C[0], C[1], '#E6EDF3', 5.5);
        point(svg, G2[0], G2[1], '#BB8FCE', 6);
        point(svg, G[0], G[1], '#4ECDC4', 6.5);

        svg.appendChild(txt(A[0] - 16, A[1] + 6, 'A(1)', { size: 12, color: '#E6EDF3', weight: '700' }));
        svg.appendChild(txt(B[0] + 20, B[1] + 6, 'B(2)', { size: 12, color: '#E6EDF3', weight: '700' }));
        svg.appendChild(txt(C[0], C[1] - 14, 'C(3)', { size: 12, color: '#E6EDF3', weight: '700' }));
        svg.appendChild(txt(G2[0], G2[1] + 24, 'G₂ (poids 3)', { size: 11, color: '#BB8FCE', weight: '700' }));
        svg.appendChild(txt(G[0] + 24, G[1], 'G', { size: 14, color: '#4ECDC4', weight: '700' }));
        svg.appendChild(txt(W / 2, 24, 'G₂ barycentre de (A,1),(B,2)  →  G = milieu [G₂C]', { size: 11.5, color: '#8B949E' }));
    }

    /* ============================================================
       4) gravityGraph — Centre de gravité du triangle ABC
          Médianes AA', BB', CC' — A' milieu[BC], etc.
       ============================================================ */
    function drawGravityGraph() {
        var W = 440, H = 300;
        var svg = initSVG('gravityGraph', W, H);
        if (!svg) return;
        var T_A = [220, 50], T_B = [60, 270], T_C = [380, 270];
        var Ap = [(T_B[0] + T_C[0]) / 2, (T_B[1] + T_C[1]) / 2];
        var Bp = [(T_A[0] + T_C[0]) / 2, (T_A[1] + T_C[1]) / 2];
        var Cp = [(T_A[0] + T_B[0]) / 2, (T_A[1] + T_B[1]) / 2];
        var G = bary([T_A, T_B, T_C], [1, 1, 1]);

        poly(svg, [T_A, T_B, T_C], '#30363D');
        seg(svg, T_A[0], T_A[1], Ap[0], Ap[1], '#4ECDC4', 1.3, '4,3');
        seg(svg, T_B[0], T_B[1], Bp[0], Bp[1], '#BB8FCE', 1.3, '4,3');
        seg(svg, T_C[0], T_C[1], Cp[0], Cp[1], '#F4D03F', 1.3, '4,3');

        point(svg, T_A[0], T_A[1], '#E6EDF3', 5.5);
        point(svg, T_B[0], T_B[1], '#E6EDF3', 5.5);
        point(svg, T_C[0], T_C[1], '#E6EDF3', 5.5);
        point(svg, Ap[0], Ap[1], '#4ECDC4', 4.5);
        point(svg, Bp[0], Bp[1], '#BB8FCE', 4.5);
        point(svg, Cp[0], Cp[1], '#F4D03F', 4.5);
        point(svg, G[0], G[1], '#FF6B6B', 6.5);

        svg.appendChild(txt(T_A[0], T_A[1] - 12, 'A', { size: 15, color: '#E6EDF3', weight: '700' }));
        svg.appendChild(txt(T_B[0] - 16, T_B[1] + 6, 'B', { size: 15, color: '#E6EDF3', weight: '700' }));
        svg.appendChild(txt(T_C[0] + 16, T_C[1] + 6, 'C', { size: 15, color: '#E6EDF3', weight: '700' }));
        svg.appendChild(txt(Ap[0], Ap[1] + 18, "A'", { size: 12, color: '#4ECDC4', weight: '700' }));
        svg.appendChild(txt(Bp[0] + 20, Bp[1] - 4, "B'", { size: 12, color: '#BB8FCE', weight: '700' }));
        svg.appendChild(txt(Cp[0] - 20, Cp[1] - 4, "C'", { size: 12, color: '#F4D03F', weight: '700' }));
        svg.appendChild(txt(G[0] + 16, G[1] - 8, 'G', { size: 14, color: '#FF6B6B', weight: '700' }));
        svg.appendChild(txt(W / 2, 22, "AG = (2/3) AA'  —  G est le centre de gravité", { size: 11.5, color: '#8B949E' }));
    }

    /* ============================================================
       5) coordGraph — A(1,1) B(4,1) C(-1,3) ; poids (3,1,1) ; G(6/5,7/5)
       ============================================================ */
    function drawCoordGraph() {
        var W = 400, H = 320;
        var svg = initSVG('coordGraph', W, H);
        if (!svg) return;
        arrowMarker(svg, 'cg-arr-x', '#8B949E');
        arrowMarker(svg, 'cg-arr-y', '#8B949E');

        var ox = 90, oy = 270, unit = 42;
        function px(x) { return ox + x * unit; }
        function py(y) { return oy - y * unit; }

        /* quadrillage */
        for (var i = -2; i <= 5; i++) {
            seg(svg, px(i), py(-1), px(i), py(4), '#1C2128', 1);
        }
        for (var j = -1; j <= 4; j++) {
            seg(svg, px(-2), py(j), px(5), py(j), '#1C2128', 1);
        }
        /* axes */
        vec(svg, px(-2), py(0), px(5) + 14, py(0), '#8B949E', 'cg-arr-x', 1.4);
        vec(svg, px(0), py(-1), px(0), py(4) + 14, '#8B949E', 'cg-arr-y', 1.4);
        svg.appendChild(txt(px(5) + 14, py(0) - 8, 'x', { size: 12, color: '#8B949E' }));
        svg.appendChild(txt(px(0) + 14, py(4) + 10, 'y', { size: 12, color: '#8B949E' }));
        svg.appendChild(txt(px(0) - 10, py(0) + 16, 'O', { size: 12, color: '#8B949E' }));

        var pA = [1, 1], pB = [4, 1], pC = [-1, 3];
        var G = [6 / 5, 7 / 5];

        seg(svg, px(pA[0]), py(pA[1]), px(pB[0]), py(pB[1]), '#30363D', 1.3);
        seg(svg, px(pA[0]), py(pA[1]), px(pC[0]), py(pC[1]), '#30363D', 1.3);

        point(svg, px(pA[0]), py(pA[1]), '#E6EDF3', 5);
        point(svg, px(pB[0]), py(pB[1]), '#E6EDF3', 5);
        point(svg, px(pC[0]), py(pC[1]), '#E6EDF3', 5);
        point(svg, px(G[0]), py(G[1]), '#4ECDC4', 6);

        svg.appendChild(txt(px(pA[0]) + 4, py(pA[1]) - 10, 'A(1;1)', { size: 11, color: '#E6EDF3', weight: '700', anchor: 'start' }));
        svg.appendChild(txt(px(pB[0]) + 4, py(pB[1]) - 10, 'B(4;1)', { size: 11, color: '#E6EDF3', weight: '700', anchor: 'start' }));
        svg.appendChild(txt(px(pC[0]) + 4, py(pC[1]) - 10, 'C(-1;3)', { size: 11, color: '#E6EDF3', weight: '700', anchor: 'start' }));
        svg.appendChild(txt(px(G[0]) + 6, py(G[1]) + 16, 'G(6/5 ; 7/5)', { size: 11.5, color: '#4ECDC4', weight: '700', anchor: 'start' }));
    }

    document.addEventListener('DOMContentLoaded', function () {
        drawBary3Graph();
        drawCaract3Graph();
        drawAssocGraph();
        drawGravityGraph();
        drawCoordGraph();
    });
})();
