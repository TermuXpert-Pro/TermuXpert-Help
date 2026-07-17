// ============================================================
// figuresvt.js - رسومات درس "Mesure des quantités de matière en
// solution par conductimétrie" (Partie 1).
// كنستافدو من svg-utils.js المشترك لغرافات graphUI/graphGS/graphGL،
// وكنديرو svg يدوي (بلا محاور رياضية) للمخطط التوضيحي graphTubeU.
// كيتحمل هاذ الملف بعد svg-utils.js فكل صفحة محتاجاه.
// ============================================================

// ------------------------------------------------------------
// أداة صغيرة محلية باش نديرو عناصر SVG يدوية (مستطيلات، مسارات...)
// اللي ماكايناش فـ svg-utils.js (اللي مبنية غير على محاور رياضية)
// ------------------------------------------------------------
function svtEl(tag, attrs) {
    const NS = 'http://www.w3.org/2000/svg';
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    return e;
}

// ============================================================
// 1) graphTubeU : مخطط توضيحي (schéma) لأنبوب على شكل U
//    مهاجرة الأيونات: الكاتيونات (K+, Cu2+) نحو الكاتود (−)
//    الأنيونات (Cr2O7^2-, SO4^2-) نحو الأنود (+)
//    كنستعملو svg مباشرة بإحداثيات بيكسل عادية (0..380 / 0..280)
//    باش يطابق بالضبط width/height ديال <svg> فـ HTML، بلا أي تشويه.
// ============================================================
function drawGraphTubeUsvg() {
    const svg = document.getElementById('graphTubeU');
    if (!svg) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    const W = 380, H = 280;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

    // --- الأنبوب (شكل U) ---
    const tubePath = svtEl('path', {
        d: 'M 95,25 L 95,185 C 95,235 130,255 165,255 L 215,255 C 250,255 285,235 285,185 L 285,25',
        fill: 'none',
        stroke: '#4ECDC4',
        'stroke-width': 4,
        'stroke-linecap': 'round'
    });
    svg.appendChild(tubePath);

    // --- السائل داخل الأنبوب (محلول ممزوج) ---
    const liquidPath = svtEl('path', {
        d: 'M 97,110 L 97,185 C 97,232 131,253 165,253 L 215,253 C 249,253 283,232 283,185 L 283,110 Z',
        fill: '#2E1F4A',
        opacity: 0.85
    });
    svg.appendChild(liquidPath);
    // خط مستوى السائل
    svg.appendChild(svtEl('line', { x1: 97, y1: 110, x2: 283, y2: 110, stroke: '#4ECDC4', 'stroke-width': 1, opacity: 0.5 }));

    // --- بقعة اللون البرتقالي قرب الأنود (يسار) و الأزرق قرب الكاتود (يمين) ---
    const orangeBlob = svtEl('ellipse', { cx: 118, cy: 205, rx: 30, ry: 40, fill: '#F4A63C', opacity: 0.55 });
    svg.appendChild(orangeBlob);
    const blueBlob = svtEl('ellipse', { cx: 262, cy: 205, rx: 30, ry: 40, fill: '#4D9DE0', opacity: 0.55 });
    svg.appendChild(blueBlob);

    // --- أقطاب الغرافيت (électrodes) ---
    svg.appendChild(svtEl('rect', { x: 112, y: 55, width: 12, height: 130, rx: 3, fill: '#3A3A3A', stroke: '#888', 'stroke-width': 1 }));
    svg.appendChild(svtEl('rect', { x: 256, y: 55, width: 12, height: 130, rx: 3, fill: '#3A3A3A', stroke: '#888', 'stroke-width': 1 }));

    // --- أسلاك نحو المولد ---
    svg.appendChild(svtEl('line', { x1: 118, y1: 55, x2: 118, y2: 25, stroke: '#F4D03F', 'stroke-width': 2 }));
    svg.appendChild(svtEl('line', { x1: 118, y1: 25, x2: 190, y2: 25, stroke: '#F4D03F', 'stroke-width': 2 }));
    svg.appendChild(svtEl('line', { x1: 262, y1: 55, x2: 262, y2: 25, stroke: '#F4D03F', 'stroke-width': 2 }));
    svg.appendChild(svtEl('line', { x1: 262, y1: 25, x2: 190, y2: 25, stroke: '#F4D03F', 'stroke-width': 2 }));

    // --- رمز المولد (دائرة صغيرة فالوسط فوق) ---
    svg.appendChild(svtEl('circle', { cx: 190, cy: 25, r: 14, fill: '#0D1117', stroke: '#F4D03F', 'stroke-width': 2 }));
    const genText = svtEl('text', { x: 190, y: 30, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 'bold', fill: '#F4D03F', 'font-family': 'Arial, sans-serif' });
    genText.textContent = 'G';
    svg.appendChild(genText);

    // --- علامات + و − عند الأقطاب ---
    const plusText = svtEl('text', { x: 118, y: 48, 'text-anchor': 'middle', 'font-size': 16, 'font-weight': 'bold', fill: '#F4A63C', 'font-family': 'Arial, sans-serif' });
    plusText.textContent = '+';
    svg.appendChild(plusText);
    const minusText = svtEl('text', { x: 262, y: 48, 'text-anchor': 'middle', 'font-size': 16, 'font-weight': 'bold', fill: '#4D9DE0', 'font-family': 'Arial, sans-serif' });
    minusText.textContent = '−';
    svg.appendChild(minusText);

    // --- تسميات الأقطاب ---
    const anodeLabel = svtEl('text', { x: 118, y: 275, 'text-anchor': 'middle', 'font-size': 11, fill: '#F4A63C', 'font-family': 'Arial, sans-serif' });
    anodeLabel.textContent = 'Anode (+)';
    svg.appendChild(anodeLabel);
    const cathodeLabel = svtEl('text', { x: 262, y: 275, 'text-anchor': 'middle', 'font-size': 11, fill: '#4D9DE0', 'font-family': 'Arial, sans-serif' });
    cathodeLabel.textContent = 'Cathode (−)';
    svg.appendChild(cathodeLabel);

    // --- سهام الهجرة المزدوجة فوسط السائل ---
    // أنيونات (Cr2O7^2-, SO4^2-) نحو الأنود (يسار)
    svg.appendChild(svtEl('line', { x1: 175, y1: 150, x2: 145, y2: 150, stroke: '#F4A63C', 'stroke-width': 2 }));
    svg.appendChild(svtEl('polygon', { points: '140,150 150,145 150,155', fill: '#F4A63C' }));
    const anionText = svtEl('text', { x: 160, y: 140, 'text-anchor': 'middle', 'font-size': 9, fill: '#F4A63C', 'font-family': 'Arial, sans-serif' });
    anionText.textContent = 'anions';
    svg.appendChild(anionText);

    // كاتيونات (K+, Cu2+) نحو الكاتود (يمين)
    svg.appendChild(svtEl('line', { x1: 205, y1: 175, x2: 235, y2: 175, stroke: '#4D9DE0', 'stroke-width': 2 }));
    svg.appendChild(svtEl('polygon', { points: '240,175 230,170 230,180', fill: '#4D9DE0' }));
    const cationText = svtEl('text', { x: 220, y: 190, 'text-anchor': 'middle', 'font-size': 9, fill: '#4D9DE0', 'font-family': 'Arial, sans-serif' });
    cationText.textContent = 'cations';
    svg.appendChild(cationText);
}

// ============================================================
// 2) graphUI : U (V) en fonction de I (mA) — droite passant par l'origine
//    I(mA): 0 ; 2,4 ; 6,4 ; 10 ; 14,4
//    U(V) : 0 ; 0,2 ; 0,44 ; 0,8 ; 1,2
//    باش الغرافيك يبان متوازن (بلا ما يتشد بزاف من جهة)، كنرسمو
//    U بمقياس داخلي × 10 (بلا ما تبان هاذ القيمة للمستخدم، غير
//    التسميات كتبين بالقيمة الحقيقية بالفولط).
// ============================================================
function drawGraphUIsvg() {
    const s = SvgUtils.setupSVG('graphUI', { xMin: -1.5, xMax: 16.5, yMin: -1.5, yMax: 14.5 });
    if (!s) return;

    SvgUtils.drawAxesWithArrows(s, { xLabel: 'I (mA)', yLabel: 'U (V)' });
    SvgUtils.drawGrid(s);

    const data = [
        { I: 0, U: 0 },
        { I: 2.4, U: 0.2 },
        { I: 6.4, U: 0.44 },
        { I: 10, U: 0.8 },
        { I: 14.4, U: 1.2 }
    ];
    const K = 10; // مقياس عرض داخلي غير مرئي: y_dessin = U * K

    // droite moyenne : U ≈ 0,083 . I  (منحدر متوسط محسوب من النقط)
    const slope = 0.0833;
    SvgUtils.drawLine(s, 0, 0, 16, 16 * slope * K, { color: '#4ECDC4', lineWidth: 2 });
    SvgUtils.drawNote(s, 'U = R.I', 11, 12.5, { color: '#4ECDC4', fontSize: s.fontSize * 0.9 });

    SvgUtils.drawPoints(s, data.map(d => ({
        x: d.I,
        y: d.U * K,
        color: '#FF6B6B',
        label: d.U.toString().replace('.', ',') + ' V',
        showCoords: false,
        fontSize: s.fontSize * 0.75,
        offsetY: s.fontSize * 0.9
    })));
}

// ============================================================
// 3) graphGS : G (µS) en fonction de S (cm²) — droite passant par l'origine
//    S(cm²): 1 ; 2 ; 3 ; 4      G(µS): 137 ; 280 ; 415 ; 545
//    مقياس داخلي: y_dessin = G / 110 (باش يبقى قريب من مدى S)
// ============================================================
function drawGraphGSsvg() {
    const s = SvgUtils.setupSVG('graphGS', { xMin: -0.6, xMax: 5, yMin: -0.6, yMax: 3.2 });
    if (!s) return;

    SvgUtils.drawAxesWithArrows(s, { xLabel: 'S (cm²)', yLabel: 'G' });
    SvgUtils.drawGrid(s);

    const data = [
        { S: 1, G: 137 },
        { S: 2, G: 280 },
        { S: 3, G: 415 },
        { S: 4, G: 545 }
    ];
    const K = 1 / 220; // y_dessin = G * K

    const slope = 137.8; // µS/cm² (متوسط G/S)
    SvgUtils.drawLine(s, 0, 0, 4.8, 4.8 * slope * K, { color: '#4ECDC4', lineWidth: 2 });
    SvgUtils.drawNote(s, 'G proportionnelle à S', 1, 3.0, { color: '#4ECDC4', fontSize: s.fontSize * 0.85 });

    SvgUtils.drawPoints(s, data.map(d => ({
        x: d.S,
        y: d.G * K,
        color: '#FF6B6B',
        label: d.G + ' µS',
        showCoords: false,
        fontSize: s.fontSize * 0.75,
        offsetY: s.fontSize * 0.9
    })));
}

// ============================================================
// 4) graphGL : G (µS) en fonction de L (cm) — courbe décroissante G = k/L
//    L(cm): 1 ; 2 ; 3 ; 4       G(µS): 137 ; 70 ; 44 ; 34
//    مقياس داخلي: y_dessin = G / 35
// ============================================================
function drawGraphGLsvg() {
    const s = SvgUtils.setupSVG('graphGL', { xMin: -0.6, xMax: 5, yMin: -0.6, yMax: 3.7 });
    if (!s) return;

    SvgUtils.drawAxesWithArrows(s, { xLabel: 'L (cm)', yLabel: 'G' });
    SvgUtils.drawGrid(s);

    const data = [
        { L: 1, G: 137 },
        { L: 2, G: 70 },
        { L: 3, G: 44 },
        { L: 4, G: 34 }
    ];
    const K = 1 / 42; // y_dessin = G * K
    const k = 136; // µS.cm (متوسط G × L)

    // منحنى G = k / L : كنرسموه بقطع صغيرة متتالية (polyline) باش يبان
    // منحنى ناعم بلا تشوه، انطلاقا من L=0.42 حتى L=5
    let prevX = 0.42, prevY = (k / prevX) * K;
    for (let L = 0.55; L <= 5.01; L += 0.15) {
        const y = (k / L) * K;
        SvgUtils.drawLine(s, prevX, prevY, L, y, { color: '#4ECDC4', lineWidth: 2 });
        prevX = L;
        prevY = y;
    }
    SvgUtils.drawNote(s, 'G = k / L', 3.2, 1.4, { color: '#4ECDC4', fontSize: s.fontSize * 0.9 });

    SvgUtils.drawPoints(s, data.map(d => ({
        x: d.L,
        y: d.G * K,
        color: '#FF6B6B',
        label: d.G + ' µS',
        showCoords: false,
        fontSize: s.fontSize * 0.75,
        offsetY: s.fontSize * 0.9
    })));
}

// ============================================================
// 5) graphEtalonnage : courbe d'étalonnage G = f(C) (Partie 3)
//    C (mmol/L): 1 ; 2 ; 3 ; 4 ; 5     G (mS): 0,35 ; 0,70 ; 1,05 ; 1,40 ; 1,75
//    خط تناسب طردي تام (k = 0,35 mS par mmol/L). كنزيدو أيضا القراءة
//    البيانية ديال المثال (G = 1,25 mS → C ≈ 3,6 mmol/L) بخطوط متقطعة.
//    مقياس داخلي: y_dessin = G * 2.4 (باش يتوازن الغرافيك مع الصندوق
//    380×280).
// ============================================================
function drawGraphEtalonnagesvg() {
    const s = SvgUtils.setupSVG('graphEtalonnage', { xMin: -0.5, xMax: 5.5, yMin: -0.3, yMax: 4.6 });
    if (!s) return;

    SvgUtils.drawAxesWithArrows(s, { xLabel: 'C (mmol/L)', yLabel: 'G' });
    SvgUtils.drawGrid(s);

    const K = 2.4; // y_dessin = G(mS) * K
    const k = 0.35; // مS par mmol/L (منحدر الخط)

    const data = [
        { C: 1, G: 0.35 },
        { C: 2, G: 0.70 },
        { C: 3, G: 1.05 },
        { C: 4, G: 1.40 },
        { C: 5, G: 1.75 }
    ];

    // خط الاستشارة (droite d'étalonnage) : G = k.C
    SvgUtils.drawLine(s, 0, 0, 5.1, 5.1 * k * K, { color: '#4ECDC4', lineWidth: 2 });
    SvgUtils.drawNote(s, 'G = k.C', 3.7, 1.3, { color: '#4ECDC4', fontSize: s.fontSize * 0.9 });

    // القراءة البيانية ديال المثال : G = 1,25 mS  →  C ≈ 3,6 mmol/L
    const Gread = 1.25, Cread = 3.6;
    const yRead = Gread * K;
    SvgUtils.drawLine(s, 0, yRead, Cread, yRead, { color: '#BB8FCE', lineWidth: 1.5, dashed: true, dashPattern: [5, 3] });
    SvgUtils.drawLine(s, Cread, 0, Cread, yRead, { color: '#BB8FCE', lineWidth: 1.5, dashed: true, dashPattern: [5, 3] });
    SvgUtils.drawNote(s, '1,25 mS', -0.45, yRead + 0.18, { color: '#BB8FCE', fontSize: s.fontSize * 0.75 });
    SvgUtils.drawNote(s, '3,6', Cread - 0.15, -0.15, { color: '#BB8FCE', fontSize: s.fontSize * 0.75 });

    SvgUtils.drawPoints(s, data.map(d => ({
        x: d.C,
        y: d.G * K,
        color: '#FF6B6B',
        label: d.G.toString().replace('.', ',') + ' mS',
        showCoords: false,
        fontSize: s.fontSize * 0.7,
        offsetY: s.fontSize * 0.9
    })));

    SvgUtils.drawPoints(s, [
        { x: Cread, y: yRead, color: '#BB8FCE', radius: s.fontSize * 0.32, label: undefined }
    ]);
}

document.addEventListener('DOMContentLoaded', function () {
    setTimeout(drawGraphTubeUsvg, 400);
    setTimeout(drawGraphUIsvg, 400);
    setTimeout(drawGraphGSsvg, 400);
    setTimeout(drawGraphGLsvg, 400);
    setTimeout(drawGraphEtalonnagesvg, 400);
});
