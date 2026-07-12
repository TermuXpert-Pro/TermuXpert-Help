#!/usr/bin/env node
/**
 * sync-data.js
 * كيمسح content/<subject>/lessons/ (كل مجلد = درس) ويزيد أي درس ناقص
 * فـ data/<subject>.js (المصفوفة lessons) تلقائياً - بلا ما يلمس
 * الدروس المذكورين فيها ديجا.
 *
 * كيفاش كيعرف الدرس "قيد الإعداد": إلا كانت الصفحة فيها
 * <meta name="robots" content="noindex"> (العلامة اللي كنحطوها
 * فالصفحات المؤقتة فـ scaffold-lessons.sh).
 *
 * الاستخدام: node utils/sync-data.js
 * شغّلها بعد utils/scaffold-lessons.sh، أو بعد ما تزيد درس يدوياً.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const CONTENT_DIR = path.join(ROOT, 'content');
const DATA_DIR = path.join(ROOT, 'data');

const subjects = fs.readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

let totalAdded = 0;

for (const subject of subjects) {
    const lessonsDir = path.join(CONTENT_DIR, subject, 'lessons');
    if (!fs.existsSync(lessonsDir)) continue;

    const dataFile = path.join(DATA_DIR, `${subject}.js`);
    if (!fs.existsSync(dataFile)) {
        console.log(`⚠️  data/${subject}.js ماكاينش - تخطيت مادة "${subject}"`);
        continue;
    }

    let dataContent = fs.readFileSync(dataFile, 'utf-8');

    // كل الدروس المذكورين ديجا فـ lessons: [...] (نجيبو قيم file: "...")
    const lessonsBlockMatch = dataContent.match(/lessons:\s*\[([\s\S]*?)\]\s*,\s*\n\s*exercices:/);
    if (!lessonsBlockMatch) {
        console.log(`⚠️  ماقدرتش نلقى مصفوفة lessons فـ data/${subject}.js - تخطيت`);
        continue;
    }
    const existingBlock = lessonsBlockMatch[1];
    const existingFiles = new Set(
        [...existingBlock.matchAll(/file:\s*"([^"]+)"/g)].map(m => m[1])
    );

    // كل مجلدات الدروس الموجودين فعلياً فالقرص
    const slugs = fs.readdirSync(lessonsDir, { withFileTypes: true })
        .filter(d => d.isDirectory())
        .map(d => d.name)
        .sort();

    const newEntries = [];

    for (const slug of slugs) {
        const relFile = `content/${subject}/lessons/${slug}/index.html`;
        if (existingFiles.has(relFile)) continue; // كاين ديجا، ماكنلمسوش

        const indexPath = path.join(lessonsDir, slug, 'index.html');
        if (!fs.existsSync(indexPath)) continue;
        const pageContent = fs.readFileSync(indexPath, 'utf-8');

        const titleMatch = pageContent.match(/<title>(.*?)\s*\|\s*Xpert<\/title>/);
        const title = titleMatch ? titleMatch[1].trim() : slug;

        const isPlaceholder = /<meta name="robots" content="noindex">/.test(pageContent);
        const desc = isPlaceholder ? 'قيد الإعداد 🔧' : '';

        newEntries.push({ title, file: relFile, desc });
    }

    if (newEntries.length === 0) {
        console.log(`✅ data/${subject}.js: كلشي محدّث، ماكاين والو ناقص`);
        continue;
    }

    const entriesText = newEntries
        .map(e => `        { title: "${e.title.replace(/"/g, '\\"')}", file: "${e.file}", desc: "${e.desc.replace(/"/g, '\\"')}" }`)
        .join(',\n');

    // كنزيدو الدروس الجداد قبل الـ ] ديال lessons، بلا ما نبدلو الباقي
    const insertion = existingBlock.trim().length > 0
        ? `${existingBlock.replace(/\s*$/, '')},\n${entriesText}\n    `
        : `\n${entriesText}\n    `;

    dataContent = dataContent.replace(
        /lessons:\s*\[([\s\S]*?)\]\s*,\s*\n\s*exercices:/,
        `lessons: [${insertion}],\n    exercices:`
    );

    fs.writeFileSync(dataFile, dataContent);
    console.log(`✅ data/${subject}.js: تزاد ${newEntries.length} درس (${newEntries.map(e => e.title).join('، ')})`);
    totalAdded += newEntries.length;
}

console.log('');
console.log(`${'='.repeat(60)}`);
console.log(`✅ تم! تزاد ${totalAdded} درس جديد فملفات data/*.js.`);
