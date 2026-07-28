/* ============================================================
   figuresvt_p3.js
   Figures SVG — Partie 3 : Énergie mécanique - Conservation - Activité expérimentale
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

    function arrowHead(x, y, dir, color, size) {
        size = size || 6;
        var g = el('g', {});
        if (dir === 'up') {
            g.appendChild(line(x, y, x - size * 0.7, y + size, { stroke: color, 'stroke-width': 2, 'stroke-linecap': 'round' }));
            g.appendChild(line(x, y, x + size * 0.7, y + size, { stroke: color, 'stroke-width': 2, 'stroke-linecap': 'round' }));
        } else if (dir === 'down') {
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
        muted: '#888888',
        line: '#2A2A3E',
        structure: '#4A4A5A',
        white: '#FFFFFF'
    };

    /* ============================================================
       Figure 1 : graphEm
       Em = Ec + Epp — un objet en mouvement à l'altitude z,
       décomposé en une barre empilée Ec + Epp = Em.
       ============================================================ */
    function drawGraphEm() {
        var svg = document.getElementById('graphEm');
        if (!svg) return;
        var w = 400, h = 200;
        clear(svg);
        svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
        background(svg, w, h);

        var groundY = 175;

        // --- Scène (gauche) : objet en mouvement à l'altitude z ---
        svg.appendChild(line(20, groundY, 170, groundY, { stroke: COLORS.line, 'stroke-width': 2 }));
        svg.appendChild(text(20, groundY + 14, 'Sol', { fill: COLORS.muted, 'font-size': 10 }));

        var ballX = 90, ballY = 75;
        svg.appendChild(line(ballX, groundY, ballX, ballY, { stroke: COLORS.muted, 'stroke-width': 1, 'stroke-dasharray': '3,3' }));
        svg.appendChild(text(ballX + 6, (groundY + ballY) / 2, 'z', { fill: COLORS.teal, 'font-size': 11, 'font-style': 'italic' }));

        svg.appendChild(el('circle', { cx: ballX, cy: ballY, r: 10, fill: COLORS.gold }));
        svg.appendChild(text(ballX, ballY + 4, 'm', { fill: '#0D1117', 'font-size': 10, 'text-anchor': 'middle', 'font-weight': 'bold' }));

        // vecteur vitesse v
        svg.appendChild(line(ballX + 12, ballY, ballX + 45, ballY, { stroke: COLORS.red, 'stroke-width': 2 }));
        svg.appendChild(el('polygon', { points: (ballX + 45) + ',' + ballY + ' ' + (ballX + 38) + ',' + (ballY - 4) + ' ' + (ballX + 38) + ',' + (ballY + 4), fill: COLORS.red }));
        svg.appendChild(text(ballX + 48, ballY + 4, 'v', { fill: COLORS.red, 'font-size': 12, 'font-style': 'italic', 'font-weight': 'bold' }));

        // --- Barre empilée (droite) : Ec + Epp = Em ---
        var barX = 250, barW = 46;
        var ecH = 40, eppH = 75;
        var yEcTop = groundY - ecH;
        var yEppTop = yEcTop - eppH;

        svg.appendChild(el('rect', { x: barX, y: yEcTop, width: barW, height: ecH, fill: COLORS.teal }));
        svg.appendChild(el('rect', { x: barX, y: yEppTop, width: barW, height: eppH, fill: COLORS.red }));
        svg.appendChild(line(barX, groundY, barX + barW, groundY, { stroke: COLORS.line, 'stroke-width': 1 }));

        svg.appendChild(text(barX + barW / 2, yEcTop + ecH / 2 + 4, 'Ec', { fill: '#0D1117', 'font-size': 11, 'text-anchor': 'middle', 'font-weight': 'bold' }));
        svg.appendChild(text(barX + barW / 2, yEppTop + eppH / 2 + 4, 'Epp', { fill: '#0D1117', 'font-size': 11, 'text-anchor': 'middle', 'font-weight': 'bold' }));

        // accolade / repère Em à droite de la barre
        var braceX = barX + barW + 12;
        svg.appendChild(line(braceX, yEppTop, braceX, groundY, { stroke: COLORS.gold, 'stroke-width': 1.5 }));
        svg.appendChild(line(braceX, yEppTop, braceX + 6, yEppTop, { stroke: COLORS.gold, 'stroke-width': 1.5 }));
        svg.appendChild(line(braceX, groundY, braceX + 6, groundY, { stroke: COLORS.gold, 'stroke-width': 1.5 }));
        svg.appendChild(text(braceX + 10, (yEppTop + groundY) / 2 + 4, 'Em', { fill: COLORS.gold, 'font-size': 13, 'font-weight': 'bold' }));

        svg.appendChild(text(200, 22, 'Em = Ec + Epp', { fill: COLORS.white, 'font-size': 13, 'font-weight': 'bold', 'text-anchor': 'middle' }));
    }

    /* ============================================================
       Figure 2 : graphConservation
       Conservation de l'énergie mécanique lors d'une chute libre :
       comparaison des barres empilées à l'état A et à l'état B.
       ============================================================ */
    function drawGraphConservation() {
        var svg = document.getElementById('graphConservation');
        if (!svg) return;
        var w = 400, h = 200;
        clear(svg);
        svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
        background(svg, w, h);

        var groundY = 175;
        var totalH = 120; // hauteur totale = Em (identique en A et en B)

        svg.appendChild(text(w / 2, 20, 'Em(A) = Em(B) = constante', { fill: COLORS.gold, 'font-size': 12, 'font-weight': 'bold', 'text-anchor': 'middle' }));

        // Ligne de niveau commune (sommet des deux barres, même hauteur = Em)
        var topY = groundY - totalH;
        svg.appendChild(line(70, topY, 330, topY, { stroke: COLORS.gold, 'stroke-width': 1, 'stroke-dasharray': '4,3' }));

        // --- Barre A : en haut de la trajectoire → Epp grand, Ec petit ---
        var barAx = 90, barW = 50;
        var ecA = 24, eppA = totalH - ecA;
        svg.appendChild(el('rect', { x: barAx, y: groundY - ecA, width: barW, height: ecA, fill: COLORS.teal }));
        svg.appendChild(el('rect', { x: barAx, y: topY, width: barW, height: eppA, fill: COLORS.red }));
        svg.appendChild(text(barAx + barW / 2, topY - 8, 'État A', { fill: COLORS.white, 'font-size': 11, 'text-anchor': 'middle', 'font-weight': 'bold' }));
        svg.appendChild(text(barAx + barW / 2, groundY - ecA / 2 + 4, 'Ec', { fill: '#0D1117', 'font-size': 10, 'text-anchor': 'middle', 'font-weight': 'bold' }));
        svg.appendChild(text(barAx + barW / 2, topY + eppA / 2 + 4, 'Epp', { fill: '#0D1117', 'font-size': 10, 'text-anchor': 'middle', 'font-weight': 'bold' }));

        // Flèche de chute entre les deux barres
        var arrowX = (barAx + barW + 260) / 2;
        svg.appendChild(line(arrowX, topY + 15, arrowX, groundY - 15, { stroke: COLORS.muted, 'stroke-width': 1.5, 'stroke-dasharray': '5,4' }));
        svg.appendChild(arrowHead(arrowX, groundY - 15, 'down', COLORS.muted, 6));
        svg.appendChild(text(arrowX, (topY + groundY) / 2, 'chute', { fill: COLORS.muted, 'font-size': 9.5, 'text-anchor': 'middle' }));

        // --- Barre B : en bas de la trajectoire → Epp petit, Ec grand ---
        var barBx = 260, eppB = 24, ecB = totalH - eppB;
        svg.appendChild(el('rect', { x: barBx, y: groundY - ecB, width: barW, height: ecB, fill: COLORS.teal }));
        svg.appendChild(el('rect', { x: barBx, y: topY, width: barW, height: eppB, fill: COLORS.red }));
        svg.appendChild(text(barBx + barW / 2, topY - 8, 'État B', { fill: COLORS.white, 'font-size': 11, 'text-anchor': 'middle', 'font-weight': 'bold' }));
        svg.appendChild(text(barBx + barW / 2, groundY - ecB / 2 + 4, 'Ec', { fill: '#0D1117', 'font-size': 10, 'text-anchor': 'middle', 'font-weight': 'bold' }));
        svg.appendChild(text(barBx + barW / 2, topY + eppB / 2 + 4, 'Epp', { fill: '#0D1117', 'font-size': 10, 'text-anchor': 'middle', 'font-weight': 'bold' }));

        // Sol
        svg.appendChild(line(60, groundY, 340, groundY, { stroke: COLORS.line, 'stroke-width': 2 }));
    }

    /* ============================================================
       Figure 3 : graphExperience
       Activité expérimentale : table à coussin d'air inclinée,
       autoporteur enregistré aux positions M1 à M5.
       ============================================================ */
    function drawGraphExperience() {
        var svg = document.getElementById('graphExperience');
        if (!svg) return;
        var w = 400, h = 180;
        clear(svg);
        svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
        background(svg, w, h);

        // Table (support horizontal)
        var tableY = 150, tableLeft = 30, tableRight = 370;
        svg.appendChild(el('rect', { x: tableLeft, y: tableY, width: tableRight - tableLeft, height: 8, fill: COLORS.structure }));
        svg.appendChild(el('rect', { x: tableLeft + 5, y: tableY + 8, width: 6, height: 16, fill: COLORS.structure }));
        svg.appendChild(el('rect', { x: tableRight - 11, y: tableY + 8, width: 6, height: 16, fill: COLORS.structure }));

        // Plan incliné (rail) : de la base (bas-gauche) au sommet (haut-droite)
        var baseX = 50, baseY = tableY;
        var topX = 330, topY = 45;
        svg.appendChild(line(baseX, baseY, topX, topY, { stroke: '#6B6B80', 'stroke-width': 5, 'stroke-linecap': 'round' }));

        // Support incliné sous le rail
        svg.appendChild(el('polygon', {
            points: baseX + ',' + baseY + ' ' + topX + ',' + topY + ' ' + topX + ',' + baseY + ' ' + baseX + ',' + baseY,
            fill: 'none'
        }));
        svg.appendChild(line(topX, topY, topX, baseY, { stroke: COLORS.muted, 'stroke-width': 1, 'stroke-dasharray': '3,3' }));
        svg.appendChild(line(baseX, baseY, topX, baseY, { stroke: COLORS.muted, 'stroke-width': 1, 'stroke-dasharray': '3,3' }));

        // Angle α à la base
        svg.appendChild(el('path', {
            d: 'M ' + (baseX + 30) + ' ' + baseY + ' A 30 30 0 0 0 ' + (baseX + 30 * Math.cos(Math.atan2(baseY - topY, topX - baseX))) + ' ' + (baseY - 30 * Math.sin(Math.atan2(baseY - topY, topX - baseX))),
            stroke: COLORS.teal, 'stroke-width': 1.5, fill: 'none'
        }));
        svg.appendChild(text(baseX + 34, baseY - 8, '\u03B1', { fill: COLORS.teal, 'font-size': 13, 'font-style': 'italic', 'font-weight': 'bold' }));

        // Positions M1..M5 le long du rail (espacement croissant : mouvement accéléré, d proportionnelle à t²)
        var tRatios = [0, 0.0625, 0.25, 0.5625, 1]; // (60,120,180,240)/240 au carré
        var labels = ['M\u2081', 'M\u2082', 'M\u2083', 'M\u2084', 'M\u2085'];
        for (var i = 0; i < tRatios.length; i++) {
            var px = baseX + tRatios[i] * (topX - baseX);
            var py = baseY + tRatios[i] * (topY - baseY);
            svg.appendChild(el('circle', { cx: px, cy: py - 6, r: 6, fill: COLORS.gold }));
            var labelYOffset = (i % 2 === 0) ? -16 : -18;
            svg.appendChild(text(px, py - 6 + labelYOffset, labels[i], { fill: COLORS.white, 'font-size': 10, 'text-anchor': 'middle' }));
        }

        // Flèche du sens de déplacement (descente)
        svg.appendChild(line(topX - 40, topY + 22, baseX + 60, baseY - 22, { stroke: COLORS.red, 'stroke-width': 1, 'stroke-dasharray': '3,3', opacity: 0.5 }));

        // Titre
        svg.appendChild(text(w / 2, 18, "Table à coussin d'air inclinée", { fill: COLORS.muted, 'font-size': 10.5, 'text-anchor': 'middle' }));
        svg.appendChild(text(baseX - 10, baseY + 20, 'Sol', { fill: COLORS.muted, 'font-size': 9 }));
    }

    /* ---------- Initialisation ---------- */
    function initAll() {
        drawGraphEm();
        drawGraphConservation();
        drawGraphExperience();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAll);
    } else {
        initAll();
    }
})();
