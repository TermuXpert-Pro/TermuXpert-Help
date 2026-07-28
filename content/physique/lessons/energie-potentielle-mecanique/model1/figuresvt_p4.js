/* ============================================================
   figuresvt_p4.js
   Figures SVG — Partie 4 : Non conservation - Frottements - Énergie thermique
   Fichier autonome (aucune dépendance externe / aucune librairie partagée).
   ============================================================ */
(function () {
    'use strict';

    var SVG_NS = 'http://www.w3.org/2000/svg';

    /* ---------- Helpers internes (propres à ce fichier) ---------- */

    function el(tag, attrs) {
        var e = document.createElementNS(SVG_NS, tag);
        for (var k in attrs) {
            if (Object.prototype.hasOwnProperty.call(attrs, k)) {
                e.setAttribute(k, attrs[k]);
            }
        }
        return e;
    }

    function text(x, y, str, attrs) {
        var t = el('text', Object.assign({ x: x, y: y, 'font-family': 'Arial, sans-serif' }, attrs || {}));
        t.textContent = str;
        return t;
    }

    function line(x1, y1, x2, y2, attrs) {
        return el('line', Object.assign({ x1: x1, y1: y1, x2: x2, y2: y2 }, attrs || {}));
    }

    function arrowHead(x, y, angleDeg, color, size) {
        // pointe de flèche orientée selon angleDeg (0° = vers la droite, sens trigonométrique inverse écran)
        size = size || 6;
        var rad = angleDeg * Math.PI / 180;
        var back = rad + Math.PI;
        var a1 = back - 0.4, a2 = back + 0.4;
        var p1x = x + size * Math.cos(a1), p1y = y + size * Math.sin(a1);
        var p2x = x + size * Math.cos(a2), p2y = y + size * Math.sin(a2);
        return el('polygon', { points: x + ',' + y + ' ' + p1x + ',' + p1y + ' ' + p2x + ',' + p2y, fill: color });
    }

    function arrowV(x, y, dir, color, size) {
        // dir: 'up' | 'down' — flèche verticale simple (chevron)
        size = size || 6;
        var g = el('g', {});
        if (dir === 'up') {
            g.appendChild(line(x, y, x - size * 0.7, y + size, { stroke: color, 'stroke-width': 2, 'stroke-linecap': 'round' }));
            g.appendChild(line(x, y, x + size * 0.7, y + size, { stroke: color, 'stroke-width': 2, 'stroke-linecap': 'round' }));
        } else {
            g.appendChild(line(x, y, x - size * 0.7, y - size, { stroke: color, 'stroke-width': 2, 'stroke-linecap': 'round' }));
            g.appendChild(line(x, y, x + size * 0.7, y - size, { stroke: color, 'stroke-width': 2, 'stroke-linecap': 'round' }));
        }
        return g;
    }

    function background(svg, w, h) {
        svg.appendChild(el('rect', { x: 0, y: 0, width: w, height: h, fill: '#0D1117' }));
    }

    function clear(svg) {
        while (svg.firstChild) svg.removeChild(svg.firstChild);
    }

    var COLORS = {
        red: '#FF6B6B',
        teal: '#4ECDC4',
        gold: '#F4D03F',
        purple: '#BB8FCE',
        yellow: '#FFD93D',
        orange: '#FF8A5C',
        muted: '#888888',
        line: '#2A2A3E',
        structure: '#4A4A5A',
        white: '#FFFFFF'
    };

    /* ============================================================
       Figure 1 : graphNonConservation
       L'énergie mécanique diminue en présence de frottements :
       comparaison des barres Em(A) > Em(B), écart converti en chaleur.
       ============================================================ */
    function drawGraphNonConservation() {
        var svg = document.getElementById('graphNonConservation');
        if (!svg) return;
        var w = 400, h = 200;
        clear(svg);
        svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
        background(svg, w, h);

        var groundY = 175;
        var barW = 55;

        // Barre A (Em(A), plus haute)
        var barAx = 80, hA = 120;
        svg.appendChild(el('rect', { x: barAx, y: groundY - hA, width: barW, height: hA, fill: COLORS.teal }));
        svg.appendChild(text(barAx + barW / 2, groundY - hA - 10, 'Em(A)', { fill: COLORS.white, 'font-size': 12, 'text-anchor': 'middle', 'font-weight': 'bold' }));

        // Barre B (Em(B), plus basse : perte par frottement)
        var barBx = 240, hB = 70;
        svg.appendChild(el('rect', { x: barBx, y: groundY - hB, width: barW, height: hB, fill: COLORS.teal }));
        svg.appendChild(text(barBx + barW / 2, groundY - hB - 10, 'Em(B)', { fill: COLORS.white, 'font-size': 12, 'text-anchor': 'middle', 'font-weight': 'bold' }));

        // Zone perdue (au-dessus de la barre B jusqu'au niveau de A), en hachuré rouge = chaleur
        svg.appendChild(el('rect', { x: barBx, y: groundY - hA, width: barW, height: hA - hB, fill: COLORS.red, opacity: 0.55 }));
        // petites vaguelettes de chaleur
        for (var i = 0; i < 3; i++) {
            var wy = groundY - hB - 8 - i * 12;
            svg.appendChild(el('path', {
                d: 'M ' + (barBx + 8) + ' ' + wy + ' q 6 -6 12 0 q 6 6 12 0 q 6 -6 12 0',
                stroke: COLORS.orange, 'stroke-width': 1.5, fill: 'none', opacity: 0.9
            }));
        }
        svg.appendChild(text(barBx + barW + 10, groundY - hA + (hA - hB) / 2 + 4, 'Q (chaleur)', { fill: COLORS.orange, 'font-size': 10.5, 'font-weight': 'bold' }));

        // Flèche entre les deux états
        svg.appendChild(line(barAx + barW + 15, groundY - hA / 2, barBx - 15, groundY - hA / 2, { stroke: COLORS.muted, 'stroke-width': 1.5 }));
        svg.appendChild(arrowHead(barBx - 15, groundY - hA / 2, 0, COLORS.muted, 6));
        svg.appendChild(text((barAx + barW + barBx) / 2, groundY - hA / 2 - 8, 'frottements', { fill: COLORS.muted, 'font-size': 9.5, 'text-anchor': 'middle' }));

        // Sol
        svg.appendChild(line(30, groundY, 370, groundY, { stroke: COLORS.line, 'stroke-width': 2 }));

        svg.appendChild(text(w / 2, 20, 'Em(B) < Em(A)  (perte par frottement)', { fill: COLORS.red, 'font-size': 11.5, 'font-weight': 'bold', 'text-anchor': 'middle' }));
    }

    /* ============================================================
       Figure 2 : graphPlanIncline
       Corps (S) glissant sur un plan incliné avec frottement :
       forces P (poids), RN (normale), f (frottement).
       ============================================================ */
    function drawGraphPlanIncline() {
        var svg = document.getElementById('graphPlanIncline');
        if (!svg) return;
        var w = 400, h = 200;
        clear(svg);
        svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
        background(svg, w, h);

        var baseX = 60, baseY = 175;
        var topX = 330, topY = 55;

        // Sol horizontal (support)
        svg.appendChild(line(20, baseY, baseX, baseY, { stroke: COLORS.line, 'stroke-width': 2 }));

        // Plan incliné
        svg.appendChild(line(baseX, baseY, topX, topY, { stroke: COLORS.structure, 'stroke-width': 4, 'stroke-linecap': 'round' }));
        svg.appendChild(line(baseX, baseY, topX, baseY, { stroke: COLORS.muted, 'stroke-width': 1, 'stroke-dasharray': '3,3' }));

        // Angle alpha
        svg.appendChild(el('path', { d: 'M ' + (baseX + 34) + ' ' + baseY + ' A 34 34 0 0 0 ' + (baseX + 34 * Math.cos(Math.atan2(baseY - topY, topX - baseX))) + ' ' + (baseY - 34 * Math.sin(Math.atan2(baseY - topY, topX - baseX))), stroke: COLORS.teal, 'stroke-width': 1.5, fill: 'none' }));
        svg.appendChild(text(baseX + 40, baseY - 10, '\u03B1', { fill: COLORS.teal, 'font-size': 13, 'font-style': 'italic', 'font-weight': 'bold' }));

        // Position du corps (S) sur le plan incliné (à mi-chemin)
        var t = 0.5;
        var sx = baseX + t * (topX - baseX);
        var sy = baseY + t * (topY - baseY);
        var slopeAngle = Math.atan2(topY - baseY, topX - baseX); // négatif (monte vers la droite)

        // Bloc S (petit carré aligné avec la pente)
        var half = 12;
        var nx = Math.sin(slopeAngle), ny = -Math.cos(slopeAngle); // normale unitaire (vers l'extérieur du plan)
        var cxBlock = sx + nx * half, cyBlock = sy + ny * half;
        svg.appendChild(el('g', { transform: 'translate(' + cxBlock + ',' + cyBlock + ') rotate(' + (slopeAngle * 180 / Math.PI) + ')' }))
        var blockG = svg.lastChild;
        blockG.appendChild(el('rect', { x: -14, y: -12, width: 28, height: 24, fill: COLORS.gold, rx: 2 }));
        blockG.appendChild(text(0, 5, 'S', { fill: '#0D1117', 'font-size': 12, 'text-anchor': 'middle', 'font-weight': 'bold' }));

        // Poids P (vertical, vers le bas)
        var pStartX = sx, pStartY = sy - 8;
        svg.appendChild(line(pStartX, pStartY, pStartX, pStartY + 55, { stroke: COLORS.red, 'stroke-width': 2 }));
        svg.appendChild(arrowHead(pStartX, pStartY + 55, 90, COLORS.red, 7));
        svg.appendChild(text(pStartX + 6, pStartY + 60, 'P', { fill: COLORS.red, 'font-size': 12, 'font-style': 'italic', 'font-weight': 'bold' }));

        // Réaction normale RN (perpendiculaire au plan, vers l'extérieur)
        var rnLen = 45;
        var rnX = cxBlock + nx * rnLen, rnY = cyBlock + ny * rnLen;
        svg.appendChild(line(cxBlock, cyBlock, rnX, rnY, { stroke: COLORS.teal, 'stroke-width': 2 }));
        svg.appendChild(arrowHead(rnX, rnY, Math.atan2(ny, nx) * 180 / Math.PI, COLORS.teal, 7));
        svg.appendChild(text(rnX + 6, rnY - 4, 'R\u2099', { fill: COLORS.teal, 'font-size': 11, 'font-weight': 'bold' }));

        // Frottement f (le long du plan, opposé au mouvement supposé descendant → dirigé vers le haut de la pente)
        var fLen = 40;
        var dirX = (baseX - topX), dirY = (baseY - topY);
        var norm = Math.sqrt(dirX * dirX + dirY * dirY);
        dirX /= norm; dirY /= norm; // direction vers le haut de la pente
        var fx2 = cxBlock - dirX * fLen, fy2 = cyBlock - dirY * fLen;
        svg.appendChild(line(cxBlock, cyBlock, fx2, fy2, { stroke: COLORS.orange, 'stroke-width': 2 }));
        svg.appendChild(arrowHead(fx2, fy2, Math.atan2(-dirY, -dirX) * 180 / Math.PI, COLORS.orange, 7));
        svg.appendChild(text(fx2 - 24, fy2 - 4, 'f', { fill: COLORS.orange, 'font-size': 12, 'font-style': 'italic', 'font-weight': 'bold' }));

        // Flèche du mouvement (descente le long du plan)
        var mx2 = cxBlock + dirX * 55, my2 = cyBlock + dirY * 55;
        svg.appendChild(line(cxBlock, cyBlock + 20, mx2, my2 + 20, { stroke: COLORS.muted, 'stroke-width': 1, 'stroke-dasharray': '3,3' }));

        svg.appendChild(text(200, 20, "Corps sur un plan incliné avec frottement", { fill: COLORS.muted, 'font-size': 10.5, 'text-anchor': 'middle' }));
    }

    /* ============================================================
       Figure 3 : graphQ
       Conversion de l'énergie mécanique en énergie thermique :
       Em(A) → Em(B) + Q (diagramme de flux).
       ============================================================ */
    function drawGraphQ() {
        var svg = document.getElementById('graphQ');
        if (!svg) return;
        var w = 400, h = 200;
        clear(svg);
        svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
        background(svg, w, h);

        // Boîte Em(A) à gauche
        svg.appendChild(el('rect', { x: 25, y: 80, width: 90, height: 50, fill: 'none', stroke: COLORS.teal, 'stroke-width': 2, rx: 6 }));
        svg.appendChild(text(70, 110, 'Em(A)', { fill: COLORS.teal, 'font-size': 14, 'text-anchor': 'middle', 'font-weight': 'bold' }));

        // Flèche principale vers la droite (frottements)
        svg.appendChild(line(120, 105, 170, 105, { stroke: COLORS.white, 'stroke-width': 2 }));
        svg.appendChild(arrowHead(170, 105, 0, COLORS.white, 7));
        svg.appendChild(text(145, 92, 'frottements', { fill: COLORS.muted, 'font-size': 9.5, 'text-anchor': 'middle' }));

        // Boîte Em(B) en haut à droite
        svg.appendChild(el('rect', { x: 180, y: 45, width: 90, height: 45, fill: 'none', stroke: COLORS.teal, 'stroke-width': 2, rx: 6 }));
        svg.appendChild(text(225, 72, 'Em(B)', { fill: COLORS.teal, 'font-size': 13, 'text-anchor': 'middle', 'font-weight': 'bold' }));

        // Boîte Q (chaleur) en bas à droite
        svg.appendChild(el('rect', { x: 180, y: 120, width: 90, height: 45, fill: 'none', stroke: COLORS.orange, 'stroke-width': 2, rx: 6 }));
        svg.appendChild(text(225, 147, 'Q', { fill: COLORS.orange, 'font-size': 15, 'text-anchor': 'middle', 'font-weight': 'bold' }));
        // vaguelettes de chaleur dans la boîte Q
        svg.appendChild(el('path', { d: 'M 195 128 q 5 -6 10 0 q 5 6 10 0 q 5 -6 10 0 q 5 6 10 0', stroke: COLORS.orange, 'stroke-width': 1.2, fill: 'none', opacity: 0.7 }));

        // Petites flèches de répartition vers Em(B) et vers Q
        svg.appendChild(line(170, 105, 178, 68, { stroke: COLORS.white, 'stroke-width': 1.5 }));
        svg.appendChild(arrowHead(178, 68, -70, COLORS.white, 6));
        svg.appendChild(line(170, 105, 178, 140, { stroke: COLORS.white, 'stroke-width': 1.5 }));
        svg.appendChild(arrowHead(178, 140, 70, COLORS.white, 6));

        // Relation
        svg.appendChild(text(w / 2, 185, 'Em(A) = Em(B) + Q     avec     Q = -\u0394Em', { fill: COLORS.gold, 'font-size': 12, 'text-anchor': 'middle', 'font-weight': 'bold' }));
        svg.appendChild(text(w / 2, 22, "Conversion de l'énergie mécanique en chaleur", { fill: COLORS.muted, 'font-size': 10.5, 'text-anchor': 'middle' }));
    }

    /* ============================================================
       Figure 4 : graphExercice
       Schéma de l'exercice : piste horizontale HA (sans frottement)
       puis piste inclinée AB (angle α = 20°), vA = 8 m/s en A,
       le solide remonte jusqu'en B (vB = 0) à la hauteur hB.
       ============================================================ */
    function drawGraphExercice() {
        var svg = document.getElementById('graphExercice');
        if (!svg) return;
        var w = 400, h = 200;
        clear(svg);
        svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
        background(svg, w, h);

        var trackY = 165;
        var hX = 20, aX = 190;
        var bX = 330, bY = 55;

        // Piste horizontale H -> A
        svg.appendChild(line(hX, trackY, aX, trackY, { stroke: COLORS.structure, 'stroke-width': 4, 'stroke-linecap': 'round' }));
        svg.appendChild(el('circle', { cx: hX, cy: trackY, r: 3, fill: COLORS.muted }));
        svg.appendChild(text(hX - 4, trackY + 18, 'H', { fill: COLORS.muted, 'font-size': 11 }));

        // Piste inclinée A -> B
        svg.appendChild(line(aX, trackY, bX, bY, { stroke: COLORS.structure, 'stroke-width': 4, 'stroke-linecap': 'round' }));

        // Repère de l'angle alpha en A
        svg.appendChild(el('path', { d: 'M ' + (aX + 30) + ' ' + trackY + ' A 30 30 0 0 0 ' + (aX + 30 * Math.cos(Math.atan2(trackY - bY, bX - aX))) + ' ' + (trackY - 30 * Math.sin(Math.atan2(trackY - bY, bX - aX))), stroke: COLORS.teal, 'stroke-width': 1.5, fill: 'none' }));
        svg.appendChild(text(aX + 36, trackY - 10, '\u03B1', { fill: COLORS.teal, 'font-size': 12, 'font-style': 'italic', 'font-weight': 'bold' }));
        svg.appendChild(text(aX - 8, trackY + 18, 'A', { fill: COLORS.white, 'font-size': 11, 'font-weight': 'bold' }));

        // Point B
        svg.appendChild(el('circle', { cx: bX, cy: bY, r: 4, fill: COLORS.gold }));
        svg.appendChild(text(bX + 8, bY - 4, 'B (v = 0)', { fill: COLORS.gold, 'font-size': 10.5, 'font-weight': 'bold' }));

        // Hauteur hB (ligne verticale pointillée de B au niveau du sol)
        svg.appendChild(line(bX, bY, bX, trackY, { stroke: COLORS.muted, 'stroke-width': 1, 'stroke-dasharray': '3,3' }));
        svg.appendChild(text(bX + 8, (bY + trackY) / 2, 'h_B', { fill: COLORS.muted, 'font-size': 10 }));

        // Longueur L le long de la pente
        var midX = (aX + bX) / 2, midY = (trackY + bY) / 2;
        svg.appendChild(text(midX - 30, midY - 8, 'L', { fill: COLORS.red, 'font-size': 12, 'font-style': 'italic', 'font-weight': 'bold' }));

        // Vecteur vitesse vA au point A (horizontal)
        svg.appendChild(el('circle', { cx: aX - 30, cy: trackY - 8, r: 9, fill: COLORS.red }));
        svg.appendChild(line(aX - 18, trackY - 8, aX + 8, trackY - 8, { stroke: COLORS.red, 'stroke-width': 2 }));
        svg.appendChild(arrowHead(aX + 8, trackY - 8, 0, COLORS.red, 6));
        svg.appendChild(text(aX - 25, trackY - 22, 'v\u2090 = 8 m/s', { fill: COLORS.red, 'font-size': 10, 'font-weight': 'bold' }));

        // Sol
        svg.appendChild(text(w / 2, 20, "Piste horizontale HA + piste inclinée AB (\u03B1 = 20°)", { fill: COLORS.muted, 'font-size': 10, 'text-anchor': 'middle' }));
    }

    /* ---------- Initialisation ---------- */
    function initAll() {
        drawGraphNonConservation();
        drawGraphPlanIncline();
        drawGraphQ();
        drawGraphExercice();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAll);
    } else {
        initAll();
    }
})();
