/* ============================================================
   figuresvt_p1.js
   Figures SVG — Partie 1 : Notion de force / Travail d'une force constante
   Fichier 100% autonome (aucune dépendance externe).
   ============================================================ */
(function () {
    "use strict";

    var SVG_NS = "http://www.w3.org/2000/svg";

    /* ---------- Helpers internes (locaux à ce fichier) ---------- */

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

    // Dessine une flèche pleine (ligne + tête triangulaire) de (x1,y1) vers (x2,y2)
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
       FIGURE 1 : graphForce
       Illustration : "Le poids d'un corps solide est une force constante"
       ============================================================ */
    function renderGraphForce() {
        var svg = document.getElementById("graphForce");
        if (!svg) return;
        clearSvg(svg);
        svg.setAttribute("viewBox", "0 0 380 220");

        // Ligne verticale de référence (direction fixe)
        dashedLine(svg, 190, 8, 190, 212, "#3A4048", 1);
        svg.appendChild(text(196, 20, "verticale", { "font-size": 9, fill: "#666E76" }));

        // Corps solide (bloc rectangulaire)
        svg.appendChild(el("rect", {
            x: 150, y: 38, width: 80, height: 46, rx: 8,
            fill: "#4ECDC4", opacity: 0.9
        }));
        svg.appendChild(text(190, 66, "Corps", {
            "text-anchor": "middle", fill: "#0D1117", "font-size": 12, "font-weight": "700"
        }));
        svg.appendChild(text(190, 22, "Corps solide (masse m)", {
            "text-anchor": "middle", "font-size": 11, fill: "#E6E6E6"
        }));

        // Centre d'inertie G
        svg.appendChild(el("circle", { cx: 190, cy: 84, r: 3.5, fill: "#0D1117" }));
        svg.appendChild(text(200, 88, "G", { "font-size": 11, fill: "#FFFFFF" }));

        // Flèche du poids P (vers le bas, direction/sens/valeur fixes)
        arrow(svg, 190, 84, 190, 175, "#FF6B6B", 3);
        svg.appendChild(text(204, 150, "P", {
            "font-size": 16, fill: "#FF6B6B", "font-weight": "700", "font-style": "italic"
        }));

        // Repère indiquant la constance (petit encart)
        svg.appendChild(el("rect", { x: 12, y: 12, width: 118, height: 40, rx: 5, fill: "#161B22", stroke: "#2A2F36" }));
        svg.appendChild(text(20, 27, "Valeur : constante", { "font-size": 9, fill: "#4ECDC4" }));
        svg.appendChild(text(20, 40, "Direction/sens : fixes", { "font-size": 9, fill: "#4ECDC4" }));

        // Légende bas
        svg.appendChild(text(190, 205, "Le poids : force constante (valeur, direction, sens)", {
            "text-anchor": "middle", "font-size": 10, fill: "#888888"
        }));
    }

    /* ============================================================
       FIGURE 2 : graphTravail
       Illustration : W(A→B)(F) = F · AB · cos α
       ============================================================ */
    function renderGraphTravail() {
        var svg = document.getElementById("graphTravail");
        if (!svg) return;
        clearSvg(svg);
        svg.setAttribute("viewBox", "0 0 440 240");

        var Ax = 80, Ay = 180;
        var Bx = 340, By = 180;
        var alphaDeg = 40;
        var alphaRad = alphaDeg * Math.PI / 180;
        var Flen = 120;
        var Fx = Ax + Flen * Math.cos(alphaRad);
        var Fy = Ay - Flen * Math.sin(alphaRad);

        // Sol (support du déplacement), en pointillés
        dashedLine(svg, 40, Ay, 400, Ay, "#3A4048", 1);

        // Objet ponctuel en A
        svg.appendChild(el("circle", { cx: Ax, cy: Ay, r: 6, fill: "#FFFFFF" }));
        svg.appendChild(text(Ax - 8, Ay + 24, "A", { "font-size": 14, fill: "#FFFFFF", "font-weight": "700" }));

        // Position finale en B
        svg.appendChild(el("circle", { cx: Bx, cy: By, r: 6, fill: "none", stroke: "#FFFFFF", "stroke-width": 1.5 }));
        svg.appendChild(text(Bx + 10, By + 24, "B", { "font-size": 14, fill: "#FFFFFF", "font-weight": "700" }));

        // Vecteur déplacement AB (vert)
        arrow(svg, Ax, Ay, Bx, By, "#A8FF78", 2.5);
        svg.appendChild(text((Ax + Bx) / 2 - 12, Ay + 20, "AB", { "font-size": 13, fill: "#A8FF78", "font-weight": "700" }));

        // Vecteur force F (jaune), appliqué en A
        arrow(svg, Ax, Ay, Fx, Fy, "#F4D03F", 3);
        svg.appendChild(text(Fx + 8, Fy - 4, "F", { "font-size": 16, fill: "#F4D03F", "font-weight": "700", "font-style": "italic" }));

        // Arc de l'angle α en A
        var arcR = 38;
        var largeArc = 0;
        var arcStartX = Ax + arcR;
        var arcStartY = Ay;
        var arcEndX = Ax + arcR * Math.cos(alphaRad);
        var arcEndY = Ay - arcR * Math.sin(alphaRad);
        svg.appendChild(el("path", {
            d: "M " + arcStartX + " " + arcStartY + " A " + arcR + " " + arcR + " 0 " + largeArc + " 0 " + arcEndX + " " + arcEndY,
            fill: "none", stroke: "#BB8FCE", "stroke-width": 1.5
        }));
        svg.appendChild(text(Ax + 48, Ay - 16, "α", { "font-size": 14, fill: "#BB8FCE", "font-style": "italic" }));

        // Formule rappel
        svg.appendChild(text(220, 30, "W(A→B) = F · AB · cos α", {
            "text-anchor": "middle", "font-size": 12, fill: "#888888"
        }));
    }

    /* ---------- Initialisation ---------- */
    function initAll() {
        renderGraphForce();
        renderGraphTravail();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initAll);
    } else {
        initAll();
    }
})();
