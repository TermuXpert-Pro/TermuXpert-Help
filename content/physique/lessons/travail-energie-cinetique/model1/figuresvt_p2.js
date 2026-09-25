/* ============================================================
   figuresvt_p2.js
   Figures SVG - Partie 2 : Énergie cinétique d'un solide en rotation
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

    /* Petite aide : dessine une flèche (ligne + pointe triangulaire) */
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
       Figure 1 (Introduction) : Moment d'inertie, masse proche / éloignée
       ------------------------------------------------------------ */
    function drawGraphInertieLife() {
        var svg = document.getElementById('graphInertieLife');
        if (!svg) return;
        clearSvg(svg);

        var W = 400, H = 210;
        setupResponsive(svg, W, H);
        svg.appendChild(svgEl('rect', { x: 0, y: 0, width: W, height: H, fill: '#0D1117' }));

        var cx = W / 2, cy = H / 2 + 14;

        // Axe de rotation (Δ)
        svg.appendChild(svgEl('line', { x1: cx, y1: 30, x2: cx, y2: H - 15, stroke: '#FF6B6B', 'stroke-width': 2.5, 'stroke-dasharray': '6,4' }));
        svg.appendChild(text(cx + 12, 44, '(Δ)', { fill: '#FF6B6B', 'font-size': '13', 'font-family': 'Arial', 'font-weight': '700' }));

        // Cercle intérieur (masse proche)
        svg.appendChild(svgEl('circle', { cx: cx, cy: cy, r: 32, fill: 'none', stroke: '#4ECDC4', 'stroke-width': 2 }));
        svg.appendChild(svgEl('circle', { cx: cx, cy: cy, r: 8, fill: '#4ECDC4' }));
        svg.appendChild(text(cx + 13, cy + 4, 'm', { fill: '#FFFFFF', 'font-size': '10', 'font-family': 'Arial' }));
        svg.appendChild(text(cx - 60, cy + 55, 'r petit → J petit', { fill: '#4ECDC4', 'font-size': '9.5', 'font-family': 'Arial', 'font-weight': '700' }));

        // Cercle extérieur (masse éloignée)
        svg.appendChild(svgEl('circle', { cx: cx, cy: cy, r: 74, fill: 'none', stroke: '#FFD93D', 'stroke-width': 2 }));
        svg.appendChild(svgEl('circle', { cx: cx + 74, cy: cy, r: 8, fill: '#FFD93D' }));
        svg.appendChild(text(cx + 87, cy + 4, 'm', { fill: '#FFFFFF', 'font-size': '10', 'font-family': 'Arial' }));
        svg.appendChild(text(cx + 14, cy + 48, 'r grand → J grand', { fill: '#FFD93D', 'font-size': '9.5', 'font-family': 'Arial', 'font-weight': '700' }));

        // Rayon r (flèche)
        arrow(svg, cx, cy, cx + 74, cy, '#A8FF78', 1.5);
        svg.appendChild(text((cx + cx + 74) / 2 - 6, cy - 8, 'r', { fill: '#A8FF78', 'font-size': '11', 'font-family': 'Arial', 'font-weight': '700' }));

        // Titre
        svg.appendChild(text(cx, 18, "Plus la masse est éloignée de l'axe, plus J est grand", { fill: '#888888', 'font-size': '9.5', 'font-family': 'Arial', 'text-anchor': 'middle' }));
    }

    /* ------------------------------------------------------------
       Figure 2 (Démonstration) : solide en rotation, points A1 A2 A3
       ------------------------------------------------------------ */
    function drawGraphRotation() {
        var svg = document.getElementById('graphRotation');
        if (!svg) return;
        clearSvg(svg);

        var W = 400, H = 240;
        setupResponsive(svg, W, H);
        svg.appendChild(svgEl('rect', { x: 0, y: 0, width: W, height: H, fill: '#0D1117' }));

        var cx = W / 2, cy = H / 2 + 12;
        var r = 82;

        // Axe (Δ)
        svg.appendChild(svgEl('line', { x1: cx, y1: 28, x2: cx, y2: H - 15, stroke: '#FF6B6B', 'stroke-width': 2.5, 'stroke-dasharray': '6,4' }));
        svg.appendChild(text(cx + 12, 42, '(Δ)', { fill: '#FF6B6B', 'font-size': '13', 'font-family': 'Arial', 'font-weight': '700' }));

        // Cercle (trajectoire)
        svg.appendChild(svgEl('circle', { cx: cx, cy: cy, r: r, fill: 'none', stroke: '#4ECDC4', 'stroke-width': 1.5 }));

        var points = [
            { angle: 0, label: 'A₁', color: '#4ECDC4' },
            { angle: Math.PI / 3, label: 'A₂', color: '#F4D03F' },
            { angle: 2 * Math.PI / 3, label: 'A₃', color: '#A8FF78' }
        ];
        points.forEach(function (p) {
            var x = cx + r * Math.cos(p.angle);
            var y = cy + r * Math.sin(p.angle);
            svg.appendChild(svgEl('line', { x1: cx, y1: cy, x2: x, y2: y, stroke: '#2A2A3E', 'stroke-width': 1, 'stroke-dasharray': '3,3' }));
            svg.appendChild(svgEl('circle', { cx: x, cy: y, r: 6, fill: p.color }));
            svg.appendChild(text(x + 9, y - 6, p.label, { fill: '#FFFFFF', 'font-size': '12', 'font-family': 'Arial', 'font-weight': '700' }));
        });

        // Centre O
        svg.appendChild(svgEl('circle', { cx: cx, cy: cy, r: 4, fill: '#BB8FCE' }));
        svg.appendChild(text(cx + 9, cy + 4, 'O', { fill: '#FFFFFF', 'font-size': '11', 'font-family': 'Arial' }));

        svg.appendChild(text(cx, 16, "Solide en rotation autour de l'axe (Δ)", { fill: '#888888', 'font-size': '9.5', 'font-family': 'Arial', 'text-anchor': 'middle' }));
    }

    /* ------------------------------------------------------------
       Figure 3 : Moments d'inertie (disque, anneau, sphère)
       ------------------------------------------------------------ */
    function drawGraphInertie() {
        var svg = document.getElementById('graphInertie');
        if (!svg) return;
        clearSvg(svg);

        var W = 400, H = 210;
        setupResponsive(svg, W, H);
        svg.appendChild(svgEl('rect', { x: 0, y: 0, width: W, height: H, fill: '#0D1117' }));

        svg.appendChild(text(W / 2, 18, "Moments d'inertie de solides homogènes", { fill: '#888888', 'font-size': '10', 'font-family': 'Arial', 'text-anchor': 'middle' }));

        var cy = 115;

        // Disque
        var cx1 = 75;
        svg.appendChild(svgEl('circle', { cx: cx1, cy: cy, r: 40, fill: '#4ECDC422', stroke: '#4ECDC4', 'stroke-width': 2 }));
        svg.appendChild(text(cx1, cy - 55, 'Disque', { fill: '#4ECDC4', 'font-size': '11', 'font-family': 'Arial', 'text-anchor': 'middle', 'font-weight': '700' }));
        svg.appendChild(text(cx1, cy + 70, 'J = ½·m·R²', { fill: '#4ECDC4', 'font-size': '10.5', 'font-family': 'Arial', 'text-anchor': 'middle' }));

        // Anneau
        var cx2 = 200;
        svg.appendChild(svgEl('circle', { cx: cx2, cy: cy, r: 38, fill: 'none', stroke: '#FF6B6B', 'stroke-width': 4 }));
        svg.appendChild(text(cx2, cy - 55, 'Anneau', { fill: '#FF6B6B', 'font-size': '11', 'font-family': 'Arial', 'text-anchor': 'middle', 'font-weight': '700' }));
        svg.appendChild(text(cx2, cy + 70, 'J = m·R²', { fill: '#FF6B6B', 'font-size': '10.5', 'font-family': 'Arial', 'text-anchor': 'middle' }));

        // Sphère (avec 2 arcs internes pour effet de volume)
        var cx3 = 325;
        svg.appendChild(svgEl('circle', { cx: cx3, cy: cy, r: 38, fill: '#F4D03F22', stroke: '#F4D03F', 'stroke-width': 2 }));
        svg.appendChild(svgEl('ellipse', { cx: cx3, cy: cy, rx: 38, ry: 13, fill: 'none', stroke: '#F4D03F', 'stroke-width': 1, opacity: '0.7' }));
        svg.appendChild(svgEl('ellipse', { cx: cx3, cy: cy, rx: 13, ry: 38, fill: 'none', stroke: '#F4D03F', 'stroke-width': 1, opacity: '0.7' }));
        svg.appendChild(text(cx3, cy - 55, 'Sphère', { fill: '#F4D03F', 'font-size': '11', 'font-family': 'Arial', 'text-anchor': 'middle', 'font-weight': '700' }));
        svg.appendChild(text(cx3, cy + 70, 'J = ⅖·m·R²', { fill: '#F4D03F', 'font-size': '10.5', 'font-family': 'Arial', 'text-anchor': 'middle' }));
    }

    /* ------------------------------------------------------------
       Figure 4 (NOUVELLE - Application détaillée) :
       Disque m=800 g, r=30 cm, tournant à N=100 tr/min autour de (Δ)
       ------------------------------------------------------------ */
    function drawGraphAppliDisque() {
        var svg = document.getElementById('graphAppliDisque');
        if (!svg) return;
        clearSvg(svg);

        var W = 380, H = 210;
        setupResponsive(svg, W, H, 380);
        svg.appendChild(svgEl('rect', { x: 0, y: 0, width: W, height: H, fill: '#0D1117' }));

        var cx = W / 2, cy = H / 2 + 10;
        var R = 62;

        // Axe (Δ) perpendiculaire au disque, représenté en pointillés au centre
        svg.appendChild(svgEl('line', { x1: cx, y1: cy - R - 22, x2: cx, y2: cy + R + 22, stroke: '#FF6B6B', 'stroke-width': 2, 'stroke-dasharray': '6,4' }));
        svg.appendChild(text(cx + 10, cy - R - 10, '(Δ)', { fill: '#FF6B6B', 'font-size': '12', 'font-family': 'Arial', 'font-weight': '700' }));

        // Disque
        svg.appendChild(svgEl('circle', { cx: cx, cy: cy, r: R, fill: '#4ECDC422', stroke: '#4ECDC4', 'stroke-width': 2.5 }));
        svg.appendChild(svgEl('circle', { cx: cx, cy: cy, r: 3.5, fill: '#4ECDC4' }));

        // Rayon r
        arrow(svg, cx, cy, cx + R * Math.cos(-0.5), cy + R * Math.sin(-0.5), '#F4D03F', 1.5);
        svg.appendChild(text(cx + R * Math.cos(-0.5) / 2 + 4, cy + R * Math.sin(-0.5) / 2 - 6, 'r = 0,3 m', { fill: '#F4D03F', 'font-size': '10', 'font-family': 'Arial', 'font-weight': '700' }));

        // Flèche de rotation (arc + tête)
        var arcR = R + 16;
        var a1 = -1.3, a2 = 0.4;
        var startX = cx + arcR * Math.cos(a1), startY = cy + arcR * Math.sin(a1);
        var endX = cx + arcR * Math.cos(a2), endY = cy + arcR * Math.sin(a2);
        var largeArc = 0;
        svg.appendChild(svgEl('path', {
            d: 'M ' + startX + ' ' + startY + ' A ' + arcR + ' ' + arcR + ' 0 ' + largeArc + ' 1 ' + endX + ' ' + endY,
            fill: 'none', stroke: '#A8FF78', 'stroke-width': 2
        }));
        var ang = Math.atan2(endY - cy, endX - cx) + Math.PI / 2;
        var headLen = 8;
        var hx1 = endX - headLen * Math.cos(ang - 0.5), hy1 = endY - headLen * Math.sin(ang - 0.5);
        var hx2 = endX - headLen * Math.cos(ang + 0.9), hy2 = endY - headLen * Math.sin(ang + 0.9);
        svg.appendChild(svgEl('polygon', { points: endX + ',' + endY + ' ' + hx1 + ',' + hy1 + ' ' + hx2 + ',' + hy2, fill: '#A8FF78' }));
        svg.appendChild(text(cx + arcR + 8, cy - 8, 'ω', { fill: '#A8FF78', 'font-size': '13', 'font-family': 'Arial', 'font-weight': '700' }));

        // Données
        svg.appendChild(text(cx, 18, 'm = 800 g   |   r = 30 cm   |   N = 100 tr/min', { fill: '#888888', 'font-size': '10', 'font-family': 'Arial', 'text-anchor': 'middle' }));
        svg.appendChild(text(cx, H - 6, 'Disque en rotation autour de son axe (Δ)', { fill: '#888888', 'font-size': '9.5', 'font-family': 'Arial', 'text-anchor': 'middle' }));
    }

    function initAll() {
        drawGraphInertieLife();
        drawGraphRotation();
        drawGraphInertie();
        drawGraphAppliDisque();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAll);
    } else {
        initAll();
    }
})();

