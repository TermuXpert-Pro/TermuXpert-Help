/* ============================================================
   figuresvt_ex2.js — Devoir Surveillé N°1 (Modèle 1)
   Exercice 2 : Généralités sur les fonctions
   Fichier autonome (self-contained) : aucune dépendance à une
   librairie partagée (svg-utils.js). Toutes les fonctions
   utilitaires nécessaires sont définies ici, à l'intérieur de
   ce même fichier.

   Rappel des données de l'exercice :
     f(x) = -x² + 2x + 1 = -(x-1)² + 2      (D_f = ℝ)
     g(x) = √(x-1)                           (D_g = [1, +∞[)
     A(2 ; 1) = point d'intersection de (Cf) et (Cg)
     h(x) = √(-x² + 2x) = √(1-(x-1)²)        (D_h = [0, 2])

   Figures dessinées :
     - graphFCfCg  : question 3, tracé de (Cf) et (Cg).
     - graphIneq   : question 4, résolution graphique de
                     x²-2x-1+√(x-1) < 0  ⇔  g(x) < f(x).
     - graphImages : question 5, images de [0,1] et [1,2] par f.
     - graphH      : question 6c, monotonie de h (demi-cercle).
   ============================================================ */
(function () {
    'use strict';
    var NS = 'http://www.w3.org/2000/svg';

    /* ---------- Utilitaires SVG de base ---------- */
    function el(tag, attrs) {
        var e = document.createElementNS(NS, tag);
        for (var k in attrs) {
            if (attrs.hasOwnProperty(k)) e.setAttribute(k, attrs[k]);
        }
        return e;
    }
    function text(x, y, str, attrs) {
        var t = el('text', Object.assign({ x: x, y: y, 'font-family': "'Cairo','Segoe UI',sans-serif" }, attrs || {}));
        t.textContent = str;
        return t;
    }
    function setResponsive(svg, w, h) {
        svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        svg.removeAttribute('width');
        svg.removeAttribute('height');
        svg.style.width = '100%';
        svg.style.height = 'auto';
        svg.style.display = 'block';
    }
    function clear(svg) { while (svg.firstChild) svg.removeChild(svg.firstChild); }
    function addArrowMarker(svg, id, color) {
        var defs = svg.querySelector('defs');
        if (!defs) { defs = el('defs', {}); svg.appendChild(defs); }
        var m = el('marker', { id: id, markerWidth: 7, markerHeight: 7, refX: 5.5, refY: 3.5, orient: 'auto' });
        m.appendChild(el('path', { d: 'M0,0 L7,3.5 L0,7 Z', fill: color }));
        defs.appendChild(m);
    }
    function scaleFn(vmin, vmax, pmin, pmax) {
        return function (v) { return pmin + (v - vmin) * (pmax - pmin) / (vmax - vmin); };
    }
    function drawAxes(svg, opts) {
        var pad = opts.pad, w = opts.w, h = opts.h;
        var xmin = opts.xmin, xmax = opts.xmax, ymin = opts.ymin, ymax = opts.ymax;
        var sx = scaleFn(xmin, xmax, pad.l, w - pad.r);
        var sy = scaleFn(ymin, ymax, h - pad.b, pad.t);
        var axisColor = '#3A4552';
        addArrowMarker(svg, svg.id + '_arrowX', axisColor);
        addArrowMarker(svg, svg.id + '_arrowY', axisColor);
        if (opts.grid !== false) {
            var gStep = opts.gridStep || 1;
            for (var gx = Math.ceil(xmin / gStep) * gStep; gx <= xmax; gx += gStep) {
                svg.appendChild(el('line', { x1: sx(gx), y1: sy(ymin), x2: sx(gx), y2: sy(ymax), stroke: '#1C2530', 'stroke-width': 1 }));
            }
            for (var gy = Math.ceil(ymin / gStep) * gStep; gy <= ymax; gy += gStep) {
                svg.appendChild(el('line', { x1: sx(xmin), y1: sy(gy), x2: sx(xmax), y2: sy(gy), stroke: '#1C2530', 'stroke-width': 1 }));
            }
        }
        var x0 = sx(Math.max(xmin, Math.min(0, xmax)));
        var y0 = sy(Math.max(ymin, Math.min(0, ymax)));
        svg.appendChild(el('line', { x1: sx(xmin), y1: y0, x2: sx(xmax) + 6, y2: y0, stroke: axisColor, 'stroke-width': 1.4, 'marker-end': 'url(#' + svg.id + '_arrowX)' }));
        svg.appendChild(el('line', { x1: x0, y1: sy(ymin), x2: x0, y2: sy(ymax) - 6, stroke: axisColor, 'stroke-width': 1.4, 'marker-end': 'url(#' + svg.id + '_arrowY)' }));
        svg.appendChild(text(sx(xmax) + 8, y0 + 4, opts.xLabel || 'x', { fill: '#8B96A5', 'font-size': 11, 'font-style': 'italic' }));
        svg.appendChild(text(x0 + 8, sy(ymax) - 10, opts.yLabel || 'y', { fill: '#8B96A5', 'font-size': 11, 'font-style': 'italic' }));
        svg.appendChild(text(x0 - 8, y0 + 14, '0', { fill: '#8B96A5', 'font-size': 10, 'text-anchor': 'end' }));
        return { sx: sx, sy: sy, x0: x0, y0: y0 };
    }
    function pathFromFn(sx, sy, fn, x1, x2, steps) {
        steps = steps || 90;
        var d = '';
        for (var i = 0; i <= steps; i++) {
            var x = x1 + (x2 - x1) * i / steps;
            var y = fn(x);
            d += (i === 0 ? 'M' : 'L') + sx(x).toFixed(2) + ',' + sy(y).toFixed(2) + ' ';
        }
        return d;
    }
    function dot(svg, cx, cy, color, r) {
        svg.appendChild(el('circle', { cx: cx, cy: cy, r: r || 3.4, fill: color, stroke: '#0D1117', 'stroke-width': 1 }));
    }
    function ring(svg, cx, cy, color, r) {
        svg.appendChild(el('circle', { cx: cx, cy: cy, r: r || 3.6, fill: '#0D1117', stroke: color, 'stroke-width': 1.8 }));
    }
    function dashLine(svg, x1, y1, x2, y2, color) {
        svg.appendChild(el('line', { x1: x1, y1: y1, x2: x2, y2: y2, stroke: color, 'stroke-width': 1, 'stroke-dasharray': '4,3' }));
    }

    /* Fonctions de l'exercice */
    var f = function (x) { return -x * x + 2 * x + 1; };
    var g = function (x) { return Math.sqrt(x - 1); };
    var h = function (x) { return Math.sqrt(Math.max(0, -x * x + 2 * x)); };

    var WIN = { xmin: -1, xmax: 3.5, ymin: -2.4, ymax: 2.6 };

    /* ============================================================
       graphFCfCg : question 3 — tracé de (Cf) et (Cg)
       ============================================================ */
    function drawGraphFCfCg(svg) {
        var w = 380, h_ = 330;
        setResponsive(svg, w, h_);
        clear(svg);
        var ax = drawAxes(svg, {
            pad: { l: 30, r: 18, t: 18, b: 26 }, w: w, h: h_,
            xmin: WIN.xmin, xmax: WIN.xmax, ymin: WIN.ymin, ymax: WIN.ymax, gridStep: 1,
            xLabel: 'x', yLabel: 'y'
        });

        svg.appendChild(el('path', { d: pathFromFn(ax.sx, ax.sy, f, WIN.xmin + 0.05, WIN.xmax - 0.05), fill: 'none', stroke: '#FF6B6B', 'stroke-width': 2.4 }));
        svg.appendChild(el('path', { d: pathFromFn(ax.sx, ax.sy, g, 1, WIN.xmax - 0.05), fill: 'none', stroke: '#F4D03F', 'stroke-width': 2.4 }));

        // Point d'intersection A(2;1)
        dashLine(svg, ax.sx(2), ax.sy(1), ax.sx(2), ax.y0, '#4ECDC4');
        dashLine(svg, ax.x0, ax.sy(1), ax.sx(2), ax.sy(1), '#4ECDC4');
        dot(svg, ax.sx(2), ax.sy(1), '#4ECDC4', 4);
        svg.appendChild(text(ax.sx(2) + 8, ax.sy(1) - 8, 'A(2 ; 1)', { fill: '#4ECDC4', 'font-size': 11, 'font-weight': 700 }));

        svg.appendChild(text(ax.sx(0.3), ax.sy(f(0.3)) - 10, '(Cf)', { fill: '#FF6B6B', 'font-size': 12, 'font-weight': 700 }));
        svg.appendChild(text(ax.sx(3.1), ax.sy(g(3.1)) + 16, '(Cg)', { fill: '#F4D03F', 'font-size': 12, 'font-weight': 700 }));
    }

    /* ============================================================
       graphIneq : question 4 — résoudre x²-2x-1+√(x-1) < 0
       ⇔ g(x) < f(x)  ⇔  (Cg) en dessous de (Cf)
       Solution : S = [1, 2[
       ============================================================ */
    function drawGraphIneq(svg) {
        var w = 380, h_ = 300;
        setResponsive(svg, w, h_);
        clear(svg);
        var ax = drawAxes(svg, {
            pad: { l: 30, r: 18, t: 18, b: 30 }, w: w, h: h_,
            xmin: WIN.xmin, xmax: WIN.xmax, ymin: WIN.ymin, ymax: WIN.ymax, gridStep: 1,
            xLabel: 'x', yLabel: 'y'
        });

        // Zone hachurée où (Cg) est sous (Cf) : x ∈ [1, 2]
        var top = pathFromFn(ax.sx, ax.sy, f, 1, 2, 40);
        var bottomRev = pathFromFn(ax.sx, ax.sy, g, 2, 1, 40).replace('M', 'L');
        svg.appendChild(el('path', { d: top + bottomRev + ' Z', fill: 'rgba(78,205,196,0.16)', stroke: 'none' }));

        svg.appendChild(el('path', { d: pathFromFn(ax.sx, ax.sy, f, WIN.xmin + 0.05, WIN.xmax - 0.05), fill: 'none', stroke: '#FF6B6B', 'stroke-width': 2.2, opacity: 0.85 }));
        svg.appendChild(el('path', { d: pathFromFn(ax.sx, ax.sy, g, 1, WIN.xmax - 0.05), fill: 'none', stroke: '#F4D03F', 'stroke-width': 2.2, opacity: 0.85 }));

        svg.appendChild(text(ax.sx(0.3), ax.sy(f(0.3)) - 10, '(Cf)', { fill: '#FF6B6B', 'font-size': 11 }));
        svg.appendChild(text(ax.sx(3.1), ax.sy(g(3.1)) + 16, '(Cg)', { fill: '#F4D03F', 'font-size': 11 }));

        // Solution S = [1, 2[ marquée sur l'axe des x
        var y0 = ax.y0;
        svg.appendChild(el('line', { x1: ax.sx(1), y1: y0, x2: ax.sx(2), y2: y0, stroke: '#4ECDC4', 'stroke-width': 4 }));
        dot(svg, ax.sx(1), y0, '#4ECDC4', 4);      // borne fermée en 1
        ring(svg, ax.sx(2), y0, '#4ECDC4', 4);     // borne ouverte en 2
        svg.appendChild(text((ax.sx(1) + ax.sx(2)) / 2, y0 + 22, 'S = [1, 2[', { fill: '#4ECDC4', 'font-size': 11.5, 'font-weight': 700, 'text-anchor': 'middle' }));
    }

    /* ============================================================
       graphImages : question 5 — images de [0,1] et [1,2] par f
       f([0,1]) = [1,2]  et  f([1,2]) = [1,2]
       ============================================================ */
    function drawGraphImages(svg) {
        var w = 380, h_ = 300;
        setResponsive(svg, w, h_);
        clear(svg);
        var xw = { xmin: -0.4, xmax: 2.4, ymin: -0.4, ymax: 2.4 };
        var ax = drawAxes(svg, {
            pad: { l: 30, r: 18, t: 18, b: 30 }, w: w, h: h_,
            xmin: xw.xmin, xmax: xw.xmax, ymin: xw.ymin, ymax: xw.ymax, gridStep: 1,
            xLabel: 'x', yLabel: 'y'
        });

        svg.appendChild(el('path', { d: pathFromFn(ax.sx, ax.sy, f, xw.xmin + 0.05, xw.xmax - 0.05), fill: 'none', stroke: '#FF6B6B', 'stroke-width': 2.4 }));
        svg.appendChild(text(ax.sx(2.15), ax.sy(f(2.15)) + 16, '(Cf)', { fill: '#FF6B6B', 'font-size': 11 }));

        // segments d'antécédents sur l'axe des x
        svg.appendChild(el('line', { x1: ax.sx(0), y1: ax.y0, x2: ax.sx(1), y2: ax.y0, stroke: '#4ECDC4', 'stroke-width': 4 }));
        svg.appendChild(el('line', { x1: ax.sx(1), y1: ax.y0, x2: ax.sx(2), y2: ax.y0, stroke: '#F4D03F', 'stroke-width': 4 }));

        // segment image commun sur l'axe des y : [1, 2]
        svg.appendChild(el('line', { x1: ax.x0, y1: ax.sy(1), x2: ax.x0, y2: ax.sy(2), stroke: '#BB8FCE', 'stroke-width': 4 }));

        [0, 1, 2].forEach(function (xv) {
            dashLine(svg, ax.sx(xv), ax.sy(f(xv)), ax.sx(xv), ax.y0, '#8B96A5');
            dashLine(svg, ax.x0, ax.sy(f(xv)), ax.sx(xv), ax.sy(f(xv)), '#8B96A5');
            dot(svg, ax.sx(xv), ax.sy(f(xv)), '#66FCF1', 3.2);
        });

        svg.appendChild(text(ax.sx(0.5), ax.y0 + 20, '[0,1]', { fill: '#4ECDC4', 'font-size': 10.5, 'text-anchor': 'middle' }));
        svg.appendChild(text(ax.sx(1.5), ax.y0 + 20, '[1,2]', { fill: '#F4D03F', 'font-size': 10.5, 'text-anchor': 'middle' }));
        svg.appendChild(text(ax.x0 - 24, (ax.sy(1) + ax.sy(2)) / 2, '[1,2]', { fill: '#BB8FCE', 'font-size': 10, 'text-anchor': 'middle' }));
        svg.appendChild(text(w / 2, 16, 'f([0,1]) = f([1,2]) = [1, 2]', { fill: '#8B96A5', 'font-size': 11, 'text-anchor': 'middle' }));
    }

    /* ============================================================
       graphH : question 6c — monotonie de h(x) = √(-x²+2x)
       h est le demi-cercle supérieur de centre (1;0), rayon 1.
       Croissante sur [0,1], décroissante sur [1,2].
       ============================================================ */
    function drawGraphH(svg) {
        var w = 380, h_ = 230;
        setResponsive(svg, w, h_);
        clear(svg);
        var xw = { xmin: -0.5, xmax: 2.5, ymin: -0.4, ymax: 1.5 };
        var ax = drawAxes(svg, {
            pad: { l: 30, r: 18, t: 18, b: 26 }, w: w, h: h_,
            xmin: xw.xmin, xmax: xw.xmax, ymin: xw.ymin, ymax: xw.ymax, gridStep: 1,
            xLabel: 'x', yLabel: 'y'
        });

        svg.appendChild(el('path', { d: pathFromFn(ax.sx, ax.sy, h, 0, 1, 50), fill: 'none', stroke: '#4ECDC4', 'stroke-width': 2.6 }));
        svg.appendChild(el('path', { d: pathFromFn(ax.sx, ax.sy, h, 1, 2, 50), fill: 'none', stroke: '#FF6B6B', 'stroke-width': 2.6 }));

        dot(svg, ax.sx(0), ax.sy(0), '#4ECDC4', 3.4);
        dot(svg, ax.sx(1), ax.sy(1), '#F4D03F', 3.8);
        dot(svg, ax.sx(2), ax.sy(0), '#FF6B6B', 3.4);

        svg.appendChild(text(ax.sx(0.5), ax.sy(h(0.5)) - 10, 'croissante ↗', { fill: '#4ECDC4', 'font-size': 10.5, 'text-anchor': 'middle' }));
        svg.appendChild(text(ax.sx(1.5), ax.sy(h(1.5)) - 10, 'décroissante ↘', { fill: '#FF6B6B', 'font-size': 10.5, 'text-anchor': 'middle' }));
        svg.appendChild(text(ax.sx(1), ax.sy(1) - 14, '(1 ; 1)', { fill: '#F4D03F', 'font-size': 10.5, 'text-anchor': 'middle' }));
        svg.appendChild(text(w / 2, 16, 'h(x) = √(-x²+2x)  sur  D_h = [0, 2]', { fill: '#8B96A5', 'font-size': 11, 'text-anchor': 'middle' }));
    }

    /* ---------- Initialisation ---------- */
    function init() {
        var map = {
            graphFCfCg: drawGraphFCfCg,
            graphIneq: drawGraphIneq,
            graphImages: drawGraphImages,
            graphH: drawGraphH
        };
        Object.keys(map).forEach(function (id) {
            var svg = document.getElementById(id);
            if (svg) {
                try { map[id](svg); } catch (e) { console.error('figuresvt_ex2:', id, e); }
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.addEventListener('resize', init);
})();
