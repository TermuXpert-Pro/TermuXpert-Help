/* ============================================================
   figuresvt_p5.js — Partie 5 : Équation horaire - Activité - Résumé
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
       Figure 1 : graphHoraire
       θ = f(t) — droite affine GÉNÉRIQUE (sans valeurs numériques) :
       met en évidence la pente (= ω) et l'ordonnée à l'origine (= θ0).
       ------------------------------------------------------------ */
    function drawGraphHoraire() {
        var svg = document.getElementById('graphHoraire');
        if (!svg) return;
        clearSvg(svg);

        var defs = el('defs');
        addArrow(defs, 'p5h_arrowGray', '#9aa0a6');
        svg.appendChild(defs);

        var ox = 55, oy = 205, xMax = 355, yMax = 26;

        svg.appendChild(el('line', { x1: ox, y1: oy, x2: xMax, y2: oy, stroke: '#9aa0a6', 'stroke-width': 1.3, 'marker-end': 'url(#p5h_arrowGray)' }));
        svg.appendChild(el('line', { x1: ox, y1: oy, x2: ox, y2: yMax, stroke: '#9aa0a6', 'stroke-width': 1.3, 'marker-end': 'url(#p5h_arrowGray)' }));
        svg.appendChild(txt(xMax - 8, oy + 18, 't', { 'font-size': 12, fill: '#9aa0a6' }));
        svg.appendChild(txt(ox - 22, yMax + 2, 'θ', { 'font-size': 13, fill: '#9aa0a6' }));

        // Droite generique
        var x0 = ox + 18, y0 = oy - 46;   // intercept theta0
        var x1 = ox + 250, y1 = yMax + 20;
        svg.appendChild(el('line', { x1: x0, y1: y0, x2: x1, y2: y1, stroke: '#4ECDC4', 'stroke-width': 2.2 }));

        // Point intercept theta0
        svg.appendChild(el('circle', { cx: x0, cy: y0, r: 4, fill: '#F4D03F' }));
        svg.appendChild(txt(x0 - 40, y0 + 4, 'θ₀', { 'font-size': 12, fill: '#F4D03F', 'font-weight': '700' }));
        svg.appendChild(el('line', { x1: ox, y1: y0, x2: x0, y2: y0, stroke: '#F4D03F', 'stroke-width': 1, 'stroke-dasharray': '3,3' }));

        // Triangle de pente entre deux points de la droite
        var xa = ox + 90, xb = ox + 170;
        function yOnLine(x) { return y0 + (y1 - y0) * (x - x0) / (x1 - x0); }
        var ya = yOnLine(xa), yb = yOnLine(xb);
        svg.appendChild(el('line', { x1: xa, y1: ya, x2: xb, y2: ya, stroke: '#FF6B6B', 'stroke-width': 1.2, 'stroke-dasharray': '3,3' }));
        svg.appendChild(el('line', { x1: xb, y1: ya, x2: xb, y2: yb, stroke: '#FF6B6B', 'stroke-width': 1.2, 'stroke-dasharray': '3,3' }));
        svg.appendChild(txt((xa + xb) / 2 - 14, ya + 16, 'Δt', { 'font-size': 10.5, fill: '#FF6B6B', 'font-weight': '700' }));
        svg.appendChild(txt(xb + 6, (ya + yb) / 2, 'Δθ', { 'font-size': 10.5, fill: '#FF6B6B', 'font-weight': '700' }));

        svg.appendChild(txt(ox + 4, yMax - 6, 'pente = Δθ/Δt = ω   |   ordonnée à l\'origine = θ₀', { 'font-size': 9.5, fill: '#B8860B', 'font-weight': '700' }));
        svg.appendChild(txt(ox + 4, oy + 34, 'θ = ω·(t - t₀) + θ₀  →  droite affine', { 'font-size': 10, fill: '#4ECDC4', 'font-weight': '700' }));
    }

    /* ------------------------------------------------------------
       Figure 2 : graphActivite
       Enregistrement stroboscopique de M (autoporteur) : M0..M6,
       θ = 0, π/6, π/3, π/2, 2π/3, 5π/6, π  —  t = -80..160 ms (pas 40 ms)
       r = 2.5 cm — angles régulièrement espacés → mouvement uniforme.
       ------------------------------------------------------------ */
    function drawGraphActivite() {
        var svg = document.getElementById('graphActivite');
        if (!svg) return;
        clearSvg(svg);

        var cx = 200, cy = 195, r = 92;

        // Demi-cercle (support de la trajectoire enregistrée)
        svg.appendChild(el('path', { d: arcPath(cx, cy, r, 0, 180), fill: 'none', stroke: '#4ECDC4', 'stroke-width': 1.3, opacity: 0.4 }));
        svg.appendChild(el('circle', { cx: cx, cy: cy, r: 3, fill: '#E8E8E8' }));
        svg.appendChild(txt(cx, cy + 16, 'O', { 'font-size': 10.5, fill: '#E8E8E8', 'font-weight': '700', 'text-anchor': 'middle' }));

        // Rayon r (segment court, angle intermédiaire pour ne recouvrir aucun point Mi)
        var rEnd = polar(cx, cy, r, 105);
        svg.appendChild(el('line', { x1: cx, y1: cy, x2: rEnd.x, y2: rEnd.y, stroke: '#B8860B', 'stroke-width': 1, 'stroke-dasharray': '3,3', opacity: 0.7 }));
        svg.appendChild(txt((cx + rEnd.x) / 2 + 6, (cy + rEnd.y) / 2 - 2, 'r', { 'font-size': 10.5, fill: '#B8860B', 'font-style': 'italic', 'font-weight': '700' }));

        var times = [-80, -40, 0, 40, 80, 120, 160];
        var angles = [0, 30, 60, 90, 120, 150, 180];

        for (var i = 0; i < 7; i++) {
            var p = polar(cx, cy, r, angles[i]);
            svg.appendChild(el('circle', { cx: p.x, cy: p.y, r: 4, fill: '#FF6B6B' }));

            // Anneau 1 (proche) : nom du point Mi
            var lblPt = polar(cx, cy, r + 14, angles[i]);
            svg.appendChild(txt(lblPt.x, lblPt.y, 'M' + i, { 'font-size': 10, fill: '#FF6B6B', 'font-weight': '700', 'text-anchor': 'middle' }));

            // Anneau 2 (exterieur) : temps ti
            var tPt = polar(cx, cy, r + 32, angles[i]);
            svg.appendChild(txt(tPt.x, tPt.y, times[i] + ' ms', { 'font-size': 8, fill: '#9aa0a6', 'text-anchor': 'middle' }));
        }

        svg.appendChild(txt(cx, 244, 'r = 2.5 cm  —  Δθ = π/6 constant entre deux positions successives', { 'font-size': 8.8, fill: '#B8860B', 'font-weight': '700', 'text-anchor': 'middle' }));
        svg.appendChild(txt(cx, 256, '(Δt = 40 ms constant) ⇒ mouvement circulaire uniforme', { 'font-size': 8.4, fill: '#9aa0a6', 'text-anchor': 'middle' }));
    }

    /* ------------------------------------------------------------
       Figure 3 : graphEquations
       θ = 13.09·t + π/3  (résultat numérique de l'activité, t en s)
       ------------------------------------------------------------ */
    function drawGraphEquations() {
        var svg = document.getElementById('graphEquations');
        if (!svg) return;
        clearSvg(svg);

        var defs = el('defs');
        addArrow(defs, 'p5e_arrowGray', '#9aa0a6');
        svg.appendChild(defs);

        var ox = 60, oy = 210, xMax = 355, yMax = 24;
        var tMaxData = 0.3;    // s
        var thetaMaxData = 6.5; // rad

        function toX(t) { return ox + (t / tMaxData) * (xMax - ox); }
        function toY(th) { return oy - (th / thetaMaxData) * (oy - yMax); }

        svg.appendChild(el('line', { x1: ox, y1: oy, x2: xMax, y2: oy, stroke: '#9aa0a6', 'stroke-width': 1.3, 'marker-end': 'url(#p5e_arrowGray)' }));
        svg.appendChild(el('line', { x1: ox, y1: oy, x2: ox, y2: yMax, stroke: '#9aa0a6', 'stroke-width': 1.3, 'marker-end': 'url(#p5e_arrowGray)' }));
        svg.appendChild(txt(xMax - 10, oy + 18, 't (s)', { 'font-size': 10.5, fill: '#9aa0a6' }));
        svg.appendChild(txt(ox - 30, yMax + 4, 'θ (rad)', { 'font-size': 10.5, fill: '#9aa0a6' }));

        [0, 0.1, 0.2, 0.3].forEach(function (t) {
            var x = toX(t);
            svg.appendChild(el('line', { x1: x, y1: oy - 3, x2: x, y2: oy + 3, stroke: '#9aa0a6', 'stroke-width': 1 }));
            svg.appendChild(txt(x - 10, oy + 16, t.toString(), { 'font-size': 8.5, fill: '#9aa0a6' }));
        });
        [0, 2, 4, 6].forEach(function (v) {
            var y = toY(v);
            svg.appendChild(el('line', { x1: ox - 3, y1: y, x2: ox + 3, y2: y, stroke: '#9aa0a6', 'stroke-width': 1 }));
            svg.appendChild(txt(ox - 18, y + 3, String(v), { 'font-size': 8.5, fill: '#9aa0a6' }));
        });

        var theta0 = Math.PI / 3;
        var omega = 13.09;
        var t1 = 0, t2 = 0.25;
        var y1v = theta0 + omega * t1;
        var y2v = theta0 + omega * t2;
        svg.appendChild(el('line', { x1: toX(t1), y1: toY(y1v), x2: toX(t2), y2: toY(y2v), stroke: '#4ECDC4', 'stroke-width': 2.2 }));

        svg.appendChild(el('circle', { cx: toX(0), cy: toY(theta0), r: 4, fill: '#F4D03F' }));
        svg.appendChild(txt(toX(0) + 6, toY(theta0) - 6, 'θ₀ = π/3', { 'font-size': 9, fill: '#F4D03F', 'font-weight': '700' }));

        var t3 = 0.2, y3v = theta0 + omega * t3;
        svg.appendChild(el('circle', { cx: toX(t3), cy: toY(y3v), r: 4, fill: '#FF6B6B' }));
        svg.appendChild(el('line', { x1: toX(t3), y1: toY(y3v), x2: toX(t3), y2: oy, stroke: '#FF6B6B', 'stroke-width': 1, 'stroke-dasharray': '3,3', opacity: 0.6 }));
        svg.appendChild(el('line', { x1: ox, y1: toY(y3v), x2: toX(t3), y2: toY(y3v), stroke: '#FF6B6B', 'stroke-width': 1, 'stroke-dasharray': '3,3', opacity: 0.6 }));
        svg.appendChild(txt(toX(t3) + 6, toY(y3v) - 4, 'θ(0.2s) ≈ 3.67', { 'font-size': 8.6, fill: '#FF6B6B', 'font-weight': '700' }));

        svg.appendChild(txt(ox + 4, yMax - 6, 'θ = 13.09·t + π/3   (ω = 13.09 rad/s)', { 'font-size': 10, fill: '#B8860B', 'font-weight': '700' }));
    }

    function init() {
        drawGraphHoraire();
        drawGraphActivite();
        drawGraphEquations();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

