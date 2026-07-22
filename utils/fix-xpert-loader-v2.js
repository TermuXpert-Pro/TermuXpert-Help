#!/usr/bin/env node
/**
 * fix-xpert-loader-v2.js
 * ============================================================
 * كيصلح 2 مشاكل بقاو من fix-xpert-loader.js:
 *
 *   1) MIN_DISPLAY باقي 10000 (10 ثواني - قيمة تجريبية نسيتي
 *      ترجعها) بحال فـ assets/js/script.js وبحال جوا القالب ديال
 *      utils/fix-xpert-loader.js. رجعتها لـ 500ms فـ الجوج.
 *      عدلت ايضا utils/add-xpert-loader.js (كانت 1200) باش كلشي
 *      متوافق (500ms) من البداية لأي صفحة جديدة.
 *
 *   2) اللودر كيقفز عمودياً فمتصفحات الموبايل: كان كيعتمد على
 *      bottom:0 اللي كيتبدل مع الـ viewport ملي كيختفي/يبان شريط
 *      العنوان. دابا كيستعمل height:calc(100svh - navbar-height)
 *      (مع fallback لـ 100vh للمتصفحات القديمة) باش الارتفاع يبقى
 *      ثابت وما يقفزش.
 *
 * الاستخدام (بحال باقي utils/*.js):
 *   node utils/fix-xpert-loader-v2.js          → dry-run
 *   node utils/fix-xpert-loader-v2.js --apply  → يطبق فعليا
 *
 * السكريبت safe للتشغيل عدة مرات (idempotent).
 * ============================================================
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const APPLY = process.argv.includes('--apply');

function log(ok, msg) {
    console.log((ok ? '✅ ' : '⏭️ ') + msg);
}

function readFile(rel) {
    const p = path.join(ROOT, rel);
    if (!fs.existsSync(p)) { log(false, `ماقدرتش نلقى ${rel}`); return null; }
    return { p, content: fs.readFileSync(p, 'utf-8') };
}

function writeIfChanged(file, newContent, label) {
    if (newContent === file.content) {
        log(false, `${label}: ماكاينش تغيير (تخطيت)`);
        return;
    }
    if (APPLY) {
        fs.writeFileSync(file.p, newContent);
        log(true, `${label}: تصلح وتطبق`);
    } else {
        log(true, `${label}: غادي يتصلح (dry-run، زيد --apply باش يتطبق)`);
    }
}

// ============================================================
// 1) MIN_DISPLAY: 10000 -> 500 (فـ أي ملف فيه هاد السطر بالضبط)
// ============================================================
const OLD_MIN_DISPLAY_10S = 'var MIN_DISPLAY = 10000;';
const NEW_MIN_DISPLAY_500 = 'var MIN_DISPLAY = 500;';

const OLD_MIN_DISPLAY_1200 = 'var MIN_DISPLAY = 1200;';

function fixMinDisplay(rel) {
    const file = readFile(rel);
    if (!file) return;
    let content = file.content;
    let changed = false;

    if (content.includes(OLD_MIN_DISPLAY_10S)) {
        content = content.split(OLD_MIN_DISPLAY_10S).join(NEW_MIN_DISPLAY_500);
        changed = true;
    }
    if (content.includes(OLD_MIN_DISPLAY_1200)) {
        content = content.split(OLD_MIN_DISPLAY_1200).join(NEW_MIN_DISPLAY_500);
        changed = true;
    }

    if (changed) {
        writeIfChanged(file, content, `${rel} (MIN_DISPLAY -> 500ms)`);
    } else {
        log(false, `${rel}: MIN_DISPLAY ديجا صحيح أو ماتلقاش (تخطيت)`);
    }
}

fixMinDisplay('assets/js/script.js');
fixMinDisplay('utils/fix-xpert-loader.js');
fixMinDisplay('utils/add-xpert-loader.js');

// ============================================================
// 2) style.css: bottom:0 -> height:calc(100svh - navbar-height)
// ============================================================
const OLD_CSS_POSITION = `#xpertLoader{
    position:fixed; top:var(--navbar-height); left:0; right:0; bottom:0; z-index:900;
    background:var(--bg-primary);`;

const NEW_CSS_POSITION = `#xpertLoader{
    position:fixed; top:var(--navbar-height); left:0; right:0; z-index:900;
    height:calc(100vh - var(--navbar-height));
    height:calc(100svh - var(--navbar-height));
    background:var(--bg-primary);`;

(function fixStyleCss() {
    const file = readFile('assets/css/style.css');
    if (!file) return;

    if (file.content.includes(OLD_CSS_POSITION)) {
        const content = file.content.split(OLD_CSS_POSITION).join(NEW_CSS_POSITION);
        writeIfChanged(file, content, 'assets/css/style.css (منع قفزة الـ viewport فالموبايل)');
    } else if (file.content.includes('height:calc(100svh - var(--navbar-height))')) {
        log(false, 'assets/css/style.css: التعديل ديجا مطبق (تخطيت)');
    } else {
        log(false, 'assets/css/style.css: ماقدرتش نلقى الجزء المتوقع (تحقق يدويا)');
    }
})();

// ============================================================
// 3) utils/fix-xpert-loader.js: حدث القالب NEW_POSITION ديالو
//    باش أي تشغيل جديد ليه فالمستقبل يعطي نفس التصميم المصلح
// ============================================================
const OLD_NEW_POSITION_TEMPLATE = `const NEW_POSITION = \`#xpertLoader{
    position:fixed; top:var(--navbar-height); left:0; right:0; bottom:0; z-index:900;
    background:var(--bg-primary);\`;`;

const NEW_NEW_POSITION_TEMPLATE = `const NEW_POSITION = \`#xpertLoader{
    position:fixed; top:var(--navbar-height); left:0; right:0; z-index:900;
    height:calc(100vh - var(--navbar-height));
    height:calc(100svh - var(--navbar-height));
    background:var(--bg-primary);\`;`;

(function fixFixScriptTemplate() {
    const file = readFile('utils/fix-xpert-loader.js');
    if (!file) return;

    if (file.content.includes(OLD_NEW_POSITION_TEMPLATE)) {
        const content = file.content.split(OLD_NEW_POSITION_TEMPLATE).join(NEW_NEW_POSITION_TEMPLATE);
        writeIfChanged(file, content, 'utils/fix-xpert-loader.js (قالب NEW_POSITION محدث)');
    } else if (file.content.includes('height:calc(100svh - var(--navbar-height))')) {
        log(false, 'utils/fix-xpert-loader.js: القالب ديجا محدث (تخطيت)');
    } else {
        log(false, 'utils/fix-xpert-loader.js: ماقدرتش نلقى القالب المتوقع (تحقق يدويا)');
    }
})();

console.log('');
console.log(APPLY ? '✅ تطبق كلشي.' : 'ℹ️ dry-run غير. شغل بـ --apply باش يتطبق فعليا.');
