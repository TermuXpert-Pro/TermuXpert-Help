// ============================================================
// figuresvt_ex4.js — Exercice 4 : Bille lancée verticalement (chute libre)
// Fichier self-contained (aucune dépendance à svg-utils.js)
// ============================================================
(function () {
    'use strict';

    var SVG_NS = 'http://www.w3.org/2000/svg';

    function el(tag, attrs) {
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
        var t = el('text', Object.assign({
            x: x, y: y, 'text-anchor': 'middle',
            'font-family': 'Arial, sans-serif'
        }, attrs || {}));
        t.textContent = str;
        return t;
    }

    function arrowLine(x1, y1, x2, y2, color, width) {
        var g = el('g');
        g.appendChild(el('line', {
            x1: x1, y1: y1, x2: x2, y2: y2,
            stroke: color, 'stroke-width': width || 2, 'stroke-linecap': 'round'
        }));
        var angle = Math.atan2(y2 - y1, x2 - x1);
        var headLen = 7;
        var p1x = x2 - headLen * Math.cos(angle - Math.PI / 6);
        var p1y = y2 - headLen * Math.sin(angle - Math.PI / 6);
        var p2x = x2 - headLen * Math.cos(angle + Math.PI / 6);
        var p2y = y2 - headLen * Math.sin(angle + Math.PI / 6);
        g.appendChild(el('polygon', {
            points: x2 + ',' + y2 + ' ' + p1x + ',' + p1y + ' ' + p2x + ',' + p2y,
            fill: color
        }));
        return g;
    }

    function drawGraph4() {
        var container = document.getElementById('graph4');
        if (!container) return;

        var W = 380, H = 280;
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

        container.appendChild(el('rect', { x: 0, y: 0, width: W, height: H, fill: '#0D1117' }));

        // Échelle verticale : 0 → 7,0 m mappé entre le sol et le haut du cadre
        var groundY = 248, topY = 34;
        var zBmax = 7.0;
        var scale = (groundY - topY) / zBmax;
        function yOf(z) { return groundY - z * scale; }

        var axisX = 130;

        // Sol
        container.appendChild(el('line', { x1: 30, y1: groundY, x2: 300, y2: groundY, stroke: GRAY, 'stroke-width': 1.4 }));
        for (var i = 0; i < 12; i++) {
            var hx = 30 + i * 24;
            container.appendChild(el('line', { x1: hx, y1: groundY, x2: hx - 7, y2: groundY + 8, stroke: GRAY, 'stroke-width': 1 }));
        }

        // Trajectoire verticale (pointillée) entre O et B
        container.appendChild(el('line', {
            x1: axisX, y1: groundY, x2: axisX, y2: yOf(zBmax),
            stroke: '#30363d', 'stroke-width': 1.4, 'stroke-dasharray': '4,4'
        }));

        // Repères d'altitude (guides horizontaux + étiquettes)
        [0, 2.0, 7.0].forEach(function (z) {
            var y = yOf(z);
            container.appendChild(el('line', { x1: axisX - 55, y1: y, x2: axisX, y2: y, stroke: '#30363d', 'stroke-width': 1, 'stroke-dasharray': '2,3' }));
        });

        // Point O (sol, z = 0)
        container.appendChild(el('circle', { cx: axisX, cy: yOf(0), r: 5, fill: TEAL }));
        container.appendChild(text(axisX + 16, yOf(0) + 4, 'O', { fill: TEAL, 'font-size': 12.5, 'font-weight': '700', 'text-anchor': 'start' }));
        container.appendChild(text(axisX - 60, yOf(0) + 4, 'z₀ = 0', { fill: GRAY, 'font-size': 10, 'text-anchor': 'end' }));

        // Point A (lancer, z = 2,0 m) — vitesse initiale vers le haut
        container.appendChild(el('circle', { cx: axisX, cy: yOf(2.0), r: 5, fill: GOLD }));
        container.appendChild(text(axisX + 16, yOf(2.0) + 4, 'A', { fill: GOLD, 'font-size': 12.5, 'font-weight': '700', 'text-anchor': 'start' }));
        container.appendChild(text(axisX - 60, yOf(2.0) + 4, 'zA = 2,0 m', { fill: GRAY, 'font-size': 10, 'text-anchor': 'end' }));
        container.appendChild(arrowLine(axisX + 34, yOf(2.0) + 4, axisX + 34, yOf(2.0) - 30, GOLD, 2.2));
        container.appendChild(text(axisX + 46, yOf(2.0) - 16, 'vA = 10 m/s', { fill: GOLD, 'font-size': 10, 'text-anchor': 'start' }));

        // Point B (sommet, v = 0)
        container.appendChild(el('circle', { cx: axisX, cy: yOf(zBmax), r: 5, fill: RED }));
        container.appendChild(text(axisX + 16, yOf(zBmax) + 4, 'B', { fill: RED, 'font-size': 12.5, 'font-weight': '700', 'text-anchor': 'start' }));
        container.appendChild(text(axisX - 60, yOf(zBmax) + 4, 'zB = 7,0 m', { fill: GRAY, 'font-size': 10, 'text-anchor': 'end' }));
        container.appendChild(text(axisX + 46, yOf(zBmax) + 4, 'vB = 0', { fill: RED, 'font-size': 10, 'text-anchor': 'start' }));

        // Vitesse de retour au sol (v0) — flèche vers le bas, légèrement décalée
        container.appendChild(arrowLine(axisX - 34, yOf(0) - 30, axisX - 34, yOf(0) - 2, RED, 2.2));
        container.appendChild(text(axisX - 46, yOf(0) - 34, 'v₀ ≈ 11,8 m/s', { fill: RED, 'font-size': 10, 'text-anchor': 'end' }));

        // Légende
        container.appendChild(text(W / 2, H - 10, 'Chute libre : seul le poids agit — g = 10 N/kg', { fill: GRAY, 'font-size': 9.5 }));
    }

    document.addEventListener('DOMContentLoaded', function () {
        setTimeout(drawGraph4, 300);
    });
})();

