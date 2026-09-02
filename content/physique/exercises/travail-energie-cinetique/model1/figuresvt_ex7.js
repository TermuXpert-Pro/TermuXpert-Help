// ============================================================
// figuresvt_ex7.js — Exercice 7 : Cylindre en rotation - couple de frottement
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

    function arcArrow(cx, cy, r, startDeg, endDeg, color, width, dashed) {
        var g = elx('g');
        var s = (startDeg * Math.PI) / 180;
        var e2 = (endDeg * Math.PI) / 180;
        var x1 = cx + r * Math.cos(s), y1 = cy - r * Math.sin(s);
        var x2 = cx + r * Math.cos(e2), y2 = cy - r * Math.sin(e2);
        var largeArc = Math.abs(endDeg - startDeg) > 180 ? 1 : 0;
        var sweep = endDeg > startDeg ? 0 : 1;
        var attrs = {
            d: 'M ' + x1 + ' ' + y1 + ' A ' + r + ' ' + r + ' 0 ' + largeArc + ' ' + sweep + ' ' + x2 + ' ' + y2,
            fill: 'none', stroke: color, 'stroke-width': width || 2, 'stroke-linecap': 'round'
        };
        if (dashed) attrs['stroke-dasharray'] = '3,3';
        g.appendChild(elx('path', attrs));
        var tangentAngle = e2 + (sweep === 0 ? -1 : 1) * (Math.PI / 2 - 0.35);
        var headLen = 7;
        var hx = x2, hy = y2;
        var p1x = hx - headLen * Math.cos(tangentAngle - Math.PI / 7);
        var p1y = hy + headLen * Math.sin(tangentAngle - Math.PI / 7);
        var p2x = hx - headLen * Math.cos(tangentAngle + Math.PI / 7);
        var p2y = hy + headLen * Math.sin(tangentAngle + Math.PI / 7);
        g.appendChild(elx('polygon', {
            points: hx + ',' + hy + ' ' + p1x + ',' + p1y + ' ' + p2x + ',' + p2y,
            fill: color
        }));
        return g;
    }

    function drawGraph7() {
        var container = document.getElementById('graph7');
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

        container.appendChild(elx('rect', { x: 0, y: 0, width: W, height: H, fill: '#0D1117' }));

        var cx = 148, cy = 112, R = 56;

        // Axe de rotation (Δ), vertical pointillé
        container.appendChild(elx('line', {
            x1: cx, y1: cy - 78, x2: cx, y2: cy + 78,
            stroke: GRAY, 'stroke-width': 1.4, 'stroke-dasharray': '4,4'
        }));
        container.appendChild(text(cx + 14, cy - 68, '(Δ)', { fill: GRAY, 'font-size': 11, 'font-weight': '600' }));

        // Cylindre (vue de face)
        container.appendChild(elx('circle', { cx: cx, cy: cy, r: R, fill: TEAL, 'fill-opacity': '0.10', stroke: TEAL, 'stroke-width': 2.2 }));
        container.appendChild(elx('circle', { cx: cx, cy: cy, r: 2.4, fill: TEAL }));

        // Rayon R
        var rAngle = Math.PI / 4;
        container.appendChild(elx('line', {
            x1: cx, y1: cy, x2: cx + R * Math.cos(rAngle), y2: cy - R * Math.sin(rAngle),
            stroke: TEAL, 'stroke-width': 1.6
        }));
        container.appendChild(text(cx + 22, cy - 18, 'R', { fill: TEAL, 'font-size': 11, 'font-style': 'italic', 'font-weight': '600' }));

        // Vitesse angulaire ω (sens direct, flèche extérieure)
        container.appendChild(arcArrow(cx, cy, R + 16, 25, 130, TEAL, 2.4, false));
        container.appendChild(text(cx - 4, cy - R - 26, 'ω = 45 tr/min', { fill: TEAL, 'font-size': 11, 'font-weight': '600' }));

        // Couple de frottement Mf (résistant, sens opposé, en pointillé rouge)
        container.appendChild(arcArrow(cx, cy, R + 16, 205, 310, RED, 2, true));
        container.appendChild(text(cx + 4, cy + R + 30, 'Mf (résistant)', { fill: RED, 'font-size': 10.5, 'font-weight': '600' }));

        // Panneau d'informations à droite
        var px = 330;
        container.appendChild(text(px, 60, 'Moteur coupé', { fill: '#c9d1d9', 'font-size': 11.5, 'font-weight': '700' }));
        container.appendChild(text(px, 78, '→ ralentit', { fill: '#c9d1d9', 'font-size': 10.5 }));
        container.appendChild(text(px, 96, '120 tours', { fill: GOLD, 'font-size': 12.5, 'font-weight': '700' }));
        container.appendChild(text(px, 112, 'avant l\u2019arrêt', { fill: GOLD, 'font-size': 10.5 }));
        container.appendChild(text(px, 138, 'R = 10 cm', { fill: '#8b949e', 'font-size': 10 }));
        container.appendChild(text(px, 154, 'JΔ = 3×10⁻² kg·m²', { fill: '#8b949e', 'font-size': 10 }));

        container.appendChild(text(W / 2, H - 8, 'Cylindre homogène en rotation autour de (Δ)', { fill: GRAY, 'font-size': 9.5 }));
    }

    document.addEventListener('DOMContentLoaded', function () {
        setTimeout(drawGraph7, 300);
    });
})();
