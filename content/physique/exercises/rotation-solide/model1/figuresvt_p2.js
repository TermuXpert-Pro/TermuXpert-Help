/* figuresvt_p2.js — Exercice 2 : Rotation d'un solide
   Point P situé à une distance R du centre O d'une roue ; d = 3,0 m parcourus en 1 tour.
   Fichier autonome (aucune dépendance externe). */
(function () {
  'use strict';

  var COLORS = {
    rim: '#C5C6C7',
    hub: '#66FCF1',
    spoke: '#3A4553',
    track: '#2A3340',
    text: '#C5C6C7',
    textMuted: '#8A8D93',
    accent: '#45A29E',
    gold: '#F4D03F'
  };

  function render() {
    var host = document.getElementById('figExo2');
    if (!host) return;

    var cx = 175, cy = 118, rTire = 72, rArc = 80;
    var deg = Math.PI / 180;

    // Point P sur la jante
    var angP = -19 * deg;
    var px = cx + rTire * Math.cos(angP), py = cy + rTire * Math.sin(angP);

    // Arc "1 tour" (presque complet, 340°) légèrement à l'extérieur du pneu
    var a0 = -19 * deg, a1 = (-19 + 340) * deg;
    var sx = cx + rArc * Math.cos(a0), sy = cy + rArc * Math.sin(a0);
    var ex = cx + rArc * Math.cos(a1), ey = cy + rArc * Math.sin(a1);

    var spokes = [18, 90, 162, 234, 306];
    var spokeLines = '';
    for (var i = 0; i < spokes.length; i++) {
      var a = spokes[i] * deg;
      var x2 = cx + rTire * Math.cos(a), y2 = cy + rTire * Math.sin(a);
      var x1 = cx + 11 * Math.cos(a), y1 = cy + 11 * Math.sin(a);
      spokeLines += '<line x1="' + x1.toFixed(1) + '" y1="' + y1.toFixed(1) + '" x2="' + x2.toFixed(1) + '" y2="' + y2.toFixed(1) + '" stroke="' + COLORS.spoke + '" stroke-width="2.2"/>';
    }

    host.innerHTML =
      '<defs>' +
        '<marker id="p2ArrowD" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">' +
          '<path d="M0,0 L10,5 L0,10 z" fill="' + COLORS.accent + '"/>' +
        '</marker>' +
      '</defs>' +

      /* jante (pneu) */
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + rTire + '" fill="none" stroke="' + COLORS.rim + '" stroke-width="3"/>' +
      spokeLines +
      /* moyeu */
      '<circle cx="' + cx + '" cy="' + cy + '" r="11" fill="none" stroke="' + COLORS.hub + '" stroke-width="2"/>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="3" fill="' + COLORS.hub + '"/>' +
      '<text x="' + cx + '" y="' + (cy - 16) + '" text-anchor="middle" font-size="11" fill="' + COLORS.text + '" font-family="Arial, sans-serif">O</text>' +

      /* rayon O-P en pointillé */
      '<line x1="' + cx + '" y1="' + cy + '" x2="' + px.toFixed(1) + '" y2="' + py.toFixed(1) + '" stroke="' + COLORS.gold + '" stroke-width="1.6" stroke-dasharray="4,3"/>' +
      '<text x="' + (cx + (px - cx) * 0.5 + 10).toFixed(1) + '" y="' + (cy + (py - cy) * 0.5 - 4).toFixed(1) + '" font-size="11.5" fill="' + COLORS.gold + '" font-family="Arial, sans-serif" font-weight="600">R</text>' +

      /* point P */
      '<circle cx="' + px.toFixed(1) + '" cy="' + py.toFixed(1) + '" r="4" fill="#FF6B6B"/>' +
      '<text x="' + (px + 8).toFixed(1) + '" y="' + (py + 3).toFixed(1) + '" font-size="12" fill="#FF6B6B" font-family="Arial, sans-serif" font-weight="700">P</text>' +

      /* arc représentant 1 tour complet */
      '<path d="M ' + sx.toFixed(1) + ' ' + sy.toFixed(1) + ' A ' + rArc + ' ' + rArc + ' 0 1 1 ' + ex.toFixed(1) + ' ' + ey.toFixed(1) + '" fill="none" stroke="' + COLORS.accent + '" stroke-width="2" stroke-dasharray="1,0" marker-end="url(#p2ArrowD)"/>' +

      /* légende */
      '<text x="175" y="213" text-anchor="middle" font-size="10.5" fill="' + COLORS.textMuted + '" font-family="Arial, sans-serif">1 tour complet de P &#8658; d = 2&#960;R = 3,0 m</text>';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
