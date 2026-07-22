#!/usr/bin/env node
/**
 * replace-privacy-with-support.js
 * كيبدل كل إشارة لـ privacy.html بـ support.html فـ كل ملفات HTML ديال الموقع.
 * كيبدل:
 *   - href="privacy.html"          → href="support.html"
 *   - data-page="privacy"          → data-page="support"
 *   - النص "سياسة الخصوصية" (كنص رابط) → "الدعم"
 *
 * الاستخدام:
 *   node utils/replace-privacy-with-support.js          → dry-run (كيوري غير شنو غادي يتبدل، بلا ما يمس الملفات)
 *   node utils/replace-privacy-with-support.js --apply   → كيدير التبديل فعليا ويكتب الملفات
 *
 * بعد ما تشغلو بـ --apply، خاصك يدويا:
 *   1) تمسح ملف privacy.html من /storage/emulated/0/Web/
 *   2) ترفع support.html لنفس المجلد
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const APPLY = process.argv.includes('--apply');

let filesChanged = 0;
let totalReplacements = 0;

function walk(dir, ext, fileList = [], skipDirs = []) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        if (skipDirs.includes(entry.name)) continue;
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            walk(fullPath, ext, fileList, skipDirs);
        } else if (entry.name.endsWith(ext)) {
            fileList.push(fullPath);
        }
    }
    return fileList;
}

// كل الاستبدالات اللي غادي نديرو، بالترتيب
const replacements = [
    // الرابط href="...privacy.html" بأي بادئة (بلا بادئة، {{BASE}}، ../../../../، ../../../../../ الخ)
    // كنحافظو على البادئة ($1) ونبدلو غير "privacy.html" بـ "support.html"
    { from: /href="([^"]*)privacy\.html"/g, to: 'href="$1support.html"' },
    // data-page="privacy"
    { from: /data-page="privacy"/g, to: 'data-page="support"' },
    // نص الرابط "سياسة الخصوصية" -> "الدعم"
    { from: />سياسة الخصوصية</g, to: '>الدعم<' },
];

function processFile(fp) {
    const rel = path.relative(ROOT, fp);
    const original = fs.readFileSync(fp, 'utf-8');
    let content = original;
    let fileReplacements = 0;

    for (const { from, to } of replacements) {
        const matches = content.match(from);
        if (matches) {
            fileReplacements += matches.length;
            content = content.replace(from, to);
        }
    }

    if (fileReplacements > 0) {
        console.log(`${APPLY ? '✏️ ' : '🔍'} ${rel}: ${fileReplacements} استبدال`);
        filesChanged++;
        totalReplacements += fileReplacements;
        if (APPLY) {
            fs.writeFileSync(fp, content, 'utf-8');
        }
    }
}

function main() {
    console.log(APPLY ? '=== تطبيق التبديل فعليا (--apply) ===\n' : '=== Dry-run: عرض التغييرات بلا كتابة (زيد --apply باش تطبقهم) ===\n');

    const htmlFiles = walk(ROOT, '.html', [], ['node_modules', '.git']);

    for (const fp of htmlFiles) {
        processFile(fp);
    }

    console.log(`\n--- النتيجة ---`);
    console.log(`ملفات فيهم تغيير: ${filesChanged} / ${htmlFiles.length}`);
    console.log(`مجموع الاستبدالات: ${totalReplacements}`);

    if (!APPLY && filesChanged > 0) {
        console.log('\n⚠️  هادي غير معاينة (dry-run). شغل بـ "--apply" باش يتكتبو الملفات فعليا.');
    }
    if (APPLY) {
        console.log('\n✅ تم التطبيق. باقي عليك يدويا:');
        console.log('   1) امسح privacy.html من /storage/emulated/0/Web/');
        console.log('   2) رفع support.html لنفس المجلد');
    }
}

main();
