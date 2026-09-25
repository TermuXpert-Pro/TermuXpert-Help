/* ============================================================
   figuresvg_ex6.js — Exercice 7 (fichier exercice6.html) :
   réduction d'écriture, point K = Bar{(C,-3);(B,1)},
   G = Bar{(A,2);(B,-1);(C,-3)}, ensemble (C) = Cercle(G, KA).
   Fichier autonome (self-contained) : aucune dépendance externe.
   Triangle ABC choisi librement (aucune coordonnée dans l'énoncé) ;
   K et G calculés exactement avec les poids donnés dans le texte.
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
    function circleWorld(t, cx, cy, r, opts) {
        opts = opts || {};
        var a = { cx: t.px(cx), cy: t.py(cy), r: r * t.scale, fill: opts.fill || 'none', stroke: opts.color || '#4D9DE0', 'stroke-width': opts.w || 2 };
        if (opts.dash) a['stroke-dasharray'] = opts.dash;
        t.svg.appendChild(el('circle', a));
    }
    function title(t, str) {
        t.svg.appendChild(txt(t.W / 2, 18, str, { size: 11.5, color: '#8B949E', weight: '600' }));
    }

    function drawGraph6() {
        var A = { x: 2.5, y: 5 }, B = { x: 0, y: 0 }, C = { x: 6, y: 1 };
        // K = Bar{(C,-3);(B,1)} = (B - 3C) / (1 - 3)
        var K = { x: (B.x - 3 * C.x) / (-2), y: (B.y - 3 * C.y) / (-2) };
        // G = Bar{(A,2);(B,-1);(C,-3)} = (2A - B - 3C) / (2 - 1 - 3)
        var G = { x: (2 * A.x - B.x - 3 * C.x) / (-2), y: (2 * A.y - B.y - 3 * C.y) / (-2) };
        var r = Math.sqrt(Math.pow(K.x - A.x, 2) + Math.pow(K.y - A.y, 2)); // r = KA

        var box = fitBox([A, B, C, K, { x: G.x - r, y: G.y - r }, { x: G.x + r, y: G.y + r }], 0.8);
        var t = makeCanvas('graph6svg', 460, 480, box);
        if (!t) return;

        triangle(t, A, B, C, '#2A2A3E', 1.6, '3,3');
        // (BC) prolongée jusqu'à K
        seg(t, B.x, B.y, K.x, K.y, '#A8FF78', 1.6, '5,4');
        circleWorld(t, G.x, G.y, r, { color: '#4D9DE0', w: 2.4, dash: '7,5' });

        point(t, A.x, A.y, '#4ECDC4');
        label(t, A.x, A.y, 'A', 0, -12, '#4ECDC4');
        point(t, B.x, B.y, '#FF6B6B');
        label(t, B.x, B.y, 'B', -14, 16, '#FF6B6B');
        point(t, C.x, C.y, '#BB8FCE');
        label(t, C.x, C.y, 'C', 14, 4, '#BB8FCE');
        point(t, K.x, K.y, '#A8FF78');
        label(t, K.x, K.y, 'K', 16, 4, '#A8FF78');
        point(t, G.x, G.y, '#F4D03F', 6);
        label(t, G.x, G.y, 'G', -16, 4, '#F4D03F');

        title(t, 'K=Bar{(C,-3);(B,1)}   |   G=Bar{(A,2);(B,-1);(C,-3)}   |   (C)=Cercle(G, KA)');
    }

    document.addEventListener('DOMContentLoaded', function () {
        drawGraph6();
    });
})();

