/* ============================================================
   figuresvt_p1.js — Série 1 (Barycentre) : Construction & Coordonnées
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

        var bg = svgEl("rect", {
            x: 0, y: 0, width: vbW, height: vbH,
            fill: "#0D1117", rx: 8
        });
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

    function line(svg, x1, y1, x2, y2, opts) {
        opts = opts || {};
        var attrs = {
            x1: x1, y1: y1, x2: x2, y2: y2,
            stroke: opts.color || "#2A2A3E",
            "stroke-width": opts.width || 1.5
        };
        if (opts.dashed) attrs["stroke-dasharray"] = "5,4";
        svg.appendChild(svgEl("line", attrs));
    }

    function tick(svg, x, y, len, color) {
        line(svg, x, y - len / 2, x, y + len / 2, { color: color || "#3A3A50", width: 1.5 });
    }

    function arrowMarkerDefs(svg, id, color) {
        var defs = svg.querySelector("defs") || svgEl("defs");
        if (!svg.querySelector("defs")) svg.insertBefore(defs, svg.firstChild.nextSibling);
        var marker = svgEl("marker", {
            id: id, viewBox: "0 0 10 10", refX: 8, refY: 5,
            markerWidth: 6, markerHeight: 6, orient: "auto-start-reverse"
        });
        var path = svgEl("path", { d: "M0,0 L10,5 L0,10 z", fill: color });
        marker.appendChild(path);
        defs.appendChild(marker);
    }

    /* ============================================================
       EXERCICE 1 — G = Bar{(A,4); (B,-5)} ⇒ AG = 5·AB, G extérieur à [AB] côté B
       ============================================================ */
    function drawGraph1() {
        var svg = document.getElementById("graph1");
        if (!svg) return;
        var W = 400, H = 190;
        setupSvg(svg, W, H);

        var ox = 40, oy = 120, unit = 62; // 1 unité (AB) = 62px, il faut 5 unités => 40+5*62=350 < 380 ok

        arrowMarkerDefs(svg, "arrowGold1", "#F4D03F");

        // Ligne support (droite AB)
        line(svg, ox - 15, oy, ox + 5.3 * unit, oy, { color: "#2A2A3E", width: 1.5 });

        // Graduations discrètes à chaque unité de 0 à 5 (matérialisent les 5 "AB" successifs)
        for (var k = 0; k <= 5; k++) {
            tick(svg, ox + k * unit, oy, 10, "#3A3A50");
        }

        var A = { x: 0, color: "#4ECDC4", label: "A" };
        var B = { x: 1, color: "#FF6B6B", label: "B" };
        var G = { x: 5, color: "#F4D03F", label: "G" };

        // Segment [AB] mis en évidence (l'unité de référence)
        line(svg, ox + A.x * unit, oy, ox + B.x * unit, oy, { color: "#4ECDC4", width: 3 });

        // Flèche pointillée AG au-dessus, avec repères des 5 unités
        var arrowY = oy - 34;
        line(svg, ox + A.x * unit, arrowY, ox + G.x * unit - 6, arrowY, { color: "#F4D03F", width: 2, dashed: true });
        svg.lastChild.setAttribute("marker-end", "url(#arrowGold1)");
        line(svg, ox + A.x * unit, arrowY, ox + A.x * unit, oy + 6, { color: "#F4D03F33", width: 1 });
        line(svg, ox + G.x * unit, arrowY, ox + G.x * unit, oy - 6, { color: "#F4D03F33", width: 1 });
        text(svg, ox + (A.x + G.x) / 2 * unit, arrowY - 8, "AG = 5·AB", { fill: "#F4D03F", size: 12.5, weight: "700", anchor: "middle" });

        // Points
        [A, B, G].forEach(function (p) {
            circlePoint(svg, ox + p.x * unit, oy, p.color, 6.5);
            text(svg, ox + p.x * unit, oy + 22, p.label, { fill: p.color, size: 13.5, weight: "700", anchor: "middle" });
        });
        text(svg, ox + A.x * unit, oy - 12, "0", { fill: "#666", size: 9.5, anchor: "middle" });
        text(svg, ox + B.x * unit, oy - 12, "1", { fill: "#666", size: 9.5, anchor: "middle" });
        text(svg, ox + G.x * unit, oy - 12, "5", { fill: "#666", size: 9.5, anchor: "middle" });

        text(svg, W / 2, H - 12, "G extérieur à [AB], du côté de B", { fill: "#888888", size: 10.5, anchor: "middle" });
    }

    /* ============================================================
       EXERCICE 2 — G = Bar{(A,√8); (B,-√2)} = Bar{(A,2); (B,-1)}
       ⇒ AG = BA ⇒ G symétrique de B par rapport à A
       ============================================================ */
    function drawGraph2() {
        var svg = document.getElementById("graph2");
        if (!svg) return;
        var W = 400, H = 190;
        setupSvg(svg, W, H);

        var ox = 200, oy = 120, unit = 90; // A au centre, B à droite (+1), G à gauche (-1)

        arrowMarkerDefs(svg, "arrowGold2", "#F4D03F");
        arrowMarkerDefs(svg, "arrowRed2", "#FF6B6B");

        // Ligne support
        line(svg, ox - 1.35 * unit, oy, ox + 1.35 * unit, oy, { color: "#2A2A3E", width: 1.5 });

        var G = { x: -1, color: "#F4D03F", label: "G" };
        var A = { x: 0, color: "#4ECDC4", label: "A" };
        var B = { x: 1, color: "#FF6B6B", label: "B" };

        // Fleche AG (doree, vers la gauche) et fleche BA (rouge, vers la gauche) -- meme longueur
        var yTop = oy - 30, yBot = oy + 30;

        var aG = svgEl("line", { x1: ox + A.x * unit, y1: yTop, x2: ox + G.x * unit + 8, y2: yTop, stroke: "#F4D03F", "stroke-width": 2 });
        aG.setAttribute("marker-end", "url(#arrowGold2)");
        svg.appendChild(aG);
        text(svg, ox + (A.x + G.x) / 2 * unit, yTop - 8, "AG", { fill: "#F4D03F", size: 12, weight: "700", anchor: "middle" });

        var bA = svgEl("line", { x1: ox + B.x * unit, y1: yBot, x2: ox + A.x * unit + 8, y2: yBot, stroke: "#FF6B6B", "stroke-width": 2 });
        bA.setAttribute("marker-end", "url(#arrowRed2)");
        svg.appendChild(bA);
        text(svg, ox + (A.x + B.x) / 2 * unit, yBot + 18, "BA", { fill: "#FF6B6B", size: 12, weight: "700", anchor: "middle" });

        // Points
        [G, A, B].forEach(function (p) {
            circlePoint(svg, ox + p.x * unit, oy, p.color, 6.5);
            text(svg, ox + p.x * unit, oy + 20, p.label, { fill: p.color, size: 13.5, weight: "700", anchor: "middle" });
        });

        // A = milieu de [GB]
        text(svg, ox, oy - 52, "A milieu de [GB]", { fill: "#BB8FCE", size: 11, weight: "700", anchor: "middle" });

        text(svg, W / 2, H - 12, "G symétrique de B par rapport à A", { fill: "#888888", size: 10.5, anchor: "middle" });
    }

    /* ============================================================
       EXERCICE 3 — A(3;2), B(4;1), G = Bar{(A,1);(B,-5)} = (17/4; 3/4)
       G, A, B alignés — G est au-delà de B (extérieur à [AB])
       ============================================================ */
    function drawGraph3() {
        var svg = document.getElementById("graph3");
        if (!svg) return;
        var W = 400, H = 250;
        setupSvg(svg, W, H);

        var ox = 55, oy = 210, scale = 42;

        arrowMarkerDefs(svg, "arrowAxis3", "#4ECDC4");

        // Grille légère
        for (var gx = 0; gx <= 6; gx++) {
            line(svg, ox + gx * scale, 20, ox + gx * scale, oy, { color: "#161B22", width: 1 });
        }
        for (var gy = 0; gy <= 4; gy++) {
            line(svg, ox, oy - gy * scale, ox + 6 * scale, oy - gy * scale, { color: "#161B22", width: 1 });
        }

        // Axes
        var xAxis = svgEl("line", { x1: ox, y1: oy, x2: ox + 6 * scale + 12, y2: oy, stroke: "#4ECDC4", "stroke-width": 1.5 });
        xAxis.setAttribute("marker-end", "url(#arrowAxis3)");
        svg.appendChild(xAxis);
        var yAxis = svgEl("line", { x1: ox, y1: oy, x2: ox, y2: 20, stroke: "#4ECDC4", "stroke-width": 1.5 });
        yAxis.setAttribute("marker-end", "url(#arrowAxis3)");
        svg.appendChild(yAxis);
        text(svg, ox + 6 * scale + 18, oy + 4, "x", { fill: "#4ECDC4", size: 12, weight: "700" });
        text(svg, ox - 14, 22, "y", { fill: "#4ECDC4", size: 12, weight: "700" });
        text(svg, ox - 12, oy + 14, "O", { fill: "#666", size: 10.5, anchor: "middle" });

        // Droite (AGB) — G est au-delà de B (t=1.25 > 1)
        var A = { x: 3, y: 2, color: "#4ECDC4", label: "A" };
        var B = { x: 4, y: 1, color: "#FF6B6B", label: "B" };
        var G = { x: 17 / 4, y: 3 / 4, color: "#F4D03F", label: "G" };

        function px(pt) { return ox + pt.x * scale; }
        function py(pt) { return oy - pt.y * scale; }

        line(svg, px(A), py(A), px(G), py(G), { color: "#F4D03F55", width: 2, dashed: true });

        // Points + étiquettes décalées pour éviter le chevauchement (B et G sont très proches)
        circlePoint(svg, px(A), py(A), A.color, 6);
        text(svg, px(A) - 12, py(A) - 12, "A (3 ; 2)", { fill: A.color, size: 11, weight: "700", anchor: "end" });

        circlePoint(svg, px(B), py(B), B.color, 6);
        text(svg, px(B) - 40, py(B) + 18, "B (4 ; 1)", { fill: B.color, size: 11, weight: "700", anchor: "start" });

        circlePoint(svg, px(G), py(G), G.color, 6);
        text(svg, px(G) + 12, py(G) - 4, "G (17/4 ; 3/4)", { fill: G.color, size: 11, weight: "700", anchor: "start" });

        text(svg, W / 2, H - 10, "A, G et B sont alignés (G extérieur à [AB])", { fill: "#888888", size: 10.5, anchor: "middle" });
    }

    /* ============================================================
       EXERCICE 4 — Repère (A; AB; AC) : A(0;0), B(1;0), C(0;1)
       I = Bar{(B,4);(C,-3)} = (4; -3) dans ce repère
       ============================================================ */
    function drawGraph4() {
        var svg = document.getElementById("graph4");
        if (!svg) return;
        var W = 400, H = 280;
        setupSvg(svg, W, H);

        // origine placée en haut-gauche de la zone utile pour laisser toute la place
        // nécessaire à I(4;-3), qui descend loin sous l'axe des AB
        var ox = 110, oy = 90, scale = 40;

        arrowMarkerDefs(svg, "arrowAxis4", "#4ECDC4");

        var xAxis = svgEl("line", { x1: ox - 35, y1: oy, x2: ox + 4.6 * scale, y2: oy, stroke: "#4ECDC4", "stroke-width": 1.5 });
        xAxis.setAttribute("marker-end", "url(#arrowAxis4)");
        svg.appendChild(xAxis);
        var yAxis = svgEl("line", { x1: ox, y1: H - 25, x2: ox, y2: 25, stroke: "#4ECDC4", "stroke-width": 1.5 });
        yAxis.setAttribute("marker-end", "url(#arrowAxis4)");
        svg.appendChild(yAxis);
        text(svg, ox + 4.6 * scale + 6, oy + 4, "AB", { fill: "#4ECDC4", size: 11.5, weight: "700" });
        text(svg, ox - 20, 20, "AC", { fill: "#4ECDC4", size: 11.5, weight: "700" });

        var A = { x: 0, y: 0, color: "#4ECDC4", label: "A" };
        var B = { x: 1, y: 0, color: "#FF6B6B", label: "B" };
        var C = { x: 0, y: 1, color: "#BB8FCE", label: "C" };
        var I = { x: 4, y: -3, color: "#F4D03F", label: "I" };

        function px(pt) { return ox + pt.x * scale; }
        function py(pt) { return oy - pt.y * scale; }

        // Triangle ABC (repère de référence)
        var tri = svgEl("polygon", {
            points: [A, B, C].map(function (p) { return px(p) + "," + py(p); }).join(" "),
            fill: "#4ECDC411", stroke: "#2A2A3E", "stroke-width": 1, "stroke-dasharray": "3,3"
        });
        svg.appendChild(tri);

        // Pointillés de projection pour I
        line(svg, px(I), py(I), px(I), oy, { color: "#F4D03F55", width: 1, dashed: true });
        line(svg, px(I), py(I), ox, py(I), { color: "#F4D03F55", width: 1, dashed: true });

        [A, B, C, I].forEach(function (p) {
            circlePoint(svg, px(p), py(p), p.color, 6);
            text(svg, px(p) + 9, py(p) - 7, p.label, { fill: p.color, size: 12.5, weight: "700" });
        });

        text(svg, px(I) + 9, py(I) + 16, "(4 ; -3)", { fill: "#F4D03F", size: 10.5 });

        text(svg, W / 2, H - 10, "I (4 ; -3) dans le repère (A ; AB, AC)", { fill: "#888888", size: 10.5, anchor: "middle" });
    }

    document.addEventListener("DOMContentLoaded", function () {
        setTimeout(function () {
            drawGraph1();
            drawGraph2();
            drawGraph3();
            drawGraph4();
        }, 300);
    });
})();
