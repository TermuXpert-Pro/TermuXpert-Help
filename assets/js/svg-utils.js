// ============================================================
// svg-utils.js
// نسخة SVG من canvas-utils.js — نفس الدوال بنفس المنطق، بس هنا كل
// عنصر هو DOM حقيقي (<circle>, <line>, <text>...) بإحداثيات رياضية
// مباشرة (بلا ox/oy/scale يدوي) عبر viewBox.
//
// ملاحظة مهمة (v2): سبق CSS عام ديال الموقع (خاص بالزخرفة/الخلفية)
// كان كيفرض قياس كبير على أي <svg> فالصفحة وكيخبي الأشكال (rect،
// circle، line، polygon) رغم أنها موجودة فالـ DOM. الحل: كل عنصر
// كيتوصل دابا بـ style inline بـ !important (بحال كانت درActual
// للنص من قبل)، لأن inline !important كيربح دائماً على أي قاعدة
// CSS خارجية حتى ولو هي الأخرى !important. وهكذا setupSVG كيفرض
// حجم/عرض السطر بـ !important على عنصر svg نفسه.
//
// الاستعمال فكل صفحة (بعد ما تحمل هاذ الملف):
//   <script src="{{BASE}}assets/js/svg-utils.js"></script>
//   <script src="figuresvt.js"></script>   <!-- خاص بالصفحة -->
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

    // كيبني نص style بـ !important من كائن {خاصية: قيمة}، مع قاعدة
    // أساسية باش يضمن الظهور (opacity/visibility/display) فكل حالة.
    function importantStyle(props) {
        let style =
            'opacity:1 !important;' +
            'visibility:visible !important;' +
            'display:inline !important;' +
            'pointer-events:none;';
        for (const k in props) {
            if (props[k] === undefined || props[k] === null) continue;
            style += `${k}:${props[k]} !important;`;
        }
        return style;
    }

    // كيفرض الـ style على عنصر مرسوم (شكل هندسي) باستعمال importantStyle
    function forceVisualStyle(node, props) {
        node.setAttribute('style', importantStyle(props));
    }

    // كيمسح القديم، كيدير viewBox بمدى رياضي (y مقلوبة تلقائياً
    // لأن SVG كيعتبر y+ لتحت)، كيرجع state كامل كتحتاجو باقي الدوال.
    // كيفرض أيضاً حجم/عرض السطر بـ !important على عنصر svg نفسه باش
    // ما يتأثرش بأي قاعدة CSS عامة فالموقع (خلفيات، زخرفة...).
    function setupSVG(svgId, range) {
        const svg = document.getElementById(svgId);
        if (!svg) return null;
        const { xMin = -1, xMax = 9, yMin = -1, yMax = 7 } = range || {};
        const w = xMax - xMin, h = yMax - yMin;

        while (svg.firstChild) svg.removeChild(svg.firstChild);
        svg.setAttribute('viewBox', `${xMin} ${-yMax} ${w} ${h}`);
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        svg.setAttribute('width', '100%');
        svg.removeAttribute('height');

        svg.setAttribute('style',
            'display:block !important;' +
            'width:100% !important;' +
            'max-width:420px !important;' +
            'height:auto !important;' +
            'max-height:60vh !important;' +
            'margin:0 auto !important;' +
            'background:#0D1117 !important;' +
            'border-radius:4px !important;' +
            'overflow:visible;'
        );

        return { svg, xMin, xMax, yMin, yMax, fontSize: w / 22 };
    }

    // محاور x/y + سهام + labels
    function drawAxesWithArrows(s, opts) {
        opts = opts || {};
        const color = opts.color || COLORS.axis;
        const g = el('g', {});
        const l1 = el('line', { x1: s.xMin, y1: 0, x2: s.xMax, y2: 0 });
        const l2 = el('line', { x1: 0, y1: -s.yMin, x2: 0, y2: -s.yMax });
        forceVisualStyle(l1, { stroke: color, 'stroke-width': 0.05, fill: 'none' });
        forceVisualStyle(l2, { stroke: color, 'stroke-width': 0.05, fill: 'none' });
        g.appendChild(l1); g.appendChild(l2);
        s.svg.appendChild(g);

        const arrowColor = opts.arrowColor || COLORS.arrow;
        const ah = s.fontSize * 0.4;
        const p1 = el('polygon', { points: `${s.xMax},0 ${s.xMax - ah},${ah / 2} ${s.xMax - ah},${-ah / 2}` });
        const p2 = el('polygon', { points: `0,${-s.yMax} ${-ah / 2},${-s.yMax + ah} ${ah / 2},${-s.yMax + ah}` });
        forceVisualStyle(p1, { fill: arrowColor, stroke: 'none' });
        forceVisualStyle(p2, { fill: arrowColor, stroke: 'none' });
        s.svg.appendChild(p1);
        s.svg.appendChild(p2);

        if (opts.labels !== false) {
            drawNote(s, opts.xLabel || 'x', s.xMax - ah, -s.fontSize * 0.6, { color: opts.labelColor || COLORS.label });
            drawNote(s, opts.yLabel || 'y', s.fontSize * 0.5, -s.yMax + ah * 1.5, { color: opts.labelColor || COLORS.label });
        }
    }

    // شبكة (grid) بمدى رياضي
    function drawGrid(s, opts) {
        const color = (opts && opts.color) || COLORS.grid;
        const g = el('g', {});
        for (let i = Math.ceil(s.xMin); i <= Math.floor(s.xMax); i++) {
            if (i === 0) continue;
            const line = el('line', { x1: i, y1: -s.yMin, x2: i, y2: -s.yMax });
            forceVisualStyle(line, { stroke: color, 'stroke-width': 0.02, fill: 'none' });
            g.appendChild(line);
        }
        for (let j = Math.ceil(s.yMin); j <= Math.floor(s.yMax); j++) {
            if (j === 0) continue;
            const line = el('line', { x1: s.xMin, y1: -j, x2: s.xMax, y2: -j });
            forceVisualStyle(line, { stroke: color, 'stroke-width': 0.02, fill: 'none' });
            g.appendChild(line);
        }
        s.svg.appendChild(g);
    }

    // نقطة معلمة (point + label + إحداثيات اختيارية)
    function drawPoint(s, point) {
        const r = point.radius || s.fontSize * 0.28;
        const color = point.color || COLORS.arrow;
        const c = el('circle', { cx: point.x, cy: -point.y, r });
        forceVisualStyle(c, { fill: color, stroke: 'none' });
        s.svg.appendChild(c);

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
        const color = opts.color || COLORS.axis;
        const lw = (opts.lineWidth || 1) * 0.025;
        const line = el('line', { x1, y1: -y1, x2, y2: -y2 });
        const styleProps = { stroke: color, 'stroke-width': lw, fill: 'none' };
        if (opts.dashed) {
            const [a, b] = opts.dashPattern || [4, 4];
            styleProps['stroke-dasharray'] = `${a * 0.025} ${b * 0.025}`;
        }
        forceVisualStyle(line, styleProps);
        s.svg.appendChild(line);
    }

    // دائرة (مركز + شعاع) - جديدة، ماكانتش دالة مستقلة فـ canvas-utils
    // (كانت inline بـ ctx.arc فكل صفحة كتحتاجها)
    function drawCircle(s, cx, cy, r, opts) {
        opts = opts || {};
        const fill = opts.fill || 'none';
        const stroke = opts.color || COLORS.axis;
        const lw = (opts.lineWidth || 1) * 0.025;
        const circle = el('circle', { cx, cy: -cy, r });
        const styleProps = { fill, stroke, 'stroke-width': lw };
        if (opts.opacity !== undefined) styleProps['fill-opacity'] = opts.opacity;
        if (opts.dashed) {
            const [a, b] = opts.dashPattern || [6, 4];
            styleProps['stroke-dasharray'] = `${a * 0.025} ${b * 0.025}`;
        }
        forceVisualStyle(circle, styleProps);
        s.svg.appendChild(circle);
    }

    // مستطيل (لِلحاويات، الأعمدة البيانية bar-chart...) - جديدة.
    // (x, yTop) هي الزاوية العليا اليسرى بالإحداثيات الرياضية (yTop
    // هو أعلى قيمة y ديال المستطيل)، وكيتمدد بعرض w ويهبط بارتفاع h.
    function drawRect(s, x, yTop, w, h, opts) {
        opts = opts || {};
        const fill = opts.fill || 'none';
        const stroke = opts.color || COLORS.axis;
        const lw = (opts.lineWidth || 1) * 0.025;
        const attrs = { x, y: -yTop, width: w, height: h };
        if (opts.rx) attrs.rx = opts.rx;
        const rect = el('rect', attrs);
        const styleProps = { fill, stroke, 'stroke-width': lw };
        if (opts.opacity !== undefined) styleProps['fill-opacity'] = opts.opacity;
        if (opts.dashed) {
            const [a, b] = opts.dashPattern || [6, 4];
            styleProps['stroke-dasharray'] = `${a * 0.025} ${b * 0.025}`;
        }
        forceVisualStyle(rect, styleProps);
        s.svg.appendChild(rect);
    }

    // تعليق نصي حر (بإحداثيات رياضية مباشرة)
    function drawNote(s, text, x, y, opts) {
        opts = opts || {};
        const color = opts.color || COLORS.muted;
        const fontSize = opts.fontSize || s.fontSize;
        const fontFamily = opts.fontFamily || 'Arial, sans-serif';
        const anchor = opts.anchor || 'start';
        const weight = opts.weight || 'normal';
        const t = el('text', { x, y });
        forceVisualStyle(t, {
            fill: color,
            'font-size': fontSize,
            'font-family': fontFamily,
            'text-anchor': anchor,
            'font-weight': weight,
            'font-style': opts.italic ? 'italic' : 'normal'
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
        const path = el('path', { d: d.trim(), 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
        const styleProps = { fill: 'none', stroke: color, 'stroke-width': lw };
        if (opts.dashed) {
            const [a, b] = opts.dashPattern || [6, 4];
            styleProps['stroke-dasharray'] = `${a * 0.025} ${b * 0.025}`;
        }
        forceVisualStyle(path, styleProps);
        s.svg.appendChild(path);
    }

    // سهم كامل بين نقطتين (بداية → نهاية) مع رأس مثلث حقيقي، بخلاف
    // drawLine اللي عندو غير الخط بلا رأس. مفيد للمتجهات (vecteurs)
    // كيفما MA, MB, MG فدروس البارycentre. كيدعم label فالوسط.
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

        const line = el('line', { x1, y1: -y1, x2: endX, y2: -endY, 'stroke-linecap': 'round' });
        const lineStyle = { stroke: color, 'stroke-width': lw, fill: 'none' };
        if (opts.dashed) {
            const [a, b] = opts.dashPattern || [5, 4];
            lineStyle['stroke-dasharray'] = `${a * 0.025} ${b * 0.025}`;
        }
        forceVisualStyle(line, lineStyle);
        s.svg.appendChild(line);

        // رأس السهم (مثلث صغير عمودي على اتجاه المتجه)
        const backX = x2 - ux * ah;
        const backY = y2 - uy * ah;
        const px = -uy, py = ux;
        const leftX = backX + px * ah * 0.4;
        const leftY = backY + py * ah * 0.4;
        const rightX = backX - px * ah * 0.4;
        const rightY = backY - py * ah * 0.4;

        const head = el('polygon', { points: `${x2},${-y2} ${leftX},${-leftY} ${rightX},${-rightY}` });
        forceVisualStyle(head, { fill: color, stroke: 'none' });
        s.svg.appendChild(head);

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
        const fill = opts.fill || 'none';
        const stroke = opts.color || COLORS.axis;
        const lw = (opts.lineWidth || 1.5) * 0.025;
        const poly = el('polygon', { points: ptStr });
        const styleProps = { fill, stroke, 'stroke-width': lw };
        if (opts.opacity !== undefined) styleProps['fill-opacity'] = opts.opacity;
        if (opts.dashed) {
            const [a, b] = opts.dashPattern || [6, 4];
            styleProps['stroke-dasharray'] = `${a * 0.025} ${b * 0.025}`;
        }
        forceVisualStyle(poly, styleProps);
        s.svg.appendChild(poly);
    }

    // كيبني d-string ديال path من مصفوفة نقط [x,y] بالإحداثيات
    // الرياضية (كيقلب y تلقائياً بحال باقي الدوال). مفيدة باش نبنيو
    // أشكال حرة (دورق، حاوية، شكل مركب...) قبل درطها بـ drawPath.
    // closed=true كيزيد Z فالأخير باش يقفل الشكل.
    function pathFromPoints(points, closed) {
        if (!points || !points.length) return '';
        let d = `M ${points[0][0]} ${-points[0][1]} `;
        for (let i = 1; i < points.length; i++) {
            d += `L ${points[i][0]} ${-points[i][1]} `;
        }
        if (closed) d += 'Z';
        return d.trim();
    }

    // كيرسم path حر من d-string جاهز (استعمل pathFromPoints باش
    // تبنيه بالإحداثيات الرياضية). جديدة — مفيدة لأشكال مخصوصة
    // (دوارق، حاويات، رموز...) لي ماكايناش كدوال جاهزة فالمكتبة.
    function drawPath(s, d, opts) {
        opts = opts || {};
        if (!d) return;
        const fill = opts.fill || 'none';
        const stroke = opts.color || COLORS.axis;
        const lw = (opts.lineWidth || 1.5) * 0.025;
        const path = el('path', {
            d,
            'stroke-linecap': opts.linecap || 'round',
            'stroke-linejoin': opts.linejoin || 'round'
        });
        const styleProps = { fill, stroke, 'stroke-width': lw };
        if (opts.opacity !== undefined) styleProps['fill-opacity'] = opts.opacity;
        if (opts.dashed) {
            const [a, b] = opts.dashPattern || [6, 4];
            styleProps['stroke-dasharray'] = `${a * 0.025} ${b * 0.025}`;
        }
        forceVisualStyle(path, styleProps);
        s.svg.appendChild(path);
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
        drawPolygon,
        pathFromPoints,
        drawPath
    };
})();
