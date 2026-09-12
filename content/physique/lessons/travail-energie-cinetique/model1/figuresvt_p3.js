/* ============================================================
   figuresvt_p3.js
   Figures SVG - Partie 3 : Théorème de l'énergie cinétique - Activité 1
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
       Figure 1 : Enregistrement des positions G0..G7 sur le plan
       incliné (autoporteur), avec G3G4=21mm, G4G5=27mm, G5G6=33mm etc.
       ------------------------------------------------------------ */
    function drawGraphActivite() {
        var svg = document.getElementById('graphActivite');
        if (!svg) return;
        clearSvg(svg);

        var W = 460, H = 220;
        setupResponsive(svg, W, H, 460);
        svg.appendChild(svgEl('rect', { x: 0, y: 0, width: W, height: H, fill: '#0D1117' }));

        var ox = 55, oy = H - 45;
        var spacing = 46; // espacement horizontal régulier (temps constant)

        // Ligne du plan incliné (support visuel)
        svg.appendChild(svgEl('line', { x1: ox - 15, y1: oy + 8, x2: W - 20, y2: oy - 60, stroke: '#2A2A3E', 'stroke-width': 2 }));

        // Distances réelles (mm) entre points successifs, cumulées pour la position
        var gaps = [0, 3, 9, 15, 21, 27, 33, 39]; // G0G1..G6G7, G0 = 0
        var labels = ['G₀', 'G₁', 'G₂', 'G₃', 'G₄', 'G₅', 'G₆', 'G₇'];
        var cum = 0;
        var xs = [], ys = [];
        for (var i = 0; i < gaps.length; i++) {
            cum += gaps[i];
            var x = ox + i * spacing;
            var y = oy - cum * 0.55 - 8;
            xs.push(x); ys.push(y);
        }

        for (var i2 = 0; i2 < labels.length; i2++) {
            var isHL = (i2 === 3 || i2 === 5);
            var color = isHL ? '#F4D03F' : '#4ECDC4';
            svg.appendChild(svgEl('circle', { cx: xs[i2], cy: ys[i2], r: isHL ? 6 : 5, fill: color }));
            svg.appendChild(text(xs[i2] - 9, ys[i2] + 20, labels[i2], { fill: '#FFFFFF', 'font-size': '10', 'font-family': 'Arial' }));
        }

        // Accolade / flèche entre G3 et G5
        svg.appendChild(svgEl('path', {
            d: 'M ' + xs[3] + ' ' + (ys[3] - 14) + ' L ' + xs[5] + ' ' + (ys[5] - 14),
            fill: 'none', stroke: '#FF6B6B', 'stroke-width': 2, 'stroke-dasharray': '4,4'
        }));
        svg.appendChild(text((xs[3] + xs[5]) / 2 - 20, ys[3] - 22, 'G₃ → G₅', { fill: '#FF6B6B', 'font-size': '11', 'font-family': 'Arial', 'font-weight': '700' }));

        // Légende
        svg.appendChild(text(W / 2, 18, 'Enregistrement des positions successives (Δt = 60 ms)', { fill: '#888888', 'font-size': '9.5', 'font-family': 'Arial', 'text-anchor': 'middle' }));
        svg.appendChild(text(W / 2, 33, '● Positions G₃ et G₅ (en jaune)', { fill: '#F4D03F', 'font-size': '9.5', 'font-family': 'Arial', 'text-anchor': 'middle' }));
    }

    /* ------------------------------------------------------------
       Figure 2 : Bilan des forces sur l'autoporteur (P, R, plan incliné α=10°)
       ------------------------------------------------------------ */
    function drawGraphForces() {
        var svg = document.getElementById('graphForces');
        if (!svg) return;
        clearSvg(svg);

        var W = 380, H = 210;
        setupResponsive(svg, W, H, 380);
        svg.appendChild(svgEl('rect', { x: 0, y: 0, width: W, height: H, fill: '#0D1117' }));

        var cx = W / 2, cy = H / 2 + 22;
        var angle = 10 * Math.PI / 180;
        var pivotX = cx - 20, pivotY = cy - 10;

        // Plan incliné (support de l'autoporteur)
        var x1p = pivotX - 130, y1p = pivotY + 130 * Math.tan(angle);
        var x2p = pivotX + 90, y2p = pivotY - 90 * Math.tan(angle);
        svg.appendChild(svgEl('line', { x1: x1p, y1: y1p, x2: x2p, y2: y2p, stroke: '#2A2A3E', 'stroke-width': 2.5 }));

        // Autoporteur (cercle)
        svg.appendChild(svgEl('circle', { cx: pivotX, cy: pivotY, r: 18, fill: '#4ECDC4' }));

        // Poids P (vertical vers le bas)
        arrow(svg, pivotX, pivotY + 8, pivotX, pivotY + 65, '#F4D03F', 2.5);
        svg.appendChild(text(pivotX + 8, pivotY + 62, 'P', { fill: '#F4D03F', 'font-size': '14', 'font-family': 'Arial', 'font-weight': '700' }));

        // Réaction R (perpendiculaire au plan)
        var perpAngle = Math.PI / 2 - angle;
        var rx = pivotX + 42 * Math.cos(-perpAngle);
        var ry = pivotY + 42 * Math.sin(-perpAngle);
        arrow(svg, pivotX, pivotY, rx, ry, '#A8FF78', 2.5);
        svg.appendChild(text(rx + 8, ry - 4, 'R', { fill: '#A8FF78', 'font-size': '14', 'font-family': 'Arial', 'font-weight': '700' }));

        // Angle α
        svg.appendChild(svgEl('path', {
            d: 'M ' + (pivotX + 26 * Math.cos(Math.PI + angle)) + ' ' + (pivotY + 26 * Math.sin(Math.PI + angle)) +
                ' A 26 26 0 0 1 ' + (pivotX - 26) + ' ' + pivotY,
            fill: 'none', stroke: '#BB8FCE', 'stroke-width': 1.3
        }));
        svg.appendChild(text(pivotX - 40, pivotY - 14, 'α', { fill: '#BB8FCE', 'font-size': '12', 'font-family': 'Arial', 'font-weight': '700' }));

        svg.appendChild(text(W / 2, 18, "Forces appliquées sur l'autoporteur (plan incliné α = 10°)", { fill: '#888888', 'font-size': '9.5', 'font-family': 'Arial', 'text-anchor': 'middle' }));
    }

    function initAll() {
        drawGraphActivite();
        drawGraphForces();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAll);
    } else {
        initAll();
    }
})();
