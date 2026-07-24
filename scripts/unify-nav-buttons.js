#!/usr/bin/env node
/**
 * unify-nav-buttons.js
 * ============================================================
 * كيوحد شكل زوج أزرار التنقل (السابق/التالي) فأسفل كل صفحة:
 *   - partN.html   (دروس)
 *   - exerciceN.html
 *   - serieN.html
 *
 * المشكل اللي كيصلح:
 *   1) الزر "السابق" كان غالبا كيستعمل class="back-btn" (رابط عادي بلا
 *      تصميم) بدل class="prev-btn" اللي معرف فـ lesson-common.css بشكل
 *      زر متل next-btn (gradient pill) → كانت النتيجة زوج أزرار مختلفين
 *      فالشكل (واحد pill وواحد رابط عادي) - كيما فالصورة.
 *   2) بعض الصفحات فيها <style> محلي كيعاود يعرف .nav-buttons / .next-btn
 *      ب rgba/ألوان مختلفة عن lesson-common.css → هذا كيخلق تضارب فالألوان
 *      (gold فبعض الصفحات، teal فأخرى...). السكريبت كيمسح هاد التعريفات
 *      المحلية باش تبقى الصفحة كاملة كتعتمد على lesson-common.css الموحد.
 *
 * الاستعمال:
 *   node scripts/unify-nav-buttons.js --dry-run     # معاينة بلا تعديل
 *   node scripts/unify-nav-buttons.js                # تطبيق التعديلات
 *   node scripts/unify-nav-buttons.js --root=/path   # جذر مخصص (افتراضي: .)
 * ============================================================
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const rootArg = args.find(a => a.startsWith('--root='));
const ROOT = rootArg ? path.resolve(rootArg.split('=')[1]) : process.cwd();

const FILE_PATTERN = /^(part|exercice|serie)\d+\.html$/i;
const IGNORE_DIRS = new Set(['node_modules', '.git', 'assets', 'dist', 'build']);

let filesScanned = 0;
let filesChanged = 0;
const changedList = [];

// ---------------------------------------------------------------
// 1) جمع الملفات
// ---------------------------------------------------------------
function walk(dir, out = []) {
    let entries;
    try {
        entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch (e) {
        return out;
    }
    for (const entry of entries) {
        if (entry.name.startsWith('.')) continue;
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            if (IGNORE_DIRS.has(entry.name)) continue;
            walk(full, out);
        } else if (entry.isFile() && FILE_PATTERN.test(entry.name)) {
            out.push(full);
        }
    }
    return out;
}

// ---------------------------------------------------------------
// 2) توحيد div.nav-buttons
// ---------------------------------------------------------------
function normalizeNavButtons(html) {
    const navBlockRe = /<div class="nav-buttons">([\s\S]*?)<\/div>/;
    const match = html.match(navBlockRe);
    if (!match) return { html, changedNav: false };

    const inner = match[1];

    // كل <a ...>...</a> جوج div.nav-buttons
    const anchorRe = /<a\s+href="([^"]+)"\s+class="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g;
    const anchors = [];
    let m;
    while ((m = anchorRe.exec(inner)) !== null) {
        const [, href, cls, innerHtml] = m;
        const label = innerHtml
            .replace(/<i[^>]*><\/i>/g, '')
            .replace(/\s+/g, ' ')
            .trim();
        anchors.push({ href, label, cls });
    }

    if (anchors.length === 0) return { html, changedNav: false };

    // مهم: التحديد كيتعمل على حساب الموقع (الأول = سابق، الثاني = تالي)
    // ماشي على حساب اسم الـclass القديم. حيت بعض الصفحات (آخر تمرين/سلسلة)
    // كان فيها اللينك الثاني كيدير لـ index.html بـ class="back-btn"
    // (رجوع نهائي كإجراء "تالي")، والاعتماد على الكلمة كان كيبدلها
    // لـ prev-btn غلط (زوج أزرار "سابق" بحال بعضهم). الموقع دايما صحيح.
    const rebuilt = anchors.map((a, i) => {
        let isPrev;
        if (anchors.length === 1) {
            // حالة وحيدة (بحال part1.html بلا سابق): نعتمدو الكلمة القديمة
            isPrev = /back-btn|prev-btn/.test(a.cls);
        } else {
            isPrev = i === 0; // الأول = سابق، الثاني = تالي (بغض النظر عن class القديم)
        }
        if (isPrev) {
            return `                <a href="${a.href}" class="prev-btn"><i class="fas fa-arrow-right"></i> ${a.label}</a>`;
        }
        return `                <a href="${a.href}" class="next-btn">${a.label} <i class="fas fa-arrow-left"></i></a>`;
    }).join('\n');

    const newBlock = `<div class="nav-buttons">\n${rebuilt}\n            </div>`;
    const newHtml = html.replace(navBlockRe, newBlock);

    return { html: newHtml, changedNav: newHtml !== html };
}

// ---------------------------------------------------------------
// 3) حذف التعريفات المحلية المكررة (.nav-buttons / .next-btn / .prev-btn)
//    فـ <style> باش تولي الصفحة كاملة تعتمد على lesson-common.css فقط
// ---------------------------------------------------------------
function stripLocalOverrides(html) {
    const headEnd = html.indexOf('</head>');
    if (headEnd === -1) return { html, changedCss: false };

    let head = html.slice(0, headEnd);
    const rest = html.slice(headEnd);
    const before = head;

    // نمسحو غير القواعد الأساسية (مش جوج @media) باش نبقاو حذرين
    const selectors = [
        '.nav-buttons',
        '.next-btn',
        '.next-btn:hover',
        '.prev-btn',
        '.prev-btn:hover',
    ];

    for (const sel of selectors) {
        const escaped = sel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        // كنستهدفو غير القواعد اللي فبداية سطر (يعني base-level، مش جوج @media أو compound)
        const re = new RegExp(`\\n\\s*${escaped}\\s*\\{[^}]*\\}\\s*`, 'g');
        head = head.replace(re, '\n');
    }

    return { html: before === head ? html : head + rest, changedCss: before !== head };
}

// ---------------------------------------------------------------
// 4) المعالجة الرئيسية
// ---------------------------------------------------------------
function processFile(filePath) {
    filesScanned++;
    const original = fs.readFileSync(filePath, 'utf8');

    const { html: afterNav, changedNav } = normalizeNavButtons(original);
    const { html: afterCss, changedCss } = stripLocalOverrides(afterNav);

    if (changedNav || changedCss) {
        filesChanged++;
        const rel = path.relative(ROOT, filePath);
        changedList.push({ rel, changedNav, changedCss });

        if (!DRY_RUN) {
            fs.writeFileSync(filePath, afterCss, 'utf8');
        }
    }
}

// ---------------------------------------------------------------
// التشغيل
// ---------------------------------------------------------------
console.log(`🔎 كنقلب فـ: ${ROOT}${DRY_RUN ? '  (dry-run — بلا كتابة)' : ''}\n`);

const files = walk(ROOT);
files.forEach(processFile);

console.log(`\n📄 عدد الملفات اللي تفحصات: ${filesScanned}`);
console.log(`✏️  عدد الملفات اللي تبدلات: ${filesChanged}\n`);

if (changedList.length) {
    changedList.forEach(({ rel, changedNav, changedCss }) => {
        const tags = [changedNav && 'nav', changedCss && 'css'].filter(Boolean).join('+');
        console.log(`  - ${rel}  [${tags}]`);
    });
}

if (DRY_RUN) {
    console.log('\n👉 هادي غير معاينة. باش تطبق التعديلات شغّل بلا --dry-run.');
} else {
    console.log('\n✅ تم! دابا زوج الأزرار غايبانو متناسقين فكل الصفحات (prev-btn + next-btn).');
    console.log('   نصيحة: عاود شغّل build.js / inject-pwa-head.js إلا كانت الحاجة.');
}
