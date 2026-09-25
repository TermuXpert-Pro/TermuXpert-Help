/* ============================================================
   figuresvt_p3.js — Série 3 (Barycentre) : Associativité, Centre de gravité, Réduction
   ملف مستقل بالكامل — لا استيراد من أي مكتبة مشتركة.
   يحتوي على كل الدوال (الأساسية والمساعدة) الخاصة بأشكال هذا الـ part فقط.
   ============================================================ */

(function () {
    "use strict";

    var SVG_NS = "http://www.w3.org/2000/svg";

    /* ---------- Helpers محليون خاصون بهذا الملف فقط ---------- */

    function svgEl(tag, attrs) {
        var e = document.createElementNS(SVG_NS, tag);
        if (attrs) {
            for (var k in attrs) {
                if (Object.prototype.hasOwnProperty.call(attrs, k)) {
                    e.setAttribute(k, attrs[k]);
                }
            }
        }
        return e;
    }

    function setupSvg(svg, vbW, vbH) {
        while (svg.firstChild) svg.removeChild(svg.firstChild);
        svg.setAttribute("viewBox", "0 0 " + vbW + " " + vbH);
        svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
        svg.setAttribute("width", "100%");
        svg.style.display = "block";
        svg.style.maxWidth = "460px";
        svg.style.margin = "0 auto";

        var bg = svgEl("rect", { x: 0, y: 0, width: vbW, height: vbH, fill: "#0D1117", rx: 8 });
        svg.appendChild(bg);
        return svg;
    }

    function text(svg, x, y, str, opts) {
        opts = opts || {};
        var t = svgEl("text", {
            x: x, y: y,
            fill: opts.fill || "#FFFFFF",
            "font-size": opts.size || 12,
            "font-family": "Arial, sans-serif",
            "font-weight": opts.weight || "400",
            "text-anchor": opts.anchor || "start"
        });
        t.textContent = str;
        svg.appendChild(t);
        return t;
    }

    function circlePoint(svg, cx, cy, color, r) {
        svg.appendChild(svgEl("circle", {
            cx: cx, cy: cy, r: r || 5.5,
            fill: color, stroke: "#0D1117", "stroke-width": 1.5
        }));
    }

    function lineSeg(svg, x1, y1, x2, y2, opts) {
        opts = opts || {};
        var attrs = {
            x1: x1, y1: y1, x2: x2, y2: y2,
            stroke: opts.color || "#2A2A3E",
            "stroke-width": opts.width || 1.5
        };
        if (opts.dashed) attrs["stroke-dasharray"] = "5,4";
        svg.appendChild(svgEl("line", attrs));
    }

    function arrowMarkerDefs(svg, id, color) {
        var defs = svg.querySelector("defs");
        if (!defs) { defs = svgEl("defs"); svg.appendChild(defs); }
        if (svg.querySelector("#" + id)) return;
        var marker = svgEl("marker", {
            id: id, viewBox: "0 0 10 10", refX: 8, refY: 5,
            markerWidth: 6, markerHeight: 6, orient: "auto-start-reverse"
        });
        marker.appendChild(svgEl("path", { d: "M0,0 L10,5 L0,10 z", fill: color }));
        defs.appendChild(marker);
    }

    function arrow(svg, x1, y1, x2, y2, color, markerId, width) {
        var l = svgEl("line", { x1: x1, y1: y1, x2: x2, y2: y2, stroke: color, "stroke-width": width || 2 });
        l.setAttribute("marker-end", "url(#" + markerId + ")");
        svg.appendChild(l);
        return l;
    }

    /* ============================================================
       EXERCICE 9 — G = Bar{(A,2);(B,-3);(C,5)} par associativité
       E = Bar{(A,2);(B,-3)} avec AE = 3AB ; G = Bar{(E,-1);(C,5)} avec CG = -¼CE
       ============================================================ */
    function drawGraph9() {
        var svg = document.getElementById("graph9");
        if (!svg) return;
        var W = 450, H = 280;
        setupSvg(svg, W, H);

        // Coordonnées exactes : A(0;0), B(1;0), E(3;0), C(1;2), G(0.5;2.5)
        var A = { x: 0, y: 0, color: "#4ECDC4", label: "A" };
        var B = { x: 1, y: 0, color: "#FF6B6B", label: "B" };
        var E = { x: 3, y: 0, color: "#F4D03F", label: "E" };
        var C = { x: 1, y: 2, color: "#BB8FCE", label: "C" };
        var G = { x: 0.5, y: 2.5, color: "#F4D03F", label: "G" };

        var ox = 60, oy = 220, scale = 62;
        function px(p) { return ox + p.x * scale; }
        function py(p) { return oy - p.y * scale; }

        // Droite (AB) prolongée jusqu'à E
        lineSeg(svg, px(A) - 10, py(A), px(E) + 15, py(E), { color: "#2A2A3E", width: 1.5 });
        text(svg, px(E) + 20, py(E) + 4, "(AB)", { fill: "#4ECDC4", size: 10.5 });

        // Droite (CE) prolongée jusqu'à G (segment support de la 2e étape de construction)
        lineSeg(svg, px(C) - (px(E) - px(C)) * 0.55, py(C) - (py(E) - py(C)) * 0.55, px(E), py(E), { color: "#BB8FCE55", width: 1.5, dashed: true });

        // Segment [AB] mis en évidence
        lineSeg(svg, px(A), py(A), px(B), py(B), { color: "#4ECDC4", width: 3 });

        [A, B, E].forEach(function (p) {
            circlePoint(svg, px(p), py(p), p.color, 6);
            text(svg, px(p), py(p) + 20, p.label, { fill: p.color, size: 13, weight: "700", anchor: "middle" });
        });

        circlePoint(svg, px(C), py(C), C.color, 6);
        text(svg, px(C) - 14, py(C) + 5, "C", { fill: C.color, size: 13, weight: "700", anchor: "end" });

        circlePoint(svg, px(G), py(G), G.color, 7);
        text(svg, px(G) - 12, py(G) - 4, "G", { fill: G.color, size: 14, weight: "700", anchor: "end" });

        text(svg, (px(A) + px(E)) / 2, py(A) - 14, "AE = 3·AB", { fill: "#F4D03F", size: 11, weight: "700", anchor: "middle" });

        text(svg, W / 2, H - 10, "E = Bar{(A,2);(B,-3)} puis G = Bar{(E,-1);(C,5)}", { fill: "#888888", size: 10, anchor: "middle" });
    }

    /* ============================================================
       EXERCICE 10 — G centre de gravité de ABC, I milieu de [BC]
       G = Bar{(A,1);(I,2)} ⇒ AG = ⅔AI
       ============================================================ */
    function drawGraph10() {
        var svg = document.getElementById("graph10");
        if (!svg) return;
        var W = 450, H = 310;
        setupSvg(svg, W, H);

        var A = { x: 0, y: 3, color: "#4ECDC4", label: "A" };
        var B = { x: -2, y: -1, color: "#FF6B6B", label: "B" };
        var C = { x: 2, y: -1, color: "#BB8FCE", label: "C" };
        var I = { x: (B.x + C.x) / 2, y: (B.y + C.y) / 2, color: "#F4D03F", label: "I" };
        var G = { x: (A.x + B.x + C.x) / 3, y: (A.y + B.y + C.y) / 3, color: "#F4D03F", label: "G" };

        var ox = 225, oy = 245, scale = 42;
        function px(p) { return ox + p.x * scale; }
        function py(p) { return oy - p.y * scale; }

        svg.appendChild(svgEl("polygon", {
            points: [A, B, C].map(function (p) { return px(p) + "," + py(p); }).join(" "),
            fill: "#4ECDC40E", stroke: "#3A3A50", "stroke-width": 1.5
        }));

        // Médiane (AI)
        lineSeg(svg, px(A), py(A), px(I), py(I), { color: "#F4D03F66", width: 1.5, dashed: true });
        // Segment [BC]
        lineSeg(svg, px(B), py(B), px(C), py(C), { color: "#3A3A50", width: 1.5 });

        [A, B, C].forEach(function (p) {
            circlePoint(svg, px(p), py(p), p.color, 6);
            var dy = p.label === "A" ? -12 : 22;
            text(svg, px(p), py(p) + dy, p.label, { fill: p.color, size: 13, weight: "700", anchor: "middle" });
        });

        circlePoint(svg, px(I), py(I), I.color, 5.5);
        text(svg, px(I) + 14, py(I) - 4, "I", { fill: I.color, size: 12.5, weight: "700" });

        circlePoint(svg, px(G), py(G), G.color, 6.5);
        text(svg, px(G) + 12, py(G) + 4, "G", { fill: G.color, size: 13.5, weight: "700" });

        text(svg, W / 2, H - 10, "G centre de gravité : AG = ⅔AI", { fill: "#888888", size: 10.5, anchor: "middle" });
    }

    /* ============================================================
       EXERCICE 11 — K = Bar{(C,-3);(B,1)}, G = Bar{(A,2);(B,-1);(C,-3)}
       Ensemble = cercle de centre G, rayon KA
       ============================================================ */
    function drawGraph11() {
        var svg = document.getElementById("graph11");
        if (!svg) return;
        var W = 400, H = 380;
        setupSvg(svg, W, H);

        var A = { x: 0, y: 3, color: "#4ECDC4", label: "A" };
        var B = { x: -2, y: -1, color: "#FF6B6B", label: "B" };
        var C = { x: 2, y: -1, color: "#BB8FCE", label: "C" };
        // K = Bar{(C,-3);(B,1)} = (-3C+B)/(-2)
        var K = { x: (-3 * C.x + B.x) / -2, y: (-3 * C.y + B.y) / -2, color: "#4D9DE0", label: "K" };
        // G = Bar{(A,2);(B,-1);(C,-3)} = (2A-B-3C)/(-2)
        var G = { x: (2 * A.x - B.x - 3 * C.x) / -2, y: (2 * A.y - B.y - 3 * C.y) / -2, color: "#F4D03F", label: "G" };
        var r = Math.sqrt(Math.pow(K.x - A.x, 2) + Math.pow(K.y - A.y, 2));

        var ox = 152, oy = 98, scale = 24;
        function px(p) { return ox + p.x * scale; }
        function py(p) { return oy - p.y * scale; }

        svg.appendChild(svgEl("polygon", {
            points: [A, B, C].map(function (p) { return px(p) + "," + py(p); }).join(" "),
            fill: "#4ECDC40E", stroke: "#3A3A50", "stroke-width": 1.5
        }));

        // Cercle de centre G, rayon KA
        svg.appendChild(svgEl("circle", {
            cx: px(G), cy: py(G), r: r * scale,
            fill: "#F4D03F10", stroke: "#F4D03F", "stroke-width": 2
        }));

        // Segment KA (référence du rayon)
        lineSeg(svg, px(K), py(K), px(A), py(A), { color: "#4D9DE099", width: 1.5, dashed: true });

        [A, B, C].forEach(function (p) {
            circlePoint(svg, px(p), py(p), p.color, 6);
            var dy = p.label === "A" ? -12 : 20;
            text(svg, px(p), py(p) + dy, p.label, { fill: p.color, size: 13, weight: "700", anchor: "middle" });
        });

        circlePoint(svg, px(K), py(K), K.color, 6);
        text(svg, px(K) + 10, py(K) + 5, "K", { fill: K.color, size: 13, weight: "700" });

        circlePoint(svg, px(G), py(G), G.color, 6.5);
        text(svg, px(G) - 12, py(G) + 5, "G", { fill: G.color, size: 13.5, weight: "700", anchor: "end" });

        text(svg, W / 2, H - 10, "Cercle de centre G et de rayon KA", { fill: "#888888", size: 10.5, anchor: "middle" });
    }

    /* ============================================================
       EXERCICE 12.c — Triangle AC=6, AB=5, BC=4
       G = Bar{(A,1);(B,2);(C,1)}, G' = Bar{(A,3);(C,1)}
       (F) = médiatrice de [GG']
       ============================================================ */
    function drawGraph12() {
        var svg = document.getElementById("graph12");
        if (!svg) return;
        var W = 450, H = 280;
        setupSvg(svg, W, H);

        // Triangle construit à partir des longueurs réelles : AC=6, AB=5, BC=4
        var A = { x: 0, y: 0, color: "#4ECDC4", label: "A" };
        var C = { x: 6, y: 0, color: "#BB8FCE", label: "C" };
        var Bx = 45 / 12; // 3.75, issu de l'intersection des cercles (AB=5, BC=4)
        var By = Math.sqrt(25 - Bx * Bx);
        var B = { x: Bx, y: By, color: "#FF6B6B", label: "B" };

        var G = { x: (A.x + 2 * B.x + C.x) / 4, y: (A.y + 2 * B.y + C.y) / 4, color: "#F4D03F", label: "G" };
        var Gp = { x: (3 * A.x + C.x) / 4, y: (3 * A.y + C.y) / 4, color: "#4D9DE0", label: "G'" };

        var ox = 60, oy = 235, scale = 40;
        function px(p) { return ox + p.x * scale; }
        function py(p) { return oy - p.y * scale; }

        svg.appendChild(svgEl("polygon", {
            points: [A, B, C].map(function (p) { return px(p) + "," + py(p); }).join(" "),
            fill: "#4ECDC40E", stroke: "#3A3A50", "stroke-width": 1.5
        }));

        // Segment [GG']
        lineSeg(svg, px(G), py(G), px(Gp), py(Gp), { color: "#F4D03F99", width: 1.5, dashed: true });

        // Médiatrice (F) de [GG']
        var mx = (px(G) + px(Gp)) / 2, my = (py(G) + py(Gp)) / 2;
        var dirx = px(Gp) - px(G), diry = py(Gp) - py(G);
        var norm = Math.sqrt(dirx * dirx + diry * diry);
        var perpx = -diry / norm, perpy = dirx / norm;
        lineSeg(svg, mx - perpx * 140, my - perpy * 140, mx + perpx * 140, my + perpy * 140, { color: "#4ECDC4", width: 2 });
        // Petit repère d'angle droit à l'intersection
        var tick = 8;
        lineSeg(svg, mx - dirx / norm * tick, my - diry / norm * tick, mx - dirx / norm * tick + perpx * tick, my - diry / norm * tick + perpy * tick, { color: "#4ECDC4", width: 1 });
        lineSeg(svg, mx + perpx * tick, my + perpy * tick, mx - dirx / norm * tick + perpx * tick, my - diry / norm * tick + perpy * tick, { color: "#4ECDC4", width: 1 });

        [A, B, C].forEach(function (p) {
            circlePoint(svg, px(p), py(p), p.color, 6);
            var dy = p.label === "B" ? -12 : 20;
            text(svg, px(p), py(p) + dy, p.label, { fill: p.color, size: 13, weight: "700", anchor: "middle" });
        });

        circlePoint(svg, px(G), py(G), G.color, 6);
        text(svg, px(G) + 10, py(G) - 6, "G", { fill: G.color, size: 13, weight: "700" });

        circlePoint(svg, px(Gp), py(Gp), Gp.color, 6);
        text(svg, px(Gp), py(Gp) + 20, "G'", { fill: Gp.color, size: 13, weight: "700", anchor: "middle" });

        text(svg, mx + perpx * 150 * (perpy > 0 ? 1 : -1), my + perpy * 150 * (perpy > 0 ? 1 : -1) + (perpy > 0 ? 12 : -8), "(F)", { fill: "#4ECDC4", size: 12, weight: "700", anchor: "middle" });

        text(svg, W / 2, H - 10, "(F) = médiatrice de [GG']", { fill: "#888888", size: 10.5, anchor: "middle" });
    }

    document.addEventListener("DOMContentLoaded", function () {
        setTimeout(function () {
            drawGraph9();
            drawGraph10();
            drawGraph11();
            drawGraph12();
        }, 300);
    });
})();

