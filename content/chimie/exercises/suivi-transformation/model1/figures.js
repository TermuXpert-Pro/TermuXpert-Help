// ============================================================
// figures.js - Graphiques pour le chapitre "Suivi d'une transformation chimique"
// Exercice 3 - Permanganate / Fer II
// Exercice 4 - Haut fourneau
// Exercice 9 - Combustion d'un alcane
// ============================================================

// ============================================================
// EXERCICE 3 : Permanganate / Fer II
// ============================================================
function drawGraphPermanganate() {
    const s = CanvasUtils.setupCanvas('graphPermanganate');
    if (!s) return;
    const { ctx, w, h } = s;

    const ox = 60, oy = h - 40;
    const xMax = 1.2; // en 10^-4 mol
    const yMax = 6.0; // en 10^-4 mol
    const scaleX = (w - 80) / xMax;
    const scaleY = (h - 60) / yMax;

    // ====== Axes ======
    CanvasUtils.drawAxesWithArrows(ctx, ox, oy, w, h, {
        xLabel: 'x (×10⁻⁴ mol)',
        yLabel: 'n (×10⁻⁴ mol)'
    });

    // ====== Grille ======
    CanvasUtils.drawGrid(ctx, ox, oy, w, h, scaleX, 0, xMax, { color: '#1A1A2E' });
    CanvasUtils.drawGrid(ctx, ox, oy, w, h, scaleY, 0, yMax, { color: '#1A1A2E' });

    // ====== Données ======
    // MnO4^- : n = 1.0 - x (x en 10^-4 mol)
    const pointsMnO4 = [];
    for (let i = 0; i <= 10; i++) {
        const x = i * 0.1;
        const n = 1.0 - x;
        if (n >= 0) pointsMnO4.push({ x: x, y: n });
    }

    // Fe2+ : n = 5.5 - 5x (x en 10^-4 mol)
    const pointsFe2 = [];
    for (let i = 0; i <= 10; i++) {
        const x = i * 0.1;
        const n = 5.5 - 5 * x;
        if (n >= 0) pointsFe2.push({ x: x, y: n });
    }

    // ====== Tracer les courbes ======
    // MnO4^- en rouge
    ctx.strokeStyle = '#FF6B6B';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let i = 0; i < pointsMnO4.length; i++) {
        const px = ox + pointsMnO4[i].x * scaleX;
        const py = oy - pointsMnO4[i].y * scaleY;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Fe2+ en vert
    ctx.strokeStyle = '#4ECDC4';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let i = 0; i < pointsFe2.length; i++) {
        const px = ox + pointsFe2[i].x * scaleX;
        const py = oy - pointsFe2[i].y * scaleY;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // ====== Points d'intersection ======
    // x_f = 1.0 (MnO4^- s'annule)
    const xf = 1.0;
    const yf = 5.0; // Fe2+ restant

    ctx.fillStyle = '#FF6B6B';
    ctx.beginPath();
    ctx.arc(ox + xf * scaleX, oy, 6, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = '#4ECDC4';
    ctx.beginPath();
    ctx.arc(ox + xf * scaleX, oy - yf * scaleY, 6, 0, 2 * Math.PI);
    ctx.fill();

    // ====== Légende ======
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    // MnO4^- (rouge)
    ctx.fillStyle = '#FF6B6B';
    ctx.font = '11px Arial';
    ctx.fillRect(w - 160, 20, 20, 3);
    ctx.fillRect(w - 160, 20, 20, 3);
    ctx.fillText('MnO₄⁻', w - 135, 15);

    // Fe2+ (vert)
    ctx.fillStyle = '#4ECDC4';
    ctx.fillRect(w - 160, 40, 20, 3);
    ctx.fillText('Fe²⁺', w - 135, 35);

    // ====== Annotation x_f ======
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('x_f = 1,0 × 10⁻⁴ mol', ox + xf * scaleX, oy + 16);

    // ====== Note ======
    CanvasUtils.drawNote(ctx, '1 cm ↔ 2,0×10⁻⁵ mol (x) / 1 cm ↔ 1,0×10⁻⁴ mol (n)', 10, h - 8, {
        font: '9px Arial',
        color: '#888888'
    });
}

// ============================================================
// EXERCICE 4 : Haut fourneau
// ============================================================
function drawGraphHautFourneau() {
    const s = CanvasUtils.setupCanvas('graphHautFourneau');
    if (!s) return;
    const { ctx, w, h } = s;

    const ox = 60, oy = h - 40;
    const xMax = 6.0;
    const yMax = 22.0;
    const scaleX = (w - 80) / xMax;
    const scaleY = (h - 60) / yMax;

    // ====== Axes ======
    CanvasUtils.drawAxesWithArrows(ctx, ox, oy, w, h, {
        xLabel: 'x (mol)',
        yLabel: 'n (mol)'
    });

    // ====== Grille ======
    CanvasUtils.drawGrid(ctx, ox, oy, w, h, scaleX, 0, xMax, { color: '#1A1A2E' });
    CanvasUtils.drawGrid(ctx, ox, oy, w, h, scaleY, 0, yMax, { color: '#1A1A2E' });

    // ====== Données ======
    // Fe3O4 : n = 5 - x
    const pointsFe3O4 = [
        { x: 0, y: 5 },
        { x: 5, y: 0 }
    ];

    // CO : n = 20 - 4x
    const pointsCO = [
        { x: 0, y: 20 },
        { x: 5, y: 0 }
    ];

    // Fe : n = 3x
    const pointsFe = [
        { x: 0, y: 0 },
        { x: 5, y: 15 }
    ];

    // CO2 : n = 4x
    const pointsCO2 = [
        { x: 0, y: 0 },
        { x: 5, y: 20 }
    ];

    // ====== Tracer les courbes ======
    const colors = ['#4ECDC4', '#F4D03F', '#BB8FCE', '#FF6B6B'];
    const labels = ['CO', 'Fe₃O₄', 'CO₂', 'Fe'];
    const allPoints = [pointsCO, pointsFe3O4, pointsCO2, pointsFe];

    for (let idx = 0; idx < allPoints.length; idx++) {
        const pts = allPoints[idx];
        ctx.strokeStyle = colors[idx];
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        for (let i = 0; i < pts.length; i++) {
            const px = ox + pts[i].x * scaleX;
            const py = oy - pts[i].y * scaleY;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.stroke();
    }

    // ====== Légende ======
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    for (let idx = 0; idx < labels.length; idx++) {
        ctx.fillStyle = colors[idx];
        ctx.font = '11px Arial';
        ctx.fillRect(w - 150, 20 + idx * 20, 20, 3);
        ctx.fillText(labels[idx], w - 125, 15 + idx * 20);
    }

    // ====== Annotation x_f ======
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('x_f = 5,0 mol', ox + 5 * scaleX, oy + 16);

    // ====== Note ======
    CanvasUtils.drawNote(ctx, 'Mélange stœchiométrique - Tous les réactifs sont consommés', 10, h - 8, {
        font: '9px Arial',
        color: '#888888'
    });
}

// ============================================================
// EXERCICE 9 : Combustion d'un alcane
// ============================================================
function drawGraphAlcane() {
    const s = CanvasUtils.setupCanvas('graphAlcane');
    if (!s) return;
    const { ctx, w, h } = s;

    const ox = 60, oy = h - 40;
    const xMax = 2.5;
    const yMax = 14.0;
    const scaleX = (w - 80) / xMax;
    const scaleY = (h - 60) / yMax;

    // ====== Axes ======
    CanvasUtils.drawAxesWithArrows(ctx, ox, oy, w, h, {
        xLabel: 'x (mol)',
        yLabel: 'n (mol)'
    });

    // ====== Grille ======
    CanvasUtils.drawGrid(ctx, ox, oy, w, h, scaleX, 0, xMax, { color: '#1A1A2E' });
    CanvasUtils.drawGrid(ctx, ox, oy, w, h, scaleY, 0, yMax, { color: '#1A1A2E' });

    // ====== Données ======
    // Alcane : n = 2.0 - x
    const pointsAlcane = [
        { x: 0, y: 2.0 },
        { x: 2.0, y: 0 }
    ];

    // CO2 : n = 6x (pour C6H14)
    const pointsCO2 = [
        { x: 0, y: 0 },
        { x: 2.0, y: 12.0 }
    ];

    // ====== Tracer les courbes ======
    // Alcane en jaune
    ctx.strokeStyle = '#F4D03F';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let i = 0; i < pointsAlcane.length; i++) {
        const px = ox + pointsAlcane[i].x * scaleX;
        const py = oy - pointsAlcane[i].y * scaleY;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // CO2 en vert
    ctx.strokeStyle = '#4ECDC4';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let i = 0; i < pointsCO2.length; i++) {
        const px = ox + pointsCO2[i].x * scaleX;
        const py = oy - pointsCO2[i].y * scaleY;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // ====== Points ======
    // x_f = 2.0
    const xf = 2.0;

    ctx.fillStyle = '#F4D03F';
    ctx.beginPath();
    ctx.arc(ox + xf * scaleX, oy, 6, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = '#4ECDC4';
    ctx.beginPath();
    ctx.arc(ox + xf * scaleX, oy - 12 * scaleY, 6, 0, 2 * Math.PI);
    ctx.fill();

    // ====== Légende ======
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    ctx.fillStyle = '#F4D03F';
    ctx.font = '11px Arial';
    ctx.fillRect(w - 150, 20, 20, 3);
    ctx.fillText('Alcane', w - 125, 15);

    ctx.fillStyle = '#4ECDC4';
    ctx.fillRect(w - 150, 40, 20, 3);
    ctx.fillText('CO₂', w - 125, 35);

    // ====== Annotation ======
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('x_f = 2,0 mol', ox + xf * scaleX, oy + 16);

    // ====== Note ======
    CanvasUtils.drawNote(ctx, 'Alcane C₆H₁₄ (hexane) - n(alcane)₀ = 2,0 mol', 10, h - 8, {
        font: '9px Arial',
        color: '#888888'
    });
}

// ============================================================
// Initialisation au chargement de la page
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        if (document.getElementById('graphPermanganate')) {
            drawGraphPermanganate();
        }
        if (document.getElementById('graphHautFourneau')) {
            drawGraphHautFourneau();
        }
        if (document.getElementById('graphAlcane')) {
            drawGraphAlcane();
        }
    }, 300);
});