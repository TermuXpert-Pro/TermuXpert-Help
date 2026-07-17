#!/usr/bin/env node
/**
 * fix-theme-colors.js
 * سكريبت مرة-وحدة (one-off) كيدور على *كل* ملفات .html و.css ديال المشروع
 * وكيبدل الكولورات hardcoded اللي بقات ما كتجاوبش مع data-theme="light"
 * (صناديق exercice/exemple/solution، وبعض rgba() ديال overlay/navbar اللي
 * كانو مكررين inline فبعض الصفحات بدل ما يكونو مبنيين على var()).
 *
 * بلا خطر: التبديلات كلها scoped بدقة (regex كيشترط السياق: "background:",
 * "color:", "border:" قبل القيمة) باش ما يمسش شي حاجة أخرى بحال كولورات
 * الـ canvas/JS (ctx.strokeStyle = '#A8FF78') اللي خاصها تبقى كيفما هية.
 *
 * الاستخدام (مرة وحدة، من بعد ما تزاد الـ variables الجداد فـ style.css):
 *   node utils/fix-theme-colors.js
 *
 * فين تندرج فـ pipeline (مرة وحدة فقط، ماشي كل build):
 *   node utils/fix-theme-colors.js
 *   node utils/build.js
 *   node utils/inject-pwa-head.js
 *   node utils/inject-theme-init.js
 *   node utils/generate-sitemap.js
 *   node utils/validate.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SKIP_DIRS = ['node_modules', '.git', 'partials', 'templates'];
const EXTENSIONS = ['.html', '.css'];

function walk(dir, fileList = []) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (SKIP_DIRS.includes(entry.name)) continue;
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            walk(full, fileList);
        } else if (EXTENSIONS.includes(path.extname(entry.name))) {
            fileList.push(full);
        }
    }
    return fileList;
}

// كل تبديل: [الوصف, regex, البديل]
const REPLACEMENTS = [
    ['exercice/exemple-box bg', /background:\s?#1A2A2A;/g, 'background: var(--exercice-bg);'],
    ['exercice-box title', /color:\s?#E8873A;/g, 'color: var(--exercice-title);'],
    ['solution-box bg', /background:\s?#1A2A1A;/g, 'background: var(--solution-bg);'],
    ['solution-box border', /border:\s?1px solid #A8FF7844;/g, 'border: 1px solid var(--solution-border);'],
    ['solution-box title', /color:\s?#A8FF78;/g, 'color: var(--solution-title);'],
    ['navbar/tabs bg (rgba 11,12,16)', /rgba\(11,\s?12,\s?16,\s?([0-9.]+)\)/g, 'rgba(var(--bg-primary-rgb), $1)'],
    ['white overlay tint (rgba 255,255,255)', /rgba\(255,\s?255,\s?255,\s?([0-9.]+)\)/g, 'rgba(var(--overlay-rgb), $1)'],
    // الرسومات البيانية (canvas/svg) خاصها تبقى بنفس اللون فـ dark و light -
    // الكولورات المرسومة (محاور، labels...) مصممة على خلفية غامقة ثابتة،
    // فما خاصهاش تتبع data-theme، وإلا النص الأبيض كيولي "خفي" فوق خلفية بيضة.
    ['graph-container bg (fixed, non-theme)', /\.graph-container\s*\{\s*background:\s?var\(--bg-primary\);/g, '.graph-container {\n            background: #0D1117;'],
];

let filesChanged = 0;
const perRuleCount = {};

console.log('🎨 بدء تصحيح الكولورات hardcoded باش تجاوب مع light mode...\n');

for (const file of walk(ROOT)) {
    let content = fs.readFileSync(file, 'utf-8');
    let original = content;
    let fileHits = [];

    for (const [label, regex, replacement] of REPLACEMENTS) {
        const matches = content.match(regex);
        if (matches && matches.length) {
            content = content.replace(regex, replacement);
            perRuleCount[label] = (perRuleCount[label] || 0) + matches.length;
            fileHits.push(`${label} (${matches.length})`);
        }
    }

    if (content !== original) {
        fs.writeFileSync(file, content);
        filesChanged++;
        console.log(`   ✅ ${path.relative(ROOT, file)} - ${fileHits.join(', ')}`);
    }
}

console.log(`\n📊 ملخص:`);
for (const [label, count] of Object.entries(perRuleCount)) {
    console.log(`   - ${label}: ${count} مرة`);
}
console.log(`\n✅ خلص: ${filesChanged} ملف تصحح.`);
console.log(`⚠️ تذكر: خاصك تكون زدتي الـ variables (--exercice-bg, --solution-bg, إلخ) فـ style.css قبل ما تشغل هاد السكريبت.`);
