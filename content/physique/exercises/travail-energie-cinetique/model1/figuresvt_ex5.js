// ============================================================
// figuresvt_ex5.js — Exercice 5 : Skieur descendant une pente (bilan des forces)
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
                fill: color, 'font-size': 11, 'font-style': 'italic', 'font-weight': '600'
            }));
        }
        return g;
    }

    // Skieur schématique : petit bonhomme simplifié
    function skierShape(cx, cy, color) {
        var g = elx('g');
        g.appendChild(elx('circle', { cx: cx, cy: cy - 12, r: 4.5, fill: color }));
        g.appendChild(elx('line', { x1: cx, y1: cy - 7.5, x2: cx, y2: cy + 6, stroke: color, 'stroke-width': 2.2 }));
        g.appendChild(elx('line', { x1: cx, y1: cy + 6, x2: cx - 7, y2: cy + 16, stroke: color, 'stroke-width': 2 }));
        g.appendChild(elx('line', { x1: cx, y1: cy + 6, x2: cx + 7, y2: cy + 16, stroke: color, 'stroke-width': 2 }));
        // Skis
        g.appendChild(elx('line', { x1: cx - 14, y1: cy + 18, x2: cx + 2, y2: cy + 18, stroke: color, 'stroke-width': 2 }));
        g.appendChild(elx('line', { x1: cx, y1: cy + 20, x2: cx + 16, y2: cy + 20, stroke: color, 'stroke-width': 2 }));
        return g;
    }

    function drawGraph5() {
        var container = document.getElementById('graph5');
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

        // Géométrie de la pente : angle α = 20°
        var A = { x: 55, y: 68 };
        var dx = 250, alphaDeg = 20;
        var dy = dx * Math.tan(alphaDeg * Math.PI / 180);
        var B = { x: A.x + dx, y: A.y + dy };

        // Sol horizontal (à hauteur de B, prolongé)
        container.appendChild(elx('line', { x1: 20, y1: B.y, x2: 400, y2: B.y, stroke: GRAY, 'stroke-width': 1.2 }));
        for (var i = 0; i < 13; i++) {
            var hx = 20 + i * 30;
            container.appendChild(elx('line', { x1: hx, y1: B.y, x2: hx - 7, y2: B.y + 8, stroke: GRAY, 'stroke-width': 1 }));
        }

        // Surface de la pente
        container.appendChild(elx('polygon', {
            points: A.x + ',' + A.y + ' ' + B.x + ',' + B.y + ' ' + A.x + ',' + B.y,
            fill: TEAL, 'fill-opacity': '0.06'
        }));
        container.appendChild(elx('line', { x1: A.x, y1: A.y, x2: B.x, y2: B.y, stroke: TEAL, 'stroke-width': 2.5 }));

        // Angle alpha à la base
        container.appendChild(angleArc(B.x, B.y, 40, 160, 180, RED, 'α = 20°', 54));

        // Points A et B
        container.appendChild(text(A.x - 6, A.y - 10, 'A', { fill: TEAL, 'font-size': 13, 'font-weight': '700' }));
        container.appendChild(text(B.x + 14, B.y + 4, 'B', { fill: TEAL, 'font-size': 13, 'font-weight': '700' }));
        container.appendChild(text((A.x + B.x) / 2, (A.y + B.y) / 2 - 34, 'AB = 200 m', {
            fill: '#c9d1d9', 'font-size': 10.5, 'font-weight': '600'
        }));

        // Skieur au milieu de la pente
        var t = 0.52;
        var sx = A.x + (B.x - A.x) * t, sy = A.y + (B.y - A.y) * t;
        container.appendChild(skierShape(sx, sy, '#e6edf3'));

        var ux = (B.x - A.x) / dx * Math.cos(0), uxn = (B.x - A.x), uyn = (B.y - A.y);
        var norm = Math.sqrt(uxn * uxn + uyn * uyn);
        var udx = uxn / norm, udy = uyn / norm; // vecteur unitaire le long de la pente (vers B)
        var ndx = -udy, ndy = udx; // normale (vers le haut-gauche, hors de la pente)
        if (ndy > 0) { ndx = -ndx; ndy = -ndy; } // s'assurer que la normale pointe vers l'extérieur (au-dessus de la pente)

        // Flèche du mouvement (le long de la pente, sens A→B)
        container.appendChild(arrowLine(sx - udx * 34, sy - udy * 34, sx - udx * 14, sy - udy * 14, GOLD, 1.8));

        // Poids P (vertical vers le bas)
        container.appendChild(arrowLine(sx, sy, sx, sy + 55, RED, 2.4));
        container.appendChild(text(sx + 12, sy + 62, 'P', { fill: RED, 'font-size': 13, 'font-style': 'italic', 'font-weight': '700', 'text-anchor': 'start' }));

        // Réaction normale R (perpendiculaire à la pente, vers l'extérieur)
        container.appendChild(arrowLine(sx, sy, sx + ndx * 48, sy + ndy * 48, TEAL, 2.2));
        container.appendChild(text(sx + ndx * 58, sy + ndy * 58 - 4, 'R', { fill: TEAL, 'font-size': 13, 'font-style': 'italic', 'font-weight': '700' }));

        // Frottement f (le long de la pente, opposé au mouvement : vers A)
        container.appendChild(arrowLine(sx, sy, sx - udx * 42, sy - udy * 42, GOLD, 2.2));
        container.appendChild(text(sx - udx * 54, sy - udy * 54 - 4, 'f', { fill: GOLD, 'font-size': 13, 'font-style': 'italic', 'font-weight': '700' }));

        // Légende
        container.appendChild(text(W / 2, H - 8, 'm = 80 kg — vA = 0, vB = 30 km/h — bilan des forces sur le skieur', {
            fill: GRAY, 'font-size': 9.5
        }));
    }

    document.addEventListener('DOMContentLoaded', function () {
        setTimeout(drawGraph5, 300);
    });
})();
