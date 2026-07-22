#!/usr/bin/env node
/**
 * fix-xpert-loader.js
 * ============================================================
 * كيصلح 4 مشاكل ديال اللودر (add-xpert-loader.js) عبر المشروع كامل:
 *
 *   1) اللودر كيخبي navbar/toolbar   → دابا كيبدا تحت الـ navbar
 *      (top:var(--navbar-height)) و z-index أقل من الـ navbar.
 *   2) كلمة "Xpert" تحت الشكل         → كتتحيد من كل صفحة.
 *   3) التكرار (يبان/يختفي/يبان)      → منطق الإخفاء دابا كيعتمد
 *      على DOMContentLoaded بلا ما يتسنى 'load' كامل الصفحة.
 *   4) مدة دنيا 0.5 ثانية              → اللودر خاصو يبان 500ms
 *      كحد أدنى حتى لو الصفحة تحملت بزربة، باش ما يكونش تشوه
 *      بصري (ظهور واختفاء فبرقة العين).
 *
 * الاستخدام (بحال باقي utils/*.js):
 *   node utils/fix-xpert-loader.js          → dry-run
 *   node utils/fix-xpert-loader.js --apply  → يطبق فعليا
 *
 * السكريبت safe للتشغيل عدة مرات (idempotent).
 * ============================================================
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const APPLY = process.argv.includes('--apply');
const SKIP_DIRS = ['node_modules', '.git', 'partials'];

function log(ok, msg) {
    console.log((ok ? '✅ ' : '⏭️ ') + msg);
}

// ============================================================
// 1) assets/css/style.css
// ============================================================
function fixStyleCss() {
    const p = path.join(ROOT, 'assets', 'css', 'style.css');
    if (!fs.existsSync(p)) { log(false, 'ماقدرتش نلقى assets/css/style.css'); return; }
    let content = fs.readFileSync(p, 'utf-8');
    let changed = false;

    // --- 1.a) اللودر يبدا تحت الـ navbar، z-index أقل ---
    const OLD_POSITION = `#xpertLoader{
    position:fixed; inset:0; z-index:100000;
    background:var(--bg-primary);`;
    const NEW_POSITION = `#xpertLoader{
    position:fixed; top:var(--navbar-height); left:0; right:0; z-index:900;
    height:calc(100vh - var(--navbar-height));
    height:calc(100svh - var(--navbar-height));
    background:var(--bg-primary);`;

    if (content.includes(OLD_POSITION)) {
        content = content.replace(OLD_POSITION, NEW_POSITION);
        changed = true;
        log(true, 'style.css: اللودر دابا كيبدا تحت الـ navbar (toolbar غادي تبان مباشرة)');
    } else if (content.includes('top:var(--navbar-height)') && content.includes('#xpertLoader')) {
        log(false, 'style.css: التعديل ديال الموقع ديجا مطبق (تخطيت)');
    } else if (content.includes('#xpertLoader')) {
        log(false, 'style.css: ماقدرتش نلقى الجزء المتوقع فـ #xpertLoader (تحقق يدويا)');
    }

    // --- 1.b) حيد الكتلة ديال .xpert-loader-brand ---
    const BRAND_CSS_RE = /\n?\.xpert-loader-brand\{[^}]*\}\n?\.xpert-loader-brand span\{[^}]*\}\n?/;
    if (BRAND_CSS_RE.test(content)) {
        content = content.replace(BRAND_CSS_RE, '\n');
        changed = true;
        log(true, 'style.css: تحيدت الكتلة ديال .xpert-loader-brand');
    } else if (!content.includes('.xpert-loader-brand')) {
        log(false, 'style.css: .xpert-loader-brand ديجا محيدة (تخطيت)');
    } else {
        log(false, 'style.css: ماقدرتش نلقى .xpert-loader-brand بالشكل المتوقع (تحقق يدويا)');
    }

    if (changed && APPLY) {
        fs.writeFileSync(p, content);
    } else if (changed && !APPLY) {
        console.log('   [dry-run] غادي يتزاد التعديل فـ style.css');
    }
}

// ============================================================
// 2) assets/js/script.js
// ============================================================
const JS_MARKER_START = '// ====== XPERT LOADER START (add-xpert-loader.js) ======';
const JS_MARKER_END = '// ====== XPERT LOADER END ======';

const NEW_JS_BLOCK = `${JS_MARKER_START}
(function () {
    'use strict';

    var loader = document.getElementById('xpertLoader');
    if (!loader) return; // الصفحة ماعندهاش لودر

    // مدة دنيا (بالميلي ثانية): اللودر خاصو يبان دائما بيها حتى لو
    // الصفحة تحملت بزربة زيادة - باش ما يكونش تشوه بصري (ظهور
    // واختفاء فبرقة العين).
    // ⚠️ TEST: مزيدة لـ 10 ثواني دابا باش تقدر تشوف الشكل والحركة
    // مزيان. رجعها لـ 500 (نصف ثانية) ملي تسالي من التجربة.
    var MIN_DISPLAY = 500;
    var start = performance.now();
    var hidden = false;

    function reallyHide() {
        loader.classList.add('xpert-loader-hide');
        document.body.classList.add('xpert-loaded');
    }

    function hideLoader() {
        if (hidden) return;
        hidden = true;
        var elapsed = performance.now() - start;
        var wait = Math.max(0, MIN_DISPLAY - elapsed);
        setTimeout(reallyHide, wait);
    }

    // كنعتمدو على DOMContentLoaded (الـ DOM جاهز) بلا ما نتسناو
    // 'load' اللي كيتسنى الصور والموارد كاملين.
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', hideLoader);
    } else {
        hideLoader();
    }

    // حماية: إيلا لسبب ما DOMContentLoaded ماجاش، نخبيو بالقوة
    setTimeout(hideLoader, 3000);
})();
${JS_MARKER_END}`;

function fixScriptJs() {
    const p = path.join(ROOT, 'assets', 'js', 'script.js');
    if (!fs.existsSync(p)) { log(false, 'ماقدرتش نلقى assets/js/script.js'); return; }
    let content = fs.readFileSync(p, 'utf-8');

    const startIdx = content.indexOf(JS_MARKER_START);
    const endIdx = content.indexOf(JS_MARKER_END);

    if (startIdx === -1 || endIdx === -1) {
        log(false, 'script.js: ماقدرتش نلقى كتلة اللودر (تخطيت)');
        return;
    }

    const oldBlock = content.slice(startIdx, endIdx + JS_MARKER_END.length);
    if (oldBlock === NEW_JS_BLOCK) {
        log(false, 'script.js: منطق الإخفاء ديجا محدث (تخطيت)');
        return;
    }

    content = content.slice(0, startIdx) + NEW_JS_BLOCK + content.slice(endIdx + JS_MARKER_END.length);

    if (APPLY) {
        fs.writeFileSync(p, content);
        log(true, 'script.js: تحدث منطق إخفاء اللودر (DOMContentLoaded بدل load)');
    } else {
        log(true, '[dry-run] script.js: غادي يتحدث منطق إخفاء اللودر');
    }
}

// ============================================================
// 3) حيد كلمة "Xpert" (brand) من كل صفحات HTML
// ============================================================
const BRAND_HTML_RE = /\s*<div class="xpert-loader-brand"><span>X<\/span>pert<\/div>\n?/;

function walkHtml(dir, fileList) {
    fileList = fileList || [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (SKIP_DIRS.includes(entry.name)) continue;
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            walkHtml(full, fileList);
        } else if (entry.name.endsWith('.html')) {
            fileList.push(full);
        }
    }
    return fileList;
}

function fixHtmlFiles() {
    const files = walkHtml(ROOT);
    let updated = 0, skipped = 0;

    for (const file of files) {
        let content = fs.readFileSync(file, 'utf-8');
        const rel = path.relative(ROOT, file);

        if (!content.includes('xpert-loader-brand')) {
            skipped++;
            continue;
        }

        content = content.replace(BRAND_HTML_RE, '\n');

        if (APPLY) {
            fs.writeFileSync(file, content);
        }
        updated++;
        console.log(`   ${APPLY ? '✅' : '📝'} ${rel}`);
    }

    console.log(`\n📄 صفحات HTML: ${updated} ${APPLY ? 'تحيدت منها كلمة Xpert' : 'غادي تتحيد منها كلمة Xpert'}, ${skipped} تخطيت (ماعندهاش اللودر أو ديجا نظيفة).`);
}

// ============================================================
// تشغيل
// ============================================================
console.log(APPLY ? '🚀 تطبيق تصحيحات اللودر على المشروع كامل...\n' : '🔎 Dry-run (بلا تعديل فعلي) - زيد --apply باش يتطبق فعليا...\n');

fixStyleCss();
fixScriptJs();
console.log('');
fixHtmlFiles();

console.log('\n✅ انتهى.');
if (!APPLY) {
    console.log('💡 هاد كان dry-run غير. باش يتطبق فعليا:');
    console.log('   node utils/fix-xpert-loader.js --apply');
}
