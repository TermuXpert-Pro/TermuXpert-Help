/* ============================================================
   figuresvt_p1.js
   Figures SVG - Série 1 : Travail et puissance d'une force
   Fichier 100% autonome (aucune dépendance externe / aucune librairie partagée)
   ============================================================ */
(function () {
    'use strict';

    var SVG_NS = 'http://www.w3.org/2000/svg';

    function svgEl(tag, attrs) {
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

    function text(x, y, str, attrs) {
        var t = svgEl('text', Object.assign({ x: x, y: y }, attrs || {}));
        t.textContent = str;
        return t;
    }

    function clearSvg(svg) {
        while (svg.firstChild) svg.removeChild(svg.firstChild);
    }

    function setupResponsive(svg, w, h, maxWidth) {
        svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        svg.style.width = '100%';
        svg.style.height = 'auto';
        svg.style.maxWidth = (maxWidth || w) + 'px';
        svg.style.display = 'block';
        svg.style.margin = '0 auto';
        svg.style.background = '#0D1117';
        svg.style.borderRadius = '4px';
    }

    /* Flèche : ligne + pointe triangulaire */
    function arrow(svg, x1, y1, x2, y2, color, widthPx) {
        widthPx = widthPx || 2;
        svg.appendChild(svgEl('line', { x1: x1, y1: y1, x2: x2, y2: y2, stroke: color, 'stroke-width': widthPx, 'stroke-linecap': 'round' }));
        var ang = Math.atan2(y2 - y1, x2 - x1);
        var head = 7;
        var p1x = x2 - head * Math.cos(ang - 0.4), p1y = y2 - head * Math.sin(ang - 0.4);
        var p2x = x2 - head * Math.cos(ang + 0.4), p2y = y2 - head * Math.sin(ang + 0.4);
        svg.appendChild(svgEl('polygon', { points: x2 + ',' + y2 + ' ' + p1x + ',' + p1y + ' ' + p2x + ',' + p2y, fill: color }));
    }

    /* Petit arc d'angle entre l'horizontale (partant de (ox,oy) vers la droite)
       et une pente d'inclinaison "angleRad" (montant vers la droite) */
    function inclineAngleArc(svg, ox, oy, r, angleRad, color) {
        var x1 = ox + r, y1 = oy;
        var x2 = ox + r * Math.cos(angleRad), y2 = oy - r * Math.sin(angleRad);
        svg.appendChild(svgEl('path', { d: 'M ' + x1 + ' ' + y1 + ' A ' + r + ' ' + r + ' 0 0 1 ' + x2 + ' ' + y2, fill: 'none', stroke: color, 'stroke-width': 1.4 }));
    }

    /* Petits traits de hachures représentant le sol, le long d'un segment */
    function groundHatch(svg, x1, y1, x2, y2, n, color) {
        var dx = (x2 - x1) / n, dy = (y2 - y1) / n;
        for (var i = 0; i <= n; i++) {
            var gx = x1 + i * dx, gy = y1 + i * dy;
            svg.appendChild(svgEl('line', { x1: gx, y1: gy, x2: gx - 6, y2: gy + 8, stroke: color, 'stroke-width': 1 }));
        }
    }

    /* ------------------------------------------------------------
       Exercice 1 : Savon (m = 200 g) sur plan incliné α = 30°,
       sans frottement — forces P et R, déplacement L
       ------------------------------------------------------------ */
    function drawGraph1() {
        var svg = document.getElementById('graph1');
        if (!svg) return;
        clearSvg(svg);

        var W = 380, H = 200;
        setupResponsive(svg, W, H, 380);
        svg.appendChild(svgEl('rect', { x: 0, y: 0, width: W, height: H, fill: '#0D1117' }));

        var ox = 55, oy = 160;
        var angle = 30 * Math.PI / 180;
        var runLen = 210;
        var bx = ox + runLen * Math.cos(angle);
        var by = oy - runLen * Math.sin(angle);

        // Sol horizontal (avant le pied du plan)
        svg.appendChild(svgEl('line', { x1: 12, y1: oy, x2: ox, y2: oy, stroke: '#2A2A3E', 'stroke-width': 2 }));
        groundHatch(svg, 12, oy, ox, oy, 3, '#2A2A3E');
        // Référence horizontale en pointillé (pour l'angle)
        svg.appendChild(svgEl('line', { x1: ox, y1: oy, x2: ox + 60, y2: oy, stroke: '#1A1A2E', 'stroke-width': 1, 'stroke-dasharray': '3,3' }));
        // Plan incliné
        svg.appendChild(svgEl('line', { x1: ox, y1: oy, x2: bx, y2: by, stroke: '#2A2A3E', 'stroke-width': 2.5 }));

        // Angle α
        inclineAngleArc(svg, ox, oy, 28, angle, '#F4D03F');
        svg.appendChild(text(ox + 34, oy - 8, 'α = 30°', { fill: '#F4D03F', 'font-size': '10.5', 'font-family': 'Arial', 'font-weight': '700' }));

        // Bloc (savon) sur le plan, au milieu de la pente
        var t = 0.52;
        var px = ox + t * (bx - ox), py = oy - t * (oy - by);
        var nx = -Math.sin(angle), ny = -Math.cos(angle);
        var cxp = px + nx * 12, cyp = py + ny * 12;
        svg.appendChild(svgEl('rect', {
            x: cxp - 11, y: cyp - 8, width: 22, height: 16, rx: 2,
            fill: '#4ECDC4', stroke: '#0D1117', 'stroke-width': 1,
            transform: 'rotate(' + (-30) + ' ' + cxp + ' ' + cyp + ')'
        }));

        // Vecteur poids P (vertical, vers le bas)
        arrow(svg, cxp, cyp, cxp, cyp + 52, '#FF6B6B', 2.2);
        svg.appendChild(text(cxp + 6, cyp + 64, 'P', { fill: '#FF6B6B', 'font-size': '13', 'font-family': 'Arial', 'font-weight': '700' }));

        // Vecteur réaction R (perpendiculaire au plan)
        arrow(svg, cxp, cyp, cxp + nx * 40, cyp + ny * 40, '#4ECDC4', 2.2);
        svg.appendChild(text(cxp + nx * 40 - 18, cyp + ny * 40 - 4, 'R', { fill: '#4ECDC4', 'font-size': '13', 'font-family': 'Arial', 'font-weight': '700' }));

        // Flèche de déplacement L (le long de la pente, vers le bas)
        var t2 = 0.42;
        var qx = ox + t2 * (bx - ox), qy = oy - t2 * (oy - by);
        var dirx = -Math.cos(angle), diry = Math.sin(angle);
        arrow(svg, qx, qy, qx + dirx * 38, qy + diry * 38, '#A8FF78', 2);
        svg.appendChild(text(qx - 34, qy + 14, 'L', { fill: '#A8FF78', 'font-size': '12', 'font-family': 'Arial', 'font-weight': '700' }));

        svg.appendChild(text(W / 2, 18, 'Plan incliné α = 30° — sans frottement', { fill: '#888888', 'font-size': '10', 'font-family': 'Arial', 'text-anchor': 'middle' }));
        svg.appendChild(text(W / 2, 33, 'Savon : m = 200 g,  L = 1,0 m', { fill: '#888888', 'font-size': '9.5', 'font-family': 'Arial', 'text-anchor': 'middle' }));
    }

    /* ------------------------------------------------------------
       Exercice 2 : Pendule simple — bille m = 5,0 g, L = 40 cm,
       écarté de αm = 10° du point G vers G0 (équilibre)
       ------------------------------------------------------------ */
    function drawGraph2() {
        var svg = document.getElementById('graph2');
        if (!svg) return;
        clearSvg(svg);

        var W = 380, H = 220;
        setupResponsive(svg, W, H, 380);
        svg.appendChild(svgEl('rect', { x: 0, y: 0, width: W, height: H, fill: '#0D1117' }));

        var cx = W / 2, cy = 58;
        var L = 130;
        var angle = 10 * Math.PI / 180;

        var xG = cx + L * Math.sin(angle), yG = cy + L * Math.cos(angle);
        var xG0 = cx, yG0 = cy + L;

        // Support fixe (petit hachurage en haut)
        svg.appendChild(svgEl('line', { x1: cx - 16, y1: cy, x2: cx + 16, y2: cy, stroke: '#2A2A3E', 'stroke-width': 3 }));
        groundHatch(svg, cx - 14, cy, cx + 16, cy, 3, '#2A2A3E');

        // Fil vertical (position d'équilibre, pointillé)
        svg.appendChild(svgEl('line', { x1: cx, y1: cy, x2: xG0, y2: yG0, stroke: '#1A1A2E', 'stroke-width': 1.3, 'stroke-dasharray': '4,4' }));
        // Fil écarté (position de départ G)
        svg.appendChild(svgEl('line', { x1: cx, y1: cy, x2: xG, y2: yG, stroke: '#2A2A3E', 'stroke-width': 2 }));

        // Angle αm
        var rA = 26;
        var pVert = { x: cx, y: cy + rA };
        var pFil = { x: cx + rA * Math.sin(angle), y: cy + rA * Math.cos(angle) };
        svg.appendChild(svgEl('path', { d: 'M ' + pFil.x + ' ' + pFil.y + ' A ' + rA + ' ' + rA + ' 0 0 1 ' + pVert.x + ' ' + pVert.y, fill: 'none', stroke: '#F4D03F', 'stroke-width': 1.4 }));
        svg.appendChild(text(cx + 16, cy + 40, 'αm', { fill: '#F4D03F', 'font-size': '11', 'font-family': 'Arial', 'font-weight': '700' }));

        // Bille en G0 (équilibre, en pointillé - référence)
        svg.appendChild(svgEl('circle', { cx: xG0, cy: yG0, r: 10, fill: 'none', stroke: '#4ECDC4', 'stroke-width': 1.4, 'stroke-dasharray': '3,3' }));
        svg.appendChild(text(xG0 - 34, yG0 + 4, 'G0', { fill: '#4ECDC4', 'font-size': '12', 'font-family': 'Arial', 'font-weight': '700' }));

        // Bille en G (position de départ)
        svg.appendChild(svgEl('circle', { cx: xG, cy: yG, r: 11, fill: '#F4D03F' }));
        svg.appendChild(text(xG + 15, yG, 'G', { fill: '#FFFFFF', 'font-size': '12', 'font-family': 'Arial', 'font-weight': '700' }));

        // Point O
        svg.appendChild(svgEl('circle', { cx: cx, cy: cy, r: 4, fill: '#FF6B6B' }));
        svg.appendChild(text(cx + 9, cy + 3, 'O', { fill: '#FFFFFF', 'font-size': '10', 'font-family': 'Arial' }));

        svg.appendChild(text(cx, 16, 'Pendule simple : αm = 10°', { fill: '#888888', 'font-size': '9.5', 'font-family': 'Arial', 'text-anchor': 'middle' }));
        svg.appendChild(text(cx, 30, 'm = 5,0 g,  L = 40 cm', { fill: '#888888', 'font-size': '9', 'font-family': 'Arial', 'text-anchor': 'middle' }));
    }

    /* ------------------------------------------------------------
       Exercice 3 : Chute libre d'un ballon (m = 300 g),
       h = 5,0 m, Δt = 1,0 s
       ------------------------------------------------------------ */
    function drawGraph3() {
        var svg = document.getElementById('graph3');
        if (!svg) return;
        clearSvg(svg);

        var W = 380, H = 200;
        setupResponsive(svg, W, H, 380);
        svg.appendChild(svgEl('rect', { x: 0, y: 0, width: W, height: H, fill: '#0D1117' }));

        var cx = W / 2;
        var topY = 56, groundY = H - 30;

        // Sol
        svg.appendChild(svgEl('line', { x1: 30, y1: groundY, x2: W - 30, y2: groundY, stroke: '#2A2A3E', 'stroke-width': 2 }));
        groundHatch(svg, 30, groundY, W - 30, groundY, 8, '#2A2A3E');

        // Trajectoire verticale (pointillé)
        svg.appendChild(svgEl('line', { x1: cx, y1: topY + 12, x2: cx, y2: groundY - 12, stroke: '#1A1A2E', 'stroke-width': 1, 'stroke-dasharray': '2,4' }));

        // Ballon - position initiale (départ, v = 0)
        svg.appendChild(svgEl('circle', { cx: cx, cy: topY, r: 10, fill: '#4ECDC4' }));
        svg.appendChild(text(cx + 20, topY - 12, 'départ (v₀ = 0)', { fill: '#4ECDC4', 'font-size': '9', 'font-family': 'Arial' }));

        // Poids P sur le ballon en haut
        arrow(svg, cx + 18, topY + 4, cx + 18, topY + 46, '#FF6B6B', 2.2);
        svg.appendChild(text(cx + 24, topY + 34, 'P', { fill: '#FF6B6B', 'font-size': '13', 'font-family': 'Arial', 'font-weight': '700' }));

        // Ballon - position finale (après la chute, en pointillé)
        svg.appendChild(svgEl('circle', { cx: cx, cy: groundY - 14, r: 10, fill: 'none', stroke: '#F4D03F', 'stroke-width': 1.5, 'stroke-dasharray': '3,3' }));
        svg.appendChild(text(cx + 20, groundY - 10, 'après la chute', { fill: '#F4D03F', 'font-size': '9', 'font-family': 'Arial' }));

        // Flèche double h
        var hx = cx - 55;
        arrow(svg, hx, topY + 12, hx, groundY - 26, '#A8FF78', 1.6);
        arrow(svg, hx, groundY - 26, hx, topY + 12, '#A8FF78', 1.6);
        svg.appendChild(text(hx - 18, (topY + groundY) / 2, 'h', { fill: '#A8FF78', 'font-size': '13', 'font-family': 'Arial', 'font-weight': '700' }));

        svg.appendChild(text(cx, 16, 'Chute libre — h = 5,0 m, Δt = 1,0 s', { fill: '#888888', 'font-size': '9.5', 'font-family': 'Arial', 'text-anchor': 'middle' }));
        svg.appendChild(text(cx, 30, 'Ballon : m = 300 g', { fill: '#888888', 'font-size': '9', 'font-family': 'Arial', 'text-anchor': 'middle' }));
    }

    /* ------------------------------------------------------------
       Exercice 4 : Enfant tirant un camion en bois avec une corde
       W = 2,0 kJ en Δt = 30 s
       ------------------------------------------------------------ */
    function drawGraph4() {
        var svg = document.getElementById('graph4');
        if (!svg) return;
        clearSvg(svg);

        var W = 380, H = 180;
        setupResponsive(svg, W, H, 380);
        svg.appendChild(svgEl('rect', { x: 0, y: 0, width: W, height: H, fill: '#0D1117' }));

        var groundY = H - 34;
        svg.appendChild(svgEl('line', { x1: 15, y1: groundY, x2: W - 15, y2: groundY, stroke: '#2A2A3E', 'stroke-width': 2 }));
        groundHatch(svg, 15, groundY, W - 15, groundY, 10, '#2A2A3E');

        // Enfant (silhouette simple)
        var ex = 62, headY = groundY - 60;
        svg.appendChild(svgEl('circle', { cx: ex, cy: headY, r: 8, fill: '#4ECDC4' }));
        svg.appendChild(svgEl('line', { x1: ex, y1: headY + 8, x2: ex, y2: groundY - 22, stroke: '#4ECDC4', 'stroke-width': 2.4 }));
        svg.appendChild(svgEl('line', { x1: ex, y1: groundY - 22, x2: ex - 10, y2: groundY, stroke: '#4ECDC4', 'stroke-width': 2.4 }));
        svg.appendChild(svgEl('line', { x1: ex, y1: groundY - 22, x2: ex + 10, y2: groundY, stroke: '#4ECDC4', 'stroke-width': 2.4 }));
        svg.appendChild(svgEl('line', { x1: ex, y1: headY + 16, x2: ex + 18, y2: headY + 30, stroke: '#4ECDC4', 'stroke-width': 2.2 }));
        svg.appendChild(text(ex, headY - 14, 'Enfant', { fill: '#888888', 'font-size': '9', 'font-family': 'Arial', 'text-anchor': 'middle' }));

        // Corde
        var handX = ex + 18, handY = headY + 30;
        var truckX = 218, truckY = groundY - 26;
        svg.appendChild(svgEl('line', { x1: handX, y1: handY, x2: truckX, y2: truckY, stroke: '#A9A9B2', 'stroke-width': 1.8 }));

        // Camion en bois (caisse + roues)
        svg.appendChild(svgEl('rect', { x: truckX, y: groundY - 42, width: 90, height: 32, rx: 3, fill: '#F4D03F22', stroke: '#F4D03F', 'stroke-width': 2 }));
        svg.appendChild(svgEl('rect', { x: truckX + 8, y: groundY - 58, width: 30, height: 18, rx: 2, fill: 'none', stroke: '#F4D03F', 'stroke-width': 1.5 }));
        svg.appendChild(svgEl('circle', { cx: truckX + 20, cy: groundY - 6, r: 9, fill: '#0D1117', stroke: '#F4D03F', 'stroke-width': 2 }));
        svg.appendChild(svgEl('circle', { cx: truckX + 68, cy: groundY - 6, r: 9, fill: '#0D1117', stroke: '#F4D03F', 'stroke-width': 2 }));
        svg.appendChild(text(truckX + 45, groundY - 64, 'Camion', { fill: '#888888', 'font-size': '9', 'font-family': 'Arial', 'text-anchor': 'middle' }));

        // Vecteur force F le long de la corde
        var midx = (handX + truckX) / 2, midy = (handY + truckY) / 2;
        arrow(svg, midx - 22, midy - 6, midx + 22, midy + 2, '#A8FF78', 2.2);
        svg.appendChild(text(midx - 4, midy - 14, 'F', { fill: '#A8FF78', 'font-size': '13', 'font-family': 'Arial', 'font-weight': '700' }));

        // Flèche de déplacement (sens du mouvement)
        arrow(svg, truckX + 100, groundY - 60, truckX + 128, groundY - 60, '#4ECDC4', 1.6);
        svg.appendChild(text(truckX + 100, groundY - 68, 'déplacement', { fill: '#4ECDC4', 'font-size': '8.5', 'font-family': 'Arial' }));

        svg.appendChild(text(W / 2, 16, "Enfant tirant un camion en bois", { fill: '#888888', 'font-size': '9.5', 'font-family': 'Arial', 'text-anchor': 'middle' }));
        svg.appendChild(text(W / 2, 30, 'W = 2,0 kJ en Δt = 30 s', { fill: '#888888', 'font-size': '9', 'font-family': 'Arial', 'text-anchor': 'middle' }));
    }

    /* ------------------------------------------------------------
       Exercice 5 : Traîneau (m = 50 kg) tiré à vitesse constante
       sur un plan incliné α = 20°, sans frottement — forces P, R, F
       ------------------------------------------------------------ */
    function drawGraph5() {
        var svg = document.getElementById('graph5');
        if (!svg) return;
        clearSvg(svg);

        var W = 400, H = 220;
        setupResponsive(svg, W, H, 400);
        svg.appendChild(svgEl('rect', { x: 0, y: 0, width: W, height: H, fill: '#0D1117' }));

        var ox = 55, oy = 178;
        var angle = 20 * Math.PI / 180;
        var runLen = 260;
        var bx = ox + runLen * Math.cos(angle);
        var by = oy - runLen * Math.sin(angle);

        svg.appendChild(svgEl('line', { x1: 12, y1: oy, x2: ox, y2: oy, stroke: '#2A2A3E', 'stroke-width': 2 }));
        groundHatch(svg, 12, oy, ox, oy, 3, '#2A2A3E');
        svg.appendChild(svgEl('line', { x1: ox, y1: oy, x2: ox + 60, y2: oy, stroke: '#1A1A2E', 'stroke-width': 1, 'stroke-dasharray': '3,3' }));
        svg.appendChild(svgEl('line', { x1: ox, y1: oy, x2: bx, y2: by, stroke: '#2A2A3E', 'stroke-width': 2.5 }));

        inclineAngleArc(svg, ox, oy, 30, angle, '#F4D03F');
        svg.appendChild(text(ox + 36, oy - 8, 'α = 20°', { fill: '#F4D03F', 'font-size': '10.5', 'font-family': 'Arial', 'font-weight': '700' }));

        // Traîneau sur le plan
        var t = 0.5;
        var px = ox + t * (bx - ox), py = oy - t * (oy - by);
        var nx = -Math.sin(angle), ny = -Math.cos(angle);
        var cxp = px + nx * 11, cyp = py + ny * 11;
        svg.appendChild(svgEl('rect', {
            x: cxp - 15, y: cyp - 7, width: 30, height: 14, rx: 4,
            fill: '#4ECDC4', stroke: '#0D1117', 'stroke-width': 1,
            transform: 'rotate(' + (-20) + ' ' + cxp + ' ' + cyp + ')'
        }));

        // P
        arrow(svg, cxp, cyp, cxp, cyp + 50, '#FF6B6B', 2.2);
        svg.appendChild(text(cxp + 6, cyp + 62, 'P', { fill: '#FF6B6B', 'font-size': '13', 'font-family': 'Arial', 'font-weight': '700' }));

        // R
        arrow(svg, cxp, cyp, cxp + nx * 46, cyp + ny * 46, '#4ECDC4', 2.2);
        svg.appendChild(text(cxp + nx * 46 - 22, cyp + ny * 46 - 6, 'R', { fill: '#4ECDC4', 'font-size': '13', 'font-family': 'Arial', 'font-weight': '700' }));

        // F (parallèle au plan, vers le haut de la pente)
        var dx = Math.cos(angle), dy = -Math.sin(angle);
        arrow(svg, cxp, cyp, cxp + dx * 52, cyp + dy * 52, '#A8FF78', 2.2);
        svg.appendChild(text(cxp + dx * 52 + 6, cyp + dy * 52 - 4, 'F', { fill: '#A8FF78', 'font-size': '13', 'font-family': 'Arial', 'font-weight': '700' }));

        svg.appendChild(text(W / 2, 18, 'Plan incliné α = 20° — sans frottement', { fill: '#888888', 'font-size': '10', 'font-family': 'Arial', 'text-anchor': 'middle' }));
        svg.appendChild(text(W / 2, 33, 'Traîneau : m = 50 kg, vitesse constante', { fill: '#888888', 'font-size': '9.5', 'font-family': 'Arial', 'text-anchor': 'middle' }));
    }

    /* ------------------------------------------------------------
       Exercice 6 : Skieur (m = 80 kg) tracté par une perche,
       plan incliné α = 20°, frottement f = 40 N, force F à β = 15°
       de la pente, vitesse constante
       ------------------------------------------------------------ */
    function drawGraph6() {
        var svg = document.getElementById('graph6');
        if (!svg) return;
        clearSvg(svg);

        var W = 420, H = 240;
        setupResponsive(svg, W, H, 420);
        svg.appendChild(svgEl('rect', { x: 0, y: 0, width: W, height: H, fill: '#0D1117' }));

        var ox = 60, oy = 200;
        var angle = 20 * Math.PI / 180;
        var beta = 15 * Math.PI / 180;
        var runLen = 280;
        var bx = ox + runLen * Math.cos(angle);
        var by = oy - runLen * Math.sin(angle);

        svg.appendChild(svgEl('line', { x1: 14, y1: oy, x2: ox, y2: oy, stroke: '#2A2A3E', 'stroke-width': 2 }));
        groundHatch(svg, 14, oy, ox, oy, 3, '#2A2A3E');
        svg.appendChild(svgEl('line', { x1: ox, y1: oy, x2: ox + 60, y2: oy, stroke: '#1A1A2E', 'stroke-width': 1, 'stroke-dasharray': '3,3' }));
        svg.appendChild(svgEl('line', { x1: ox, y1: oy, x2: bx, y2: by, stroke: '#2A2A3E', 'stroke-width': 2.5 }));

        inclineAngleArc(svg, ox, oy, 30, angle, '#F4D03F');
        svg.appendChild(text(ox + 36, oy - 8, 'α = 20°', { fill: '#F4D03F', 'font-size': '10.5', 'font-family': 'Arial', 'font-weight': '700' }));

        // Skieur sur la pente
        var t = 0.48;
        var px = ox + t * (bx - ox), py = oy - t * (oy - by);
        var nx = -Math.sin(angle), ny = -Math.cos(angle);
        var cxp = px + nx * 13, cyp = py + ny * 13;
        svg.appendChild(svgEl('circle', { cx: cxp, cy: cyp, r: 9, fill: '#F4D03F' }));
        svg.appendChild(svgEl('line', {
            x1: cxp - 16 * Math.cos(angle), y1: cyp + 16 * Math.sin(angle),
            x2: cxp + 16 * Math.cos(angle), y2: cyp - 16 * Math.sin(angle),
            stroke: '#F4D03F', 'stroke-width': 2, 'stroke-linecap': 'round'
        }));

        // P
        arrow(svg, cxp, cyp, cxp, cyp + 48, '#FF6B6B', 2.2);
        svg.appendChild(text(cxp + 6, cyp + 60, 'P', { fill: '#FF6B6B', 'font-size': '13', 'font-family': 'Arial', 'font-weight': '700' }));

        // R
        arrow(svg, cxp, cyp, cxp + nx * 44, cyp + ny * 44, '#4ECDC4', 2.2);
        svg.appendChild(text(cxp + nx * 44 - 22, cyp + ny * 44 - 4, 'R', { fill: '#4ECDC4', 'font-size': '13', 'font-family': 'Arial', 'font-weight': '700' }));

        // f (frottement, le long de la pente, vers le bas — s'oppose au mouvement)
        var fx = -Math.cos(angle), fy = Math.sin(angle);
        arrow(svg, cxp, cyp, cxp + fx * 34, cyp + fy * 34, '#F4D03F', 2);
        svg.appendChild(text(cxp + fx * 34 - 18, cyp + fy * 34 + 12, 'f', { fill: '#F4D03F', 'font-size': '12', 'font-family': 'Arial', 'font-weight': '700' }));

        // F (perche), à l'angle β au-dessus de la pente
        var thetaF = -beta;
        var dcos = Math.cos(angle), dsin = -Math.sin(angle);
        var Fx = dcos * Math.cos(thetaF) - dsin * Math.sin(thetaF);
        var Fy = dcos * Math.sin(thetaF) + dsin * Math.cos(thetaF);
        arrow(svg, cxp, cyp, cxp + Fx * 58, cyp + Fy * 58, '#4D9DE0', 2.4);
        svg.appendChild(text(cxp + Fx * 58 + 6, cyp + Fy * 58 - 4, 'F', { fill: '#4D9DE0', 'font-size': '13', 'font-family': 'Arial', 'font-weight': '700' }));

        // Angle β entre la pente et F
        var rB = 22;
        var pD = { x: cxp + dcos * rB, y: cyp + dsin * rB };
        var pF = { x: cxp + Fx * rB, y: cyp + Fy * rB };
        svg.appendChild(svgEl('path', { d: 'M ' + pD.x + ' ' + pD.y + ' A ' + rB + ' ' + rB + ' 0 0 1 ' + pF.x + ' ' + pF.y, fill: 'none', stroke: '#BB8FCE', 'stroke-width': 1.4 }));
        svg.appendChild(text(cxp + dcos * (rB + 24) + 2, cyp + dsin * (rB + 24) - 10, 'β', { fill: '#BB8FCE', 'font-size': '11', 'font-family': 'Arial', 'font-weight': '700' }));

        svg.appendChild(text(W / 2, 18, 'Remonte-pente : α = 20°, β = 15°', { fill: '#888888', 'font-size': '10', 'font-family': 'Arial', 'text-anchor': 'middle' }));
        svg.appendChild(text(W / 2, 33, 'm = 80 kg, f = 40 N, vitesse constante', { fill: '#888888', 'font-size': '9.5', 'font-family': 'Arial', 'text-anchor': 'middle' }));
    }

    function initAll() {
        drawGraph1();
        drawGraph2();
        drawGraph3();
        drawGraph4();
        drawGraph5();
        drawGraph6();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAll);
    } else {
        initAll();
    }

    window.addEventListener('resize', function () {
        // Les SVG sont responsives via viewBox ; rien à recalculer au resize.
    });
})();

