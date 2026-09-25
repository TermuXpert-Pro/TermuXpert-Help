/* figuresvt_p5.js — Exercice 5 : Rotation d'un solide
   Scie circulaire, diamètre 50 cm (R = 25 cm), vitesse linéaire d'une dent v = 36 m/s.
   Fichier autonome (aucune dépendance externe). */
(function () {
  'use strict';

  var COLORS = {
    blade: '#3A4553',
    bladeEdge: '#8A98A8',
    tooth: '#5B6B7D',
    toothHi: '#F4D03F',
    hub: '#0D1117',
    hubStroke: '#8A8D93',
    gold: '#F4D03F',
    accent: '#45A29E',
    text: '#C5C6C7',
    textMuted: '#8A8D93'
  };

  function render() {
    var host = document.getElementById('figExo5');
    if (!host) return;

    var deg = Math.PI / 180;
    var cx = 150, cy = 100;
    var rBase = 78, rTip = 90;
    var nTeeth = 16;
    var step = 360 / nTeeth;
    var hiIndex = 3; // dent mise en évidence
    var hiAngle = -90 + hiIndex * step;

    var teeth = '';
    for (var i = 0; i < nTeeth; i++) {
      var a = (-90 + i * step) * deg;
      var aL = (-90 + i * step - step * 0.32) * deg;
      var aR = (-90 + i * step + step * 0.32) * deg;
      var bxL = cx + rBase * Math.cos(aL), byL = cy + rBase * Math.sin(aL);
      var bxR = cx + rBase * Math.cos(aR), byR = cy + rBase * Math.sin(aR);
      var tx = cx + rTip * Math.cos(a), ty = cy + rTip * Math.sin(a);
      var fill = (i === hiIndex) ? COLORS.toothHi : COLORS.tooth;
      teeth += '<polygon points="' + bxL.toFixed(1) + ',' + byL.toFixed(1) + ' ' + tx.toFixed(1) + ',' + ty.toFixed(1) + ' ' + bxR.toFixed(1) + ',' + byR.toFixed(1) + '" fill="' + fill + '" stroke="' + COLORS.bladeEdge + '" stroke-width="0.6"/>';
    }

    // Dent mise en évidence : point + vecteur vitesse tangentiel + rayon
    var haRad = hiAngle * deg;
    var hx = cx + rTip * Math.cos(haRad), hy = cy + rTip * Math.sin(haRad);
    var tan = haRad + Math.PI / 2;
    var vx = hx + 42 * Math.cos(tan), vy = hy + 42 * Math.sin(tan);

    // Flèche de rotation
    var rr = 105, a0 = -150 * deg, a1 = -40 * deg;
    var sx = cx + rr * Math.cos(a0), sy = cy + rr * Math.sin(a0);
    var ex = cx + rr * Math.cos(a1), ey = cy + rr * Math.sin(a1);

    host.innerHTML =
      '<defs>' +
        '<marker id="p5ArrowV" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">' +
          '<path d="M0,0 L10,5 L0,10 z" fill="' + COLORS.gold + '"/>' +
        '</marker>' +
        '<marker id="p5ArrowRot" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">' +
          '<path d="M0,0 L10,5 L0,10 z" fill="' + COLORS.accent + '"/>' +
        '</marker>' +
      '</defs>' +

      /* disque de la scie */
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + rBase + '" fill="' + COLORS.blade + '" stroke="' + COLORS.bladeEdge + '" stroke-width="1.5"/>' +
      teeth +
      '<circle cx="' + cx + '" cy="' + cy + '" r="12" fill="' + COLORS.hub + '" stroke="' + COLORS.hubStroke + '" stroke-width="1.5"/>' +
      '<text x="' + cx + '" y="' + (cy + 4) + '" text-anchor="middle" font-size="10" fill="' + COLORS.textMuted + '" font-family="Arial, sans-serif">O</text>' +

      /* rayon O -> dent mise en évidence */
      '<line x1="' + cx + '" y1="' + cy + '" x2="' + hx.toFixed(1) + '" y2="' + hy.toFixed(1) + '" stroke="' + COLORS.gold + '" stroke-width="1.5" stroke-dasharray="4,3"/>' +
      '<text x="' + (cx + (hx - cx) * 0.45 + 8).toFixed(1) + '" y="' + (cy + (hy - cy) * 0.45).toFixed(1) + '" font-size="11" fill="' + COLORS.gold + '" font-family="Arial, sans-serif" font-weight="600">R = 25 cm</text>' +

      /* vecteur vitesse de la dent */
      '<line x1="' + hx.toFixed(1) + '" y1="' + hy.toFixed(1) + '" x2="' + vx.toFixed(1) + '" y2="' + vy.toFixed(1) + '" stroke="' + COLORS.gold + '" stroke-width="2.2" marker-end="url(#p5ArrowV)"/>' +
      '<text x="' + (vx + 6).toFixed(1) + '" y="' + (vy + 10).toFixed(1) + '" font-size="11" fill="' + COLORS.gold + '" font-family="Arial, sans-serif" font-weight="600">v = 36 m/s</text>' +

      /* flèche de rotation */
      '<path d="M ' + sx.toFixed(1) + ' ' + sy.toFixed(1) + ' A ' + rr + ' ' + rr + ' 0 0 1 ' + ex.toFixed(1) + ' ' + ey.toFixed(1) + '" fill="none" stroke="' + COLORS.accent + '" stroke-width="2" marker-end="url(#p5ArrowRot)"/>' +

      /* légende */
      '<text x="175" y="198" text-anchor="middle" font-size="10.5" fill="' + COLORS.textMuted + '" font-family="Arial, sans-serif">Diam&#232;tre = 50 cm &#160;&#8658;&#160; R = 25 cm ; v = R&#183;&#969;</text>';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();

