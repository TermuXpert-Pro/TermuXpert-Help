#!/usr/bin/env node
/**
 * generate-model-hub.js
 * كيمسح content/<matiere>/{series,exercises,lessons}/<sujet>/ ويولّد/يحدّث
 * index.html فمستوى السجيت/الدرس (خارج model1/model2/...) كيعرض كارد
 * لكل نموذج (modelN) موجود فعلياً فالقرص.
 *
 * الفكرة: data/*.js و subject.html كيشيرو ديما لهاذ index.html (الـ hub)
 * وماشي مباشرة لـ model1/. ملي تزيد model2 مستقبلاً، غير عاود شغّل هاذ
 * السكريبت - صفر تعديل يدوي فأي حتة أخرى.
 *
 * ⚠️ تحديث: زدنا دعم "lessons" بحال exercises/series بالضبط. الدرس
 * (model1/index.html) يقدر يكون:
 *   - راوتر فيه روابط part-link (Cours - Partie 1, 2, 3...) → كنعدو عدد
 *     الـ part-link باش نعرضو "N parties disponibles"
 *   - ولا صفحة واحدة فيها المحتوى مباشرة (بلا parts) → كنعرضو غير
 *     "Modèle 1" بلا عدد.
 *
 * الاستخدام: node utils/generate-model-hub.js
 * شغّلها كل مرة تزيد نموذج (modelN) جديد لسجيت/درس كاين، ولا سجيت/درس جديد.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const CONTENT_DIR = path.join(ROOT, 'content');
const TYPES = {
    exercises: { label: 'Exercices', icon: 'fa-pencil',       color: '#4ECDC4', unit: 'exercices' },
    series:    { label: 'Séries',    icon: 'fa-layer-group',  color: '#F4D03F', unit: 'séries' },
    lessons:   { label: 'Cours',     icon: 'fa-book',         color: '#4ECDC4', unit: 'parties' },
};

function listDirs(dir) {
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir, { withFileTypes: true })
        .filter(d => d.isDirectory())
        .map(d => d.name);
}

// كيجيب عنوان + عدد العناصر من داخل model1/index.html (باش الـ hub يبان فيه
// نفس المعلومة بلا ما نكتبوها يدوياً مرتين)
function extractInfo(modelIndexPath, type) {
    let title = null, count = null;
    if (!fs.existsSync(modelIndexPath)) return { title, count };
    const html = fs.readFileSync(modelIndexPath, 'utf-8');

    if (type === 'lessons') {
        // عنوان الدرس مكتوب مباشرة بلا "Cours -" فالبداية
        const titleMatch = html.match(/<title>\s*(.*?)\s*\|\s*Xpert\s*<\/title>/i);
        if (titleMatch) title = titleMatch[1].trim();
        // نعدو الروابط ديال part-link إلا كان الدرس مقسم لأجزاء
        const partMatches = html.match(/class="part-link"/g);
        count = partMatches ? partMatches.length : null;
    } else {
        const titleMatch = html.match(/<title>\s*(?:Exercices|Séries)\s*-\s*(.*?)\s*\|\s*Xpert\s*<\/title>/i);
        if (titleMatch) title = titleMatch[1].trim();
        const countMatch = html.match(/<span>(\d+)<\/span>\s*(?:exercices|séries)/i);
        if (countMatch) count = countMatch[1];
    }
    return { title, count };
}

function buildHubHtml({ subject, type, topicSlug, topicTitle, models }) {
    const meta = TYPES[type];
    const cards = models.map(m => {
        const n = m.count ? Number(m.count) : 0;
        const subtitle = m.count
            ? `<div style="color:var(--text-secondary); font-size:12px;">${m.count} ${meta.unit} disponible${n > 1 ? 's' : ''}</div>`
            : '';
        return `
                <a href="${m.slug}/index.html" class="ex-link" style="display:block; background:var(--bg-card); border:1px solid var(--border); border-radius:8px; padding:10px 14px; margin-bottom:10px; color:var(--text-primary); text-decoration:none; transition:all 0.3s ease;">
                    <div style="display:flex; align-items:center; gap:10px;">
                        <span style="color:${meta.color}; font-size:18px; flex-shrink:0;"><i class="fas ${meta.icon}"></i></span>
                        <div style="flex:1;">
                            <div style="color:${meta.color}; font-weight:700; font-size:15px;">${m.title}</div>
                            ${subtitle}
                        </div>
                        <span style="color:var(--text-muted); font-size:14px; flex-shrink:0;"><i class="fas fa-chevron-left"></i></span>
                    </div>
                </a>`;
    }).join('\n');

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
        <a href="../../../../subject.html?subject=${subject}" class="back-btn"><i class="fas fa-arrow-right"></i> Retour</a>

        <div class="lesson-container">
            <h1 class="lesson-title"><i class="fas ${meta.icon}" style="color:${meta.color};"></i> ${meta.label} - ${topicTitle}</h1>
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

// ====== المسح والتوليد ======
let totalGenerated = 0;
const subjects = listDirs(CONTENT_DIR);

for (const subject of subjects) {
    for (const type of Object.keys(TYPES)) {
        const typeDir = path.join(CONTENT_DIR, subject, type);
        const topics = listDirs(typeDir);

        for (const topicSlug of topics) {
            const topicDir = path.join(typeDir, topicSlug);
            const modelSlugs = listDirs(topicDir)
                .filter(n => /^model\d+$/i.test(n))
                .sort((a, b) => parseInt(a.replace(/\D/g, '')) - parseInt(b.replace(/\D/g, '')));

            if (modelSlugs.length === 0) continue; // ماكاين حتى model هنا، تخطي

            let topicTitle = topicSlug;
            const models = modelSlugs.map((slug, i) => {
                const info = extractInfo(path.join(topicDir, slug, 'index.html'), type);
                if (info.title) topicTitle = info.title;
                return { slug, title: `Modèle ${i + 1}`, count: info.count };
            });

            const hubPath = path.join(topicDir, 'index.html');
            const html = buildHubHtml({ subject, type, topicSlug, topicTitle, models });
            fs.writeFileSync(hubPath, html);
            totalGenerated++;
            console.log(`✅ ${path.relative(ROOT, hubPath)} (${models.length} نموذج)`);
        }
    }
}

console.log('');
console.log('='.repeat(60));
console.log(`✅ تم! تولّد/تحدّث ${totalGenerated} صفحة hub.`);
console.log('⚠️  تذكّر: data/*.js وsubject.html خاصهم يشيرو لهاذ index.html');
console.log('   (المجلد ديال السجيت/الدرس) وماشي مباشرة لـ model1/index.html');
