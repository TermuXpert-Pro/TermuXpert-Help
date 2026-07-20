// ============================================================
// figuresvt.js - رسومات درس "Le produit scalaire et ses applications"
// كنستافدو من svg-utils.js المشترك (نفس المنطق ديال figuresvg.js
// فتمارين barycentre).
// كيتحمل هاذ الملف بعد svg-utils.js فكل صفحة محتاجاه.
// ============================================================

// ====== Partie 1 - Fig 1 : repère orthonormé et coordonnées d'un vecteur ======
function drawGraphRepere() {
    const s = SvgUtils.setupSVG('graphRepere', { xMin: -1, xMax: 5, yMin: -1, yMax: 4.5 });
    if (!s) return;

    SvgUtils.drawAxesWithArrows(s, { xLabel: 'x', yLabel: 'y' });
    SvgUtils.drawGrid(s);

    // vecteurs de base i et j
    SvgUtils.drawLine(s, 0, 0, 1, 0, { color: '#F4D03F', lineWidth: 2 });
    SvgUtils.drawNote(s, 'i⃗', 1.05, 0.25, { color: '#F4D03F', fontSize: s.fontSize * 0.9 });
    SvgUtils.drawLine(s, 0, 0, 0, 1, { color: '#F4D03F', lineWidth: 2 });
    SvgUtils.drawNote(s, 'j⃗', 0.15, 1.15, { color: '#F4D03F', fontSize: s.fontSize * 0.9 });

    // vecteur u = (3,2)
    SvgUtils.drawLine(s, 0, 0, 3, 2, { color: '#4ECDC4', lineWidth: 2.5 });
    SvgUtils.drawNote(s, 'u⃗(x,y)', 3.05, 2.2, { color: '#4ECDC4', fontSize: s.fontSize * 0.9 });

    // projections pointillées
    SvgUtils.drawLine(s, 3, 0, 3, 2, { color: '#888', lineWidth: 1, dashed: true, dashPattern: [4, 3] });
    SvgUtils.drawLine(s, 0, 2, 3, 2, { color: '#888', lineWidth: 1, dashed: true, dashPattern: [4, 3] });
    SvgUtils.drawNote(s, 'x', 3, -0.35, { color: '#888', fontSize: s.fontSize * 0.85 });
    SvgUtils.drawNote(s, 'y', -0.35, 2, { color: '#888', fontSize: s.fontSize * 0.85 });

    SvgUtils.drawPoints(s, [{ x: 0, y: 0, color: '#fff', label: 'O', showCoords: false }]);
}

// ====== Partie 2 - Fig 1 : angle polaire d'un vecteur ======
function drawGraphPolaire() {
    const s = SvgUtils.setupSVG('graphPolaire', { xMin: -2.5, xMax: 3, yMin: -1, yMax: 3.5 });
    if (!s) return;

    SvgUtils.drawAxesWithArrows(s, { xLabel: 'x', yLabel: 'y' });
    SvgUtils.drawGrid(s);

    // vecteur i
    SvgUtils.drawLine(s, 0, 0, 1, 0, { color: '#F4D03F', lineWidth: 2 });
    SvgUtils.drawNote(s, 'i⃗', 1.1, 0.2, { color: '#F4D03F', fontSize: s.fontSize * 0.9 });

    // vecteur u, angle alpha = 50°
    const alpha = 50 * Math.PI / 180;
    const norm = 2.6;
    const ux = norm * Math.cos(alpha), uy = norm * Math.sin(alpha);
    SvgUtils.drawLine(s, 0, 0, ux, uy, { color: '#4ECDC4', lineWidth: 2.5 });
    SvgUtils.drawNote(s, 'u⃗', ux + 0.1, uy + 0.15, { color: '#4ECDC4', fontSize: s.fontSize * 0.9 });

    // projections
    SvgUtils.drawLine(s, ux, 0, ux, uy, { color: '#888', lineWidth: 1, dashed: true, dashPattern: [4, 3] });
    SvgUtils.drawLine(s, 0, uy, ux, uy, { color: '#888', lineWidth: 1, dashed: true, dashPattern: [4, 3] });
    SvgUtils.drawNote(s, 'x = ‖u⃗‖cosα', ux - 0.5, -0.35, { color: '#888', fontSize: s.fontSize * 0.7 });
    SvgUtils.drawNote(s, 'y = ‖u⃗‖sinα', -2.4, uy, { color: '#888', fontSize: s.fontSize * 0.7 });

    // arc pour alpha
    SvgUtils.drawNote(s, 'α', 0.55, 0.35, { color: '#BB8FCE', fontSize: s.fontSize * 0.85 });
}

// ====== Partie 2 - Fig 2 : aire du triangle ABC ======
function drawGraphAireTriangle() {
    const s = SvgUtils.setupSVG('graphAireTriangle', { xMin: -1, xMax: 7, yMin: -1, yMax: 5 });
    if (!s) return;

    const A = { x: 0, y: 0 }, B = { x: 5, y: 0.5 }, C = { x: 2, y: 4 };
    SvgUtils.drawLine(s, A.x, A.y, B.x, B.y, { color: '#4ECDC4', lineWidth: 2 });
    SvgUtils.drawLine(s, B.x, B.y, C.x, C.y, { color: '#4ECDC4', lineWidth: 2 });
    SvgUtils.drawLine(s, C.x, C.y, A.x, A.y, { color: '#4ECDC4', lineWidth: 2 });

    // hauteur issue de C : H projeté de C sur (AB)
    // (AB) direction (5,0.5), on calcule H approximativement pour l'illustration
    const H = { x: 2.35, y: 0.235 };
    SvgUtils.drawLine(s, C.x, C.y, H.x, H.y, { color: '#F4D03F', lineWidth: 1.5, dashed: true, dashPattern: [5, 3] });

    SvgUtils.drawPoints(s, [
        { x: A.x, y: A.y, label: 'A', color: '#fff', showCoords: false },
        { x: B.x, y: B.y, label: 'B', color: '#fff', showCoords: false },
        { x: C.x, y: C.y, label: 'C', color: '#fff', showCoords: false },
        { x: H.x, y: H.y, label: 'H', color: '#F4D03F', showCoords: false, radius: s.fontSize * 0.2 }
    ]);
}

// ====== Partie 3 - Fig 1 : vecteur directeur et vecteur normal ======
function drawGraphVecteurNormal() {
    const s = SvgUtils.setupSVG('graphVecteurNormal', { xMin: -1, xMax: 6, yMin: -1, yMax: 5 });
    if (!s) return;

    // droite (D) passant par A(0.5, 0.5) direction (2,1)
    SvgUtils.drawLine(s, -0.5, 0, 5.5, 2.5, { color: '#666', lineWidth: 1.5 });
    SvgUtils.drawNote(s, '(D)', 5.6, 2.6, { color: '#888', fontSize: s.fontSize * 0.85 });

    const A = { x: 2, y: 1 };
    // vecteur directeur u(2,1)
    SvgUtils.drawLine(s, A.x, A.y, A.x + 2, A.y + 1, { color: '#4ECDC4', lineWidth: 2.5 });
    SvgUtils.drawNote(s, 'u⃗', A.x + 2.1, A.y + 1.15, { color: '#4ECDC4', fontSize: s.fontSize * 0.9 });

    // vecteur normal n(-1,2)
    SvgUtils.drawLine(s, A.x, A.y, A.x - 1, A.y + 2, { color: '#F4D03F', lineWidth: 2.5 });
    SvgUtils.drawNote(s, 'n⃗', A.x - 1.1, A.y + 2.2, { color: '#F4D03F', fontSize: s.fontSize * 0.9 });

    SvgUtils.drawPoints(s, [{ x: A.x, y: A.y, label: 'A', color: '#fff', showCoords: false }]);
}

// ====== Partie 4 - Fig 1 : distance d'un point à une droite ======
function drawGraphDistance() {
    const s = SvgUtils.setupSVG('graphDistance', { xMin: -1, xMax: 6, yMin: -1, yMax: 5 });
    if (!s) return;

    // droite (D)
    SvgUtils.drawLine(s, -0.5, 0.2, 5.5, 4.2, { color: '#666', lineWidth: 1.5 });
    SvgUtils.drawNote(s, '(D)', 5.6, 4.3, { color: '#888', fontSize: s.fontSize * 0.85 });

    const M0 = { x: 4, y: 0.8 };
    const H = { x: 3.05, y: 2.15 };
    SvgUtils.drawLine(s, M0.x, M0.y, H.x, H.y, { color: '#F4D03F', lineWidth: 2, dashed: true, dashPattern: [5, 3] });

    SvgUtils.drawPoints(s, [
        { x: M0.x, y: M0.y, label: 'M₀', color: '#4ECDC4', showCoords: false },
        { x: H.x, y: H.y, label: 'H', color: '#F4D03F', showCoords: false }
    ]);
}

// ====== Partie 5 - Fig 1 : cercle C(Ω(a,b);r) ======
function drawGraphCercleEquation() {
    const s = SvgUtils.setupSVG('graphCercleEquation', { xMin: -1, xMax: 6, yMin: -1, yMax: 6 });
    if (!s) return;

    SvgUtils.drawAxesWithArrows(s, { xLabel: 'x', yLabel: 'y' });
    SvgUtils.drawGrid(s);

    const O = { x: 2, y: 2.5 }, r = 2;
    SvgUtils.drawCircle(s, O.x, O.y, r, { color: '#4ECDC4', lineWidth: 2 });
    SvgUtils.drawLine(s, O.x, O.y, O.x + r, O.y, { color: '#F4D03F', lineWidth: 1.5, dashed: true, dashPattern: [4, 3] });
    SvgUtils.drawNote(s, 'r', O.x + r / 2 - 0.15, O.y + 0.25, { color: '#F4D03F', fontSize: s.fontSize * 0.85 });

    SvgUtils.drawPoints(s, [
        { x: O.x, y: O.y, label: 'Ω(a,b)', color: '#fff', showCoords: false },
        { x: O.x + r, y: O.y, label: 'M(x,y)', color: '#4ECDC4', showCoords: false }
    ]);
}

// ====== Partie 5 - Fig 2 : droite tangente à un cercle ======
function drawGraphTangente() {
    const s = SvgUtils.setupSVG('graphTangente', { xMin: -1, xMax: 6, yMin: -1, yMax: 6 });
    if (!s) return;

    const O = { x: 2, y: 2.5 }, r = 2;
    SvgUtils.drawCircle(s, O.x, O.y, r, { color: '#666', lineWidth: 1.5 });

    // point A sur le cercle (angle 30°)
    const ang = 30 * Math.PI / 180;
    const A = { x: O.x + r * Math.cos(ang), y: O.y + r * Math.sin(ang) };

    // rayon OA
    SvgUtils.drawLine(s, O.x, O.y, A.x, A.y, { color: '#F4D03F', lineWidth: 1.5, dashed: true, dashPattern: [4, 3] });

    // tangente en A : perpendiculaire à OA
    const dx = A.x - O.x, dy = A.y - O.y;
    const tx = -dy, ty = dx; // direction perpendiculaire
    const norm = Math.sqrt(tx * tx + ty * ty);
    const ext = 2.2 / norm;
    SvgUtils.drawLine(s, A.x - tx * ext, A.y - ty * ext, A.x + tx * ext, A.y + ty * ext, { color: '#4ECDC4', lineWidth: 2 });
    SvgUtils.drawNote(s, '(D) tangente', A.x + tx * ext - 0.3, A.y + ty * ext + 0.3, { color: '#4ECDC4', fontSize: s.fontSize * 0.75 });

    SvgUtils.drawPoints(s, [
        { x: O.x, y: O.y, label: 'Ω', color: '#fff', showCoords: false },
        { x: A.x, y: A.y, label: 'A', color: '#F4D03F', showCoords: false }
    ]);
}

document.addEventListener('DOMContentLoaded', function () {
    setTimeout(function () {
        drawGraphRepere();
        drawGraphPolaire();
        drawGraphAireTriangle();
        drawGraphVecteurNormal();
        drawGraphDistance();
        drawGraphCercleEquation();
        drawGraphTangente();
    }, 400);
});
