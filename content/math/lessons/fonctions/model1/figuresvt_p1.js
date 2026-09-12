/* ============================================================
   figuresvt_p1.js — Partie 1 : Rappels
   Fichier autonome (aucune dépendance à svg-utils.js).
   Dessine les <svg> : domainMapGraph, paireGraph, impaireGraph,
   monotonieGraph, tauxGraph
   ============================================================ */
(function () {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';

  /* ---------- Helpers locaux (dupliqués volontairement dans chaque part) ---------- */
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
  // linear scale factory: maps [vmin,vmax] -> [pmin,pmax]
  function scale(vmin, vmax, pmin, pmax) {
    return function (v) { return pmin + (v - vmin) * (pmax - pmin) / (vmax - vmin); };
  }
  // draws a cartesian axes system inside svg, returns {sx, sy}
  function drawAxes(svg, opts) {
    var pad = opts.pad, w = opts.w, h = opts.h;
    var xmin = opts.xmin, xmax = opts.xmax, ymin = opts.ymin, ymax = opts.ymax;
    var sx = scale(xmin, xmax, pad.l, w - pad.r);
    var sy = scale(ymin, ymax, h - pad.b, pad.t);
    var axisColor = '#3A4552';
    addArrowMarker(svg, svg.id + '_arrowX', axisColor);
    addArrowMarker(svg, svg.id + '_arrowY', axisColor);

    // grid (light)
    if (opts.grid !== false) {
      var gStep = opts.gridStep || 1;
      for (var gx = Math.ceil(xmin / gStep) * gStep; gx <= xmax; gx += gStep) {
        svg.appendChild(el('line', { x1: sx(gx), y1: sy(ymin), x2: sx(gx), y2: sy(ymax), stroke: '#1C2530', 'stroke-width': 1 }));
      }
      for (var gy = Math.ceil(ymin / gStep) * gStep; gy <= ymax; gy += gStep) {
        svg.appendChild(el('line', { x1: sx(xmin), y1: sy(gy), x2: sx(xmax), y2: sy(gy), stroke: '#1C2530', 'stroke-width': 1 }));
      }
    }

    // axes
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
    steps = steps || 60;
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

  /* ---------- 1) domainMapGraph : schéma "x associé à au plus une image" ---------- */
  function drawDomainMap(svg) {
    var w = 460, h = 220;
    setResponsive(svg, w, h);
    clear(svg);

    var leftCx = 130, rightCx = 330, cy = 110, rx = 95, ry = 85;
    // ensembles
    svg.appendChild(el('ellipse', { cx: leftCx, cy: cy, rx: rx, ry: ry, fill: 'rgba(78,205,196,0.08)', stroke: '#4ECDC4', 'stroke-width': 1.6 }));
    svg.appendChild(el('ellipse', { cx: rightCx, cy: cy, rx: rx, ry: ry, fill: 'rgba(102,252,241,0.05)', stroke: '#66FCF1', 'stroke-width': 1.6 }));
    svg.appendChild(text(leftCx, cy - ry - 12, 'ℝ', { fill: '#8B96A5', 'font-size': 13, 'text-anchor': 'middle' }));
    svg.appendChild(text(rightCx, cy - ry - 12, 'ℝ', { fill: '#8B96A5', 'font-size': 13, 'text-anchor': 'middle' }));

    // sous-ensemble Df à l'intérieur de l'ensemble de gauche
    svg.appendChild(el('ellipse', { cx: leftCx + 6, cy: cy + 4, rx: rx - 34, ry: ry - 22, fill: 'rgba(78,205,196,0.14)', stroke: '#4ECDC4', 'stroke-width': 1.2, 'stroke-dasharray': '3,3' }));
    svg.appendChild(text(leftCx + 6, cy + ry - 14, '$D_f$', { fill: '#4ECDC4', 'font-size': 13, 'text-anchor': 'middle' }));

    addArrowMarker(svg, 'domainMapArrow', '#F4D03F');

    var pts = [
      { x: leftCx - 24, y: cy - 34, lbl: 'x₁', ty: rightCx - 26, tyv: cy - 40, tlbl: 'f(x₁)' },
      { x: leftCx + 2, y: cy + 8, lbl: 'x₂', ty: rightCx - 4, tyv: cy + 10, tlbl: 'f(x₂)' },
      { x: leftCx - 30, y: cy + 40, lbl: 'x₃', ty: rightCx - 26, tyv: cy + 44, tlbl: 'f(x₃)' }
    ];
    pts.forEach(function (p) {
      dot(svg, p.x, p.y, '#4ECDC4');
      svg.appendChild(text(p.x - 12, p.y + 4, p.lbl, { fill: '#E6EDF3', 'font-size': 11, 'text-anchor': 'end' }));
      dot(svg, p.ty, p.tyv, '#66FCF1');
      svg.appendChild(text(p.ty + 12, p.tyv + 4, p.tlbl, { fill: '#E6EDF3', 'font-size': 11 }));
      svg.appendChild(el('line', { x1: p.x + 5, y1: p.y, x2: p.ty - 6, y2: p.tyv, stroke: '#F4D03F', 'stroke-width': 1.3, 'marker-end': 'url(#domainMapArrow)' }));
    });

    // point hors Df : pas d'image
    var xOut = { x: leftCx + 58, y: cy - 44 };
    dot(svg, xOut.x, xOut.y, '#FF6B6B');
    svg.appendChild(text(xOut.x + 10, xOut.y - 4, 'x₄ ∉ Dƒ', { fill: '#FF6B6B', 'font-size': 10.5 }));
    svg.appendChild(text(xOut.x + 10, xOut.y + 10, '(pas d\u2019image)', { fill: '#8B96A5', 'font-size': 9.5 }));

    svg.appendChild(text(w / 2, h - 6, 'Chaque x de Dƒ a au plus UNE image f(x)', { fill: '#8B96A5', 'font-size': 10.5, 'text-anchor': 'middle' }));
  }

  /* ---------- 2) paireGraph : f(x) = x² (paire) ---------- */
  function drawPaireGraph(svg) {
    var w = 150, h = 150;
    setResponsive(svg, w, h);
    clear(svg);
    var ax = drawAxes(svg, { pad: { l: 18, r: 12, t: 14, b: 18 }, w: w, h: h, xmin: -2.2, xmax: 2.2, ymin: -0.6, ymax: 4.3, gridStep: 1, xLabel: 'x', yLabel: 'y' });
    var f = function (x) { return x * x; };
    svg.appendChild(el('path', { d: pathFromFn(ax.sx, ax.sy, f, -2.05, 2.05), fill: 'none', stroke: '#4ECDC4', 'stroke-width': 2 }));

    var a = 1.5;
    [a, -a].forEach(function (xv) {
      dashLine(svg, ax.sx(xv), ax.sy(f(xv)), ax.sx(xv), ax.y0, '#F4D03F');
      dot(svg, ax.sx(xv), ax.sy(f(xv)), '#F4D03F', 2.6);
    });
    dashLine(svg, ax.sx(-a), ax.sy(f(a)), ax.sx(a), ax.sy(f(a)), '#8B96A5');
    svg.appendChild(text(w / 2, 12, 'f(x) = x²', { fill: '#E6EDF3', 'font-size': 10.5, 'text-anchor': 'middle' }));
  }

  /* ---------- 3) impaireGraph : f(x) = x³ (impaire) ---------- */
  function drawImpaireGraph(svg) {
    var w = 150, h = 150;
    setResponsive(svg, w, h);
    clear(svg);
    var ax = drawAxes(svg, { pad: { l: 18, r: 12, t: 14, b: 18 }, w: w, h: h, xmin: -1.7, xmax: 1.7, ymin: -3.2, ymax: 3.2, gridStep: 1, xLabel: 'x', yLabel: 'y' });
    var f = function (x) { return x * x * x; };
    svg.appendChild(el('path', { d: pathFromFn(ax.sx, ax.sy, f, -1.55, 1.55), fill: 'none', stroke: '#FF6B6B', 'stroke-width': 2 }));

    var a = 1.15;
    dot(svg, ax.sx(a), ax.sy(f(a)), '#F4D03F', 2.6);
    dot(svg, ax.sx(-a), ax.sy(f(-a)), '#F4D03F', 2.6);
    dashLine(svg, ax.sx(a), ax.sy(f(a)), ax.sx(-a), ax.sy(f(-a)), '#8B96A5');
    dot(svg, ax.x0, ax.y0, '#66FCF1', 2.4);
    svg.appendChild(text(w / 2, 12, 'f(x) = x³', { fill: '#E6EDF3', 'font-size': 10.5, 'text-anchor': 'middle' }));
  }

  /* ---------- 4) monotonieGraph : f(x) = (x-1)² ---------- */
  function drawMonotonieGraph(svg) {
    var w = 300, h = 180;
    setResponsive(svg, w, h);
    clear(svg);
    var ax = drawAxes(svg, { pad: { l: 26, r: 16, t: 16, b: 24 }, w: w, h: h, xmin: -1.3, xmax: 3.3, ymin: -0.8, ymax: 4.6, gridStep: 1, xLabel: 'x', yLabel: 'y' });
    var f = function (x) { return (x - 1) * (x - 1); };

    // partie décroissante (x<=1) en rouge, croissante (x>=1) en teal
    svg.appendChild(el('path', { d: pathFromFn(ax.sx, ax.sy, f, -1.15, 1), fill: 'none', stroke: '#FF6B6B', 'stroke-width': 2.4 }));
    svg.appendChild(el('path', { d: pathFromFn(ax.sx, ax.sy, f, 1, 3.15), fill: 'none', stroke: '#4ECDC4', 'stroke-width': 2.4 }));

    dot(svg, ax.sx(1), ax.sy(0), '#F4D03F', 3.4);
    svg.appendChild(text(ax.sx(1), ax.sy(0) + 18, '(1, 0)', { fill: '#F4D03F', 'font-size': 10, 'text-anchor': 'middle' }));

    addArrowMarker(svg, 'monoArrowRed', '#FF6B6B');
    addArrowMarker(svg, 'monoArrowTeal', '#4ECDC4');
    svg.appendChild(el('line', { x1: ax.sx(-1.15), y1: ax.sy(4.2), x2: ax.sx(-0.35), y2: ax.sy(4.2), stroke: '#FF6B6B', 'stroke-width': 1.4, 'marker-end': 'url(#monoArrowRed)' }));
    svg.appendChild(text(ax.sx(-0.75), ax.sy(4.2) - 6, 'décroît', { fill: '#FF6B6B', 'font-size': 9.5, 'text-anchor': 'middle' }));
    svg.appendChild(el('line', { x1: ax.sx(2.35), y1: ax.sy(4.2), x2: ax.sx(3.15), y2: ax.sy(4.2), stroke: '#4ECDC4', 'stroke-width': 1.4, 'marker-end': 'url(#monoArrowTeal)' }));
    svg.appendChild(text(ax.sx(2.75), ax.sy(4.2) - 6, 'croît', { fill: '#4ECDC4', 'font-size': 9.5, 'text-anchor': 'middle' }));
  }

  /* ---------- 5) tauxGraph : sécante (AB), taux d'accroissement ---------- */
  function drawTauxGraph(svg) {
    var w = 300, h = 190;
    setResponsive(svg, w, h);
    clear(svg);
    var ax = drawAxes(svg, { pad: { l: 26, r: 16, t: 18, b: 24 }, w: w, h: h, xmin: -0.6, xmax: 4.3, ymin: -0.6, ymax: 4.6, gridStep: 1, xLabel: 'x', yLabel: 'y' });
    var f = function (x) { return 0.32 * x * x + 0.3; };
    svg.appendChild(el('path', { d: pathFromFn(ax.sx, ax.sy, f, -0.4, 4.1), fill: 'none', stroke: '#4ECDC4', 'stroke-width': 2 }));

    var xA = 0.6, xB = 3.4;
    var A = { x: xA, y: f(xA) }, B = { x: xB, y: f(xB) };
    // sécante prolongée
    var slope = (B.y - A.y) / (B.x - A.x);
    var extX1 = -0.4, extX2 = 4.1;
    svg.appendChild(el('line', {
      x1: ax.sx(extX1), y1: ax.sy(A.y + slope * (extX1 - A.x)),
      x2: ax.sx(extX2), y2: ax.sy(A.y + slope * (extX2 - A.x)),
      stroke: '#F4D03F', 'stroke-width': 1.6, 'stroke-dasharray': '5,3'
    }));

    // triangle Δx, Δy
    dashLine(svg, ax.sx(A.x), ax.sy(A.y), ax.sx(B.x), ax.sy(A.y), '#8B96A5');
    dashLine(svg, ax.sx(B.x), ax.sy(A.y), ax.sx(B.x), ax.sy(B.y), '#8B96A5');
    svg.appendChild(text((ax.sx(A.x) + ax.sx(B.x)) / 2, ax.sy(A.y) + 14, 'x_B − x_A', { fill: '#8B96A5', 'font-size': 9.5, 'text-anchor': 'middle' }));
    svg.appendChild(text(ax.sx(B.x) + 8, (ax.sy(A.y) + ax.sy(B.y)) / 2, 'f(x_B) − f(x_A)', { fill: '#8B96A5', 'font-size': 9, 'text-anchor': 'start' }));

    dot(svg, ax.sx(A.x), ax.sy(A.y), '#FF6B6B', 3.4);
    dot(svg, ax.sx(B.x), ax.sy(B.y), '#FF6B6B', 3.4);
    svg.appendChild(text(ax.sx(A.x) - 6, ax.sy(A.y) - 8, 'A', { fill: '#FF6B6B', 'font-size': 12, 'text-anchor': 'end' }));
    svg.appendChild(text(ax.sx(B.x) + 6, ax.sy(B.y) - 8, 'B', { fill: '#FF6B6B', 'font-size': 12 }));
  }

  /* ---------- Initialisation ---------- */
  function init() {
    var map = {
      domainMapGraph: drawDomainMap,
      paireGraph: drawPaireGraph,
      impaireGraph: drawImpaireGraph,
      monotonieGraph: drawMonotonieGraph,
      tauxGraph: drawTauxGraph
    };
    Object.keys(map).forEach(function (id) {
      var svg = document.getElementById(id);
      if (svg) { try { map[id](svg); } catch (e) { console.error('figuresvt_p1:', id, e); } }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
