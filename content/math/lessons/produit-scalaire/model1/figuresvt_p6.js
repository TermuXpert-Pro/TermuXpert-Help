// ============================================================
// figuresvt_p6.js — Résumé du cours : Produit scalaire
// (Xpert — Mathématiques 1BSE)
// Fichier self-contained : toutes les fonctions utilitaires SVG
// sont définies ici, sans dépendance à assets/js/svg-utils.js.
// Les 4 figures reprennent, en version compacte, les exemples
// chiffrés utilisés dans le résumé de chaque section.
// ============================================================
(function () {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  const COLORS = {
    axis: '#2A2A3E', grid: '#1A1A2E', accent: '#4ECDC4', text: '#FFFFFF',
    muted: '#8A8AA0', yellow: '#F4D03F', purple: '#BB8FCE', red: '#FF6B6B'
  };

  function elm(tag, attrs) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }
  function style(node, props) {
    let s = 'opacity:1 !important;visibility:visible !important;pointer-events:none;';
    for (const k in props) { if (props[k] != null) s += k + ':' + props[k] + ' !important;'; }
    node.setAttribute('style', s);
  }
  function setupSVG(id, range) {
    const svg = document.getElementById(id);
    if (!svg) return null;
    const { xMin = -1, xMax = 9, yMin = -1, yMax = 7 } = range || {};
    const w = xMax - xMin, h = yMax - yMin;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    svg.setAttribute('viewBox', `${xMin} ${-yMax} ${w} ${h}`);
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.setAttribute('width', '100%');
    svg.removeAttribute('height');
    svg.setAttribute('style',
      'display:block !important;width:100% !important;max-width:420px !important;' +
      'height:auto !important;max-height:60vh !important;margin:0 auto !important;' +
      'background:#0D1117 !important;border-radius:4px !important;overflow:visible;');
    return { svg, xMin, xMax, yMin, yMax, fs: Math.max(w, h) / 22 };
  }
  function axes(s, opts) {
    opts = opts || {};
    const color = opts.color || COLORS.axis;
    const ah = s.fs * 0.4;
    const showX = s.yMin <= 0 && s.yMax >= 0; // l'axe des x (y=0) est visible
    const showY = s.xMin <= 0 && s.xMax >= 0; // l'axe des y (x=0) est visible
    if (showX) {
      const l1 = elm('line', { x1: s.xMin, y1: 0, x2: s.xMax, y2: 0 });
      style(l1, { stroke: color, 'stroke-width': 0.045 });
      s.svg.appendChild(l1);
      const p1 = elm('polygon', { points: `${s.xMax},0 ${s.xMax - ah},${ah / 2} ${s.xMax - ah},${-ah / 2}` });
      style(p1, { fill: color, stroke: 'none' });
      s.svg.appendChild(p1);
    }
    if (showY) {
      const l2 = elm('line', { x1: 0, y1: -s.yMin, x2: 0, y2: -s.yMax });
      style(l2, { stroke: color, 'stroke-width': 0.045 });
      s.svg.appendChild(l2);
      const p2 = elm('polygon', { points: `0,${-s.yMax} ${-ah / 2},${-s.yMax + ah} ${ah / 2},${-s.yMax + ah}` });
      style(p2, { fill: color, stroke: 'none' });
      s.svg.appendChild(p2);
    }
    if (opts.labels !== false) {
      if (showX) note(s, opts.xLabel || 'x', s.xMax - ah * 0.7, -s.fs * 0.55, { color: opts.labelColor || COLORS.accent, weight: 700 });
      if (showY) note(s, opts.yLabel || 'y', s.fs * 0.45, -s.yMax + ah * 1.5, { color: opts.labelColor || COLORS.accent, weight: 700 });
      if (showX && showY) note(s, 'O', -s.fs * 0.55, s.fs * 0.85, { color: COLORS.muted, fontSize: s.fs * 0.85 });
    }
  }
  function grid(s) {
    for (let i = Math.ceil(s.xMin); i <= Math.floor(s.xMax); i++) {
      if (i === 0) continue;
      const l = elm('line', { x1: i, y1: -s.yMin, x2: i, y2: -s.yMax });
      style(l, { stroke: COLORS.grid, 'stroke-width': 0.018 });
      s.svg.appendChild(l);
    }
    for (let j = Math.ceil(s.yMin); j <= Math.floor(s.yMax); j++) {
      if (j === 0) continue;
      const l = elm('line', { x1: s.xMin, y1: -j, x2: s.xMax, y2: -j });
      style(l, { stroke: COLORS.grid, 'stroke-width': 0.018 });
      s.svg.appendChild(l);
    }
  }
  function note(s, text, x, y, opts) {
    opts = opts || {};
    const t = elm('text', { x, y });
    style(t, {
      fill: opts.color || COLORS.muted, 'font-size': opts.fontSize || s.fs,
      'font-family': 'Arial, sans-serif', 'text-anchor': opts.anchor || 'start',
      'font-weight': opts.weight || 400, 'font-style': opts.italic ? 'italic' : 'normal'
    });
    t.textContent = text;
    s.svg.appendChild(t);
  }
  function point(s, x, y, opts) {
    opts = opts || {};
    const r = opts.r || s.fs * 0.26;
    const c = elm('circle', { cx: x, cy: -y, r });
    style(c, { fill: opts.color || COLORS.accent, stroke: '#0D1117', 'stroke-width': 0.03 });
    s.svg.appendChild(c);
    if (opts.label) {
      note(s, opts.label, x + (opts.dx ?? r * 1.5), -y - (opts.dy ?? r * 1.5),
        { color: opts.labelColor || COLORS.text, fontSize: opts.fontSize, weight: 700, anchor: opts.anchor });
    }
  }
  function seg(s, x1, y1, x2, y2, opts) {
    opts = opts || {};
    const l = elm('line', { x1, y1: -y1, x2, y2: -y2, 'stroke-linecap': 'round' });
    const sp = { stroke: opts.color || COLORS.axis, 'stroke-width': (opts.lw || 1) * 0.03 };
    if (opts.dashed) { const dp = opts.dashPattern || [5, 4]; sp['stroke-dasharray'] = `${dp[0] * 0.03} ${dp[1] * 0.03}`; }
    style(l, sp);
    s.svg.appendChild(l);
  }
  function vector(s, x1, y1, x2, y2, opts) {
    opts = opts || {};
    const color = opts.color || COLORS.accent;
    const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy) || 1e-4;
    const ux = dx / len, uy = dy / len, ah = opts.arrowSize || s.fs * 0.36;
    const endX = x2 - ux * ah * 0.6, endY = y2 - uy * ah * 0.6;
    const l = elm('line', { x1, y1: -y1, x2: endX, y2: -endY, 'stroke-linecap': 'round' });
    style(l, { stroke: color, 'stroke-width': (opts.lw || 1.6) * 0.03 });
    s.svg.appendChild(l);
    const backX = x2 - ux * ah, backY = y2 - uy * ah, px = -uy, py = ux;
    const head = elm('polygon', {
      points: `${x2},${-y2} ${backX + px * ah * 0.4},${-(backY + py * ah * 0.4)} ${backX - px * ah * 0.4},${-(backY - py * ah * 0.4)}`
    });
    style(head, { fill: color, stroke: 'none' });
    s.svg.appendChild(head);
    if (opts.label) {
      const lx = (x1 + x2) / 2 + (opts.ldx ?? px * ah * 1.15);
      const ly = (y1 + y2) / 2 + (opts.ldy ?? py * ah * 1.15);
      note(s, opts.label, lx, -ly, { color: opts.labelColor || color, fontSize: opts.fontSize || s.fs * 0.95, weight: 700, anchor: opts.anchor || 'middle' });
    }
  }
  function circleShape(s, cx, cy, r, opts) {
    opts = opts || {};
    const c = elm('circle', { cx, cy: -cy, r });
    const sp = { fill: opts.fill || 'none', stroke: opts.color || COLORS.accent, 'stroke-width': (opts.lw || 1.4) * 0.03 };
    if (opts.opacity !== undefined) sp['fill-opacity'] = opts.opacity;
    if (opts.dashed) { const dp = opts.dashPattern || [6, 4]; sp['stroke-dasharray'] = `${dp[0] * 0.03} ${dp[1] * 0.03}`; }
    style(c, sp);
    s.svg.appendChild(c);
  }
  function polygon(s, pts, opts) {
    opts = opts || {};
    const p = elm('polygon', { points: pts.map(pt => `${pt[0]},${-pt[1]}`).join(' ') });
    const sp = { fill: opts.fill || 'none', stroke: opts.color || COLORS.axis, 'stroke-width': (opts.lw || 1.2) * 0.03 };
    if (opts.opacity !== undefined) sp['fill-opacity'] = opts.opacity;
    style(p, sp);
    s.svg.appendChild(p);
  }
  function normv(v) { const l = Math.hypot(v[0], v[1]) || 1e-4; return [v[0] / l, v[1] / l]; }
  function rightAngle(s, corner, dir1, dir2, opts) {
    opts = opts || {};
    const size = opts.size || s.fs * 0.42;
    const n1 = normv(dir1), n2 = normv(dir2);
    const p1 = [corner[0] + n1[0] * size, corner[1] + n1[1] * size];
    const p2 = [corner[0] + n1[0] * size + n2[0] * size, corner[1] + n1[1] * size + n2[1] * size];
    const p3 = [corner[0] + n2[0] * size, corner[1] + n2[1] * size];
    const d = `M ${p1[0]} ${-p1[1]} L ${p2[0]} ${-p2[1]} L ${p3[0]} ${-p3[1]}`;
    const path = elm('path', { d, fill: 'none' });
    style(path, { stroke: opts.color || COLORS.text, 'stroke-width': 0.026 });
    s.svg.appendChild(path);
  }
  function angleArc(s, center, p1, p2, r, opts) {
    opts = opts || {};
    const a1 = Math.atan2(p1[1] - center[1], p1[0] - center[0]);
    let a2 = Math.atan2(p2[1] - center[1], p2[0] - center[0]);
    let delta = a2 - a1;
    while (delta <= -Math.PI) delta += 2 * Math.PI;
    while (delta > Math.PI) delta -= 2 * Math.PI;
    const large = Math.abs(delta) > Math.PI ? 1 : 0;
    const sweep = delta > 0 ? 1 : 0;
    const sx = center[0] + r * Math.cos(a1), sy = center[1] + r * Math.sin(a1);
    const ex = center[0] + r * Math.cos(a1 + delta), ey = center[1] + r * Math.sin(a1 + delta);
    const d = `M ${sx} ${-sy} A ${r} ${r} 0 ${large} ${1 - sweep} ${ex} ${-ey}`;
    const path = elm('path', { d, fill: 'none' });
    style(path, { stroke: opts.color || COLORS.yellow, 'stroke-width': 0.03 });
    s.svg.appendChild(path);
    if (opts.label) {
      const mid = a1 + delta / 2;
      const lx = center[0] + (r + s.fs * 0.6) * Math.cos(mid);
      const ly = center[1] + (r + s.fs * 0.6) * Math.sin(mid);
      note(s, opts.label, lx, -ly, { color: opts.color || COLORS.yellow, fontSize: opts.fontSize || s.fs * 0.9, anchor: 'middle', weight: 700 });
    }
  }
  function lineFull(s, x1, y1, x2, y2, opts) {
    // Trace la droite passant par (x1,y1) et (x2,y2), correctement
    // "clippée" aux 4 bords du viewBox (et non juste étendue en x),
    // pour qu'aucun segment ne dépasse jamais le cadre visible.
    opts = opts || {};
    const dx = x2 - x1, dy = y2 - y1;
    let tMin = -Infinity, tMax = Infinity;
    if (Math.abs(dx) > 1e-9) {
      const t1 = (s.xMin - x1) / dx, t2 = (s.xMax - x1) / dx;
      tMin = Math.max(tMin, Math.min(t1, t2));
      tMax = Math.min(tMax, Math.max(t1, t2));
    } else if (x1 < s.xMin || x1 > s.xMax) { return; }
    if (Math.abs(dy) > 1e-9) {
      const t1 = (s.yMin - y1) / dy, t2 = (s.yMax - y1) / dy;
      tMin = Math.max(tMin, Math.min(t1, t2));
      tMax = Math.min(tMax, Math.max(t1, t2));
    } else if (y1 < s.yMin || y1 > s.yMax) { return; }
    if (tMin > tMax) return;
    const ax = x1 + tMin * dx, ay = y1 + tMin * dy;
    const bx = x1 + tMax * dx, by = y1 + tMax * dy;
    seg(s, ax, ay, bx, by, opts);
  }
  // ------------------------------------------------------------
  // Figure 1 (id="graphRepere") — Exemple : A(2,1) B(5,0) C(7,6),
  // triangle rectangle en B (BA.BC = 0)
  // ------------------------------------------------------------
  function drawGraphRepere() {
    const s = setupSVG('graphRepere', { xMin: 1, xMax: 8, yMin: -1, yMax: 7 });
    if (!s) return;
    grid(s);
    axes(s, { labels: false });

    const A = [2, 1], B = [5, 0], C = [7, 6];

    polygon(s, [A, B, C], { color: COLORS.axis, fill: COLORS.accent, opacity: 0.08, lw: 1.5 });
    seg(s, A[0], A[1], B[0], B[1], { color: COLORS.accent, lw: 1.6 });
    seg(s, B[0], B[1], C[0], C[1], { color: COLORS.accent, lw: 1.6 });
    seg(s, C[0], C[1], A[0], A[1], { color: COLORS.muted, lw: 1.2, dashed: true });
    rightAngle(s, B, [A[0] - B[0], A[1] - B[1]], [C[0] - B[0], C[1] - B[1]], { color: COLORS.text, size: s.fs * 0.4 });

    point(s, A[0], A[1], { label: 'A(2,1)', dx: -0.15, dy: 0.3, anchor: 'end', fontSize: s.fs * 0.85 });
    point(s, B[0], B[1], { label: 'B(5,0)', dx: 0.1, dy: -0.45, fontSize: s.fs * 0.85 });
    point(s, C[0], C[1], { label: 'C(7,6)', dx: 0.25, dy: 0.3, fontSize: s.fs * 0.85 });
  }

  // ------------------------------------------------------------
  // Figure 2 (id="graphAireTriangle") — Exemple : A(1,-1) B(4,-1)
  // C(2,2), H(2,-1), S = 9/2
  // ------------------------------------------------------------
  function drawGraphAireTriangle() {
    const s = setupSVG('graphAireTriangle', { xMin: 0, xMax: 5, yMin: -2, yMax: 3 });
    if (!s) return;
    grid(s);
    axes(s, { labels: false });

    const A = [1, -1], B = [4, -1], C = [2, 2], H = [2, -1];

    polygon(s, [A, B, C], { color: COLORS.axis, fill: COLORS.accent, opacity: 0.08, lw: 1.5 });
    seg(s, C[0], C[1], H[0], H[1], { color: COLORS.purple, dashed: true, lw: 1.2 });
    rightAngle(s, H, [0, 1], [1, 0], { color: COLORS.text, size: s.fs * 0.3 });

    point(s, A[0], A[1], { label: 'A', dx: -0.25, dy: -0.35, anchor: 'end', fontSize: s.fs * 0.85 });
    point(s, B[0], B[1], { label: 'B', dx: 0.2, dy: -0.35, fontSize: s.fs * 0.85 });
    point(s, C[0], C[1], { label: 'C', dx: 0.1, dy: 0.3, fontSize: s.fs * 0.85 });
    point(s, H[0], H[1], { label: 'H', color: COLORS.purple, dx: 0.1, dy: -0.4, fontSize: s.fs * 0.85 });

    note(s, 'S = 9/2', 3.2, -2.4, { color: COLORS.purple, fontSize: s.fs * 0.85, weight: 700 });
  }

  // ------------------------------------------------------------
  // Figure 3 (id="graphDistance") — Exemple : (D):3x+4y+5=0, O(0,0),
  // H(-3/5,-4/5), d(O,D) = 1
  // ------------------------------------------------------------
  function drawGraphDistance() {
    const s = setupSVG('graphDistance', { xMin: -3, xMax: 3, yMin: -3, yMax: 2 });
    if (!s) return;
    grid(s);
    axes(s, { labels: false });

    lineFull(s, -3, 1, 3, -3.5, { color: COLORS.accent, lw: 1.5 });
    note(s, '(D)', 2.2, 2.75, { color: COLORS.accent, fontSize: s.fs * 0.85, weight: 700 });

    const O = [0, 0], H = [-0.6, -0.8];

    seg(s, O[0], O[1], H[0], H[1], { color: COLORS.purple, lw: 1.8, dashed: true });
    rightAngle(s, H, [O[0] - H[0], O[1] - H[1]], [-4, 3], { color: COLORS.text, size: s.fs * 0.28 });

    point(s, O[0], O[1], { label: 'O', dx: 0.2, dy: 0.15, fontSize: s.fs * 0.85 });
    point(s, H[0], H[1], { label: 'H', color: COLORS.purple, dx: 0.2, dy: -0.4, fontSize: s.fs * 0.85 });
    note(s, 'd(O,D) = 1', -2.7, 1.55, { color: COLORS.purple, fontSize: s.fs * 0.8, weight: 700 });
  }

  // ------------------------------------------------------------
  // Figure 4 (id="graphCercleEquation") — Cercle générique de
  // centre Omega(a,b) et de rayon r
  // ------------------------------------------------------------
  function drawGraphCercleEquation() {
    const s = setupSVG('graphCercleEquation', { xMin: -1, xMax: 5, yMin: -1, yMax: 5.5 });
    if (!s) return;
    grid(s);
    axes(s, { labels: false });

    const Omega = [2, 2], r = 2.5;

    circleShape(s, Omega[0], Omega[1], r, { color: COLORS.accent, lw: 1.6 });
    seg(s, Omega[0], Omega[1], Omega[0] + r, Omega[1], { color: COLORS.purple, lw: 1.3, dashed: true });
    note(s, 'r', Omega[0] + r / 2, -(Omega[1] + 0.35), { color: COLORS.purple, anchor: 'middle', fontSize: s.fs * 0.85 });

    point(s, Omega[0], Omega[1], { label: '\u03a9(a,b)', color: COLORS.yellow, dx: -0.2, dy: -0.5, anchor: 'end', fontSize: s.fs * 0.85 });
  }

  drawGraphRepere();
  drawGraphAireTriangle();
  drawGraphDistance();
  drawGraphCercleEquation();
})();
