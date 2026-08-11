/* ============================================================
   figuresvt_p2.js — Série 2 (Barycentre) : Barycentre de 2 et 3 points
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
        svg.style.maxWidth = "420px";
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
        var l = svgEl("line", attrs);
        svg.appendChild(l);
        return l;
    }

    function arrowMarkerDefs(svg, id, color) {
        var defs = svg.querySelector("defs");
        if (!defs) {
            defs = svgEl("defs");
            svg.appendChild(defs);
        }
        if (svg.querySelector("#" + id)) return; // déjà défini
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
       EXERCICE 5 — G = Bar{(A,2); (B,-3)} et G = Bar{(E,-1); (F,2)}
       ⇒ (AB) et (EF) sont deux droites distinctes qui se coupent en G
       ============================================================ */
    function drawGraph5() {
        var svg = document.getElementById("graph5");
        if (!svg) return;
        var W = 400, H = 200;
        setupSvg(svg, W, H);

        var ox = 40, oy = 110, unit = 55; // A=0, B=1, G=(2*0-3*1)/(-1)=3

        // Droite (AB), horizontale
        lineSeg(svg, ox - 15, oy, ox + 3.6 * unit, oy, { color: "#2A2A3E", width: 1.5 });
        text(svg, ox + 3.6 * unit + 4, oy + 4, "(AB)", { fill: "#4ECDC4", size: 11, weight: "700" });

        var A = { x: ox + 0 * unit, y: oy, color: "#4ECDC4", label: "A" };
        var B = { x: ox + 1 * unit, y: oy, color: "#FF6B6B", label: "B" };
        var G = { x: ox + 3 * unit, y: oy, color: "#F4D03F", label: "G" };

        // Droite (EF), inclinée, passant exactement par G
        var angle = -32 * Math.PI / 180;
        var dx = Math.cos(angle), dy = Math.sin(angle);
        var Ex = G.x - 2.1 * unit * dx, Ey = G.y - 2.1 * unit * dy;
        var Fx = G.x + 1.3 * unit * dx, Fy = G.y + 1.3 * unit * dy;
        lineSeg(svg, Ex - 10 * dx, Ey - 10 * dy, Fx + 32 * dx, Fy + 32 * dy, { color: "#BB8FCE55", width: 1.5 });
        text(svg, Fx + 38 * dx, Fy + 38 * dy + 4, "(EF)", { fill: "#BB8FCE", size: 11, weight: "700" });

        // Points E et F
        circlePoint(svg, Ex, Ey, "#BB8FCE", 6);
        text(svg, Ex - 14, Ey + 5, "E", { fill: "#BB8FCE", size: 13, weight: "700", anchor: "end" });
        circlePoint(svg, Fx, Fy, "#BB8FCE", 6);
        text(svg, Fx + 10, Fy - 4, "F", { fill: "#BB8FCE", size: 13, weight: "700" });

        // Points A, B, G (sur la droite (AB), G point d'intersection commun)
        [A, B].forEach(function (p) {
            circlePoint(svg, p.x, p.y, p.color, 6);
            text(svg, p.x, p.y + 20, p.label, { fill: p.color, size: 13, weight: "700", anchor: "middle" });
        });
        circlePoint(svg, G.x, G.y, G.color, 7);
        text(svg, G.x + 10, G.y - 12, "G", { fill: G.color, size: 14, weight: "700" });

        text(svg, W / 2, H - 10, "(EF) ∩ (AB) = {G}", { fill: "#888888", size: 10.5, anchor: "middle" });
    }

    /* ============================================================
       EXERCICE 6 — A(0;5), B(3;2), G = Bar{(A,1);(B,2)} = (2;3)
       (C) = {M | ||MA + 2MB|| = 6} = cercle de centre G, rayon 2
       ============================================================ */
    function drawGraph6() {
        var svg = document.getElementById("graph6");
        if (!svg) return;
        var W = 400, H = 260;
        setupSvg(svg, W, H);

        var ox = 55, oy = 225, scale = 34;
        function px(v) { return ox + v * scale; }
        function py(v) { return oy - v * scale; }

        arrowMarkerDefs(svg, "arrowAxis6", "#4ECDC4");

        // Grille légère
        for (var gx = 0; gx <= 6; gx++) lineSeg(svg, px(gx), 20, px(gx), oy, { color: "#161B22", width: 1 });
        for (var gy = 0; gy <= 6; gy++) lineSeg(svg, ox, py(gy), px(6) + 15, py(gy), { color: "#161B22", width: 1 });

        // Axes
        arrow(svg, ox, oy, px(6) + 20, oy, "#4ECDC4", "arrowAxis6");
        arrow(svg, ox, oy, ox, 15, "#4ECDC4", "arrowAxis6");
        text(svg, px(6) + 26, oy + 4, "x", { fill: "#4ECDC4", size: 12, weight: "700" });
        text(svg, ox - 14, 18, "y", { fill: "#4ECDC4", size: 12, weight: "700" });
        text(svg, ox - 10, oy + 14, "O", { fill: "#666", size: 10, anchor: "middle" });

        var A = { x: 0, y: 5, color: "#4ECDC4", label: "A (0 ; 5)" };
        var B = { x: 3, y: 2, color: "#FF6B6B", label: "B (3 ; 2)" };
        var G = { x: 2, y: 3, color: "#F4D03F", label: "G (2 ; 3)" };

        // Cercle (C) de centre G, rayon 2 (2 unités = 2*scale px)
        svg.appendChild(svgEl("circle", {
            cx: px(G.x), cy: py(G.y), r: 2 * scale,
            fill: "#F4D03F14", stroke: "#F4D03F", "stroke-width": 2
        }));

        // Rayon indicatif
        lineSeg(svg, px(G.x), py(G.y), px(G.x) + 2 * scale, py(G.y), { color: "#F4D03F99", width: 1.5, dashed: true });
        text(svg, px(G.x) + scale, py(G.y) - 6, "r = 2", { fill: "#F4D03F", size: 10.5, anchor: "middle" });

        circlePoint(svg, px(A.x), py(A.y), A.color, 6);
        text(svg, px(A.x) + 10, py(A.y) - 6, A.label, { fill: A.color, size: 10.5, weight: "700" });
        circlePoint(svg, px(B.x), py(B.y), B.color, 6);
        text(svg, px(B.x) + 10, py(B.y) + 16, B.label, { fill: B.color, size: 10.5, weight: "700" });
        circlePoint(svg, px(G.x), py(G.y), G.color, 6.5);
        text(svg, px(G.x) - 10, py(G.y) - 12, G.label, { fill: G.color, size: 11, weight: "700", anchor: "end" });

        text(svg, W / 2, H - 8, "(C) = cercle de centre G et de rayon 2", { fill: "#888888", size: 10.5, anchor: "middle" });
    }

    /* ============================================================
       EXERCICE 7.1 — Triangle ABC, G = Bar{(A,1);(B,-1);(C,3)}
       Construction à partir de B : BG = (1/3)BA + BC
       ============================================================ */
    function drawGraph7_1() {
        var svg = document.getElementById("graph7_1");
        if (!svg) return;
        var W = 400, H = 260;
        setupSvg(svg, W, H);

        // Coordonnées choisies pour le triangle ; G calculé exactement par la formule du barycentre
        var A = { x: 0, y: 3, color: "#4ECDC4", label: "A" };
        var B = { x: -2, y: -1, color: "#FF6B6B", label: "B" };
        var C = { x: 3, y: -1, color: "#BB8FCE", label: "C" };
        // G = (A - B + 3C) / 3
        var G = {
            x: (A.x - B.x + 3 * C.x) / 3,
            y: (A.y - B.y + 3 * C.y) / 3,
            color: "#F4D03F", label: "G"
        };
        // Point intermédiaire de la construction : P1 = B + (1/3)(A - B)
        var P1 = { x: B.x + (A.x - B.x) / 3, y: B.y + (A.y - B.y) / 3 };

        var ox = 130, oy = 205, scale = 32;
        function px(pt) { return ox + pt.x * scale; }
        function py(pt) { return oy - pt.y * scale; }

        // Triangle ABC
        svg.appendChild(svgEl("polygon", {
            points: [A, B, C].map(function (p) { return px(p) + "," + py(p); }).join(" "),
            fill: "#4ECDC40E", stroke: "#3A3A50", "stroke-width": 1.5
        }));

        arrowMarkerDefs(svg, "arrowGold71", "#F4D03F");

        // Chaîne vectorielle depuis B : (1/3)BA puis BC
        arrow(svg, px(B), py(B), px(P1) - 3, py(P1) - 3, "#F4D03F", "arrowGold71");
        text(svg, (px(B) + px(P1)) / 2 + 6, (py(B) + py(P1)) / 2 - 20, "⅓BA", { fill: "#F4D03F", size: 11, weight: "700", anchor: "middle" });

        arrow(svg, px(P1), py(P1), px(G) - 3, py(G) - 3, "#F4D03F", "arrowGold71");
        text(svg, (px(P1) + px(G)) / 2 + 4, (py(P1) + py(G)) / 2 + 16, "BC", { fill: "#F4D03F", size: 11, weight: "700", anchor: "middle" });

        // Sommets du triangle
        [A, B, C].forEach(function (p) {
            circlePoint(svg, px(p), py(p), p.color, 6);
            text(svg, px(p) - 12, py(p) - 8, p.label, { fill: p.color, size: 13, weight: "700", anchor: "end" });
        });

        circlePoint(svg, px(P1), py(P1), "#F4D03F99", 3.5);

        circlePoint(svg, px(G), py(G), G.color, 6.5);
        text(svg, px(G) + 10, py(G) + 4, "G", { fill: G.color, size: 13.5, weight: "700" });

        text(svg, W / 2, H - 8, "G construit à partir de B : BG = ⅓BA + BC", { fill: "#888888", size: 10, anchor: "middle" });
    }

    /* ============================================================
       EXERCICE 7.2 — Triangle ABC, G = Bar{(A,4);(B,1/2);(C,-3)}
       Construction à partir de C : CG = (8/3)CA + (1/3)CB
       ============================================================ */
    function drawGraph7_2() {
        var svg = document.getElementById("graph7_2");
        if (!svg) return;

        var A = { x: 0, y: 3, color: "#4ECDC4", label: "A" };
        var B = { x: -2, y: -1, color: "#FF6B6B", label: "B" };
        var C = { x: 3, y: -1, color: "#BB8FCE", label: "C" };
        // G = (4A + 0.5B - 3C) / 1.5
        var G = {
            x: (4 * A.x + 0.5 * B.x - 3 * C.x) / 1.5,
            y: (4 * A.y + 0.5 * B.y - 3 * C.y) / 1.5,
            color: "#F4D03F", label: "G"
        };
        // Point intermédiaire : P1 = C + (8/3)(A - C)
        var P1 = { x: C.x + (8 / 3) * (A.x - C.x), y: C.y + (8 / 3) * (A.y - C.y) };

        // G est loin du triangle (poids élevés) : viewBox agrandie et recentrée
        // pour que TOUS les points (A, B, C, G, P1) restent visibles.
        // Boîte englobante : x∈[-6.667;3], y∈[-1;9.667] → ox/oy/scale calculés en conséquence.
        var W = 400, H = 340;
        setupSvg(svg, W, H);
        var ox = 244, oy = 274, scale = 24;
        function px(pt) { return ox + pt.x * scale; }
        function py(pt) { return oy - pt.y * scale; }

        svg.appendChild(svgEl("polygon", {
            points: [A, B, C].map(function (p) { return px(p) + "," + py(p); }).join(" "),
            fill: "#4ECDC40E", stroke: "#3A3A50", "stroke-width": 1.5
        }));

        arrowMarkerDefs(svg, "arrowGold72", "#F4D03F");

        // Chaîne vectorielle depuis C : (8/3)CA puis (1/3)CB
        arrow(svg, px(C), py(C), px(P1) + 3, py(P1) - 3, "#F4D03F", "arrowGold72");
        text(svg, (px(C) + px(P1)) / 2 + 4, (py(C) + py(P1)) / 2 - 10, "⁸⁄₃CA", { fill: "#F4D03F", size: 11, weight: "700", anchor: "middle" });

        arrow(svg, px(P1), py(P1), px(G) + 3, py(G), "#F4D03F", "arrowGold72");
        text(svg, (px(P1) + px(G)) / 2, py(P1) - 16, "⅓CB", { fill: "#F4D03F", size: 11, weight: "700", anchor: "middle" });

        [A, B, C].forEach(function (p) {
            circlePoint(svg, px(p), py(p), p.color, 6);
            text(svg, px(p) - 12, py(p) - 8, p.label, { fill: p.color, size: 13, weight: "700", anchor: "end" });
        });

        circlePoint(svg, px(P1), py(P1), "#F4D03F99", 3.5);

        circlePoint(svg, px(G), py(G), G.color, 6.5);
        text(svg, px(G) - 10, py(G) + 18, "G", { fill: G.color, size: 13.5, weight: "700", anchor: "end" });

        text(svg, W / 2, H - 10, "G construit à partir de C : CG = ⁸⁄₃CA + ⅓CB (schéma hors échelle)", { fill: "#888888", size: 9.5, anchor: "middle" });
    }

    /* ============================================================
       EXERCICE 8 — Triangle ABC, G = Bar{(A,1);(B,1);(C,2)}
       AG = (1/4)AB + (1/2)AC
       ============================================================ */
    function drawGraph8() {
        var svg = document.getElementById("graph8");
        if (!svg) return;
        var W = 400, H = 260;
        setupSvg(svg, W, H);

        var A = { x: 0, y: 4, color: "#4ECDC4", label: "A" };
        var B = { x: -3, y: -1, color: "#FF6B6B", label: "B" };
        var C = { x: 3, y: -1, color: "#BB8FCE", label: "C" };
        // G = (A + B + 2C) / 4
        var G = {
            x: (A.x + B.x + 2 * C.x) / 4,
            y: (A.y + B.y + 2 * C.y) / 4,
            color: "#F4D03F", label: "G"
        };
        // Point intermédiaire : P1 = A + (1/4)(B - A)
        var P1 = { x: A.x + (B.x - A.x) / 4, y: A.y + (B.y - A.y) / 4 };

        var ox = 155, oy = 200, scale = 30;
        function px(pt) { return ox + pt.x * scale; }
        function py(pt) { return oy - pt.y * scale; }

        svg.appendChild(svgEl("polygon", {
            points: [A, B, C].map(function (p) { return px(p) + "," + py(p); }).join(" "),
            fill: "#4ECDC414", stroke: "#3A3A50", "stroke-width": 1.5
        }));

        arrowMarkerDefs(svg, "arrowGold8", "#F4D03F");

        // Chaîne vectorielle depuis A : (1/4)AB puis (1/2)AC
        arrow(svg, px(A), py(A), px(P1) - 3, py(P1) - 3, "#F4D03F", "arrowGold8");
        text(svg, (px(A) + px(P1)) / 2 - 20, (py(A) + py(P1)) / 2, "¼AB", { fill: "#F4D03F", size: 11, weight: "700", anchor: "middle" });

        arrow(svg, px(P1), py(P1), px(G) - 3, py(G) - 3, "#F4D03F", "arrowGold8");
        text(svg, (px(P1) + px(G)) / 2 + 22, (py(P1) + py(G)) / 2, "½AC", { fill: "#F4D03F", size: 11, weight: "700", anchor: "middle" });

        [A, B, C].forEach(function (p) {
            circlePoint(svg, px(p), py(p), p.color, 6);
            var anchor = p.label === "A" ? "middle" : (p.x < 0 ? "end" : "start");
            var dx = p.label === "A" ? 0 : (p.x < 0 ? -10 : 10);
            var dy = p.label === "A" ? -12 : 20;
            text(svg, px(p) + dx, py(p) + dy, p.label, { fill: p.color, size: 13, weight: "700", anchor: anchor });
        });

        circlePoint(svg, px(P1), py(P1), "#F4D03F99", 3.5);

        circlePoint(svg, px(G), py(G), G.color, 6.5);
        text(svg, px(G) + 10, py(G) - 6, "G", { fill: G.color, size: 13.5, weight: "700" });

        text(svg, W / 2, H - 8, "G construit à partir de A : AG = ¼AB + ½AC", { fill: "#888888", size: 10, anchor: "middle" });
    }

    document.addEventListener("DOMContentLoaded", function () {
        setTimeout(function () {
            drawGraph5();
            drawGraph6();
            drawGraph7_1();
            drawGraph7_2();
            drawGraph8();
        }, 300);
    });
})();
