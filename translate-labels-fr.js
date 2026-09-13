#!/usr/bin/env node
/**
 * translate-labels-fr.js
 * ------------------------------------------------------------
 * يترجم النصوص العربية الظاهرة للمستخدم في صفحات "logique"
 * (الدرس، التمارين، السلاسل) إلى الفرنسية:
 *
 *   1) زر "الأقسام" العائم (xpert-sec-fab-btn)      →  "Sections"
 *   2) زر "اختبار الدرس" العائم (xpert-quiz-fab-btn) →  "Quiz du cours"
 *
 * لا يغيّر أي شيء آخر في الملف (لا التعليقات الداخلية، ولا أي
 * نص عربي آخر خارج هذين الزرّين) — ترجمة دقيقة ومحدودة النطاق
 * كما طُلب، حتى لا تُكسَر عناصر أخرى في الموقع بشكل غير مقصود.
 *
 * الاستعمال:
 *   node translate-labels-fr.js /path/to/Web
 *   (إن لم يُمرَّر مسار، يستعمل المجلد الحالي "." كجذر للموقع)
 *
 * قابل لإعادة التشغيل بأمان: إن كانت الترجمة موجودة مسبقًا، لن
 * يجد السكريبت شيئًا ليُغيّره وسيمر عليه دون أي تأثير.
 * ------------------------------------------------------------
 */

const fs = require('fs');
const path = require('path');

/* ============================================================
   1) المجلدات المستهدَفة (أضف/احذف أسطرًا هنا حسب حاجتك)
   ============================================================ */
const FOLDERS = [
  'content/math/lessons/logique/model1',
  'content/math/exercises/logique/model1',
  'content/math/series/logique/model1',
];
const FILE_MATCH = /\.html$/i;

/* ============================================================
   2) قاموس الترجمة — نصوص محدّدة بدقة (attribute أو span كامل)
      حتى لا نلمس أي نص عربي آخر في الصفحة عن طريق الخطأ
   ============================================================ */
const TRANSLATIONS = [
  // زر الأقسام العائم
  { find: 'aria-label="الأقسام"', replace: 'aria-label="Sections"' },
  { find: '<span class="xsf-label">الأقسام</span>', replace: '<span class="xsf-label">Sections</span>' },

  // زر اختبار الدرس العائم
  { find: 'aria-label="اختبار الدرس"', replace: 'aria-label="Quiz du cours"' },
  { find: '<span class="xqf-label">اختبار الدرس</span>', replace: '<span class="xqf-label">Quiz du cours</span>' },
];

const ROOT = process.argv[2] || '.';

/* ============================================================
   3) معالجة ملف واحد
   ============================================================ */
function processFile(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');
  let changed = 0;

  for (const { find, replace } of TRANSLATIONS) {
    if (html.includes(find)) {
      html = html.split(find).join(replace);
      changed++;
    }
  }

  if (changed > 0) {
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`  ✔ ${path.basename(filePath)}  (${changed} عنصر مُترجَم)`);
  } else {
    console.log(`  · ${path.basename(filePath)}  (بدون تغيير — مُترجَم مسبقًا أو غير موجود)`);
  }
}

/* ============================================================
   4) التشغيل الرئيسي
   ============================================================ */
function run() {
  console.log('Xpert — مترجم واجهة الأزرار العائمة (AR → FR)');
  console.log('جذر الموقع:', path.resolve(ROOT));

  for (const dir of FOLDERS) {
    const dirPath = path.join(ROOT, dir);
    if (!fs.existsSync(dirPath)) {
      console.log(`\n⚠ المجلد غير موجود، تم تجاوزه: ${dir}`);
      continue;
    }
    console.log(`\n[${dir}]`);
    const entries = fs.readdirSync(dirPath).filter((f) => FILE_MATCH.test(f));
    if (entries.length === 0) {
      console.log('  (لا توجد ملفات HTML)');
      continue;
    }
    for (const entry of entries) {
      processFile(path.join(dirPath, entry));
    }
  }

  console.log('\nتم.');
}

run();
