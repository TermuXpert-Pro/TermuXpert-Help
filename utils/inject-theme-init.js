#!/usr/bin/env node
/**
 * inject-theme-init.js
 * كيزيد inline <script> صغير مباشرة بعد فتح <head> فـ كل صفحات HTML،
 * باش يحط data-theme="light" على <html> قبل ما المتصفح يرسم الصفحة
 * (وإلا الوضع الفاتح غادي يبان فيه "وميض" ديال dark لجزء من الثانية).
 *
 * - نفس منطق walk/SKIP_DIRS/SKIP_FILES ديال inject-pwa-head.js بالضبط
 * - Idempotent: إلا كان الوسم زايد من قبل (id="theme-init"), كيتخطاه
 * - الحقن كيتدار مباشرة من بعد <head> (باش يجري قبل style.css)
 *
 * الاستخدام:
 *   node utils/inject-theme-init.js
 *
 * فين تندرج فـ pipeline البناء:
 *   node utils/build.js
 *   node utils/inject-pwa-head.js
 *   node utils/inject-theme-init.js   <-- هادي
 *   node utils/generate-sitemap.js
 *   node utils/validate.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SKIP_DIRS = ['node_modules', '.git', 'partials', 'templates'];
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

const THEME_SCRIPT = `    <script id="theme-init">(function(){try{var t=localStorage.getItem('xpert-theme');if(t==='light'){document.documentElement.setAttribute('data-theme','light');}}catch(e){}})();</script>`;

let updated = 0;
let skipped = 0;
let noHead = 0;

console.log('🔨 بدء حقن theme-init script فـ <head>...\n');

for (const file of walk(ROOT)) {
    let content = fs.readFileSync(file, 'utf-8');

    if (/id=["']theme-init["']/.test(content)) {
        skipped++;
        continue;
    }

    const headOpenMatch = content.match(/<head[^>]*>/);
    if (!headOpenMatch) {
        noHead++;
        console.log(`   ⚠️ ${path.relative(ROOT, file)} - ماكاينش <head>، تخطيته`);
        continue;
    }

    const insertIdx = headOpenMatch.index + headOpenMatch[0].length;
    content = content.slice(0, insertIdx) + '\n' + THEME_SCRIPT + content.slice(insertIdx);

    fs.writeFileSync(file, content);
    updated++;
    console.log(`   ✅ ${path.relative(ROOT, file)} - تزاد theme-init`);
}

console.log(`\n✅ خلص: ${updated} صفحة تزاد فيها theme-init، ${skipped} كانت ديجا فيها، ${noHead} بلا <head>.`);
