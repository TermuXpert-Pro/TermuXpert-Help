// ============================================================
// figuresvt.js — درس: Généralités sur les fonctions (Partie 1-6)
// كل الرسومات ديال هاذ الدرس، محولة من Canvas ل SVG (svg-utils.js)
// بدقة زايدة: نقط دقيقة، تسميات واضحة، منسجمة مع الفقرة المرتبطة بيها.
//
// الاستعمال (فكل صفحة part1..part6.html، بعد ما نبدلو canvas ب svg):
//   <script src="../../../../../assets/js/svg-utils.js"></script>
//   <script src="figuresvt.js"></script>
// ============================================================

(function () {
    const NS = 'http://www.w3.org/2000/svg';
    function rEl(tag, attrs) {
        const e = document.createElementNS(NS, tag);
        for (const k in attrs) e.setAttribute(k, attrs[k]);
        return e;
    }
    // تهيئة SVG "خام" (بلا قلب المحور y) خاص بالمخططات الصندوقية (schémas)
    function setupRaw(id, w, h) {
        const svg = document.getElementById(id);
        if (!svg) return null;
        while (svg.firstChild) svg.removeChild(svg.firstChild);
        svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        return svg;
    }
    // سهم صغير (خط + رأس مثلث) بإحداثيات SvgUtils (رياضية، y مقلوبة تلقائيًا بواسطة drawLine)
    function smallArrowHead(s, x, y, dir, color) {
        // dir: 'right' | 'left' | 'up' | 'down' — رأس السهم بإحداثيات رياضية
        const a = s.fontSize * 0.35;
        let pts;
        if (dir === 'right') pts = `${x},${-y} ${x - a},${-y + a / 1.6} ${x - a},${-y - a / 1.6}`;
        else if (dir === 'left') pts = `${x},${-y} ${x + a},${-y + a / 1.6} ${x + a},${-y - a / 1.6}`;
        else if (dir === 'up') pts = `${x},${-y} ${x - a / 1.6},${-y + a} ${x + a / 1.6},${-y + a}`;
        else pts = `${x},${-y} ${x - a / 1.6},${-y - a} ${x + a / 1.6},${-y - a}`;
        s.svg.appendChild(rEl('polygon', { points: pts, fill: color }));
    }

    // ============================================================
    // PARTIE 1 — Rappels
    // ============================================================

    // Section 1 : Fonction numérique — schéma NOUVEAU (n'existait pas avant)
    // يبين المفهوم: x عنصر ديال D_f كيتصور ب f فـ f(x) عنصر ديال R
    function drawDomainMap() {
        const svg = setupRaw('domainMapGraph', 320, 110);
        if (!svg) return;

        // مستطيل D_f
        svg.appendChild(rEl('rect', { x: 15, y: 30, width: 90, height: 50, rx: 8, fill: 'rgba(78,205,196,0.08)', stroke: '#4ECDC4', 'stroke-width': 2 }));
        const t1 = rEl('text', { x: 60, y: 20, 'text-anchor': 'middle', 'font-size': 13, fill: '#4ECDC4', 'font-family': 'Arial' });
        t1.textContent = 'D_f ⊂ ℝ'; svg.appendChild(t1);
        const t1b = rEl('text', { x: 60, y: 60, 'text-anchor': 'middle', 'font-size': 15, fill: '#FFFFFF', 'font-family': 'Arial' });
        t1b.textContent = 'x'; svg.appendChild(t1b);

        // مستطيل R (المجموعة الوصول)
        svg.appendChild(rEl('rect', { x: 215, y: 30, width: 90, height: 50, rx: 8, fill: 'rgba(255,107,107,0.08)', stroke: '#FF6B6B', 'stroke-width': 2 }));
        const t2 = rEl('text', { x: 260, y: 20, 'text-anchor': 'middle', 'font-size': 13, fill: '#FF6B6B', 'font-family': 'Arial' });
        t2.textContent = 'ℝ'; svg.appendChild(t2);
        const t2b = rEl('text', { x: 260, y: 60, 'text-anchor': 'middle', 'font-size': 15, fill: '#FFFFFF', 'font-family': 'Arial' });
        t2b.textContent = 'f(x)'; svg.appendChild(t2b);

        // السهم f
        svg.appendChild(rEl('line', { x1: 108, y1: 55, x2: 210, y2: 55, stroke: '#F4D03F', 'stroke-width': 2 }));
        svg.appendChild(rEl('polygon', { points: '210,55 200,50 200,60', fill: '#F4D03F' }));
        const tf = rEl('text', { x: 159, y: 46, 'text-anchor': 'middle', 'font-size': 13, fill: '#F4D03F', 'font-family': 'Arial' });
        tf.textContent = 'f'; svg.appendChild(tf);

        const tbot = rEl('text', { x: 160, y: 100, 'text-anchor': 'middle', 'font-size': 12, fill: '#888888', 'font-family': 'Arial' });
        tbot.textContent = 'x ↦ f(x) : à chaque x, au plus une image f(x)';
        svg.appendChild(tbot);
    }

    // Section 2 : f(x) = x² (paire) — symétrie / axe (Oy)
    function drawPaire() {
        const s = SvgUtils.setupSVG('paireGraph', { xMin: -2.4, xMax: 2.4, yMin: -0.6, yMax: 5.2 });
        if (!s) return;
        SvgUtils.drawGrid(s);
        SvgUtils.drawAxesWithArrows(s, { xLabel: 'x', yLabel: 'y' });
        SvgUtils.drawCurve(s, x => x * x, -2.25, 2.25, { color: '#4ECDC4', lineWidth: 2.2 });
        SvgUtils.drawLine(s, -1, 1, 1, 1, { color: '#F4D03F', dashed: true, dashPattern: [3, 3] });
        SvgUtils.drawPoint(s, { x: 1, y: 1, label: 'A', color: '#FF6B6B', offsetY: -0.55 });
        SvgUtils.drawPoint(s, { x: -1, y: 1, label: "A'", color: '#FF6B6B', offsetX: -1.7, offsetY: -0.55 });
        SvgUtils.drawNote(s, 'f(-x) = f(x)', 0.9, 4.7, { color: '#4ECDC4', fontSize: s.fontSize * 0.9 });
    }

    // f(x) = x³ (impaire) — symétrie / origine O
    function drawImpaire() {
        const s = SvgUtils.setupSVG('impaireGraph', { xMin: -1.8, xMax: 1.8, yMin: -1.8, yMax: 1.8 });
        if (!s) return;
        SvgUtils.drawGrid(s);
        SvgUtils.drawAxesWithArrows(s, { xLabel: 'x', yLabel: 'y' });
        SvgUtils.drawCurve(s, x => x * x * x, -1.62, 1.62, { color: '#4ECDC4', lineWidth: 2.2 });
        SvgUtils.drawLine(s, -1, -1, 1, 1, { color: '#F4D03F', dashed: true, dashPattern: [3, 3] });
        SvgUtils.drawPoint(s, { x: 1, y: 1, label: 'M', color: '#FF6B6B', offsetY: -0.3 });
        SvgUtils.drawPoint(s, { x: -1, y: -1, label: "M'", color: '#FF6B6B', offsetX: -1.9, offsetY: 0.35 });
        SvgUtils.drawPoint(s, { x: 0, y: 0, label: 'O', color: '#F4D03F', showCoords: false, offsetX: -1.15, offsetY: -0.28 });
        SvgUtils.drawNote(s, 'f(-x) = -f(x)', -1.75, 1.68, { color: '#4ECDC4', fontSize: s.fontSize * 0.85 });
    }

    // f(x) = (x-1)² — décroissante puis croissante
    function drawMonotonie() {
        const s = SvgUtils.setupSVG('monotonieGraph', { xMin: -1.5, xMax: 3.5, yMin: -0.9, yMax: 4.4 });
        if (!s) return;
        SvgUtils.drawGrid(s);
        SvgUtils.drawAxesWithArrows(s, { xLabel: 'x', yLabel: 'y' });
        SvgUtils.drawCurve(s, x => (x - 1) * (x - 1), -1, 1, { color: '#FF6B6B', lineWidth: 2.4 });
        SvgUtils.drawCurve(s, x => (x - 1) * (x - 1), 1, 3, { color: '#A8FF78', lineWidth: 2.4 });
        SvgUtils.drawPoint(s, { x: 1, y: 0, label: '', color: '#F4D03F', showCoords: false });
        // سهام المونوتونية تحت المحور
        SvgUtils.drawLine(s, -1, -0.55, 0.85, -0.55, { color: '#FF6B6B', lineWidth: 1.6 });
        smallArrowHead(s, 0.85, -0.55, 'left', '#FF6B6B');
        SvgUtils.drawLine(s, 1.15, -0.55, 3, -0.55, { color: '#A8FF78', lineWidth: 1.6 });
        smallArrowHead(s, 3, -0.55, 'right', '#A8FF78');
        SvgUtils.drawNote(s, 'décroissante', -1.3, -0.78, { color: '#FF6B6B', fontSize: s.fontSize * 0.75 });
        SvgUtils.drawNote(s, 'croissante', 1.5, -0.78, { color: '#A8FF78', fontSize: s.fontSize * 0.75 });
        SvgUtils.drawNote(s, '1', 0.94, -0.18, { color: '#F4D03F', fontSize: s.fontSize * 0.75 });
    }

    // Taux d'accroissement : sécante (AB)
    function drawTaux() {
        const s = SvgUtils.setupSVG('tauxGraph', { xMin: -1.5, xMax: 4.5, yMin: -0.6, yMax: 5.6 });
        if (!s) return;
        const f = x => 0.3 * x * x + 0.5;
        SvgUtils.drawGrid(s);
        SvgUtils.drawAxesWithArrows(s, { xLabel: 'x', yLabel: 'y' });
        SvgUtils.drawCurve(s, f, -1.3, 4.3, { color: '#4ECDC4', lineWidth: 2.2 });

        const xA = 0.5, xB = 3.2, yA = f(xA), yB = f(xB);
        SvgUtils.drawLine(s, xA, yA, xB, yA, { color: '#888888', dashed: true, dashPattern: [3, 3] });
        SvgUtils.drawLine(s, xB, yA, xB, yB, { color: '#888888', dashed: true, dashPattern: [3, 3] });
        SvgUtils.drawLine(s, xA, yA, xB, yB, { color: '#FF6B6B', lineWidth: 2 });
        SvgUtils.drawPoint(s, { x: xA, y: yA, label: 'A', color: '#F4D03F', offsetY: 0.35 });
        SvgUtils.drawPoint(s, { x: xB, y: yB, label: 'B', color: '#F4D03F', offsetY: 0.35 });
        SvgUtils.drawNote(s, 'Δx', (xA + xB) / 2 - 0.15, yA - 0.35, { color: '#F4D03F', fontSize: s.fontSize * 0.8 });
        SvgUtils.drawNote(s, 'Δy', xB + 0.15, (yA + yB) / 2, { color: '#F4D03F', fontSize: s.fontSize * 0.8 });
    }

    // ============================================================
    // PARTIE 2 — Bornée, Extremums, Périodique
    // ============================================================

    function drawBornee() {
        const xMax = 4 * Math.PI;
        const s = SvgUtils.setupSVG('borneeGraph', { xMin: -0.6, xMax: xMax + 0.6, yMin: -0.6, yMax: 4.4 });
        if (!s) return;
        SvgUtils.drawAxesWithArrows(s, { xLabel: 'x', yLabel: 'y' });
        SvgUtils.drawLine(s, 0, 3, xMax, 3, { color: '#4ECDC4', dashed: true, dashPattern: [4, 4] });
        SvgUtils.drawLine(s, 0, 1, xMax, 1, { color: '#FF6B6B', dashed: true, dashPattern: [4, 4] });
        SvgUtils.drawCurve(s, x => 2 + Math.sin(x), 0, xMax, { color: '#F4D03F', lineWidth: 2.3 });
        SvgUtils.drawNote(s, 'M = 3', xMax - 2.2, 3.35, { color: '#4ECDC4', fontSize: s.fontSize * 0.85 });
        SvgUtils.drawNote(s, 'm = 1', xMax - 2.2, 0.55, { color: '#FF6B6B', fontSize: s.fontSize * 0.85 });
    }

    function drawMax() {
        const s = SvgUtils.setupSVG('maxGraph', { xMin: -1.4, xMax: 5.4, yMin: -5.2, yMax: 4.8 });
        if (!s) return;
        SvgUtils.drawGrid(s);
        SvgUtils.drawAxesWithArrows(s, { xLabel: 'x', yLabel: 'y' });
        SvgUtils.drawCurve(s, x => -(x - 2) * (x - 2) + 4, -1.3, 5.3, { color: '#4ECDC4', lineWidth: 2.2 });
        SvgUtils.drawLine(s, 2, 0, 2, 4, { color: '#F4D03F', dashed: true, dashPattern: [3, 3] });
        SvgUtils.drawPoint(s, { x: 2, y: 4, label: 'f(x₀)', color: '#F4D03F', offsetY: 0.5, showCoords: false });
        SvgUtils.drawNote(s, 'x₀', 1.85, -0.35, { color: '#888888', fontSize: s.fontSize * 0.8 });
    }

    function drawMin() {
        const s = SvgUtils.setupSVG('minGraph', { xMin: -1.4, xMax: 5.4, yMin: -1, yMax: 9 });
        if (!s) return;
        SvgUtils.drawGrid(s);
        SvgUtils.drawAxesWithArrows(s, { xLabel: 'x', yLabel: 'y' });
        SvgUtils.drawCurve(s, x => (x - 2) * (x - 2), -1.3, 5.3, { color: '#FF6B6B', lineWidth: 2.2 });
        SvgUtils.drawPoint(s, { x: 2, y: 0, label: 'f(x₀)', color: '#F4D03F', offsetY: -0.5, showCoords: false });
        SvgUtils.drawNote(s, 'x₀', 1.85, -0.35, { color: '#888888', fontSize: s.fontSize * 0.8 });
    }

    function drawPeriodique() {
        const T = 2;
        const f = x => { const xm = ((x % T) + T) % T; return xm <= T / 2 ? xm : T - xm; };
        const s = SvgUtils.setupSVG('periodiqueGraph', { xMin: -1.4, xMax: 7.4, yMin: -0.5, yMax: 1.9 });
        if (!s) return;
        SvgUtils.drawAxesWithArrows(s, { xLabel: 'x', yLabel: 'y' });
        SvgUtils.drawCurve(s, f, -1.2, 7.2, { color: '#4ECDC4', lineWidth: 2.2 });
        const y0 = f(0) + 0.55;
        SvgUtils.drawLine(s, 0, y0, T, y0, { color: '#F4D03F', lineWidth: 1.5 });
        smallArrowHead(s, T, y0, 'right', '#F4D03F');
        SvgUtils.drawNote(s, 'T', T / 2 - 0.05, y0 + 0.18, { color: '#F4D03F', fontSize: s.fontSize * 0.85 });
        SvgUtils.drawLine(s, 0, 0, 0, f(0), { color: '#888888', dashed: true, dashPattern: [2, 2] });
        SvgUtils.drawLine(s, T, 0, T, f(T), { color: '#888888', dashed: true, dashPattern: [2, 2] });
    }

    // ============================================================
    // PARTIE 3 — Comparaison, Composée
    // ============================================================

    function drawComparison() {
        const s = SvgUtils.setupSVG('comparisonGraph', { xMin: -1.4, xMax: 5.4, yMin: -0.6, yMax: 6.4 });
        if (!s) return;
        const f = x => 0.15 * (x - 2) * (x - 2) + 0.5;
        const g = x => f(x) + 1.5;
        SvgUtils.drawAxesWithArrows(s, { xLabel: 'x', yLabel: 'y' });

        // منطقة مظللة بين f و g (f ≤ g)
        let d = '';
        for (let x = -1.2; x <= 5.2001; x += 0.15) d += (x === -1.2 ? 'M ' : 'L ') + x + ' ' + (-g(x)) + ' ';
        for (let x = 5.2; x >= -1.2001; x -= 0.15) d += 'L ' + x + ' ' + (-f(x)) + ' ';
        s.svg.appendChild(rEl('path', { d: d.trim() + ' Z', fill: 'rgba(78,205,196,0.12)', stroke: 'none' }));

        SvgUtils.drawCurve(s, f, -1.2, 5.2, { color: '#4ECDC4', lineWidth: 2.2 });
        SvgUtils.drawCurve(s, g, -1.2, 5.2, { color: '#F4D03F', lineWidth: 2.2 });
        SvgUtils.drawNote(s, 'f', 5.05, f(5.2) + 0.35, { color: '#4ECDC4' });
        SvgUtils.drawNote(s, 'g', 5.05, g(5.2) + 0.35, { color: '#F4D03F' });
    }

    function drawComposition() {
        const svg = setupRaw('compositionGraph', 300, 130);
        if (!svg) return;
        const cy = 55, x1 = 30, x2 = 150, x3 = 270;
        function box(cx, label, color) {
            svg.appendChild(rEl('rect', { x: cx - 26, y: cy - 18, width: 52, height: 36, rx: 6, fill: 'rgba(255,255,255,0.03)', stroke: color, 'stroke-width': 2 }));
            const t = rEl('text', { x: cx, y: cy + 5, 'text-anchor': 'middle', 'font-size': 13, fill: '#FFFFFF', 'font-family': 'Arial' });
            t.textContent = label; svg.appendChild(t);
        }
        box(x1, 'x', '#F4D03F');
        box(x2, 'f(x)', '#4ECDC4');
        box(x3, 'g(f(x))', '#FF6B6B');
        function arrow(xa, xb, label, color) {
            svg.appendChild(rEl('line', { x1: xa + 26, y1: cy, x2: xb - 28, y2: cy, stroke: color, 'stroke-width': 2 }));
            svg.appendChild(rEl('polygon', { points: `${xb - 28},${cy} ${xb - 36},${cy - 5} ${xb - 36},${cy + 5}`, fill: color }));
            const t = rEl('text', { x: (xa + xb) / 2, y: cy - 12, 'text-anchor': 'middle', 'font-size': 12, fill: color, 'font-family': 'Arial' });
            t.textContent = label; svg.appendChild(t);
        }
        arrow(x1, x2, 'f', '#4ECDC4');
        arrow(x2, x3, 'g', '#FF6B6B');
        svg.appendChild(rEl('line', { x1: x1, y1: cy + 34, x2: x3, y2: cy + 34, stroke: '#888888', 'stroke-width': 1.2, 'stroke-dasharray': '3 3' }));
        svg.appendChild(rEl('line', { x1: x1, y1: cy + 30, x2: x1, y2: cy + 38, stroke: '#888888', 'stroke-width': 1.2 }));
        svg.appendChild(rEl('line', { x1: x3, y1: cy + 30, x2: x3, y2: cy + 38, stroke: '#888888', 'stroke-width': 1.2 }));
        const t2 = rEl('text', { x: (x1 + x3) / 2, y: cy + 52, 'text-anchor': 'middle', 'font-size': 12, fill: '#888888', 'font-family': 'Arial' });
        t2.textContent = 'g ∘ f'; svg.appendChild(t2);
    }

    // ============================================================
    // PARTIE 4 — Fonctions de référence
    // ============================================================

    function drawCubeUp() {
        const s = SvgUtils.setupSVG('cubeUpGraph', { xMin: -2.3, xMax: 2.3, yMin: -8.6, yMax: 8.6 });
        if (!s) return;
        SvgUtils.drawGrid(s);
        SvgUtils.drawAxesWithArrows(s, { xLabel: 'x', yLabel: 'y' });
        SvgUtils.drawCurve(s, x => x * x * x, -2.05, 2.05, { color: '#4ECDC4', lineWidth: 2.4 });
        SvgUtils.drawPoint(s, { x: 0, y: 0, label: '', color: '#F4D03F', showCoords: false });
        SvgUtils.drawNote(s, 'f(x) = ax³  (a > 0)', 0.3, 7.8, { color: '#4ECDC4', fontSize: s.fontSize * 0.9 });
    }

    function drawCubeDown() {
        const s = SvgUtils.setupSVG('cubeDownGraph', { xMin: -2.3, xMax: 2.3, yMin: -8.6, yMax: 8.6 });
        if (!s) return;
        SvgUtils.drawGrid(s);
        SvgUtils.drawAxesWithArrows(s, { xLabel: 'x', yLabel: 'y' });
        SvgUtils.drawCurve(s, x => -x * x * x, -2.05, 2.05, { color: '#FF6B6B', lineWidth: 2.4 });
        SvgUtils.drawPoint(s, { x: 0, y: 0, label: '', color: '#F4D03F', showCoords: false });
        SvgUtils.drawNote(s, 'f(x) = ax³  (a < 0)', 0.15, 7.8, { color: '#FF6B6B', fontSize: s.fontSize * 0.9 });
    }

    // f(x) = √x + a : المنحنى الأساسي (a=0) + منحنيين مرجعيين متقطعين (a=1, a=-1)
    // باش نبينو بوضوح تأثير الإزاحة العمودية "a" لي كيتكلم عليها السؤال
    function drawSqrt() {
        const s = SvgUtils.setupSVG('sqrtGraph', { xMin: -1.5, xMax: 9.5, yMin: -2.5, yMax: 4.5 });
        if (!s) return;
        SvgUtils.drawGrid(s);
        SvgUtils.drawAxesWithArrows(s, { xLabel: 'x', yLabel: 'y' });
        SvgUtils.drawCurve(s, x => Math.sqrt(x) + 1, 0, 9.3, { color: '#F4D03F', lineWidth: 1.8, dashed: true });
        SvgUtils.drawCurve(s, x => Math.sqrt(x) - 1, 0, 9.3, { color: '#FF6B6B', lineWidth: 1.8, dashed: true });
        SvgUtils.drawCurve(s, x => Math.sqrt(x), 0, 9.3, { color: '#4ECDC4', lineWidth: 2.6 });
        SvgUtils.drawPoint(s, { x: 0, y: 0, label: '', color: '#4ECDC4', showCoords: false });
        SvgUtils.drawNote(s, 'a = 1', 8.7, Math.sqrt(9.5) + 1.25, { color: '#F4D03F', fontSize: s.fontSize * 0.85 });
        SvgUtils.drawNote(s, 'a = 0', 8.7, Math.sqrt(9.5) + 0.25, { color: '#4ECDC4', fontSize: s.fontSize * 0.85 });
        SvgUtils.drawNote(s, 'a = -1', 8.5, Math.sqrt(9.5) - 0.85, { color: '#FF6B6B', fontSize: s.fontSize * 0.85 });
    }

    // ============================================================
    // PARTIE 5 — Exercices
    // ============================================================

    function drawGraph1a() {
        const s = SvgUtils.setupSVG('graph1a', { xMin: -1.5, xMax: 3.5, yMin: -3, yMax: 1.6 });
        if (!s) return;
        SvgUtils.drawGrid(s);
        SvgUtils.drawAxesWithArrows(s, { xLabel: 'x', yLabel: 'y' });
        SvgUtils.drawCurve(s, x => -x * x + 2 * x, -1.3, 3.3, { color: '#4ECDC4', lineWidth: 2.3 });
        SvgUtils.drawLine(s, -1.5, 1, 3.5, 1, { color: '#FF6B6B', dashed: true, dashPattern: [4, 4] });
        SvgUtils.drawPoint(s, { x: 1, y: 1, label: '', color: '#F4D03F', showCoords: false });
        SvgUtils.drawPoint(s, { x: 0, y: 0, label: '', color: '#888888', radius: s.fontSize * 0.18, showCoords: false });
        SvgUtils.drawPoint(s, { x: 2, y: 0, label: '', color: '#888888', radius: s.fontSize * 0.18, showCoords: false });
        SvgUtils.drawNote(s, 'M = 1', 2.55, 1.28, { color: '#FF6B6B', fontSize: s.fontSize * 0.85 });
        SvgUtils.drawNote(s, 'f(x) = -x² + 2x', -1.3, 1.45, { color: '#4ECDC4', fontSize: s.fontSize * 0.85 });
    }

    function drawGraph2() {
        const s = SvgUtils.setupSVG('graph2', { xMin: -4.5, xMax: 2.5, yMin: -1, yMax: 10 });
        if (!s) return;
        SvgUtils.drawGrid(s);
        SvgUtils.drawAxesWithArrows(s, { xLabel: 'x', yLabel: 'y' });
        SvgUtils.drawCurve(s, x => x * x + 2 * x + 3, -4.2, 2.2, { color: '#4ECDC4', lineWidth: 2.3 });
        SvgUtils.drawPoint(s, { x: -1, y: 2, label: '(-1 ; 2)', color: '#F4D03F', offsetY: 0.6 });
    }

    function drawGraph3() {
        const s = SvgUtils.setupSVG('graph3', { xMin: -3.5, xMax: 3.5, yMin: -1, yMax: 10 });
        if (!s) return;
        SvgUtils.drawGrid(s);
        SvgUtils.drawAxesWithArrows(s, { xLabel: 'x', yLabel: 'y' });
        SvgUtils.drawCurve(s, x => x * x + Math.SQRT2, -3.2, 3.2, { color: '#4ECDC4', lineWidth: 2.3 });
        SvgUtils.drawPoint(s, { x: 0, y: Math.SQRT2, label: '√2', color: '#F4D03F', offsetY: 0.55, showCoords: false });
    }

    // ============================================================
    // PARTIE 3 (section 1) — Égalité de deux fonctions : NOUVEAU
    // Montre f et g avec la MÊME formule x²+1 mais des domaines différents
    // ⇒ f ≠ g, ce qui illustre concrètement la définition du texte.
    // ============================================================
    function drawEgalite() {
        const s = SvgUtils.setupSVG('egaliteGraph', { xMin: -2.6, xMax: 2.6, yMin: -0.6, yMax: 5.6 });
        if (!s) return;
        const h = x => x * x + 1;
        SvgUtils.drawGrid(s);
        SvgUtils.drawAxesWithArrows(s, { xLabel: 'x', yLabel: 'y' });
        // partie commune D_g = [-2,1] : les deux courbes coïncident (trait épais doré)
        SvgUtils.drawCurve(s, h, -2, 1, { color: '#F4D03F', lineWidth: 2.6 });
        // partie où f est définie mais pas g : [1,2], en rouge pointillé
        SvgUtils.drawCurve(s, h, 1, 2, { color: '#FF6B6B', lineWidth: 2, dashed: true });
        SvgUtils.drawPoint(s, { x: 1, y: h(1), label: '', color: '#FF6B6B', showCoords: false });
        SvgUtils.drawNote(s, 'D_g = [-2 ; 1]', -2.5, 5.2, { color: '#F4D03F', fontSize: s.fontSize * 0.8 });
        SvgUtils.drawNote(s, 'f défini mais x∉D_g', 0.2, 5.2, { color: '#FF6B6B', fontSize: s.fontSize * 0.72 });
        SvgUtils.drawNote(s, 'même formule x²+1, domaines différents ⇒ f ≠ g', -2.5, -0.35, { color: '#888888', fontSize: s.fontSize * 0.68 });
    }

    // ============================================================
    // PARTIE 6 — Résumé (f(x) = √x)
    // ============================================================
    function drawSqrtSummary() {
        const s = SvgUtils.setupSVG('graphSqrt', { xMin: -1, xMax: 9, yMin: -1, yMax: 3.3 });
        if (!s) return;
        SvgUtils.drawGrid(s);
        SvgUtils.drawAxesWithArrows(s, { xLabel: 'x', yLabel: 'y' });
        SvgUtils.drawCurve(s, x => Math.sqrt(x), 0, 8.8, { color: '#4ECDC4', lineWidth: 2.4 });
        SvgUtils.drawPoint(s, { x: 0, y: 0, label: '', color: '#4ECDC4', showCoords: false });
        SvgUtils.drawNote(s, 'f(x) = √x', 6, 3, { color: '#4ECDC4', fontSize: s.fontSize * 0.9 });
    }

    // ============================================================
    // تشغيل كل الرسومات (كل دالة كتفحص وجود العنصر ديالها بروحها،
    // فلا مشكل نخدمو نفس الملف فـ 6 صفحات مختلفة)
    // ============================================================
    document.addEventListener('DOMContentLoaded', function () {
        setTimeout(function () {
            drawDomainMap();
            drawPaire();
            drawImpaire();
            drawMonotonie();
            drawTaux();
            drawBornee();
            drawMax();
            drawMin();
            drawPeriodique();
            drawComparison();
            drawComposition();
            drawEgalite();
            drawCubeUp();
            drawCubeDown();
            drawSqrt();
            drawGraph1a();
            drawGraph2();
            drawGraph3();
            drawSqrtSummary();
        }, 300);
    });
})();
