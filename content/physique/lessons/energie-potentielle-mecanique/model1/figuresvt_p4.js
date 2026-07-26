// ============================================================
// figuresvt_p4.js — Figures SVG autonomes pour Partie 4
// Non conservation - Frottements - Énergie thermique - Exercice
// Fichier 100% indépendant : aucune fonction partagée importée.
// ============================================================

(function () {
    var SVG_NS = 'http://www.w3.org/2000/svg';

    function _el(tag, attrs) {
        var e = document.createElementNS(SVG_NS, tag);
        if (attrs) {
            for (var k in attrs) {
                if (Object.prototype.hasOwnProperty.call(attrs, k)) {
                    e.setAttribute(k, attrs[k]);
                }
            }
        }
        return e;
    }

    function _text(x, y, str, attrs) {
        var t = _el('text', Object.assign({ x: x, y: y }, attrs || {}));
        t.textContent = str;
        return t;
    }

    function _arrow(svg, x1, y1, x2, y2, color, width) {
        var g = _el('g');
        g.appendChild(_el('line', { x1: x1, y1: y1, x2: x2, y2: y2, stroke: color, 'stroke-width': width || 2 }));
        var angle = Math.atan2(y2 - y1, x2 - x1);
        var ah = 6;
        var p1x = x2 - ah * Math.cos(angle - Math.PI / 7);
        var p1y = y2 - ah * Math.sin(angle - Math.PI / 7);
        var p2x = x2 - ah * Math.cos(angle + Math.PI / 7);
        var p2y = y2 - ah * Math.sin(angle + Math.PI / 7);
        g.appendChild(_el('polygon', { points: x2 + ',' + y2 + ' ' + p1x + ',' + p1y + ' ' + p2x + ',' + p2y, fill: color }));
        svg.appendChild(g);
        return g;
    }

    function _prepare(id, vbW, vbH) {
        var svg = document.getElementById(id);
        if (!svg) return null;
        while (svg.firstChild) svg.removeChild(svg.firstChild);
        svg.setAttribute('viewBox', '0 0 ' + vbW + ' ' + vbH);
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        svg.appendChild(_el('rect', { x: 0, y: 0, width: vbW, height: vbH, fill: '#0D1117' }));
        return svg;
    }

    function _bar(svg, x, yBase, width, value, maxValue, maxHeight, color, label) {
        var barH = Math.max(2, (value / maxValue) * maxHeight);
        svg.appendChild(_el('rect', { x: x, y: yBase - barH, width: width, height: barH, fill: color, rx: 2 }));
        svg.appendChild(_text(x + width / 2, yBase + 14, label, { 'font-size': 10, fill: color, 'text-anchor': 'middle', 'font-weight': 'bold' }));
    }

    // ------------------------------------------------------------
    // Figure 1 : Em diminue avec les frottements (A -> B)
    // ------------------------------------------------------------
    function drawGraphNonConservation() {
        var w = 400, h = 200;
        var svg = _prepare('graphNonConservation', w, h);
        if (!svg) return;

        var groundY = 168;
        svg.appendChild(_el('rect', { x: 20, y: groundY, width: w - 40, height: 4, fill: '#2A2A3E' }));

        var baseY = groundY - 6, maxH = 110, maxV = 100;
        _bar(svg, 70, baseY, 34, 100, maxV, maxH, '#BB8FCE', 'Em(A)');
        svg.appendChild(_text(87, baseY - maxH - 12, '100%', { 'font-size': 9.5, fill: '#BB8FCE', 'text-anchor': 'middle' }));

        _arrow(svg, 130, baseY - maxH * 0.55, 210, baseY - maxH * 0.35, '#FF6B6B', 2);
        svg.appendChild(_text(170, baseY - maxH * 0.62, 'frottements', { 'font-size': 9, fill: '#FF6B6B', 'text-anchor': 'middle' }));

        _bar(svg, 230, baseY, 34, 65, maxV, maxH, '#BB8FCE', 'Em(B)');
        svg.appendChild(_text(247, baseY - maxH * 0.65 - 8, '65%', { 'font-size': 9.5, fill: '#BB8FCE', 'text-anchor': 'middle' }));

        // Énergie dissipée en chaleur Q
        _bar(svg, 300, baseY, 34, 35, maxV, maxH, '#F4D03F', 'Q');
        svg.appendChild(_text(317, baseY - maxH * 0.35 - 8, '35%', { 'font-size': 9.5, fill: '#F4D03F', 'text-anchor': 'middle' }));

        svg.appendChild(_text(200, 22, 'ΔEm = Em(B) − Em(A) < 0', { 'font-size': 11, fill: '#FF6B6B', 'text-anchor': 'middle', 'font-weight': 'bold' }));
    }

    // ------------------------------------------------------------
    // Figure 2 : Corps (S) sur plan incliné avec frottement, forces P, RN, f
    // ------------------------------------------------------------
    function drawGraphPlanIncline() {
        var w = 400, h = 200;
        var svg = _prepare('graphPlanIncline', w, h);
        if (!svg) return;

        var Ax = 90, Ay = 40, Bx = 300, By = 150;

        // Plan incliné
        svg.appendChild(_el('line', { x1: Ax, y1: Ay, x2: Bx, y2: By, stroke: '#4A4A5A', 'stroke-width': 7, 'stroke-linecap': 'round' }));
        // Sol horizontal sous B
        svg.appendChild(_el('line', { x1: Bx - 20, y1: By, x2: 370, y2: By, stroke: '#2A2A3E', 'stroke-width': 4 }));
        // Support vertical sous A
        svg.appendChild(_el('line', { x1: Ax, y1: Ay, x2: Ax, y2: By, stroke: '#2A2A3E', 'stroke-width': 3, 'stroke-dasharray': '4,3' }));

        // Angle alpha à la base
        svg.appendChild(_text(Ax + 34, By - 10, 'α', { 'font-size': 12, fill: '#F4D03F', 'font-style': 'italic' }));
        svg.appendChild(_el('path', { d: 'M ' + (Ax + 30) + ' ' + By + ' A 30 30 0 0 0 ' + (Ax + 26) + ' ' + (By - 14), stroke: '#F4D03F', fill: 'none', 'stroke-width': 1.3 }));

        // Solide (S) au milieu du plan
        var t = 0.5;
        var sx = Ax + (Bx - Ax) * t;
        var sy = Ay + (By - Ay) * t;
        var dx = (Bx - Ax) / Math.hypot(Bx - Ax, By - Ay);
        var dy = (By - Ay) / Math.hypot(Bx - Ax, By - Ay);
        var nx = -dy, ny = dx; // normale sortante (vers le haut-gauche du plan)

        svg.appendChild(_el('rect', {
            x: sx - 14, y: sy - 14, width: 28, height: 16, fill: '#FF8A5C',
            transform: 'rotate(' + (Math.atan2(By - Ay, Bx - Ax) * 180 / Math.PI) + ' ' + sx + ' ' + sy + ')'
        }));
        svg.appendChild(_text(sx, sy + 26, '(S)', { 'font-size': 10, fill: '#FF8A5C', 'text-anchor': 'middle' }));

        // Poids P (vertical, vers le bas)
        _arrow(svg, sx, sy, sx, sy + 55, '#BB8FCE', 2);
        svg.appendChild(_text(sx + 8, sy + 50, 'P', { 'font-size': 11, fill: '#BB8FCE', 'font-style': 'italic' }));

        // Réaction normale RN (perpendiculaire au plan, vers l'extérieur)
        _arrow(svg, sx, sy, sx + nx * 45, sy + ny * 45, '#4ECDC4', 2);
        svg.appendChild(_text(sx + nx * 55, sy + ny * 55, 'RN', { 'font-size': 10, fill: '#4ECDC4', 'font-style': 'italic' }));

        // Frottement f (le long du plan, opposé au mouvement, donc vers le haut du plan)
        _arrow(svg, sx, sy, sx - dx * 40, sy - dy * 40, '#F4D03F', 2);
        svg.appendChild(_text(sx - dx * 52, sy - dy * 52, 'f', { 'font-size': 11, fill: '#F4D03F', 'font-style': 'italic' }));

        // Sens du déplacement (A vers B)
        _arrow(svg, sx + dx * 30, sy + dy * 30 - 20, sx + dx * 55, sy + dy * 55 - 20, '#888888', 1.6);
        svg.appendChild(_text(sx + dx * 42, sy + dy * 42 - 26, 'déplacement', { 'font-size': 8, fill: '#888888', 'text-anchor': 'middle' }));

        svg.appendChild(_text(Ax - 10, Ay - 8, 'A', { 'font-size': 12, fill: '#FF6B6B', 'font-weight': 'bold' }));
        svg.appendChild(_text(Bx + 12, By + 4, 'B', { 'font-size': 12, fill: '#F4D03F', 'font-weight': 'bold' }));
    }

    // ------------------------------------------------------------
    // Figure 3 : Conversion Em -> Q (énergie thermique)
    // ------------------------------------------------------------
    function drawGraphQ() {
        var w = 400, h = 200;
        var svg = _prepare('graphQ', w, h);
        if (!svg) return;

        // Bloc "Énergie mécanique perdue"
        svg.appendChild(_el('rect', { x: 40, y: 70, width: 130, height: 60, fill: 'none', stroke: '#BB8FCE', 'stroke-width': 1.6, rx: 6 }));
        svg.appendChild(_text(105, 96, 'Énergie', { 'font-size': 11, fill: '#BB8FCE', 'text-anchor': 'middle', 'font-weight': 'bold' }));
        svg.appendChild(_text(105, 112, 'mécanique perdue', { 'font-size': 9.5, fill: '#BB8FCE', 'text-anchor': 'middle' }));
        svg.appendChild(_text(105, 124, '|ΔEm|', { 'font-size': 10, fill: '#BB8FCE', 'text-anchor': 'middle', 'font-style': 'italic' }));

        // Flèche de conversion
        _arrow(svg, 175, 100, 235, 100, '#F4D03F', 2.4);
        svg.appendChild(_text(205, 90, 'frottements', { 'font-size': 9, fill: '#F4D03F', 'text-anchor': 'middle' }));

        // Bloc "Énergie thermique Q"
        svg.appendChild(_el('rect', { x: 240, y: 70, width: 120, height: 60, fill: 'none', stroke: '#FF6B6B', 'stroke-width': 1.6, rx: 6 }));
        svg.appendChild(_text(300, 96, 'Énergie', { 'font-size': 11, fill: '#FF6B6B', 'text-anchor': 'middle', 'font-weight': 'bold' }));
        svg.appendChild(_text(300, 112, 'thermique', { 'font-size': 9.5, fill: '#FF6B6B', 'text-anchor': 'middle' }));
        svg.appendChild(_text(300, 124, 'Q = −ΔEm', { 'font-size': 10, fill: '#FF6B6B', 'text-anchor': 'middle', 'font-style': 'italic' }));

        // Symboles de chaleur (ondulations) sous le bloc Q
        for (var i = 0; i < 3; i++) {
            svg.appendChild(_el('path', { d: 'M ' + (265 + i * 25) + ' 145 q 5 -8 10 0 q 5 8 10 0', stroke: '#FF8A5C', fill: 'none', 'stroke-width': 1.6 }));
        }

        svg.appendChild(_text(200, 30, 'Q = f · AB', { 'font-size': 13, fill: '#F4D03F', 'text-anchor': 'middle', 'font-weight': 'bold' }));
    }

    // ------------------------------------------------------------
    // Figure 4 : Exercice — piste HA horizontale puis AB inclinée à 20°
    // ------------------------------------------------------------
    function drawGraphExercice() {
        var w = 400, h = 200;
        var svg = _prepare('graphExercice', w, h);
        if (!svg) return;

        var Hx = 30, Hy = 150;
        var Ax = 200, Ay = 150;
        var Bx = 330, By = 55;

        // Piste horizontale HA
        svg.appendChild(_el('line', { x1: Hx, y1: Hy, x2: Ax, y2: Ay, stroke: '#4A4A5A', 'stroke-width': 6, 'stroke-linecap': 'round' }));
        // Piste inclinée AB
        svg.appendChild(_el('line', { x1: Ax, y1: Ay, x2: Bx, y2: By, stroke: '#4A4A5A', 'stroke-width': 6, 'stroke-linecap': 'round' }));

        // Points H, A, B
        svg.appendChild(_text(Hx, Hy + 20, 'H', { 'font-size': 11, fill: '#888888', 'text-anchor': 'middle', 'font-weight': 'bold' }));
        svg.appendChild(_text(Ax, Ay + 20, 'A', { 'font-size': 12, fill: '#FF6B6B', 'text-anchor': 'middle', 'font-weight': 'bold' }));
        svg.appendChild(_text(Bx + 8, By - 6, 'B', { 'font-size': 12, fill: '#F4D03F', 'text-anchor': 'middle', 'font-weight': 'bold' }));

        // Angle alpha en A
        svg.appendChild(_el('path', { d: 'M ' + (Ax + 30) + ' ' + Ay + ' A 30 30 0 0 0 ' + (Ax + 30 * Math.cos(Math.atan2(By - Ay, Bx - Ax))) + ' ' + (Ay + 30 * Math.sin(Math.atan2(By - Ay, Bx - Ax))), stroke: '#F4D03F', fill: 'none', 'stroke-width': 1.3 }));
        svg.appendChild(_text(Ax + 40, Ay - 10, 'α = 20°', { 'font-size': 10, fill: '#F4D03F' }));

        // Vitesse vA en A (horizontale, vers la pente)
        _arrow(svg, Ax - 40, Ay - 12, Ax - 5, Ay - 12, '#4ECDC4', 2);
        svg.appendChild(_text(Ax - 22, Ay - 20, 'vA = 8 m/s', { 'font-size': 9.5, fill: '#4ECDC4', 'text-anchor': 'middle' }));

        // Point d'arrêt sur AB à distance L, avec hB
        var Lt = 0.7;
        var Lx = Ax + (Bx - Ax) * Lt;
        var Ly = Ay + (By - Ay) * Lt;
        svg.appendChild(_el('circle', { cx: Lx, cy: Ly, r: 5, fill: '#FFD93D' }));
        svg.appendChild(_text(Lx + 6, Ly - 8, 'arrêt (v=0)', { 'font-size': 8.5, fill: '#FFD93D' }));

        // Cote L le long du plan (A -> point d'arrêt)
        svg.appendChild(_text((Ax + Lx) / 2, (Ay + Ly) / 2 + 16, 'L', { 'font-size': 11, fill: '#FF8A5C', 'font-style': 'italic', 'text-anchor': 'middle' }));

        // Hauteur hB (verticale entre le sol et le point d'arrêt)
        svg.appendChild(_el('line', { x1: Lx, y1: Ly, x2: Lx, y2: Ay, stroke: '#888888', 'stroke-width': 1, 'stroke-dasharray': '3,3' }));
        svg.appendChild(_text(Lx + 10, (Ly + Ay) / 2, 'hB', { 'font-size': 9.5, fill: '#888888' }));

        // Sol
        svg.appendChild(_el('rect', { x: 10, y: Hy, width: w - 20, height: 4, fill: '#2A2A3E' }));
    }

    window.drawGraphNonConservation = drawGraphNonConservation;
    window.drawGraphPlanIncline = drawGraphPlanIncline;
    window.drawGraphQ = drawGraphQ;
    window.drawGraphExercice = drawGraphExercice;
})();
