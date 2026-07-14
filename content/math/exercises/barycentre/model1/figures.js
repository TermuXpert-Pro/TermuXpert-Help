
// ============================================================
// figures.js - رسومات موضوع "Barycentre" - Modèle 1
// كل درس/تمرين فهاذ الموضوع كيزيد دالة رسمة ديالو هنا
// (كيتحمل بعد canvas-utils.js فكل صفحة محتاجاه)
// ============================================================

// ====== Exercice 1 : Alignement A, G, B ======
function drawGraph1() {
    const s = CanvasUtils.setupCanvas('graph1');
    if (!s) return;
    const { ctx, w, h } = s;
    const ox = 60, oy = h - 30, scale = 40;

    CanvasUtils.drawAxesWithArrows(ctx, ox, oy, w, h);
    CanvasUtils.drawGrid(ctx, ox, oy, w, h, scale, -2, 8);

    CanvasUtils.drawPoints(ctx, ox, oy, scale, [
        { x: 3, y: 2, color: '#4ECDC4', label: 'A' },
        { x: 4, y: 1, color: '#FF6B6B', label: 'B' },
        { x: 17 / 4, y: 3 / 4, color: '#F4D03F', label: 'G' }
    ]);

    CanvasUtils.drawLine(ctx, ox, oy, scale, 3, 2, 4, 1, { dashed: true });
    CanvasUtils.drawNote(ctx, 'A, G et B sont alignés', 200, 20);
}

// ====== Exercice 2 : Intersection (AB) ∩ (EF) = {G} ======
function drawGraph2() {
    const s = CanvasUtils.setupCanvas('graph2');
    if (!s) return;
    const { ctx, w, h } = s;
    const ox = 60, oy = h - 30, scale = 30;

    // Points fictifs pour la démonstration
    const A = { x: 1, y: 4 };
    const B = { x: 5, y: 0.5 };
    // G barycentre de (A,2) et (B,-3)
    const Gx = (2 * A.x + (-3) * B.x) / (2 - 3);
    const Gy = (2 * A.y + (-3) * B.y) / (2 - 3);
    // E sur (AB)
    const E = { x: A.x + 0.4 * (B.x - A.x), y: A.y + 0.4 * (B.y - A.y) };
    // F tel que EG = 2EF
    const F = { x: E.x + (Gx - E.x) / 2, y: E.y + (Gy - E.y) / 2 };

    CanvasUtils.drawAxesWithArrows(ctx, ox, oy, w, h);

    // Droite (AB)
    CanvasUtils.drawLine(ctx, ox, oy, scale, A.x, A.y, B.x, B.y, {
        color: '#FF6B6B', lineWidth: 2, dashed: true, dashPattern: [6, 4]
    });

    // Droite (EF)
    CanvasUtils.drawLine(ctx, ox, oy, scale, E.x, E.y, F.x, F.y, {
        color: '#A8FF78', lineWidth: 2, dashed: true, dashPattern: [6, 4]
    });

    CanvasUtils.drawPoints(ctx, ox, oy, scale, [
        { x: A.x, y: A.y, color: '#4ECDC4', label: 'A', showCoords: false },
        { x: B.x, y: B.y, color: '#FF6B6B', label: 'B', showCoords: false },
        { x: E.x, y: E.y, color: '#BB8FCE', label: 'E', showCoords: false },
        { x: F.x, y: F.y, color: '#BB8FCE', label: 'F', showCoords: false },
        { x: Gx, y: Gy, color: '#F4D03F', label: 'G', showCoords: false }
    ]);

    // Légende
    CanvasUtils.drawNote(ctx, '--- (AB)', 10, 20, { color: '#FF6B6B' });
    CanvasUtils.drawNote(ctx, '--- (EF)', 10, 35, { color: '#A8FF78' });
    CanvasUtils.drawNote(ctx, 'G = intersection', 10, 50, { color: '#F4D03F' });
    CanvasUtils.drawNote(ctx, '(EF) ∩ (AB) = {G}', 200, 20);
}

// ====== Exercice 3 : Ensemble de points = Cercle C(G, 2) ======
function drawGraph3() {
    const s = CanvasUtils.setupCanvas('graph3');
    if (!s) return;
    const { ctx, w, h } = s;
    const ox = 70, oy = h - 40, scale = 40;

    CanvasUtils.drawAxesWithArrows(ctx, ox, oy, w, h);
    CanvasUtils.drawGrid(ctx, ox, oy, w, h, scale, -2, 8);

    const A = { x: 0, y: 5, color: '#4ECDC4', label: 'A' };
    const B = { x: 3, y: 2, color: '#FF6B6B', label: 'B' };
    const G = { x: 2, y: 3, color: '#F4D03F', label: 'G' };
    const gx = ox + G.x * scale, gy = oy - G.y * scale;

    // Cercle C(G, 2)
    ctx.strokeStyle = '#4D9DE0';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.arc(gx, gy, 2 * scale, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.setLineDash([]);

    // Rayon
    ctx.strokeStyle = '#A8FF78';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(gx, gy);
    ctx.lineTo(gx + 2 * scale, gy);
    ctx.stroke();
    ctx.setLineDash([]);

    CanvasUtils.drawNote(ctx, 'r = 2', gx + 2 * scale - 20, gy - 8, { color: '#A8FF78', font: '10px Arial' });

    CanvasUtils.drawPoints(ctx, ox, oy, scale, [
        { ...A, label: `A (${A.x};${A.y})`, showCoords: false },
        { ...B, label: `B (${B.x};${B.y})`, showCoords: false },
        { ...G, label: `G (${G.x};${G.y})`, showCoords: false }
    ]);

    CanvasUtils.drawNote(ctx, '--- Cercle C(G, 2)', 10, 20, { color: '#4D9DE0' });
    CanvasUtils.drawNote(ctx, 'G centre du cercle', 10, 35, { color: '#F4D03F' });
    CanvasUtils.drawNote(ctx, 'Cercle de centre G(2;3) rayon 2', 200, 20);
}

// ====== Exercice 4 : Triangle ABC + construction de G ======
function drawGraph4() {
    const s = CanvasUtils.setupCanvas('graph4');
    if (!s) return;
    const { ctx, w, h } = s;
    const ox = 80, oy = h - 30, scale = 45;

    // Points du triangle
    const A = { x: 2, y: 1, color: '#4ECDC4', label: 'A' };
    const B = { x: 5, y: 0.5, color: '#FF6B6B', label: 'B' };
    const C = { x: 3, y: 4.5, color: '#BB8FCE', label: 'C' };

    // G = barycentre de (A,1), (B,1), (C,2)
    const Gx = (1 * A.x + 1 * B.x + 2 * C.x) / (1 + 1 + 2);
    const Gy = (1 * A.y + 1 * B.y + 2 * C.y) / (1 + 1 + 2);
    const G = { x: Gx, y: Gy, color: '#F4D03F', label: 'G' };

    // I milieu de [BC]
    const I = { x: (B.x + C.x) / 2, y: (B.y + C.y) / 2, color: '#A8FF78', label: 'I' };

    CanvasUtils.drawAxes(ctx, ox, oy, w, h);
    CanvasUtils.drawNote(ctx, 'x', w - 20, oy + 18, { color: '#4ECDC4', font: '12px Arial' });
    CanvasUtils.drawNote(ctx, 'y', ox + 10, 16, { color: '#4ECDC4', font: '12px Arial' });

    // Triangle ABC
    ctx.strokeStyle = '#2A2A3E';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(ox + A.x * scale, oy - A.y * scale);
    ctx.lineTo(ox + B.x * scale, oy - B.y * scale);
    ctx.lineTo(ox + C.x * scale, oy - C.y * scale);
    ctx.closePath();
    ctx.stroke();
    ctx.setLineDash([]);

    // Médiane AI
    CanvasUtils.drawLine(ctx, ox, oy, scale, A.x, A.y, I.x, I.y, {
        color: '#A8FF78', lineWidth: 1.5, dashed: true, dashPattern: [4, 4]
    });

    CanvasUtils.drawPoints(ctx, ox, oy, scale, [A, B, C, G, I].map(p => ({ ...p, showCoords: false })));

    // Légende
    CanvasUtils.drawNote(ctx, 'Triangle ABC', 10, 20, { color: '#4ECDC4' });
    CanvasUtils.drawNote(ctx, 'G barycentre', 10, 35, { color: '#F4D03F' });
    CanvasUtils.drawNote(ctx, 'I milieu de [BC]', 10, 50, { color: '#A8FF78' });
    CanvasUtils.drawNote(ctx, 'AG = 1/4 AB + 1/2 AC', 250, 20);
}

// ====== Exercice 5 (partie 1) : Construction de G par associativité ======
function drawGraph5() {
    const s = CanvasUtils.setupCanvas('graph5');
    if (!s) return;
    const { ctx, w, h } = s;
    const ox = 60, oy = h - 30, scale = 40;

    const A = { x: 1, y: 1, color: '#4ECDC4', label: 'A' };
    const B = { x: 4, y: 0.5, color: '#FF6B6B', label: 'B' };
    const C = { x: 2.5, y: 4.5, color: '#BB8FCE', label: 'C' };
    // E = Bar{(A,2);(B,-3)} => AE = 3AB
    const E = { x: A.x + 3 * (B.x - A.x), y: A.y + 3 * (B.y - A.y), color: '#A8FF78', label: 'E' };
    // G = Bar{(E,-1);(C,5)} => CG = -1/4 CE
    const G = { x: C.x - 0.25 * (E.x - C.x), y: C.y - 0.25 * (E.y - C.y), color: '#F4D03F', label: 'G' };

    CanvasUtils.drawAxes(ctx, ox, oy, w, h);
    CanvasUtils.drawNote(ctx, 'x', w - 20, oy + 18, { color: '#4ECDC4', font: '12px Arial' });
    CanvasUtils.drawNote(ctx, 'y', ox + 10, 16, { color: '#4ECDC4', font: '12px Arial' });

    // Droite (AB)
    CanvasUtils.drawLine(ctx, ox, oy, scale, A.x, A.y, B.x, B.y, { dashed: true, dashPattern: [3, 3] });
    // Droite (CE)
    CanvasUtils.drawLine(ctx, ox, oy, scale, C.x, C.y, E.x, E.y, {
        color: '#A8FF78', lineWidth: 1.5, dashed: true, dashPattern: [4, 4]
    });

    CanvasUtils.drawPoints(ctx, ox, oy, scale, [A, B, C, E, G].map(p => ({ ...p, showCoords: false })));

    // Légende
    CanvasUtils.drawNote(ctx, 'A', 10, 20, { color: '#4ECDC4' });
    CanvasUtils.drawNote(ctx, 'B', 30, 20, { color: '#FF6B6B' });
    CanvasUtils.drawNote(ctx, 'C', 50, 20, { color: '#BB8FCE' });
    CanvasUtils.drawNote(ctx, 'E (AE = 3AB)', 70, 20, { color: '#A8FF78' });
    CanvasUtils.drawNote(ctx, 'G (CG = -1/4 CE)', 10, 35, { color: '#F4D03F' });
    CanvasUtils.drawNote(ctx, 'Associativité : G = Bar{(E,-1);(C,5)}', 200, 20);
}

// ====== Exercice 5 (partie 2) : Centre de gravité G = Bar{(A,1);(I,2)} ======
// ملاحظة: الكانفاس هنا سميتو graph6cg (ماشي graph6) باش ما يتصادمش مع
// drawGraph6 الحقيقية ديال exercice6.html (رسمة ديال دائرة مختلفة تماماً).
function drawGraph6cg() {
    const s = CanvasUtils.setupCanvas('graph6cg');
    if (!s) return;
    const { ctx, w, h } = s;
    const ox = 60, oy = h - 30, scale = 45;

    const A = { x: 2.5, y: 0.8, color: '#4ECDC4', label: 'A' };
    const B = { x: 5.5, y: 1, color: '#FF6B6B', label: 'B' };
    const C = { x: 3.5, y: 5, color: '#BB8FCE', label: 'C' };
    const I = { x: (B.x + C.x) / 2, y: (B.y + C.y) / 2, color: '#A8FF78', label: 'I' };
    const G = { x: (1 * A.x + 2 * I.x) / 3, y: (1 * A.y + 2 * I.y) / 3, color: '#F4D03F', label: 'G' };

    CanvasUtils.drawAxes(ctx, ox, oy, w, h);
    CanvasUtils.drawNote(ctx, 'x', w - 20, oy + 18, { color: '#4ECDC4', font: '12px Arial' });
    CanvasUtils.drawNote(ctx, 'y', ox + 10, 16, { color: '#4ECDC4', font: '12px Arial' });

    // Triangle ABC
    ctx.strokeStyle = '#2A2A3E';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(ox + A.x * scale, oy - A.y * scale);
    ctx.lineTo(ox + B.x * scale, oy - B.y * scale);
    ctx.lineTo(ox + C.x * scale, oy - C.y * scale);
    ctx.closePath();
    ctx.stroke();
    ctx.setLineDash([]);

    // Médiane AI
    CanvasUtils.drawLine(ctx, ox, oy, scale, A.x, A.y, I.x, I.y, {
        color: '#A8FF78', lineWidth: 2, dashed: true, dashPattern: [4, 4]
    });

    CanvasUtils.drawPoints(ctx, ox, oy, scale, [A, B, C, I, G].map(p => ({ ...p, showCoords: false })));

    // Légende
    CanvasUtils.drawNote(ctx, 'Triangle ABC', 10, 20, { color: '#4ECDC4' });
    CanvasUtils.drawNote(ctx, 'I milieu de [BC]', 10, 35, { color: '#A8FF78' });
    CanvasUtils.drawNote(ctx, 'G centre de gravité', 10, 50, { color: '#F4D03F' });
    CanvasUtils.drawNote(ctx, 'G = Bar{(A,1); (I,2)}', 280, 20);
    CanvasUtils.drawNote(ctx, 'AG = 2/3 AI', 280, 35);
}

// ====== Exercice 6 : Réduction d'écriture - Cercle C(G, KA) ======
function drawGraph6() {
    const s = CanvasUtils.setupCanvas('graph6');
    if (!s) return;
    const { ctx, w, h } = s;
    const ox = 80, oy = h - 30, scale = 40;

    const A = { x: 1, y: 1, color: '#4ECDC4', label: 'A' };
    const B = { x: 5, y: 0.5, color: '#FF6B6B', label: 'B' };
    const C = { x: 3, y: 4.5, color: '#BB8FCE', label: 'C' };
    // K = Bar{(C,-3);(B,1)}
    const K = {
        x: (-3 * C.x + 1 * B.x) / (-3 + 1),
        y: (-3 * C.y + 1 * B.y) / (-3 + 1),
        color: '#A8FF78', label: 'K'
    };
    // G = Bar{(A,2);(B,-1);(C,-3)}
    const G = {
        x: (2 * A.x + (-1) * B.x + (-3) * C.x) / (2 - 1 - 3),
        y: (2 * A.y + (-1) * B.y + (-3) * C.y) / (2 - 1 - 3),
        color: '#F4D03F', label: 'G'
    };
    // Rayon KA
    const r = Math.sqrt((K.x - A.x) ** 2 + (K.y - A.y) ** 2);

    CanvasUtils.drawAxes(ctx, ox, oy, w, h);
    CanvasUtils.drawNote(ctx, 'x', w - 20, oy + 18, { color: '#4ECDC4', font: '12px Arial' });
    CanvasUtils.drawNote(ctx, 'y', ox + 10, 16, { color: '#4ECDC4', font: '12px Arial' });

    // Cercle de centre G et rayon KA
    ctx.strokeStyle = '#4D9DE0';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.arc(ox + G.x * scale, oy - G.y * scale, r * scale, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.setLineDash([]);

    CanvasUtils.drawPoints(ctx, ox, oy, scale, [A, B, C, K, G].map(p => ({ ...p, showCoords: false })));

    // Légende
    CanvasUtils.drawNote(ctx, 'A', 10, 20, { color: '#4ECDC4' });
    CanvasUtils.drawNote(ctx, 'B', 30, 20, { color: '#FF6B6B' });
    CanvasUtils.drawNote(ctx, 'C', 50, 20, { color: '#BB8FCE' });
    CanvasUtils.drawNote(ctx, 'K', 70, 20, { color: '#A8FF78' });
    CanvasUtils.drawNote(ctx, 'G (centre)', 10, 35, { color: '#F4D03F' });
    CanvasUtils.drawNote(ctx, '--- Cercle C(G, KA)', 10, 50, { color: '#4D9DE0' });
    CanvasUtils.drawNote(ctx, 'Cercle de centre G et de rayon KA', 200, 20);
}

// ====== Exercice 7 (partie b) : Cercle (E) = C(G, 1.5) ======
function drawGraph7a() {
    const s = CanvasUtils.setupCanvas('graph7a');
    if (!s) return;
    const { ctx, w, h } = s;
    const ox = 60, oy = h - 30, scale = 35;

    const A = { x: 2, y: 1, color: '#4ECDC4', label: 'A' };
    const B = { x: 5.5, y: 0.8, color: '#FF6B6B', label: 'B' };
    const C = { x: 3.5, y: 5, color: '#BB8FCE', label: 'C' };
    const I = { x: (B.x + C.x) / 2, y: (B.y + C.y) / 2, color: '#A8FF78', label: 'I' };
    // G = Bar{(A,1);(I,2)}
    const G = { x: (1 * A.x + 2 * I.x) / 3, y: (1 * A.y + 2 * I.y) / 3, color: '#F4D03F', label: 'G' };
    const r = 1.5 / 2; // rayon (unités approximatives)

    CanvasUtils.drawAxes(ctx, ox, oy, w, h);
    CanvasUtils.drawNote(ctx, 'x', w - 20, oy + 18, { color: '#4ECDC4', font: '12px Arial' });
    CanvasUtils.drawNote(ctx, 'y', ox + 10, 16, { color: '#4ECDC4', font: '12px Arial' });

    // Triangle ABC
    ctx.strokeStyle = '#2A2A3E';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(ox + A.x * scale, oy - A.y * scale);
    ctx.lineTo(ox + B.x * scale, oy - B.y * scale);
    ctx.lineTo(ox + C.x * scale, oy - C.y * scale);
    ctx.closePath();
    ctx.stroke();
    ctx.setLineDash([]);

    // Médiane AI
    CanvasUtils.drawLine(ctx, ox, oy, scale, A.x, A.y, I.x, I.y, {
        color: '#A8FF78', lineWidth: 1.5, dashed: true, dashPattern: [4, 4]
    });

    // Cercle (E) de centre G et rayon 1.5
    ctx.strokeStyle = '#4D9DE0';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.arc(ox + G.x * scale, oy - G.y * scale, r * scale, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.setLineDash([]);

    CanvasUtils.drawPoints(ctx, ox, oy, scale, [A, B, C, I, G].map(p => ({ ...p, showCoords: false })));

    // Légende
    CanvasUtils.drawNote(ctx, 'G', 10, 20, { color: '#F4D03F' });
    CanvasUtils.drawNote(ctx, '--- Cercle (E)', 30, 20, { color: '#4D9DE0' });
    CanvasUtils.drawNote(ctx, 'Cercle de centre G rayon 1.5 cm', 200, 20);
}

// ====== Exercice 7 (partie c) : Médiatrice de [GG'] ======
function drawGraph7b() {
    const s = CanvasUtils.setupCanvas('graph7b');
    if (!s) return;
    const { ctx, w, h } = s;
    const ox = 60, oy = h - 30, scale = 35;

    const A = { x: 2, y: 1, color: '#4ECDC4', label: 'A' };
    const B = { x: 5.5, y: 0.8, color: '#FF6B6B', label: 'B' };
    const C = { x: 3.5, y: 5, color: '#BB8FCE', label: 'C' };
    const I = { x: (B.x + C.x) / 2, y: (B.y + C.y) / 2, color: '#A8FF78', label: 'I' };
    const G = { x: (1 * A.x + 2 * I.x) / 3, y: (1 * A.y + 2 * I.y) / 3, color: '#F4D03F', label: 'G' };
    // G' = Bar{(A,3);(C,1)}
    const Gp = { x: (3 * A.x + 1 * C.x) / 4, y: (3 * A.y + 1 * C.y) / 4, color: '#F4D03F', label: "G'" };

    CanvasUtils.drawAxes(ctx, ox, oy, w, h);
    CanvasUtils.drawNote(ctx, 'x', w - 20, oy + 18, { color: '#4ECDC4', font: '12px Arial' });
    CanvasUtils.drawNote(ctx, 'y', ox + 10, 16, { color: '#4ECDC4', font: '12px Arial' });

    // Triangle ABC
    ctx.strokeStyle = '#2A2A3E';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(ox + A.x * scale, oy - A.y * scale);
    ctx.lineTo(ox + B.x * scale, oy - B.y * scale);
    ctx.lineTo(ox + C.x * scale, oy - C.y * scale);
    ctx.closePath();
    ctx.stroke();
    ctx.setLineDash([]);

    // Segment GG'
    CanvasUtils.drawLine(ctx, ox, oy, scale, G.x, G.y, Gp.x, Gp.y, { color: '#F4D03F', lineWidth: 2 });

    // Médiatrice de [GG']
    const mx = (G.x + Gp.x) / 2, my = (G.y + Gp.y) / 2;
    const dx = -(Gp.y - G.y), dy = (Gp.x - G.x);
    const len = Math.sqrt(dx * dx + dy * dy);
    const nx = dx / len, ny = dy / len, ext = 4;

    ctx.strokeStyle = '#A8FF78';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(ox + (mx - nx * ext) * scale, oy - (my - ny * ext) * scale);
    ctx.lineTo(ox + (mx + nx * ext) * scale, oy - (my + ny * ext) * scale);
    ctx.stroke();
    ctx.setLineDash([]);

    CanvasUtils.drawPoints(ctx, ox, oy, scale, [A, B, C, G, Gp].map(p => ({ ...p, showCoords: false })));

    // Légende
    CanvasUtils.drawNote(ctx, "G et G'", 10, 20, { color: '#F4D03F' });
    CanvasUtils.drawNote(ctx, "--- Médiatrice de [GG']", 10, 35, { color: '#A8FF78' });
    CanvasUtils.drawNote(ctx, "Médiatrice de [GG']", 200, 20);
}

// ====== Exercice 8 : Alignement de I, J, K ======
function drawGraph8() {
    const s = CanvasUtils.setupCanvas('graph8');
    if (!s) return;
    const { ctx, w, h } = s;
    const ox = 80, oy = h - 30, scale = 50;

    // Repère A(0,0), B(1,0), C(0,1)
    const A = { x: 0, y: 0, color: '#4ECDC4', label: 'A' };
    const B = { x: 1, y: 0, color: '#FF6B6B', label: 'B' };
    const C = { x: 0, y: 1, color: '#BB8FCE', label: 'C' };
    const I = { x: -0.5, y: 1.5, color: '#A8FF78', label: 'I' };
    const K = { x: 0.4, y: 0, color: '#F4D03F', label: 'K' };
    const J = { x: 0, y: 0.875, color: '#4D9DE0', label: 'J' };

    CanvasUtils.drawAxes(ctx, ox, oy, w, h);
    CanvasUtils.drawNote(ctx, 'x', w - 20, oy + 18, { color: '#4ECDC4', font: '12px Arial' });
    CanvasUtils.drawNote(ctx, 'y', ox + 10, 16, { color: '#4ECDC4', font: '12px Arial' });

    // Triangle ABC
    ctx.strokeStyle = '#2A2A3E';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(ox + A.x * scale, oy - A.y * scale);
    ctx.lineTo(ox + B.x * scale, oy - B.y * scale);
    ctx.lineTo(ox + C.x * scale, oy - C.y * scale);
    ctx.closePath();
    ctx.stroke();
    ctx.setLineDash([]);

    // Droite (IK)
    CanvasUtils.drawLine(ctx, ox, oy, scale, I.x, I.y, K.x, K.y, { color: '#F4D03F', lineWidth: 2.5 });

    CanvasUtils.drawPoints(ctx, ox, oy, scale, [A, B, C, I, J, K].map(p => ({ ...p, showCoords: false })));

    // Légende
    CanvasUtils.drawNote(ctx, '--- (IK) droite', 10, 20, { color: '#F4D03F' });
    CanvasUtils.drawNote(ctx, 'J ∈ (IK)', 10, 35, { color: '#4D9DE0' });
    CanvasUtils.drawNote(ctx, 'I, J, K sont alignés', 250, 20);
}

document.addEventListener('DOMContentLoaded', function () {
    setTimeout(drawGraph1, 500);
    setTimeout(drawGraph2, 500);
    setTimeout(drawGraph3, 500);
    setTimeout(drawGraph4, 500);
    setTimeout(drawGraph5, 500);
    setTimeout(drawGraph6cg, 500);
    setTimeout(drawGraph6, 500);
    setTimeout(drawGraph7a, 500);
    setTimeout(drawGraph7b, 500);
    setTimeout(drawGraph8, 500);
});
