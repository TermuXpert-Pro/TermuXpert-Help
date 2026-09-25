// ============================================================
// figuresvt_ex6.js — Exercice 6 : Pendule simple - vitesse à l'équilibre
// Fichier self-contained (aucune dépendance à svg-utils.js)
// ============================================================
(function () {
    'use strict';

    var SVG_NS = 'http://www.w3.org/2000/svg';

    function elx(tag, attrs) {
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
        var t = elx('text', Object.assign({
            x: x, y: y, 'text-anchor': 'middle',
            'font-family': 'Arial, sans-serif'
        }, attrs || {}));
        t.textContent = str;
        return t;
    }

    function arrowLine(x1, y1, x2, y2, color, width) {
        var g = elx('g');
        g.appendChild(elx('line', {
            x1: x1, y1: y1, x2: x2, y2: y2,
            stroke: color, 'stroke-width': width || 2, 'stroke-linecap': 'round'
        }));
        var angle = Math.atan2(y2 - y1, x2 - x1);
        var headLen = 7;
        var p1x = x2 - headLen * Math.cos(angle - Math.PI / 6);
        var p1y = y2 - headLen * Math.sin(angle - Math.PI / 6);
        var p2x = x2 - headLen * Math.cos(angle + Math.PI / 6);
        var p2y = y2 - headLen * Math.sin(angle + Math.PI / 6);
        g.appendChild(elx('polygon', {
            points: x2 + ',' + y2 + ' ' + p1x + ',' + p1y + ' ' + p2x + ',' + p2y,
            fill: color
        }));
        return g;
    }

    function drawGraph6() {
        var container = document.getElementById('graph6');
        if (!container) return;

        var W = 420, H = 260;
        container.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
        container.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        container.setAttribute('width', '100%');
        container.style.display = 'block';
        container.style.background = '#0D1117';
        container.style.borderRadius = '4px';
        while (container.firstChild) container.removeChild(container.firstChild);

        var TEAL = '#4ECDC4';
        var RED = '#FF6B6B';
        var GOLD = '#F4D03F';
        var GRAY = '#8b949e';

        container.appendChild(elx('rect', { x: 0, y: 0, width: W, height: H, fill: '#0D1117' }));

        var O = { x: 240, y: 28 };
        var L = 170;
        var alphaDeg = 70;
        var alphaRad = alphaDeg * Math.PI / 180;

        var B = { x: O.x, y: O.y + L };
        var A = { x: O.x - L * Math.sin(alphaRad), y: O.y + L * Math.cos(alphaRad) };

        // Point fixe (attache du fil)
        container.appendChild(elx('line', { x1: O.x - 14, y1: O.y - 8, x2: O.x + 14, y2: O.y - 8, stroke: GRAY, 'stroke-width': 2 }));
        for (var i = -3; i <= 3; i++) {
            container.appendChild(elx('line', { x1: O.x + i * 5, y1: O.y - 8, x2: O.x + i * 5 - 5, y2: O.y - 2, stroke: GRAY, 'stroke-width': 1 }));
        }
        container.appendChild(elx('circle', { cx: O.x, cy: O.y, r: 2.5, fill: GRAY }));

        // Verticale de référence (pointillée) — position d'équilibre
        container.appendChild(elx('line', {
            x1: O.x, y1: O.y, x2: B.x, y2: B.y,
            stroke: '#30363d', 'stroke-width': 1.2, 'stroke-dasharray': '4,3'
        }));

        // Arc de trajectoire (pointillé) de A à B
        var arcStartX = O.x + L * Math.sin(0) * -1; // point B relatif angle 0
        container.appendChild(elx('path', {
            d: 'M ' + A.x + ' ' + A.y + ' A ' + L + ' ' + L + ' 0 0 1 ' + B.x + ' ' + B.y,
            fill: 'none', stroke: TEAL, 'stroke-width': 1.2, 'stroke-dasharray': '3,4'
        }));

        // Fil en position A (écarté)
        container.appendChild(elx('line', { x1: O.x, y1: O.y, x2: A.x, y2: A.y, stroke: '#c9d1d9', 'stroke-width': 1.6 }));
        // Fil en position B (équilibre)
        container.appendChild(elx('line', { x1: O.x, y1: O.y, x2: B.x, y2: B.y, stroke: '#c9d1d9', 'stroke-width': 1.6 }));

        // Angle alpha au point O
        var arcR = 34;
        container.appendChild(elx('path', {
            d: 'M ' + (O.x) + ' ' + (O.y + arcR) + ' A ' + arcR + ' ' + arcR + ' 0 0 1 ' + (O.x - arcR * Math.sin(alphaRad)) + ' ' + (O.y + arcR * Math.cos(alphaRad)),
            fill: 'none', stroke: RED, 'stroke-width': 1.4
        }));
        container.appendChild(text(O.x - 20, O.y + 46, 'α = 70°', { fill: RED, 'font-size': 11, 'font-weight': '600' }));

        // Hauteur h = L(1 - cos α) : ligne horizontale au niveau de A jusqu'à la verticale, puis h vers B
        container.appendChild(elx('line', {
            x1: A.x, y1: A.y, x2: B.x, y2: A.y,
            stroke: GOLD, 'stroke-width': 1.2, 'stroke-dasharray': '3,3'
        }));
        container.appendChild(elx('line', {
            x1: B.x + 3, y1: A.y, x2: B.x + 3, y2: B.y,
            stroke: GOLD, 'stroke-width': 1.6
        }));
        container.appendChild(text(B.x + 18, (A.y + B.y) / 2 + 4, 'h', { fill: GOLD, 'font-size': 12, 'font-style': 'italic', 'font-weight': '700' }));

        // Bille en A
        container.appendChild(elx('circle', { cx: A.x, cy: A.y, r: 7, fill: TEAL, 'fill-opacity': '0.85', stroke: TEAL, 'stroke-width': 1.5 }));
        container.appendChild(text(A.x - 26, A.y - 6, 'A', { fill: TEAL, 'font-size': 13, 'font-weight': '700' }));
        container.appendChild(text(A.x - 30, A.y + 10, 'vA = 0', { fill: TEAL, 'font-size': 10 }));

        // Bille en B
        container.appendChild(elx('circle', { cx: B.x, cy: B.y, r: 7, fill: RED, 'fill-opacity': '0.85', stroke: RED, 'stroke-width': 1.5 }));
        container.appendChild(text(B.x + 16, B.y - 8, 'B', { fill: RED, 'font-size': 13, 'font-weight': '700' }));
        // Vitesse en B (horizontale, au passage à l'équilibre)
        container.appendChild(arrowLine(B.x + 12, B.y + 4, B.x + 52, B.y + 4, RED, 2.2));
        container.appendChild(text(B.x + 70, B.y + 8, 'vB = ?', { fill: RED, 'font-size': 10.5, 'text-anchor': 'start' }));

        // Fil
        container.appendChild(text(O.x + 32, O.y + L / 2 - 20, 'L = 1,00 m', { fill: '#c9d1d9', 'font-size': 10.5 }));

        container.appendChild(text(W / 2, H - 8, 'm = 200 g — sans frottement — g = 10 N/kg', { fill: GRAY, 'font-size': 9.5 }));
    }

    document.addEventListener('DOMContentLoaded', function () {
        setTimeout(drawGraph6, 300);
    });
})();

