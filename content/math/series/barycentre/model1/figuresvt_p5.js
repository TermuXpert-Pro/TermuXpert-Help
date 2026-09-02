/* ============================================================
   figuresvt_p5.js — Série 5 (Barycentre) : Alignement, Concourance, Ensembles de points
   ملف مستقل بالكامل — لا استيراد من أي مكتبة مشتركة.
   الرياضيات ديال الثلاث تمارين تحققت منها عددياً بـ Python قبل الترميز
   (I,J,K aligned ex16 ; G concourant ex17 ; cercle d'Apollonius ex18) — سالمين، بلا أخطاء.
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

    /* ============================================================
       EXERCICE 16 — Triangle ABC, I=Bar{(A,1);(B,2)}, J=milieu[BC],
       K=symétrique de A par rapport à C = Bar{(A,1);(C,-2)}
       Vérifié : K = Bar{(I,3);(J,-4)} ⇒ I, J, K alignés
       ============================================================ */
    function drawGraph16() {
        var svg = document.getElementById("graph16");
        if (!svg) return;
        var W = 420, H = 380;
        setupSvg(svg, W, H);

        var A = { x: 0, y: 4, color: "#4ECDC4", label: "A" };
        var B = { x: -3, y: -1, color: "#FF6B6B", label: "B" };
        var C = { x: 3, y: -1, color: "#BB8FCE", label: "C" };
        var I = { x: (A.x + 2 * B.x) / 3, y: (A.y + 2 * B.y) / 3, color: "#F4D03F", label: "I" };
        var J = { x: (B.x + C.x) / 2, y: (B.y + C.y) / 2, color: "#F4D03F", label: "J" };
        var K = { x: 2 * C.x - A.x, y: 2 * C.y - A.y, color: "#F4D03F", label: "K" };

        var ox = 130, oy = 160, scale = 30;
        function px(p) { return ox + p.x * scale; }
        function py(p) { return oy - p.y * scale; }

        svg.appendChild(svgEl("polygon", {
            points: [A, B, C].map(function (p) { return px(p) + "," + py(p); }).join(" "),
            fill: "#4ECDC40E", stroke: "#3A3A50", "stroke-width": 1.5
        }));

        // Segment [AK] pointillé (A, C, K alignés — C milieu de [AK])
        lineSeg(svg, px(A), py(A), px(K), py(K), { color: "#F4D03F33", width: 1.5, dashed: true });

        // Droite transversale (I, J, K) — alignés
        var ext = 0.08;
        lineSeg(svg,
            px(I) + (px(I) - px(K)) * ext, py(I) + (py(I) - py(K)) * ext,
            px(K) + (px(K) - px(I)) * ext, py(K) + (py(K) - py(I)) * ext,
            { color: "#F4D03F", width: 2 });

        [A, B, C].forEach(function (p) {
            circlePoint(svg, px(p), py(p), p.color, 6);
            var dy = p.label === "A" ? -12 : 20;
            text(svg, px(p), py(p) + dy, p.label, { fill: p.color, size: 13, weight: "700", anchor: "middle" });
        });

        circlePoint(svg, px(I), py(I), I.color, 6);
        text(svg, px(I) - 10, py(I) - 6, "I", { fill: I.color, size: 13, weight: "700", anchor: "end" });
        circlePoint(svg, px(J), py(J), J.color, 6);
        text(svg, px(J) + 10, py(J) + 16, "J", { fill: J.color, size: 13, weight: "700" });
        circlePoint(svg, px(K), py(K), K.color, 6);
        text(svg, px(K) + 10, py(K) - 4, "K", { fill: K.color, size: 13, weight: "700" });

        text(svg, W / 2, H - 12, "I, J, K alignés (K = Bar{(I,3);(J,-4)})", { fill: "#888888", size: 10, anchor: "middle" });
    }

    /* ============================================================
       EXERCICE 17 — Carré ABCD, M=Bar{(A,3);(B,1)}, N=Bar{(A,3);(D,1)},
       I=milieu[BC], J=milieu[CD], G=Bar{(A,3);(B,1);(C,1);(D,1)}
       Vérifié : G ∈ (MJ) ∩ (NI) ∩ (AC)
       ============================================================ */
    function drawGraph17() {
        var svg = document.getElementById("graph17");
        if (!svg) return;
        var W = 380, H = 380;
        setupSvg(svg, W, H);

        var A = { x: 0, y: 0, color: "#4ECDC4", label: "A" };
        var B = { x: 4, y: 0, color: "#FF6B6B", label: "B" };
        var C = { x: 4, y: 4, color: "#BB8FCE", label: "C" };
        var D = { x: 0, y: 4, color: "#A8FF78", label: "D" };
        var M = { x: (3 * A.x + B.x) / 4, y: (3 * A.y + B.y) / 4, color: "#4D9DE0", label: "M" };
        var N = { x: (3 * A.x + D.x) / 4, y: (3 * A.y + D.y) / 4, color: "#4D9DE0", label: "N" };
        var I = { x: (B.x + C.x) / 2, y: (B.y + C.y) / 2, color: "#4D9DE0", label: "I" };
        var J = { x: (C.x + D.x) / 2, y: (C.y + D.y) / 2, color: "#4D9DE0", label: "J" };
        var G = {
            x: (3 * A.x + B.x + C.x + D.x) / 6, y: (3 * A.y + B.y + C.y + D.y) / 6,
            color: "#F4D03F", label: "G"
        };

        var ox = 40, oy = 340, scale = 75;
        function px(p) { return ox + p.x * scale; }
        function py(p) { return oy - p.y * scale; }

        svg.appendChild(svgEl("polygon", {
            points: [A, B, C, D].map(function (p) { return px(p) + "," + py(p); }).join(" "),
            fill: "#4ECDC40E", stroke: "#3A3A50", "stroke-width": 1.5
        }));

        // Les trois droites concourantes en G
        lineSeg(svg, px(M), py(M), px(J), py(J), { color: "#4D9DE0AA", width: 1.5 });
        lineSeg(svg, px(N), py(N), px(I), py(I), { color: "#BB8FCEAA", width: 1.5 });
        lineSeg(svg, px(A), py(A), px(C), py(C), { color: "#4ECDC4AA", width: 1.5, dashed: true });

        [A, B, C, D].forEach(function (p) {
            circlePoint(svg, px(p), py(p), p.color, 6);
            var dx = p.x === 0 ? -10 : 10;
            var dy = p.y === 0 ? 18 : -8;
            text(svg, px(p) + dx, py(p) + dy, p.label, { fill: p.color, size: 13, weight: "700", anchor: dx < 0 ? "end" : "start" });
        });

        [M, N, I, J].forEach(function (p) {
            circlePoint(svg, px(p), py(p), p.color, 5);
        });
        text(svg, px(M), py(M) + 18, "M", { fill: M.color, size: 11.5, weight: "700", anchor: "middle" });
        text(svg, px(N) - 12, py(N) + 4, "N", { fill: N.color, size: 11.5, weight: "700", anchor: "end" });
        text(svg, px(I) + 12, py(I) + 4, "I", { fill: I.color, size: 11.5, weight: "700" });
        text(svg, px(J), py(J) - 10, "J", { fill: J.color, size: 11.5, weight: "700", anchor: "middle" });

        circlePoint(svg, px(G), py(G), G.color, 6.5);
        text(svg, px(G) + 10, py(G) - 8, "G", { fill: G.color, size: 13.5, weight: "700" });

        text(svg, W / 2, H - 12, "(MJ), (NI), (AC) concourantes en G", { fill: "#888888", size: 10, anchor: "middle" });
    }

    /* ============================================================
       EXERCICE 18 — AB = 4 cm, G = Bar{(A,1);(B,3)}, K = Bar{(A,1);(B,-3)}
       (F) = cercle de diamètre [GK] (cercle d'Apollonie, rapport MA/MB = 3)
       ============================================================ */
    function drawGraph18() {
        var svg = document.getElementById("graph18");
        if (!svg) return;
        var W = 420, H = 220;
        setupSvg(svg, W, H);

        var ox = 50, oy = 110, scale = 45;
        function px(x) { return ox + x * scale; }

        var A = { x: 0, color: "#4ECDC4", label: "A" };
        var B = { x: 4, color: "#FF6B6B", label: "B" };
        var G = { x: 3, color: "#F4D03F", label: "G" };
        var K = { x: 6, color: "#4D9DE0", label: "K" };
        var center = (G.x + K.x) / 2, r = (K.x - G.x) / 2;

        // Cercle de diamètre [GK]
        svg.appendChild(svgEl("circle", {
            cx: px(center), cy: oy, r: r * scale,
            fill: "#F4D03F10", stroke: "#F4D03F", "stroke-width": 2
        }));

        // Ligne support
        lineSeg(svg, px(-0.3), oy, px(6.5), oy, { color: "#2A2A3E", width: 1.5 });

        [A, B, G, K].forEach(function (p) {
            circlePoint(svg, px(p.x), oy, p.color, 6);
            var dy = (p.label === "A" || p.label === "G") ? -14 : 22;
            text(svg, px(p.x), oy + dy, p.label, { fill: p.color, size: 13, weight: "700", anchor: "middle" });
        });

        text(svg, px((A.x + B.x) / 2), oy + 40, "AB = 4 cm", { fill: "#888888", size: 10 });
        text(svg, W / 2, H - 10, "(F) = cercle de diamètre [GK]", { fill: "#888888", size: 10.5, anchor: "middle" });
    }

    document.addEventListener("DOMContentLoaded", function () {
        setTimeout(function () {
            drawGraph16();
            drawGraph17();
            drawGraph18();
        }, 300);
    });
})();
