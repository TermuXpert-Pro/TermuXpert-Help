/* ============================================================
   figuresvt_p4.js — Exercice 4 : Boisson énergétique (dissolution)
   Fichier 100% autonome — aucune dépendance externe.
   ============================================================ */
(function () {
    "use strict";

    var SVG_NS = "http://www.w3.org/2000/svg";

    function el(tag, attrs) {
        var node = document.createElementNS(SVG_NS, tag);
        if (attrs) {
            for (var key in attrs) {
                if (Object.prototype.hasOwnProperty.call(attrs, key)) {
                    node.setAttribute(key, attrs[key]);
                }
            }
        }
        return node;
    }

    function text(x, y, str, attrs) {
        var t = el("text", Object.assign({ x: x, y: y }, attrs || {}));
        t.textContent = str;
        return t;
    }

    /* ---------- Figure : dissolution de la poudre dans la fiole jaugée ---------- */
    function drawDissolution(svg) {
        svg.setAttribute("viewBox", "0 0 380 260");
        svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
        svg.innerHTML = "";
        svg.appendChild(el("rect", { x: 0, y: 0, width: 380, height: 260, fill: "#0D1117", rx: 8 }));

        var cx = 250;
        var neckTop = 28, neckBottom = 78, neckW = 20;
        var bulbTop = 78, bulbBottom = 215, bulbW = 130;

        /* Chemin de la fiole jaugée (col fin + ballon rond) */
        var pathD = "M " + (cx - neckW / 2) + "," + neckTop +
            " L " + (cx - neckW / 2) + "," + bulbTop +
            " C " + (cx - bulbW / 2) + "," + (bulbTop + 6) + " " + (cx - bulbW / 2) + "," + (bulbBottom - 40) + " " + cx + "," + bulbBottom +
            " C " + (cx + bulbW / 2) + "," + (bulbBottom - 40) + " " + (cx + bulbW / 2) + "," + (bulbTop + 6) + " " + (cx + neckW / 2) + "," + bulbTop +
            " L " + (cx + neckW / 2) + "," + neckTop;

        var defs = el("defs", {});
        var clip = el("clipPath", { id: "p4-flaskClip" });
        clip.appendChild(el("path", { d: pathD + " Z" }));
        defs.appendChild(clip);
        svg.appendChild(defs);

        /* Eau à l'intérieur (jusqu'au trait de jauge) */
        var jaugeY = 62;
        var water = el("g", { "clip-path": "url(#p4-flaskClip)" });
        water.appendChild(el("rect", { x: cx - bulbW / 2, y: jaugeY, width: bulbW, height: bulbBottom - jaugeY + 5, fill: "#79B8E8", "fill-opacity": "0.28" }));
        svg.appendChild(water);

        /* Contour de la fiole */
        svg.appendChild(el("path", { d: pathD, fill: "none", stroke: "#4ECDC4", "stroke-width": "2" }));

        /* Trait de jauge */
        svg.appendChild(el("line", { x1: cx - neckW / 2 - 2, y1: jaugeY, x2: cx + neckW / 2 + 2, y2: jaugeY, stroke: "#F4D03F", "stroke-width": "2" }));
        svg.appendChild(text(cx + neckW / 2 + 10, jaugeY + 4, "V = 5,0 L", { "text-anchor": "start", fill: "#F4D03F", "font-size": "12", "font-weight": "700", "font-family": "sans-serif" }));

        /* Poudre qui tombe dans le col (petits granules dorés) */
        var powderPositions = [[cx - 4, neckTop - 22], [cx + 3, neckTop - 12], [cx - 2, neckTop - 2], [cx + 5, neckTop + 8]];
        powderPositions.forEach(function (p) {
            svg.appendChild(el("circle", { cx: p[0], cy: p[1], r: 2.3, fill: "#F4D03F" }));
        });
        svg.appendChild(text(cx, neckTop - 32, "790 g de poudre", { "text-anchor": "middle", fill: "#F7DC6F", "font-size": "12", "font-weight": "700", "font-family": "sans-serif" }));

        /* Flèche vers le bas (dissolution) */
        var arrow = el("marker", { id: "p4-arrowDown", markerWidth: "8", markerHeight: "8", refX: "4", refY: "4", orient: "auto" });
        arrow.appendChild(el("path", { d: "M0,1 L7,4 L0,7 Z", fill: "#BB8FCE" }));
        defs.appendChild(arrow);

        /* Étiquette contenu vitaminique */
        var boxX = 20, boxY = 90, boxW = 165, boxH = 90;
        svg.appendChild(el("rect", { x: boxX, y: boxY, width: boxW, height: boxH, rx: 6, fill: "#161B22", stroke: "#BB8FCE", "stroke-width": "1" }));
        svg.appendChild(text(boxX + boxW / 2, boxY + 20, "Étiquette (100 g)", { "text-anchor": "middle", fill: "#BB8FCE", "font-size": "11", "font-weight": "700", "font-family": "sans-serif" }));
        svg.appendChild(text(boxX + boxW / 2, boxY + 42, "Vit. C : 47,5 mg", { "text-anchor": "middle", fill: "#4ECDC4", "font-size": "11", "font-family": "sans-serif" }));
        svg.appendChild(text(boxX + boxW / 2, boxY + 62, "Vit. B1 : 0,95 mg", { "text-anchor": "middle", fill: "#F4D03F", "font-size": "11", "font-family": "sans-serif" }));
        svg.appendChild(text(boxX + boxW / 2, boxY + 82, "→ dans 790 g de poudre", { "text-anchor": "middle", fill: "var(--text-muted, #8a94a6)", "font-size": "9.5", "font-family": "sans-serif" }));

        /* Flèche entre étiquette et fiole */
        svg.appendChild(el("line", { x1: boxX + boxW + 8, y1: boxY + boxH / 2, x2: cx - bulbW / 2 - 12, y2: boxY + boxH / 2, stroke: "#BB8FCE", "stroke-width": "1.5", "marker-end": "url(#p4-arrowDown)", "stroke-dasharray": "4,3" }));

        svg.appendChild(text(cx, 240, "Dissolution dans l'eau (fiole jaugée)", { "text-anchor": "middle", fill: "#F7DC6F", "font-size": "11", "font-weight": "600", "font-family": "sans-serif" }));
    }

    function init() {
        var svg = document.getElementById("fig-ex4-dissolution");
        if (svg) { drawDissolution(svg); }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();

