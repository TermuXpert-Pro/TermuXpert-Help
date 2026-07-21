// ============================================================
// figuresvt.js  —  درس "دوران جسم صلب حول محور ثابت"
// (Rotation d'un solide autour d'un axe fixe)
// هاذ الملف خاص بهاذ الدرس بوحدو (كاين فـ نفس الجدر ديال part1..6).
//
// كيبني فوق svg-utils.js (SvgUtils). كل رسم صمم بدقة على حساب
// القيم العددية والمثال المرتبط بالفقرة بالضبط (rayons، زوايا، أزمنة،
// سرعات...)، ماشي رسم عشوائي:
//   - تعريف الدوران / تعليم نقطة              -> part1.html
//   - الفاصلة الزاوية / الفاصلة المنحنية       -> part2.html
//   - السرعة الزاوية (متوسطة/لحظية) + v=rω     -> part3.html
//   - الدور / التردد / الحركة المنتظمة         -> part4.html
//   - المعادلة الزمنية + التطبيق (نشاط)        -> part5.html
//   - الملخص العام                            -> part6.html
//
// الاستعمال (فكل part*.html):
//   <script src="{{BASE}}assets/js/svg-utils.js"></script>
//   <script src="figuresvt.js"></script>
// ============================================================

(function () {
    const U = (typeof SvgUtils !== 'undefined') ? SvgUtils : window.SvgUtils;
    if (!U) return;

    const NS = 'http://www.w3.org/2000/svg';
    const COL = {
        axis: '#FF6B6B',   // axe de rotation (Δ)
        traj: U.COLORS.arrow, // trajectoire circulaire
        gold: '#F4D03F',
        green: '#A8FF78',
        purple: '#BB8FCE',
        blue: '#4D9DE0',
        muted: U.COLORS.muted
    };

    function el(tag, attrs) {
        const e = document.createElementNS(NS, tag);
        if (attrs) for (const k in attrs) e.setAttribute(k, attrs[k]);
        return e;
    }

    // ------------------------------------------------------------
    // أدوات مشتركة
    // ------------------------------------------------------------

    // أساس دائرة (مدى مربّع دائماً باش الدائرة توليش بيضاوية)
    function circleBase(id, opts) {
        opts = opts || {};
        const rng = opts.range || { xMin: -1.6, xMax: 1.6, yMin: -1.6, yMax: 1.6 };
        const s = U.setupSVG(id, rng);
        if (!s) return null;
        if (opts.axes !== false) U.drawAxesWithArrows(s, { xLabel: opts.xLabel || '', yLabel: opts.yLabel || '', labels: false });
        U.drawCircle(s, 0, 0, opts.R || 1, { color: COL.traj, lineWidth: 1.7 });
        return s;
    }

    // قوس صغير قرب المركز لتبيان زاوية، مع سهم اختياري فالنهاية
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
            const tangent = a1 + (a1 >= a0 ? Math.PI / 2 : -Math.PI / 2);
            const ah = 0.09;
            const p1x = x2 - ah * Math.cos(tangent - Math.PI / 7);
            const p1y = y2 - ah * Math.sin(tangent - Math.PI / 7);
            const p2x = x2 - ah * Math.cos(tangent + Math.PI / 7);
            const p2y = y2 - ah * Math.sin(tangent + Math.PI / 7);
            s.svg.appendChild(el('polygon', {
                points: `${x2},${-y2} ${p1x},${-p1y} ${p2x},${-p2y}`,
                fill: opts.color || COL.gold
            }));
        }
    }

    // قوس سميك مباشرة على محيط الدائرة (تلوين قوس المسافة المنحنية s)
    function arcOnCircle(s, R, a0, a1, opts) {
        opts = opts || {};
        angleArc(s, R, a0, a1, { color: opts.color || COL.green, lineWidth: opts.lineWidth || 6, steps: 48 });
    }

    // نقطة على دائرة نصف قطرها R بزاوية alpha + (اختياري) نصف قطر OM
    function ptOnCircle(s, alpha, R, opts) {
        opts = opts || {};
        const x = R * Math.cos(alpha), y = R * Math.sin(alpha);
        if (opts.radiusLine) {
            U.drawLine(s, 0, 0, x, y, { color: opts.radiusColor || opts.color || COL.gold, dashed: !!opts.dashedRadius, lineWidth: 1.1 });
        }
        U.drawPoint(s, {
            x, y, label: opts.label, color: opts.color || COL.traj, showCoords: false,
            offsetX: opts.offsetX, offsetY: opts.offsetY, radius: opts.pointR
        });
        return { x, y };
    }

    // علامة تدريجية بسيطة على المحور x لمنحنيات θ(t)
    function xTick(s, xVal, label) {
        U.drawLine(s, xVal, -s.fontSize * 0.3, xVal, s.fontSize * 0.3, { color: COL.muted, lineWidth: 1 });
        U.drawNote(s, label, xVal - s.fontSize * 0.7, -s.fontSize * 0.9, { color: COL.muted, fontSize: s.fontSize * 0.75 });
    }
    function yTick(s, yVal, label) {
        U.drawLine(s, -s.fontSize * 0.3, yVal, s.fontSize * 0.3, yVal, { color: COL.muted, lineWidth: 1 });
        U.drawNote(s, label, s.fontSize * 0.45, yVal + s.fontSize * 0.25, { color: COL.muted, fontSize: s.fontSize * 0.75 });
    }

    // ============================================================
    // PART 1 — Exemple / Définition / Repérage
    // ============================================================

    // Solide en rotation : axe (Δ) + trajectoire + points mobiles (A,B) / immobiles (M,N) sur l'axe
    function drawGraphRotation() {
        const s = U.setupSVG('graphRotation', { xMin: -2, xMax: 2, yMin: -2.1, yMax: 2.1 });
        if (!s) return;
        // axe de rotation (Δ), vertical, en pointillés rouges
        U.drawLine(s, 0, -1.95, 0, 1.95, { color: COL.axis, dashed: true, dashPattern: [6, 4], lineWidth: 2 });
        U.drawNote(s, '(Δ)', 0.12, 1.85, { color: COL.axis, fontSize: s.fontSize * 0.9 });

        // trajectoire circulaire (unique, autour du centre O sur l'axe)
        U.drawCircle(s, 0, 0, 1.15, { color: COL.traj, lineWidth: 1.6, dashed: true, dashPattern: [4, 4] });
        U.drawNote(s, 'O', 0.08, -0.2, { color: COL.muted, fontSize: s.fontSize * 0.8 });

        // points A et B sur la trajectoire (mobiles)
        const A = ptOnCircle(s, -Math.PI / 4, 1.15, { color: COL.traj, label: 'A', offsetX: 0.1, offsetY: 0.1 });
        const B = ptOnCircle(s, 2 * Math.PI / 3, 1.15, { color: COL.gold, label: 'B', offsetX: -0.35, offsetY: 0.14 });

        // flèches de mouvement tangentes en A et B (sens de rotation)
        const tA = -Math.PI / 4 + Math.PI / 2;
        U.drawVector(s, A.x, A.y, A.x + 0.4 * Math.cos(tA), A.y + 0.4 * Math.sin(tA), { color: COL.traj, arrowSize: s.fontSize * 0.3 });
        const tB = 2 * Math.PI / 3 + Math.PI / 2;
        U.drawVector(s, B.x, B.y, B.x + 0.4 * Math.cos(tB), B.y + 0.4 * Math.sin(tB), { color: COL.gold, arrowSize: s.fontSize * 0.3 });

        // points M et N SUR l'axe (Δ) lui-même : ils sont immobiles
        U.drawPoint(s, { x: 0, y: 1.55, label: 'M', color: COL.purple, showCoords: false, offsetX: 0.12, offsetY: 0.02 });
        U.drawPoint(s, { x: 0, y: -1.55, label: 'N', color: COL.green, showCoords: false, offsetX: 0.12, offsetY: -0.05 });
        U.drawNote(s, '(immobiles, sur l\'axe)', -1.9, -1.85, { color: COL.muted, fontSize: s.fontSize * 0.55 });
    }

    // Repérage de M sur sa trajectoire : M0 (origine), M (position), θ, s
    function drawGraphReperage(id) {
        const s = circleBase(id || 'graphReperage', { axes: false });
        if (!s) return;
        U.drawNote(s, 'O', 0.08, -0.16, { color: COL.muted });
        const a0 = -Math.PI / 4, a1 = Math.PI / 3;
        const M0 = ptOnCircle(s, a0, 1, { color: COL.traj, label: 'M₀', offsetX: 0.1, offsetY: -0.16, radiusLine: true, dashedRadius: false });
        arcOnCircle(s, 1, a0, a1, { color: COL.green, lineWidth: 6 });
        const M = ptOnCircle(s, a1, 1, { color: COL.gold, label: 'M', offsetX: 0.1, offsetY: 0.12, radiusLine: true, dashedRadius: true, radiusColor: COL.gold });
        angleArc(s, 0.34, a0, a1, { color: COL.gold, lineWidth: 1.6 });
        const mid = (a0 + a1) / 2;
        U.drawNote(s, 'θ', 0.5 * Math.cos(mid), 0.5 * Math.sin(mid), { color: COL.gold, fontSize: s.fontSize * 0.95 });
        U.drawNote(s, 's', 1.22 * Math.cos(mid), 1.22 * Math.sin(mid), { color: COL.green, fontSize: s.fontSize * 0.95 });
    }

    // ============================================================
    // PART 2 — Abscisse angulaire / curviligne
    // ============================================================

    // θ = (OM0,OM), positif si sens direct : on illustre le cas positif avec la flèche du sens +
    function drawGraphAngulaire() {
        const s = circleBase('graphAngulaire');
        if (!s) return;
        U.drawNote(s, 'O', 0.08, -0.16, { color: COL.muted });
        const a0 = 0, a1 = 2 * Math.PI / 3;
        ptOnCircle(s, a0, 1, { color: COL.traj, label: 'M₀', offsetX: 0.1, offsetY: -0.05, radiusLine: true });
        ptOnCircle(s, a1, 1, { color: COL.gold, label: 'M', offsetX: -0.15, offsetY: 0.18, radiusLine: true, dashedRadius: true, radiusColor: COL.gold });
        angleArc(s, 0.36, a0, a1, { color: COL.gold, lineWidth: 1.8, arrow: true });
        const mid = (a0 + a1) / 2;
        U.drawNote(s, '+θ', 0.55 * Math.cos(mid), 0.55 * Math.sin(mid), { color: COL.gold, fontSize: s.fontSize * 0.95 });
        U.drawNote(s, 'sens direct (θ > 0)', -1.45, -1.4, { color: COL.green, fontSize: s.fontSize * 0.65 });
    }

    // s = arc M0M : on colorie l'arc parcouru + flèche indiquant le sens positif
    function drawGraphCurviligne() {
        const s = circleBase('graphCurviligne');
        if (!s) return;
        U.drawNote(s, 'O', 0.08, -0.16, { color: COL.muted });
        const a0 = -Math.PI / 6, a1 = 5 * Math.PI / 6;
        ptOnCircle(s, a0, 1, { color: COL.traj, label: 'M₀', offsetX: 0.1, offsetY: -0.14 });
        arcOnCircle(s, 1, a0, a1, { color: COL.green, lineWidth: 7 });
        ptOnCircle(s, a1, 1, { color: COL.gold, label: 'M', offsetX: -0.3, offsetY: 0.16 });
        angleArc(s, 1.22, a0, a1, { color: COL.green, lineWidth: 1.4, arrow: true });
        const mid = (a0 + a1) / 2;
        U.drawNote(s, 's = arc M₀M', 0.05, 0.05, { color: COL.green, fontSize: s.fontSize * 0.62 });
        U.drawNote(s, 'sens positif choisi', -1.45, -1.4, { color: COL.muted, fontSize: s.fontSize * 0.6 });
    }

    // ============================================================
    // PART 3 — Vitesse angulaire moyenne / instantanée / v = rω
    // ============================================================

    // M1(θ1=π/6, t1=0.2s) et M2(θ2=π/2, t2=0.8s), Δθ visible
    function drawGraphVitesse() {
        const s = circleBase('graphVitesse');
        if (!s) return;
        U.drawNote(s, 'O', 0.08, -0.16, { color: COL.muted });
        const a1 = Math.PI / 6, a2 = Math.PI / 2;
        ptOnCircle(s, a1, 1, { color: COL.traj, label: 'M₁ (t₁=0.2s)', offsetX: 0.08, offsetY: -0.02, radiusLine: true });
        ptOnCircle(s, a2, 1, { color: COL.gold, label: 'M₂ (t₂=0.8s)', offsetX: -0.35, offsetY: 0.16, radiusLine: true, dashedRadius: true, radiusColor: COL.gold });
        angleArc(s, 0.4, a1, a2, { color: COL.green, lineWidth: 1.8 });
        const mid = (a1 + a2) / 2;
        U.drawNote(s, 'Δθ', 0.58 * Math.cos(mid), 0.58 * Math.sin(mid), { color: COL.green, fontSize: s.fontSize * 0.9 });
        U.drawNote(s, 'θ₁=π/6', 1.35 * Math.cos(a1), 1.32 * Math.sin(a1), { color: COL.muted, fontSize: s.fontSize * 0.6 });
        U.drawNote(s, 'θ₂=π/2', -0.35, 1.35, { color: COL.muted, fontSize: s.fontSize * 0.6 });
    }

    // θ(t) quasi-linéaire (table de valeurs) + tangente en t=0.2s (pente = ω instantanée)
    function drawGraphInstant() {
        const s = U.setupSVG('graphInstant', { xMin: -0.08, xMax: 0.85, yMin: -0.18, yMax: 1.62 });
        if (!s) return;
        U.drawAxesWithArrows(s, { xLabel: 't (s)', yLabel: 'θ (rad)' });
        U.drawCurve(s, x => 3.15 * x, 0, 0.44, { color: COL.traj, lineWidth: 2 });

        const table = [[0, 0], [0.1, 0.31], [0.2, 0.63], [0.3, 0.94], [0.4, 1.26]];
        table.forEach(([t, th]) => U.drawPoint(s, { x: t, y: th, color: COL.gold, showCoords: false, radius: s.fontSize * 0.22 }));

        // tangente mise en évidence autour de ti = 0.2 (même pente ici car mvt ~uniforme)
        U.drawLine(s, 0.08, 3.15 * 0.08, 0.32, 3.15 * 0.32, { color: COL.green, lineWidth: 2.4, dashed: true, dashPattern: [3, 3] });
        U.drawNote(s, 'tangente en tᵢ=0.2s', 0.48, 1.5, { color: COL.green, fontSize: s.fontSize * 0.62 });
        U.drawNote(s, 'pente = ωᵢ = 3.15 rad/s', 0.48, 1.3, { color: COL.muted, fontSize: s.fontSize * 0.58 });
        xTick(s, 0.2, '0.2');
    }

    // v = r·ω : deux points à rayons différents, même ω, vecteurs vitesse tangentiels de longueurs différentes
    function drawGraphRelation() {
        const s = U.setupSVG('graphRelation', { xMin: -1.7, xMax: 1.7, yMin: -1.6, yMax: 1.6 });
        if (!s) return;
        U.drawCircle(s, 0, 0, 0.55, { color: COL.muted, lineWidth: 1.2, dashed: true, dashPattern: [3, 3] });
        U.drawCircle(s, 0, 0, 1.1, { color: COL.traj, lineWidth: 1.6 });
        U.drawNote(s, 'O', 0.06, -0.16, { color: COL.muted });

        const a = Math.PI / 5;
        const P1 = ptOnCircle(s, a, 0.55, { color: COL.gold, label: 'r₁', offsetX: -0.05, offsetY: -0.2, radiusLine: true });
        const P2 = ptOnCircle(s, a, 1.1, { color: COL.green, label: 'r₂ = 2r₁', offsetX: 0.08, offsetY: 0.1, radiusLine: true });

        // vecteurs vitesse tangentiels (perpendiculaires au rayon), longueur proportionnelle à r
        const tAngle = a + Math.PI / 2;
        U.drawVector(s, P1.x, P1.y, P1.x + 0.45 * Math.cos(tAngle), P1.y + 0.45 * Math.sin(tAngle), { color: COL.gold, label: 'v₁', arrowSize: s.fontSize * 0.32 });
        U.drawVector(s, P2.x, P2.y, P2.x + 0.9 * Math.cos(tAngle), P2.y + 0.9 * Math.sin(tAngle), { color: COL.green, label: 'v₂ = 2v₁', arrowSize: s.fontSize * 0.32 });

        angleArc(s, 0.22, 0, 0.35, { color: COL.blue, lineWidth: 1.4, arrow: true });
        U.drawNote(s, 'ω (même pour tous les points)', -1.6, -1.45, { color: COL.blue, fontSize: s.fontSize * 0.55 });
    }

    // ============================================================
    // PART 4 — Période / Fréquence / Mouvement uniforme
    // ============================================================

    // θ(t) = 10t (ω=10 rad/s) jusqu'à θ=2π ; T = 2π/10 = 0.628 s
    function drawGraphPeriode() {
        const T = 2 * Math.PI / 10;
        const s = U.setupSVG('graphPeriode', { xMin: -0.22, xMax: 3.4, yMin: -0.6, yMax: 7.3 });
        if (!s) return;
        U.drawAxesWithArrows(s, { xLabel: 't (s)', yLabel: 'θ (rad)' });
        U.drawCurve(s, x => 10 * x, 0, 0.73, { color: COL.traj, lineWidth: 2 });
        U.drawAsymptote(s, { y: 2 * Math.PI, color: COL.gold, dashPattern: [4, 4], label: '2π', fontSize: s.fontSize * 0.7 });
        U.drawLine(s, T, 0, T, 2 * Math.PI, { color: COL.green, dashed: true, dashPattern: [4, 4], lineWidth: 1.3 });
        U.drawPoint(s, { x: T, y: 2 * Math.PI, color: COL.green, showCoords: false, label: 'T = 0.628 s', offsetX: 0.15, offsetY: 0.32 });
        xTick(s, T, 'T');
        U.drawNote(s, 'θ = 10t', 1.7, 6.9, { color: COL.traj, fontSize: s.fontSize * 0.65 });
        U.drawNote(s, 'ω = 10 rad/s', 1.7, 6.0, { color: COL.muted, fontSize: s.fontSize * 0.6 });
        U.drawNote(s, '1 tour complet : θ passe de 0 à 2π', 1.7, 5.1, { color: COL.muted, fontSize: s.fontSize * 0.5 });
    }

    // θ(t) = 2t + π/4 : droite affine, ω=2 (pente), θ0=π/4 (ordonnée à l'origine)
    function drawGraphUniforme() {
        const s = U.setupSVG('graphUniforme', { xMin: -0.3, xMax: 3.6, yMin: -0.4, yMax: 7.4 });
        if (!s) return;
        U.drawAxesWithArrows(s, { xLabel: 't (s)', yLabel: 'θ (rad)' });
        U.drawCurve(s, x => 2 * x + Math.PI / 4, 0, 3.4, { color: COL.traj, lineWidth: 2 });
        U.drawPoint(s, { x: 0, y: Math.PI / 4, color: COL.gold, showCoords: false, label: 'θ₀=π/4', offsetX: 0.08, offsetY: 0.3 });
        U.drawLine(s, 3, 0, 3, 2 * 3 + Math.PI / 4, { color: COL.green, dashed: true, lineWidth: 1 });
        U.drawPoint(s, { x: 3, y: 2 * 3 + Math.PI / 4, color: COL.green, showCoords: false, label: 't=3s, θ≈6.785', offsetX: -1.55, offsetY: 0.3 });
        U.drawNote(s, 'θ = 2t + π/4', 0.15, 6.9, { color: COL.muted, fontSize: s.fontSize * 0.7 });
    }

    // ============================================================
    // PART 5 — Équation horaire / Activité / Résumé
    // ============================================================

    // θ(t) = 1.57t + π/4, marquant (0,π/4) et (2, 5π/4)
    function drawGraphHoraire() {
        const s = U.setupSVG('graphHoraire', { xMin: -0.25, xMax: 2.7, yMin: -0.4, yMax: 4.5 });
        if (!s) return;
        U.drawAxesWithArrows(s, { xLabel: 't (s)', yLabel: 'θ (rad)' });
        U.drawCurve(s, x => 1.57 * x + Math.PI / 4, 0, 2.5, { color: COL.traj, lineWidth: 2 });
        U.drawPoint(s, { x: 0, y: Math.PI / 4, color: COL.gold, showCoords: false, label: 'θ₀=π/4', offsetX: 0.08, offsetY: 0.25 });
        U.drawPoint(s, { x: 2, y: 5 * Math.PI / 4, color: COL.green, showCoords: false, label: 't=2s, θ=5π/4', offsetX: -1.6, offsetY: 0.3 });
        U.drawLine(s, 2, 0, 2, 5 * Math.PI / 4, { color: COL.green, dashed: true, lineWidth: 1 });
        U.drawNote(s, 'θ = 1.57t + π/4', 0.15, 4.15, { color: COL.muted, fontSize: s.fontSize * 0.68 });
    }

    // إزاحة تسمية شعاعية (بعيدة عن مركز الدائرة) — كتفادى تراكب التسمية
    // مع الدائرة/النقطة، خصوصا للنقط فالنص الأيسر (النص كيبدا من x
    // ويكبر لليمين، فخاصو يبدا بعيد شوية باش يخرج بره الدائرة)
    function radialLabelOffset(a, mag) {
        mag = mag || 0.22;
        const cx = Math.cos(a), cy = Math.sin(a);
        let ox = cx * mag;
        if (cx < -0.15) ox = cx * mag - 0.22;
        const oy = cy * mag + (cy >= 0 ? 0.05 : -0.16);
        return { ox, oy };
    }

    // Enregistrement chronophotographique : 7 points équirépartis (Δθ = π/6, Δt = 40ms)
    function drawGraphActivite() {
        const s = circleBase('graphActivite', { range: { xMin: -1.9, xMax: 1.9, yMin: -1.9, yMax: 1.9 }, axes: false });
        if (!s) return;
        U.drawNote(s, 'O', 0.08, -0.18, { color: COL.muted });
        for (let k = 0; k <= 6; k++) {
            const a = k * Math.PI / 6;
            const col = k === 0 ? COL.gold : COL.traj;
            const off = radialLabelOffset(a, 0.24);
            ptOnCircle(s, a, 1, { color: col, label: 'M' + k, offsetX: off.ox, offsetY: off.oy, radiusLine: k % 2 === 0, dashedRadius: true, radiusColor: '#3a3a4a' });
        }
        U.drawNote(s, 'Δθ = π/6 entre positions successives (Δt = 40 ms)', -1.8, -1.75, { color: COL.muted, fontSize: s.fontSize * 0.55 });
    }

    // θ(t) = 13.09t + π/3 (résultats de l'activité)
    function drawGraphEquations() {
        const s = U.setupSVG('graphEquations', { xMin: -0.15, xMax: 2.55, yMin: -0.4, yMax: 5.5 });
        if (!s) return;
        U.drawAxesWithArrows(s, { xLabel: 't (s)', yLabel: 'θ (rad)' });
        U.drawCurve(s, x => 13.09 * x + Math.PI / 3, 0, 0.32, { color: COL.traj, lineWidth: 2 });
        U.drawPoint(s, { x: 0, y: Math.PI / 3, color: COL.gold, showCoords: false, label: 'θ₀=π/3', offsetX: 0.06, offsetY: 0.3 });
        U.drawNote(s, 'θ = 13.09t + π/3', 0.75, 5.1, { color: COL.muted, fontSize: s.fontSize * 0.6 });
        U.drawNote(s, 'ω = 13.09 rad/s', 0.75, 4.4, { color: COL.muted, fontSize: s.fontSize * 0.58 });
        xTick(s, 0.2, '0.2');
    }

    // ------------------------------------------------------------
    function initFigures() {
        drawGraphRotation();
        drawGraphReperage('graphReperage');

        drawGraphAngulaire();
        drawGraphCurviligne();

        drawGraphVitesse();
        drawGraphInstant();
        drawGraphRelation();

        drawGraphPeriode();
        drawGraphUniforme();

        drawGraphHoraire();
        drawGraphActivite();
        drawGraphEquations();

        drawGraphReperage('graphResume');
    }

    window.XpertRotationFigures = { initFigures };

    document.addEventListener('DOMContentLoaded', function () {
        setTimeout(initFigures, 150);
    });
})();
