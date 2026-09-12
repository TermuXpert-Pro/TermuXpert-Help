/* ============================================================
   figuresvt_p2.js
   رسومات SVG خاصة بـ Partie 2 : Concentration molaire -
   Concentration effective. ملف مستقل بالكامل (بدون أي import).
   ============================================================ */
(function () {
    'use strict';

    /* ---------- أدوات مساعدة محلية (خاصة بهذا الملف فقط) ---------- */
    function svgEl(tag, attrs) {
        var e = document.createElementNS('http://www.w3.org/2000/svg', tag);
        if (attrs) {
            for (var k in attrs) {
                if (Object.prototype.hasOwnProperty.call(attrs, k)) {
                    e.setAttribute(k, attrs[k]);
                }
            }
        }
        return e;
    }

    function setupSVG(svg, w, h) {
        svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        svg.setAttribute('width', '100%');
        svg.removeAttribute('height');
        svg.style.display = 'block';
        svg.style.margin = '0 auto';
        svg.style.maxWidth = '100%';
        while (svg.firstChild) svg.removeChild(svg.firstChild);
        svg.appendChild(svgEl('rect', { x: 0, y: 0, width: w, height: h, fill: '#0D1117', rx: 6 }));
        return svg;
    }

    function text(svg, x, y, str, attrs) {
        var base = { x: x, y: y, 'font-family': 'Arial, sans-serif', 'text-anchor': 'middle', 'dominant-baseline': 'middle' };
        if (attrs) { for (var k in attrs) { base[k] = attrs[k]; } }
        var t = svgEl('text', base);
        t.textContent = str;
        svg.appendChild(t);
        return t;
    }

    function line(svg, x1, y1, x2, y2, attrs) {
        var base = { x1: x1, y1: y1, x2: x2, y2: y2, stroke: '#888', 'stroke-width': 1.5 };
        if (attrs) { for (var k in attrs) { base[k] = attrs[k]; } }
        svg.appendChild(svgEl('line', base));
    }

    function circle(svg, cx, cy, r, attrs) {
        var base = { cx: cx, cy: cy, r: r, fill: '#4ECDC4' };
        if (attrs) { for (var k in attrs) { base[k] = attrs[k]; } }
        svg.appendChild(svgEl('circle', base));
    }

    function beaker(svg, x, y, w, h, liquidColor) {
        var topW = w, botW = w * 0.8;
        var d = 'M ' + (x - topW / 2) + ' ' + y +
            ' L ' + (x + topW / 2) + ' ' + y +
            ' L ' + (x + botW / 2) + ' ' + (y + h) +
            ' L ' + (x - botW / 2) + ' ' + (y + h) + ' Z';
        svg.appendChild(svgEl('path', { d: d, fill: liquidColor, stroke: '#555', 'stroke-width': 1.4 }));
    }

    /* ============================================================
       الشكل 1 (جديد) : تمثيل C = n/V (Section 1)
       مثال النص : n = 0,2 mol NaCl مذاب في V = 0,5 L
       ============================================================ */
    function drawSchemaConcentration() {
        var svg = document.getElementById('schemaConcentration');
        if (!svg) return;
        var w = 380, h = 195;
        setupSVG(svg, w, h);

        text(svg, w / 2, 18, 'C(NaCl) = n / V', { fill: '#F4D03F', 'font-size': '13', 'font-weight': '700' });

        var bx = 200, by = 40, bw = 130, bh = 120;
        beaker(svg, bx, by, bw, bh, 'rgba(78,205,196,0.08)');

        /* n mol de soluté dispersés dans le volume (8 points => n = 0,2 mol) */
        var pts = [[-40, 25], [-10, 15], [20, 30], [-25, 55], [10, 60], [35, 70], [-5, 85], [25, 95]];
        pts.forEach(function (p) {
            circle(svg, bx + p[0], by + p[1], 4, { fill: '#4ECDC4' });
        });
        text(svg, bx, by + bh + 16, 'n = 0,2 mol de NaCl dissous', { fill: '#ccc', 'font-size': '10' });

        /* flèche double indiquant le volume V à gauche du bécher */
        var vx = 90;
        line(svg, vx, by, vx, by + bh, { stroke: '#888', 'stroke-width': 1.2 });
        line(svg, vx - 4, by, vx + 4, by, { stroke: '#888', 'stroke-width': 1.2 });
        line(svg, vx - 4, by + bh, vx + 4, by + bh, { stroke: '#888', 'stroke-width': 1.2 });
        text(svg, vx - 18, by + bh / 2, 'V', { fill: '#8a8f98', 'font-size': '11', 'text-anchor': 'middle' });
        text(svg, vx - 18, by + bh / 2 + 14, '0,5 L', { fill: '#8a8f98', 'font-size': '9', 'text-anchor': 'middle' });

        text(svg, w / 2, h - 12, 'C = 0,2 / 0,5 = 0,4 mol.L\u207B\u00b9', { fill: '#4ECDC4', 'font-size': '11', 'font-weight': '700' });
    }

    /* ============================================================
       دالة مشتركة داخل هذا الملف فقط : تمثيل انحلال أيوني
       (تُستعمل مرتين : CuCl2 و Na2SO4)
       ============================================================ */
    function drawDissociationScheme(opts) {
        var svg = document.getElementById(opts.id);
        if (!svg) return;
        var w = 380, h = 175;
        setupSVG(svg, w, h);

        /* --- boîte solide à gauche --- */
        var sx = 60, sy = 87;
        svg.appendChild(svgEl('rect', { x: sx - 34, y: sy - 26, width: 68, height: 52, rx: 5, fill: 'rgba(244,208,63,0.08)', stroke: '#F4D03F', 'stroke-width': 1 }));
        var cellColors = opts.solidColors;
        var gi = 0;
        for (var row = 0; row < 2; row++) {
            for (var col = 0; col < 3; col++) {
                circle(svg, sx - 20 + col * 20, sy - 12 + row * 24, 6, { fill: cellColors[gi % cellColors.length] });
                gi++;
            }
        }
        text(svg, sx, sy + 40, opts.solidLabel, { fill: '#ccc', 'font-size': '10' });

        /* --- flèche "eau" --- */
        line(svg, sx + 40, sy, sx + 110, sy, { stroke: '#888', 'stroke-width': 1.6 });
        svg.appendChild(svgEl('path', { d: 'M ' + (sx + 110) + ' ' + sy + ' l -7 -4 l 0 8 z', fill: '#888' }));
        text(svg, sx + 75, sy - 10, 'eau', { fill: '#4ECDC4', 'font-size': '10' });

        /* --- zone "solution" à droite avec les ions dispersés --- */
        var rx = 275, ry = 87, rr = 68;
        svg.appendChild(svgEl('circle', { cx: rx, cy: ry, r: rr, fill: 'rgba(78,205,196,0.05)', stroke: '#333', 'stroke-width': 1, 'stroke-dasharray': '4,3' }));
        opts.ions.forEach(function (ion) {
            circle(svg, rx + ion[0], ry + ion[1], ion[3], { fill: ion[2] });
            text(svg, rx + ion[0], ry + ion[1], ion[4], { fill: '#0D1117', 'font-size': ion[5] || '8', 'font-weight': '700' });
        });

        text(svg, w / 2, h - 8, opts.caption, { fill: '#8a8f98', 'font-size': '9.5' });
    }

    /* ============================================================
       الشكل 2 (جديد) : تفكك CuCl2 → Cu2+ + 2Cl- (Section 3)
       ============================================================ */
    function drawSchemaDissociationCuCl2() {
        drawDissociationScheme({
            id: 'schemaDissociationCuCl2',
            solidLabel: 'CuCl\u2082(s)',
            solidColors: ['#4ECDC4', '#FF6B6B'],
            ions: [
                [-8, -18, '#4ECDC4', 13, 'Cu\u00b2\u207A', '9'],
                [30, -8, '#FF6B6B', 8, 'Cl\u207B', '7'],
                [30, 22, '#FF6B6B', 8, 'Cl\u207B', '7'],
                [-32, 30, '#333', 0, '', '7']
            ],
            caption: '1 CuCl\u2082 \u2192 1 Cu\u00b2\u207A + 2 Cl\u207B  \u2022  [Cu\u00b2\u207A] = C   [Cl\u207B] = 2C'
        });
    }

    /* ============================================================
       الشكل 3 (جديد) : تفكك Na2SO4 → 2Na+ + SO4²- (Section 4)
       ============================================================ */
    function drawSchemaDissociationNa2SO4() {
        drawDissociationScheme({
            id: 'schemaDissociationNa2SO4',
            solidLabel: 'Na\u2082SO\u2084(s)',
            solidColors: ['#4ECDC4', '#FF6B6B'],
            ions: [
                [-25, -12, '#4ECDC4', 8, 'Na\u207A', '7'],
                [-25, 18, '#4ECDC4', 8, 'Na\u207A', '7'],
                [20, 2, '#FF6B6B', 14, 'SO\u2084\u00b2\u207B', '7.5']
            ],
            caption: '1 Na\u2082SO\u2084 \u2192 2 Na\u207A + SO\u2084\u00b2\u207B  \u2022  [Na\u207A] = 0,40   [SO\u2084\u00b2\u207B] = 0,20 mol.L\u207B\u00b9'
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        drawSchemaConcentration();
        drawSchemaDissociationCuCl2();
        drawSchemaDissociationNa2SO4();
    });
})();
