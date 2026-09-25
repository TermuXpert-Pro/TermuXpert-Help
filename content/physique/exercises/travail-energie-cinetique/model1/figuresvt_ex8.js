// ============================================================
// figuresvt_ex8.js — Exercice 8 : Point matériel sur piste (AB incliné + arc BC + chute CD)
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

    function angleArc(cx, cy, r, startDeg, endDeg, color, label, labelR) {
        var g = elx('g');
        var s = (startDeg * Math.PI) / 180;
        var e2 = (endDeg * Math.PI) / 180;
        var x1 = cx + r * Math.cos(s), y1 = cy - r * Math.sin(s);
        var x2 = cx + r * Math.cos(e2), y2 = cy - r * Math.sin(e2);
        g.appendChild(elx('path', {
            d: 'M ' + x1 + ' ' + y1 + ' A ' + r + ' ' + r + ' 0 0 0 ' + x2 + ' ' + y2,
            fill: 'none', stroke: color, 'stroke-width': 1.4
        }));
        if (label) {
            var mid = (s + e2) / 2;
            var lr = labelR || (r + 12);
            g.appendChild(text(cx + lr * Math.cos(mid), cy - lr * Math.sin(mid), label, {
                fill: color, 'font-size': 10.5, 'font-style': 'italic', 'font-weight': '600'
            }));
        }
        return g;
    }

    function drawGraph8() {
        var container = document.getElementById('graph8');
        if (!container) return;

        var W = 420, H = 280;
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

        var groundY = 245;
        var A = { x: 45, y: groundY };
        var alphaDeg = 60, alphaRad = alphaDeg * Math.PI / 180;
        var ABpx = 128;
        var B = { x: A.x + ABpx * Math.cos(alphaRad), y: A.y - ABpx * Math.sin(alphaRad) };
        var r = 38;
        var I = { x: B.x + r, y: B.y };
        var C = { x: I.x, y: I.y + r };

        // Sol
        container.appendChild(elx('line', { x1: 15, y1: groundY, x2: 405, y2: groundY, stroke: GRAY, 'stroke-width': 1.2 }));
        for (var i = 0; i < 14; i++) {
            var hx = 15 + i * 28;
            container.appendChild(elx('line', { x1: hx, y1: groundY, x2: hx - 7, y2: groundY + 8, stroke: GRAY, 'stroke-width': 1 }));
        }

        // Rampe AB (remplissage + ligne)
        container.appendChild(elx('polygon', {
            points: A.x + ',' + A.y + ' ' + B.x + ',' + B.y + ' ' + A.x + ',' + B.y,
            fill: TEAL, 'fill-opacity': '0.06'
        }));
        container.appendChild(elx('line', { x1: A.x, y1: A.y, x2: B.x, y2: B.y, stroke: TEAL, 'stroke-width': 2.4 }));

        // Angle alpha
        container.appendChild(angleArc(A.x, A.y, 30, 0, alphaDeg, RED, 'α = 60°', 42));

        // Arc circulaire BC (centre I, rayon r)
        container.appendChild(elx('path', {
            d: 'M ' + B.x + ' ' + B.y + ' A ' + r + ' ' + r + ' 0 0 1 ' + C.x + ' ' + C.y,
            fill: 'none', stroke: TEAL, 'stroke-width': 2.4
        }));
        // Centre I + rayon
        container.appendChild(elx('circle', { cx: I.x, cy: I.y, r: 2.2, fill: GRAY }));
        container.appendChild(elx('line', { x1: I.x, y1: I.y, x2: C.x, y2: C.y, stroke: GRAY, 'stroke-width': 1, 'stroke-dasharray': '3,3' }));
        container.appendChild(text(I.x + 10, I.y - 6, 'I', { fill: GRAY, 'font-size': 11, 'font-weight': '700' }));
        container.appendChild(text((I.x + C.x) / 2 + 12, (I.y + C.y) / 2, 'r', { fill: GRAY, 'font-size': 10.5, 'font-style': 'italic' }));

        // Trajectoire de chute (C → D), en pointillé (parabole schématique)
        var D = { x: C.x + 120, y: groundY };
        var midCtrl = { x: C.x + 60, y: C.y - 6 };
        container.appendChild(elx('path', {
            d: 'M ' + C.x + ' ' + C.y + ' Q ' + midCtrl.x + ' ' + midCtrl.y + ' ' + D.x + ' ' + D.y,
            fill: 'none', stroke: RED, 'stroke-width': 1.6, 'stroke-dasharray': '5,4'
        }));

        // Points A, B, C, D
        container.appendChild(elx('circle', { cx: A.x, cy: A.y, r: 4, fill: TEAL }));
        container.appendChild(text(A.x - 4, A.y + 16, 'A', { fill: TEAL, 'font-size': 12.5, 'font-weight': '700' }));
        container.appendChild(elx('circle', { cx: B.x, cy: B.y, r: 4, fill: TEAL }));
        container.appendChild(text(B.x - 12, B.y - 4, 'B', { fill: TEAL, 'font-size': 12.5, 'font-weight': '700' }));
        container.appendChild(elx('circle', { cx: C.x, cy: C.y, r: 4, fill: TEAL }));
        container.appendChild(text(C.x + 4, C.y + 16, 'C', { fill: TEAL, 'font-size': 12.5, 'font-weight': '700' }));
        container.appendChild(elx('circle', { cx: D.x, cy: D.y, r: 4, fill: RED }));
        container.appendChild(text(D.x + 4, D.y + 16, 'D', { fill: RED, 'font-size': 12.5, 'font-weight': '700' }));

        // Vitesse initiale vA (le long de la pente, vers B)
        var ux = Math.cos(alphaRad), uy = -Math.sin(alphaRad);
        container.appendChild(arrowLine(A.x + ux * 14, A.y + uy * 14, A.x + ux * 44, A.y + uy * 44, TEAL, 2.2));
        container.appendChild(text(A.x + ux * 56 + 10, A.y + uy * 56, 'vA = 6 m/s', { fill: TEAL, 'font-size': 9.5, 'text-anchor': 'start' }));

        // Frottement f sur AB (opposé au mouvement, vers A)
        var midAB = { x: (A.x + B.x) / 2, y: (A.y + B.y) / 2 };
        container.appendChild(arrowLine(midAB.x + 10, midAB.y - 6, midAB.x - ux * 24 + 10, midAB.y - uy * 24 - 6, GOLD, 1.8));
        container.appendChild(text(midAB.x + 22, midAB.y - 20, 'f', { fill: GOLD, 'font-size': 11.5, 'font-style': 'italic', 'font-weight': '700' }));

        // Vitesse vC (horizontale, en C)
        container.appendChild(arrowLine(C.x + 8, C.y, C.x + 34, C.y, RED, 2));
        container.appendChild(text(C.x + 20, C.y - 8, 'vC', { fill: RED, 'font-size': 9.5, 'font-style': 'italic' }));

        // Légende
        container.appendChild(text(W / 2, H - 8, 'm = 50 g — r = 0,5 m — sans frottement sur BC', { fill: GRAY, 'font-size': 9 }));
    }

    document.addEventListener('DOMContentLoaded', function () {
        setTimeout(drawGraph8, 300);
    });
})();

