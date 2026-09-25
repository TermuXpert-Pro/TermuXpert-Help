/* ============================================================
   figuresvg_ex3.js — Section 3 : Applications : ensembles de points (deux points pondérés)
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
        var t = mk('g3a', 460, 250, { xMin: -6, xMax: 14 });
        if (!t) return;
        line(t, -6, 0, 14, 0, COL.ax, 1.4);
        circ(t, 4, 0, 5, COL.D, 2, null, 'rgba(77,157,224,0.06)');
        circ(t, 2, 0, 2, COL.G, 2, null, 'rgba(244,208,63,0.08)');
        P(t, 0, 0, 'A', COL.A, -12, 20);
        P(t, 8, 0, 'B', COL.B, 0, 20);
        P(t, 2, 0, 'G', COL.G, 0, 20, 5);
        P(t, 4, 0, 'I', COL.D, 0, -12, 4);
        lab(t, 4, 3.6, '(E\u2081)', 26, 0, COL.D, 13);
        lab(t, 2, 1.2, '(E\u2082)', -16, -22, COL.G, 13);
    }
    function g_b() {
        var t = mk('g3b', 460, 230, { xMin: -2.5, xMax: 12.5 });
        if (!t) return;
        var G = 20 / 3;
        line(t, -2.5, 0, 12.5, 0, COL.ax, 1.4);
        circ(t, G, 0, 3, COL.G, 2, null, 'rgba(244,208,63,0.08)');
        P(t, 0, 0, 'A', COL.A, 0, 20);
        P(t, 4, 0, 'B', COL.B, 0, 20);
        P(t, G, 0, 'G', COL.G, 0, 20, 5);
        lab(t, G, 3, '(E\u2081)', 22, -4, COL.G, 13);
        lab(t, 2, 0, 'AB = 4', 0, -12, COL.mut, 12);
    }
    function g_c() {
        var t = mk('g3c', 460, 230, { xMin: -1.6, xMax: 7.6 });
        if (!t) return;
        var b = t.box;
        line(t, 0, 0, 6, 0, COL.ax, 1.5);
        line(t, 3, b.yMin, 3, b.yMax, COL.D, 2, '6,4');
        P(t, 0, 0, 'A', COL.A, 0, 20);
        P(t, 6, 0, 'B', COL.B, 0, 20);
        PS(t, 2, 0, 'G', '1', COL.G, 0, 20, 5);
        PS(t, 4, 0, 'G', '2', COL.G, 0, 20, 5);
        P(t, 3, 0, 'I', COL.D, 12, -12, 4);
        seg(t, 3, 0, 3.32, 0, COL.mut, 1); seg(t, 3.32, 0, 3.32, 0.32, COL.mut, 1); seg(t, 3.32, 0.32, 3, 0.32, COL.mut, 1);
        lab(t, 3, 2.1, '(F\u2081)', 26, 0, COL.D, 13);
    }
    function g_d() {
        var t = mk('g3d', 460, 230, { xMin: -1.6, xMax: 7.6 });
        if (!t) return;
        var b = t.box;
        line(t, 0, 0, 6, 0, COL.ax, 1.5);
        line(t, 1.8, b.yMin, 1.8, b.yMax, COL.C, 2, '6,4');
        P(t, 0, 0, 'A', COL.A, -12, 20);
        P(t, 6, 0, 'B', COL.B, 0, 20);
        P(t, 3.6, 0, 'G', COL.G, 0, 20, 5);
        P(t, 1.8, 0, 'K', COL.C, 12, -12, 4);
        lab(t, 1.8, 2.1, '(F\u2082)', 26, 0, COL.C, 13);
        lab(t, 2.7, 0, '3,6', 0, -12, COL.mut, 12);
    }
    function g_e() {
        var t = mk('g3e', 460, 300, { xMin: -1.5, xMax: 7.5, yMin: -3.3, yMax: 3.3 });
        if (!t) return;
        axes(t, { origin: '' });
        circ(t, 2, 0, 2, COL.G, 2, null, 'rgba(244,208,63,0.08)');
        line(t, 3, -3.3, 3, 3.3, COL.D, 1.8, '6,4');
        P(t, 0, 0, 'A', COL.A, -12, 18);
        P(t, 6, 0, 'B', COL.B, 0, 18);
        P(t, 2, 0, 'G', COL.G, -4, 18, 5);
        P(t, 3, Math.sqrt(3), 'M\u2081', COL.ok, 18, -6, 5);
        P(t, 3, -Math.sqrt(3), 'M\u2082', COL.ok, 18, 14, 5);
        lab(t, 3, 3, '(\u0394)', 18, 12, COL.D, 13);
        lab(t, 2, 2, '(E)', -20, -6, COL.G, 13);
    }
    document.addEventListener('DOMContentLoaded', function () { g_a(); g_b(); g_c(); g_d(); g_e(); });

})();

