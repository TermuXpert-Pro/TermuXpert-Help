/* ============================================================
   figuresvt_p1.js — Partie 1 : Mesurer pour informer / surveiller
   Fichier 100% autonome : aucune dépendance à svg-utils.js.
   Toutes les fonctions utilitaires nécessaires sont définies ici.
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
        svg.style.maxHeight = (maxHeight || 360) + "px";
        svg.style.background = "#0D1117";
    }

    /* ---------- 1) graphMineraux : comparaison cations A vs B ---------- */
    function drawGraphMineraux() {
        var svg = document.getElementById("graphMineraux");
        if (!svg) { return; }
        var W = 620, H = 380;
        setupSvg(svg, W, H, 360);

        var data = [
            { name: "Calcium", ion: "Ca²⁺", A: 89.2, B: 98.9 },
            { name: "Magnésium", ion: "Mg²⁺", A: 4.1, B: 8.6 },
            { name: "Sodium", ion: "Na⁺", A: 17.5, B: 17.5 },
            { name: "Potassium", ion: "K⁺", A: 3.3, B: 2.9 }
        ];
        var colA = "#4ECDC4", colB = "#FF6B6B";

        svg.appendChild(el("rect", { x: 160, y: 12, width: 14, height: 14, fill: colA, rx: 2 }));
        svg.appendChild(txt(180, 23, "Étiquette A", { "font-size": 13, "font-weight": 700 }));
        svg.appendChild(el("rect", { x: 320, y: 12, width: 14, height: 14, fill: colB, rx: 2 }));
        svg.appendChild(txt(340, 23, "Étiquette B", { "font-size": 13, "font-weight": 700 }));

        var top = 55, rowH = 80, labelW = 130, barX = labelW + 20, maxBarW = W - barX - 70;

        data.forEach(function (d, i) {
            var y = top + i * rowH;
            svg.appendChild(txt(10, y + 14, d.name, { "font-size": 14, "font-weight": 700, fill: "#E8E8E8" }));
            svg.appendChild(txt(10, y + 30, "(" + d.ion + ")", { "font-size": 11, fill: "#8B949E", "font-family": "JetBrains Mono, monospace" }));

            var rowMax = Math.max(d.A, d.B) * 1.15;
            var scale = maxBarW / rowMax;
            var wA = d.A * scale, wB = d.B * scale;

            svg.appendChild(el("rect", { x: barX, y: y, width: wA, height: 22, fill: colA, rx: 4 }));
            svg.appendChild(txt(barX + wA + 8, y + 16, d.A + " mg/L", { "font-size": 12, "font-family": "JetBrains Mono, monospace" }));

            svg.appendChild(el("rect", { x: barX, y: y + 30, width: wB, height: 22, fill: colB, rx: 4 }));
            svg.appendChild(txt(barX + wB + 8, y + 46, d.B + " mg/L", { "font-size": 12, "font-family": "JetBrains Mono, monospace" }));
        });
    }

    /* ---------- 2) graphDensite : même volume V, masses différentes ---------- */
    function drawGraphDensite() {
        var svg = document.getElementById("graphDensite");
        if (!svg) { return; }
        var W = 560, H = 330;
        setupSvg(svg, W, H, 330);

        var cylW = 90, cylH = 170, topY = 30;
        var x1 = 110, x2 = 360;
        var liquidCol = "#4D9DE0", waterCol = "#4ECDC4";

        [x1, x2].forEach(function (cx) {
            svg.appendChild(el("rect", { x: cx, y: topY, width: cylW, height: cylH, fill: "none", stroke: "#8B949E", "stroke-width": 2, rx: 6 }));
        });

        var fillH = cylH * 0.8;
        var fillY = topY + cylH - fillH;
        svg.appendChild(el("rect", { x: x1, y: fillY, width: cylW, height: fillH, fill: liquidCol, opacity: 0.75, rx: 4 }));
        svg.appendChild(el("rect", { x: x2, y: fillY, width: cylW, height: fillH, fill: waterCol, opacity: 0.75, rx: 4 }));

        [x1, x2].forEach(function (cx) {
            svg.appendChild(el("line", { x1: cx - 10, y1: fillY, x2: cx + cylW + 10, y2: fillY, stroke: "#F4D03F", "stroke-width": 1.5, "stroke-dasharray": "4,3" }));
            svg.appendChild(txt(cx + cylW / 2, fillY - 8, "V", { fill: "#F4D03F", "font-size": 14, "font-weight": 700, "text-anchor": "middle" }));
        });

        svg.appendChild(txt(x1 + cylW / 2, topY + cylH + 22, "liquide : masse m", { "font-size": 12, "text-anchor": "middle" }));
        svg.appendChild(txt(x2 + cylW / 2, topY + cylH + 22, "eau : masse m₀", { "font-size": 12, "text-anchor": "middle" }));

        svg.appendChild(txt(W / 2, topY + cylH + 52, "même volume V, masses différentes", { "font-size": 11, fill: "#8B949E", "text-anchor": "middle" }));
        svg.appendChild(txt(W / 2, topY + cylH + 78, "d = m / m₀", { "font-size": 17, "font-weight": 700, fill: "#F4D03F", "text-anchor": "middle", "font-family": "JetBrains Mono, monospace" }));
    }

    /* ---------- helper de rangée (utilisé uniquement dans ce fichier) ---------- */
    function drawRangeRow(svg, y, label, unit, lo, hi, value, axisLo, axisHi, x0, x1) {
        var scale = (x1 - x0) / (axisHi - axisLo);
        function xOf(v) { return x0 + (v - axisLo) * scale; }

        svg.appendChild(txt(x0, y - 26, label, { "font-size": 13, "font-weight": 700, fill: "#E8E8E8" }));
        svg.appendChild(el("line", { x1: x0, y1: y, x2: x1, y2: y, stroke: "#8B949E", "stroke-width": 2 }));

        var bandX = xOf(lo), bandW = xOf(hi) - xOf(lo);
        svg.appendChild(el("rect", { x: bandX, y: y - 6, width: bandW, height: 12, fill: "#4ECDC4", opacity: 0.35, rx: 3 }));
        svg.appendChild(txt(bandX, y + 22, String(lo), { "font-size": 10, fill: "#8B949E", "text-anchor": "middle" }));
        svg.appendChild(txt(bandX + bandW, y + 22, String(hi), { "font-size": 10, fill: "#8B949E", "text-anchor": "middle" }));

        var inRange = value >= lo && value <= hi;
        var markerCol = inRange ? "#4ECDC4" : "#FF6B6B";
        var mx = Math.min(Math.max(xOf(value), x0), x1);
        svg.appendChild(el("circle", { cx: mx, cy: y, r: 6, fill: markerCol, stroke: "#0D1117", "stroke-width": 1.5 }));
        svg.appendChild(txt(mx, y - 12, value + (unit ? " " + unit : ""), { "font-size": 12, "font-weight": 700, fill: markerCol, "text-anchor": "middle", "font-family": "JetBrains Mono, monospace" }));
    }

    /* ---------- 3) graphLaitConformite : d et pH du lait vs normes ---------- */
    function drawGraphLaitConformite() {
        var svg = document.getElementById("graphLaitConformite");
        if (!svg) { return; }
        var W = 560, H = 230;
        setupSvg(svg, W, H, 230);
        drawRangeRow(svg, 85, "Densité d", "", 1.030, 1.034, 1.032, 1.027, 1.037, 130, 520);
        drawRangeRow(svg, 180, "pH", "", 6.5, 6.7, 6.6, 6.3, 6.9, 130, 520);
    }

    function init() {
        drawGraphMineraux();
        drawGraphDensite();
        drawGraphLaitConformite();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
