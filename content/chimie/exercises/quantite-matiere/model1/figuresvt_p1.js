/* ============================================================
   figuresvt_p1.js — Exercice 1 : Cube de fer (densité / n)
   Fichier 100% autonome — aucune dépendance externe.
   ============================================================ */
(function () {
    "use strict";

    var SVG_NS = "http://www.w3.org/2000/svg";

    /* ---------- Helper local (dupliqué volontairement, non partagé) ---------- */
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

    /* ---------- Figure : cube de fer isométrique coté a = 20 cm ---------- */
    function drawCubeDeFer(svg) {
        svg.setAttribute("viewBox", "0 0 400 260");
        svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
        svg.innerHTML = "";

        var bg = el("rect", { x: 0, y: 0, width: 400, height: 260, fill: "#0D1117", rx: 8 });
        svg.appendChild(bg);

        /* Sommets du cube (projection isométrique) */
        var FBL = [100, 200], FBR = [230, 200], FTR = [230, 70], FTL = [100, 70];
        var dx = 45, dy = -32;
        var TBL = [FTL[0] + dx, FTL[1] + dy];
        var TBR = [FTR[0] + dx, FTR[1] + dy];
        var BBR = [FBR[0] + dx, FBR[1] + dy];

        function pts(arr) { return arr.map(function (p) { return p.join(","); }).join(" "); }

        /* Face droite (plus sombre) */
        svg.appendChild(el("polygon", {
            points: pts([FBR, FTR, TBR, BBR]),
            fill: "#4ECDC4", "fill-opacity": "0.22", stroke: "#4ECDC4", "stroke-width": "1.5"
        }));
        /* Face du dessus (éclairée) */
        svg.appendChild(el("polygon", {
            points: pts([FTL, FTR, TBR, TBL]),
            fill: "#F4D03F", "fill-opacity": "0.28", stroke: "#F4D03F", "stroke-width": "1.5"
        }));
        /* Face avant */
        svg.appendChild(el("polygon", {
            points: pts([FBL, FBR, FTR, FTL]),
            fill: "#4ECDC4", "fill-opacity": "0.14", stroke: "#4ECDC4", "stroke-width": "2"
        }));

        /* Arêtes cachées (pointillé) */
        svg.appendChild(el("line", { x1: TBL[0], y1: TBL[1], x2: FTL[0], y2: FTL[1], stroke: "#4ECDC4", "stroke-width": "1", "stroke-dasharray": "3,3", opacity: "0.5" }));

        /* Étiquette "Fer" sur la face avant */
        svg.appendChild(text((FBL[0] + FTR[0]) / 2, (FBL[1] + FTR[1]) / 2, "Fe", {
            "text-anchor": "middle", fill: "#F4D03F", "font-size": "22", "font-weight": "700", "font-family": "sans-serif"
        }));
        svg.appendChild(text((FBL[0] + FTR[0]) / 2, (FBL[1] + FTR[1]) / 2 + 20, "d = 7,8", {
            "text-anchor": "middle", fill: "#79B8E8", "font-size": "12", "font-family": "sans-serif"
        }));

        /* Cotation de l'arête a (bord bas avant) */
        var dimY = FBL[1] + 30;
        svg.appendChild(el("line", { x1: FBL[0], y1: FBL[1], x2: FBL[0], y2: dimY, stroke: "#BB8FCE", "stroke-width": "1", opacity: "0.6" }));
        svg.appendChild(el("line", { x1: FBR[0], y1: FBR[1], x2: FBR[0], y2: dimY, stroke: "#BB8FCE", "stroke-width": "1", opacity: "0.6" }));
        svg.appendChild(el("line", { x1: FBL[0], y1: dimY, x2: FBR[0], y2: dimY, stroke: "#BB8FCE", "stroke-width": "1.5", "marker-start": "url(#p1-arrowStart)", "marker-end": "url(#p1-arrowEnd)" }));

        /* Marqueurs de flèches */
        var defs = el("defs", {});
        var mkArrow = function (id, orient) {
            var marker = el("marker", { id: id, markerWidth: "8", markerHeight: "8", refX: "4", refY: "4", orient: orient });
            marker.appendChild(el("path", { d: "M0,1 L7,4 L0,7 Z", fill: "#BB8FCE" }));
            return marker;
        };
        defs.appendChild(mkArrow("p1-arrowStart", "auto-start-reverse"));
        defs.appendChild(mkArrow("p1-arrowEnd", "auto"));
        svg.insertBefore(defs, svg.firstChild);

        svg.appendChild(text((FBL[0] + FBR[0]) / 2, dimY + 20, "a = 20 cm", {
            "text-anchor": "middle", fill: "#BB8FCE", "font-size": "13", "font-weight": "600", "font-family": "sans-serif"
        }));

        /* Titre */
        svg.appendChild(text(200, 25, "Cube de fer", {
            "text-anchor": "middle", fill: "#F7DC6F", "font-size": "14", "font-weight": "700", "font-family": "sans-serif"
        }));
    }

    function init() {
        var svg1 = document.getElementById("fig-ex1-cube");
        if (svg1) { drawCubeDeFer(svg1); }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();

