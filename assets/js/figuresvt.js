// ============================================================
// figuresvt.js
// جميع الأشكال البيانية (الرسومات) ديال دروس الدوال، مبنية فوق
// svg-utils.js. كل شكل عوض canvas القديم (لي كان فيه تشويه بسبب
// scale غير متناسق، وفروع ناقصة قرب الـ asymptotes، ودالة دورية
// كتبان مرة وحدة بلا تكرار).
//
// كل دالة هنا كتبني المدى (viewBox) بالضبط على حساب الدالة الرياضية
// ديال السؤال (المجال، المقاربات، القيم القصوى) — ماشي مدى عشوائي.
//
// الاستعمال (بعد ما نبدلو <canvas> بـ <svg> فـ HTML):
//   <script src="{{BASE}}assets/js/svg-utils.js"></script>
//   <script src="{{BASE}}assets/js/figuresvt.js"></script>
// وكيتقرا وحدو عبر initFigures() فـ DOMContentLoaded — كل صفحة غادي
// ترسم غير الأشكال لي عندها id ديالها فـ الصفحة، والباقي كيتجاهلهم.
// ============================================================

(function () {
    // ملاحظة: svg-utils.js كيعرف SvgUtils بـ const فالـ scope العام،
    // وهاذشي ماكيديرش property فـ window (بخلاف var)، فكنستعملوها
    // مباشرة هنا (نفس الصفحة، بعد ما svg-utils.js تلقرا).
    const U = (typeof SvgUtils !== 'undefined') ? SvgUtils : (window.SvgUtils || null);
    if (!U) {
        console.warn('figuresvt.js: SvgUtils ماكايناش — تأكد بلي svg-utils.js متلقري قبل هاذ الملف.');
        return;
    }

    function base(svgId, range) {
        const s = U.setupSVG(svgId, range);
        if (!s) return null;
        U.drawGrid(s);
        U.drawAxesWithArrows(s);
        return s;
    }

    // ------------------------------------------------------------
    // Série 2 — Exercice 5 : g(x) = 2/x  (hyperbole)
    // ------------------------------------------------------------
    function drawHyperbole() {
        const s = base('graphHyperbole', { xMin: -6, xMax: 6, yMin: -6, yMax: 6 });
        if (!s) return;
        U.drawCurve(s, x => 2 / x, -6, -0.15, { color: U.COLORS.arrow });
        U.drawCurve(s, x => 2 / x, 0.15, 6, { color: U.COLORS.arrow });
        U.drawNote(s, 'g(x) = 2/x', -5.7, 5.4, { color: U.COLORS.muted, fontSize: s.fontSize * 0.85 });
    }

    // ------------------------------------------------------------
    // Série 2 — Exercice 6 : f(x) = 3x² + 2  (parabole, sommet (0;2))
    // ------------------------------------------------------------
    function drawParabole() {
        const s = base('graphParabole', { xMin: -2.5, xMax: 2.5, yMin: -1, yMax: 14 });
        if (!s) return;
        U.drawCurve(s, x => 3 * x * x + 2, -2.1, 2.1, { color: U.COLORS.arrow });
        U.drawPoint(s, { x: 0, y: 2, label: 'S', color: U.COLORS.arrow, showCoords: false });
        U.drawNote(s, 'f(x) = 3x² + 2', -2.3, 13, { color: U.COLORS.muted, fontSize: s.fontSize * 0.85 });
    }

    // ------------------------------------------------------------
    // Série 2 — Exercice 7 : g(x) = x/(x+1)  (asymptotes x=-1, y=1)
    // ------------------------------------------------------------
    function drawHomographique() {
        const s = base('graphHomographique', { xMin: -6, xMax: 6, yMin: -6, yMax: 6 });
        if (!s) return;
        U.drawAsymptote(s, { x: -1, label: 'x = -1' });
        U.drawAsymptote(s, { y: 1, label: 'y = 1' });
        U.drawCurve(s, x => x / (x + 1), -6, -1.08, { color: U.COLORS.arrow });
        U.drawCurve(s, x => x / (x + 1), -0.92, 6, { color: U.COLORS.arrow });
        U.drawNote(s, 'g(x) = x/(x+1)', -5.7, 5.4, { color: U.COLORS.muted, fontSize: s.fontSize * 0.85 });
    }

    // ------------------------------------------------------------
    // Série 5 — Exercice 31 : f(x) = (2x+1)/(x-1)  (asym. x=1, y=2)
    // ------------------------------------------------------------
    function drawGraph31() {
        const s = base('graph31', { xMin: -6, xMax: 8, yMin: -8, yMax: 10 });
        if (!s) return;
        U.drawAsymptote(s, { x: 1, label: 'x = 1' });
        U.drawAsymptote(s, { y: 2, label: 'y = 2' });
        U.drawCurve(s, x => (2 * x + 1) / (x - 1), -6, 0.85, { color: U.COLORS.arrow });
        U.drawCurve(s, x => (2 * x + 1) / (x - 1), 1.15, 8, { color: U.COLORS.arrow });
        U.drawNote(s, 'f(x) = (2x+1)/(x-1)', -5.7, 9, { color: U.COLORS.muted, fontSize: s.fontSize * 0.8 });
    }

    // ------------------------------------------------------------
    // Série 5 — Exercice 32 : g(x) = -x/(x-2)  (asym. x=2, y=-1)
    // ------------------------------------------------------------
    function drawGraph32() {
        const s = base('graph32', { xMin: -6, xMax: 8, yMin: -8, yMax: 8 });
        if (!s) return;
        U.drawAsymptote(s, { x: 2, label: 'x = 2' });
        U.drawAsymptote(s, { y: -1, label: 'y = -1' });
        U.drawCurve(s, x => -x / (x - 2), -6, 1.85, { color: U.COLORS.arrow });
        U.drawCurve(s, x => -x / (x - 2), 2.15, 8, { color: U.COLORS.arrow });
        U.drawNote(s, 'g(x) = -x/(x-2)', -5.7, 7, { color: U.COLORS.muted, fontSize: s.fontSize * 0.8 });
    }

    // ------------------------------------------------------------
    // Série 5 — Exercice 33 : f(x) = (1/4)x³  (croissante sur ℝ)
    // ------------------------------------------------------------
    function drawGraph33() {
        const s = base('graph33', { xMin: -3, xMax: 3, yMin: -8, yMax: 8 });
        if (!s) return;
        U.drawCurve(s, x => 0.25 * x * x * x, -3, 3, { color: U.COLORS.arrow });
        U.drawNote(s, 'f(x) = ¼x³', -2.8, 7, { color: U.COLORS.muted, fontSize: s.fontSize * 0.85 });
    }

    // ------------------------------------------------------------
    // Série 5 — Exercice 34 : f(x) = √(x+2)  (D_f = [-2, +∞[)
    // ------------------------------------------------------------
    function drawGraph34() {
        const s = base('graph34', { xMin: -3, xMax: 8, yMin: -1, yMax: 4 });
        if (!s) return;
        U.drawCurve(s, x => Math.sqrt(x + 2), -2, 8, { color: U.COLORS.arrow });
        U.drawPoint(s, { x: -2, y: 0, label: '', color: U.COLORS.arrow, radius: s.fontSize * 0.22 });
        U.drawNote(s, 'f(x) = √(x+2)', -2.8, 3.6, { color: U.COLORS.muted, fontSize: s.fontSize * 0.85 });
    }

    // ------------------------------------------------------------
    // Série 5 — Exercice 40 : h(x) = √(1-x)  (D_h = ]-∞, 1])
    // ------------------------------------------------------------
    function drawGraph40() {
        const s = base('graph40', { xMin: -8, xMax: 3, yMin: -1, yMax: 4 });
        if (!s) return;
        U.drawCurve(s, x => Math.sqrt(1 - x), -8, 1, { color: U.COLORS.arrow });
        U.drawPoint(s, { x: 1, y: 0, label: '', color: U.COLORS.arrow, radius: s.fontSize * 0.22 });
        U.drawNote(s, 'h(x) = √(1-x)', -7.7, 3.6, { color: U.COLORS.muted, fontSize: s.fontSize * 0.85 });
    }

    // ------------------------------------------------------------
    // Série 6 — Exercice 42 : f périodique T=2, f(x)=2x-x² sur [0;2]
    // مرسومة بالكامل ومكررة على [-2;8] (المشكلة الأصلية: كانت
    // كتبان مرة وحدة غير على [0;2] بلا أي تكرار فعلي).
    // ------------------------------------------------------------
    function drawGraph42() {
        const s = base('graph42', { xMin: -2, xMax: 8, yMin: -0.5, yMax: 1.5 });
        if (!s) return;
        for (let k = -2; k <= 8; k += 2) {
            U.drawLine(s, k, s.yMin, k, s.yMax, { color: '#FF6B6B', dashed: true, dashPattern: [5, 4] });
        }
        const periodic = x => {
            let t = x - 2 * Math.floor(x / 2); // t دائما فـ [0;2[
            return 2 * t - t * t;
        };
        U.drawCurve(s, periodic, -2, 8, { color: U.COLORS.arrow, steps: 500 });
        U.drawNote(s, 'Période T = 2', -1.8, 1.35, { color: U.COLORS.muted, fontSize: s.fontSize * 0.8 });
    }

    // ------------------------------------------------------------
    // Série 7 — Exercice 54 : f(x) = (|x|+1)/(|x|-1)
    // دالة زوجية، 3 أفرع: x<-1 ، -1<x<1 ، x>1
    // (المشكلة الأصلية فـ graph54: الفرع الأوسط -1<x<1 ماكانش كيتبان)
    // ------------------------------------------------------------
    function fx54(x) { return (Math.abs(x) + 1) / (Math.abs(x) - 1); }

    function drawGraph54() {
        const s = base('graph54', { xMin: -6, xMax: 6, yMin: -8, yMax: 8 });
        if (!s) return;
        U.drawAsymptote(s, { x: -1 });
        U.drawAsymptote(s, { x: 1 });
        U.drawAsymptote(s, { y: 1, label: 'y = 1' });
        U.drawCurve(s, fx54, -6, -1.05, { color: U.COLORS.arrow, steps: 400 });
        U.drawCurve(s, fx54, -0.95, 0.95, { color: U.COLORS.arrow, steps: 400 });
        U.drawCurve(s, fx54, 1.05, 6, { color: U.COLORS.arrow, steps: 400 });
        U.drawNote(s, 'x = -1', -1.9, 7.4, { color: '#FF6B6B', fontSize: s.fontSize * 0.8 });
        U.drawNote(s, 'x = 1', 1.2, 7.4, { color: '#FF6B6B', fontSize: s.fontSize * 0.8 });
        U.drawNote(s, 'f(x) = (|x|+1)/(|x|-1)', -5.8, -6.8, { color: U.COLORS.muted, fontSize: s.fontSize * 0.75 });
    }

    // نفس المنحنى، بنفس الدقة، للسؤال 4) (تمثيل كامل + خاصيات)
    function drawGraph54b() {
        const s = base('graph54b', { xMin: -6, xMax: 6, yMin: -8, yMax: 8 });
        if (!s) return;
        U.drawAsymptote(s, { x: -1, label: 'x = -1' });
        U.drawAsymptote(s, { x: 1, label: 'x = 1' });
        U.drawAsymptote(s, { y: 1, label: 'y = 1' });
        U.drawCurve(s, fx54, -6, -1.05, { color: U.COLORS.arrow, steps: 400 });
        U.drawCurve(s, fx54, -0.95, 0.95, { color: U.COLORS.arrow, steps: 400 });
        U.drawCurve(s, fx54, 1.05, 6, { color: U.COLORS.arrow, steps: 400 });
        U.drawNote(s, 'f(x) = (|x|+1)/(|x|-1)', -5.8, -6.8, { color: U.COLORS.muted, fontSize: s.fontSize * 0.75 });
    }

    // ------------------------------------------------------------
    // كل صفحة كتحتوي غير على بعض هاذ الـ <svg> — كل دالة كتخرج
    // بسرعة (return) إذا ماكانش id ديالها موجود، فلا مشكل نخدموهم
    // بجوج من صفحة وحدة.
    // ------------------------------------------------------------
    function initFigures() {
        drawHyperbole();
        drawParabole();
        drawHomographique();
        drawGraph31();
        drawGraph32();
        drawGraph33();
        drawGraph34();
        drawGraph40();
        drawGraph42();
        drawGraph54();
        drawGraph54b();
    }

    window.XpertFigures = { initFigures };

    document.addEventListener('DOMContentLoaded', function () {
        setTimeout(initFigures, 150);
    });
})();

