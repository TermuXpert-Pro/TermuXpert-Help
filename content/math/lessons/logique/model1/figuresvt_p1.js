/* ============================================================
   figuresvt_p1.js — Partie 1 : Notions de base (Logique mathématique)
   Fichier autonome (self-contained) : ne dépend d'aucune librairie
   partagée. Toutes les fonctions utilitaires nécessaires sont
   définies à l'intérieur de ce fichier.
   Figures : figQuantifUniversel, figQuantifExistentiel
   ============================================================ */
(function () {
    "use strict";

    var SVG_NS = "http://www.w3.org/2000/svg";

    /* ---------- Thème (clair / sombre) ---------- */
    function isLightTheme() {
        return document.documentElement.getAttribute("data-theme") === "light";
    }

    function palette() {
        if (isLightTheme()) {
            return {
                text: "#1F2933",
                textMuted: "#5B6472",
                teal: "#0E8E85",
                red: "#D64545",
                gold: "#B7862B",
                purple: "#7C5CD6",
                setStroke: "#33414F",
                setFill: "rgba(15,23,42,0.035)",
                dotIdle: "#B9C2CC"
            };
        }
        return {
            text: "#ECEFF3",
            textMuted: "#9AA6B2",
            teal: "#4ECDC4",
            red: "#FF6B6B",
            gold: "#F4D03F",
            purple: "#B794F6",
            setStroke: "#7C8B9A",
            setFill: "rgba(255,255,255,0.035)",
            dotIdle: "#5B6472"
        };
    }

    /* ---------- Petits utilitaires SVG ---------- */
    function svgEl(tag, attrs, parent) {
        var e = document.createElementNS(SVG_NS, tag);
        for (var k in attrs) {
            if (Object.prototype.hasOwnProperty.call(attrs, k)) {
                e.setAttribute(k, attrs[k]);
            }
        }
        if (parent) parent.appendChild(e);
        return e;
    }

    function svgText(x, y, str, attrs, parent) {
        var t = svgEl("text", Object.assign({ x: x, y: y }, attrs), parent);
        t.textContent = str;
        return t;
    }

    function clearSvg(svg) {
        while (svg.firstChild) svg.removeChild(svg.firstChild);
    }

    function setupViewport(svg, w, h) {
        svg.setAttribute("viewBox", "0 0 " + w + " " + h);
        svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
        svg.removeAttribute("width");
        svg.removeAttribute("height");
    }

    function addArrowMarker(svg, id, color) {
        var defs = svg.querySelector("defs") || svgEl("defs", {}, svg);
        var marker = svgEl("marker", {
            id: id, viewBox: "0 0 10 10", refX: "8", refY: "5",
            markerWidth: "7", markerHeight: "7", orient: "auto-start-reverse"
        }, defs);
        svgEl("path", { d: "M0,0 L10,5 L0,10 Z", fill: color }, marker);
    }

    /* ---------- Dessin d'un "univers" E avec des éléments ---------- */
    function drawUniverseSet(svg, cx, cy, rx, ry, label, pal) {
        svgEl("ellipse", {
            cx: cx, cy: cy, rx: rx, ry: ry,
            fill: pal.setFill, stroke: pal.setStroke, "stroke-width": 1.6,
            "stroke-dasharray": "5,4"
        }, svg);
        svgText(cx + rx - 8, cy - ry + 18, label, {
            "text-anchor": "end", "font-size": 15, "font-weight": 700,
            fill: pal.textMuted, "font-family": "Tajawal,Arial,sans-serif"
        }, svg);
    }

    function drawElement(svg, x, y, state, pal, labelText) {
        // state: "true" | "muted"
        var color = state === "true" ? pal.teal : pal.dotIdle;
        if (state === "true") {
            svgEl("circle", { cx: x, cy: y, r: 13, fill: "none", stroke: color, "stroke-width": 2, opacity: 0.55 }, svg);
        }
        svgEl("circle", { cx: x, cy: y, r: 8, fill: color }, svg);
        if (state === "true") {
            var g = svgEl("g", { stroke: "#fff", "stroke-width": 1.8, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" }, svg);
            svgEl("path", { d: "M " + (x - 4) + " " + y + " L " + (x - 1) + " " + (y + 3) + " L " + (x + 4.5) + " " + (y - 4) }, g);
        } else {
            svgEl("line", { x1: x - 3.2, y1: y - 3.2, x2: x + 3.2, y2: y + 3.2, stroke: "#fff", "stroke-width": 1.6, "stroke-linecap": "round" }, svg);
            svgEl("line", { x1: x - 3.2, y1: y + 3.2, x2: x + 3.2, y2: y - 3.2, stroke: "#fff", "stroke-width": 1.6, "stroke-linecap": "round" }, svg);
        }
        if (labelText) {
            svgText(x, y + 22, labelText, {
                "text-anchor": "middle", "font-size": 10.5, fill: pal.textMuted,
                "font-family": "Tajawal,Arial,sans-serif"
            }, svg);
        }
    }

    /* ============================================================
       Figure 1 : Quantificateur universel  ∀x ∈ E, Q(x)
       -> tous les éléments de E vérifient Q(x)
       ============================================================ */
    function drawQuantifUniversel(svg) {
        var pal = palette();
        var W = 300, H = 230;
        clearSvg(svg);
        setupViewport(svg, W, H);

        svgText(W / 2, 26, "∀x ∈ E,  Q(x) vraie", {
            "text-anchor": "middle", "font-size": 16.5, "font-weight": 800,
            fill: pal.teal, "font-family": "Tajawal,Arial,sans-serif"
        }, svg);

        drawUniverseSet(svg, W / 2, 130, 118, 82, "E", pal);

        var positions = [
            [W / 2 - 68, 108], [W / 2 - 20, 90], [W / 2 + 34, 100],
            [W / 2 + 72, 140], [W / 2 + 18, 155], [W / 2 - 40, 150],
            [W / 2 - 5, 122]
        ];
        positions.forEach(function (p) {
            drawElement(svg, p[0], p[1], "true", pal, null);
        });

        svgText(W / 2, H - 10, "Chaque élément x de E vérifie Q(x)", {
            "text-anchor": "middle", "font-size": 11, fill: pal.textMuted,
            "font-family": "Tajawal,Arial,sans-serif"
        }, svg);
    }

    /* ============================================================
       Figure 2 : Quantificateur existentiel  ∃x ∈ E, Q(x)
       -> au moins un élément de E vérifie Q(x)
       ============================================================ */
    function drawQuantifExistentiel(svg) {
        var pal = palette();
        var W = 300, H = 230;
        clearSvg(svg);
        setupViewport(svg, W, H);

        svgText(W / 2, 26, "∃x ∈ E,  Q(x) vraie", {
            "text-anchor": "middle", "font-size": 16.5, "font-weight": 800,
            fill: pal.gold, "font-family": "Tajawal,Arial,sans-serif"
        }, svg);

        drawUniverseSet(svg, W / 2, 130, 118, 82, "E", pal);

        var mutedPositions = [
            [W / 2 - 68, 108], [W / 2 - 20, 90],
            [W / 2 + 72, 140], [W / 2 - 40, 150]
        ];
        mutedPositions.forEach(function (p) {
            drawElement(svg, p[0], p[1], "muted", pal, null);
        });

        // Le seul élément qui vérifie Q(x), mis en évidence
        var xPos = [W / 2 + 30, 118];
        svgEl("circle", {
            cx: xPos[0], cy: xPos[1], r: 19, fill: "none",
            stroke: pal.gold, "stroke-width": 1.6, "stroke-dasharray": "3,3"
        }, svg);
        drawElement(svg, xPos[0], xPos[1], "true", pal, "x");

        svgText(W / 2, H - 10, "Il suffit d'un seul x pour lequel Q(x) est vraie", {
            "text-anchor": "middle", "font-size": 11, fill: pal.textMuted,
            "font-family": "Tajawal,Arial,sans-serif"
        }, svg);
    }

    /* ---------- Initialisation ---------- */
    var FIGURES = {
        figQuantifUniversel: drawQuantifUniversel,
        figQuantifExistentiel: drawQuantifExistentiel
    };

    function renderAll() {
        Object.keys(FIGURES).forEach(function (id) {
            var svg = document.getElementById(id);
            if (svg) FIGURES[id](svg);
        });
    }

    function init() {
        renderAll();
        // Redessine automatiquement si le thème (clair/sombre) change
        var mo = new MutationObserver(function (mutations) {
            for (var i = 0; i < mutations.length; i++) {
                if (mutations[i].attributeName === "data-theme") {
                    renderAll();
                    break;
                }
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
