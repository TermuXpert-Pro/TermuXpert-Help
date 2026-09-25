/* ============================================================
   figuresvt_p5.js — Exercice 5 : Eau salée (NaCl)
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

    /* petite icône de molécule d'eau (cercle O + 2 cercles H) */
    function waterMolecule(g, cx, cy, scale) {
        scale = scale || 1;
        g.appendChild(el("circle", { cx: cx, cy: cy, r: 3.2 * scale, fill: "#8a94a6", "fill-opacity": "0.55" }));
        g.appendChild(el("circle", { cx: cx - 4 * scale, cy: cy + 2.5 * scale, r: 1.6 * scale, fill: "#8a94a6", "fill-opacity": "0.4" }));
        g.appendChild(el("circle", { cx: cx + 4 * scale, cy: cy + 2.5 * scale, r: 1.6 * scale, fill: "#8a94a6", "fill-opacity": "0.4" }));
    }

    /* ---------- Figure : dissolution / dissociation du sel dans l'eau ---------- */
    function drawDissociation(svg) {
        svg.setAttribute("viewBox", "0 0 380 220");
        svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
        svg.innerHTML = "";
        svg.appendChild(el("rect", { x: 0, y: 0, width: 380, height: 220, fill: "#0D1117", rx: 8 }));

        /* ---- Bloc gauche : cristal solide de NaCl (réseau ordonné) ---- */
        var leftCx = 85, leftCy = 100;
        var latticeGroup = el("g", {});
        svg.appendChild(el("rect", { x: leftCx - 60, y: leftCy - 55, width: 120, height: 110, rx: 8, fill: "#161B22", stroke: "#4ECDC4", "stroke-width": "1" }));
        var spacing = 26;
        for (var row = 0; row < 4; row++) {
            for (var col = 0; col < 4; col++) {
                var isNa = (row + col) % 2 === 0;
                var px = leftCx - 39 + col * spacing;
                var py = leftCy - 39 + row * spacing;
                latticeGroup.appendChild(el("circle", {
                    cx: px, cy: py, r: 7,
                    fill: isNa ? "#79B8E8" : "#4ECDC4",
                    "fill-opacity": "0.85"
                }));
            }
        }
        svg.appendChild(latticeGroup);
        svg.appendChild(text(leftCx, leftCy + 75, "NaCl (solide)", { "text-anchor": "middle", fill: "#F7DC6F", "font-size": "12", "font-weight": "700", "font-family": "sans-serif" }));

        /* ---- Flèche centrale ---- */
        var defs = el("defs", {});
        var marker = el("marker", { id: "p5-arrow", markerWidth: "9", markerHeight: "9", refX: "5", refY: "4.5", orient: "auto" });
        marker.appendChild(el("path", { d: "M0,1 L8,4.5 L0,8 Z", fill: "#BB8FCE" }));
        defs.appendChild(marker);
        svg.insertBefore(defs, svg.firstChild);

        svg.appendChild(el("line", { x1: 168, y1: 100, x2: 218, y2: 100, stroke: "#BB8FCE", "stroke-width": "2", "marker-end": "url(#p5-arrow)" }));
        svg.appendChild(text(193, 88, "dans l'eau", { "text-anchor": "middle", fill: "#BB8FCE", "font-size": "10.5", "font-family": "sans-serif" }));

        /* ---- Bloc droit : ions dispersés dans l'eau ---- */
        var rightX = 235, rightY = 45, rightW = 130, rightH = 110;
        svg.appendChild(el("rect", { x: rightX, y: rightY, width: rightW, height: rightH, rx: 8, fill: "#161B22", stroke: "#79B8E8", "stroke-width": "1" }));

        var waterGroup = el("g", {});
        var waterPositions = [
            [rightX + 15, rightY + 20], [rightX + 55, rightY + 15], [rightX + 100, rightY + 25],
            [rightX + 25, rightY + 55], [rightX + 75, rightY + 60], [rightX + 115, rightY + 70],
            [rightX + 45, rightY + 90], [rightX + 90, rightY + 95], [rightX + 15, rightY + 95]
        ];
        waterPositions.forEach(function (p) { waterMolecule(waterGroup, p[0], p[1], 0.9); });
        svg.appendChild(waterGroup);

        var ionGroup = el("g", {});
        var naPositions = [[rightX + 30, rightY + 35], [rightX + 95, rightY + 45], [rightX + 55, rightY + 80]];
        var clPositions = [[rightX + 65, rightY + 20], [rightX + 20, rightY + 70], [rightX + 105, rightY + 85]];

        naPositions.forEach(function (p) {
            ionGroup.appendChild(el("circle", { cx: p[0], cy: p[1], r: 7, fill: "#79B8E8" }));
            ionGroup.appendChild(text(p[0], p[1] + 3.5, "+", { "text-anchor": "middle", fill: "#0D1117", "font-size": "9", "font-weight": "700", "font-family": "sans-serif" }));
        });
        clPositions.forEach(function (p) {
            ionGroup.appendChild(el("circle", { cx: p[0], cy: p[1], r: 7, fill: "#4ECDC4" }));
            ionGroup.appendChild(text(p[0], p[1] + 3.5, "−", { "text-anchor": "middle", fill: "#0D1117", "font-size": "10", "font-weight": "700", "font-family": "sans-serif" }));
        });
        svg.appendChild(ionGroup);

        svg.appendChild(text(rightX + rightW / 2, rightY + rightH + 25, "Ions dispersés dans l'eau", { "text-anchor": "middle", fill: "#F7DC6F", "font-size": "12", "font-weight": "700", "font-family": "sans-serif" }));

        /* ---- Légende ---- */
        svg.appendChild(el("circle", { cx: 30, cy: 200, r: 5, fill: "#79B8E8" }));
        svg.appendChild(text(40, 204, "ion sodium", { fill: "#8a94a6", "font-size": "9.5", "font-family": "sans-serif" }));
        svg.appendChild(el("circle", { cx: 140, cy: 200, r: 5, fill: "#4ECDC4" }));
        svg.appendChild(text(150, 204, "ion chlorure", { fill: "#8a94a6", "font-size": "9.5", "font-family": "sans-serif" }));
        waterMolecule(svg, 262, 200, 0.9);
        svg.appendChild(text(272, 204, "molécule d'eau", { fill: "#8a94a6", "font-size": "9.5", "font-family": "sans-serif" }));
    }

    function init() {
        var svg = document.getElementById("fig-ex5-dissociation");
        if (svg) { drawDissociation(svg); }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();

