/* ============================================================
   figuresvt_ex2.js — Devoir Surveillé N°1 (Physique-Chimie)
   Exercice 2 : Travail du poids et d'une force sur un rail ABCD
   Fichier autonome (self-contained) : aucune dépendance à une
   librairie partagée (svg-utils.js).

   Figures dessinées :
     - fig2_rail       : vue d'ensemble du rail A-B-C-D
     - fig2_forcesAB   : bilan des forces sur le plan incliné AB
     - fig2_arc        : géométrie de l'arc BC (angle θ, point M)
     - fig2_forcesCD   : bilan des forces sur la partie horizontale CD
   ============================================================ */
(function () {
    'use strict';
    var NS = 'http://www.w3.org/2000/svg';

    function el(tag, attrs) {
        var e = document.createElementNS(NS, tag);
        for (var k in attrs) { if (attrs.hasOwnProperty(k)) e.setAttribute(k, attrs[k]); }
        return e;
    }
    function text(x, y, str, attrs) {
        var t = el('text', Object.assign({ x: x, y: y, 'font-family': "'Cairo','Segoe UI',sans-serif" }, attrs || {}));
        t.textContent = str;
        return t;
    }
    function setResponsive(svg, w, h) {
        svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        svg.removeAttribute('width');
        svg.removeAttribute('height');
        svg.style.width = '100%';
        svg.style.height = 'auto';
        svg.style.display = 'block';
    }
    function clear(svg) { while (svg.firstChild) svg.removeChild(svg.firstChild); }
    function addArrowMarker(svg, id, color) {
        var defs = svg.querySelector('defs');
        if (!defs) { defs = el('defs', {}); svg.appendChild(defs); }
        var m = el('marker', { id: id, markerWidth: 7, markerHeight: 7, refX: 5.5, refY: 3.5, orient: 'auto' });
        m.appendChild(el('path', { d: 'M0,0 L7,3.5 L0,7 Z', fill: color }));
        defs.appendChild(m);
    }
    function dashLine(svg, x1, y1, x2, y2, color) {
        svg.appendChild(el('line', { x1: x1, y1: y1, x2: x2, y2: y2, stroke: color, 'stroke-width': 1, 'stroke-dasharray': '4,3' }));
    }
    function dot(svg, cx, cy, color, r) {
        svg.appendChild(el('circle', { cx: cx, cy: cy, r: r || 3.4, fill: color, stroke: '#0D1117', 'stroke-width': 1 }));
    }
    function arrow(svg, x1, y1, x2, y2, color, markerId, width) {
        svg.appendChild(el('line', { x1: x1, y1: y1, x2: x2, y2: y2, stroke: color, 'stroke-width': width || 2.2, 'marker-end': 'url(#' + markerId + ')' }));
    }

    /* ============================================================
       fig2_rail : vue d'ensemble A → B (plan incliné) → C (arc) →
       D (horizontal), avec force F et sens du mouvement.
       ============================================================ */
    function drawRail(svg) {
        var w = 400, h = 260;
        setResponsive(svg, w, h);
        clear(svg);
        svg.id = svg.id || 'fig2_rail';
        addArrowMarker(svg, svg.id + '_arrowMove', '#4ECDC4');
        addArrowMarker(svg, svg.id + '_arrowF', '#FF6B6B');

        // Géométrie
        var O = { x: 150, y: 190 };
        var r = 45;
        var B = { x: O.x, y: O.y - r };          // B à la verticale de O (θ=90°)
        var C = { x: O.x + r, y: O.y };           // C à l'horizontale de O (θ=0°)
        var A = { x: 55, y: 70 };                 // sommet du plan incliné
        var D = { x: 355, y: O.y };               // extrémité du rail horizontal
        var Mang = 40 * Math.PI / 180;            // position illustrative du point M
        var M = { x: O.x + r * Math.cos(Mang), y: O.y - r * Math.sin(Mang) };

        // Sol horizontal en pointillé (référence pour α)
        dashLine(svg, A.x - 15, B.y + (A.y - B.y), B.x + 30, B.y + (A.y - B.y), '#8B96A5');

        // Plan incliné AB
        svg.appendChild(el('line', { x1: A.x, y1: A.y, x2: B.x, y2: B.y, stroke: '#3A4552', 'stroke-width': 3 }));
        svg.appendChild(text(A.x - 12, A.y - 4, 'A', { fill: '#F4D03F', 'font-size': 13, 'font-weight': 700 }));

        // Angle α à la base du plan incliné
        svg.appendChild(el('path', { d: 'M ' + (B.x - 24) + ',' + B.y + ' A 24,24 0 0 0 ' + B.x + ',' + (B.y - 24), fill: 'none', stroke: '#BB8FCE', 'stroke-width': 1.3 }));
        svg.appendChild(text(B.x - 22, B.y - 10, 'α', { fill: '#BB8FCE', 'font-size': 11, 'font-style': 'italic' }));

        // Arc de cercle BC (quart de cercle, centre O)
        svg.appendChild(el('path', {
            d: 'M ' + B.x + ',' + B.y + ' A ' + r + ',' + r + ' 0 0 1 ' + C.x + ',' + C.y,
            fill: 'none', stroke: '#3A4552', 'stroke-width': 3
        }));

        // Rayons OB et OC (pointillés) + rayon OM
        dashLine(svg, O.x, O.y, B.x, B.y, '#8B96A5');
        dashLine(svg, O.x, O.y, C.x, C.y, '#8B96A5');
        dashLine(svg, O.x, O.y, M.x, M.y, '#F4D03F');

        // Centre O
        dot(svg, O.x, O.y, '#BB8FCE', 3.2);
        svg.appendChild(text(O.x - 6, O.y + 16, 'O', { fill: '#BB8FCE', 'font-size': 12, 'font-weight': 700 }));

        // Points B, M, C
        dot(svg, B.x, B.y, '#4ECDC4', 3.6);
        svg.appendChild(text(B.x - 16, B.y - 4, 'B', { fill: '#4ECDC4', 'font-size': 12, 'font-weight': 700 }));
        dot(svg, M.x, M.y, '#F4D03F', 3.6);
        svg.appendChild(text(M.x + 6, M.y - 8, 'M', { fill: '#F4D03F', 'font-size': 12, 'font-weight': 700 }));
        dot(svg, C.x, C.y, '#4ECDC4', 3.6);
        svg.appendChild(text(C.x + 4, C.y + 16, 'C', { fill: '#4ECDC4', 'font-size': 12, 'font-weight': 700 }));

        // Angle θ entre OC et OM
        svg.appendChild(el('path', { d: 'M ' + (O.x + 16) + ',' + O.y + ' A 16,16 0 0 0 ' + (O.x + 16 * Math.cos(Mang)).toFixed(1) + ',' + (O.y - 16 * Math.sin(Mang)).toFixed(1), fill: 'none', stroke: '#F4D03F', 'stroke-width': 1.2 }));
        svg.appendChild(text(O.x + 22, O.y - 8, 'θ', { fill: '#F4D03F', 'font-size': 11, 'font-style': 'italic' }));

        // Partie horizontale CD
        svg.appendChild(el('line', { x1: C.x, y1: C.y, x2: D.x, y2: D.y, stroke: '#3A4552', 'stroke-width': 3 }));
        svg.appendChild(text(D.x + 6, D.y + 4, 'D', { fill: '#F4D03F', 'font-size': 13, 'font-weight': 700 }));

        // Bloc (solide S) sur CD
        var blockX = D.x - 55, blockY = D.y - 18;
        svg.appendChild(el('rect', { x: blockX, y: blockY, width: 26, height: 18, rx: 3, fill: '#BB8FCE', opacity: 0.35, stroke: '#BB8FCE', 'stroke-width': 1.4 }));
        svg.appendChild(text(blockX + 13, blockY + 13, 'S', { fill: '#BB8FCE', 'font-size': 11, 'font-weight': 700, 'text-anchor': 'middle' }));

        // Force F (inclinée de β au-dessus de l'horizontale)
        var beta = 45 * Math.PI / 180;
        var Fx0 = blockX + 13, Fy0 = blockY;
        var Fx1 = Fx0 + 42 * Math.cos(beta), Fy1 = Fy0 - 42 * Math.sin(beta);
        arrow(svg, Fx0, Fy0, Fx1, Fy1, '#FF6B6B', svg.id + '_arrowF');
        svg.appendChild(text(Fx1 + 6, Fy1 - 2, 'F', { fill: '#FF6B6B', 'font-size': 13, 'font-weight': 700, 'font-style': 'italic' }));
        svg.appendChild(text(Fx0 + 26, Fy0 - 6, 'β', { fill: '#FF6B6B', 'font-size': 10.5, 'font-style': 'italic' }));

        // Sens du mouvement (flèche au-dessus du rail)
        arrow(svg, C.x + 10, C.y - 26, D.x - 20, D.y - 26, '#4ECDC4', svg.id + '_arrowMove', 2);
        svg.appendChild(text((C.x + D.x) / 2, D.y - 32, 'Sens du mouvement', { fill: '#4ECDC4', 'font-size': 9.5, 'text-anchor': 'middle' }));

        svg.appendChild(text(w / 2, h - 6, 'Rail A → B → C → D', { fill: '#8B96A5', 'font-size': 9.5, 'text-anchor': 'middle' }));
    }

    /* ============================================================
       fig2_forcesAB : bilan des forces sur le plan incliné AB
       (poids P + réaction normale N, pas de frottement)
       ============================================================ */
    function drawForcesAB(svg) {
        var w = 300, h = 200;
        setResponsive(svg, w, h);
        clear(svg);
        svg.id = svg.id || 'fig2_forcesAB';
        addArrowMarker(svg, svg.id + '_arrowP', '#FF6B6B');
        addArrowMarker(svg, svg.id + '_arrowN', '#4ECDC4');

        var alpha = 30 * Math.PI / 180;
        // Plan incliné
        var P1 = { x: 40, y: 150 }, P2 = { x: 260, y: 60 };
        svg.appendChild(el('line', { x1: P1.x, y1: P1.y, x2: P2.x, y2: P2.y, stroke: '#3A4552', 'stroke-width': 3 }));
        dashLine(svg, P1.x - 10, P1.y, 260, P1.y, '#8B96A5');
        svg.appendChild(el('path', { d: 'M ' + (P1.x + 30) + ',' + P1.y + ' A 30,30 0 0 0 ' + (P1.x + 30 * Math.cos(alpha)).toFixed(1) + ',' + (P1.y - 30 * Math.sin(alpha)).toFixed(1), fill: 'none', stroke: '#BB8FCE', 'stroke-width': 1.2 }));
        svg.appendChild(text(P1.x + 34, P1.y - 10, 'α', { fill: '#BB8FCE', 'font-size': 11, 'font-style': 'italic' }));

        // Solide (S) au milieu du plan
        var Sx = (P1.x + P2.x) / 2, Sy = (P1.y + P2.y) / 2;
        svg.appendChild(el('circle', { cx: Sx, cy: Sy, r: 9, fill: '#BB8FCE', opacity: 0.4, stroke: '#BB8FCE', 'stroke-width': 1.4 }));
        svg.appendChild(text(Sx, Sy + 4, 'S', { fill: '#BB8FCE', 'font-size': 10, 'font-weight': 700, 'text-anchor': 'middle' }));

        // Poids P (vertical vers le bas)
        arrow(svg, Sx, Sy, Sx, Sy + 60, '#FF6B6B', svg.id + '_arrowP');
        svg.appendChild(text(Sx + 8, Sy + 64, 'P', { fill: '#FF6B6B', 'font-size': 13, 'font-weight': 700, 'font-style': 'italic' }));

        // Réaction normale N (perpendiculaire au plan, vers le haut)
        var perpAngle = -alpha - Math.PI / 2;
        var Nx = Sx + 55 * Math.cos(perpAngle), Ny = Sy + 55 * Math.sin(perpAngle);
        arrow(svg, Sx, Sy, Nx, Ny, '#4ECDC4', svg.id + '_arrowN');
        svg.appendChild(text(Nx + 6, Ny - 2, 'N', { fill: '#4ECDC4', 'font-size': 13, 'font-weight': 700, 'font-style': 'italic' }));

        svg.appendChild(text(w / 2, h - 8, 'Frottements négligés sur AB', { fill: '#8B96A5', 'font-size': 9.5, 'text-anchor': 'middle' }));
    }

    /* ============================================================
       fig2_arc : géométrie détaillée de l'arc BC pour établir
       W(B→M)(P) = mgr(1 - sinθ)
       ============================================================ */
    function drawArcGeometry(svg) {
        var w = 320, h = 260;
        setResponsive(svg, w, h);
        clear(svg);
        svg.id = svg.id || 'fig2_arc';

        var O = { x: 90, y: 210 };
        var r = 100;
        var B = { x: O.x, y: O.y - r };
        var C = { x: O.x + r, y: O.y };
        var theta = 35 * Math.PI / 180;
        var M = { x: O.x + r * Math.cos(theta), y: O.y - r * Math.sin(theta) };

        // Ligne de référence horizontale (niveau de O et de C)
        dashLine(svg, O.x - 10, O.y, C.x + 20, O.y, '#8B96A5');

        // Arc BC
        svg.appendChild(el('path', { d: 'M ' + B.x + ',' + B.y + ' A ' + r + ',' + r + ' 0 0 1 ' + C.x + ',' + C.y, fill: 'none', stroke: '#3A4552', 'stroke-width': 2.6 }));

        // Rayons OB, OC, OM
        dashLine(svg, O.x, O.y, B.x, B.y, '#8B96A5');
        dashLine(svg, O.x, O.y, C.x, C.y, '#8B96A5');
        svg.appendChild(el('line', { x1: O.x, y1: O.y, x2: M.x, y2: M.y, stroke: '#F4D03F', 'stroke-width': 1.6 }));

        // Hauteur y_M (verticale de M jusqu'au niveau de O)
        dashLine(svg, M.x, M.y, M.x, O.y, '#4ECDC4');
        svg.appendChild(text(M.x + 6, (M.y + O.y) / 2, 'y_M = r·sinθ', { fill: '#4ECDC4', 'font-size': 9.5 }));

        // Hauteur y_B (= r, verticale de B jusqu'au niveau de O)
        dashLine(svg, B.x - 26, B.y, B.x - 26, O.y, '#FF6B6B');
        svg.appendChild(text(B.x - 32, (B.y + O.y) / 2 + 4, 'r', { fill: '#FF6B6B', 'font-size': 10.5, 'font-style': 'italic', 'text-anchor': 'end' }));

        // Points O, B, M, C
        dot(svg, O.x, O.y, '#BB8FCE', 3.4);
        svg.appendChild(text(O.x - 8, O.y + 16, 'O', { fill: '#BB8FCE', 'font-size': 12, 'font-weight': 700 }));
        dot(svg, B.x, B.y, '#4ECDC4', 4);
        svg.appendChild(text(B.x - 18, B.y - 2, 'B (θ=90°)', { fill: '#4ECDC4', 'font-size': 10, 'font-weight': 700 }));
        dot(svg, M.x, M.y, '#F4D03F', 4);
        svg.appendChild(text(M.x + 8, M.y - 6, 'M', { fill: '#F4D03F', 'font-size': 12, 'font-weight': 700 }));
        dot(svg, C.x, C.y, '#4ECDC4', 4);
        svg.appendChild(text(C.x + 4, C.y + 18, 'C (θ=0°)', { fill: '#4ECDC4', 'font-size': 10, 'font-weight': 700 }));

        // Angle θ
        svg.appendChild(el('path', { d: 'M ' + (O.x + 26) + ',' + O.y + ' A 26,26 0 0 0 ' + (O.x + 26 * Math.cos(theta)).toFixed(1) + ',' + (O.y - 26 * Math.sin(theta)).toFixed(1), fill: 'none', stroke: '#F4D03F', 'stroke-width': 1.3 }));
        svg.appendChild(text(O.x + 32, O.y - 12, 'θ', { fill: '#F4D03F', 'font-size': 12, 'font-style': 'italic' }));

        svg.appendChild(text(w / 2, h - 8, 'h(B→M) = y_B - y_M = r(1 - sinθ)', { fill: '#8B96A5', 'font-size': 9.5, 'text-anchor': 'middle' }));
    }

    /* ============================================================
       fig2_forcesCD : bilan des forces sur la partie horizontale CD
       (poids P, normale N, force F inclinée de β, frottement f)
       ============================================================ */
    function drawForcesCD(svg) {
        var w = 320, h = 200;
        setResponsive(svg, w, h);
        clear(svg);
        svg.id = svg.id || 'fig2_forcesCD';
        addArrowMarker(svg, svg.id + '_arrowP', '#FF6B6B');
        addArrowMarker(svg, svg.id + '_arrowN', '#4ECDC4');
        addArrowMarker(svg, svg.id + '_arrowF', '#F4D03F');
        addArrowMarker(svg, svg.id + '_arrowf', '#BB8FCE');
        addArrowMarker(svg, svg.id + '_arrowMove', '#8B96A5');

        var groundY = 150;
        svg.appendChild(el('line', { x1: 20, y1: groundY, x2: 300, y2: groundY, stroke: '#3A4552', 'stroke-width': 3 }));

        var Sx = 160, Sy = groundY;
        svg.appendChild(el('rect', { x: Sx - 16, y: Sy - 16, width: 32, height: 16, rx: 3, fill: '#BB8FCE', opacity: 0.35, stroke: '#BB8FCE', 'stroke-width': 1.4 }));
        svg.appendChild(text(Sx, Sy - 5, 'S', { fill: '#BB8FCE', 'font-size': 11, 'font-weight': 700, 'text-anchor': 'middle' }));

        var cx = Sx, cy = Sy - 8;

        // Poids P (vers le bas)
        arrow(svg, cx, cy, cx, cy + 55, '#FF6B6B', svg.id + '_arrowP');
        svg.appendChild(text(cx + 8, cy + 58, 'P', { fill: '#FF6B6B', 'font-size': 13, 'font-weight': 700, 'font-style': 'italic' }));

        // Normale N (vers le haut)
        arrow(svg, cx, cy, cx, cy - 55, '#4ECDC4', svg.id + '_arrowN');
        svg.appendChild(text(cx + 8, cy - 58, 'N', { fill: '#4ECDC4', 'font-size': 13, 'font-weight': 700, 'font-style': 'italic' }));

        // Force F (inclinée de β au-dessus de l'horizontale, sens du mouvement)
        var beta = 45 * Math.PI / 180;
        var Fx = cx + 60 * Math.cos(beta), Fy = cy - 60 * Math.sin(beta);
        arrow(svg, cx, cy, Fx, Fy, '#F4D03F', svg.id + '_arrowF');
        svg.appendChild(text(Fx + 6, Fy - 2, 'F', { fill: '#F4D03F', 'font-size': 13, 'font-weight': 700, 'font-style': 'italic' }));
        svg.appendChild(el('path', { d: 'M ' + (cx + 22) + ',' + cy + ' A 22,22 0 0 0 ' + (cx + 22 * Math.cos(beta)).toFixed(1) + ',' + (cy - 22 * Math.sin(beta)).toFixed(1), fill: 'none', stroke: '#F4D03F', 'stroke-width': 1.1 }));
        svg.appendChild(text(cx + 28, cy - 6, 'β', { fill: '#F4D03F', 'font-size': 10.5, 'font-style': 'italic' }));

        // Frottement f (horizontal, opposé au mouvement)
        arrow(svg, cx - 16, cy, cx - 62, cy, '#BB8FCE', svg.id + '_arrowf');
        svg.appendChild(text(cx - 66, cy - 6, 'f', { fill: '#BB8FCE', 'font-size': 13, 'font-weight': 700, 'font-style': 'italic', 'text-anchor': 'end' }));

        // Sens du mouvement
        arrow(svg, 230, groundY - 40, 290, groundY - 40, '#8B96A5', svg.id + '_arrowMove', 1.8);
        svg.appendChild(text(260, groundY - 46, 'mouvement', { fill: '#8B96A5', 'font-size': 9, 'text-anchor': 'middle' }));

        svg.appendChild(text(w / 2, h - 8, 'Vitesse constante sur CD : ΣF = 0', { fill: '#8B96A5', 'font-size': 9.5, 'text-anchor': 'middle' }));
    }

    /* ---------- Initialisation ---------- */
    function init() {
        var map = {
            fig2_rail: drawRail,
            fig2_forcesAB: drawForcesAB,
            fig2_arc: drawArcGeometry,
            fig2_forcesCD: drawForcesCD
        };
        Object.keys(map).forEach(function (id) {
            var svg = document.getElementById(id);
            if (svg) {
                try { map[id](svg); } catch (e) { console.error('figuresvt_ex2:', id, e); }
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    window.addEventListener('resize', init);
})();
