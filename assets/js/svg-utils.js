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
            fill: 'none',
            stroke: opts.color || COLORS.axis,
            'stroke-width': (opts.lineWidth || 1) * 0.025
        };
        if (opts.dashed) {
            const [a, b] = opts.dashPattern || [6, 4];
            attrs['stroke-dasharray'] = `${a * 0.025} ${b * 0.025}`;
        }
        s.svg.appendChild(el('circle', attrs));
    }

    // تعليق نصي حر (بإحداثيات رياضية مباشرة)
    function drawNote(s, text, x, y, opts) {
        opts = opts || {};
        const t = el('text', {
            x, y,
            fill: opts.color || COLORS.muted,
            'font-size': opts.fontSize || s.fontSize,
            'font-family': 'Arial, sans-serif'
        });
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
        s.svg.appendChild(el('path', {
            d: d.trim(),
            fill: 'none',
            stroke: color,
            'stroke-width': lw,
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round'
        }));
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
        drawAsymptote,
        drawCurve,
        drawNote
    };
})();
