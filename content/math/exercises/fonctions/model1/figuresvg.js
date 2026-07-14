// ============================================================
// figuresvg.js - رسومات موضوع "Fonctions" - Exercice 1
// Parité et Périodicité de f(x) = cos(πx)
// ============================================================

// ====== Fonction utilitaire bbox ======
function bbox(points, pad) {
    pad = pad ?? 1;
    const xs = points.map(p => p.x), ys = points.map(p => p.y);
    return {
        xMin: Math.min(...xs) - pad,
        xMax: Math.max(...xs) + pad,
        yMin: Math.min(...ys) - pad,
        yMax: Math.max(...ys) + pad
    };
}

// ====== Génération des points de la courbe cos(πx) ======
function generateCosPoints(xMin, xMax, step = 0.05) {
    const points = [];
    for (let x = xMin; x <= xMax; x += step) {
        points.push({ x: x, y: Math.cos(Math.PI * x) });
    }
    return points;
}

// ====== Dessiner une courbe à partir d'un tableau de points ======
function drawCurve(s, points, opts) {
    opts = opts || {};
    const color = opts.color || '#4ECDC4';
    const lineWidth = opts.lineWidth || 2;
    
    let pathData = '';
    for (let i = 0; i < points.length; i++) {
        const p = points[i];
        const x = p.x;
        const y = -p.y;
        if (i === 0) pathData += `M ${x} ${y}`;
        else pathData += ` L ${x} ${y}`;
    }
    
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathData);
    path.setAttribute('stroke', color);
    path.setAttribute('stroke-width', lineWidth);
    path.setAttribute('fill', 'none');
    if (opts.dashed) {
        const [a, b] = opts.dashPattern || [6, 4];
        path.setAttribute('stroke-dasharray', `${a * 0.02} ${b * 0.02}`);
    }
    s.svg.appendChild(path);
}

// ====== Graphique 1 : Parité ======
function drawGraphParite() {
    const points = generateCosPoints(-4.5, 4.5, 0.05);
    const box = bbox(points, 0.8);
    box.yMin = -1.5;
    box.yMax = 1.5;
    
    const s = SvgUtils.setupSVG('graphParite', box);
    if (!s) return;

    SvgUtils.drawAxesWithArrows(s);
    SvgUtils.drawGrid(s);
    
    drawCurve(s, points, { color: '#4ECDC4', lineWidth: 2.5 });
    
    SvgUtils.drawNote(s, 'f(x) = cos(πx) est paire', box.xMin + 0.5, box.yMax - 0.3, { 
        color: '#4ECDC4', 
        fontSize: s.fontSize * 1.1 
    });
    
    // Points symétriques pour illustration
    const x1 = 1.5, x2 = -1.5;
    const y1 = Math.cos(Math.PI * x1);
    const y2 = Math.cos(Math.PI * x2);
    
    SvgUtils.drawPoint(s, { x: x1, y: y1, color: '#FF6B6B', radius: s.fontSize * 0.2 });
    SvgUtils.drawPoint(s, { x: x2, y: y2, color: '#FF6B6B', radius: s.fontSize * 0.2 });
    
    SvgUtils.drawLine(s, x1, y1, x2, y2, {
        color: '#FF6B6B',
        dashed: true,
        dashPattern: [3, 3],
        lineWidth: 1
    });
    
    SvgUtils.drawNote(s, 'f(-x) = f(x)', box.xMax - 3.5, box.yMax - 0.3, { 
        color: '#FF6B6B', 
        fontSize: s.fontSize * 0.85 
    });
}

// ====== Graphique 2 : Périodicité ======
function drawGraphPeriodique() {
    const points = generateCosPoints(0, 7.5, 0.05);
    const box = {
        xMin: -0.5,
        xMax: 7.5,
        yMin: -1.5,
        yMax: 1.5
    };
    
    const s = SvgUtils.setupSVG('graphPeriodique', box);
    if (!s) return;

    SvgUtils.drawAxesWithArrows(s);
    SvgUtils.drawGrid(s);
    
    drawCurve(s, points, { color: '#4ECDC4', lineWidth: 2.5 });
    
    // Lignes verticales T=2 et T=4
    const lineColor = '#FF6B6B';
    const dashPattern = [4, 4];
    
    const x1 = 2;
    const x2 = 4;
    
    SvgUtils.drawLine(s, x1, box.yMin, x1, box.yMax, {
        color: lineColor,
        dashed: true,
        dashPattern: dashPattern,
        lineWidth: 1.5
    });
    
    SvgUtils.drawLine(s, x2, box.yMin, x2, box.yMax, {
        color: lineColor,
        dashed: true,
        dashPattern: dashPattern,
        lineWidth: 1.5
    });
    
    // Labels T=2
    SvgUtils.drawNote(s, 'T=2', x1 + 0.15, box.yMax - 0.2, { 
        color: '#FF6B6B', 
        fontSize: s.fontSize * 0.8 
    });
    
    SvgUtils.drawNote(s, 'T=2', x2 + 0.15, box.yMax - 0.2, { 
        color: '#FF6B6B', 
        fontSize: s.fontSize * 0.8 
    });
    
    // Flèche pour montrer la période entre x=2 et x=4
    const arrowY = box.yMin + 0.3;
    SvgUtils.drawLine(s, x1, arrowY, x2, arrowY, {
        color: '#F4D03F',
        lineWidth: 2
    });
    
    // Pointes de flèche
    const arrowColor = '#F4D03F';
    const ah = s.fontSize * 0.3;
    
    const arrow1 = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    arrow1.setAttribute('points', `${x1 + ah * 0.5},${-arrowY + ah * 0.4} ${x1},${-arrowY} ${x1 + ah * 0.5},${-arrowY - ah * 0.4}`);
    arrow1.setAttribute('fill', arrowColor);
    s.svg.appendChild(arrow1);
    
    const arrow2 = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    arrow2.setAttribute('points', `${x2 - ah * 0.5},${-arrowY + ah * 0.4} ${x2},${-arrowY} ${x2 - ah * 0.5},${-arrowY - ah * 0.4}`);
    arrow2.setAttribute('fill', arrowColor);
    s.svg.appendChild(arrow2);
    
    SvgUtils.drawNote(s, 'Période T = 2', box.xMax - 3, box.yMax - 0.3, { 
        color: '#F4D03F', 
        fontSize: s.fontSize * 0.9 
    });
    
    SvgUtils.drawNote(s, 'f(x+T) = f(x)', box.xMax - 3, box.yMax - 0.7, { 
        color: '#888888', 
        fontSize: s.fontSize * 0.8 
    });
}

// ====== Initialisation au chargement de la page ======
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        if (document.getElementById('graphParite')) {
            drawGraphParite();
        }
        if (document.getElementById('graphPeriodique')) {
            drawGraphPeriodique();
        }
    }, 500);
});