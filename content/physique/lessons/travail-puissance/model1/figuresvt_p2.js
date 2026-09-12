/* ============================================================
   figuresvt_p2.js
   Figures SVG — Partie 2 : Travail moteur / résistant / translation curviligne
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
        var headLen = 7 + width;
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
       FIGURE 1 : graphMoteur
       Les trois cas : travail moteur (0<α<90), nul (α=90), résistant (90<α≤180)
       ============================================================ */
    function renderGraphMoteur() {
        var svg = document.getElementById("graphMoteur");
        if (!svg) return;
        clearSvg(svg);
        svg.setAttribute("viewBox", "0 0 460 260");

        var cases = [
            { cx: 80,  angle: 30,  color: "#4ECDC4", label: "Moteur", sign: "W > 0", sub: "0° < α < 90°" },
            { cx: 230, angle: 90,  color: "#B0B6BD", label: "Nul",    sign: "W = 0", sub: "α = 90°" },
            { cx: 380, angle: 150, color: "#FF6B6B", label: "Résistant", sign: "W < 0", sub: "90° < α ≤ 180°" }
        ];

        cases.forEach(function (c) {
            var Ax = c.cx - 45, Ay = 190;
            var Bx = c.cx + 45, By = 190;
            var rad = c.angle * Math.PI / 180;
            var Flen = 70;
            var Fx = Ax + Flen * Math.cos(rad);
            var Fy = Ay - Flen * Math.sin(rad);

            // sol
            dashedLine(svg, Ax - 15, Ay, Bx + 15, Ay, "#3A4048", 1);

            // point de départ
            svg.appendChild(el("circle", { cx: Ax, cy: Ay, r: 5, fill: "#FFFFFF" }));

            // déplacement AB
            arrow(svg, Ax, Ay, Bx, By, "#A8FF78", 2.2);
            svg.appendChild(text(c.cx - 8, Ay + 18, "AB", { "font-size": 11, fill: "#A8FF78" }));

            // force F
            arrow(svg, Ax, Ay, Fx, Fy, c.color, 2.6);
            svg.appendChild(text(Fx + 6, Fy - 4, "F", { "font-size": 13, fill: c.color, "font-style": "italic", "font-weight": "700" }));

            // arc angle
            var arcR = 26;
            var arcEndX = Ax + arcR * Math.cos(rad);
            var arcEndY = Ay - arcR * Math.sin(rad);
            svg.appendChild(el("path", {
                d: "M " + (Ax + arcR) + " " + Ay + " A " + arcR + " " + arcR + " 0 0 0 " + arcEndX + " " + arcEndY,
                fill: "none", stroke: "#BB8FCE", "stroke-width": 1.2
            }));

            // labels bas
            svg.appendChild(text(c.cx, 225, c.label, { "text-anchor": "middle", "font-size": 13, fill: c.color, "font-weight": "700" }));
            svg.appendChild(text(c.cx, 240, c.sign, { "text-anchor": "middle", "font-size": 11, fill: "#CCCCCC" }));
            svg.appendChild(text(c.cx, 253, c.sub, { "text-anchor": "middle", "font-size": 9, fill: "#888888" }));
        });

        // séparateurs verticaux
        svg.appendChild(el("line", { x1: 155, y1: 60, x2: 155, y2: 200, stroke: "#2A2F36", "stroke-width": 1 }));
        svg.appendChild(el("line", { x1: 305, y1: 60, x2: 305, y2: 200, stroke: "#2A2F36", "stroke-width": 1 }));

        svg.appendChild(text(230, 24, "Signe du travail selon l'angle α = (F, AB)", {
            "text-anchor": "middle", "font-size": 11, fill: "#888888"
        }));
    }

    /* ============================================================
       FIGURE 2 : graphCurviligne
       Décomposition d'une trajectoire curviligne en segments élémentaires δl_i
       ============================================================ */
    function renderGraphCurviligne() {
        var svg = document.getElementById("graphCurviligne");
        if (!svg) return;
        clearSvg(svg);
        svg.setAttribute("viewBox", "0 0 460 260");

        // Trajectoire courbe de A à B (quadratique)
        var Ax = 60, Ay = 200;
        var Bx = 400, By = 90;
        var Cx = 230, Cy = 30; // point de contrôle

        svg.appendChild(el("path", {
            d: "M " + Ax + " " + Ay + " Q " + Cx + " " + Cy + " " + Bx + " " + By,
            fill: "none", stroke: "#4A5058", "stroke-width": 1.5, "stroke-dasharray": "3,3"
        }));

        // Fonction quadratique de Bézier pour obtenir des points le long de la courbe
        function bezierPoint(t) {
            var x = (1 - t) * (1 - t) * Ax + 2 * (1 - t) * t * Cx + t * t * Bx;
            var y = (1 - t) * (1 - t) * Ay + 2 * (1 - t) * t * Cy + t * t * By;
            return { x: x, y: y };
        }

        // Segments élémentaires δl_i le long de la courbe
        var n = 6;
        var prev = bezierPoint(0);
        for (var i = 1; i <= n; i++) {
            var t = i / n;
            var pt = bezierPoint(t);
            arrow(svg, prev.x, prev.y, pt.x, pt.y, "#A8FF78", 2);
            prev = pt;
        }
        svg.appendChild(text(bezierPoint(0.5).x + 10, bezierPoint(0.5).y - 6, "δl_i", {
            "font-size": 11, fill: "#A8FF78"
        }));

        // Force F appliquée sur un segment (au 4e segment)
        var seg = bezierPoint(4 / n);
        var fEnd = { x: seg.x + 55, y: seg.y - 45 };
        arrow(svg, seg.x, seg.y, fEnd.x, fEnd.y, "#F4D03F", 2.6);
        svg.appendChild(text(fEnd.x + 4, fEnd.y - 4, "F", { "font-size": 13, fill: "#F4D03F", "font-style": "italic", "font-weight": "700" }));

        // Points A et B
        svg.appendChild(el("circle", { cx: Ax, cy: Ay, r: 6, fill: "#4ECDC4" }));
        svg.appendChild(text(Ax - 8, Ay + 22, "A", { "font-size": 14, fill: "#FFFFFF", "font-weight": "700" }));
        svg.appendChild(el("circle", { cx: Bx, cy: By, r: 6, fill: "#FF6B6B" }));
        svg.appendChild(text(Bx + 10, By - 4, "B", { "font-size": 14, fill: "#FFFFFF", "font-weight": "700" }));

        // Déplacement total AB (en pointillé, pour comparaison)
        dashedLine(svg, Ax, Ay, Bx, By, "#6C7078", 1.3);
        svg.appendChild(text((Ax + Bx) / 2 - 10, (Ay + By) / 2 + 16, "AB", { "font-size": 10, fill: "#9AA0A6" }));

        svg.appendChild(text(230, 22, "Trajectoire curviligne décomposée en segments élémentaires", {
            "text-anchor": "middle", "font-size": 10.5, fill: "#888888"
        }));
    }

    function initAll() {
        renderGraphMoteur();
        renderGraphCurviligne();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initAll);
    } else {
        initAll();
    }
})();
