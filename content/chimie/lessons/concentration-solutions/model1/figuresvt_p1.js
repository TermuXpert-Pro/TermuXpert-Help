/* ============================================================
   figuresvt_p1.js
   رسومات SVG خاصة بـ Partie 1 : Solides ioniques - Molécules
   polaires - Dissolution. ملف مستقل بالكامل (بدون أي import).
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

    /* ============================================================
       الشكل 1 : البنية البلورية لكلوريد الصوديوم NaCl (Section 1)
       ============================================================ */
    function drawSchemaCristal() {
        var svg = document.getElementById('schemaCristal');
        if (!svg) return;
        var w = 420, h = 170;
        setupSVG(svg, w, h);

        var colors = ['#4ECDC4', '#FF6B6B'];
        var labels = ['Na\u207A', 'Cl\u207B'];
        var r = 9, spacing = 38;

        for (var row = 0; row < 4; row++) {
            for (var col = 0; col < 4; col++) {
                var x = 58 + col * spacing + (row % 2) * (spacing / 2);
                var y = 30 + row * spacing;
                var idx = (row + col) % 2;
                circle(svg, x, y, r, { fill: colors[idx] });
                text(svg, x, y, labels[idx], { fill: '#0D1117', 'font-size': '7.5', 'font-weight': '700' });
            }
        }

        text(svg, w / 2, h - 10, 'Cristal de chlorure de sodium (NaCl)', { fill: '#8a8f98', 'font-size': '10' });

        /* légende à droite */
        circle(svg, 340, 30, 7, { fill: '#4ECDC4' });
        text(svg, 356, 30, 'Na\u207A', { fill: '#ccc', 'font-size': '11', 'text-anchor': 'start' });
        circle(svg, 340, 52, 7, { fill: '#FF6B6B' });
        text(svg, 356, 52, 'Cl\u207B', { fill: '#ccc', 'font-size': '11', 'text-anchor': 'start' });
        text(svg, 375, 90, 'r\u00e9seau', { fill: '#666', 'font-size': '9', 'text-anchor': 'middle' });
        text(svg, 375, 101, 'r\u00e9gulier', { fill: '#666', 'font-size': '9', 'text-anchor': 'middle' });
    }

    /* ============================================================
       الشكل 2 : استقطاب رابطة H—Cl (Section 3.1)
       ============================================================ */
    function drawSchemaHCl() {
        var svg = document.getElementById('schemaHCl');
        if (!svg) return;
        var w = 350, h = 95;
        setupSVG(svg, w, h);

        text(svg, 95, 45, 'H', { fill: '#4ECDC4', 'font-size': '21', 'font-weight': '700' });
        line(svg, 118, 45, 232, 45, { stroke: '#888', 'stroke-width': 2 });

        /* الدوبليت الإلكتروني مزاح نحو الكلور (الأكثر كهرسلبية) */
        circle(svg, 200, 45, 12, { fill: 'rgba(244,208,63,0.30)', stroke: 'rgba(244,208,63,0.6)', 'stroke-width': 0.75 });
        text(svg, 200, 30, '\u2190', { fill: '#F4D03F', 'font-size': '11' });
        text(svg, 200, 66, 'doublet', { fill: '#8a8f98', 'font-size': '8' });
        text(svg, 200, 77, 'd\u00e9cal\u00e9', { fill: '#8a8f98', 'font-size': '8' });

        text(svg, 262, 45, 'Cl', { fill: '#FF6B6B', 'font-size': '21', 'font-weight': '700' });

        text(svg, 72, 20, '\u03b4\u207A', { fill: '#4ECDC4', 'font-size': '14' });
        text(svg, 288, 20, '\u03b4\u207B', { fill: '#FF6B6B', 'font-size': '14' });

        text(svg, w / 2, h - 8, 'Liaison H\u2014Cl polaris\u00e9e', { fill: '#8a8f98', 'font-size': '9.5' });
    }

    /* ============================================================
       الشكل 3 : قطبية جزيئة الماء H2O (Section 3.2)
       ============================================================ */
    function drawSchemaH2O() {
        var svg = document.getElementById('schemaH2O');
        if (!svg) return;
        var w = 350, h = 115;
        setupSVG(svg, w, h);

        text(svg, 175, 52, 'O', { fill: '#FF6B6B', 'font-size': '21', 'font-weight': '700' });
        text(svg, 100, 22, 'H', { fill: '#4ECDC4', 'font-size': '18', 'font-weight': '700' });
        text(svg, 250, 22, 'H', { fill: '#4ECDC4', 'font-size': '18', 'font-weight': '700' });

        line(svg, 175, 52, 112, 26, { stroke: '#888', 'stroke-width': 2 });
        line(svg, 175, 52, 238, 26, { stroke: '#888', 'stroke-width': 2 });

        text(svg, 175, 82, '2\u03b4\u207B', { fill: '#FF6B6B', 'font-size': '13' });
        text(svg, 87, 10, '\u03b4\u207A', { fill: '#4ECDC4', 'font-size': '13' });
        text(svg, 265, 10, '\u03b4\u207A', { fill: '#4ECDC4', 'font-size': '13' });

        /* barycentre des charges positives (croix) déporté du centre O */
        svg.appendChild(svgEl('path', {
            d: 'M 220 24 A 46 46 0 0 1 220 82',
            fill: 'none', stroke: 'rgba(244,208,63,0.25)', 'stroke-width': 1, 'stroke-dasharray': '4,3'
        }));

        text(svg, w / 2, h - 8, "Mol\u00e9cule d'eau polaire (forme coud\u00e9e)", { fill: '#8a8f98', 'font-size': '9.5' });
    }

    /* ============================================================
       الشكل 4 (جديد) : إماهة أيوني Na⁺ و Cl⁻ (Section 5)
       ============================================================ */
    function drawWaterMolecule(svg, mx, my, radialAngleDeg, oFacesIonCenter) {
        var a = radialAngleDeg * Math.PI / 180;
        var ux = Math.cos(a), uy = Math.sin(a);
        var oOffset = oFacesIonCenter ? -6 : 6;
        var hOffset = oFacesIonCenter ? 6 : -6;
        var ox = mx + ux * oOffset, oy = my + uy * oOffset;
        var perp = a + Math.PI / 2;
        var px = Math.cos(perp), py = Math.sin(perp);
        var hx1 = mx + ux * hOffset + px * 5, hy1 = my + uy * hOffset + py * 5;
        var hx2 = mx + ux * hOffset - px * 5, hy2 = my + uy * hOffset - py * 5;
        line(svg, ox, oy, hx1, hy1, { stroke: '#555', 'stroke-width': 1 });
        line(svg, ox, oy, hx2, hy2, { stroke: '#555', 'stroke-width': 1 });
        circle(svg, ox, oy, 3.4, { fill: '#FF6B6B' });
        circle(svg, hx1, hy1, 2.1, { fill: '#4ECDC4' });
        circle(svg, hx2, hy2, 2.1, { fill: '#4ECDC4' });
    }

    function drawSchemaHydratation() {
        var svg = document.getElementById('schemaHydratation');
        if (!svg) return;
        var w = 400, h = 195;
        setupSVG(svg, w, h);

        var naX = 108, naY = 95, clX = 300, clY = 95, rad = 44;

        [0, 72, 144, 216, 288].forEach(function (ang) {
            var a = ang * Math.PI / 180;
            drawWaterMolecule(svg, naX + Math.cos(a) * rad, naY + Math.sin(a) * rad, ang, true);
        });
        circle(svg, naX, naY, 16, { fill: '#4ECDC4' });
        text(svg, naX, naY, 'Na\u207A', { fill: '#0D1117', 'font-size': '11', 'font-weight': '700' });

        [30, 102, 174, 246, 318].forEach(function (ang) {
            var a = ang * Math.PI / 180;
            drawWaterMolecule(svg, clX + Math.cos(a) * rad, clY + Math.sin(a) * rad, ang, false);
        });
        circle(svg, clX, clY, 16, { fill: '#FF6B6B' });
        text(svg, clX, clY, 'Cl\u207B', { fill: '#0D1117', 'font-size': '11', 'font-weight': '700' });

        text(svg, w / 2, 22, 'Les mol\u00e9cules d\'eau s\'orientent autour des ions', { fill: '#F4D03F', 'font-size': '9.5' });
        text(svg, w / 2, h - 10, "Hydratation des ions Na\u207A et Cl\u207B", { fill: '#8a8f98', 'font-size': '9.5' });
    }

    /* ============================================================
       الشكل 5 (جديد) : تجربة الناقلية الكهربائية (Section 4)
       ماء مقطر (لا يوصل) مقابل محلول NaCl (يوصل)
       ============================================================ */
    function beaker(svg, x, y, w, h, liquidColor) {
        var topW = w, botW = w * 0.78;
        var d = 'M ' + (x - topW / 2) + ' ' + y +
            ' L ' + (x + topW / 2) + ' ' + y +
            ' L ' + (x + botW / 2) + ' ' + (y + h) +
            ' L ' + (x - botW / 2) + ' ' + (y + h) + ' Z';
        svg.appendChild(svgEl('path', { d: d, fill: liquidColor, stroke: '#555', 'stroke-width': 1.4 }));
    }

    function circuit(svg, cx, bulbFill, bulbGlow) {
        line(svg, cx - 20, 40, cx - 20, 22, { stroke: '#666', 'stroke-width': 1.4 });
        line(svg, cx - 20, 22, cx + 20, 22, { stroke: '#666', 'stroke-width': 1.4 });
        line(svg, cx + 20, 40, cx + 20, 22, { stroke: '#666', 'stroke-width': 1.4 });
        if (bulbGlow) {
            circle(svg, cx, 22, 13, { fill: 'none', stroke: '#F4D03F', 'stroke-width': 1, opacity: '0.35' });
        }
        circle(svg, cx, 22, 8.5, { fill: bulbFill, stroke: '#666', 'stroke-width': 1 });
        line(svg, cx - 5, 17, cx + 5, 27, { stroke: '#666', 'stroke-width': 0.8 });
        line(svg, cx - 5, 27, cx + 5, 17, { stroke: '#666', 'stroke-width': 0.8 });
    }

    function drawSchemaConductivite() {
        var svg = document.getElementById('schemaConductivite');
        if (!svg) return;
        var w = 400, h = 175;
        setupSVG(svg, w, h);

        var lx = 100, rx = 292;

        /* --- eau distillée : pas d'ions, ampoule éteinte --- */
        beaker(svg, lx, 68, 90, 68, 'rgba(78,205,196,0.05)');
        line(svg, lx - 20, 40, lx - 20, 108, { stroke: '#9aa', 'stroke-width': 3 });
        line(svg, lx + 20, 40, lx + 20, 108, { stroke: '#9aa', 'stroke-width': 3 });
        circuit(svg, lx, '#333', false);
        text(svg, lx, 148, 'Eau distill\u00e9e', { fill: '#ccc', 'font-size': '10' });
        text(svg, lx, 161, 'Ampoule \u00e9teinte \u2717', { fill: '#FF6B6B', 'font-size': '9' });

        /* --- solution de NaCl : ions présents, ampoule allumée --- */
        beaker(svg, rx, 68, 90, 68, 'rgba(78,205,196,0.10)');
        var ions = [[-25, 8, '#4ECDC4'], [12, 15, '#FF6B6B'], [-10, 28, '#FF6B6B'],
        [22, 40, '#4ECDC4'], [-22, 45, '#4ECDC4'], [4, 50, '#FF6B6B'], [-2, 20, '#4ECDC4']];
        ions.forEach(function (p) {
            circle(svg, rx + p[0], 68 + p[1], 3.4, { fill: p[2] });
        });
        line(svg, rx - 20, 40, rx - 20, 108, { stroke: '#9aa', 'stroke-width': 3 });
        line(svg, rx + 20, 40, rx + 20, 108, { stroke: '#9aa', 'stroke-width': 3 });
        circuit(svg, rx, '#F4D03F', true);
        text(svg, rx, 148, 'Solution de NaCl', { fill: '#ccc', 'font-size': '10' });
        text(svg, rx, 161, 'Ampoule allum\u00e9e \u2713', { fill: '#4ECDC4', 'font-size': '9' });
    }

    document.addEventListener('DOMContentLoaded', function () {
        drawSchemaCristal();
        drawSchemaHCl();
        drawSchemaH2O();
        drawSchemaHydratation();
        drawSchemaConductivite();
    });
})();

