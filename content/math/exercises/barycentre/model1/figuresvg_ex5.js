/* ============================================================
   figuresvg_ex5.js — Exercice 5 (Associativité) + Exercice 6 (Centre de gravité)
   Fichier autonome (self-contained) : aucune dépendance externe.
   Deux figures indépendantes : graph5svg (associativité) et
   graph6cgsvg (centre de gravité) — chacune avec son propre triangle
   choisi librement (aucune coordonnée fournie dans l'énoncé).
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
    function triangle(t, A, B, C, color, w, dash) {
        seg(t, A.x, A.y, B.x, B.y, color, w, dash);
        seg(t, B.x, B.y, C.x, C.y, color, w, dash);
        seg(t, C.x, C.y, A.x, A.y, color, w, dash);
    }
    function title(t, str) {
        t.svg.appendChild(txt(t.W / 2, 18, str, { size: 12, color: '#8B949E', weight: '600' }));
    }

    /* ====== Exercice 5 : G = Bar{(A,2);(B,-3);(C,5)} par associativité ======
       E = Bar{(A,2);(B,-3)} : AE = 3 AB  (E au-delà de B sur (AB))
       G = Bar{(E,-1);(C,5)} : CG = -1/4 CE  (G au-delà de C, côté opposé à E) */
    function drawGraph5() {
        var A = { x: 0, y: 0 }, B = { x: 2, y: 0 }, C = { x: 1, y: 3.2 };
        var E = { x: A.x + 3 * (B.x - A.x), y: A.y + 3 * (B.y - A.y) };
        var G = { x: C.x - 0.25 * (E.x - C.x), y: C.y - 0.25 * (E.y - C.y) };

        var box = fitBox([A, B, C, E, G], 0.8);
        var t = makeCanvas('graph5svg', 460, 300, box);
        if (!t) return;

        seg(t, A.x, A.y, E.x, E.y, '#8B949E', 1.6, '5,4');
        seg(t, G.x, G.y, E.x, E.y, '#A8FF78', 1.6, '5,4');

        point(t, A.x, A.y, '#4ECDC4');
        label(t, A.x, A.y, 'A', 0, 18, '#4ECDC4');
        point(t, B.x, B.y, '#FF6B6B');
        label(t, B.x, B.y, 'B', 0, 18, '#FF6B6B');
        point(t, C.x, C.y, '#BB8FCE');
        label(t, C.x, C.y, 'C', -14, -6, '#BB8FCE');
        point(t, E.x, E.y, '#A8FF78');
        label(t, E.x, E.y, 'E', 16, 4, '#A8FF78');
        point(t, G.x, G.y, '#F4D03F', 6);
        label(t, G.x, G.y, 'G', -14, -6, '#F4D03F');

        title(t, 'E: AE=3AB   |   G: CG=-1/4 CE   |   G=Bar{(E,-1);(C,5)}');
    }

    /* ====== Exercice 6 : G centre de gravité, I milieu de [BC] ======
       G = Bar{(A,1);(I,2)} : AG = 2/3 AI */
    function drawGraph6cg() {
        var A = { x: 3, y: 6 }, B = { x: 0, y: 0 }, C = { x: 6, y: 0 };
        var I = { x: (B.x + C.x) / 2, y: (B.y + C.y) / 2 };
        var G = { x: A.x + (2 / 3) * (I.x - A.x), y: A.y + (2 / 3) * (I.y - A.y) };

        var box = fitBox([A, B, C, I, G], 0.8);
        var t = makeCanvas('graph6cgsvg', 460, 300, box);
        if (!t) return;

        triangle(t, A, B, C, '#2A2A3E', 1.6, '3,3');
        seg(t, A.x, A.y, I.x, I.y, '#A8FF78', 1.8, '5,4');

        point(t, A.x, A.y, '#4ECDC4');
        label(t, A.x, A.y, 'A', 0, -12, '#4ECDC4');
        point(t, B.x, B.y, '#FF6B6B');
        label(t, B.x, B.y, 'B', -14, 16, '#FF6B6B');
        point(t, C.x, C.y, '#BB8FCE');
        label(t, C.x, C.y, 'C', 14, 16, '#BB8FCE');
        point(t, I.x, I.y, '#A8FF78');
        label(t, I.x, I.y, 'I', 0, 20, '#A8FF78');
        point(t, G.x, G.y, '#F4D03F', 6);
        label(t, G.x, G.y, 'G', 14, -4, '#F4D03F');

        title(t, 'I milieu de [BC]   |   G = Bar{(A,1);(I,2)} : AG=2/3 AI');
    }

    document.addEventListener('DOMContentLoaded', function () {
        drawGraph5();
        drawGraph6cg();
    });
})();

