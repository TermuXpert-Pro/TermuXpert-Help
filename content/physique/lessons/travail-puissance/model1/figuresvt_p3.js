/* ============================================================
   figuresvt_p3.js
   Figures SVG — Partie 3 : Travail du poids / Travail d'un ensemble de forces
   Fichier 100% autonome (aucune dépendance externe).
   ============================================================ */
(function () {
    "use strict";

    var SVG_NS = "http://www.w3.org/2000/svg";

    function el(tag, attrs) {
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

    function text(x, y, str, attrs) {
        var t = el("text", Object.assign({
            x: x, y: y,
            "font-family": "Arial, sans-serif",
            "font-size": 13,
            fill: "#FFFFFF"
        }, attrs || {}));
        t.textContent = str;
        return t;
    }

    function clearSvg(svg) {
        while (svg.firstChild) svg.removeChild(svg.firstChild);
    }

    function arrow(svg, x1, y1, x2, y2, color, width) {
        width = width || 2.5;
        var angle = Math.atan2(y2 - y1, x2 - x1);
        var headLen = 8 + width;
        svg.appendChild(el("line", {
            x1: x1, y1: y1, x2: x2, y2: y2,
            stroke: color, "stroke-width": width, "stroke-linecap": "round"
        }));
        var hx1 = x2 - headLen * Math.cos(angle - 0.4);
        var hy1 = y2 - headLen * Math.sin(angle - 0.4);
        var hx2 = x2 - headLen * Math.cos(angle + 0.4);
        var hy2 = y2 - headLen * Math.sin(angle + 0.4);
        svg.appendChild(el("polygon", {
            points: x2 + "," + y2 + " " + hx1 + "," + hy1 + " " + hx2 + "," + hy2,
            fill: color
        }));
    }

    function dashedLine(svg, x1, y1, x2, y2, color, width) {
        svg.appendChild(el("line", {
            x1: x1, y1: y1, x2: x2, y2: y2,
            stroke: color, "stroke-width": width || 1,
            "stroke-dasharray": "4,3"
        }));
    }

    /* ============================================================
       FIGURE 1 : graphPoids
       Travail du poids : W = m·g·(zA - zB) — descente de A (haut) vers B (bas)
       ============================================================ */
    function renderGraphPoids() {
        var svg = document.getElementById("graphPoids");
        if (!svg) return;
        clearSvg(svg);
        svg.setAttribute("viewBox", "0 0 440 260");

        var axisX = 60;
        var groundY = 220;
        var zA_y = 60, zB_y = 170;
        var Ax = 150, Bx = 300;

        // Axe vertical des altitudes
        arrow(svg, axisX, groundY, axisX, 30, "#6C7078", 1.5);
        svg.appendChild(text(axisX - 14, 26, "z", { "font-size": 13, fill: "#9AA0A6", "font-style": "italic" }));

        // Sol de référence (z = 0)
        svg.appendChild(el("line", { x1: 30, y1: groundY, x2: 420, y2: groundY, stroke: "#3A4048", "stroke-width": 1.2 }));
        svg.appendChild(text(400, groundY - 6, "z = 0", { "font-size": 10, fill: "#6C7078" }));

        // Niveaux zA et zB (pointillés horizontaux)
        dashedLine(svg, axisX, zA_y, Ax, zA_y, "#4ECDC4", 1);
        dashedLine(svg, axisX, zB_y, Bx, zB_y, "#FF6B6B", 1);
        svg.appendChild(text(20, zA_y + 4, "zA", { "font-size": 11, fill: "#4ECDC4" }));
        svg.appendChild(text(20, zB_y + 4, "zB", { "font-size": 11, fill: "#FF6B6B" }));

        // Trajectoire (courbe quelconque, le travail du poids ne dépend pas du chemin)
        svg.appendChild(el("path", {
            d: "M " + Ax + " " + zA_y + " C " + (Ax + 60) + " " + (zA_y + 30) + " " + (Bx - 80) + " " + (zB_y - 60) + " " + Bx + " " + zB_y,
            fill: "none", stroke: "#BB8FCE", "stroke-width": 1.5, "stroke-dasharray": "3,3"
        }));

        // Point A (départ, altitude haute) avec le corps
        svg.appendChild(el("circle", { cx: Ax, cy: zA_y, r: 8, fill: "#4ECDC4" }));
        svg.appendChild(text(Ax - 6, zA_y - 14, "A", { "font-size": 14, fill: "#FFFFFF", "font-weight": "700" }));
        arrow(svg, Ax, zA_y, Ax, zA_y + 40, "#FF6B6B", 2.3);
        svg.appendChild(text(Ax + 8, zA_y + 30, "P", { "font-size": 12, fill: "#FF6B6B", "font-style": "italic", "font-weight": "700" }));

        // Point B (arrivée, altitude basse)
        svg.appendChild(el("circle", { cx: Bx, cy: zB_y, r: 8, fill: "#FF6B6B" }));
        svg.appendChild(text(Bx + 12, zB_y + 4, "B", { "font-size": 14, fill: "#FFFFFF", "font-weight": "700" }));
        arrow(svg, Bx, zB_y, Bx, zB_y + 40, "#FF6B6B", 2.3);
        svg.appendChild(text(Bx + 8, zB_y + 30, "P", { "font-size": 12, fill: "#FF6B6B", "font-style": "italic", "font-weight": "700" }));

        // Différence d'altitude (accolade simplifiée)
        svg.appendChild(el("line", { x1: 380, y1: zA_y, x2: 390, y2: zA_y, stroke: "#F4D03F", "stroke-width": 1.3 }));
        svg.appendChild(el("line", { x1: 380, y1: zB_y, x2: 390, y2: zB_y, stroke: "#F4D03F", "stroke-width": 1.3 }));
        svg.appendChild(el("line", { x1: 385, y1: zA_y, x2: 385, y2: zB_y, stroke: "#F4D03F", "stroke-width": 1.3 }));
        svg.appendChild(text(392, (zA_y + zB_y) / 2 + 4, "zA-zB", { "font-size": 10, fill: "#F4D03F" }));

        svg.appendChild(text(230, 22, "Travail du poids : W = m·g·(zA − zB)", {
            "text-anchor": "middle", "font-size": 11.5, fill: "#888888"
        }));
    }

    /* ============================================================
       FIGURE 2 : graphForces
       Forces appliquées sur un solide en translation sur un plan horizontal
       ============================================================ */
    function renderGraphForces() {
        var svg = document.getElementById("graphForces");
        if (!svg) return;
        clearSvg(svg);
        svg.setAttribute("viewBox", "0 0 440 240");

        var groundY = 190;
        var cx = 220, cy = groundY - 30;

        // Plan horizontal
        svg.appendChild(el("line", { x1: 40, y1: groundY, x2: 400, y2: groundY, stroke: "#5A6068", "stroke-width": 2 }));
        // hachures du sol
        for (var i = 0; i < 18; i++) {
            var hx = 45 + i * 20;
            svg.appendChild(el("line", { x1: hx, y1: groundY, x2: hx - 8, y2: groundY + 10, stroke: "#3A4048", "stroke-width": 1 }));
        }

        // Solide S
        svg.appendChild(el("rect", { x: cx - 40, y: cy - 20, width: 80, height: 40, rx: 6, fill: "#4ECDC4", opacity: 0.9 }));
        svg.appendChild(text(cx, cy + 5, "S", { "text-anchor": "middle", "font-size": 15, fill: "#0D1117", "font-weight": "700" }));

        // Poids P (vers le bas)
        arrow(svg, cx, cy + 20, cx, cy + 75, "#FF6B6B", 2.6);
        svg.appendChild(text(cx + 8, cy + 60, "P", { "font-size": 13, fill: "#FF6B6B", "font-style": "italic", "font-weight": "700" }));

        // Réaction normale R_N (vers le haut)
        arrow(svg, cx, cy - 20, cx, cy - 75, "#F4D03F", 2.6);
        svg.appendChild(text(cx + 8, cy - 60, "R_N", { "font-size": 12, fill: "#F4D03F", "font-style": "italic", "font-weight": "700" }));

        // Force motrice F (horizontale, sens du mouvement)
        arrow(svg, cx + 40, cy, cx + 110, cy, "#A8FF78", 2.6);
        svg.appendChild(text(cx + 115, cy + 4, "F", { "font-size": 13, fill: "#A8FF78", "font-style": "italic", "font-weight": "700" }));

        // Frottement f (horizontal, opposé, en pointillé - éventuel)
        dashedLine(svg, cx - 40, cy, cx - 100, cy, "#BB8FCE", 2);
        svg.appendChild(el("polygon", {
            points: (cx - 100) + "," + cy + " " + (cx - 92) + "," + (cy - 5) + " " + (cx - 92) + "," + (cy + 5),
            fill: "#BB8FCE"
        }));
        svg.appendChild(text(cx - 115, cy - 8, "f", { "font-size": 12, fill: "#BB8FCE", "font-style": "italic" }));

        // Déplacement AB
        var Ax = cx - 20, By = groundY + 30, Bx = cx + 140;
        dashedLine(svg, Ax, groundY + 20, Bx, groundY + 20, "#6C7078", 1);
        arrow(svg, Ax, groundY + 20, Bx, groundY + 20, "#6C7078", 1.5);
        svg.appendChild(text((Ax + Bx) / 2 - 10, groundY + 34, "AB", { "font-size": 11, fill: "#9AA0A6" }));

        svg.appendChild(text(220, 22, "Solide en translation : P, R_N, F (motrice), f (frottement)", {
            "text-anchor": "middle", "font-size": 10.5, fill: "#888888"
        }));
    }

    function initAll() {
        renderGraphPoids();
        renderGraphForces();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initAll);
    } else {
        initAll();
    }
})();
