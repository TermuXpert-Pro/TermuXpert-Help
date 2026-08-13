/* ============================================================
   figuresvg_ex8.js — Exercices 9, 10 et 11 (fichier exercice8.html)
   Fichier autonome (self-contained) : aucune dépendance externe.
   Trois figures indépendantes :
   - graph9svg  (Exercice 9, AJOUTÉE) : repère avec A,B,C,D,K,L,G
   - graph10svg (Exercice 10, AJOUTÉE) : quadrilatère ABCD, E, H, K
   - graph11svg (Exercice 11) : alignement de I, J, K dans le repère
     local R(A; AB; AC)
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
            'font-size': opts.size || 12,
            'font-weight': opts.weight || '600',
            fill: opts.color || '#E6EDF3'
        });
        t.textContent = str;
        return t;
    }
    function fitBox(pts, pad) {
        pad = (pad == null) ? 1 : pad;
        var xs = pts.map(function (p) { return p.x; });
        var ys = pts.map(function (p) { return p.y; });
        return {
            xMin: Math.min.apply(null, xs) - pad, xMax: Math.max.apply(null, xs) + pad,
            yMin: Math.min.apply(null, ys) - pad, yMax: Math.max.apply(null, ys) + pad
        };
    }
    function makeCanvas(id, W, H, box) {
        var svg = document.getElementById(id);
        if (!svg) return null;
        while (svg.firstChild) svg.removeChild(svg.firstChild);
        svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
        svg.setAttribute('width', '100%');
        svg.removeAttribute('height');
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        svg.style.height = 'auto'; svg.style.display = 'block'; svg.style.margin = '0 auto';
        var sx = W / (box.xMax - box.xMin), sy = H / (box.yMax - box.yMin);
        var scale = Math.min(sx, sy);
        var offX = (W - (box.xMax - box.xMin) * scale) / 2;
        var offY = (H - (box.yMax - box.yMin) * scale) / 2;
        function px(x) { return offX + (x - box.xMin) * scale; }
        function py(y) { return H - offY - (y - box.yMin) * scale; }
        return { svg: svg, px: px, py: py, scale: scale, W: W, H: H };
    }
    function arrowMarker(svg, id, color) {
        var defs = svg.querySelector('defs');
        if (!defs) { defs = el('defs', {}); svg.appendChild(defs); }
        var m = el('marker', { id: id, markerWidth: 8, markerHeight: 8, refX: 6, refY: 3, orient: 'auto', markerUnits: 'strokeWidth' });
        m.appendChild(el('path', { d: 'M0,0 L7,3 L0,6 Z', fill: color }));
        defs.appendChild(m);
    }
    function point(t, wx, wy, color, r) {
        t.svg.appendChild(el('circle', { cx: t.px(wx), cy: t.py(wy), r: r || 5, fill: color, stroke: '#0D1117', 'stroke-width': 1.5 }));
    }
    function label(t, wx, wy, str, dx, dy, color, size) {
        t.svg.appendChild(txt(t.px(wx) + (dx || 0), t.py(wy) + (dy || 0), str, { size: size || 14, color: color || '#E6EDF3', weight: '700' }));
    }
    function seg(t, x1, y1, x2, y2, color, w, dash) {
        var a = { x1: t.px(x1), y1: t.py(y1), x2: t.px(x2), y2: t.py(y2), stroke: color, 'stroke-width': w || 1.5 };
        if (dash) a['stroke-dasharray'] = dash;
        t.svg.appendChild(el('line', a));
    }
    function title(t, str) {
        t.svg.appendChild(txt(t.W / 2, 18, str, { size: 11.5, color: '#8B949E', weight: '600' }));
    }
    function gridAxes(t, box) {
        var xi, yi;
        for (xi = Math.ceil(box.xMin); xi <= Math.floor(box.xMax); xi++) {
            if (xi === 0) continue;
            t.svg.appendChild(el('line', { x1: t.px(xi), y1: t.py(box.yMin), x2: t.px(xi), y2: t.py(box.yMax), stroke: '#21262D', 'stroke-width': 1 }));
        }
        for (yi = Math.ceil(box.yMin); yi <= Math.floor(box.yMax); yi++) {
            if (yi === 0) continue;
            t.svg.appendChild(el('line', { x1: t.px(box.xMin), y1: t.py(yi), x2: t.px(box.xMax), y2: t.py(yi), stroke: '#21262D', 'stroke-width': 1 }));
        }
        arrowMarker(t.svg, 'ex8axX', '#8B949E');
        arrowMarker(t.svg, 'ex8axY', '#8B949E');
        if (box.xMin <= 0 && box.xMax >= 0) {
            t.svg.appendChild(el('line', { x1: t.px(0), y1: t.py(box.yMin), x2: t.px(0), y2: t.py(box.yMax) - 10, stroke: '#8B949E', 'stroke-width': 1.4, 'marker-end': 'url(#ex8axY)' }));
            t.svg.appendChild(txt(t.px(0) + 12, t.py(box.yMax) - 4, 'y', { size: 12, color: '#8B949E', anchor: 'start' }));
        }
        if (box.yMin <= 0 && box.yMax >= 0) {
            t.svg.appendChild(el('line', { x1: t.px(box.xMin), y1: t.py(0), x2: t.px(box.xMax) - 10, y2: t.py(0), stroke: '#8B949E', 'stroke-width': 1.4, 'marker-end': 'url(#ex8axX)' }));
            t.svg.appendChild(txt(t.px(box.xMax) - 6, t.py(0) - 8, 'x', { size: 12, color: '#8B949E', anchor: 'end' }));
        }
        t.svg.appendChild(txt(t.px(0) - 8, t.py(0) + 14, 'O', { size: 11, color: '#8B949E', anchor: 'end' }));
    }

    /* ====== Exercice 9 : A(-1;1), B(0;2), C(1;-1), D(1;0), K, L, G ====== */
    function drawGraph9() {
        var A = { x: -1, y: 1 }, B = { x: 0, y: 2 }, C = { x: 1, y: -1 }, D = { x: 1, y: 0 };
        var K = { x: -2 / 5, y: 8 / 5 };
        var L = { x: 0, y: 2 / 3 };
        var G = { x: -2 / 5, y: 7 / 5 };

        var box = { xMin: -2, xMax: 2, yMin: -2, yMax: 3 };
        var t = makeCanvas('graph9svg', 460, 350, box);
        if (!t) return;

        gridAxes(t, box);

        point(t, A.x, A.y, '#4ECDC4');
        label(t, A.x, A.y, 'A(-1;1)', -20, -10, '#4ECDC4', 11.5);
        point(t, B.x, B.y, '#FF6B6B');
        label(t, B.x, B.y, 'B(0;2)', 0, -12, '#FF6B6B', 11.5);
        point(t, C.x, C.y, '#BB8FCE');
        label(t, C.x, C.y, 'C(1;-1)', 20, 4, '#BB8FCE', 11.5);
        point(t, D.x, D.y, '#4D9DE0');
        label(t, D.x, D.y, 'D(1;0)', 20, 4, '#4D9DE0', 11.5);

        point(t, K.x, K.y, '#F4D03F', 5.5);
        label(t, K.x, K.y, 'K(-2/5;8/5)', -8, -12, '#F4D03F', 11);
        point(t, L.x, L.y, '#A8FF78', 5.5);
        label(t, L.x, L.y, 'L(0;2/3)', 22, 10, '#A8FF78', 11);
        point(t, G.x, G.y, '#F4D03F', 5.5);
        label(t, G.x, G.y, 'G(-2/5;7/5)', -22, 14, '#F4D03F', 11);

        title(t, 'K=Bar{(A,2);(B,3)}  L=centre gravité ABC  G=Bar{(A,2);(B,3);(C,1);(D,-1)}');
    }

    /* ====== Exercice 10 : quadrilatère ABCD, E=Bar{(C,-1);(B,5)},
       H=Bar{(A,2);(B,5);(C,-1)}=Bar{(A,1);(E,2)}, K=Bar{(B,5);(C,-1);(D,6)}=Bar{(E,2);(D,3)} ====== */
    function drawGraph10() {
        var A = { x: 0, y: 4 }, B = { x: 0, y: 0 }, C = { x: 5, y: 0.5 }, D = { x: 6, y: 4 };
        var E = { x: (5 * B.x - C.x) / 4, y: (5 * B.y - C.y) / 4 };
        var H = { x: (A.x + 2 * E.x) / 3, y: (A.y + 2 * E.y) / 3 };
        var K = { x: (2 * E.x + 3 * D.x) / 5, y: (2 * E.y + 3 * D.y) / 5 };

        var box = fitBox([A, B, C, D, E, H, K], 0.9);
        var t = makeCanvas('graph10svg', 480, 340, box);
        if (!t) return;

        // quadrilatère ABCD
        seg(t, A.x, A.y, B.x, B.y, '#2A2A3E', 1.6, '3,3');
        seg(t, B.x, B.y, C.x, C.y, '#2A2A3E', 1.6, '3,3');
        seg(t, C.x, C.y, D.x, D.y, '#2A2A3E', 1.6, '3,3');
        seg(t, D.x, D.y, A.x, A.y, '#2A2A3E', 1.6, '3,3');

        // (BC) prolongée jusqu'à E
        seg(t, C.x, C.y, E.x, E.y, '#A8FF78', 1.6, '5,4');
        // (AE) avec H dessus
        seg(t, A.x, A.y, E.x, E.y, '#4D9DE0', 1.4, '4,3');
        // (ED) avec K dessus
        seg(t, E.x, E.y, D.x, D.y, '#4D9DE0', 1.4, '4,3');

        point(t, A.x, A.y, '#4ECDC4');
        label(t, A.x, A.y, 'A', 0, -12, '#4ECDC4');
        point(t, B.x, B.y, '#FF6B6B');
        label(t, B.x, B.y, 'B', -14, 16, '#FF6B6B');
        point(t, C.x, C.y, '#BB8FCE');
        label(t, C.x, C.y, 'C', 0, 20, '#BB8FCE');
        point(t, D.x, D.y, '#4D9DE0');
        label(t, D.x, D.y, 'D', 14, -8, '#4D9DE0');

        point(t, E.x, E.y, '#A8FF78', 5.5);
        label(t, E.x, E.y, 'E', -16, 6, '#A8FF78');
        point(t, H.x, H.y, '#F4D03F', 5.5);
        label(t, H.x, H.y, 'H', -16, -6, '#F4D03F');
        point(t, K.x, K.y, '#F4D03F', 5.5);
        label(t, K.x, K.y, 'K', 16, 6, '#F4D03F');

        title(t, 'E=Bar{(C,-1);(B,5)}   H=Bar{(A,1);(E,2)}   K=Bar{(E,2);(D,3)}');
    }

    /* ====== Exercice 11 : repère local R(A; AB; AC) — A(0;0), B(1;0), C(0;1)
       I(-1/2;3/2), K(2/5;0), J(0;2/3) — alignement ====== */
    function drawGraph11() {
        var A = { x: 0, y: 0 }, B = { x: 1, y: 0 }, C = { x: 0, y: 1 };
        var I = { x: -0.5, y: 1.5 }, K = { x: 0.4, y: 0 }, J = { x: 0, y: 2 / 3 };

        var box = fitBox([A, B, C, I, K, J], 0.4);
        var t = makeCanvas('graph11svg', 420, 420, box);
        if (!t) return;

        seg(t, A.x, A.y, B.x, B.y, '#2A2A3E', 1.4, '3,3');
        seg(t, A.x, A.y, C.x, C.y, '#2A2A3E', 1.4, '3,3');
        seg(t, B.x, B.y, C.x, C.y, '#2A2A3E', 1.2, '3,3');

        // droite (IK), légèrement prolongée
        var d = { x: K.x - I.x, y: K.y - I.y };
        seg(t, I.x - 0.15 * d.x, I.y - 0.15 * d.y, I.x + 1.15 * d.x, I.y + 1.15 * d.y, '#F4D03F', 2.2, null);

        point(t, A.x, A.y, '#4ECDC4');
        label(t, A.x, A.y, 'A', -14, 12, '#4ECDC4');
        point(t, B.x, B.y, '#FF6B6B');
        label(t, B.x, B.y, 'B', 14, 4, '#FF6B6B');
        point(t, C.x, C.y, '#BB8FCE');
        label(t, C.x, C.y, 'C', -14, -6, '#BB8FCE');

        point(t, I.x, I.y, '#A8FF78', 5.5);
        label(t, I.x, I.y, 'I', -14, -6, '#A8FF78');
        point(t, J.x, J.y, '#4D9DE0', 5.5);
        label(t, J.x, J.y, 'J', 14, 4, '#4D9DE0');
        point(t, K.x, K.y, '#F4D03F', 5.5);
        label(t, K.x, K.y, 'K', 14, 14, '#F4D03F');

        title(t, 'Repère R(A; AB; AC) — I, J, K sont alignés sur (IK)');
    }

    document.addEventListener('DOMContentLoaded', function () {
        drawGraph9();
        drawGraph10();
        drawGraph11();
    });
})();
