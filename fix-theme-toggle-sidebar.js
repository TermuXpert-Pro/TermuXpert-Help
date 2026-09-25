#!/usr/bin/env node
/**
 * fix-theme-toggle-sidebar.js
 * ============================================================
 * كيصلح موقع زر تبديل الوضع (Dark/Light) فـ جميع صفحات HTML ديال الموقع:
 *
 *   1) كيشوف كل ملف .html فيه <nav id="navbar">...</nav> و <div id="sidebar">
 *   2) إلا لقا زر #themeToggle متبوت فـ التولبار (navbar) → كيقلعو من تما
 *      (وكيقلع التعليق اللي فوقو إلا كان، بحال <!-- زر تبديل الوضع ... -->)
 *   3) كيدخلو فالقائمة الجانبية (sidebar) فأول عنصر ديال
 *      .sidebar-section-profile (قبل الصورة ديال البروفايل) - نفس
 *      المكان اللي كاين فمعظم صفحات الموقع
 *   4) إلا كان الزر ماشي موجود لا فالتولبار ولا فالسايدبار (نادر)،
 *      كيعتبرو "ناقص" وكيبلغ بيه فالتقرير الأخير بلا ما يخترع حاجة
 *   5) إلا الزر كاين ديجا فمكانو الصحيح (السايدبار) → ماكيبدلش حتى حاجة
 *      (السكريبت idempotent - تقدر تعاود تشغلو بلا ما يخرب شي حاجة)
 *
 * ملاحظة على "تطبيق التغيير على الموقع بأكمله":
 *   آلية الحفظ ديال الاختيار (localStorage 'xpert-theme') + السكريبت
 *   المبكر (theme-init) اللي كيتحط فـ <head> قبل الـ CSS، هوما اللي
 *   كيخليو الثيم يتطبق فـ كل صفحة كتفتح (ماشي غير الصفحة الحالية).
 *   هاد الآلية موجودة ديجا فمعظم صفحات الموقع. هاد السكريبت كيتأكد
 *   بزاف: إلا صفحة فيها id="sidebar" ومافيهاش لا theme-init (مباشرة
 *   ولا عبر assets/js/shared-inline.js) ولا زر themeToggle - كيبلغ
 *   بيها فالتقرير باش تتصلح يدوي، حيت هادشي كيمس بنية الصفحة أكثر من
 *   مجرد نقل زر.
 *
 * الاستعمال:
 *   node scripts/fix-theme-toggle-sidebar.js --dry-run     # معاينة بلا تعديل
 *   node scripts/fix-theme-toggle-sidebar.js                # تطبيق التعديلات
 *   node scripts/fix-theme-toggle-sidebar.js --root=/path   # جذر مخصص (افتراضي: .)
 * ============================================================
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const rootArg = args.find(a => a.startsWith('--root='));
const ROOT = rootArg ? path.resolve(rootArg.split('=')[1]) : process.cwd();

const IGNORE_DIRS = new Set(['node_modules', '.git', 'dist', 'build']);
// الملفات فهاد المجلدات غير قوالب/أجزاء (partials/templates) - ماعندهمش
// بنية navbar+sidebar كاملة ديال صفحة حقيقية، فكنتجاوزوهم بصمت
const SKIP_DIR_NAMES = new Set(['templates', 'partials']);

let filesScanned = 0;
let filesChanged = 0;
let filesAlreadyOk = 0;
let filesSkippedNoStructure = 0;
let filesFlaggedMissingButton = 0;
let filesFlaggedMissingThemeInit = 0;
const changedList = [];
const flaggedList = [];

// ---------------------------------------------------------------
// 1) جمع ملفات HTML
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
        } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.html')) {
            out.push(full);
        }
    }
    return out;
}

// ---------------------------------------------------------------
// 2) Regex غير حساسة لترتيب الـ attributes ولا للتنسيق (indentation)
//    - بعض صفحات الموقع مكتوبة بمسافات وأسطر، وبعضها الآخر "مسطّح"
//      (كل tag فسطر وحدو بلا مسافات، attributes مرتبة أبجديا)
// ---------------------------------------------------------------
const NAVBAR_RE = /<nav\b[^>]*\bid=["']navbar["'][^>]*>[\s\S]*?<\/nav>/i;
const SIDEBAR_OPEN_RE = /<div\b[^>]*\bid=["']sidebar["'][^>]*>/i;
const THEME_TOGGLE_RE = /<button\b[^>]*\bid=["']themeToggle["'][^>]*>[\s\S]*?<\/button>/i;
const PROFILE_SECTION_RE = /<div\b[^>]*\bclass=["'][^"']*\bsidebar-section-profile\b[^"']*["'][^>]*>/i;
// تعليق اختياري كيسبق الزر مباشرة فالتولبار، بحال:
// <!-- زر تبديل الوضع (Dark/Light) -->
const PRECEDING_COMMENT_RE = /(?:[ \t]*<!--[^>]*-->[ \t]*\r?\n?)?[ \t]*$/;

function hasThemeInitSomewhere(html) {
    // مباشرة فالصفحة (inline) أو عبر shared-inline.js
    return html.includes("localStorage.getItem('xpert-theme')")
        || html.includes('localStorage.getItem("xpert-theme")')
        || html.includes('shared-inline.js');
}

// ---------------------------------------------------------------
// 3) المعالجة ديال ملف وحد
// ---------------------------------------------------------------
function processFile(filePath) {
    const relParts = path.relative(ROOT, filePath).split(path.sep);
    if (relParts.some(p => SKIP_DIR_NAMES.has(p))) {
        return; // templates/partials - تجاوز بصمت
    }

    filesScanned++;
    const original = fs.readFileSync(filePath, 'utf8');
    const rel = path.relative(ROOT, filePath);

    const navbarMatch = original.match(NAVBAR_RE);
    const sidebarOpenMatch = original.match(SIDEBAR_OPEN_RE);

    // صفحة بلا navbar+sidebar كاملين (بحال partial ماكانش فمجلد معروف) → تجاوز
    if (!navbarMatch || !sidebarOpenMatch) {
        filesSkippedNoStructure++;
        return;
    }

    const sidebarOpenIndex = original.indexOf(sidebarOpenMatch[0]);
    let html = original;
    let changed = false;

    // -- 3.1: كل مرات الزر اللي كاينين قبل السايدبار (فالتولبار) --
    const allThemeButtons = [...html.matchAll(new RegExp(THEME_TOGGLE_RE.source, 'gi'))];
    const inToolbar = allThemeButtons.filter(m => m.index < sidebarOpenIndex);
    const inSidebar = allThemeButtons.filter(m => m.index >= sidebarOpenIndex);

    let buttonMarkup = null;

    if (inToolbar.length > 0) {
        // ناخذو النسخة الأصلية ديال الزر (بنفس التنسيق ديال الملف) باش نستعملوها فالسايدبار
        buttonMarkup = inToolbar[0][0];

        // كنمسحو كل نسخ الزر اللي فالتولبار (نادر يكون فيها كثر من وحدة، احتياط فقط)
        // من الأبعد للأقرب باش الـ indices مايتبدلوش
        for (let i = inToolbar.length - 1; i >= 0; i--) {
            const m = inToolbar[i];
            const start = m.index;
            let end = m.index + m[0].length;

            // كنمسحو معاه التعليق اللي قبلو مباشرة إلا كان كاين (بحال
            // <!-- زر تبديل الوضع (Dark/Light) -->)
            const before = html.slice(0, start);
            const commentMatch = before.match(PRECEDING_COMMENT_RE);
            const cutStart = commentMatch ? start - commentMatch[0].length : start;

            // كنمسحو سطر خاوي وحد اللي كيبقى وراه (تنظيف بسيط، بلا ماتأثر
            // على باقي الملف)
            const blankLineAfter = html.slice(end).match(/^[ \t]*\r?\n/);
            if (blankLineAfter) end += blankLineAfter[0].length;

            html = html.slice(0, cutStart) + html.slice(end);
        }
        changed = true;
    }

    // -- 3.2: تأكد بلي الزر كاين فالسايدبار (فـ sidebar-section-profile) --
    const profileMatch = html.match(PROFILE_SECTION_RE);

    if (buttonMarkup && profileMatch) {
        // كنداخلو الزر مباشرة من بعد فتح div.sidebar-section-profile،
        // فسطر وحدو جديد (كيخدم بحال فالنمط المسطّح وبحال فالنمط بمسافات)
        const insertAt = html.indexOf(profileMatch[0]) + profileMatch[0].length;
        const before = html.slice(0, insertAt);
        const after = html.slice(insertAt);
        html = before + '\n' + buttonMarkup + after;
        changed = true;
    } else if (buttonMarkup && !profileMatch) {
        // ماكاينة حتى sidebar-section-profile - نبلغو بلا نخترعو بنية
        flaggedList.push({ rel, reason: 'الزر تقلع من التولبار ولكن مالقيتش .sidebar-section-profile باش ندخلو فيها (خاصها تصليح يدوي)' });
        filesFlaggedMissingButton++;
        // نرجعو الملف الأصلي بلا تعديل باش مانخسروش الزر
        html = original;
        changed = false;
    } else if (allThemeButtons.length === 0) {
        // ماكاين حتى زر - نبلغو
        flaggedList.push({ rel, reason: 'ماكاين حتى زر #themeToggle فهاد الصفحة (لا فالتولبار لا فالسايدبار)' });
        filesFlaggedMissingButton++;
    }

    // -- 3.3: تأكد من وجود آلية theme-init (localStorage) --
    if (!hasThemeInitSomewhere(html)) {
        flaggedList.push({ rel, reason: 'ماكاينش سكريبت theme-init (لا مباشرة ولا عبر shared-inline.js) - الثيم غادي مايتطبقش صحيح عند فتح هاد الصفحة' });
        filesFlaggedMissingThemeInit++;
    }

    if (changed) {
        filesChanged++;
        changedList.push(rel);
        if (!DRY_RUN) {
            fs.writeFileSync(filePath, html, 'utf8');
        }
    } else if (inSidebar.length > 0 && inToolbar.length === 0) {
        filesAlreadyOk++;
    }
}

// ---------------------------------------------------------------
// التشغيل
// ---------------------------------------------------------------
console.log(`🔎 كنقلب فـ: ${ROOT}${DRY_RUN ? '  (dry-run — بلا كتابة)' : ''}\n`);

const files = walk(ROOT);
files.forEach(processFile);

console.log(`📄 عدد الملفات اللي تفحصات: ${filesScanned}`);
console.log(`⏭️  عدد الملفات المتجاوزة (templates/partials أو بلا navbar+sidebar): ${filesSkippedNoStructure}`);
console.log(`✅ عدد الملفات اللي كانت ديجا صحيحة (الزر فالسايدبار): ${filesAlreadyOk}`);
console.log(`✏️  عدد الملفات اللي تبدلات (الزر تنقل للسايدبار): ${filesChanged}\n`);

if (changedList.length) {
    console.log('---- الملفات اللي تبدلات ----');
    changedList.forEach(rel => console.log(`  - ${rel}`));
    console.log('');
}

if (flaggedList.length) {
    console.log(`⚠️  عدد التنبيهات اللي خاصها مراجعة يدوية: ${flaggedList.length}`);
    console.log('---- تفاصيل التنبيهات ----');
    flaggedList.forEach(({ rel, reason }) => console.log(`  - ${rel}\n      → ${reason}`));
    console.log('');
}

if (DRY_RUN) {
    console.log('ℹ️  هادي كانت معاينة (dry-run) فقط - حيت تعاود تشغل بلا --dry-run باش تتكتب التعديلات فعلا.');
}

