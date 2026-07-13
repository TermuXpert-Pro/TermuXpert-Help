#!/usr/bin/env node
/**
 * generate-math-hub.js
 * كيمسح content/math/{series,exercises}/<sujet>/ ويولّد/يحدّث
 * index.html (hub) فكل سجيت كيعرض قائمة النماذج (model1, model2...).
 *
 * التصميم مطابق لباقي المواد، غير اللون خاص بالرياضيات: #4ECDC4
 *
 * الاستخدام: node utils/generate-math-hub.js
 * شغّلها كل مرة تزيد model جديد لسجيت رياضيات كاين، ولا سجيت جديد.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SUBJECT = 'math';
const SUBJECT_COLOR = '#4ECDC4'; // لون الرياضيات فكامل المشروع
const CONTENT_DIR = path.join(ROOT, 'content', SUBJECT);

const TYPES = {
    exercises: { label: 'Exercices', icon: 'fa-pencil' },
    series:    { label: 'Séries',    icon: 'fa-layer-group' },
};

function listDirs(dir) {
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir, { withFileTypes: true })
        .filter(d => d.isDirectory())
        .map(d => d.name);
}

function extractInfo(modelIndexPath) {
    let title = null, count = null;
    if (fs.existsSync(modelIndexPath)) {
        const html = fs.readFileSync(modelIndexPath, 'utf-8');
        const titleMatch = html.match(/<title>\s*(?:Exercices|Séries)\s*-\s*(.*?)\s*\|\s*Xpert\s*<\/title>/i);
        if (titleMatch) title = titleMatch[1].trim();
        const countMatch = html.match(/<span>(\d+)<\/span>\s*(?:exercices|séries)/i);
        if (countMatch) count = countMatch[1];
    }
    return { title, count };
}

function buildHubHtml({ type, topicTitle, models }) {
    const meta = TYPES[type];
    const cards = models.map(m => `
                <a href="${m.slug}/index.html" class="ex-link" style="display:block; background:var(--bg-card); border:1px solid var(--border); border-radius:8px; padding:10px 14px; margin-bottom:10px; color:var(--text-primary); text-decoration:none; transition:all 0.3s ease;">
                    <div style="display:flex; align-items:center; gap:10px;">
                        <span style="color:${SUBJECT_COLOR}; font-size:18px; flex-shrink:0;"><i class="fas ${meta.icon}"></i></span>
                        <div style="flex:1;">
                            <div style="color:${SUBJECT_COLOR}; font-weight:700; font-size:15px;">${m.title}</div>
                            ${m.count ? `<div style="color:var(--text-secondary); font-size:12px;">${m.count} ${meta.label.toLowerCase()} disponibles</div>` : ''}
                        </div>
                        <span style="color:var(--text-muted); font-size:14px; flex-shrink:0;"><i class="fas fa-chevron-left"></i></span>
                    </div>
                </a>`).join('\n');

    return `<!DOCTYPE html>
<html lang="fr" dir="ltr">
<head>
    <meta http-equiv="X-Frame-Options" content="DENY">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${meta.label} - ${topicTitle} | Xpert</title>

    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="../../../../assets/css/style.css">
    <link rel="stylesheet" href="../../../../assets/css/lesson-common.css">
    <link rel="stylesheet" href="../../../../assets/css/global-control.css">
</head>
<body>

    <div class="overlay-protection" id="overlayProtection"></div>
    <div class="bg-grid"></div>

    <nav class="navbar" role="navigation" aria-label="Navigation principale" id="navbar">
    <a href="../../../../index.html" class="nav-logo">
        <div class="nav-logo-icon">X</div>
        <div class="nav-logo-text"><span>X</span>pert</div>
    </a>
    <ul class="nav-links">
        <li><a href="../../../../index.html"><i class="fas fa-house"></i> Accueil</a></li>
        <li><a href="../../../../subjects.html"><i class="fas fa-book-open"></i> Matières</a></li>
    </ul>
</nav>

    <div style="max-width:900px; margin:0 auto; padding:60px 12px 20px;">
        <a href="../../../../subject.html?subject=${SUBJECT}" class="back-btn"><i class="fas fa-arrow-right"></i> Retour</a>

        <div class="lesson-container">
            <h1 class="lesson-title"><i class="fas ${meta.icon}" style="color:${SUBJECT_COLOR};"></i> ${meta.label} - ${topicTitle}</h1>
            <div class="exercice-count"><span>${models.length}</span> modèle${models.length > 1 ? 's' : ''} disponible${models.length > 1 ? 's' : ''}</div>

            <div class="section-list" style="max-width:700px; margin:0 auto;">
${cards}
            </div>
        </div>
    </div>

    <footer class="footer">
    <div class="divider"></div>
    <p>Xpert &copy; 2026 - 1 Bac Sciences Expérimentales</p>
</footer>
    <script src="../../../../assets/js/protection.js"></script>
    <script src="../../../../assets/js/script.js"></script>
</body>
</html>
`;
}

// ====== المسح والتوليد (رياضيات فقط) ======
let totalGenerated = 0;

for (const type of Object.keys(TYPES)) {
    const typeDir = path.join(CONTENT_DIR, type);
    const topics = listDirs(typeDir);

    for (const topicSlug of topics) {
        const topicDir = path.join(typeDir, topicSlug);
        const modelSlugs = listDirs(topicDir)
            .filter(n => /^model\d+$/i.test(n))
            .sort((a, b) => parseInt(a.replace(/\D/g, '')) - parseInt(b.replace(/\D/g, '')));

        if (modelSlugs.length === 0) continue;

        let topicTitle = topicSlug;
        const models = modelSlugs.map((slug, i) => {
            const info = extractInfo(path.join(topicDir, slug, 'index.html'));
            if (info.title) topicTitle = info.title;
            return { slug, title: `Modèle ${i + 1}`, count: info.count };
        });

        const hubPath = path.join(topicDir, 'index.html');
        fs.writeFileSync(hubPath, buildHubHtml({ type, topicTitle, models }));
        totalGenerated++;
        console.log(`✅ ${path.relative(ROOT, hubPath)} (${models.length} نموذج)`);
    }
}

console.log('');
console.log('='.repeat(60));
console.log(`✅ تم! تولّد/تحدّث ${totalGenerated} صفحة hub لمادة الرياضيات.`);
