// ============================================================
// figuresvt.js
// رسومات SVG الخاصة بدرس "Les réactions d'oxydo-réduction"
// (Partie 1 → Partie 5), مبنية فوق SvgUtils (assets/js/svg-utils.js).
// كل دالة كتستهدف <svg id="..."> معين، وكتخرج بهدوء إذا ماكانش
// موجود فالصفحة الحالية (كل صفحة فيها غير السفج ديالها).
//
// ملاحظة مهمة: دالة SvgUtils.drawNote كتاخد الإحداثية y مباشرة
// كيفما غادي تنكتب فـ SVG (يعني مقلوبة بالفعل)، بخلاف باقي الدوال
// (drawCircle, drawLine, drawVector...) اللي كتقلب y بحالها. لهذا
// درنا دالة صغيرة note() هنا كتقلب y قبل ما تعيّط drawNote الحقيقية،
// باش نخدمو بمنطق رياضي واحد "y كيزيد لفوق" فكل الإحداثيات.
//
// الاستعمال فكل صفحة:
//   <script src="../../../../../assets/js/svg-utils.js"></script>
//   <script src="figuresvt.js"></script>
// ============================================================

(function () {
    if (typeof SvgUtils === 'undefined') return;

    const RED = '#FF6B6B';    // Oxydant / électrons
    const TEAL = '#4ECDC4';   // Réducteur
    const GOLD = '#F4D03F';   // Résultat / bilan
    const MUTED = '#888888';

    function note(s, text, x, y, opts) {
        SvgUtils.drawNote(s, text, x, -y, opts);
    }

    // ------------------------------------------------------------
    // Partie 1 · Section 2 : Zn(s) + Cu²⁺(aq) → Zn²⁺(aq) + Cu(s)
    // ------------------------------------------------------------
    function drawRedoxZnCu() {
        const s = SvgUtils.setupSVG('svgRedoxZnCu', { xMin: 0, xMax: 22, yMin: 0, yMax: 8 });
        if (!s) return;

        SvgUtils.drawCircle(s, 4, 5.6, 1.4, { fill: '#4ECDC422', color: TEAL, lineWidth: 2 });
        note(s, 'Zn', 4, 5.25, { color: TEAL, fontSize: 1.15, anchor: 'middle', weight: 'bold' });
        note(s, 'Réducteur', 4, 3.65, { color: MUTED, fontSize: 0.72, anchor: 'middle' });
        note(s, '(cède 2e⁻)', 4, 2.95, { color: MUTED, fontSize: 0.68, anchor: 'middle' });

        SvgUtils.drawVector(s, 6.2, 5.6, 15.8, 5.6, {
            color: RED, lineWidth: 2.5, arrowSize: 0.6,
            label: '2 e⁻', labelColor: RED, labelOffsetY: 0.9, fontSize: 0.85
        });

        SvgUtils.drawCircle(s, 18, 5.6, 1.4, { fill: '#FF6B6B22', color: RED, lineWidth: 2 });
        note(s, 'Cu²⁺', 18, 5.25, { color: RED, fontSize: 1.05, anchor: 'middle', weight: 'bold' });
        note(s, 'Oxydant', 18, 3.65, { color: MUTED, fontSize: 0.72, anchor: 'middle' });
        note(s, '(capte 2e⁻)', 18, 2.95, { color: MUTED, fontSize: 0.68, anchor: 'middle' });

        note(s, 'Zn(s) → Zn²⁺(aq) + 2e⁻   (Oxydation)', 11, 1.5, { color: TEAL, fontSize: 0.78, anchor: 'middle', weight: 'bold' });
        note(s, 'Cu²⁺(aq) + 2e⁻ → Cu(s)   (Réduction)', 11, 0.55, { color: RED, fontSize: 0.78, anchor: 'middle', weight: 'bold' });
    }

    // ------------------------------------------------------------
    // Partie 1 · Section 3 : Cu(s) + 2Ag⁺(aq) → Cu²⁺(aq) + 2Ag(s)
    // ------------------------------------------------------------
    function drawRedoxCuAg() {
        const s = SvgUtils.setupSVG('svgRedoxCuAg', { xMin: 0, xMax: 22, yMin: 0, yMax: 9.5 });
        if (!s) return;

        SvgUtils.drawCircle(s, 4, 7.1, 1.4, { fill: '#4ECDC422', color: TEAL, lineWidth: 2 });
        note(s, 'Cu', 4, 6.75, { color: TEAL, fontSize: 1.15, anchor: 'middle', weight: 'bold' });
        note(s, 'Réducteur', 4, 5.15, { color: MUTED, fontSize: 0.72, anchor: 'middle' });
        note(s, '(cède 2e⁻)', 4, 4.45, { color: MUTED, fontSize: 0.68, anchor: 'middle' });

        SvgUtils.drawVector(s, 6.2, 7.1, 15.8, 7.1, {
            color: RED, lineWidth: 2.5, arrowSize: 0.6,
            label: '2 e⁻', labelColor: RED, labelOffsetY: 0.9, fontSize: 0.85
        });

        SvgUtils.drawCircle(s, 18, 7.1, 1.4, { fill: '#FF6B6B22', color: RED, lineWidth: 2 });
        note(s, 'Ag⁺', 18, 6.75, { color: RED, fontSize: 1.05, anchor: 'middle', weight: 'bold' });
        note(s, 'Oxydant', 18, 5.15, { color: MUTED, fontSize: 0.72, anchor: 'middle' });
        note(s, '(capte 1e⁻)', 18, 4.45, { color: MUTED, fontSize: 0.68, anchor: 'middle' });

        note(s, 'Cu(s) → Cu²⁺(aq) + 2e⁻   (Oxydation)', 11, 2.9, { color: TEAL, fontSize: 0.75, anchor: 'middle', weight: 'bold' });
        note(s, '2Ag⁺(aq) + 2e⁻ → 2Ag(s)   (Réduction)', 11, 1.9, { color: RED, fontSize: 0.75, anchor: 'middle', weight: 'bold' });
        note(s, 'Cu(s) + 2Ag⁺(aq) → Cu²⁺(aq) + 2Ag(s)', 11, 0.75, { color: GOLD, fontSize: 0.8, anchor: 'middle', weight: 'bold' });
    }

    // ------------------------------------------------------------
    // Partie 2 · Section 2 : schéma général d'un couple Ox/Red
    // ------------------------------------------------------------
    function drawCoupleGeneral() {
        const s = SvgUtils.setupSVG('svgCouple', { xMin: 0, xMax: 22, yMin: 0, yMax: 7 });
        if (!s) return;

        note(s, 'Oxydant', 4.5, 5, { color: RED, fontSize: 1.05, anchor: 'middle', weight: 'bold' });
        note(s, '(capte e⁻)', 4.5, 4, { color: MUTED, fontSize: 0.68, anchor: 'middle' });

        SvgUtils.drawVector(s, 7.3, 5, 14.7, 5, {
            color: RED, lineWidth: 2.2, arrowSize: 0.55,
            label: '+ n e⁻', labelColor: RED, labelOffsetY: 0.85, fontSize: 0.8
        });

        note(s, 'Réducteur', 17.5, 5, { color: TEAL, fontSize: 1.05, anchor: 'middle', weight: 'bold' });
        note(s, '(cède e⁻)', 17.5, 4, { color: MUTED, fontSize: 0.68, anchor: 'middle' });

        note(s, 'Oxydant + n e⁻ ⇌ Réducteur', 11, 1.7, { color: GOLD, fontSize: 0.95, anchor: 'middle', weight: 'bold' });
    }

    // ------------------------------------------------------------
    // Partie 2 · Section 3 (NOUVEAU) : classification qualitative
    // des couples usuels — échelle du pouvoir oxydant/réducteur
    // ------------------------------------------------------------
    function drawEchelleCouples() {
        const s = SvgUtils.setupSVG('svgEchelleCouples', { xMin: 0, xMax: 14, yMin: -1, yMax: 16 });
        if (!s) return;

        const rows = [
            ['MnO₄⁻', 'Mn²⁺'],
            ['Cr₂O₇²⁻', 'Cr³⁺'],
            ['Fe³⁺', 'Fe²⁺'],
            ['I₂', 'I⁻'],
            ['H⁺', 'H₂'],
            ['Cu²⁺', 'Cu'],
            ['Zn²⁺', 'Zn']
        ];

        note(s, 'Classification qualitative des couples', 7, 15.2, { color: GOLD, fontSize: 0.68, anchor: 'middle', weight: 'bold' });

        const yTop = 13.3, yBot = 2, n = rows.length;
        const step = (yTop - yBot) / (n - 1);
        rows.forEach((r, i) => {
            const y = yTop - i * step;
            SvgUtils.drawLine(s, 3, y, 11, y, { color: '#2A2A3E', lineWidth: 0.6 });
            note(s, r[0], 5.6, y + 0.35, { color: RED, fontSize: 0.82, anchor: 'end', weight: 'bold' });
            note(s, '/', 7, y + 0.35, { color: MUTED, fontSize: 0.82, anchor: 'middle' });
            note(s, r[1], 8.4, y + 0.35, { color: TEAL, fontSize: 0.82, anchor: 'start', weight: 'bold' });
        });

        SvgUtils.drawVector(s, 1.1, yBot - 0.4, 1.1, yTop + 0.4, { color: RED, lineWidth: 2, arrowSize: 0.45 });
        note(s, 'Pouvoir', 0.5, yTop + 1.5, { color: RED, fontSize: 0.6, anchor: 'middle' });
        note(s, 'oxydant ↑', 0.5, yTop + 0.75, { color: RED, fontSize: 0.6, anchor: 'middle' });

        SvgUtils.drawVector(s, 12.9, yTop + 0.4, 12.9, yBot - 0.4, { color: TEAL, lineWidth: 2, arrowSize: 0.45 });
        note(s, 'Pouvoir', 13.5, yBot - 1.15, { color: TEAL, fontSize: 0.6, anchor: 'middle' });
        note(s, 'réducteur ↑', 13.5, yBot - 1.9, { color: TEAL, fontSize: 0.6, anchor: 'middle' });
    }

    // ------------------------------------------------------------
    // Partie 3 · Section 2 : méthode d'écriture de l'équation bilan
    // ------------------------------------------------------------
    function drawMethodeRedox() {
        const s = SvgUtils.setupSVG('svgMethodeRedox', { xMin: 0, xMax: 22, yMin: 0, yMax: 9 });
        if (!s) return;

        note(s, 'Couple 1', 5, 7.7, { color: RED, fontSize: 0.85, anchor: 'middle', weight: 'bold' });
        note(s, 'Red₁ ⇌ Ox₁ + n₁ e⁻', 5, 6.6, { color: TEAL, fontSize: 0.75, anchor: 'middle' });

        note(s, 'Couple 2', 17, 7.7, { color: RED, fontSize: 0.85, anchor: 'middle', weight: 'bold' });
        note(s, 'Ox₂ + n₂ e⁻ ⇌ Red₂', 17, 6.6, { color: TEAL, fontSize: 0.75, anchor: 'middle' });

        SvgUtils.drawLine(s, 8.5, 5.6, 13.5, 5.6, { color: GOLD, dashed: true, dashPattern: [4, 4] });
        note(s, 'n₁ = n₂', 11, 5.1, { color: MUTED, fontSize: 0.62, anchor: 'middle' });

        note(s, 'n₂ Ox₂ + n₁ Red₁ → n₂ Red₂ + n₁ Ox₁', 11, 3.3, { color: GOLD, fontSize: 0.85, anchor: 'middle', weight: 'bold' });
        note(s, '(après multiplication et addition)', 11, 2.3, { color: MUTED, fontSize: 0.62, anchor: 'middle' });
    }

    // ------------------------------------------------------------
    // Partie 4 · Exercice 1 (NOUVEAU) : Zn(s) + 2H⁺(aq) → Zn²⁺(aq) + H₂(g)
    // ------------------------------------------------------------
    function drawExerciceZnHCl() {
        const s = SvgUtils.setupSVG('svgExerciceZnHCl', { xMin: 0, xMax: 22, yMin: 0, yMax: 8 });
        if (!s) return;

        SvgUtils.drawCircle(s, 4, 5.6, 1.4, { fill: '#4ECDC422', color: TEAL, lineWidth: 2 });
        note(s, 'Zn', 4, 5.25, { color: TEAL, fontSize: 1.15, anchor: 'middle', weight: 'bold' });
        note(s, 'Réducteur', 4, 3.65, { color: MUTED, fontSize: 0.72, anchor: 'middle' });
        note(s, '(cède 2e⁻)', 4, 2.95, { color: MUTED, fontSize: 0.68, anchor: 'middle' });

        SvgUtils.drawVector(s, 6.2, 5.6, 15.8, 5.6, {
            color: RED, lineWidth: 2.5, arrowSize: 0.6,
            label: '2 e⁻', labelColor: RED, labelOffsetY: 0.9, fontSize: 0.85
        });

        SvgUtils.drawCircle(s, 18, 5.6, 1.4, { fill: '#FF6B6B22', color: RED, lineWidth: 2 });
        note(s, '2H⁺', 18, 5.25, { color: RED, fontSize: 1.05, anchor: 'middle', weight: 'bold' });
        note(s, 'Oxydant', 18, 3.65, { color: MUTED, fontSize: 0.72, anchor: 'middle' });
        note(s, '(capte 2e⁻)', 18, 2.95, { color: MUTED, fontSize: 0.68, anchor: 'middle' });

        note(s, 'Zn(s) → Zn²⁺(aq) + 2e⁻   (Oxydation)', 11, 1.5, { color: TEAL, fontSize: 0.78, anchor: 'middle', weight: 'bold' });
        note(s, '2H⁺(aq) + 2e⁻ → H₂(g) ↑   (Réduction)', 11, 0.55, { color: RED, fontSize: 0.78, anchor: 'middle', weight: 'bold' });
    }

    // ------------------------------------------------------------
    // Partie 4 · Exercice 2 (NOUVEAU) : Fe(s) + Cu²⁺(aq) → Fe²⁺(aq) + Cu(s)
    // ------------------------------------------------------------
    function drawExerciceFeCu() {
        const s = SvgUtils.setupSVG('svgExerciceFeCu', { xMin: 0, xMax: 22, yMin: 0, yMax: 8 });
        if (!s) return;

        SvgUtils.drawCircle(s, 4, 5.6, 1.4, { fill: '#4ECDC422', color: TEAL, lineWidth: 2 });
        note(s, 'Fe', 4, 5.25, { color: TEAL, fontSize: 1.15, anchor: 'middle', weight: 'bold' });
        note(s, 'Réducteur', 4, 3.65, { color: MUTED, fontSize: 0.72, anchor: 'middle' });
        note(s, '(cède 2e⁻)', 4, 2.95, { color: MUTED, fontSize: 0.68, anchor: 'middle' });

        SvgUtils.drawVector(s, 6.2, 5.6, 15.8, 5.6, {
            color: RED, lineWidth: 2.5, arrowSize: 0.6,
            label: '2 e⁻', labelColor: RED, labelOffsetY: 0.9, fontSize: 0.85
        });

        SvgUtils.drawCircle(s, 18, 5.6, 1.4, { fill: '#FF6B6B22', color: RED, lineWidth: 2 });
        note(s, 'Cu²⁺', 18, 5.25, { color: RED, fontSize: 1.05, anchor: 'middle', weight: 'bold' });
        note(s, 'Oxydant', 18, 3.65, { color: MUTED, fontSize: 0.72, anchor: 'middle' });
        note(s, '(capte 2e⁻)', 18, 2.95, { color: MUTED, fontSize: 0.68, anchor: 'middle' });

        note(s, 'Fe(s) → Fe²⁺(aq) + 2e⁻   (Oxydation)', 11, 1.5, { color: TEAL, fontSize: 0.78, anchor: 'middle', weight: 'bold' });
        note(s, 'Cu²⁺(aq) + 2e⁻ → Cu(s)   (Réduction)', 11, 0.55, { color: RED, fontSize: 0.78, anchor: 'middle', weight: 'bold' });
    }

    // ------------------------------------------------------------
    // Partie 5 · Section 1 (NOUVEAU) : synthèse du transfert d'électrons
    // ------------------------------------------------------------
    function drawSyntheseRedox() {
        const s = SvgUtils.setupSVG('svgSyntheseRedox', { xMin: 0, xMax: 20, yMin: 0, yMax: 9 });
        if (!s) return;

        note(s, "Synthèse : transfert d'électrons", 10, 8.3, { color: GOLD, fontSize: 0.85, anchor: 'middle', weight: 'bold' });

        SvgUtils.drawCircle(s, 5, 5.6, 1.6, { fill: '#4ECDC422', color: TEAL, lineWidth: 2 });
        note(s, 'Réducteur', 5, 5.25, { color: TEAL, fontSize: 0.9, anchor: 'middle', weight: 'bold' });

        SvgUtils.drawVector(s, 6.9, 5.6, 13.1, 5.6, {
            color: RED, lineWidth: 2.2, arrowSize: 0.55,
            label: 'n e⁻', labelColor: RED, labelOffsetY: 0.85, fontSize: 0.8
        });

        SvgUtils.drawCircle(s, 15, 5.6, 1.6, { fill: '#FF6B6B22', color: RED, lineWidth: 2 });
        note(s, 'Oxydant', 15, 5.25, { color: RED, fontSize: 0.9, anchor: 'middle', weight: 'bold' });

        note(s, 'Oxydation', 5, 3.3, { color: TEAL, fontSize: 0.75, anchor: 'middle', weight: 'bold' });
        note(s, "(perte d'électrons)", 5, 2.6, { color: MUTED, fontSize: 0.6, anchor: 'middle' });

        note(s, 'Réduction', 15, 3.3, { color: RED, fontSize: 0.75, anchor: 'middle', weight: 'bold' });
        note(s, "(gain d'électrons)", 15, 2.6, { color: MUTED, fontSize: 0.6, anchor: 'middle' });

        note(s, 'Oxydant + n e⁻ ⇌ Réducteur', 10, 1.1, { color: GOLD, fontSize: 0.85, anchor: 'middle', weight: 'bold' });
    }

    document.addEventListener('DOMContentLoaded', function () {
        setTimeout(function () {
            drawRedoxZnCu();
            drawRedoxCuAg();
            drawCoupleGeneral();
            drawEchelleCouples();
            drawMethodeRedox();
            drawExerciceZnHCl();
            drawExerciceFeCu();
            drawSyntheseRedox();
        }, 300);
    });
})();
