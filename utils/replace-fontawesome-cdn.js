#!/usr/bin/env node
/**
 * replace-fontawesome-cdn.js
 * كيبدل رابط Font Awesome الكامل (CDN) بالنسخة المحلية المصغرة
 * (assets/css/fontawesome-subset.css) فـ كل ملفات HTML ديال الموقع.
 *
 * ⚠️ خاصك تشغل node utils/generate-fa-subset.js قبل هادي، باش يكون
 * ملف fontawesome-subset.css موجود.
 *
 * الاستخدام:
 *   node utils/replace-fontawesome-cdn.js          → dry-run (كيوري غير شنو غادي يتبدل، بلا ما يمس الملفات)
 *   node utils/replace-fontawesome-cdn.js --apply   → كيدير التبديل فعليا ويكتب الملفات
 *
 * بعد --apply، شغّل node utils/build.js من بعد باش يتجدد رقم نسخة الكاش.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const APPLY = process.argv.includes('--apply');
const SKIP_DIRS = ['node_modules', '.git', 'partials', 'templates'];

let filesChanged = 0;
let totalReplacements = 0;
let missingSubset = false;

function walk(dir, fileList = []) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (SKIP_DIRS.includes(entry.name)) continue;
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            walk(full, fileList);
        } else if (entry.name.endsWith('.html')) {
            fileList.push(full);
        }
    }
    return fileList;
}

// نفس منطق getBase ديال build.js: عدد "../" حسب عمق الملف من الجذر
function getBase(filePath) {
    const rel = path.relative(ROOT, path.dirname(filePath));
    if (!rel) return '';
    const depth = rel.split(path.sep).length;
    return '../'.repeat(depth);
}

// رابط CDN الحالي (أي نسخة من font-awesome على cdnjs)
const CDN_FA_RE = /<link rel="stylesheet" href="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/font-awesome\/[^"]*">/;

function processFile(fp) {
    const rel = path.relative(ROOT, fp);
    const original = fs.readFileSync(fp, 'utf-8');

    if (!CDN_FA_RE.test(original)) return; // الصفحة ماشي فيها الرابط أصلا

    const base = getBase(fp);
    const localLink = `<link rel="stylesheet" href="${base}assets/css/fontawesome-subset.css">`;
    const content = original.replace(CDN_FA_RE, localLink);

    console.log(`${APPLY ? '✏️ ' : '🔍'} ${rel} → ${localLink}`);
    filesChanged++;
    totalReplacements++;

    if (APPLY) {
        fs.writeFileSync(fp, content, 'utf-8');
    }
}

function main() {
    const subsetCssPath = path.join(ROOT, 'assets', 'css', 'fontawesome-subset.css');
    if (!fs.existsSync(subsetCssPath)) {
        missingSubset = true;
        console.log('⚠️  ملف assets/css/fontawesome-subset.css ماكاينش بعد.');
        console.log('   شغّل أولا: node utils/generate-fa-subset.js\n');
        if (APPLY) {
            console.log('❌ توقفت بلا تطبيق - خاصك تبني الـ subset قبل.');
            process.exit(1);
        }
        console.log('(كمّلت dry-run على كل حال باش تشوف شنو غادي يتبدل)\n');
    }

    console.log(APPLY ? '=== تطبيق التبديل فعليا (--apply) ===\n' : '=== Dry-run: عرض التغييرات بلا كتابة (زيد --apply باش تطبقهم) ===\n');

    const htmlFiles = walk(ROOT);
    for (const fp of htmlFiles) {
        processFile(fp);
    }

    console.log(`\n--- النتيجة ---`);
    console.log(`ملفات فيهم تغيير: ${filesChanged} / ${htmlFiles.length}`);

    if (!APPLY && filesChanged > 0 && !missingSubset) {
        console.log('\n⚠️  هادي غير معاينة (dry-run). زيد "--apply" باش يتكتبو الملفات فعليا.');
    }
    if (APPLY && filesChanged > 0) {
        console.log('\n✅ تم التطبيق. شغّل بعدها: node utils/build.js (باش يتجدد رقم نسخة الكاش).');
    }
}

main();
