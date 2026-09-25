// ============================================================
// figuresvt_ex1.js — Exercice 1 : Énergie cinétique d'un cylindre
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

    // Flèche droite : ligne + tête triangulaire
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

    // Flèche curviligne (arc) pour représenter une vitesse angulaire
    function arcArrow(cx, cy, r, startDeg, endDeg, color, width) {
        var g = el('g');
        var s = (startDeg * Math.PI) / 180;
        var e2 = (endDeg * Math.PI) / 180;
        var x1 = cx + r * Math.cos(s), y1 = cy - r * Math.sin(s);
        var x2 = cx + r * Math.cos(e2), y2 = cy - r * Math.sin(e2);
        var largeArc = Math.abs(endDeg - startDeg) > 180 ? 1 : 0;
        var sweep = endDeg > startDeg ? 0 : 1;
        var path = el('path', {
            d: 'M ' + x1 + ' ' + y1 + ' A ' + r + ' ' + r + ' 0 ' + largeArc + ' ' + sweep + ' ' + x2 + ' ' + y2,
            fill: 'none', stroke: color, 'stroke-width': width || 2, 'stroke-linecap': 'round'
        });
        g.appendChild(path);
        // tête de flèche au point d'arrivée, tangente à l'arc
        var tangentAngle = e2 + (sweep === 0 ? -1 : 1) * (Math.PI / 2 - 0.35);
        var headLen = 7;
        var hx = x2, hy = y2;
        var p1x = hx - headLen * Math.cos(tangentAngle - Math.PI / 7);
        var p1y = hy + headLen * Math.sin(tangentAngle - Math.PI / 7);
        var p2x = hx - headLen * Math.cos(tangentAngle + Math.PI / 7);
        var p2y = hy + headLen * Math.sin(tangentAngle + Math.PI / 7);
        g.appendChild(el('polygon', {
            points: hx + ',' + hy + ' ' + p1x + ',' + p1y + ' ' + p2x + ',' + p2y,
            fill: color
        }));
        return g;
    }

    function drawGraph1() {
        var container = document.getElementById('graph1');
        if (!container) return;

        var W = 420, H = 200;
        container.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
        container.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        container.setAttribute('width', '100%');
        container.setAttribute('height', 'auto');
        container.style.display = 'block';
        container.style.background = '#0D1117';
        container.style.borderRadius = '4px';
        while (container.firstChild) container.removeChild(container.firstChild);

        var TEAL = '#4ECDC4';
        var RED = '#FF6B6B';
        var GRAY = '#8b949e';

        // Fond
        container.appendChild(el('rect', { x: 0, y: 0, width: W, height: H, fill: '#0D1117' }));

        // Séparateur central
        container.appendChild(el('line', {
            x1: W / 2, y1: 20, x2: W / 2, y2: H - 14,
            stroke: '#30363d', 'stroke-width': 1, 'stroke-dasharray': '3,4'
        }));

        // ===================== Panneau gauche : Translation =====================
        var cx1 = W * 0.24, cy1 = 92;

        // Solide en translation (vue de côté, rectangle représentant le cylindre)
        container.appendChild(el('rect', {
            x: cx1 - 26, y: cy1 - 20, width: 52, height: 40,
            rx: 6, fill: TEAL, 'fill-opacity': '0.22', stroke: TEAL, 'stroke-width': 2
        }));
        // Deux traits pour suggérer la section circulaire du cylindre vu de côté
        container.appendChild(el('line', { x1: cx1 - 26, y1: cy1 - 20, x2: cx1 - 26, y2: cy1 + 20, stroke: TEAL, 'stroke-width': 2 }));
        container.appendChild(el('line', { x1: cx1 + 26, y1: cy1 - 20, x2: cx1 + 26, y2: cy1 + 20, stroke: TEAL, 'stroke-width': 2 }));

        // Flèche de vitesse v
        container.appendChild(arrowLine(cx1 + 32, cy1, cx1 + 74, cy1, TEAL, 2.2));
        container.appendChild(text(cx1 + 53, cy1 - 10, 'v = 20 m/s', { fill: TEAL, 'font-size': 11, 'font-weight': '600' }));

        // Sol (ligne de référence du mouvement)
        container.appendChild(el('line', {
            x1: cx1 - 45, y1: cy1 + 30, x2: cx1 + 85, y2: cy1 + 30,
            stroke: GRAY, 'stroke-width': 1
        }));

        container.appendChild(text(cx1 + 18, 26, 'Translation', { fill: TEAL, 'font-size': 13, 'font-weight': '700' }));
        container.appendChild(text(cx1 + 18, H - 22, 'Eₖ = 4,0 × 10³ J', { fill: '#c9d1d9', 'font-size': 11.5 }));

        // ===================== Panneau droit : Rotation =====================
        var cx2 = W * 0.755, cy2 = 92;
        var R = 27;

        // Axe de rotation (Δ), en pointillés, vertical
        container.appendChild(el('line', {
            x1: cx2, y1: cy2 - 42, x2: cx2, y2: cy2 + 42,
            stroke: RED, 'stroke-width': 1.4, 'stroke-dasharray': '4,4'
        }));
        container.appendChild(text(cx2 + 12, cy2 - 34, '(Δ)', { fill: RED, 'font-size': 11, 'font-weight': '600' }));

        // Cylindre vu de face (cercle)
        container.appendChild(el('circle', {
            cx: cx2, cy: cy2, r: R, fill: RED, 'fill-opacity': '0.12', stroke: RED, 'stroke-width': 2
        }));
        container.appendChild(el('circle', { cx: cx2, cy: cy2, r: 2, fill: RED }));

        // Rayon R
        var rAngle = Math.PI / 3.2;
        container.appendChild(el('line', {
            x1: cx2, y1: cy2, x2: cx2 + R * Math.cos(rAngle), y2: cy2 - R * Math.sin(rAngle),
            stroke: RED, 'stroke-width': 1.6
        }));
        container.appendChild(text(cx2 + 18, cy2 - 8, 'R', { fill: RED, 'font-size': 11, 'font-style': 'italic', 'font-weight': '600' }));

        // Flèche angulaire ω (arc autour du cercle)
        container.appendChild(arcArrow(cx2, cy2, R + 12, 15, 100, RED, 2));
        container.appendChild(text(cx2 + 46, cy2 - 22, 'ω = 50 rad/s', { fill: RED, 'font-size': 11, 'font-weight': '600' }));

        container.appendChild(text(cx2, 26, 'Rotation', { fill: RED, 'font-size': 13, 'font-weight': '700' }));
        container.appendChild(text(cx2, H - 22, 'Eₖ = 2,0 × 10³ J', { fill: '#c9d1d9', 'font-size': 11.5 }));

        // Données communes
        container.appendChild(text(W / 2, H - 4, 'm = 20 kg   —   R = 40 cm', { fill: GRAY, 'font-size': 10 }));
    }

    document.addEventListener('DOMContentLoaded', function () {
        setTimeout(drawGraph1, 300);
    });
})();

