// ============================================================
// figuresvt_ex3.js — Exercice 3 : Mobile en mouvement - Force de puissance constante
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

    // Petit véhicule schématique (mobile S)
    function mobileShape(cx, cy, color) {
        var g = el('g');
        g.appendChild(el('rect', { x: cx - 20, y: cy - 10, width: 40, height: 16, rx: 4, fill: color, 'fill-opacity': '0.22', stroke: color, 'stroke-width': 2 }));
        g.appendChild(el('circle', { cx: cx - 11, cy: cy + 7, r: 4, fill: color }));
        g.appendChild(el('circle', { cx: cx + 11, cy: cy + 7, r: 4, fill: color }));
        return g;
    }

    function drawGraph3() {
        var container = document.getElementById('graph3');
        if (!container) return;

        var W = 420, H = 200;
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

        var trackY = 130;
        container.appendChild(el('line', { x1: 25, y1: trackY + 18, x2: 395, y2: trackY + 18, stroke: GRAY, 'stroke-width': 1.4 }));
        for (var i = 0; i < 14; i++) {
            var hx = 25 + i * 27;
            container.appendChild(el('line', { x1: hx, y1: trackY + 18, x2: hx - 7, y2: trackY + 26, stroke: GRAY, 'stroke-width': 1 }));
        }

        // Position A (t = 0)
        var xA = 90;
        container.appendChild(mobileShape(xA, trackY, TEAL));
        container.appendChild(text(xA, trackY - 38, 't = 0', { fill: '#c9d1d9', 'font-size': 11.5, 'font-weight': '700' }));
        container.appendChild(arrowLine(xA + 22, trackY - 22, xA + 62, trackY - 22, TEAL, 2));
        container.appendChild(text(xA + 42, trackY - 28, 'v = 30 km/h', { fill: TEAL, 'font-size': 10.5 }));
        // Force F appliquée à t = 0, colinéaire au mouvement
        container.appendChild(arrowLine(xA + 22, trackY + 2, xA + 55, trackY + 2, RED, 2.4));
        container.appendChild(text(xA + 38, trackY + 16, 'F', { fill: RED, 'font-size': 12, 'font-style': 'italic', 'font-weight': '700' }));

        // Puissance constante (annotation centrale)
        container.appendChild(text(W / 2, 26, 'Puissance constante  P = 66 kW', {
            fill: GOLD, 'font-size': 12, 'font-weight': '700'
        }));
        container.appendChild(arrowLine(160, trackY, 260, trackY, GOLD, 1.6));
        container.appendChild(text((160 + 260) / 2, trackY - 8, 'Δt = 10 s', { fill: GOLD, 'font-size': 10.5 }));

        // Position B (t = 10 s) — vitesse plus grande
        var xB = 330;
        container.appendChild(mobileShape(xB, trackY, RED));
        container.appendChild(text(xB, trackY - 38, 't = 10 s', { fill: '#c9d1d9', 'font-size': 11.5, 'font-weight': '700' }));
        container.appendChild(arrowLine(xB + 22, trackY - 22, xB + 78, trackY - 22, RED, 2.6));
        container.appendChild(text(xB + 12, trackY - 30, "v' = ?", { fill: RED, 'font-size': 11, 'text-anchor': 'start' }));

        container.appendChild(text(W / 2, H - 10, 'Mouvement rectiligne — m = 1,5 × 10³ kg', { fill: GRAY, 'font-size': 10 }));
    }

    document.addEventListener('DOMContentLoaded', function () {
        setTimeout(drawGraph3, 300);
    });
})();

