/* ============================================================
   figuresvt_p3.js — Partie 3 : Égalité - Comparaison - Composée
   Fichier autonome (aucune dépendance à svg-utils.js).
   Dessine les <svg> : egaliteGraph, comparisonGraph, compositionGraph
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
  function ring(svg, cx, cy, color, r) {
    svg.appendChild(el('circle', { cx: cx, cy: cy, r: r || 3.4, fill: '#0D1117', stroke: color, 'stroke-width': 1.6 }));
  }
  function dashLine(svg, x1, y1, x2, y2, color) {
    svg.appendChild(el('line', { x1: x1, y1: y1, x2: x2, y2: y2, stroke: color, 'stroke-width': 1, 'stroke-dasharray': '4,3' }));
  }

  /* ---------- 1) egaliteGraph : h(x) = x²+1, Df=R (large) vs Dg=[-1.5,2] (restreint) ---------- */
  function drawEgaliteGraph(svg) {
    var w = 300, h = 180;
    setResponsive(svg, w, h);
    clear(svg);
    var ax = drawAxes(svg, { pad: { l: 26, r: 16, t: 16, b: 24 }, w: w, h: h, xmin: -2.6, xmax: 2.6, ymin: -0.6, ymax: 5.4, gridStep: 1, xLabel: 'x', yLabel: 'y' });
    var h_ = function (x) { return x * x + 1; };

    // f : courbe complète sur R (en pointillés clairs, hors [Dg])
    svg.appendChild(el('path', { d: pathFromFn(ax.sx, ax.sy, h_, -2.4, -1.5), fill: 'none', stroke: '#8B96A5', 'stroke-width': 1.8, 'stroke-dasharray': '5,3' }));
    svg.appendChild(el('path', { d: pathFromFn(ax.sx, ax.sy, h_, 2, 2.4), fill: 'none', stroke: '#8B96A5', 'stroke-width': 1.8, 'stroke-dasharray': '5,3' }));
    // g : partie commune, en trait plein teal, sur Dg=[-1.5,2]
    svg.appendChild(el('path', { d: pathFromFn(ax.sx, ax.sy, h_, -1.5, 2), fill: 'none', stroke: '#4ECDC4', 'stroke-width': 2.6 }));

    ring(svg, ax.sx(-1.5), ax.sy(h_(-1.5)), '#4ECDC4');
    ring(svg, ax.sx(2), ax.sy(h_(2)), '#4ECDC4');
    dot(svg, ax.sx(-2.4), ax.sy(h_(-2.4)), '#8B96A5', 2.6);
    dot(svg, ax.sx(2.4), ax.sy(h_(2.4)), '#8B96A5', 2.6);

    svg.appendChild(text(ax.sx(0.2), ax.sy(3.6), 'g : Dg=[−1,5 ; 2]', { fill: '#4ECDC4', 'font-size': 10, 'text-anchor': 'middle' }));
    svg.appendChild(text(ax.sx(-2.1), ax.sy(h_(-2.4)) - 10, 'f : Df=ℝ', { fill: '#8B96A5', 'font-size': 9.5, 'text-anchor': 'middle' }));
  }

  /* ---------- 2) comparisonGraph : f(x)=0.15(x-2)²+0.5 et g=f+1.5, f ≤ g ---------- */
  function drawComparisonGraph(svg) {
    var w = 300, h = 180;
    setResponsive(svg, w, h);
    clear(svg);
    var ax = drawAxes(svg, { pad: { l: 26, r: 16, t: 16, b: 24 }, w: w, h: h, xmin: -0.6, xmax: 4.6, ymin: -0.4, ymax: 3.8, gridStep: 1, xLabel: 'x', yLabel: 'y' });
    var f = function (x) { return 0.15 * (x - 2) * (x - 2) + 0.5; };
    var g = function (x) { return f(x) + 1.5; };

    // zone d'écart entre f et g (remplissage léger)
    var d = pathFromFn(ax.sx, ax.sy, f, -0.4, 4.4) + ' L' + ax.sx(4.4).toFixed(2) + ',' + ax.sy(g(4.4)).toFixed(2) + ' ' +
      pathFromFn(ax.sx, ax.sy, g, 4.4, -0.4).replace('M', 'L') + ' Z';
    svg.appendChild(el('path', { d: d, fill: 'rgba(78,205,196,0.08)', stroke: 'none' }));

    svg.appendChild(el('path', { d: pathFromFn(ax.sx, ax.sy, g, -0.4, 4.4), fill: 'none', stroke: '#FF6B6B', 'stroke-width': 2.2 }));
    svg.appendChild(el('path', { d: pathFromFn(ax.sx, ax.sy, f, -0.4, 4.4), fill: 'none', stroke: '#4ECDC4', 'stroke-width': 2.2 }));

    svg.appendChild(text(ax.sx(4.1), ax.sy(g(4.1)) - 8, 'g', { fill: '#FF6B6B', 'font-size': 13, 'text-anchor': 'middle' }));
    svg.appendChild(text(ax.sx(4.1), ax.sy(f(4.1)) + 16, 'f', { fill: '#4ECDC4', 'font-size': 13, 'text-anchor': 'middle' }));

    dashLine(svg, ax.sx(2), ax.sy(f(2)), ax.sx(2), ax.sy(g(2)), '#F4D03F');
    svg.appendChild(text(ax.sx(2) + 8, (ax.sy(f(2)) + ax.sy(g(2))) / 2, '1,5', { fill: '#F4D03F', 'font-size': 10 }));
  }

  /* ---------- 3) compositionGraph : schéma h = g∘f ---------- */
  function drawCompositionGraph(svg) {
    var w = 300, h = 150;
    setResponsive(svg, w, h);
    clear(svg);
    var cy = 68, r = 26;
    var cx1 = 46, cx2 = 150, cx3 = 254;

    addArrowMarker(svg, 'compArrowF', '#4ECDC4');
    addArrowMarker(svg, 'compArrowG', '#FF6B6B');
    addArrowMarker(svg, 'compArrowH', '#F4D03F');

    [
      { cx: cx1, lbl: 'Dƒ', sub: 'x', color: '#4ECDC4' },
      { cx: cx2, lbl: 'Dg', sub: 'f(x)', color: '#FF6B6B' },
      { cx: cx3, lbl: 'ℝ', sub: 'g(f(x))', color: '#F4D03F' }
    ].forEach(function (o) {
      svg.appendChild(el('circle', { cx: o.cx, cy: cy, r: r, fill: 'rgba(255,255,255,0.03)', stroke: o.color, 'stroke-width': 1.6 }));
      svg.appendChild(text(o.cx, cy - r - 8, o.lbl, { fill: o.color, 'font-size': 12, 'text-anchor': 'middle' }));
      svg.appendChild(text(o.cx, cy + 5, o.sub, { fill: '#E6EDF3', 'font-size': 11.5, 'text-anchor': 'middle' }));
    });

    svg.appendChild(el('line', { x1: cx1 + r + 4, y1: cy, x2: cx2 - r - 6, y2: cy, stroke: '#4ECDC4', 'stroke-width': 1.6, 'marker-end': 'url(#compArrowF)' }));
    svg.appendChild(text((cx1 + cx2) / 2, cy - 10, 'f', { fill: '#4ECDC4', 'font-size': 12, 'text-anchor': 'middle' }));

    svg.appendChild(el('line', { x1: cx2 + r + 4, y1: cy, x2: cx3 - r - 6, y2: cy, stroke: '#FF6B6B', 'stroke-width': 1.6, 'marker-end': 'url(#compArrowG)' }));
    svg.appendChild(text((cx2 + cx3) / 2, cy - 10, 'g', { fill: '#FF6B6B', 'font-size': 12, 'text-anchor': 'middle' }));

    // arc h = g∘f par-dessus
    var pathTop = 'M' + cx1 + ',' + (cy - r - 20) + ' Q' + ((cx1 + cx3) / 2) + ',' + (cy - r - 46) + ' ' + (cx3 - r - 10) + ',' + (cy - r - 20);
    svg.appendChild(el('path', { d: pathTop, fill: 'none', stroke: '#F4D03F', 'stroke-width': 1.6, 'marker-end': 'url(#compArrowH)' }));
    svg.appendChild(text((cx1 + cx3) / 2, cy - r - 50, 'h = g∘f', { fill: '#F4D03F', 'font-size': 12, 'text-anchor': 'middle' }));
  }

  function init() {
    var map = {
      egaliteGraph: drawEgaliteGraph,
      comparisonGraph: drawComparisonGraph,
      compositionGraph: drawCompositionGraph
    };
    Object.keys(map).forEach(function (id) {
      var svg = document.getElementById(id);
      if (svg) { try { map[id](svg); } catch (e) { console.error('figuresvt_p3:', id, e); } }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
