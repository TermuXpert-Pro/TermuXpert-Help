#!/usr/bin/env node
/* ============================================================
   utils/upgrade-sections-fab.js   (v4)
   -----------------------------------------------------------
   الهدف:
   تبديل زر "XPERT-SECTIONS-FAB" (الدائري + اللوحة السفلية) الموجود
   حالياً فـ صفحات الدروس/التمارين/السلاسل، بزر ونمط جديد كيقلد بالضبط
   تصميم الـFAB ديال الفروض (assets/css/devoir.css):
     - زر بيضاوي (pill) زجاجي (glass) بأيقونة + label، بدل الدائرة الصلبة
     - عند الضغط: قائمة أزرار عائمة (pills) كتطلع فوق الزر بأنيميشن
       fade + slide متدرّج (staggered)، بدل اللوحة السفلية (bottom-sheet)
       المعتمة اللي كانت كتغطي الشاشة
     - العنصر "Suivant" فـ الترتيب (الجزء الموالي / السلسلة الموالية /
       التمرين الموالي) كيبان عليه نبض (pulse) بنفس منطق نبض العداد
       فـ صفحة الفرض ملي كيقرب الوقت، باش يجذب الانتباه للمرحلة الجاية
     - عنصر "ملخص الدرس" (Résumé du cours) كيبان بستايل خاص: أزرق + زجاجي

   v2: كلمة "التالي" ولات "Suivant" + أنيميشن ظهور أهدى (بلا bounce)
   v3: رجّعنا الروابط المباشرة (exerciceN/serieN/partN)، قصّرنا fallback
       ديال الظهور لـ 1500ms

   v4 (تصحيح مهم -- تزامن حقيقي مع اختفاء اللودر):
   #xpertLoader عندو transition ديالو الخاص `opacity .55s` (تقريباً
   500ms) ملي كيتزاد class="xpert-loader-hide". المشكل كان: زر الـFAB
   كان كيبدا فـ الظهور (fade-in) **فنفس اللحظة** اللي كيتزاد فيها
   class="xpert-loaded"، يعني وهو اللودر (z-index: 100000) مازال فوقو
   كيتلاشى بـ 550ms -- فالزر كيبقى مخبي/مغطى طول هاد المدة، ثم "كيطيح"
   يبان دفعة وحدة ملي اللودر يختفي كاملاً. هادشي هو اللي كان كيبان
   "متأخر ثم مفاجئ".
   الحل: كنستناو 500ms (نفس مدة اختفاء اللودر) من بعد ما كنكتشفو
   class="xpert-loaded"، قبل ما نبداو أنيميشن ظهور الزر -- هكذا الزر
   كيبدا يبان بالضبط ملي اللودر يكون خلص التلاشي ديالو بالكامل، بلا ما
   يتخبأ تحتو ولا يبان "مفاجئ".

   الاستعمال:
     node utils/upgrade-sections-fab.js            -> Dry-run (ما كيبدلش شي حاجة، غير كيعرض ملخص)
     node utils/upgrade-sections-fab.js --apply     -> كيطبق التعديلات فعلياً على الملفات
     node utils/upgrade-sections-fab.js --apply --verbose  -> كيبان أسماء الملفات وحداً وحداً

   ملاحظة: السكريبت كيبحث تلقائياً على جميع ملفات .html تحت content/
   اللي فيهم العلامة <!-- XPERT-SECTIONS-FAB -->، وكيبدل غير هاداك الجزء
   (الـstyle + الزر + اللوحة + الـscript)، بدون ما يمس الباقي ديال الصفحة.
   السكريبت idempotent وكيخدم بحال كان الملف على شكله الأصلي (قبل أي
   تحديث)، أو كان تبدل من قبل بالنسخة v1/v2/v3 -- كيرفعو مباشرة لـ v4.
   ============================================================ */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CONTENT_DIR = path.join(ROOT, 'content');
const APPLY = process.argv.includes('--apply');
const VERBOSE = process.argv.includes('--verbose');

const BLOCK_RE = /<!-- XPERT-SECTIONS-FAB(?: v[0-9]+)? -->[\s\S]*?\n<\/script>\n/;
const SECTIONS_RE = /var sections = (\[[\s\S]*?\]);/;
const CURRENT_RE = /var current = "([^"]*)";/;
const VERSION_MARKER = '<!-- XPERT-SECTIONS-FAB v4 -->';

// كلمات كتدل على أن هاد القسم هو "ملخص الدرس" (باش نعطيوه ستايل الأزرق الزجاجي)
const SUMMARY_RE = /résumé|resume|synthèse|synthese|ملخص|تلخيص/i;

/* ---------------------------------------------------------
   1) البحث على جميع الملفات المعنية
--------------------------------------------------------- */
function walk(dir, out) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            walk(full, out);
        } else if (entry.isFile() && entry.name.endsWith('.html')) {
            out.push(full);
        }
    }
    return out;
}

/* ---------------------------------------------------------
   2) بناء الـblock الجديد (CSS + HTML + JS) لملف معيّن
--------------------------------------------------------- */
function buildNewBlock(sectionsRaw, currentRaw) {
    // sectionsRaw و currentRaw كيتكرروا حرفياً كيفما كانوا فالملف الأصلي
    // (JSON string جاهزة)، غير كنبنيو بيهم الـscript الجديد. كل عنصر
    // كيوجّه مباشرة لصفحته ديالو (s.href) -- بحال كان خدام قبل v2.
    return `${VERSION_MARKER}
<style>
/* ====== زر الأقسام العائم (Glass Pill) -- نفس لغة تصميم .devoir-fab ====== */
.xpert-sec-fab-btn{position:fixed;left:16px;bottom:20px;z-index:9999;height:48px;min-width:48px;
  padding:0 8px;border-radius:24px;background:rgba(var(--overlay-rgb),0.06);
  -webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);
  border:1px solid rgba(78,205,196,0.28);color:var(--text-primary);
  box-shadow:0 4px 18px rgba(0,0,0,0.16);cursor:pointer;
  display:flex;align-items:center;justify-content:center;gap:8px;
  opacity:0;transform:translateY(10px);pointer-events:none;
  /* ظهور هادئ (fade + slide) بلا bounce/overshoot اللي كيبان مفاجئ */
  transition:opacity .55s cubic-bezier(.4,0,.2,1),transform .55s cubic-bezier(.4,0,.2,1),
    background .25s ease,border-color .25s ease,box-shadow .25s ease;}
.xpert-sec-fab-btn.xpert-fab-show{opacity:1;transform:translateY(0);pointer-events:auto;}
.xpert-sec-fab-btn:hover{background:rgba(78,205,196,0.12);border-color:rgba(78,205,196,0.5);
  box-shadow:0 6px 22px rgba(0,0,0,0.2);}
.xpert-sec-fab-btn:active{transform:scale(0.94);}
.xpert-sec-fab-btn .xsf-icon{width:32px;height:32px;flex-shrink:0;display:flex;align-items:center;
  justify-content:center;font-size:15px;color:#4ECDC4;transition:transform .3s ease,color .25s ease;}
.xpert-sec-fab-btn .xsf-label{font-family:var(--font-main);font-size:12.5px;font-weight:600;
  white-space:nowrap;padding-inline-end:6px;color:var(--text-secondary);}
.xpert-sec-fab-btn.xpert-fab-open .xsf-icon{transform:rotate(135deg);color:#FF6B6B;}
/* نبضة ترحيبية خفيفة أول ما يبان الزر، كتوقف ملي يتفتح */
.xpert-sec-fab-btn.xpert-fab-show::after{content:'';position:absolute;inset:-6px;border-radius:24px;
  border:2px solid #4ECDC4;opacity:0;animation:xpertFabPulse 2.8s ease-out .6s infinite;pointer-events:none;}
.xpert-sec-fab-btn.xpert-fab-open::after{animation-play-state:paused;opacity:0;}
@keyframes xpertFabPulse{0%{transform:scale(0.9);opacity:.5;}70%{transform:scale(1.08);opacity:0;}100%{transform:scale(1.08);opacity:0;}}
@media (max-width:480px){
  .xpert-sec-fab-btn{bottom:14px;left:12px;height:44px;}
  .xpert-sec-fab-btn .xsf-icon{width:28px;height:28px;font-size:14px;}
  .xpert-sec-fab-btn .xsf-label{font-size:11.5px;}
}
@media (prefers-reduced-motion: reduce){
  .xpert-sec-fab-btn.xpert-fab-show::after{animation:none;display:none;}
  .xpert-sec-fab-btn .xsf-icon{transition:none;}
}

/* ====== قائمة الأقسام العائمة (نفس لغة .devoir-fab-menu) ====== */
.xpert-sec-menu{position:fixed;bottom:78px;left:16px;z-index:9998;
  display:flex;flex-direction:column;gap:8px;max-height:66vh;overflow-y:auto;
  padding:2px;opacity:0;visibility:hidden;transform:translateY(10px) scale(0.96);
  transform-origin:bottom left;transition:opacity .22s ease,transform .22s ease,visibility .22s;}
.xpert-sec-menu.open{opacity:1;visibility:visible;transform:translateY(0) scale(1);}
.xpert-sec-menu::-webkit-scrollbar{width:4px;}
.xpert-sec-menu::-webkit-scrollbar-thumb{background:rgba(78,205,196,0.35);border-radius:4px;}

.xpert-sec-item{position:relative;display:flex;align-items:center;gap:10px;min-height:44px;
  padding:8px 16px;border-radius:22px;background:var(--bg-card);border:1px solid rgba(78,205,196,0.28);
  color:var(--text-primary);box-shadow:0 4px 18px rgba(0,0,0,0.2);text-decoration:none;
  font-family:var(--font-main);cursor:pointer;
  opacity:0;transform:translateY(8px);
  transition:background .2s ease,border-color .2s ease,transform .2s ease,box-shadow .2s ease,
    opacity .32s cubic-bezier(.4,0,.2,1),transform .32s cubic-bezier(.4,0,.2,1);}
.xpert-sec-menu.open .xpert-sec-item{opacity:1;transform:translateY(0);}
.xpert-sec-item:hover{background:rgba(78,205,196,0.12);border-color:rgba(78,205,196,0.5);}
.xpert-sec-item:active{transform:scale(0.96);}
.xpert-sec-item .xn{font-weight:700;color:#4ECDC4;font-size:13px;min-width:22px;flex-shrink:0;text-align:center;}
.xpert-sec-item .xd{font-size:12px;line-height:1.35;color:var(--text-secondary);}
.xpert-sec-item .xd b{color:var(--text-primary);font-size:12.5px;}

/* العنصر النشط (الصفحة الحالية) */
.xpert-sec-item.active{background:rgba(78,205,196,0.14);border-color:rgba(78,205,196,0.55);}
.xpert-sec-item.active .xn{color:#4ECDC4;}

/* ====== "التالي فالترتيب": نبض تحذيري/تشجيعي مثل عداد الفرض فآخر الدقائق ====== */
@keyframes xpertSecNextPulse{
  0%,100%{box-shadow:0 4px 18px rgba(0,0,0,0.2),0 0 0 0 rgba(78,205,196,0.45);}
  50%{box-shadow:0 4px 18px rgba(0,0,0,0.2),0 0 0 7px rgba(78,205,196,0);}
}
.xpert-sec-item-next{border-color:rgba(78,205,196,0.65);animation:xpertSecNextPulse 1.6s ease-in-out infinite;}
.xpert-sec-item-next .xsn-badge{position:absolute;top:-8px;inset-inline-end:10px;
  background:#4ECDC4;color:#0b0f0e;font-size:9.5px;font-weight:800;line-height:1;
  padding:3px 7px;border-radius:10px;box-shadow:0 2px 6px rgba(0,0,0,0.3);}

/* ====== "ملخص الدرس": بطاقة زجاجية بلون أزرق مميز ====== */
.xpert-sec-item-summary{background:rgba(77,157,224,0.10);border-color:rgba(77,157,224,0.45);
  -webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);}
.xpert-sec-item-summary:hover{background:rgba(77,157,224,0.18);border-color:rgba(77,157,224,0.65);}
.xpert-sec-item-summary .xn{color:#4D9DE0;}
.xpert-sec-item-summary .xd b{color:#79B8E8;}
.xpert-sec-item-summary.active{background:rgba(77,157,224,0.20);border-color:rgba(77,157,224,0.7);}
.xpert-sec-item-summary.xpert-sec-item-next{animation-name:xpertSecNextPulseBlue;}
@keyframes xpertSecNextPulseBlue{
  0%,100%{box-shadow:0 4px 18px rgba(0,0,0,0.2),0 0 0 0 rgba(77,157,224,0.5);}
  50%{box-shadow:0 4px 18px rgba(0,0,0,0.2),0 0 0 7px rgba(77,157,224,0);}
}
.xpert-sec-item-summary.xpert-sec-item-next .xsn-badge{background:#4D9DE0;color:#0b0f0e;}

@media (max-width:480px){
  .xpert-sec-menu{left:12px;bottom:66px;}
}
</style>
<button class="xpert-sec-fab-btn" id="xpertSecFabBtn" aria-label="الأقسام" aria-haspopup="true" aria-expanded="false">
  <span class="xsf-icon"><i class="fas fa-layer-group"></i></span>
  <span class="xsf-label">الأقسام</span>
</button>
<div class="xpert-sec-menu" id="xpertSecMenu" role="menu"></div>
<script>
(function(){
  var sections = ${sectionsRaw};
  var current = "${currentRaw}";
  var STAGGER_STEP = 40, STAGGER_MAX = 300;
  var btn = document.getElementById('xpertSecFabBtn');
  var menu = document.getElementById('xpertSecMenu');
  var currentIndex = -1;
  sections.forEach(function(s,i){ if (s.href === current) currentIndex = i; });

  sections.forEach(function(s, i){
    var isSummary = /résumé|resume|synthèse|synthese|ملخص|تلخيص/i.test((s.label||'') + ' ' + (s.desc||''));
    var isNext = (currentIndex !== -1 && i === currentIndex + 1);
    var a = document.createElement('a');
    a.href = s.href; // رابط مباشر لصفحة القسم (exerciceN.html / serieN.html / partN.html)
    a.setAttribute('role', 'menuitem');
    var cls = 'xpert-sec-item';
    if (s.href === current) cls += ' active';
    if (isSummary) cls += ' xpert-sec-item-summary';
    if (isNext) cls += ' xpert-sec-item-next';
    a.className = cls;
    a.innerHTML = '<span class="xn">' + (i+1) + '</span>' +
      '<span class="xd"><b>' + (s.label||('#'+(i+1))) + '</b><br>' + (s.desc||'') + '</span>' +
      (isNext ? '<span class="xsn-badge">Suivant</span>' : '');
    menu.appendChild(a);
  });

  function staggerIn(){
    var items = menu.querySelectorAll('.xpert-sec-item');
    items.forEach(function(it, i){
      it.style.transitionDelay = Math.min(i * STAGGER_STEP, STAGGER_MAX) + 'ms';
    });
  }
  function clearStagger(){
    var items = menu.querySelectorAll('.xpert-sec-item');
    items.forEach(function(it){ it.style.transitionDelay = '0ms'; });
  }

  function openMenu(){
    staggerIn();
    menu.classList.add('open');
    btn.classList.add('xpert-fab-open');
    btn.setAttribute('aria-expanded', 'true');
    document.addEventListener('click', onDocClick, true);
    document.addEventListener('keydown', onKeydown);
  }
  function closeMenu(){
    clearStagger();
    menu.classList.remove('open');
    btn.classList.remove('xpert-fab-open');
    btn.setAttribute('aria-expanded', 'false');
    document.removeEventListener('click', onDocClick, true);
    document.removeEventListener('keydown', onKeydown);
  }
  function toggleMenu(){
    if (menu.classList.contains('open')) closeMenu(); else openMenu();
  }
  function onDocClick(e){
    if (menu.contains(e.target) || btn.contains(e.target)) return;
    closeMenu();
  }
  function onKeydown(e){
    if (e.key === 'Escape') closeMenu();
  }
  btn.addEventListener('click', toggleMenu);

  // ====== التزامن مع اختفاء xpertLoader (الدائرة اللي كتدور) ======
  // #xpertLoader عندو transition ديالو "opacity .55s" (~500ms) ملي
  // كيتزاد class="xpert-loader-hide"/"xpert-loaded". اللودر (z-index
  // عالي جداً) كيبقى فوق كلشي طول هاد المدة وهو كيتلاشى. إيلا بدا الزر
  // فالظهور دغيا ملي كيتكتشف class="xpert-loaded"، كيبقى مخبي تحت
  // اللودر اللي مازال باين، وكيبان "طّاح" دفعة وحدة غير ملي يختفي
  // اللودر بالكامل. الحل: نستناو نفس 500ms (مدة اختفاء اللودر) قبل ما
  // نبداو أنيميشن ظهور الزر، باش الاثنين يتزامنو بالضبط.
  var LOADER_FADE_MS = 500;
  function revealFab(){ requestAnimationFrame(function(){ btn.classList.add('xpert-fab-show'); }); }
  function revealFabSynced(){ setTimeout(revealFab, LOADER_FADE_MS); }
  if (!document.getElementById('xpertLoader')) {
    revealFab(); // الصفحة ماعندهاش لودر أصلا، ما كاين والو نتزامنو معاه
  } else if (document.body.classList.contains('xpert-loaded')) {
    revealFabSynced();
  } else {
    var mo = new MutationObserver(function(){
      if (document.body.classList.contains('xpert-loaded')) { revealFabSynced(); mo.disconnect(); }
    });
    mo.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    setTimeout(revealFabSynced, 1500); // حماية إيلا اللودر ما زادش الكلاس لسبب ما
  }
})();
</script>
`;
}

/* ---------------------------------------------------------
   3) معالجة ملف واحد
--------------------------------------------------------- */
function processFile(file, stats) {
    const original = fs.readFileSync(file, 'utf8');
    const blockMatch = original.match(BLOCK_RE);
    if (!blockMatch) {
        stats.skippedNoBlock++;
        return;
    }
    const oldBlock = blockMatch[0];

    // إيلا كان الملف عندو النسخة v3 ديال بعضو (السكريبت خدام مرتين)، ما نعاودوش
    if (oldBlock.startsWith(VERSION_MARKER)) {
        stats.alreadyUpgraded++;
        return;
    }

    const sectionsMatch = oldBlock.match(SECTIONS_RE);
    const currentMatch = oldBlock.match(CURRENT_RE);
    if (!sectionsMatch || !currentMatch) {
        stats.skippedParseError++;
        console.warn('  [WARN] ماقدرش يقرا sections/current فـ:', path.relative(ROOT, file));
        return;
    }

    try {
        JSON.parse(sectionsMatch[1]); // غير للتأكد أن الـJSON صحيح
    } catch (e) {
        stats.skippedParseError++;
        console.warn('  [WARN] JSON غير صحيح فـ sections فـ:', path.relative(ROOT, file));
        return;
    }

    const newBlock = buildNewBlock(sectionsMatch[1], currentMatch[1]);
    const updated = original.replace(BLOCK_RE, newBlock);

    if (APPLY) {
        fs.writeFileSync(file, updated, 'utf8');
    }
    stats.upgraded++;
    if (VERBOSE) {
        console.log('  ' + (APPLY ? '✔ تم التحديث' : '→ سيتم التحديث') + ':', path.relative(ROOT, file));
    }
}

/* ---------------------------------------------------------
   4) main
--------------------------------------------------------- */
function main() {
    if (!fs.existsSync(CONTENT_DIR)) {
        console.error('✗ ماكاينش مجلد content/ فـ:', CONTENT_DIR);
        console.error('  شغّل السكريبت من جذر المشروع، أو دير utils/ جوج المشروع مباشرة.');
        process.exit(1);
    }

    const files = walk(CONTENT_DIR, []);
    const stats = { upgraded: 0, skippedNoBlock: 0, alreadyUpgraded: 0, skippedParseError: 0 };

    console.log('========================================');
    console.log(APPLY ? '🔧 تطبيق تحديث زر الأقسام (Sections FAB)' : '🔍 Dry-run: فحص تحديث زر الأقسام (Sections FAB)');
    console.log('========================================');
    console.log('عدد ملفات .html الموجودة تحت content/:', files.length);
    console.log('');

    for (const file of files) {
        processFile(file, stats);
    }

    console.log('');
    console.log('----------------------------------------');
    console.log('✅ ملفات ' + (APPLY ? 'تم تحديثها' : 'غادي يتبدلو') + ':', stats.upgraded);
    console.log('⏭️  ملفات بلا زر أقسام (تجوهات):', stats.skippedNoBlock);
    console.log('♻️  ملفات محدثة من قبل (تجوهات):', stats.alreadyUpgraded);
    if (stats.skippedParseError) console.log('⚠️  ملفات فيها مشكل فالقراءة:', stats.skippedParseError);
    console.log('----------------------------------------');
    if (!APPLY) {
        console.log('ملاحظة: هادي Dry-run فقط، ما تبدل حتى ملف.');
        console.log('باش تطبق فعلياً: node utils/upgrade-sections-fab.js --apply');
    }
}

main();
