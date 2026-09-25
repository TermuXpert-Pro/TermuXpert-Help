// ============================================================
// figuresvt.js  —  درس "الحساب المثلثي" (Calcul trigonométrique)
// هاذ الملف خاص بهاذ الدرس بوحدو (كاين فـ نفس الجدر ديال part1..5)،
// ماشي نفس figuresvt.js العام ديال دروس أخرى.
//
// كيبني فوق svg-utils.js (SvgUtils) اللي كيوفر الدائرة المثلثية
// بإحداثيات رياضية دقيقة بلا أي تشويه (بخلاف الـ <canvas> القديم
// اللي كان width≠height كيحول الدائرة لبيضاوية).
//
// كل رسم صمم على حساب السؤال/الفقرة المرتبطة بيه بالضبط:
//   - الدائرة المثلثية + الفاصلة المنحنية        -> part1.html
//   - جمع الزوايا / نصف الزاوية                 -> part2.html
//   - تحويل a cosx+b sinx / مجموع لجداء          -> part3.html
//   - معادلات ومتراجحات مثلثية                  -> part4.html
//   - الملخص العام                              -> part5.html
//
// الاستعمال (فكل part*.html):
//   <script src="{{BASE}}assets/js/svg-utils.js"></script>
//   <script src="figuresvt.js"></script>
// ============================================================

(function () {
    const U = (typeof SvgUtils !== 'undefined') ? SvgUtils : window.SvgUtils;
    if (!U) return; // svg-utils.js خاصو يتحمل قبل هاذ الملف

    const NS = 'http://www.w3.org/2000/svg';
    const COL = {
        gold: '#F4D03F',
        red: '#FF6B6B',
        green: '#A8FF78',
        blue: '#4D9DE0',
        teal: U.COLORS.arrow,
        muted: U.COLORS.muted
    };

    function el(tag, attrs) {
        const e = document.createElementNS(NS, tag);
        if (attrs) for (const k in attrs) e.setAttribute(k, attrs[k]);
        return e;
    }

    // ------------------------------------------------------------
    // أساس دائرة مثلثية: محاور + دائرة نصف قطرها 1 (مدى مربّع دائماً
    // باش الدائرة توليش بيضاوية)
    // ------------------------------------------------------------
    function circleBase(id, opts) {
        opts = opts || {};
        const rng = opts.range || { xMin: -1.5, xMax: 1.5, yMin: -1.5, yMax: 1.5 };
        const s = U.setupSVG(id, rng);
        if (!s) return null;
        U.drawAxesWithArrows(s, { xLabel: opts.xLabel || 'x', yLabel: opts.yLabel || 'y' });
        U.drawCircle(s, 0, 0, 1, { color: COL.teal, lineWidth: 1.7 });
        return s;
    }

    // نقطة M(α) على الدائرة + (اختياري) نصف قطر OM + إسقاطات على المحاور
    function trigPoint(s, alpha, opts) {
        opts = opts || {};
        const R = opts.R || 1;
        const x = R * Math.cos(alpha), y = R * Math.sin(alpha);
        const color = opts.color || COL.teal;
        if (opts.radiusLine !== false) {
            U.drawLine(s, 0, 0, x, y, { color, dashed: !!opts.dashedRadius, lineWidth: 1.1 });
        }
        if (opts.projections) {
            U.drawLine(s, x, 0, x, y, { color: '#888888', dashed: true, dashPattern: [3, 3], lineWidth: 0.7 });
            U.drawLine(s, 0, y, x, y, { color: '#888888', dashed: true, dashPattern: [3, 3], lineWidth: 0.7 });
        }
        U.drawPoint(s, {
            x, y, label: opts.label, color, showCoords: false,
            offsetX: opts.offsetX, offsetY: opts.offsetY, radius: opts.pointR
        });
        return { x, y };
    }

    // قوس صغير قرب المركز لتبيان زاوية (بين a0 و a1)، بشعاع r، مع سهم اختياري
    function angleArc(s, r, a0, a1, opts) {
        opts = opts || {};
        const steps = opts.steps || 32;
        let d = '';
        for (let i = 0; i <= steps; i++) {
            const a = a0 + (a1 - a0) * (i / steps);
            const x = r * Math.cos(a), y = r * Math.sin(a);
            d += (i === 0 ? 'M ' : 'L ') + x + ' ' + (-y) + ' ';
        }
        s.svg.appendChild(el('path', {
            d: d.trim(), fill: 'none',
            stroke: opts.color || COL.gold,
            'stroke-width': (opts.lineWidth || 1.6) * 0.025
        }));
        if (opts.arrow) {
            const x2 = r * Math.cos(a1), y2 = r * Math.sin(a1);
            const tangentAngle = a1 + (a1 >= a0 ? Math.PI / 2 : -Math.PI / 2);
            const ah = 0.09;
            const p1x = x2 - ah * Math.cos(tangentAngle - Math.PI / 7);
            const p1y = y2 - ah * Math.sin(tangentAngle - Math.PI / 7);
            const p2x = x2 - ah * Math.cos(tangentAngle + Math.PI / 7);
            const p2y = y2 - ah * Math.sin(tangentAngle + Math.PI / 7);
            s.svg.appendChild(el('polygon', {
                points: `${x2},${-y2} ${p1x},${-p1y} ${p2x},${-p2y}`,
                fill: opts.color || COL.gold
            }));
        }
    }

    // قوس سميك مباشرة على محيط الدائرة (r=1) لتلوين "منطقة الحل"
    function arcOnCircle(s, a0, a1, opts) {
        opts = opts || {};
        angleArc(s, 1, a0, a1, { color: opts.color || COL.teal, lineWidth: opts.lineWidth || 9, steps: 60 });
    }

    // نقطة "مفرغة" (غير محسوبة) على الدائرة، لتبيان نقطة مستبعدة (نقطة قطع/مقارب)
    function openPointOnCircle(s, alpha, color, r) {
        const x = Math.cos(alpha), y = Math.sin(alpha);
        s.svg.appendChild(el('circle', {
            cx: x, cy: -y, r: r || (s.fontSize * 0.28),
            fill: '#0D1117', stroke: color, 'stroke-width': 0.045
        }));
    }

    // علامة تدريجية + تسمية على المحور x (لمنحنيات x بالراديان)
    function xTick(s, xVal, label, opts) {
        opts = opts || {};
        U.drawLine(s, xVal, -s.fontSize * 0.35, xVal, s.fontSize * 0.35, { color: COL.muted, lineWidth: 1 });
        U.drawNote(s, label, xVal - s.fontSize * 0.7, -s.fontSize * 1.1, { color: COL.muted, fontSize: s.fontSize * 0.8 });
    }

    // ============================================================
    // PART 1 — Cercle trigonométrique / Abscisses curvilignes
    // ============================================================

    function drawCercleTrigo(id) {
        const s = circleBase(id || 'cercleTrigo', { range: { xMin: -1.6, xMax: 1.6, yMin: -1.6, yMax: 1.6 } });
        if (!s) return;
        U.drawPoint(s, { x: 1, y: 0, label: 'I', color: COL.gold, showCoords: false, offsetX: 0.12, offsetY: -0.05 });
        U.drawPoint(s, { x: -1, y: 0, label: "I'", color: COL.gold, showCoords: false, offsetX: -0.24, offsetY: -0.05 });
        U.drawPoint(s, { x: 0, y: 1, label: 'J', color: COL.gold, showCoords: false, offsetX: 0.1, offsetY: 0.14 });
        U.drawPoint(s, { x: 0, y: -1, label: "J'", color: COL.gold, showCoords: false, offsetX: 0.1, offsetY: -0.2 });
        U.drawNote(s, 'O', 0.08, -0.18, { color: COL.muted });
        U.drawNote(s, '(C)', 0.78, 0.92, { color: '#FFFFFF', fontSize: s.fontSize * 0.85 });
        angleArc(s, 1.32, Math.PI * 0.32, Math.PI * 0.68, { color: COL.gold, lineWidth: 1.6, arrow: true });
        U.drawNote(s, 'sens +', -0.42, 1.42, { color: COL.gold, fontSize: s.fontSize * 0.7 });
    }

    function drawAbscissePrincipale() {
        const s = circleBase('abscissePrincipale');
        if (!s) return;
        const alpha = Math.PI / 4;
        U.drawPoint(s, { x: 1, y: 0, label: 'I', color: COL.muted, showCoords: false, offsetX: 0.1, offsetY: -0.05 });
        angleArc(s, 0.3, 0, alpha, { color: COL.gold, lineWidth: 1.8 });
        U.drawNote(s, 'α', 0.42 * Math.cos(alpha / 2), 0.42 * Math.sin(alpha / 2), { color: COL.gold, fontSize: s.fontSize * 0.95 });
        trigPoint(s, alpha, { color: COL.teal, label: 'M', offsetX: 0.12, offsetY: 0.12, dashedRadius: true });
        U.drawNote(s, 'O', 0.08, -0.16, { color: COL.muted });
    }

    function drawAbscissesCurvilignes() {
        const s = U.setupSVG('abscissesCurvilignes', { xMin: -1.8, xMax: 1.8, yMin: -3.7, yMax: 1.8 });
        if (!s) return;
        U.drawCircle(s, 0, 0, 1, { color: COL.teal, lineWidth: 1.6 });
        U.drawLine(s, -1.8, 0, 1.8, 0, { color: U.COLORS.axis });
        U.drawLine(s, 0, -1.8, 0, 1.8, { color: U.COLORS.axis });
        const alpha = Math.PI / 3;
        const { x: mx, y: my } = trigPoint(s, alpha, { color: COL.teal, label: 'M', offsetX: 0.1, offsetY: 0.12 });

        // droite (Δ) enroulée autour du cercle
        const y0 = -2.7;
        U.drawLine(s, -1.8, y0, 1.8, y0, { color: COL.blue, lineWidth: 1.2 });
        U.drawNote(s, '(Δ)', 1.55, y0 + 0.3, { color: COL.blue, fontSize: s.fontSize * 0.85 });

        const scale = 0.42;
        for (let k = -1; k <= 1; k++) {
            const x = alpha * scale + k * 2 * Math.PI * scale;
            if (x < -1.7 || x > 1.7) continue;
            U.drawPoint(s, { x, y: y0, color: COL.red, showCoords: false, radius: s.fontSize * 0.24 });
            const lbl = k === 0 ? 'α' : ('α' + (k > 0 ? '+' : '') + k + '·2π');
            U.drawNote(s, lbl, x - 0.45, y0 - 0.4, { color: COL.muted, fontSize: s.fontSize * 0.6 });
        }

        // relie M à son image (k=0) sur (Δ)
        const x0 = alpha * scale;
        U.drawLine(s, mx, my, mx, y0 + 0.55, { color: COL.red, dashed: true, lineWidth: 0.8 });
        U.drawLine(s, mx, y0 + 0.55, x0, y0, { color: COL.red, dashed: true, lineWidth: 0.8 });

        U.drawNote(s, "Chaque tour (k ∈ ℤ) redonne le même point M", -1.75, 1.6, { color: COL.muted, fontSize: s.fontSize * 0.6 });
    }

    function drawTableauValeurs(id) {
        const s = circleBase(id || 'tableauValeurs');
        if (!s) return;
        const angles = [
            { a: Math.PI / 6, label: 'π/6', color: COL.gold },
            { a: Math.PI / 4, label: 'π/4', color: COL.red },
            { a: Math.PI / 3, label: 'π/3', color: COL.green },
            { a: Math.PI / 2, label: 'π/2', color: COL.blue }
        ];
        angles.forEach(o => trigPoint(s, o.a, { color: o.color, label: o.label, offsetX: 0.09, offsetY: 0.1, radiusLine: false }));
        U.drawPoint(s, { x: 1, y: 0, label: '0', color: COL.muted, showCoords: false, offsetX: 0.08, offsetY: -0.14 });
    }

    function drawExercice2() {
        const s = circleBase('exercice2', { range: { xMin: -1.7, xMax: 1.7, yMin: -1.7, yMax: 1.7 } });
        if (!s) return;
        const pts = [
            { a: Math.PI / 4, label: 'π/4', color: COL.gold },
            { a: 3 * Math.PI / 4, label: '3π/4', color: COL.red },
            { a: -5 * Math.PI / 6, label: '-5π/6', color: COL.green },
            { a: 7 * Math.PI / 4, label: '7π/4', color: COL.blue }
        ];
        pts.forEach(o => trigPoint(s, o.a, { color: o.color, label: o.label, offsetX: 0.09, offsetY: 0.1, dashedRadius: true }));
    }

    // ============================================================
    // PART 2 — Formules d'addition / demi-angle
    // ============================================================

    function drawAdditionGraph() {
        const s = circleBase('additionGraph');
        if (!s) return;
        trigPoint(s, Math.PI / 6, { color: COL.gold, label: 'a', offsetX: 0.1, offsetY: 0.1, dashedRadius: true });
        trigPoint(s, Math.PI / 4, { color: COL.red, label: 'b', offsetX: 0.1, offsetY: 0.1, dashedRadius: true });
        trigPoint(s, Math.PI / 6 + Math.PI / 4, { color: COL.green, label: 'a+b', offsetX: 0.06, offsetY: 0.14, dashedRadius: true });
        U.drawNote(s, 'a = π/6 , b = π/4', -1.45, -1.4, { color: COL.muted, fontSize: s.fontSize * 0.65 });
    }

    function drawDemiAngleGraph() {
        const s = circleBase('demiAngleGraph');
        if (!s) return;
        trigPoint(s, Math.PI / 4, { color: COL.red, label: 'x = π/4', offsetX: 0.1, offsetY: 0.1, dashedRadius: true, projections: true });
        trigPoint(s, Math.PI / 8, { color: COL.gold, label: 'x/2 = π/8', offsetX: 0.1, offsetY: 0.14, dashedRadius: true, projections: true });
        U.drawNote(s, 'cos(π/8)≈0.924 ; sin(π/8)≈0.383', -1.45, -1.4, { color: COL.muted, fontSize: s.fontSize * 0.58 });
    }

    // ============================================================
    // PART 3 — Transformations trigonométriques
    // ============================================================

    function drawTransformationGraph() {
        const xr = 2 * Math.PI + 0.35;
        const s = U.setupSVG('transformationGraph', { xMin: -xr, xMax: xr, yMin: -2.3, yMax: 2.3 });
        if (!s) return;
        U.drawAxesWithArrows(s, { xLabel: 'x', yLabel: 'y' });
        U.drawCurve(s, x => Math.cos(x) - Math.sin(x), -2 * Math.PI, 2 * Math.PI, { color: COL.teal, steps: 400 });
        U.drawAsymptote(s, { y: Math.sqrt(2), color: COL.gold, dashPattern: [4, 4], label: 'y = √2', fontSize: s.fontSize * 0.7 });
        U.drawAsymptote(s, { y: -Math.sqrt(2), color: COL.gold, dashPattern: [4, 4], label: 'y = -√2', fontSize: s.fontSize * 0.7 });
        [-2, -1, 1, 2].forEach(k => xTick(s, k * Math.PI, (k === -1 ? '-π' : k === 1 ? 'π' : (k + 'π'))));
        U.drawNote(s, 'y = cos x - sin x = √2·cos(x + π/4)', -xr + 0.15, 2.12, { color: COL.muted, fontSize: s.fontSize * 0.6 });
    }

    function drawSommeProduitGraph() {
        const s = circleBase('sommeProduitGraph');
        if (!s) return;
        const p = Math.PI / 3, q = Math.PI / 6;
        trigPoint(s, p, { color: COL.gold, label: 'p=π/3', offsetX: 0.1, offsetY: 0.1, dashedRadius: true });
        trigPoint(s, q, { color: COL.red, label: 'q=π/6', offsetX: 0.1, offsetY: -0.14, dashedRadius: true });
        const mid = (p + q) / 2;
        U.drawLine(s, 0, 0, 1.3 * Math.cos(mid), 1.3 * Math.sin(mid), { color: COL.teal, lineWidth: 1.3, dashed: true });
        U.drawNote(s, '(p+q)/2', 1.05 * Math.cos(mid), 1.32 * Math.sin(mid), { color: COL.teal, fontSize: s.fontSize * 0.62 });
        angleArc(s, 0.22, q, p, { color: COL.green, lineWidth: 1.8 });
        U.drawNote(s, '(p-q)/2', 0.5 * Math.cos(mid) - 0.1, 0.5 * Math.sin(mid), { color: COL.green, fontSize: s.fontSize * 0.6 });
    }

    // ============================================================
    // PART 4 — Équations et inéquations trigonométriques
    // ============================================================

    function drawCosEqGraph() {
        const s = circleBase('cosEqGraph');
        if (!s) return;
        trigPoint(s, Math.PI / 3, { color: COL.teal, label: 'M(π/3)', offsetX: 0.1, offsetY: 0.1 });
        trigPoint(s, -Math.PI / 3, { color: COL.teal, label: "M'(-π/3)", offsetX: 0.1, offsetY: -0.18 });
        U.drawLine(s, 0.5, -1.42, 0.5, 1.42, { color: COL.gold, dashed: true, lineWidth: 1.2 });
        U.drawNote(s, 'x = 1/2', 0.55, 1.32, { color: COL.gold, fontSize: s.fontSize * 0.85 });
    }

    function drawSinEqGraph() {
        const s = circleBase('sinEqGraph', { range: { xMin: -1.7, xMax: 1.7, yMin: -1.5, yMax: 1.5 } });
        if (!s) return;
        trigPoint(s, Math.PI / 6, { color: COL.teal, label: 'M(π/6)', offsetX: 0.1, offsetY: 0.1 });
        trigPoint(s, Math.PI - Math.PI / 6, { color: COL.teal, label: "M'(5π/6)", offsetX: -0.68, offsetY: 0.1 });
        U.drawLine(s, -1.42, 0.5, 1.42, 0.5, { color: COL.gold, dashed: true, lineWidth: 1.2 });
        U.drawNote(s, 'y = 1/2', 1.12, 0.65, { color: COL.gold, fontSize: s.fontSize * 0.85 });
    }

    function drawTanEqGraph() {
        const s = circleBase('tanEqGraph', { range: { xMin: -1.6, xMax: 1.6, yMin: -1.6, yMax: 1.6 } });
        if (!s) return;
        trigPoint(s, Math.PI / 4, { color: COL.teal, label: 'M(π/4)', offsetX: 0.1, offsetY: 0.1 });
        trigPoint(s, Math.PI / 4 + Math.PI, { color: COL.teal, label: "M'(5π/4)", offsetX: -0.7, offsetY: -0.14 });
        U.drawLine(s, 1, -1.5, 1, 1.5, { color: COL.blue, lineWidth: 1.2 });
        U.drawNote(s, '(droite des tangentes)', 1.06, 1.42, { color: COL.blue, fontSize: s.fontSize * 0.55 });
        U.drawPoint(s, { x: 1, y: 1, color: COL.gold, showCoords: false, label: 'tan x = 1', offsetX: 0.08, offsetY: 0.06 });
        U.drawLine(s, 0, 0, 1.42 * Math.cos(Math.PI / 4), 1.42 * Math.sin(Math.PI / 4), { color: COL.gold, dashed: true, lineWidth: 1 });
    }

    function drawTransformationEqGraph() {
        const s = U.setupSVG('transformationEqGraph', { xMin: -0.3, xMax: 2 * Math.PI + 0.3, yMin: -0.9, yMax: 4.7 });
        if (!s) return;
        U.drawAxesWithArrows(s, { xLabel: 'x', yLabel: 'y' });
        U.drawCurve(s, x => Math.sqrt(3) * Math.cos(3 * x) + Math.sin(3 * x) + 2, -0.2, 2 * Math.PI + 0.2, { color: COL.teal, steps: 500 });
        U.drawAsymptote(s, { y: 0, color: COL.red, dashPattern: [4, 4], label: 'y = 0', fontSize: s.fontSize * 0.7 });
        const x0 = 7 * Math.PI / 18;
        U.drawPoint(s, { x: x0, y: 0, color: COL.gold, showCoords: false, label: 'x=7π/18', offsetX: 0.05, offsetY: 0.42 });
        [1, 2, 3, 4, 5, 6].forEach(k => xTick(s, k * Math.PI / 3, 'π/3·' + k, {}));
        U.drawNote(s, 'y = 2cos(3x - π/6) + 2', 0.25, 4.42, { color: COL.muted, fontSize: s.fontSize * 0.65 });
    }

    function drawCosIneqGraph() {
        const s = circleBase('cosIneqGraph');
        if (!s) return;
        arcOnCircle(s, -Math.PI / 3, Math.PI / 3, { color: COL.teal, lineWidth: 9 });
        trigPoint(s, Math.PI / 3, { color: COL.gold, label: 'π/3', offsetX: 0.08, offsetY: 0.1 });
        trigPoint(s, -Math.PI / 3, { color: COL.gold, label: '-π/3', offsetX: 0.08, offsetY: -0.18 });
        U.drawNote(s, 'cos x ≥ 1/2', -0.42, -1.4, { color: COL.teal, fontSize: s.fontSize * 0.85 });
    }

    function drawSinIneqGraph() {
        const s = circleBase('sinIneqGraph', { range: { xMin: -1.7, xMax: 1.7, yMin: -1.5, yMax: 1.5 } });
        if (!s) return;
        arcOnCircle(s, Math.PI / 6, 5 * Math.PI / 6, { color: COL.teal, lineWidth: 9 });
        trigPoint(s, Math.PI / 6, { color: COL.gold, label: 'π/6', offsetX: 0.1, offsetY: 0.1 });
        trigPoint(s, 5 * Math.PI / 6, { color: COL.gold, label: '5π/6', offsetX: -0.68, offsetY: 0.1 });
        U.drawNote(s, 'sin x ≥ 1/2', -0.42, -1.32, { color: COL.teal, fontSize: s.fontSize * 0.85 });
    }

    function drawTanIneqGraph() {
        const s = circleBase('tanIneqGraph', { range: { xMin: -1.6, xMax: 1.6, yMin: -1.6, yMax: 1.6 } });
        if (!s) return;
        arcOnCircle(s, Math.PI / 4, Math.PI / 2 - 0.02, { color: COL.teal, lineWidth: 9 });
        arcOnCircle(s, 5 * Math.PI / 4, 3 * Math.PI / 2 - 0.02, { color: COL.teal, lineWidth: 9 });
        trigPoint(s, Math.PI / 4, { color: COL.gold, label: 'π/4', offsetX: 0.1, offsetY: 0.1 });
        trigPoint(s, 5 * Math.PI / 4, { color: COL.gold, label: '5π/4', offsetX: -0.68, offsetY: -0.14 });
        openPointOnCircle(s, Math.PI / 2, COL.red);
        openPointOnCircle(s, 3 * Math.PI / 2, COL.red);
        U.drawNote(s, 'π/2 (exclu)', -0.02, 1.34, { color: COL.red, fontSize: s.fontSize * 0.55 });
        U.drawNote(s, '3π/2 (exclu)', -0.4, -1.4, { color: COL.red, fontSize: s.fontSize * 0.55 });
        U.drawNote(s, 'tan x ≥ 1', -1.5, -1.5, { color: COL.teal, fontSize: s.fontSize * 0.55 });
    }

    // ============================================================
    // PART 5 — Résumé général
    // ============================================================

    function drawIneqResumeGraph() {
        const s = circleBase('ineqResumeGraph');
        if (!s) return;
        arcOnCircle(s, -Math.PI / 3, Math.PI / 3, { color: COL.teal, lineWidth: 9 });
        trigPoint(s, Math.PI / 3, { color: COL.gold, label: 'α', offsetX: 0.08, offsetY: 0.1 });
        trigPoint(s, -Math.PI / 3, { color: COL.gold, label: '-α', offsetX: 0.08, offsetY: -0.18 });
        U.drawNote(s, 'Exemple : cos x ≥ cos α ⟺ x ∈ [-α, α]', -1.45, -1.42, { color: COL.muted, fontSize: s.fontSize * 0.55 });
    }

    // ------------------------------------------------------------
    function initFigures() {
        drawCercleTrigo('cercleTrigo');
        drawAbscissePrincipale();
        drawAbscissesCurvilignes();
        drawTableauValeurs('tableauValeurs');
        drawExercice2();

        drawAdditionGraph();
        drawDemiAngleGraph();

        drawTransformationGraph();
        drawSommeProduitGraph();

        drawCosEqGraph();
        drawSinEqGraph();
        drawTanEqGraph();
        drawTransformationEqGraph();
        drawCosIneqGraph();
        drawSinIneqGraph();
        drawTanIneqGraph();

        drawCercleTrigo('cercleResume');
        drawIneqResumeGraph();
        drawTableauValeurs('valeursRemarquablesGraph');
    }

    window.XpertTrigoFigures = { initFigures };

    document.addEventListener('DOMContentLoaded', function () {
        setTimeout(initFigures, 150);
    });
})();

