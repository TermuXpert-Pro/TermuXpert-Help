/* figuresvt_p1.js — Exercice 1 : Rotation d'un solide
   Roche attachée au bout d'une corde de R = 1,00 m, mouvement circulaire uniforme.
   Fichier autonome (aucune dépendance externe). */
(function () {
  'use strict';

  var COLORS = {
    track: '#2A3340',
    text: '#C5C6C7',
    textMuted: '#8A8D93',
    accent: '#45A29E',
    accentLight: '#66FCF1',
    gold: '#F4D03F',
    rockFill: '#9AA5B1',
    rockStroke: '#3B4552'
  };

  function svgEl(id) {
    return document.getElementById(id);
  }

  function render() {
    var host = svgEl('figExo1');
    if (!host) return;

    var cx = 175, cy = 120, r = 72;

    // Point d'attache de la roche sur la trajectoire (angle -40°)
    var ax = cx + r * Math.cos(-40 * Math.PI / 180);
    var ay = cy + r * Math.sin(-40 * Math.PI / 180);

    // Flèche de rotation (rayon 58, intérieure à la trajectoire, de -95° à -42°)
    var rr = 58;
    var a0 = -95 * Math.PI / 180, a1 = -42 * Math.PI / 180;
    var sx = cx + rr * Math.cos(a0), sy = cy + rr * Math.sin(a0);
    var ex = cx + rr * Math.cos(a1), ey = cy + rr * Math.sin(a1);

    // Vecteur vitesse tangentielle au point de la roche (sens horaire)
    var vx = ax + 34 * Math.cos(-40 * Math.PI / 180 + Math.PI / 2);
    var vy = ay + 34 * Math.sin(-40 * Math.PI / 180 + Math.PI / 2);

    host.innerHTML =
      '<defs>' +
        '<marker id="p1ArrowRot" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">' +
          '<path d="M0,0 L10,5 L0,10 z" fill="' + COLORS.accent + '"/>' +
        '</marker>' +
        '<marker id="p1ArrowV" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">' +
          '<path d="M0,0 L10,5 L0,10 z" fill="' + COLORS.gold + '"/>' +
        '</marker>' +
        '<radialGradient id="p1RockGrad" cx="35%" cy="30%" r="75%">' +
          '<stop offset="0%" stop-color="#B7BFC8"/>' +
          '<stop offset="100%" stop-color="' + COLORS.rockFill + '"/>' +
        '</radialGradient>' +
      '</defs>' +

      /* trajectoire circulaire pointillée */
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="' + COLORS.track + '" stroke-width="1.6" stroke-dasharray="4,4"/>' +

      /* pivot central O (main / point fixe) */
      '<circle cx="' + cx + '" cy="' + cy + '" r="3.5" fill="' + COLORS.accentLight + '"/>' +
      '<text x="' + cx + '" y="' + (cy + 16) + '" text-anchor="middle" font-size="11" fill="' + COLORS.text + '" font-family="Arial, sans-serif">O</text>' +

      /* corde reliant O à la roche */
      '<line x1="' + cx + '" y1="' + cy + '" x2="' + ax.toFixed(1) + '" y2="' + ay.toFixed(1) + '" stroke="' + COLORS.text + '" stroke-width="1.8"/>' +

      /* étiquette R = 1,00 m */
      '<text x="193" y="90" text-anchor="middle" font-size="11.5" fill="' + COLORS.accentLight + '" font-family="Arial, sans-serif" font-weight="600">R = 1,00 m</text>' +

      /* flèche indiquant le sens de rotation */
      '<path d="M ' + sx.toFixed(1) + ' ' + sy.toFixed(1) + ' A ' + rr + ' ' + rr + ' 0 0 1 ' + ex.toFixed(1) + ' ' + ey.toFixed(1) + '" fill="none" stroke="' + COLORS.accent + '" stroke-width="2.2" marker-end="url(#p1ArrowRot)"/>' +

      /* roche (polygone irrégulier) */
      '<polygon points="' + (ax - 0.8).toFixed(1) + ',' + (ay - 11).toFixed(1) + ' ' + (ax + 8).toFixed(1) + ',' + (ay - 5).toFixed(1) + ' ' + (ax + 10).toFixed(1) + ',' + (ay + 5).toFixed(1) + ' ' + (ax + 3).toFixed(1) + ',' + (ay + 11).toFixed(1) + ' ' + (ax - 7).toFixed(1) + ',' + (ay + 8).toFixed(1) + ' ' + (ax - 9).toFixed(1) + ',' + (ay - 3).toFixed(1) + '" fill="url(#p1RockGrad)" stroke="' + COLORS.rockStroke + '" stroke-width="1.2"/>' +

      /* vecteur vitesse tangentielle */
      '<line x1="' + ax.toFixed(1) + '" y1="' + ay.toFixed(1) + '" x2="' + vx.toFixed(1) + '" y2="' + vy.toFixed(1) + '" stroke="' + COLORS.gold + '" stroke-width="2" marker-end="url(#p1ArrowV)"/>' +
      '<text x="' + (vx + 8).toFixed(1) + '" y="' + (vy + 4).toFixed(1) + '" font-size="11" fill="' + COLORS.gold + '" font-family="Arial, sans-serif" font-style="italic">v</text>' +

      /* légende */
      '<text x="175" y="205" text-anchor="middle" font-size="10.5" fill="' + COLORS.textMuted + '" font-family="Arial, sans-serif">Mouvement circulaire uniforme (n = 10,0 tours)</text>';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();

