/* ============================================================
   figuresvg_ex1.js — Exercice 1 : Barycentre de 2 points, alignement
   Fichier autonome (self-contained) : aucune dépendance externe.
   Sert les questions 1) et 2) avec UNE seule figure (repère avec
   A, B, G et la droite (AB) qui passe par G).
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
        t.svg.appendChild(txt(t.W / 2, 18, str, { size: 12, color: '#8B949E', weight: '600' }));
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
        arrowMarker(t.svg, 'ex1axX', '#8B949E');
        arrowMarker(t.svg, 'ex1axY', '#8B949E');
        if (box.xMin <= 0 && box.xMax >= 0) {
            t.svg.appendChild(el('line', { x1: t.px(0), y1: t.py(box.yMin), x2: t.px(0), y2: t.py(box.yMax) - 10, stroke: '#8B949E', 'stroke-width': 1.4, 'marker-end': 'url(#ex1axY)' }));
            t.svg.appendChild(txt(t.px(0) + 12, t.py(box.yMax) - 4, 'y', { size: 12, color: '#8B949E', anchor: 'start' }));
        }
        if (box.yMin <= 0 && box.yMax >= 0) {
            t.svg.appendChild(el('line', { x1: t.px(box.xMin), y1: t.py(0), x2: t.px(box.xMax) - 10, y2: t.py(0), stroke: '#8B949E', 'stroke-width': 1.4, 'marker-end': 'url(#ex1axX)' }));
            t.svg.appendChild(txt(t.px(box.xMax) - 6, t.py(0) - 8, 'x', { size: 12, color: '#8B949E', anchor: 'end' }));
        }
        t.svg.appendChild(txt(t.px(0) - 8, t.py(0) + 14, 'O', { size: 11, color: '#8B949E', anchor: 'end' }));
    }

    function drawGraph1() {
        var box = { xMin: -1, xMax: 6, yMin: -1, yMax: 4 };
        var t = makeCanvas('graph1svg', 460, 300, box);
        if (!t) return;

        gridAxes(t, box);

        var A = { x: 3, y: 2 }, B = { x: 4, y: 1 }, G = { x: 17 / 4, y: 3 / 4 };
        // droite (AB) prolongée : passe par G (colinéarité vérifiée à la question 2)
        seg(t, 2.2, 2.8, 4.6, 0.4, '#8B949E', 1.6, '5,4');

        point(t, A.x, A.y, '#4ECDC4');
        label(t, A.x, A.y, 'A(3;2)', 0, -12, '#4ECDC4');

        point(t, B.x, B.y, '#FF6B6B');
        label(t, B.x, B.y, 'B(4;1)', 22, 4, '#FF6B6B');

        point(t, G.x, G.y, '#F4D03F', 6);
        label(t, G.x, G.y, 'G(17/4;3/4)', 0, 20, '#F4D03F', 12.5);

        title(t, 'G = Bar{(A,1);(B,-5)}  —  A, G, B alignés');
    }

    document.addEventListener('DOMContentLoaded', function () {
        drawGraph1();
    });
})();
