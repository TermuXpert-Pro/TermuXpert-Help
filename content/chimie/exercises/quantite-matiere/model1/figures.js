// ============================================================
// figures.js - رسومات درس "Grandeurs physiques liées à la quantité de matière"
// Exercice 2 - Ampoule à décanter
// ============================================================

function drawGraphDecanter() {
    const s = CanvasUtils.setupCanvas('graphDecanter');
    if (!s) return;
    const { ctx, w, h } = s;

    const cx = w / 2;
    const topY = 20;
    const bottomY = h - 20;

    // ====== Ampoule à décanter (forme) ======
    ctx.strokeStyle = '#4ECDC4';
    ctx.lineWidth = 2;

    // Partie supérieure (cylindre) - trait horizontal
    ctx.beginPath();
    ctx.moveTo(cx - 40, topY);
    ctx.lineTo(cx + 40, topY);
    ctx.stroke();

    // Côté gauche
    ctx.beginPath();
    ctx.moveTo(cx - 40, topY);
    ctx.lineTo(cx - 50, topY + 30);
    ctx.lineTo(cx - 40, bottomY);
    ctx.stroke();

    // Côté droit
    ctx.beginPath();
    ctx.moveTo(cx + 40, topY);
    ctx.lineTo(cx + 50, topY + 30);
    ctx.lineTo(cx + 40, bottomY);
    ctx.stroke();

    // Fond
    ctx.beginPath();
    ctx.moveTo(cx - 40, bottomY);
    ctx.lineTo(cx + 40, bottomY);
    ctx.stroke();

    // ====== Robinet ======
    ctx.fillStyle = '#FF6B6B';
    ctx.fillRect(cx - 4, bottomY, 8, 10);

    // ====== Phase supérieure : Heptane (moins dense) ======
    const phase1Y = topY + 5;
    const phase1H = 80;
    ctx.fillStyle = 'rgba(78, 205, 196, 0.25)';
    ctx.fillRect(cx - 38, phase1Y, 76, phase1H);
    ctx.strokeStyle = '#4ECDC4';
    ctx.lineWidth = 1;
    ctx.strokeRect(cx - 38, phase1Y, 76, phase1H);

    // ====== Phase inférieure : Éthanol (plus dense) ======
    const phase2Y = phase1Y + phase1H;
    const phase2H = 120;
    ctx.fillStyle = 'rgba(244, 208, 63, 0.2)';
    ctx.fillRect(cx - 38, phase2Y, 76, phase2H);
    ctx.strokeStyle = '#F4D03F';
    ctx.lineWidth = 1;
    ctx.strokeRect(cx - 38, phase2Y, 76, phase2H);

    // ====== Ligne de séparation ======
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(cx - 38, phase1Y + phase1H);
    ctx.lineTo(cx + 38, phase1Y + phase1H);
    ctx.stroke();
    ctx.setLineDash([]);

    // ====== Labels des phases ======
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.fillStyle = '#4ECDC4';
    ctx.font = '12px Arial';
    ctx.fillText('Heptane', cx, phase1Y + phase1H / 2);
    
    ctx.fillStyle = '#F4D03F';
    ctx.fillText('Éthanol', cx, phase2Y + phase2H / 2);

    // ====== Indications des densités ======
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    ctx.fillStyle = '#4ECDC4';
    ctx.font = '9px Arial';
    ctx.fillText('d = 0,68', cx + 45, phase1Y + phase1H / 2);

    ctx.fillStyle = '#F4D03F';
    ctx.fillText('d = 0,81', cx + 45, phase2Y + phase2H / 2);

    // ====== Légende en bas ======
    CanvasUtils.drawNote(ctx, 'Ampoule à décanter - Mélange non miscible', cx - 100, h - 5, {
        font: '9px Arial',
        color: '#888888'
    });
}

// ============================================================
// Initialisation au chargement de la page
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        if (document.getElementById('graphDecanter')) {
            drawGraphDecanter();
        }
    }, 300);
});