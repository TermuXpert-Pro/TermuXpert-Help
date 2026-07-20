#!/usr/bin/env node
/**
 * inject-pwa-head.js
 * كيزيد روابط PWA (manifest, icons, theme-color...) فـ <head> ديال
 * كل صفحات HTML ديال الموقع، حيت build.js كيبدل غير navbar/footer/decor
 * فـ body وما كيدخلش لـ head.
 *
 * - كيحسب {{BASE}} بحال build.js بالضبط (عدد المجلدات = عدد ../)
 * - إلا كانت الوسوم زايدين فـ الملف من قبل (idempotent)، كيتخطاه باش
 *   ما يزيدهمش مرتين إلا شغلتها بزوج
 * - كيدير الحقن قبل </head> مباشرة
 *
 * الاستخدام:
 *   node utils/inject-pwa-head.js
 *
 * خاصك تشغلها مرة وحدة (أو بعد ما تزيد صفحات جداد)، وقبل كل نشر.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SKIP_DIRS = ['node_modules', '.git', 'partials', 'templates'];

// نفس الملفات المستثناة اللي كاينين فـ build.js (بلا manifest.json و sw.js
// حيت هادوك ماشي HTML)
const SKIP_FILES = ['calendrier.html'];

function walk(dir, fileList = []) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (SKIP_DIRS.includes(entry.name)) continue;
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            walk(full, fileList);
        } else if (entry.name.endsWith('.html')) {
            if (!SKIP_FILES.includes(entry.name)) fileList.push(full);
        }
    }
    return fileList;
}

// نفس المنطق ديال getBase() فـ build.js
function getBase(filePath) {
    const rel = path.relative(ROOT, path.dirname(filePath));
    if (!rel) return '';
    const depth = rel.split(path.sep).length;
    return '../'.repeat(depth);
}

function buildPwaTags(base) {
    return `    <link rel="manifest" href="${base}manifest.json">
    <link rel="icon" href="${base}favicon.ico" sizes="any">
    <link rel="icon" href="${base}assets/images/icon-16.png" sizes="16x16" type="image/png">
    <link rel="icon" href="${base}assets/images/icon-32.png" sizes="32x32" type="image/png">
    <link rel="icon" href="${base}assets/images/icon-192.png" sizes="192x192" type="image/png">
    <link rel="apple-touch-icon" href="${base}assets/images/apple-touch-icon.png">
    <meta name="theme-color" content="#45A29E">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-title" content="Xpert">`;
}

let updated = 0;
let skipped = 0;
let noHead = 0;

console.log('🔨 بدء حقن وسوم PWA فـ <head>...\n');

for (const file of walk(ROOT)) {
    let content = fs.readFileSync(file, 'utf-8');

    // إلا كان manifest link موجود من قبل، تخطاه (باش ما نزيدوش بزوج)
    if (/<link\s+rel=["']manifest["']/.test(content)) {
        skipped++;
        continue;
    }

    const headCloseIdx = content.indexOf('</head>');
    if (headCloseIdx === -1) {
        noHead++;
        console.log(`   ⚠️ ${path.relative(ROOT, file)} - ماكاينش </head>، تخطيته`);
        continue;
    }

    const base = getBase(file);
    const tags = buildPwaTags(base);
    content = content.slice(0, headCloseIdx) + tags + '\n' + content.slice(headCloseIdx);

    fs.writeFileSync(file, content);
    updated++;
    console.log(`   ✅ ${path.relative(ROOT, file)} - تزادت وسوم PWA`);
}

console.log(`\n✅ خلص: ${updated} صفحة تزادت فيها وسوم PWA، ${skipped} صفحة كانت ديجا فيها، ${noHead} بلا </head>.`);
