#!/usr/bin/env node
/**
 * inject-pdf-button.js
 * ------------------------------------------------------------
 * يضيف زر (أو زرّي) تحميل PDF أنيقًا مباشرة أسفل عنوان كل صفحة
 * من صفحات "logique" (الدرس، التمارين، السلاسل) — وليس كزر عائم
 * أسفل الشاشة، بل ضمن تدفّق الصفحة تحت العنوان مباشرة — بنفس
 * هوية موقع Xpert البصرية (الثيم الداكن، تدرّج تركوازي).
 *
 * الاستعمال:
 *   node inject-pdf-button.js /path/to/Web
 *   (إن لم يُمرَّر مسار، يستعمل المجلد الحالي "." كجذر للموقع)
 *
 * الشرط الوحيد: ضع ملفات PDF بنفس أسماء CONFIG أدناه، في نفس
 * المجلد الذي يحوي صفحات HTML لكل قسم.
 *
 * قابل لإعادة التشغيل بأمان (idempotent): كل تشغيل يحذف الزر
 * القديم قبل إضافة نسخة جديدة، فلن يتكرر الزر أبدًا.
 * ------------------------------------------------------------
 */

const fs = require('fs');
const path = require('path');

/* ============================================================
   1) الإعدادات: عدّل هنا فقط إن غيّرت أسماء ملفات الـ PDF
   ============================================================ */
const CONFIG = [
  {
    label: 'الدرس (Lesson)',
    dir: 'content/math/lessons/logique/model1',
    match: /^(part\d+|index)\.html$/i,
    mode: 'single',
    files: { pdf: 'Logique_Mathematique_Xpert.pdf' },
  },
  {
    label: 'التمارين (Exercises)',
    dir: 'content/math/exercises/logique/model1',
    match: /^(exercice\d+|index)\.html$/i,
    mode: 'dual',
    files: {
      enonce: 'Exercices_Logique_1_Enonces.pdf',
      corrige: 'Exercices_Logique_2_Corrige.pdf',
    },
  },
  {
    label: 'السلاسل (Séries)',
    dir: 'content/math/series/logique/model1',
    match: /^(serie\d+|index)\.html$/i,
    mode: 'dual',
    files: {
      enonce: 'Series_Logique_1_Enonces.pdf',
      corrige: 'Series_Logique_2_Corrige.pdf',
    },
  },
];

const ROOT = process.argv[2] || '.';
const MARK_START = '<!-- XPERT-PDF-BUTTON:START -->';
const MARK_END = '<!-- XPERT-PDF-BUTTON:END -->';

/* أيقونة تحميل SVG مشتركة (بدون الاعتماد على خط Font Awesome) */
const ICON = `<svg viewBox="0 0 24 24" class="xpert-pdf-btn-icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="M7 10l5 5 5-5"/><path d="M5 21h14"/></svg>`;

/* ============================================================
   2) الأنماط المشتركة (بطاقة/شريط ثابت أسفل العنوان، وليس عائمًا)
   ============================================================ */
const SHARED_STYLE = `
<style>
  .xpert-pdf-bar{ display:flex; flex-wrap:wrap; gap:10px; margin:14px 0 20px; }
  .xpert-pdf-btn{
    display:inline-flex; align-items:center; gap:8px;
    background:var(--bg-card,#1F2833); border:1px solid var(--border,#2A3340);
    color:var(--accent-light,#66FCF1); padding:9px 16px; border-radius:10px;
    text-decoration:none; font-family:var(--font-main,'Inter','Cairo',sans-serif);
    font-size:12.5px; font-weight:700; box-shadow:0 2px 10px rgba(0,0,0,.18);
    transition:transform .18s ease, box-shadow .18s ease, background .18s ease, border-color .18s ease;
  }
  .xpert-pdf-btn:hover{
    transform:translateY(-1px);
    box-shadow:0 6px 18px rgba(69,162,158,.30);
    background:rgba(69,162,158,.12);
    border-color:rgba(69,162,158,.45);
  }
  .xpert-pdf-btn-icon{ width:15px; height:15px; flex-shrink:0; }
  .xpert-pdf-btn.variant-corrige{ color:#A8FF78; }
  .xpert-pdf-btn.variant-corrige:hover{ background:rgba(168,255,120,.10); border-color:rgba(168,255,120,.4); }
  .xpert-pdf-btn.variant-enonce{ color:#FF6B6B; }
  .xpert-pdf-btn.variant-enonce:hover{ background:rgba(255,107,107,.10); border-color:rgba(255,107,107,.4); }
  @media (max-width:480px){
    .xpert-pdf-btn{ padding:8px 13px; font-size:12px; }
  }
</style>`;

/* ============================================================
   3) قالب زر واحد (يُستعمل لصفحات الدرس)
   ============================================================ */
function buildSingleButton(pdfFile) {
  return `
${MARK_START}
<div class="xpert-pdf-bar">
  <a href="${pdfFile}" download class="xpert-pdf-btn">
    ${ICON}
    <span>Télécharger le cours en PDF</span>
  </a>
</div>
${SHARED_STYLE}
${MARK_END}
`;
}

/* ============================================================
   4) قالب زرّين جنبًا إلى جنب (Énoncé / Corrigé)
      تُستعمل لصفحات التمارين والسلاسل
   ============================================================ */
function buildDualButton(enoncePdf, corrigePdf) {
  return `
${MARK_START}
<div class="xpert-pdf-bar">
  <a href="${enoncePdf}" download class="xpert-pdf-btn variant-enonce">
    ${ICON}
    <span>PDF — Énoncé</span>
  </a>
  <a href="${corrigePdf}" download class="xpert-pdf-btn variant-corrige">
    ${ICON}
    <span>PDF — Corrigé</span>
  </a>
</div>
${SHARED_STYLE}
${MARK_END}
`;
}

/* ============================================================
   5) معالجة ملف واحد: حذف الزر القديم (إن وُجد) ثم إدراج الجديد
      مباشرة بعد وسم العنوان <h1 class="lesson-title">...</h1>
   ============================================================ */
const TITLE_REGEX = /(<h1\s+class="lesson-title">[\s\S]*?<\/h1>)/i;

function processFile(filePath, group) {
  let html = fs.readFileSync(filePath, 'utf8');

  // إزالة أي زر سبق إدراجه (يجعل تشغيل السكريبت أكثر من مرة آمنًا)
  const blockRegex = new RegExp(
    MARK_START.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') +
      '[\\s\\S]*?' +
      MARK_END.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
    'g'
  );
  html = html.replace(blockRegex, '');

  const inject =
    group.mode === 'single'
      ? buildSingleButton(group.files.pdf)
      : buildDualButton(group.files.enonce, group.files.corrige);

  if (TITLE_REGEX.test(html)) {
    html = html.replace(TITLE_REGEX, '$1\n' + inject);
  } else {
    console.log('  ⚠ لم يُعثر على <h1 class="lesson-title"> في: ' + path.basename(filePath) + ' — تم تجاوزه');
    return;
  }

  fs.writeFileSync(filePath, html, 'utf8');
  console.log('  ✔ ' + path.basename(filePath));
}

/* ============================================================
   6) التشغيل الرئيسي
   ============================================================ */
function run() {
  console.log('Xpert — حاقن زر تحميل PDF (أسفل العنوان)');
  console.log('جذر الموقع:', path.resolve(ROOT));
  let total = 0;

  for (const group of CONFIG) {
    const dirPath = path.join(ROOT, group.dir);
    if (!fs.existsSync(dirPath)) {
      console.log(`\n⚠ [${group.label}] المجلد غير موجود، تم تجاوزه: ${group.dir}`);
      continue;
    }
    console.log(`\n[${group.label}]  ${group.dir}`);
    const entries = fs.readdirSync(dirPath);
    let countInGroup = 0;
    for (const entry of entries) {
      if (group.match.test(entry)) {
        processFile(path.join(dirPath, entry), group);
        countInGroup++;
        total++;
      }
    }
    if (countInGroup === 0) console.log('  (لا توجد صفحات مطابقة)');
  }

  console.log(`\nتم بنجاح — ${total} صفحة تمت معالجتها.`);
}

run();
