// ============================================================
// canvas-utils.js
// أدوات مشتركة لرسم الرسومات البيانية (Canvas) - كل رسومات
// lessons/exercises/series خاصها تستعمل هاذ الدوال بدل ما تعاود
// كتابة نفس المنطق (محاور، شبكة، نقط...) من الصفر فكل صفحة.
//
// الهدف: bug (بحال scale factor أو axis truncation) يتصلح مرة
// وحدة هنا، بدل ما يتصلح فـ 20-170 ملف واحد بواحد.
//
// الاستعمال فكل صفحة (بعد ما تحمل هاذ الملف):
//   <script src="{{BASE}}assets/js/canvas-utils.js"></script>
//   <script src="figures.js"></script>   <!-- خاص بالصفحة -->
// ============================================================

const CanvasUtils = (function () {

    const COLORS = {
        bg: '#0D1117',
        axis: '#2A2A3E',
        grid: '#1A1A2E',
        arrow: '#4ECDC4',
        label: '#4ECDC4',
        text: '#FFFFFF',
        muted: '#888888'
    };

    // كيهيئ الكانفاس: كيمسح، كيعمر الخلفية، كيرجع {canvas, ctx, w, h}
    function setupCanvas(canvasId) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return null;
        const ctx = canvas.getContext('2d');
        const w = canvas.width, h = canvas.height;
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = COLORS.bg;
        ctx.fillRect(0, 0, w, h);
        return { canvas, ctx, w, h };
    }

    // محاور x/y (بلا سهام)
    function drawAxes(ctx, ox, oy, w, h, opts) {
        opts = opts || {};
        ctx.strokeStyle = opts.color || COLORS.axis;
        ctx.lineWidth = opts.lineWidth || 1.5;

        ctx.beginPath();
        ctx.moveTo(ox, oy);
        ctx.lineTo(w - 20, oy);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(ox, 20);
        ctx.lineTo(ox, oy);
        ctx.stroke();
    }

    // سهام المحاور + labels x/y
    function drawArrows(ctx, ox, oy, w, opts) {
        opts = opts || {};
        ctx.fillStyle = opts.color || COLORS.arrow;

        ctx.beginPath();
        ctx.moveTo(w - 20, oy - 5);
        ctx.lineTo(w - 12, oy);
        ctx.lineTo(w - 20, oy + 5);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(ox - 5, 20);
        ctx.lineTo(ox, 12);
        ctx.lineTo(ox + 5, 20);
        ctx.fill();

        if (opts.labels !== false) {
            ctx.fillStyle = opts.color || COLORS.label;
            ctx.font = '12px Arial';
            ctx.fillText(opts.xLabel || 'x', w - 20, oy + 18);
            ctx.fillText(opts.yLabel || 'y', ox + 10, 16);
        }
    }

    // الحالة الأكثر شيوعاً: محاور + سهام فمرة وحدة
    function drawAxesWithArrows(ctx, ox, oy, w, h, opts) {
        drawAxes(ctx, ox, oy, w, h, opts);
        drawArrows(ctx, ox, oy, w, opts);
    }

    // شبكة (grid) بمدى [rangeMin, rangeMax] (بالوحدات الرياضية، ماشي بيكسل)
    function drawGrid(ctx, ox, oy, w, h, scale, rangeMin, rangeMax, opts) {
        opts = opts || {};
        ctx.strokeStyle = opts.color || COLORS.grid;
        ctx.lineWidth = opts.lineWidth || 0.5;

        for (let i = rangeMin; i <= rangeMax; i++) {
            if (i === 0) continue;
            const xPos = ox + i * scale;
            ctx.beginPath();
            ctx.moveTo(xPos, 20);
            ctx.lineTo(xPos, oy);
            ctx.stroke();

            const yPos = oy - i * scale;
            ctx.beginPath();
            ctx.moveTo(ox, yPos);
            ctx.lineTo(w - 20, yPos);
            ctx.stroke();
        }
    }

    // نقطة معلمة (point + label + إحداثيات اختيارية)
    // point.x/point.y بالإحداثيات الرياضية، الدالة كتحول لبيكسل وحدها
    function drawPoint(ctx, ox, oy, scale, point) {
        const px = ox + point.x * scale;
        const py = oy - point.y * scale;

        ctx.fillStyle = point.color || COLORS.arrow;
        ctx.beginPath();
        ctx.arc(px, py, point.radius || 6, 0, 2 * Math.PI);
        ctx.fill();

        if (point.label !== undefined) {
            ctx.fillStyle = point.textColor || COLORS.text;
            ctx.font = point.font || '12px Arial';
            const coordText = point.showCoords !== false
                ? ` (${point.x.toFixed(1)};${point.y.toFixed(1)})`
                : '';
            ctx.fillText(point.label + coordText, px + (point.offsetX ?? 8), py + (point.offsetY ?? -6));
        }
        return { px, py };
    }

    // مجموعة نقط دفعة وحدة
    function drawPoints(ctx, ox, oy, scale, points) {
        return points.map(p => drawPoint(ctx, ox, oy, scale, p));
    }

    // خط بين نقطتين (بالإحداثيات الرياضية) - اختياري متقطع (dashed)
    function drawLine(ctx, ox, oy, scale, x1, y1, x2, y2, opts) {
        opts = opts || {};
        ctx.strokeStyle = opts.color || COLORS.axis;
        ctx.lineWidth = opts.lineWidth || 1;
        if (opts.dashed) ctx.setLineDash(opts.dashPattern || [4, 4]);

        ctx.beginPath();
        ctx.moveTo(ox + x1 * scale, oy - y1 * scale);
        ctx.lineTo(ox + x2 * scale, oy - y2 * scale);
        ctx.stroke();

        if (opts.dashed) ctx.setLineDash([]);
    }

    // تعليق نصي حر (بإحداثيات بيكسل مباشرة - للملاحظات أسفل الرسمة مثلاً)
    function drawNote(ctx, text, x, y, opts) {
        opts = opts || {};
        ctx.fillStyle = opts.color || COLORS.muted;
        ctx.font = opts.font || '10px Arial';
        ctx.fillText(text, x, y);
    }

    return {
        COLORS,
        setupCanvas,
        drawAxes,
        drawArrows,
        drawAxesWithArrows,
        drawGrid,
        drawPoint,
        drawPoints,
        drawLine,
        drawNote
    };
})();
