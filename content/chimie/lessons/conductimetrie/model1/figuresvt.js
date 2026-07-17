// ============================================================
// figuresvt.js - رسومات درس "Mesure des quantités de matière en
// solution par conductimétrie"
// كنستافدو من svg-utils.js المشترك (نفس المنطق ديال figuresvg.js
// فتمارين barycentre وفيگورسفت ديال suivi-transformation).
// كيتحمل هاذ الملف بعد svg-utils.js فكل صفحة محتاجاه.
// ============================================================

// ====== Partie 1 - Fig 1 : migration des ions dans le tube en U ======
function drawGraphTubeU() {
    const s = SvgUtils.setupSVG('graphTubeU', { xMin: -1.2, xMax: 11.2, yMin: -0.6, yMax: 8.6 });
    if (!s) return;

    // ---- tube en U (contour lisse, plusieurs segments pour arrondir le fond) ----
    const tube = { color: '#8A8FA3', lineWidth: 2.2 };
    const tubePts = [
        [1, 6.4], [1, 3.2], [1.05, 2.2], [1.25, 1.5], [1.65, 0.95], [2.2, 0.6],
        [3, 0.4], [4, 0.32], [5, 0.3], [6, 0.32], [7, 0.4], [7.8, 0.6],
        [8.35, 0.95], [8.75, 1.5], [8.95, 2.2], [9, 3.2], [9, 6.4]
    ];
    for (let i = 0; i < tubePts.length - 1; i++) {
        SvgUtils.drawLine(s, tubePts[i][0], tubePts[i][1], tubePts[i + 1][0], tubePts[i + 1][1], tube);
    }
    // niveau du liquide (ligne pointillée fine des deux côtés)
    SvgUtils.drawLine(s, 0.75, 6.4, 1.5, 6.4, { color: '#4D9DE0', lineWidth: 1, dashed: true, dashPattern: [3, 2] });
    SvgUtils.drawLine(s, 8.5, 6.4, 9.25, 6.4, { color: '#4D9DE0', lineWidth: 1, dashed: true, dashPattern: [3, 2] });

    // ---- électrodes de graphite (immergées) ----
    SvgUtils.drawLine(s, 1.55, 7.1, 1.55, 2.3, { color: '#333', lineWidth: 4 });
    SvgUtils.drawLine(s, 8.45, 7.1, 8.45, 2.3, { color: '#333', lineWidth: 4 });

    // ---- fils électriques vers le générateur ----
    const wire = { color: '#BBB', lineWidth: 1.6 };
    SvgUtils.drawLine(s, 1.55, 7.1, 1.55, 7.9, wire);
    SvgUtils.drawLine(s, 1.55, 7.9, 4.15, 7.9, wire);
    SvgUtils.drawLine(s, 8.45, 7.1, 8.45, 7.9, wire);
    SvgUtils.drawLine(s, 8.45, 7.9, 5.85, 7.9, wire);

    // ---- générateur (symbole pile : deux barres inégales) ----
    SvgUtils.drawLine(s, 4.15, 8.35, 4.15, 7.45, { color: '#EEE', lineWidth: 2.6 });
    SvgUtils.drawLine(s, 5.0, 8.55, 5.0, 7.25, { color: '#EEE', lineWidth: 1.4 });
    SvgUtils.drawLine(s, 5.0, 8.55, 5.0, 7.25, { color: '#EEE', lineWidth: 1.4 });
    SvgUtils.drawLine(s, 5.85, 8.35, 5.85, 7.45, { color: '#EEE', lineWidth: 2.6 });
    SvgUtils.drawNote(s, 'Générateur', 3.55, 8.9, { color: '#888', fontSize: s.fontSize * 0.8 });
    SvgUtils.drawNote(s, '+', 3.95, 8.2, { color: '#FF6B6B', fontSize: s.fontSize * 0.95 });
    SvgUtils.drawNote(s, '−', 5.75, 8.2, { color: '#4D9DE0', fontSize: s.fontSize * 0.95 });

    // ---- labels anode / cathode ----
    SvgUtils.drawNote(s, 'Anode (+)', 0.1, 7.55, { color: '#FF6B6B', fontSize: s.fontSize * 0.85 });
    SvgUtils.drawNote(s, 'Cathode (−)', 7.15, 7.55, { color: '#4D9DE0', fontSize: s.fontSize * 0.85 });

    // ---- nuages d'ions colorés (au lieu de texte superposé) ----
    const orangeDots = [[2.1, 3.6], [2.5, 3.0], [2.0, 2.6], [2.6, 2.2], [1.85, 3.15]];
    orangeDots.forEach(p => SvgUtils.drawPoint(s, { x: p[0], y: p[1], color: '#F4A300', radius: 0.16 }));
    const blueDots = [[7.9, 3.6], [7.5, 3.0], [8.0, 2.6], [7.4, 2.2], [8.15, 3.15]];
    blueDots.forEach(p => SvgUtils.drawPoint(s, { x: p[0], y: p[1], color: '#4D9DE0', radius: 0.16 }));

    SvgUtils.drawNote(s, 'orange : Cr₂O₇²⁻', 1.35, 4.35, { color: '#F4A300', fontSize: s.fontSize * 0.72 });
    SvgUtils.drawNote(s, 'bleu : Cu²⁺', 7.0, 4.35, { color: '#4D9DE0', fontSize: s.fontSize * 0.72 });

    // ---- flèches de migration (deux niveaux séparés pour ne pas se croiser) ----
    SvgUtils.drawLine(s, 4.15, 1.55, 5.85, 1.55, { color: '#4D9DE0', lineWidth: 2.2 });
    SvgUtils.drawNote(s, 'K⁺, Cu²⁺ →', 3.55, 1.85, { color: '#4D9DE0', fontSize: s.fontSize * 0.72 });
    SvgUtils.drawLine(s, 5.85, 0.95, 4.15, 0.95, { color: '#F4A300', lineWidth: 2.2 });
    SvgUtils.drawNote(s, '← Cr₂O₇²⁻, SO₄²⁻', 3.2, 0.55, { color: '#F4A300', fontSize: s.fontSize * 0.72 });
}

// ====== Partie 1 - Fig 2 : U = f(I), vérification de la loi d'Ohm ======
function drawGraphUI() {
    const s = SvgUtils.setupSVG('graphUI', { xMin: -2, xMax: 16.5, yMin: -0.25, yMax: 1.45 });
    if (!s) return;

    SvgUtils.drawAxesWithArrows(s, { xLabel: 'I (mA)', yLabel: 'U (V)' });
    SvgUtils.drawGrid(s);

    const pts = [
        { x: 0, y: 0 }, { x: 2.4, y: 0.2 }, { x: 6.4, y: 0.44 },
        { x: 10, y: 0.8 }, { x: 14.4, y: 1.2 }
    ];
    for (let i = 0; i < pts.length - 1; i++) {
        SvgUtils.drawLine(s, pts[i].x, pts[i].y, pts[i + 1].x, pts[i + 1].y, { color: '#4ECDC4', lineWidth: 2 });
    }
    SvgUtils.drawPoints(s, pts.map(p => ({ x: p.x, y: p.y, color: '#F4D03F', radius: 0.09, showCoords: false })));

    // graduations numériques sur les deux axes (repères de lecture)
    [0, 2.4, 6.4, 10, 14.4].forEach(v => {
        SvgUtils.drawNote(s, v.toString().replace('.', ','), v - 0.3, -0.14, { color: '#666', fontSize: s.fontSize * 0.6 });
    });
    [0.2, 0.44, 0.8, 1.2].forEach(v => {
        SvgUtils.drawNote(s, v.toString().replace('.', ','), -1.95, v - 0.03, { color: '#666', fontSize: s.fontSize * 0.6 });
    });

    SvgUtils.drawNote(s, 'droite passant par l\'origine', 2, 1.32, { color: '#4ECDC4', fontSize: s.fontSize * 0.78 });
}

// ====== Partie 1 - Fig 3 : G = f(S), à L fixe ======
function drawGraphGS() {
    const s = SvgUtils.setupSVG('graphGS', { xMin: -0.85, xMax: 5, yMin: -80, yMax: 640 });
    if (!s) return;

    SvgUtils.drawAxesWithArrows(s, { xLabel: 'S (cm²)', yLabel: 'G (µS)' });
    SvgUtils.drawGrid(s);

    const pts = [
        { x: 0, y: 0 }, { x: 1, y: 137 }, { x: 2, y: 280 }, { x: 3, y: 415 }, { x: 4, y: 545 }
    ];
    for (let i = 0; i < pts.length - 1; i++) {
        SvgUtils.drawLine(s, pts[i].x, pts[i].y, pts[i + 1].x, pts[i + 1].y, { color: '#4ECDC4', lineWidth: 2 });
    }
    SvgUtils.drawPoints(s, pts.slice(1).map(p => ({ x: p.x, y: p.y, color: '#F4D03F', radius: 0.09, showCoords: false })));

    [1, 2, 3, 4].forEach(v => SvgUtils.drawNote(s, v.toString(), v - 0.08, -32, { color: '#666', fontSize: s.fontSize * 0.65 }));
    [137, 280, 415, 545].forEach(v => SvgUtils.drawNote(s, v.toString(), -0.8, v - 12, { color: '#666', fontSize: s.fontSize * 0.6 }));

    SvgUtils.drawNote(s, 'G proportionnelle à S', 1.3, 590, { color: '#4ECDC4', fontSize: s.fontSize * 0.78 });
}

// ====== Partie 1 - Fig 4 : G = f(1/L), à S fixe (nouveau : complète la Fig 3) ======
function drawGraphGL() {
    const s = SvgUtils.setupSVG('graphGL', { xMin: -0.55, xMax: 4.5, yMin: -20, yMax: 160 });
    if (!s) return;

    SvgUtils.drawAxesWithArrows(s, { xLabel: 'L (cm)', yLabel: 'G (µS)' });
    SvgUtils.drawGrid(s);

    // G = k / L, avec k = 137 (valeur mesurée pour L = 1 cm)
    const k = 137;
    const curvePts = [];
    for (let l = 0.55; l <= 4.3; l += 0.08) curvePts.push({ x: l, y: k / l });
    for (let i = 0; i < curvePts.length - 1; i++) {
        SvgUtils.drawLine(s, curvePts[i].x, curvePts[i].y, curvePts[i + 1].x, curvePts[i + 1].y, { color: '#BB8FCE', lineWidth: 2 });
    }
    const measured = [{ x: 1, y: 137 }, { x: 2, y: 70 }, { x: 3, y: 44 }, { x: 4, y: 34 }];
    SvgUtils.drawPoints(s, measured.map(p => ({ x: p.x, y: p.y, color: '#F4D03F', radius: 0.09, showCoords: false })));

    [1, 2, 3, 4].forEach(v => SvgUtils.drawNote(s, v.toString(), v - 0.08, -9, { color: '#666', fontSize: s.fontSize * 0.65 }));
    [137, 70, 44, 34].forEach(v => SvgUtils.drawNote(s, v.toString(), -0.5, v + 5, { color: '#666', fontSize: s.fontSize * 0.6 }));

    SvgUtils.drawNote(s, 'G inversement proportionnelle à L', 1.05, 145, { color: '#BB8FCE', fontSize: s.fontSize * 0.72 });
}

// ====== Partie 3 : courbe d'étalonnage G = f(C) ======
function drawGraphEtalonnage() {
    const s = SvgUtils.setupSVG('graphEtalonnage', { xMin: -0.85, xMax: 6, yMin: -0.35, yMax: 2.15 });
    if (!s) return;

    SvgUtils.drawAxesWithArrows(s, { xLabel: 'C (mmol/L)', yLabel: 'G (mS)' });
    SvgUtils.drawGrid(s);

    const pts = [
        { x: 0, y: 0 }, { x: 1, y: 0.35 }, { x: 2, y: 0.70 },
        { x: 3, y: 1.05 }, { x: 4, y: 1.40 }, { x: 5, y: 1.75 }
    ];
    for (let i = 0; i < pts.length - 1; i++) {
        SvgUtils.drawLine(s, pts[i].x, pts[i].y, pts[i + 1].x, pts[i + 1].y, { color: '#4ECDC4', lineWidth: 2 });
    }
    SvgUtils.drawPoints(s, pts.slice(1).map(p => ({ x: p.x, y: p.y, color: '#F4D03F', radius: 0.09, showCoords: false })));

    // lecture graphique : G1 = 1,25 mS -> C1 = 3,6 mmol/L
    const C1 = 3.6, G1 = 1.25;
    SvgUtils.drawLine(s, 0, G1, C1, G1, { color: '#BB8FCE', lineWidth: 1.5, dashed: true, dashPattern: [5, 3] });
    SvgUtils.drawLine(s, C1, 0, C1, G1, { color: '#BB8FCE', lineWidth: 1.5, dashed: true, dashPattern: [5, 3] });
    SvgUtils.drawNote(s, 'G₁ = 1,25', -0.8, G1 + 0.09, { color: '#BB8FCE', fontSize: s.fontSize * 0.8 });
    SvgUtils.drawNote(s, 'C₁ = 3,6', C1 - 0.32, -0.2, { color: '#BB8FCE', fontSize: s.fontSize * 0.8 });
    SvgUtils.drawPoint(s, { x: C1, y: G1, color: '#BB8FCE', radius: 0.1 });
}

document.addEventListener('DOMContentLoaded', function () {
    setTimeout(function () {
        drawGraphTubeU();
        drawGraphUI();
        drawGraphGS();
        drawGraphGL();
        drawGraphEtalonnage();
    }, 400);
});
