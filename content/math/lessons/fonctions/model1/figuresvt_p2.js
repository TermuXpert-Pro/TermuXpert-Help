/* ============================================================
   figuresvt_p2.js — Partie 2 : Majorée / minorée / bornée,
   Extremums, Fonction périodique
   Fichier autonome (aucune dépendance à svg-utils.js).
   Dessine les <svg> : borneeGraph, maxGraph, minGraph, periodiqueGraph
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
    svg.appendChild(el('circle', { cx: cx, cy: cy, r: r || 3.2, fill: color, stroke: '#0D1117', 'stroke-width': 1 }));
  }
  function dashLine(svg, x1, y1, x2, y2, color) {
    svg.appendChild(el('line', { x1: x1, y1: y1, x2: x2, y2: y2, stroke: color, 'stroke-width': 1, 'stroke-dasharray': '4,3' }));
  }

  /* ---------- 1) borneeGraph : f(x) = 2 + sin(x), majorée M=3, minorée m=1 ---------- */
  function drawBorneeGraph(svg) {
    var w = 300, h = 180;
    setResponsive(svg, w, h);
    clear(svg);
    var xmax = 4 * Math.PI;
    var ax = drawAxes(svg, { pad: { l: 26, r: 16, t: 16, b: 24 }, w: w, h: h, xmin: -0.4, xmax: xmax + 0.4, ymin: -0.4, ymax: 4.3, gridStep: 1, grid: false, xLabel: 'x', yLabel: 'y' });
    var f = function (x) { return 2 + Math.sin(x); };
    svg.appendChild(el('path', { d: pathFromFn(ax.sx, ax.sy, f, 0, xmax, 120), fill: 'none', stroke: '#4ECDC4', 'stroke-width': 2 }));

    // droites M=3 et m=1
    svg.appendChild(el('line', { x1: ax.sx(0), y1: ax.sy(3), x2: ax.sx(xmax), y2: ax.sy(3), stroke: '#FF6B6B', 'stroke-width': 1.4, 'stroke-dasharray': '5,3' }));
    svg.appendChild(text(ax.sx(xmax) - 4, ax.sy(3) - 6, 'M = 3', { fill: '#FF6B6B', 'font-size': 10.5, 'text-anchor': 'end' }));
    svg.appendChild(el('line', { x1: ax.sx(0), y1: ax.sy(1), x2: ax.sx(xmax), y2: ax.sy(1), stroke: '#F4D03F', 'stroke-width': 1.4, 'stroke-dasharray': '5,3' }));
    svg.appendChild(text(ax.sx(xmax) - 4, ax.sy(1) + 14, 'm = 1', { fill: '#F4D03F', 'font-size': 10.5, 'text-anchor': 'end' }));
  }

  /* ---------- 2) maxGraph : maximum absolu en x0 = 2 ---------- */
  function drawMaxGraph(svg) {
    var w = 150, h = 150;
    setResponsive(svg, w, h);
    clear(svg);
    var ax = drawAxes(svg, { pad: { l: 18, r: 12, t: 16, b: 18 }, w: w, h: h, xmin: -0.3, xmax: 4.3, ymin: -0.3, ymax: 3.6, gridStep: 1, xLabel: 'x', yLabel: 'y' });
    var f = function (x) { return 3 - 0.75 * (x - 2) * (x - 2); };
    svg.appendChild(el('path', { d: pathFromFn(ax.sx, ax.sy, f, 0, 4), fill: 'none', stroke: '#4ECDC4', 'stroke-width': 2.2 }));
    dashLine(svg, ax.sx(2), ax.sy(f(2)), ax.sx(2), ax.y0, '#F4D03F');
    dashLine(svg, ax.sx(2), ax.sy(f(2)), ax.x0, ax.sy(f(2)), '#F4D03F');
    dot(svg, ax.sx(2), ax.sy(f(2)), '#F4D03F', 3.4);
    svg.appendChild(text(ax.sx(2), 12, 'f(x₀) max', { fill: '#F4D03F', 'font-size': 9.5, 'text-anchor': 'middle' }));
    svg.appendChild(text(ax.sx(2), ax.y0 + 16, 'x₀=2', { fill: '#E6EDF3', 'font-size': 9.5, 'text-anchor': 'middle' }));
  }

  /* ---------- 3) minGraph : minimum absolu en x0 = 2 ---------- */
  function drawMinGraph(svg) {
    var w = 150, h = 150;
    setResponsive(svg, w, h);
    clear(svg);
    var ax = drawAxes(svg, { pad: { l: 18, r: 12, t: 16, b: 18 }, w: w, h: h, xmin: -0.3, xmax: 4.3, ymin: -0.3, ymax: 3.6, gridStep: 1, xLabel: 'x', yLabel: 'y' });
    var f = function (x) { return 0.6 + 0.75 * (x - 2) * (x - 2); };
    svg.appendChild(el('path', { d: pathFromFn(ax.sx, ax.sy, f, 0, 4), fill: 'none', stroke: '#FF6B6B', 'stroke-width': 2.2 }));
    dashLine(svg, ax.sx(2), ax.sy(f(2)), ax.sx(2), ax.y0, '#F4D03F');
    dashLine(svg, ax.sx(2), ax.sy(f(2)), ax.x0, ax.sy(f(2)), '#F4D03F');
    dot(svg, ax.sx(2), ax.sy(f(2)), '#F4D03F', 3.4);
    svg.appendChild(text(ax.sx(2), ax.sy(f(2)) - 10, 'f(x₀) min', { fill: '#F4D03F', 'font-size': 9.5, 'text-anchor': 'middle' }));
    svg.appendChild(text(ax.sx(2), ax.y0 + 16, 'x₀=2', { fill: '#E6EDF3', 'font-size': 9.5, 'text-anchor': 'middle' }));
  }

  /* ---------- 4) periodiqueGraph : courbe périodique, translation Ti ---------- */
  function drawPeriodiqueGraph(svg) {
    var w = 300, h = 170;
    setResponsive(svg, w, h);
    clear(svg);
    var T = 2.4;
    var xmax = 3.2 * T;
    var ax = drawAxes(svg, { pad: { l: 22, r: 16, t: 18, b: 22 }, w: w, h: h, xmin: -0.3, xmax: xmax, ymin: -2.1, ymax: 2.3, grid: false, xLabel: 'x', yLabel: 'y' });
    // motif triangulaire répété (pas une simple sinusoïde, pour bien montrer la période visuellement)
    var motif = function (x) {
      var t = ((x % T) + T) % T;
      var u = t / T; // 0..1
      if (u < 0.5) return -1.6 + 6.4 * u; // monte
      return 1.6 - 6.4 * (u - 0.5); // descend
    };
    svg.appendChild(el('path', { d: pathFromFn(ax.sx, ax.sy, motif, 0, xmax, 200), fill: 'none', stroke: '#4ECDC4', 'stroke-width': 2 }));

    // flèche de translation T·i entre deux motifs
    addArrowMarker(svg, 'periodArrow', '#F4D03F');
    var yArrow = ax.sy(-1.9);
    svg.appendChild(el('line', { x1: ax.sx(0), y1: yArrow, x2: ax.sx(T) - 4, y2: yArrow, stroke: '#F4D03F', 'stroke-width': 1.5, 'marker-end': 'url(#periodArrow)' }));
    svg.appendChild(text((ax.sx(0) + ax.sx(T)) / 2, yArrow - 6, 'T', { fill: '#F4D03F', 'font-size': 11, 'text-anchor': 'middle' }));

    // repères verticaux pointillés marquant chaque période
    for (var k = 0; k <= 3; k++) {
      dashLine(svg, ax.sx(k * T), ax.sy(2.1), ax.sx(k * T), ax.sy(-2.0), '#2A3542');
    }
  }

  function init() {
    var map = {
      borneeGraph: drawBorneeGraph,
      maxGraph: drawMaxGraph,
      minGraph: drawMinGraph,
      periodiqueGraph: drawPeriodiqueGraph
    };
    Object.keys(map).forEach(function (id) {
      var svg = document.getElementById(id);
      if (svg) { try { map[id](svg); } catch (e) { console.error('figuresvt_p2:', id, e); } }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

