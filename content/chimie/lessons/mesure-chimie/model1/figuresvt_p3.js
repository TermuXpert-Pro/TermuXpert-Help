/* ============================================================
   figuresvt_p3.js — Résumé : les trois rôles de la mesure en chimie
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
        var base = { x: x, y: y, fill: "#C9D1D9", "font-family": "Cairo, sans-serif", "font-size": 12, "text-anchor": "middle" };
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
        svg.style.maxHeight = (maxHeight || 400) + "px";
        svg.style.background = "#0D1117";
    }

    function drawSvgRoles() {
        var svg = document.getElementById("svgRoles");
        if (!svg) { return; }
        var W = 640, H = 400;
        setupSvg(svg, W, H, 400);

        var cx = 320, cy = 195, R = 145, nodeR = 62;

        // hub central
        svg.appendChild(el("circle", { cx: cx, cy: cy, r: 50, fill: "#161B22", stroke: "#F4D03F", "stroke-width": 2 }));
        svg.appendChild(txt(cx, cy - 4, "Mesure", { "font-size": 14, "font-weight": 700, fill: "#F4D03F" }));
        svg.appendChild(txt(cx, cy + 14, "en chimie", { "font-size": 14, "font-weight": 700, fill: "#F4D03F" }));

        var roles = [
            { angle: -90, name: "Informer", example: "Étiquette d'eau minérale", color: "#4D9DE0", icon: "i" },
            { angle: 150, name: "Surveiller / protéger", example: "Contrôle qualité du lait", color: "#4ECDC4", icon: "✓" },
            { angle: 30, name: "Agir", example: "Analyse de sang", color: "#F4D03F", icon: "⚡" }
        ];

        roles.forEach(function (role) {
            var rad = (role.angle * Math.PI) / 180;
            var nx = cx + R * Math.cos(rad);
            var ny = cy + R * Math.sin(rad);

            // ligne de connexion (arrêtée au bord des deux cercles)
            var dx = nx - cx, dy = ny - cy, dist = Math.sqrt(dx * dx + dy * dy);
            var ux = dx / dist, uy = dy / dist;
            svg.appendChild(el("line", {
                x1: cx + ux * 50, y1: cy + uy * 50,
                x2: nx - ux * nodeR, y2: ny - uy * nodeR,
                stroke: role.color, "stroke-width": 2, opacity: 0.7
            }));

            svg.appendChild(el("circle", { cx: nx, cy: ny, r: nodeR, fill: "#161B22", stroke: role.color, "stroke-width": 2.5 }));
            svg.appendChild(txt(nx, ny - 20, role.icon, { "font-size": 22, "font-weight": 700, fill: role.color, "font-family": "sans-serif" }));
            svg.appendChild(txt(nx, ny + 4, role.name, { "font-size": 12.5, "font-weight": 700, fill: "#E8E8E8" }));

            // texte d'exemple pouvant tenir sur deux lignes courtes
            var words = role.example.split(" ");
            var line1 = "", line2 = "";
            words.forEach(function (w, i) {
                if (i < Math.ceil(words.length / 2)) { line1 += (line1 ? " " : "") + w; }
                else { line2 += (line2 ? " " : "") + w; }
            });
            svg.appendChild(txt(nx, ny + 20, line1, { "font-size": 9.5, fill: "#8B949E" }));
            svg.appendChild(txt(nx, ny + 32, line2, { "font-size": 9.5, fill: "#8B949E" }));
        });
    }

    function init() {
        drawSvgRoles();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
