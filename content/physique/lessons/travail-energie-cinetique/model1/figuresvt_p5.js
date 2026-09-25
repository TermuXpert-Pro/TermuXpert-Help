/* ============================================================
   figuresvt_p5.js
   Figures SVG - Partie 5 : Exercices d'application
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

    function arrow(svg, x1, y1, x2, y2, color, widthPx) {
        widthPx = widthPx || 2;
        svg.appendChild(svgEl('line', { x1: x1, y1: y1, x2: x2, y2: y2, stroke: color, 'stroke-width': widthPx }));
        var ang = Math.atan2(y2 - y1, x2 - x1);
        var head = 7;
        var p1x = x2 - head * Math.cos(ang - 0.4), p1y = y2 - head * Math.sin(ang - 0.4);
        var p2x = x2 - head * Math.cos(ang + 0.4), p2y = y2 - head * Math.sin(ang + 0.4);
        svg.appendChild(svgEl('polygon', { points: x2 + ',' + y2 + ' ' + p1x + ',' + p1y + ' ' + p2x + ',' + p2y, fill: color }));
    }

    /* ------------------------------------------------------------
       Exercice 1 : Solide (S), m=60kg, plan incliné α=15°, A -> B -> C
       AB = 100 m, VB = 45 km/h
       ------------------------------------------------------------ */
    function drawGraphExercice1() {
        var svg = document.getElementById('graphExercice1');
        if (!svg) return;
        clearSvg(svg);

        var W = 400, H = 200;
        setupResponsive(svg, W, H, 400);
        svg.appendChild(svgEl('rect', { x: 0, y: 0, width: W, height: H, fill: '#0D1117' }));

        var ox = 55, oy = H - 30;
        var angle = 15 * Math.PI / 180;

        // Plan incliné A -> B
        var bx = ox + 240, by = oy - 240 * Math.tan(angle);
        svg.appendChild(svgEl('line', { x1: ox, y1: oy, x2: bx, y2: by, stroke: '#2A2A3E', 'stroke-width': 2.5 }));
        // Plan horizontal B -> C
        var cx2 = bx + 90;
        svg.appendChild(svgEl('line', { x1: bx, y1: by, x2: cx2, y2: by, stroke: '#2A2A3E', 'stroke-width': 2.5 }));

        // Solide (carré) sur le plan incliné
        var sfrac = 0.3;
        var sx = ox + 240 * sfrac, sy = oy - 240 * sfrac * Math.tan(angle) - 14;
        svg.appendChild(svgEl('rect', { x: sx - 10, y: sy - 10, width: 20, height: 20, fill: '#4ECDC4', stroke: '#2A2A3E', 'stroke-width': 1 }));

        // Points A, B, C
        svg.appendChild(svgEl('circle', { cx: ox, cy: oy, r: 4, fill: '#4ECDC4' }));
        svg.appendChild(text(ox - 6, oy - 12, 'A', { fill: '#FFFFFF', 'font-size': '12', 'font-family': 'Arial', 'font-weight': '700' }));

        svg.appendChild(svgEl('circle', { cx: bx, cy: by, r: 4, fill: '#FF6B6B' }));
        svg.appendChild(text(bx + 4, by - 10, 'B', { fill: '#FFFFFF', 'font-size': '12', 'font-family': 'Arial', 'font-weight': '700' }));

        svg.appendChild(svgEl('circle', { cx: cx2, cy: by, r: 4, fill: '#BB8FCE' }));
        svg.appendChild(text(cx2 + 4, by - 10, 'C', { fill: '#FFFFFF', 'font-size': '12', 'font-family': 'Arial', 'font-weight': '700' }));

        // Angle α
        svg.appendChild(svgEl('path', { d: 'M ' + (ox + 26) + ' ' + oy + ' A 26 26 0 0 1 ' + (ox + 26 * Math.cos(angle)) + ' ' + (oy - 26 * Math.sin(angle)), fill: 'none', stroke: '#BB8FCE', 'stroke-width': 1.3 }));
        svg.appendChild(text(ox + 30, oy - 10, 'α', { fill: '#BB8FCE', 'font-size': '12', 'font-family': 'Arial', 'font-weight': '700' }));

        svg.appendChild(text(W / 2, 18, 'Plan incliné α = 15° — AB = 100 m', { fill: '#888888', 'font-size': '10', 'font-family': 'Arial', 'text-anchor': 'middle' }));
        svg.appendChild(text(W / 2, 33, 'Solide (S), m = 60 kg', { fill: '#888888', 'font-size': '9.5', 'font-family': 'Arial', 'text-anchor': 'middle' }));
    }

    /* ------------------------------------------------------------
       Exercice 2 (NOUVELLE) : lancer vertical vers le haut
       m = 2 kg, V0 = 10 m/s, hauteur max atteinte h = 5 m
       ------------------------------------------------------------ */
    function drawGraphExercice2() {
        var svg = document.getElementById('graphExercice2');
        if (!svg) return;
        clearSvg(svg);

        var W = 240, H = 260;
        setupResponsive(svg, W, H, 240);
        svg.appendChild(svgEl('rect', { x: 0, y: 0, width: W, height: H, fill: '#0D1117' }));

        var cx = W / 2;
        var groundY = H - 30;
        var topY = 34;

        // Sol
        svg.appendChild(svgEl('line', { x1: 20, y1: groundY, x2: W - 20, y2: groundY, stroke: '#2A2A3E', 'stroke-width': 2 }));
        for (var hx = 20; hx <= W - 20; hx += 10) {
            svg.appendChild(svgEl('line', { x1: hx, y1: groundY, x2: hx - 6, y2: groundY + 8, stroke: '#2A2A3E', 'stroke-width': 1 }));
        }

        // Trajectoire verticale (pointillé)
        svg.appendChild(svgEl('line', { x1: cx, y1: groundY - 4, x2: cx, y2: topY, stroke: '#2A2A3E', 'stroke-width': 1, 'stroke-dasharray': '2,4' }));

        // Solide en bas (position initiale)
        svg.appendChild(svgEl('circle', { cx: cx, cy: groundY - 12, r: 10, fill: '#4ECDC4' }));
        svg.appendChild(text(cx + 16, groundY - 8, 'V₀ = 10 m/s', { fill: '#4ECDC4', 'font-size': '9', 'font-family': 'Arial' }));

        // Vecteur vitesse initiale (flèche vers le haut)
        arrow(svg, cx, groundY - 24, cx, groundY - 60, '#A8FF78', 2);

        // Solide en haut (position finale, hauteur max)
        svg.appendChild(svgEl('circle', { cx: cx, cy: topY + 8, r: 10, fill: 'none', stroke: '#F4D03F', 'stroke-width': 1.5, 'stroke-dasharray': '3,3' }));
        svg.appendChild(text(cx + 16, topY + 12, 'V = 0', { fill: '#F4D03F', 'font-size': '9', 'font-family': 'Arial' }));

        // Flèche hauteur h
        var hx1 = cx - 45;
        arrow(svg, hx1, groundY - 4, hx1, topY + 8, '#FF6B6B', 1.5);
        arrow(svg, hx1, topY + 8, hx1, groundY - 4, '#FF6B6B', 1.5);
        svg.appendChild(text(hx1 - 16, (groundY + topY) / 2, 'h', { fill: '#FF6B6B', 'font-size': '13', 'font-family': 'Arial', 'font-weight': '700' }));

        svg.appendChild(text(cx, 18, 'Lancer vertical — m = 2 kg', { fill: '#888888', 'font-size': '9.5', 'font-family': 'Arial', 'text-anchor': 'middle' }));
    }

    /* ------------------------------------------------------------
       Exercice 3 (NOUVELLE) : plan incliné α = 30°, h = 2 m, sans
       frottement, A (repos) -> B
       ------------------------------------------------------------ */
    function drawGraphExercice3() {
        var svg = document.getElementById('graphExercice3');
        if (!svg) return;
        clearSvg(svg);

        var W = 320, H = 210;
        setupResponsive(svg, W, H, 320);
        svg.appendChild(svgEl('rect', { x: 0, y: 0, width: W, height: H, fill: '#0D1117' }));

        var angle = 30 * Math.PI / 180;
        var ax = 60, ay = 40;
        var length = 210;
        var bx = ax + length * Math.cos(angle), by = ay + length * Math.sin(angle);

        // Plan incliné A -> B
        svg.appendChild(svgEl('line', { x1: ax, y1: ay, x2: bx, y2: by, stroke: '#2A2A3E', 'stroke-width': 2.5 }));
        // Base horizontale (pour visualiser la hauteur)
        svg.appendChild(svgEl('line', { x1: ax, y1: by, x2: bx, y2: by, stroke: '#1A1A2E', 'stroke-width': 1, 'stroke-dasharray': '3,3' }));
        // Hauteur verticale h
        svg.appendChild(svgEl('line', { x1: ax, y1: ay, x2: ax, y2: by, stroke: '#A8FF78', 'stroke-width': 1.5, 'stroke-dasharray': '4,3' }));
        svg.appendChild(text(ax - 22, (ay + by) / 2, 'h = 2 m', { fill: '#A8FF78', 'font-size': '10', 'font-family': 'Arial', 'font-weight': '700' }));

        // Solide en A (départ, repos)
        svg.appendChild(svgEl('circle', { cx: ax, cy: ay, r: 8, fill: '#4ECDC4' }));
        svg.appendChild(text(ax - 6, ay - 14, 'A', { fill: '#FFFFFF', 'font-size': '12', 'font-family': 'Arial', 'font-weight': '700' }));
        svg.appendChild(text(ax + 10, ay + 4, 'V=0', { fill: '#4ECDC4', 'font-size': '8', 'font-family': 'Arial' }));

        // Solide en B (arrivée)
        svg.appendChild(svgEl('circle', { cx: bx, cy: by, r: 8, fill: '#FF6B6B' }));
        svg.appendChild(text(bx + 10, by + 4, 'B', { fill: '#FFFFFF', 'font-size': '12', 'font-family': 'Arial', 'font-weight': '700' }));

        // Angle α
        svg.appendChild(svgEl('path', { d: 'M ' + (ax + 30) + ' ' + ay + ' A 30 30 0 0 1 ' + (ax + 30 * Math.cos(angle)) + ' ' + (ay + 30 * Math.sin(angle)), fill: 'none', stroke: '#BB8FCE', 'stroke-width': 1.3 }));
        svg.appendChild(text(ax + 34, ay + 14, 'α', { fill: '#BB8FCE', 'font-size': '12', 'font-family': 'Arial', 'font-weight': '700' }));

        svg.appendChild(text(W / 2, 18, 'Plan incliné sans frottement, α = 30°', { fill: '#888888', 'font-size': '9.5', 'font-family': 'Arial', 'text-anchor': 'middle' }));
        svg.appendChild(text(W / 2, H - 8, 'm = 500 g', { fill: '#888888', 'font-size': '9', 'font-family': 'Arial', 'text-anchor': 'middle' }));
    }

    /* ------------------------------------------------------------
       Exercice 4 (NOUVELLE) : cylindre en rotation, P = 10 W,
       m = 2 kg, r = 20 cm, force tangentielle F à N=10 tr/s (uniforme)
       ------------------------------------------------------------ */
    function drawGraphExercice4() {
        var svg = document.getElementById('graphExercice4');
        if (!svg) return;
        clearSvg(svg);

        var W = 320, H = 220;
        setupResponsive(svg, W, H, 320);
        svg.appendChild(svgEl('rect', { x: 0, y: 0, width: W, height: H, fill: '#0D1117' }));

        var cx = W / 2, cy = H / 2 + 10;
        var R = 55;

        // Axe (Δ)
        svg.appendChild(svgEl('line', { x1: cx, y1: cy - R - 20, x2: cx, y2: cy + R + 20, stroke: '#FF6B6B', 'stroke-width': 2, 'stroke-dasharray': '6,4' }));
        svg.appendChild(text(cx + 10, cy - R - 8, '(Δ)', { fill: '#FF6B6B', 'font-size': '12', 'font-family': 'Arial', 'font-weight': '700' }));

        // Cylindre (vu de face)
        svg.appendChild(svgEl('circle', { cx: cx, cy: cy, r: R, fill: '#4ECDC422', stroke: '#4ECDC4', 'stroke-width': 2.5 }));
        svg.appendChild(svgEl('circle', { cx: cx, cy: cy, r: 3, fill: '#4ECDC4' }));

        // Rayon r
        arrow(svg, cx, cy, cx + R * Math.cos(-0.4), cy + R * Math.sin(-0.4), '#F4D03F', 1.5);
        svg.appendChild(text(cx + R * Math.cos(-0.4) / 2 + 6, cy + R * Math.sin(-0.4) / 2 - 4, 'r = 20 cm', { fill: '#F4D03F', 'font-size': '9.5', 'font-family': 'Arial', 'font-weight': '700' }));

        // Force F tangentielle à la circonférence
        var tanAngle = 0; // point à droite du cylindre
        var px = cx + R, py = cy;
        arrow(svg, px, py, px, py - 40, '#A8FF78', 2.2);
        svg.appendChild(text(px + 6, py - 24, 'F', { fill: '#A8FF78', 'font-size': '13', 'font-family': 'Arial', 'font-weight': '700' }));

        // Flèche de rotation
        var arcR = R + 14;
        var a1 = -1.2, a2 = 0.5;
        var startX = cx + arcR * Math.cos(a1), startY = cy + arcR * Math.sin(a1);
        var endX = cx + arcR * Math.cos(a2), endY = cy + arcR * Math.sin(a2);
        svg.appendChild(svgEl('path', { d: 'M ' + startX + ' ' + startY + ' A ' + arcR + ' ' + arcR + ' 0 0 1 ' + endX + ' ' + endY, fill: 'none', stroke: '#BB8FCE', 'stroke-width': 1.8 }));
        var angEnd = Math.atan2(endY - cy, endX - cx) + Math.PI / 2;
        var hx1 = endX - 7 * Math.cos(angEnd - 0.5), hy1 = endY - 7 * Math.sin(angEnd - 0.5);
        var hx2 = endX - 7 * Math.cos(angEnd + 0.9), hy2 = endY - 7 * Math.sin(angEnd + 0.9);
        svg.appendChild(svgEl('polygon', { points: endX + ',' + endY + ' ' + hx1 + ',' + hy1 + ' ' + hx2 + ',' + hy2, fill: '#BB8FCE' }));
        svg.appendChild(text(cx - arcR - 6, cy - 4, 'ω', { fill: '#BB8FCE', 'font-size': '12', 'font-family': 'Arial', 'font-weight': '700' }));

        svg.appendChild(text(cx, 18, 'Cylindre en rotation — m = 2 kg, r = 20 cm', { fill: '#888888', 'font-size': '9.5', 'font-family': 'Arial', 'text-anchor': 'middle' }));
        svg.appendChild(text(cx, H - 8, 'Puissance du moteur P = 10 W', { fill: '#888888', 'font-size': '9', 'font-family': 'Arial', 'text-anchor': 'middle' }));
    }

    /* ------------------------------------------------------------
       Exercice 5 : Pendule simple, m=200g, L=1m, θ0=60°
       ------------------------------------------------------------ */
    function drawGraphPendule() {
        var svg = document.getElementById('graphPendule');
        if (!svg) return;
        clearSvg(svg);

        var W = 300, H = 200;
        setupResponsive(svg, W, H, 300);
        svg.appendChild(svgEl('rect', { x: 0, y: 0, width: W, height: H, fill: '#0D1117' }));

        var cx = W / 2, cy = 40;
        var L = 128;
        var angle = 60 * Math.PI / 180;
        var x1 = cx + L * Math.sin(angle), y1 = cy + L * Math.cos(angle);

        // Fil (position écartée)
        svg.appendChild(svgEl('line', { x1: cx, y1: cy, x2: x1, y2: y1, stroke: '#2A2A3E', 'stroke-width': 1.5 }));
        // Fil vertical (position d'équilibre, pointillé)
        svg.appendChild(svgEl('line', { x1: cx, y1: cy, x2: cx, y2: cy + L, stroke: '#2A2A3E', 'stroke-width': 1, 'stroke-dasharray': '4,4' }));

        // Bille en bas (position d'équilibre - transparente)
        svg.appendChild(svgEl('circle', { cx: cx, cy: cy + L, r: 11, fill: 'none', stroke: '#4ECDC4', 'stroke-width': 1.3, 'stroke-dasharray': '3,3' }));

        // Bille (position écartée)
        svg.appendChild(svgEl('circle', { cx: x1, cy: y1, r: 12, fill: '#F4D03F' }));

        // Centre O
        svg.appendChild(svgEl('circle', { cx: cx, cy: cy, r: 4, fill: '#FF6B6B' }));
        svg.appendChild(text(cx + 8, cy + 4, 'O', { fill: '#FFFFFF', 'font-size': '10', 'font-family': 'Arial' }));

        // Angle theta0
        svg.appendChild(svgEl('path', { d: 'M ' + cx + ' ' + (cy + 26) + ' A 26 26 0 0 1 ' + (cx + 26 * Math.sin(angle)) + ' ' + (cy + 26 * Math.cos(angle)), fill: 'none', stroke: '#BB8FCE', 'stroke-width': 1.3 }));
        svg.appendChild(text(cx + 16, cy + 22, 'θ₀', { fill: '#BB8FCE', 'font-size': '11', 'font-family': 'Arial', 'font-weight': '700' }));

        svg.appendChild(text(cx, 18, 'Pendule simple — θ₀ = 60°, L = 1 m', { fill: '#888888', 'font-size': '9.5', 'font-family': 'Arial', 'text-anchor': 'middle' }));
    }

    function initAll() {
        drawGraphExercice1();
        drawGraphExercice2();
        drawGraphExercice3();
        drawGraphExercice4();
        drawGraphPendule();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAll);
    } else {
        initAll();
    }
})();

