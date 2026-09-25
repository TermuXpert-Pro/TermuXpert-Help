/* ============================================================
   figuresvt_p6.js
   Figures SVG - Partie 6 : Résumé - Travail et énergie cinétique
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

    /* ------------------------------------------------------------
       Résumé 1 : E_C = 1/2 . m . V^2 (parabole condensée, m=1kg)
       ------------------------------------------------------------ */
    function drawGraphResume1() {
        var svg = document.getElementById('graphResume1');
        if (!svg) return;
        clearSvg(svg);

        var W = 350, H = 170;
        setupResponsive(svg, W, H, 350);
        svg.appendChild(svgEl('rect', { x: 0, y: 0, width: W, height: H, fill: '#0D1117' }));

        var ox = 42, oy = H - 26;
        var maxV = 6, maxEc = 18; // Ec(6)=18
        var scaleX = (W - ox - 15) / maxV;
        var scaleY = (oy - 20) / maxEc;

        svg.appendChild(svgEl('line', { x1: ox, y1: oy, x2: W - 10, y2: oy, stroke: '#2A2A3E', 'stroke-width': 1.5 }));
        svg.appendChild(svgEl('line', { x1: ox, y1: 10, x2: ox, y2: oy, stroke: '#2A2A3E', 'stroke-width': 1.5 }));

        svg.appendChild(text(W - 18, oy + 14, 'V', { fill: '#4ECDC4', 'font-size': '10', 'font-family': 'Arial', 'font-weight': '700' }));
        svg.appendChild(text(ox + 6, 12, 'E_C', { fill: '#4ECDC4', 'font-size': '10', 'font-family': 'Arial', 'font-weight': '700' }));

        var d = '';
        for (var v = 0; v <= maxV; v += 0.05) {
            var x = ox + v * scaleX;
            var y = oy - (0.5 * 1 * v * v) * scaleY;
            d += (v === 0 ? 'M' : 'L') + x.toFixed(1) + ',' + y.toFixed(1) + ' ';
        }
        svg.appendChild(svgEl('path', { d: d, fill: 'none', stroke: '#A8FF78', 'stroke-width': 2 }));

        svg.appendChild(text(W / 2 + 10, 24, 'E_C = ½·m·V²', { fill: '#888888', 'font-size': '10', 'font-family': 'Arial', 'text-anchor': 'middle' }));
    }

    /* ------------------------------------------------------------
       Résumé 2 : v^2 = 2g.h (droite passant par l'origine)
       ------------------------------------------------------------ */
    function drawGraphResume2() {
        var svg = document.getElementById('graphResume2');
        if (!svg) return;
        clearSvg(svg);

        var W = 350, H = 170;
        setupResponsive(svg, W, H, 350);
        svg.appendChild(svgEl('rect', { x: 0, y: 0, width: W, height: H, fill: '#0D1117' }));

        var ox = 42, oy = H - 26;
        var maxH = 1.0, maxV2 = 19.6;
        var scaleX = (W - ox - 15) / maxH;
        var scaleY = (oy - 20) / maxV2;

        svg.appendChild(svgEl('line', { x1: ox, y1: oy, x2: W - 10, y2: oy, stroke: '#2A2A3E', 'stroke-width': 1.5 }));
        svg.appendChild(svgEl('line', { x1: ox, y1: 10, x2: ox, y2: oy, stroke: '#2A2A3E', 'stroke-width': 1.5 }));

        svg.appendChild(text(W - 18, oy + 14, 'h', { fill: '#4ECDC4', 'font-size': '10', 'font-family': 'Arial', 'font-weight': '700' }));
        svg.appendChild(text(ox + 6, 12, 'v²', { fill: '#4ECDC4', 'font-size': '10', 'font-family': 'Arial', 'font-weight': '700' }));

        var x2 = ox + maxH * scaleX;
        var y2 = oy - 19.6 * maxH * scaleY;
        svg.appendChild(svgEl('line', { x1: ox, y1: oy, x2: x2, y2: y2, stroke: '#A8FF78', 'stroke-width': 2 }));

        svg.appendChild(text(W / 2 + 10, 24, 'v² = 2g·h', { fill: '#888888', 'font-size': '10', 'font-family': 'Arial', 'text-anchor': 'middle' }));
    }

    function initAll() {
        drawGraphResume1();
        drawGraphResume2();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAll);
    } else {
        initAll();
    }
})();

