// ============================================================
// figuresvt.js
// جميع الرسومات (المبيانات) ديال درس "الكمية من المادة" (1 Bac SE)،
// مبنية فوق svg-utils.js. كل رسم مصمم خصيصى على حساب السؤال أو
// الفقرة المرتبطة بيه فالدرس (Partie 1, Partie 2...) — ماشي رسم
// عشوائي.
//
// هاذ الملف مشترك بين جميع أجزاء الدرس (part1.html, part2.html...)
// وكيتقرا من نفس الجذر ديال الدرس:
//   <script src="../../../../../assets/js/svg-utils.js"></script>
//   <script src="figuresvt.js" defer></script>
// كل دالة كتخرج (return) مباشرة إذا ماكانش الـ <svg id="..."> ديالها
// موجود فالصفحة، فلا مشكل نخدمو نفس الملف من بجوج للأجزاء كاملين.
// ============================================================

(function () {
    const U = (typeof SvgUtils !== 'undefined') ? SvgUtils : (window.SvgUtils || null);
    if (!U) {
        console.warn('figuresvt.js: SvgUtils ماكايناش — تأكد بلي svg-utils.js متلقري قبل هاذ الملف.');
        return;
    }

    const GOLD = '#F4D03F';
    const TEAL = '#4ECDC4';
    const RED = '#FF6B6B';
    const MUTED = '#888888';

    // ============================================================
    // PARTIE 1 — Section 1 : "1 mole = N_A entités"
    // (Section 1, résumé "Qu'est-ce qu'une mole ?")
    // كيبدل الرسم القديم بالنقط العشوائية (كانت كتقدر تتراكب/تخرج
    // بره الإطار) بشكل منظم: حاوية فيها شبكة منتظمة ديال N entités
    // متطابقة + "تكبير" (zoom) على entité وحدة باش يبان المفهوم
    // (macroscopique → microscopique) بوضوح تام.
    // ============================================================
    function drawMoleContainer() {
        const s = U.setupSVG('graphMole', { xMin: 0, xMax: 28, yMin: 0, yMax: 12 });
        if (!s) return;

        // عنوان علوي
        U.drawNote(s, '1 mole', 14, 11.3, { color: GOLD, fontSize: s.fontSize * 1.25 });
        U.drawNote(s, 'N_A = 6,02 × 10²³ entités', 14, 10.35, { color: '#DDDDDD', fontSize: s.fontSize * 0.85 });

        // الحاوية (échantillon)
        U.drawRect(s, 2, 9, 14, 7.5, { color: TEAL, fill: TEAL, opacity: 0.05, rx: 0.4, lineWidth: 1.3 });

        // شبكة منتظمة ديال entités متطابقة (8 × 5 = 40 نقطة، بلا تراكب)
        const cols = 8, rows = 5;
        const gx0 = 2.85, gx1 = 15.15, gy0 = 2.3, gy1 = 8.2;
        const stepX = (gx1 - gx0) / (cols - 1);
        const stepY = (gy1 - gy0) / (rows - 1);
        let highlight = null;
        for (let j = 0; j < rows; j++) {
            for (let i = 0; i < cols; i++) {
                const x = gx0 + i * stepX;
                const y = gy0 + j * stepY;
                const isHighlight = (i === 6 && j === 2);
                if (isHighlight) { highlight = { x, y }; continue; }
                U.drawPoint(s, { x, y, radius: 0.34, color: TEAL, showCoords: false });
            }
        }
        // النقطة المميزة (لي غادي نكبروها فالـ zoom)
        U.drawPoint(s, { x: highlight.x, y: highlight.y, radius: 0.4, color: GOLD, showCoords: false });

        U.drawNote(s, 'Échantillon contenant N_A entités identiques (atomes, molécules ou ions)', 9, 0.85, {
            color: MUTED, fontSize: s.fontSize * 0.55
        });

        // خط متقطع للتكبير (zoom)
        const zoomCx = 22.3, zoomCy = 5.5, zoomR = 3.4;
        U.drawLine(s, highlight.x, highlight.y, zoomCx - zoomR * 0.7, zoomCy, {
            color: GOLD, dashed: true, dashPattern: [4, 3], lineWidth: 0.8
        });

        // دائرة التكبير
        U.drawCircle(s, zoomCx, zoomCy, zoomR, { color: GOLD, fill: '#0D1117', opacity: 0.9, lineWidth: 1.2, dashed: true, dashPattern: [5, 3] });
        U.drawPoint(s, { x: zoomCx, y: zoomCy + 0.3, radius: 1.1, color: GOLD, showCoords: false });
        U.drawNote(s, '1 entité', zoomCx, zoomCy - 1.7, { color: '#FFFFFF', fontSize: s.fontSize * 0.62 });
        U.drawNote(s, '(atome, molécule', zoomCx, zoomCy - 2.35, { color: MUTED, fontSize: s.fontSize * 0.5 });
        U.drawNote(s, 'ou ion)', zoomCx, zoomCy - 2.85, { color: MUTED, fontSize: s.fontSize * 0.5 });
    }

    // ============================================================
    // PARTIE 1 — Section 3 : relation n = m / M(H₂O)
    // (Section 3, graphique "Relation entre la masse et la quantité
    // de matière")
    // مقياس x مصغّر (1 وحدة = 5 g) باش الشكل يبان بنسبة عرض/طول
    // مريحة بلا ما نضيعو التناسق (scale موحدة x/y → دوائر حقيقية
    // بلا تشويه، بخلاف تمديد x وy بشكل مختلف).
    // ============================================================
    function drawMassMoleRelation() {
        const s = U.setupSVG('graphRelation', { xMin: -2.2, xMax: 23, yMin: -1.4, yMax: 7 });
        if (!s) return;

        U.drawAxesWithArrows(s, {
            xLabel: 'm (g)', yLabel: 'n (mol)',
            labelColor: TEAL
        });

        // تدرّجات (ticks) على المحور x: كل وحدة = 5 g
        const mTicks = [20, 40, 60, 80, 100];
        mTicks.forEach(g => {
            const xp = g / 5;
            U.drawLine(s, xp, 0, xp, 7, { color: '#1A1A2E', lineWidth: 0.6 });
            U.drawLine(s, xp, -0.15, xp, 0.15, { color: MUTED, lineWidth: 0.8 });
            U.drawNote(s, String(g), xp, -0.65, { color: MUTED, fontSize: s.fontSize * 0.6 });
        });
        // تدرّجات على المحور y
        for (let n = 1; n <= 6; n++) {
            U.drawLine(s, -2.2, n, 21.5, n, { color: '#1A1A2E', lineWidth: 0.6 });
            U.drawNote(s, String(n), -1.9, n + 0.18, { color: MUTED, fontSize: s.fontSize * 0.6 });
        }

        // المنحنى: n = m / 18  (بدلالة xp = m/5  →  n = xp·5/18)
        U.drawCurve(s, xp => (xp * 5) / 18, 0, 20.6, { color: TEAL, lineWidth: 2.2, steps: 200 });

        // النقطة (m = 100 g ; n ≈ 5,56 mol)
        const xp0 = 100 / 5, n0 = 100 / 18;
        U.drawLine(s, xp0, 0, xp0, n0, { color: GOLD, dashed: true, dashPattern: [4, 3], lineWidth: 0.9 });
        U.drawLine(s, 0, n0, xp0, n0, { color: GOLD, dashed: true, dashPattern: [4, 3], lineWidth: 0.9 });
        U.drawPoint(s, { x: xp0, y: n0, radius: 0.24, color: GOLD, showCoords: false });
        U.drawNote(s, 'm = 100 g', xp0 - 3.6, n0 + 0.75, { color: '#DDDDDD', fontSize: s.fontSize * 0.62 });
        U.drawNote(s, 'n ≈ 5,56 mol', 0.3, n0 + 0.55, { color: '#DDDDDD', fontSize: s.fontSize * 0.62 });

        // معادلة الدالة
        U.drawNote(s, 'n = m / M(H₂O)', -1.9, 6.55, { color: TEAL, fontSize: s.fontSize * 0.68 });
        U.drawNote(s, 'M(H₂O) = 18 g·mol⁻¹', -1.9, 5.85, { color: MUTED, fontSize: s.fontSize * 0.58 });
    }

    // ============================================================
    // PARTIE 1 — "Application 1" : rسم جديد (ماكانش موجود فالأصل)
    // كيوضّح بصريا نتيجة السؤال: نفس الكتلة (100 g) ديال الماء
    // والحديد كتعطي كميتين مختلفتين ديال المادة، بسبب اختلاف الكتلة
    // المولية M — هاذشي المفهوم الأساسي ديال السؤال.
    // ============================================================
    function drawCompareMoles() {
        const s = U.setupSVG('graphCompareMoles', { xMin: 0, xMax: 12, yMin: -2, yMax: 7 });
        if (!s) return;

        U.drawNote(s, 'Même masse (100 g) → quantités de matière différentes', 6, 6.55, {
            color: '#DDDDDD', fontSize: s.fontSize * 0.55
        });

        // محور القاعدة
        U.drawLine(s, 0.3, 0, 11.7, 0, { color: '#2A2A3E', lineWidth: 1 });
        U.drawNote(s, 'n (mol)', 0.6, 6.0, { color: MUTED, fontSize: s.fontSize * 0.55 });
        for (let n = 1; n <= 5; n++) {
            U.drawLine(s, 0.1, n, 0.4, n, { color: MUTED, lineWidth: 0.7 });
            U.drawNote(s, String(n), -0.55, n + 0.15, { color: MUTED, fontSize: s.fontSize * 0.5 });
        }

        // عمود الماء H2O : n = 5,56 mol
        const nEau = 100 / 18;
        U.drawRect(s, 2, nEau, 2.2, nEau, { color: TEAL, fill: TEAL, opacity: 0.75, rx: 0.12, lineWidth: 1 });
        U.drawNote(s, '5,56 mol', 3.1, nEau + 0.5, { color: '#FFFFFF', fontSize: s.fontSize * 0.6 });
        U.drawNote(s, 'Eau (100 g)', 3.1, -0.75, { color: TEAL, fontSize: s.fontSize * 0.58 });
        U.drawNote(s, 'M = 18 g/mol', 3.1, -1.4, { color: MUTED, fontSize: s.fontSize * 0.48 });

        // عمود الحديد Fe : n = 1,78 mol
        const nFer = 100 / 56;
        U.drawRect(s, 7, nFer, 2.2, nFer, { color: GOLD, fill: GOLD, opacity: 0.75, rx: 0.12, lineWidth: 1 });
        U.drawNote(s, '1,78 mol', 8.1, nFer + 0.5, { color: '#FFFFFF', fontSize: s.fontSize * 0.6 });
        U.drawNote(s, 'Fer (100 g)', 8.1, -0.75, { color: GOLD, fontSize: s.fontSize * 0.58 });
        U.drawNote(s, 'M = 56 g/mol', 8.1, -1.4, { color: MUTED, fontSize: s.fontSize * 0.48 });
    }

    // ------------------------------------------------------------
    function initFigures() {
        drawMoleContainer();
        drawMassMoleRelation();
        drawCompareMoles();
    }

    window.XpertFigures = { initFigures };

    document.addEventListener('DOMContentLoaded', function () {
        setTimeout(initFigures, 150);
    });
})();
