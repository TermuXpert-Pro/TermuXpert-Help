/* ============================================================
   figuresvt_ex3.js — Devoir Surveillé N°1 (Physique-Chimie)
   Chimie : flacon de dihydrogène dans les conditions normales
   Fichier autonome (self-contained) : aucune dépendance à une
   librairie partagée (svg-utils.js).

   Figure dessinée :
     - fig3_flacon : flacon fermé contenant H2 (T.N.P.T),
                     avec ses données (V, θ, P) annotées.
   ============================================================ */
(function () {
    'use strict';
    var NS = 'http://www.w3.org/2000/svg';

    function el(tag, attrs) {
        var e = document.createElementNS(NS, tag);
        for (var k in attrs) { if (attrs.hasOwnProperty(k)) e.setAttribute(k, attrs[k]); }
        return e;
    }
    function text(x, y, str, attrs) {
        var t = el('text', Object.assign({ x: x, y: y, 'font-family': "'Cairo','Segoe UI',sans-serif" }, attrs || {}));
        t.textContent = str;
        return t;
    }
    function setResponsive(svg, w, h) {
        svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        svg.removeAttribute('width');
        svg.removeAttribute('height');
        svg.style.width = '100%';
        svg.style.height = 'auto';
        svg.style.display = 'block';
    }
    function clear(svg) { while (svg.firstChild) svg.removeChild(svg.firstChild); }

    /* ============================================================
       fig3_flacon : flacon fermé (bouchon) rempli de H2, avec
       petites molécules H2 dispersées à l'intérieur, et les
       données de l'énoncé annotées autour.
       ============================================================ */
    function drawFlacon(svg) {
        var w = 320, h = 240;
        setResponsive(svg, w, h);
        clear(svg);
        svg.id = svg.id || 'fig3_flacon';

        var cx = 160;
        var bodyTop = 90, bodyBottom = 195, bodyLeft = 105, bodyRight = 215;
        var neckTop = 55, neckLeft = 140, neckRight = 180;

        // Corps du flacon
        svg.appendChild(el('path', {
            d: 'M ' + neckLeft + ',' + neckTop +
               ' L ' + neckLeft + ',' + (bodyTop + 5) +
               ' Q ' + bodyLeft + ',' + (bodyTop + 5) + ' ' + bodyLeft + ',' + (bodyTop + 30) +
               ' L ' + bodyLeft + ',' + (bodyBottom - 15) +
               ' Q ' + bodyLeft + ',' + bodyBottom + ' ' + (bodyLeft + 15) + ',' + bodyBottom +
               ' L ' + (bodyRight - 15) + ',' + bodyBottom +
               ' Q ' + bodyRight + ',' + bodyBottom + ' ' + bodyRight + ',' + (bodyBottom - 15) +
               ' L ' + bodyRight + ',' + (bodyTop + 30) +
               ' Q ' + bodyRight + ',' + (bodyTop + 5) + ' ' + neckRight + ',' + (bodyTop + 5) +
               ' L ' + neckRight + ',' + neckTop + ' Z',
            fill: 'rgba(78,205,196,0.08)', stroke: '#4ECDC4', 'stroke-width': 2.2
        }));

        // Bouchon
        svg.appendChild(el('rect', { x: neckLeft - 4, y: neckTop - 14, width: (neckRight - neckLeft) + 8, height: 16, rx: 3, fill: '#BB8FCE', opacity: 0.7 }));

        // Molécules H2 (petites paires de points reliées) dispersées dans le flacon
        var molecules = [
            [135, 120], [175, 105], [150, 150], [190, 140], [130, 175],
            [180, 175], [160, 125], [200, 165], [140, 140], [170, 160]
        ];
        molecules.forEach(function (p) {
            var dx = 5, dy = (Math.random() - 0.5) * 4;
            svg.appendChild(el('line', { x1: p[0] - dx, y1: p[1], x2: p[0] + dx, y2: p[1] + dy, stroke: '#F4D03F', 'stroke-width': 1.4 }));
            svg.appendChild(el('circle', { cx: p[0] - dx, cy: p[1], r: 3, fill: '#F4D03F' }));
            svg.appendChild(el('circle', { cx: p[0] + dx, cy: p[1] + dy, r: 3, fill: '#F4D03F' }));
        });

        // Étiquette H2
        svg.appendChild(text(cx, bodyBottom + 20, 'H₂', { fill: '#F4D03F', 'font-size': 14, 'font-weight': 700, 'text-anchor': 'middle' }));

        // Annotations des données (à droite)
        var infoX = 240, infoY = 95;
        [
            'V = 1,5 L',
            'θ = 0°C',
            'P = 1,01325.10⁵ Pa'
        ].forEach(function (line, i) {
            svg.appendChild(text(infoX, infoY + i * 18, line, { fill: '#8B96A5', 'font-size': 11 }));
        });
        svg.appendChild(el('line', { x1: infoX - 12, y1: infoY - 12, x2: infoX - 12, y2: infoY + 42, stroke: '#3A4552', 'stroke-width': 1 }));

        svg.appendChild(text(w / 2, h - 10, 'Flacon de dihydrogène dans les conditions normales (T.N.P.T)', { fill: '#8B96A5', 'font-size': 9.5, 'text-anchor': 'middle' }));
    }

    /* ---------- Initialisation ---------- */
    function init() {
        var map = { fig3_flacon: drawFlacon };
        Object.keys(map).forEach(function (id) {
            var svg = document.getElementById(id);
            if (svg) {
                try { map[id](svg); } catch (e) { console.error('figuresvt_ex3:', id, e); }
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    window.addEventListener('resize', init);
})();
