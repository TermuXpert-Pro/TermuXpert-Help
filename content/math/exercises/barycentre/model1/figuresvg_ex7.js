/* ============================================================
   figuresvg_ex7.js — Exercice 8 (fichier exercice7.html) : Cercles - Médiatrice
   Fichier autonome (self-contained) : aucune dépendance externe.
   Triangle ABC construit avec les longueurs réelles de l'énoncé
   (AC=6, AB=5, BC=4, en cm) pour que le rayon r=1.5 cm de la partie b)
   soit à la bonne échelle par rapport au triangle.
   Trois figures : graph7csvg (a: construction de G — AJOUTÉE, absente
   du HTML original), graph7asvg (b: cercle (E)), graph7bsvg (c: médiatrice).
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
    function rightAngleMark(t, wx, wy, size) {
        var s = (size || 0.18);
        t.svg.appendChild(el('rect', { x: t.px(wx), y: t.py(wy) - s * t.scale, width: s * t.scale, height: s * t.scale, fill: 'none', stroke: '#BB8FCE', 'stroke-width': 1 }));
    }
    function title(t, str) {
        t.svg.appendChild(txt(t.W / 2, 18, str, { size: 11.5, color: '#8B949E', weight: '600' }));
    }

    // Triangle ABC construit avec AB=5, AC=6, BC=4 (en "cm")
    var A = { x: 0, y: 0 };
    var B = { x: 5, y: 0 };
    var C = { x: 4.5, y: Math.sqrt(36 - 4.5 * 4.5) }; // ≈ (4.5 ; 3.969)

    /* ====== a) Construction de G = Bar{(A,1);(B,2);(C,1)} — figure ajoutée ====== */
    function drawGraph7c() {
        var I = { x: B.x + (1 / 3) * (C.x - B.x), y: B.y + (1 / 3) * (C.y - B.y) }; // BI = 1/3 BC
        var G = { x: A.x + 0.75 * (I.x - A.x), y: A.y + 0.75 * (I.y - A.y) };        // AG = 3/4 AI

        var box = fitBox([A, B, C, I, G], 0.8);
        var t = makeCanvas('graph7csvg', 400, 340, box);
        if (!t) return;

        triangle(t, A, B, C, '#2A2A3E', 1.6, '3,3');
        seg(t, B.x, B.y, C.x, C.y, '#8B949E', 1, null);
        seg(t, A.x, A.y, I.x, I.y, '#A8FF78', 1.8, '5,4');

        point(t, A.x, A.y, '#4ECDC4');
        label(t, A.x, A.y, 'A', -12, 6, '#4ECDC4');
        point(t, B.x, B.y, '#FF6B6B');
        label(t, B.x, B.y, 'B', -12, 16, '#FF6B6B');
        point(t, C.x, C.y, '#BB8FCE');
        label(t, C.x, C.y, 'C', 0, -12, '#BB8FCE');
        point(t, I.x, I.y, '#A8FF78');
        label(t, I.x, I.y, 'I', 14, 4, '#A8FF78');
        point(t, G.x, G.y, '#F4D03F', 6);
        label(t, G.x, G.y, 'G', 14, -6, '#F4D03F');

        title(t, 'I=Bar{(B,2);(C,1)}: BI=1/3 BC   |   G=Bar{(A,1);(I,3)}: AG=3/4 AI');
    }

    /* ====== b) Ensemble (E) = Cercle(G, 1.5 cm) ====== */
    function drawGraph7a() {
        var I = { x: B.x + (1 / 3) * (C.x - B.x), y: B.y + (1 / 3) * (C.y - B.y) };
        var G = { x: A.x + 0.75 * (I.x - A.x), y: A.y + 0.75 * (I.y - A.y) };
        var r = 1.5;

        var box = fitBox([A, B, C, { x: G.x - r, y: G.y - r }, { x: G.x + r, y: G.y + r }], 0.6);
        var t = makeCanvas('graph7asvg', 400, 340, box);
        if (!t) return;

        triangle(t, A, B, C, '#2A2A3E', 1.4, '3,3');
        circleWorld(t, G.x, G.y, r, { color: '#4D9DE0', w: 2.4, dash: '6,4' });

        point(t, A.x, A.y, '#4ECDC4');
        label(t, A.x, A.y, 'A', -12, 6, '#4ECDC4');
        point(t, B.x, B.y, '#FF6B6B');
        label(t, B.x, B.y, 'B', -12, 16, '#FF6B6B');
        point(t, C.x, C.y, '#BB8FCE');
        label(t, C.x, C.y, 'C', 0, -12, '#BB8FCE');
        point(t, G.x, G.y, '#F4D03F', 6);
        label(t, G.x, G.y, 'G', 0, -12 - r * t.scale, '#F4D03F');

        title(t, '(E) = Cercle de centre G et de rayon 1.5 cm');
    }

    /* ====== c) Ensemble (F) = médiatrice de [GG'] ====== */
    function drawGraph7b() {
        var I = { x: B.x + (1 / 3) * (C.x - B.x), y: B.y + (1 / 3) * (C.y - B.y) };
        var G = { x: A.x + 0.75 * (I.x - A.x), y: A.y + 0.75 * (I.y - A.y) };
        var Gp = { x: A.x + 0.25 * (C.x - A.x), y: A.y + 0.25 * (C.y - A.y) }; // AG' = 1/4 AC

        var mx = (G.x + Gp.x) / 2, my = (G.y + Gp.y) / 2;
        var dx = -(Gp.y - G.y), dy = (Gp.x - G.x);
        var len = Math.sqrt(dx * dx + dy * dy) || 1;
        var nx = dx / len, ny = dy / len, ext = 2.2;
        var P1 = { x: mx - nx * ext, y: my - ny * ext };
        var P2 = { x: mx + nx * ext, y: my + ny * ext };

        var box = fitBox([A, B, C, G, Gp, P1, P2], 0.6);
        var t = makeCanvas('graph7bsvg', 400, 380, box);
        if (!t) return;

        triangle(t, A, B, C, '#2A2A3E', 1.4, '3,3');
        seg(t, G.x, G.y, Gp.x, Gp.y, '#F4D03F', 2, null);
        seg(t, P1.x, P1.y, P2.x, P2.y, '#A8FF78', 2.2, '6,4');

        point(t, A.x, A.y, '#4ECDC4');
        label(t, A.x, A.y, 'A', -12, 6, '#4ECDC4');
        point(t, B.x, B.y, '#FF6B6B');
        label(t, B.x, B.y, 'B', -12, 16, '#FF6B6B');
        point(t, C.x, C.y, '#BB8FCE');
        label(t, C.x, C.y, 'C', 0, -12, '#BB8FCE');
        point(t, G.x, G.y, '#F4D03F', 6);
        label(t, G.x, G.y, 'G', 14, -4, '#F4D03F');
        point(t, Gp.x, Gp.y, '#F4D03F', 6);
        label(t, Gp.x, Gp.y, "G'", -16, 4, '#F4D03F');

        title(t, "(F) = médiatrice de [GG']  (G'=Bar{(A,3);(C,1)}: AG'=1/4 AC)");
    }

    document.addEventListener('DOMContentLoaded', function () {
        drawGraph7c();
        drawGraph7a();
        drawGraph7b();
    });
})();

