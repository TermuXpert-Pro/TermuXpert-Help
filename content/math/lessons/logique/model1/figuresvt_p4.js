/* ============================================================
   figuresvt_p4.js — Partie 4 : Disjonction des cas / Absurde / Récurrence
   Fichier autonome (self-contained) : ne dépend d'aucune librairie
   partagée. Toutes les fonctions utilitaires nécessaires sont
   définies à l'intérieur de ce fichier.
   Figures : figDisjonctionCas, figAbsurde, figRecurrence
   ============================================================ */
(function () {
    "use strict";

    var SVG_NS = "http://www.w3.org/2000/svg";

    /* ---------- Thème ---------- */
    function isLightTheme() {
        return document.documentElement.getAttribute("data-theme") === "light";
    }
    function palette() {
        if (isLightTheme()) {
            return {
                text: "#1F2933", textMuted: "#5B6472",
                teal: "#0E8E85", tealFill: "rgba(14,142,133,0.16)",
                red: "#D64545", redFill: "rgba(214,69,69,0.16)",
                gold: "#B7862B", goldFill: "rgba(183,134,43,0.16)",
                purple: "#7C5CD6", purpleFill: "rgba(124,92,214,0.14)",
                axisStroke: "#33414F"
            };
        }
        return {
            text: "#ECEFF3", textMuted: "#9AA6B2",
            teal: "#4ECDC4", tealFill: "rgba(78,205,196,0.18)",
            red: "#FF6B6B", redFill: "rgba(255,107,107,0.18)",
            gold: "#F4D03F", goldFill: "rgba(244,208,63,0.16)",
            purple: "#B794F6", purpleFill: "rgba(183,148,246,0.16)",
            axisStroke: "#7C8B9A"
        };
    }

    /* ---------- Utilitaires SVG ---------- */
    function svgEl(tag, attrs, parent) {
        var e = document.createElementNS(SVG_NS, tag);
        for (var k in attrs) {
            if (Object.prototype.hasOwnProperty.call(attrs, k)) e.setAttribute(k, attrs[k]);
        }
        if (parent) parent.appendChild(e);
        return e;
    }
    function svgText(x, y, str, attrs, parent) {
        var t = svgEl("text", Object.assign({ x: x, y: y }, attrs), parent);
        t.textContent = str;
        return t;
    }
    function clearSvg(svg) { while (svg.firstChild) svg.removeChild(svg.firstChild); }
    function setupViewport(svg, w, h) {
        svg.setAttribute("viewBox", "0 0 " + w + " " + h);
        svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
        svg.removeAttribute("width"); svg.removeAttribute("height");
    }
    function fontFam() { return "Tajawal,Arial,sans-serif"; }
    function addArrowMarker(svg, id, color) {
        var defs = svg.querySelector("defs") || svgEl("defs", {}, svg);
        var marker = svgEl("marker", {
            id: id, viewBox: "0 0 10 10", refX: "8", refY: "5",
            markerWidth: "7", markerHeight: "7", orient: "auto-start-reverse"
        }, defs);
        svgEl("path", { d: "M0,0 L10,5 L0,10 Z", fill: color }, marker);
    }
    function roundedBox(svg, x, y, w, h, fill, stroke) {
        return svgEl("rect", { x: x, y: y, width: w, height: h, rx: 10, ry: 10, fill: fill, stroke: stroke, "stroke-width": 1.8 }, svg);
    }

    /* ============================================================
       Figure 1 : Disjonction des cas
       |x+1| + 2x = 0  →  Cas 1 : x ≤ -1 (S1=∅) | Cas 2 : x ≥ -1 (x=-1/3)
       ============================================================ */
    function drawDisjonctionCas(svg) {
        var pal = palette();
        var W = 320, H = 200;
        clearSvg(svg); setupViewport(svg, W, H);

        svgText(W / 2, 20, "|x+1| + 2x = 0 sur ℝ", {
            "text-anchor": "middle", "font-size": 14.5, "font-weight": 800,
            fill: pal.text, "font-family": fontFam()
        }, svg);

        var axisY = 100, xLeft = 30, xRight = 290;
        // échelle: on place -1 au centre-gauche et -1/3 un peu à droite
        var xAt = function (v) { // v de -3 à 2 -> pixel
            return xLeft + (v + 3) / 5 * (xRight - xLeft);
        };

        addArrowMarker(svg, "arrAxeP4", pal.axisStroke);
        svgEl("line", { x1: xLeft, y1: axisY, x2: xRight, y2: axisY, stroke: pal.axisStroke, "stroke-width": 2, "marker-end": "url(#arrAxeP4)" }, svg);
        svgText(xRight + 8, axisY + 4, "ℝ", { "font-size": 13, "font-weight": 700, fill: pal.text, "font-family": fontFam() }, svg);

        // Cas 1 : ]-inf, -1] en rouge (S1 = vide)
        var xm1 = xAt(-1);
        svgEl("line", { x1: xLeft, y1: axisY - 22, x2: xm1, y2: axisY - 22, stroke: pal.red, "stroke-width": 5, "stroke-linecap": "round" }, svg);
        svgEl("circle", { cx: xm1, cy: axisY - 22, r: 4.5, fill: pal.red }, svg);
        svgText((xLeft + xm1) / 2, axisY - 32, "Cas 1 : x ≤ -1", { "text-anchor": "middle", "font-size": 10.5, "font-weight": 700, fill: pal.red, "font-family": fontFam() }, svg);
        svgText((xLeft + xm1) / 2, axisY - 46, "S₁ = ∅", { "text-anchor": "middle", "font-size": 10, fill: pal.textMuted, "font-family": fontFam() }, svg);

        // Cas 2 : [-1, +inf[ en teal
        svgEl("line", { x1: xm1, y1: axisY + 22, x2: xRight - 10, y2: axisY + 22, stroke: pal.teal, "stroke-width": 5, "stroke-linecap": "round" }, svg);
        svgEl("circle", { cx: xm1, cy: axisY + 22, r: 4.5, fill: pal.teal }, svg);
        svgText((xm1 + xRight) / 2, axisY + 40, "Cas 2 : x ≥ -1", { "text-anchor": "middle", "font-size": 10.5, "font-weight": 700, fill: pal.teal, "font-family": fontFam() }, svg);

        // graduation -1
        svgEl("line", { x1: xm1, y1: axisY - 5, x2: xm1, y2: axisY + 5, stroke: pal.axisStroke, "stroke-width": 1.6 }, svg);
        svgText(xm1, axisY + 18, "-1", { "text-anchor": "middle", "font-size": 10.5, fill: pal.textMuted, "font-family": fontFam() }, svg);

        // solution x = -1/3
        var xs = xAt(-1 / 3);
        svgEl("circle", { cx: xs, cy: axisY, r: 6, fill: pal.gold, stroke: pal.text, "stroke-width": 1 }, svg);
        svgText(xs, axisY - 58, "solution : x = -1/3", { "text-anchor": "middle", "font-size": 11, "font-weight": 800, fill: pal.gold, "font-family": fontFam() }, svg);
        svgEl("line", { x1: xs, y1: axisY - 50, x2: xs, y2: axisY - 8, stroke: pal.gold, "stroke-width": 1.4, "stroke-dasharray": "3,2" }, svg);

        svgText(W / 2, H - 6, "S = S₁ ∪ S₂ = {-1/3}", {
            "text-anchor": "middle", "font-size": 11, "font-weight": 700, fill: pal.text, "font-family": fontFam()
        }, svg);
    }

    /* ============================================================
       Figure 2 : Raisonnement par l'absurde
       On suppose ¬Q, on obtient P ∧ P̄ (contradiction) → Q vraie
       ============================================================ */
    function drawAbsurde(svg) {
        var pal = palette();
        var W = 320, H = 220;
        clearSvg(svg); setupViewport(svg, W, H);

        svgText(W / 2, 20, "Raisonnement par l'absurde", {
            "text-anchor": "middle", "font-size": 14, "font-weight": 800,
            fill: pal.text, "font-family": fontFam()
        }, svg);

        addArrowMarker(svg, "arrAbsP4a", pal.gold);
        addArrowMarker(svg, "arrAbsP4b", pal.red);
        addArrowMarker(svg, "arrAbsP4c", pal.teal);

        var b1 = { x: 90, y: 40, w: 140, h: 34 };
        roundedBox(svg, b1.x, b1.y, b1.w, b1.h, pal.goldFill, pal.gold);
        svgText(b1.x + b1.w / 2, b1.y + 22, "On suppose Q̄ vraie", { "text-anchor": "middle", "font-size": 12.5, "font-weight": 700, fill: pal.gold, "font-family": fontFam() }, svg);

        svgEl("line", { x1: W / 2, y1: b1.y + b1.h, x2: W / 2, y2: 100, stroke: pal.gold, "stroke-width": 2, "marker-end": "url(#arrAbsP4a)" }, svg);

        var b2 = { x: 62, y: 102, w: 196, h: 36 };
        roundedBox(svg, b2.x, b2.y, b2.w, b2.h, pal.redFill, pal.red);
        svgText(b2.x + b2.w / 2, b2.y + 15, "Contradiction :", { "text-anchor": "middle", "font-size": 10.5, fill: pal.textMuted, "font-family": fontFam() }, svg);
        svgText(b2.x + b2.w / 2, b2.y + 30, "P et P̄ vraies en même temps", { "text-anchor": "middle", "font-size": 12, "font-weight": 800, fill: pal.red, "font-family": fontFam() }, svg);

        svgEl("line", { x1: W / 2, y1: b2.y + b2.h, x2: W / 2, y2: 178, stroke: pal.teal, "stroke-width": 2, "marker-end": "url(#arrAbsP4c)" }, svg);

        var b3 = { x: 100, y: 180, w: 120, h: 34 };
        roundedBox(svg, b3.x, b3.y, b3.w, b3.h, pal.tealFill, pal.teal);
        svgText(b3.x + b3.w / 2, b3.y + 22, "Donc Q est vraie", { "text-anchor": "middle", "font-size": 12.5, "font-weight": 800, fill: pal.teal, "font-family": fontFam() }, svg);
    }

    /* ============================================================
       Figure 3 : Raisonnement par récurrence
       P(n0) → P(n0+1) → P(n0+2) → ... (effet domino)
       ============================================================ */
    function drawRecurrence(svg) {
        var pal = palette();
        var W = 340, H = 200;
        clearSvg(svg); setupViewport(svg, W, H);

        svgText(W / 2, 20, "Récurrence : P(n) ⇒ P(n+1)", {
            "text-anchor": "middle", "font-size": 14, "font-weight": 800,
            fill: pal.text, "font-family": fontFam()
        }, svg);

        addArrowMarker(svg, "arrRecP4", pal.teal);

        var labels = ["P(n₀)", "P(n₀+1)", "P(n₀+2)", "…"];
        var n = labels.length;
        var boxW = 66, gap = 16;
        var totalW = n * boxW + (n - 1) * gap;
        var startX = (W - totalW) / 2;
        var y = 90, boxH = 38;

        for (var i = 0; i < n; i++) {
            var x = startX + i * (boxW + gap);
            var isInit = i === 0;
            var fill = isInit ? pal.goldFill : pal.tealFill;
            var stroke = isInit ? pal.gold : pal.teal;
            roundedBox(svg, x, y, boxW, boxH, fill, stroke);
            svgText(x + boxW / 2, y + boxH / 2 + 5, labels[i], {
                "text-anchor": "middle", "font-size": 12, "font-weight": 700,
                fill: isInit ? pal.gold : pal.teal, "font-family": fontFam()
            }, svg);
            if (i < n - 1) {
                svgEl("line", {
                    x1: x + boxW, y1: y + boxH / 2, x2: x + boxW + gap - 3, y2: y + boxH / 2,
                    stroke: pal.teal, "stroke-width": 2, "marker-end": "url(#arrRecP4)"
                }, svg);
            }
        }

        svgText(startX + boxW / 2, y + boxH + 20, "initialisation", {
            "text-anchor": "middle", "font-size": 9.5, fill: pal.gold, "font-family": fontFam()
        }, svg);
        svgText(W / 2 + 10, y + boxH + 40, "hérédité : P(n) ⇒ P(n+1) transmet la propriété de proche en proche", {
            "text-anchor": "middle", "font-size": 10, fill: pal.textMuted, "font-family": fontFam()
        }, svg);
    }

    /* ---------- Initialisation ---------- */
    var FIGURES = {
        figDisjonctionCas: drawDisjonctionCas,
        figAbsurde: drawAbsurde,
        figRecurrence: drawRecurrence
    };

    function renderAll() {
        Object.keys(FIGURES).forEach(function (id) {
            var svg = document.getElementById(id);
            if (svg) FIGURES[id](svg);
        });
    }

    function init() {
        renderAll();
        var mo = new MutationObserver(function (mutations) {
            for (var i = 0; i < mutations.length; i++) {
                if (mutations[i].attributeName === "data-theme") { renderAll(); break; }
            }
        });
        mo.observe(document.documentElement, { attributes: true });
        window.addEventListener("resize", renderAll);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();

