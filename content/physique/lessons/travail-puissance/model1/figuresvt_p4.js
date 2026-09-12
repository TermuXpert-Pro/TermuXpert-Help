/* ============================================================
   figuresvt_p4.js
   Figures SVG — Partie 4 : Puissance instantanée / Puissance en rotation
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
       FIGURE 1 : graphPuissance
       P = F · v · cos α  (force F et vitesse v du point d'application)
       ============================================================ */
    function renderGraphPuissance() {
        var svg = document.getElementById("graphPuissance");
        if (!svg) return;
        clearSvg(svg);
        svg.setAttribute("viewBox", "0 0 440 240");

        var Ax = 90, Ay = 170;
        var alphaDeg = 30;
        var alphaRad = alphaDeg * Math.PI / 180;
        var vLen = 130;
        var vEndX = Ax + vLen, vEndY = Ay;
        var Flen = 110;
        var Fx = Ax + Flen * Math.cos(alphaRad);
        var Fy = Ay - Flen * Math.sin(alphaRad);

        // trajectoire / sol
        dashedLine(svg, 40, Ay, 400, Ay, "#3A4048", 1);

        // point d'application (objet mobile)
        svg.appendChild(el("circle", { cx: Ax, cy: Ay, r: 7, fill: "#FFFFFF" }));
        svg.appendChild(text(Ax - 10, Ay + 26, "M", { "font-size": 13, fill: "#FFFFFF", "font-weight": "700" }));

        // vecteur vitesse v (horizontal)
        arrow(svg, Ax, Ay, vEndX, vEndY, "#A8FF78", 2.6);
        svg.appendChild(text((Ax + vEndX) / 2 - 6, Ay + 20, "v", { "font-size": 14, fill: "#A8FF78", "font-style": "italic", "font-weight": "700" }));

        // vecteur force F
        arrow(svg, Ax, Ay, Fx, Fy, "#F4D03F", 3);
        svg.appendChild(text(Fx + 8, Fy - 4, "F", { "font-size": 15, fill: "#F4D03F", "font-style": "italic", "font-weight": "700" }));

        // arc angle α
        var arcR = 40;
        var arcEndX = Ax + arcR * Math.cos(alphaRad);
        var arcEndY = Ay - arcR * Math.sin(alphaRad);
        svg.appendChild(el("path", {
            d: "M " + (Ax + arcR) + " " + Ay + " A " + arcR + " " + arcR + " 0 0 0 " + arcEndX + " " + arcEndY,
            fill: "none", stroke: "#BB8FCE", "stroke-width": 1.5
        }));
        svg.appendChild(text(Ax + 50, Ay - 16, "α", { "font-size": 14, fill: "#BB8FCE", "font-style": "italic" }));

        svg.appendChild(text(220, 26, "Puissance instantanée : P = F · v · cos α", {
            "text-anchor": "middle", "font-size": 11.5, fill: "#888888"
        }));
    }

    /* ============================================================
       FIGURE 2 : graphRotationPuissance
       Solide en rotation autour d'un axe Δ, force F orthogonale à l'axe, à la distance R
       P = M_Δ(F) · ω
       ============================================================ */
    function renderGraphRotationPuissance() {
        var svg = document.getElementById("graphRotationPuissance");
        if (!svg) return;
        clearSvg(svg);
        svg.setAttribute("viewBox", "0 0 440 260");

        var cx = 220, cy = 140, R = 80;

        // Disque en rotation
        svg.appendChild(el("circle", { cx: cx, cy: cy, r: R, fill: "none", stroke: "#4ECDC4", "stroke-width": 2 }));

        // Axe de rotation Δ (perpendiculaire au plan, représenté par un point + croix)
        svg.appendChild(el("circle", { cx: cx, cy: cy, r: 4, fill: "#FFFFFF" }));
        svg.appendChild(text(cx + 10, cy - 8, "Δ", { "font-size": 14, fill: "#FFFFFF", "font-style": "italic" }));

        // Rayon R jusqu'au point d'application (à 25° au-dessus de l'horizontale droite)
        var pointAngle = -25 * Math.PI / 180;
        var Px = cx + R * Math.cos(pointAngle);
        var Py = cy + R * Math.sin(pointAngle);
        dashedLine(svg, cx, cy, Px, Py, "#F4D03F", 1.3);
        svg.appendChild(text((cx + Px) / 2 - 4, (cy + Py) / 2 - 8, "R", { "font-size": 12, fill: "#F4D03F" }));

        // Point d'application M
        svg.appendChild(el("circle", { cx: Px, cy: Py, r: 5, fill: "#FF6B6B" }));
        svg.appendChild(text(Px + 8, Py - 6, "M", { "font-size": 12, fill: "#FFFFFF", "font-weight": "700" }));

        // Force F, orthogonale au rayon (tangente), orientée dans le sens de rotation
        var tangentAngle = pointAngle + Math.PI / 2;
        var Fend = { x: Px + 65 * Math.cos(tangentAngle), y: Py + 65 * Math.sin(tangentAngle) };
        arrow(svg, Px, Py, Fend.x, Fend.y, "#FF6B6B", 2.8);
        svg.appendChild(text(Fend.x + 6, Fend.y + 4, "F", { "font-size": 14, fill: "#FF6B6B", "font-style": "italic", "font-weight": "700" }));

        // Vitesse v (tangente, même direction que F, sur la trajectoire circulaire)
        svg.appendChild(text(Px + 8 * Math.cos(tangentAngle) - 30, Py + 8 * Math.sin(tangentAngle) + 22, "v = R·ω", {
            "font-size": 10, fill: "#A8FF78"
        }));

        // Flèche circulaire indiquant le sens de rotation ω
        var arcStart = -100 * Math.PI / 180;
        var arcEnd = -10 * Math.PI / 180;
        var rArc = R + 22;
        var sx = cx + rArc * Math.cos(arcStart);
        var sy = cy + rArc * Math.sin(arcStart);
        var ex = cx + rArc * Math.cos(arcEnd);
        var ey = cy + rArc * Math.sin(arcEnd);
        svg.appendChild(el("path", {
            d: "M " + sx + " " + sy + " A " + rArc + " " + rArc + " 0 0 1 " + ex + " " + ey,
            fill: "none", stroke: "#BB8FCE", "stroke-width": 2
        }));
        // tête de flèche pour l'arc (approx tangente à l'arc en ex,ey)
        var tang = arcEnd + Math.PI / 2;
        svg.appendChild(el("polygon", {
            points: ex + "," + ey + " " +
                (ex - 9 * Math.cos(tang - 0.5)) + "," + (ey - 9 * Math.sin(tang - 0.5)) + " " +
                (ex - 9 * Math.cos(tang + 0.5)) + "," + (ey - 9 * Math.sin(tang + 0.5)),
            fill: "#BB8FCE"
        }));
        svg.appendChild(text(cx + 6, cy - R - 30, "ω", { "font-size": 14, fill: "#BB8FCE", "font-style": "italic" }));

        // Axe Δ label bas
        svg.appendChild(text(cx, 20, "Solide en rotation autour de l'axe Δ", {
            "text-anchor": "middle", "font-size": 11, fill: "#888888"
        }));
        svg.appendChild(text(cx, 250, "P = M_Δ(F) · ω     avec     M_Δ(F) = F · R", {
            "text-anchor": "middle", "font-size": 10.5, fill: "#888888"
        }));
    }

    function initAll() {
        renderGraphPuissance();
        renderGraphRotationPuissance();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initAll);
    } else {
        initAll();
    }
})();
