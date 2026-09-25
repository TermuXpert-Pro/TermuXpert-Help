/* figuresvt_p3.js — Exercice 3 : Rotation d'un solide
   Roue en mouvement circulaire uniforme : n = 20,0 tours en t = 8,0 s (fréquence, période).
   Fichier autonome (aucune dépendance externe). */
(function () {
  'use strict';

  var COLORS = {
    rim: '#C5C6C7',
    spoke: '#3A4553',
    hub: '#66FCF1',
    accent: '#45A29E',
    gold: '#F4D03F',
    red: '#FF6B6B',
    text: '#C5C6C7',
    textMuted: '#8A8D93'
  };

  function render() {
    var host = document.getElementById('figExo3');
    if (!host) return;

    var deg = Math.PI / 180;
    var cx = 110, cy = 100, rTire = 55;

    var spokeAngles = [100, 172, 244, 316, 28];
    var spokeLines = '';
    for (var i = 0; i < spokeAngles.length; i++) {
      var a = spokeAngles[i] * deg;
      var x2 = cx + rTire * Math.cos(a), y2 = cy + rTire * Math.sin(a);
      var x1 = cx + 10 * Math.cos(a), y1 = cy + 10 * Math.sin(a);
      spokeLines += '<line x1="' + x1.toFixed(1) + '" y1="' + y1.toFixed(1) + '" x2="' + x2.toFixed(1) + '" y2="' + y2.toFixed(1) + '" stroke="' + COLORS.spoke + '" stroke-width="2"/>';
    }

    // Flèche de rotation (160°, rayon 45)
    var rr = 45, a0 = -100 * deg, a1 = 60 * deg;
    var sx = cx + rr * Math.cos(a0), sy = cy + rr * Math.sin(a0);
    var ex = cx + rr * Math.cos(a1), ey = cy + rr * Math.sin(a1);

    // Repère (point marqué sur le pneu pour compter les tours)
    var angR = 20 * deg;
    var rx = cx + rTire * Math.cos(angR), ry = cy + rTire * Math.sin(angR);

    host.innerHTML =
      '<defs>' +
        '<marker id="p3ArrowRot" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">' +
          '<path d="M0,0 L10,5 L0,10 z" fill="' + COLORS.accent + '"/>' +
        '</marker>' +
      '</defs>' +

      /* pneu + moyeu */
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + rTire + '" fill="none" stroke="' + COLORS.rim + '" stroke-width="3"/>' +
      spokeLines +
      '<circle cx="' + cx + '" cy="' + cy + '" r="10" fill="none" stroke="' + COLORS.hub + '" stroke-width="2"/>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="3" fill="' + COLORS.hub + '"/>' +

      /* flèche de rotation */
      '<path d="M ' + sx.toFixed(1) + ' ' + sy.toFixed(1) + ' A ' + rr + ' ' + rr + ' 0 0 1 ' + ex.toFixed(1) + ' ' + ey.toFixed(1) + '" fill="none" stroke="' + COLORS.accent + '" stroke-width="2.2" marker-end="url(#p3ArrowRot)"/>' +

      /* repère marqué sur la jante */
      '<circle cx="' + rx.toFixed(1) + '" cy="' + ry.toFixed(1) + '" r="4.5" fill="' + COLORS.gold + '"/>' +
      '<text x="' + (rx + 8).toFixed(1) + '" y="' + (ry + 12).toFixed(1) + '" font-size="9.5" fill="' + COLORS.gold + '" font-family="Arial, sans-serif">rep&#232;re</text>' +

      /* icône chronomètre (temps) */
      '<circle cx="270" cy="55" r="16" fill="none" stroke="' + COLORS.red + '" stroke-width="2"/>' +
      '<rect x="266" y="33" width="8" height="4" rx="1.5" fill="' + COLORS.red + '"/>' +
      '<line x1="270" y1="55" x2="270" y2="44" stroke="' + COLORS.red + '" stroke-width="1.8"/>' +
      '<line x1="270" y1="55" x2="278" y2="58" stroke="' + COLORS.red + '" stroke-width="1.8"/>' +
      '<text x="270" y="83" text-anchor="middle" font-size="12" fill="' + COLORS.red + '" font-family="Arial, sans-serif" font-weight="600">t = 8,0 s</text>' +

      /* icône compteur de tours */
      '<path d="M 258 118 A 16 16 0 1 1 282 118" fill="none" stroke="' + COLORS.accent + '" stroke-width="2" marker-end="url(#p3ArrowRot)"/>' +
      '<text x="270" y="123" text-anchor="middle" font-size="9" fill="' + COLORS.accent + '" font-family="Arial, sans-serif">&#215;20</text>' +
      '<text x="270" y="150" text-anchor="middle" font-size="12" fill="' + COLORS.accent + '" font-family="Arial, sans-serif" font-weight="600">n = 20,0 tours</text>' +

      /* légende */
      '<text x="175" y="182" text-anchor="middle" font-size="10.5" fill="' + COLORS.textMuted + '" font-family="Arial, sans-serif">N = n / t &#160;&#160;et&#160;&#160; T = 1 / N</text>';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();

