/* ============================================================
   figuresvt_p1.js — Partie 1 : Barycentre de deux points pondérés
   ملف مستقل بالكامل (self-contained) — لا يعتمد على أي مكتبة مشتركة.
   يرسم: activiteGraph, caractGraph, cercleGraph, mediatriceGraph
   ============================================================ */
(function () {
    'use strict';
    var NS = 'http://www.w3.org/2000/svg';

    /* ---------- أدوات SVG أساسية (محلية لهذا الملف فقط) ---------- */
    function el(tag, attrs) {
        var e = document.createElementNS(NS, tag);
        for (var k in attrs) { if (attrs.hasOwnProperty(k)) e.setAttribute(k, attrs[k]); }
        return e;
    }
    function txt(x, y, str, opts) {
        opts = opts || {};
        var t = el('text', {
            x: x, y: y, 'text-anchor': opts.anchor || 'middle',
            'font-family': "'Cairo','Segoe UI',sans-serif",
            'font-size': opts.size || 13,
            'font-weight': opts.weight || '600',
            fill: opts.color || '#E6EDF3'
        });
        t.textContent = str;
        return t;
    }
    function initSVG(id, w, h) {
        var svg = document.getElementById(id);
        if (!svg) return null;
        while (svg.firstChild) svg.removeChild(svg.firstChild);
        svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
        svg.setAttribute('width', '100%');
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        svg.style.height = 'auto';
        svg.style.display = 'block';
        svg.style.margin = '0 auto';
        return svg;
    }
    function arrowMarker(svg, id, color) {
        var defs = svg.querySelector('defs') || el('defs', {});
        if (!svg.contains(defs)) svg.appendChild(defs);
        var m = el('marker', {
            id: id, markerWidth: 8, markerHeight: 8, refX: 6, refY: 3,
            orient: 'auto', markerUnits: 'strokeWidth'
        });
        m.appendChild(el('path', { d: 'M0,0 L7,3 L0,6 Z', fill: color }));
        defs.appendChild(m);
    }
    function point(svg, x, y, color, r) {
        svg.appendChild(el('circle', { cx: x, cy: y, r: r || 5, fill: color, stroke: '#0D1117', 'stroke-width': 1.5 }));
    }
    function seg(svg, x1, y1, x2, y2, color, w, dash) {
        var a = { x1: x1, y1: y1, x2: x2, y2: y2, stroke: color, 'stroke-width': w || 1.5 };
        if (dash) a['stroke-dasharray'] = dash;
        svg.appendChild(el('line', a));
    }
    function vec(svg, x1, y1, x2, y2, color, markerId, w) {
        svg.appendChild(el('line', {
            x1: x1, y1: y1, x2: x2, y2: y2, stroke: color, 'stroke-width': w || 2,
            'marker-end': 'url(#' + markerId + ')'
        }));
    }
    /* تسمية شعاع: نص + سهم صغير فوقه يحاكي overrightarrow */
    function vecLabel(svg, cx, y, str, color, markerId) {
        var w = Math.max(str.length * 8, 18);
        seg(svg, cx - w / 2, y - 13, cx + w / 2 - 4, y - 13, color, 1.3);
        svg.appendChild(el('line', {
            x1: cx - w / 2, y1: y - 13, x2: cx + w / 2, y2: y - 13,
            stroke: color, 'stroke-width': 1.3, 'marker-end': 'url(#' + markerId + ')'
        }));
        svg.appendChild(txt(cx, y + 2, str, { size: 13, color: color, weight: '700' }));
    }

    /* ============================================================
       1) activiteGraph — G tel que GA + GB = 0  → G = I = milieu[AB]
       ============================================================ */
    function drawActiviteGraph() {
        var W = 460, H = 220;
        var svg = initSVG('activiteGraph', W, H);
        if (!svg) return;
        arrowMarker(svg, 'act-arr-teal', '#4ECDC4');
        arrowMarker(svg, 'act-arr-purple', '#BB8FCE');

        var Ax = 70, Bx = 390, y = 175;
        var Gx = (Ax + Bx) / 2;

        seg(svg, Ax, y, Bx, y, '#30363D', 2);

        vec(svg, Gx, 100, Ax, 100, '#BB8FCE', 'act-arr-purple');
        vec(svg, Gx, 100, Bx, 100, '#4ECDC4', 'act-arr-teal');
        svg.appendChild(txt((Gx + Ax) / 2, 88, 'GA', { size: 13, color: '#BB8FCE', weight: '700' }));
        svg.appendChild(txt((Gx + Bx) / 2, 88, 'GB', { size: 13, color: '#4ECDC4', weight: '700' }));
        seg(svg, Gx, 100, Gx, y - 8, '#8B949E', 1, '3,3');

        point(svg, Ax, y, '#E6EDF3', 5.5);
        point(svg, Bx, y, '#E6EDF3', 5.5);
        point(svg, Gx, y, '#4ECDC4', 6.5);

        svg.appendChild(txt(Ax, y + 24, 'A', { size: 15, color: '#E6EDF3', weight: '700' }));
        svg.appendChild(txt(Bx, y + 24, 'B', { size: 15, color: '#E6EDF3', weight: '700' }));
        svg.appendChild(txt(Gx, y + 24, 'I = G', { size: 14, color: '#4ECDC4', weight: '700' }));
        svg.appendChild(txt(W / 2, 30, 'GA + GB = 0  ⟹  G est le milieu de [AB]', { size: 12.5, color: '#8B949E' }));
    }

    /* ============================================================
       2) caractGraph — Propriété caractéristique
          S = {(A,2), (B,3)}  ⟹  AG = 3/5 AB   (cohérent avec l'Exercice 1)
          Pour tout M : 2MA + 3MB = 5MG
       ============================================================ */
    function drawCaractGraph() {
        var W = 460, H = 260;
        var svg = initSVG('caractGraph', W, H);
        if (!svg) return;
        arrowMarker(svg, 'car-arr-teal', '#4ECDC4');
        arrowMarker(svg, 'car-arr-purple', '#BB8FCE');
        arrowMarker(svg, 'car-arr-gold', '#F4D03F');

        var Ax = 70, Bx = 380, yb = 215;
        var Gx = Ax + (3 / 5) * (Bx - Ax); // b/(a+b) = 3/5
        var Mx = 250, My = 60;

        seg(svg, Ax, yb, Bx, yb, '#30363D', 1.5);

        vec(svg, Mx, My, Ax, yb, '#BB8FCE', 'car-arr-purple');
        vec(svg, Mx, My, Bx, yb, '#4ECDC4', 'car-arr-teal');
        vec(svg, Mx, My, Gx, yb, '#F4D03F', 'car-arr-gold', 2.4);

        point(svg, Ax, yb, '#E6EDF3', 5.5);
        point(svg, Bx, yb, '#E6EDF3', 5.5);
        point(svg, Gx, yb, '#F4D03F', 6);
        point(svg, Mx, My, '#FF6B6B', 5.5);

        svg.appendChild(txt(Ax - 6, yb + 22, 'A', { size: 15, color: '#E6EDF3', weight: '700' }));
        svg.appendChild(txt(Ax - 22, yb + 4, 'poids 2', { size: 10, color: '#8B949E' }));
        svg.appendChild(txt(Bx + 6, yb + 22, 'B', { size: 15, color: '#E6EDF3', weight: '700' }));
        svg.appendChild(txt(Bx + 24, yb + 4, 'poids 3', { size: 10, color: '#8B949E' }));
        svg.appendChild(txt(Gx, yb + 24, 'G', { size: 14, color: '#F4D03F', weight: '700' }));
        svg.appendChild(txt(Mx, My - 12, 'M', { size: 15, color: '#FF6B6B', weight: '700' }));

        svg.appendChild(txt(W / 2, 30, '2MA + 3MB = 5MG  (quel que soit M)', { size: 12.5, color: '#8B949E' }));
    }

    /* ============================================================
       3) cercleGraph — Application a)
          G = bary{(A,2),(B,4)}  ⟹  AG = 4/6 AB = 2/3 AB
          Ensemble des points M : cercle C(G, 2)
       ============================================================ */
    function drawCercleGraph() {
        var W = 460, H = 260;
        var svg = initSVG('cercleGraph', W, H);
        if (!svg) return;
        arrowMarker(svg, 'cer-arr-gold', '#F4D03F');

        var Ax = 60, Bx = 360, y = 210;
        var Gx = Ax + (2 / 3) * (Bx - Ax);
        var r = 70;

        seg(svg, Ax, y, Bx, y, '#30363D', 1.5);
        svg.appendChild(el('circle', { cx: Gx, cy: y, r: r, fill: 'rgba(78,205,196,0.08)', stroke: '#4ECDC4', 'stroke-width': 2 }));

        var ang = -50 * Math.PI / 180;
        var Mx = Gx + r * Math.cos(ang), My = y + r * Math.sin(ang);
        seg(svg, Gx, y, Mx, My, '#F4D03F', 1.4, '4,3');
        svg.appendChild(txt((Gx + Mx) / 2 + 14, (y + My) / 2 - 2, 'r = 2', { size: 11.5, color: '#F4D03F', weight: '700' }));
        point(svg, Mx, My, '#F4D03F', 5);

        point(svg, Ax, y, '#E6EDF3', 5.5);
        point(svg, Bx, y, '#E6EDF3', 5.5);
        point(svg, Gx, y, '#4ECDC4', 6.5);

        svg.appendChild(txt(Ax, y + 24, 'A', { size: 15, color: '#E6EDF3', weight: '700' }));
        svg.appendChild(txt(Bx, y + 24, 'B', { size: 15, color: '#E6EDF3', weight: '700' }));
        svg.appendChild(txt(Gx, y - r - 12, 'G', { size: 14, color: '#4ECDC4', weight: '700' }));
        svg.appendChild(txt(W / 2, 30, 'Ensemble des points M : cercle C(G, 2)', { size: 12.5, color: '#8B949E' }));
    }

    /* ============================================================
       4) mediatriceGraph — Application b)
          G  = bary{(A,2),(B,4)}  ⟹ AG  = 2/3 AB
          G' = bary{(A,4),(B,2)}  ⟹ AG' = 1/3 AB
          Ensemble des points M : médiatrice de [GG']
       ============================================================ */
    function drawMediatriceGraph() {
        var W = 460, H = 260;
        var svg = initSVG('mediatriceGraph', W, H);
        if (!svg) return;

        var Ax = 60, Bx = 360, y = 210;
        var Gpx = Ax + (1 / 3) * (Bx - Ax);  // G'  (poids B = 2)
        var Gx = Ax + (2 / 3) * (Bx - Ax);   // G   (poids B = 4)
        var midX = (Gpx + Gx) / 2;

        seg(svg, Ax, y, Bx, y, '#30363D', 1.5);

        /* médiatrice verticale de [G G'] */
        seg(svg, midX, 40, midX, y + 40, '#BB8FCE', 2, '6,4');
        /* petit carré d'angle droit */
        svg.appendChild(el('rect', { x: midX - 8, y: y - 8, width: 8, height: 8, fill: 'none', stroke: '#BB8FCE', 'stroke-width': 1 }));

        var My = 70;
        seg(svg, midX, My, Gx, y, '#8B949E', 1.2, '3,3');
        seg(svg, midX, My, Gpx, y, '#8B949E', 1.2, '3,3');
        point(svg, midX, My, '#FF6B6B', 5);
        svg.appendChild(txt(midX + 16, My - 4, 'M', { size: 14, color: '#FF6B6B', weight: '700' }));

        point(svg, Ax, y, '#E6EDF3', 5.5);
        point(svg, Bx, y, '#E6EDF3', 5.5);
        point(svg, Gpx, y, '#F4D03F', 6);
        point(svg, Gx, y, '#4ECDC4', 6);

        svg.appendChild(txt(Ax, y + 24, 'A', { size: 15, color: '#E6EDF3', weight: '700' }));
        svg.appendChild(txt(Bx, y + 24, 'B', { size: 15, color: '#E6EDF3', weight: '700' }));
        svg.appendChild(txt(Gpx, y + 24, "G'", { size: 13, color: '#F4D03F', weight: '700' }));
        svg.appendChild(txt(Gx, y + 24, 'G', { size: 13, color: '#4ECDC4', weight: '700' }));
        svg.appendChild(txt(W / 2, 24, "Ensemble des points M : médiatrice de [GG']", { size: 12.5, color: '#8B949E' }));
    }

    document.addEventListener('DOMContentLoaded', function () {
        drawActiviteGraph();
        drawCaractGraph();
        drawCercleGraph();
        drawMediatriceGraph();
    });
})();

