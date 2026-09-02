// ============================================================
// figuresvt_ex2.js — Exercice 2 : Solide descendant une pente (sans frottement)
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

    // Petit arc pour marquer un angle, avec son étiquette
    function angleArc(cx, cy, r, startDeg, endDeg, color, label, labelR) {
        var g = el('g');
        var s = (startDeg * Math.PI) / 180;
        var e2 = (endDeg * Math.PI) / 180;
        var x1 = cx + r * Math.cos(s), y1 = cy - r * Math.sin(s);
        var x2 = cx + r * Math.cos(e2), y2 = cy - r * Math.sin(e2);
        g.appendChild(el('path', {
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

    function drawGraph2() {
        var container = document.getElementById('graph2');
        if (!container) return;

        var W = 420, H = 220;
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

        // Repère (points du plan incliné) — angle exagéré pour la lisibilité
        // (l'angle réel est très petit, ≈ 1,44°)
        var A = { x: 95, y: 58 };
        var B = { x: 300, y: 168 };
        var footA = { x: A.x, y: B.y }; // pied de la verticale abaissée de A

        // Sol horizontal
        container.appendChild(el('line', {
            x1: 40, y1: B.y, x2: 385, y2: B.y, stroke: GRAY, 'stroke-width': 1.4
        }));
        // Hachures du sol
        for (var i = 0; i < 12; i++) {
            var hx = 40 + i * 30;
            container.appendChild(el('line', {
                x1: hx, y1: B.y, x2: hx - 8, y2: B.y + 8, stroke: GRAY, 'stroke-width': 1
            }));
        }

        // Plan incliné (surface AB)
        container.appendChild(el('line', {
            x1: A.x, y1: A.y, x2: B.x, y2: B.y, stroke: TEAL, 'stroke-width': 2.5
        }));
        // Remplissage triangulaire léger sous le plan (support du plan incliné)
        container.appendChild(el('polygon', {
            points: A.x + ',' + A.y + ' ' + B.x + ',' + B.y + ' ' + A.x + ',' + B.y,
            fill: TEAL, 'fill-opacity': '0.06'
        }));

        // Hauteur (dénivellation) — verticale pointillée de A au sol
        container.appendChild(el('line', {
            x1: footA.x, y1: A.y, x2: footA.x, y2: B.y,
            stroke: GOLD, 'stroke-width': 1.2, 'stroke-dasharray': '4,3'
        }));
        container.appendChild(text(footA.x - 14, (A.y + B.y) / 2 + 4, 'zA−zB', {
            fill: GOLD, 'font-size': 9.5, 'font-style': 'italic'
        }));

        // Angle alpha à la base (entre l'horizontale et la pente BA)
        var slopeDirDeg = Math.atan2(B.y - A.y, A.x - B.x) * 180 / Math.PI; // angle de BA / horizontale (repère écran, y vers le bas)
        container.appendChild(angleArc(B.x, B.y, 34, slopeDirDeg, 180, RED, 'α', 46));

        // Point A
        container.appendChild(el('circle', { cx: A.x, cy: A.y, r: 3.2, fill: TEAL }));
        container.appendChild(text(A.x - 14, A.y - 6, 'A', { fill: TEAL, 'font-size': 13, 'font-weight': '700' }));
        // Bloc au départ A + v_A = 0
        container.appendChild(el('circle', { cx: A.x + 16, cy: A.y - 10, r: 5, fill: TEAL, 'fill-opacity': '0.85' }));
        container.appendChild(text(A.x + 46, A.y - 6, 'vA = 0', { fill: TEAL, 'font-size': 10.5 }));

        // Point B
        container.appendChild(el('circle', { cx: B.x, cy: B.y, r: 3.2, fill: TEAL }));
        container.appendChild(text(B.x + 16, B.y + 16, 'B', { fill: TEAL, 'font-size': 13, 'font-weight': '700' }));

        // Solide (petit disque) au point B + vecteur vitesse vB tangent à la pente
        container.appendChild(el('circle', { cx: B.x - 16, cy: B.y - 9, r: 5, fill: TEAL, 'fill-opacity': '0.85' }));
        var dx = B.x - A.x, dy = B.y - A.y;
        var norm = Math.sqrt(dx * dx + dy * dy);
        var ux = dx / norm, uy = dy / norm;
        var vStart = { x: B.x - 16 + ux * 8, y: B.y - 9 + uy * 8 };
        var vEnd = { x: vStart.x + ux * 40, y: vStart.y + uy * 40 };
        container.appendChild(arrowLine(vStart.x, vStart.y, vEnd.x, vEnd.y, RED, 2.2));
        container.appendChild(text(vEnd.x + 8, vEnd.y + 14, 'vB = 8 km/h', { fill: RED, 'font-size': 10.5, 'text-anchor': 'start' }));

        // Longueur AB le long de la pente
        var midx = (A.x + B.x) / 2, midy = (A.y + B.y) / 2;
        var nx = -uy, ny = ux; // normale pour décaler le texte au-dessus de la pente
        container.appendChild(text(midx + nx * 14, midy + ny * 14 - 2, 'AB = 10 m', {
            fill: '#c9d1d9', 'font-size': 11, 'font-weight': '600'
        }));

        // Légende
        container.appendChild(text(W / 2, H - 8, 'Plan incliné sans frottement — angle α (exagéré pour la lisibilité)', {
            fill: GRAY, 'font-size': 9.5
        }));
    }

    document.addEventListener('DOMContentLoaded', function () {
        setTimeout(drawGraph2, 300);
    });
})();
