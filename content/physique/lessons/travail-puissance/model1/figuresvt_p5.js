/* ============================================================
   figuresvt_p5.js
   Figures SVG — Partie 5 : Couple de forces / Moment d'un couple
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
       FIGURE 1 : graphCouple
       Couple de forces : F1 et F2 parallèles, sens opposés, même intensité
       ============================================================ */
    function renderGraphCouple() {
        var svg = document.getElementById("graphCouple");
        if (!svg) return;
        clearSvg(svg);
        svg.setAttribute("viewBox", "0 0 440 260");

        var x1 = 140, x2 = 300;
        var yTop = 60, yBot = 190;

        // Droites d'action (verticales, pointillées)
        dashedLine(svg, x1, 30, x1, 230, "#3A4048", 1);
        dashedLine(svg, x2, 30, x2, 230, "#3A4048", 1);

        // Barre reliant les deux points d'application (le solide)
        svg.appendChild(el("line", { x1: x1, y1: (yTop + yBot) / 2, x2: x2, y2: (yTop + yBot) / 2, stroke: "#5A6068", "stroke-width": 5, "stroke-linecap": "round" }));
        svg.appendChild(el("circle", { cx: x1, cy: (yTop + yBot) / 2, r: 5, fill: "#FFFFFF" }));
        svg.appendChild(el("circle", { cx: x2, cy: (yTop + yBot) / 2, r: 5, fill: "#FFFFFF" }));

        var midY = (yTop + yBot) / 2;

        // Force F1 vers le haut en x1
        arrow(svg, x1, midY, x1, yTop, "#4ECDC4", 3);
        svg.appendChild(text(x1 - 22, yTop + 4, "F1", { "font-size": 14, fill: "#4ECDC4", "font-style": "italic", "font-weight": "700" }));

        // Force F2 vers le bas en x2 (opposée)
        arrow(svg, x2, midY, x2, yBot, "#FF6B6B", 3);
        svg.appendChild(text(x2 + 10, yBot - 4, "F2", { "font-size": 14, fill: "#FF6B6B", "font-style": "italic", "font-weight": "700" }));

        // Distance d entre les droites d'action
        var dy = 30;
        svg.appendChild(el("line", { x1: x1, y1: dy, x2: x2, y2: dy, stroke: "#F4D03F", "stroke-width": 1.3 }));
        svg.appendChild(el("line", { x1: x1, y1: dy - 5, x2: x1, y2: dy + 5, stroke: "#F4D03F", "stroke-width": 1.3 }));
        svg.appendChild(el("line", { x1: x2, y1: dy - 5, x2: x2, y2: dy + 5, stroke: "#F4D03F", "stroke-width": 1.3 }));
        svg.appendChild(text((x1 + x2) / 2 - 6, dy - 8, "d", { "font-size": 13, fill: "#F4D03F", "font-style": "italic" }));

        // Flèche circulaire indiquant la rotation induite
        var rArc = 26, cxr = (x1 + x2) / 2, cyr = midY;
        svg.appendChild(el("path", {
            d: "M " + (cxr - rArc) + " " + cyr + " A " + rArc + " " + rArc + " 0 1 1 " + (cxr + rArc) + " " + cyr,
            fill: "none", stroke: "#BB8FCE", "stroke-width": 1.6
        }));
        svg.appendChild(el("polygon", {
            points: (cxr + rArc) + "," + cyr + " " + (cxr + rArc - 8) + "," + (cyr - 7) + " " + (cxr + rArc + 3) + "," + (cyr - 9),
            fill: "#BB8FCE"
        }));

        svg.appendChild(text(220, 22, "Couple de forces : F1 = F2 = F, droites d'action parallèles", {
            "text-anchor": "middle", "font-size": 10.5, fill: "#888888"
        }));
        svg.appendChild(text(220, 246, "Résultante nulle → rotation sans translation", {
            "text-anchor": "middle", "font-size": 10, fill: "#888888"
        }));
    }

    /* ============================================================
       FIGURE 2 : graphMoment
       Moment d'un couple : Mc = F · d, illustré par un volant (steering wheel)
       ============================================================ */
    function renderGraphMoment() {
        var svg = document.getElementById("graphMoment");
        if (!svg) return;
        clearSvg(svg);
        svg.setAttribute("viewBox", "0 0 440 240");

        var cx = 220, cy = 120, R = 75;

        // Volant (cercle)
        svg.appendChild(el("circle", { cx: cx, cy: cy, r: R, fill: "none", stroke: "#5A6068", "stroke-width": 6 }));
        svg.appendChild(el("circle", { cx: cx, cy: cy, r: 5, fill: "#FFFFFF" }));
        svg.appendChild(text(cx + 10, cy - 8, "axe", { "font-size": 9, fill: "#9AA0A6" }));

        // Points d'application diamétralement opposés (haut / bas)
        var P1 = { x: cx, y: cy - R };
        var P2 = { x: cx, y: cy + R };

        // F au point haut, tangente (horizontale, vers la droite)
        arrow(svg, P1.x, P1.y, P1.x + 70, P1.y, "#4ECDC4", 3);
        svg.appendChild(text(P1.x + 76, P1.y + 4, "F", { "font-size": 14, fill: "#4ECDC4", "font-style": "italic", "font-weight": "700" }));

        // F au point bas, tangente opposée (vers la gauche)
        arrow(svg, P2.x, P2.y, P2.x - 70, P2.y, "#FF6B6B", 3);
        svg.appendChild(text(P2.x - 90, P2.y + 4, "F", { "font-size": 14, fill: "#FF6B6B", "font-style": "italic", "font-weight": "700" }));

        // Distance d = diamètre (droites d'action horizontales en pointillé)
        dashedLine(svg, P1.x - 100, P1.y, P1.x, P1.y, "#3A4048", 1);
        dashedLine(svg, P2.x, P2.y, P2.x + 100, P2.y, "#3A4048", 1);
        svg.appendChild(el("line", { x1: 70, y1: P1.y, x2: 70, y2: P2.y, stroke: "#F4D03F", "stroke-width": 1.3 }));
        svg.appendChild(el("line", { x1: 65, y1: P1.y, x2: 75, y2: P1.y, stroke: "#F4D03F", "stroke-width": 1.3 }));
        svg.appendChild(el("line", { x1: 65, y1: P2.y, x2: 75, y2: P2.y, stroke: "#F4D03F", "stroke-width": 1.3 }));
        svg.appendChild(text(30, cy + 4, "d", { "font-size": 13, fill: "#F4D03F", "font-style": "italic" }));

        // Flèche circulaire de rotation
        var rArc = R + 20;
        var a1 = -100 * Math.PI / 180, a2 = 60 * Math.PI / 180;
        var sx = cx + rArc * Math.cos(a1), sy = cy + rArc * Math.sin(a1);
        var ex = cx + rArc * Math.cos(a2), ey = cy + rArc * Math.sin(a2);
        svg.appendChild(el("path", {
            d: "M " + sx + " " + sy + " A " + rArc + " " + rArc + " 0 1 1 " + ex + " " + ey,
            fill: "none", stroke: "#BB8FCE", "stroke-width": 1.8
        }));
        var tang = a2 + Math.PI / 2;
        svg.appendChild(el("polygon", {
            points: ex + "," + ey + " " +
                (ex - 9 * Math.cos(tang - 0.5)) + "," + (ey - 9 * Math.sin(tang - 0.5)) + " " +
                (ex - 9 * Math.cos(tang + 0.5)) + "," + (ey - 9 * Math.sin(tang + 0.5)),
            fill: "#BB8FCE"
        }));

        svg.appendChild(text(cx, 20, "Moment d'un couple : Mc = ± F · d", {
            "text-anchor": "middle", "font-size": 12, fill: "#888888"
        }));
    }

    function initAll() {
        renderGraphCouple();
        renderGraphMoment();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initAll);
    } else {
        initAll();
    }
})();
