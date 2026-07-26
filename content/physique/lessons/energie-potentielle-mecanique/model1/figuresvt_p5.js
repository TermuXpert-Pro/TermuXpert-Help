// ============================================================
// figuresvt_p5.js — Figures SVG autonomes pour Partie 5 (Exercices)
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
        var ah = 5;
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

    // ------------------------------------------------------------
    // Exercice 3 : lancer vertical, v0 = 10 m/s, hmax = 5 m
    // ------------------------------------------------------------
    function drawGraphExercice3() {
        var w = 300, h = 150;
        var svg = _prepare('graphExercice3', w, h);
        if (!svg) return;

        var groundY = 130, ox = 150;

        svg.appendChild(_el('rect', { x: 20, y: groundY, width: w - 40, height: 3, fill: '#2A2A3E' }));
        svg.appendChild(_text(60, groundY + 14, 'Sol (z0=0)', { 'font-size': 8.5, fill: '#888888', 'text-anchor': 'middle' }));

        // Trajectoire verticale
        svg.appendChild(_el('line', { x1: ox, y1: groundY, x2: ox, y2: 20, stroke: '#666666', 'stroke-width': 1, 'stroke-dasharray': '3,3' }));

        // Position initiale (sol) avec v0 vers le haut
        svg.appendChild(_el('circle', { cx: ox, cy: groundY - 4, r: 6, fill: '#FF6B6B' }));
        _arrow(svg, ox, groundY - 12, ox, groundY - 45, '#4ECDC4', 2);
        svg.appendChild(_text(ox + 14, groundY - 35, 'v0=10 m/s', { 'font-size': 8, fill: '#4ECDC4' }));

        // Point le plus haut (hmax), v = 0
        var topY = 30;
        svg.appendChild(_el('circle', { cx: ox, cy: topY, r: 6, fill: '#F4D03F' }));
        svg.appendChild(_text(ox + 10, topY - 8, 'v = 0', { 'font-size': 8.5, fill: '#F4D03F' }));

        // Cote hmax
        svg.appendChild(_el('line', { x1: ox - 40, y1: groundY - 4, x2: ox - 40, y2: topY, stroke: '#888888', 'stroke-width': 1 }));
        svg.appendChild(_el('line', { x1: ox - 45, y1: groundY - 4, x2: ox - 35, y2: groundY - 4, stroke: '#888888', 'stroke-width': 1 }));
        svg.appendChild(_el('line', { x1: ox - 45, y1: topY, x2: ox - 35, y2: topY, stroke: '#888888', 'stroke-width': 1 }));
        svg.appendChild(_text(ox - 50, (groundY + topY) / 2, 'hmax=5m', { 'font-size': 8, fill: '#888888', 'text-anchor': 'end' }));
    }

    // ------------------------------------------------------------
    // Exercice 4 : plan incliné avec frottement, L=1.2m, α=30°
    // ------------------------------------------------------------
    function drawGraphExercice4() {
        var w = 300, h = 150;
        var svg = _prepare('graphExercice4', w, h);
        if (!svg) return;

        var Ax = 60, Ay = 25, Bx = 240, By = 118;

        svg.appendChild(_el('line', { x1: Ax, y1: Ay, x2: Bx, y2: By, stroke: '#4A4A5A', 'stroke-width': 6, 'stroke-linecap': 'round' }));
        svg.appendChild(_el('line', { x1: Bx - 15, y1: By, x2: 280, y2: By, stroke: '#2A2A3E', 'stroke-width': 3 }));

        svg.appendChild(_text(Ax - 10, Ay - 6, 'A', { 'font-size': 11, fill: '#FF6B6B', 'font-weight': 'bold' }));
        svg.appendChild(_text(Bx + 10, By + 4, 'B', { 'font-size': 11, fill: '#F4D03F', 'font-weight': 'bold' }));

        svg.appendChild(_el('path', { d: 'M ' + (Bx - 28) + ' ' + By + ' A 28 28 0 0 0 ' + (Bx - 28 * Math.cos(Math.atan2(By - Ay, Bx - Ax))) + ' ' + (By - 28 * Math.sin(Math.abs(Math.atan2(By - Ay, Bx - Ax)))), stroke: '#F4D03F', fill: 'none', 'stroke-width': 1.2 }));
        svg.appendChild(_text(Bx - 55, By - 10, 'α=30°', { 'font-size': 8.5, fill: '#F4D03F' }));

        // Solide (S) à mi-plan
        var sx = (Ax + Bx) / 2, sy = (Ay + By) / 2;
        var dx = (Bx - Ax) / Math.hypot(Bx - Ax, By - Ay);
        var dy = (By - Ay) / Math.hypot(Bx - Ax, By - Ay);
        var nx = -dy, ny = dx;

        svg.appendChild(_el('circle', { cx: sx, cy: sy - 8, r: 8, fill: '#FF8A5C' }));
        svg.appendChild(_text(sx, sy - 5, 'S', { 'font-size': 9, fill: '#0D1117', 'text-anchor': 'middle', 'font-weight': 'bold' }));

        // Vitesse (le long du plan, descendante)
        _arrow(svg, sx + dx * 12, sy - 8 + dy * 12, sx + dx * 35, sy - 8 + dy * 35, '#4ECDC4', 1.8);
        svg.appendChild(_text(sx + dx * 45, sy - 8 + dy * 45 - 4, 'v', { 'font-size': 9, fill: '#4ECDC4', 'font-style': 'italic' }));

        // Frottement f (vers le haut du plan, opposé au mouvement)
        _arrow(svg, sx, sy - 8, sx - dx * 30, sy - 8 - dy * 30, '#F4D03F', 1.8);
        svg.appendChild(_text(sx - dx * 40, sy - 8 - dy * 40, 'f', { 'font-size': 9, fill: '#F4D03F', 'font-style': 'italic' }));

        svg.appendChild(_text(150, 12, 'vA=2 m/s → vB=1 m/s (L=1.2 m)', { 'font-size': 8.5, fill: '#AAAAAA', 'text-anchor': 'middle' }));
    }

    // ------------------------------------------------------------
    // Exercice 5 : boucle circulaire, R = 1 m
    // ------------------------------------------------------------
    function drawGraphExercice5() {
        var w = 300, h = 150;
        var svg = _prepare('graphExercice5', w, h);
        if (!svg) return;

        var groundY = 130;
        svg.appendChild(_el('rect', { x: 15, y: groundY, width: w - 30, height: 3, fill: '#2A2A3E' }));

        var cx = 190, R = 45;
        var cy = groundY - R;

        // Boucle circulaire (rail)
        svg.appendChild(_el('circle', { cx: cx, cy: cy, r: R, fill: 'none', stroke: '#4A4A5A', 'stroke-width': 5 }));

        // Portion horizontale menant à la boucle
        svg.appendChild(_el('line', { x1: 20, y1: groundY - 2, x2: cx - R, y2: groundY - 2, stroke: '#4A4A5A', 'stroke-width': 5, 'stroke-linecap': 'round' }));

        // Palet en bas (départ, v0)
        svg.appendChild(_el('circle', { cx: 60, cy: groundY - 8, r: 6, fill: '#FF6B6B' }));
        _arrow(svg, 68, groundY - 8, 95, groundY - 8, '#4ECDC4', 2);
        svg.appendChild(_text(80, groundY - 16, 'v0', { 'font-size': 9, fill: '#4ECDC4', 'font-style': 'italic' }));

        // Palet au sommet de la boucle (z = 2R)
        svg.appendChild(_el('circle', { cx: cx, cy: cy - R, r: 6, fill: '#F4D03F' }));
        svg.appendChild(_text(cx + 14, cy - R - 4, 'vmin', { 'font-size': 8.5, fill: '#F4D03F' }));

        // Rayon R indiqué
        svg.appendChild(_el('line', { x1: cx, y1: cy, x2: cx, y2: cy - R, stroke: '#888888', 'stroke-width': 1, 'stroke-dasharray': '3,3' }));
        svg.appendChild(_text(cx + 6, cy - R / 2, 'R', { 'font-size': 9, fill: '#888888', 'font-style': 'italic' }));

        svg.appendChild(_text(cx, 16, 'Sommet : z = 2R', { 'font-size': 8.5, fill: '#F4D03F', 'text-anchor': 'middle' }));
    }

    // ------------------------------------------------------------
    // Exercice 6 : piste horizontale, frottement f=1.5N sur d=2m
    // ------------------------------------------------------------
    function drawGraphExercice6() {
        var w = 300, h = 150;
        var svg = _prepare('graphExercice6', w, h);
        if (!svg) return;

        var groundY = 110;
        svg.appendChild(_el('rect', { x: 30, y: groundY, width: w - 60, height: 4, fill: '#2A2A3E' }));

        // Solide au départ
        svg.appendChild(_el('rect', { x: 45, y: groundY - 18, width: 26, height: 18, fill: '#FF8A5C', rx: 3 }));
        svg.appendChild(_text(58, groundY - 6, 'S', { 'font-size': 9, fill: '#0D1117', 'text-anchor': 'middle', 'font-weight': 'bold' }));

        // Flèche de déplacement sur distance d
        _arrow(svg, 75, groundY - 30, 220, groundY - 30, '#4ECDC4', 1.8);
        svg.appendChild(_text(150, groundY - 38, 'd = 2 m', { 'font-size': 9.5, fill: '#4ECDC4', 'text-anchor': 'middle' }));

        // Frottement f (opposé au mouvement)
        _arrow(svg, 150, groundY - 9, 120, groundY - 9, '#F4D03F', 1.8);
        svg.appendChild(_text(135, groundY + 12, 'f = 1.5 N', { 'font-size': 9, fill: '#F4D03F', 'text-anchor': 'middle' }));

        // Position finale (silhouette pointillée)
        svg.appendChild(_el('rect', { x: 220, y: groundY - 18, width: 26, height: 18, fill: 'none', stroke: '#888888', 'stroke-width': 1.3, 'stroke-dasharray': '3,3', rx: 3 }));

        // Onde de chaleur produite
        svg.appendChild(_el('path', { d: 'M 130 95 q 5 -7 10 0 q 5 7 10 0', stroke: '#F4D03F', fill: 'none', 'stroke-width': 1.4 }));
        svg.appendChild(_text(150, 20, 'Q produite = 3 J', { 'font-size': 9, fill: '#F4D03F', 'text-anchor': 'middle' }));
    }

    window.drawGraphExercice3 = drawGraphExercice3;
    window.drawGraphExercice4 = drawGraphExercice4;
    window.drawGraphExercice5 = drawGraphExercice5;
    window.drawGraphExercice6 = drawGraphExercice6;
})();
