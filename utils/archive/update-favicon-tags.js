#!/usr/bin/env node
/**
 * update-favicon-tags.js
 * كيبدل التاغات القديمة ديال icon-192.png غير (اللي كانت مكررة فـ كل الصفحات)
 * بمجموعة كاملة ديال favicon.ico + icon-16 + icon-32 + icon-192 + apple-touch-icon.
 *
 * خاصك تدير هاد الخطوات قبل ما تشغل هاد السكريبت:
 *   1. حط favicon.ico فـ الجذر ديال المشروع (جنب manifest.json)
 *   2. حط icon-16.png, icon-32.png, apple-touch-icon.png فـ assets/images/
 *      (icon-192.png و icon-512.png بدلهم بالجداد اللي فيهم نفس الاسم)
 *   3. بدل manifest.json بالنسخة الجديدة
 *
 * الاستخدام:
 *   node utils/update-favicon-tags.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SKIP_DIRS = ['node_modules', '.git', 'partials', 'templates'];

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

// كيلقط التاغات القديمة الثلاثة (manifest + icon + apple-touch-icon) ويرجع
// الـ base (عدد ../) اللي كانو فيها، باش نبنيو بيهم التاغات الجداد
const OLD_BLOCK_RE =
    /( {0,4})<link rel="manifest" href="([^"]*)manifest\.json">\r?\n\s*<link rel="icon" href="[^"]*assets\/images\/icon-192\.png" type="image\/png">\r?\n\s*<link rel="apple-touch-icon" href="[^"]*assets\/images\/icon-192\.png">/;

function buildNewBlock(indent, base) {
    return `${indent}<link rel="manifest" href="${base}manifest.json">
${indent}<link rel="icon" href="${base}favicon.ico" sizes="any">
${indent}<link rel="icon" href="${base}assets/images/icon-16.png" sizes="16x16" type="image/png">
${indent}<link rel="icon" href="${base}assets/images/icon-32.png" sizes="32x32" type="image/png">
${indent}<link rel="icon" href="${base}assets/images/icon-192.png" sizes="192x192" type="image/png">
${indent}<link rel="apple-touch-icon" href="${base}assets/images/apple-touch-icon.png">`;
}

let updated = 0;
let skipped = 0;

console.log('🔨 بدء تحديث وسوم الـ favicon فـ <head>...\n');

for (const file of walk(ROOT)) {
    const content = fs.readFileSync(file, 'utf-8');
    const match = content.match(OLD_BLOCK_RE);

    if (!match) {
        skipped++;
        continue;
    }

    const [fullMatch, indent, base] = match;
    const newBlock = buildNewBlock(indent, base);
    const newContent = content.replace(fullMatch, newBlock);

    fs.writeFileSync(file, newContent, 'utf-8');
    updated++;
    console.log(`✅ ${path.relative(ROOT, file)}`);
}

console.log(`\n📊 تحديث: ${updated} | تخطي: ${skipped}`);
