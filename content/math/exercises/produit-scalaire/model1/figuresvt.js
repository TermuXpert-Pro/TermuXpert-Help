// ============================================================
// figuresvg.js - رسومات موضوع "Produit scalaire et ses applications"
// المسار: /storage/emulated/0/Web/content/math/exercises/produit-scalaire/model1/figuresvg.js
// ============================================================

// ============================================================
// Exercice 1 : Triangle équilatéral avec D sur la médiatrice
// ============================================================
function drawGraph1bsvg() {
    var s = SvgUtils.setupSVG('graph1bsvg', { xMin: -2, xMax: 6, yMin: -1, yMax: 5 });
    if (!s) return;

    SvgUtils.drawAxesWithArrows(s);
    SvgUtils.drawGrid(s);

    // Triangle équilatéral ABC de côté 3
    var A = { x: 0, y: 0, color: '#4ECDC4', label: 'A' };
    var B = { x: 3, y: 0, color: '#FF6B6B', label: 'B' };
    var C = { x: 1.5, y: 2.598, color: '#BB8FCE', label: 'C' };
    // B' milieu de [AC]
    var Bp = { x: 0.75, y: 1.299, color: '#A8FF78', label: "B'" };
    // D = Bar{(B',3); (B,-1)}
    var D = { x: 0, y: 1.732, color: '#F4D03F', label: 'D' };

    SvgUtils.drawLine(s, A.x, A.y, B.x, B.y, { color: '#2A2A3E', lineWidth: 1.5 });
    SvgUtils.drawLine(s, B.x, B.y, C.x, C.y, { color: '#2A2A3E', lineWidth: 1.5 });
    SvgUtils.drawLine(s, C.x, C.y, A.x, A.y, { color: '#2A2A3E', lineWidth: 1.5 });

    // Médiatrice de [AC] = (BB')
    SvgUtils.drawLine(s, B.x, B.y, Bp.x, Bp.y, { color: '#A8FF78', lineWidth: 2, dashed: true, dashPattern: [6, 4] });
    
    // Segment DB
    SvgUtils.drawLine(s, D.x, D.y, B.x, B.y, { color: '#F4D03F', lineWidth: 1.5 });

    SvgUtils.drawPoints(s, [A, B, C, Bp, D]);

    // Marquer l'angle droit
    SvgUtils.drawNote(s, 'D ∈ médiatrice de [AC]', s.xMin + 0.5, s.yMax - 0.5, { color: '#F4D03F' });
    SvgUtils.drawNote(s, "D = Bar{(A,3);(B,-2);(C,3)}", s.xMin + 0.5, s.yMax - 1.2, { color: '#4ECDC4' });
}

// ============================================================
// Exercice 2 : Triangle ABC avec I milieu de [BC] et G
// ============================================================
function drawGraph2svg() {
    var s = SvgUtils.setupSVG('graph2svg', { xMin: -2, xMax: 8, yMin: -1, yMax: 5 });
    if (!s) return;

    SvgUtils.drawAxesWithArrows(s);
    SvgUtils.drawGrid(s);

    // Triangle avec AB=7, AC=5, BC=4
    var A = { x: 0, y: 0, color: '#4ECDC4', label: 'A' };
    var B = { x: 7, y: 0, color: '#FF6B6B', label: 'B' };
    var C = { x: 4.143, y: 2.828, color: '#BB8FCE', label: 'C' };
    var I = { x: (B.x + C.x) / 2, y: (B.y + C.y) / 2, color: '#A8FF78', label: 'I' };
    
    // G = Bar{(A,-1); (B,1); (C,1)}
    var G = { 
        x: (-1*0 + 1*7 + 1*4.143) / (-1+1+1), 
        y: (-1*0 + 1*0 + 1*2.828) / (-1+1+1), 
        color: '#F4D03F', 
        label: 'G' 
    };

    SvgUtils.drawLine(s, A.x, A.y, B.x, B.y, { color: '#2A2A3E', lineWidth: 1.5 });
    SvgUtils.drawLine(s, B.x, B.y, C.x, C.y, { color: '#2A2A3E', lineWidth: 1.5 });
    SvgUtils.drawLine(s, C.x, C.y, A.x, A.y, { color: '#2A2A3E', lineWidth: 1.5 });

    SvgUtils.drawLine(s, A.x, A.y, I.x, I.y, { color: '#A8FF78', lineWidth: 2, dashed: true, dashPattern: [6, 4] });
    
    // Cercle de centre G rayon AI
    var r = Math.sqrt(33);
    SvgUtils.drawCircle(s, G.x, G.y, r/3, { color: '#4D9DE0', lineWidth: 2, dashed: true, dashPattern: [6, 4] });

    SvgUtils.drawPoints(s, [A, B, C, I, G]);

    SvgUtils.drawNote(s, 'AI = √33', s.xMin + 0.5, s.yMax - 0.5, { color: '#A8FF78' });
    SvgUtils.drawNote(s, 'Cercle de centre G rayon √33', s.xMin + 0.5, s.yMax - 1.2, { color: '#4D9DE0' });
}

// ============================================================
// Exercice 2b : Cercle de centre G rayon AI
// ============================================================
function drawGraph2bsvg() {
    var s = SvgUtils.setupSVG('graph2bsvg', { xMin: -3, xMax: 7, yMin: -3, yMax: 5 });
    if (!s) return;

    SvgUtils.drawAxesWithArrows(s);
    SvgUtils.drawGrid(s);

    var A = { x: 0, y: 0, color: '#4ECDC4', label: 'A' };
    var B = { x: 7, y: 0, color: '#FF6B6B', label: 'B' };
    var C = { x: 4.143, y: 2.828, color: '#BB8FCE', label: 'C' };
    var G = { 
        x: (-1*0 + 1*7 + 1*4.143) / (-1+1+1), 
        y: (-1*0 + 1*0 + 1*2.828) / (-1+1+1), 
        color: '#F4D03F', 
        label: 'G' 
    };

    SvgUtils.drawLine(s, A.x, A.y, B.x, B.y, { color: '#2A2A3E', lineWidth: 1 });
    SvgUtils.drawLine(s, B.x, B.y, C.x, C.y, { color: '#2A2A3E', lineWidth: 1 });
    SvgUtils.drawLine(s, C.x, C.y, A.x, A.y, { color: '#2A2A3E', lineWidth: 1 });

    var r = Math.sqrt(33);
    SvgUtils.drawCircle(s, G.x, G.y, r/3, { color: '#4D9DE0', lineWidth: 2.5, dashed: true, dashPattern: [6, 4] });

    SvgUtils.drawPoints(s, [A, B, C, G]);

    SvgUtils.drawNote(s, 'F = Cercle de centre G', s.xMin + 0.5, s.yMax - 0.5, { color: '#4D9DE0' });
    SvgUtils.drawNote(s, 'rayon = AI = √33', s.xMin + 0.5, s.yMax - 1.2, { color: '#4D9DE0' });
}

// ============================================================
// Exercice 3 : Plan P avec projeté orthogonal A
// ============================================================
function drawGraph3svg() {
    var s = SvgUtils.setupSVG('graph3svg', { xMin: -1, xMax: 5, yMin: -1, yMax: 5 });
    if (!s) return;

    SvgUtils.drawAxesWithArrows(s);
    SvgUtils.drawGrid(s);

    var A = { x: 1, y: 1.4, color: '#4ECDC4', label: 'A(1;5;7)' };
    var O = { x: 0, y: 0, color: '#FF6B6B', label: 'O' };

    SvgUtils.drawLine(s, O.x, O.y, A.x, A.y, { color: '#F4D03F', lineWidth: 2 });
    
    // Représentation du plan P (triangle)
    var P1 = { x: -0.8, y: 3.5 };
    var P2 = { x: 4.5, y: 3.5 };
    var P3 = { x: 4.5, y: -0.8 };
    var P4 = { x: -0.8, y: -0.8 };
    SvgUtils.drawLine(s, P1.x, P1.y, P2.x, P2.y, { color: '#4D9DE0', lineWidth: 1.5, dashed: true, dashPattern: [4, 4] });
    SvgUtils.drawLine(s, P2.x, P2.y, P3.x, P3.y, { color: '#4D9DE0', lineWidth: 1.5, dashed: true, dashPattern: [4, 4] });
    SvgUtils.drawLine(s, P3.x, P3.y, P4.x, P4.y, { color: '#4D9DE0', lineWidth: 1.5, dashed: true, dashPattern: [4, 4] });
    SvgUtils.drawLine(s, P4.x, P4.y, P1.x, P1.y, { color: '#4D9DE0', lineWidth: 1.5, dashed: true, dashPattern: [4, 4] });

    // Angle droit
    SvgUtils.drawNote(s, '⊥', A.x + 0.2, A.y - 0.2, { color: '#F4D03F' });

    SvgUtils.drawPoints(s, [A, O]);

    SvgUtils.drawNote(s, 'P : x + 5y + 7z - 75 = 0', s.xMin + 0.5, s.yMax - 0.5, { color: '#4D9DE0' });
    SvgUtils.drawNote(s, 'OA ⊥ P', s.xMin + 0.5, s.yMax - 1.2, { color: '#F4D03F' });
    SvgUtils.drawNote(s, 'A est le projeté orthogonal de O', s.xMin + 0.5, s.yMax - 1.9, { color: '#4ECDC4' });
}

// ============================================================
// Exercice 4 : Sphère de centre I passant par A
// ============================================================
function drawGraph4svg() {
    var s = SvgUtils.setupSVG('graph4svg', { xMin: -2, xMax: 6, yMin: -2, yMax: 5 });
    if (!s) return;

    SvgUtils.drawAxesWithArrows(s);
    SvgUtils.drawGrid(s);

    var I = { x: 1.5, y: 1.8, color: '#FF6B6B', label: 'I(3;1;-4)' };
    var A = { x: 3.5, y: 2.8, color: '#4ECDC4', label: 'A(4;2;1)' };

    var r = Math.sqrt(27);
    var rScaled = r / 4;
    SvgUtils.drawCircle(s, I.x, I.y, rScaled, { color: '#4D9DE0', lineWidth: 2.5 });

    // Rayon IA
    SvgUtils.drawLine(s, I.x, I.y, A.x, A.y, { color: '#F4D03F', lineWidth: 1.5, dashed: true, dashPattern: [4, 4] });

    SvgUtils.drawPoints(s, [I, A]);

    SvgUtils.drawNote(s, 'S : (x-3)²+(y-1)²+(z+4)² = 27', s.xMin + 0.5, s.yMax - 0.5, { color: '#4D9DE0' });
    SvgUtils.drawNote(s, 'IA = √27 = 3√3', s.xMin + 0.5, s.yMax - 1.2, { color: '#F4D03F' });
}

// ============================================================
// Exercice 5 : Sphère avec plan tangent en A
// ============================================================
function drawGraph5svg() {
    var s = SvgUtils.setupSVG('graph5svg', { xMin: -2, xMax: 6, yMin: -2, yMax: 5 });
    if (!s) return;

    SvgUtils.drawAxesWithArrows(s);
    SvgUtils.drawGrid(s);

    var I = { x: 1.5, y: 1.8, color: '#FF6B6B', label: 'I' };
    var A = { x: 3.2, y: 2.5, color: '#4ECDC4', label: 'A' };
    var r = Math.sqrt(27) / 4;

    SvgUtils.drawCircle(s, I.x, I.y, r, { color: '#4D9DE0', lineWidth: 2.5 });

    // Rayon IA
    SvgUtils.drawLine(s, I.x, I.y, A.x, A.y, { color: '#F4D03F', lineWidth: 1.5 });

    // Plan tangent (droite)
    var dx = A.x - I.x, dy = A.y - I.y;
    var nx = -dy, ny = dx;
    var len = Math.sqrt(nx*nx + ny*ny);
    var ext = 2;
    var P1 = { x: A.x - nx/len * ext, y: A.y - ny/len * ext };
    var P2 = { x: A.x + nx/len * ext, y: A.y + ny/len * ext };
    SvgUtils.drawLine(s, P1.x, P1.y, P2.x, P2.y, { color: '#A8FF78', lineWidth: 2.5, dashed: true, dashPattern: [6, 4] });

    SvgUtils.drawPoints(s, [I, A]);

    SvgUtils.drawNote(s, 'T : x + 4z - 12 = 0', s.xMin + 0.5, s.yMax - 0.5, { color: '#A8FF78' });
    SvgUtils.drawNote(s, 'Plan tangent en A', s.xMin + 0.5, s.yMax - 1.2, { color: '#A8FF78' });
}

// ============================================================
// Exercice 6 : Distance d'un point A à une droite D
// ============================================================
function drawGraph6svg() {
    var s = SvgUtils.setupSVG('graph6svg', { xMin: -3, xMax: 6, yMin: -1, yMax: 5 });
    if (!s) return;

    SvgUtils.drawAxesWithArrows(s);
    SvgUtils.drawGrid(s);

    var A = { x: -0.5, y: 1.8, color: '#4ECDC4', label: 'A(-1;3)' };

    // Droite D : -x + 4y - 2 = 0 => y = (x+2)/4
    var Dx1 = -2, Dy1 = 0;
    var Dx2 = 6, Dy2 = 2;
    SvgUtils.drawLine(s, Dx1, Dy1, Dx2, Dy2, { color: '#FF6B6B', lineWidth: 2 });

    // Projeté orthogonal H de A sur D
    var a = -1, b = 4, c = -2;
    var x0 = -0.5, y0 = 1.8;
    var denom = a*a + b*b;
    var t = (a*x0 + b*y0 + c) / denom;
    var H = { x: x0 - a*t, y: y0 - b*t, color: '#F4D03F', label: 'H' };

    // Segment AH (distance)
    SvgUtils.drawLine(s, A.x, A.y, H.x, H.y, { color: '#F4D03F', lineWidth: 2, dashed: true, dashPattern: [4, 4] });

    // Angle droit
    SvgUtils.drawNote(s, '⊥', (A.x + H.x)/2 - 0.3, (A.y + H.y)/2 + 0.1, { color: '#F4D03F' });

    SvgUtils.drawPoints(s, [A, H]);

    SvgUtils.drawNote(s, 'D : -x + 4y - 2 = 0', s.xMin + 0.5, s.yMax - 0.5, { color: '#FF6B6B' });
    SvgUtils.drawNote(s, 'd = 11/√17 ≈ 2.668', s.xMin + 0.5, s.yMax - 1.2, { color: '#F4D03F' });
    SvgUtils.drawNote(s, 'AH = distance de A à D', s.xMin + 0.5, s.yMax - 1.9, { color: '#4ECDC4' });
}

// ============================================================
// Exercice 7 : Triangle ABC équilatéral dans l'espace
// ============================================================
function drawGraph7svg() {
    var s = SvgUtils.setupSVG('graph7svg', { xMin: -1, xMax: 4, yMin: -1, yMax: 4 });
    if (!s) return;

    SvgUtils.drawAxesWithArrows(s);
    SvgUtils.drawGrid(s);

    // Projection des points 3D sur 2D
    var A = { x: 0.8, y: 2.5, color: '#4ECDC4', label: 'A' };
    var B = { x: 2.5, y: 1.2, color: '#FF6B6B', label: 'B' };
    var C = { x: 1.2, y: 0.8, color: '#BB8FCE', label: 'C' };
    var D = { x: 0.5, y: 1.5, color: '#A8FF78', label: 'D' };
    var I = { x: (A.x + B.x)/2, y: (A.y + B.y)/2, color: '#F4D03F', label: 'I' };
    var J = { x: (A.x + D.x)/2, y: (A.y + D.y)/2, color: '#4D9DE0', label: 'J' };
    var H = { x: (A.x + B.x + C.x)/3, y: (A.y + B.y + C.y)/3, color: '#A8FF78', label: 'H' };

    SvgUtils.drawLine(s, A.x, A.y, B.x, B.y, { color: '#2A2A3E', lineWidth: 1.5 });
    SvgUtils.drawLine(s, B.x, B.y, C.x, C.y, { color: '#2A2A3E', lineWidth: 1.5 });
    SvgUtils.drawLine(s, C.x, C.y, A.x, A.y, { color: '#2A2A3E', lineWidth: 1.5 });

    SvgUtils.drawLine(s, C.x, C.y, I.x, I.y, { color: '#4D9DE0', lineWidth: 1.5, dashed: true, dashPattern: [4, 4] });
    SvgUtils.drawLine(s, D.x, D.y, B.x, B.y, { color: '#A8FF78', lineWidth: 1.5, dashed: true, dashPattern: [4, 4] });

    SvgUtils.drawPoints(s, [A, B, C, D, I, J, H]);

    SvgUtils.drawNote(s, 'Triangle ABC équilatéral', s.xMin + 0.5, s.yMax - 0.5, { color: '#4ECDC4' });
    SvgUtils.drawNote(s, 'I milieu de [AB]', s.xMin + 0.5, s.yMax - 1.2, { color: '#F4D03F' });
    SvgUtils.drawNote(s, 'J milieu de [AD]', s.xMin + 0.5, s.yMax - 1.9, { color: '#4D9DE0' });
}

// ============================================================
// Exercice 7b : H centre de gravité du triangle ABC
// ============================================================
function drawGraph7bsvg() {
    var s = SvgUtils.setupSVG('graph7bsvg', { xMin: -1, xMax: 4, yMin: -1, yMax: 4 });
    if (!s) return;

    SvgUtils.drawAxesWithArrows(s);
    SvgUtils.drawGrid(s);

    var A = { x: 0.8, y: 2.5, color: '#4ECDC4', label: 'A' };
    var B = { x: 2.5, y: 1.2, color: '#FF6B6B', label: 'B' };
    var C = { x: 1.2, y: 0.8, color: '#BB8FCE', label: 'C' };
    var H = { x: (A.x + B.x + C.x)/3, y: (A.y + B.y + C.y)/3, color: '#F4D03F', label: 'H' };

    SvgUtils.drawLine(s, A.x, A.y, B.x, B.y, { color: '#2A2A3E', lineWidth: 1.5 });
    SvgUtils.drawLine(s, B.x, B.y, C.x, C.y, { color: '#2A2A3E', lineWidth: 1.5 });
    SvgUtils.drawLine(s, C.x, C.y, A.x, A.y, { color: '#2A2A3E', lineWidth: 1.5 });

    // Médianes
    var I_AB = { x: (A.x + B.x)/2, y: (A.y + B.y)/2 };
    var I_BC = { x: (B.x + C.x)/2, y: (B.y + C.y)/2 };
    var I_CA = { x: (C.x + A.x)/2, y: (C.y + A.y)/2 };
    
    SvgUtils.drawLine(s, C.x, C.y, I_AB.x, I_AB.y, { color: '#A8FF78', lineWidth: 1.5, dashed: true, dashPattern: [4, 4] });
    SvgUtils.drawLine(s, A.x, A.y, I_BC.x, I_BC.y, { color: '#A8FF78', lineWidth: 1.5, dashed: true, dashPattern: [4, 4] });
    SvgUtils.drawLine(s, B.x, B.y, I_CA.x, I_CA.y, { color: '#A8FF78', lineWidth: 1.5, dashed: true, dashPattern: [4, 4] });

    SvgUtils.drawPoints(s, [A, B, C, H]);

    SvgUtils.drawNote(s, 'H est le centre de gravité de ABC', s.xMin + 0.5, s.yMax - 0.5, { color: '#F4D03F' });
    SvgUtils.drawNote(s, 'H = (1/3; 1/3; 1/3)', s.xMin + 0.5, s.yMax - 1.2, { color: '#F4D03F' });
}

// ============================================================
// Exercice 8 : Tétraèdre ABCD avec milieux I, J, K, L
// ============================================================
function drawGraph8svg() {
    var s = SvgUtils.setupSVG('graph8svg', { xMin: -2, xMax: 5, yMin: -1, yMax: 5 });
    if (!s) return;

    SvgUtils.drawAxesWithArrows(s);
    SvgUtils.drawGrid(s);

    // Tétraèdre en projection 2D
    var A = { x: 1, y: 3.5, color: '#4ECDC4', label: 'A' };
    var B = { x: 3.5, y: 2.5, color: '#FF6B6B', label: 'B' };
    var C = { x: 1.5, y: 1, color: '#BB8FCE', label: 'C' };
    var D = { x: 0.5, y: 2, color: '#A8FF78', label: 'D' };

    // Milieux
    var I = { x: (A.x + D.x)/2, y: (A.y + D.y)/2, color: '#F4D03F', label: 'I' };
    var J = { x: (B.x + C.x)/2, y: (B.y + C.y)/2, color: '#F4D03F', label: 'J' };
    var K = { x: (A.x + C.x)/2, y: (A.y + C.y)/2, color: '#4D9DE0', label: 'K' };
    var L = { x: (B.x + D.x)/2, y: (B.y + D.y)/2, color: '#4D9DE0', label: 'L' };

    // Arêtes du tétraèdre
    SvgUtils.drawLine(s, A.x, A.y, B.x, B.y, { color: '#2A2A3E', lineWidth: 1.5 });
    SvgUtils.drawLine(s, A.x, A.y, C.x, C.y, { color: '#2A2A3E', lineWidth: 1.5 });
    SvgUtils.drawLine(s, A.x, A.y, D.x, D.y, { color: '#2A2A3E', lineWidth: 1.5 });
    SvgUtils.drawLine(s, B.x, B.y, C.x, C.y, { color: '#2A2A3E', lineWidth: 1.5 });
    SvgUtils.drawLine(s, B.x, B.y, D.x, D.y, { color: '#2A2A3E', lineWidth: 1.5 });
    SvgUtils.drawLine(s, C.x, C.y, D.x, D.y, { color: '#2A2A3E', lineWidth: 1.5 });

    // Quadrilatère IKJL (losange)
    SvgUtils.drawLine(s, I.x, I.y, K.x, K.y, { color: '#4D9DE0', lineWidth: 2 });
    SvgUtils.drawLine(s, K.x, K.y, J.x, J.y, { color: '#4D9DE0', lineWidth: 2 });
    SvgUtils.drawLine(s, J.x, J.y, L.x, L.y, { color: '#4D9DE0', lineWidth: 2 });
    SvgUtils.drawLine(s, L.x, L.y, I.x, I.y, { color: '#4D9DE0', lineWidth: 2 });

    // Diagonales IJ et KL
    SvgUtils.drawLine(s, I.x, I.y, J.x, J.y, { color: '#F4D03F', lineWidth: 1.5, dashed: true, dashPattern: [4, 4] });
    SvgUtils.drawLine(s, K.x, K.y, L.x, L.y, { color: '#F4D03F', lineWidth: 1.5, dashed: true, dashPattern: [4, 4] });

    SvgUtils.drawPoints(s, [A, B, C, D, I, J, K, L]);

    SvgUtils.drawNote(s, 'IKJL est un losange', s.xMin + 0.5, s.yMax - 0.5, { color: '#4D9DE0' });
    SvgUtils.drawNote(s, 'IJ ⊥ KL', s.xMin + 0.5, s.yMax - 1.2, { color: '#F4D03F' });
    SvgUtils.drawNote(s, 'AB = CD = a', s.xMin + 0.5, s.yMax - 1.9, { color: '#4ECDC4' });
}

// ============================================================
// Exercice 8b : Losange IKJL dans le tétraèdre
// ============================================================
function drawGraph8bsvg() {
    var s = SvgUtils.setupSVG('graph8bsvg', { xMin: -2, xMax: 5, yMin: -1, yMax: 5 });
    if (!s) return;

    SvgUtils.drawAxesWithArrows(s);
    SvgUtils.drawGrid(s);

    var A = { x: 1, y: 3.5, color: '#4ECDC4', label: 'A' };
    var B = { x: 3.5, y: 2.5, color: '#FF6B6B', label: 'B' };
    var C = { x: 1.5, y: 1, color: '#BB8FCE', label: 'C' };
    var D = { x: 0.5, y: 2, color: '#A8FF78', label: 'D' };

    var I = { x: (A.x + D.x)/2, y: (A.y + D.y)/2, color: '#F4D03F', label: 'I' };
    var J = { x: (B.x + C.x)/2, y: (B.y + C.y)/2, color: '#F4D03F', label: 'J' };
    var K = { x: (A.x + C.x)/2, y: (A.y + C.y)/2, color: '#4D9DE0', label: 'K' };
    var L = { x: (B.x + D.x)/2, y: (B.y + D.y)/2, color: '#4D9DE0', label: 'L' };

    // Arêtes du tétraèdre (plus claires)
    SvgUtils.drawLine(s, A.x, A.y, B.x, B.y, { color: '#2A2A3E', lineWidth: 1 });
    SvgUtils.drawLine(s, A.x, A.y, C.x, C.y, { color: '#2A2A3E', lineWidth: 1 });
    SvgUtils.drawLine(s, A.x, A.y, D.x, D.y, { color: '#2A2A3E', lineWidth: 1 });
    SvgUtils.drawLine(s, B.x, B.y, C.x, C.y, { color: '#2A2A3E', lineWidth: 1 });
    SvgUtils.drawLine(s, B.x, B.y, D.x, D.y, { color: '#2A2A3E', lineWidth: 1 });
    SvgUtils.drawLine(s, C.x, C.y, D.x, D.y, { color: '#2A2A3E', lineWidth: 1 });

    // Losange IKJL (mis en évidence)
    SvgUtils.drawLine(s, I.x, I.y, K.x, K.y, { color: '#4D9DE0', lineWidth: 3 });
    SvgUtils.drawLine(s, K.x, K.y, J.x, J.y, { color: '#4D9DE0', lineWidth: 3 });
    SvgUtils.drawLine(s, J.x, J.y, L.x, L.y, { color: '#4D9DE0', lineWidth: 3 });
    SvgUtils.drawLine(s, L.x, L.y, I.x, I.y, { color: '#4D9DE0', lineWidth: 3 });

    // Marquer les côtés égaux
    var mid1 = { x: (I.x + K.x)/2, y: (I.y + K.y)/2 };
    var mid2 = { x: (K.x + J.x)/2, y: (K.y + J.y)/2 };
    var mid3 = { x: (J.x + L.x)/2, y: (J.y + L.y)/2 };
    var mid4 = { x: (L.x + I.x)/2, y: (L.y + I.y)/2 };
    
    SvgUtils.drawNote(s, 'a/2', mid1.x + 0.2, mid1.y + 0.1, { color: '#4D9DE0' });
    SvgUtils.drawNote(s, 'a/2', mid2.x + 0.2, mid2.y + 0.1, { color: '#4D9DE0' });
    SvgUtils.drawNote(s, 'a/2', mid3.x + 0.2, mid3.y + 0.1, { color: '#4D9DE0' });
    SvgUtils.drawNote(s, 'a/2', mid4.x + 0.2, mid4.y + 0.1, { color: '#4D9DE0' });

    SvgUtils.drawPoints(s, [I, J, K, L]);

    SvgUtils.drawNote(s, 'Losange IKJL', s.xMin + 0.5, s.yMax - 0.5, { color: '#4D9DE0' });
    SvgUtils.drawNote(s, 'Côtés = a/2', s.xMin + 0.5, s.yMax - 1.2, { color: '#4D9DE0' });
    SvgUtils.drawNote(s, 'AB ⊥ CD ⇔ IKJL est un carré', s.xMin + 0.5, s.yMax - 1.9, { color: '#F4D03F' });
}

// ============================================================
// Exercice 9 : Vecteurs orthogonaux u et v
// ============================================================
function drawGraph9svg() {
    var s = SvgUtils.setupSVG('graph9svg', { xMin: -2, xMax: 5, yMin: -2, yMax: 4 });
    if (!s) return;

    SvgUtils.drawAxesWithArrows(s);
    SvgUtils.drawGrid(s);

    var O = { x: 0.5, y: 1, color: '#2A2A3E', label: 'O' };
    
    // u(√2-1; 1; √2+1) en projection
    var ux = 0.8, uy = 1.2;
    var vx = 1.8, vy = -0.8;

    // Vecteur u
    var U = { x: O.x + ux, y: O.y + uy, color: '#4ECDC4', label: 'u' };
    SvgUtils.drawLine(s, O.x, O.y, U.x, U.y, { color: '#4ECDC4', lineWidth: 3 });
    SvgUtils.drawNote(s, '→', U.x - 0.2, U.y + 0.1, { color: '#4ECDC4' });

    // Vecteur v
    var V = { x: O.x + vx, y: O.y + vy, color: '#FF6B6B', label: 'v' };
    SvgUtils.drawLine(s, O.x, O.y, V.x, V.y, { color: '#FF6B6B', lineWidth: 3 });
    SvgUtils.drawNote(s, '→', V.x - 0.2, V.y + 0.1, { color: '#FF6B6B' });

    // Angle droit
    var midx = (O.x + U.x)/2, midy = (O.y + U.y)/2;
    SvgUtils.drawNote(s, '⊥', midx - 0.2, midy + 0.15, { color: '#F4D03F' });

    SvgUtils.drawPoints(s, [O, U, V]);

    SvgUtils.drawNote(s, 'u · v = 0', s.xMin + 0.5, s.yMax - 0.5, { color: '#F4D03F' });
    SvgUtils.drawNote(s, 'u ⊥ v', s.xMin + 0.5, s.yMax - 1.2, { color: '#F4D03F' });
}

// ============================================================
// Exercice 10 : Quadrilatère ABCD avec vecteurs DB et AC
// ============================================================
function drawGraph10svg() {
    var s = SvgUtils.setupSVG('graph10svg', { xMin: -2, xMax: 6, yMin: -2, yMax: 5 });
    if (!s) return;

    SvgUtils.drawAxesWithArrows(s);
    SvgUtils.drawGrid(s);

    var A = { x: 0.5, y: 3.5, color: '#4ECDC4', label: 'A' };
    var B = { x: 4.5, y: 3, color: '#FF6B6B', label: 'B' };
    var C = { x: 3.5, y: 0.5, color: '#BB8FCE', label: 'C' };
    var D = { x: 0.8, y: 1, color: '#A8FF78', label: 'D' };

    // Quadrilatère ABCD
    SvgUtils.drawLine(s, A.x, A.y, B.x, B.y, { color: '#2A2A3E', lineWidth: 1.5 });
    SvgUtils.drawLine(s, B.x, B.y, C.x, C.y, { color: '#2A2A3E', lineWidth: 1.5 });
    SvgUtils.drawLine(s, C.x, C.y, D.x, D.y, { color: '#2A2A3E', lineWidth: 1.5 });
    SvgUtils.drawLine(s, D.x, D.y, A.x, A.y, { color: '#2A2A3E', lineWidth: 1.5 });

    // Diagonales DB et AC
    SvgUtils.drawLine(s, D.x, D.y, B.x, B.y, { color: '#F4D03F', lineWidth: 2, dashed: true, dashPattern: [6, 4] });
    SvgUtils.drawLine(s, A.x, A.y, C.x, C.y, { color: '#F4D03F', lineWidth: 2, dashed: true, dashPattern: [6, 4] });

    // Vecteurs DB et AC
    var midDB = { x: (D.x + B.x)/2, y: (D.y + B.y)/2 };
    var midAC = { x: (A.x + C.x)/2, y: (A.y + C.y)/2 };
    SvgUtils.drawNote(s, 'DB', midDB.x - 0.2, midDB.y + 0.2, { color: '#F4D03F' });
    SvgUtils.drawNote(s, 'AC', midAC.x - 0.2, midAC.y + 0.2, { color: '#F4D03F' });

    SvgUtils.drawPoints(s, [A, B, C, D]);

    SvgUtils.drawNote(s, '(AB²+CD²) - (AD²+CB²) = 2DB·AC', s.xMin + 0.5, s.yMax - 0.5, { color: '#4ECDC4' });
}

// ============================================================
// Exercice 11 : Triangle ABC avec les hauteurs concourantes en H
// ============================================================
function drawGraph11svg() {
    var s = SvgUtils.setupSVG('graph11svg', { xMin: -1, xMax: 6, yMin: -1, yMax: 5 });
    if (!s) return;

    SvgUtils.drawAxesWithArrows(s);
    SvgUtils.drawGrid(s);

    var A = { x: 0.5, y: 1, color: '#4ECDC4', label: 'A' };
    var B = { x: 5, y: 0.8, color: '#FF6B6B', label: 'B' };
    var C = { x: 3, y: 4, color: '#BB8FCE', label: 'C' };

    // Orthocentre H (calculé approximativement)
    var H = { x: 1.8, y: 1.8, color: '#F4D03F', label: 'H' };

    // Triangle
    SvgUtils.drawLine(s, A.x, A.y, B.x, B.y, { color: '#2A2A3E', lineWidth: 2 });
    SvgUtils.drawLine(s, B.x, B.y, C.x, C.y, { color: '#2A2A3E', lineWidth: 2 });
    SvgUtils.drawLine(s, C.x, C.y, A.x, A.y, { color: '#2A2A3E', lineWidth: 2 });

    // Hauteurs
    // Hauteur issue de A (⊥ à BC)
    var piedA = { x: 3.2, y: 1.5 };
    SvgUtils.drawLine(s, A.x, A.y, piedA.x, piedA.y, { color: '#A8FF78', lineWidth: 2, dashed: true, dashPattern: [6, 4] });
    
    // Hauteur issue de B (⊥ à CA)
    var piedB = { x: 2.2, y: 3.2 };
    SvgUtils.drawLine(s, B.x, B.y, piedB.x, piedB.y, { color: '#A8FF78', lineWidth: 2, dashed: true, dashPattern: [6, 4] });
    
    // Hauteur issue de C (⊥ à AB)
    var piedC = { x: 3, y: 0.8 };
    SvgUtils.drawLine(s, C.x, C.y, piedC.x, piedC.y, { color: '#A8FF78', lineWidth: 2, dashed: true, dashPattern: [6, 4] });

    // Marquer les angles droits
    SvgUtils.drawNote(s, '⊥', piedA.x - 0.3, piedA.y - 0.2, { color: '#A8FF78' });
    SvgUtils.drawNote(s, '⊥', piedB.x - 0.3, piedB.y - 0.2, { color: '#A8FF78' });
    SvgUtils.drawNote(s, '⊥', piedC.x - 0.3, piedC.y - 0.2, { color: '#A8FF78' });

    SvgUtils.drawPoints(s, [A, B, C, H]);

    SvgUtils.drawNote(s, 'H est l\'orthocentre', s.xMin + 0.5, s.yMax - 0.5, { color: '#F4D03F' });
    SvgUtils.drawNote(s, 'Les 3 hauteurs sont concourantes en H', s.xMin + 0.5, s.yMax - 1.2, { color: '#A8FF78' });
}

// ============================================================
// Initialisation au chargement de la page
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        // Exercice 1
        if (document.getElementById('graph1bsvg')) { drawGraph1bsvg(); }
        
        // Exercice 2
        if (document.getElementById('graph2svg')) { drawGraph2svg(); }
        if (document.getElementById('graph2bsvg')) { drawGraph2bsvg(); }
        
        // Exercice 3
        if (document.getElementById('graph3svg')) { drawGraph3svg(); }
        
        // Exercice 4
        if (document.getElementById('graph4svg')) { drawGraph4svg(); }
        
        // Exercice 5
        if (document.getElementById('graph5svg')) { drawGraph5svg(); }
        
        // Exercice 6
        if (document.getElementById('graph6svg')) { drawGraph6svg(); }
        
        // Exercice 7
        if (document.getElementById('graph7svg')) { drawGraph7svg(); }
        if (document.getElementById('graph7bsvg')) { drawGraph7bsvg(); }
        
        // Exercice 8
        if (document.getElementById('graph8svg')) { drawGraph8svg(); }
        if (document.getElementById('graph8bsvg')) { drawGraph8bsvg(); }
        
        // Exercice 9
        if (document.getElementById('graph9svg')) { drawGraph9svg(); }
        
        // Exercice 10
        if (document.getElementById('graph10svg')) { drawGraph10svg(); }
        
        // Exercice 11
        if (document.getElementById('graph11svg')) { drawGraph11svg(); }
    }, 500);
});
