/* figuresvt_p6.js — Exercice 6 : Rotation d'un solide
   Tracteur : grande roue (R = 7 cm, N = 18 tr/min) et petite roue (R = 3,5 cm, N = 36 tr/min),
   chacune marquée d'un caillou blanc. Fichier autonome (aucune dépendance externe). */
(function () {
  'use strict';

  var COLORS = {
    body: '#45A29E',
    bodyEdge: '#2F6F6A',
    cabin: '#66FCF1',
    tire: '#C5C6C7',
    hub: '#0D1117',
    hubStroke: '#8A8D93',
    pebble: '#FFFFFF',
    pebbleStroke: '#5B6572',
    ground: '#3A4553',
    accent: '#45A29E',
    gold: '#F4D03F',
    text: '#C5C6C7',
    textMuted: '#8A8D93'
  };

  function drawWheel(cx, cy, r, pebbleAngleDeg, rotArcSpanDeg) {
    var deg = Math.PI / 180;
    var pa = pebbleAngleDeg * deg;
    var px = cx + r * Math.cos(pa), py = cy + r * Math.sin(pa);

    var rr = r * 0.72;
    var a0 = -100 * deg, a1 = (-100 + rotArcSpanDeg) * deg;
    var sx = cx + rr * Math.cos(a0), sy = cy + rr * Math.sin(a0);
    var ex = cx + rr * Math.cos(a1), ey = cy + rr * Math.sin(a1);

    var spokes = '';
    var angs = [10, 82, 154, 226, 298];
    for (var i = 0; i < angs.length; i++) {
      var a = angs[i] * deg;
      var x2 = cx + r * 0.85 * Math.cos(a), y2 = cy + r * 0.85 * Math.sin(a);
      var x1 = cx + r * 0.22 * Math.cos(a), y1 = cy + r * 0.22 * Math.sin(a);
      spokes += '<line x1="' + x1.toFixed(1) + '" y1="' + y1.toFixed(1) + '" x2="' + x2.toFixed(1) + '" y2="' + y2.toFixed(1) + '" stroke="' + COLORS.hubStroke + '" stroke-width="' + Math.max(1, r * 0.03) + '"/>';
    }

    return (
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + COLORS.hub + '" stroke="' + COLORS.tire + '" stroke-width="' + (r * 0.16).toFixed(1) + '"/>' +
      spokes +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + (r * 0.16).toFixed(1) + '" fill="' + COLORS.hubStroke + '"/>' +
      '<path d="M ' + sx.toFixed(1) + ' ' + sy.toFixed(1) + ' A ' + rr.toFixed(1) + ' ' + rr.toFixed(1) + ' 0 0 1 ' + ex.toFixed(1) + ' ' + ey.toFixed(1) + '" fill="none" stroke="' + COLORS.gold + '" stroke-width="1.8" marker-end="url(#p6ArrowRot)" opacity="0.9"/>' +
      '<circle cx="' + px.toFixed(1) + '" cy="' + py.toFixed(1) + '" r="' + Math.max(3, r * 0.11).toFixed(1) + '" fill="' + COLORS.pebble + '" stroke="' + COLORS.pebbleStroke + '" stroke-width="1"/>'
    );
  }

  function render() {
    var host = document.getElementById('figExo6');
    if (!host) return;

    var groundY = 170;
    var rBig = 45, rSmall = 22.5;
    var cxBig = 290, cyBig = groundY - rBig;
    var cxSmall = 110, cySmall = groundY - rSmall;

    var chassis = 'M70,' + groundY + ' L70,118 L130,95 L225,95 L225,58 L268,58 L268,118 L335,118 L335,' + groundY + ' Z';

    host.innerHTML =
      '<defs>' +
        '<marker id="p6ArrowRot" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">' +
          '<path d="M0,0 L10,5 L0,10 z" fill="' + COLORS.gold + '"/>' +
        '</marker>' +
        '<marker id="p6ArrowV" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">' +
          '<path d="M0,0 L10,5 L0,10 z" fill="' + COLORS.accent + '"/>' +
        '</marker>' +
      '</defs>' +

      /* sol */
      '<line x1="15" y1="' + groundY + '" x2="385" y2="' + groundY + '" stroke="' + COLORS.ground + '" stroke-width="2"/>' +

      /* châssis simplifié du tracteur */
      '<path d="' + chassis + '" fill="' + COLORS.body + '" fill-opacity="0.28" stroke="' + COLORS.bodyEdge + '" stroke-width="2" stroke-linejoin="round"/>' +
      '<rect x="234" y="66" width="26" height="20" rx="2" fill="' + COLORS.cabin + '" fill-opacity="0.35" stroke="' + COLORS.cabin + '" stroke-width="1.3"/>' +

      /* roues */
      drawWheel(cxBig, cyBig, rBig, -30, 150) +
      drawWheel(cxSmall, cySmall, rSmall, -30, 150) +

      /* vecteur vitesse (translation rectiligne à vitesse constante) */
      '<line x1="150" y1="34" x2="205" y2="34" stroke="' + COLORS.accent + '" stroke-width="2.4" marker-end="url(#p6ArrowV)"/>' +
      '<text x="177" y="24" text-anchor="middle" font-size="11" fill="' + COLORS.accent + '" font-family="Arial, sans-serif" font-weight="600">v = constante</text>' +

      /* étiquettes des roues */
      '<text x="' + cxSmall + '" y="187" text-anchor="middle" font-size="11" fill="' + COLORS.text + '" font-family="Arial, sans-serif" font-weight="600">R = 3,5 cm</text>' +
      '<text x="' + cxSmall + '" y="199" text-anchor="middle" font-size="10" fill="' + COLORS.textMuted + '" font-family="Arial, sans-serif">N = 36 tr/min</text>' +

      '<text x="' + cxBig + '" y="187" text-anchor="middle" font-size="11" fill="' + COLORS.text + '" font-family="Arial, sans-serif" font-weight="600">R = 7 cm</text>' +
      '<text x="' + cxBig + '" y="199" text-anchor="middle" font-size="10" fill="' + COLORS.textMuted + '" font-family="Arial, sans-serif">N = 18 tr/min</text>' +

      /* légende caillou */
      '<circle cx="18" cy="46" r="3.5" fill="' + COLORS.pebble + '" stroke="' + COLORS.pebbleStroke + '" stroke-width="1"/>' +
      '<text x="26" y="49" font-size="9.5" fill="' + COLORS.textMuted + '" font-family="Arial, sans-serif">caillou blanc (rep&#232;re)</text>';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
