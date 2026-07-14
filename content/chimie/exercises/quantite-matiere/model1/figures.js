// ============================================================
// figures.js - رسومات درس "Grandeurs physiques liées à la quantité de matière"
// Exercice 2 - Ampoule à décanter
// ============================================================

function drawGraphDecanter() {
    var canvas = document.getElementById('graphDecanter');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var w = canvas.width, h = canvas.height;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#0D1117';
    ctx.fillRect(0, 0, w, h);

    var cx = w/2;
    var topY = 20;
    var bottomY = h - 20;

    // Ampoule à décanter (forme)
    ctx.strokeStyle = '#4ECDC4';
    ctx.lineWidth = 2;

    // Partie supérieure (cylindre)
    ctx.beginPath();
    ctx.moveTo(cx - 40, topY);
    ctx.lineTo(cx + 40, topY);
    ctx.stroke();

    // Côtés
    ctx.beginPath();
    ctx.moveTo(cx - 40, topY);
    ctx.lineTo(cx - 50, topY + 30);
    ctx.lineTo(cx - 40, bottomY);
    ctx.stroke();

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

    // Robinet
    ctx.fillStyle = '#FF6B6B';
    ctx.fillRect(cx - 4, bottomY, 8, 10);

    // Phase supérieure : Heptane (moins dense)
    var phase1Y = topY + 5;
    var phase1H = 80;
    ctx.fillStyle = 'rgba(78, 205, 196, 0.3)';
    ctx.fillRect(cx - 38, phase1Y, 76, phase1H);
    ctx.strokeStyle = '#4ECDC4';
    ctx.lineWidth = 1;
    ctx.strokeRect(cx - 38, phase1Y, 76, phase1H);

    // Phase inférieure : Éthanol (plus dense)
    var phase2Y = phase1Y + phase1H;
    var phase2H = 120;
    ctx.fillStyle = 'rgba(244, 208, 63, 0.25)';
    ctx.fillRect(cx - 38, phase2Y, 76, phase2H);
    ctx.strokeStyle = '#F4D03F';
    ctx.lineWidth = 1;
    ctx.strokeRect(cx - 38, phase2Y, 76, phase2H);

    // Labels
    ctx.fillStyle = '#4ECDC4';
    ctx.font = '11px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Heptane', cx, phase1Y + phase1H/2 + 4);

    ctx.fillStyle = '#F4D03F';
    ctx.fillText('Éthanol', cx, phase2Y + phase2H/2 + 4);

    // Ligne de séparation
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(cx - 38, phase1Y + phase1H);
    ctx.lineTo(cx + 38, phase1Y + phase1H);
    ctx.stroke();
    ctx.setLineDash([]);

    // Flèches pour indiquer les densités
    ctx.fillStyle = '#4ECDC4';
    ctx.font = '9px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('d = 0,68', cx + 45, phase1Y + phase1H/2 + 3);

    ctx.fillStyle = '#F4D03F';
    ctx.fillText('d = 0,81', cx + 45, phase2Y + phase2H/2 + 3);

    // Titre de la figure
    ctx.fillStyle = '#888888';
    ctx.font = '9px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Ampoule à décanter - Mélange non miscible', cx, h - 5);
}

// ============================================================
// Initialisation au chargement de la page
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        if (document.getElementById('graphDecanter')) {
            drawGraphDecanter();
        }
    }, 400);
});