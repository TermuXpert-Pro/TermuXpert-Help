#!/usr/bin/env node
/**
 * disable-zoom.js
 * كيمنع تكبير/تصغير الشاشة (pinch-zoom, double-tap zoom, ctrl+wheel zoom)
 * فـ كل صفحات HTML ديال الموقع، بتحديث meta viewport باش يزيد:
 *   maximum-scale=1.0, user-scalable=no
 *
 * - نفس منطق walk/SKIP_DIRS ديال باقي سكريبتات utils/ (build.js, inject-pwa-head.js)
 * - Idempotent: إلا كانت الوسوم زايدين من قبل، كيتخطاه (بلا ما يزيدهم بزوج)
 * - كيدير الحقن غير فـ meta viewport (الجزء ديال JS كاين فـ assets/js/protection.js
 *   حيت هاداك ملف مشترك محقون ديجا فمعظم الصفحات - شوف زيادة "منع الزوم" فيه)
 *
 * الاستخدام:
 *   node utils/disable-zoom.js
 *
 * فين تندرج فـ pipeline البناء (مرة وحدة كافية، غير كتزيد صفحة جديدة):
 *   node utils/build.js
 *   node utils/inject-pwa-head.js
 *   node utils/disable-zoom.js       <-- هادي
 *   node utils/generate-sitemap.js
 *   node utils/validate.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SKIP_DIRS = ['node_modules', '.git', 'partials', 'templates'];

// نفس meta viewport اللي كاين حالياً فكل صفحات الموقع (نمط واحد ثابت)
const OLD_VIEWPORT_RE = /<meta name="viewport" content="width=device-width, initial-scale=1\.0">/g;
const NEW_VIEWPORT = '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">';

function walk(dir, fileList = []) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (SKIP_DIRS.includes(entry.name)) continue;
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            walk(full, fileList);
        } else if (entry.name.endsWith('.html')) {
            fileList.push(full);
        }
    }
    return fileList;
}

let updated = 0;
let skipped = 0;
let notFound = 0;

console.log('🔒 بدء منع التكبير/التصغير (zoom) فـ meta viewport...\n');

for (const file of walk(ROOT)) {
    const rel = path.relative(ROOT, file);
    let content = fs.readFileSync(file, 'utf-8');

    // إلا كان user-scalable زايد من قبل، تخطاه (idempotent)
    if (/user-scalable=no/.test(content)) {
        skipped++;
        continue;
    }

    if (!OLD_VIEWPORT_RE.test(content)) {
        notFound++;
        console.log(`   ⚠️ ${rel} - ماكاينش meta viewport بالنمط المتوقع، تخطيته`);
        continue;
    }

    OLD_VIEWPORT_RE.lastIndex = 0;
    content = content.replace(OLD_VIEWPORT_RE, NEW_VIEWPORT);
    fs.writeFileSync(file, content);
    updated++;
    console.log(`   ✅ ${rel} - تم منع الزوم`);
}

console.log(`\n✅ خلص: ${updated} صفحة تحدّثت، ${skipped} كانت ديجا فيها، ${notFound} بلا meta viewport معروف.`);
console.log('ℹ️ تذكر: زيد كتلة "منع الزوم بـ JS" فـ assets/js/protection.js (pinch/gesture/dblclick/ctrl+wheel) باش الحماية تكون كاملة فكل المتصفحات.');
