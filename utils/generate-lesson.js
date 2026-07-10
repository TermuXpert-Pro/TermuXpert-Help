#!/usr/bin/env node
/**
 * generate-lesson.js
 * أداة لإنشاء دروس جديدة بسرعة
 * 
 * الاستخدام:
 * node utils/generate-lesson.js --subject math --id recurrence --title "Raisonnement par récurrence" --parts 3
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const params = {};

args.forEach(arg => {
    if (arg.startsWith('--')) {
        const [key, value] = arg.slice(2).split('=');
        params[key] = value || true;
    }
});

const subject = params.subject || 'math';
const id = params.id || 'new-lesson';
const title = params.title || 'Nouveau cours';
const parts = parseInt(params.parts) || 3;

const basePath = path.join(__dirname, '..', 'content', subject, 'lessons', id);
const templatePath = path.join(__dirname, '..', 'templates', 'part-template.html');

// إنشاء مجلد الدرس
if (!fs.existsSync(basePath)) {
    fs.mkdirSync(basePath, { recursive: true });
}

// إنشاء صفحة index.html
const indexContent = `<!DOCTYPE html>
<html lang="fr" dir="ltr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - ${subject} - Xpert</title>
    <link rel="stylesheet" href="../../../assets/css/style.css">
    <link rel="stylesheet" href="../../../assets/css/lesson-common.css">
</head>
<body>
    <nav class="navbar" id="navbar">
        <a href="../../../index.html" class="nav-logo">
            <div class="nav-logo-icon">X</div>
            <div class="nav-logo-text"><span>X</span>pert</div>
        </a>
        <ul class="nav-links">
            <li><a href="../../../index.html"><i class="fas fa-house"></i> Accueil</a></li>
            <li><a href="../../../subjects.html"><i class="fas fa-book-open"></i> Matières</a></li>
        </ul>
    </nav>

    <div style="max-width:900px; margin:0 auto; padding:60px 12px 20px;">
        <a href="../../../subject.html?subject=${subject}" class="back-btn"><i class="fas fa-arrow-right"></i> Retour</a>
        <div class="lesson-container">
            <h1 class="lesson-title"><i class="fas fa-book" style="color:#4ECDC4;"></i> ${title}</h1>
            <p style="text-align:center; color:var(--text-muted); font-size:12px; margin-bottom:16px;">
                Choisissez une partie pour commencer
            </p>
            <div class="section-list" style="max-width:700px; margin:0 auto;">`;

for (let i = 1; i <= parts; i++) {
    const partTitle = i === parts ? 'Exercices' : `Partie ${i}`;
    indexContent += `
                <a href="part${i}.html" class="part-link" style="display:block; background:var(--bg-card); border:1px solid var(--border); border-radius:8px; padding:8px 12px; margin-bottom:8px; color:var(--text-primary); text-decoration:none; transition:all 0.3s ease; cursor:pointer;">
                    <div style="display:flex; align-items:center; gap:10px;">
                        <span style="color:#4ECDC4; font-size:18px; flex-shrink:0;"><i class="fas fa-book"></i></span>
                        <div style="flex:1;">
                            <div style="color:#4ECDC4; font-weight:700; font-size:13px;">Partie ${i}</div>
                            <div style="color:var(--text-secondary); font-size:12px; line-height:1.4;">${partTitle}</div>
                        </div>
                        <span style="color:var(--text-muted); font-size:12px; flex-shrink:0;"><i class="fas fa-chevron-left"></i></span>
                    </div>
                </a>`;
}

indexContent += `
            </div>
        </div>
    </div>
    <footer class="footer">
        <div class="divider"></div>
        <p>Xpert &copy; 2026 - 1 Bac Sciences Expérimentales</p>
    </footer>
    <script src="../../../assets/js/script.js"></script>
</body>
</html>`;

fs.writeFileSync(path.join(basePath, 'index.html'), indexContent);

// إنشاء أجزاء الدرس
for (let i = 1; i <= parts; i++) {
    const partContent = `<!DOCTYPE html>
<html lang="fr" dir="ltr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Partie ${i} - ${title} - Xpert</title>
    <link rel="stylesheet" href="../../../assets/css/style.css">
    <link rel="stylesheet" href="../../../assets/css/lesson-common.css">
    <link rel="stylesheet" href="../../../assets/css/global-control.css">
    <script>
        MathJax = {
            tex: { inlineMath: [['$', '$'], ['\\(', '\\)']] },
            svg: { fontCache: 'global' }
        };
    </script>
    <script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js" async></script>
</head>
<body>
    <div class="bg-grid"></div>
    <nav class="navbar" id="navbar">
        <a href="../../../index.html" class="nav-logo">
            <div class="nav-logo-icon">X</div>
            <div class="nav-logo-text"><span>X</span>pert</div>
        </a>
        <ul class="nav-links">
            <li><a href="../../../index.html"><i class="fas fa-house"></i> Accueil</a></li>
            <li><a href="../../../subjects.html"><i class="fas fa-book-open"></i> Matières</a></li>
        </ul>
    </nav>

    <div style="max-width:900px; margin:0 auto; padding:60px 12px 20px;">
        <a href="index.html" class="back-btn"><i class="fas fa-arrow-right"></i> Retour</a>
        <div class="lesson-container">
            <h1 class="lesson-title"><i class="fas fa-book" style="color:#4ECDC4;"></i> Partie ${i} : ${i === parts ? 'Exercices' : 'Contenu'}</h1>
            <div class="section">
                <div class="highlight-box yellow">
                    <span class="label rappel">⚠️ À compléter</span>
                    <p>Cette partie est en cours de rédaction.</p>
                </div>
            </div>
            <div class="nav-buttons">
                <a href="part${Math.max(1, i-1)}.html" class="prev-btn"><i class="fas fa-arrow-right"></i> Précédent</a>
                <a href="part${Math.min(parts, i+1)}.html" class="next-btn">Suivant <i class="fas fa-arrow-left"></i></a>
            </div>
        </div>
    </div>

    <footer class="footer">
        <div class="divider"></div>
        <p>Xpert &copy; 2026 - 1 Bac Sciences Expérimentales</p>
    </footer>

    <script src="../../../assets/js/script.js"></script>
</body>
</html>`;
    fs.writeFileSync(path.join(basePath, `part${i}.html`), partContent);
}

console.log(`✅ ${title} créé avec succès dans content/${subject}/lessons/${id}/`);
console.log(`   - ${parts} parties créées`);
