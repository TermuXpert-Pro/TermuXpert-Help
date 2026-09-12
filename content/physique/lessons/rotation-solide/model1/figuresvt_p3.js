/* ============================================================
   figuresvt_p3.js — Partie 3 : Vitesse angulaire moyenne / instantanée
   Fichier autonome (aucune dépendance externe / aucun import partagé).
   ============================================================ */
(function () {
    'use strict';

    var NS = 'http://www.w3.org/2000/svg';

    function el(tag, attrs) {
        var e = document.createElementNS(NS, tag);
        for (var k in attrs) {
            if (Object.prototype.hasOwnProperty.call(attrs, k)) {
                e.setAttribute(k, attrs[k]);
            }
        }
        return e;
    }

    function txt(x, y, str, attrs) {
        var a = Object.assign({ x: x, y: y, 'font-family': "'Tajawal','Cairo',Arial,sans-serif" }, attrs || {});
        var t = el('text', a);
        t.textContent = str;
        return t;
    }

    function polar(cx, cy, r, deg) {
        var rad = deg * Math.PI / 180;
        return { x: cx + r * Math.cos(rad), y: cy - r * Math.sin(rad) };
    }

    function arcPath(cx, cy, r, deg1, deg2) {
        var p1 = polar(cx, cy, r, deg1);
        var p2 = polar(cx, cy, r, deg2);
        var diff = deg2 - deg1;
        var large = Math.abs(diff) > 180 ? 1 : 0;
        var sweep = diff > 0 ? 0 : 1;
        return 'M ' + p1.x.toFixed(2) + ',' + p1.y.toFixed(2) +
            ' A ' + r + ',' + r + ' 0 ' + large + ',' + sweep + ' ' +
            p2.x.toFixed(2) + ',' + p2.y.toFixed(2);
    }

    function addArrow(defs, id, color) {
        var m = el('marker', { id: id, markerWidth: 7, markerHeight: 7, refX: 5.5, refY: 3, orient: 'auto', markerUnits: 'strokeWidth' });
        var p = el('path', { d: 'M0,0 L6,3 L0,6 Z', fill: color });
        m.appendChild(p);
        defs.appendChild(m);
    }

    function clearSvg(svg) {
        while (svg.firstChild) svg.removeChild(svg.firstChild);
        svg.setAttribute('viewBox', '0 0 400 260');
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    }

    /* ------------------------------------------------------------
       Figure 1 : graphVitesse
       Position de M à t1 (M1, θ1) et à t2 (M2, θ2) — illustre ω_m = Δθ/Δt
       ------------------------------------------------------------ */
    function drawGraphVitesse() {
        var svg = document.getElementById('graphVitesse');
        if (!svg) return;
        clearSvg(svg);

        var defs = el('defs');
        addArrow(defs, 'p3v_arrowRed', '#FF6B6B');
        addArrow(defs, 'p3v_arrowGold', '#F4D03F');
        svg.appendChild(defs);

        var cx = 175, cy = 140, r = 88;
        svg.appendChild(el('circle', { cx: cx, cy: cy, r: r, fill: 'none', stroke: '#4ECDC4', 'stroke-width': 1.3, opacity: 0.4 }));
        svg.appendChild(el('circle', { cx: cx, cy: cy, r: 3, fill: '#E8E8E8' }));
        svg.appendChild(txt(cx - 10, cy + 16, 'O', { 'font-size': 11, fill: '#E8E8E8', 'font-weight': '700' }));

        var ang1 = 15, ang2 = 95;
        var M1 = polar(cx, cy, r, ang1);
        var M2 = polar(cx, cy, r, ang2);

        // vecteurs OM1 et OM2
        svg.appendChild(el('line', { x1: cx, y1: cy, x2: M1.x - 6, y2: M1.y - 2, stroke: '#F4D03F', 'stroke-width': 1.6, 'marker-end': 'url(#p3v_arrowGold)' }));
        svg.appendChild(el('line', { x1: cx, y1: cy, x2: M2.x - 3, y2: M2.y - 8, stroke: '#FF6B6B', 'stroke-width': 1.6, 'marker-end': 'url(#p3v_arrowRed)' }));

        // Angle Δθ
        svg.appendChild(el('path', { d: arcPath(cx, cy, 30, ang1, ang2), fill: 'none', stroke: '#E8E8E8', 'stroke-width': 1.4 }));
        var dLbl = polar(cx, cy, 42, (ang1 + ang2) / 2);
        svg.appendChild(txt(dLbl.x - 12, dLbl.y - 2, 'Δθ', { 'font-size': 12, fill: '#E8E8E8', 'font-weight': '700' }));

        // Arc de trajectoire entre M1 et M2 (fin, en pointillé sur le cercle)
        svg.appendChild(el('path', { d: arcPath(cx, cy, r, ang1, ang2), fill: 'none', stroke: '#4ECDC4', 'stroke-width': 3, 'stroke-linecap': 'round' }));

        svg.appendChild(el('circle', { cx: M1.x, cy: M1.y, r: 4.5, fill: '#F4D03F' }));
        svg.appendChild(txt(M1.x + 8, M1.y + 2, 'M₁', { 'font-size': 12, fill: '#F4D03F', 'font-weight': '700' }));
        svg.appendChild(txt(M1.x + 8, M1.y + 16, 't₁', { 'font-size': 10, fill: '#B8860B' }));

        svg.appendChild(el('circle', { cx: M2.x, cy: M2.y, r: 4.5, fill: '#FF6B6B' }));
        svg.appendChild(txt(M2.x + 6, M2.y - 8, 'M₂', { 'font-size': 12, fill: '#FF6B6B', 'font-weight': '700' }));
        svg.appendChild(txt(M2.x + 6, M2.y - 22, 't₂', { 'font-size': 10, fill: '#B8860B' }));

        svg.appendChild(txt(20, 244, 'ω_m = Δθ / Δt = (θ₂ - θ₁) / (t₂ - t₁)', { 'font-size': 10.5, fill: '#B8860B', 'font-weight': '700' }));
    }

    /* ------------------------------------------------------------
       Figure 2 : graphInstant
       Vitesse angulaire instantanée à ti : trois positions très
       rapprochées M_(i-1), M_i, M_(i+1) — illustre le passage à la limite.
       ------------------------------------------------------------ */
    function drawGraphInstant() {
        var svg = document.getElementById('graphInstant');
        if (!svg) return;
        clearSvg(svg);

        var defs = el('defs');
        addArrow(defs, 'p3i_arrowTeal', '#4ECDC4');
        svg.appendChild(defs);

        var cx = 175, cy = 140, r = 88;
        svg.appendChild(el('circle', { cx: cx, cy: cy, r: r, fill: 'none', stroke: '#4ECDC4', 'stroke-width': 1.3, opacity: 0.4 }));
        svg.appendChild(el('circle', { cx: cx, cy: cy, r: 3, fill: '#E8E8E8' }));
        svg.appendChild(txt(cx - 10, cy + 16, 'O', { 'font-size': 11, fill: '#E8E8E8', 'font-weight': '700' }));

        // Trois angles très proches (zoom conceptuel sur un petit secteur)
        var a0 = 60, a1 = 72, a2 = 84;
        var P0 = polar(cx, cy, r, a0);
        var P1 = polar(cx, cy, r, a1);
        var P2 = polar(cx, cy, r, a2);

        // Zone zoomée mise en évidence (secteur clair)
        svg.appendChild(el('path', { d: arcPath(cx, cy, r, a0, a2), fill: 'none', stroke: '#F4D03F', 'stroke-width': 4, 'stroke-linecap': 'round' }));

        svg.appendChild(el('circle', { cx: P0.x, cy: P0.y, r: 3.6, fill: '#E8E8E8' }));
        svg.appendChild(txt(P0.x + 8, P0.y + 4, 'M_(i-1)', { 'font-size': 10, fill: '#E8E8E8', 'font-weight': '700' }));

        svg.appendChild(el('circle', { cx: P1.x, cy: P1.y, r: 4.5, fill: '#4ECDC4' }));
        svg.appendChild(txt(P1.x + 4, P1.y - 10, 'M_i', { 'font-size': 11, fill: '#4ECDC4', 'font-weight': '700' }));

        svg.appendChild(el('circle', { cx: P2.x, cy: P2.y, r: 3.6, fill: '#E8E8E8' }));
        svg.appendChild(txt(P2.x - 12, P2.y - 14, 'M_(i+1)', { 'font-size': 10, fill: '#E8E8E8', 'font-weight': '700' }));

        // Vecteur tangent en M_i (direction instantanée du mouvement)
        var tangentAngle = a1 + 90;
        var tEnd = polar(P1.x, P1.y, 34, tangentAngle);
        svg.appendChild(el('line', { x1: P1.x, y1: P1.y, x2: tEnd.x, y2: tEnd.y, stroke: '#4ECDC4', 'stroke-width': 1.8, 'marker-end': 'url(#p3i_arrowTeal)' }));

        // Bulle de zoom pointant vers la petite région (cercle en tirets autour du secteur)
        var zoomC = polar(cx, cy, r, a1);
        svg.appendChild(el('circle', { cx: zoomC.x, cy: zoomC.y, r: 26, fill: 'none', stroke: '#9aa0a6', 'stroke-width': 1, 'stroke-dasharray': '3,3', opacity: 0.6 }));

        svg.appendChild(txt(20, 30, 't_(i-1) , t_i , t_(i+1) très proches', { 'font-size': 10, fill: '#9aa0a6' }));
        svg.appendChild(txt(20, 244, 'ω = dθ/dt = θ̇  (limite quand Δt → 0)', { 'font-size': 10.5, fill: '#B8860B', 'font-weight': '700' }));
    }

    /* ------------------------------------------------------------
       Figure 3 : graphRelation
       v = r·ω : rayon r, rotation ω (flèche courbe autour de O),
       vitesse linéaire v tangente au cercle en M.
       ------------------------------------------------------------ */
    function drawGraphRelation() {
        var svg = document.getElementById('graphRelation');
        if (!svg) return;
        clearSvg(svg);

        var defs = el('defs');
        addArrow(defs, 'p3r_arrowGold', '#F4D03F');
        addArrow(defs, 'p3r_arrowTeal', '#4ECDC4');
        addArrow(defs, 'p3r_arrowGray', '#9aa0a6');
        svg.appendChild(defs);

        var cx = 165, cy = 140, r = 82;
        svg.appendChild(el('circle', { cx: cx, cy: cy, r: r, fill: 'none', stroke: '#4ECDC4', 'stroke-width': 1.3, opacity: 0.4 }));
        svg.appendChild(el('circle', { cx: cx, cy: cy, r: 3, fill: '#E8E8E8' }));
        svg.appendChild(txt(cx - 10, cy + 16, 'O', { 'font-size': 11, fill: '#E8E8E8', 'font-weight': '700' }));

        var angM = 25;
        var M = polar(cx, cy, r, angM);

        // Rayon r
        svg.appendChild(el('line', { x1: cx, y1: cy, x2: M.x, y2: M.y, stroke: '#F4D03F', 'stroke-width': 1.8 }));
        var midR = { x: (cx + M.x) / 2, y: (cy + M.y) / 2 };
        svg.appendChild(txt(midR.x - 4, midR.y - 8, 'r', { 'font-size': 13, fill: '#F4D03F', 'font-style': 'italic', 'font-weight': '700' }));

        svg.appendChild(el('circle', { cx: M.x, cy: M.y, r: 4.5, fill: '#E8E8E8' }));
        svg.appendChild(txt(M.x + 6, M.y - 6, 'M', { 'font-size': 13, fill: '#E8E8E8', 'font-weight': '700' }));

        // omega : flèche courbe autour de O
        var omArc = arcPath(cx, cy, 40, 60, 160);
        svg.appendChild(el('path', { d: omArc, fill: 'none', stroke: '#F4D03F', 'stroke-width': 1.8, 'marker-end': 'url(#p3r_arrowGold)' }));
        var omLbl = polar(cx, cy, 50, 110);
        svg.appendChild(txt(omLbl.x - 6, omLbl.y, 'ω', { 'font-size': 14, fill: '#F4D03F', 'font-weight': '700' }));

        // vitesse v : tangente au cercle en M, perpendiculaire à OM
        var vEnd = polar(M.x, M.y, 46, angM + 90);
        svg.appendChild(el('line', { x1: M.x, y1: M.y, x2: vEnd.x, y2: vEnd.y, stroke: '#4ECDC4', 'stroke-width': 2, 'marker-end': 'url(#p3r_arrowTeal)' }));
        svg.appendChild(txt(vEnd.x + 6, vEnd.y - 4, 'v', { 'font-size': 14, fill: '#4ECDC4', 'font-style': 'italic', 'font-weight': '700' }));

        // Petit angle droit entre OM et v
        svg.appendChild(txt(20, 230, 'v ⟂ OM  (v tangente à la trajectoire)', { 'font-size': 9.5, fill: '#9aa0a6' }));
        svg.appendChild(txt(20, 244, 'v = r · ω', { 'font-size': 12, fill: '#B8860B', 'font-weight': '700' }));
    }

    function init() {
        drawGraphVitesse();
        drawGraphInstant();
        drawGraphRelation();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
