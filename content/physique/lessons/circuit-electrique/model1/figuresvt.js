// ============================================================
// figuresvt.js - رسومات درس "Transfert d'énergie dans un circuit
// électrique - Puissance électrique - Loi de Joule"
// كنستافدو من svg-utils.js المشترك للرسم البياني الرياضي (droite Q=f(t))
// وكنديرو svg يدوي (بإحداثيات بيكسل) للمخططات الكهربائية (dipôles، دارات).
// كيتحمل هاذ الملف بعد svg-utils.js فكل صفحة محتاجاه.
// ============================================================

// ------------------------------------------------------------
// أداة صغيرة محلية باش نديرو عناصر SVG يدوية (خطوط، دوائر، نصوص...)
// اللي كنستعملوها فالمخططات الكهربائية (بلا محاور رياضية)
// ------------------------------------------------------------
function svtEl(tag, attrs) {
    const NS = 'http://www.w3.org/2000/svg';
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    return e;
}

function svtText(x, y, str, opts) {
    opts = opts || {};
    const t = svtEl('text', {
        x, y,
        'text-anchor': opts.anchor || 'middle',
        'font-size': opts.size || 12,
        'font-weight': opts.weight || 'normal',
        fill: opts.color || '#FFFFFF',
        'font-family': "'Cairo', Arial, sans-serif"
    });
    t.textContent = str;
    return t;
}

// دارة سلك مع سهم اتجاه التيار I في نقطة معينة على الخط
function svtCurrentArrow(x, y, angleDeg, color) {
    const g = svtEl('g', { transform: `translate(${x},${y}) rotate(${angleDeg})` });
    g.appendChild(svtEl('polygon', { points: '0,-5 9,0 0,5', fill: color || '#4ECDC4' }));
    return g;
}

// ============================================================
// 1) graphCircuitRecepteur : الدارة G - L - E - K (Partie 1، §1)
// ============================================================
function drawGraphCircuitRecepteur() {
    const svg = document.getElementById('graphCircuitRecepteur');
    if (!svg) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    const W = 380, H = 260;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

    const left = 60, right = 320, top = 40, bottom = 220;
    const wireColor = '#8A8A9E';

    // ----- إطار الدارة (4 أضلاع) -----
    // الضلع العلوي (فيه المولد G) - مقسم لجزئين حول رمز المولد
    svg.appendChild(svtEl('line', { x1: left, y1: top, x2: 170, y2: top, stroke: wireColor, 'stroke-width': 2 }));
    svg.appendChild(svtEl('line', { x1: 230, y1: top, x2: right, y2: top, stroke: wireColor, 'stroke-width': 2 }));
    // الضلع الأيمن (فيه K)
    svg.appendChild(svtEl('line', { x1: right, y1: top, x2: right, y2: 105, stroke: wireColor, 'stroke-width': 2 }));
    svg.appendChild(svtEl('line', { x1: right, y1: 145, x2: right, y2: bottom, stroke: wireColor, 'stroke-width': 2 }));
    // الضلع السفلي (فيه E) - مقسم حول رمز الإلكتروليز
    svg.appendChild(svtEl('line', { x1: right, y1: bottom, x2: 230, y2: bottom, stroke: wireColor, 'stroke-width': 2 }));
    svg.appendChild(svtEl('line', { x1: 170, y1: bottom, x2: left, y2: bottom, stroke: wireColor, 'stroke-width': 2 }));
    // الضلع الأيسر (فيه L)
    svg.appendChild(svtEl('line', { x1: left, y1: bottom, x2: left, y2: 155, stroke: wireColor, 'stroke-width': 2 }));
    svg.appendChild(svtEl('line', { x1: left, y1: 105, x2: left, y2: top, stroke: wireColor, 'stroke-width': 2 }));

    // ----- G : المولد (رمز بطارية) في الضلع العلوي -----
    svg.appendChild(svtEl('line', { x1: 190, y1: 25, x2: 190, y2: 55, stroke: '#F4D03F', 'stroke-width': 4 }));
    svg.appendChild(svtEl('line', { x1: 210, y1: 30, x2: 210, y2: 50, stroke: '#F4D03F', 'stroke-width': 2 }));
    svg.appendChild(svtEl('line', { x1: 170, y1: top, x2: 190, y2: top, stroke: wireColor, 'stroke-width': 2 }));
    svg.appendChild(svtEl('line', { x1: 210, y1: top, x2: 230, y2: top, stroke: wireColor, 'stroke-width': 2 }));
    svg.appendChild(svtText(190, 18, '+', { color: '#F4D03F', size: 13, weight: 'bold' }));
    svg.appendChild(svtText(210, 18, '−', { color: '#F4D03F', size: 13, weight: 'bold' }));
    svg.appendChild(svtText(200, 62, 'G', { color: '#F4D03F', size: 14, weight: 'bold' }));

    // ----- L : اللمبة (دائرة فيها X) في الضلع الأيسر -----
    svg.appendChild(svtEl('circle', { cx: left, cy: 130, r: 25, fill: '#0D1117', stroke: '#FF6B6B', 'stroke-width': 2 }));
    svg.appendChild(svtEl('line', { x1: left - 13, y1: 117, x2: left + 13, y2: 143, stroke: '#FF6B6B', 'stroke-width': 2 }));
    svg.appendChild(svtEl('line', { x1: left - 13, y1: 143, x2: left + 13, y2: 117, stroke: '#FF6B6B', 'stroke-width': 2 }));
    svg.appendChild(svtText(30, 134, 'L', { color: '#FF6B6B', size: 15, weight: 'bold', anchor: 'end' }));

    // ----- E : الإلكتروليزور (دائرة فيها خطين أفقيين) في الضلع السفلي -----
    svg.appendChild(svtEl('circle', { cx: 200, cy: bottom, r: 25, fill: '#0D1117', stroke: '#4ECDC4', 'stroke-width': 2 }));
    svg.appendChild(svtEl('line', { x1: 188, y1: bottom - 6, x2: 212, y2: bottom - 6, stroke: '#4ECDC4', 'stroke-width': 2 }));
    svg.appendChild(svtEl('line', { x1: 188, y1: bottom + 6, x2: 212, y2: bottom + 6, stroke: '#4ECDC4', 'stroke-width': 2 }));
    svg.appendChild(svtText(200, bottom + 40, 'E', { color: '#4ECDC4', size: 15, weight: 'bold' }));

    // ----- K : القاطع (مفتوح) في الضلع الأيمن -----
    svg.appendChild(svtEl('circle', { cx: right, cy: 108, r: 2.5, fill: '#F4A63C' }));
    svg.appendChild(svtEl('circle', { cx: right, cy: 142, r: 2.5, fill: '#F4A63C' }));
    svg.appendChild(svtEl('line', { x1: right, y1: 108, x2: right + 22, y2: 138, stroke: '#F4A63C', 'stroke-width': 2 }));
    svg.appendChild(svtText(right + 32, 128, 'K', { color: '#F4A63C', size: 15, weight: 'bold', anchor: 'start' }));

    // ----- سهم اتجاه التيار I -----
    svg.appendChild(svtCurrentArrow(255, top, 0, '#4ECDC4'));
    svg.appendChild(svtText(255, top - 10, 'I', { color: '#4ECDC4', size: 13, weight: 'bold' }));
}

// ============================================================
// 2) graphConventionRecepteur : A —I→ [dipôle] → B، U_AB بعكس I (Partie 1، §2)
// ============================================================
function drawGraphConventionRecepteur() {
    const svg = document.getElementById('graphConventionRecepteur');
    if (!svg) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    const W = 320, H = 130;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

    const Ax = 40, Bx = 280, y = 45;

    // النقط A و B
    svg.appendChild(svtEl('circle', { cx: Ax, cy: y, r: 3, fill: '#FFFFFF' }));
    svg.appendChild(svtEl('circle', { cx: Bx, cy: y, r: 3, fill: '#FFFFFF' }));
    svg.appendChild(svtText(Ax, y - 12, 'A', { color: '#FFFFFF', size: 14, weight: 'bold' }));
    svg.appendChild(svtText(Bx, y - 12, 'B', { color: '#FFFFFF', size: 14, weight: 'bold' }));

    // الخط + الصندوق (dipôle récepteur)
    svg.appendChild(svtEl('line', { x1: Ax, y1: y, x2: 110, y2: y, stroke: '#8A8A9E', 'stroke-width': 2 }));
    svg.appendChild(svtEl('rect', { x: 110, y: y - 18, width: 100, height: 36, fill: '#0D1117', stroke: '#4ECDC4', 'stroke-width': 2 }));
    svg.appendChild(svtEl('line', { x1: 210, y1: y, x2: Bx, y2: y, stroke: '#8A8A9E', 'stroke-width': 2 }));

    // سهم التيار I (فوق، من A إلى B)
    svg.appendChild(svtEl('line', { x1: 55, y1: y - 30, x2: 95, y2: y - 30, stroke: '#FF6B6B', 'stroke-width': 2 }));
    svg.appendChild(svtCurrentArrow(95, y - 30, 0, '#FF6B6B'));
    svg.appendChild(svtText(75, y - 36, 'I', { color: '#FF6B6B', size: 13, weight: 'bold' }));

    // سهم التوتر UAB (تحت، من B إلى A - بعكس I)
    svg.appendChild(svtEl('line', { x1: 250, y1: y + 35, x2: 65, y2: y + 35, stroke: '#4ECDC4', 'stroke-width': 2 }));
    svg.appendChild(svtCurrentArrow(65, y + 35, 180, '#4ECDC4'));
    svg.appendChild(svtText(160, y + 50, 'U_AB > 0 V', { color: '#4ECDC4', size: 12, weight: 'bold' }));
}

// ============================================================
// 3) graphConducteurOhmique : A —I→ [R] → B، U_AB (Partie 2، §2)
// ============================================================
function drawGraphConducteurOhmique() {
    const svg = document.getElementById('graphConducteurOhmique');
    if (!svg) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    const W = 320, H = 130;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

    const Ax = 40, Bx = 280, y = 45;

    svg.appendChild(svtEl('circle', { cx: Ax, cy: y, r: 3, fill: '#FFFFFF' }));
    svg.appendChild(svtEl('circle', { cx: Bx, cy: y, r: 3, fill: '#FFFFFF' }));
    svg.appendChild(svtText(Ax, y - 12, 'A', { color: '#FFFFFF', size: 14, weight: 'bold' }));
    svg.appendChild(svtText(Bx, y - 12, 'B', { color: '#FFFFFF', size: 14, weight: 'bold' }));

    svg.appendChild(svtEl('line', { x1: Ax, y1: y, x2: 110, y2: y, stroke: '#8A8A9E', 'stroke-width': 2 }));
    svg.appendChild(svtEl('rect', { x: 110, y: y - 18, width: 100, height: 36, fill: '#0D1117', stroke: '#FF9F43', 'stroke-width': 2 }));
    svg.appendChild(svtText(160, y + 5, 'R', { color: '#FF9F43', size: 15, weight: 'bold' }));
    svg.appendChild(svtEl('line', { x1: 210, y1: y, x2: Bx, y2: y, stroke: '#8A8A9E', 'stroke-width': 2 }));

    svg.appendChild(svtEl('line', { x1: 55, y1: y - 30, x2: 95, y2: y - 30, stroke: '#FF6B6B', 'stroke-width': 2 }));
    svg.appendChild(svtCurrentArrow(95, y - 30, 0, '#FF6B6B'));
    svg.appendChild(svtText(75, y - 36, 'I', { color: '#FF6B6B', size: 13, weight: 'bold' }));

    svg.appendChild(svtEl('line', { x1: 250, y1: y + 35, x2: 65, y2: y + 35, stroke: '#4ECDC4', 'stroke-width': 2 }));
    svg.appendChild(svtCurrentArrow(65, y + 35, 180, '#4ECDC4'));
    svg.appendChild(svtText(160, y + 50, 'U_AB > 0 V', { color: '#4ECDC4', size: 12, weight: 'bold' }));
}

// ============================================================
// 4) graphJoule : الطاقة الحرارية Q بدلالة الزمن t (droite تمر من الأصل)
//    كنستافدو من svg-utils.js (محاور رياضية + drawCurve + drawPoint)
// ============================================================
function drawGraphJoule() {
    if (typeof SvgUtils === 'undefined') return;
    // ⚠️ مهم: setupSVG كيبني viewBox بنفس القيم الرياضية لي كنعطيوها.
    // إلا كانت yMax كبيرة بزاف مقارنة مع xMax (990 مقابل 17.5 مثلا)،
    // نسبة أبعاد الـ viewBox توالي مهرأسة (~1:56) وما كتناسبش مع
    // نسبة أبعاد الـ <svg width=360 height=240> (~1.5:1)، فالرسم كامل
    // كيتقلص فخط رفيع جدا وسط الشاشة وكيبان "فارغ". الحل: نخدمو بمقياس
    // Q بمئات الجول (×10² J) باش القيم يبقاو قريبين من مدى t، ونكتبو
    // هاد المقياس فـ label المحور y.
    const s = SvgUtils.setupSVG('graphJoule', { xMin: -1.8, xMax: 16, yMin: -2, yMax: 9.5 });
    if (!s) return;

    SvgUtils.drawGrid(s);
    SvgUtils.drawAxesWithArrows(s, { xLabel: 't (min)', yLabel: 'Q (×10² J)' });

    // منحدر الخط: Q = a . t ، a = 0.55 (يمثل 55 J/min بمقياس ×100 J)
    const a = 0.55;
    SvgUtils.drawCurve(s, (t) => a * t, 0, 15, { color: '#FF6B6B', lineWidth: 2.5 });

    const t2 = 9, Q2 = a * t2; // نقطة توضيحية لاستخراج الميل (M)

    SvgUtils.drawPoints(s, [
        { x: t2, y: Q2, label: 'M', color: '#F4D03F', offsetX: 0.5, offsetY: -0.3, showCoords: false }
    ]);

    // خطوط متقطعة (إسقاط النقطة M على المحورين)
    SvgUtils.drawLine(s, t2, 0, t2, Q2, { color: '#888888', dashed: true });
    SvgUtils.drawLine(s, 0, Q2, t2, Q2, { color: '#888888', dashed: true });

    // ملاحظة: drawNote كتاخد y بصيغة SVG مباشرة (مقلوبة)، فكنعطيوها -(y الرياضية)
    SvgUtils.drawNote(s, 't₂', t2 - 0.3, 0.45, { color: '#888888', fontSize: 0.5 });
    SvgUtils.drawNote(s, 'Q₂', -1.7, -Q2 - 0.05, { color: '#888888', fontSize: 0.5 });
    SvgUtils.drawNote(s, 'pente a = ΔQ/Δt = R·I²', 2.5, -8.4, { color: '#F4D03F', fontSize: 0.55 });
    SvgUtils.drawNote(s, '(échelle : 1 unité = 100 J)', 2.5, -7.7, { color: '#888888', fontSize: 0.42 });
}

// ============================================================
// 5) graphConventionGenerateur : P —I→ pile → N، U_PN بنفس اتجاه I (Partie 3)
// ============================================================
function drawGraphConventionGenerateur() {
    const svg = document.getElementById('graphConventionGenerateur');
    if (!svg) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    const W = 320, H = 130;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

    const Px = 40, Nx = 280, y = 45;

    svg.appendChild(svtEl('circle', { cx: Px, cy: y, r: 3, fill: '#FFFFFF' }));
    svg.appendChild(svtEl('circle', { cx: Nx, cy: y, r: 3, fill: '#FFFFFF' }));
    svg.appendChild(svtText(Px, y - 12, 'P', { color: '#FFFFFF', size: 14, weight: 'bold' }));
    svg.appendChild(svtText(Nx, y - 12, 'N', { color: '#FFFFFF', size: 14, weight: 'bold' }));

    // رمز البطارية فالوسط (خط طويل = +، خط قصير = −)
    svg.appendChild(svtEl('line', { x1: Px, y1: y, x2: 140, y2: y, stroke: '#8A8A9E', 'stroke-width': 2 }));
    svg.appendChild(svtEl('line', { x1: 140, y1: y - 18, x2: 140, y2: y + 18, stroke: '#F4D03F', 'stroke-width': 4 }));
    svg.appendChild(svtEl('line', { x1: 160, y1: y - 10, x2: 160, y2: y + 10, stroke: '#F4D03F', 'stroke-width': 2 }));
    svg.appendChild(svtEl('line', { x1: 160, y1: y, x2: Nx, y2: y, stroke: '#8A8A9E', 'stroke-width': 2 }));
    svg.appendChild(svtText(140, y - 26, '+', { color: '#F4D03F', size: 13, weight: 'bold' }));
    svg.appendChild(svtText(160, y - 26, '−', { color: '#F4D03F', size: 13, weight: 'bold' }));

    // سهم التيار I (فوق، من N نحو P - كيخرج من P)
    svg.appendChild(svtEl('line', { x1: 95, y1: y - 30, x2: 55, y2: y - 30, stroke: '#FF6B6B', 'stroke-width': 2 }));
    svg.appendChild(svtCurrentArrow(55, y - 30, 180, '#FF6B6B'));
    svg.appendChild(svtText(75, y - 36, 'I', { color: '#FF6B6B', size: 13, weight: 'bold' }));

    // سهم التوتر UPN (تحت، بنفس اتجاه I)
    svg.appendChild(svtEl('line', { x1: 250, y1: y + 35, x2: 65, y2: y + 35, stroke: '#4ECDC4', 'stroke-width': 2 }));
    svg.appendChild(svtCurrentArrow(65, y + 35, 180, '#4ECDC4'));
    svg.appendChild(svtText(160, y + 50, 'U_PN > 0 V', { color: '#4ECDC4', size: 12, weight: 'bold' }));
}

// ============================================================
// 6) graphBilanGlobal : بيان تركيبي للدارة الكاملة (résumé)
//    مولد --We--> récepteur، مع تحويلات الطاقة فكل طرف
// ============================================================
function drawGraphBilanGlobal() {
    const svg = document.getElementById('graphBilanGlobal');
    if (!svg) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    const W = 380, H = 190;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

    // صندوق المولد
    svg.appendChild(svtEl('rect', { x: 20, y: 60, width: 110, height: 60, rx: 8, fill: '#0D1117', stroke: '#F4D03F', 'stroke-width': 2 }));
    svg.appendChild(svtText(75, 85, 'Générateur', { color: '#F4D03F', size: 13, weight: 'bold' }));
    svg.appendChild(svtText(75, 103, 'E chimique → E élec.', { color: '#F4D03F', size: 9 }));

    // صندوق المستقبل
    svg.appendChild(svtEl('rect', { x: 250, y: 60, width: 110, height: 60, rx: 8, fill: '#0D1117', stroke: '#4ECDC4', 'stroke-width': 2 }));
    svg.appendChild(svtText(305, 85, 'Récepteur', { color: '#4ECDC4', size: 13, weight: 'bold' }));
    svg.appendChild(svtText(305, 103, 'E élec. → E th. + autre', { color: '#4ECDC4', size: 9 }));

    // سهم الطاقة المنقولة We
    svg.appendChild(svtEl('line', { x1: 130, y1: 90, x2: 245, y2: 90, stroke: '#FF6B6B', 'stroke-width': 2.5 }));
    svg.appendChild(svtCurrentArrow(245, 90, 0, '#FF6B6B'));
    svg.appendChild(svtText(188, 78, 'We = UPN·I·Δt', { color: '#FF6B6B', size: 11, weight: 'bold' }));

    // سهم الطاقة الحرارية الضائعة (تحت الطرفين)
    svg.appendChild(svtEl('line', { x1: 75, y1: 122, x2: 75, y2: 155, stroke: '#F4A63C', 'stroke-width': 2 }));
    svg.appendChild(svtCurrentArrow(75, 155, 90, '#F4A63C'));
    svg.appendChild(svtText(75, 172, 'perte th. (r)', { color: '#F4A63C', size: 9 }));

    svg.appendChild(svtEl('line', { x1: 305, y1: 122, x2: 305, y2: 155, stroke: '#F4A63C', 'stroke-width': 2 }));
    svg.appendChild(svtCurrentArrow(305, 155, 90, '#F4A63C'));
    svg.appendChild(svtText(305, 172, 'perte th. (R)', { color: '#F4A63C', size: 9 }));

    svg.appendChild(svtText(188, 30, 'Bilan énergétique global de la chaîne', { color: '#FFFFFF', size: 12, weight: 'bold' }));
}

// ============================================================
// تشغيل تلقائي عند تحميل الصفحة (كل دالة كتحقق واحدها إذا كاين
// العنصر id ديالها فالصفحة الحالية، وإلا ماديرتش والو)
// ============================================================
document.addEventListener('DOMContentLoaded', function () {
    drawGraphCircuitRecepteur();
    drawGraphConventionRecepteur();
    drawGraphConducteurOhmique();
    drawGraphJoule();
    drawGraphConventionGenerateur();
    drawGraphBilanGlobal();
});
