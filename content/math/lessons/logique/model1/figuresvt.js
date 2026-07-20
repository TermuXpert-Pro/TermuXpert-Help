// ============================================================
// figuresvt.js  —  درس "المنطق الرياضي" (Logique)
// هاذ الملف خاص بهاذ الدرس بوحدو (كاين فـ نفس الجدر ديال part1..5)،
// ماشي نفس figuresvt.js العام ديال دروس الدوال (assets/js/figuresvt.js).
//
// كل رسم هنا صمم خصيصا على حساب الفقرة/السؤال المرتبط بيه:
//   - المكممات (∀ / ∃)                  -> part1.html
//   - النفي / العطف / الفصل / الاستلزام  -> part2.html
//   - العكس بالنقيض / الاستنتاج         -> part3.html
//   - تقسيم الحالات / الخلف / الترجع    -> part4.html
//
// يعتمد (بشكل اختياري) على svg-utils.js لرسم خط الأعداد فـ
// "تقسيم الحالات"، والباقي كيبني SVG ديالو مباشرة (مربعات، دوائر،
// أسهم، clipPath) لأن svg-utils.js مبني غير للمنحنيات الرياضية.
//
// الاستعمال (فكل part*.html):
//   <script src="{{BASE}}assets/js/svg-utils.js"></script>  (اختياري، كيتستعمل غير فـ figDisjonctionCas)
//   <script src="figuresvt.js"></script>
// ============================================================

(function () {
    const NS = 'http://www.w3.org/2000/svg';
    const U = (typeof SvgUtils !== 'undefined') ? SvgUtils : (window.SvgUtils || null);

    const C = {
        p: '#4ECDC4',        // اللون الأساسي (P / vrai)
        pFill: 'rgba(78,205,196,0.32)',
        q: '#BB8FCE',        // اللون الثانوي (Q)
        qFill: 'rgba(187,143,206,0.28)',
        false_: '#FF6B6B',   // الخطأ / التناقض
        falseFill: 'rgba(255,107,107,0.18)',
        gold: '#F4D03F',
        goldFill: 'rgba(244,208,63,0.25)',
        text: '#FFFFFF',
        muted: '#9aa2ac'
    };

    function el(tag, attrs) {
        const e = document.createElementNS(NS, tag);
        if (attrs) for (const k in attrs) e.setAttribute(k, attrs[k]);
        return e;
    }

    // كيهيّئ svg بـ viewBox بإحداثيات شاشة عادية (y كيزيد لتحت)
    function setup(svgId, w, h) {
        const svg = document.getElementById(svgId);
        if (!svg) return null;
        while (svg.firstChild) svg.removeChild(svg.firstChild);
        svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        return svg;
    }

    function txt(svg, x, y, str, attrs) {
        const a = Object.assign({ x, y, 'font-family': 'Arial, sans-serif', 'text-anchor': 'middle' }, attrs || {});
        const t = el('text', a);
        t.textContent = str;
        svg.appendChild(t);
        return t;
    }

    // كتابة عدة أسطر (\n) متمركزة عموديا داخل صندوق
    function multiTxt(svg, cx, cy, str, attrs) {
        const lines = String(str).split('\n');
        const fs = (attrs && attrs['font-size']) || 13;
        const lh = fs * 1.25;
        let ty = cy - ((lines.length - 1) * lh) / 2 + fs * 0.32;
        lines.forEach(line => {
            txt(svg, cx, ty, line, attrs);
            ty += lh;
        });
    }

    // سهم (خط + رأس مثلث) بين نقطتين
    function arrow(svg, x1, y1, x2, y2, opts) {
        opts = opts || {};
        const color = opts.color || C.p;
        const lw = opts.lineWidth || 2;
        if (opts.dashed) {
            svg.appendChild(el('line', { x1, y1, x2, y2, stroke: color, 'stroke-width': lw, 'stroke-dasharray': opts.dash || '5 4' }));
        } else {
            svg.appendChild(el('line', { x1, y1, x2, y2, stroke: color, 'stroke-width': lw }));
        }
        const angle = Math.atan2(y2 - y1, x2 - x1);
        const ah = opts.headSize || 8;
        const p1x = x2 - ah * Math.cos(angle - Math.PI / 7);
        const p1y = y2 - ah * Math.sin(angle - Math.PI / 7);
        const p2x = x2 - ah * Math.cos(angle + Math.PI / 7);
        const p2y = y2 - ah * Math.sin(angle + Math.PI / 7);
        svg.appendChild(el('polygon', { points: `${x2},${y2} ${p1x},${p1y} ${p2x},${p2y}`, fill: color }));
    }

    // صندوق (مستطيل + نص فـ الوسط)
    function box(svg, x, y, w, h, label, opts) {
        opts = opts || {};
        svg.appendChild(el('rect', {
            x, y, width: w, height: h, rx: opts.rx ?? 8,
            fill: opts.fill || 'rgba(78,205,196,0.10)',
            stroke: opts.stroke || C.p,
            'stroke-width': opts.strokeWidth || 1.6,
            'stroke-dasharray': opts.strokeDash || ''
        }));
        if (label) {
            multiTxt(svg, x + w / 2, y + h / 2, label, {
                fill: opts.textColor || C.text,
                'font-size': opts.fontSize || 13,
                'font-weight': opts.fontWeight || 700
            });
        }
    }

    function caption(svg, cx, y, str, opts) {
        opts = opts || {};
        txt(svg, cx, y, str, { fill: opts.color || C.muted, 'font-size': opts.fontSize || 11.5, 'font-weight': opts.fontWeight || 400 });
    }

    // ============================================================
    // PART 1 — المكممات (∀ / ∃)
    // ============================================================

    // ∀x ∈ E, Q(x) : كل عناصر E كتحقق Q(x)
    function drawQuantifUniversel() {
        const svg = setup('figQuantifUniversel', 320, 175);
        if (!svg) return;
        svg.appendChild(el('rect', { x: 20, y: 20, width: 280, height: 110, rx: 14, fill: 'rgba(78,205,196,0.05)', stroke: C.muted, 'stroke-width': 1.3 }));
        txt(svg, 44, 40, 'E', { fill: C.muted, 'font-size': 15, 'font-weight': 700 });
        const xs = [65, 115, 165, 215, 265];
        xs.forEach(x => {
            svg.appendChild(el('circle', { cx: x, cy: 85, r: 16, fill: C.pFill, stroke: C.p, 'stroke-width': 2 }));
            txt(svg, x, 90, '✓', { fill: C.p, 'font-size': 16, 'font-weight': 900 });
        });
        caption(svg, 160, 150, 'Tous les éléments de E vérifient Q(x)', { color: C.p, fontWeight: 700 });
        caption(svg, 160, 165, '∀x ∈ E, Q(x) est vraie', { color: C.muted });
    }

    // ∃x ∈ E, Q(x) : élément وحيد (على الأقل) كيحقق Q(x)
    function drawQuantifExistentiel() {
        const svg = setup('figQuantifExistentiel', 320, 175);
        if (!svg) return;
        svg.appendChild(el('rect', { x: 20, y: 20, width: 280, height: 110, rx: 14, fill: 'rgba(255,107,107,0.04)', stroke: C.muted, 'stroke-width': 1.3 }));
        txt(svg, 44, 40, 'E', { fill: C.muted, 'font-size': 15, 'font-weight': 700 });
        const xs = [65, 115, 165, 215, 265];
        xs.forEach((x, i) => {
            const ok = (i === 2); // غير الوسط هو لي كيحقق Q(x)
            svg.appendChild(el('circle', { cx: x, cy: 85, r: ok ? 19 : 14, fill: ok ? C.pFill : C.falseFill, stroke: ok ? C.p : C.false_, 'stroke-width': ok ? 2.4 : 1.6 }));
            txt(svg, x, ok ? 91 : 89, ok ? '✓' : '✗', { fill: ok ? C.p : C.false_, 'font-size': ok ? 18 : 12, 'font-weight': 900 });
        });
        arrow(svg, 165, 45, 165, 62, { color: C.gold, headSize: 6, lineWidth: 1.5 });
        caption(svg, 160, 150, 'Un seul élément suffit à vérifier Q(x)', { color: C.p, fontWeight: 700 });
        caption(svg, 160, 165, '∃x ∈ E, Q(x) est vraie', { color: C.muted });
    }

    // ============================================================
    // PART 2 — Négation / Conjonction / Disjonction / Implication
    // ============================================================

    // Négation : l'extérieur du cercle P (dans E) représente P̄
    function drawNegation() {
        const svg = setup('figNegation', 300, 180);
        if (!svg) return;
        svg.appendChild(el('rect', { x: 20, y: 20, width: 260, height: 120, rx: 12, fill: C.falseFill, stroke: C.false_, 'stroke-width': 1.4 }));
        svg.appendChild(el('circle', { cx: 105, cy: 80, r: 48, fill: C.pFill, stroke: C.p, 'stroke-width': 2 }));
        txt(svg, 105, 76, 'P', { fill: C.p, 'font-size': 18, 'font-weight': 800 });
        txt(svg, 105, 95, '(Vrai)', { fill: C.p, 'font-size': 10.5 });
        txt(svg, 210, 55, 'P̄', { fill: C.false_, 'font-size': 17, 'font-weight': 800 });
        txt(svg, 210, 72, '(Faux)', { fill: C.false_, 'font-size': 10.5 });
        caption(svg, 150, 158, 'Ce qui est en dehors du cercle P est sa négation P̄', { color: C.muted });
    }

    // Conjonction P∧Q : uniquement l'intersection (clipPath) est colorée
    function drawConjonction() {
        const svg = setup('figConjonction', 300, 190);
        if (!svg) return;
        const defs = el('defs');
        const clip = el('clipPath', { id: 'clipConj' });
        clip.appendChild(el('circle', { cx: 118, cy: 90, r: 55 }));
        defs.appendChild(clip);
        svg.appendChild(defs);

        svg.appendChild(el('rect', { x: 15, y: 15, width: 270, height: 150, rx: 12, fill: 'none', stroke: C.muted, 'stroke-width': 1, 'stroke-dasharray': '4 4' }));
        svg.appendChild(el('circle', { cx: 118, cy: 90, r: 55, fill: 'none', stroke: C.p, 'stroke-width': 2 }));
        svg.appendChild(el('circle', { cx: 182, cy: 90, r: 55, fill: 'none', stroke: C.q, 'stroke-width': 2 }));
        // نلونو غير التقاطع: دائرة Q مقصوصة بشكل دائرة P
        svg.appendChild(el('circle', { cx: 182, cy: 90, r: 55, fill: C.gold, 'fill-opacity': 0.55, 'clip-path': 'url(#clipConj)' }));

        txt(svg, 82, 62, 'P', { fill: C.p, 'font-size': 17, 'font-weight': 800 });
        txt(svg, 218, 62, 'Q', { fill: C.q, 'font-size': 17, 'font-weight': 800 });
        txt(svg, 150, 94, 'P∧Q', { fill: '#2b2b1a', 'font-size': 12, 'font-weight': 800 });
        caption(svg, 150, 168, 'P ∧ Q est vraie uniquement dans la zone commune', { color: C.gold, fontWeight: 700 });
        caption(svg, 150, 182, '(l\'intersection des deux ensembles)', { color: C.muted });
    }

    // Disjonction P∨Q : toute la zone couverte (union) est colorée
    function drawDisjonction() {
        const svg = setup('figDisjonction', 300, 190);
        if (!svg) return;
        svg.appendChild(el('rect', { x: 15, y: 15, width: 270, height: 150, rx: 12, fill: 'none', stroke: C.muted, 'stroke-width': 1, 'stroke-dasharray': '4 4' }));
        svg.appendChild(el('circle', { cx: 118, cy: 90, r: 55, fill: C.pFill, stroke: C.p, 'stroke-width': 2 }));
        svg.appendChild(el('circle', { cx: 182, cy: 90, r: 55, fill: C.pFill, stroke: C.q, 'stroke-width': 2 }));
        txt(svg, 82, 62, 'P', { fill: C.p, 'font-size': 17, 'font-weight': 800 });
        txt(svg, 218, 62, 'Q', { fill: C.q, 'font-size': 17, 'font-weight': 800 });
        txt(svg, 150, 94, 'P∨Q', { fill: C.text, 'font-size': 12, 'font-weight': 800 });
        caption(svg, 150, 168, 'P ∨ Q est vraie dès que l\'un des deux (ou les deux) est vrai', { color: C.p, fontWeight: 700 });
        caption(svg, 150, 182, '(toute la zone coloriée, union des deux ensembles)', { color: C.muted });
    }

    // Implication P⇒Q : P ⊂ Q (tout élément de P est aussi dans Q)
    function drawImplication() {
        const svg = setup('figImplication', 320, 195);
        if (!svg) return;
        svg.appendChild(el('circle', { cx: 185, cy: 95, r: 80, fill: C.qFill, stroke: C.q, 'stroke-width': 2 }));
        svg.appendChild(el('circle', { cx: 145, cy: 95, r: 32, fill: C.pFill, stroke: C.p, 'stroke-width': 2 }));
        txt(svg, 145, 100, 'P', { fill: C.p, 'font-size': 16, 'font-weight': 800 });
        txt(svg, 235, 55, 'Q', { fill: C.q, 'font-size': 17, 'font-weight': 800 });
        caption(svg, 160, 172, 'P ⇒ Q : tout élément qui vérifie P vérifie aussi Q', { color: C.muted, fontWeight: 700 });
        caption(svg, 160, 186, '(P est inclus dans Q : P ⊂ Q)', { color: C.muted });
    }

    // ============================================================
    // PART 3 — Contraposée / Déductif
    // ============================================================

    // P⇒Q équivaut à ¬Q⇒¬P (deux lignes reliées par ≡)
    function drawContraposee() {
        const svg = setup('figContraposee', 320, 190);
        if (!svg) return;
        caption(svg, 160, 14, 'Implication directe', { color: C.p, fontWeight: 700, fontSize: 12 });
        box(svg, 20, 22, 75, 42, 'P', { stroke: C.p, fill: C.pFill });
        arrow(svg, 100, 43, 195, 43, { color: C.p });
        txt(svg, 148, 34, '⇒', { fill: C.p, 'font-size': 16, 'font-weight': 800 });
        box(svg, 200, 22, 75, 42, 'Q', { stroke: C.q, fill: C.qFill });

        txt(svg, 160, 95, '≡', { fill: C.gold, 'font-size': 26, 'font-weight': 900 });
        caption(svg, 160, 112, 'équivalentes', { color: C.gold, fontSize: 10.5 });

        box(svg, 20, 126, 75, 42, '¬Q', { stroke: C.q, fill: C.qFill });
        arrow(svg, 100, 147, 195, 147, { color: C.q });
        txt(svg, 148, 138, '⇒', { fill: C.q, 'font-size': 16, 'font-weight': 800 });
        box(svg, 200, 126, 75, 42, '¬P', { stroke: C.p, fill: C.pFill });
        caption(svg, 160, 182, 'Contraposée (même valeur de vérité)', { color: C.q, fontWeight: 700, fontSize: 12 });
    }

    // Raisonnement déductif (modus ponens) : P et P⇒Q donnent Q
    function drawDeductif() {
        const svg = setup('figDeductif', 320, 155);
        if (!svg) return;
        box(svg, 12, 15, 120, 45, 'P\n(donnée vraie)', { stroke: C.p, fill: C.pFill, fontSize: 12 });
        box(svg, 12, 90, 120, 45, 'P ⇒ Q\n(théorème)', { stroke: C.p, fill: C.pFill, fontSize: 12 });
        box(svg, 205, 52, 105, 50, 'Q\n(conclusion\nvraie)', { stroke: C.gold, fill: C.goldFill, fontSize: 11.5 });
        arrow(svg, 134, 37, 203, 65, { color: C.muted });
        arrow(svg, 134, 112, 203, 85, { color: C.muted });
        caption(svg, 160, 142, 'Modus ponens : P vraie + (P ⇒ Q) vraie  ⟹  Q vraie', { color: C.muted });
    }

    // ============================================================
    // PART 4 — Disjonction des cas / Absurde / Récurrence
    // ============================================================

    // Résolution de |x+1| + 2x = 0 : ligne des réels divisée en 2 cas
    function drawDisjonctionCas() {
        const svg = setup('figDisjonctionCas', 340, 165);
        if (!svg) return;
        const toPx = v => 170 + v * 40; // repère : v=0 -> x=170 px, 40px/unité
        const y0 = 95;

        // zones des deux cas
        svg.appendChild(el('rect', { x: 20, y: y0 - 16, width: toPx(-1) - 20, height: 32, fill: C.pFill }));
        svg.appendChild(el('rect', { x: toPx(-1), y: y0 - 16, width: 320 - toPx(-1), height: 32, fill: C.qFill }));

        // ligne des réels (flèche dans les deux sens)
        svg.appendChild(el('line', { x1: 15, y1: y0, x2: 325, y2: y0, stroke: C.muted, 'stroke-width': 1.5 }));
        svg.appendChild(el('polygon', { points: `325,${y0} 316,${y0 - 4} 316,${y0 + 4}`, fill: C.muted }));
        svg.appendChild(el('polygon', { points: `15,${y0} 24,${y0 - 4} 24,${y0 + 4}`, fill: C.muted }));

        // graduations
        [-3, -2, -1, 0, 1].forEach(v => {
            svg.appendChild(el('line', { x1: toPx(v), y1: y0 - 4, x2: toPx(v), y2: y0 + 4, stroke: C.muted, 'stroke-width': 1.2 }));
            if (v !== -1) txt(svg, toPx(v), y0 + 18, String(v), { fill: C.muted, 'font-size': 11 });
        });

        // point fermé à x = -1 (appartient aux deux intervalles)
        svg.appendChild(el('circle', { cx: toPx(-1), cy: y0, r: 5, fill: C.text, stroke: C.muted, 'stroke-width': 1.2 }));
        txt(svg, toPx(-1), y0 + 18, '-1', { fill: C.text, 'font-size': 11, 'font-weight': 700 });

        // point solution x = -1/3
        const xs = toPx(-1 / 3);
        svg.appendChild(el('circle', { cx: xs, cy: y0, r: 6, fill: C.gold, stroke: '#2b2b1a', 'stroke-width': 1 }));
        arrow(svg, xs, y0 - 34, xs, y0 - 9, { color: C.gold, headSize: 6, lineWidth: 1.5 });
        txt(svg, xs, y0 - 40, 'x = -1/3', { fill: C.gold, 'font-size': 11, 'font-weight': 800 });

        caption(svg, 90, y0 - 24, 'Cas 1 : x ∈ ]-∞, -1]', { color: C.p, fontWeight: 700, fontSize: 11 });
        caption(svg, 250, y0 - 24, 'Cas 2 : x ∈ [-1, +∞[', { color: C.q, fontWeight: 700, fontSize: 11 });
        caption(svg, 170, 148, 'La solution x = -1/3 appartient au Cas 2', { color: C.muted });
    }

    // Raisonnement par l'absurde (flux : hypothèse -> contradiction -> conclusion)
    function drawAbsurde() {
        const svg = setup('figAbsurde', 320, 250);
        if (!svg) return;
        box(svg, 80, 10, 160, 38, 'Hypothèse : ¬Q vraie', { stroke: C.gold, fill: C.goldFill, fontSize: 12 });
        arrow(svg, 160, 48, 160, 66, { color: C.muted });
        box(svg, 80, 68, 160, 38, 'Raisonnement…', { stroke: C.muted, fill: 'rgba(255,255,255,0.04)', fontSize: 12, strokeDash: '4 3' });
        arrow(svg, 160, 106, 160, 124, { color: C.muted });
        box(svg, 55, 126, 210, 44, 'Contradiction : P et ¬P vraies', { stroke: C.false_, fill: C.falseFill, fontSize: 12 });
        arrow(svg, 160, 170, 160, 190, { color: C.false_ });
        box(svg, 80, 192, 160, 38, 'Donc Q est vraie ✓', { stroke: C.p, fill: C.pFill, fontSize: 12 });
        caption(svg, 160, 240, 'On suppose le contraire, on aboutit à l\'absurde, donc Q est vraie', { color: C.muted, fontSize: 11 });
    }

    // Raisonnement par récurrence : chaîne P(n0) ⇒ P(n0+1) ⇒ P(n0+2) ⇒ ...
    function drawRecurrence() {
        const svg = setup('figRecurrence', 340, 155);
        if (!svg) return;
        caption(svg, 42, 35, '✓ Initialisation', { color: C.p, fontWeight: 700, fontSize: 11 });
        box(svg, 10, 55, 65, 45, 'P(n₀)', { stroke: C.p, fill: C.pFill, fontSize: 12 });
        arrow(svg, 78, 77, 100, 77, { color: C.muted });
        box(svg, 103, 55, 72, 45, 'P(n₀+1)', { stroke: C.q, fill: C.qFill, fontSize: 11.5 });
        arrow(svg, 178, 77, 200, 77, { color: C.muted });
        box(svg, 203, 55, 72, 45, 'P(n₀+2)', { stroke: C.q, fill: C.qFill, fontSize: 11.5 });
        arrow(svg, 278, 77, 300, 77, { color: C.muted });
        txt(svg, 315, 82, '…', { fill: C.muted, 'font-size': 22, 'font-weight': 800 });
        caption(svg, 170, 120, 'Hérédité : P(n) ⇒ P(n+1)', { color: C.q, fontWeight: 700, fontSize: 12 });
        caption(svg, 170, 138, 'la propriété se transmet de proche en proche à l\'infini', { color: C.muted, fontSize: 11 });
    }

    // ------------------------------------------------------------
    // كل صفحة كتحتوي غير على بعض هاذ الـ <svg> — كل دالة كتخرج
    // بسرعة إذا ماكانش id ديالها موجود، فلا مشكل نخدموهم بجوج
    // من صفحة وحدة (part1..part5).
    // ------------------------------------------------------------
    function initFigures() {
        drawQuantifUniversel();
        drawQuantifExistentiel();
        drawNegation();
        drawConjonction();
        drawDisjonction();
        drawImplication();
        drawContraposee();
        drawDeductif();
        drawDisjonctionCas();
        drawAbsurde();
        drawRecurrence();
    }

    window.XpertLogiqueFigures = { initFigures };

    document.addEventListener('DOMContentLoaded', function () {
        setTimeout(initFigures, 150);
    });
})();
