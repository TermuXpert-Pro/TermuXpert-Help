#!/usr/bin/env node
/**
 * generate-sw-cache.js
 * كيولد قائمة urlsToCache فـ sw.js أوتوماتيكياً انطلاقاً من محتوى content/
 * (بلا الصفحات noindex/"قيد الإعداد") - بنفس منطق generate-sitemap.js بالضبط.
 *
 * كيحافظ على: CACHE_NAME (كيدبرها build.js)، الصفحات الجذرية والـ assets،
 * ومنطق install/fetch/activate - كيبدل غير مصفوفة urlsToCache.
 *
 * ✅ يخدم أوتوماتيكياً مع model1/model2/model3... وأي عمق جديد فالمستقبل
 * (كيمشي recursive بلا ما يفترض عمق ثابت).
 *
 * الاستخدام: node utils/generate-sw-cache.js
 * شغّلها بعد أي تغيير فـ content/ (زيادة درس/تمرين/سلسلة/نموذج جديد)،
 * جنب node utils/generate-sitemap.js و node utils/build.js.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const CONTENT_DIR = path.join(ROOT, 'content');
const SW_PATH = path.join(ROOT, 'sw.js');

// ====== الجزء الثابت (نفسه دائماً، ماشي مرتبط بـ content/) ======
const STATIC_URLS = [
    './',
    './index.html',
    './subjects.html',
    './subject.html',
    './assets/css/style.css',
    './assets/css/lesson-common.css',
    './assets/css/global-control.css',
    './assets/js/script.js',
    './assets/js/protection.js',
    './assets/images/profile.png',
];

const SUBJECT_LABELS = { math: 'الرياضيات', physique: 'الفيزياء', chimie: 'الكيمياء' };
const TYPE_LABELS = { lessons: 'دروس', series: 'سلاسل', exercises: 'تمارين' };
const TYPE_ORDER = ['lessons', 'series', 'exercises'];

function walk(dir, fileList = []) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(full, fileList);
        else if (entry.name.endsWith('.html')) fileList.push(full);
    }
    return fileList;
}

function isNoIndex(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    return /<meta\s+name="robots"\s+content="noindex"/.test(content);
}

const subjects = fs.readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)
    .sort();

const blockLines = [];
let dynamicCount = 0;

for (const subject of subjects) {
    for (const type of TYPE_ORDER) {
        const typeDir = path.join(CONTENT_DIR, subject, type);
        if (!fs.existsSync(typeDir)) continue;

        const files = walk(typeDir).filter(f => !isNoIndex(f));
        if (files.length === 0) continue;

        const rel = files
            .map(f => './' + path.relative(ROOT, f).split(path.sep).join('/'))
            .sort();

        const label = `${TYPE_LABELS[type]} ${SUBJECT_LABELS[subject] || subject}`;
        blockLines.push(`\n    // ====== ${label} ======`);
        for (const r of rel) {
            blockLines.push(`    '${r}',`);
            dynamicCount++;
        }
    }
}

const staticBlock = STATIC_URLS.map(u => `    '${u}',`).join('\n');
const dynamicBlock = blockLines.join('\n');
const newArrayBody = `${staticBlock}\n${dynamicBlock}`;

let swContent = fs.readFileSync(SW_PATH, 'utf-8');
const ARRAY_RE = /const urlsToCache = \[[\s\S]*?\n\];/;

if (!ARRAY_RE.test(swContent)) {
    console.error('❌ ماقدرتش نلقى "const urlsToCache = [...]" فـ sw.js - تأكد من البنية.');
    process.exit(1);
}

swContent = swContent.replace(ARRAY_RE, `const urlsToCache = [\n${newArrayBody}\n];`);
fs.writeFileSync(SW_PATH, swContent);

console.log(`✅ sw.js: urlsToCache تحدثت أوتوماتيكياً (${STATIC_URLS.length + dynamicCount} رابط، ${dynamicCount} من content/).`);
console.log('⚠️  ملاحظة: هاذ السكريبت كيبدل غير المصفوفة - CACHE_NAME خاصها node utils/build.js باش تتزاد (hash جديد).');
