// ============================================================
// svg-utils.js
// نسخة SVG من canvas-utils.js — نفس الدوال بنفس المنطق، بس هنا كل
// عنصر هو DOM حقيقي (<circle>, <line>, <text>...) بإحداثيات رياضية
// مباشرة (بلا ox/oy/scale يدوي) عبر viewBox.
//
// الاستعمال فكل صفحة (بعد ما تحمل هاذ الملف):
//   <script src="{{BASE}}assets/js/svg-utils.js"></script>
//   <script src="figuresvg.js"></script>   <!-- خاص بالصفحة -->
// ============================================================

const SvgUtils = (function () {
    const NS = 'http://www.w3.org/2000/svg';

    const COLORS = {
        axis: '#2A2A3E',
        grid: '#1A1A2E',
        arrow: '#4ECDC4',
        label: '#4ECDC4',
        text: '#FFFFFF',
        muted: '#888888'
    };

    function el(tag, attrs) {
        const e = document.createElementNS(NS, tag);
        for (const k in attrs) e.setAttribute(k, attrs[k]);
        return e;
    }

    // كيمسح القديم، كيدير viewBox بمدى رياضي (y مقلوبة تلقائياً
    // لأن SVG كيعتبر y+ لتحت)، كيرجع state كامل كتحتاجو باقي الدوال
    function setupSVG(svgId, range) {
        const svg = document.getElementById(svgId);
        if (!svg) return null;
        const { xMin = -1, xMax = 9, yMin = -1, yMax = 7 } = range || {};
        const w = xMax - xMin, h = yMax - yMin;

        while (svg.firstChild) svg.removeChild(svg.firstChild);
        svg.setAttribute('viewBox', `${xMin} ${-yMax} ${w} ${h}`);
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

        return { svg, xMin, xMax, yMin, yMax, fontSize: w / 22 };
    }

    // محاور x/y + سهام + labels
    function drawAxesWithArrows(s, opts) {
        opts = opts || {};
        const g = el('g', { stroke: opts.color || COLORS.axis, 'stroke-width': 0.05 });
        g.appendChild(el('line', { x1: s.xMin, y1: 0, x2: s.xMax, y2: 0 }));
        g.appendChild(el('line', { x1: 0, y1: -s.yMin, x2: 0, y2: -s.yMax }));
        s.svg.appendChild(g);

        const arrowColor = opts.arrowColor || COLORS.arrow;
        const ah = s.fontSize * 0.4;
        s.svg.appendChild(el('polygon', {
            points: `${s.xMax},0 ${s.xMax - ah},${ah / 2} ${s.xMax - ah},${-ah / 2}`,
            fill: arrowColor
        }));
        s.svg.appendChild(el('polygon', {
            points: `0,${-s.yMax} ${-ah / 2},${-s.yMax + ah} ${ah / 2},${-s.yMax + ah}`,
            fill: arrowColor
        }));

        if (opts.labels !== false) {
            drawNote(s, opts.xLabel || 'x', s.xMax - ah, -s.fontSize * 0.6, { color: opts.labelColor || COLORS.label });
            drawNote(s, opts.yLabel || 'y', s.fontSize * 0.5, -s.yMax + ah * 1.5, { color: opts.labelColor || COLORS.label });
        }
    }

    // شبكة (grid) بمدى رياضي
    function drawGrid(s, opts) {
        const g = el('g', { stroke: (opts && opts.color) || COLORS.grid, 'stroke-width': 0.02 });
        for (let i = Math.ceil(s.xMin); i <= Math.floor(s.xMax); i++) {
            if (i === 0) continue;
            g.appendChild(el('line', { x1: i, y1: -s.yMin, x2: i, y2: -s.yMax }));
        }
        for (let j = Math.ceil(s.yMin); j <= Math.floor(s.yMax); j++) {
            if (j === 0) continue;
            g.appendChild(el('line', { x1: s.xMin, y1: -j, x2: s.xMax, y2: -j }));
        }
        s.svg.appendChild(g);
    }

    // نقطة معلمة (point + label + إحداثيات اختيارية)
    function drawPoint(s, point) {
        const r = point.radius || s.fontSize * 0.28;
        s.svg.appendChild(el('circle', {
            cx: point.x, cy: -point.y, r,
            fill: point.color || COLORS.arrow
        }));

        if (point.label !== undefined) {
            const coordText = point.showCoords !== false
                ? ` (${point.x.toFixed(1)};${point.y.toFixed(1)})`
                : '';
            drawNote(
                s, point.label + coordText,
                point.x + (point.offsetX ?? r * 1.3),
                -point.y - (point.offsetY ?? r * 1.3),
                { color: point.textColor || COLORS.text, fontSize: point.fontSize }
            );
        }
    }

    // مجموعة نقط دفعة وحدة
    function drawPoints(s, points) {
        points.forEach(p => drawPoint(s, p));
    }

    // خط بين نقطتين (بالإحداثيات الرياضية) - اختياري متقطع (dashed)
    function drawLine(s, x1, y1, x2, y2, opts) {
        opts = opts || {};
        const attrs = {
            x1, y1: -y1, x2, y2: -y2,
            stroke: opts.color || COLORS.axis,
            'stroke-width': (opts.lineWidth || 1) * 0.025
        };
        if (opts.dashed) {
            const [a, b] = opts.dashPattern || [4, 4];
            attrs['stroke-dasharray'] = `${a * 0.025} ${b * 0.025}`;
        }
        s.svg.appendChild(el('line', attrs));
    }

    // دائرة (مركز + شعاع) - جديدة، ماكانتش دالة مستقلة فـ canvas-utils
    // (كانت inline بـ ctx.arc فكل صفحة كتحتاجها)
    function drawCircle(s, cx, cy, r, opts) {
        opts = opts || {};
        const attrs = {
            cx, cy: -cy, r,
            fill: opts.fill || 'none',
            stroke: opts.color || COLORS.axis,
            'stroke-width': (opts.lineWidth || 1) * 0.025
        };
        if (opts.opacity !== undefined) attrs['fill-opacity'] = opts.opacity;
        if (opts.dashed) {
            const [a, b] = opts.dashPattern || [6, 4];
            attrs['stroke-dasharray'] = `${a * 0.025} ${b * 0.025}`;
        }
        s.svg.appendChild(el('circle', attrs));
    }

    // مستطيل (لِلحاويات، الأعمدة البيانية bar-chart...) - جديدة.
    // (x, yTop) هي الزاوية العليا اليسرى بالإحداثيات الرياضية (yTop
    // هو أعلى قيمة y ديال المستطيل)، وكيتمدد بعرض w ويهبط بارتفاع h.
    function drawRect(s, x, yTop, w, h, opts) {
        opts = opts || {};
        const attrs = {
            x, y: -yTop, width: w, height: h,
            fill: opts.fill || 'none',
            stroke: opts.color || COLORS.axis,
            'stroke-width': (opts.lineWidth || 1) * 0.025
        };
        if (opts.rx) attrs.rx = opts.rx;
        if (opts.opacity !== undefined) attrs['fill-opacity'] = opts.opacity;
        if (opts.dashed) {
            const [a, b] = opts.dashPattern || [6, 4];
            attrs['stroke-dasharray'] = `${a * 0.025} ${b * 0.025}`;
        }
        s.svg.appendChild(el('rect', attrs));
    }

    // تعليق نصي حر (بإحداثيات رياضية مباشرة)
    function drawNote(s, text, x, y, opts) {
        opts = opts || {};
        const attrs = {
            x, y,
            fill: opts.color || COLORS.muted,
            'font-size': opts.fontSize || s.fontSize,
            'font-family': opts.fontFamily || 'Arial, sans-serif'
        };
        if (opts.anchor) attrs['text-anchor'] = opts.anchor; // 'start' | 'middle' | 'end'
        if (opts.weight) attrs['font-weight'] = opts.weight;
        if (opts.italic) attrs['font-style'] = 'italic';
        const t = el('text', attrs);
        t.textContent = text;
        s.svg.appendChild(t);
    }

    // خط مقارب (asymptote) عمودي و/أو أفقي، بمدى العرض الكامل + تسمية اختيارية
    function drawAsymptote(s, opts) {
        opts = opts || {};
        const color = opts.color || '#FF6B6B';
        if (opts.x !== undefined) {
            drawLine(s, opts.x, s.yMin, opts.x, s.yMax, { color, dashed: true, dashPattern: opts.dashPattern || [6, 4] });
        }
        if (opts.y !== undefined) {
            drawLine(s, s.xMin, opts.y, s.xMax, opts.y, { color, dashed: true, dashPattern: opts.dashPattern || [6, 4] });
        }
        if (opts.label) {
            const lx = opts.x !== undefined ? opts.x + s.fontSize * 0.3 : s.xMax - s.fontSize * 3.5;
            const ly = opts.y !== undefined ? -opts.y - s.fontSize * 0.3 : -s.yMax + s.fontSize * 1.1;
            drawNote(s, opts.label, lx, ly, { color, fontSize: opts.fontSize });
        }
    }

    // كيرسم منحنى دالة func(x) بدقة على [xStart, xEnd]. كيقطع القطعة
    // تلقائياً كل مرة القيمة تخرج بره المدى المرئي (نفس المنطق لي كيوقع
    // عند asymptote) باش ما توليش خطوط شاذة كتربط بين الفروع.
    function drawCurve(s, func, xStart, xEnd, opts) {
        opts = opts || {};
        const steps = opts.steps || 300;
        const step = (xEnd - xStart) / steps;
        const color = opts.color || COLORS.arrow;
        const lw = (opts.lineWidth || 2) * 0.025;
        const margin = (s.yMax - s.yMin) * (opts.marginFactor ?? 0.6);
        const lo = s.yMin - margin, hi = s.yMax + margin;

        let d = '';
        let drawing = false;
        for (let i = 0; i <= steps; i++) {
            const x = xStart + i * step;
            let y;
            try { y = func(x); } catch (e) { y = NaN; }
            const valid = typeof y === 'number' && isFinite(y) && y >= lo && y <= hi;
            if (!valid) { drawing = false; continue; }
            const cy = -y;
            d += (drawing ? 'L ' : 'M ') + x + ' ' + cy + ' ';
            drawing = true;
        }
        if (!d) return;
        const attrs = {
            d: d.trim(),
            fill: 'none',
            stroke: color,
            'stroke-width': lw,
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round'
        };
        if (opts.dashed) {
            const [a, b] = opts.dashPattern || [6, 4];
            attrs['stroke-dasharray'] = `${a * 0.025} ${b * 0.025}`;
        }
        s.svg.appendChild(el('path', attrs));
    }

    // سهم كامل بين نقطتين (بداية → نهاية) مع رأس مثلث حقيقي، بخلاف
    // drawLine اللي عندو غير الخط بلا رأس. مفيد للمتجهات (vecteurs)
    // كيفما MA, MB, MG فدروس البرycentre. كيدعم label فالوسط.
    function drawVector(s, x1, y1, x2, y2, opts) {
        opts = opts || {};
        const color = opts.color || COLORS.arrow;
        const lw = (opts.lineWidth || 1.5) * 0.025;
        const dx = x2 - x1, dy = y2 - y1;
        const len = Math.sqrt(dx * dx + dy * dy) || 0.0001;
        const ux = dx / len, uy = dy / len;
        const ah = opts.arrowSize || s.fontSize * 0.35;

        // كنقصو الخط شوية قبل الرأس باش السهم يبان واضح ومنسجم
        const endX = x2 - ux * ah * 0.6;
        const endY = y2 - uy * ah * 0.6;

        const attrs = {
            x1, y1: -y1, x2: endX, y2: -endY,
            stroke: color, 'stroke-width': lw, 'stroke-linecap': 'round'
        };
        if (opts.dashed) {
            const [a, b] = opts.dashPattern || [5, 4];
            attrs['stroke-dasharray'] = `${a * 0.025} ${b * 0.025}`;
        }
        s.svg.appendChild(el('line', attrs));

        // رأس السهم (مثلث صغير عمودي على اتجاه المتجه)
        const backX = x2 - ux * ah;
        const backY = y2 - uy * ah;
        const px = -uy, py = ux;
        const leftX = backX + px * ah * 0.4;
        const leftY = backY + py * ah * 0.4;
        const rightX = backX - px * ah * 0.4;
        const rightY = backY - py * ah * 0.4;

        s.svg.appendChild(el('polygon', {
            points: `${x2},${-y2} ${leftX},${-leftY} ${rightX},${-rightY}`,
            fill: color
        }));

        if (opts.label) {
            const lx = (x1 + x2) / 2 + (opts.labelOffsetX ?? px * ah * 0.9);
            const ly = (y1 + y2) / 2 + (opts.labelOffsetY ?? py * ah * 0.9);
            drawNote(s, opts.label, lx, -ly, {
                color: opts.labelColor || color,
                fontSize: opts.fontSize || s.fontSize * 0.85
            });
        }
    }

    // مضلع مغلق (مثلث، رباعي...) من مصفوفة نقط {x,y} بالإحداثيات
    // الرياضية. جديدة، ماكانتش موجودة قبل — محتاجينها لأشكال المثلث
    // والرباعي والمتوازي أضلاع فدروس البارycentre.
    function drawPolygon(s, points, opts) {
        opts = opts || {};
        const ptStr = points.map(p => `${p.x},${-p.y}`).join(' ');
        const attrs = {
            points: ptStr,
            fill: opts.fill || 'none',
            stroke: opts.color || COLORS.axis,
            'stroke-width': (opts.lineWidth || 1.5) * 0.025
        };
        if (opts.dashed) {
            const [a, b] = opts.dashPattern || [6, 4];
            attrs['stroke-dasharray'] = `${a * 0.025} ${b * 0.025}`;
        }
        s.svg.appendChild(el('polygon', attrs));
    }

    return {
        COLORS,
        setupSVG,
        drawAxesWithArrows,
        drawGrid,
        drawPoint,
        drawPoints,
        drawLine,
        drawCircle,
        drawRect,
        drawAsymptote,
        drawCurve,
        drawNote,
        drawVector,
        drawPolygon
    };
})();
