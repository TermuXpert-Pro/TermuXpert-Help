// ============================================================
// figuresvg.js - رسومات موضوع "Fonctions" (نسخة SVG)
// كل الرسومات ديال تمارين Fonctions تحولات لـ SVG
// لأنها: منحنيات + محاور + نقاط + كتابات كثيرة
// ============================================================

// ============================================================
// EXERCICE 1 : Parité - f(x) = cos(πx)
// Graphique 1: Courbe de cos(πx) (fonction paire)
// ============================================================
function drawGraphPariteSVG() {
    const s = SvgUtils.setupSVG('graphPariteSVG', { xMin: -5, xMax: 5, yMin: -1.5, yMax: 1.5 });
    if (!s) return;

    // Axes avec flèches
    SvgUtils.drawAxesWithArrows(s, { xLabel: 'x', yLabel: 'y' });
    SvgUtils.drawGrid(s);

    // Courbe cos(πx)
    const points = [];
    for (let x = -4.8; x <= 4.8; x += 0.05) {
        points.push({ x: x, y: Math.cos(Math.PI * x) });
    }
    // Dessiner la courbe point par point
    for (let i = 0; i < points.length - 1; i++) {
        SvgUtils.drawLine(s, points[i].x, points[i].y, points[i + 1].x, points[i + 1].y, {
            color: '#4ECDC4',
            lineWidth: 2
        });
    }

    // Points remarquables
    SvgUtils.drawPoints(s, [
        { x: 0, y: 1, color: '#F4D03F', label: '(0;1)', offsetX: 0.2, offsetY: -0.3, fontSize: s.fontSize * 0.75 },
        { x: 0.5, y: 0, color: '#F4D03F', label: '(0.5;0)', offsetX: 0.2, offsetY: -0.3, fontSize: s.fontSize * 0.75 },
        { x: 1, y: -1, color: '#F4D03F', label: '(1;-1)', offsetX: 0.2, offsetY: -0.3, fontSize: s.fontSize * 0.75 }
    ]);

    // Légende
    SvgUtils.drawNote(s, 'f(x) = cos(πx) est paire', -4.5, 1.3, { color: '#4ECDC4', fontSize: s.fontSize * 0.85 });
    SvgUtils.drawNote(s, 'f(-x) = f(x)', -4.5, 1.0, { color: '#A8FF78', fontSize: s.fontSize * 0.75 });
    SvgUtils.drawNote(s, 'Symétrique par rapport à (Oy)', -4.5, 0.7, { color: '#888888', fontSize: s.fontSize * 0.7 });
}

// ============================================================
// EXERCICE 1 : Périodicité - f(x) = cos(πx)
// Graphique 2: Période T = 2
// ============================================================
function drawGraphPeriodiqueSVG() {
    const s = SvgUtils.setupSVG('graphPeriodiqueSVG', { xMin: -1, xMax: 9, yMin: -1.5, yMax: 1.5 });
    if (!s) return;

    SvgUtils.drawAxesWithArrows(s, { xLabel: 'x', yLabel: 'y' });
    SvgUtils.drawGrid(s);

    // Courbe cos(πx) sur plusieurs périodes
    const points = [];
    for (let x = -0.8; x <= 8.8; x += 0.05) {
        points.push({ x: x, y: Math.cos(Math.PI * x) });
    }
    for (let i = 0; i < points.length - 1; i++) {
        SvgUtils.drawLine(s, points[i].x, points[i].y, points[i + 1].x, points[i + 1].y, {
            color: '#4ECDC4',
            lineWidth: 2
        });
    }

    // Lignes verticales pour T=2
    SvgUtils.drawLine(s, 0, -1.4, 0, 1.4, { color: '#FF6B6B', lineWidth: 1.5, dashed: true, dashPattern: [6, 4] });
    SvgUtils.drawLine(s, 2, -1.4, 2, 1.4, { color: '#FF6B6B', lineWidth: 1.5, dashed: true, dashPattern: [6, 4] });
    SvgUtils.drawLine(s, 4, -1.4, 4, 1.4, { color: '#FF6B6B', lineWidth: 1.5, dashed: true, dashPattern: [6, 4] });
    SvgUtils.drawLine(s, 6, -1.4, 6, 1.4, { color: '#FF6B6B', lineWidth: 1.5, dashed: true, dashPattern: [6, 4] });

    // Labels T=2
    SvgUtils.drawNote(s, 'T = 2', 0.8, -1.3, { color: '#FF6B6B', fontSize: s.fontSize * 0.75 });
    SvgUtils.drawNote(s, 'T = 2', 2.8, -1.3, { color: '#FF6B6B', fontSize: s.fontSize * 0.75 });
    SvgUtils.drawNote(s, 'T = 2', 4.8, -1.3, { color: '#FF6B6B', fontSize: s.fontSize * 0.75 });

    // Légende
    SvgUtils.drawNote(s, 'f(x) = cos(πx) est périodique', -0.8, 1.3, { color: '#4ECDC4', fontSize: s.fontSize * 0.85 });
    SvgUtils.drawNote(s, 'Période T = 2', -0.8, 1.0, { color: '#A8FF78', fontSize: s.fontSize * 0.75 });
    SvgUtils.drawNote(s, 'f(x+2) = f(x)', -0.8, 0.7, { color: '#888888', fontSize: s.fontSize * 0.7 });
}

// ============================================================
// CHARGEMENT DES GRAPHIQUES
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(drawGraphPariteSVG, 500);
    setTimeout(drawGraphPeriodiqueSVG, 500);
});