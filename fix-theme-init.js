#!/usr/bin/env node
/**
 * fix-theme-init.js
 * ============================================================
 * كيضمن أن كل صفحة HTML فالمشروع فيها سكريبت "theme-init" INLINE حقيقي
 * (ماشي غير عبر ملف خارجي بحال shared-inline.js) - وهو اللي كيقرا
 * localStorage('xpert-theme') ويحط data-theme="light" على <html>
 * قبل ما يبدا المتصفح يقرا أي CSS. هادشي هو اللي كيخلي اختيار
 * الوضع (Dark/Light) يتطبق مباشرة فـ *كل* صفحة كتفتح - ماشي غير
 * الصفحة اللي دار فيها التبديل.
 *
 * ليش هاد السكريبت خاصو يكون INLINE ديما (بلا src خارجي):
 *   - <script src="..."> خاصو requête شبكة قبل ما يتنفذ، حتى ولو
 *     من الكاش كاين تأخير بسيط = وميض (FOUC) فين الصفحة كتبان
 *     بالوضع الغالط قبل ما ترجع للوضع الصحيح.
 *   - سكريبت inline صغير كيتنفذ فوراً ملي كيوصلو الـ parser، بلا
 *     أي تأخير شبكة.
 *
 * شنو كيدير هاد السكريبت بالضبط، فكل ملف .html فيه <head>:
 *   1) كيقلب على نسخة INLINE حقيقية ديال theme-init (id="theme-init"
 *      أو نفس الكود بلا id) داخل <head>.
 *   2) إلا كانت موجودة ومحطوطة قبل أول <link rel="stylesheet"> وأول
 *      <script src> → ماكيبدلش والو (idempotent).
 *   3) إلا كانت موجودة لكن ماشي فالبداية (بعد شي stylesheet/script) →
 *      كيمسحها من بلاصتها وكيعاود يدخلها مباشرة بعد <head ...> فأول
 *      سطر، باش تخدم بلا وميض.
 *   4) إلا ماكانتش موجودة أصلا (INLINE) → كيدخلها مباشرة بعد
 *      <head ...>. (حتى لو الصفحة فيها <script src="shared-inline.js">
 *      اللي فيه نفسها الكود - مادار عليها الاعتماد الوحيد، لأن هادشي
 *      هو بالضبط السبب اللي كان كيخلي الوضع مايتطبقش فبعض الصفحات:
 *      الاعتماد على ملف خارجي بدل سكريبت inline مباشر.)
 *
 * الاستعمال:
 *   node fix-theme-init.js --dry-run     # معاينة بلا تعديل
 *   node fix-theme-init.js               # تطبيق التعديلات فعلا
 *   node fix-theme-init.js --root=/path  # جذر مخصص (افتراضي: .)
 * ============================================================
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const rootArg = args.find(a => a.startsWith('--root='));
const ROOT = rootArg ? path.resolve(rootArg.split('=')[1]) : process.cwd();

const IGNORE_DIRS = new Set(['node_modules', '.git', 'dist', 'build']);

// السكريبت المعياري اللي غادي يتدخل فكل صفحة ناقصاه
const THEME_INIT_SNIPPET =
    '<script id="theme-init">(function(){try{var t=localStorage.getItem(\'xpert-theme\');' +
    'if(t===\'light\'){document.documentElement.setAttribute(\'data-theme\',\'light\');}' +
    '}catch(e){}})();</script>';

// كيلقط أي نسخة INLINE ديال theme-init (بـ id أو بلاه)، بلا حساسية
// للمسافات/التنسيق
const INLINE_THEME_INIT_RE =
    /<script\b(?:(?!<\/script>)[\s\S])*?localStorage\.getItem\(\s*['"]xpert-theme['"]\s*\)[\s\S]*?<\/script>\s*/i;

const HEAD_OPEN_RE = /<head\b[^>]*>/i;
// أول <link rel="stylesheet"> أو أول <script src=...> داخل head - أي
// حاجة كتحمل CSS أو JS خارجي، خاص theme-init يكون قبلها
const FIRST_RESOURCE_RE = /<link\b[^>]*\brel=["']stylesheet["'][^>]*>|<script\b[^>]*\bsrc=/i;

let filesScanned = 0;
let filesSkippedNoHead = 0;
let filesAlreadyOk = 0;
let filesInserted = 0;
let filesRepositioned = 0;
const insertedList = [];
const repositionedList = [];

function walk(dir, out = []) {
    let entries;
    try {
        entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch (e) {
        return out;
    }
    for (const entry of entries) {
        if (entry.name.startsWith('.')) continue;
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            if (IGNORE_DIRS.has(entry.name)) continue;
            walk(full, out);
        } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.html')) {
            out.push(full);
        }
    }
    return out;
}

function processFile(filePath) {
    filesScanned++;
    const original = fs.readFileSync(filePath, 'utf8');
    const rel = path.relative(ROOT, filePath);

    const headMatch = original.match(HEAD_OPEN_RE);
    if (!headMatch) {
        // ملف بلا <head> (بحال partials/navbar.html) - تجاوز بصمت
        filesSkippedNoHead++;
        return;
    }

    let html = original;
    const headOpenEnd = html.indexOf(headMatch[0]) + headMatch[0].length;
    const headContentAfter = html.slice(headOpenEnd);

    const existingMatch = headContentAfter.match(INLINE_THEME_INIT_RE);

    if (existingMatch) {
        const existingIndexInHead = existingMatch.index;
        const beforeExisting = headContentAfter.slice(0, existingIndexInHead);
        const hasResourceBefore = FIRST_RESOURCE_RE.test(beforeExisting);

        if (!hasResourceBefore) {
            // موجودة ديجا وفالبداية الصحيحة - والو مايتبدل
            filesAlreadyOk++;
            return;
        }

        // موجودة لكن ماشي فالبداية - كنمسحوها ونعاودو ندخلوها فأول <head>
        const cleanedAfter =
            headContentAfter.slice(0, existingIndexInHead) +
            headContentAfter.slice(existingIndexInHead + existingMatch[0].length);

        html =
            html.slice(0, headOpenEnd) +
            '\n    ' + THEME_INIT_SNIPPET + '\n' +
            cleanedAfter;

        filesRepositioned++;
        repositionedList.push(rel);
    } else {
        // ماكاينة حتى نسخة inline - كندخلوها مباشرة بعد <head ...>
        html =
            html.slice(0, headOpenEnd) +
            '\n    ' + THEME_INIT_SNIPPET +
            html.slice(headOpenEnd);

        filesInserted++;
        insertedList.push(rel);
    }

    if (!DRY_RUN) {
        fs.writeFileSync(filePath, html, 'utf8');
    }
}

console.log(`🔎 كنقلب فـ: ${ROOT}${DRY_RUN ? '  (dry-run — بلا كتابة)' : ''}\n`);

const files = walk(ROOT);
files.forEach(processFile);

console.log(`📄 عدد الملفات اللي تفحصات: ${filesScanned}`);
console.log(`⏭️  عدد الملفات المتجاوزة (بلا <head>): ${filesSkippedNoHead}`);
console.log(`✅ عدد الملفات اللي كانت ديجا صحيحة: ${filesAlreadyOk}`);
console.log(`➕ عدد الملفات اللي تزاد فيها theme-init: ${filesInserted}`);
console.log(`↕️  عدد الملفات اللي تصلح فيها مكان theme-init: ${filesRepositioned}\n`);

if (insertedList.length) {
    console.log('---- الملفات اللي تزاد فيها theme-init ----');
    insertedList.forEach(rel => console.log(`  - ${rel}`));
    console.log('');
}

if (repositionedList.length) {
    console.log('---- الملفات اللي تصلح فيها مكان theme-init ----');
    repositionedList.forEach(rel => console.log(`  - ${rel}`));
    console.log('');
}

if (DRY_RUN) {
    console.log('ℹ️  هادي كانت معاينة (dry-run) فقط - عاود شغل بلا --dry-run باش تتكتب التعديلات فعلا.');
} else {
    console.log('✅ تم. رد بالك تدير git diff قبل ما تكوميتي، باش تشوف التغييرات.');
}

