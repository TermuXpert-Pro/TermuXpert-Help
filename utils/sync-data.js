#!/usr/bin/env node
/**
 * sync-data.js
 * كيمسح content/<subject>/{lessons,exercises,series}/ ويزيد أي عنصر ناقص
 * فـ data/<subject>.js (lessons / exercices / series) تلقائياً - بلا ما يلمس
 * العناصر المذكورين فيها ديجا.
 *
 * ⚠️ الهيكل الجديد (hub): exercices/series كيشيرو ديما لـ
 * content/<subject>/{exercises,series}/<sujet>/index.html (الصفحة اللي
 * كيعرض قائمة النماذج model1/model2/...) وماشي مباشرة لـ model1/index.html.
 * هاذ الملف كيتولد/يتحدث بـ utils/generate-math-hub.js (أو
 * generate-physique-hub.js، ...) - خاصك تشغلها هي قبل هاذ السكريبت.
 *
 * كيفاش كيعرف الدرس "قيد الإعداد": إلا كانت الصفحة فيها
 * <meta name="robots" content="noindex"> (العلامة اللي كنحطوها
 * فالصفحات المؤقتة فـ scaffold-lessons.sh).
 *
 * الاستخدام:
 *   node utils/generate-math-hub.js       (أو الماتيير المعنية)
 *   node utils/sync-data.js
 * شغّلها بعد ما تزيد درس/سجيت/تمرين جديد.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const CONTENT_DIR = path.join(ROOT, 'content');
const DATA_DIR = path.join(ROOT, 'data');

function listDirs(dir) {
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir, { withFileTypes: true })
        .filter(d => d.isDirectory())
        .map(d => d.name)
        .sort();
}

function escape(str) {
    return str.replace(/"/g, '\\"');
}

const subjects = listDirs(CONTENT_DIR);
let totalAdded = 0;

for (const subject of subjects) {
    const dataFile = path.join(DATA_DIR, `${subject}.js`);
    if (!fs.existsSync(dataFile)) {
        console.log(`⚠️  data/${subject}.js ماكاينش - تخطيت مادة "${subject}"`);
        continue;
    }

    let dataContent = fs.readFileSync(dataFile, 'utf-8');
    let addedThisSubject = 0;

    // ====== 1) lessons: [...] (بلا تغيير من قبل) ======
    addedThisSubject += syncArray({
        dataFileLabel: subject,
        blockRegex: /lessons:\s*\[([\s\S]*?)\]\s*,\s*\n\s*exercices:/,
        replaceTemplate: (insertion) => `lessons: [${insertion}],\n    exercices:`,
        getEntries: () => {
            const lessonsDir = path.join(CONTENT_DIR, subject, 'lessons');
            const slugs = listDirs(lessonsDir);
            const entries = [];
            for (const slug of slugs) {
                const indexPath = path.join(lessonsDir, slug, 'index.html');
                if (!fs.existsSync(indexPath)) continue;
                const html = fs.readFileSync(indexPath, 'utf-8');
                const titleMatch = html.match(/<title>(.*?)\s*\|\s*Xpert<\/title>/);
                const title = titleMatch ? titleMatch[1].trim() : slug;
                const isPlaceholder = /<meta name="robots" content="noindex">/.test(html);
                const desc = isPlaceholder ? 'قيد الإعداد 🔧' : '';
                entries.push({ title, file: `content/${subject}/lessons/${slug}/index.html`, desc, indent: '        ' });
            }
            return entries;
        },
    });

    // ====== 2) exercices: [...] و 3) series: [...] (الهيكل الجديد بالـ hub) ======
    const TYPE_MAP = {
        exercices: { dir: 'exercises', word: 'exercices', nextKey: 'series' },
        series:    { dir: 'series',    word: 'séries',    nextKey: 'exams' },
    };

    for (const key of Object.keys(TYPE_MAP)) {
        const { dir, word, nextKey } = TYPE_MAP[key];
        const blockRegex = new RegExp(`${key}:\\s*\\[([\\s\\S]*?)\\]\\s*,\\s*\\n\\s*${nextKey}:`);

        addedThisSubject += syncArray({
            dataFileLabel: subject,
            blockRegex,
            replaceTemplate: (insertion) => `${key}: [${insertion}],\n    ${nextKey}:`,
            getEntries: () => {
                const typeDir = path.join(CONTENT_DIR, subject, dir);
                const topics = listDirs(typeDir);
                const entries = [];
                for (const topicSlug of topics) {
                    const topicDir = path.join(typeDir, topicSlug);
                    const hubPath = path.join(topicDir, 'index.html');
                    if (!fs.existsSync(hubPath)) continue; // ماكاين hub بعد - شغّل generate-*-hub.js قبل

                    const html = fs.readFileSync(hubPath, 'utf-8');
                    const titleMatch = html.match(/<title>\s*(?:Exercices|Séries)\s*-\s*(.*?)\s*\|\s*Xpert\s*<\/title>/i);
                    const title = titleMatch ? titleMatch[1].trim() : topicSlug;

                    // كنحاولو نجيبو عدد العناصر من model1 (إلا كاين) لبناء desc
                    const model1Path = path.join(topicDir, 'model1', 'index.html');
                    let desc = '';
                    if (fs.existsSync(model1Path)) {
                        const modelHtml = fs.readFileSync(model1Path, 'utf-8');
                        const countMatch = modelHtml.match(/<span>(\d+)<\/span>\s*(?:exercices|séries)/i);
                        if (countMatch) desc = `${countMatch[1]} ${word} avec solutions`;
                    }

                    entries.push({ title, file: `content/${subject}/${dir}/${topicSlug}/index.html`, desc, indent: '        ' });
                }
                return entries;
            },
        });
    }

    function syncArray({ blockRegex, replaceTemplate, getEntries }) {
        const blockMatch = dataContent.match(blockRegex);
        if (!blockMatch) return 0; // البنية ماكاينش/متبدلة - تخطي بصمت

        const existingBlock = blockMatch[1];
        const existingFiles = new Set(
            [...existingBlock.matchAll(/file:\s*"([^"]+)"/g)].map(m => m[1])
        );

        const allEntries = getEntries();
        const newEntries = allEntries.filter(e => !existingFiles.has(e.file));
        if (newEntries.length === 0) return 0;

        const entriesText = newEntries
            .map(e => `        { title: "${escape(e.title)}", file: "${e.file}", desc: "${escape(e.desc)}" }`)
            .join(',\n');

        const insertion = existingBlock.trim().length > 0
            ? `${existingBlock.replace(/\s*$/, '')},\n${entriesText}\n    `
            : `\n${entriesText}\n    `;

        dataContent = dataContent.replace(blockRegex, replaceTemplate(insertion));
        console.log(`✅ data/${subject}.js: تزاد ${newEntries.length} عنصر (${newEntries.map(e => e.title).join('، ')})`);
        return newEntries.length;
    }

    if (addedThisSubject === 0) {
        console.log(`✅ data/${subject}.js: كلشي محدّث، ماكاين والو ناقص`);
    } else {
        fs.writeFileSync(dataFile, dataContent);
    }
    totalAdded += addedThisSubject;
}

console.log('');
console.log(`${'='.repeat(60)}`);
console.log(`✅ تم! تزاد ${totalAdded} عنصر جديد فملفات data/*.js.`);
