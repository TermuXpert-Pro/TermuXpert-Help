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

document.addEventListener('DOMContentLoaded', function () {
    setTimeout(drawGraph1, 500);
});
