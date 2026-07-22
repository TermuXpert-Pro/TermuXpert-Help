#!/usr/bin/env node
/**
 * generate-sitemap.js
 * يمسح مجلد content/ + الصفحات الجذرية الثابتة ويولّد بنية sitemap مقسّمة
 * بحال أكبر المواقع (WordPress/Yoast): index + page-sitemap + post-sitemap
 *
 * الاستخدام: node utils/generate-sitemap.js
 * شغّلها كل مرة تزيد درس/تمرين/سلسلة جديدة، أو تزيد صفحة ثابتة جديدة
 *
 * البنية الجديدة (عوض ملف sitemap.xml واحد فيه كولشي):
 *   sitemap_index.xml   ← الفهرس الرئيسي، فيه غير روابط للـ 2 ملفات التحت
 *   page-sitemap.xml    ← الصفحات الثابتة/التنقلية (index, subjects, about...)
 *   post-sitemap.xml    ← المحتوى التعليمي (دروس + تمارين + سلاسل من content/)
 *
 * ملاحظة: خاصك تبدل السطر ديال Sitemap: فـ robots.txt باش يشير
 * لـ sitemap_index.xml عوض sitemap.xml (مذكور فآخر الملف كتوجيه).
 */

const fs = require('fs');
const path = require('path');

const SITE = 'https://jdxpert.pages.dev/';
const ROOT = path.join(__dirname, '..');
const CONTENT_DIR = path.join(ROOT, 'content');

const SITEMAP_INDEX_PATH = path.join(ROOT, 'sitemap_index.xml');
const PAGE_SITEMAP_PATH = path.join(ROOT, 'page-sitemap.xml');
const POST_SITEMAP_PATH = path.join(ROOT, 'post-sitemap.xml');
const OLD_SITEMAP_PATH = path.join(ROOT, 'sitemap.xml'); // القديم، كنحيدوه إلا كان موجود

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

function today() {
    return new Date().toISOString().split('T')[0]; // YYYY-MM-DD
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

// المواد: نكتشفها تلقائياً من أسماء مجلدات content/*
const subjects = fs.readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

// ====== تجميع صفحات content/ حسب المجلد (لتعليقات منظمة) ======
const grouped = {};
for (const rel of relFiles) {
    const parts = rel.split('/');
    const key = parts.slice(0, 3).join('/'); // content/matiere/lessons|exercises|series
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(rel);
}

// ====== 1) page-sitemap.xml: الصفحات الثابتة/التنقلية ======
let pageXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
pageXml += `    <!-- ====== الصفحات الرئيسية ====== -->\n`;
pageXml += `    <url><loc>${SITE}index.html</loc><priority>1.0</priority></url>\n`;
pageXml += `    <url><loc>${SITE}subjects.html</loc><priority>0.9</priority></url>\n`;
pageXml += `    <url><loc>${SITE}calendrier.html</loc><priority>0.6</priority></url>\n`;

for (const s of subjects) {
    pageXml += `    <url><loc>${SITE}subject.html?subject=${s}</loc><priority>0.8</priority></url>\n`;
}

if (existingStaticPages.length > 0) {
    pageXml += `\n    <!-- ====== الصفحات الثابتة ====== -->\n`;
    for (const p of existingStaticPages) {
        pageXml += `    <url><loc>${SITE}${p.file}</loc><priority>${p.priority}</priority></url>\n`;
    }
}
pageXml += `</urlset>\n`;

// ====== 2) post-sitemap.xml: المحتوى التعليمي (دروس/تمارين/سلاسل) ======
let postXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
for (const key of Object.keys(grouped).sort()) {
    postXml += `\n    <!-- ====== ${key} ====== -->\n`;
    for (const rel of grouped[key].sort()) {
        postXml += `    <url><loc>${SITE}${toUrl(rel)}</loc><priority>${getPriority(rel)}</priority></url>\n`;
    }
}
postXml += `</urlset>\n`;

// ====== 3) sitemap_index.xml: الفهرس الرئيسي ======
const lastmod = today();
const indexXml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    `    <sitemap>\n` +
    `        <loc>${SITE}page-sitemap.xml</loc>\n` +
    `        <lastmod>${lastmod}</lastmod>\n` +
    `    </sitemap>\n` +
    `    <sitemap>\n` +
    `        <loc>${SITE}post-sitemap.xml</loc>\n` +
    `        <lastmod>${lastmod}</lastmod>\n` +
    `    </sitemap>\n` +
    `</sitemapindex>\n`;

// ====== الكتابة على القرص ======
fs.writeFileSync(PAGE_SITEMAP_PATH, pageXml);
fs.writeFileSync(POST_SITEMAP_PATH, postXml);
fs.writeFileSync(SITEMAP_INDEX_PATH, indexXml);

// كنحيدو sitemap.xml القديم باش ما يبقاش ملف زايد مضارب مع البنية الجديدة
if (fs.existsSync(OLD_SITEMAP_PATH)) {
    fs.unlinkSync(OLD_SITEMAP_PATH);
    console.log('🗑️  تحيد sitemap.xml القديم (بدّلناه بالبنية الجداد)');
}

const pageUrls = 3 + subjects.length + existingStaticPages.length;
const postUrls = relFiles.length;

console.log(`✅ page-sitemap.xml: ${pageUrls} رابط`);
console.log(`✅ post-sitemap.xml: ${postUrls} رابط`);
console.log(`✅ sitemap_index.xml: يشير لـ 2 ملفات فوق`);

if (excludedFiles.length > 0) {
    const excludedRel = excludedFiles
        .map(f => path.relative(ROOT, f).split(path.sep).join('/'))
        .sort();
    console.log(`\n⚠️  ${excludedFiles.length} صفحة مستثناة (noindex) - تأكد واش راهم فعلا "قيد الإعداد":`);
    excludedRel.forEach(rel => console.log(`   - ${rel}`));
}

console.log(`\n📋 لا تنسى: بدّل السطر فـ robots.txt من`);
console.log(`   Sitemap: ${SITE}sitemap.xml`);
console.log(`   لـ`);
console.log(`   Sitemap: ${SITE}sitemap_index.xml`);
