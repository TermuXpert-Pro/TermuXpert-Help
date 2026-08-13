/* ============================================================
   figuresvt_p4.js — Série 4 (Barycentre) : 4 points - Coordonnées - Alignement
   ملف مستقل بالكامل — لا استيراد من أي مكتبة مشتركة.

   ملاحظة: قبل بناء graph14 و graph15، التحقق العددي والرمزي كشف على
   خطأين حقيقيين فالنص الأصلي ديال L'exercice 14 و 15 (تصحيح الوزن ديال D
   فتعريف K من 6 لـ -6 فتمرين 14، وتصحيح "8CJ=CA" لـ "3CJ=CA" فتمرين 15).
   تصحيح النص فـ serie4.html بالتوازي مع بناء هاد الرسومات، وتحقق كل شي
   عددياً بـ Python قبل الترميز.
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
       EXERCICE 13 — A(-1;1), B(0;2), C(1;-1), D(1;0)
       K = Bar{(A,2);(B,3)} = (-2/5 ; 8/5)
       L = centre de gravité de ABC = (0 ; 2/3)
       G = Bar{(A,2);(B,3);(C,1);(D,-1)} = (-2/5 ; 7/5)
       (coordonnées vérifiées numériquement, exactes)
       ============================================================ */
    function drawGraph13() {
        var svg = document.getElementById("graph13");
        if (!svg) return;
        var W = 450, H = 360;
        setupSvg(svg, W, H);

        var ox = 155, oy = 250, scale = 62;
        function px(p) { return ox + p.x * scale; }
        function py(p) { return oy - p.y * scale; }

        arrowMarkerDefs(svg, "arrowAxis13", "#4ECDC4");

        // Grille légère
        for (var gx = -2; gx <= 3; gx++) lineSeg(svg, px({ x: gx, y: 0 }), 20, px({ x: gx, y: 0 }), oy + 30, { color: "#161B22", width: 1 });
        for (var gy = -1; gy <= 2; gy++) lineSeg(svg, ox - 2.3 * scale, py({ x: 0, y: gy }), px({ x: 3, y: 0 }) + 10, py({ x: 0, y: gy }), { color: "#161B22", width: 1 });

        // Axes
        arrow(svg, ox - 2.3 * scale, oy, px({ x: 3, y: 0 }) + 20, oy, "#4ECDC4", "arrowAxis13");
        arrow(svg, ox, oy + 25, ox, 15, "#4ECDC4", "arrowAxis13");
        text(svg, px({ x: 3, y: 0 }) + 26, oy + 4, "x", { fill: "#4ECDC4", size: 12, weight: "700" });
        text(svg, ox - 14, 18, "y", { fill: "#4ECDC4", size: 12, weight: "700" });
        text(svg, ox - 10, oy + 16, "O", { fill: "#666", size: 10, anchor: "middle" });

        var A = { x: -1, y: 1, color: "#4ECDC4", label: "A" };
        var B = { x: 0, y: 2, color: "#FF6B6B", label: "B" };
        var C = { x: 1, y: -1, color: "#BB8FCE", label: "C" };
        var D = { x: 1, y: 0, color: "#4D9DE0", label: "D" };
        var K = { x: -2 / 5, y: 8 / 5, color: "#F4D03F", label: "K" };
        var L = { x: 0, y: 2 / 3, color: "#F4D03F", label: "L" };
        var G = { x: -2 / 5, y: 7 / 5, color: "#F4D03F", label: "G" };

        // Points de base
        [A, B, C, D].forEach(function (p) {
            circlePoint(svg, px(p), py(p), p.color, 6);
            var dx = p.label === "D" ? 12 : (p.label === "C" ? -12 : -12);
            var anchor = dx > 0 ? "start" : "end";
            text(svg, px(p) + dx, py(p) - 6, p.label, { fill: p.color, size: 13, weight: "700", anchor: anchor });
        });

        // Points barycentres K, L, G (proches — étiquettes décalées pour rester lisibles)
        circlePoint(svg, px(K), py(K), K.color, 6);
        text(svg, px(K) - 12, py(K) - 8, "K", { fill: K.color, size: 13, weight: "700", anchor: "end" });

        circlePoint(svg, px(L), py(L), L.color, 5.5);
        text(svg, px(L) + 12, py(L) + 4, "L", { fill: L.color, size: 13, weight: "700" });

        circlePoint(svg, px(G), py(G), G.color, 5.5);
        text(svg, px(G) - 12, py(G) + 16, "G", { fill: G.color, size: 13, weight: "700", anchor: "end" });

        text(svg, W / 2, H - 14, "K(-2/5 ; 8/5), L(0 ; 2/3), G(-2/5 ; 7/5)", { fill: "#888888", size: 10, anchor: "middle" });
    }

    /* ============================================================
       EXERCICE 14 — ABCD quadrilatère convexe (corrigé : le poids de D dans
       la définition initiale de K doit être -6, et non 6 — coquille de signe
       confirmée par vérification symbolique + numérique multi-cas).
       H = Bar{(A,1);(E,2)} — H, A, E alignés (H entre A et E)
       K = Bar{(D,-3);(E,2)} — K, D, E alignés (K au-delà de D, loin de E)
       Résultat exact : AK = -3·DH  ⇒  (AK) ∥ (DH)
       ============================================================ */
    function drawGraph14() {
        var svg = document.getElementById("graph14");
        if (!svg) return;
        var W = 420, H = 480;
        setupSvg(svg, W, H);

        var A = { x: 0.5, y: 4, color: "#4ECDC4", label: "A" };
        var B = { x: 5, y: 3.5, color: "#FF6B6B", label: "B" };
        var C = { x: 6, y: -1, color: "#BB8FCE", label: "C" };
        var D = { x: 1, y: -2, color: "#A8FF78", label: "D" };
        var E = { x: (-C.x + 5 * B.x) / 4, y: (-C.y + 5 * B.y) / 4, color: "#4D9DE0", label: "E" };
        var Hp = { x: (A.x + 2 * E.x) / 3, y: (A.y + 2 * E.y) / 3, color: "#4D9DE0", label: "H" };
        var K = { x: 3 * D.x - 2 * E.x, y: 3 * D.y - 2 * E.y, color: "#F4D03F", label: "K" };

        var ox = 170, oy = 133, scale = 20;
        function px(p) { return ox + p.x * scale; }
        function py(p) { return oy - p.y * scale; }

        // Quadrilatère ABCD
        svg.appendChild(svgEl("polygon", {
            points: [A, B, C, D].map(function (p) { return px(p) + "," + py(p); }).join(" "),
            fill: "#4ECDC40E", stroke: "#3A3A50", "stroke-width": 1.5
        }));

        // Droite (A,H,E) — alignés
        lineSeg(svg, px(A), py(A), px(E) + (px(E) - px(A)) * 0.08, py(E) + (py(E) - py(A)) * 0.08, { color: "#4D9DE066", width: 1.5, dashed: true });
        // Droite (E,D,K) — alignés
        lineSeg(svg, px(E), py(E), px(K), py(K), { color: "#F4D03F55", width: 1.5, dashed: true });

        // Segments mis en évidence : (AK) en doré, (DH) en bleu — pour comparer visuellement leur parallélisme
        lineSeg(svg, px(A), py(A), px(K), py(K), { color: "#F4D03F", width: 2.5 });
        lineSeg(svg, px(D), py(D), px(Hp), py(Hp), { color: "#4D9DE0", width: 2.5 });

        // Points
        [A, B, C, D].forEach(function (p) {
            circlePoint(svg, px(p), py(p), p.color, 6);
            text(svg, px(p) + 10, py(p) - 6, p.label, { fill: p.color, size: 12.5, weight: "700" });
        });
        circlePoint(svg, px(E), py(E), E.color, 5.5);
        text(svg, px(E) + 10, py(E) - 6, "E", { fill: E.color, size: 12.5, weight: "700" });
        circlePoint(svg, px(Hp), py(Hp), Hp.color, 5.5);
        text(svg, px(Hp) - 10, py(Hp) + 16, "H", { fill: Hp.color, size: 12.5, weight: "700", anchor: "end" });
        circlePoint(svg, px(K), py(K), K.color, 6);
        text(svg, px(K) + 10, py(K) - 6, "K", { fill: K.color, size: 13, weight: "700" });

        // Repères de parallélisme (‖)
        function parallelTick(mx, my, ang) {
            var l = 7, gap = 3;
            for (var s = -1; s <= 1; s += 2) {
                var ox2 = mx + s * gap * Math.cos(ang + Math.PI / 2);
                var oy2 = my + s * gap * Math.sin(ang + Math.PI / 2);
                lineSeg(svg, ox2 - l * Math.cos(ang), oy2 - l * Math.sin(ang), ox2 + l * Math.cos(ang), oy2 + l * Math.sin(ang), { color: "#FFFFFF99", width: 1.5 });
            }
        }
        var angAK = Math.atan2(py(K) - py(A), px(K) - px(A));
        parallelTick((px(A) + px(K)) / 2, (py(A) + py(K)) / 2, angAK);
        parallelTick((px(D) + px(Hp)) / 2 - 18 * Math.cos(angAK), (py(D) + py(Hp)) / 2 - 18 * Math.sin(angAK), angAK);

        text(svg, W / 2, H - 14, "AK = -3·DH  ⇒  (AK) ∥ (DH)", { fill: "#888888", size: 10.5, anchor: "middle" });
    }

    /* ============================================================
       EXERCICE 15 — Triangle ABC, I ∈ (BC), J ∈ (CA), K ∈ (AB)
       (corrigé : 3CJ = CA, et non 8CJ = CA — coquille de saisie/lecture
       confirmée : avec 8, I,J,K ne sont pas alignés ; avec 3, ils le sont
       exactement, avec le même rapport IK = (9/5)IJ que dans le corrigé)
       ============================================================ */
    function drawGraph15() {
        var svg = document.getElementById("graph15");
        if (!svg) return;
        var W = 420, H = 300;
        setupSvg(svg, W, H);

        var A = { x: 0, y: 4, color: "#4ECDC4", label: "A" };
        var B = { x: -3, y: -1, color: "#FF6B6B", label: "B" };
        var C = { x: 3, y: -1, color: "#BB8FCE", label: "C" };

        var BC = { x: C.x - B.x, y: C.y - B.y };
        var I = { x: B.x + 1.5 * BC.x, y: B.y + 1.5 * BC.y, color: "#F4D03F", label: "I" };
        var CA = { x: A.x - C.x, y: A.y - C.y };
        var J = { x: C.x + (1 / 3) * CA.x, y: C.y + (1 / 3) * CA.y, color: "#F4D03F", label: "J" };
        var AB = { x: B.x - A.x, y: B.y - A.y };
        var K = { x: A.x + 0.4 * AB.x, y: A.y + 0.4 * AB.y, color: "#F4D03F", label: "K" };

        var ox = 151, oy = 188, scale = 37;
        function px(p) { return ox + p.x * scale; }
        function py(p) { return oy - p.y * scale; }

        svg.appendChild(svgEl("polygon", {
            points: [A, B, C].map(function (p) { return px(p) + "," + py(p); }).join(" "),
            fill: "#4ECDC40E", stroke: "#3A3A50", "stroke-width": 1.5
        }));

        // Droite transversale (I, J, K) — alignés — prolongée un peu au-delà de I et K
        var ext = 0.12;
        lineSeg(svg,
            px(K) + (px(K) - px(I)) * ext, py(K) + (py(K) - py(I)) * ext,
            px(I) + (px(I) - px(K)) * ext, py(I) + (py(I) - py(K)) * ext,
            { color: "#F4D03F", width: 2 });

        [A, B, C].forEach(function (p) {
            circlePoint(svg, px(p), py(p), p.color, 6);
            var dy = p.label === "A" ? -12 : 20;
            text(svg, px(p), py(p) + dy, p.label, { fill: p.color, size: 13, weight: "700", anchor: "middle" });
        });

        circlePoint(svg, px(I), py(I), I.color, 6);
        text(svg, px(I) + 10, py(I) + 5, "I", { fill: I.color, size: 13, weight: "700" });
        circlePoint(svg, px(J), py(J), J.color, 6);
        text(svg, px(J) + 10, py(J) - 6, "J", { fill: J.color, size: 13, weight: "700" });
        circlePoint(svg, px(K), py(K), K.color, 6);
        text(svg, px(K) - 10, py(K) - 8, "K", { fill: K.color, size: 13, weight: "700", anchor: "end" });

        text(svg, W / 2, H - 10, "I, J, K alignés — IK = (9/5)·IJ", { fill: "#888888", size: 10.5, anchor: "middle" });
    }

    document.addEventListener("DOMContentLoaded", function () {
        setTimeout(function () {
            drawGraph13();
            drawGraph14();
            drawGraph15();
        }, 300);
    });
})();
