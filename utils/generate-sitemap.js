#!/usr/bin/env node
/**
 * generate-sitemap.js
 * يمسح مجلد content/ + الصفحات الجذرية الثابتة ويولّد sitemap.xml محدّث تلقائياً
 *
 * الاستخدام: node utils/generate-sitemap.js
 * شغّلها كل مرة تزيد درس/تمرين/سلسلة جديدة، أو تزيد صفحة ثابتة جديدة
 *
 * التعديلات على النسخة الأصلية:
 *   1) زيد مسح الصفحات الجذرية الثابتة (about.html, support.html, terms.html...)
 *      اللي كانت ناقصة لأن السكريبت كان كيمسح غير content/
 *   2) طباعة لائحة الصفحات المستثناة (noindex) بالاسم، ماشي غير العدد،
 *      باش تقدر تتأكد بسرعة واش كاين درس كمّلتيه ونسيتي تحيد الـ noindex منو
 */

const fs = require('fs');
const path = require('path');

const SITE = 'https://jdxpert.pages.dev/';
const ROOT = path.join(__dirname, '..');
const CONTENT_DIR = path.join(ROOT, 'content');

// ====== الصفحات الجذرية الثابتة ======
// زيد هنا أي صفحة جذرية جديدة كتضيفها فالمستقبل (بحال privacy.html، faq.html...)
// كل صفحة ماكاينش فـ content/ خاصها تتزاد هنا يدويا حيت السكريبت
// كيمسح غير مجلد content/ أوتوماتيكيا.
const STATIC_PAGES = [
    { file: 'about.html', priority: '0.4' },
    { file: 'support.html', priority: '0.4' },
    { file: 'terms.html', priority: '0.3' },
];

function walk(dir, fileList = []) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            walk(fullPath, fileList);
        } else if (entry.name.endsWith('.html')) {
            fileList.push(fullPath);
        }
    }
    return fileList;
}

// كنستثنيو الصفحات المؤقتة (noindex) - مثلاً الدروس "قيد الإعداد"
// اللي كايخلقهم utils/scaffold-lessons.sh - ماشي منطقي نقترحوهم لـ Google
// للفهرسة وفنفس الوقت نقولو ليه "noindex" فالصفحة نفسها.
function isNoIndex(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    return /<meta\s+name="robots"\s+content="noindex"/.test(content);
}

function getPriority(relPath) {
    if (relPath.endsWith('/index.html')) return '0.7';
    if (/part\d+\.html$|exercice\d+\.html$|serie\d+\.html$/.test(relPath)) return '0.5';
    return '0.6';
}

function toUrl(relPath) {
    // ترميز الأحرف الخاصة (كالفرنسية) فالمسار مع الحفاظ على / و - و _ و '
    return relPath.split('/').map(encodeURIComponent).join('/');
}

// ====== جمع صفحات content/ (بلا الصفحات noindex) ======
const allContentFiles = walk(CONTENT_DIR);
const excludedFiles = allContentFiles.filter(f => isNoIndex(f));
const htmlFiles = allContentFiles.filter(f => !isNoIndex(f));
const relFiles = htmlFiles
    .map(f => path.relative(ROOT, f).split(path.sep).join('/'))
    .sort();

// ====== التحقق من الصفحات الجذرية الثابتة (تحذير إلا كان الملف ناقص) ======
const missingStatic = STATIC_PAGES.filter(
    p => !fs.existsSync(path.join(ROOT, p.file))
);
if (missingStatic.length > 0) {
    console.warn(
        `⚠️  تحذير: هاد الصفحات الثابتة معرّفة فـ STATIC_PAGES لكن ماكايناش فـ ${ROOT}:\n` +
        missingStatic.map(p => `   - ${p.file}`).join('\n')
    );
}
const existingStaticPages = STATIC_PAGES.filter(
    p => fs.existsSync(path.join(ROOT, p.file))
);

// ====== تجميع صفحات content/ حسب المجلد (لتعليقات منظمة) ======
const grouped = {};
for (const rel of relFiles) {
    const parts = rel.split('/');
    const key = parts.slice(0, 3).join('/'); // content/matiere/lessons|exercises|series
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(rel);
}

// ====== بناء XML ======
let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
xml += `    <!-- ====== الصفحات الرئيسية ====== -->\n`;
xml += `    <url><loc>${SITE}index.html</loc><priority>1.0</priority></url>\n`;
xml += `    <url><loc>${SITE}subjects.html</loc><priority>0.9</priority></url>\n`;
xml += `    <url><loc>${SITE}calendrier.html</loc><priority>0.6</priority></url>\n`;

// المواد: نكتشفها تلقائياً من أسماء مجلدات content/*
const subjects = fs.readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);
for (const s of subjects) {
    xml += `    <url><loc>${SITE}subject.html?subject=${s}</loc><priority>0.8</priority></url>\n`;
}

// ====== الصفحات الجذرية الثابتة ======
if (existingStaticPages.length > 0) {
    xml += `\n    <!-- ====== الصفحات الثابتة ====== -->\n`;
    for (const p of existingStaticPages) {
        xml += `    <url><loc>${SITE}${p.file}</loc><priority>${p.priority}</priority></url>\n`;
    }
}

// ====== صفحات content/ (دروس/تمارين/سلاسل) ======
for (const key of Object.keys(grouped).sort()) {
    xml += `\n    <!-- ====== ${key} ====== -->\n`;
    for (const rel of grouped[key].sort()) {
        xml += `    <url><loc>${SITE}${toUrl(rel)}</loc><priority>${getPriority(rel)}</priority></url>\n`;
    }
}

xml += `</urlset>\n`;

fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), xml);

const totalUrls = relFiles.length + 3 + subjects.length + existingStaticPages.length;
console.log(`✅ sitemap.xml محدّث بنجاح: ${totalUrls} رابط`);

if (excludedFiles.length > 0) {
    const excludedRel = excludedFiles
        .map(f => path.relative(ROOT, f).split(path.sep).join('/'))
        .sort();
    console.log(`\n⚠️  ${excludedFiles.length} صفحة مستثناة (noindex) - تأكد واش راهم فعلا "قيد الإعداد":`);
    excludedRel.forEach(rel => console.log(`   - ${rel}`));
}
