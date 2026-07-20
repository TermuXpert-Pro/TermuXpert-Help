// ============================================================
// figuresvt.js - رسومات درس "Les réactions acido-basiques"
// كنديرو svg يدوي (بلا محاور رياضية) للمخططات التوضيحية
// ديال التجارب. كيتحمل هاذ الملف بعد svg-utils.js فكل صفحة محتاجاه
// (حتى إلا ماستعملناهاش فهاذ الدرس، كنخليوه لضمان التوافق مع باقي
// أدوات الموقع).
// ============================================================

function svtEl(tag, attrs) {
    const NS = 'http://www.w3.org/2000/svg';
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    return e;
}

// ============================================================
// 1) schemaActivite1 : تفاعل محلول كلور الأمونيوم مع محلول الصود
//    تصاعد غاز الأمونياك NH3 الذي يُزرّق ورقة مبللة بكبريتات النحاس
// ============================================================
function drawSchemaActivite1() {
    const svg = document.getElementById('schemaActivite1');
    if (!svg) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    const W = 360, H = 260;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

    // --- Support/statif (potence) ---
    svg.appendChild(svtEl('line', { x1: 40, y1: 240, x2: 40, y2: 30, stroke: '#888', 'stroke-width': 4 }));
    svg.appendChild(svtEl('line', { x1: 40, y1: 240, x2: 100, y2: 240, stroke: '#888', 'stroke-width': 4 }));

    // --- Tube à essai incliné contenant le mélange ---
    const tube = svtEl('path', {
        d: 'M 110,90 L 260,150 C 275,156 280,175 267,188 L 250,200 C 237,208 220,205 213,190 L 110,90 Z',
        fill: 'none', stroke: '#4ECDC4', 'stroke-width': 3
    });
    svg.appendChild(tube);

    // --- Liquide dans le tube (mélange NH4Cl + NaOH) ---
    const liquid = svtEl('path', {
        d: 'M 170,140 L 260,150 C 275,156 280,175 267,188 L 250,200 C 237,208 220,205 213,190 L 170,140 Z',
        fill: '#2E1F4A', opacity: 0.85
    });
    svg.appendChild(liquid);

    // --- pinces de fixation ---
    svg.appendChild(svtEl('rect', { x: 30, y: 110, width: 20, height: 8, rx: 2, fill: '#F4D03F' }));

    // --- Tube de dégagement recourbé menant au papier réactif ---
    svg.appendChild(svtEl('path', {
        d: 'M 118,95 C 100,75 110,45 140,35',
        fill: 'none', stroke: '#4ECDC4', 'stroke-width': 3
    }));

    // --- Papier imbibé de sulfate de cuivre (bleuit) ---
    svg.appendChild(svtEl('rect', { x: 128, y: 15, width: 26, height: 22, rx: 2, fill: '#4D9DE0', opacity: 0.8, stroke: '#4ECDC4', 'stroke-width': 1 }));
    const paperLabel = svtEl('text', { x: 141, y: 12, 'text-anchor': 'middle', 'font-size': 9, fill: '#4D9DE0', 'font-family': 'Arial, sans-serif' });
    paperLabel.textContent = 'papier CuSO₄';
    svg.appendChild(paperLabel);
    const bluLabel = svtEl('text', { x: 141, y: 50, 'text-anchor': 'middle', 'font-size': 8, fill: '#4D9DE0', 'font-family': 'Arial, sans-serif' });
    bluLabel.textContent = '(bleuit)';
    svg.appendChild(bluLabel);

    // --- Flèches de vapeurs blanches d'ammoniac ---
    for (let i = 0; i < 3; i++) {
        const cx = 100 - i * 6, cy = 68 - i * 10;
        svg.appendChild(svtEl('circle', { cx, cy, r: 5 - i * 0.7, fill: '#FFFFFF', opacity: 0.5 - i * 0.1 }));
    }

    // --- Étiquettes des espèces dans le tube ---
    const label1 = svtEl('text', { x: 232, y: 172, 'text-anchor': 'middle', 'font-size': 10, fill: '#F4D03F', 'font-family': 'Arial, sans-serif', 'font-weight': 'bold' });
    label1.textContent = 'NH₄⁺+ Cl⁻';
    svg.appendChild(label1);
    const plusLabel = svtEl('text', { x: 232, y: 218, 'text-anchor': 'middle', 'font-size': 10, fill: '#4ECDC4', 'font-family': 'Arial, sans-serif' });
    plusLabel.textContent = '+ Na⁺ + HO⁻ (soude)';
    svg.appendChild(plusLabel);

    // --- Étiquette gaz ---
    const gasLabel = svtEl('text', { x: 95, y: 62, 'text-anchor': 'middle', 'font-size': 10, fill: '#BB8FCE', 'font-family': 'Arial, sans-serif', 'font-weight': 'bold' });
    gasLabel.textContent = 'NH₃ (gaz)';
    svg.appendChild(gasLabel);

    // --- Titre en bas ---
    const title = svtEl('text', { x: 180, y: 245, 'text-anchor': 'middle', 'font-size': 10, fill: 'var(--text-muted)', 'font-family': 'Arial, sans-serif' });
    title.textContent = "Dégagement d'ammoniac : le papier au sulfate de cuivre bleuit";
    svg.appendChild(title);
}

// ============================================================
// 2) schemaActivite2 : acide chlorhydrique gazeux + ammoniac gazeux
//    → fumées blanches de chlorure d'ammonium NH4Cl
// ============================================================
function drawSchemaActivite2() {
    const svg = document.getElementById('schemaActivite2');
    if (!svg) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    const W = 360, H = 220;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

    // --- Flacon gauche : ammoniac ---
    svg.appendChild(svtEl('rect', { x: 30, y: 90, width: 60, height: 90, rx: 6, fill: 'none', stroke: '#4ECDC4', 'stroke-width': 3 }));
    svg.appendChild(svtEl('rect', { x: 42, y: 70, width: 36, height: 22, rx: 4, fill: 'none', stroke: '#4ECDC4', 'stroke-width': 3 }));
    const lbl1 = svtEl('text', { x: 60, y: 190, 'text-anchor': 'middle', 'font-size': 10, fill: '#4ECDC4', 'font-family': 'Arial, sans-serif', 'font-weight': 'bold' });
    lbl1.textContent = 'NH₃ (g)';
    svg.appendChild(lbl1);

    // --- Flacon droit : acide chlorhydrique gazeux ---
    svg.appendChild(svtEl('rect', { x: 270, y: 90, width: 60, height: 90, rx: 6, fill: 'none', stroke: '#F4A63C', 'stroke-width': 3 }));
    svg.appendChild(svtEl('rect', { x: 282, y: 70, width: 36, height: 22, rx: 4, fill: 'none', stroke: '#F4A63C', 'stroke-width': 3 }));
    const lbl2 = svtEl('text', { x: 300, y: 190, 'text-anchor': 'middle', 'font-size': 10, fill: '#F4A63C', 'font-family': 'Arial, sans-serif', 'font-weight': 'bold' });
    lbl2.textContent = 'HCl (g)';
    svg.appendChild(lbl2);

    // --- Nuage de fumées blanches (NH4Cl) au centre ---
    const cloudCenters = [
        [150, 110, 22], [180, 100, 26], [210, 112, 22],
        [165, 130, 20], [195, 132, 20], [180, 145, 18]
    ];
    cloudCenters.forEach(([cx, cy, r]) => {
        svg.appendChild(svtEl('circle', { cx, cy, r, fill: '#FFFFFF', opacity: 0.55, stroke: '#EAEAEA', 'stroke-width': 0.5 }));
    });
    const lbl3 = svtEl('text', { x: 180, y: 75, 'text-anchor': 'middle', 'font-size': 10, fill: '#EAEAEA', 'font-family': 'Arial, sans-serif', 'font-weight': 'bold' });
    lbl3.textContent = 'fumées blanches de NH₄Cl';
    svg.appendChild(lbl3);

    // --- flèches de rapprochement ---
    svg.appendChild(svtEl('line', { x1: 95, y1: 130, x2: 140, y2: 122, stroke: '#4ECDC4', 'stroke-width': 2 }));
    svg.appendChild(svtEl('polygon', { points: '145,120 135,117 137,127', fill: '#4ECDC4' }));
    svg.appendChild(svtEl('line', { x1: 265, y1: 130, x2: 220, y2: 122, stroke: '#F4A63C', 'stroke-width': 2 }));
    svg.appendChild(svtEl('polygon', { points: '215,120 225,117 223,127', fill: '#F4A63C' }));

    const title = svtEl('text', { x: 180, y: 210, 'text-anchor': 'middle', 'font-size': 10, fill: 'var(--text-muted)', 'font-family': 'Arial, sans-serif' });
    title.textContent = 'Rencontre des deux gaz : formation de fumées blanches (transfert de H⁺)';
    svg.appendChild(title);
}

// ============================================================
// 3) schemaAmpholyteEau : la molécule d'eau se comporte comme
//    une base (couple H3O+/H2O) et comme un acide (couple H2O/HO-)
// ============================================================
function drawSchemaAmpholyteEau() {
    const svg = document.getElementById('schemaAmpholyteEau');
    if (!svg) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    const W = 360, H = 220;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

    // --- H2O au centre ---
    svg.appendChild(svtEl('circle', { cx: 180, cy: 110, r: 30, fill: '#0D1117', stroke: '#4ECDC4', 'stroke-width': 2.5 }));
    const h2o = svtEl('text', { x: 180, y: 116, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 'bold', fill: '#4ECDC4', 'font-family': 'Arial, sans-serif' });
    h2o.textContent = 'H₂O';
    svg.appendChild(h2o);

    // --- à gauche : H3O+ (H2O agit comme base, capte H+) ---
    svg.appendChild(svtEl('circle', { cx: 60, cy: 110, r: 30, fill: '#0D1117', stroke: '#F4A63C', 'stroke-width': 2.5 }));
    const h3o = svtEl('text', { x: 60, y: 116, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 'bold', fill: '#F4A63C', 'font-family': 'Arial, sans-serif' });
    h3o.textContent = 'H₃O⁺';
    svg.appendChild(h3o);

    // flèche H3O+ -> H2O (perd H+) au-dessus, et H2O -> H3O+ (gagne H+) en dessous
    svg.appendChild(svtEl('line', { x1: 92, y1: 100, x2: 148, y2: 100, stroke: '#F4A63C', 'stroke-width': 2 }));
    svg.appendChild(svtEl('polygon', { points: '153,100 143,96 143,104', fill: '#F4A63C' }));
    svg.appendChild(svtEl('line', { x1: 148, y1: 122, x2: 92, y2: 122, stroke: '#F4A63C', 'stroke-width': 2 }));
    svg.appendChild(svtEl('polygon', { points: '87,122 97,118 97,126', fill: '#F4A63C' }));
    const lblGauche = svtEl('text', { x: 120, y: 92, 'text-anchor': 'middle', 'font-size': 9, fill: '#F4A63C', 'font-family': 'Arial, sans-serif' });
    lblGauche.textContent = '+ H⁺';
    svg.appendChild(lblGauche);
    const coupleGauche = svtEl('text', { x: 120, y: 150, 'text-anchor': 'middle', 'font-size': 9, fill: '#F4A63C', 'font-family': 'Arial, sans-serif', 'font-weight': 'bold' });
    coupleGauche.textContent = 'couple H₃O⁺/H₂O';
    svg.appendChild(coupleGauche);
    const roleGauche = svtEl('text', { x: 120, y: 162, 'text-anchor': 'middle', 'font-size': 8, fill: 'var(--text-muted)', 'font-family': 'Arial, sans-serif' });
    roleGauche.textContent = "l'eau est la base";
    svg.appendChild(roleGauche);

    // --- à droite : HO- (H2O agit comme acide, cède H+) ---
    svg.appendChild(svtEl('circle', { cx: 300, cy: 110, r: 30, fill: '#0D1117', stroke: '#4D9DE0', 'stroke-width': 2.5 }));
    const ho = svtEl('text', { x: 300, y: 116, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 'bold', fill: '#4D9DE0', 'font-family': 'Arial, sans-serif' });
    ho.textContent = 'HO⁻';
    svg.appendChild(ho);

    svg.appendChild(svtEl('line', { x1: 212, y1: 100, x2: 268, y2: 100, stroke: '#4D9DE0', 'stroke-width': 2 }));
    svg.appendChild(svtEl('polygon', { points: '273,100 263,96 263,104', fill: '#4D9DE0' }));
    svg.appendChild(svtEl('line', { x1: 268, y1: 122, x2: 212, y2: 122, stroke: '#4D9DE0', 'stroke-width': 2 }));
    svg.appendChild(svtEl('polygon', { points: '207,122 217,118 217,126', fill: '#4D9DE0' }));
    const lblDroite = svtEl('text', { x: 240, y: 92, 'text-anchor': 'middle', 'font-size': 9, fill: '#4D9DE0', 'font-family': 'Arial, sans-serif' });
    lblDroite.textContent = '+ H⁺';
    svg.appendChild(lblDroite);
    const coupleDroite = svtEl('text', { x: 240, y: 150, 'text-anchor': 'middle', 'font-size': 9, fill: '#4D9DE0', 'font-family': 'Arial, sans-serif', 'font-weight': 'bold' });
    coupleDroite.textContent = 'couple H₂O/HO⁻';
    svg.appendChild(coupleDroite);
    const roleDroite = svtEl('text', { x: 240, y: 162, 'text-anchor': 'middle', 'font-size': 8, fill: 'var(--text-muted)', 'font-family': 'Arial, sans-serif' });
    roleDroite.textContent = "l'eau est l'acide";
    svg.appendChild(roleDroite);

    const title = svtEl('text', { x: 180, y: 200, 'text-anchor': 'middle', 'font-size': 10, fill: 'var(--text-muted)', 'font-family': 'Arial, sans-serif' });
    title.textContent = "L'eau appartient à deux couples : c'est un ampholyte";
    svg.appendChild(title);
}

// ============================================================
// 4) schemaIndicateurs : bandes de couleur des trois indicateurs
//    colorés acido-basiques usuels (forme acide / forme basique)
// ============================================================
function drawSchemaIndicateurs() {
    const svg = document.getElementById('schemaIndicateurs');
    if (!svg) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    const W = 360, H = 200;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

    const rows = [
        { name: 'Hélianthine', acidColor: '#E74C3C', baseColor: '#F4D03F', acidLabel: 'rouge', baseLabel: 'jaune', zone: '3,1 < pH < 4,4' },
        { name: 'BBT', acidColor: '#F4D03F', baseColor: '#4D9DE0', acidLabel: 'jaune', baseLabel: 'bleu', zone: '6,0 < pH < 7,6' },
        { name: 'Phénolphtaléine', acidColor: '#EAEAEA', baseColor: '#D46FB0', acidLabel: 'incolore', baseLabel: 'rose-violacé', zone: '8,2 < pH < 10' }
    ];

    rows.forEach((row, i) => {
        const y = 15 + i * 62;
        // nom de l'indicateur
        const nameText = svtEl('text', { x: 5, y: y + 16, 'font-size': 11, fill: 'var(--text-secondary)', 'font-family': 'Arial, sans-serif', 'font-weight': 'bold' });
        nameText.textContent = row.name;
        svg.appendChild(nameText);

        // bande forme acide
        svg.appendChild(svtEl('rect', { x: 5, y: y + 22, width: 150, height: 24, rx: 4, fill: row.acidColor, stroke: '#555', 'stroke-width': 0.5 }));
        const acidText = svtEl('text', { x: 80, y: y + 38, 'text-anchor': 'middle', 'font-size': 9, fill: row.acidColor === '#EAEAEA' ? '#333' : '#0D1117', 'font-family': 'Arial, sans-serif', 'font-weight': 'bold' });
        acidText.textContent = row.acidLabel;
        svg.appendChild(acidText);

        // flèche
        svg.appendChild(svtEl('line', { x1: 160, y1: y + 34, x2: 200, y2: y + 34, stroke: 'var(--text-muted)', 'stroke-width': 1.5 }));
        svg.appendChild(svtEl('polygon', { points: `205,${y+34} 197,${y+30} 197,${y+38}`, fill: 'var(--text-muted)' }));

        // bande forme basique
        svg.appendChild(svtEl('rect', { x: 210, y: y + 22, width: 145, height: 24, rx: 4, fill: row.baseColor, stroke: '#555', 'stroke-width': 0.5 }));
        const baseText = svtEl('text', { x: 282, y: y + 38, 'text-anchor': 'middle', 'font-size': 9, fill: '#0D1117', 'font-family': 'Arial, sans-serif', 'font-weight': 'bold' });
        baseText.textContent = row.baseLabel;
        svg.appendChild(baseText);

        // zone de virage
        const zoneText = svtEl('text', { x: 355, y: y + 16, 'text-anchor': 'end', 'font-size': 8, fill: 'var(--text-muted)', 'font-family': 'Arial, sans-serif' });
        zoneText.textContent = row.zone;
        svg.appendChild(zoneText);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    setTimeout(drawSchemaActivite1, 400);
    setTimeout(drawSchemaActivite2, 400);
    setTimeout(drawSchemaAmpholyteEau, 400);
    setTimeout(drawSchemaIndicateurs, 400);
});
