/* ============================================================
   figuresvt_p2.js — Exercice 2 : Densité de l'éthanol / décantation
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

    /* ---------- Figure 1 : éprouvette vide / éprouvette + éthanol ---------- */
    function drawEprouvette(svg) {
        svg.setAttribute("viewBox", "0 0 340 210");
        svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
        svg.innerHTML = "";
        svg.appendChild(el("rect", { x: 0, y: 0, width: 340, height: 210, fill: "#0D1117", rx: 8 }));

        function cylinder(cx, filled, mass, label) {
            var w = 60, topY = 30, bottomY = 170;
            var x1 = cx - w / 2, x2 = cx + w / 2;

            /* graduations (traits) */
            var g = el("g", {});
            for (var i = 0; i <= 5; i++) {
                var gy = topY + i * (bottomY - topY) / 5;
                g.appendChild(el("line", { x1: x1, y1: gy, x2: x1 + 10, y2: gy, stroke: "#79B8E8", "stroke-width": "1", opacity: "0.6" }));
            }
            svg.appendChild(g);

            /* contour de l'éprouvette */
            svg.appendChild(el("path", {
                d: "M " + x1 + "," + topY + " L " + x1 + "," + bottomY + " Q " + x1 + "," + (bottomY + 12) + " " + cx + "," + (bottomY + 12) + " Q " + x2 + "," + (bottomY + 12) + " " + x2 + "," + bottomY + " L " + x2 + "," + topY,
                fill: "none", stroke: "#4ECDC4", "stroke-width": "2"
            }));

            if (filled) {
                var liquidTop = topY + (bottomY - topY) * 0.30; /* niveau 50 mL */
                svg.appendChild(el("path", {
                    d: "M " + (x1 + 1) + "," + liquidTop + " L " + (x1 + 1) + "," + bottomY + " Q " + (x1 + 1) + "," + (bottomY + 11) + " " + cx + "," + (bottomY + 11) + " Q " + (x2 - 1) + "," + (bottomY + 11) + " " + (x2 - 1) + "," + bottomY + " L " + (x2 - 1) + "," + liquidTop + " Z",
                    fill: "#F7DC6F", "fill-opacity": "0.35"
                }));
                svg.appendChild(el("line", { x1: x1, y1: liquidTop, x2: x2, y2: liquidTop, stroke: "#F4D03F", "stroke-width": "1.5" }));
                svg.appendChild(text(cx, liquidTop - 6, "50 mL", { "text-anchor": "middle", fill: "#F4D03F", "font-size": "10", "font-family": "sans-serif" }));
            }

            svg.appendChild(text(cx, topY - 10, label, { "text-anchor": "middle", fill: "#F7DC6F", "font-size": "11", "font-weight": "700", "font-family": "sans-serif" }));
            svg.appendChild(text(cx, bottomY + 34, mass, { "text-anchor": "middle", fill: "#79B8E8", "font-size": "12", "font-weight": "600", "font-family": "sans-serif" }));
        }

        cylinder(100, false, "m' = 53,8 g", "Éprouvette vide");
        cylinder(240, true, "m = 94,3 g", "Éprouvette + éthanol");

        /* flèche entre les deux */
        var defs = el("defs", {});
        var marker = el("marker", { id: "p2-arrow1", markerWidth: "8", markerHeight: "8", refX: "4", refY: "4", orient: "auto" });
        marker.appendChild(el("path", { d: "M0,1 L7,4 L0,7 Z", fill: "#BB8FCE" }));
        defs.appendChild(marker);
        svg.insertBefore(defs, svg.firstChild);

        svg.appendChild(el("line", { x1: 140, y1: 100, x2: 195, y2: 100, stroke: "#BB8FCE", "stroke-width": "1.5", "marker-end": "url(#p2-arrow1)" }));
        svg.appendChild(text(167, 92, "+ éthanol", { "text-anchor": "middle", fill: "#BB8FCE", "font-size": "9", "font-family": "sans-serif" }));
    }

    /* ---------- Figure 2 : ampoule à décanter (heptane / éthanol) ---------- */
    function drawAmpouleDecantation(svg) {
        svg.setAttribute("viewBox", "0 0 220 300");
        svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
        svg.innerHTML = "";
        svg.appendChild(el("rect", { x: 0, y: 0, width: 220, height: 300, fill: "#0D1117", rx: 8 }));

        var cx = 110;
        var neckTop = 20, neckBottom = 55, neckW = 18;
        var bodyTop = 55, bodyBottom = 190, bodyW = 90;
        var coneTip = 235;
        var stopcockY = 190;

        /* col de l'ampoule */
        svg.appendChild(el("rect", { x: cx - neckW / 2, y: neckTop, width: neckW, height: neckBottom - neckTop, fill: "none", stroke: "#79B8E8", "stroke-width": "2" }));
        /* bouchon */
        svg.appendChild(el("rect", { x: cx - neckW / 2 - 4, y: neckTop - 10, width: neckW + 8, height: 10, fill: "#79B8E8", "fill-opacity": "0.3", stroke: "#79B8E8", "stroke-width": "1.5", rx: "2" }));

        /* corps piriforme (via un chemin) */
        var pathD = "M " + (cx - neckW / 2) + "," + bodyTop +
            " C " + (cx - bodyW / 2) + "," + (bodyTop + 10) + " " + (cx - bodyW / 2) + "," + (bodyBottom - 40) + " " + (cx - bodyW / 2 + 8) + "," + bodyBottom +
            " L " + (cx - 6) + "," + (stopcockY + 12) +
            " L " + (cx + 6) + "," + (stopcockY + 12) +
            " L " + (cx + bodyW / 2 - 8) + "," + bodyBottom +
            " C " + (cx + bodyW / 2) + "," + (bodyBottom - 40) + " " + (cx + bodyW / 2) + "," + (bodyTop + 10) + " " + (cx + neckW / 2) + "," + bodyTop +
            " Z";
        svg.appendChild(el("path", { d: pathD, fill: "none", stroke: "#79B8E8", "stroke-width": "2", id: "p2-ampoule-outline" }));

        /* Deux phases liquides — clip via un second path légèrement plus étroit */
        var clipId = "p2-ampouleClip";
        var defs = el("defs", {});
        var clip = el("clipPath", { id: clipId });
        clip.appendChild(el("path", { d: pathD }));
        defs.appendChild(clip);
        svg.appendChild(defs);

        var interfaceY = (bodyTop + bodyBottom) / 2 - 5;

        var liquids = el("g", { "clip-path": "url(#" + clipId + ")" });
        /* Phase supérieure : heptane */
        liquids.appendChild(el("rect", { x: cx - bodyW / 2, y: bodyTop, width: bodyW, height: interfaceY - bodyTop, fill: "#F7DC6F", "fill-opacity": "0.30" }));
        /* Phase inférieure : éthanol */
        liquids.appendChild(el("rect", { x: cx - bodyW / 2, y: interfaceY, width: bodyW, height: coneTip - interfaceY, fill: "#79B8E8", "fill-opacity": "0.30" }));
        svg.appendChild(liquids);

        /* ligne d'interface */
        svg.appendChild(el("line", { x1: cx - bodyW / 2 + 4, y1: interfaceY, x2: cx + bodyW / 2 - 4, y2: interfaceY, stroke: "#F4D03F", "stroke-width": "1.5", "stroke-dasharray": "4,3" }));

        /* robinet */
        svg.appendChild(el("circle", { cx: cx, cy: stopcockY + 12, r: 5, fill: "#BB8FCE" }));

        /* étiquettes */
        svg.appendChild(text(cx, (bodyTop + interfaceY) / 2, "Heptane", { "text-anchor": "middle", fill: "#F4D03F", "font-size": "12", "font-weight": "700", "font-family": "sans-serif" }));
        svg.appendChild(text(cx, (bodyTop + interfaceY) / 2 + 16, "d = 0,68", { "text-anchor": "middle", fill: "#F4D03F", "font-size": "10", "font-family": "sans-serif" }));

        svg.appendChild(text(cx, (interfaceY + bodyBottom) / 2, "Éthanol", { "text-anchor": "middle", fill: "#79B8E8", "font-size": "12", "font-weight": "700", "font-family": "sans-serif" }));
        svg.appendChild(text(cx, (interfaceY + bodyBottom) / 2 + 16, "d = 0,81", { "text-anchor": "middle", fill: "#79B8E8", "font-size": "10", "font-family": "sans-serif" }));

        svg.appendChild(text(cx, 275, "Ampoule à décanter", { "text-anchor": "middle", fill: "#F7DC6F", "font-size": "11", "font-weight": "600", "font-family": "sans-serif" }));
    }

    function init() {
        var s1 = document.getElementById("fig-ex2-eprouvette");
        if (s1) { drawEprouvette(s1); }
        var s2 = document.getElementById("fig-ex2-decantation");
        if (s2) { drawAmpouleDecantation(s2); }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
