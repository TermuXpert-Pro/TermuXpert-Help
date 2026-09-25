/* ============================================================
   figuresvt_p3.js — Partie 3 : Lois logiques - Raisonnements (1-4)
   Fichier autonome (self-contained) : ne dépend d'aucune librairie
   partagée. Toutes les fonctions utilitaires nécessaires sont
   définies à l'intérieur de ce fichier.
   Figures : figContreExemple, figDeductif, figContraposee
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
                gold: "#B7862B", purple: "#7C5CD6", purpleFill: "rgba(124,92,214,0.14)",
                setStroke: "#33414F", setFill: "rgba(15,23,42,0.03)",
                dotIdle: "#B9C2CC"
            };
        }
        return {
            text: "#ECEFF3", textMuted: "#9AA6B2",
            teal: "#4ECDC4", tealFill: "rgba(78,205,196,0.18)",
            red: "#FF6B6B", redFill: "rgba(255,107,107,0.18)",
            gold: "#F4D03F", purple: "#B794F6", purpleFill: "rgba(183,148,246,0.16)",
            setStroke: "#7C8B9A", setFill: "rgba(255,255,255,0.03)",
            dotIdle: "#5B6472"
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
       Figure 1 : Contre-exemple
       Univers E : tous les x vérifient P(x), sauf un seul x0.
       ============================================================ */
    function drawContreExemple(svg) {
        var pal = palette();
        var W = 300, H = 230;
        clearSvg(svg); setupViewport(svg, W, H);

        svgText(W / 2, 24, "∀x ∈ E, P(x) — réfutation", {
            "text-anchor": "middle", "font-size": 14.5, "font-weight": 800,
            fill: pal.text, "font-family": fontFam()
        }, svg);

        var cx = W / 2, cy = 128, rx = 118, ry = 82;
        svgEl("ellipse", { cx: cx, cy: cy, rx: rx, ry: ry, fill: pal.setFill, stroke: pal.setStroke, "stroke-width": 1.6, "stroke-dasharray": "5,4" }, svg);
        svgText(cx + rx - 8, cy - ry + 18, "E", { "text-anchor": "end", "font-size": 14, "font-weight": 700, fill: pal.textMuted, "font-family": fontFam() }, svg);

        function dot(x, y, ok, label) {
            var color = ok ? pal.teal : pal.red;
            if (!ok) {
                svgEl("circle", { cx: x, cy: y, r: 20, fill: "none", stroke: pal.red, "stroke-width": 1.6, "stroke-dasharray": "3,3" }, svg);
            }
            svgEl("circle", { cx: x, cy: y, r: 9, fill: color }, svg);
            var g = svgEl("g", { stroke: "#fff", "stroke-width": 1.8, fill: "none", "stroke-linecap": "round" }, svg);
            if (ok) {
                svgEl("path", { d: "M " + (x - 4.2) + " " + y + " L " + (x - 1) + " " + (y + 3.2) + " L " + (x + 4.8) + " " + (y - 4.2) }, g);
            } else {
                svgEl("line", { x1: x - 3.4, y1: y - 3.4, x2: x + 3.4, y2: y + 3.4 }, g);
                svgEl("line", { x1: x - 3.4, y1: y + 3.4, x2: x + 3.4, y2: y - 3.4 }, g);
            }
            if (label) {
                svgText(x, y + (ok ? 22 : 34), label, {
                    "text-anchor": "middle", "font-size": 11, "font-weight": ok ? 400 : 700,
                    fill: ok ? pal.textMuted : pal.red, "font-family": fontFam()
                }, svg);
            }
        }

        dot(cx - 70, cy - 20, true, null);
        dot(cx - 30, cy - 45, true, null);
        dot(cx + 20, cy - 40, true, null);
        dot(cx + 65, cy - 5, true, null);
        dot(cx - 55, cy + 35, true, null);
        dot(cx + 10, cy + 50, true, null);
        dot(cx + 60, cy + 45, true, null);
        dot(cx - 5, cy + 5, false, "x₀");

        svgText(W / 2, H - 8, "x₀ ne vérifie pas P : la propriété ∀x, P(x) est fausse", {
            "text-anchor": "middle", "font-size": 10, fill: pal.textMuted, "font-family": fontFam()
        }, svg);
    }

    /* ============================================================
       Figure 2 : Raisonnement déductif (Modus ponens)
       Prémisses P et P⇒Q  =>  Conclusion Q
       ============================================================ */
    function drawDeductif(svg) {
        var pal = palette();
        var W = 320, H = 220;
        clearSvg(svg); setupViewport(svg, W, H);

        svgText(W / 2, 22, "Modus ponens", {
            "text-anchor": "middle", "font-size": 15.5, "font-weight": 800,
            fill: pal.teal, "font-family": fontFam()
        }, svg);

        addArrowMarker(svg, "arrDedP3", pal.teal);

        // Prémisse 1
        var b1 = { x: 18, y: 46, w: 118, h: 40 };
        roundedBox(svg, b1.x, b1.y, b1.w, b1.h, pal.tealFill, pal.teal);
        svgText(b1.x + b1.w / 2, b1.y + 25, "P  (vraie)", { "text-anchor": "middle", "font-size": 13.5, "font-weight": 700, fill: pal.text, "font-family": fontFam() }, svg);

        // Prémisse 2
        var b2 = { x: 184, y: 46, w: 118, h: 40 };
        roundedBox(svg, b2.x, b2.y, b2.w, b2.h, pal.tealFill, pal.teal);
        svgText(b2.x + b2.w / 2, b2.y + 25, "P ⇒ Q (vraie)", { "text-anchor": "middle", "font-size": 13.5, "font-weight": 700, fill: pal.text, "font-family": fontFam() }, svg);

        // Flèches convergentes vers la conclusion
        var ccx = W / 2, ccy = 152;
        svgEl("line", { x1: b1.x + b1.w / 2, y1: b1.y + b1.h, x2: ccx - 6, y2: ccy - 24, stroke: pal.teal, "stroke-width": 2, "marker-end": "url(#arrDedP3)" }, svg);
        svgEl("line", { x1: b2.x + b2.w / 2, y1: b2.y + b2.h, x2: ccx + 6, y2: ccy - 24, stroke: pal.teal, "stroke-width": 2, "marker-end": "url(#arrDedP3)" }, svg);

        // Conclusion
        var b3 = { x: W / 2 - 65, y: ccy - 20, w: 130, h: 44 };
        roundedBox(svg, b3.x, b3.y, b3.w, b3.h, pal.purpleFill, pal.purple);
        svgText(b3.x + b3.w / 2, b3.y + 20, "donc Q", { "text-anchor": "middle", "font-size": 15, "font-weight": 800, fill: pal.purple, "font-family": fontFam() }, svg);
        svgText(b3.x + b3.w / 2, b3.y + 36, "(conclusion vraie)", { "text-anchor": "middle", "font-size": 10, fill: pal.textMuted, "font-family": fontFam() }, svg);

        svgText(W / 2, H - 8, "P vraie et P ⇒ Q vraie entraînent Q vraie", {
            "text-anchor": "middle", "font-size": 10.5, fill: pal.textMuted, "font-family": fontFam()
        }, svg);
    }

    /* ============================================================
       Figure 3 : Raisonnement par contraposée
       P ⇒ Q   équivaut à   ¬Q ⇒ ¬P
       ============================================================ */
    function drawContraposee(svg) {
        var pal = palette();
        var W = 320, H = 220;
        clearSvg(svg); setupViewport(svg, W, H);

        svgText(W / 2, 22, "Implication et contraposée", {
            "text-anchor": "middle", "font-size": 14.5, "font-weight": 800,
            fill: pal.text, "font-family": fontFam()
        }, svg);

        addArrowMarker(svg, "arrContraP3", pal.teal);
        addArrowMarker(svg, "arrContraP3b", pal.purple);
        addArrowMarker(svg, "arrEqP3", pal.gold);

        // Ligne 1 : P => Q
        var y1 = 70;
        var pBox = { x: 30, y: y1 - 18, w: 66, h: 36 };
        var qBox = { x: 224, y: y1 - 18, w: 66, h: 36 };
        roundedBox(svg, pBox.x, pBox.y, pBox.w, pBox.h, pal.tealFill, pal.teal);
        roundedBox(svg, qBox.x, qBox.y, qBox.w, qBox.h, pal.tealFill, pal.teal);
        svgText(pBox.x + pBox.w / 2, y1 + 5, "P", { "text-anchor": "middle", "font-size": 16, "font-weight": 800, fill: pal.teal, "font-family": fontFam() }, svg);
        svgText(qBox.x + qBox.w / 2, y1 + 5, "Q", { "text-anchor": "middle", "font-size": 16, "font-weight": 800, fill: pal.teal, "font-family": fontFam() }, svg);
        svgEl("line", { x1: pBox.x + pBox.w, y1: y1, x2: qBox.x - 4, y2: y1, stroke: pal.teal, "stroke-width": 2.2, "marker-end": "url(#arrContraP3)" }, svg);
        svgText((pBox.x + pBox.w + qBox.x) / 2, y1 - 10, "implication directe", { "text-anchor": "middle", "font-size": 10, fill: pal.textMuted, "font-family": fontFam() }, svg);

        // Ligne 2 : ¬Q => ¬P
        var y2 = 158;
        var nqBox = { x: 224, y: y2 - 18, w: 66, h: 36 };
        var npBox = { x: 30, y: y2 - 18, w: 66, h: 36 };
        roundedBox(svg, nqBox.x, nqBox.y, nqBox.w, nqBox.h, pal.purpleFill, pal.purple);
        roundedBox(svg, npBox.x, npBox.y, npBox.w, npBox.h, pal.purpleFill, pal.purple);
        svgText(nqBox.x + nqBox.w / 2, y2 + 5, "Q̄", { "text-anchor": "middle", "font-size": 16, "font-weight": 800, fill: pal.purple, "font-family": fontFam() }, svg);
        svgText(npBox.x + npBox.w / 2, y2 + 5, "P̄", { "text-anchor": "middle", "font-size": 16, "font-weight": 800, fill: pal.purple, "font-family": fontFam() }, svg);
        svgEl("line", { x1: nqBox.x, y1: y2, x2: npBox.x + npBox.w + 4, y2: y2, stroke: pal.purple, "stroke-width": 2.2, "marker-end": "url(#arrContraP3b)" }, svg);
        svgText((npBox.x + npBox.w + nqBox.x) / 2, y2 + 26, "contraposée", { "text-anchor": "middle", "font-size": 10, fill: pal.textMuted, "font-family": fontFam() }, svg);

        // Double flèche verticale d'équivalence
        var midX = W / 2;
        svgEl("line", { x1: midX, y1: y1 + 22, x2: midX, y2: y2 - 22, stroke: pal.gold, "stroke-width": 2, "marker-start": "url(#arrEqP3)", "marker-end": "url(#arrEqP3)" }, svg);
        svgText(midX + 16, (y1 + y2) / 2 + 4, "⇔", { "font-size": 18, "font-weight": 800, fill: pal.gold, "font-family": fontFam() }, svg);

        svgText(W / 2, H - 8, "P ⇒ Q est vraie si et seulement si Q̄ ⇒ P̄ est vraie", {
            "text-anchor": "middle", "font-size": 10, fill: pal.textMuted, "font-family": fontFam()
        }, svg);
    }

    /* ---------- Initialisation ---------- */
    var FIGURES = {
        figContreExemple: drawContreExemple,
        figDeductif: drawDeductif,
        figContraposee: drawContraposee
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

