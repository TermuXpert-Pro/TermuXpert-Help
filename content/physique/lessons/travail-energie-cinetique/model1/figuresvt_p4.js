/* ============================================================
   figuresvt_p4.js
   Figures SVG - Partie 4 : Théorème de l'énergie cinétique - Activité 2
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
       Figure 1 (NOUVELLE) : Dispositif expérimental - bille d'acier
       maintenue par un électroaimant, chute libre verticale sur h.
       ------------------------------------------------------------ */
    function drawGraphChuteSetup() {
        var svg = document.getElementById('graphChuteSetup');
        if (!svg) return;
        clearSvg(svg);

        var W = 260, H = 260;
        setupResponsive(svg, W, H, 260);
        svg.appendChild(svgEl('rect', { x: 0, y: 0, width: W, height: H, fill: '#0D1117' }));

        var topY = 34, botY = H - 34;
        var cx = W / 2;

        // Support fixe (électroaimant) en haut
        svg.appendChild(svgEl('rect', { x: cx - 26, y: topY - 14, width: 52, height: 16, rx: 3, fill: '#2A2A3E', stroke: '#888888', 'stroke-width': 1 }));
        svg.appendChild(text(cx, topY - 20, 'Électroaimant', { fill: '#888888', 'font-size': '9', 'font-family': 'Arial', 'text-anchor': 'middle' }));
        // Hachures du support (mur)
        for (var hx = cx - 24; hx <= cx + 24; hx += 8) {
            svg.appendChild(svgEl('line', { x1: hx, y1: topY - 14, x2: hx - 6, y2: topY - 20, stroke: '#888888', 'stroke-width': 1 }));
        }

        // Bille (position initiale, pointillé) en haut
        svg.appendChild(svgEl('circle', { cx: cx, cy: topY + 12, r: 10, fill: 'none', stroke: '#4ECDC4', 'stroke-width': 1.3, 'stroke-dasharray': '3,3' }));
        svg.appendChild(text(cx + 16, topY + 8, 'position initiale', { fill: '#4ECDC4', 'font-size': '8.5', 'font-family': 'Arial' }));

        // Ligne verticale de référence (trajectoire)
        svg.appendChild(svgEl('line', { x1: cx, y1: topY + 12, x2: cx, y2: botY - 12, stroke: '#2A2A3E', 'stroke-width': 1, 'stroke-dasharray': '2,4' }));

        // Bille (position finale, pleine) en bas
        svg.appendChild(svgEl('circle', { cx: cx, cy: botY - 12, r: 12, fill: '#F4D03F' }));
        svg.appendChild(text(cx + 18, botY - 8, 'bille (m = 100 g)', { fill: '#F4D03F', 'font-size': '8.5', 'font-family': 'Arial' }));

        // Flèche de hauteur h (à côté)
        var hx1 = cx - 55;
        arrow(svg, hx1, topY + 12, hx1, botY - 12, '#A8FF78', 1.5);
        arrow(svg, hx1, botY - 12, hx1, topY + 12, '#A8FF78', 1.5);
        svg.appendChild(text(hx1 - 14, (topY + botY) / 2, 'h', { fill: '#A8FF78', 'font-size': '13', 'font-family': 'Arial', 'font-weight': '700' }));

        // Flèche de chute (vers le bas, à droite de la trajectoire)
        arrow(svg, cx + 30, topY + 20, cx + 30, botY - 30, '#FF6B6B', 2);
        svg.appendChild(text(cx + 40, (topY + botY) / 2, 'g', { fill: '#FF6B6B', 'font-size': '12', 'font-family': 'Arial', 'font-weight': '700' }));

        svg.appendChild(text(cx, H - 8, 'Chute libre verticale (sans vitesse initiale)', { fill: '#888888', 'font-size': '9', 'font-family': 'Arial', 'text-anchor': 'middle' }));
    }

    /* ------------------------------------------------------------
       Figure 2 : Courbe v^2 = f(h)  (droite passant par l'origine, a = 2g)
       ------------------------------------------------------------ */
    function drawGraphActivite2() {
        var svg = document.getElementById('graphActivite2');
        if (!svg) return;
        clearSvg(svg);

        var W = 450, H = 280;
        setupResponsive(svg, W, H, 450);
        svg.appendChild(svgEl('rect', { x: 0, y: 0, width: W, height: H, fill: '#0D1117' }));

        var ox = 68, oy = H - 40;
        var scaleX = 320, scaleY = 200 / 20; // h in [0,1] -> 320px ; v2 in [0,20] -> 200px

        // Axes
        svg.appendChild(svgEl('line', { x1: ox, y1: oy, x2: W - 15, y2: oy, stroke: '#2A2A3E', 'stroke-width': 1.5 }));
        svg.appendChild(svgEl('line', { x1: ox, y1: 20, x2: ox, y2: oy, stroke: '#2A2A3E', 'stroke-width': 1.5 }));

        svg.appendChild(text(W - 46, oy + 22, 'h (m)', { fill: '#4ECDC4', 'font-size': '12', 'font-family': 'Arial', 'font-weight': '700' }));
        svg.appendChild(text(ox + 8, 16, 'v² (m²/s²)', { fill: '#4ECDC4', 'font-size': '12', 'font-family': 'Arial', 'font-weight': '700' }));

        // Grille + graduations
        for (var i = 0; i <= 10; i += 2) {
            var x = ox + (i / 10) * scaleX;
            svg.appendChild(svgEl('line', { x1: x, y1: 20, x2: x, y2: oy, stroke: '#1A1A2E', 'stroke-width': 0.5 }));
            svg.appendChild(text(x - 6, oy + 16, (i / 10).toFixed(1), { fill: '#888888', 'font-size': '8', 'font-family': 'Arial' }));
        }
        for (var j = 0; j <= 20; j += 4) {
            var y = oy - j * scaleY;
            svg.appendChild(svgEl('line', { x1: ox, y1: y, x2: W - 15, y2: y, stroke: '#1A1A2E', 'stroke-width': 0.5 }));
            svg.appendChild(text(ox - 20, y + 4, String(j), { fill: '#888888', 'font-size': '8', 'font-family': 'Arial' }));
        }

        var data = [
            { h: 0, v2: 0 }, { h: 0.10, v2: 1.96 }, { h: 0.20, v2: 3.92 },
            { h: 0.40, v2: 7.84 }, { h: 0.60, v2: 11.76 }, { h: 0.80, v2: 15.68 }, { h: 1.00, v2: 19.60 }
        ];

        var d = '';
        data.forEach(function (p, idx) {
            var x = ox + p.h * scaleX;
            var y = oy - p.v2 * scaleY;
            d += (idx === 0 ? 'M' : 'L') + x.toFixed(1) + ',' + y.toFixed(1) + ' ';
        });
        svg.appendChild(svgEl('path', { d: d, fill: 'none', stroke: '#A8FF78', 'stroke-width': 2.5 }));

        data.forEach(function (p) {
            var x = ox + p.h * scaleX;
            var y = oy - p.v2 * scaleY;
            svg.appendChild(svgEl('circle', { cx: x, cy: y, r: 5, fill: '#4ECDC4' }));
            if (p.h > 0) {
                svg.appendChild(text(x - 26, y - 10, '(' + p.h.toFixed(2) + ', ' + p.v2.toFixed(2) + ')', { fill: '#FFFFFF', 'font-size': '8', 'font-family': 'Arial' }));
            }
        });

        // Ligne pointillée illustrant le coefficient directeur (entre h=0.1 et h=0.4)
        var x1c = ox + 0.10 * scaleX, y1c = oy - 1.96 * scaleY;
        var x2c = ox + 0.40 * scaleX, y2c = oy - 7.84 * scaleY;
        svg.appendChild(svgEl('line', { x1: x1c, y1: y1c, x2: x2c, y2: y2c, stroke: '#FF6B6B', 'stroke-width': 1, 'stroke-dasharray': '4,4' }));

        svg.appendChild(text(ox + 90, 38, 'v² = 19,6·h', { fill: '#A8FF78', 'font-size': '11', 'font-family': 'Arial', 'font-weight': '700' }));
        svg.appendChild(text(ox + 90, 52, "(droite passant par l'origine)", { fill: '#888888', 'font-size': '9', 'font-family': 'Arial' }));
        svg.appendChild(text(ox + 90, 66, 'a = Δv²/Δh = 19,6 m/s² = 2g', { fill: '#FF6B6B', 'font-size': '9', 'font-family': 'Arial' }));
    }

    function initAll() {
        drawGraphChuteSetup();
        drawGraphActivite2();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAll);
    } else {
        initAll();
    }
})();

