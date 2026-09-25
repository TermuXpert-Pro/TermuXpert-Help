/* ============================================================
   figuresvt_p6.js — Partie 6 : Résumé général
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
       Figure : graphResume
       Vue de synthèse : axe (Δ), trajectoire circulaire, rayon r,
       origine M0, position M, angle θ et arc s réunis sur une seule
       figure récapitulative.
       ------------------------------------------------------------ */
    function drawGraphResume() {
        var svg = document.getElementById('graphResume');
        if (!svg) return;
        clearSvg(svg);

        var defs = el('defs');
        addArrow(defs, 'p6_arrowRed', '#FF6B6B');
        addArrow(defs, 'p6_arrowTeal', '#4ECDC4');
        svg.appendChild(defs);

        var cx = 180, cy = 130, r = 85;

        // Trajectoire circulaire
        svg.appendChild(el('circle', { cx: cx, cy: cy, r: r, fill: 'none', stroke: '#4ECDC4', 'stroke-width': 1.4, opacity: 0.45 }));

        // Axe (Δ) au centre, perpendiculaire à la page
        svg.appendChild(el('circle', { cx: cx, cy: cy, r: 3.4, fill: 'none', stroke: '#E8E8E8', 'stroke-width': 1.2 }));
        svg.appendChild(el('circle', { cx: cx, cy: cy, r: 1.1, fill: '#E8E8E8' }));
        svg.appendChild(txt(cx + 8, cy - 8, 'O (Δ)', { 'font-size': 11, fill: '#E8E8E8', 'font-weight': '700' }));

        var M0 = polar(cx, cy, r, 0);
        var M = polar(cx, cy, r, 60);

        // Arc s (épais)
        svg.appendChild(el('path', { d: arcPath(cx, cy, r, 0, 60), fill: 'none', stroke: '#4ECDC4', 'stroke-width': 4.5, 'stroke-linecap': 'round' }));
        var sLbl = polar(cx, cy, r + 15, 30);
        svg.appendChild(txt(sLbl.x - 4, sLbl.y, 's', { 'font-size': 13, fill: '#4ECDC4', 'font-style': 'italic', 'font-weight': '700' }));

        // Rayon r pointillé
        svg.appendChild(el('line', { x1: cx, y1: cy, x2: M.x, y2: M.y, stroke: '#B8860B', 'stroke-width': 1.2, 'stroke-dasharray': '3,3' }));
        var midR = { x: (cx + M.x) / 2, y: (cy + M.y) / 2 };
        svg.appendChild(txt(midR.x + 8, midR.y - 2, 'r', { 'font-size': 12, fill: '#F4D03F', 'font-style': 'italic', 'font-weight': '700' }));

        // Vecteurs OM0 et OM
        svg.appendChild(el('line', { x1: cx, y1: cy, x2: M0.x - 8, y2: M0.y, stroke: '#FF6B6B', 'stroke-width': 1.6, 'marker-end': 'url(#p6_arrowRed)' }));
        svg.appendChild(el('line', { x1: cx, y1: cy, x2: M.x - 4, y2: M.y - 7, stroke: '#FF6B6B', 'stroke-width': 1.6, 'marker-end': 'url(#p6_arrowRed)' }));

        // Angle theta
        svg.appendChild(el('path', { d: arcPath(cx, cy, 28, 0, 60), fill: 'none', stroke: '#FF6B6B', 'stroke-width': 1.4 }));
        var tLbl = polar(cx, cy, 38, 30);
        svg.appendChild(txt(tLbl.x - 4, tLbl.y - 2, 'θ', { 'font-size': 13, fill: '#FF6B6B', 'font-weight': '700' }));

        // Points M0, M
        svg.appendChild(el('circle', { cx: M0.x, cy: M0.y, r: 4, fill: '#E8E8E8' }));
        svg.appendChild(txt(M0.x + 8, M0.y + 4, 'M₀', { 'font-size': 12, fill: '#E8E8E8', 'font-weight': '700' }));
        svg.appendChild(el('circle', { cx: M.x, cy: M.y, r: 4.5, fill: '#4ECDC4' }));
        svg.appendChild(txt(M.x + 6, M.y - 8, 'M', { 'font-size': 13, fill: '#4ECDC4', 'font-weight': '700' }));

        // Bandeau recapitulatif
        svg.appendChild(txt(20, 232, 'θ (rad) = angle  |  s (m) = arc  |  s = r · θ', { 'font-size': 10, fill: '#B8860B', 'font-weight': '700' }));
        svg.appendChild(txt(20, 248, 'Points hors de (Δ) : trajectoire circulaire — points sur (Δ) : immobiles', { 'font-size': 8.6, fill: '#9aa0a6' }));
    }

    function init() {
        drawGraphResume();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

