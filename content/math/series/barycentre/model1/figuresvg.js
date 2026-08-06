// ============================================================
// figuresvg.js
// جميع رسومات "البارسنتر" (Barycentre) ديال السلاسل 2، 3 و5،
// محولة بالكامل من canvas إلى SVG حقيقي عبر SvgUtils (svg-utils.js).
// كل دالة كتخدم على عنصر <svg id="graphX"> بدل <canvas id="graphX">.
//
// الاستعمال فكل صفحة (بعد ما تبدل canvas بـ svg فـ HTML):
//   <script src="{{BASE}}assets/js/svg-utils.js"></script>
//   <script src="{{BASE}}assets/js/figuresvg.js"></script>
//   ...
//   document.addEventListener('DOMContentLoaded', function(){ FigureSVG.initAll(); });
// ============================================================

const FigureSVG = (function () {

    // -------- Helpers عامة --------

    // كيرسم قطعة بين نقطتين (كائنات {x,y})
    function seg(s, P1, P2, opts) {
        SvgUtils.drawLine(s, P1.x, P1.y, P2.x, P2.y, opts);
    }

    // كيرسم مثلث كامل (3 أضلاع) بين 3 نقط
    function triangle(s, P1, P2, P3, opts) {
        seg(s, P1, P2, opts);
        seg(s, P2, P3, opts);
        seg(s, P3, P1, opts);
    }

    const DASH = { color: '#2A2A3E', dashed: true, dashPattern: [3, 3], lineWidth: 1.5 };

    // -------- SÉRIE 2 : Exercices 5 à 8 --------

    // Exercice 5.2 : (EF) ∩ (AB) = {G}, G = Bar{(A,2);(B,-3)}
    function drawGraph5() {
        const s = SvgUtils.setupSVG('graph5', { xMin: -1, xMax: 16, yMin: -7, yMax: 4 });
        if (!s) return;
        SvgUtils.drawGrid(s);
        SvgUtils.drawAxesWithArrows(s);

        const A = { x: 0, y: 3, color: '#4ECDC4', label: 'A' };
        const B = { x: 5, y: 0, color: '#FF6B6B', label: 'B' };
        // G = Bar{(A,2);(B,-3)} = (2A - 3B)/(2-3)
        const G = { x: (2 * A.x - 3 * B.x) / (-1), y: (2 * A.y - 3 * B.y) / (-1), color: '#F4D03F', label: 'G' };
        const E = { x: A.x + 0.3 * (B.x - A.x), y: A.y + 0.3 * (B.y - A.y), color: '#BB8FCE', label: 'E' };
        const F = { x: E.x + (G.x - E.x) / 2, y: E.y + (G.y - E.y) / 2, color: '#BB8FCE', label: 'F' };

        seg(s, A, B, { color: '#FF6B6B', dashed: true, dashPattern: [6, 4], lineWidth: 2 });
        seg(s, E, F, { color: '#A8FF78', dashed: true, dashPattern: [6, 4], lineWidth: 2 });

        SvgUtils.drawPoints(s, [A, B, E, F, G].map(p => ({ ...p, showCoords: false })));
        SvgUtils.drawNote(s, '(EF) ∩ (AB) = {G}', 5, -6.5, { color: '#888888', fontSize: s.fontSize * 0.85 });
    }

    // Exercice 6.2 : Cercle C(G, 2), G = Bar{(A,1);(B,2)}
    function drawGraph6() {
        const s = SvgUtils.setupSVG('graph6', { xMin: -1, xMax: 5, yMin: -1, yMax: 6 });
        if (!s) return;
        SvgUtils.drawGrid(s);
        SvgUtils.drawAxesWithArrows(s);

        const A = { x: 0, y: 5, color: '#4ECDC4', label: 'A' };
        const B = { x: 3, y: 2, color: '#FF6B6B', label: 'B' };
        const G = { x: 2, y: 3, color: '#F4D03F', label: 'G' };

        SvgUtils.drawCircle(s, G.x, G.y, 2, { color: '#4D9DE0', dashed: true, dashPattern: [6, 4], lineWidth: 2.5 });
        SvgUtils.drawPoints(s, [A, B, G].map(p => ({ ...p, showCoords: false })));
        SvgUtils.drawNote(s, 'Cercle C(G, 2)', 0.2, 5.6, { color: '#888888', fontSize: s.fontSize * 0.85 });
    }

    // Exercice 7.1 : G = Bar{(A,1);(B,-1);(C,3)}
    function drawGraph7_1() {
        const s = SvgUtils.setupSVG('graph7_1', { xMin: -1, xMax: 6, yMin: -1, yMax: 6 });
        if (!s) return;
        SvgUtils.drawGrid(s);
        SvgUtils.drawAxesWithArrows(s);

        const A = { x: 2, y: 1, color: '#4ECDC4', label: 'A' };
        const B = { x: 5, y: 0.5, color: '#FF6B6B', label: 'B' };
        const C = { x: 3, y: 4.5, color: '#BB8FCE', label: 'C' };
        const G = { x: (1 * A.x - 1 * B.x + 3 * C.x) / 3, y: (1 * A.y - 1 * B.y + 3 * C.y) / 3, color: '#F4D03F', label: 'G' };

        triangle(s, A, B, C, DASH);
        SvgUtils.drawPoints(s, [A, B, C, G].map(p => ({ ...p, showCoords: false })));
        SvgUtils.drawNote(s, 'G = Bar{(A,1);(B,-1);(C,3)}', -0.8, 5.6, { color: '#888888', fontSize: s.fontSize * 0.7 });
    }

    // Exercice 7.2 : G = Bar{(A,4);(B,1/2);(C,-3)}
    function drawGraph7_2() {
        const s = SvgUtils.setupSVG('graph7_2', { xMin: -1.5, xMax: 6, yMin: -7.5, yMax: 5.5 });
        if (!s) return;
        SvgUtils.drawGrid(s);
        SvgUtils.drawAxesWithArrows(s);

        const A = { x: 1.5, y: 1, color: '#4ECDC4', label: 'A' };
        const B = { x: 5, y: 0.5, color: '#FF6B6B', label: 'B' };
        const C = { x: 3, y: 4.5, color: '#BB8FCE', label: 'C' };
        const G = { x: (4 * A.x + 0.5 * B.x - 3 * C.x) / 1.5, y: (4 * A.y + 0.5 * B.y - 3 * C.y) / 1.5, color: '#F4D03F', label: 'G' };

        triangle(s, A, B, C, DASH);
        SvgUtils.drawPoints(s, [A, B, C, G].map(p => ({ ...p, showCoords: false })));
        SvgUtils.drawNote(s, "G = Bar{(A,4);(B,1/2);(C,-3)}", -1.3, 5.1, { color: '#888888', fontSize: s.fontSize * 0.7 });
    }

    // Exercice 8 : G = Bar{(A,1);(B,1);(C,2)} = Bar{(A,1);(I,2)}
    function drawGraph8() {
        const s = SvgUtils.setupSVG('graph8', { xMin: -1, xMax: 6, yMin: -1, yMax: 5.5 });
        if (!s) return;
        SvgUtils.drawGrid(s);
        SvgUtils.drawAxesWithArrows(s);

        const A = { x: 2, y: 1, color: '#4ECDC4', label: 'A' };
        const B = { x: 5, y: 0.5, color: '#FF6B6B', label: 'B' };
        const C = { x: 3, y: 4.5, color: '#BB8FCE', label: 'C' };
        const G = { x: (1 * A.x + 1 * B.x + 2 * C.x) / 4, y: (1 * A.y + 1 * B.y + 2 * C.y) / 4, color: '#F4D03F', label: 'G' };
        const I = { x: (B.x + C.x) / 2, y: (B.y + C.y) / 2, color: '#A8FF78', label: 'I' };

        triangle(s, A, B, C, DASH);
        seg(s, A, I, { color: '#A8FF78', dashed: true, dashPattern: [4, 4], lineWidth: 1.5 });
        SvgUtils.drawPoints(s, [A, B, C, G, I].map(p => ({ ...p, showCoords: false })));
        SvgUtils.drawNote(s, 'G = Bar{(A,1);(I,2)}', -0.8, 5.1, { color: '#888888', fontSize: s.fontSize * 0.8 });
    }

    // -------- SÉRIE 3 : Exercices 9 à 12 --------

    // Exercice 9 : G construit par associativité, G = Bar{(E,-1);(C,5)}
    function drawGraph9() {
        const s = SvgUtils.setupSVG('graph9', { xMin: -1, xMax: 11, yMin: -1.5, yMax: 7 });
        if (!s) return;
        SvgUtils.drawGrid(s);
        SvgUtils.drawAxesWithArrows(s);

        const A = { x: 1, y: 1, color: '#4ECDC4', label: 'A' };
        const B = { x: 4, y: 0.5, color: '#FF6B6B', label: 'B' };
        const C = { x: 2.5, y: 4.5, color: '#BB8FCE', label: 'C' };
        const E = { x: A.x + 3 * (B.x - A.x), y: A.y + 3 * (B.y - A.y), color: '#A8FF78', label: 'E' };
        const G = { x: C.x - 0.25 * (E.x - C.x), y: C.y - 0.25 * (E.y - C.y), color: '#F4D03F', label: 'G' };

        seg(s, A, B, DASH);
        seg(s, C, E, { color: '#A8FF78', dashed: true, dashPattern: [4, 4], lineWidth: 1.5 });
        SvgUtils.drawPoints(s, [A, B, C, E, G].map(p => ({ ...p, showCoords: false })));
        SvgUtils.drawNote(s, 'G = Bar{(E,-1);(C,5)}', 4.5, 6.6, { color: '#888888', fontSize: s.fontSize * 0.8 });
    }

    // Exercice 10 : centre de gravité G = Bar{(A,1);(I,2)}
    function drawGraph10() {
        const s = SvgUtils.setupSVG('graph10', { xMin: -1, xMax: 6, yMin: -1, yMax: 5.5 });
        if (!s) return;
        SvgUtils.drawGrid(s);
        SvgUtils.drawAxesWithArrows(s);

        const A = { x: 2, y: 1, color: '#4ECDC4', label: 'A' };
        const B = { x: 5, y: 0.5, color: '#FF6B6B', label: 'B' };
        const C = { x: 3, y: 4.5, color: '#BB8FCE', label: 'C' };
        const I = { x: (B.x + C.x) / 2, y: (B.y + C.y) / 2, color: '#A8FF78', label: 'I' };
        const G = { x: (1 * A.x + 2 * I.x) / 3, y: (1 * A.y + 2 * I.y) / 3, color: '#F4D03F', label: 'G' };

        triangle(s, A, B, C, DASH);
        seg(s, A, I, { color: '#A8FF78', dashed: true, dashPattern: [4, 4], lineWidth: 2 });
        SvgUtils.drawPoints(s, [A, B, C, I, G].map(p => ({ ...p, showCoords: false })));
        SvgUtils.drawNote(s, 'G = Bar{(A,1);(I,2)}', -0.8, 5.1, { color: '#888888', fontSize: s.fontSize * 0.8 });
    }

    // Exercice 11.4 : Cercle de centre G et de rayon KA
    function drawGraph11() {
        const s = SvgUtils.setupSVG('graph11', { xMin: -1, xMax: 13, yMin: -1, yMax: 13 });
        if (!s) return;
        SvgUtils.drawGrid(s);
        SvgUtils.drawAxesWithArrows(s);

        const A = { x: 1, y: 1, color: '#4ECDC4', label: 'A' };
        const B = { x: 5, y: 0.5, color: '#FF6B6B', label: 'B' };
        const C = { x: 3, y: 4.5, color: '#BB8FCE', label: 'C' };
        const K = { x: (-3 * C.x + 1 * B.x) / (-2), y: (-3 * C.y + 1 * B.y) / (-2), color: '#A8FF78', label: 'K' };
        const G = { x: (2 * A.x - 1 * B.x - 3 * C.x) / (-2), y: (2 * A.y - 1 * B.y - 3 * C.y) / (-2), color: '#F4D03F', label: 'G' };
        const r = Math.sqrt(Math.pow(K.x - A.x, 2) + Math.pow(K.y - A.y, 2));

        SvgUtils.drawCircle(s, G.x, G.y, r, { color: '#4D9DE0', dashed: true, dashPattern: [6, 4], lineWidth: 2.5 });
        SvgUtils.drawPoints(s, [A, B, C, K, G].map(p => ({ ...p, showCoords: false })));
        SvgUtils.drawNote(s, 'Cercle de centre G et rayon KA', 0.2, 12.5, { color: '#888888', fontSize: s.fontSize * 0.75 });
    }

    // Exercice 12.c : Médiatrice de [GG']
    function drawGraph12() {
        const s = SvgUtils.setupSVG('graph12', { xMin: -1, xMax: 6, yMin: -3, yMax: 7 });
        if (!s) return;
        SvgUtils.drawGrid(s);
        SvgUtils.drawAxesWithArrows(s);

        const A = { x: 2, y: 1, color: '#4ECDC4', label: 'A' };
        const B = { x: 5, y: 0.5, color: '#FF6B6B', label: 'B' };
        const C = { x: 3, y: 4.5, color: '#BB8FCE', label: 'C' };
        const I = { x: (2 * B.x + 1 * C.x) / 3, y: (2 * B.y + 1 * C.y) / 3 }; // I = Bar{(B,2);(C,1)} (pas le milieu de [BC])
        const G = { x: (1 * A.x + 3 * I.x) / 4, y: (1 * A.y + 3 * I.y) / 4, color: '#F4D03F', label: 'G' }; // G = Bar{(A,1);(I,3)}
        const Gp = { x: (3 * A.x + 1 * C.x) / 4, y: (3 * A.y + 1 * C.y) / 4, color: '#F4D03F', label: "G'" };

        // Médiatrice = الخط العمودي على [GG'] فمنتصفو
        const mx = (G.x + Gp.x) / 2, my = (G.y + Gp.y) / 2;
        const dx = -(Gp.y - G.y), dy = (Gp.x - G.x);
        const len = Math.sqrt(dx * dx + dy * dy);
        const nx = dx / len, ny = dy / len, ext = 4;

        triangle(s, A, B, C, DASH);
        seg(s, G, Gp, { color: '#F4D03F', lineWidth: 2 });
        SvgUtils.drawLine(s, mx - nx * ext, my - ny * ext, mx + nx * ext, my + ny * ext,
            { color: '#A8FF78', dashed: true, dashPattern: [6, 4], lineWidth: 2.5 });

        SvgUtils.drawPoints(s, [A, B, C, G, Gp].map(p => ({ ...p, showCoords: false })));
        SvgUtils.drawNote(s, "Médiatrice de [GG']", -0.8, 6.6, { color: '#888888', fontSize: s.fontSize * 0.8 });
    }

    // -------- SÉRIE 5 : Exercices 16 à 18 --------

    // Exercice 16.3 : I, J, K alignés (repère (A; B, C))
    function drawGraph16() {
        const s = SvgUtils.setupSVG('graph16', { xMin: -2, xMax: 2, yMin: -1, yMax: 3 });
        if (!s) return;
        SvgUtils.drawGrid(s);
        SvgUtils.drawAxesWithArrows(s, { xLabel: 'AB', yLabel: 'AC' });

        const A = { x: 0, y: 0, color: '#4ECDC4', label: 'A' };
        const B = { x: 1, y: 0, color: '#FF6B6B', label: 'B' };
        const C = { x: 0, y: 1, color: '#BB8FCE', label: 'C' };
        const I = { x: 2 / 3, y: 0, color: '#A8FF78', label: 'I' };
        const J = { x: 0.5, y: 0.5, color: '#4D9DE0', label: 'J' };
        const K = { x: 0, y: 2, color: '#F4D03F', label: 'K' }; // K = Bar{(A,1);(C,-2)} = 2C - A

        triangle(s, A, B, C, DASH);
        seg(s, I, K, { color: '#F4D03F', lineWidth: 2.5 });
        SvgUtils.drawPoints(s, [A, B, C, I, J, K].map(p => ({ ...p, showCoords: false, radius: s.fontSize * 0.22 })));
        SvgUtils.drawNote(s, 'I, J, K sont alignés', -0.3, 2.7, { color: '#888888', fontSize: s.fontSize * 0.75 });
    }

    // Exercice 17.2 : (MJ), (NI), (AC) concourantes en G
    function drawGraph17() {
        const s = SvgUtils.setupSVG('graph17', { xMin: -1, xMax: 5, yMin: -1, yMax: 5 });
        if (!s) return;
        SvgUtils.drawGrid(s);
        SvgUtils.drawAxesWithArrows(s);

        const A = { x: 0, y: 0, color: '#4ECDC4', label: 'A' };
        const B = { x: 4, y: 0, color: '#FF6B6B', label: 'B' };
        const C = { x: 4, y: 4, color: '#BB8FCE', label: 'C' };
        const D = { x: 0, y: 4, color: '#A8FF78', label: 'D' };
        const M = { x: 1, y: 0, color: '#4D9DE0', label: 'M' };
        const N = { x: 0, y: 1, color: '#4D9DE0', label: 'N' };
        const I = { x: 4, y: 2, color: '#F4D03F', label: 'I' };
        const J = { x: 2, y: 4, color: '#F4D03F', label: 'J' };
        const G = { x: (3 * A.x + B.x + C.x + D.x) / 6, y: (3 * A.y + B.y + C.y + D.y) / 6, color: '#F4D03F', label: 'G' };

        // مربع ABCD
        triangle(s, A, B, C, { color: '#2A2A3E', lineWidth: 2 });
        seg(s, C, D, { color: '#2A2A3E', lineWidth: 2 });
        seg(s, D, A, { color: '#2A2A3E', lineWidth: 2 });

        seg(s, M, J, { color: '#F4D03F', dashed: true, dashPattern: [4, 4], lineWidth: 2 });
        seg(s, N, I, { color: '#F4D03F', dashed: true, dashPattern: [4, 4], lineWidth: 2 });
        seg(s, A, C, { color: '#F4D03F', dashed: true, dashPattern: [4, 4], lineWidth: 2 });

        SvgUtils.drawPoints(s, [A, B, C, D, M, N, I, J, G].map(p => ({ ...p, showCoords: false, radius: s.fontSize * 0.22 })));
        SvgUtils.drawNote(s, '(MJ), (NI), (AC) concourantes en G', -0.8, 4.6, { color: '#888888', fontSize: s.fontSize * 0.55 });
    }

    // Exercice 18.2b : Cercle de diamètre [GK]
    function drawGraph18() {
        const s = SvgUtils.setupSVG('graph18', { xMin: -1, xMax: 7, yMin: -2.5, yMax: 2.5 });
        if (!s) return;
        SvgUtils.drawGrid(s);
        SvgUtils.drawAxesWithArrows(s);

        const A = { x: 0, y: 0, color: '#4ECDC4', label: 'A' };
        const B = { x: 4, y: 0, color: '#FF6B6B', label: 'B' };
        const G = { x: (1 * A.x + 3 * B.x) / 4, y: (1 * A.y + 3 * B.y) / 4, color: '#F4D03F', label: 'G' };
        const K = { x: (1 * A.x - 3 * B.x) / (-2), y: (1 * A.y - 3 * B.y) / (-2), color: '#F4D03F', label: 'K' };

        const cx = (G.x + K.x) / 2, cy = (G.y + K.y) / 2;
        const r = Math.sqrt(Math.pow(G.x - K.x, 2) + Math.pow(G.y - K.y, 2)) / 2;

        SvgUtils.drawCircle(s, cx, cy, r, { color: '#4D9DE0', dashed: true, dashPattern: [6, 4], lineWidth: 2.5 });
        seg(s, G, K, { color: '#F4D03F', dashed: true, dashPattern: [4, 4], lineWidth: 1.5 });
        SvgUtils.drawPoints(s, [A, B, G, K].map(p => ({ ...p, showCoords: false })));
        SvgUtils.drawNote(s, 'Cercle de diamètre [GK]', 0.2, 2.2, { color: '#888888', fontSize: s.fontSize * 0.8 });
        SvgUtils.drawNote(s, 'AG = 3 cm, AK = 6 cm', 0.2, 1.85, { color: '#888888', fontSize: s.fontSize * 0.8 });
    }

    // -------- تهيئة كل الرسومات ديال صفحة معينة --------
    // كل دالة داخلية كتفحص وجود الـ <svg> ديالها قبل ما ترسم،
    // إيلا ماكانش (صفحة اخرى) ما غاديش تدير حتى حاجة.
    function initAll() {
        drawGraph5();
        drawGraph6();
        drawGraph7_1();
        drawGraph7_2();
        drawGraph8();
        drawGraph9();
        drawGraph10();
        drawGraph11();
        drawGraph12();
        drawGraph16();
        drawGraph17();
        drawGraph18();
    }

    return {
        initAll,
        drawGraph5, drawGraph6, drawGraph7_1, drawGraph7_2, drawGraph8,
        drawGraph9, drawGraph10, drawGraph11, drawGraph12,
        drawGraph16, drawGraph17, drawGraph18
    };
})();
