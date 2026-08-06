#!/usr/bin/env node
/**
 * apply-direct-sections.js
 * ============================================================
 * الهدف: نزيل صفحة "الأقسام" الوسيطة (model/index.html) وصفحة
 * اختيار "النموذج" (topic/index.html) لي فيها ex-link واحد فقط،
 * ونخلي الضغط على بطاقة تمرين/درس/سلسلة يودي مباشرة للقسم الأول
 * (exerciceN.html / serieN.html / partN.html) مفتوح.
 *
 * فبدلها، كنزيدو زر FAB عائم فكل صفحة محتوى كيفتح لائحة الأقسام
 * (اللي كانت قبل فصفحة index.html وحدها) بلا ما نخرجو من الصفحة.
 *
 * الصفحات القديمة (model/index.html و topic/index.html) ما
 * كنمسحوهاش، غير كنحولوهم لصفحات "تحويل تلقائي" (redirect) نحو
 * القسم الأول -- هادشي كيحافظ على أي رابط قديم محفوظ فالمتصفح
 * أو Google بلا ما يولي 404.
 *
 * الاستعمال (من جذر المشروع فـ Termux):
 *   node apply-direct-sections.js            -> يطبق التغييرات
 *   node apply-direct-sections.js --dry-run  -> كيوري غير شنو غادي يبدل بلا ما يمس الملفات
 *
 * بعد ما تخدم الاسكريبت:
 *   node utils/build.js && node utils/validate.js
 * ============================================================
 */

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const DRY_RUN = process.argv.includes('--dry-run');
const CONTENT_TYPES = ['lessons', 'exercises', 'series']; // ماشي devoirs
const NUM_FILE_RE = /^(exercice|serie|part)(\d+)\.html$/;
const REDIRECT_MARKER = '<!-- XPERT-DIRECT-REDIRECT -->';
const FAB_MARKER = '<!-- XPERT-SECTIONS-FAB -->';

let stats = { redirectsTopic: 0, redirectsModel: 0, fabInjected: 0, dataUpdated: 0, skipped: 0 };

// ------------------------------------------------------------
// أدوات مساعدة
// ------------------------------------------------------------
function walk(dir, out = []) {
    let entries;
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); }
    catch (e) { return out; }
    for (const e of entries) {
        const full = path.join(dir, e.name);
        if (e.isDirectory()) walk(full, out);
        else out.push(full);
    }
    return out;
}

function readFile(p) { return fs.readFileSync(p, 'utf8'); }
function writeFile(p, content) {
    if (DRY_RUN) return;
    fs.writeFileSync(p, content, 'utf8');
}

// كنجيبو اللون الأساسي ديال الصفحة من قاعدة الـ hover (ex-link:hover أو part-link:hover)
function extractAccent(html) {
    const m = html.match(/(?:ex|part)-link:hover\s*\{[^}]*border-color:\s*(#[0-9A-Fa-f]{3,6})/);
    return m ? m[1] : '#4ECDC4';
}

// كنستخرجو لائحة الأقسام (exerciceN/serieN/partN) من صفحة index.html
function extractSections(html) {
    const sections = [];
    const linkRe = /<a\s+href="((?:exercice|serie|part)\d+\.html)"\s+class="(ex-link|part-link)"[^>]*>([\s\S]*?)<\/a>/g;
    let m;
    while ((m = linkRe.exec(html)) !== null) {
        const href = m[1];
        const inner = m[3];
        let label = '', desc = '';
        const flexBlock = inner.match(/<div style="flex:1;">\s*<div[^>]*>([\s\S]*?)<\/div>\s*<div[^>]*>([\s\S]*?)<\/div>/);
        if (flexBlock) {
            label = flexBlock[1].replace(/<[^>]+>/g, '').trim();
            desc = flexBlock[2].replace(/<[^>]+>/g, '').trim();
        }
        sections.push({ href, label, desc });
    }
    return sections;
}

// ------------------------------------------------------------
// 1) تحويل صفحة قديمة (index.html) لصفحة تحويل تلقائي نحو القسم الأول
// ------------------------------------------------------------
function makeRedirectStub(html, targetHref) {
    if (html.includes(REDIRECT_MARKER)) return html; // idempotent
    const redirectBlock =
`${REDIRECT_MARKER}
<meta http-equiv="refresh" content="0; url=${targetHref}">
<script>location.replace(${JSON.stringify(targetHref)});</script>
`;
    // نحطوها فبداية <head> بحال يتنفذ بكري ما يمكن
    return html.replace(/<head>/, `<head>\n${redirectBlock}`);
}

// ------------------------------------------------------------
// 2) بناء الـ FAB (زر عائم + لائحة الأقسام) باش نزيدوه فكل صفحة محتوى
// ------------------------------------------------------------
function buildFabBlock(sections, currentHref, accent) {
    const dataJson = JSON.stringify(sections).replace(/</g, '\\u003c');
    return `
${FAB_MARKER}
<style>
.xpert-sec-fab-btn{position:fixed;left:16px;bottom:16px;z-index:9999;width:52px;height:52px;border-radius:50%;
  background:${accent};color:#0b0f0e;border:none;box-shadow:0 6px 18px rgba(0,0,0,0.35);
  display:flex;align-items:center;justify-content:center;font-size:20px;cursor:pointer;
  opacity:0;transform:scale(0.5) translateY(10px);pointer-events:none;
  transition:opacity .45s ease, transform .45s cubic-bezier(.34,1.56,.64,1), box-shadow .25s ease;}
.xpert-sec-fab-btn.xpert-fab-show{opacity:1;transform:scale(1) translateY(0);pointer-events:auto;}
.xpert-sec-fab-btn.xpert-fab-show::after{content:'';position:absolute;inset:-6px;border-radius:50%;
  border:2px solid ${accent};opacity:0;animation:xpertFabPulse 2.8s ease-out .6s infinite;}
.xpert-sec-fab-btn.xpert-fab-open::after{animation-play-state:paused;opacity:0;}
.xpert-sec-fab-btn:active{transform:scale(0.9);}
.xpert-sec-fab-btn i{transition:transform .3s ease;}
.xpert-sec-fab-btn.xpert-fab-open i{transform:rotate(135deg);}
@keyframes xpertFabPulse{
  0%{transform:scale(0.85);opacity:.5;}
  70%{transform:scale(1.4);opacity:0;}
  100%{transform:scale(1.4);opacity:0;}
}
@media (prefers-reduced-motion: reduce){
  .xpert-sec-fab-btn.xpert-fab-show::after{animation:none;display:none;}
  .xpert-sec-fab-btn i{transition:none;}
}
.xpert-sec-panel-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:9998;display:none;}
.xpert-sec-panel-overlay.open{display:block;}
.xpert-sec-panel{position:fixed;left:0;right:0;bottom:0;max-height:75vh;overflow-y:auto;
  background:var(--bg-card,#1b1f1e);border-top:1px solid var(--border,#333);border-radius:16px 16px 0 0;
  z-index:9999;padding:14px 12px 22px;transform:translateY(100%);transition:transform .28s ease;}
.xpert-sec-panel.open{transform:translateY(0);}
.xpert-sec-panel h4{margin:0 0 10px;padding:0 4px;color:${accent};font-size:15px;}
.xpert-sec-item{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:8px;margin-bottom:6px;
  text-decoration:none;color:var(--text-primary,#eee);background:transparent;}
.xpert-sec-item.active{background:${accent}22;border:1px solid ${accent}55;}
.xpert-sec-item .xn{font-weight:700;color:${accent};font-size:13px;min-width:26px;}
.xpert-sec-item .xd{font-size:12px;color:var(--text-secondary,#aaa);}
</style>
<button class="xpert-sec-fab-btn" id="xpertSecFabBtn" aria-label="أقسام"><i class="fas fa-layer-group"></i></button>
<div class="xpert-sec-panel-overlay" id="xpertSecOverlay"></div>
<div class="xpert-sec-panel" id="xpertSecPanel">
  <h4><i class="fas fa-list"></i> الأقسام</h4>
  <div id="xpertSecList"></div>
</div>
<script>
(function(){
  var sections = ${dataJson};
  var current = ${JSON.stringify(currentHref)};
  var btn = document.getElementById('xpertSecFabBtn');
  var overlay = document.getElementById('xpertSecOverlay');
  var panel = document.getElementById('xpertSecPanel');
  var list = document.getElementById('xpertSecList');
  sections.forEach(function(s, i){
    var a = document.createElement('a');
    a.href = s.href;
    a.className = 'xpert-sec-item' + (s.href === current ? ' active' : '');
    a.innerHTML = '<span class="xn">' + (i+1) + '</span><span class="xd"><b>' + (s.label||('#'+(i+1))) + '</b><br>' + (s.desc||'') + '</span>';
    list.appendChild(a);
  });
  function open(){ overlay.classList.add('open'); panel.classList.add('open'); btn.classList.add('xpert-fab-open'); }
  function close(){ overlay.classList.remove('open'); panel.classList.remove('open'); btn.classList.remove('xpert-fab-open'); }
  btn.addEventListener('click', open);
  overlay.addEventListener('click', close);
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape') close(); });

  // ====== ما نبانش حتى يختفي xpertLoader (الدائرة اللي كتدور) ======
  // اللودر كيزيد class="xpert-loaded" على body ملي يختفي (شوف
  // add-xpert-loader.js). كنتسناو هاد اللحظة، أو كنبانو دغيا إيلا
  // الصفحة ماعندهاش لودر أصلا.
  function revealFab(){ requestAnimationFrame(function(){ btn.classList.add('xpert-fab-show'); }); }
  if (!document.getElementById('xpertLoader') || document.body.classList.contains('xpert-loaded')) {
    revealFab();
  } else {
    var mo = new MutationObserver(function(){
      if (document.body.classList.contains('xpert-loaded')) { revealFab(); mo.disconnect(); }
    });
    mo.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    setTimeout(revealFab, 3500); // حماية إيلا اللودر ما زادش الكلاس لسبب ما
  }
})();
</script>
`;
}

function stripOldFab(html) {
    // كنمسحو أي نسخة قديمة ديال الـ FAB (بأي marker) باش نبدلوها
    // بالجديدة - هادشي كيصلح الصفحات اللي فيهم نسخة قديمة/معطوبة
    // بلا ما يحتاج المستخدم يمسح شي حاجة يدويا.
    return html.replace(/\n?<!-- XPERT-SECTIONS-FAB[\s\S]*?<\/script>\s*(?=\n?<\/body>)/, '');
}

function injectFab(html, sections, currentHref, accent) {
    const cleaned = stripOldFab(html);
    const block = buildFabBlock(sections, currentHref, accent);
    return cleaned.replace(/<\/body>/, `${block}\n</body>`);
}

// ------------------------------------------------------------
// 3) المرور على المجلدات باش نلقاو "مجلدات الأقسام" (model1, model2...)
// ------------------------------------------------------------
function findLeafSectionFolders() {
    const contentRoot = path.join(ROOT, 'content');
    const allFiles = walk(contentRoot);
    const dirs = new Set();
    for (const f of allFiles) {
        const base = path.basename(f);
        if (NUM_FILE_RE.test(base)) {
            const dir = path.dirname(f);
            // نستثنيو devoirs
            if (/[\\/]devoirs[\\/]/.test(dir)) continue;
            const hasAllowedType = CONTENT_TYPES.some(t => dir.split(path.sep).includes(t));
            if (hasAllowedType) dirs.add(dir);
        }
    }
    return [...dirs];
}

// ------------------------------------------------------------
// 4) تحديث ملفات data/*.js باش يشيرو مباشرة للقسم الأول
// ------------------------------------------------------------
function updateDataFiles(oldRelPath, newRelPath) {
    const dataDir = path.join(ROOT, 'data');
    if (!fs.existsSync(dataDir)) return;
    for (const f of fs.readdirSync(dataDir)) {
        if (!f.endsWith('.js')) continue;
        const full = path.join(dataDir, f);
        let content = readFile(full);
        const oldStr = `file: "${oldRelPath}"`;
        const newStr = `file: "${newRelPath}"`;
        if (content.includes(oldStr)) {
            content = content.split(oldStr).join(newStr);
            writeFile(full, content);
            stats.dataUpdated++;
            console.log(`  📝 data/${f}: ${oldRelPath} → ${newRelPath}`);
        }
    }
}

function toPosix(p) { return p.split(path.sep).join('/'); }

// ------------------------------------------------------------
// التشغيل الرئيسي
// ------------------------------------------------------------
function run() {
    console.log(DRY_RUN ? '🔍 DRY-RUN (ما غادي نبدل حتى ملف)...\n' : '🚀 كنطبق التغييرات...\n');

    const leafDirs = findLeafSectionFolders();
    console.log(`📁 لقيت ${leafDirs.length} مجلد "أقسام" (model...)\n`);

    for (const leafDir of leafDirs) {
        const leafIndexPath = path.join(leafDir, 'index.html');
        if (!fs.existsSync(leafIndexPath)) { stats.skipped++; continue; }

        const leafHtml = readFile(leafIndexPath);
        const sections = extractSections(leafHtml);
        if (sections.length === 0) { stats.skipped++; continue; }

        const accent = extractAccent(leafHtml);
        const firstHref = sections[0].href;

        // -------- الأب: هل كاين "topic/index.html" كيختار النموذج (model1)؟ --------
        const parentDir = path.dirname(leafDir);
        const parentIndexPath = path.join(parentDir, 'index.html');
        const leafFolderName = path.basename(leafDir); // model1
        let hasParentChooser = false;
        if (fs.existsSync(parentIndexPath)) {
            const parentHtml = readFile(parentIndexPath);
            const re = new RegExp(`href="${leafFolderName}/index\\.html"\\s+class="ex-link"`);
            if (re.test(parentHtml)) hasParentChooser = true;
        }

        const relLeafDir = toPosix(path.relative(ROOT, leafDir));
        const relParentDir = toPosix(path.relative(ROOT, parentDir));
        console.log(`▶ ${relLeafDir}  (${sections.length} أقسام, accent ${accent})`);

        // 1) نحولو model/index.html لصفحة تحويل تلقائي
        const newLeafHtml = makeRedirectStub(leafHtml, firstHref);
        if (newLeafHtml !== leafHtml) {
            writeFile(leafIndexPath, newLeafHtml);
            stats.redirectsModel++;
        }

        // 2) إلا كاين صفحة اختيار نموذج (topic/index.html)، نحولوها هي زادة
        let dataOldPath = `${relLeafDir}/index.html`;
        let dataNewPath = `${relLeafDir}/${firstHref}`;
        if (hasParentChooser) {
            const parentHtml = readFile(parentIndexPath);
            const targetFromParent = `${leafFolderName}/${firstHref}`;
            const newParentHtml = makeRedirectStub(parentHtml, targetFromParent);
            if (newParentHtml !== parentHtml) {
                writeFile(parentIndexPath, newParentHtml);
                stats.redirectsTopic++;
            }
            dataOldPath = `${relParentDir}/index.html`;
            dataNewPath = `${relLeafDir}/${firstHref}`;
        }

        // 3) نبدلو المسار فملفات data/*.js
        updateDataFiles(dataOldPath, dataNewPath);

        // 4) نزيدو الـ FAB فكل صفحات المحتوى (exerciceN/serieN/partN)
        for (const s of sections) {
            const contentPath = path.join(leafDir, s.href);
            if (!fs.existsSync(contentPath)) continue;
            const html = readFile(contentPath);
            const newHtml = injectFab(html, sections, s.href, accent);
            if (newHtml !== html) {
                writeFile(contentPath, newHtml);
                stats.fabInjected++;
            }
        }
    }

    console.log('\n============================================================');
    console.log('📊 ملخص:');
    console.log(`   صفحات "أقسام" (model) تحولت لـ redirect : ${stats.redirectsModel}`);
    console.log(`   صفحات "نموذج" (topic) تحولت لـ redirect  : ${stats.redirectsTopic}`);
    console.log(`   صفحات محتوى تزاد فيهم FAB                : ${stats.fabInjected}`);
    console.log(`   أسطر تبدلات فـ data/*.js                  : ${stats.dataUpdated}`);
    console.log(`   مجلدات تجاوزنا (بلا index/sections)       : ${stats.skipped}`);
    console.log('============================================================');
    if (DRY_RUN) console.log('\n👉 هادي كانت غير تجربة (dry-run). شغل بلا --dry-run باش يتطبق فعلا.');
    else console.log('\n✅ خلص! دابا خدم: node utils/build.js && node utils/validate.js');
}

run();
