// ============================================================
// figuresvt.js - رسومات درس "Suivi d'une transformation chimique"
// كل الرسومات هنا عبارة عن مبيانات n = f(x) (كمية المادة بدلالة
// التقدم)، فكل واحدة عبارة عن خطوط مستقيمة انطلاقا من نقطة البداية
// (x=0, n_i) بميل يساوي المعامل التناسبي (سالب للمتفاعلات، موجب
// للنواتج). كنستافدو من svg-utils.js المشترك (نفس المنطق ديال
// figuresvg.js فتمارين barycentre).
// كيتحمل هاذ الملف بعد svg-utils.js فكل صفحة محتاجاه.
// ============================================================

// خط n(x) = n0 + coeff * x بين x=0 و x=xEnd
function drawSpeciesLine(s, n0, coeff, xEnd, opts) {
    opts = opts || {};
    const xStart = 0;
    const yStart = n0;
    const yEnd = n0 + coeff * xEnd;
    SvgUtils.drawLine(s, xStart, yStart, xEnd, yEnd, opts);
    return { x: xEnd, y: yEnd };
}

// ====== Partie 3 : Exemple Ca2+ + 2 PO4^3- -> Ca3(PO4)2 ======
// ni(Ca2+) = 3 mmol, ni(PO4^3-) = 4 mmol, xmax = 1 mmol (Ca2+ limitant)
function drawGraphAvancementCasvg() {
    const s = SvgUtils.setupSVG('graphAvancementCa', { xMin: -0.4, xMax: 2.6, yMin: -0.4, yMax: 4.6 });
    if (!s) return;

    SvgUtils.drawAxesWithArrows(s, { xLabel: 'x (mmol)', yLabel: 'n (mmol)' });
    SvgUtils.drawGrid(s);

    const xMax = 1;

    // ligne verticale à x = xmax (état final)
    SvgUtils.drawLine(s, xMax, 0, xMax, 4.3, { color: '#BB8FCE', lineWidth: 1.5, dashed: true, dashPattern: [5, 3] });
    SvgUtils.drawNote(s, 'x_max = 1', xMax + 0.05, 4.3, { color: '#BB8FCE', fontSize: s.fontSize * 0.85 });

    // Ca2+ : n = 3 - 3x  (rouge)
    drawSpeciesLine(s, 3, -3, 2.6 / 3 > 1 ? 1 : 2.6 / 3, { color: '#FF6B6B', lineWidth: 2 });
    SvgUtils.drawNote(s, 'n(Ca²⁺) = 3 - 3x', 0.15, 3.3, { color: '#FF6B6B', fontSize: s.fontSize * 0.85 });

    // PO4^3- : n = 4 - 2x (bleu)
    drawSpeciesLine(s, 4, -2, 2, { color: '#4D9DE0', lineWidth: 2 });
    SvgUtils.drawNote(s, 'n(PO₄³⁻) = 4 - 2x', 1.3, 2.2, { color: '#4D9DE0', fontSize: s.fontSize * 0.85 });

    // Ca3(PO4)2 : n = x (vert)
    drawSpeciesLine(s, 0, 1, 2.6, { color: '#4ECDC4', lineWidth: 2 });
    SvgUtils.drawNote(s, 'n(Ca₃(PO₄)₂) = x', 1.6, 1, { color: '#4ECDC4', fontSize: s.fontSize * 0.85 });

    // points à l'état final
    SvgUtils.drawPoints(s, [
        { x: xMax, y: 0, color: '#FF6B6B', label: '0', showCoords: false, fontSize: s.fontSize * 0.8 },
        { x: xMax, y: 2, color: '#4D9DE0', label: '2', showCoords: false, fontSize: s.fontSize * 0.8 },
        { x: xMax, y: 1, color: '#4ECDC4', label: '1', showCoords: false, fontSize: s.fontSize * 0.8 }
    ]);
}

// ====== Partie 4 : Exemple 2 CuO + C -> 2 Cu + CO2 ======
// n0(CuO) = 12,6 mmol, n0(C) = 10 mmol, xmax = 6,30 mmol (CuO limitant)
function drawGraphAvancementCuOsvg() {
    const s = SvgUtils.setupSVG('graphAvancementCuO', { xMin: -0.6, xMax: 8, yMin: -0.6, yMax: 14 });
    if (!s) return;

    SvgUtils.drawAxesWithArrows(s, { xLabel: 'x (mmol)', yLabel: 'n (mmol)' });
    SvgUtils.drawGrid(s);

    const xMax = 6.3;

    SvgUtils.drawLine(s, xMax, 0, xMax, 13.3, { color: '#BB8FCE', lineWidth: 1.5, dashed: true, dashPattern: [5, 3] });
    SvgUtils.drawNote(s, 'x_max ≈ 6,30', xMax + 0.1, 13.3, { color: '#BB8FCE', fontSize: s.fontSize * 0.8 });

    // CuO : n = 12,6 - 2x (violet)
    drawSpeciesLine(s, 12.6, -2, 6.3, { color: '#BB8FCE', lineWidth: 2 });
    SvgUtils.drawNote(s, 'n(CuO) = 12,6 - 2x', 0.2, 12, { color: '#BB8FCE', fontSize: s.fontSize * 0.8 });

    // C : n = 10 - x (cyan)
    drawSpeciesLine(s, 10, -1, 7.9, { color: '#4D9DE0', lineWidth: 2 });
    SvgUtils.drawNote(s, 'n(C) = 10 - x', 0.2, 9.3, { color: '#4D9DE0', fontSize: s.fontSize * 0.8 });

    // Cu : n = 2x (rouge)
    drawSpeciesLine(s, 0, 2, 7.9, { color: '#FF6B6B', lineWidth: 2 });
    SvgUtils.drawNote(s, 'n(Cu) = 2x', 5.6, 13.2, { color: '#FF6B6B', fontSize: s.fontSize * 0.8 });

    // CO2 : n = x (vert)
    drawSpeciesLine(s, 0, 1, 7.9, { color: '#4ECDC4', lineWidth: 2 });
    SvgUtils.drawNote(s, 'n(CO₂) = x', 6.3, 5.5, { color: '#4ECDC4', fontSize: s.fontSize * 0.8 });

    SvgUtils.drawPoints(s, [
        { x: xMax, y: 0, color: '#BB8FCE', label: '0', showCoords: false, fontSize: s.fontSize * 0.8 },
        { x: xMax, y: 3.7, color: '#4D9DE0', label: '3,7', showCoords: false, fontSize: s.fontSize * 0.8 },
        { x: xMax, y: 12.6, color: '#FF6B6B', label: '12,6', showCoords: false, fontSize: s.fontSize * 0.8 },
        { x: xMax, y: 6.3, color: '#4ECDC4', label: '6,3', showCoords: false, fontSize: s.fontSize * 0.8 }
    ]);
}

document.addEventListener('DOMContentLoaded', function () {
    setTimeout(drawGraphAvancementCasvg, 400);
    setTimeout(drawGraphAvancementCuOsvg, 400);
});
