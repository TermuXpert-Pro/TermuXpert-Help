// ============================================================
// figuresvg.js - رسومات موضوع "Barycentre" - Modèle 1 (نسخة SVG)
// كل الرسومات ديال هاذ الموضوع (كانت فـ figures.js بـ Canvas) تحولات
// هنا لـ SVG، لأنها كلها: نقط + خطوط + دوائر (عدد قليل ديال العناصر
// فكل رسمة) - هادشي بالضبط الحالة اللي فيها SVG كيعطي دقة أحسن من
// Canvas (رسم متجهي/vector، ماكاينش تقريب بيكسل).
// كيتحمل بعد svg-utils.js فكل صفحة محتاجاه.
// ============================================================

// bbox: كيحسب مدى الرسمة (viewBox) تلقائياً من نقط الرسمة + هامش،
// بدل ما نعطيو xMin/xMax يدوياً فكل دالة
function bbox(points, pad) {
    pad = pad ?? 1;
    const xs = points.map(p => p.x), ys = points.map(p => p.y);
    return {
        xMin: Math.min(...xs) - pad,
        xMax: Math.max(...xs) + pad,
        yMin: Math.min(...ys) - pad,
        yMax: Math.max(...ys) + pad
    };
}

// مثلث بـ 3 أضلاع (كانت inline بـ ctx.moveTo/lineTo فالأصل)
function drawTriangle(s, A, B, C, opts) {
    SvgUtils.drawLine(s, A.x, A.y, B.x, B.y, opts);
    SvgUtils.drawLine(s, B.x, B.y, C.x, C.y, opts);
    SvgUtils.drawLine(s, C.x, C.y, A.x, A.y, opts);
}

// ====== Exercice 1 : Alignement A, G, B ======
function drawGraph1svg() {
    const s = SvgUtils.setupSVG('graph1svg', { xMin: -2, xMax: 8, yMin: -2, yMax: 8 });
    if (!s) return;

    SvgUtils.drawAxesWithArrows(s);
    SvgUtils.drawGrid(s);

    SvgUtils.drawPoints(s, [
        { x: 3, y: 2, color: '#4ECDC4', label: 'A' },
        { x: 4, y: 1, color: '#FF6B6B', label: 'B' },
        { x: 17 / 4, y: 3 / 4, color: '#F4D03F', label: 'G' }
    ]);

    SvgUtils.drawLine(s, 3, 2, 4, 1, { dashed: true });
    SvgUtils.drawNote(s, 'A, G et B sont alignés', -1.7, 7.3);
}

// ====== Exercice 2 : Intersection (AB) ∩ (EF) = {G} ======
function drawGraph2svg() {
    const A = { x: 1, y: 4 };
    const B = { x: 5, y: 0.5 };
    const Gx = (2 * A.x + (-3) * B.x) / (2 - 3);
    const Gy = (2 * A.y + (-3) * B.y) / (2 - 3);
    const E = { x: A.x + 0.4 * (B.x - A.x), y: A.y + 0.4 * (B.y - A.y) };
    const F = { x: E.x + (Gx - E.x) / 2, y: E.y + (Gy - E.y) / 2 };

    const box = bbox([A, B, E, F, { x: Gx, y: Gy }], 1.5);
    const s = SvgUtils.setupSVG('graph2svg', box);
    if (!s) return;

    SvgUtils.drawAxesWithArrows(s);

    SvgUtils.drawLine(s, A.x, A.y, B.x, B.y, { color: '#FF6B6B', lineWidth: 2, dashed: true, dashPattern: [6, 4] });
    SvgUtils.drawLine(s, E.x, E.y, F.x, F.y, { color: '#A8FF78', lineWidth: 2, dashed: true, dashPattern: [6, 4] });

    SvgUtils.drawPoints(s, [
        { x: A.x, y: A.y, color: '#4ECDC4', label: 'A', showCoords: false },
        { x: B.x, y: B.y, color: '#FF6B6B', label: 'B', showCoords: false },
        { x: E.x, y: E.y, color: '#BB8FCE', label: 'E', showCoords: false },
        { x: F.x, y: F.y, color: '#BB8FCE', label: 'F', showCoords: false },
        { x: Gx, y: Gy, color: '#F4D03F', label: 'G', showCoords: false }
    ]);

    SvgUtils.drawNote(s, '--- (AB)', box.xMin + 0.3, box.yMax - 0.6, { color: '#FF6B6B' });
    SvgUtils.drawNote(s, '--- (EF)', box.xMin + 0.3, box.yMax - 1.3, { color: '#A8FF78' });
    SvgUtils.drawNote(s, 'G = intersection', box.xMin + 0.3, box.yMax - 2, { color: '#F4D03F' });
    SvgUtils.drawNote(s, '(EF) ∩ (AB) = {G}', box.xMax - 4, box.yMax - 0.6);
}

// ====== Exercice 3 : Ensemble de points = Cercle C(G, 2) ======
function drawGraph3svg() {
    const s = SvgUtils.setupSVG('graph3svg', { xMin: -2, xMax: 8, yMin: -2, yMax: 8 });
    if (!s) return;

    SvgUtils.drawAxesWithArrows(s);
    SvgUtils.drawGrid(s);

    const A = { x: 0, y: 5, color: '#4ECDC4', label: 'A' };
    const B = { x: 3, y: 2, color: '#FF6B6B', label: 'B' };
    const G = { x: 2, y: 3, color: '#F4D03F', label: 'G' };

    SvgUtils.drawCircle(s, G.x, G.y, 2, { color: '#4D9DE0', lineWidth: 2.5, dashed: true, dashPattern: [6, 4] });
    SvgUtils.drawLine(s, G.x, G.y, G.x + 2, G.y, { color: '#A8FF78', lineWidth: 1.5, dashed: true, dashPattern: [3, 3] });
    SvgUtils.drawNote(s, 'r = 2', G.x + 1.3, G.y + 0.3, { color: '#A8FF78', fontSize: s.fontSize * 0.85 });

    SvgUtils.drawPoints(s, [
        { ...A, label: `A (${A.x};${A.y})`, showCoords: false },
        { ...B, label: `B (${B.x};${B.y})`, showCoords: false },
        { ...G, label: `G (${G.x};${G.y})`, showCoords: false }
    ]);

    SvgUtils.drawNote(s, '--- Cercle C(G, 2)', -1.7, 7.3, { color: '#4D9DE0' });
    SvgUtils.drawNote(s, 'G centre du cercle', -1.7, 6.6, { color: '#F4D03F' });
    SvgUtils.drawNote(s, 'Cercle de centre G(2;3) rayon 2', 2, 7.3);
}

// ====== Exercice 4 : Triangle ABC + construction de G ======
function drawGraph4svg() {
    const A = { x: 2, y: 1, color: '#4ECDC4', label: 'A' };
    const B = { x: 5, y: 0.5, color: '#FF6B6B', label: 'B' };
    const C = { x: 3, y: 4.5, color: '#BB8FCE', label: 'C' };
    const Gx = (1 * A.x + 1 * B.x + 2 * C.x) / (1 + 1 + 2);
    const Gy = (1 * A.y + 1 * B.y + 2 * C.y) / (1 + 1 + 2);
    const G = { x: Gx, y: Gy, color: '#F4D03F', label: 'G' };
    const I = { x: (B.x + C.x) / 2, y: (B.y + C.y) / 2, color: '#A8FF78', label: 'I' };

    const box = bbox([A, B, C, G, I], 1.2);
    const s = SvgUtils.setupSVG('graph4svg', box);
    if (!s) return;

    SvgUtils.drawAxesWithArrows(s);
    drawTriangle(s, A, B, C, { color: '#2A2A3E', lineWidth: 1.5, dashed: true, dashPattern: [3, 3] });
    SvgUtils.drawLine(s, A.x, A.y, I.x, I.y, { color: '#A8FF78', lineWidth: 1.5, dashed: true, dashPattern: [4, 4] });
    SvgUtils.drawPoints(s, [A, B, C, G, I].map(p => ({ ...p, showCoords: false })));

    SvgUtils.drawNote(s, 'Triangle ABC', box.xMin + 0.3, box.yMax - 0.6, { color: '#4ECDC4' });
    SvgUtils.drawNote(s, 'G barycentre', box.xMin + 0.3, box.yMax - 1.3, { color: '#F4D03F' });
    SvgUtils.drawNote(s, 'I milieu de [BC]', box.xMin + 0.3, box.yMax - 2, { color: '#A8FF78' });
    SvgUtils.drawNote(s, 'AG = 1/4 AB + 1/2 AC', box.xMax - 5, box.yMax - 0.6);
}

// ====== Exercice 5 (partie 1) : Construction de G par associativité ======
function drawGraph5svg() {
    const A = { x: 1, y: 1, color: '#4ECDC4', label: 'A' };
    const B = { x: 4, y: 0.5, color: '#FF6B6B', label: 'B' };
    const C = { x: 2.5, y: 4.5, color: '#BB8FCE', label: 'C' };
    const E = { x: A.x + 3 * (B.x - A.x), y: A.y + 3 * (B.y - A.y), color: '#A8FF78', label: 'E' };
    const G = { x: C.x - 0.25 * (E.x - C.x), y: C.y - 0.25 * (E.y - C.y), color: '#F4D03F', label: 'G' };

    const box = bbox([A, B, C, E, G], 1.2);
    const s = SvgUtils.setupSVG('graph5svg', box);
    if (!s) return;

    SvgUtils.drawAxesWithArrows(s);
    SvgUtils.drawLine(s, A.x, A.y, B.x, B.y, { dashed: true, dashPattern: [3, 3] });
    SvgUtils.drawLine(s, C.x, C.y, E.x, E.y, { color: '#A8FF78', lineWidth: 1.5, dashed: true, dashPattern: [4, 4] });
    SvgUtils.drawPoints(s, [A, B, C, E, G].map(p => ({ ...p, showCoords: false })));

    SvgUtils.drawNote(s, 'A', box.xMin + 0.3, box.yMax - 0.6, { color: '#4ECDC4' });
    SvgUtils.drawNote(s, 'B', box.xMin + 0.9, box.yMax - 0.6, { color: '#FF6B6B' });
    SvgUtils.drawNote(s, 'C', box.xMin + 1.5, box.yMax - 0.6, { color: '#BB8FCE' });
    SvgUtils.drawNote(s, 'E (AE = 3AB)', box.xMin + 2.1, box.yMax - 0.6, { color: '#A8FF78' });
    SvgUtils.drawNote(s, 'G (CG = -1/4 CE)', box.xMin + 0.3, box.yMax - 1.3, { color: '#F4D03F' });
    SvgUtils.drawNote(s, 'Associativité : G = Bar{(E,-1);(C,5)}', box.xMax - 6, box.yMax - 0.6);
}

// ====== Exercice 5 (partie 2) : Centre de gravité G = Bar{(A,1);(I,2)} ======
function drawGraph6cgsvg() {
    const A = { x: 2.5, y: 0.8, color: '#4ECDC4', label: 'A' };
    const B = { x: 5.5, y: 1, color: '#FF6B6B', label: 'B' };
    const C = { x: 3.5, y: 5, color: '#BB8FCE', label: 'C' };
    const I = { x: (B.x + C.x) / 2, y: (B.y + C.y) / 2, color: '#A8FF78', label: 'I' };
    const G = { x: (1 * A.x + 2 * I.x) / 3, y: (1 * A.y + 2 * I.y) / 3, color: '#F4D03F', label: 'G' };

    const box = bbox([A, B, C, I, G], 1.2);
    const s = SvgUtils.setupSVG('graph6cgsvg', box);
    if (!s) return;

    SvgUtils.drawAxesWithArrows(s);
    drawTriangle(s, A, B, C, { color: '#2A2A3E', lineWidth: 1.5, dashed: true, dashPattern: [3, 3] });
    SvgUtils.drawLine(s, A.x, A.y, I.x, I.y, { color: '#A8FF78', lineWidth: 2, dashed: true, dashPattern: [4, 4] });
    SvgUtils.drawPoints(s, [A, B, C, I, G].map(p => ({ ...p, showCoords: false })));

    SvgUtils.drawNote(s, 'Triangle ABC', box.xMin + 0.3, box.yMax - 0.6, { color: '#4ECDC4' });
    SvgUtils.drawNote(s, 'I milieu de [BC]', box.xMin + 0.3, box.yMax - 1.3, { color: '#A8FF78' });
    SvgUtils.drawNote(s, 'G centre de gravité', box.xMin + 0.3, box.yMax - 2, { color: '#F4D03F' });
    SvgUtils.drawNote(s, 'G = Bar{(A,1); (I,2)}', box.xMax - 5, box.yMax - 0.6);
    SvgUtils.drawNote(s, 'AG = 2/3 AI', box.xMax - 5, box.yMax - 1.3);
}

// ====== Exercice 6 : Réduction d'écriture - Cercle C(G, KA) ======
function drawGraph6svg() {
    const A = { x: 1, y: 1, color: '#4ECDC4', label: 'A' };
    const B = { x: 5, y: 0.5, color: '#FF6B6B', label: 'B' };
    const C = { x: 3, y: 4.5, color: '#BB8FCE', label: 'C' };
    const K = {
        x: (-3 * C.x + 1 * B.x) / (-3 + 1),
        y: (-3 * C.y + 1 * B.y) / (-3 + 1),
        color: '#A8FF78', label: 'K'
    };
    const G = {
        x: (2 * A.x + (-1) * B.x + (-3) * C.x) / (2 - 1 - 3),
        y: (2 * A.y + (-1) * B.y + (-3) * C.y) / (2 - 1 - 3),
        color: '#F4D03F', label: 'G'
    };
    const r = Math.sqrt((K.x - A.x) ** 2 + (K.y - A.y) ** 2);

    const box = bbox([A, B, C, K, { x: G.x - r, y: G.y - r }, { x: G.x + r, y: G.y + r }], 1);
    const s = SvgUtils.setupSVG('graph6svg', box);
    if (!s) return;

    SvgUtils.drawAxesWithArrows(s);
    SvgUtils.drawCircle(s, G.x, G.y, r, { color: '#4D9DE0', lineWidth: 2.5, dashed: true, dashPattern: [6, 4] });
    SvgUtils.drawPoints(s, [A, B, C, K, G].map(p => ({ ...p, showCoords: false })));

    SvgUtils.drawNote(s, 'A', box.xMin + 0.3, box.yMax - 0.6, { color: '#4ECDC4' });
    SvgUtils.drawNote(s, 'B', box.xMin + 0.9, box.yMax - 0.6, { color: '#FF6B6B' });
    SvgUtils.drawNote(s, 'C', box.xMin + 1.5, box.yMax - 0.6, { color: '#BB8FCE' });
    SvgUtils.drawNote(s, 'K', box.xMin + 2.1, box.yMax - 0.6, { color: '#A8FF78' });
    SvgUtils.drawNote(s, 'G (centre)', box.xMin + 0.3, box.yMax - 1.3, { color: '#F4D03F' });
    SvgUtils.drawNote(s, '--- Cercle C(G, KA)', box.xMin + 0.3, box.yMax - 2, { color: '#4D9DE0' });
    SvgUtils.drawNote(s, 'Cercle de centre G et de rayon KA', box.xMax - 6, box.yMax - 0.6);
}

// ====== Exercice 7 (partie b) : Cercle (E) = C(G, 1.5) ======
function drawGraph7asvg() {
    const A = { x: 2, y: 1, color: '#4ECDC4', label: 'A' };
    const B = { x: 5.5, y: 0.8, color: '#FF6B6B', label: 'B' };
    const C = { x: 3.5, y: 5, color: '#BB8FCE', label: 'C' };
    const I = { x: (B.x + C.x) / 2, y: (B.y + C.y) / 2, color: '#A8FF78', label: 'I' };
    const G = { x: (1 * A.x + 2 * I.x) / 3, y: (1 * A.y + 2 * I.y) / 3, color: '#F4D03F', label: 'G' };
    const r = 1.5 / 2;

    const box = bbox([A, B, C, I], 1.2);
    const s = SvgUtils.setupSVG('graph7asvg', box);
    if (!s) return;

    SvgUtils.drawAxesWithArrows(s);
    drawTriangle(s, A, B, C, { color: '#2A2A3E', lineWidth: 1, dashed: true, dashPattern: [3, 3] });
    SvgUtils.drawLine(s, A.x, A.y, I.x, I.y, { color: '#A8FF78', lineWidth: 1.5, dashed: true, dashPattern: [4, 4] });
    SvgUtils.drawCircle(s, G.x, G.y, r, { color: '#4D9DE0', lineWidth: 2.5, dashed: true, dashPattern: [6, 4] });
    SvgUtils.drawPoints(s, [A, B, C, I, G].map(p => ({ ...p, showCoords: false })));

    SvgUtils.drawNote(s, 'G', box.xMin + 0.3, box.yMax - 0.6, { color: '#F4D03F' });
    SvgUtils.drawNote(s, '--- Cercle (E)', box.xMin + 0.9, box.yMax - 0.6, { color: '#4D9DE0' });
    SvgUtils.drawNote(s, 'Cercle de centre G rayon 1.5 cm', box.xMax - 6, box.yMax - 0.6);
}

// ====== Exercice 7 (partie c) : Médiatrice de [GG'] ======
function drawGraph7bsvg() {
    const A = { x: 2, y: 1, color: '#4ECDC4', label: 'A' };
    const B = { x: 5.5, y: 0.8, color: '#FF6B6B', label: 'B' };
    const C = { x: 3.5, y: 5, color: '#BB8FCE', label: 'C' };
    const I = { x: (B.x + C.x) / 2, y: (B.y + C.y) / 2, color: '#A8FF78', label: 'I' };
    const G = { x: (1 * A.x + 2 * I.x) / 3, y: (1 * A.y + 2 * I.y) / 3, color: '#F4D03F', label: 'G' };
    const Gp = { x: (3 * A.x + 1 * C.x) / 4, y: (3 * A.y + 1 * C.y) / 4, color: '#F4D03F', label: "G'" };

    const mx = (G.x + Gp.x) / 2, my = (G.y + Gp.y) / 2;
    const dx = -(Gp.y - G.y), dy = (Gp.x - G.x);
    const len = Math.sqrt(dx * dx + dy * dy);
    const nx = dx / len, ny = dy / len, ext = 2;
    const P1 = { x: mx - nx * ext, y: my - ny * ext };
    const P2 = { x: mx + nx * ext, y: my + ny * ext };

    const box = bbox([A, B, C, G, Gp, P1, P2], 1);
    const s = SvgUtils.setupSVG('graph7bsvg', box);
    if (!s) return;

    SvgUtils.drawAxesWithArrows(s);
    drawTriangle(s, A, B, C, { color: '#2A2A3E', lineWidth: 1, dashed: true, dashPattern: [3, 3] });
    SvgUtils.drawLine(s, G.x, G.y, Gp.x, Gp.y, { color: '#F4D03F', lineWidth: 2 });
    SvgUtils.drawLine(s, P1.x, P1.y, P2.x, P2.y, { color: '#A8FF78', lineWidth: 2.5, dashed: true, dashPattern: [6, 4] });
    SvgUtils.drawPoints(s, [A, B, C, G, Gp].map(p => ({ ...p, showCoords: false })));

    SvgUtils.drawNote(s, "G et G'", box.xMin + 0.3, box.yMax - 0.6, { color: '#F4D03F' });
    SvgUtils.drawNote(s, "--- Médiatrice de [GG']", box.xMin + 0.3, box.yMax - 1.3, { color: '#A8FF78' });
    SvgUtils.drawNote(s, "Médiatrice de [GG']", box.xMax - 4, box.yMax - 0.6);
}

// ====== Exercice 8 : Alignement de I, J, K ======
function drawGraph8svg() {
    const A = { x: 0, y: 0, color: '#4ECDC4', label: 'A' };
    const B = { x: 1, y: 0, color: '#FF6B6B', label: 'B' };
    const C = { x: 0, y: 1, color: '#BB8FCE', label: 'C' };
    const I = { x: -0.5, y: 1.5, color: '#A8FF78', label: 'I' };
    const K = { x: 0.4, y: 0, color: '#F4D03F', label: 'K' };
    const J = { x: 0, y: 0.875, color: '#4D9DE0', label: 'J' };

    const box = bbox([A, B, C, I, K, J], 0.6);
    const s = SvgUtils.setupSVG('graph8svg', box);
    if (!s) return;

    SvgUtils.drawAxesWithArrows(s);
    drawTriangle(s, A, B, C, { color: '#2A2A3E', lineWidth: 1.5, dashed: true, dashPattern: [3, 3] });
    SvgUtils.drawLine(s, I.x, I.y, K.x, K.y, { color: '#F4D03F', lineWidth: 2.5 });
    SvgUtils.drawPoints(s, [A, B, C, I, J, K].map(p => ({ ...p, showCoords: false })));

    SvgUtils.drawNote(s, '--- (IK) droite', box.xMin + 0.1, box.yMax - 0.15, { color: '#F4D03F', fontSize: s.fontSize * 0.9 });
    SvgUtils.drawNote(s, 'J ∈ (IK)', box.xMin + 0.1, box.yMax - 0.3, { color: '#4D9DE0', fontSize: s.fontSize * 0.9 });
    SvgUtils.drawNote(s, 'I, J, K sont alignés', box.xMax - 1.3, box.yMax - 0.15, { fontSize: s.fontSize * 0.9 });
}

document.addEventListener('DOMContentLoaded', function () {
    setTimeout(drawGraph1svg, 500);
    setTimeout(drawGraph2svg, 500);
    setTimeout(drawGraph3svg, 500);
    setTimeout(drawGraph4svg, 500);
    setTimeout(drawGraph5svg, 500);
    setTimeout(drawGraph6cgsvg, 500);
    setTimeout(drawGraph6svg, 500);
    setTimeout(drawGraph7asvg, 500);
    setTimeout(drawGraph7bsvg, 500);
    setTimeout(drawGraph8svg, 500);
});
