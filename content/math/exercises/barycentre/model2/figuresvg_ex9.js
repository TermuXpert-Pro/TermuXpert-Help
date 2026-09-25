/* ============================================================
   figuresvg_ex9.js — Section 9 : Devoir surveillé type : Barycentre dans le plan
   Fichier autonome (self-contained) : aucune dépendance externe.
   Toutes les fonctions d'aide (helpers) sont définies localement.
   ============================================================ */
(function () {
    'use strict';

    var NS = 'http://www.w3.org/2000/svg';
    var FONT = "'Cairo','Segoe UI',sans-serif";
    var COL = { A: '#4ECDC4', B: '#FF6B6B', C: '#BB8FCE', D: '#4D9DE0', G: '#F4D03F',
                ax: '#8B949E', gr: '#21262D', tx: '#E6EDF3', mut: '#8B949E', ok: '#7EE787', bg: '#0D1117' };

    function el(tag, attrs) {
        var e = document.createElementNS(NS, tag);
        for (var k in attrs) { if (Object.prototype.hasOwnProperty.call(attrs, k)) e.setAttribute(k, attrs[k]); }
        return e;
    }
    function txt(x, y, str, o) {
        o = o || {};
        var t = el('text', {
            x: x, y: y, 'text-anchor': o.anchor || 'middle', 'font-family': FONT,
            'font-size': o.size || 13, 'font-weight': o.weight || '700', fill: o.color || COL.tx,
            'paint-order': 'stroke', stroke: COL.bg, 'stroke-width': o.halo === 0 ? 0 : 3.5, 'stroke-linejoin': 'round'
        });
        t.textContent = str;
        return t;
    }
    /* Crée le repère : box = {xMin,xMax,yMin,yMax} ; si yMin/yMax absents, ils sont déduits du ratio W/H */
    function mk(id, W, H, box) {
        var svg = document.getElementById(id);
        if (!svg) return null;
        while (svg.firstChild) svg.removeChild(svg.firstChild);
        var b = { xMin: box.xMin, xMax: box.xMax, yMin: box.yMin, yMax: box.yMax };
        if (b.yMin === undefined) {
            var h = (b.xMax - b.xMin) * H / W;
            b.yMin = -h / 2; b.yMax = h / 2;
        }
        svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
        svg.setAttribute('width', '100%');
        svg.removeAttribute('height');
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        svg.style.height = 'auto'; svg.style.display = 'block'; svg.style.margin = '0 auto'; svg.style.maxWidth = W + 'px';
        var sc = Math.min(W / (b.xMax - b.xMin), H / (b.yMax - b.yMin));
        var offX = (W - (b.xMax - b.xMin) * sc) / 2, offY = (H - (b.yMax - b.yMin) * sc) / 2;
        var t = { svg: svg, W: W, H: H, box: b, scale: sc, id: id,
                  px: function (x) { return offX + (x - b.xMin) * sc; },
                  py: function (y) { return H - offY - (y - b.yMin) * sc; } };
        return t;
    }
    function marker(t, key, color) {
        var defs = t.svg.querySelector('defs');
        if (!defs) { defs = el('defs', {}); t.svg.insertBefore(defs, t.svg.firstChild); }
        var id = t.id + '_' + key;
        var m = el('marker', { id: id, markerWidth: 9, markerHeight: 9, refX: 7, refY: 3, orient: 'auto', markerUnits: 'strokeWidth' });
        m.appendChild(el('path', { d: 'M0,0 L7,3 L0,6 Z', fill: color }));
        defs.appendChild(m);
        return 'url(#' + id + ')';
    }
    /* grille + axes d'un repère orthonormé */
    function axes(t, opt) {
        opt = opt || {};
        var b = t.box, i;
        for (i = Math.ceil(b.xMin); i <= Math.floor(b.xMax); i++) {
            if (i === 0) continue;
            t.svg.appendChild(el('line', { x1: t.px(i), y1: t.py(b.yMin), x2: t.px(i), y2: t.py(b.yMax), stroke: COL.gr, 'stroke-width': 1 }));
            if (opt.ticks !== false) t.svg.appendChild(txt(t.px(i), t.py(0) + 14, String(i), { size: 10, color: COL.mut, weight: '600', halo: 0 }));
        }
        for (i = Math.ceil(b.yMin); i <= Math.floor(b.yMax); i++) {
            if (i === 0) continue;
            t.svg.appendChild(el('line', { x1: t.px(b.xMin), y1: t.py(i), x2: t.px(b.xMax), y2: t.py(i), stroke: COL.gr, 'stroke-width': 1 }));
            if (opt.ticks !== false) t.svg.appendChild(txt(t.px(0) - 5, t.py(i) + 3.5, String(i), { size: 10, color: COL.mut, weight: '600', anchor: 'end', halo: 0 }));
        }
        var mx = marker(t, 'axX', COL.ax), my = marker(t, 'axY', COL.ax);
        t.svg.appendChild(el('line', { x1: t.px(b.xMin), y1: t.py(0), x2: t.px(b.xMax) - 2, y2: t.py(0), stroke: COL.ax, 'stroke-width': 1.4, 'marker-end': mx }));
        t.svg.appendChild(el('line', { x1: t.px(0), y1: t.py(b.yMin), x2: t.px(0), y2: t.py(b.yMax) + 2, stroke: COL.ax, 'stroke-width': 1.4, 'marker-end': my }));
        t.svg.appendChild(txt(t.px(b.xMax) - 4, t.py(0) - 7, 'x', { size: 12, color: COL.mut, anchor: 'end' }));
        t.svg.appendChild(txt(t.px(0) + 8, t.py(b.yMax) + 10, 'y', { size: 12, color: COL.mut, anchor: 'start' }));
        if (opt.origin !== '') t.svg.appendChild(txt(t.px(0) - 6, t.py(0) + 13, opt.origin || 'O', { size: 11, color: COL.mut, anchor: 'end' }));
    }
    function seg(t, x1, y1, x2, y2, col, w, dash) {
        var a = { x1: t.px(x1), y1: t.py(y1), x2: t.px(x2), y2: t.py(y2), stroke: col || COL.ax, 'stroke-width': w || 1.6, 'stroke-linecap': 'round' };
        if (dash) a['stroke-dasharray'] = dash;
        t.svg.appendChild(el('line', a));
    }
    /* droite infinie (rognée au cadre) passant par (x1,y1) et (x2,y2) */
    function line(t, x1, y1, x2, y2, col, w, dash) {
        var b = t.box, dx = x2 - x1, dy = y2 - y1, lo = -1e9, hi = 1e9;
        function clip(p, q) {
            if (Math.abs(p) < 1e-12) { return q >= 0; }
            var r = q / p;
            if (p < 0) { if (r > hi) return false; if (r > lo) lo = r; }
            else { if (r < lo) return false; if (r < hi) hi = r; }
            return true;
        }
        if (clip(-dx, x1 - b.xMin) && clip(dx, b.xMax - x1) && clip(-dy, y1 - b.yMin) && clip(dy, b.yMax - y1)) {
            seg(t, x1 + lo * dx, y1 + lo * dy, x1 + hi * dx, y1 + hi * dy, col, w, dash);
        }
    }
    function arrow(t, x1, y1, x2, y2, col, w) {
        var m = marker(t, 'ar' + Math.round(Math.random() * 1e6), col);
        t.svg.appendChild(el('line', { x1: t.px(x1), y1: t.py(y1), x2: t.px(x2), y2: t.py(y2), stroke: col, 'stroke-width': w || 2, 'marker-end': m, 'stroke-linecap': 'round' }));
    }
    function circ(t, cx, cy, r, col, w, dash, fill) {
        var a = { cx: t.px(cx), cy: t.py(cy), r: r * t.scale, stroke: col, 'stroke-width': w || 1.8, fill: fill || 'none' };
        if (dash) a['stroke-dasharray'] = dash;
        t.svg.appendChild(el('circle', a));
    }
    function poly(t, pts, col, w, fill, dash) {
        var s = pts.map(function (p) { return t.px(p[0]) + ',' + t.py(p[1]); }).join(' ');
        var a = { points: s, stroke: col, 'stroke-width': w || 1.8, fill: fill || 'none', 'stroke-linejoin': 'round' };
        if (dash) a['stroke-dasharray'] = dash;
        t.svg.appendChild(el('polygon', a));
    }
    function pt(t, x, y, col, r) {
        t.svg.appendChild(el('circle', { cx: t.px(x), cy: t.py(y), r: r || 4.5, fill: col, stroke: COL.bg, 'stroke-width': 1.5 }));
    }
    /* étiquette : position monde + décalage en pixels */
    function lab(t, x, y, str, dx, dy, col, size, anchor) {
        t.svg.appendChild(txt(t.px(x) + (dx || 0), t.py(y) + (dy || 0), str, { size: size || 13, color: col || COL.tx, anchor: anchor || 'middle' }));
    }
    /* point + étiquette */
    function P(t, x, y, name, col, dx, dy, r, size) {
        pt(t, x, y, col, r);
        lab(t, x, y, name, dx, dy, col, size);
    }

    /* étiquette avec indice : main + sub (ex. G_m) */
    function labS(t, x, y, main, sub, dx, dy, col, size) {
        var s = size || 13;
        var tt = txt(t.px(x) + (dx || 0), t.py(y) + (dy || 0), main, { size: s, color: col || COL.tx });
        var sp = el('tspan', { 'font-size': Math.round(s * 0.74 * 10) / 10, dy: 3.5 });
        sp.textContent = sub;
        tt.appendChild(sp);
        t.svg.appendChild(tt);
    }
    function PS(t, x, y, main, sub, col, dx, dy, r, size) {
        pt(t, x, y, col, r);
        labS(t, x, y, main, sub, dx, dy, col, size);
    }
    /* petit trait perpendiculaire à un segment (graduation) */
    function tick(t, x, y, ux, uy, col, len) {
        var n = Math.sqrt(ux * ux + uy * uy), nx = -uy / n, ny = ux / n, l = (len || 6) / t.scale;
        seg(t, x - nx * l, y - ny * l, x + nx * l, y + ny * l, col || COL.ax, 1.6);
    }
    function cap(t, str, y) {
        t.svg.appendChild(txt(t.W / 2, y || 18, str, { size: 12, color: COL.mut, weight: '600', halo: 0 }));
    }
    /* marque de milieu : deux petits traits parallèles sur le segment [x1y1 ; x2y2] */
    function mid(t, x1, y1, x2, y2, col) {
        tick(t, (x1 + x2) / 2, (y1 + y2) / 2, x2 - x1, y2 - y1, col, 5);
    }


    function g_a() {
        var t = mk('g9a', 460, 290, { xMin: -2.6, xMax: 5.2, yMin: -0.9, yMax: 3.9 });
        if (!t) return;
        var A = [0, 0], B = [4, 0], C = [1, 3], G = [-1.5, 1.5], N = [2.5, 1.5], L = [1 / 3, 1];
        poly(t, [A, B, C], COL.ax, 1.8, 'rgba(139,148,158,0.05)');
        poly(t, [A, G, N, B], COL.G, 1.6, 'rgba(244,208,63,0.06)', '6,4');
        seg(t, B[0], B[1], G[0], G[1], COL.D, 1.4);
        P(t, A[0], A[1], 'A', COL.A, 4, 18);
        P(t, B[0], B[1], 'B', COL.B, 12, 6);
        P(t, C[0], C[1], 'C', COL.C, 0, -12);
        P(t, G[0], G[1], 'G', COL.G, -14, 4, 5.5);
        P(t, N[0], N[1], 'N', COL.ok, 14, -2, 4.5);
        P(t, L[0], L[1], 'L', COL.D, 12, -8, 4.5);
    }
    function g_b() {
        var t = mk('g9b', 460, 260, { xMin: -1.4, xMax: 5.4, yMin: -2.6, yMax: 2.6 });
        if (!t) return;
        axes(t, { origin: '' });
        circ(t, 1, 0, 2, COL.G, 2, null, 'rgba(244,208,63,0.06)');
        line(t, 2, -2.6, 2, 2.6, COL.D, 1.8, '6,4');
        poly(t, [[1, 0], [2, Math.sqrt(3)], [3, 0]], COL.ok, 1.6, 'rgba(126,231,135,0.08)');
        P(t, 0, 0, 'A', COL.A, -12, 16);
        P(t, 4, 0, 'B', COL.B, 0, 16);
        PS(t, 1, 0, 'G', '1', COL.G, -4, 18, 5);
        PS(t, 3, 0, 'G', '2', COL.G, 8, 18, 5);
        PS(t, 2, Math.sqrt(3), 'M', '1', COL.ok, 16, -4, 4.5);
        PS(t, 2, -Math.sqrt(3), 'M', '2', COL.ok, 16, 12, 4.5);
        lab(t, 2, 2.3, '(E\u2082)', 24, 0, COL.D, 13);
        lab(t, -0.35, 1.5, '(E\u2081)', 0, 0, COL.G, 13);
    }
    function g_c() {
        var t = mk('g9c', 460, 330, { xMin: -3.6, xMax: 6.6, yMin: -3.4, yMax: 5.6 });
        if (!t) return;
        axes(t, { origin: '' });
        var A = [-1, 2], B = [3, -2], C = [5, 4], I = [4, 1], G = [1.5, 1.5];
        poly(t, [A, B, C], COL.ax, 1.6, 'rgba(139,148,158,0.05)');
        line(t, -1, 2, 0, 5, COL.D, 1.8, '6,4');
        seg(t, A[0], A[1], I[0], I[1], COL.gr, 1.4);
        P(t, A[0], A[1], 'A', COL.A, -14, -6);
        P(t, B[0], B[1], 'B', COL.B, 14, 10);
        P(t, C[0], C[1], 'C', COL.C, 14, -4);
        P(t, I[0], I[1], 'I', COL.D, 14, 12, 4);
        P(t, G[0], G[1], 'G', COL.G, 4, 18, 5.5);
        PS(t, -2, -1, 'G', '\u00bd', COL.ok, -18, 4, 4.5);
        lab(t, 0.15, 5.1, 'y = 3x + 5', 44, 0, COL.D, 12);
    }
    document.addEventListener('DOMContentLoaded', function () { g_a(); g_b(); g_c(); });

})();

