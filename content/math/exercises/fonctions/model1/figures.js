// ============================================================
// figures.js - رسومات موضوع "Fonctions" - Exercice 1
// Parité et Périodicité de f(x) = cos(πx)
// ============================================================

// ====== Exercice 1 - Graphique Parité ======
function drawGraphParite() {
    const s = CanvasUtils.setupCanvas('graphParite');
    if (!s) return;
    const { ctx, w, h } = s;
    
    // Centre du repère
    const ox = w/2, oy = h - 20;
    const scaleX = 30;  // échelle en x
    const scaleY = 40;  // échelle en y
    
    // Dessiner les axes
    CanvasUtils.drawAxes(ctx, ox, oy, w, h);
    CanvasUtils.drawArrows(ctx, ox, oy, w);
    
    // Dessiner la courbe cos(πx)
    ctx.strokeStyle = '#4ECDC4';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    for (let px = -140; px <= 140; px += 0.5) {
        const x = px / scaleX;
        const y = Math.cos(Math.PI * x);
        const screenX = ox + px;
        const screenY = oy - y * scaleY;
        
        if (screenY < 0 || screenY > h) continue;
        if (px === -140) ctx.moveTo(screenX, screenY);
        else ctx.lineTo(screenX, screenY);
    }
    ctx.stroke();
    
    // Texte d'information
    CanvasUtils.drawNote(ctx, 'f(x) = cos(πx) est paire', 190, 20);
}

// ====== Exercice 1 - Graphique Périodicité ======
function drawGraphPeriodique() {
    const s = CanvasUtils.setupCanvas('graphPeriodique');
    if (!s) return;
    const { ctx, w, h } = s;
    
    // Position du repère
    const ox = 30, oy = h - 20;
    const scaleX = 40;
    const scaleY = 35;
    
    // Dessiner les axes
    CanvasUtils.drawAxes(ctx, ox, oy, w, h);
    CanvasUtils.drawArrows(ctx, ox, oy, w);
    
    // Dessiner la courbe cos(πx)
    ctx.strokeStyle = '#4ECDC4';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    for (let px = 0; px <= 300; px += 0.5) {
        const x = px / scaleX;
        const y = Math.cos(Math.PI * x);
        const screenX = ox + px;
        const screenY = oy - y * scaleY;
        
        if (screenY < 0 || screenY > h) continue;
        if (px === 0) ctx.moveTo(screenX, screenY);
        else ctx.lineTo(screenX, screenY);
    }
    ctx.stroke();
    
    // Lignes verticales pour T=2 et T=4
    ctx.strokeStyle = '#FF6B6B';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    
    const x1 = ox + 2 * scaleX;
    const x2 = ox + 4 * scaleX;
    
    // Ligne à x=2
    ctx.beginPath();
    ctx.moveTo(x1, 0);
    ctx.lineTo(x1, h);
    ctx.stroke();
    
    // Ligne à x=4
    ctx.beginPath();
    ctx.moveTo(x2, 0);
    ctx.lineTo(x2, h);
    ctx.stroke();
    
    ctx.setLineDash([]);
    
    // Labels T=2
    ctx.fillStyle = '#FF6B6B';
    ctx.font = '10px Arial';
    ctx.fillText('T=2', x1 + 5, 15);
    ctx.fillText('T=2', x2 + 5, 15);
    
    // Texte d'information
    CanvasUtils.drawNote(ctx, 'Période T = 2', 250, 20);
}

// ============================================================
// Initialisation au chargement de la page
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        if (document.getElementById('graphParite')) {
            drawGraphParite();
        }
        if (document.getElementById('graphPeriodique')) {
            drawGraphPeriodique();
        }
    }, 300);
});