/* ============================================================
   figuresvt_p5.js — Partie 5 : Exercices (majorée, minimum, variations)
   Fichier autonome (aucune dépendance à svg-utils.js).
   Dessine les <svg> : graph1a, graph2, graph3
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
  function dashLine(svg, x1, y1, x2, y2, color) {
    svg.appendChild(el('line', { x1: x1, y1: y1, x2: x2, y2: y2, stroke: color, 'stroke-width': 1, 'stroke-dasharray': '4,3' }));
  }

  /* ---------- graph1a : f(x) = -x²+2x = -(x-1)²+1, majorée par M=1 ---------- */
  function drawGraph1a(svg) {
    var w = 300, h = 150;
    setResponsive(svg, w, h);
    clear(svg);
    var ax = drawAxes(svg, { pad: { l: 24, r: 14, t: 16, b: 20 }, w: w, h: h, xmin: -1.5, xmax: 3.5, ymin: -3.6, ymax: 1.8, gridStep: 1, xLabel: 'x', yLabel: 'y' });
    var f = function (x) { return -x * x + 2 * x; };
    svg.appendChild(el('path', { d: pathFromFn(ax.sx, ax.sy, f, -1.2, 3.2), fill: 'none', stroke: '#4ECDC4', 'stroke-width': 2.2 }));
    svg.appendChild(el('line', { x1: ax.sx(-1.2), y1: ax.sy(1), x2: ax.sx(3.2), y2: ax.sy(1), stroke: '#FF6B6B', 'stroke-width': 1.4, 'stroke-dasharray': '5,3' }));
    svg.appendChild(text(ax.sx(3.2) - 4, ax.sy(1) - 6, 'M = 1', { fill: '#FF6B6B', 'font-size': 10, 'text-anchor': 'end' }));
    dot(svg, ax.sx(1), ax.sy(1), '#F4D03F', 3);
    svg.appendChild(text(ax.sx(1), ax.sy(1) - 10, '(1,1)', { fill: '#F4D03F', 'font-size': 9.5, 'text-anchor': 'middle' }));
  }

  /* ---------- graph2 : f(x) = x²+2x+3 = (x+1)²+2, minimum en (-1,2) ---------- */
  function drawGraph2(svg) {
    var w = 300, h = 150;
    setResponsive(svg, w, h);
    clear(svg);
    var ax = drawAxes(svg, { pad: { l: 24, r: 14, t: 16, b: 20 }, w: w, h: h, xmin: -3.4, xmax: 2.4, ymin: -0.6, ymax: 6.4, gridStep: 1, xLabel: 'x', yLabel: 'y' });
    var f = function (x) { return x * x + 2 * x + 3; };
    svg.appendChild(el('path', { d: pathFromFn(ax.sx, ax.sy, f, -3.1, 2.1), fill: 'none', stroke: '#4ECDC4', 'stroke-width': 2.2 }));
    dashLine(svg, ax.sx(-1), ax.sy(2), ax.sx(-1), ax.y0, '#F4D03F');
    dashLine(svg, ax.sx(-1), ax.sy(2), ax.x0, ax.sy(2), '#F4D03F');
    dot(svg, ax.sx(-1), ax.sy(2), '#F4D03F', 3.4);
    svg.appendChild(text(ax.sx(-1) + 8, ax.sy(2) - 8, '(−1, 2)', { fill: '#F4D03F', 'font-size': 10 }));
  }

  /* ---------- graph3 : f(x) = x² + √2, décroissante puis croissante en x=0 ---------- */
  function drawGraph3(svg) {
    var w = 300, h = 150;
    setResponsive(svg, w, h);
    clear(svg);
    var ax = drawAxes(svg, { pad: { l: 24, r: 14, t: 16, b: 20 }, w: w, h: h, xmin: -2.4, xmax: 2.4, ymin: -0.4, ymax: 5.6, gridStep: 1, xLabel: 'x', yLabel: 'y' });
    var sqrt2 = Math.SQRT2;
    var f = function (x) { return x * x + sqrt2; };
    svg.appendChild(el('path', { d: pathFromFn(ax.sx, ax.sy, f, -2.1, 0), fill: 'none', stroke: '#FF6B6B', 'stroke-width': 2.2 }));
    svg.appendChild(el('path', { d: pathFromFn(ax.sx, ax.sy, f, 0, 2.1), fill: 'none', stroke: '#4ECDC4', 'stroke-width': 2.2 }));
    dot(svg, ax.sx(0), ax.sy(sqrt2), '#F4D03F', 3.2);
    svg.appendChild(text(ax.sx(0) + 8, ax.sy(sqrt2) - 8, '(0, √2)', { fill: '#F4D03F', 'font-size': 10 }));
    svg.appendChild(text(ax.sx(-1.4), ax.sy(4.6), 'décroît', { fill: '#FF6B6B', 'font-size': 9.5, 'text-anchor': 'middle' }));
    svg.appendChild(text(ax.sx(1.4), ax.sy(4.6), 'croît', { fill: '#4ECDC4', 'font-size': 9.5, 'text-anchor': 'middle' }));
  }

  function init() {
    var map = {
      graph1a: drawGraph1a,
      graph2: drawGraph2,
      graph3: drawGraph3
    };
    Object.keys(map).forEach(function (id) {
      var svg = document.getElementById(id);
      if (svg) { try { map[id](svg); } catch (e) { console.error('figuresvt_p5:', id, e); } }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
