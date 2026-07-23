/* ============================================================
   figuresvt_p2.js — Partie 2 : Opérations sur les propositions
   Fichier autonome (self-contained) : ne dépend d'aucune librairie
   partagée. Toutes les fonctions utilitaires nécessaires sont
   définies à l'intérieur de ce fichier.
   Figures : figNegation, figConjonction, figDisjonction,
             figImplication, figEquivalence
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
                teal: "#0E8E85", tealFill: "rgba(14,142,133,0.20)",
                red: "#D64545", redFill: "rgba(214,69,69,0.16)",
                gold: "#B7862B", purple: "#7C5CD6",
                setStroke: "#33414F", setFill: "rgba(15,23,42,0.03)",
                mutedFill: "rgba(15,23,42,0.05)"
            };
        }
        return {
            text: "#ECEFF3", textMuted: "#9AA6B2",
            teal: "#4ECDC4", tealFill: "rgba(78,205,196,0.22)",
            red: "#FF6B6B", redFill: "rgba(255,107,107,0.18)",
            gold: "#F4D03F", purple: "#B794F6",
            setStroke: "#7C8B9A", setFill: "rgba(255,255,255,0.03)",
            mutedFill: "rgba(255,255,255,0.05)"
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

    /* ============================================================
       Figure 1 : Négation  ( P et P̄ )
       Univers E partagé en deux régions complémentaires.
       ============================================================ */
    function drawNegation(svg) {
        var pal = palette();
        var W = 300, H = 220;
        clearSvg(svg); setupViewport(svg, W, H);

        svgText(W / 2, 24, "P et sa négation P̄", {
            "text-anchor": "middle", "font-size": 15.5, "font-weight": 800,
            fill: pal.text, "font-family": fontFam()
        }, svg);

        var cx = W / 2, cy = 128, r = 82;
        // clip pour les deux moitiés
        var defs = svgEl("defs", {}, svg);
        var clipLeft = svgEl("clipPath", { id: "clipLeftP2" }, defs);
        svgEl("rect", { x: cx - r - 4, y: cy - r - 4, width: r + 4, height: 2 * r + 8 }, clipLeft);
        var clipRight = svgEl("clipPath", { id: "clipRightP2" }, defs);
        svgEl("rect", { x: cx, y: cy - r - 4, width: r + 4, height: 2 * r + 8 }, clipRight);

        var circ = svgEl("circle", { cx: cx, cy: cy, r: r, fill: "none" }, svg);
        var gLeft = svgEl("g", { "clip-path": "url(#clipLeftP2)" }, svg);
        svgEl("circle", { cx: cx, cy: cy, r: r, fill: pal.tealFill }, gLeft);
        var gRight = svgEl("g", { "clip-path": "url(#clipRightP2)" }, svg);
        svgEl("circle", { cx: cx, cy: cy, r: r, fill: pal.redFill }, gRight);

        svgEl("circle", { cx: cx, cy: cy, r: r, fill: "none", stroke: pal.setStroke, "stroke-width": 1.6 }, svg);
        svgEl("line", { x1: cx, y1: cy - r, x2: cx, y2: cy + r, stroke: pal.setStroke, "stroke-width": 1.6, "stroke-dasharray": "4,3" }, svg);

        svgText(cx - r + 20, cy - r + 24, "E", { "font-size": 13, "font-weight": 700, fill: pal.textMuted, "font-family": fontFam() }, svg);

        svgText(cx - 40, cy + 6, "P", { "text-anchor": "middle", "font-size": 22, "font-weight": 800, fill: pal.teal, "font-family": fontFam() }, svg);
        svgText(cx - 40, cy + 26, "vraie (V)", { "text-anchor": "middle", "font-size": 11, fill: pal.textMuted, "font-family": fontFam() }, svg);

        svgText(cx + 40, cy + 6, "P̄", { "text-anchor": "middle", "font-size": 22, "font-weight": 800, fill: pal.red, "font-family": fontFam() }, svg);
        svgText(cx + 40, cy + 26, "vraie (V)", { "text-anchor": "middle", "font-size": 11, fill: pal.textMuted, "font-family": fontFam() }, svg);

        svgText(W / 2, H - 8, "P et P̄ se partagent tout l'univers E, sans zone commune", {
            "text-anchor": "middle", "font-size": 10.5, fill: pal.textMuted, "font-family": fontFam()
        }, svg);
    }

    /* ============================================================
       Figure 2 : Conjonction  P ∧ Q  (seule l'intersection est vraie)
       ============================================================ */
    function drawConjonction(svg) {
        var W = 300, H = 220;
        var pal = palette();
        clearSvg(svg); setupViewport(svg, W, H);
        svgText(W / 2, 24, "P ∧ Q", {
            "text-anchor": "middle", "font-size": 15.5, "font-weight": 800,
            fill: pal.teal, "font-family": fontFam()
        }, svg);

        var cxP = 118, cxQ = 182, cy = 130, r = 62;
        var defs = svgEl("defs", {}, svg);
        var clip = svgEl("clipPath", { id: "clipInterP2" }, defs);
        svgEl("circle", { cx: cxQ, cy: cy, r: r }, clip);

        svgEl("circle", { cx: cxP, cy: cy, r: r, fill: pal.mutedFill, stroke: pal.setStroke, "stroke-width": 1.6 }, svg);
        svgEl("circle", { cx: cxQ, cy: cy, r: r, fill: pal.mutedFill, stroke: pal.setStroke, "stroke-width": 1.6 }, svg);

        var gInter = svgEl("g", { "clip-path": "url(#clipInterP2)" }, svg);
        svgEl("circle", { cx: cxP, cy: cy, r: r, fill: pal.tealFill }, gInter);
        svgEl("circle", { cx: cxP, cy: cy, r: r, fill: "none", stroke: pal.teal, "stroke-width": 2 }, gInter);

        svgText(cxP - 30, cy - r + 18, "P", { "text-anchor": "middle", "font-size": 17, "font-weight": 800, fill: pal.text, "font-family": fontFam() }, svg);
        svgText(cxQ + 30, cy - r + 18, "Q", { "text-anchor": "middle", "font-size": 17, "font-weight": 800, fill: pal.text, "font-family": fontFam() }, svg);
        svgText((cxP + cxQ) / 2, cy + 4, "V", { "text-anchor": "middle", "font-size": 15, "font-weight": 800, fill: pal.teal, "font-family": fontFam() }, svg);
        svgText(cxP - 34, cy + 4, "F", { "text-anchor": "middle", "font-size": 13, fill: pal.textMuted, "font-family": fontFam() }, svg);
        svgText(cxQ + 34, cy + 4, "F", { "text-anchor": "middle", "font-size": 13, fill: pal.textMuted, "font-family": fontFam() }, svg);

        svgText(W / 2, H - 8, "P ∧ Q est vraie uniquement dans l'intersection", {
            "text-anchor": "middle", "font-size": 10.5, fill: pal.textMuted, "font-family": fontFam()
        }, svg);
    }

    /* ============================================================
       Figure 3 : Disjonction  P ∨ Q  (toute la zone couverte est vraie)
       ============================================================ */
    function drawDisjonction(svg) {
        var W = 300, H = 220;
        var pal = palette();
        clearSvg(svg); setupViewport(svg, W, H);
        svgText(W / 2, 24, "P ∨ Q", {
            "text-anchor": "middle", "font-size": 15.5, "font-weight": 800,
            fill: pal.gold, "font-family": fontFam()
        }, svg);

        var cxP = 118, cxQ = 182, cy = 130, r = 62;

        svgEl("circle", { cx: cxP, cy: cy, r: r, fill: pal.tealFill }, svg);
        svgEl("circle", { cx: cxQ, cy: cy, r: r, fill: pal.tealFill }, svg);
        svgEl("circle", { cx: cxP, cy: cy, r: r, fill: "none", stroke: pal.teal, "stroke-width": 2 }, svg);
        svgEl("circle", { cx: cxQ, cy: cy, r: r, fill: "none", stroke: pal.teal, "stroke-width": 2 }, svg);

        svgText(cxP - 30, cy - r + 18, "P", { "text-anchor": "middle", "font-size": 17, "font-weight": 800, fill: pal.text, "font-family": fontFam() }, svg);
        svgText(cxQ + 30, cy - r + 18, "Q", { "text-anchor": "middle", "font-size": 17, "font-weight": 800, fill: pal.text, "font-family": fontFam() }, svg);
        svgText(cxP - 34, cy + 4, "V", { "text-anchor": "middle", "font-size": 13, "font-weight": 700, fill: pal.teal, "font-family": fontFam() }, svg);
        svgText((cxP + cxQ) / 2, cy + 4, "V", { "text-anchor": "middle", "font-size": 15, "font-weight": 800, fill: pal.teal, "font-family": fontFam() }, svg);
        svgText(cxQ + 34, cy + 4, "V", { "text-anchor": "middle", "font-size": 13, "font-weight": 700, fill: pal.teal, "font-family": fontFam() }, svg);
        svgText(W / 2, H - 46, "F", { "text-anchor": "middle", "font-size": 11, fill: pal.textMuted, "font-family": fontFam() }, svg);

        svgText(W / 2, H - 8, "P ∨ Q est fausse seulement en dehors de P et de Q", {
            "text-anchor": "middle", "font-size": 10.5, fill: pal.textMuted, "font-family": fontFam()
        }, svg);
    }

    /* ============================================================
       Figure 4 : Implication  P ⇒ Q   (P ⊂ Q)
       ============================================================ */
    function drawImplication(svg) {
        var W = 300, H = 220;
        var pal = palette();
        clearSvg(svg); setupViewport(svg, W, H);
        svgText(W / 2, 24, "P ⇒ Q", {
            "text-anchor": "middle", "font-size": 15.5, "font-weight": 800,
            fill: pal.teal, "font-family": fontFam()
        }, svg);

        var cx = W / 2, cy = 130;
        svgEl("circle", { cx: cx, cy: cy, r: 85, fill: pal.mutedFill, stroke: pal.setStroke, "stroke-width": 1.6 }, svg);
        svgEl("circle", { cx: cx - 22, cy: cy + 8, r: 38, fill: pal.tealFill, stroke: pal.teal, "stroke-width": 2 }, svg);

        svgText(cx - 22, cy + 12, "P", { "text-anchor": "middle", "font-size": 17, "font-weight": 800, fill: pal.teal, "font-family": fontFam() }, svg);
        svgText(cx + 52, cy - 62, "Q", { "text-anchor": "middle", "font-size": 17, "font-weight": 800, fill: pal.text, "font-family": fontFam() }, svg);

        svgText(cx, H - 8, "Dès que x ∈ P, alors x ∈ Q  (P ⊂ Q)", {
            "text-anchor": "middle", "font-size": 10.5, fill: pal.textMuted, "font-family": fontFam()
        }, svg);
    }

    /* ============================================================
       Figure 5 : Équivalence  P ⇔ Q   (mêmes valeurs de vérité)
       ============================================================ */
    function drawEquivalence(svg) {
        var W = 300, H = 220;
        var pal = palette();
        clearSvg(svg); setupViewport(svg, W, H);
        svgText(W / 2, 24, "P ⇔ Q", {
            "text-anchor": "middle", "font-size": 15.5, "font-weight": 800,
            fill: pal.purple, "font-family": fontFam()
        }, svg);

        var cxP = 100, cxQ = 200, cy = 130, r = 55;

        // Double flèche liant les deux implications
        var defs = svgEl("defs", {}, svg);
        var mk1 = svgEl("marker", { id: "arrEqL", viewBox: "0 0 10 10", refX: "8", refY: "5", markerWidth: "6", markerHeight: "6", orient: "auto-start-reverse" }, defs);
        svgEl("path", { d: "M0,0 L10,5 L0,10 Z", fill: pal.purple }, mk1);

        svgEl("line", {
            x1: cxP + r + 6, y1: cy, x2: cxQ - r - 6, y2: cy,
            stroke: pal.purple, "stroke-width": 2.2,
            "marker-start": "url(#arrEqL)", "marker-end": "url(#arrEqL)"
        }, svg);
        svgText((cxP + cxQ) / 2, cy - 10, "⇔", {
            "text-anchor": "middle", "font-size": 18, "font-weight": 800, fill: pal.purple, "font-family": fontFam()
        }, svg);

        [[cxP, "P"], [cxQ, "Q"]].forEach(function (item) {
            svgEl("circle", { cx: item[0], cy: cy, r: r, fill: pal.tealFill, stroke: pal.teal, "stroke-width": 2 }, svg);
            svgText(item[0], cy + 6, item[1], {
                "text-anchor": "middle", "font-size": 22, "font-weight": 800, fill: pal.teal, "font-family": fontFam()
            }, svg);
            svgText(item[0], cy + r + 20, "même valeur de vérité", {
                "text-anchor": "middle", "font-size": 9.5, fill: pal.textMuted, "font-family": fontFam()
            }, svg);
        });

        svgText(W / 2, H - 8, "P et Q sont toujours V ensemble ou F ensemble", {
            "text-anchor": "middle", "font-size": 10.5, fill: pal.textMuted, "font-family": fontFam()
        }, svg);
    }

    /* ---------- Initialisation ---------- */
    var FIGURES = {
        figNegation: drawNegation,
        figConjonction: drawConjonction,
        figDisjonction: drawDisjonction,
        figImplication: drawImplication,
        figEquivalence: drawEquivalence
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
