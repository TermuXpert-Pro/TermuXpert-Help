// ============================================================
// figuresvt_p3.js — Figures SVG autonomes pour Partie 3
// Énergie mécanique - Conservation - Table à coussin d'air
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
    // Figure 1 : Em = Ec + Epp — objet en mouvement à l'altitude z
    // ------------------------------------------------------------
    function drawGraphEm() {
        var w = 400, h = 200;
        var svg = _prepare('graphEm', w, h);
        if (!svg) return;

        var groundY = 172;
        var ox = 70;

        // Sol
        svg.appendChild(_el('rect', { x: 20, y: groundY, width: w - 40, height: 4, fill: '#2A2A3E' }));
        svg.appendChild(_text(w - 60, groundY + 16, 'Sol', { 'font-size': 10, fill: '#888888', 'text-anchor': 'middle' }));

        // Axe altitude
        _arrow(svg, ox, groundY, ox, 30, '#4ECDC4', 1.6);
        svg.appendChild(_text(ox + 10, 38, 'z', { 'font-size': 11, fill: '#4ECDC4', 'font-style': 'italic' }));

        // Objet en mouvement à l'altitude z (mobile, avec vecteur vitesse)
        var objX = 230, objY = 90;
        svg.appendChild(_el('circle', { cx: objX, cy: objY, r: 9, fill: '#FF8A5C' }));
        svg.appendChild(_text(objX, objY + 4, 'm', { 'font-size': 10, fill: '#0D1117', 'text-anchor': 'middle', 'font-weight': 'bold' }));
        _arrow(svg, objX + 12, objY, objX + 55, objY, '#F4D03F', 2);
        svg.appendChild(_text(objX + 60, objY - 6, 'v', { 'font-size': 12, fill: '#F4D03F', 'font-style': 'italic' }));

        // Repère d'altitude z
        svg.appendChild(_el('line', { x1: ox, y1: objY, x2: objX - 9, y2: objY, stroke: '#888888', 'stroke-width': 1, 'stroke-dasharray': '3,3' }));
        svg.appendChild(_text(ox - 12, objY + 4, 'z', { 'font-size': 10, fill: '#888888', 'text-anchor': 'middle' }));

        // Décomposition Em = Ec + Epp (encadré à droite)
        svg.appendChild(_text(330, 60, 'Em', { 'font-size': 14, fill: '#BB8FCE', 'text-anchor': 'middle', 'font-weight': 'bold' }));
        svg.appendChild(_text(330, 78, '=', { 'font-size': 12, fill: '#AAAAAA', 'text-anchor': 'middle' }));
        svg.appendChild(_text(330, 98, 'Ec', { 'font-size': 13, fill: '#F4D03F', 'text-anchor': 'middle', 'font-weight': 'bold' }));
        svg.appendChild(_text(330, 112, '(mouvement)', { 'font-size': 8.5, fill: '#888888', 'text-anchor': 'middle' }));
        svg.appendChild(_text(330, 130, '+', { 'font-size': 12, fill: '#AAAAAA', 'text-anchor': 'middle' }));
        svg.appendChild(_text(330, 150, 'Epp', { 'font-size': 13, fill: '#4ECDC4', 'text-anchor': 'middle', 'font-weight': 'bold' }));
        svg.appendChild(_text(330, 164, '(position)', { 'font-size': 8.5, fill: '#888888', 'text-anchor': 'middle' }));
    }

    // ------------------------------------------------------------
    // Figure 2 : Conservation de Em — chute libre, transformation Epp <-> Ec
    // ------------------------------------------------------------
    function drawGraphConservation() {
        var w = 400, h = 200;
        var svg = _prepare('graphConservation', w, h);
        if (!svg) return;

        var groundY = 170;

        // Trajectoire de chute (verticale pointillée)
        var trajX = 90;
        svg.appendChild(_el('line', { x1: trajX, y1: 35, x2: trajX, y2: groundY - 10, stroke: '#666666', 'stroke-width': 1, 'stroke-dasharray': '3,3' }));

        // Position A (haut) : toute l'énergie en Epp
        svg.appendChild(_el('circle', { cx: trajX, cy: 40, r: 7, fill: '#FF6B6B' }));
        svg.appendChild(_text(trajX - 20, 44, 'A', { 'font-size': 11, fill: '#FF6B6B', 'font-weight': 'bold' }));

        // Position B (bas) : toute l'énergie en Ec
        svg.appendChild(_el('circle', { cx: trajX, cy: groundY - 15, r: 7, fill: '#F4D03F' }));
        svg.appendChild(_text(trajX - 20, groundY - 11, 'B', { 'font-size': 11, fill: '#F4D03F', 'font-weight': 'bold' }));

        _arrow(svg, trajX + 20, 55, trajX + 20, groundY - 30, '#888888', 1.6);

        // Sol
        svg.appendChild(_el('rect', { x: 20, y: groundY, width: w - 40, height: 4, fill: '#2A2A3E' }));
        svg.appendChild(_text(60, groundY + 16, 'Sol', { 'font-size': 10, fill: '#888888', 'text-anchor': 'middle' }));

        // Diagramme en barres : Epp / Ec / Em en A puis en B
        var baseY = groundY - 5, maxH = 110, maxV = 100;
        // En A : Epp = 100%, Ec = 0
        _bar(svg, 170, baseY, 22, 100, maxV, maxH, '#4ECDC4', 'Epp');
        _bar(svg, 196, baseY, 22, 0, maxV, maxH, '#F4D03F', 'Ec');
        _bar(svg, 222, baseY, 22, 100, maxV, maxH, '#BB8FCE', 'Em');
        svg.appendChild(_text(196, baseY - maxH - 10, 'En A', { 'font-size': 10, fill: '#FF6B6B', 'text-anchor': 'middle', 'font-weight': 'bold' }));

        // En B : Epp diminue, Ec augmente, Em constante
        _bar(svg, 290, baseY, 22, 30, maxV, maxH, '#4ECDC4', 'Epp');
        _bar(svg, 316, baseY, 22, 70, maxV, maxH, '#F4D03F', 'Ec');
        _bar(svg, 342, baseY, 22, 100, maxV, maxH, '#BB8FCE', 'Em');
        svg.appendChild(_text(316, baseY - maxH - 10, 'En B', { 'font-size': 10, fill: '#F4D03F', 'text-anchor': 'middle', 'font-weight': 'bold' }));

        svg.appendChild(_text(255, 26, 'Em(A) = Em(B) : conservation', { 'font-size': 10.5, fill: '#BB8FCE', 'text-anchor': 'middle', 'font-weight': 'bold' }));
    }

    // ------------------------------------------------------------
    // Figure 3 : Table à coussin d'air inclinée, autoporteur en descente
    // ------------------------------------------------------------
    function drawGraphExperience() {
        var w = 400, h = 180;
        var svg = _prepare('graphExperience', w, h);
        if (!svg) return;

        // Table inclinée : segment allant du coin haut-gauche au coin bas-droit
        var x1 = 60, y1 = 35, x2 = 340, y2 = 140;
        svg.appendChild(_el('line', { x1: x1, y1: y1, x2: x2, y2: y2, stroke: '#4A4A5A', 'stroke-width': 6, 'stroke-linecap': 'round' }));
        // Support (pied) sous le point haut
        svg.appendChild(_el('line', { x1: x1, y1: y1, x2: x1, y2: y2, stroke: '#2A2A3E', 'stroke-width': 4 }));
        // Sol horizontal
        svg.appendChild(_el('line', { x1: 20, y1: y2, x2: 370, y2: y2, stroke: '#2A2A3E', 'stroke-width': 3 }));

        // Angle alpha
        svg.appendChild(_el('path', { d: 'M ' + (x1 + 34) + ' ' + y2 + ' A 34 34 0 0 0 ' + (x1 + 34 * Math.cos(Math.atan2(y2 - y1, x2 - x1))) + ' ' + (y2 + 34 * Math.sin(Math.atan2(y2 - y1, x2 - x1))), stroke: '#F4D03F', fill: 'none', 'stroke-width': 1.3 }));
        svg.appendChild(_text(x1 + 46, y2 - 10, 'α = 10°', { 'font-size': 10, fill: '#F4D03F' }));

        // Positions M1..M5 le long du plan (de haut en bas)
        var labels = ['M1', 'M2', 'M3', 'M4', 'M5'];
        for (var i = 0; i < 5; i++) {
            var t = i / 4;
            var px = x1 + (x2 - x1) * t * 0.85 + 15;
            var py = y1 + (y2 - y1) * t * 0.85 + 6;
            svg.appendChild(_el('circle', { cx: px, cy: py - 6, r: 5, fill: '#FF8A5C' }));
            svg.appendChild(_text(px, py - 16, labels[i], { 'font-size': 8.5, fill: '#FF8A5C', 'text-anchor': 'middle' }));
        }

        // Flèche indiquant le sens de la descente
        var midT = 0.5;
        var mx = x1 + (x2 - x1) * midT;
        var my = y1 + (y2 - y1) * midT;
        var dx = (x2 - x1) / Math.hypot(x2 - x1, y2 - y1);
        var dy = (y2 - y1) / Math.hypot(x2 - x1, y2 - y1);
        _arrow(svg, mx - dx * 40 - 10, my - dy * 40 - 25, mx + dx * 20 - 10, my + dy * 20 - 25, '#4ECDC4', 2);
        svg.appendChild(_text(mx - 5, my - 55, 'glissement', { 'font-size': 9, fill: '#4ECDC4', 'text-anchor': 'middle' }));

        svg.appendChild(_text(340, 158, 'Table à coussin d\'air', { 'font-size': 9.5, fill: '#888888', 'text-anchor': 'end' }));
    }

    window.drawGraphEm = drawGraphEm;
    window.drawGraphConservation = drawGraphConservation;
    window.drawGraphExperience = drawGraphExperience;
})();
