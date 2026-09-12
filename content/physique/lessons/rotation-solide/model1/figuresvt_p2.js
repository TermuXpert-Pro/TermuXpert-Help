/* ============================================================
   figuresvt_p2.js — Partie 2 : Abscisse angulaire - Abscisse curviligne
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
       Figure 1 : graphAngulaire
       θ = (OM0, OM) : met l'accent sur l'ANGLE entre les deux vecteurs,
       avec le sens direct / indirect illustré.
       ------------------------------------------------------------ */
    function drawGraphAngulaire() {
        var svg = document.getElementById('graphAngulaire');
        if (!svg) return;
        clearSvg(svg);

        var defs = el('defs');
        addArrow(defs, 'p2a_arrowRed', '#FF6B6B');
        addArrow(defs, 'p2a_arrowGray', '#9aa0a6');
        svg.appendChild(defs);

        var cx = 175, cy = 145, r = 88;

        svg.appendChild(el('circle', { cx: cx, cy: cy, r: r, fill: 'none', stroke: '#4ECDC4', 'stroke-width': 1.4, opacity: 0.4, 'stroke-dasharray': '2,3' }));

        // O + axe
        svg.appendChild(el('circle', { cx: cx, cy: cy, r: 3, fill: '#E8E8E8' }));
        svg.appendChild(txt(cx - 10, cy + 16, 'O', { 'font-size': 12, fill: '#E8E8E8', 'font-weight': '700' }));

        var M0 = polar(cx, cy, r, 0);
        var M = polar(cx, cy, r, 72);

        // Vecteurs OM0 et OM (accent visuel : ce sont des vecteurs, pas juste des points)
        svg.appendChild(el('line', { x1: cx, y1: cy, x2: M0.x - 8, y2: M0.y, stroke: '#FF6B6B', 'stroke-width': 1.8, 'marker-end': 'url(#p2a_arrowRed)' }));
        svg.appendChild(el('line', { x1: cx, y1: cy, x2: M.x - 3, y2: M.y - 8, stroke: '#FF6B6B', 'stroke-width': 1.8, 'marker-end': 'url(#p2a_arrowRed)' }));

        svg.appendChild(el('circle', { cx: M0.x, cy: M0.y, r: 4, fill: '#E8E8E8' }));
        svg.appendChild(txt(M0.x + 6, M0.y + 5, 'M₀', { 'font-size': 12, fill: '#E8E8E8', 'font-weight': '700' }));
        svg.appendChild(el('circle', { cx: M.x, cy: M.y, r: 4.5, fill: '#FF6B6B' }));
        svg.appendChild(txt(M.x + 6, M.y - 8, 'M', { 'font-size': 13, fill: '#FF6B6B', 'font-weight': '700' }));

        // Angle theta — double arc pour bien le distinguer, rempli légèrement
        var sector = 'M ' + cx + ',' + cy + ' L ' + polar(cx, cy, 34, 0).x.toFixed(2) + ',' + polar(cx, cy, 34, 0).y.toFixed(2) +
            ' ' + arcPath(cx, cy, 34, 0, 72).slice(1) + ' Z';
        svg.appendChild(el('path', { d: sector, fill: '#F4D03F', 'fill-opacity': 0.18, stroke: 'none' }));
        svg.appendChild(el('path', { d: arcPath(cx, cy, 34, 0, 72), fill: 'none', stroke: '#F4D03F', 'stroke-width': 1.6 }));
        var tLbl = polar(cx, cy, 46, 36);
        svg.appendChild(txt(tLbl.x - 5, tLbl.y - 2, 'θ', { 'font-size': 15, fill: '#F4D03F', 'font-weight': '700' }));

        // Sens direct (trigonométrique) indiqué par une flèche courbe à l'extérieur
        var senseArc = arcPath(cx, cy, r + 16, 90, 150);
        svg.appendChild(el('path', { d: senseArc, fill: 'none', stroke: '#9aa0a6', 'stroke-width': 1.3, 'marker-end': 'url(#p2a_arrowGray)' }));
        svg.appendChild(txt(cx - 60, cy - r - 8, 'sens direct (+)', { 'font-size': 9, fill: '#9aa0a6' }));

        svg.appendChild(txt(20, 244, 'θ = (OM₀, OM) : angle orienté, positif si M tourne dans le sens direct', { 'font-size': 9, fill: '#B8860B' }));
    }

    /* ------------------------------------------------------------
       Figure 2 : graphCurviligne
       s = arc M0M : met l'accent sur la LONGUEUR D'ARC parcourue,
       sans insister sur les vecteurs (déjà vus dans la figure précédente).
       ------------------------------------------------------------ */
    function drawGraphCurviligne() {
        var svg = document.getElementById('graphCurviligne');
        if (!svg) return;
        clearSvg(svg);

        var defs = el('defs');
        addArrow(defs, 'p2c_arrowTeal', '#4ECDC4');
        addArrow(defs, 'p2c_arrowGray', '#9aa0a6');
        svg.appendChild(defs);

        var cx = 175, cy = 145, r = 88;

        svg.appendChild(el('circle', { cx: cx, cy: cy, r: r, fill: 'none', stroke: '#4ECDC4', 'stroke-width': 1.2, opacity: 0.30 }));
        svg.appendChild(el('circle', { cx: cx, cy: cy, r: 3, fill: '#E8E8E8' }));
        svg.appendChild(txt(cx - 10, cy + 16, 'O', { 'font-size': 12, fill: '#E8E8E8', 'font-weight': '700' }));

        var M0 = polar(cx, cy, r, 0);
        var M = polar(cx, cy, r, 100);

        // Arc épais représentant s, avec petites flèches le long pour indiquer un "chemin parcouru"
        svg.appendChild(el('path', { d: arcPath(cx, cy, r, 0, 100), fill: 'none', stroke: '#4ECDC4', 'stroke-width': 5, 'stroke-linecap': 'round', 'marker-end': 'url(#p2c_arrowTeal)' }));

        // Rayon pointillé pour rappeler r (utile pour la relation s = r*theta vue ensuite)
        svg.appendChild(el('line', { x1: cx, y1: cy, x2: M0.x, y2: M0.y, stroke: '#B8860B', 'stroke-width': 1, 'stroke-dasharray': '3,3', opacity: 0.7 }));
        svg.appendChild(el('line', { x1: cx, y1: cy, x2: M.x, y2: M.y, stroke: '#B8860B', 'stroke-width': 1, 'stroke-dasharray': '3,3', opacity: 0.7 }));

        svg.appendChild(el('circle', { cx: M0.x, cy: M0.y, r: 4, fill: '#E8E8E8' }));
        svg.appendChild(txt(M0.x + 6, M0.y + 14, 'M₀', { 'font-size': 12, fill: '#E8E8E8', 'font-weight': '700' }));
        svg.appendChild(el('circle', { cx: M.x, cy: M.y, r: 4.5, fill: '#4ECDC4' }));
        svg.appendChild(txt(M.x - 20, M.y - 8, 'M', { 'font-size': 13, fill: '#4ECDC4', 'font-weight': '700' }));

        // Label s au milieu de l'arc, décalé vers l'extérieur
        var mid = polar(cx, cy, r + 16, 50);
        svg.appendChild(txt(mid.x - 4, mid.y, 's', { 'font-size': 15, fill: '#4ECDC4', 'font-style': 'italic', 'font-weight': '700' }));

        // Sens positif
        var senseArc = arcPath(cx, cy, r + 26, 110, 150);
        svg.appendChild(el('path', { d: senseArc, fill: 'none', stroke: '#9aa0a6', 'stroke-width': 1.2, 'marker-end': 'url(#p2c_arrowGray)' }));
        svg.appendChild(txt(cx - 70, cy - r - 20, 'sens positif', { 'font-size': 9, fill: '#9aa0a6' }));

        svg.appendChild(txt(20, 244, 's = arc M₀M : longueur parcourue le long de la trajectoire (en m)', { 'font-size': 9, fill: '#B8860B' }));
    }

    function init() {
        drawGraphAngulaire();
        drawGraphCurviligne();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
