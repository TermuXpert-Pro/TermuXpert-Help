#!/usr/bin/env node
/**
 * generate-fa-subset.js
 * كيفحص كل ملفات HTML ديال الموقع، كيجمع الأيقونات (fa-xxx) اللي
 * مستعملة فعليا، وكيبني نسخة "subset" محلية من Font Awesome (خط +
 * CSS) فيها غير هاد الأيقونات - بدل ما يتحمل الموقع المكتبة الكاملة
 * (+2000 أيقونة) من CDN فكل صفحة.
 *
 * النتيجة:
 *   assets/fonts/fontawesome/*.woff2   ← خط مصغر (غير الأيقونات المستعملة)
 *   assets/css/fontawesome-subset.css  ← CSS مصغر (نفس أسماء الكلاسات
 *                                         fa-xxx اللي ديجا مستعملة فـ HTML،
 *                                         بلا ما تحتاج تبدل شي حاجة فيهم)
 *
 * التثبيت (مرة وحدة):
 *   npm install --save-dev @fortawesome/fontawesome-free fontawesome-subset
 *
 * الاستخدام:
 *   node utils/generate-fa-subset.js
 *   خاصك تعاود تشغلها كل ما زدتي أيقونة (fa-xxx) جديدة ماكانتش
 *   مستعملة من قبل فالموقع.
 *
 * بعد ما تشغلها، خاصك تشغل:
 *   node utils/replace-fontawesome-cdn.js --apply
 *   باش يتبدل رابط CDN بالنسخة المحلية فكل صفحات الموقع.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SKIP_DIRS = ['node_modules', '.git'];
const FONT_OUT_DIR = path.join(ROOT, 'assets', 'fonts', 'fontawesome');
const CSS_OUT_PATH = path.join(ROOT, 'assets', 'css', 'fontawesome-subset.css');

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

// ============================================================
// 1) فحص كل ملفات HTML واستخراج الأيقونات المستعملة فعليا
//    (مع التمييز بين solid=fas و brands=fab)
// ============================================================
const CLASS_ATTR_RE = /class="([^"]*\bfa-[a-z0-9-]+[^"]*)"/g;
const ICON_NAME_RE = /\bfa-([a-z0-9-]+)\b/g;

const solidIcons = new Set();
const brandIcons = new Set();

console.log('🔍 فحص ملفات HTML لاستخراج الأيقونات المستعملة...\n');

const htmlFiles = walk(ROOT);
for (const file of htmlFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    let m;
    while ((m = CLASS_ATTR_RE.exec(content)) !== null) {
        const classStr = m[1];
        const isBrand = /\bfab\b/.test(classStr);
        const isSolid = /\bfas\b/.test(classStr);
        let im;
        ICON_NAME_RE.lastIndex = 0;
        while ((im = ICON_NAME_RE.exec(classStr)) !== null) {
            const name = im[1];
            // كنستثنيو كلاسات التحكم/الحجم اللي كتبدا بـ fa- ماشي أسماء أيقونات
            if (['solid', 'regular', 'brands', 'light', 'thin', 'duotone', 'sharp',
                 'fw', 'spin', 'pulse', 'border', 'pull-left', 'pull-right',
                 'inverse', 'stack', 'stack-1x', 'stack-2x', 'li', 'ul',
                 'xs', 'sm', 'lg', 'xl', '2xs', '2xl'].includes(name)) continue;
            if (/^\d+x$/.test(name) || /^rotate-/.test(name) || /^flip-/.test(name)) continue;

            if (isBrand) brandIcons.add(name);
            else solidIcons.add(name); // fas هو الافتراضي (ماكاينش far فالموقع)
        }
    }
}

const solidList = [...solidIcons].sort();
const brandList = [...brandIcons].sort();

console.log(`✅ لقيت ${solidList.length} أيقونة solid و ${brandList.length} أيقونة brand:\n`);
console.log('   Solid:', solidList.join(', '));
if (brandList.length) console.log('   Brands:', brandList.join(', '));

if (solidList.length === 0 && brandList.length === 0) {
    console.log('\n⚠️ ماكاينش أي أيقونة fa- فالموقع. توقفت بلا ما نبني شي حاجة.');
    process.exit(0);
}

// ============================================================
// 2) بناء الخط المصغر (subset) بواسطة fontawesome-subset
// ============================================================
let fontawesomeSubset;
try {
    ({ fontawesomeSubset } = require('fontawesome-subset'));
} catch (e) {
    console.error('\n❌ الحزمة "fontawesome-subset" ماشي مثبتة.');
    console.error('   شغل: npm install --save-dev @fortawesome/fontawesome-free fontawesome-subset');
    process.exit(1);
}

fs.mkdirSync(FONT_OUT_DIR, { recursive: true });

const subsetSpec = {};
if (solidList.length) subsetSpec.solid = solidList;
if (brandList.length) subsetSpec.brands = brandList;

console.log('\n🔨 بناء الخط المصغر...');
fontawesomeSubset(subsetSpec, FONT_OUT_DIR, { package: 'free' })
    .then(() => {
        console.log(`✅ الخط المصغر تبنى فـ ${path.relative(ROOT, FONT_OUT_DIR)}/`);
        generateCss();
    })
    .catch((err) => {
        console.error('❌ فشل بناء الخط:', err);
        process.exit(1);
    });

// ============================================================
// 3) بناء CSS مصغر: نفس أسماء كلاسات fa-xxx (بلا ما تحتاج تبدل
//    شي حاجة فـ HTML)، غير كيشير للخط المحلي المصغر بدل CDN
// ============================================================
function findFileByName(dir, filename, depth) {
    if (depth > 6 || !fs.existsSync(dir)) return null;
    let entries;
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch (e) { return null; }
    for (const entry of entries) {
        if (entry.isFile() && entry.name === filename) return path.join(dir, entry.name);
    }
    for (const entry of entries) {
        if (entry.isDirectory()) {
            const found = findFileByName(path.join(dir, entry.name), filename, depth + 1);
            if (found) return found;
        }
    }
    return null;
}

// كنبنيو خريطة (اسم الأيقونة → unicode) بقراءة all.min.css مباشرة
// بدل الاعتماد على metadata/icons.json - حيت هاد الملف تبدل شكلو
// (بحال JSON، بحال YAML فقط) بحسب نسخة @fortawesome/fontawesome-free،
// بينما CSS ديال المكتبة نفسها كيبقى دايما فيه القاعدة:
//   .fa-house{--fa:"\f015"}
// (أو .fa-name1,.fa-name2{--fa:"\fXXX"} للأيقونات اللي عندها بدائل اسم)
// وهادشي ثابت من نسخة لنسخة (FA6, FA7...).
function buildIconMap(cssContent) {
    const map = new Map();
    const ruleRe = /((?:\.fa-[a-z0-9-]+,?)+)\{--fa:"\\([0-9a-fA-F]+)"\}/g;
    let m;
    while ((m = ruleRe.exec(cssContent)) !== null) {
        const names = m[1].split(',').map(s => s.replace(/^\./, '').replace(/^fa-/, ''));
        const unicode = m[2];
        for (const name of names) {
            if (!map.has(name)) map.set(name, unicode);
        }
    }
    return map;
}

function generateCss() {
    const searchRoots = [
        path.join(ROOT, 'node_modules', '@fortawesome'),
        path.join(__dirname, 'node_modules', '@fortawesome'),
    ];
    let allCssPath = null;
    for (const root of searchRoots) {
        allCssPath = findFileByName(root, 'all.min.css', 0);
        if (allCssPath) break;
    }
    if (!allCssPath) {
        console.error('❌ ماقدرتش نلقى all.min.css حتى بالبحث التلقائي فـ node_modules/@fortawesome.');
        console.error('   شغّل هاد الأمر وبعثيلي النتيجة:');
        console.error('   find node_modules/@fortawesome -maxdepth 4 -type f -name "*.css"');
        process.exit(1);
    }

    console.log(`   📄 مصدر الأيقونات: ${path.relative(ROOT, allCssPath)}`);
    const iconMap = buildIconMap(fs.readFileSync(allCssPath, 'utf-8'));
    if (iconMap.size === 0) {
        console.error('❌ ماقدرتش نستخرج أي خريطة أيقونات من الملف - الصيغة تبدلت. بعثيلي شوية سطور من الملف.');
        process.exit(1);
    }

    const solidRules = [];
    const brandRules = [];

    for (const name of solidList) {
        const unicode = iconMap.get(name);
        if (!unicode) { console.warn(`   ⚠️ الأيقونة "${name}" ماكايناش فـ Font Awesome Free - تفقّد الاسم`); continue; }
        solidRules.push(`.fa-${name}::before{content:"\\${unicode}"}`);
    }
    for (const name of brandList) {
        const unicode = iconMap.get(name);
        if (!unicode) { console.warn(`   ⚠️ الأيقونة "${name}" ماكايناش فـ Font Awesome Free - تفقّد الاسم`); continue; }
        brandRules.push(`.fa-${name}::before{content:"\\${unicode}"}`);
    }

    const css = `/* ============================================================
   fontawesome-subset.css - تولّد أوتوماتيكياً من utils/generate-fa-subset.js
   ⚠️ لا تعدّل هذا الملف يدوياً - عاود شغّل السكريبت بدل ذلك.
   فيه غير الأيقونات المستعملة فعلياً فالموقع (${solidList.length + brandList.length} أيقونة)
   بدل مكتبة Font Awesome الكاملة (+2000 أيقونة).
   ============================================================ */

@font-face {
    font-family: 'Font Awesome 6 Free';
    font-style: normal;
    font-weight: 900;
    font-display: swap;
    src: url('../fonts/fontawesome/fa-solid-900.woff2') format('woff2');
}
${brandList.length ? `@font-face {
    font-family: 'Font Awesome 6 Brands';
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: url('../fonts/fontawesome/fa-brands-400.woff2') format('woff2');
}
` : ''}
.fa, .fas, .fab {
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    display: var(--fa-display, inline-block);
    font-style: normal;
    font-variant: normal;
    line-height: 1;
    text-rendering: auto;
}
.fas { font-family: 'Font Awesome 6 Free'; font-weight: 900; }
${brandList.length ? `.fab { font-family: 'Font Awesome 6 Brands'; font-weight: 400; }\n` : ''}
${solidRules.join('\n')}
${brandRules.length ? '\n' + brandRules.join('\n') : ''}
`;

    fs.writeFileSync(CSS_OUT_PATH, css, 'utf-8');
    console.log(`✅ CSS المصغر تكتب فـ ${path.relative(ROOT, CSS_OUT_PATH)}`);
    console.log('\n📋 الخطوة الجاية:');
    console.log('   node utils/replace-fontawesome-cdn.js --apply');
    console.log('   باش يتبدل رابط CDN بالنسخة المحلية فكل صفحات الموقع.');
}
