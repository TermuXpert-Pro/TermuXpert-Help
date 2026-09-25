/* ============================================================
   figuresvt_serie1.js
   Figures SVG - Série 1 : Travail et énergie cinétique (Physique, 1BAC SE)
   Fichier 100% autonome (aucune dépendance externe / aucune librairie
   partagée type svg-utils.js). Toutes les fonctions utilitaires sont
   dupliquées volontairement à l'intérieur de ce fichier.

   Figures (selon les id dans serie1.html) :
     #graph3 → Exercice 3 : mobile (100 kg) propulsé sur AB=10 m puis
                plan incliné à 15°, frottement f=10 N
     #graph4 → Exercice 4 : obus (50 kg) lancé par un canon,
                v1=700 m/s au départ, v2=400 m/s à l'arrivée (même niveau)
     #graph5 → Exercice 5 : pendule simple (m=200 g, l=20 cm),
                écarté de θ0=20° puis lâché sans vitesse
     #graph6 → Exercice 6 : freinage d'une voiture, action de la route
                sur les pneus inclinée de φ=26° par rapport à la normale

   Chaque figure est reconstruite depuis les données de l'énoncé de son
   propre exercice ; une modification ici n'affecte aucune autre page.
   ============================================================ */
(function () {
    'use strict';

    var SVG_NS = 'http://www.w3.org/2000/svg';

    var COLORS = {
        bg: '#0D1117',
        ground: '#2A2A3E',
        body: '#4ECDC4',
        force: '#FF6B6B',
        friction: '#FF6B6B',
        speed: '#A8FF78',
        angle: '#BB8FCE',
        gold: '#F4D03F',
        text: '#FFFFFF',
        muted: '#888888'
    };

    function svgEl(tag, attrs) {
        var e = document.createElementNS(SVG_NS, tag);
        if (attrs) {
            for (var k in attrs) {
                if (Object.prototype.hasOwnProperty.call(attrs, k)) {
                    e.setAttribute(k, attrs[k]);
                }
            }
        }
        return e;
    }

    function text(x, y, str, attrs) {
        var t = svgEl('text', Object.assign({ x: x, y: y }, attrs || {}));
        t.textContent = str;
        return t;
    }

    function clearSvg(svg) {
        while (svg.firstChild) svg.removeChild(svg.firstChild);
    }

    function setupResponsive(svg, w, h, maxWidth) {
        svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        svg.style.width = '100%';
        svg.style.height = 'auto';
        svg.style.maxWidth = (maxWidth || w) + 'px';
        svg.style.display = 'block';
        svg.style.margin = '0 auto';
        svg.style.background = COLORS.bg;
        svg.style.borderRadius = '4px';
    }

    /* Flèche (ligne + tête triangulaire) entre deux points */
    function arrow(svg, x1, y1, x2, y2, color, widthPx) {
        widthPx = widthPx || 2;
        svg.appendChild(svgEl('line', { x1: x1, y1: y1, x2: x2, y2: y2, stroke: color, 'stroke-width': widthPx }));
        var ang = Math.atan2(y2 - y1, x2 - x1);
        var head = 7;
        var p1x = x2 - head * Math.cos(ang - 0.4), p1y = y2 - head * Math.sin(ang - 0.4);
        var p2x = x2 - head * Math.cos(ang + 0.4), p2y = y2 - head * Math.sin(ang + 0.4);
        svg.appendChild(svgEl('polygon', { points: x2 + ',' + y2 + ' ' + p1x + ',' + p1y + ' ' + p2x + ',' + p2y, fill: color }));
    }

    /* Petit arc d'angle entre deux directions (en degrés, mesurées depuis
       l'axe des x positif, sens horaire car y vers le bas en SVG) */
    function angleArc(svg, cx, cy, r, startDeg, endDeg, color, widthPx) {
        var s = startDeg * Math.PI / 180, e = endDeg * Math.PI / 180;
        var x1 = cx + r * Math.cos(s), y1 = cy + r * Math.sin(s);
        var x2 = cx + r * Math.cos(e), y2 = cy + r * Math.sin(e);
        var large = Math.abs(endDeg - startDeg) > 180 ? 1 : 0;
        svg.appendChild(svgEl('path', {
            d: 'M ' + x1.toFixed(1) + ' ' + y1.toFixed(1) + ' A ' + r + ' ' + r + ' 0 ' + large + ' 1 ' + x2.toFixed(1) + ' ' + y2.toFixed(1),
            fill: 'none', stroke: color, 'stroke-width': widthPx || 1.3
        }));
    }

    /* Petits traits de hachure le long d'un segment (représente le sol) */
    function hatchGround(svg, x1, y1, x2, y2, color, count, len) {
        count = count || 8; len = len || 8;
        var dx = x2 - x1, dy = y2 - y1;
        var norm = Math.sqrt(dx * dx + dy * dy);
        var ux = dx / norm, uy = dy / norm;
        var px = -uy, py = ux; /* perpendiculaire */
        for (var i = 0; i <= count; i++) {
            var t0 = i / count;
            var bx = x1 + dx * t0, by = y1 + dy * t0;
            svg.appendChild(svgEl('line', {
                x1: bx, y1: by,
                x2: bx - ux * len * 0.6 + px * len, y2: by - uy * len * 0.6 + py * len,
                stroke: color, 'stroke-width': 1
            }));
        }
    }

    /* ------------------------------------------------------------
       Exercice 3 : mobile 100 kg propulsé sur AB=10 m (v_B=18 km/h=5 m/s)
       puis plan incliné α=15°, frottement f=10 N, hauteur atteinte h.
       ------------------------------------------------------------ */
    function drawGraph3() {
        var svg = document.getElementById('graph3');
        if (!svg) return;
        clearSvg(svg);

        var W = 440, H = 240;
        setupResponsive(svg, W, H, 440);
        svg.appendChild(svgEl('rect', { x: 0, y: 0, width: W, height: H, fill: COLORS.bg }));

        var groundY = 190;
        var Ax = 45, Bx = 225;
        var alphaDeg = 15;
        var alpha = alphaDeg * Math.PI / 180;
        var inclineLen = 180;
        var topX = Bx + inclineLen * Math.cos(alpha);
        var topY = groundY - inclineLen * Math.sin(alpha);

        /* Plan horizontal + hachures (sol) */
        svg.appendChild(svgEl('line', { x1: 25, y1: groundY, x2: Bx, y2: groundY, stroke: COLORS.ground, 'stroke-width': 2.5 }));
        hatchGround(svg, 25, groundY, Bx, groundY, COLORS.ground, 9, 7);

        /* Plan incliné + hachures */
        svg.appendChild(svgEl('line', { x1: Bx, y1: groundY, x2: topX, y2: topY, stroke: COLORS.ground, 'stroke-width': 2.5 }));
        hatchGround(svg, Bx, groundY, topX, topY, COLORS.ground, 9, 7);

        /* Angle alpha en B */
        angleArc(svg, Bx, groundY, 34, -alphaDeg, 0, COLORS.gold, 1.4);
        svg.appendChild(text(Bx + 40, groundY - 8, '\u03B1 = 15\u00B0', { fill: COLORS.gold, 'font-size': '11', 'font-family': 'Arial', 'font-weight': '700' }));

        /* Mobile en A (départ, au repos) */
        var ay = groundY - 12;
        svg.appendChild(svgEl('rect', { x: Ax - 14, y: ay - 10, width: 28, height: 20, rx: 3, fill: COLORS.body }));
        svg.appendChild(text(Ax, ay + 5, 'S', { fill: '#08282a', 'font-size': '11', 'font-family': 'Arial', 'font-weight': '700', 'text-anchor': 'middle' }));

        /* Flèche de la force de propulsion F */
        arrow(svg, Ax + 16, ay, Ax + 62, ay, COLORS.force, 2.5);
        svg.appendChild(text(Ax + 40, ay - 12, 'F', { fill: COLORS.force, 'font-size': '13', 'font-family': 'Arial', 'font-weight': '700', 'text-anchor': 'middle' }));

        /* Cotation AB */
        var dimY = groundY + 22;
        svg.appendChild(svgEl('line', { x1: Ax, y1: groundY + 6, x2: Ax, y2: dimY, stroke: COLORS.muted, 'stroke-width': 1 }));
        svg.appendChild(svgEl('line', { x1: Bx, y1: groundY + 6, x2: Bx, y2: dimY, stroke: COLORS.muted, 'stroke-width': 1 }));
        arrow(svg, Ax, dimY, Bx - 4, dimY, COLORS.muted, 1);
        arrow(svg, Bx, dimY, Ax + 4, dimY, COLORS.muted, 1);
        svg.appendChild(text((Ax + Bx) / 2, dimY + 14, 'AB = 10 m', { fill: COLORS.muted, 'font-size': '10.5', 'font-family': 'Arial', 'text-anchor': 'middle' }));

        /* Mobile à mi-hauteur sur le plan incliné (montée) */
        var t2 = 0.55;
        var mx = Bx + (topX - Bx) * t2, my = groundY + (topY - groundY) * t2;
        var perpx = Math.sin(alpha), perpy = Math.cos(alpha);
        svg.appendChild(svgEl('g', { transform: 'translate(' + mx.toFixed(1) + ',' + (my - 11).toFixed(1) + ') rotate(' + (-alphaDeg) + ')' }))
            .appendChild(svgEl('rect', { x: -14, y: -10, width: 28, height: 20, rx: 3, fill: COLORS.body }));

        /* Frottement f (le long du plan, vers le bas = opposé au mouvement montant) */
        var fBase = { x: mx - 6 * perpx, y: my - 22 - 6 * perpy };
        var fTip = { x: fBase.x - 42 * Math.cos(alpha), y: fBase.y + 42 * Math.sin(alpha) };
        arrow(svg, fBase.x, fBase.y, fTip.x, fTip.y, COLORS.friction, 2.2);
        svg.appendChild(text(fTip.x - 6, fTip.y - 8, 'f', { fill: COLORS.friction, 'font-size': '12', 'font-family': 'Arial', 'font-weight': '700' }));

        /* Vitesse en B */
        svg.appendChild(text(Bx - 4, groundY - 18, 'v\u1D66 = 5 m/s', { fill: COLORS.speed, 'font-size': '10', 'font-family': 'Arial', 'text-anchor': 'end' }));

        /* Hauteur h atteinte (pointillés) */
        svg.appendChild(svgEl('line', { x1: topX, y1: topY, x2: topX, y2: groundY, stroke: COLORS.muted, 'stroke-width': 1, 'stroke-dasharray': '3,3' }));
        svg.appendChild(svgEl('line', { x1: Bx, y1: groundY, x2: topX, y2: groundY, stroke: COLORS.muted, 'stroke-width': 1, 'stroke-dasharray': '3,3' }));
        svg.appendChild(text(topX + 8, (topY + groundY) / 2, 'h ?', { fill: COLORS.muted, 'font-size': '11', 'font-family': 'Arial', 'font-weight': '700' }));

        /* Légende */
        svg.appendChild(text(25, 20, 'm = 100 kg', { fill: COLORS.muted, 'font-size': '10', 'font-family': 'Arial' }));
        svg.appendChild(text(25, 34, 'f = 10 N (sur le plan incliné)', { fill: COLORS.muted, 'font-size': '10', 'font-family': 'Arial' }));
    }

    /* ------------------------------------------------------------
       Exercice 4 : obus 50 kg, canon → v1=700 m/s au départ,
       v2=400 m/s à l'arrivée, même altitude de départ et d'arrivée.
       ------------------------------------------------------------ */
    function drawGraph4() {
        var svg = document.getElementById('graph4');
        if (!svg) return;
        clearSvg(svg);

        var W = 440, H = 210;
        setupResponsive(svg, W, H, 440);
        svg.appendChild(svgEl('rect', { x: 0, y: 0, width: W, height: H, fill: COLORS.bg }));

        var groundY = 165;
        svg.appendChild(svgEl('line', { x1: 20, y1: groundY, x2: W - 20, y2: groundY, stroke: COLORS.ground, 'stroke-width': 2.5 }));
        hatchGround(svg, 20, groundY, W - 20, groundY, COLORS.ground, 20, 6);

        /* Canon (base + tube incliné) */
        var canonX = 55, canonY = groundY;
        svg.appendChild(svgEl('rect', { x: canonX - 12, y: canonY - 10, width: 24, height: 10, fill: COLORS.body }));
        var tubeAngle = -50 * Math.PI / 180;
        var tubeLen = 34;
        svg.appendChild(svgEl('line', {
            x1: canonX, y1: canonY - 10,
            x2: canonX + tubeLen * Math.cos(tubeAngle), y2: canonY - 10 + tubeLen * Math.sin(tubeAngle),
            stroke: COLORS.body, 'stroke-width': 6, 'stroke-linecap': 'round'
        }));

        /* Trajectoire parabolique en pointillés : départ (A) → arrivée (B), même niveau */
        var Ax = 75, Bx = 365, apexDrop = 95;
        var d = '';
        var steps = 60;
        for (var i = 0; i <= steps; i++) {
            var tt = i / steps;
            var x = Ax + (Bx - Ax) * tt;
            var y = groundY - apexDrop * 4 * tt * (1 - tt);
            d += (i === 0 ? 'M' : 'L') + x.toFixed(1) + ',' + y.toFixed(1) + ' ';
        }
        svg.appendChild(svgEl('path', { d: d, fill: 'none', stroke: COLORS.gold, 'stroke-width': 2.3, 'stroke-dasharray': '6,4' }));

        /* Points de départ / arrivée (même altitude) */
        svg.appendChild(svgEl('circle', { cx: Ax, cy: groundY, r: 6, fill: COLORS.speed }));
        svg.appendChild(svgEl('circle', { cx: Bx, cy: groundY, r: 6, fill: COLORS.speed }));
        svg.appendChild(text(Ax, groundY + 22, 'A', { fill: COLORS.text, 'font-size': '11', 'font-family': 'Arial', 'font-weight': '700', 'text-anchor': 'middle' }));
        svg.appendChild(text(Bx, groundY + 22, 'B', { fill: COLORS.text, 'font-size': '11', 'font-family': 'Arial', 'font-weight': '700', 'text-anchor': 'middle' }));
        svg.appendChild(text(Ax, groundY - 14, 'v\u2081 = 700 m/s', { fill: COLORS.text, 'font-size': '10', 'font-family': 'Arial', 'text-anchor': 'middle' }));
        svg.appendChild(text(Bx, groundY - 14, 'v\u2082 = 400 m/s', { fill: COLORS.text, 'font-size': '10', 'font-family': 'Arial', 'text-anchor': 'middle' }));

        /* Repère de même altitude */
        svg.appendChild(svgEl('line', { x1: Ax, y1: groundY, x2: Bx, y2: groundY, stroke: COLORS.muted, 'stroke-width': 1, 'stroke-dasharray': '2,4' }));
        svg.appendChild(text((Ax + Bx) / 2, groundY + 38, 'm\u00EAme altitude (z\u1D62 = z_f)', { fill: COLORS.muted, 'font-size': '9.5', 'font-family': 'Arial', 'text-anchor': 'middle' }));

        /* Légende */
        svg.appendChild(text(25, 20, 'm = 50 kg', { fill: COLORS.muted, 'font-size': '10', 'font-family': 'Arial' }));
    }

    /* ------------------------------------------------------------
       Exercice 5 : pendule simple, m=200 g, l=20 cm,
       écarté de θ0=20° par rapport à la verticale, lâché sans vitesse.
       ------------------------------------------------------------ */
    function drawGraph5() {
        var svg = document.getElementById('graph5');
        if (!svg) return;
        clearSvg(svg);

        var W = 340, H = 260;
        setupResponsive(svg, W, H, 340);
        svg.appendChild(svgEl('rect', { x: 0, y: 0, width: W, height: H, fill: COLORS.bg }));

        var Ox = 175, Oy = 30;
        var l = 155;
        var theta0Deg = 20;
        var theta0 = theta0Deg * Math.PI / 180;

        /* Verticale de référence (pointillée) */
        svg.appendChild(svgEl('line', { x1: Ox, y1: Oy, x2: Ox, y2: Oy + l + 24, stroke: COLORS.ground, 'stroke-width': 1, 'stroke-dasharray': '4,4' }));

        /* Position d'équilibre E (bas, verticale) */
        var Ex = Ox, Ey = Oy + l;
        /* Position initiale G (écartée de θ0) */
        var Gx = Ox + l * Math.sin(theta0), Gy = Oy + l * Math.cos(theta0);

        /* Fil en position d'équilibre (repère, pointillé gris) */
        svg.appendChild(svgEl('line', { x1: Ox, y1: Oy, x2: Ex, y2: Ey, stroke: COLORS.muted, 'stroke-width': 1.3, 'stroke-dasharray': '3,3' }));
        /* Fil en position initiale (plein, teal) */
        svg.appendChild(svgEl('line', { x1: Ox, y1: Oy, x2: Gx, y2: Gy, stroke: COLORS.body, 'stroke-width': 2 }));

        /* Angle θ0 au pivot */
        angleArc(svg, Ox, Oy, 30, 90, 90 + theta0Deg, COLORS.gold, 1.4);
        svg.appendChild(text(Ox + 24, Oy + 42, '\u03B8\u2080 = 20\u00B0', { fill: COLORS.gold, 'font-size': '11', 'font-family': 'Arial', 'font-weight': '700' }));

        /* Pivot O */
        svg.appendChild(svgEl('circle', { cx: Ox, cy: Oy, r: 4.5, fill: COLORS.angle }));
        svg.appendChild(text(Ox + 9, Oy + 4, 'O', { fill: COLORS.angle, 'font-size': '11', 'font-family': 'Arial', 'font-weight': '700' }));

        /* Bille en position initiale G (dorée) */
        svg.appendChild(svgEl('circle', { cx: Gx, cy: Gy, r: 10, fill: COLORS.gold }));
        svg.appendChild(text(Gx + 15, Gy + 4, 'G', { fill: COLORS.text, 'font-size': '12', 'font-family': 'Arial', 'font-weight': '700' }));
        svg.appendChild(text(Gx + 15, Gy + 18, 'v\u2080 = 0', { fill: COLORS.muted, 'font-size': '9.5', 'font-family': 'Arial' }));

        /* Bille en position d'équilibre E (verte) */
        svg.appendChild(svgEl('circle', { cx: Ex, cy: Ey, r: 8.5, fill: COLORS.speed }));
        svg.appendChild(text(Ex - 15, Ey + 4, 'E', { fill: COLORS.text, 'font-size': '12', 'font-family': 'Arial', 'font-weight': '700', 'text-anchor': 'end' }));

        /* Sens du mouvement (arc fléché de G vers E) */
        var midAngleDeg = 90 + theta0Deg / 2;
        var midRad = midAngleDeg * Math.PI / 180;
        var arcR = l - 26;
        var mxA = Ox + arcR * Math.cos(midRad), myA = Oy + arcR * Math.sin(midRad);
        angleArc(svg, Ox, Oy, arcR, 90, 90 + theta0Deg - 3, COLORS.speed, 1.6);
        arrow(svg, mxA + 4, myA - 2, mxA - 3, myA + 6, COLORS.speed, 1.6);

        /* Légende */
        svg.appendChild(text(15, 18, 'm = 200 g', { fill: COLORS.muted, 'font-size': '10', 'font-family': 'Arial' }));
        svg.appendChild(text(15, 32, 'l = 20 cm', { fill: COLORS.muted, 'font-size': '10', 'font-family': 'Arial' }));
        svg.appendChild(text(15, 46, 'Fil inextensible, masse n\u00E9gligeable', { fill: COLORS.muted, 'font-size': '9.5', 'font-family': 'Arial' }));
    }

    /* ------------------------------------------------------------
       Exercice 6 : voiture (v=90 km/h) qui freine ; l'action de la
       route sur les pneus fait un angle φ=26° avec la normale au sol.
       ------------------------------------------------------------ */
    function drawGraph6() {
        var svg = document.getElementById('graph6');
        if (!svg) return;
        clearSvg(svg);

        var W = 420, H = 230;
        setupResponsive(svg, W, H, 420);
        svg.appendChild(svgEl('rect', { x: 0, y: 0, width: W, height: H, fill: COLORS.bg }));

        var groundY = 175;
        svg.appendChild(svgEl('line', { x1: 20, y1: groundY, x2: W - 20, y2: groundY, stroke: COLORS.ground, 'stroke-width': 2.5 }));
        hatchGround(svg, 20, groundY, W - 20, groundY, COLORS.ground, 18, 6);

        var cx = 190, cy = groundY - 22;

        /* Carrosserie de la voiture */
        svg.appendChild(svgEl('rect', { x: cx - 34, y: cy - 16, width: 68, height: 18, rx: 4, fill: COLORS.body }));
        svg.appendChild(svgEl('path', { d: 'M ' + (cx - 16) + ' ' + (cy - 16) + ' L ' + (cx - 8) + ' ' + (cy - 30) + ' L ' + (cx + 14) + ' ' + (cy - 30) + ' L ' + (cx + 20) + ' ' + (cy - 16) + ' Z', fill: COLORS.body }));

        /* Roues */
        var wheelY = cy + 4;
        svg.appendChild(svgEl('circle', { cx: cx - 20, cy: wheelY, r: 9, fill: '#1A1A2E', stroke: COLORS.ground, 'stroke-width': 1.5 }));
        var contactX = cx + 20, contactY = wheelY;
        svg.appendChild(svgEl('circle', { cx: contactX, cy: contactY, r: 9, fill: '#1A1A2E', stroke: COLORS.ground, 'stroke-width': 1.5 }));

        /* Vitesse v = 90 km/h (avant la voiture, sens du mouvement) */
        arrow(svg, cx + 40, cy - 24, cx + 84, cy - 24, COLORS.speed, 2.3);
        svg.appendChild(text(cx + 62, cy - 32, 'v = 90 km/h', { fill: COLORS.speed, 'font-size': '10.5', 'font-family': 'Arial', 'font-weight': '700', 'text-anchor': 'middle' }));

        /* Normale au sol au point de contact (verticale, pointillée) */
        var normLen = 46;
        svg.appendChild(svgEl('line', { x1: contactX, y1: contactY + 9, x2: contactX, y2: contactY + 9 - normLen, stroke: COLORS.muted, 'stroke-width': 1.3, 'stroke-dasharray': '3,3' }));
        svg.appendChild(text(contactX + 5, contactY + 9 - normLen, 'normale', { fill: COLORS.muted, 'font-size': '9', 'font-family': 'Arial' }));

        /* Composante de frottement f (horizontale, opposée au mouvement) */
        arrow(svg, contactX, contactY + 4, contactX - 36, contactY + 4, COLORS.friction, 2.2);
        svg.appendChild(text(contactX - 44, contactY + 16, 'f', { fill: COLORS.friction, 'font-size': '12', 'font-family': 'Arial', 'font-weight': '700', 'text-anchor': 'middle' }));

        /* Action résultante de la route R, inclinée de φ par rapport à la normale */
        var phiDeg = 26;
        var phi = phiDeg * Math.PI / 180;
        var Rlen = 50;
        var Rx = contactX - Rlen * Math.sin(phi), Ry = contactY + 9 - Rlen * Math.cos(phi);
        arrow(svg, contactX, contactY + 9, Rx, Ry, COLORS.gold, 2.3);
        svg.appendChild(text(Rx - 6, Ry - 6, 'R', { fill: COLORS.gold, 'font-size': '12', 'font-family': 'Arial', 'font-weight': '700', 'text-anchor': 'end' }));

        /* Angle φ entre la normale et R */
        angleArc(svg, contactX, contactY + 9, 26, -90, -90 + phiDeg, COLORS.angle, 1.4);
        svg.appendChild(text(contactX - 30, contactY - 12, '\u03C6 = 26\u00B0', { fill: COLORS.angle, 'font-size': '10.5', 'font-family': 'Arial', 'font-weight': '700' }));

        /* Légende */
        svg.appendChild(text(25, 20, 'Freinage sur route s\u00E8che', { fill: COLORS.muted, 'font-size': '10', 'font-family': 'Arial' }));
        svg.appendChild(text(25, 34, '\u03C6 : angle entre R et la normale', { fill: COLORS.muted, 'font-size': '9.5', 'font-family': 'Arial' }));
    }

    function initAll() {
        drawGraph3();
        drawGraph4();
        drawGraph5();
        drawGraph6();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAll);
    } else {
        initAll();
    }
})();

