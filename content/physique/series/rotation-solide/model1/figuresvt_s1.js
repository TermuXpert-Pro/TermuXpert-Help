/* ============================================================
   figuresvt_s1.js — Série 1 : Rotation d'un solide indéformable
   Fichier autonome (aucune dépendance externe / aucun import partagé).
   Couvre : Exercice 1, Exercice 2, Exercice 4, Exercice 5, Exercice 6.
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

    // Arc path (SVG) entre deux angles (deg), sens trigonométrique = angle croissant
    function arcPath(cx, cy, r, deg1, deg2) {
        var p1 = polar(cx, cy, r, deg1);
        var p2 = polar(cx, cy, r, deg2);
        var diff = deg2 - deg1;
        var large = Math.abs(diff) > 180 ? 1 : 0;
        var sweep = diff > 0 ? 0 : 1; // écran : y inversé
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

    function clearSvg(svg, viewBox) {
        while (svg.firstChild) svg.removeChild(svg.firstChild);
        svg.setAttribute('viewBox', viewBox);
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    }

    /* ------------------------------------------------------------
       Exercice 1 : svgEx1Roche
       Roche au bout d'une corde de R = 1,00 m, mouvement circulaire
       uniforme, 10,0 tours effectués -> d = 62,8 m.
       ------------------------------------------------------------ */
    function drawSvgEx1() {
        var svg = document.getElementById('svgEx1Roche');
        if (!svg) return;
        clearSvg(svg, '0 0 320 220');

        var defs = el('defs');
        addArrow(defs, 's1e1_arrowTeal', '#4ECDC4');
        addArrow(defs, 's1e1_arrowGold', '#F4D03F');
        svg.appendChild(defs);

        var cx = 118, cy = 112, r = 78;

        // Trajectoire circulaire (pointillée) de la roche
        svg.appendChild(el('circle', { cx: cx, cy: cy, r: r, fill: 'none', stroke: '#4ECDC4', 'stroke-width': 1.6, 'stroke-dasharray': '4,4', opacity: 0.75 }));

        // Axe de rotation (perpendiculaire à la page) : icône au centre O
        svg.appendChild(el('circle', { cx: cx, cy: cy, r: 3.4, fill: 'none', stroke: '#E8E8E8', 'stroke-width': 1.2 }));
        svg.appendChild(el('circle', { cx: cx, cy: cy, r: 1.2, fill: '#E8E8E8' }));
        svg.appendChild(txt(cx - 8, cy + 18, 'O', { 'font-size': 12, fill: '#E8E8E8', 'font-weight': '700' }));

        // Corde : segment O -> M
        var M = polar(cx, cy, r, 40);
        svg.appendChild(el('line', { x1: cx, y1: cy, x2: M.x, y2: M.y, stroke: '#F4D03F', 'stroke-width': 1.6 }));

        // Étiquette R le long de la corde
        var midR = { x: (cx + M.x) / 2, y: (cy + M.y) / 2 };
        svg.appendChild(txt(midR.x + 6, midR.y - 8, 'R = 1,00 m', { 'font-size': 11, fill: '#F4D03F', 'font-weight': '700' }));

        // Roche (masse) au bout de la corde
        svg.appendChild(el('circle', { cx: M.x, cy: M.y, r: 7, fill: '#B8860B', stroke: '#F4D03F', 'stroke-width': 1.2 }));
        svg.appendChild(txt(M.x + 12, M.y + 4, 'M (roche)', { 'font-size': 11, fill: '#E8E8E8', 'font-weight': '700' }));

        // Flèche de sens de rotation, avec mention du nombre de tours
        var rotArc = arcPath(cx, cy, r + 16, -30, 60);
        svg.appendChild(el('path', { d: rotArc, fill: 'none', stroke: '#4ECDC4', 'stroke-width': 1.6, 'marker-end': 'url(#s1e1_arrowTeal)' }));
        svg.appendChild(txt(cx + r - 4, cy - r - 6, 'n = 10,0 tours', { 'font-size': 10.5, fill: '#4ECDC4', 'font-weight': '700', 'text-anchor': 'middle' }));

        // Distance totale parcourue
        svg.appendChild(txt(cx, 206, 'd = n × 2πR = 62,8 m', { 'font-size': 11.5, fill: '#A8FF78', 'font-weight': '700', 'text-anchor': 'middle' }));
    }

    /* ------------------------------------------------------------
       Exercice 2 : svgEx2PointP
       Point P sur une roue, distance R (à déterminer) ; en 1,0 tour
       le point P parcourt d = 3,0 m.
       ------------------------------------------------------------ */
    function drawSvgEx2() {
        var svg = document.getElementById('svgEx2PointP');
        if (!svg) return;
        clearSvg(svg, '0 0 320 220');

        var defs = el('defs');
        addArrow(defs, 's1e2_arrowGold', '#F4D03F');
        svg.appendChild(defs);

        var cx = 130, cy = 112, r = 76;

        // Roue : contour du cercle décrit par P
        svg.appendChild(el('circle', { cx: cx, cy: cy, r: r, fill: 'none', stroke: '#4ECDC4', 'stroke-width': 1.4, opacity: 0.5 }));

        // Arc complet mis en évidence (1 tour = circonférence entière)
        svg.appendChild(el('circle', { cx: cx, cy: cy, r: r, fill: 'none', stroke: '#4ECDC4', 'stroke-width': 3.4, 'stroke-linecap': 'round', opacity: 0.9 }));

        // Centre O
        svg.appendChild(el('circle', { cx: cx, cy: cy, r: 3.2, fill: 'none', stroke: '#E8E8E8', 'stroke-width': 1.2 }));
        svg.appendChild(el('circle', { cx: cx, cy: cy, r: 1.1, fill: '#E8E8E8' }));
        svg.appendChild(txt(cx - 8, cy + 18, 'O', { 'font-size': 12, fill: '#E8E8E8', 'font-weight': '700' }));

        // Point P (origine = fin du tour, même position)
        var P = polar(cx, cy, r, 15);
        svg.appendChild(el('line', { x1: cx, y1: cy, x2: P.x, y2: P.y, stroke: '#F4D03F', 'stroke-width': 1.4, 'stroke-dasharray': '3,3' }));
        var midR = { x: (cx + P.x) / 2, y: (cy + P.y) / 2 };
        svg.appendChild(txt(midR.x + 4, midR.y - 6, 'R = ?', { 'font-size': 11, fill: '#F4D03F', 'font-weight': '700' }));

        svg.appendChild(el('circle', { cx: P.x, cy: P.y, r: 5, fill: '#F4D03F' }));
        svg.appendChild(txt(P.x + 10, P.y - 2, 'P', { 'font-size': 13, fill: '#F4D03F', 'font-weight': '700' }));

        // Flèche indiquant le sens de parcours sur la circonférence
        var senseArc = arcPath(cx, cy, r + 15, 30, 90);
        svg.appendChild(el('path', { d: senseArc, fill: 'none', stroke: '#9aa0a6', 'stroke-width': 1.4, 'marker-end': 'url(#s1e2_arrowGold)' }));
        svg.appendChild(txt(cx, 18, '1,0 tour complet', { 'font-size': 11, fill: '#9aa0a6', 'text-anchor': 'middle' }));

        // Distance parcourue en un tour
        svg.appendChild(txt(cx, 206, 'd = 2πR = 3,0 m', { 'font-size': 11.5, fill: '#A8FF78', 'font-weight': '700', 'text-anchor': 'middle' }));
    }

    /* ------------------------------------------------------------
       Exercice 4 : svgEx4VitesseR
       Graphe v = R·ω (ω = 22,5 rad/s), avec les deux points calculés :
       (R = 0,02 m ; v = 0,45 m/s) et (R = 0,06 m ; v = 1,35 m/s).
       ------------------------------------------------------------ */
    function drawSvgEx4() {
        var svg = document.getElementById('svgEx4VitesseR');
        if (!svg) return;
        clearSvg(svg, '0 0 350 220');

        var defs = el('defs');
        addArrow(defs, 's1e4_arrowAxis', '#9aa0a6');
        svg.appendChild(defs);

        var ox = 55, oy = 190;
        var Rmax = 0.08, Vmax = 1.8;
        var pxW = 265, pxH = 165; // largeur / hauteur du repère
        var scaleX = pxW / Rmax;
        var scaleY = pxH / Vmax;

        function toPx(R, v) {
            return { x: ox + R * scaleX, y: oy - v * scaleY };
        }

        // Grille légère
        for (var gr = 0.02; gr < Rmax; gr += 0.02) {
            var gx = ox + gr * scaleX;
            svg.appendChild(el('line', { x1: gx, y1: 25, x2: gx, y2: oy, stroke: '#2A2A3E', 'stroke-width': 1 }));
        }
        for (var gv = 0.3; gv < Vmax; gv += 0.3) {
            var gy = oy - gv * scaleY;
            svg.appendChild(el('line', { x1: ox, y1: gy, x2: ox + pxW, y2: gy, stroke: '#2A2A3E', 'stroke-width': 1 }));
        }

        // Axes
        svg.appendChild(el('line', { x1: ox, y1: oy, x2: ox + pxW + 12, y2: oy, stroke: '#9aa0a6', 'stroke-width': 1.5, 'marker-end': 'url(#s1e4_arrowAxis)' }));
        svg.appendChild(el('line', { x1: ox, y1: oy, x2: ox, y2: 18, stroke: '#9aa0a6', 'stroke-width': 1.5, 'marker-end': 'url(#s1e4_arrowAxis)' }));
        svg.appendChild(txt(ox + pxW + 6, oy + 16, 'R (m)', { 'font-size': 11, fill: '#9aa0a6' }));
        svg.appendChild(txt(ox - 32, 22, 'v (m/s)', { 'font-size': 11, fill: '#9aa0a6' }));

        // Droite v = R·ω
        var pStart = toPx(0, 0), pEnd = toPx(Rmax - 0.005, (Rmax - 0.005) * 22.5);
        svg.appendChild(el('line', { x1: pStart.x, y1: pStart.y, x2: pEnd.x, y2: pEnd.y, stroke: '#A8FF78', 'stroke-width': 2.4 }));
        svg.appendChild(txt(pEnd.x - 55, pEnd.y - 8, 'v = R·ω', { 'font-size': 11.5, fill: '#A8FF78', 'font-weight': '700' }));
        svg.appendChild(txt(pEnd.x - 55, pEnd.y + 8, 'ω = 22,5 rad/s', { 'font-size': 9.5, fill: '#888888' }));

        // Points calculés
        var points = [
            { R: 0.02, v: 0.45, label: "R' = 2 cm → v' = 0,45 m/s", dy: -12 },
            { R: 0.06, v: 1.35, label: 'R = 6 cm (bord) → v = 1,35 m/s', dy: -12 }
        ];
        points.forEach(function (pt) {
            var p = toPx(pt.R, pt.v);
            svg.appendChild(el('line', { x1: p.x, y1: p.y, x2: p.x, y2: oy, stroke: '#4ECDC4', 'stroke-width': 1, 'stroke-dasharray': '2,2' }));
            svg.appendChild(el('line', { x1: ox, y1: p.y, x2: p.x, y2: p.y, stroke: '#4ECDC4', 'stroke-width': 1, 'stroke-dasharray': '2,2' }));
            svg.appendChild(el('circle', { cx: p.x, cy: p.y, r: 4.5, fill: '#4ECDC4' }));
        });
        // Étiquettes décalées pour lisibilité (l'une au-dessus, l'autre en dessous de la droite)
        var p1 = toPx(points[0].R, points[0].v);
        var p2 = toPx(points[1].R, points[1].v);
        svg.appendChild(txt(p1.x - 30, p1.y + 18, points[0].label, { 'font-size': 8.5, fill: '#E8E8E8' }));
        svg.appendChild(txt(Math.min(p2.x - 5, 200), p2.y - 10, points[1].label, { 'font-size': 8.5, fill: '#E8E8E8' }));
    }

    /* ------------------------------------------------------------
       Exercice 5 : svgEx5Scie
       Scie circulaire, D = 50 cm (R = 25 cm), une dent en périphérie
       à vitesse linéaire v = 36 m/s.
       ------------------------------------------------------------ */
    function drawSvgEx5() {
        var svg = document.getElementById('svgEx5Scie');
        if (!svg) return;
        clearSvg(svg, '0 0 320 220');

        var defs = el('defs');
        addArrow(defs, 's1e5_arrowGold', '#F4D03F');
        addArrow(defs, 's1e5_arrowTeal', '#4ECDC4');
        svg.appendChild(defs);

        var cx = 140, cy = 112, r = 66;

        // Dents de la scie (petits triangles autour de la circonférence)
        var nDents = 20;
        for (var i = 0; i < nDents; i++) {
            var a1 = (360 / nDents) * i;
            var pBase1 = polar(cx, cy, r, a1 - 4);
            var pBase2 = polar(cx, cy, r, a1 + 4);
            var pTip = polar(cx, cy, r + 9, a1);
            var d = 'M ' + pBase1.x.toFixed(1) + ',' + pBase1.y.toFixed(1) +
                ' L ' + pTip.x.toFixed(1) + ',' + pTip.y.toFixed(1) +
                ' L ' + pBase2.x.toFixed(1) + ',' + pBase2.y.toFixed(1) + ' Z';
            svg.appendChild(el('path', { d: d, fill: '#4ECDC4', opacity: 0.35 }));
        }

        // Disque de la scie
        svg.appendChild(el('circle', { cx: cx, cy: cy, r: r, fill: 'none', stroke: '#4ECDC4', 'stroke-width': 1.8 }));

        // Axe au centre
        svg.appendChild(el('circle', { cx: cx, cy: cy, r: 3.4, fill: 'none', stroke: '#E8E8E8', 'stroke-width': 1.2 }));
        svg.appendChild(el('circle', { cx: cx, cy: cy, r: 1.2, fill: '#E8E8E8' }));

        // Rayon R
        var Rp = polar(cx, cy, r, -55);
        svg.appendChild(el('line', { x1: cx, y1: cy, x2: Rp.x, y2: Rp.y, stroke: '#F4D03F', 'stroke-width': 1.3, 'stroke-dasharray': '3,3' }));
        svg.appendChild(txt((cx + Rp.x) / 2 + 8, (cy + Rp.y) / 2, 'R = 25 cm', { 'font-size': 10.5, fill: '#F4D03F', 'font-weight': '700' }));

        // Sens de rotation
        var rotArc = arcPath(cx, cy, r + 20, 95, 165);
        svg.appendChild(el('path', { d: rotArc, fill: 'none', stroke: '#E8E8E8', 'stroke-width': 1.5, 'marker-end': 'url(#s1e5_arrowTeal)' }));
        svg.appendChild(txt(cx - r - 4, cy - r - 8, 'ω', { 'font-size': 13, fill: '#E8E8E8', 'font-style': 'italic', 'font-weight': '700' }));

        // Dent mise en évidence + vecteur vitesse tangentielle
        var dentAngle = 0;
        var dentPos = polar(cx, cy, r, dentAngle);
        svg.appendChild(el('circle', { cx: dentPos.x, cy: dentPos.y, r: 5, fill: '#FF6B6B' }));
        // Tangente au point (rotation trigonométrique -> vecteur vertical vers le haut)
        var vEnd = { x: dentPos.x, y: dentPos.y - 46 };
        svg.appendChild(el('line', { x1: dentPos.x, y1: dentPos.y, x2: vEnd.x, y2: vEnd.y - 6, stroke: '#F4D03F', 'stroke-width': 2, 'marker-end': 'url(#s1e5_arrowGold)' }));
        svg.appendChild(txt(vEnd.x + 8, vEnd.y - 20, 'v = 36 m/s', { 'font-size': 11.5, fill: '#F4D03F', 'font-weight': '700' }));
        svg.appendChild(txt(dentPos.x + 10, dentPos.y + 14, 'dent', { 'font-size': 9.5, fill: '#FF6B6B' }));

        svg.appendChild(txt(cx, 206, 'D = 50 cm', { 'font-size': 11, fill: '#888888', 'text-anchor': 'middle' }));
    }

    /* ------------------------------------------------------------
       Exercice 6 : svgEx6Tracteur
       Tracteur (jouet) : grande roue Rg = 7 cm (18 tr/min) et petite
       roue Rp = 3,5 cm (36 tr/min). Même vitesse linéaire au sol.
       ------------------------------------------------------------ */
    function drawSvgEx6() {
        var svg = document.getElementById('svgEx6Tracteur');
        if (!svg) return;
        clearSvg(svg, '0 0 400 240');

        var defs = el('defs');
        addArrow(defs, 's1e6_arrowGold', '#F4D03F');
        addArrow(defs, 's1e6_arrowTeal', '#4ECDC4');
        addArrow(defs, 's1e6_arrowRed', '#FF6B6B');
        svg.appendChild(defs);

        var groundY = 195;
        svg.appendChild(el('line', { x1: 10, y1: groundY, x2: 390, y2: groundY, stroke: '#3a3a4e', 'stroke-width': 2 }));

        var Rg = 55, Rp = 27; // rayons à l'écran (ratio 2:1, conforme à 7 cm / 3,5 cm)
        var cxG = 295, cyG = groundY - Rg;
        var cxP = 115, cyP = groundY - Rp;

        // Barre d'essieu reliant simplement les deux centres (sans forme de carrosserie)
        svg.appendChild(el('line', { x1: cxP, y1: cyP, x2: cxG, y2: cyG, stroke: '#E8E8E8', 'stroke-width': 2, opacity: 0.35 }));

        // ---- Grande roue ----
        svg.appendChild(el('circle', { cx: cxG, cy: cyG, r: Rg, fill: 'none', stroke: '#4ECDC4', 'stroke-width': 2 }));
        svg.appendChild(el('circle', { cx: cxG, cy: cyG, r: 2.4, fill: '#4ECDC4' }));
        var Rg_end = polar(cxG, cyG, Rg, 210);
        svg.appendChild(el('line', { x1: cxG, y1: cyG, x2: Rg_end.x, y2: Rg_end.y, stroke: '#4ECDC4', 'stroke-width': 1.1, 'stroke-dasharray': '3,3' }));
        svg.appendChild(txt(cxG, cyG - Rg - 32, 'Grande roue', { 'font-size': 11, fill: '#4ECDC4', 'font-weight': '700', 'text-anchor': 'middle' }));
        svg.appendChild(txt(cxG, cyG - Rg - 18, 'Rg = 7 cm  •  18 tr/min', { 'font-size': 9, fill: '#888888', 'text-anchor': 'middle' }));
        // Sens de rotation (arc à droite du sommet, hors zone du texte)
        var rotG = arcPath(cxG, cyG, Rg + 13, 20, 65);
        svg.appendChild(el('path', { d: rotG, fill: 'none', stroke: '#4ECDC4', 'stroke-width': 1.4, 'marker-end': 'url(#s1e6_arrowTeal)' }));
        svg.appendChild(txt(393, cyG - 8, 'ωg = 1,88 rad/s', { 'font-size': 8.5, fill: '#4ECDC4', 'text-anchor': 'end' }));
        // Pierre fixée sur la jante (grande roue) — en bas à droite, zone libre
        var pierreG = polar(cxG, cyG, Rg, 320);
        svg.appendChild(el('circle', { cx: pierreG.x, cy: pierreG.y, r: 4, fill: '#BB8FCE' }));
        svg.appendChild(txt(pierreG.x + 6, pierreG.y + 12, 'pierre', { 'font-size': 8.5, fill: '#BB8FCE' }));

        // ---- Petite roue ----
        svg.appendChild(el('circle', { cx: cxP, cy: cyP, r: Rp, fill: 'none', stroke: '#FF6B6B', 'stroke-width': 2 }));
        svg.appendChild(el('circle', { cx: cxP, cy: cyP, r: 2, fill: '#FF6B6B' }));
        var Rp_end = polar(cxP, cyP, Rp, 210);
        svg.appendChild(el('line', { x1: cxP, y1: cyP, x2: Rp_end.x, y2: Rp_end.y, stroke: '#FF6B6B', 'stroke-width': 1.1, 'stroke-dasharray': '3,3' }));
        svg.appendChild(txt(cxP, cyP - Rp - 32, 'Petite roue', { 'font-size': 11, fill: '#FF6B6B', 'font-weight': '700', 'text-anchor': 'middle' }));
        svg.appendChild(txt(cxP, cyP - Rp - 18, 'Rp = 3,5 cm  •  36 tr/min', { 'font-size': 9, fill: '#888888', 'text-anchor': 'middle' }));
        // Sens de rotation (arc à gauche du sommet, hors zone du texte)
        var rotP = arcPath(cxP, cyP, Rp + 13, 115, 160);
        svg.appendChild(el('path', { d: rotP, fill: 'none', stroke: '#FF6B6B', 'stroke-width': 1.4, 'marker-end': 'url(#s1e6_arrowRed)' }));
        svg.appendChild(txt(cxP - Rp - 16, cyP - 8, 'ωp = 3,77 rad/s', { 'font-size': 8.5, fill: '#FF6B6B', 'text-anchor': 'end' }));
        // Pierre fixée sur la jante (petite roue) — en bas à droite, zone libre
        var pierreP = polar(cxP, cyP, Rp, 320);
        svg.appendChild(el('circle', { cx: pierreP.x, cy: pierreP.y, r: 3.4, fill: '#BB8FCE' }));
        svg.appendChild(txt(pierreP.x + 6, pierreP.y + 12, 'pierre', { 'font-size': 8.5, fill: '#BB8FCE' }));

        // Vecteurs vitesse au sol (mêmes longueur et sens : v identique pour les deux roues)
        var vLen = 42;
        svg.appendChild(el('line', { x1: cxP - 14, y1: groundY + 14, x2: cxP - 14 + vLen, y2: groundY + 14, stroke: '#F4D03F', 'stroke-width': 2, 'marker-end': 'url(#s1e6_arrowGold)' }));
        svg.appendChild(el('line', { x1: cxG - 14, y1: groundY + 14, x2: cxG - 14 + vLen, y2: groundY + 14, stroke: '#F4D03F', 'stroke-width': 2, 'marker-end': 'url(#s1e6_arrowGold)' }));
        svg.appendChild(txt((cxP + cxG) / 2, groundY + 30, 'vg = vp = 0,132 m/s (même vitesse au sol)', { 'font-size': 10, fill: '#F4D03F', 'font-weight': '700', 'text-anchor': 'middle' }));
    }

    function init() {
        drawSvgEx1();
        drawSvgEx2();
        drawSvgEx4();
        drawSvgEx5();
        drawSvgEx6();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

