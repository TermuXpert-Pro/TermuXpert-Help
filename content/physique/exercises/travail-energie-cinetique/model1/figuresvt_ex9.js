// ============================================================
// figuresvt_ex9.js — Exercice 9 : Poulie - solide S tiré par un fil, force F
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

    function drawGraph9() {
        var container = document.getElementById('graph9');
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

        var P = { x: 300, y: 62 }, R = 26;

        // Support fixe de la poulie (plafond)
        container.appendChild(elx('line', { x1: P.x - 20, y1: P.y - R - 14, x2: P.x + 20, y2: P.y - R - 14, stroke: GRAY, 'stroke-width': 2 }));
        for (var i = -3; i <= 3; i++) {
            container.appendChild(elx('line', {
                x1: P.x + i * 6, y1: P.y - R - 14, x2: P.x + i * 6 - 5, y2: P.y - R - 8, stroke: GRAY, 'stroke-width': 1
            }));
        }
        container.appendChild(elx('line', { x1: P.x, y1: P.y - R - 14, x2: P.x, y2: P.y - R, stroke: GRAY, 'stroke-width': 1.6 }));

        // Poulie (cercle) + axe (Δ)
        container.appendChild(elx('circle', { cx: P.x, cy: P.y, r: R, fill: TEAL, 'fill-opacity': '0.10', stroke: TEAL, 'stroke-width': 2.2 }));
        container.appendChild(elx('circle', { cx: P.x, cy: P.y, r: 2.5, fill: TEAL }));
        container.appendChild(text(P.x + 10, P.y - R - 2, '(Δ)', { fill: GRAY, 'font-size': 10.5, 'text-anchor': 'start' }));

        // Rayon R
        container.appendChild(elx('line', { x1: P.x, y1: P.y, x2: P.x - R * 0.7, y2: P.y - R * 0.7, stroke: TEAL, 'stroke-width': 1.4 }));
        container.appendChild(text(P.x - R * 0.5, P.y - R * 0.35, 'R', { fill: TEAL, 'font-size': 10.5, 'font-style': 'italic' }));

        // Fil : segment vertical (côté solide S) — tangent gauche de la poulie
        var tangL = { x: P.x - R, y: P.y };
        var groundY = 230;
        var S = { x: tangL.x, y: 172 };
        container.appendChild(elx('line', { x1: tangL.x, y1: tangL.y, x2: S.x, y2: S.y - 18, stroke: '#c9d1d9', 'stroke-width': 1.6 }));

        // Fil : segment horizontal (côté force F) — tangent supérieure de la poulie
        var tangT = { x: P.x, y: P.y - R };
        container.appendChild(elx('line', { x1: tangT.x, y1: tangT.y, x2: 400, y2: tangT.y, stroke: '#c9d1d9', 'stroke-width': 1.6 }));

        // Solide S (bloc suspendu)
        container.appendChild(elx('rect', { x: S.x - 20, y: S.y - 18, width: 40, height: 32, rx: 4, fill: GOLD, 'fill-opacity': '0.22', stroke: GOLD, 'stroke-width': 2 }));
        container.appendChild(text(S.x, S.y + 3, 'S', { fill: GOLD, 'font-size': 13, 'font-weight': '700' }));
        container.appendChild(text(S.x - 46, S.y + 3, 'm = 100 kg', { fill: '#c9d1d9', 'font-size': 9.5, 'text-anchor': 'end' }));

        // Tension T (le long du fil, tirant S vers le haut)
        container.appendChild(arrowLine(S.x + 24, S.y - 24, S.x + 24, S.y - 48, TEAL, 2));
        container.appendChild(text(S.x + 34, S.y - 52, 'T', { fill: TEAL, 'font-size': 11.5, 'font-style': 'italic', 'font-weight': '700', 'text-anchor': 'start' }));

        // Poids de S (vertical vers le bas)
        container.appendChild(arrowLine(S.x, S.y + 16, S.x, S.y + 44, RED, 2));
        container.appendChild(text(S.x + 12, S.y + 50, 'P', { fill: RED, 'font-size': 11, 'font-style': 'italic', 'font-weight': '700', 'text-anchor': 'start' }));

        // Hauteur d'élévation h (repère vertical)
        container.appendChild(elx('line', {
            x1: S.x - 34, y1: groundY, x2: S.x - 34, y2: S.y + 14,
            stroke: GOLD, 'stroke-width': 1.2, 'stroke-dasharray': '4,3'
        }));
        container.appendChild(elx('line', { x1: S.x - 40, y1: groundY, x2: S.x - 28, y2: groundY, stroke: GOLD, 'stroke-width': 1.2 }));
        container.appendChild(elx('line', { x1: S.x - 40, y1: S.y + 14, x2: S.x - 28, y2: S.y + 14, stroke: GOLD, 'stroke-width': 1.2 }));
        container.appendChild(text(S.x - 48, (groundY + S.y + 14) / 2 + 4, 'h = 5 m', { fill: GOLD, 'font-size': 10, 'text-anchor': 'end' }));

        // Vitesse v (montée de S)
        container.appendChild(arrowLine(S.x + 46, S.y + 10, S.x + 46, S.y - 26, TEAL, 2.2));
        container.appendChild(text(S.x + 58, S.y - 4, 'v = 4 m/s', { fill: TEAL, 'font-size': 9.5, 'text-anchor': 'start' }));

        // Force F (horizontale, appliquée à l'autre bout du fil)
        var handX = 402;
        container.appendChild(arrowLine(handX, tangT.y, handX + 18, tangT.y, RED, 2.4));
        container.appendChild(text(handX - 4, tangT.y - 10, 'F', { fill: RED, 'font-size': 13, 'font-style': 'italic', 'font-weight': '700', 'text-anchor': 'end' }));

        // Sol (référence)
        container.appendChild(elx('line', { x1: 20, y1: groundY, x2: 250, y2: groundY, stroke: GRAY, 'stroke-width': 1 }));
        for (var j = 0; j < 9; j++) {
            var gx = 20 + j * 28;
            container.appendChild(elx('line', { x1: gx, y1: groundY, x2: gx - 7, y2: groundY + 8, stroke: GRAY, 'stroke-width': 1 }));
        }

        container.appendChild(text(W / 2, H - 8, 'Poulie sans frottement — R = 10 cm — JΔ = 5×10⁻³ kg·m²', { fill: GRAY, 'font-size': 9 }));
    }

    document.addEventListener('DOMContentLoaded', function () {
        setTimeout(drawGraph9, 300);
    });
})();
