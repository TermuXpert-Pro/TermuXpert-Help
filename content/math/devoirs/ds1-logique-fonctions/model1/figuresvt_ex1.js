/* ============================================================
   figuresvt_ex1.js — Devoir Surveillé N°1 (Modèle 1)
   Exercice 1 : Logique mathématique
   Fichier autonome (self-contained) : aucune dépendance à une
   librairie partagée (svg-utils.js). Toutes les fonctions
   utilitaires nécessaires sont définies ici, à l'intérieur de
   ce même fichier.

   Figures dessinées :
     - fig1_1 : graphe de x ↦ x + 16/x sur ]0, +∞[, illustrant
                le contre-exemple x = 4 pour la question 1 (P1).
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
        steps = steps || 80;
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
    function dashLine(svg, x1, y1, x2, y2, color) {
        svg.appendChild(el('line', { x1: x1, y1: y1, x2: x2, y2: y2, stroke: color, 'stroke-width': 1, 'stroke-dasharray': '4,3' }));
    }

    /* ============================================================
       fig1_1 : x ↦ x + 16/x  sur ]0, +∞[
       Illustre pourquoi P1 est fausse : le minimum de la fonction
       vaut exactement 8, atteint en x = 4 (contre-exemple).
       ============================================================ */
    function drawFig1_1(svg) {
        var w = 380, h = 250;
        setResponsive(svg, w, h);
        clear(svg);
        var ax = drawAxes(svg, {
            pad: { l: 30, r: 18, t: 18, b: 26 }, w: w, h: h,
            xmin: -0.4, xmax: 10.6, ymin: 5, ymax: 18.5, gridStep: 2,
            xLabel: 'x', yLabel: 'y'
        });
        var f = function (x) { return x + 16 / x; };

        // Ligne de repère horizontale y = 8
        dashLine(svg, ax.sx(-0.2), ax.sy(8), ax.sx(10.4), ax.sy(8), '#F4D03F');
        svg.appendChild(text(ax.sx(10.4) - 4, ax.sy(8) - 6, 'y = 8', { fill: '#F4D03F', 'font-size': 10.5, 'text-anchor': 'end' }));

        // Courbe de f, en deux branches autour du minimum
        svg.appendChild(el('path', { d: pathFromFn(ax.sx, ax.sy, f, 0.85, 4), fill: 'none', stroke: '#4ECDC4', 'stroke-width': 2.4 }));
        svg.appendChild(el('path', { d: pathFromFn(ax.sx, ax.sy, f, 4, 10.4), fill: 'none', stroke: '#4ECDC4', 'stroke-width': 2.4 }));

        // Point du minimum / contre-exemple (4 ; 8)
        dashLine(svg, ax.sx(4), ax.sy(8), ax.sx(4), ax.y0, '#FF6B6B');
        dot(svg, ax.sx(4), ax.sy(8), '#FF6B6B', 4);
        svg.appendChild(text(ax.sx(4) + 8, ax.sy(8) - 10, 'x = 4', { fill: '#FF6B6B', 'font-size': 11, 'font-weight': 700 }));
        svg.appendChild(text(ax.sx(4) + 8, ax.sy(8) + 16, 'f(4) = 8', { fill: '#FF6B6B', 'font-size': 10.5 }));

        svg.appendChild(text(w - 16, 22, 'f(x) = x + 16/x', { fill: '#4ECDC4', 'font-size': 11.5, 'text-anchor': 'end' }));
    }

    /* ---------- Initialisation ---------- */
    function init() {
        var map = {
            fig1_1: drawFig1_1
        };
        Object.keys(map).forEach(function (id) {
            var svg = document.getElementById(id);
            if (svg) {
                try { map[id](svg); } catch (e) { console.error('figuresvt_ex1:', id, e); }
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
