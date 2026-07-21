#!/usr/bin/env node
/**
 * replace-cdn-assets.js
 * ============================================================
 * كيبدّل روابط CDN الخارجية (Google Fonts, GSAP, MathJax) بنسخ
 * محلية جوا assets/ فـ كل صفحات HTML بالموقع، مع احترام العمق
 * النسبي لكل صفحة (../ ../../ الخ).
 *
 * الاستعمال:
 *   node utils/replace-cdn-assets.js            # وضع المعاينة (dry-run) - مايبدلش والو
 *   node utils/replace-cdn-assets.js --apply    # يبدل فعليا فالملفات
 *
 * قبل الاستعمال، تأكد بلي عندك:
 *   - assets/css/google-fonts.css
 *   - assets/js/vendor/gsap.min.js
 *   - assets/js/vendor/mathjax-tex-svg.js
 * ============================================================
 */

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const APPLY = process.argv.includes('--apply');

// المجلدات اللي خاصنا نفتشو فيهم على ملفات HTML
const SEARCH_DIRS = ['.']; // كيفتش من الجذر بشكل recursive، ويستثني node_modules
const EXCLUDE_DIRS = new Set(['node_modules', '.git', 'assets']);

// الملفات المحلية المطلوبة (باش نتأكد بلي كاينين قبل مانبداو)
const REQUIRED_FILES = [
    'assets/css/google-fonts.css',
    'assets/js/vendor/gsap.min.js',
    'assets/js/vendor/mathjax-tex-svg.js',
];

// ------------------------------------------------------------
// 1) دالة لجمع كل ملفات HTML بشكل recursive
// ------------------------------------------------------------
function findHtmlFiles(dir, fileList = []) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            if (EXCLUDE_DIRS.has(entry.name)) continue;
            findHtmlFiles(fullPath, fileList);
        } else if (entry.isFile() && entry.name.endsWith('.html')) {
            fileList.push(fullPath);
        }
    }
    return fileList;
}

// ------------------------------------------------------------
// 2) حساب المسار النسبي لـ assets/ انطلاقا من مكان الملف
// ------------------------------------------------------------
function getRelativeAssetsPrefix(htmlFilePath) {
    const fileDir = path.dirname(htmlFilePath);
    const rel = path.relative(fileDir, path.join(ROOT, 'assets'));
    // نبدلو \ بـ / باش يخدم فـ الروابط (فحالة Windows)
    return rel.split(path.sep).join('/');
}

// ------------------------------------------------------------
// 3) قواعد التبديل (regex → دالة كتبني البديل بحسب المسار)
// ------------------------------------------------------------
function buildReplacements(assetsPrefix) {
    return [
        // إزالة أسطر preconnect / dns-prefetch الخاصة بـ 3 الموارد
        {
            name: 'إزالة preconnect/dns-prefetch (fonts.googleapis.com)',
            regex: /^\s*<link rel="(preconnect|dns-prefetch)" href="https:\/\/fonts\.googleapis\.com">\s*\n/gm,
            replacement: '',
        },
        {
            name: 'إزالة preconnect/dns-prefetch (fonts.gstatic.com)',
            regex: /^\s*<link rel="(preconnect|dns-prefetch)" href="https:\/\/fonts\.gstatic\.com"[^>]*>\s*\n/gm,
            replacement: '',
        },
        {
            name: 'إزالة preconnect/dns-prefetch (cdnjs.cloudflare.com)',
            regex: /^\s*<link rel="(preconnect|dns-prefetch)" href="https:\/\/cdnjs\.cloudflare\.com">\s*\n/gm,
            replacement: '',
        },
        {
            name: 'إزالة preconnect/dns-prefetch (cdn.jsdelivr.net)',
            regex: /^\s*<link rel="(preconnect|dns-prefetch)" href="https:\/\/cdn\.jsdelivr\.net">\s*\n/gm,
            replacement: '',
        },
        // رابط Google Fonts نفسو (css2?family=...)
        {
            name: 'تبديل رابط Google Fonts',
            regex: /<link href="https:\/\/fonts\.googleapis\.com\/css2\?family=[^"]*" rel="stylesheet">/g,
            replacement: `<link rel="stylesheet" href="${assetsPrefix}/css/google-fonts.css">`,
        },
        // GSAP
        {
            name: 'تبديل رابط GSAP',
            regex: /<script src="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/gsap\/[^"]*\/gsap\.min\.js"><\/script>/g,
            replacement: `<script src="${assetsPrefix}/js/vendor/gsap.min.js"></script>`,
        },
        // MathJax
        {
            name: 'تبديل رابط MathJax',
            regex: /<script src="https:\/\/cdn\.jsdelivr\.net\/npm\/mathjax@3\/es5\/tex-svg\.js"\s*defer><\/script>/g,
            replacement: `<script src="${assetsPrefix}/js/vendor/mathjax-tex-svg.js" defer></script>`,
        },
    ];
}

// ------------------------------------------------------------
// 4) المعالجة الرئيسية
// ------------------------------------------------------------
function main() {
    console.log('🔍 كنفتشو على ملفات HTML...\n');

    // تحقق من وجود الملفات المحلية المطلوبة
    const missing = REQUIRED_FILES.filter(f => !fs.existsSync(path.join(ROOT, f)));
    if (missing.length > 0) {
        console.log('❌ الملفات التالية ناقصة، خاصك تجيبهم قبل ما تشغل هاد السكريبت:');
        missing.forEach(f => console.log(`   - ${f}`));
        process.exit(1);
    }

    const htmlFiles = findHtmlFiles(ROOT);
    console.log(`✅ لقيت ${htmlFiles.length} ملف HTML\n`);

    let totalChanges = 0;
    let filesChanged = 0;
    const filesWithNoMatch = [];

    for (const file of htmlFiles) {
        const original = fs.readFileSync(file, 'utf8');
        let updated = original;
        const assetsPrefix = getRelativeAssetsPrefix(file);
        const replacements = buildReplacements(assetsPrefix);

        let fileChanges = 0;
        for (const { name, regex, replacement } of replacements) {
            const matches = updated.match(regex);
            if (matches) {
                fileChanges += matches.length;
                updated = updated.replace(regex, replacement);
            }
        }

        if (fileChanges > 0) {
            totalChanges += fileChanges;
            filesChanged++;
            const relFile = path.relative(ROOT, file);
            console.log(`📄 ${relFile} → ${fileChanges} تبديل (assets prefix: ${assetsPrefix})`);
            if (APPLY) {
                fs.writeFileSync(file, updated, 'utf8');
            }
        } else {
            filesWithNoMatch.push(path.relative(ROOT, file));
        }
    }

    console.log('\n============================================================');
    console.log(`📊 الملخص: ${filesChanged} ملف تبدل فيه شي حاجة، ${totalChanges} تبديل مجموعي`);
    if (filesWithNoMatch.length > 0) {
        console.log(`ℹ️  ${filesWithNoMatch.length} ملف مافيهش حتى تبديل (عادي إلا الملف مايستعملش هاد الموارد أصلا)`);
    }

    if (!APPLY) {
        console.log('\n⚠️  هادي كانت معاينة (dry-run) فقط - مابدلتش والو فعليا.');
        console.log('   شغّل بـ --apply باش يتبدلو الملفات فعليا:');
        console.log('   node utils/replace-cdn-assets.js --apply');
    } else {
        console.log('\n✅ التبديل تم فعليا فكل الملفات.');
    }
    console.log('============================================================');
}

main();
