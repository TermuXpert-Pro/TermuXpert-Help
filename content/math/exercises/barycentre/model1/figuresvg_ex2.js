/* ============================================================
   figuresvg_ex2.js — Exercice 2 : (EF) ∩ (AB) = {G}
   Fichier autonome (self-contained) : aucune dépendance externe.
   L'énoncé ne donne aucune coordonnée numérique : la figure est donc
   un schéma illustrant la relation géométrique (deux droites sécantes
   en G), avec des positions choisies librement mais respectant bien
   EG = 2 EF (donc G = 2F - E).
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
    function title(t, str) {
        t.svg.appendChild(txt(t.W / 2, 18, str, { size: 12, color: '#8B949E', weight: '600' }));
    }

    function drawGraph2() {
        var A = { x: 1, y: 4 }, B = { x: 5, y: 1 };
        // G choisi sur la droite (AB) prolongée au-delà de B
        var G = { x: A.x + 1.6 * (B.x - A.x), y: A.y + 1.6 * (B.y - A.y) };
        var F = { x: 3, y: 2.5 };
        // EG = 2 EF  <=>  G = 2F - E  <=>  E = 2F - G
        var E = { x: 2 * F.x - G.x, y: 2 * F.y - G.y };

        var box = fitBox([A, B, G, E, F], 1);
        var t = makeCanvas('graph2svg', 460, 280, box);
        if (!t) return;

        // droite (AB), prolongée légèrement au-delà de G
        seg(t, A.x - 0.35 * (B.x - A.x), A.y - 0.35 * (B.y - A.y),
               A.x + 1.85 * (B.x - A.x), A.y + 1.85 * (B.y - A.y),
               '#FF6B6B', 2, '6,4');
        // droite (EF), prolongée légèrement au-delà de E et de G
        seg(t, E.x - 0.12 * (G.x - E.x), E.y - 0.12 * (G.y - E.y),
               E.x + 1.15 * (G.x - E.x), E.y + 1.15 * (G.y - E.y),
               '#A8FF78', 2, '6,4');

        point(t, A.x, A.y, '#4ECDC4');
        label(t, A.x, A.y, 'A', -14, 4, '#4ECDC4');
        point(t, B.x, B.y, '#FF6B6B');
        label(t, B.x, B.y, 'B', 14, 4, '#FF6B6B');
        point(t, E.x, E.y, '#BB8FCE');
        label(t, E.x, E.y, 'E', -14, 4, '#BB8FCE');
        point(t, F.x, F.y, '#BB8FCE');
        label(t, F.x, F.y, 'F', -14, 4, '#BB8FCE');
        point(t, G.x, G.y, '#F4D03F', 6);
        label(t, G.x, G.y, 'G', 16, -6, '#F4D03F');

        title(t, '(EF) ∩ (AB) = {G}');
        t.svg.appendChild(txt(t.px(box.xMin) + 4, t.py(box.yMax) - 4, '--- (AB)', { size: 11, color: '#FF6B6B', anchor: 'start', weight: '700' }));
        t.svg.appendChild(txt(t.px(box.xMin) + 4, t.py(box.yMax) + 12, '--- (EF)', { size: 11, color: '#A8FF78', anchor: 'start', weight: '700' }));
    }

    document.addEventListener('DOMContentLoaded', function () {
        drawGraph2();
    });
})();
