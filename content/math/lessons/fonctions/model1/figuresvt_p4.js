/* ============================================================
   figuresvt_p4.js — Partie 4 : f(x) = ax³, f(x) = √x + a
   Fichier autonome (aucune dépendance à svg-utils.js).
   Dessine les <svg> : cubeUpGraph, cubeDownGraph, sqrtGraph
   ============================================================ */
(function () {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';

  function el(tag, attrs) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) if (attrs.hasOwnProperty(k)) e.setAttribute(k, attrs[k]);
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
  function scale(vmin, vmax, pmin, pmax) {
    return function (v) { return pmin + (v - vmin) * (pmax - pmin) / (vmax - vmin); };
  }
  function drawAxes(svg, opts) {
    var pad = opts.pad, w = opts.w, h = opts.h;
    var xmin = opts.xmin, xmax = opts.xmax, ymin = opts.ymin, ymax = opts.ymax;
    var sx = scale(xmin, xmax, pad.l, w - pad.r);
    var sy = scale(ymin, ymax, h - pad.b, pad.t);
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
    steps = steps || 70;
    var d = '';
    for (var i = 0; i <= steps; i++) {
      var x = x1 + (x2 - x1) * i / steps;
      var y = fn(x);
      d += (i === 0 ? 'M' : 'L') + sx(x).toFixed(2) + ',' + sy(y).toFixed(2) + ' ';
    }
    return d;
  }
  function dot(svg, cx, cy, color, r) {
    svg.appendChild(el('circle', { cx: cx, cy: cy, r: r || 3.2, fill: color, stroke: '#0D1117', 'stroke-width': 1 }));
  }

  /* ---------- 1) cubeUpGraph : f(x) = 0.5x³, a>0, strictement croissante ---------- */
  function drawCubeUpGraph(svg) {
    var w = 400, h = 180;
    setResponsive(svg, w, h);
    clear(svg);
    var ax = drawAxes(svg, { pad: { l: 32, r: 20, t: 16, b: 24 }, w: w, h: h, xmin: -2.6, xmax: 2.6, ymin: -3.6, ymax: 3.6, gridStep: 1, xLabel: 'x', yLabel: 'y' });
    var f = function (x) { return 0.5 * x * x * x; };
    svg.appendChild(el('path', { d: pathFromFn(ax.sx, ax.sy, f, -2.35, 2.35), fill: 'none', stroke: '#4ECDC4', 'stroke-width': 2.4 }));
    dot(svg, ax.x0, ax.y0, '#4ECDC4', 2.6);
    svg.appendChild(text(w - 30, 26, 'f(x) = a·x³ (a>0)', { fill: '#4ECDC4', 'font-size': 11, 'text-anchor': 'end' }));
    // flèche croissance générale
    addArrowMarker(svg, 'cubeUpArrow', '#4ECDC4');
    svg.appendChild(el('line', { x1: ax.sx(-2.0), y1: ax.sy(-2.9), x2: ax.sx(2.0), y2: ax.sy(2.9), stroke: 'none' }));
  }

  /* ---------- 2) cubeDownGraph : f(x) = -0.5x³, a<0, strictement décroissante ---------- */
  function drawCubeDownGraph(svg) {
    var w = 400, h = 180;
    setResponsive(svg, w, h);
    clear(svg);
    var ax = drawAxes(svg, { pad: { l: 32, r: 20, t: 16, b: 24 }, w: w, h: h, xmin: -2.6, xmax: 2.6, ymin: -3.6, ymax: 3.6, gridStep: 1, xLabel: 'x', yLabel: 'y' });
    var f = function (x) { return -0.5 * x * x * x; };
    svg.appendChild(el('path', { d: pathFromFn(ax.sx, ax.sy, f, -2.35, 2.35), fill: 'none', stroke: '#FF6B6B', 'stroke-width': 2.4 }));
    dot(svg, ax.x0, ax.y0, '#FF6B6B', 2.6);
    svg.appendChild(text(w - 30, 26, 'f(x) = a·x³ (a<0)', { fill: '#FF6B6B', 'font-size': 11, 'text-anchor': 'end' }));
  }

  /* ---------- 3) sqrtGraph : f(x) = √x ---------- */
  function drawSqrtGraph(svg) {
    var w = 500, h = 250;
    setResponsive(svg, w, h);
    clear(svg);
    var ax = drawAxes(svg, { pad: { l: 34, r: 24, t: 20, b: 30 }, w: w, h: h, xmin: -0.6, xmax: 9.5, ymin: -0.6, ymax: 3.6, gridStep: 1, xLabel: 'x', yLabel: 'y' });
    var f = function (x) { return Math.sqrt(x); };
    svg.appendChild(el('path', { d: pathFromFn(ax.sx, ax.sy, f, 0, 9.2, 90), fill: 'none', stroke: '#4ECDC4', 'stroke-width': 2.4 }));
    dot(svg, ax.sx(0), ax.sy(0), '#4ECDC4', 3.4);

    // domaine Df = [0, +∞[ marqué sur l'axe
    svg.appendChild(el('line', { x1: ax.sx(0), y1: ax.y0, x2: ax.sx(9.2), y2: ax.y0, stroke: '#4ECDC4', 'stroke-width': 3, opacity: 0.35 }));
    svg.appendChild(text(ax.sx(0), ax.y0 + 20, 'D_f = [0, +∞[', { fill: '#8B96A5', 'font-size': 11 }));

    // points croissants pour illustrer x<x' => f(x)<f(x')
    [1, 4, 9].forEach(function (xv) {
      dot(svg, ax.sx(xv), ax.sy(f(xv)), '#F4D03F', 2.8);
      svg.appendChild(text(ax.sx(xv), ax.sy(f(xv)) - 10, '(' + xv + ',' + f(xv) + ')', { fill: '#F4D03F', 'font-size': 9.5, 'text-anchor': 'middle' }));
    });
  }

  function init() {
    var map = {
      cubeUpGraph: drawCubeUpGraph,
      cubeDownGraph: drawCubeDownGraph,
      sqrtGraph: drawSqrtGraph
    };
    Object.keys(map).forEach(function (id) {
      var svg = document.getElementById(id);
      if (svg) { try { map[id](svg); } catch (e) { console.error('figuresvt_p4:', id, e); } }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
