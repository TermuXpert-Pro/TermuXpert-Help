/* ============================================================
   figuresvt_p1.js
   Figures SVG — Partie 1 : Énergie potentielle de pesanteur (Généralités)
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
        // dir: 'up' | 'down'
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
        muted: '#888888',
        line: '#2A2A3E',
        structure: '#4A4A5A',
        water: '#1A5276',
        waterLight: '#2E86AB',
        white: '#FFFFFF'
    };

    /* ============================================================
       Figure 1 : graphBarrage
       Barrage retenant l'eau en hauteur — l'eau emmagasine de l'Epp
       ============================================================ */
    function drawGraphBarrage() {
        var svg = document.getElementById('graphBarrage');
        if (!svg) return;
        var w = 400, h = 200;
        clear(svg);
        svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
        background(svg, w, h);

        var groundY = 170;
        var lakeSurfaceY = 55;
        var damLeft = 60, damTop = 55, damWidth = 26, damHeight = groundY - damTop;

        // Ciel / fond
        svg.appendChild(el('rect', { x: 0, y: 0, width: w, height: groundY, fill: '#0D1117' }));

        // Lac retenu (à gauche du barrage)
        svg.appendChild(el('rect', { x: 15, y: lakeSurfaceY, width: damLeft - 15 + damWidth, height: groundY - lakeSurfaceY, fill: COLORS.water }));
        // Surface du lac (léger dégradé visuel via ligne)
        svg.appendChild(line(15, lakeSurfaceY, damLeft + damWidth, lakeSurfaceY, { stroke: COLORS.waterLight, 'stroke-width': 2 }));

        // Corps du barrage (mur incliné simplifié)
        var damPoints = [
            [damLeft, damTop],
            [damLeft + damWidth, damTop],
            [damLeft + damWidth + 14, groundY],
            [damLeft - 10, groundY]
        ].map(function (p) { return p[0] + ',' + p[1]; }).join(' ');
        svg.appendChild(el('polygon', { points: damPoints, fill: COLORS.structure, stroke: '#1A1A2A', 'stroke-width': 1 }));

        // Eau qui s'échappe en contrebas (conduite de sortie)
        svg.appendChild(el('rect', { x: damLeft + damWidth + 6, y: groundY - 12, width: 40, height: 8, fill: COLORS.waterLight }));
        svg.appendChild(el('path', {
            d: 'M ' + (damLeft + damWidth + 46) + ' ' + (groundY - 10) + ' q 14 4 14 14',
            stroke: COLORS.waterLight, 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round'
        }));

        // Sol
        svg.appendChild(line(0, groundY, w, groundY, { stroke: COLORS.line, 'stroke-width': 2 }));
        svg.appendChild(text(w - 34, groundY + 14, 'Sol', { fill: COLORS.muted, 'font-size': 10 }));

        // Repère de hauteur h (double flèche verticale) à droite du barrage
        var hx = damLeft + damWidth + 74;
        svg.appendChild(line(hx, lakeSurfaceY, hx, groundY - 14, { stroke: COLORS.gold, 'stroke-width': 1.5 }));
        svg.appendChild(arrowHead(hx, lakeSurfaceY, 'up', COLORS.gold, 5));
        svg.appendChild(arrowHead(hx, groundY - 14, 'down', COLORS.gold, 5));
        svg.appendChild(text(hx + 8, (lakeSurfaceY + groundY - 14) / 2 + 4, 'h', { fill: COLORS.gold, 'font-size': 13, 'font-style': 'italic', 'font-weight': 'bold' }));

        // Repères pointillés reliant surface du lac / sol au repère h
        svg.appendChild(line(damLeft + damWidth, lakeSurfaceY, hx, lakeSurfaceY, { stroke: COLORS.gold, 'stroke-width': 1, 'stroke-dasharray': '3,3' }));
        svg.appendChild(line(damLeft + damWidth + 46, groundY - 6, hx, groundY - 14, { stroke: COLORS.gold, 'stroke-width': 1, 'stroke-dasharray': '3,3' }));

        // Étiquettes
        svg.appendChild(text(20, lakeSurfaceY - 8, 'Eau retenue', { fill: COLORS.teal, 'font-size': 12, 'font-weight': 'bold' }));
        svg.appendChild(text(20, 22, 'Énergie potentielle', { fill: COLORS.red, 'font-size': 12, 'font-weight': 'bold' }));
        svg.appendChild(text(20, 38, 'de pesanteur emmagasinée', { fill: COLORS.gold, 'font-size': 10.5 }));
    }

    /* ============================================================
       Figure 2 : graphGrue
       Grue soulevant une charge m de A (zA) vers B (zB)
       ============================================================ */
    function drawGraphGrue() {
        var svg = document.getElementById('graphGrue');
        if (!svg) return;
        var w = 400, h = 200;
        clear(svg);
        svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
        background(svg, w, h);

        var groundY = 175;
        var mastX = 90;

        // Sol
        svg.appendChild(line(15, groundY, w - 15, groundY, { stroke: COLORS.line, 'stroke-width': 2 }));
        svg.appendChild(text(w - 40, groundY + 14, 'Sol', { fill: COLORS.muted, 'font-size': 10 }));

        // Mât de la grue
        svg.appendChild(el('rect', { x: mastX - 5, y: 25, width: 10, height: groundY - 25, fill: COLORS.structure }));
        // Base
        svg.appendChild(el('rect', { x: mastX - 18, y: groundY - 6, width: 36, height: 10, fill: COLORS.structure }));
        // Flèche horizontale
        svg.appendChild(el('rect', { x: mastX - 5, y: 25, width: 180, height: 8, fill: COLORS.structure }));
        // Contre-flèche / hauban
        svg.appendChild(line(mastX + 175, 33, mastX + 5, 60, { stroke: COLORS.structure, 'stroke-width': 3 }));

        var poulieX = mastX + 165;

        // Position basse (A) et haute (B) de la charge, le long du câble
        var yA = groundY - 25; // altitude de la charge en A (basse)
        var yB = 85;           // altitude de la charge en B (haute)

        // Câble en pointillé jusqu'à B (position actuelle affichée = montée en cours)
        svg.appendChild(line(poulieX, 33, poulieX, yB, { stroke: COLORS.yellow, 'stroke-width': 1.5, 'stroke-dasharray': '4,3' }));

        // Charge en position B (haute) — pleine opacité
        svg.appendChild(el('rect', { x: poulieX - 16, y: yB, width: 32, height: 22, fill: COLORS.red, rx: 2 }));
        svg.appendChild(text(poulieX, yB + 16, 'm', { fill: COLORS.white, 'font-size': 12, 'text-anchor': 'middle', 'font-style': 'italic', 'font-weight': 'bold' }));

        // Charge fantôme en position A (basse) — semi-transparente pour montrer le trajet
        svg.appendChild(el('rect', { x: poulieX - 16, y: yA, width: 32, height: 22, fill: COLORS.red, opacity: 0.25, rx: 2 }));
        svg.appendChild(line(poulieX, yA, poulieX, yA + 22, { stroke: COLORS.yellow, 'stroke-width': 1, opacity: 0.4 }));

        // Flèche de montée entre A et B
        var arrowX = poulieX + 30;
        svg.appendChild(line(arrowX, yA, arrowX, yB + 22, { stroke: COLORS.gold, 'stroke-width': 2 }));
        svg.appendChild(arrowHead(arrowX, yB + 22, 'up', COLORS.gold, 6));

        // Lignes de niveau pointillées vers l'axe des altitudes (à droite)
        var axisX = w - 40;
        svg.appendChild(line(arrowX, yA + 11, axisX, yA + 11, { stroke: COLORS.muted, 'stroke-width': 1, 'stroke-dasharray': '3,3' }));
        svg.appendChild(line(arrowX, yB + 11, axisX, yB + 11, { stroke: COLORS.muted, 'stroke-width': 1, 'stroke-dasharray': '3,3' }));
        svg.appendChild(line(axisX, groundY, axisX, 30, { stroke: COLORS.teal, 'stroke-width': 1.5 }));
        svg.appendChild(arrowHead(axisX, 30, 'up', COLORS.teal, 5));
        svg.appendChild(text(axisX + 6, 34, 'z', { fill: COLORS.teal, 'font-size': 12, 'font-style': 'italic' }));

        svg.appendChild(text(axisX + 6, yB + 15, 'z\u1D66', { fill: COLORS.teal, 'font-size': 10 }));
        svg.appendChild(text(axisX + 6, yA + 15, 'z\u2090', { fill: COLORS.teal, 'font-size': 10 }));

        // Points A et B avec étiquette sur la charge/le trajet
        svg.appendChild(text(poulieX - 26, yA + 15, 'A', { fill: COLORS.red, 'font-size': 12, 'font-weight': 'bold' }));
        svg.appendChild(text(poulieX - 26, yB + 15, 'B', { fill: COLORS.red, 'font-size': 12, 'font-weight': 'bold' }));
    }

    /* ============================================================
       Figure 3 : graphAxe
       Axe Oz vertical orienté vers le haut, avec points A et B
       ============================================================ */
    function drawGraphAxe() {
        var svg = document.getElementById('graphAxe');
        if (!svg) return;
        var w = 400, h = 200;
        clear(svg);
        svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
        background(svg, w, h);

        var groundY = 170;
        var cx = w / 2 - 20;

        // Sol
        svg.appendChild(el('rect', { x: 0, y: groundY, width: w, height: h - groundY, fill: COLORS.structure }));
        svg.appendChild(text(20, groundY + 15, 'Sol', { fill: COLORS.muted, 'font-size': 10 }));

        // Axe vertical Oz
        svg.appendChild(line(cx, groundY, cx, 20, { stroke: COLORS.teal, 'stroke-width': 2 }));
        svg.appendChild(arrowHead(cx, 20, 'up', COLORS.teal, 6));
        svg.appendChild(text(cx + 12, 26, 'z', { fill: COLORS.teal, 'font-size': 14, 'font-style': 'italic', 'font-weight': 'bold' }));

        // Origine O au niveau du sol (référence z = 0)
        svg.appendChild(el('circle', { cx: cx, cy: groundY, r: 3.5, fill: COLORS.yellow }));
        svg.appendChild(text(cx - 16, groundY + 4, 'O', { fill: COLORS.yellow, 'font-size': 11, 'font-weight': 'bold' }));

        // Ligne de référence pointillée z = 0
        svg.appendChild(line(cx - 60, groundY, cx + 90, groundY, { stroke: COLORS.muted, 'stroke-width': 1, 'stroke-dasharray': '4,3' }));
        svg.appendChild(text(cx + 95, groundY + 4, 'z = 0', { fill: COLORS.muted, 'font-size': 10 }));

        // Point A (altitude zA, plus bas)
        var yA = groundY - 55;
        svg.appendChild(el('circle', { cx: cx, cy: yA, r: 5, fill: COLORS.red }));
        svg.appendChild(line(cx - 55, yA, cx, yA, { stroke: COLORS.red, 'stroke-width': 1, 'stroke-dasharray': '3,3' }));
        svg.appendChild(text(cx - 90, yA + 4, 'A (z\u2090)', { fill: COLORS.red, 'font-size': 11, 'font-weight': 'bold' }));

        // Point B (altitude zB, plus haut)
        var yB = groundY - 120;
        svg.appendChild(el('circle', { cx: cx, cy: yB, r: 5, fill: COLORS.gold }));
        svg.appendChild(line(cx - 55, yB, cx, yB, { stroke: COLORS.gold, 'stroke-width': 1, 'stroke-dasharray': '3,3' }));
        svg.appendChild(text(cx - 90, yB + 4, 'B (z\u1D66)', { fill: COLORS.gold, 'font-size': 11, 'font-weight': 'bold' }));

        // Repères d'altitude sur l'axe (petits traits)
        svg.appendChild(line(cx - 4, yA, cx + 4, yA, { stroke: COLORS.red, 'stroke-width': 2 }));
        svg.appendChild(line(cx - 4, yB, cx + 4, yB, { stroke: COLORS.gold, 'stroke-width': 2 }));
    }

    /* ---------- Initialisation ---------- */
    function initAll() {
        drawGraphBarrage();
        drawGraphGrue();
        drawGraphAxe();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAll);
    } else {
        initAll();
    }
})();
