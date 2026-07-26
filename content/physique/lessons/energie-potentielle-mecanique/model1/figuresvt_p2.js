// ============================================================
// figuresvt_p2.js — Figures SVG autonomes pour Partie 2
// État de référence - Variation de Epp - Relation avec W(P)
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

    // ------------------------------------------------------------
    // Figure 1 : État de référence — zref et signe de Epp
    // ------------------------------------------------------------
    function drawGraphReference() {
        var w = 400, h = 200;
        var svg = _prepare('graphReference', w, h);
        if (!svg) return;

        var ox = 90, groundY = 175, topY = 20;
        var zrefY = 110; // altitude choisie comme référence (arbitraire, ni en haut ni au sol)

        // Sol
        svg.appendChild(_el('rect', { x: 20, y: groundY, width: w - 40, height: 4, fill: '#2A2A3E' }));
        svg.appendChild(_text(w - 60, groundY + 16, 'Sol', { 'font-size': 10, fill: '#888888', 'text-anchor': 'middle' }));

        // Axe Oz
        _arrow(svg, ox, groundY, ox, topY, '#4ECDC4', 2);
        svg.appendChild(_text(ox + 12, topY + 8, 'z', { 'font-size': 13, fill: '#4ECDC4', 'font-style': 'italic' }));

        // Ligne de référence zref (en pointillé sur toute la largeur)
        svg.appendChild(_el('line', { x1: ox, y1: zrefY, x2: w - 30, y2: zrefY, stroke: '#F4D03F', 'stroke-width': 1.4, 'stroke-dasharray': '5,3' }));
        svg.appendChild(_text(ox - 14, zrefY - 6, 'zref', { 'font-size': 10, fill: '#F4D03F', 'text-anchor': 'end' }));
        svg.appendChild(_text(w - 60, zrefY - 8, 'Epp = 0 (référence)', { 'font-size': 10, fill: '#F4D03F', 'text-anchor': 'middle' }));

        // Point au-dessus de la référence : z > zref -> Epp > 0
        var yAbove = 55;
        svg.appendChild(_el('circle', { cx: ox + 90, cy: yAbove, r: 5, fill: '#4ECDC4' }));
        svg.appendChild(_text(ox + 90, yAbove - 12, 'z > zref', { 'font-size': 10, fill: '#4ECDC4', 'text-anchor': 'middle' }));
        svg.appendChild(_text(ox + 90, yAbove + 22, 'Epp > 0', { 'font-size': 10, fill: '#4ECDC4', 'text-anchor': 'middle', 'font-weight': 'bold' }));

        // Point en dessous de la référence : z < zref -> Epp < 0
        var yBelow = 150;
        svg.appendChild(_el('circle', { cx: ox + 90, cy: yBelow, r: 5, fill: '#FF6B6B' }));
        svg.appendChild(_text(ox + 90, yBelow + 16, 'z < zref', { 'font-size': 10, fill: '#FF6B6B', 'text-anchor': 'middle' }));
        svg.appendChild(_text(ox + 90, yBelow + 30, 'Epp < 0', { 'font-size': 10, fill: '#FF6B6B', 'text-anchor': 'middle', 'font-weight': 'bold' }));

        // Point sur la référence : z = zref -> Epp = 0
        svg.appendChild(_el('circle', { cx: ox + 190, cy: zrefY, r: 5, fill: '#FFD93D' }));
        svg.appendChild(_text(ox + 190, zrefY - 12, 'z = zref', { 'font-size': 10, fill: '#FFD93D', 'text-anchor': 'middle' }));
        svg.appendChild(_text(ox + 190, zrefY + 22, 'Epp = 0', { 'font-size': 10, fill: '#FFD93D', 'text-anchor': 'middle', 'font-weight': 'bold' }));
    }

    // ------------------------------------------------------------
    // Figure 2 : Variation de Epp entre A (zA) et B (zB), zB > zA
    // ------------------------------------------------------------
    function drawGraphVariation() {
        var w = 400, h = 200;
        var svg = _prepare('graphVariation', w, h);
        if (!svg) return;

        var ox = 90, groundY = 175, topY = 20;
        var yA = groundY - 45;
        var yB = groundY - 130;

        // Sol
        svg.appendChild(_el('rect', { x: 20, y: groundY, width: w - 40, height: 4, fill: '#2A2A3E' }));
        svg.appendChild(_text(w - 60, groundY + 16, 'Sol', { 'font-size': 10, fill: '#888888', 'text-anchor': 'middle' }));

        // Axe Oz
        _arrow(svg, ox, groundY, ox, topY, '#4ECDC4', 2);
        svg.appendChild(_text(ox + 12, topY + 8, 'z', { 'font-size': 13, fill: '#4ECDC4', 'font-style': 'italic' }));

        // Point A
        svg.appendChild(_el('circle', { cx: ox, cy: yA, r: 5, fill: '#FF6B6B' }));
        svg.appendChild(_el('line', { x1: ox, y1: yA, x2: ox + 250, y2: yA, stroke: '#FF6B6B', 'stroke-width': 1, 'stroke-dasharray': '3,3' }));
        svg.appendChild(_text(ox - 18, yA + 4, 'A', { 'font-size': 12, fill: '#FF6B6B', 'font-weight': 'bold', 'text-anchor': 'middle' }));
        svg.appendChild(_text(ox + 265, yA + 4, 'zA', { 'font-size': 11, fill: '#FF6B6B', 'text-anchor': 'middle' }));

        // Point B
        svg.appendChild(_el('circle', { cx: ox, cy: yB, r: 5, fill: '#F4D03F' }));
        svg.appendChild(_el('line', { x1: ox, y1: yB, x2: ox + 250, y2: yB, stroke: '#F4D03F', 'stroke-width': 1, 'stroke-dasharray': '3,3' }));
        svg.appendChild(_text(ox - 18, yB + 4, 'B', { 'font-size': 12, fill: '#F4D03F', 'font-weight': 'bold', 'text-anchor': 'middle' }));
        svg.appendChild(_text(ox + 265, yB + 4, 'zB', { 'font-size': 11, fill: '#F4D03F', 'text-anchor': 'middle' }));

        // Flèche montante A -> B (montre le sens de la variation positive)
        _arrow(svg, ox + 40, yA - 4, ox + 40, yB + 8, '#4ECDC4', 2.2);
        svg.appendChild(_text(ox + 56, (yA + yB) / 2, 'ΔEpp', { 'font-size': 12, fill: '#4ECDC4', 'font-weight': 'bold' }));
        svg.appendChild(_text(ox + 56, (yA + yB) / 2 + 16, '= m·g·(zB−zA) > 0', { 'font-size': 9.5, fill: '#4ECDC4' }));
    }

    // ------------------------------------------------------------
    // Figure 3 : Relation ΔEpp = -W(P) — chute de A(10m) vers B(2m)
    // ------------------------------------------------------------
    function drawGraphRelation() {
        var w = 400, h = 200;
        var svg = _prepare('graphRelation', w, h);
        if (!svg) return;

        var ox = 90, groundY = 175, topY = 25;
        var yA = 45;  // zA = 10 m -> position haute
        var yB = 140; // zB = 2 m -> position basse

        // Sol
        svg.appendChild(_el('rect', { x: 20, y: groundY, width: w - 40, height: 4, fill: '#2A2A3E' }));
        svg.appendChild(_text(w - 60, groundY + 16, 'Sol', { 'font-size': 10, fill: '#888888', 'text-anchor': 'middle' }));

        // Axe Oz
        _arrow(svg, ox, groundY, ox, topY, '#4ECDC4', 2);
        svg.appendChild(_text(ox + 12, topY + 8, 'z', { 'font-size': 13, fill: '#4ECDC4', 'font-style': 'italic' }));

        // Point A en haut (zA = 10 m), objet qui va tomber
        svg.appendChild(_el('circle', { cx: ox + 150, cy: yA, r: 7, fill: '#FF6B6B' }));
        svg.appendChild(_text(ox + 150, yA - 14, 'A (zA = 10 m)', { 'font-size': 10, fill: '#FF6B6B', 'text-anchor': 'middle' }));

        // Poids P vers le bas depuis A
        _arrow(svg, ox + 150, yA + 10, ox + 150, yA + 45, '#BB8FCE', 2);
        svg.appendChild(_text(ox + 163, yA + 32, 'P', { 'font-size': 11, fill: '#BB8FCE', 'font-style': 'italic' }));

        // Trajectoire de chute (pointillé courbe simple = ligne verticale)
        svg.appendChild(_el('line', { x1: ox + 150, y1: yA + 8, x2: ox + 150, y2: yB - 8, stroke: '#888888', 'stroke-width': 1, 'stroke-dasharray': '3,3' }));

        // Point B en bas (zB = 2 m)
        svg.appendChild(_el('circle', { cx: ox + 150, cy: yB, r: 7, fill: '#F4D03F' }));
        svg.appendChild(_text(ox + 150, yB + 22, 'B (zB = 2 m)', { 'font-size': 10, fill: '#F4D03F', 'text-anchor': 'middle' }));

        // Repères d'altitude sur l'axe
        svg.appendChild(_el('line', { x1: ox - 4, y1: yA, x2: ox + 4, y2: yA, stroke: '#FF6B6B', 'stroke-width': 1.5 }));
        svg.appendChild(_el('line', { x1: ox - 4, y1: yB, x2: ox + 4, y2: yB, stroke: '#F4D03F', 'stroke-width': 1.5 }));

        // Encadré des deux relations numériques
        svg.appendChild(_text(w - 60, 55, 'W(P) > 0', { 'font-size': 11, fill: '#4ECDC4', 'text-anchor': 'middle', 'font-weight': 'bold' }));
        svg.appendChild(_text(w - 60, 72, '(la Terre fournit', { 'font-size': 9, fill: '#888888', 'text-anchor': 'middle' }));
        svg.appendChild(_text(w - 60, 84, 'de l\'énergie)', { 'font-size': 9, fill: '#888888', 'text-anchor': 'middle' }));
        svg.appendChild(_text(w - 60, 108, 'ΔEpp < 0', { 'font-size': 11, fill: '#FF6B6B', 'text-anchor': 'middle', 'font-weight': 'bold' }));
        svg.appendChild(_text(w - 60, 124, '(énergie stockée', { 'font-size': 9, fill: '#888888', 'text-anchor': 'middle' }));
        svg.appendChild(_text(w - 60, 136, 'diminue)', { 'font-size': 9, fill: '#888888', 'text-anchor': 'middle' }));
    }

    window.drawGraphReference = drawGraphReference;
    window.drawGraphVariation = drawGraphVariation;
    window.drawGraphRelation = drawGraphRelation;
})();
