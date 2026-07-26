/* ============================================================
   figuresvt_p3.js
   رسم SVG خاص بـ Partie 3 (Résumé) : La concentration et les
   solutions électrolytiques. ملف مستقل بالكامل (بدون أي import).
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

    function circle(svg, cx, cy, r, attrs) {
        var base = { cx: cx, cy: cy, r: r, fill: '#4ECDC4' };
        if (attrs) { for (var k in attrs) { base[k] = attrs[k]; } }
        svg.appendChild(svgEl('circle', base));
    }

    /* ============================================================
       الشكل (جديد) : ملخّص أنواع الانحلال الثلاثة (Section 4)
       NaCl(s) - HCl(g) - H2SO4(l)  →  أيونات + الماء
       ============================================================ */
    function drawColumn(svg, cx, opts) {
        /* boîte état initial */
        svg.appendChild(svgEl('rect', {
            x: cx - 42, y: 26, width: 84, height: 30, rx: 5,
            fill: 'rgba(244,208,63,0.08)', stroke: '#F4D03F', 'stroke-width': 1
        }));
        text(svg, cx, 41, opts.reactant, { fill: '#F4D03F', 'font-size': '11', 'font-weight': '700' });

        /* flèche vers le bas avec "eau" */
        svg.appendChild(svgEl('line', { x1: cx, y1: 56, x2: cx, y2: 100, stroke: '#888', 'stroke-width': 1.5 }));
        svg.appendChild(svgEl('path', { d: 'M ' + cx + ' 100 l -5 -8 l 10 0 z', fill: '#888' }));
        text(svg, cx + 22, 78, 'eau', { fill: '#4ECDC4', 'font-size': '9' });

        /* ions produits */
        opts.ions.forEach(function (ion) {
            circle(svg, cx + ion[0], 128 + ion[1], ion[2], { fill: ion[3] });
        });
        text(svg, cx, 165, opts.productLabel, { fill: '#ccc', 'font-size': '9.5' });
        text(svg, cx, 180, opts.tag, { fill: '#8a8f98', 'font-size': '8.5' });
    }

    function drawSchemaRecapDissolution() {
        var svg = document.getElementById('schemaRecapDissolution');
        if (!svg) return;
        var w = 400, h = 195;
        setupSVG(svg, w, h);

        /* séparateurs verticaux légers entre les trois cas */
        svg.appendChild(svgEl('line', { x1: 133, y1: 12, x2: 133, y2: h - 12, stroke: '#222', 'stroke-width': 1 }));
        svg.appendChild(svgEl('line', { x1: 267, y1: 12, x2: 267, y2: h - 12, stroke: '#222', 'stroke-width': 1 }));

        drawColumn(svg, 66, {
            reactant: 'NaCl(s)',
            ions: [[-10, 0, 6, '#4ECDC4'], [10, 0, 6, '#FF6B6B']],
            productLabel: 'Na\u207A + Cl\u207B',
            tag: 'solide ionique'
        });

        drawColumn(svg, 200, {
            reactant: 'HCl(g)',
            ions: [[-10, 0, 5.5, '#4ECDC4'], [10, 0, 6, '#FF6B6B']],
            productLabel: 'H\u207A + Cl\u207B',
            tag: 'gaz polaire'
        });

        drawColumn(svg, 333, {
            reactant: 'H\u2082SO\u2084(\u2113)',
            ions: [[-16, 0, 5.5, '#4ECDC4'], [0, 0, 5.5, '#4ECDC4'], [18, 0, 9, '#FF6B6B']],
            productLabel: '2H\u207A + SO\u2084\u00b2\u207B',
            tag: 'liquide polaire'
        });

        text(svg, w / 2, 12, '"Polaire dissout polaire"', { fill: '#F4D03F', 'font-size': '10', 'font-weight': '700' });
    }

    document.addEventListener('DOMContentLoaded', function () {
        drawSchemaRecapDissolution();
    });
})();
