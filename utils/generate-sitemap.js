#!/usr/bin/env node
/**
 * generate-sitemap.js
 * يمسح مجلد content/ ويولّد sitemap.xml محدّث تلقائياً
 *
 * الاستخدام: node utils/generate-sitemap.js
 * شغّلها كل مرة تزيد درس/تمرين/سلسلة جديدة
 */

const fs = require('fs');
const path = require('path');

const SITE = 'https://termuxpert-pro.github.io/TermuXpert-WEB/';
const ROOT = path.join(__dirname, '..');
const CONTENT_DIR = path.join(ROOT, 'content');

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

// ====== جمع الصفحات (بلا الصفحات noindex) ======
const htmlFiles = walk(CONTENT_DIR).filter(f => !isNoIndex(f));
const excludedCount = walk(CONTENT_DIR).length - htmlFiles.length;
const relFiles = htmlFiles
    .map(f => path.relative(ROOT, f).split(path.sep).join('/'))
    .sort();

// ====== تجميع حسب المجلد (لتعليقات منظمة) ======
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

// المواد: نكتشفها تلقائياً من أسماء مجلدات content/*
const subjects = fs.readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);
for (const s of subjects) {
    xml += `    <url><loc>${SITE}subject.html?subject=${s}</loc><priority>0.8</priority></url>\n`;
}

for (const key of Object.keys(grouped).sort()) {
    xml += `\n    <!-- ====== ${key} ====== -->\n`;
    for (const rel of grouped[key].sort()) {
        xml += `    <url><loc>${SITE}${toUrl(rel)}</loc><priority>${getPriority(rel)}</priority></url>\n`;
    }
}

xml += `</urlset>\n`;

fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), xml);
console.log(`✅ sitemap.xml محدّث بنجاح: ${relFiles.length + 2 + subjects.length} رابط` +
    (excludedCount > 0 ? ` (${excludedCount} صفحة مؤقتة "noindex" تستثنات)` : ''));
