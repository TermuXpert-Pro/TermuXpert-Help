#!/usr/bin/env node
/* ============================================================
   utils/speed-up-loader.js
   -----------------------------------------------------------
   الهدف:
   تقصير الوقت اللي كيبقى فيه #xpertLoader بادي (الدائرة اللي كتدور)
   قبل ما يبان محتوى الصفحة وزر الأقسام (FAB). كاين جزءين:

     1) assets/js/script.js  -> هادو هوما القيم اللي فعلاً خدامة بيهم
        كل الصفحات دابا (بين علامات "XPERT LOADER START/END").
     2) utils/add-xpert-loader.js -> template الجينيراتور، باش أي
        صفحة جديدة تولد فالمستقبل تجي بنفس القيم المقصورة.

   القيم:
     MIN_DISPLAY   500ms  -> 200ms   (المدة الدنيا اللي خاص اللودر يبان بيها)
     HARD_TIMEOUT/
     fallback      3000/6000ms -> 1500ms  (الحماية إيلا حدث التحميل ماجاش)

   الاستعمال:
     node utils/speed-up-loader.js            -> Dry-run
     node utils/speed-up-loader.js --apply    -> يطبق فعلياً
   ============================================================ */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const APPLY = process.argv.includes('--apply');

const NEW_MIN_DISPLAY = 200;
const NEW_FALLBACK = 1500;

const targets = [
    {
        file: path.join(ROOT, 'assets', 'js', 'script.js'),
        replacements: [
            { re: /var MIN_DISPLAY = 500;/, to: `var MIN_DISPLAY = ${NEW_MIN_DISPLAY};` },
            { re: /setTimeout\(hideLoader, 3000\);/, to: `setTimeout(hideLoader, ${NEW_FALLBACK});` },
        ],
    },
    {
        file: path.join(ROOT, 'utils', 'add-xpert-loader.js'),
        replacements: [
            { re: /var MIN_DISPLAY = 500;/, to: `var MIN_DISPLAY = ${NEW_MIN_DISPLAY};` },
            { re: /var HARD_TIMEOUT = 6000;/, to: `var HARD_TIMEOUT = ${NEW_FALLBACK};` },
        ],
    },
];

console.log('========================================');
console.log(APPLY ? '🔧 تطبيق تقصير وقت اللودر' : '🔍 Dry-run: فحص تقصير وقت اللودر');
console.log('========================================');

let totalChanges = 0;

for (const target of targets) {
    if (!fs.existsSync(target.file)) {
        console.log('⏭️  الملف ماكاينش:', path.relative(ROOT, target.file));
        continue;
    }
    let content = fs.readFileSync(target.file, 'utf8');
    let fileChanges = 0;

    for (const rep of target.replacements) {
        if (rep.re.test(content)) {
            if (content.match(new RegExp(rep.to.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))) {
                console.log('♻️  القيمة مقصورة من قبل فـ', path.relative(ROOT, target.file), '->', rep.to);
                continue;
            }
            content = content.replace(rep.re, rep.to);
            fileChanges++;
        }
    }

    if (fileChanges > 0) {
        console.log('✅', path.relative(ROOT, target.file), ':', fileChanges, 'تعديل(ات)');
        totalChanges += fileChanges;
        if (APPLY) fs.writeFileSync(target.file, content, 'utf8');
    } else {
        console.log('⏭️  ماكاينش شي حاجة نبدلها فـ', path.relative(ROOT, target.file), '(القيم القديمة ماتلقاوش، أو تبدلات من قبل)');
    }
}

console.log('----------------------------------------');
console.log('مجموع التعديلات:', totalChanges);
if (!APPLY && totalChanges > 0) {
    console.log('ملاحظة: هادي Dry-run فقط. باش تطبق: node utils/speed-up-loader.js --apply');
}
