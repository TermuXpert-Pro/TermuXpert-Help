#!/usr/bin/env node
/**
 * add-xpert-loader.js
 * ============================================================
 * كيزيد "لودر" موحّد (هوية بصرية: مثلث ← مربع ← دائرة، بدورة
 * مستمرة بلا قفزة) فـ 3 أماكن:
 *
 *   1) assets/css/style.css   → تصميم اللودر (CSS)
 *   2) assets/js/script.js    → منطق الإخفاء التلقائي (JS)
 *   3) كل صفحات .html          → عنصر اللودر HTML، مباشرة بعد <body>
 *
 * الاستخدام (بحال باقي utils/*.js ديال المشروع):
 *   node utils/add-xpert-loader.js          → dry-run (كيوري غير
 *                                              شنو غادي يتبدل، بلا
 *                                              ما يمس أي ملف)
 *   node utils/add-xpert-loader.js --apply  → يطبق فعليا
 *
 * السكريبت safe للتشغيل عدة مرات (idempotent): إيلا اللودر ديجا
 * مزيد فملف معين، كيتخطاه بلا ما يكرر الإضافة.
 * ============================================================
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const APPLY = process.argv.includes('--apply');

// نفس منطق الاستثناء ديال build.js (بلا 'templates' حيت بغينا
// اللودر يتزاد حتى للـ templates باش الصفحات الجدودة تولد فيه اللودر
// من البداية)
const SKIP_DIRS = ['node_modules', '.git', 'partials'];

function log(ok, msg) {
    console.log((ok ? '✅ ' : '⏭️ ') + msg);
}

// ============================================================
// 1) الكتلة اللي غادي تتزاد فـ assets/css/style.css
// ============================================================
const CSS_MARKER_START = '/* ====== XPERT LOADER START (add-xpert-loader.js) ====== */';
const CSS_MARKER_END = '/* ====== XPERT LOADER END ====== */';

const CSS_BLOCK = `
${CSS_MARKER_START}
#xpertLoader{
    position:fixed; inset:0; z-index:100000;
    background:var(--bg-primary);
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    gap:clamp(12px, 2.5vw, 18px);
    transition:opacity .55s ease, visibility .55s ease;
}
#xpertLoader.xpert-loader-hide{
    opacity:0; visibility:hidden; pointer-events:none;
}
body.xpert-loaded #siteMainWrap,
body.xpert-loaded{
    /* لا حاجة لأي كلاس زائد على المحتوى: اللودر فوق كلشي (z-index)
       وكيختفي بـ opacity/visibility، والمحتوى تحته كيبقى عادي. */
}

.xpert-shape-wrap{
    position:relative;
    width:clamp(52px, 9vw, 78px);
    height:clamp(52px, 9vw, 78px);
}
.xpert-ring{
    position:absolute; inset:0;
    border:1.5px dashed rgba(197,198,199,0.18);
    border-radius:50%;
    animation:xpertRingSpin 14s linear infinite reverse;
}
.xpert-ring::before{
    content:'';
    position:absolute; inset:8%;
    border:1px solid rgba(197,198,199,0.08);
    border-radius:50%;
}
.xpert-orbit{
    position:absolute; inset:0;
    animation:xpertRingSpin 3.2s linear infinite;
}
.xpert-orbit-dot{
    position:absolute; top:-2px; left:50%;
    width:5px; height:5px; border-radius:50%;
    transform:translateX(-50%);
    animation:xpertDotColor 2.4s cubic-bezier(.65,0,.35,1) infinite;
    filter:blur(.2px);
}
.xpert-shape-glow{
    position:absolute; inset:14%;
    filter:blur(7px);
    animation:xpertGlowPulse 2.4s cubic-bezier(.65,0,.35,1) infinite,
              xpertGlowColor 2.4s cubic-bezier(.65,0,.35,1) infinite;
}
.xpert-shape{
    position:absolute; inset:19%;
    animation:xpertMorph 2.4s cubic-bezier(.65,0,.35,1) infinite,
              xpertSpin 9.6s linear infinite,
              xpertColor 2.4s cubic-bezier(.65,0,.35,1) infinite,
              xpertBreathe 2.4s cubic-bezier(.65,0,.35,1) infinite;
}
.xpert-shape::after{
    content:'';
    position:absolute; inset:0;
    background:linear-gradient(135deg, rgba(255,255,255,0.3), transparent 55%);
    clip-path:inherit;
}
@keyframes xpertMorph{
    0%, 100%{
        clip-path:polygon(74.25% 50%,75.82% 52.71%,77.64% 55.88%,79.85% 59.7%,82.64% 64.53%,86.37% 71%,78.9% 71%,73.32% 71%,68.91% 71%,65.26% 71%,62.12% 71%,59.35% 71%,56.82% 71%,54.46% 71%,52.21% 71%,50% 71%,47.79% 71%,45.54% 71%,43.18% 71%,40.65% 71%,37.88% 71%,34.74% 71%,31.09% 71%,26.68% 71%,21.1% 71%,13.63% 71%,17.36% 64.53%,20.15% 59.7%,22.36% 55.88%,24.18% 52.71%,25.75% 50%,27.14% 47.6%,28.4% 45.41%,29.58% 43.37%,30.71% 41.41%,31.81% 39.5%,32.92% 37.59%,34.05% 35.63%,35.23% 33.59%,36.49% 31.4%,37.88% 29%,39.44% 26.29%,41.27% 23.12%,43.47% 19.3%,46.27% 14.47%,50% 8%,53.73% 14.47%,56.53% 19.3%,58.73% 23.12%,60.56% 26.29%,62.12% 29%,63.51% 31.4%,64.77% 33.59%,65.95% 35.63%,67.08% 37.59%,68.19% 39.5%,69.29% 41.41%,70.42% 43.37%,71.6% 45.41%,72.86% 47.6%);
    }
    33%{
        clip-path:polygon(79.7% 50%,79.7% 53.12%,79.7% 56.31%,79.7% 59.65%,79.7% 63.22%,79.7% 67.15%,79.7% 71.58%,79.7% 76.74%,76.74% 79.7%,71.58% 79.7%,67.15% 79.7%,63.22% 79.7%,59.65% 79.7%,56.31% 79.7%,53.12% 79.7%,50% 79.7%,46.88% 79.7%,43.69% 79.7%,40.35% 79.7%,36.78% 79.7%,32.85% 79.7%,28.42% 79.7%,23.26% 79.7%,20.3% 76.74%,20.3% 71.58%,20.3% 67.15%,20.3% 63.22%,20.3% 59.65%,20.3% 56.31%,20.3% 53.12%,20.3% 50%,20.3% 46.88%,20.3% 43.69%,20.3% 40.35%,20.3% 36.78%,20.3% 32.85%,20.3% 28.42%,20.3% 23.26%,23.26% 20.3%,28.42% 20.3%,32.85% 20.3%,36.78% 20.3%,40.35% 20.3%,43.69% 20.3%,46.88% 20.3%,50% 20.3%,53.12% 20.3%,56.31% 20.3%,59.65% 20.3%,63.22% 20.3%,67.15% 20.3%,71.58% 20.3%,76.74% 20.3%,79.7% 23.26%,79.7% 28.42%,79.7% 32.85%,79.7% 36.78%,79.7% 40.35%,79.7% 43.69%,79.7% 46.88%);
    }
    66%{
        clip-path:polygon(92% 50%,91.77% 54.39%,91.08% 58.73%,89.94% 62.98%,88.37% 67.08%,86.37% 71%,83.98% 74.69%,81.21% 78.1%,78.1% 81.21%,74.69% 83.98%,71% 86.37%,67.08% 88.37%,62.98% 89.94%,58.73% 91.08%,54.39% 91.77%,50% 92%,45.61% 91.77%,41.27% 91.08%,37.02% 89.94%,32.92% 88.37%,29% 86.37%,25.31% 83.98%,21.9% 81.21%,18.79% 78.1%,16.02% 74.69%,13.63% 71%,11.63% 67.08%,10.06% 62.98%,8.92% 58.73%,8.23% 54.39%,8% 50%,8.23% 45.61%,8.92% 41.27%,10.06% 37.02%,11.63% 32.92%,13.63% 29%,16.02% 25.31%,18.79% 21.9%,21.9% 18.79%,25.31% 16.02%,29% 13.63%,32.92% 11.63%,37.02% 10.06%,41.27% 8.92%,45.61% 8.23%,50% 8%,54.39% 8.23%,58.73% 8.92%,62.98% 10.06%,67.08% 11.63%,71% 13.63%,74.69% 16.02%,78.1% 18.79%,81.21% 21.9%,83.98% 25.31%,86.37% 29%,88.37% 32.92%,89.94% 37.02%,91.08% 41.27%,91.77% 45.61%);
    }
}
@keyframes xpertSpin{ 0%{transform:rotate(0deg);} 100%{transform:rotate(360deg);} }
@keyframes xpertRingSpin{ 0%{transform:rotate(0deg);} 100%{transform:rotate(360deg);} }
@keyframes xpertGlowPulse{
    0%,100%{opacity:.5; transform:scale(1);}
    50%{opacity:.95; transform:scale(1.15);}
}
@keyframes xpertBreathe{
    0%,100%{transform:scale(1);}
    33%{transform:scale(0.94);}
    66%{transform:scale(1.06);}
}
@keyframes xpertColor{
    0%,100%{ background:linear-gradient(135deg,#66FCF1,#45A29E); filter:drop-shadow(0 0 16px rgba(102,252,241,.55)); }
    33%{     background:linear-gradient(135deg,#F4D03F,#E8B923); filter:drop-shadow(0 0 16px rgba(244,208,63,.55)); }
    66%{     background:linear-gradient(135deg,#FF9A5A,#E8873A); filter:drop-shadow(0 0 16px rgba(232,135,58,.55)); }
}
@keyframes xpertGlowColor{
    0%,100%{ background:radial-gradient(circle, rgba(102,252,241,.28) 0%, transparent 72%); }
    33%{     background:radial-gradient(circle, rgba(244,208,63,.28) 0%, transparent 72%); }
    66%{     background:radial-gradient(circle, rgba(232,135,58,.28) 0%, transparent 72%); }
}
@keyframes xpertDotColor{
    0%,100%{ background:#66FCF1; box-shadow:0 0 8px 2px rgba(102,252,241,.7); }
    33%{     background:#F4D03F; box-shadow:0 0 8px 2px rgba(244,208,63,.7); }
    66%{     background:#FF9A5A; box-shadow:0 0 8px 2px rgba(232,135,58,.7); }
}
.xpert-loader-brand{
    font-family:'Cairo','Tajawal',sans-serif;
    font-weight:900; font-size:clamp(10px, 1.6vw, 12px); letter-spacing:2.5px;
    text-transform:uppercase;
    color:var(--text-secondary);
    display:flex; align-items:center; gap:1px;
    opacity:.65;
}
.xpert-loader-brand span{color:var(--accent-light);}
@media (prefers-reduced-motion: reduce){
    .xpert-shape, .xpert-shape-glow, .xpert-ring, .xpert-orbit, .xpert-orbit-dot{
        animation-duration:.001ms !important; animation-iteration-count:1 !important;
    }
}
${CSS_MARKER_END}
`;

// ============================================================
// 2) الكتلة اللي غادي تتزاد فـ assets/js/script.js
// ============================================================
const JS_MARKER_START = '// ====== XPERT LOADER START (add-xpert-loader.js) ======';
const JS_MARKER_END = '// ====== XPERT LOADER END ======';

const JS_BLOCK = `
${JS_MARKER_START}
(function () {
    'use strict';

    var loader = document.getElementById('xpertLoader');
    if (!loader) return; // الصفحة ماعندهاش لودر (كيفرض ماوقعش)

    // مدة دنيا (ميلي ثانية): اللودر خاصو يبان دائماً بيها حتى لو
    // الصفحة تحملت بزربة - هوية بصرية ثابتة. مقترحة كافية باش
    // تغطي أنيميشن الدخول (GSAP) ديال أغلب الصفحات.
    var MIN_DISPLAY = 200;

    // حماية: إيلا لسبب ما (شبكة بطيئة بزاف...) حدث 'load' ماجاش،
    // نخبيو اللودر بالقوة من بعد 6 ثواني باش الصفحة ماتبقاش مقفولة.
    var HARD_TIMEOUT = 1500;

    var start = performance.now();
    var hidden = false;

    function hideLoader() {
        if (hidden) return;
        hidden = true;
        var elapsed = performance.now() - start;
        var wait = Math.max(0, MIN_DISPLAY - elapsed);
        setTimeout(function () {
            loader.classList.add('xpert-loader-hide');
            document.body.classList.add('xpert-loaded');
        }, wait);
    }

    if (document.readyState === 'complete') {
        hideLoader();
    } else {
        window.addEventListener('load', hideLoader);
    }
    setTimeout(hideLoader, HARD_TIMEOUT);
})();
${JS_MARKER_END}
`;

// ============================================================
// 3) عنصر HTML اللودر (كيتزاد مباشرة بعد <body>)
// ============================================================
const LOADER_MARKER = 'id="xpertLoader"';

const LOADER_HTML = `<div id="xpertLoader" role="status" aria-label="جاري التحميل">
        <div class="xpert-shape-wrap">
            <div class="xpert-ring"></div>
            <div class="xpert-orbit"><span class="xpert-orbit-dot"></span></div>
            <div class="xpert-shape-glow"></div>
            <div class="xpert-shape"></div>
        </div>
        <div class="xpert-loader-brand"><span>X</span>pert</div>
    </div>
`;

// ============================================================
// أدوات مساعدة
// ============================================================
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

function injectIntoStyleCss() {
    const p = path.join(ROOT, 'assets', 'css', 'style.css');
    if (!fs.existsSync(p)) { log(false, 'ماقدرتش نلقى assets/css/style.css'); return; }
    let content = fs.readFileSync(p, 'utf-8');
    if (content.includes(CSS_MARKER_START)) {
        log(false, 'style.css: اللودر ديجا مزيد (تخطيت)');
        return;
    }
    if (APPLY) {
        fs.writeFileSync(p, content.trimEnd() + '\n' + CSS_BLOCK);
        log(true, 'style.css: تزاد تصميم اللودر');
    } else {
        log(true, '[dry-run] style.css: غادي يتزاد تصميم اللودر');
    }
}

function injectIntoScriptJs() {
    const p = path.join(ROOT, 'assets', 'js', 'script.js');
    if (!fs.existsSync(p)) { log(false, 'ماقدرتش نلقى assets/js/script.js'); return; }
    let content = fs.readFileSync(p, 'utf-8');
    if (content.includes(JS_MARKER_START)) {
        log(false, 'script.js: منطق اللودر ديجا مزيد (تخطيت)');
        return;
    }
    if (APPLY) {
        fs.writeFileSync(p, content.trimEnd() + '\n' + JS_BLOCK);
        log(true, 'script.js: تزاد منطق إخفاء اللودر');
    } else {
        log(true, '[dry-run] script.js: غادي يتزاد منطق إخفاء اللودر');
    }
}

function injectIntoHtmlFiles() {
    const files = walkHtml(ROOT);
    let updated = 0, skipped = 0;
    const BODY_RE = /<body([^>]*)>/i;

    for (const file of files) {
        let content = fs.readFileSync(file, 'utf-8');
        const rel = path.relative(ROOT, file);

        if (content.includes(LOADER_MARKER)) {
            skipped++;
            continue;
        }
        if (!BODY_RE.test(content)) {
            log(false, `${rel}: ماكاينش <body> - تخطيت`);
            skipped++;
            continue;
        }

        content = content.replace(BODY_RE, (m, attrs) => `<body${attrs}>\n    ${LOADER_HTML}`);

        if (APPLY) {
            fs.writeFileSync(file, content);
        }
        updated++;
        console.log(`   ${APPLY ? '✅' : '📝'} ${rel}`);
    }

    console.log(`\n📄 صفحات HTML: ${updated} ${APPLY ? 'تزاد فيها اللودر' : 'غادي يتزاد فيها اللودر'}, ${skipped} تخطيت (ديجا فيها اللودر أو بلا body).`);
}

// ============================================================
// تشغيل
// ============================================================
console.log(APPLY ? '🚀 تطبيق اللودر على المشروع كامل...\n' : '🔎 Dry-run (بلا تعديل فعلي) - زيد --apply باش يتطبق فعليا...\n');

injectIntoStyleCss();
injectIntoScriptJs();
console.log('');
injectIntoHtmlFiles();

console.log('\n✅ انتهى.');
if (!APPLY) {
    console.log('💡 هاد كان dry-run غير. باش يتطبق فعليا:');
    console.log('   node utils/add-xpert-loader.js --apply');
}

