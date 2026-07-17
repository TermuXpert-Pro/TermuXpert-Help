// ============================================================
// figures.js - رسومات درس "Suivi d'une transformation chimique"
// Exercice 4 - Haut fourneau (Graphique)
// ============================================================

// ============================================================
// EXERCICE 4 - Graphique du haut fourneau
// ============================================================
function drawGraphHautFourneau() {
    const s = CanvasUtils.setupCanvas('graphHautFourneau');
    if (!s) return;
    const { ctx, w, h } = s;

    const padding = { top: 30, bottom: 40, left: 50, right: 20 };
    const graphW = w - padding.left - padding.right;
    const graphH = h - padding.top - padding.bottom;

    const ox = padding.left;
    const oy = padding.top + graphH;

    // ====== Échelles ======
    // x : 0 à 5 mol, y : 0 à 18 mol
    const xMax = 5;
    const yMax = 18;
    const scaleX = graphW / xMax;
    const scaleY = graphH / yMax;

    // ====== Points des courbes ======
    // Courbe (1) : CO - décroissante de 16 à 0
    // Courbe (2) : Fe3O4 - décroissante de 5 à 1
    // Courbe (3) : CO2 - croissante de 0 à 16
    // Courbe (4) : Fe - croissante de 0 à 12

    const coPoints = [
        { x: 0, y: 16 },
        { x: 1, y: 12 },
        { x: 2, y: 8 },
        { x: 3, y: 4 },
        { x: 4, y: 0 }
    ];

    const magnetitePoints = [
        { x: 0, y: 5 },
        { x: 1, y: 4 },
        { x: 2, y: 3 },
        { x: 3, y: 2 },
        { x: 4, y: 1 }
    ];

    const co2Points = [
        { x: 0, y: 0 },
        { x: 1, y: 4 },
        { x: 2, y: 8 },
        { x: 3, y: 12 },
        { x: 4, y: 16 }
    ];

    const fePoints = [
        { x: 0, y: 0 },
        { x: 1, y: 3 },
        { x: 2, y: 6 },
        { x: 3, y: 9 },
        { x: 4, y: 12 }
    ];

    // ====== Fond ======
    ctx.fillStyle = '#0D1117';
    ctx.fillRect(0, 0, w, h);

    // ====== Axes ======
    ctx.strokeStyle = '#2A2A3E';
    ctx.lineWidth = 1.5;
    
    // Axe x
    ctx.beginPath();
    ctx.moveTo(ox, oy);
    ctx.lineTo(w - padding.right, oy);
    ctx.stroke();
    
    // Axe y
    ctx.beginPath();
    ctx.moveTo(ox, padding.top);
    ctx.lineTo(ox, oy);
    ctx.stroke();

    // ====== Flèches ======
    ctx.fillStyle = '#4ECDC4';
    // Flèche x
    ctx.beginPath();
    ctx.moveTo(w - padding.right - 10, oy - 5);
    ctx.lineTo(w - padding.right, oy);
    ctx.lineTo(w - padding.right - 10, oy + 5);
    ctx.fill();
    // Flèche y
    ctx.beginPath();
    ctx.moveTo(ox - 5, padding.top + 10);
    ctx.lineTo(ox, padding.top);
    ctx.lineTo(ox + 5, padding.top + 10);
    ctx.fill();

    // ====== Labels des axes ======
    ctx.fillStyle = '#4ECDC4';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('Avancement x (mol)', w / 2, h - 20);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText('n (mol)', 15, h / 2);

    // ====== Grille ======
    ctx.strokeStyle = '#1A1A2E';
    ctx.lineWidth = 0.5;
    for (let i = 1; i <= 5; i++) {
        const xPos = ox + i * 1 * scaleX;
        ctx.beginPath();
        ctx.moveTo(xPos, padding.top);
        ctx.lineTo(xPos, oy);
        ctx.stroke();
    }
    for (let i = 2; i <= 17; i += 2) {
        const yPos = oy - i * 1 * scaleY;
        ctx.beginPath();
        ctx.moveTo(ox, yPos);
        ctx.lineTo(w - padding.right, yPos);
        ctx.stroke();
    }

    // ====== Graduations ======
    ctx.fillStyle = '#888888';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    for (let i = 0; i <= 5; i++) {
        const xPos = ox + i * 1 * scaleX;
        ctx.fillText(i, xPos, oy + 5);
    }
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (let i = 0; i <= 18; i += 2) {
        const yPos = oy - i * 1 * scaleY;
        if (i > 0) ctx.fillText(i, ox - 8, yPos);
    }

    // ====== Fonction pour tracer une courbe ======
    function drawCurve(points, color, label, dash) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        if (dash) ctx.setLineDash([6, 4]);
        else ctx.setLineDash([]);
        
        ctx.beginPath();
        ctx.moveTo(ox + points[0].x * scaleX, oy - points[0].y * scaleY);
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(ox + points[i].x * scaleX, oy - points[i].y * scaleY);
        }
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Points
        for (let i = 0; i < points.length; i++) {
            const px = ox + points[i].x * scaleX;
            const py = oy - points[i].y * scaleY;
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(px, py, 4, 0, 2 * Math.PI);
            ctx.fill();
        }
        
        // Label
        const last = points[points.length - 1];
        ctx.fillStyle = color;
        ctx.font = '10px Arial';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'bottom';
        ctx.fillText(label, ox + last.x * scaleX + 5, oy - last.y * scaleY - 2);
    }

    // ====== Tracer les courbes ======
    drawCurve(coPoints, '#4ECDC4', '(1) CO');
    drawCurve(magnetitePoints, '#F4D03F', '(2) Magnétite');
    drawCurve(co2Points, '#FF6B6B', '(3) CO₂');
    drawCurve(fePoints, '#BB8FCE', '(4) Fe');

    // ====== Légende ======
    CanvasUtils.drawNote(ctx, 'Haut fourneau - Évolution des quantités de matière', padding.left, h - 8, {
        font: '9px Arial',
        color: '#888888'
    });

    // ====== Indication de l'équivalence ======
    const eqX = ox + 4 * scaleX;
    
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 0.5;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(eqX, padding.top);
    ctx.lineTo(eqX, oy);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '9px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText('x_max = 4,0 mol', eqX, padding.top + 10);
}

// ============================================================
// Initialisation au chargement de la page
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        if (document.getElementById('graphHautFourneau')) {
            drawGraphHautFourneau();
        }
    }, 300);
});