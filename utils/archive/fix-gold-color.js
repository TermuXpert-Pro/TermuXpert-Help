#!/usr/bin/env node
/**
 * fix-gold-color.js
 * ------------------------------------------------------------
 * كيبدل كل استعمال مباشر ديال color:#F4D03F (اللون الأصفر ديال الكيمياء)
 * بـ color:var(--gold-text), باش يتبع أوتوماتيكياً المتغير المعرف فـ style.css:
 *
 *   :root                        { --gold-text: #F4D03F; }  // dark
 *   html[data-theme="light"]     { --gold-text: #B8860B; }  // light (أغمق، واضح فوق البيض)
 *
 * كيخلي بحالها (ماكيمسهمش):
 *   - border-color:#F4D03F   (بوردورات - ماشي مشكل تباين النص)
 *   - background:#F4D03F22  (خلفيات بألفا)
 *   - fill="#F4D03F"         (زخارف SVG)
 *
 * الاستخدام (من جذر المشروع فـ Termux):
 *   node utils/fix-gold-color.js
 *
 * ملاحظة: خاصك تدير نسخة احتياطية (git commit أو backup) قبل ما تخدمها،
 * حيت كتبدل الملفات مباشرة (in-place).
 * ------------------------------------------------------------
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SKIP_DIRS = ['node_modules', '.git'];
const EXTS = ['.html', '.css'];

// نمط: "color:" ماشي مسبوقة بـ "border-", مع أو بلا مسافة، تباعها #F4D03F
const RE = /(?<!border-)color:\s*#F4D03F\b/g;

let filesChanged = 0;
let totalReplacements = 0;
const changedFilesList = [];

function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (SKIP_DIRS.includes(entry.name)) continue;
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            walk(full);
        } else if (EXTS.includes(path.extname(entry.name))) {
            const content = fs.readFileSync(full, 'utf-8');
            const matches = content.match(RE);
            if (matches && matches.length) {
                const updated = content.replace(RE, 'color:var(--gold-text)');
                fs.writeFileSync(full, updated);
                filesChanged++;
                totalReplacements += matches.length;
                const rel = path.relative(ROOT, full);
                changedFilesList.push(`${rel} (${matches.length})`);
                console.log(`   ✅ ${rel} — ${matches.length} تبديل`);
            }
        }
    }
}

console.log('🔍 بدء البحث والتبديل: color:#F4D03F → color:var(--gold-text)...\n');
walk(ROOT);

console.log('\n============================================================');
console.log(`✅ انتهى: ${filesChanged} ملف تبدلو، ${totalReplacements} تبديل بالمجموع.`);
console.log('============================================================\n');

if (filesChanged === 0) {
    console.log('ℹ️ ما لقيتش أي "color:#F4D03F" باقية. ربما ديجا مبدلة أو الملفات فمسار آخر.');
} else {
    console.log('👉 دابا جرب light mode: النص الأصفر غادي يبان أغمق (#B8860B) تلقائياً بلا ما يمس والو فـ dark.');
}
