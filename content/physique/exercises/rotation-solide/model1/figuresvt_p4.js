/* figuresvt_p4.js — Exercice 4 : Rotation d'un solide
   CD de 12 cm de diamètre (R = 6 cm), N = 215 tr/min.
   Vitesse linéaire en périphérie et à r = 2 cm du centre.
   Fichier autonome (aucune dépendance externe). */
(function () {
  'use strict';

  var COLORS = {
    disc: '#1B2735',
    discEdge: '#C5C6C7',
    ring: '#4A5568',
    hub: '#0D1117',
    hubStroke: '#8A8D93',
    gold: '#F4D03F',
    red: '#FF6B6B',
    accent: '#45A29E',
    accentLight: '#66FCF1',
    text: '#C5C6C7',
    textMuted: '#8A8D93'
  };

  function render() {
    var host = document.getElementById('figExo4');
    if (!host) return;

    var deg = Math.PI / 180;
    var cx = 150, cy = 110, R = 80; // R = 80px représente 6 cm réels
    var rB = R * (2 / 6); // point à 2 cm -> 26.7 px

    // Point A en périphérie (r = R = 6 cm)
    var angA = -20 * deg;
    var ax = cx + R * Math.cos(angA), ay = cy + R * Math.sin(angA);
    var tanA = angA + Math.PI / 2;
    var avx = ax + 40 * Math.cos(tanA), avy = ay + 40 * Math.sin(tanA);

    // Point B à 2 cm du centre
    var angB = -120 * deg;
    var bx = cx + rB * Math.cos(angB), by = cy + rB * Math.sin(angB);
    var tanB = angB + Math.PI / 2;
    var bvx = bx + 13.3 * Math.cos(tanB), bvy = by + 13.3 * Math.sin(tanB);

    // Flèche de rotation (extérieure au disque)
    var rr = 95, a0 = -160 * deg, a1 = -60 * deg;
    var sx = cx + rr * Math.cos(a0), sy = cy + rr * Math.sin(a0);
    var ex = cx + rr * Math.cos(a1), ey = cy + rr * Math.sin(a1);

    host.innerHTML =
      '<defs>' +
        '<marker id="p4ArrowV" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">' +
          '<path d="M0,0 L10,5 L0,10 z" fill="' + COLORS.gold + '"/>' +
        '</marker>' +
        '<marker id="p4ArrowV2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto-start-reverse">' +
          '<path d="M0,0 L10,5 L0,10 z" fill="' + COLORS.red + '"/>' +
        '</marker>' +
        '<marker id="p4ArrowRot" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">' +
          '<path d="M0,0 L10,5 L0,10 z" fill="' + COLORS.accent + '"/>' +
        '</marker>' +
        '<radialGradient id="p4DiscGrad" cx="40%" cy="35%" r="70%">' +
          '<stop offset="0%" stop-color="#2A3B4D"/>' +
          '<stop offset="100%" stop-color="' + COLORS.disc + '"/>' +
        '</radialGradient>' +
      '</defs>' +

      /* disque (CD) */
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + R + '" fill="url(#p4DiscGrad)" stroke="' + COLORS.discEdge + '" stroke-width="2"/>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + (R * 0.75).toFixed(1) + '" fill="none" stroke="' + COLORS.ring + '" stroke-width="0.8" opacity="0.35"/>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + (R * 0.5).toFixed(1) + '" fill="none" stroke="' + COLORS.ring + '" stroke-width="0.8" opacity="0.35"/>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="14" fill="' + COLORS.hub + '" stroke="' + COLORS.hubStroke + '" stroke-width="1.5"/>' +
      '<text x="' + cx + '" y="' + (cy + 4) + '" text-anchor="middle" font-size="10" fill="' + COLORS.textMuted + '" font-family="Arial, sans-serif">O</text>' +

      /* rayon O-A = R = 6 cm */
      '<line x1="' + cx + '" y1="' + cy + '" x2="' + ax.toFixed(1) + '" y2="' + ay.toFixed(1) + '" stroke="' + COLORS.gold + '" stroke-width="1.5" stroke-dasharray="4,3"/>' +
      '<text x="194" y="108" font-size="11" fill="' + COLORS.gold + '" font-family="Arial, sans-serif" font-weight="600">R = 6 cm</text>' +

      /* rayon O-B = r = 2 cm */
      '<line x1="' + cx + '" y1="' + cy + '" x2="' + bx.toFixed(1) + '" y2="' + by.toFixed(1) + '" stroke="' + COLORS.red + '" stroke-width="1.5" stroke-dasharray="4,3"/>' +
      '<text x="155" y="90" font-size="10" fill="' + COLORS.red + '" font-family="Arial, sans-serif" font-weight="600">r = 2 cm</text>' +

      /* point A (périphérie) + vecteur vitesse */
      '<circle cx="' + ax.toFixed(1) + '" cy="' + ay.toFixed(1) + '" r="4" fill="' + COLORS.gold + '"/>' +
      '<line x1="' + ax.toFixed(1) + '" y1="' + ay.toFixed(1) + '" x2="' + avx.toFixed(1) + '" y2="' + avy.toFixed(1) + '" stroke="' + COLORS.gold + '" stroke-width="2" marker-end="url(#p4ArrowV)"/>' +
      '<text x="' + (avx + 6).toFixed(1) + '" y="' + (avy + 4).toFixed(1) + '" font-size="10.5" fill="' + COLORS.gold + '" font-family="Arial, sans-serif" font-style="italic">v&#8321;</text>' +

      /* point B (r = 2 cm) + vecteur vitesse */
      '<circle cx="' + bx.toFixed(1) + '" cy="' + by.toFixed(1) + '" r="3.5" fill="' + COLORS.red + '"/>' +
      '<line x1="' + bx.toFixed(1) + '" y1="' + by.toFixed(1) + '" x2="' + bvx.toFixed(1) + '" y2="' + bvy.toFixed(1) + '" stroke="' + COLORS.red + '" stroke-width="1.8" marker-end="url(#p4ArrowV2)"/>' +
      '<text x="' + (bvx - 30).toFixed(1) + '" y="' + (bvy - 8).toFixed(1) + '" font-size="10" fill="' + COLORS.red + '" font-family="Arial, sans-serif" font-style="italic">v&#8322;</text>' +

      /* flèche de rotation + N */
      '<path d="M ' + sx.toFixed(1) + ' ' + sy.toFixed(1) + ' A ' + rr + ' ' + rr + ' 0 0 1 ' + ex.toFixed(1) + ' ' + ey.toFixed(1) + '" fill="none" stroke="' + COLORS.accent + '" stroke-width="2.2" marker-end="url(#p4ArrowRot)"/>' +
      '<text x="150" y="14" text-anchor="middle" font-size="12" fill="' + COLORS.accent + '" font-family="Arial, sans-serif" font-weight="600">N = 215 tr/min</text>' +

      /* légende */
      '<text x="175" y="210" text-anchor="middle" font-size="10.5" fill="' + COLORS.textMuted + '" font-family="Arial, sans-serif">v&#8321; (p&#233;riph&#233;rie) &gt; v&#8322; (r = 2 cm) &#160;: v = r&#183;&#969;</text>';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
