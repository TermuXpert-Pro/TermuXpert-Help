/* ============================================================
   figuresvt_p1.js
   Figures SVG - Partie 1 : Énergie cinétique d'un solide en translation
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

    function setupResponsive(svg, w, h) {
        svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        svg.style.width = '100%';
        svg.style.height = 'auto';
        svg.style.maxWidth = w + 'px';
        svg.style.display = 'block';
        svg.style.margin = '0 auto';
        svg.style.background = '#0D1117';
        svg.style.borderRadius = '4px';
    }

    /* ------------------------------------------------------------
       Figure 1 : E_C = 1/2 . m . V^2  (parabole, m = 1 kg)
       ------------------------------------------------------------ */
    function drawGraphEnergie() {
        var svg = document.getElementById('graphEnergie');
        if (!svg) return;
        clearSvg(svg);

        var W = 400, H = 220;
        setupResponsive(svg, W, H);

        svg.appendChild(svgEl('rect', { x: 0, y: 0, width: W, height: H, fill: '#0D1117' }));

        var ox = 55, oy = H - 34;
        var maxV = 5, maxEc = 12.5; // Ec(5) = 0.5*1*25 = 12.5
        var scaleX = (W - ox - 25) / maxV;
        var scaleY = (oy - 46) / maxEc;

        // Axes
        svg.appendChild(svgEl('line', { x1: ox, y1: oy, x2: W - 15, y2: oy, stroke: '#2A2A3E', 'stroke-width': 1.5 }));
        svg.appendChild(svgEl('line', { x1: ox, y1: 20, x2: ox, y2: oy, stroke: '#2A2A3E', 'stroke-width': 1.5 }));

        // Grille verticale + graduations V
        for (var v = 1; v <= maxV; v++) {
            var xg = ox + v * scaleX;
            svg.appendChild(svgEl('line', { x1: xg, y1: 20, x2: xg, y2: oy, stroke: '#1A1A2E', 'stroke-width': 0.5 }));
            svg.appendChild(text(xg - 3, oy + 14, String(v), { fill: '#888888', 'font-size': '9', 'font-family': 'Arial' }));
        }
        // Grille horizontale + graduations E_C
        for (var e = 2; e <= 12; e += 2) {
            var yg = oy - e * scaleY;
            svg.appendChild(svgEl('line', { x1: ox, y1: yg, x2: W - 15, y2: yg, stroke: '#1A1A2E', 'stroke-width': 0.5 }));
            svg.appendChild(text(ox - 22, yg + 3, String(e), { fill: '#888888', 'font-size': '9', 'font-family': 'Arial' }));
        }

        // Labels des axes
        svg.appendChild(text(W - 46, oy + 28, 'V (m/s)', { fill: '#4ECDC4', 'font-size': '11', 'font-weight': '700', 'font-family': 'Arial' }));
        svg.appendChild(text(ox + 6, 16, 'E_C (J)', { fill: '#4ECDC4', 'font-size': '11', 'font-weight': '700', 'font-family': 'Arial' }));

        // Courbe (parabole)
        var d = '';
        for (var vv = 0; vv <= maxV; vv += 0.05) {
            var x = ox + vv * scaleX;
            var y = oy - (0.5 * 1 * vv * vv) * scaleY;
            d += (vv === 0 ? 'M' : 'L') + x.toFixed(1) + ',' + y.toFixed(1) + ' ';
        }
        svg.appendChild(svgEl('path', { d: d, fill: 'none', stroke: '#A8FF78', 'stroke-width': 2.5, 'stroke-linecap': 'round' }));

        // Points remarquables
        for (var vp = 1; vp <= maxV; vp++) {
            var ec = 0.5 * vp * vp;
            var xp = ox + vp * scaleX;
            var yp = oy - ec * scaleY;
            svg.appendChild(svgEl('circle', { cx: xp, cy: yp, r: 4, fill: '#4ECDC4' }));
            svg.appendChild(text(xp - 16, yp - 8, '(' + vp + ', ' + ec.toFixed(1) + ')', { fill: '#FFFFFF', 'font-size': '8', 'font-family': 'Arial' }));
        }

        // Légende
        svg.appendChild(text(ox + 55, 34, 'E_C = ½·m·V²  (m = 1 kg)', { fill: '#A8FF78', 'font-size': '11', 'font-weight': '700', 'font-family': 'Arial' }));
        svg.appendChild(text(ox + 55, 48, 'La courbe est une parabole :', { fill: '#888888', 'font-size': '9', 'font-family': 'Arial' }));
        svg.appendChild(text(ox + 55, 60, "E_C augmente avec le carré de V", { fill: '#888888', 'font-size': '9', 'font-family': 'Arial' }));
    }

    function initAll() {
        drawGraphEnergie();
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
