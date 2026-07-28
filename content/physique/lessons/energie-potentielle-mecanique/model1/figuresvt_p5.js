/* ============================================================
   figuresvt_p5.js
   Figures SVG — Partie 5 : Exercices résolus (1 à 6)
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
        size = size || 6;
        var rad = angleDeg * Math.PI / 180;
        var back = rad + Math.PI;
        var a1 = back - 0.4, a2 = back + 0.4;
        var p1x = x + size * Math.cos(a1), p1y = y + size * Math.sin(a1);
        var p2x = x + size * Math.cos(a2), p2y = y + size * Math.sin(a2);
        return el('polygon', { points: x + ',' + y + ' ' + p1x + ',' + p1y + ' ' + p2x + ',' + p2y, fill: color });
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
       Exercice 1 : graphExercice1
       Parachutiste largué à z = 1500 m, chute jusqu'au sol z = 0.
       ============================================================ */
    function drawGraphExercice1() {
        var svg = document.getElementById('graphExercice1');
        if (!svg) return;
        var w = 300, h = 150;
        clear(svg);
        svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
        background(svg, w, h);

        var groundY = 130, topY = 25, cx = 110;

        // Axe vertical
        svg.appendChild(line(cx, groundY, cx, 12, { stroke: COLORS.teal, 'stroke-width': 2 }));
        svg.appendChild(arrowHead(cx, 12, -90, COLORS.teal, 5));
        svg.appendChild(text(cx + 8, 18, 'z', { fill: COLORS.teal, 'font-size': 11, 'font-style': 'italic' }));

        // Avion / point de largage (z = 1500 m)
        svg.appendChild(el('circle', { cx: cx, cy: topY, r: 5, fill: COLORS.gold }));
        svg.appendChild(text(cx + 10, topY + 4, 'z = 1500 m', { fill: COLORS.gold, 'font-size': 9.5, 'font-weight': 'bold' }));

        // Sol (z = 0)
        svg.appendChild(line(15, groundY, w - 15, groundY, { stroke: COLORS.line, 'stroke-width': 2 }));
        svg.appendChild(text(15, groundY + 14, 'Sol (z = 0)', { fill: COLORS.muted, 'font-size': 9 }));

        // Trajectoire de chute (pointillé) + parachutiste
        svg.appendChild(line(cx, topY + 8, cx, groundY - 10, { stroke: COLORS.red, 'stroke-width': 1.5, 'stroke-dasharray': '4,3' }));
        svg.appendChild(arrowHead(cx, groundY - 8, 90, COLORS.red, 6));

        var pY = 80;
        svg.appendChild(el('circle', { cx: cx, cy: pY, r: 5, fill: COLORS.white }));
        svg.appendChild(text(cx - 55, pY + 4, 'm = 70 kg', { fill: COLORS.white, 'font-size': 9 }));

        svg.appendChild(text(w / 2, 145, "Chute du parachutiste vers le sol", { fill: COLORS.muted, 'font-size': 9, 'text-anchor': 'middle' }));
    }

    /* ============================================================
       Exercice 2 : graphExercice2
       Objet lâché d'une hauteur h = 8 m, chute libre jusqu'au sol.
       ============================================================ */
    function drawGraphExercice2() {
        var svg = document.getElementById('graphExercice2');
        if (!svg) return;
        var w = 300, h = 150;
        clear(svg);
        svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
        background(svg, w, h);

        var groundY = 130, cx = 110;
        var yA = 25, yB = groundY;

        // Axe vertical
        svg.appendChild(line(cx, groundY, cx, 12, { stroke: COLORS.teal, 'stroke-width': 2 }));
        svg.appendChild(arrowHead(cx, 12, -90, COLORS.teal, 5));
        svg.appendChild(text(cx + 8, 18, 'z', { fill: COLORS.teal, 'font-size': 11, 'font-style': 'italic' }));

        // Point A (départ, h = 8 m)
        svg.appendChild(el('circle', { cx: cx, cy: yA, r: 5, fill: COLORS.red }));
        svg.appendChild(text(cx + 10, yA + 4, 'A (h = 8 m)', { fill: COLORS.red, 'font-size': 9.5, 'font-weight': 'bold' }));

        // Sol / point B
        svg.appendChild(line(15, groundY, w - 15, groundY, { stroke: COLORS.line, 'stroke-width': 2 }));
        svg.appendChild(text(cx + 10, groundY - 4, 'B (sol)', { fill: COLORS.muted, 'font-size': 9 }));

        // Vecteur poids P le long de la chute
        var px = cx - 30;
        svg.appendChild(line(px, yA + 10, px, yB - 15, { stroke: COLORS.orange, 'stroke-width': 2 }));
        svg.appendChild(arrowHead(px, yB - 15, 90, COLORS.orange, 6));
        svg.appendChild(text(px - 20, (yA + yB) / 2, 'P', { fill: COLORS.orange, 'font-size': 11, 'font-style': 'italic', 'font-weight': 'bold' }));

        svg.appendChild(text(w / 2, 145, "Chute libre d'une hauteur h", { fill: COLORS.muted, 'font-size': 9, 'text-anchor': 'middle' }));
    }

    /* ============================================================
       Exercice 3 : graphExercice3
       Lancer vertical vers le haut : v0 = 10 m/s, hmax = 5 m.
       ============================================================ */
    function drawGraphExercice3() {
        var svg = document.getElementById('graphExercice3');
        if (!svg) return;
        var w = 300, h = 150;
        clear(svg);
        svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
        background(svg, w, h);

        var groundY = 130, cx = 130;
        var yTop = 25;

        // Sol
        svg.appendChild(line(15, groundY, w - 15, groundY, { stroke: COLORS.line, 'stroke-width': 2 }));
        svg.appendChild(text(15, groundY + 14, 'Sol (z\u2080 = 0)', { fill: COLORS.muted, 'font-size': 9 }));

        // Trajectoire verticale (pointillé)
        svg.appendChild(line(cx, groundY - 8, cx, yTop + 6, { stroke: COLORS.muted, 'stroke-width': 1, 'stroke-dasharray': '3,3' }));

        // Point de départ (v0 vers le haut)
        svg.appendChild(el('circle', { cx: cx, cy: groundY - 6, r: 5, fill: COLORS.red }));
        svg.appendChild(line(cx + 10, groundY - 6, cx + 10, groundY - 40, { stroke: COLORS.red, 'stroke-width': 2 }));
        svg.appendChild(arrowHead(cx + 10, groundY - 40, -90, COLORS.red, 6));
        svg.appendChild(text(cx + 16, groundY - 25, 'v\u2080 = 10 m/s', { fill: COLORS.red, 'font-size': 9, 'font-weight': 'bold' }));

        // Point le plus haut (v = 0, hmax)
        svg.appendChild(el('circle', { cx: cx, cy: yTop, r: 5, fill: COLORS.gold }));
        svg.appendChild(text(cx + 10, yTop + 4, 'v = 0 (h_max)', { fill: COLORS.gold, 'font-size': 9, 'font-weight': 'bold' }));

        // Repère hmax
        svg.appendChild(line(cx - 25, groundY, cx - 25, yTop, { stroke: COLORS.teal, 'stroke-width': 1.5 }));
        svg.appendChild(arrowHead(cx - 25, yTop, -90, COLORS.teal, 5));
        svg.appendChild(arrowHead(cx - 25, groundY, 90, COLORS.teal, 5));
        svg.appendChild(text(cx - 55, (groundY + yTop) / 2 + 4, 'h_max = 5 m', { fill: COLORS.teal, 'font-size': 8.5 }));

        svg.appendChild(text(w / 2, 145, "Lancer vertical : conservation de Em", { fill: COLORS.muted, 'font-size': 9, 'text-anchor': 'middle' }));
    }

    /* ============================================================
       Exercice 4 : graphExercice4
       Plan incliné AB, L = 1.2 m, α = 30°, vA = 2 m/s, vB = 1 m/s.
       ============================================================ */
    function drawGraphExercice4() {
        var svg = document.getElementById('graphExercice4');
        if (!svg) return;
        var w = 300, h = 150;
        clear(svg);
        svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
        background(svg, w, h);

        var baseX = 40, baseY = 125;
        var topX = 230, topY = 35; // A en haut, B en bas (le solide descend de A vers B)

        // Sol
        svg.appendChild(line(15, baseY, baseX, baseY, { stroke: COLORS.line, 'stroke-width': 2 }));

        // Plan incliné (A en haut à droite, B en bas à gauche -> on dessine de baseX,baseY (B) à topX,topY (A))
        svg.appendChild(line(baseX, baseY, topX, topY, { stroke: COLORS.structure, 'stroke-width': 4, 'stroke-linecap': 'round' }));
        svg.appendChild(line(baseX, baseY, topX, baseY, { stroke: COLORS.muted, 'stroke-width': 1, 'stroke-dasharray': '3,3' }));

        // Angle
        svg.appendChild(el('path', { d: 'M ' + (baseX + 26) + ' ' + baseY + ' A 26 26 0 0 0 ' + (baseX + 26 * Math.cos(Math.atan2(baseY - topY, topX - baseX))) + ' ' + (baseY - 26 * Math.sin(Math.atan2(baseY - topY, topX - baseX))), stroke: COLORS.teal, 'stroke-width': 1.5, fill: 'none' }));
        svg.appendChild(text(baseX + 32, baseY - 8, '30°', { fill: COLORS.teal, 'font-size': 9.5, 'font-weight': 'bold' }));

        // Point B (bas)
        svg.appendChild(el('circle', { cx: baseX, cy: baseY, r: 5, fill: COLORS.gold }));
        svg.appendChild(text(baseX - 6, baseY + 18, 'B (v\u1D66=1 m/s)', { fill: COLORS.gold, 'font-size': 8.5, 'font-weight': 'bold' }));

        // Point A (haut)
        svg.appendChild(el('circle', { cx: topX, cy: topY, r: 5, fill: COLORS.red }));
        svg.appendChild(text(topX - 55, topY - 8, 'A (v\u2090=2 m/s)', { fill: COLORS.red, 'font-size': 8.5, 'font-weight': 'bold' }));

        // Longueur L le long de la pente
        svg.appendChild(text((baseX + topX) / 2 - 10, (baseY + topY) / 2 - 8, 'L = 1.2 m', { fill: COLORS.white, 'font-size': 9, 'font-weight': 'bold' }));

        // Flèche du sens de glissement (de A vers B)
        var midX = (baseX + topX) / 2, midY = (baseY + topY) / 2;
        svg.appendChild(arrowHead(midX - 10, midY + 6, 210, COLORS.muted, 6));

        svg.appendChild(text(w / 2, 145, "Plan incliné avec frottement", { fill: COLORS.muted, 'font-size': 9, 'text-anchor': 'middle' }));
    }

    /* ============================================================
       Exercice 5 : graphExercice5
       Boucle circulaire de rayon R = 1 m, vitesse minimale au sommet.
       ============================================================ */
    function drawGraphExercice5() {
        var svg = document.getElementById('graphExercice5');
        if (!svg) return;
        var w = 300, h = 150;
        clear(svg);
        svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
        background(svg, w, h);

        var groundY = 130;
        var loopCx = 160, loopCy = 90, R = 38;

        // Piste horizontale d'approche
        svg.appendChild(line(15, groundY, loopCx, loopCy + R, { stroke: COLORS.structure, 'stroke-width': 3.5 }));

        // Boucle circulaire
        svg.appendChild(el('circle', { cx: loopCx, cy: loopCy, r: R, fill: 'none', stroke: COLORS.structure, 'stroke-width': 3.5 }));

        // Sommet de la boucle (z = 2R)
        var topY = loopCy - R;
        svg.appendChild(el('circle', { cx: loopCx, cy: topY, r: 4, fill: COLORS.gold }));
        svg.appendChild(text(loopCx + 8, topY + 2, 'v_min = \u221A(Rg)', { fill: COLORS.gold, 'font-size': 8.5, 'font-weight': 'bold' }));
        svg.appendChild(text(loopCx + 8, topY + 14, 'z = 2R', { fill: COLORS.gold, 'font-size': 8.5 }));

        // Palet au départ (bas, v0)
        var startX = 40, startY = groundY - 4;
        svg.appendChild(el('circle', { cx: startX, cy: startY, r: 5, fill: COLORS.red }));
        svg.appendChild(line(startX + 8, startY, startX + 30, startY, { stroke: COLORS.red, 'stroke-width': 2 }));
        svg.appendChild(arrowHead(startX + 30, startY, 0, COLORS.red, 6));
        svg.appendChild(text(startX - 5, startY + 16, 'v\u2080', { fill: COLORS.red, 'font-size': 10, 'font-style': 'italic', 'font-weight': 'bold' }));

        // Rayon R indiqué
        svg.appendChild(line(loopCx, loopCy, loopCx, loopCy - R, { stroke: COLORS.teal, 'stroke-width': 1, 'stroke-dasharray': '3,3' }));
        svg.appendChild(text(loopCx + 4, loopCy - R / 2, 'R', { fill: COLORS.teal, 'font-size': 9, 'font-style': 'italic' }));

        svg.appendChild(text(w / 2, 145, "Boucle circulaire (attraction foraine)", { fill: COLORS.muted, 'font-size': 9, 'text-anchor': 'middle' }));
    }

    /* ============================================================
       Exercice 6 : graphExercice6
       Piste horizontale, d = 2 m, f = 1.5 N, conversion en chaleur Q.
       ============================================================ */
    function drawGraphExercice6() {
        var svg = document.getElementById('graphExercice6');
        if (!svg) return;
        var w = 300, h = 150;
        clear(svg);
        svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
        background(svg, w, h);

        var trackY = 100, x1 = 40, x2 = 240;

        // Piste horizontale
        svg.appendChild(line(x1, trackY, x2, trackY, { stroke: COLORS.structure, 'stroke-width': 4, 'stroke-linecap': 'round' }));

        // Bloc au départ
        svg.appendChild(el('rect', { x: x1 - 10, y: trackY - 22, width: 24, height: 20, fill: COLORS.gold, rx: 2 }));
        svg.appendChild(text(x1 + 2, trackY - 8, 'S', { fill: '#0D1117', 'font-size': 10, 'text-anchor': 'middle', 'font-weight': 'bold' }));

        // Flèche de déplacement + distance d
        svg.appendChild(line(x1 + 20, trackY - 35, x2 - 20, trackY - 35, { stroke: COLORS.white, 'stroke-width': 1.5 }));
        svg.appendChild(arrowHead(x2 - 20, trackY - 35, 0, COLORS.white, 6));
        svg.appendChild(text((x1 + x2) / 2, trackY - 42, 'd = 2 m', { fill: COLORS.white, 'font-size': 9.5, 'text-anchor': 'middle' }));

        // Flèche de frottement f (opposée au mouvement)
        svg.appendChild(line(x1 + 60, trackY - 10, x1 + 25, trackY - 10, { stroke: COLORS.orange, 'stroke-width': 2 }));
        svg.appendChild(arrowHead(x1 + 25, trackY - 10, 180, COLORS.orange, 6));
        svg.appendChild(text(x1 + 30, trackY + 6, 'f = 1.5 N', { fill: COLORS.orange, 'font-size': 8.5, 'font-weight': 'bold' }));

        // Vaguelettes de chaleur le long de la piste (échauffement)
        for (var i = 0; i < 4; i++) {
            var wx = x1 + 40 + i * 45;
            svg.appendChild(el('path', { d: 'M ' + wx + ' ' + (trackY + 12) + ' q 5 6 10 0 q 5 -6 10 0', stroke: COLORS.orange, 'stroke-width': 1.2, fill: 'none', opacity: 0.7 }));
        }
        svg.appendChild(text((x1 + x2) / 2, trackY + 32, 'Q (chaleur produite)', { fill: COLORS.orange, 'font-size': 9, 'text-anchor': 'middle' }));

        svg.appendChild(text(w / 2, 20, "Glissement avec frottement → Q", { fill: COLORS.muted, 'font-size': 9.5, 'text-anchor': 'middle' }));
    }

    /* ---------- Initialisation ---------- */
    function initAll() {
        drawGraphExercice1();
        drawGraphExercice2();
        drawGraphExercice3();
        drawGraphExercice4();
        drawGraphExercice5();
        drawGraphExercice6();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAll);
    } else {
        initAll();
    }
})();
