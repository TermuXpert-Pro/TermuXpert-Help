#!/usr/bin/env node
/**
 * generate-model-hub.js
 * كيمسح content/<matiere>/{series,exercises,lessons}/<sujet>/ ويولّد/يحدّث
 * index.html فمستوى السجيت/الدرس (خارج model1/model2/...) كيعرض كارد
 * لكل نموذج (modelN) موجود فعلياً فالقرص.
 *
 * ✅ تحديث التصميم: الـ hub دابا فيه نفس الديكور المغربي الكامل اللي
 * كاين فصفحات model1/index.html (خلفية زليج + moroccan-shadow +
 * moroccan-star + geo-patterns + glow-orbs) بدل ما كان غير overlay+bg-grid
 * بسيطين. الألوان كتتحسب حسب المادة (نفس منطق utils/build.js بالضبط)
 * باش تكون الصفحة صحيحة مباشرة، وبنية الديكور مطابقة لـ partials/decor.html
 * حتى إلا عاودتي شغلتي node utils/build.js من بعد ماغاديش تبدل حتى حاجة.
 *
 * ✅ تحديث: دعم "lessons" بحال exercises/series بالضبط.
 *
 * الاستخدام: node utils/generate-model-hub.js
 * شغّلها كل مرة تزيد نموذج (modelN) جديد لسجيت/درس كاين، ولا سجيت/درس جديد.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const CONTENT_DIR = path.join(ROOT, 'content');

const TYPES = {
    exercises: { label: 'Exercices', icon: 'fa-pencil',      color: '#4ECDC4', unit: 'exercices' },
    series:    { label: 'Séries',    icon: 'fa-layer-group', color: '#F4D03F', unit: 'séries' },
    lessons:   { label: 'Cours',     icon: 'fa-book',        color: '#4ECDC4', unit: 'parties' },
};

// نفس ألوان utils/build.js بالضبط - باش الديكور يبان صحيح فالمادة
// الصحيحة من غير ما نحتاجو نشغلو build.js بعدها.
const SUBJECT_COLORS = {
    math:     { accent: '#4ECDC4', accentLight: '#66FCF1' },
    physique: { accent: '#FF6B6B', accentLight: '#FF8A8A' },
    chimie:   { accent: '#F4D03F', accentLight: '#F7DC6F' },
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
        const titleMatch = html.match(/<title>\s*(.*?)\s*\|\s*Xpert\s*<\/title>/i);
        if (titleMatch) title = titleMatch[1].trim();
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

// ====== الديكور المغربي الكامل (بنفس بنية partials/decor.html بالضبط) ======
function buildDecorHtml(subject) {
    const colors = SUBJECT_COLORS[subject] || SUBJECT_COLORS.math;
    const ACCENT = colors.accent, ACCENT_LIGHT = colors.accentLight;
    return `<!-- ====== طبقة الحماية غير المرئية ====== -->
    <div class="overlay-protection" id="overlayProtection"></div>

    <!-- ====== خلفية زليج ====== -->
    <div class="moroccan-bg" aria-hidden="true">
        <svg viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <pattern id="zellij" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
                    <rect width="200" height="200" fill="none"/>
                    <polygon points="100,0 200,100 100,200 0,100" fill="none" stroke="${ACCENT}" stroke-width="0.5" opacity="0.3"/>
                    <polygon points="100,20 180,100 100,180 20,100" fill="none" stroke="${ACCENT_LIGHT}" stroke-width="0.5" opacity="0.2"/>
                    <polygon points="100,40 160,100 100,160 40,100" fill="none" stroke="#F4D03F" stroke-width="0.5" opacity="0.2"/>
                    <polygon points="100,60 140,100 100,140 60,100" fill="none" stroke="${ACCENT}" stroke-width="0.5" opacity="0.2"/>
                    <text x="100" y="100" text-anchor="middle" dominant-baseline="central" font-size="8" fill="#F4D03F" opacity="0.2">✦</text>
                    <text x="50" y="50" text-anchor="middle" dominant-baseline="central" font-size="6" fill="${ACCENT}" opacity="0.15">✦</text>
                    <text x="150" y="50" text-anchor="middle" dominant-baseline="central" font-size="6" fill="${ACCENT}" opacity="0.15">✦</text>
                    <text x="50" y="150" text-anchor="middle" dominant-baseline="central" font-size="6" fill="${ACCENT}" opacity="0.15">✦</text>
                    <text x="150" y="150" text-anchor="middle" dominant-baseline="central" font-size="6" fill="${ACCENT}" opacity="0.15">✦</text>
                    <line x1="0" y1="0" x2="200" y2="200" stroke="${ACCENT}" stroke-width="0.3" opacity="0.1"/>
                    <line x1="200" y1="0" x2="0" y2="200" stroke="${ACCENT}" stroke-width="0.3" opacity="0.1"/>
                    <line x1="100" y1="0" x2="100" y2="200" stroke="${ACCENT}" stroke-width="0.3" opacity="0.05"/>
                    <line x1="0" y1="100" x2="200" y2="100" stroke="${ACCENT}" stroke-width="0.3" opacity="0.05"/>
                </pattern>
            </defs>
            <rect width="800" height="800" fill="url(#zellij)"/>
        </svg>
    </div>
    <div class="moroccan-shadow" aria-hidden="true"></div>
    <div class="moroccan-star" aria-hidden="true">✦</div>
    <div class="geo-pattern geo-pattern-1">✦ ✧ ✦ ✧ ✦</div>
    <div class="geo-pattern geo-pattern-2">✦ ✧ ✦ ✧ ✦</div>
    <div class="geo-pattern geo-pattern-3">✦ ✧ ✦ ✧ ✦</div>
    <div class="geo-pattern geo-pattern-4">✦ ✧ ✦ ✧ ✦</div>

    <div class="bg-grid"></div>
    <div class="glow-orb glow-orb-1"></div>
    <div class="glow-orb glow-orb-2"></div>`;
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

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="../../../../assets/css/style.css">
    <link rel="stylesheet" href="../../../../assets/css/lesson-common.css">
    <link rel="stylesheet" href="../../../../assets/css/global-control.css">
</head>
<body>

    ${buildDecorHtml(subject)}

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
            <div style="text-align:center; margin-bottom:18px;">
                <span style="display:inline-block; background:${meta.color}22; color:${meta.color}; padding:5px 18px; border-radius:14px; font-size:13px; font-weight:700;">
                    <i class="fas fa-cubes" style="margin-left:5px;"></i> ${models.length} modèle${models.length > 1 ? 's' : ''} disponible${models.length > 1 ? 's' : ''}
                </span>
            </div>

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
console.log(`✅ تم! تولّد/تحدّث ${totalGenerated} صفحة hub بالديكور المغربي الكامل.`);
console.log('⚠️  تذكّر: data/*.js وsubject.html خاصهم يشيرو لهاذ index.html');
console.log('   (المجلد ديال السجيت/الدرس) وماشي مباشرة لـ model1/index.html');
console.log('💡 تقدر تشغّل بعدها node utils/build.js بلا مشكل - الديكور مطابق');
console.log('   لبنية partials/decor.html وماغاديش يبدل والو.');
