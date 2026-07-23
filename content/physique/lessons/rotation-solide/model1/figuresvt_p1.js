/* ============================================================
   figuresvt_p1.js — Partie 1 : Introduction - Exemple - Définition - Repérage
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

    // Arc path (SVG) between two angles (deg), counterclockwise = increasing angle
    function arcPath(cx, cy, r, deg1, deg2) {
        var p1 = polar(cx, cy, r, deg1);
        var p2 = polar(cx, cy, r, deg2);
        var diff = deg2 - deg1;
        var large = Math.abs(diff) > 180 ? 1 : 0;
        var sweep = diff > 0 ? 0 : 1; // svg sweep flag (screen y is flipped)
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
       Figure 1 : graphRotation
       Solide (S) en rotation autour d'un axe fixe (Δ), perpendiculaire
       à la page. A et B décrivent des cercles ; M et N (sur l'axe)
       sont immobiles.
       ------------------------------------------------------------ */
    function drawGraphRotation() {
        var svg = document.getElementById('graphRotation');
        if (!svg) return;
        clearSvg(svg);

        var defs = el('defs');
        addArrow(defs, 'p1r_arrowRed', '#FF6B6B');
        addArrow(defs, 'p1r_arrowGold', '#F4D03F');
        addArrow(defs, 'p1r_arrowTeal', '#4ECDC4');
        svg.appendChild(defs);

        var cx = 160, cy = 128;

        // Trajectoires circulaires (pointillés) de A et B
        svg.appendChild(el('circle', { cx: cx, cy: cy, r: 92, fill: 'none', stroke: '#FF6B6B', 'stroke-width': 1.4, 'stroke-dasharray': '4,4', opacity: 0.75 }));
        svg.appendChild(el('circle', { cx: cx, cy: cy, r: 52, fill: 'none', stroke: '#F4D03F', 'stroke-width': 1.4, 'stroke-dasharray': '4,4', opacity: 0.75 }));

        // Solide (S) : forme irrégulière (pas un simple disque)
        var bx = cx, by = cy;
        var blob = 'M ' + (bx - 66) + ',' + (by - 18) +
            ' C ' + (bx - 70) + ',' + (by - 50) + ' ' + (bx - 28) + ',' + (by - 66) + ' ' + (bx + 8) + ',' + (by - 58) +
            ' C ' + (bx + 50) + ',' + (by - 48) + ' ' + (bx + 68) + ',' + (by - 14) + ' ' + (bx + 62) + ',' + (by + 22) +
            ' C ' + (bx + 56) + ',' + (by + 54) + ' ' + (bx + 14) + ',' + (by + 66) + ' ' + (bx - 22) + ',' + (by + 60) +
            ' C ' + (bx - 54) + ',' + (by + 54) + ' ' + (bx - 60) + ',' + (by + 14) + ' ' + (bx - 66) + ',' + (by - 18) + ' Z';
        svg.appendChild(el('path', { d: blob, fill: '#4ECDC4', 'fill-opacity': 0.10, stroke: '#4ECDC4', 'stroke-width': 1.6 }));

        // Axe (Δ) perpendiculaire à la page : icône au centre
        svg.appendChild(el('circle', { cx: cx, cy: cy, r: 3.6, fill: 'none', stroke: '#E8E8E8', 'stroke-width': 1.3 }));
        svg.appendChild(el('circle', { cx: cx, cy: cy, r: 1.2, fill: '#E8E8E8' }));

        // Points M et N sur l'axe (immobiles) — décalés légèrement pour lisibilité
        var M = { x: cx - 3, y: cy - 24 };
        var N = { x: cx + 3, y: cy + 24 };
        svg.appendChild(el('line', { x1: M.x, y1: M.y, x2: cx, y2: cy - 4, stroke: '#B8860B', 'stroke-width': 1 }));
        svg.appendChild(el('line', { x1: N.x, y1: N.y, x2: cx, y2: cy + 4, stroke: '#B8860B', 'stroke-width': 1 }));
        svg.appendChild(el('circle', { cx: M.x, cy: M.y, r: 2.6, fill: '#B8860B' }));
        svg.appendChild(el('circle', { cx: N.x, cy: N.y, r: 2.6, fill: '#B8860B' }));
        svg.appendChild(txt(M.x - 14, M.y - 4, 'M', { 'font-size': 12, fill: '#F4D03F', 'font-weight': '700' }));
        svg.appendChild(txt(N.x + 6, N.y + 12, 'N', { 'font-size': 12, fill: '#F4D03F', 'font-weight': '700' }));

        // Point A sur le grand cercle
        var A = polar(cx, cy, 92, 35);
        svg.appendChild(el('circle', { cx: A.x, cy: A.y, r: 4, fill: '#FF6B6B' }));
        svg.appendChild(txt(A.x + 8, A.y - 4, 'A', { 'font-size': 13, fill: '#FF6B6B', 'font-weight': '700' }));

        // Point B sur le petit cercle
        var B = polar(cx, cy, 52, 205);
        svg.appendChild(el('circle', { cx: B.x, cy: B.y, r: 4, fill: '#F4D03F' }));
        svg.appendChild(txt(B.x - 20, B.y + 14, 'B', { 'font-size': 13, fill: '#F4D03F', 'font-weight': '700' }));

        // Flèche de sens de rotation (petit arc fléché près du bord)
        var rotArc = arcPath(cx, cy, 92, 60, 110);
        var arrowPath = el('path', { d: rotArc, fill: 'none', stroke: '#E8E8E8', 'stroke-width': 1.6, 'marker-end': 'url(#p1r_arrowTeal)' });
        svg.appendChild(arrowPath);

        // Libellé axe (Δ)
        svg.appendChild(txt(cx + 10, cy - 8, '(Δ)', { 'font-size': 12, fill: '#E8E8E8', 'font-weight': '700' }));

        // Légende trajectoires
        svg.appendChild(txt(cx - 92, 22, 'Trajectoire de A', { 'font-size': 9.5, fill: '#FF6B6B' }));
        svg.appendChild(txt(cx - 92, 236, 'Trajectoire de B', { 'font-size': 9.5, fill: '#F4D03F' }));
        svg.appendChild(txt(cx - 24, 250, 'M, N : points de l\'axe (immobiles)', { 'font-size': 9, fill: '#B8860B' }));
    }

    /* ------------------------------------------------------------
       Figure 2 : graphReperage
       Repérage du point M sur sa trajectoire circulaire : θ (abscisse
       angulaire) et s (abscisse curviligne), à partir d'une origine M0.
       ------------------------------------------------------------ */
    function drawGraphReperage() {
        var svg = document.getElementById('graphReperage');
        if (!svg) return;
        clearSvg(svg);

        var defs = el('defs');
        addArrow(defs, 'p1p_arrowRed', '#FF6B6B');
        addArrow(defs, 'p1p_arrowGreen', '#4ECDC4');
        addArrow(defs, 'p1p_arrowGold', '#F4D03F');
        svg.appendChild(defs);

        var cx = 175, cy = 138, r = 90;

        // Cercle trajectoire
        svg.appendChild(el('circle', { cx: cx, cy: cy, r: r, fill: 'none', stroke: '#4ECDC4', 'stroke-width': 1.6, opacity: 0.55 }));

        // Axe (Δ) perpendiculaire à la page, au centre O
        svg.appendChild(el('circle', { cx: cx, cy: cy, r: 3.2, fill: 'none', stroke: '#E8E8E8', 'stroke-width': 1.2 }));
        svg.appendChild(el('circle', { cx: cx, cy: cy, r: 1.1, fill: '#E8E8E8' }));
        svg.appendChild(txt(cx + 8, cy - 8, 'O (Δ)', { 'font-size': 11, fill: '#E8E8E8', 'font-weight': '700' }));

        // Sens positif de parcours (petite flèche tangente près de M0)
        var senseArc = arcPath(cx, cy, r + 14, -6, 24);
        svg.appendChild(el('path', { d: senseArc, fill: 'none', stroke: '#9aa0a6', 'stroke-width': 1.3, 'marker-end': 'url(#p1p_arrowGold)' }));
        svg.appendChild(txt(cx + r + 4, cy + 26, 'sens +', { 'font-size': 9, fill: '#9aa0a6' }));

        // M0 (origine) à 0°, M (position actuelle) à 65°
        var M0 = polar(cx, cy, r, 0);
        var M = polar(cx, cy, r, 65);

        // Arc s (épais) de M0 à M
        svg.appendChild(el('path', { d: arcPath(cx, cy, r, 0, 65), fill: 'none', stroke: '#4ECDC4', 'stroke-width': 4, 'stroke-linecap': 'round' }));

        // Rayon r (pointillé) O -> M
        svg.appendChild(el('line', { x1: cx, y1: cy, x2: M.x, y2: M.y, stroke: '#B8860B', 'stroke-width': 1.2, 'stroke-dasharray': '3,3' }));
        var midR = { x: (cx + M.x) / 2, y: (cy + M.y) / 2 };
        svg.appendChild(txt(midR.x + 8, midR.y - 4, 'r', { 'font-size': 12, fill: '#F4D03F', 'font-style': 'italic', 'font-weight': '700' }));

        // Vecteurs OM0 et OM
        svg.appendChild(el('line', { x1: cx, y1: cy, x2: M0.x - 8, y2: M0.y, stroke: '#FF6B6B', 'stroke-width': 1.6, 'marker-end': 'url(#p1p_arrowRed)' }));
        svg.appendChild(el('line', { x1: cx, y1: cy, x2: M.x - 3, y2: M.y - 7, stroke: '#FF6B6B', 'stroke-width': 1.6, 'marker-end': 'url(#p1p_arrowRed)' }));

        // Angle theta (petit arc à proximité du centre)
        svg.appendChild(el('path', { d: arcPath(cx, cy, 26, 0, 65), fill: 'none', stroke: '#FF6B6B', 'stroke-width': 1.4 }));
        var thetaLbl = polar(cx, cy, 36, 32);
        svg.appendChild(txt(thetaLbl.x - 4, thetaLbl.y - 2, 'θ', { 'font-size': 13, fill: '#FF6B6B', 'font-weight': '700' }));

        // Points M0 et M
        svg.appendChild(el('circle', { cx: M0.x, cy: M0.y, r: 4, fill: '#E8E8E8' }));
        svg.appendChild(txt(M0.x + 8, M0.y + 4, 'M₀', { 'font-size': 12, fill: '#E8E8E8', 'font-weight': '700' }));
        svg.appendChild(el('circle', { cx: M.x, cy: M.y, r: 4.5, fill: '#4ECDC4' }));
        svg.appendChild(txt(M.x + 6, M.y - 8, 'M', { 'font-size': 13, fill: '#4ECDC4', 'font-weight': '700' }));

        // Label arc s
        var sLbl = polar(cx, cy, r + 14, 32);
        svg.appendChild(txt(sLbl.x - 4, sLbl.y, 's', { 'font-size': 12, fill: '#4ECDC4', 'font-style': 'italic', 'font-weight': '700' }));
    }

    function init() {
        drawGraphRotation();
        drawGraphReperage();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
