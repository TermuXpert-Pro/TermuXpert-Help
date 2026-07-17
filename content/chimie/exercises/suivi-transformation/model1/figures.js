// ============================================================
// figures.js - رسومات درس "Mesure des quantités de matière en solution par conductimétrie"
// Exercice 3 - Suivi conductimétrique
// Exercice 5 - Dosage conductimétrique
// ============================================================

// ============================================================
// EXERCICE 3 - Graphique du dosage conductimétrique
// ============================================================
function drawGraphDosage() {
    const s = CanvasUtils.setupCanvas('graphDosage');
    if (!s) return;
    const { ctx, w, h } = s;

    const padding = { top: 30, bottom: 40, left: 50, right: 20 };
    const graphW = w - padding.left - padding.right;
    const graphH = h - padding.top - padding.bottom;

    const ox = padding.left;
    const oy = padding.top + graphH;

    // ====== Échelles ======
    // x : 0 à 25 mL, y : 0 à 4 mS/m
    const xMax = 25;
    const yMax = 4;
    const scaleX = graphW / xMax;
    const scaleY = graphH / yMax;

    // ====== Points expérimentaux ======
    const points = [
        { x: 0, y: 3.50 },
        { x: 5, y: 2.72 },
        { x: 10, y: 1.94 },
        { x: 15, y: 1.16 },
        { x: 20, y: 1.56 },
        { x: 25, y: 2.05 }
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
    ctx.fillText('V_B (mL)', w / 2, h - 20);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText('σ (mS/m)', 15, h / 2);

    // ====== Grille ======
    ctx.strokeStyle = '#1A1A2E';
    ctx.lineWidth = 0.5;
    for (let i = 1; i <= 5; i++) {
        const xPos = ox + i * 5 * scaleX;
        ctx.beginPath();
        ctx.moveTo(xPos, padding.top);
        ctx.lineTo(xPos, oy);
        ctx.stroke();
    }
    for (let i = 1; i <= 4; i++) {
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
        const xPos = ox + i * 5 * scaleX;
        ctx.fillText(i * 5, xPos, oy + 5);
    }
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (let i = 1; i <= 4; i++) {
        const yPos = oy - i * 1 * scaleY;
        ctx.fillText(i, ox - 8, yPos);
    }

    // ====== Tracer les points et les droites ======
    ctx.strokeStyle = '#4ECDC4';
    ctx.lineWidth = 2;

    // Tracer la droite avant l'équivalence (points 0 à 3)
    const p0 = points[0];
    const p3 = points[3];
    ctx.beginPath();
    ctx.moveTo(ox + p0.x * scaleX, oy - p0.y * scaleY);
    ctx.lineTo(ox + p3.x * scaleX, oy - p3.y * scaleY);
    ctx.stroke();

    // Tracer la droite après l'équivalence (points 3 à 5)
    const p5 = points[5];
    ctx.beginPath();
    ctx.moveTo(ox + p3.x * scaleX, oy - p3.y * scaleY);
    ctx.lineTo(ox + p5.x * scaleX, oy - p5.y * scaleY);
    ctx.stroke();

    // Tracer les points expérimentaux
    for (let i = 0; i < points.length; i++) {
        const px = ox + points[i].x * scaleX;
        const py = oy - points[i].y * scaleY;
        
        ctx.fillStyle = '#4ECDC4';
        ctx.beginPath();
        ctx.arc(px, py, 5, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '9px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText('(' + points[i].x + ',' + points[i].y.toFixed(2) + ')', px, py - 6);
    }

    // ====== Indication de l'équivalence ======
    const eqX = ox + 15 * scaleX;
    const eqY = oy - 1.16 * scaleY;
    
    ctx.strokeStyle = '#FF6B6B';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 5]);
    
    // Ligne verticale
    ctx.beginPath();
    ctx.moveTo(eqX, padding.top);
    ctx.lineTo(eqX, oy);
    ctx.stroke();
    
    // Ligne horizontale
    ctx.beginPath();
    ctx.moveTo(ox, eqY);
    ctx.lineTo(w - padding.right, eqY);
    ctx.stroke();
    
    ctx.setLineDash([]);
    
    // Label
    ctx.fillStyle = '#FF6B6B';
    ctx.font = '11px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText('Équivalence', eqX, padding.top + 10);
    ctx.fillText('V_B = 15,0 mL', eqX, padding.top + 25);

    // ====== Légende ======
    CanvasUtils.drawNote(ctx, 'Dosage conductimétrique HCl par NaOH', padding.left, h - 8, {
        font: '9px Arial',
        color: '#888888'
    });
}

// ============================================================
// EXERCICE 5 - Deuxième graphique du dosage conductimétrique
// ============================================================
function drawGraphDosage2() {
    const s = CanvasUtils.setupCanvas('graphDosage2');
    if (!s) return;
    const { ctx, w, h } = s;

    const padding = { top: 30, bottom: 40, left: 50, right: 20 };
    const graphW = w - padding.left - padding.right;
    const graphH = h - padding.top - padding.bottom;

    const ox = padding.left;
    const oy = padding.top + graphH;

    // ====== Échelles ======
    const xMax = 25;
    const yMax = 4;
    const scaleX = graphW / xMax;
    const scaleY = graphH / yMax;

    // ====== Points expérimentaux ======
    const points = [
        { x: 0, y: 3.50 },
        { x: 5, y: 2.72 },
        { x: 10, y: 1.94 },
        { x: 15, y: 1.16 },
        { x: 20, y: 1.56 },
        { x: 25, y: 2.05 }
    ];

    // ====== Fond ======
    ctx.fillStyle = '#0D1117';
    ctx.fillRect(0, 0, w, h);

    // ====== Axes ======
    ctx.strokeStyle = '#2A2A3E';
    ctx.lineWidth = 1.5;
    
    ctx.beginPath();
    ctx.moveTo(ox, oy);
    ctx.lineTo(w - padding.right, oy);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(ox, padding.top);
    ctx.lineTo(ox, oy);
    ctx.stroke();

    // ====== Flèches ======
    ctx.fillStyle = '#4ECDC4';
    ctx.beginPath();
    ctx.moveTo(w - padding.right - 10, oy - 5);
    ctx.lineTo(w - padding.right, oy);
    ctx.lineTo(w - padding.right - 10, oy + 5);
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(ox - 5, padding.top + 10);
    ctx.lineTo(ox, padding.top);
    ctx.lineTo(ox + 5, padding.top + 10);
    ctx.fill();

    // ====== Labels ======
    ctx.fillStyle = '#4ECDC4';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('V_B (mL)', w / 2, h - 20);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText('σ (mS/m)', 15, h / 2);

    // ====== Grille ======
    ctx.strokeStyle = '#1A1A2E';
    ctx.lineWidth = 0.5;
    for (let i = 1; i <= 5; i++) {
        const xPos = ox + i * 5 * scaleX;
        ctx.beginPath();
        ctx.moveTo(xPos, padding.top);
        ctx.lineTo(xPos, oy);
        ctx.stroke();
    }
    for (let i = 1; i <= 4; i++) {
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
        const xPos = ox + i * 5 * scaleX;
        ctx.fillText(i * 5, xPos, oy + 5);
    }
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (let i = 1; i <= 4; i++) {
        const yPos = oy - i * 1 * scaleY;
        ctx.fillText(i, ox - 8, yPos);
    }

    // ====== Tracer les droites ======
    ctx.strokeStyle = '#4ECDC4';
    ctx.lineWidth = 2;

    // Droite avant l'équivalence
    const p0 = points[0];
    const p3 = points[3];
    ctx.beginPath();
    ctx.moveTo(ox + p0.x * scaleX, oy - p0.y * scaleY);
    ctx.lineTo(ox + p3.x * scaleX, oy - p3.y * scaleY);
    ctx.stroke();

    // Droite après l'équivalence
    const p5 = points[5];
    ctx.beginPath();
    ctx.moveTo(ox + p3.x * scaleX, oy - p3.y * scaleY);
    ctx.lineTo(ox + p5.x * scaleX, oy - p5.y * scaleY);
    ctx.stroke();

    // ====== Points ======
    for (let i = 0; i < points.length; i++) {
        const px = ox + points[i].x * scaleX;
        const py = oy - points[i].y * scaleY;
        
        ctx.fillStyle = '#4ECDC4';
        ctx.beginPath();
        ctx.arc(px, py, 5, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '9px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText('(' + points[i].x + ',' + points[i].y.toFixed(2) + ')', px, py - 6);
    }

    // ====== Équivalence ======
    const eqX = ox + 15 * scaleX;
    const eqY = oy - 1.16 * scaleY;
    
    ctx.strokeStyle = '#FF6B6B';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 5]);
    
    ctx.beginPath();
    ctx.moveTo(eqX, padding.top);
    ctx.lineTo(eqX, oy);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(ox, eqY);
    ctx.lineTo(w - padding.right, eqY);
    ctx.stroke();
    
    ctx.setLineDash([]);
    
    ctx.fillStyle = '#FF6B6B';
    ctx.font = '11px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText('Équivalence', eqX, padding.top + 10);
    ctx.fillText('V_B = 15,0 mL', eqX, padding.top + 25);

    // ====== Légende ======
    CanvasUtils.drawNote(ctx, 'Dosage conductimétrique - Points expérimentaux', padding.left, h - 8, {
        font: '9px Arial',
        color: '#888888'
    });
}

// ============================================================
// Initialisation au chargement de la page
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        if (document.getElementById('graphDosage')) {
            drawGraphDosage();
        }
        if (document.getElementById('graphDosage2')) {
            drawGraphDosage2();
        }
    }, 300);
});