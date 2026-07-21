// ============================================================
// figuresvt.js — درس "Barycentre dans le plan" (Part 1 → 4)
//
// جميع الأشكال البيانية ديال الدرس، مبنية فوق svg-utils.js.
// كل شكل مصمم بدقة على حساب السؤال/الفقرة المرتبطة بيه مباشرة
// (نفس القيم العددية المستعملة فالحل)، ماشي غير رسم عشوائي.
//
// هاذ الملف كيغطي:
//   Partie 1: activiteGraph, caractGraph, cercleGraph, mediatriceGraph (جديد)
//   Partie 2: bary3Graph, caract3Graph, assocGraph, gravityGraph, coordGraph
//   Partie 3: parallelogramGraph, bary4Graph, assoc4Graph, coord4Graph
//
// الاستعمال (فكل part.html، بعد <svg id="...">):
//   <script src="{{BASE}}assets/js/svg-utils.js"></script>
//   <script src="figuresvt.js"></script>
// initFigures() كيتقرا وحدو عبر DOMContentLoaded، وكل دالة كترجع
// بسرعة إذا الـ id ديالها ماكاينش فالصفحة الحالية.
// ============================================================

(function () {
    const U = (typeof SvgUtils !== 'undefined') ? SvgUtils : (window.SvgUtils || null);
    if (!U) {
        console.warn('figuresvt.js: SvgUtils ماكايناش — تأكد بلي svg-utils.js متلقري قبل هاذ الملف.');
        return;
    }

    function base(svgId, range, opts) {
        const s = U.setupSVG(svgId, range);
        if (!s) return null;
        if (!opts || opts.grid !== false) U.drawGrid(s);
        if (opts && opts.axes) U.drawAxesWithArrows(s, opts.axesOpts);
        return s;
    }

    // ============================================================
    // PARTIE 1 : Barycentre de deux points
    // ============================================================

    // ------------------------------------------------------------
    // Section 1 - Activité : نفس الخط A-B، وعليه الثلاث نقط G المطلوبين
    // فالأربع أسئلة، باش يبان بالعين كيفاش الأوزان كتحرك G:
    //   G1 : GA+GB=0        → ميلي [AB]                (poids 1;1)
    //   G2 : GA+2GB=0       → على 2/3 من [AB] من A      (poids 1;2)
    //   G3 : 2GA-3GB=0      → بره [AB]، بعد B (AG=3AB)  (poids 2;-3)
    //   (السؤال 4 مستحيل، ماعندوش نقطة يترسم)
    // ------------------------------------------------------------
    function drawActivite() {
        const s = base('activiteGraph', { xMin: -1, xMax: 7.5, yMin: -2.6, yMax: 2.2 }, { grid: false });
        if (!s) return;

        const A = { x: 0, y: 0 }, B = { x: 2, y: 0 };
        const G1 = { x: 1, y: 0 };           // ميلي [AB]
        const G2 = { x: 2 * (2 / 3), y: 0 }; // AG2 = 2/3 AB
        const G3 = { x: 6, y: 0 };           // AG3 = 3 AB

        // segment [AB] صلب + امتداد متقطع بعد B لحد G3
        U.drawLine(s, A.x, A.y, B.x, B.y, { color: U.COLORS.axis, lineWidth: 2 });
        U.drawLine(s, B.x, B.y, G3.x, G3.y, { color: U.COLORS.muted, dashed: true, dashPattern: [5, 4] });

        U.drawPoint(s, { x: A.x, y: A.y, label: 'A', color: U.COLORS.arrow, showCoords: false, offsetX: -0.35, offsetY: 0.5 });
        U.drawPoint(s, { x: B.x, y: B.y, label: 'B', color: '#FF6B6B', showCoords: false, offsetX: 0.15, offsetY: 0.5 });

        U.drawPoint(s, { x: G1.x, y: G1.y, color: '#F4D03F', radius: s.fontSize * 0.3 });
        U.drawNote(s, 'G₁ (milieu)', G1.x - 0.55, 0.9, { color: '#F4D03F', fontSize: s.fontSize * 0.75 });
        U.drawNote(s, '{(A,1);(B,1)}', G1.x - 0.55, 1.35, { color: U.COLORS.muted, fontSize: s.fontSize * 0.6 });

        U.drawPoint(s, { x: G2.x, y: G2.y, color: '#BB8FCE', radius: s.fontSize * 0.3 });
        U.drawNote(s, 'G₂', G2.x - 0.15, -0.6, { color: '#BB8FCE', fontSize: s.fontSize * 0.75 });
        U.drawNote(s, '{(A,1);(B,2)}', G2.x - 0.55, -1.05, { color: U.COLORS.muted, fontSize: s.fontSize * 0.6 });

        U.drawPoint(s, { x: G3.x, y: G3.y, color: '#A8FF78', radius: s.fontSize * 0.3 });
        U.drawNote(s, 'G₃', G3.x - 0.15, 0.9, { color: '#A8FF78', fontSize: s.fontSize * 0.75 });
        U.drawNote(s, '{(A,2);(B,-3)}', G3.x - 0.75, 1.35, { color: U.COLORS.muted, fontSize: s.fontSize * 0.6 });

        U.drawNote(s, 'Question 4 : impossible (aucun point)', -0.9, -2.2, { color: '#FF6B6B', fontSize: s.fontSize * 0.65 });
    }

    // ------------------------------------------------------------
    // Section 4-2 - Propriété caractéristique (2 points) :
    // a MA + b MB = (a+b) MG   avec a=2, b=3  →  AG = 3/5 AB
    // ------------------------------------------------------------
    function drawCaract() {
        const s = base('caractGraph', { xMin: -1, xMax: 8, yMin: -1, yMax: 8 }, { grid: false });
        if (!s) return;

        const A = { x: 0, y: 4.5 }, B = { x: 6.5, y: 1 };
        const a = 2, b = 3;
        const G = { x: A.x + (b / (a + b)) * (B.x - A.x), y: A.y + (b / (a + b)) * (B.y - A.y) };
        const M = { x: 3.2, y: 7.2 };

        U.drawLine(s, A.x, A.y, B.x, B.y, { color: U.COLORS.axis, dashed: true, dashPattern: [4, 4] });

        U.drawVector(s, M.x, M.y, A.x, A.y, { color: U.COLORS.arrow, label: 'MA', lineWidth: 1.5 });
        U.drawVector(s, M.x, M.y, B.x, B.y, { color: '#FF6B6B', label: 'MB', lineWidth: 1.5 });
        U.drawVector(s, M.x, M.y, G.x, G.y, { color: '#F4D03F', label: 'MG', lineWidth: 2 });

        U.drawPoint(s, { x: A.x, y: A.y, label: 'A', color: U.COLORS.arrow, showCoords: false, offsetX: -0.5, offsetY: 0.3 });
        U.drawPoint(s, { x: B.x, y: B.y, label: 'B', color: '#FF6B6B', showCoords: false, offsetX: 0.3, offsetY: -0.15 });
        U.drawPoint(s, { x: G.x, y: G.y, label: 'G', color: '#F4D03F', showCoords: false, offsetX: 0.25, offsetY: -0.35 });
        U.drawPoint(s, { x: M.x, y: M.y, label: 'M', color: '#BB8FCE', showCoords: false, offsetX: 0.3, offsetY: 0.3 });

        U.drawNote(s, 'a=2, b=3 : aMA+bMB=(a+b)MG', -0.8, -7.5, { color: U.COLORS.muted, fontSize: s.fontSize * 0.65 });
    }

    // ------------------------------------------------------------
    // Section 5 - Application a : ensemble des points M tel que
    // 2MA+4MB=12  →  cercle C(G,2) avec G barycentre {(A,2),(B,4)}
    // ------------------------------------------------------------
    function drawCercle() {
        const s = base('cercleGraph', { xMin: -3.5, xMax: 3.5, yMin: -3.5, yMax: 3.5 }, { grid: false });
        if (!s) return;

        const r = 2;
        U.drawCircle(s, 0, 0, r, { color: U.COLORS.arrow, lineWidth: 2, dashed: true, dashPattern: [6, 4] });
        U.drawPoint(s, { x: 0, y: 0, label: 'G', color: '#F4D03F', showCoords: false, offsetX: 0.25, offsetY: 0.25 });

        const angle = Math.PI / 4.2;
        const M = { x: r * Math.cos(angle), y: r * Math.sin(angle) };
        U.drawLine(s, 0, 0, M.x, M.y, { color: '#F4D03F', dashed: true, dashPattern: [4, 3] });
        U.drawPoint(s, { x: M.x, y: M.y, label: 'M', color: '#BB8FCE', showCoords: false, offsetX: 0.25, offsetY: 0.25 });
        U.drawNote(s, 'GM = 2', M.x / 2 - 0.2, -(M.y / 2) - 0.35, { color: '#F4D03F', fontSize: s.fontSize * 0.75 });

        U.drawNote(s, 'Ensemble des points M :', -3.2, -3, { color: U.COLORS.muted, fontSize: s.fontSize * 0.7 });
        U.drawNote(s, 'Cercle C(G, 2)', -3.2, -3.35, { color: U.COLORS.arrow, fontSize: s.fontSize * 0.75 });
    }

    // ------------------------------------------------------------
    // NOUVEAU (كان ناقص) — Section 5 - Application b : ensemble des
    // points M tel que 2MA+4MB = 4MA+2MB. G bary{(A,2),(B,4)},
    // G' bary{(A,4),(B,2)} → MG=MG' → médiatrice de [GG'].
    // ------------------------------------------------------------
    function drawMediatrice() {
        const s = base('mediatriceGraph', { xMin: -5, xMax: 5, yMin: -1, yMax: 5 }, { grid: false });
        if (!s) return;

        const G = { x: -2.2, y: 0 }, G2 = { x: 2.2, y: 0 }; // G و G'
        const M = { x: 0, y: 3.4 };

        U.drawLine(s, G.x, G.y, G2.x, G2.y, { color: U.COLORS.muted, dashed: true, dashPattern: [4, 4] });
        U.drawLine(s, 0, s.yMin, 0, s.yMax, { color: U.COLORS.arrow, lineWidth: 2 });

        U.drawLine(s, M.x, M.y, G.x, G.y, { color: '#BB8FCE', dashed: true, dashPattern: [3, 3] });
        U.drawLine(s, M.x, M.y, G2.x, G2.y, { color: '#BB8FCE', dashed: true, dashPattern: [3, 3] });

        U.drawPoint(s, { x: G.x, y: G.y, label: 'G', color: '#F4D03F', showCoords: false, offsetX: -0.35, offsetY: 0.35 });
        U.drawPoint(s, { x: G2.x, y: G2.y, label: "G'", color: '#F4D03F', showCoords: false, offsetX: 0.15, offsetY: 0.35 });
        U.drawPoint(s, { x: M.x, y: M.y, label: 'M', color: '#BB8FCE', showCoords: false, offsetX: 0.25, offsetY: 0.3 });

        U.drawNote(s, 'MG = MG\u2032', 0.3, -1.7, { color: '#BB8FCE', fontSize: s.fontSize * 0.75 });
        U.drawNote(s, 'Ensemble des points M :', -4.7, -0.55, { color: U.COLORS.muted, fontSize: s.fontSize * 0.7 });
        U.drawNote(s, "médiatrice de [GG']", -4.7, -0.9, { color: U.COLORS.arrow, fontSize: s.fontSize * 0.75 });
    }

    // ============================================================
    // PARTIE 2 : Barycentre de trois points
    // ============================================================

    // ------------------------------------------------------------
    // Section 1 - G barycentre de {(A,1),(B,2),(C,3)}
    // ------------------------------------------------------------
    function drawBary3() {
        const s = base('bary3Graph', { xMin: -1, xMax: 8, yMin: -1, yMax: 7 }, { grid: false });
        if (!s) return;

        const A = { x: 2, y: 5.5 }, B = { x: 0, y: 0 }, C = { x: 6, y: 0 };
        const a = 1, b = 2, c = 3, tot = a + b + c;
        const G = { x: (a * A.x + b * B.x + c * C.x) / tot, y: (a * A.y + b * B.y + c * C.y) / tot };

        U.drawPolygon(s, [A, B, C], { color: U.COLORS.axis, lineWidth: 1.5 });

        U.drawPoint(s, { x: A.x, y: A.y, label: 'A', color: U.COLORS.arrow, showCoords: false, offsetX: -0.4, offsetY: 0.35 });
        U.drawPoint(s, { x: B.x, y: B.y, label: 'B', color: '#FF6B6B', showCoords: false, offsetX: -0.4, offsetY: -0.15 });
        U.drawPoint(s, { x: C.x, y: C.y, label: 'C', color: '#BB8FCE', showCoords: false, offsetX: 0.3, offsetY: -0.15 });
        U.drawPoint(s, { x: G.x, y: G.y, label: 'G', color: '#F4D03F', showCoords: false, offsetX: 0.3, offsetY: 0.3, radius: s.fontSize * 0.34 });

        U.drawNote(s, 'S = {(A,1),(B,2),(C,3)}', 2.6, -6.5, { color: U.COLORS.muted, fontSize: s.fontSize * 0.7 });
    }

    // ------------------------------------------------------------
    // Section 2-2 - Propriété caractéristique (3 points) :
    // aMA+bMB+cMC = (a+b+c)MG   (نفس المثلث والأوزان لسور 1)
    // ------------------------------------------------------------
    function drawCaract3() {
        const s = base('caract3Graph', { xMin: -1, xMax: 8, yMin: -1, yMax: 8 }, { grid: false });
        if (!s) return;

        const A = { x: 2, y: 5.5 }, B = { x: 0, y: 0 }, C = { x: 6, y: 0 };
        const a = 1, b = 2, c = 3, tot = a + b + c;
        const G = { x: (a * A.x + b * B.x + c * C.x) / tot, y: (a * A.y + b * B.y + c * C.y) / tot };
        const M = { x: 6.6, y: 7 };

        U.drawPolygon(s, [A, B, C], { color: U.COLORS.axis, lineWidth: 1, dashed: true, dashPattern: [4, 4] });

        U.drawVector(s, M.x, M.y, A.x, A.y, { color: U.COLORS.arrow, label: 'MA' });
        U.drawVector(s, M.x, M.y, B.x, B.y, { color: '#FF6B6B', label: 'MB' });
        U.drawVector(s, M.x, M.y, C.x, C.y, { color: '#BB8FCE', label: 'MC' });
        U.drawVector(s, M.x, M.y, G.x, G.y, { color: '#F4D03F', label: 'MG', lineWidth: 2 });

        U.drawPoint(s, { x: A.x, y: A.y, label: 'A', color: U.COLORS.arrow, showCoords: false, offsetX: -0.4, offsetY: 0.3 });
        U.drawPoint(s, { x: B.x, y: B.y, label: 'B', color: '#FF6B6B', showCoords: false, offsetX: -0.4, offsetY: -0.15 });
        U.drawPoint(s, { x: C.x, y: C.y, label: 'C', color: '#BB8FCE', showCoords: false, offsetX: 0.3, offsetY: -0.15 });
        U.drawPoint(s, { x: G.x, y: G.y, label: 'G', color: '#F4D03F', showCoords: false, offsetX: 0.3, offsetY: -0.35 });
        U.drawPoint(s, { x: M.x, y: M.y, label: 'M', color: '#A8FF78', showCoords: false, offsetX: 0.25, offsetY: 0.25 });

        U.drawNote(s, 'aMA+bMB+cMC=(a+b+c)MG', -0.8, -7.5, { color: U.COLORS.muted, fontSize: s.fontSize * 0.62 });
    }

    // ------------------------------------------------------------
    // Section 2-3 - Associativité : G2 barycentre {(A,1),(B,1)}
    // (میلي AB)، G barycentre {(G2,2),(C,1)}
    // (الرقم الأصلي فالنسخة القديمة كان فيه تضارب بين label و
    // الحساب، هنا مصححة وموحدة).
    // ------------------------------------------------------------
    function drawAssoc() {
        const s = base('assocGraph', { xMin: -1, xMax: 7, yMin: -1, yMax: 7 }, { grid: false });
        if (!s) return;

        const A = { x: 0, y: 0 }, B = { x: 6, y: 0 };
        const G2 = { x: (A.x + B.x) / 2, y: (A.y + B.y) / 2 }; // bary{(A,1),(B,1)}
        const C = { x: 3, y: 6.2 };
        const G = { x: (2 * G2.x + 1 * C.x) / 3, y: (2 * G2.y + 1 * C.y) / 3 }; // bary{(G2,2),(C,1)}

        U.drawLine(s, A.x, A.y, B.x, B.y, { color: U.COLORS.axis, lineWidth: 1.5 });
        U.drawLine(s, G2.x, G2.y, C.x, C.y, { color: U.COLORS.muted, dashed: true, dashPattern: [4, 4] });

        U.drawPoint(s, { x: A.x, y: A.y, label: 'A', color: U.COLORS.arrow, showCoords: false, offsetX: -0.35, offsetY: -0.35 });
        U.drawPoint(s, { x: B.x, y: B.y, label: 'B', color: '#FF6B6B', showCoords: false, offsetX: 0.25, offsetY: -0.35 });
        U.drawPoint(s, { x: C.x, y: C.y, label: 'C', color: '#BB8FCE', showCoords: false, offsetX: 0.25, offsetY: 0.3 });
        U.drawPoint(s, { x: G2.x, y: G2.y, label: 'G\u2082', color: '#A8FF78', showCoords: false, offsetX: 0.3, offsetY: -0.4, radius: s.fontSize * 0.3 });
        U.drawPoint(s, { x: G.x, y: G.y, label: 'G', color: '#F4D03F', showCoords: false, offsetX: 0.3, offsetY: 0.3, radius: s.fontSize * 0.34 });

        U.drawNote(s, 'G\u2082 barycentre de {(A,1),(B,1)}', -0.8, -6.3, { color: U.COLORS.muted, fontSize: s.fontSize * 0.62 });
        U.drawNote(s, 'G barycentre de {(G\u2082,2),(C,1)}', -0.8, -6.7, { color: U.COLORS.muted, fontSize: s.fontSize * 0.62 });
    }

    // ------------------------------------------------------------
    // Section 3 - Centre de gravité du triangle ABC + médiane AA'
    // AG = 2/3 AA'
    // ------------------------------------------------------------
    function drawGravity() {
        const s = base('gravityGraph', { xMin: -1, xMax: 7, yMin: -1, yMax: 7 }, { grid: false });
        if (!s) return;

        const A = { x: 3, y: 6 }, B = { x: 0, y: 0 }, C = { x: 6, y: 0 };
        const Ap = { x: (B.x + C.x) / 2, y: (B.y + C.y) / 2 };
        const G = { x: (A.x + B.x + C.x) / 3, y: (A.y + B.y + C.y) / 3 };

        U.drawPolygon(s, [A, B, C], { color: U.COLORS.axis, lineWidth: 1.5 });
        U.drawLine(s, A.x, A.y, Ap.x, Ap.y, { color: '#F4D03F', lineWidth: 2, dashed: true, dashPattern: [6, 5] });

        U.drawPoint(s, { x: A.x, y: A.y, label: 'A', color: U.COLORS.arrow, showCoords: false, offsetX: -0.4, offsetY: 0.35 });
        U.drawPoint(s, { x: B.x, y: B.y, label: 'B', color: '#FF6B6B', showCoords: false, offsetX: -0.4, offsetY: -0.15 });
        U.drawPoint(s, { x: C.x, y: C.y, label: 'C', color: '#BB8FCE', showCoords: false, offsetX: 0.3, offsetY: -0.15 });
        U.drawPoint(s, { x: Ap.x, y: Ap.y, label: "A'", color: '#A8FF78', showCoords: false, offsetX: 0.3, offsetY: 0.3 });
        U.drawPoint(s, { x: G.x, y: G.y, label: 'G', color: '#F4D03F', showCoords: false, offsetX: 0.3, offsetY: 0.3, radius: s.fontSize * 0.34 });

        U.drawNote(s, "AG = 2/3 AA'", 2.6, -6.5, { color: U.COLORS.muted, fontSize: s.fontSize * 0.7 });
    }

    // ------------------------------------------------------------
    // Section 4 - Coordonnées : A(1,1), B(4,1), C(-1,3)
    // G barycentre {(A,3),(B,1),(C,1)} = (6/5, 7/5)
    // ------------------------------------------------------------
    function drawCoord() {
        const s = base('coordGraph', { xMin: -2.5, xMax: 5, yMin: -1, yMax: 4 }, { grid: true, axes: true });
        if (!s) return;

        const A = { x: 1, y: 1 }, B = { x: 4, y: 1 }, C = { x: -1, y: 3 };
        const G = { x: 6 / 5, y: 7 / 5 };

        U.drawPolygon(s, [A, B, C], { color: U.COLORS.muted, lineWidth: 1, dashed: true, dashPattern: [4, 4] });

        U.drawPoint(s, { x: A.x, y: A.y, label: 'A', color: U.COLORS.arrow });
        U.drawPoint(s, { x: B.x, y: B.y, label: 'B', color: '#FF6B6B' });
        U.drawPoint(s, { x: C.x, y: C.y, label: 'C', color: '#BB8FCE' });
        U.drawPoint(s, { x: G.x, y: G.y, label: 'G', color: '#F4D03F', radius: s.fontSize * 0.34 });

        U.drawNote(s, 'G(6/5, 7/5) bary {(A,3),(B,1),(C,1)}', -2.3, -3.6, { color: U.COLORS.muted, fontSize: s.fontSize * 0.6 });
    }

    // ============================================================
    // PARTIE 3 : Barycentre de quatre points
    // ============================================================

    // ------------------------------------------------------------
    // Section 1 - Activité : parallélogramme ABCD + O centre
    // (isobarycentre de A,B,C,D = intersection des diagonales)
    // ------------------------------------------------------------
    function drawParallelogram() {
        const s = base('parallelogramGraph', { xMin: -1, xMax: 8, yMin: -1, yMax: 5 }, { grid: false });
        if (!s) return;

        const A = { x: 0, y: 0 }, B = { x: 5, y: 0 }, C = { x: 6, y: 3 }, D = { x: 1, y: 3 };
        const O = { x: (A.x + C.x) / 2, y: (A.y + C.y) / 2 };

        U.drawPolygon(s, [A, B, C, D], { color: U.COLORS.axis, lineWidth: 1.5 });
        U.drawLine(s, A.x, A.y, C.x, C.y, { color: '#F4D03F', dashed: true, dashPattern: [6, 5] });
        U.drawLine(s, B.x, B.y, D.x, D.y, { color: '#F4D03F', dashed: true, dashPattern: [6, 5] });

        U.drawPoint(s, { x: A.x, y: A.y, label: 'A', color: U.COLORS.arrow, showCoords: false, offsetX: -0.4, offsetY: -0.35 });
        U.drawPoint(s, { x: B.x, y: B.y, label: 'B', color: '#FF6B6B', showCoords: false, offsetX: 0.25, offsetY: -0.35 });
        U.drawPoint(s, { x: C.x, y: C.y, label: 'C', color: '#BB8FCE', showCoords: false, offsetX: 0.3, offsetY: 0.3 });
        U.drawPoint(s, { x: D.x, y: D.y, label: 'D', color: '#A8FF78', showCoords: false, offsetX: -0.4, offsetY: 0.3 });
        U.drawPoint(s, { x: O.x, y: O.y, label: 'O', color: '#F4D03F', showCoords: false, offsetX: 0.3, offsetY: 0.3, radius: s.fontSize * 0.34 });

        U.drawNote(s, "O est l'isobarycentre de A, B, C, D", 1.2, -4.6, { color: U.COLORS.muted, fontSize: s.fontSize * 0.65 });
    }

    // ------------------------------------------------------------
    // Section 2 - G barycentre de {(A,1),(B,1),(C,1),(D,1)}
    // (رباعي عام، ماشي متوازي أضلاع، باش يبان الفرق مع الشكل السابق)
    // ------------------------------------------------------------
    function drawBary4() {
        const s = base('bary4Graph', { xMin: -1, xMax: 8, yMin: -1, yMax: 6 }, { grid: false });
        if (!s) return;

        const A = { x: 0, y: 0 }, B = { x: 6, y: 0.5 }, C = { x: 6.5, y: 4 }, D = { x: 0.5, y: 3.5 };
        const G = { x: (A.x + B.x + C.x + D.x) / 4, y: (A.y + B.y + C.y + D.y) / 4 };

        U.drawPolygon(s, [A, B, C, D], { color: U.COLORS.axis, lineWidth: 1.5 });

        U.drawPoint(s, { x: A.x, y: A.y, label: 'A', color: U.COLORS.arrow, showCoords: false, offsetX: -0.4, offsetY: -0.3 });
        U.drawPoint(s, { x: B.x, y: B.y, label: 'B', color: '#FF6B6B', showCoords: false, offsetX: 0.25, offsetY: -0.3 });
        U.drawPoint(s, { x: C.x, y: C.y, label: 'C', color: '#BB8FCE', showCoords: false, offsetX: 0.3, offsetY: 0.3 });
        U.drawPoint(s, { x: D.x, y: D.y, label: 'D', color: '#A8FF78', showCoords: false, offsetX: -0.4, offsetY: 0.3 });
        U.drawPoint(s, { x: G.x, y: G.y, label: 'G', color: '#F4D03F', showCoords: false, offsetX: 0.3, offsetY: 0.3, radius: s.fontSize * 0.34 });

        U.drawNote(s, 'G bary {(A,1),(B,1),(C,1),(D,1)}', 0.6, -5.6, { color: U.COLORS.muted, fontSize: s.fontSize * 0.62 });
    }

    // ------------------------------------------------------------
    // Section 3-3 - Associativité (4 points) : G1 bary{(A,1),(B,1)},
    // G2 bary{(C,1),(D,1)}, G bary{(G1,2),(G2,2)} = milieu [G1G2]
    // ------------------------------------------------------------
    function drawAssoc4() {
        const s = base('assoc4Graph', { xMin: -1, xMax: 10, yMin: -1, yMax: 6 }, { grid: false });
        if (!s) return;

        const A = { x: 0, y: 0 }, B = { x: 3, y: 4 };
        const C = { x: 7, y: 0 }, D = { x: 9, y: 5 };
        const G1 = { x: (A.x + B.x) / 2, y: (A.y + B.y) / 2 };
        const G2 = { x: (C.x + D.x) / 2, y: (C.y + D.y) / 2 };
        const G = { x: (G1.x + G2.x) / 2, y: (G1.y + G2.y) / 2 };

        U.drawLine(s, A.x, A.y, B.x, B.y, { color: U.COLORS.axis, lineWidth: 1.5 });
        U.drawLine(s, C.x, C.y, D.x, D.y, { color: U.COLORS.axis, lineWidth: 1.5 });
        U.drawLine(s, G1.x, G1.y, G2.x, G2.y, { color: '#F4D03F', dashed: true, dashPattern: [6, 5] });

        U.drawPoint(s, { x: A.x, y: A.y, label: 'A', color: U.COLORS.arrow, showCoords: false, offsetX: -0.35, offsetY: -0.3 });
        U.drawPoint(s, { x: B.x, y: B.y, label: 'B', color: '#FF6B6B', showCoords: false, offsetX: 0.25, offsetY: 0.3 });
        U.drawPoint(s, { x: C.x, y: C.y, label: 'C', color: '#BB8FCE', showCoords: false, offsetX: -0.35, offsetY: -0.3 });
        U.drawPoint(s, { x: D.x, y: D.y, label: 'D', color: '#A8FF78', showCoords: false, offsetX: 0.25, offsetY: 0.3 });
        U.drawPoint(s, { x: G1.x, y: G1.y, label: 'G\u2081', color: '#F4D03F', showCoords: false, offsetX: -0.55, offsetY: 0.3, radius: s.fontSize * 0.3 });
        U.drawPoint(s, { x: G2.x, y: G2.y, label: 'G\u2082', color: '#F4D03F', showCoords: false, offsetX: 0.3, offsetY: 0.3, radius: s.fontSize * 0.3 });
        U.drawPoint(s, { x: G.x, y: G.y, label: 'G', color: '#F4D03F', showCoords: false, offsetX: 0.3, offsetY: -0.4, radius: s.fontSize * 0.34 });

        U.drawNote(s, 'G bary {(G\u2081,2),(G\u2082,2)}', 3.4, -5.5, { color: U.COLORS.muted, fontSize: s.fontSize * 0.65 });
    }

    // ------------------------------------------------------------
    // Section 4 - Coordonnées : A(0,0), B(4,0), C(4,4), D(0,4)
    // G barycentre {(A,1),(B,2),(C,3),(D,4)}
    // ------------------------------------------------------------
    function drawCoord4() {
        const s = base('coord4Graph', { xMin: -1.5, xMax: 6, yMin: -1, yMax: 6 }, { grid: true, axes: true });
        if (!s) return;

        const pts = [
            { x: 0, y: 0, w: 1, label: 'A(1)', color: U.COLORS.arrow },
            { x: 4, y: 0, w: 2, label: 'B(2)', color: '#FF6B6B' },
            { x: 4, y: 4, w: 3, label: 'C(3)', color: '#BB8FCE' },
            { x: 0, y: 4, w: 4, label: 'D(4)', color: '#A8FF78' }
        ];
        const tot = pts.reduce((t, p) => t + p.w, 0);
        const gx = pts.reduce((t, p) => t + p.w * p.x, 0) / tot;
        const gy = pts.reduce((t, p) => t + p.w * p.y, 0) / tot;

        U.drawPolygon(s, pts, { color: U.COLORS.muted, lineWidth: 1, dashed: true, dashPattern: [4, 4] });
        pts.forEach(p => U.drawPoint(s, { x: p.x, y: p.y, label: p.label, color: p.color, showCoords: false, offsetX: 0.25, offsetY: 0.25 }));
        U.drawPoint(s, { x: gx, y: gy, label: 'G', color: '#F4D03F', showCoords: true, offsetX: 0.25, offsetY: 0.25, radius: s.fontSize * 0.34 });

        U.drawNote(s, 'G bary {(A,1),(B,2),(C,3),(D,4)}', -1.3, -5.6, { color: U.COLORS.muted, fontSize: s.fontSize * 0.55 });
    }

    // ------------------------------------------------------------
    // كل صفحة (part1/2/3.html) فيها غير بعض هاذ الـ <svg> — كل دالة
    // كترجع بسرعة إذا id ديالها ماكاينش، فلا مشكل تشترك الصفحات
    // كلها فنفس figuresvt.js.
    // ------------------------------------------------------------
    function initFigures() {
        // Partie 1
        drawActivite();
        drawCaract();
        drawCercle();
        drawMediatrice();
        // Partie 2
        drawBary3();
        drawCaract3();
        drawAssoc();
        drawGravity();
        drawCoord();
        // Partie 3
        drawParallelogram();
        drawBary4();
        drawAssoc4();
        drawCoord4();
    }

    window.XpertFigures = { initFigures };

    document.addEventListener('DOMContentLoaded', function () {
        setTimeout(initFigures, 150);
    });
})();
