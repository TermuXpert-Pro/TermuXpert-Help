// ============================================================
// figures.js - رسومات درس "Mesure des quantités de matière 
// en solution par conductimétrie"
// ============================================================

// ============================================================
// Schéma d'une cellule conductimétrique (Version détaillée)
// ============================================================
function drawCelluleConductimetrie(canvasId) {
    const s = CanvasUtils.setupCanvas(canvasId);
    if (!s) return;
    const { ctx, w, h } = s;

    // ====== Fond ======
    ctx.fillStyle = '#0D1117';
    ctx.fillRect(0, 0, w, h);

    // ====== Bécher ======
    const centerX = w / 2;
    const beakerW = w * 0.55;
    const beakerH = h * 0.55;
    const topY = h * 0.15;
    const bottomY = topY + beakerH;

    // Corps du bécher
    ctx.strokeStyle = '#4ECDC4';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(centerX - beakerW / 2, topY);
    ctx.lineTo(centerX - beakerW / 2 + 10, bottomY);
    ctx.lineTo(centerX + beakerW / 2 - 10, bottomY);
    ctx.lineTo(centerX + beakerW / 2, topY);
    ctx.stroke();

    // Bec verseur
    ctx.beginPath();
    ctx.moveTo(centerX + beakerW / 2, topY);
    ctx.lineTo(centerX + beakerW / 2 + 15, topY - 12);
    ctx.stroke();

    // ====== Solution ======
    const solGrad = ctx.createLinearGradient(centerX, topY + 25, centerX, bottomY - 5);
    solGrad.addColorStop(0, 'rgba(78, 205, 196, 0.08)');
    solGrad.addColorStop(0.5, 'rgba(78, 205, 196, 0.20)');
    solGrad.addColorStop(1, 'rgba(78, 205, 196, 0.12)');
    ctx.fillStyle = solGrad;
    ctx.beginPath();
    ctx.moveTo(centerX - beakerW / 2 + 10, topY + 20);
    ctx.lineTo(centerX - beakerW / 2 + 10, bottomY - 4);
    ctx.lineTo(centerX + beakerW / 2 - 10, bottomY - 4);
    ctx.lineTo(centerX + beakerW / 2 - 10, topY + 20);
    ctx.closePath();
    ctx.fill();

    // Ligne de surface
    ctx.strokeStyle = 'rgba(78, 205, 196, 0.3)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 6]);
    ctx.beginPath();
    ctx.moveTo(centerX - beakerW / 2 + 12, topY + 20);
    ctx.lineTo(centerX + beakerW / 2 - 12, topY + 20);
    ctx.stroke();
    ctx.setLineDash([]);

    // ====== Électrodes ======
    const elecW = 8;
    const elecH = beakerH * 0.55;
    const elecTop = topY + 30;

    // Électrode gauche (platine)
    const gradLeft = ctx.createLinearGradient(centerX - beakerW / 4 - elecW/2, 0, centerX - beakerW / 4 + elecW/2, 0);
    gradLeft.addColorStop(0, '#6C3483');
    gradLeft.addColorStop(0.5, '#BB8FCE');
    gradLeft.addColorStop(1, '#6C3483');
    ctx.fillStyle = gradLeft;
    ctx.shadowColor = '#BB8FCE';
    ctx.shadowBlur = 6;
    ctx.fillRect(centerX - beakerW / 4 - elecW/2, elecTop, elecW, elecH);
    ctx.shadowBlur = 0;

    // Électrode droite (platine)
    const gradRight = ctx.createLinearGradient(centerX + beakerW / 4 - elecW/2, 0, centerX + beakerW / 4 + elecW/2, 0);
    gradRight.addColorStop(0, '#6C3483');
    gradRight.addColorStop(0.5, '#BB8FCE');
    gradRight.addColorStop(1, '#6C3483');
    ctx.fillStyle = gradRight;
    ctx.shadowColor = '#BB8FCE';
    ctx.shadowBlur = 6;
    ctx.fillRect(centerX + beakerW / 4 - elecW/2, elecTop, elecW, elecH);
    ctx.shadowBlur = 0;

    // ====== Fils électriques ======
    ctx.strokeStyle = '#F4D03F';
    ctx.lineWidth = 2;

    // Fil gauche
    ctx.beginPath();
    ctx.moveTo(centerX - beakerW / 4, elecTop);
    ctx.lineTo(centerX - beakerW / 4, topY - 25);
    ctx.stroke();

    // Fil droit
    ctx.beginPath();
    ctx.moveTo(centerX + beakerW / 4, elecTop);
    ctx.lineTo(centerX + beakerW / 4, topY - 25);
    ctx.stroke();

    // ====== Bornes ======
    // Borne gauche
    ctx.fillStyle = '#BB8FCE';
    ctx.shadowColor = '#BB8FCE';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(centerX - beakerW / 4, topY - 25, 6, 0, 2 * Math.PI);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Borne droite
    ctx.fillStyle = '#FF6B6B';
    ctx.shadowColor = '#FF6B6B';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(centerX + beakerW / 4, topY - 25, 6, 0, 2 * Math.PI);
    ctx.fill();
    ctx.shadowBlur = 0;

    // ====== Labels ======
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';

    ctx.fillStyle = '#BB8FCE';
    ctx.font = 'bold 11px Arial';
    ctx.fillText('Électrode 1', centerX - beakerW / 4, elecTop - 2);

    ctx.fillStyle = '#FF6B6B';
    ctx.fillText('Électrode 2', centerX + beakerW / 4, elecTop - 2);

    ctx.fillStyle = '#4ECDC4';
    ctx.font = '10px Arial';
    ctx.textBaseline = 'middle';
    ctx.fillText('Solution ionique', centerX, topY + beakerH / 2 + 10);

    // ====== Symbole de tension alternative ======
    ctx.fillStyle = '#F4D03F';
    ctx.font = '14px Arial';
    ctx.textBaseline = 'bottom';
    ctx.fillText('~', centerX - beakerW / 4 - 30, topY - 20);
    ctx.fillText('~', centerX + beakerW / 4 + 30, topY - 20);
    ctx.font = '9px Arial';
    ctx.fillStyle = '#888888';
    ctx.fillText('Tension alternative', centerX, topY - 35);

    // ====== Légende ======
    CanvasUtils.drawNote(ctx, 'Cellule conductimétrique', 10, h - 10, {
        font: '10px Arial',
        color: '#888888'
    });
}

// ============================================================
// Schéma : Mouvement des ions dans une solution
// ============================================================
function drawMouvementIons(canvasId) {
    const s = CanvasUtils.setupCanvas(canvasId);
    if (!s) return;
    const { ctx, w, h } = s;

    // Fond
    ctx.fillStyle = '#0D1117';
    ctx.fillRect(0, 0, w, h);

    const centerX = w / 2;
    const centerY = h / 2;
    const radius = Math.min(w, h) * 0.3;

    // ====== Solution (cercle) ======
    const grad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    grad.addColorStop(0, 'rgba(78, 205, 196, 0.05)');
    grad.addColorStop(0.7, 'rgba(78, 205, 196, 0.15)');
    grad.addColorStop(1, 'rgba(78, 205, 196, 0.05)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fill();

    ctx.strokeStyle = '#2A2A3E';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();

    // ====== Électrodes ======
    // Électrode supérieure (cathode -)
    ctx.fillStyle = '#FF6B6B';
    ctx.shadowColor = '#FF6B6B';
    ctx.shadowBlur = 8;
    ctx.fillRect(centerX - 40, centerY - radius - 8, 80, 6);
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#FF6B6B';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText('− (Cathode)', centerX, centerY - radius - 10);

    // Électrode inférieure (anode +)
    ctx.fillStyle = '#4ECDC4';
    ctx.shadowColor = '#4ECDC4';
    ctx.shadowBlur = 8;
    ctx.fillRect(centerX - 40, centerY + radius + 2, 80, 6);
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#4ECDC4';
    ctx.textBaseline = 'top';
    ctx.fillText('+ (Anode)', centerX, centerY + radius + 10);

    // ====== Ions ======
    const ions = [
        { x: centerX - 50, y: centerY - 30, type: 'cation', label: 'Na⁺' },
        { x: centerX + 60, y: centerY - 50, type: 'cation', label: 'K⁺' },
        { x: centerX - 30, y: centerY + 40, type: 'anion', label: 'Cl⁻' },
        { x: centerX + 50, y: centerY + 30, type: 'anion', label: 'Br⁻' },
        { x: centerX - 70, y: centerY + 10, type: 'anion', label: 'I⁻' },
        { x: centerX + 70, y: centerY - 10, type: 'cation', label: 'Ag⁺' },
    ];

    for (const ion of ions) {
        const color = ion.type === 'cation' ? '#4ECDC4' : '#FF6B6B';
        const sign = ion.type === 'cation' ? '+' : '−';
        
        // Cercle
        ctx.fillStyle = color + '33';
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(ion.x, ion.y, 18, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();

        // Label
        ctx.fillStyle = color;
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(ion.label, ion.x, ion.y - 2);
        
        // Charge
        ctx.fillStyle = color;
        ctx.font = '10px Arial';
        ctx.textBaseline = 'bottom';
        ctx.fillText(sign, ion.x + 14, ion.y - 6);
    }

    // ====== Flèches de mouvement ======
    // Cations → vers le bas (vers la cathode -)
    ctx.strokeStyle = '#4ECDC4';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    
    // Flèche cations (vers le bas)
    ctx.beginPath();
    ctx.moveTo(centerX - 90, centerY - 60);
    ctx.lineTo(centerX - 90, centerY + 60);
    ctx.stroke();
    ctx.setLineDash([]);
    // Tête de flèche
    ctx.beginPath();
    ctx.moveTo(centerX - 90, centerY + 60);
    ctx.lineTo(centerX - 95, centerY + 50);
    ctx.lineTo(centerX - 85, centerY + 50);
    ctx.fill();

    ctx.fillStyle = '#4ECDC4';
    ctx.font = '9px Arial';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText('Cations →', centerX - 100, centerY);

    // Anions → vers le haut (vers l'anode +)
    ctx.strokeStyle = '#FF6B6B';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    
    // Flèche anions (vers le haut)
    ctx.beginPath();
    ctx.moveTo(centerX + 90, centerY + 60);
    ctx.lineTo(centerX + 90, centerY - 60);
    ctx.stroke();
    ctx.setLineDash([]);
    // Tête de flèche
    ctx.beginPath();
    ctx.moveTo(centerX + 90, centerY - 60);
    ctx.lineTo(centerX + 85, centerY - 50);
    ctx.lineTo(centerX + 95, centerY - 50);
    ctx.fill();

    ctx.fillStyle = '#FF6B6B';
    ctx.textAlign = 'left';
    ctx.fillText('← Anions', centerX + 100, centerY);

    // ====== Légende ======
    CanvasUtils.drawNote(ctx, 'Mouvement des ions sous l\'effet d\'un champ électrique', 10, h - 10, {
        font: '10px Arial',
        color: '#888888'
    });
}

// ============================================================
// Graphique : Évolution de la conductance lors d'un titrage
// ============================================================
function drawTitrageConductimetrique(canvasId) {
    const s = CanvasUtils.setupCanvas(canvasId);
    if (!s) return;
    const { ctx, w, h } = s;

    const padding = { top: 30, bottom: 40, left: 50, right: 20 };
    const graphW = w - padding.left - padding.right;
    const graphH = h - padding.top - padding.bottom;

    const ox = padding.left;
    const oy = padding.top + graphH;

    // ====== Échelles ======
    const xMax = 20;
    const yMax = 5;
    const scaleX = graphW / xMax;
    const scaleY = graphH / yMax;

    // ====== Points ======
    const points = [
        { x: 0, y: 0.5 },
        { x: 5, y: 1.0 },
        { x: 8, y: 1.6 },
        { x: 10, y: 2.0 },
        { x: 12, y: 2.8 },
        { x: 15, y: 3.8 },
        { x: 18, y: 4.5 },
        { x: 20, y: 4.8 }
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
    ctx.font = '11px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('Volume versé (mL)', w / 2, h - 20);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText('G (mS)', 15, h / 2);

    // ====== Grille ======
    ctx.strokeStyle = '#1A1A2E';
    ctx.lineWidth = 0.5;
    for (let i = 2; i <= 18; i += 2) {
        const xPos = ox + i * scaleX;
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
    ctx.font = '9px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    for (let i = 0; i <= 20; i += 5) {
        const xPos = ox + i * scaleX;
        ctx.fillText(i, xPos, oy + 5);
    }
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (let i = 0; i <= 5; i++) {
        const yPos = oy - i * 1 * scaleY;
        if (i > 0) ctx.fillText(i.toFixed(1), ox - 8, yPos);
    }

    // ====== Courbe ======
    // Segment 1
    ctx.strokeStyle = '#4ECDC4';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(ox + points[0].x * scaleX, oy - points[0].y * scaleY);
    for (let i = 1; i <= 4; i++) {
        ctx.lineTo(ox + points[i].x * scaleX, oy - points[i].y * scaleY);
    }
    ctx.stroke();

    // Segment 2
    ctx.strokeStyle = '#FF6B6B';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(ox + points[4].x * scaleX, oy - points[4].y * scaleY);
    for (let i = 5; i < points.length; i++) {
        ctx.lineTo(ox + points[i].x * scaleX, oy - points[i].y * scaleY);
    }
    ctx.stroke();

    // ====== Points ======
    for (let i = 0; i < points.length; i++) {
        const px = ox + points[i].x * scaleX;
        const py = oy - points[i].y * scaleY;
        ctx.fillStyle = i <= 4 ? '#4ECDC4' : '#FF6B6B';
        ctx.beginPath();
        ctx.arc(px, py, 4, 0, 2 * Math.PI);
        ctx.fill();
    }

    // ====== Point d'équivalence ======
    const eqX = ox + 10 * scaleX;
    const eqY = oy - 2 * scaleY;
    
    ctx.strokeStyle = '#F4D03F';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.arc(eqX, eqY, 8, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.strokeStyle = '#F4D03F';
    ctx.lineWidth = 0.5;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(eqX, padding.top);
    ctx.lineTo(eqX, oy);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#F4D03F';
    ctx.font = '9px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText('Point d\'équivalence', eqX, eqY - 12);
    ctx.textBaseline = 'top';
    ctx.fillText('Veq = 10,0 mL', eqX, eqY + 12);

    // ====== Légende ======
    ctx.fillStyle = '#4ECDC4';
    ctx.font = '9px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('— Avant équivalence', ox + 5, padding.top + 5);

    ctx.fillStyle = '#FF6B6B';
    ctx.textBaseline = 'top';
    ctx.fillText('— Après équivalence', ox + 5, padding.top + 20);

    CanvasUtils.drawNote(ctx, 'Titrage conductimétrique - Évolution de la conductance', padding.left, h - 8, {
        font: '9px Arial',
        color: '#888888'
    });
}

// ============================================================
// Graphique : Conductivité en fonction de la concentration
// ============================================================
function drawConductiviteConcentration(canvasId) {
    const s = CanvasUtils.setupCanvas(canvasId);
    if (!s) return;
    const { ctx, w, h } = s;

    const padding = { top: 30, bottom: 40, left: 50, right: 20 };
    const graphW = w - padding.left - padding.right;
    const graphH = h - padding.top - padding.bottom;

    const ox = padding.left;
    const oy = padding.top + graphH;

    const xMax = 5;
    const yMax = 0.6;
    const scaleX = graphW / xMax;
    const scaleY = graphH / yMax;

    const kclPoints = [
        { x: 0, y: 0 },
        { x: 1, y: 0.13 },
        { x: 2, y: 0.26 },
        { x: 3, y: 0.39 },
        { x: 4, y: 0.52 },
        { x: 5, y: 0.65 }
    ];

    const naclPoints = [
        { x: 0, y: 0 },
        { x: 1, y: 0.10 },
        { x: 2, y: 0.20 },
        { x: 3, y: 0.30 },
        { x: 4, y: 0.40 },
        { x: 5, y: 0.50 }
    ];

    ctx.fillStyle = '#0D1117';
    ctx.fillRect(0, 0, w, h);

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

    ctx.fillStyle = '#4ECDC4';
    ctx.font = '11px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('C (mol/m³)', w / 2, h - 20);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText('σ (S/m)', 15, h / 2);

    ctx.strokeStyle = '#1A1A2E';
    ctx.lineWidth = 0.5;
    for (let i = 1; i <= 5; i++) {
        const xPos = ox + i * scaleX;
        ctx.beginPath();
        ctx.moveTo(xPos, padding.top);
        ctx.lineTo(xPos, oy);
        ctx.stroke();
    }
    for (let i = 1; i <= 5; i++) {
        const yPos = oy - i * 0.1 * scaleY;
        ctx.beginPath();
        ctx.moveTo(ox, yPos);
        ctx.lineTo(w - padding.right, yPos);
        ctx.stroke();
    }

    ctx.fillStyle = '#888888';
    ctx.font = '9px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    for (let i = 0; i <= 5; i++) {
        const xPos = ox + i * scaleX;
        ctx.fillText(i, xPos, oy + 5);
    }
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (let i = 0; i <= 5; i++) {
        const yPos = oy - i * 0.1 * scaleY;
        if (i > 0) ctx.fillText((i * 0.1).toFixed(1), ox - 8, yPos);
    }

    function drawCurve(points, color, label) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(ox + points[0].x * scaleX, oy - points[0].y * scaleY);
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(ox + points[i].x * scaleX, oy - points[i].y * scaleY);
        }
        ctx.stroke();
        const last = points[points.length - 1];
        ctx.fillStyle = color;
        ctx.font = '9px Arial';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'bottom';
        ctx.fillText(label, ox + last.x * scaleX + 5, oy - last.y * scaleY - 2);
    }

    drawCurve(kclPoints, '#4ECDC4', 'KCl');
    drawCurve(naclPoints, '#FF6B6B', 'NaCl');

    CanvasUtils.drawNote(ctx, 'Conductivité en fonction de la concentration', padding.left, h - 8, {
        font: '9px Arial',
        color: '#888888'
    });
}

// ============================================================
// Initialisation
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        if (document.getElementById('celluleConductimetrie')) {
            drawCelluleConductimetrie('celluleConductimetrie');
        }
        if (document.getElementById('titrageConductimetrique')) {
            drawTitrageConductimetrique('titrageConductimetrique');
        }
        if (document.getElementById('conductiviteConcentration')) {
            drawConductiviteConcentration('conductiviteConcentration');
        }
        if (document.getElementById('mouvementIons')) {
            drawMouvementIons('mouvementIons');
        }
    }, 300);
});