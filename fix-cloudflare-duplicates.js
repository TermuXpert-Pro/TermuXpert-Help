#!/usr/bin/env node
/**
 * fix-cloudflare-duplicates.js
 * -----------------------------------------------------------------------
 * كيصلح مشكل تكرار Cloudflare Web Analytics beacon script فـ ملفات HTML.
 *
 * السبب: احتمال build.js (أو سكريبت injection قديم) كايدير append لداك
 * السطر كل مرة كايتبنى الموقع، بحال بالضبط bug injectSidebarAssets() لي
 * تصلح من قبل.
 *
 * اش كيدير:
 *   1. كيقلب على جميع ملفات .html بشكل recursive من ROOT_DIR
 *   2. كيلقى كل نسخ Cloudflare beacon block (بين <!-- Cloudflare Web
 *      Analytics --> و <!-- End Cloudflare Web Analytics -->)
 *   3. إلا لقى أكثر من نسخة، كيبقي غير على وحدة وكيشيل الباقي
 *   4. كيدير log بالتفصيل + ملخص فالأخير
 *   5. Dry-run بالدفو (ما غاديش يبدل الملفات) — خاصك --write باش يكتب فعليا
 *
 * الاستعمال (من Termux، من جذر المشروع):
 *   node fix-cloudflare-duplicates.js            # dry-run (يوري غير التقرير)
 *   node fix-cloudflare-duplicates.js --write     # يصلح فعليا ويكتب الملفات
 *
 * يمكن تحدد المجلد:
 *   node fix-cloudflare-duplicates.js --write --dir=./model1
 * -----------------------------------------------------------------------
 */

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------
// الإعدادات
// ---------------------------------------------------------------------
const args = process.argv.slice(2);
const WRITE = args.includes('--write');
const dirArg = args.find(a => a.startsWith('--dir='));
const ROOT_DIR = path.resolve(dirArg ? dirArg.split('=')[1] : '.');

// مجلدات خاصهم يتقفزو (ما فيهاش داعي نقلبو فيهم)
const IGNORE_DIRS = new Set(['node_modules', '.git', 'dist', 'build', '.netlify']);

// Regex كيقبض على كل block ديال Cloudflare Web Analytics (سطر وحد أو أكثر)
// شامل الـ blank lines لي قبلو وبعدو باش التنظيف يكون نضيف
const CF_BLOCK_RE =
  /\n?[ \t]*<!--\s*Cloudflare Web Analytics\s*-->[\s\S]*?<!--\s*End Cloudflare Web Analytics\s*-->[ \t]*\n?/gi;

// ---------------------------------------------------------------------
// كيجمع جميع ملفات .html بشكل recursive
// ---------------------------------------------------------------------
function collectHtmlFiles(dir, out = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (IGNORE_DIRS.has(entry.name)) continue;
      collectHtmlFiles(fullPath, out);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      out.push(fullPath);
    }
  }
  return out;
}

// ---------------------------------------------------------------------
// كيصلح ملف وحد
// ---------------------------------------------------------------------
function fixFile(filePath) {
  const original = fs.readFileSync(filePath, 'utf8');

  const matches = original.match(CF_BLOCK_RE);
  if (!matches || matches.length === 0) {
    return { filePath, status: 'skip-none', count: 0 };
  }
  if (matches.length === 1) {
    return { filePath, status: 'ok', count: 1 };
  }

  // كنبقاو غير أول نسخة (منظفة من الفراغ الزائد) ونشيلو الباقي
  const firstBlock = matches[0].trim();
  let seen = false;
  const cleaned = original.replace(CF_BLOCK_RE, () => {
    if (!seen) {
      seen = true;
      return `\n${firstBlock}\n`;
    }
    return '';
  });

  if (WRITE) {
    fs.writeFileSync(filePath, cleaned, 'utf8');
  }

  return { filePath, status: 'fixed', count: matches.length };
}

// ---------------------------------------------------------------------
// التشغيل الرئيسي
// ---------------------------------------------------------------------
function main() {
  console.log(`📂 كيقلب فـ: ${ROOT_DIR}`);
  console.log(`🔧 الوضع: ${WRITE ? 'WRITE (غادي يبدل الملفات فعليا)' : 'DRY-RUN (غير تقرير، ما غاديش يبدل والو)'}`);
  console.log('');

  const files = collectHtmlFiles(ROOT_DIR);
  console.log(`📄 عدد ملفات HTML لي تلقاو: ${files.length}`);
  console.log('');

  let fixedCount = 0;
  let okCount = 0;
  let noneCount = 0;
  const fixedFiles = [];

  for (const file of files) {
    const result = fixFile(file);
    if (result.status === 'fixed') {
      fixedCount++;
      fixedFiles.push(`  ✅ ${path.relative(ROOT_DIR, file)}  (${result.count} → 1)`);
    } else if (result.status === 'ok') {
      okCount++;
    } else {
      noneCount++;
    }
  }

  if (fixedFiles.length > 0) {
    console.log('الملفات لي فيهم تكرار:');
    console.log(fixedFiles.join('\n'));
    console.log('');
  }

  console.log('───────────────────────────────');
  console.log(`✅ فيهم تكرار وتصلحو : ${fixedCount}`);
  console.log(`✔️  ماشي محتاجين تصليح (نسخة وحدة) : ${okCount}`);
  console.log(`⚪ ما فيهمش Cloudflare script  : ${noneCount}`);
  console.log('───────────────────────────────');

  if (!WRITE && fixedCount > 0) {
    console.log('');
    console.log('⚠️  هادا كان غير dry-run. باش تصلح الملفات فعليا، دير:');
    console.log(`   node ${path.basename(__filename)} --write`);
  } else if (WRITE && fixedCount > 0) {
    console.log('');
    console.log('✅ تصلحو الملفات بنجاح.');
  }
}

main();
