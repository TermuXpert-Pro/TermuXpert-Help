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

document.addEventListener('DOMContentLoaded', function () {
    setTimeout(drawGraph1, 500);
    setTimeout(drawGraph2, 500);
    setTimeout(drawGraph3, 500);
});
