/* ============================================================
   figuresvt_p2.js — Partie 2 : Mesurer pour agir
   Fichier 100% autonome : aucune dépendance à svg-utils.js.
   ============================================================ */
(function () {
    "use strict";

    var SVGNS = "http://www.w3.org/2000/svg";

    function el(tag, attrs) {
        var e = document.createElementNS(SVGNS, tag);
        for (var k in attrs) {
            if (Object.prototype.hasOwnProperty.call(attrs, k)) {
                e.setAttribute(k, attrs[k]);
            }
        }
        return e;
    }

    function txt(x, y, str, attrs) {
        var base = { x: x, y: y, fill: "#C9D1D9", "font-family": "Cairo, sans-serif", "font-size": 12 };
        for (var k in attrs) { base[k] = attrs[k]; }
        var t = el("text", base);
        t.textContent = str;
        return t;
    }

    function setupSvg(svg, vbW, vbH, maxHeight) {
        while (svg.firstChild) { svg.removeChild(svg.firstChild); }
        svg.setAttribute("viewBox", "0 0 " + vbW + " " + vbH);
        svg.setAttribute("width", "100%");
        svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
        svg.style.display = "block";
        svg.style.margin = "0 auto";
        svg.style.maxHeight = (maxHeight || 260) + "px";
        svg.style.background = "#0D1117";
    }

    /* helper de rangée à échelle propre par ligne (défini uniquement dans ce fichier) */
    function drawRangeRow(svg, y, label, unit, lo, hi, value, axisLo, axisHi, x0, x1) {
        var scale = (x1 - x0) / (axisHi - axisLo);
        function xOf(v) { return x0 + (v - axisLo) * scale; }

        svg.appendChild(txt(x0, y - 26, label, { "font-size": 13, "font-weight": 700, fill: "#E8E8E8" }));
        svg.appendChild(el("line", { x1: x0, y1: y, x2: x1, y2: y, stroke: "#8B949E", "stroke-width": 2 }));

        var bandX = xOf(lo), bandW = xOf(hi) - xOf(lo);
        svg.appendChild(el("rect", { x: bandX, y: y - 6, width: bandW, height: 12, fill: "#4ECDC4", opacity: 0.35, rx: 3 }));
        svg.appendChild(txt(bandX, y + 22, String(lo), { "font-size": 10, fill: "#8B949E", "text-anchor": "middle" }));
        svg.appendChild(txt(bandX + bandW, y + 22, String(hi), { "font-size": 10, fill: "#8B949E", "text-anchor": "middle" }));
        svg.appendChild(txt(bandX + bandW / 2, y + 22, "normes", { "font-size": 9, fill: "#4ECDC4", "text-anchor": "middle" }));

        var inRange = value >= lo && value <= hi;
        var markerCol = inRange ? "#4ECDC4" : "#FF6B6B";
        var mx = Math.min(Math.max(xOf(value), x0), x1);
        svg.appendChild(el("circle", { cx: mx, cy: y, r: 6, fill: markerCol, stroke: "#0D1117", "stroke-width": 1.5 }));
        svg.appendChild(txt(mx, y - 12, value + (unit ? " " + unit : ""), { "font-size": 12, "font-weight": 700, fill: markerCol, "text-anchor": "middle", "font-family": "JetBrains Mono, monospace" }));

        if (!inRange && value > hi) {
            svg.appendChild(el("path", { d: "M " + (x1 + 4) + " " + (y - 5) + " L " + (x1 + 16) + " " + y + " L " + (x1 + 4) + " " + (y + 5) + " Z", fill: markerCol }));
            svg.appendChild(txt(x1 + 20, y + 4, "dépasse", { "font-size": 10, fill: markerCol }));
        }
    }

    /* graphSang : Urée (dans la norme) et Cholestérol (au-dessus de la norme) */
    function drawGraphSang() {
        var svg = document.getElementById("graphSang");
        if (!svg) { return; }
        var W = 600, H = 240;
        setupSvg(svg, W, H, 240);

        drawRangeRow(svg, 85, "Urée", "g/L", 0.70, 1.10, 0.86, 0.55, 1.25, 130, 480);
        drawRangeRow(svg, 185, "Cholestérol", "g/L", 1.50, 2.20, 2.72, 1.30, 3.00, 130, 480);
    }

    function init() {
        drawGraphSang();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
