#!/usr/bin/env node
/**
 * build.js
 * أداة البناء المركزية: كتحقن الأجزاء المشتركة (navbar, footer, décor)
 * فكل صفحات الموقع انطلاقاً من partials/ بدل ما تكون مكررة يدوياً فكل ملف.
 *
 * كيفاش خدام:
 * - partials/navbar.html      → {{BASE}}
 * - partials/footer.html      → (بلا متغيرات)
 * - partials/decor.html       → {{BASE}}, {{ACCENT}}, {{ACCENT_LIGHT}}
 * - partials/decor-root.html  → (بلا متغيرات - décor multicolore ثابت)
 *
 * الاستخدام: node utils/build.js
 * خاصك تشغلها من بعد أي تعديل فـ partials/ أو من بعد ما تزيد صفحة جديدة،
 * وقبل كل نشر (deploy) - بحال validate.js بالضبط.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PARTIALS_DIR = path.join(ROOT, 'partials');
const SKIP_DIRS = ['node_modules', '.git', 'partials', 'templates'];

// ====== الملفات المستثناة من المعالجة ======
// هاد الملفات ما كيتغيروش بواسطة build.js (كيتحافظو على محتواهم)
const SKIP_FILES = [
    'calendrier.html',  // صفحة التقويم - محتواها ثابت
    'sitemap.xml',      // خريطة الموقع
    'manifest.json',    // ملف الـ PWA
    'sw.js',            // Service Worker
    'robots.txt',       // ملف الروبوتات
];

// ألوان كل مادة (نفس الألوان اللي كانت مستعملة يدوياً من قبل)
const SUBJECT_COLORS = {
    math: { accent: '#4ECDC4', accentLight: '#66FCF1' },
    physique: { accent: '#FF6B6B', accentLight: '#FF8A8A' },
    chimie: { accent: '#F4D03F', accentLight: '#F7DC6F' },
};

function loadPartial(name) {
    return fs.readFileSync(path.join(PARTIALS_DIR, name), 'utf-8');
}

const navbarTpl = loadPartial('navbar.html');
const footerTpl = loadPartial('footer.html');
const decorTpl = loadPartial('decor.html');
const decorRootTpl = loadPartial('decor-root.html');

function render(tpl, vars) {
    let out = tpl;
    for (const [key, value] of Object.entries(vars)) {
        out = out.split(`{{${key}}}`).join(value);
    }
    return out.trim();
}

function walk(dir, fileList = []) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (SKIP_DIRS.includes(entry.name)) continue;
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            walk(full, fileList);
        } else if (entry.name.endsWith('.html')) {
            // استثناء الملفات المحددة
            if (!SKIP_FILES.includes(entry.name)) {
                fileList.push(full);
            }
        }
    }
    return fileList;
}

function getBase(filePath) {
    const rel = path.relative(ROOT, path.dirname(filePath));
    if (!rel) return '';
    const depth = rel.split(path.sep).length;
    return '../'.repeat(depth);
}

function getSubject(filePath) {
    const rel = path.relative(ROOT, filePath).split(path.sep);
    if (rel[0] === 'content' && rel[1]) return rel[1];
    return null;
}

// النافبار + Sidebar: كاين حالتين ممكنين فالصفحات:
//
// 1) صفحة "مهاجرة" ديجا للتصميم الجديد (فيها نسخة كاملة أو مكررة من
//    navbar+sidebar+sidebarOverlay): كنستعملو pattern greedy من <nav>
//    حتى آخر نسخة موجودة من sidebarOverlay - باش يبلع أي نسخ مكررة
//    متراكمة (بق قديم كان كيخلي النسخ القديمة ماكيتبدلوش) ويخلي غير
//    نسخة واحدة نظيفة.
// 2) صفحة "قديمة" مازال ماهاجرتش (فيها غير <nav class="navbar">...</nav>
//    بسيط، بلا sidebar/sidebarOverlay أصلا): الـ pattern الأول ماغاديش
//    يطابق (العلامة sidebarOverlay مكاينة فالصفحة أصلا)، فكنرجعو
//    لـ pattern لازي بسيط كيمسك غير <nav>...</nav> الأولانية.
const NAVBAR_NEW_RE = /<nav class="navbar"[\s\S]*?<div id="sidebarOverlay" class="sidebar-overlay"><\/div>/;
const NAVBAR_OLD_RE = /<nav class="navbar"[\s\S]*?<\/nav>/;

function matchNavbarRe(content) {
    if (NAVBAR_NEW_RE.test(content)) return NAVBAR_NEW_RE;
    if (NAVBAR_OLD_RE.test(content)) return NAVBAR_OLD_RE;
    return null;
}

// الفوتر
const FOOTER_RE = /<footer class="footer"[^>]*>[\s\S]*?<\/footer>/;

// الديكور (صفحات المحتوى): من التعليق أو overlay-protection حتى آخر glow-orb-2
const DECOR_RE = /(?:<!-- ====== طبقة الحماية[\s\S]*?-->\s*)?<div class="overlay-protection"[\s\S]*?<div class="glow-orb glow-orb-2"><\/div>/;

// الديكور (الصفحات الجذرية - multicolore): من التعليق أو overlay-protection
// حتى آخر geo-pattern-4 (ماشي glow-orb، حيت الصفحات الجذرية عندها
// progress-bar/bg-grid/glow-orb خاصين بيها بعد الـdécor، ماشي جزء منو)
const ROOT_DECOR_RE = /(?:<!-- ====== طبقة الحماية[\s\S]*?-->\s*)?<div class="overlay-protection"[\s\S]*?<div class="geo-pattern geo-pattern-4"[^>]*>[\s\S]*?<\/div>/;

let updated = 0;
let skipped = 0;
let skippedFiles = [];

// ============================================================
// تشغيل البناء
// ============================================================

console.log('🔨 بدء بناء الموقع...\n');

console.log('📄 تحديث صفحات HTML...');

for (const file of walk(ROOT)) {
    const rel = path.relative(ROOT, file);
    // الصفحات الجذرية: navbar + footer غير (décor خاص بيهم، ماشي مشمول)
    const isRoot = !rel.includes(path.sep);
    let content = fs.readFileSync(file, 'utf-8');
    const base = getBase(file);
    let changed = false;

    const navRe = matchNavbarRe(content);
    if (navRe) {
        content = content.replace(navRe, render(navbarTpl, { BASE: base }));
        changed = true;
    }
    if (FOOTER_RE.test(content)) {
        content = content.replace(FOOTER_RE, render(footerTpl, { BASE: base }));
        changed = true;
    }
    if (!isRoot && DECOR_RE.test(content)) {
        const subject = getSubject(file);
        const colors = SUBJECT_COLORS[subject] || SUBJECT_COLORS.math;
        content = content.replace(
            DECOR_RE,
            render(decorTpl, { BASE: base, ACCENT: colors.accent, ACCENT_LIGHT: colors.accentLight })
        );
        changed = true;
    }
    if (isRoot && ROOT_DECOR_RE.test(content)) {
        content = content.replace(ROOT_DECOR_RE, decorRootTpl.trim());
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(file, content);
        updated++;
        console.log(`   ✅ ${path.basename(file)} - تم التحديث`);
    } else {
        skipped++;
        if (!SKIP_FILES.includes(path.basename(file))) {
            console.log(`   ⏭️ ${path.basename(file)} - لا تغيير`);
        }
    }
}

// عرض الملفات المستثناة
console.log('\n📋 الملفات المستثناة من المعالجة:');
SKIP_FILES.forEach(f => console.log(`   ⏭️ ${f}`));

console.log(`\n✅ build.js: ${updated} صفحة تحدّثت من partials/, ${skipped} صفحة ما فيهاش تغيير.`);

// ============================================================
// تحديث تلقائي لرقم نسخة الكاش فـ sw.js (cache busting)
// ============================================================
const crypto = require('crypto');

function computeSiteHash() {
    const filesToHash = [
        'index.html', 'subjects.html', 'subject.html',
        'assets/css/style.css', 'assets/css/lesson-common.css', 'assets/css/global-control.css',
        'assets/css/root-decor.css',
        'assets/js/script.js', 'assets/js/protection.js',
        'partials/navbar.html', 'partials/footer.html', 'partials/decor.html', 'partials/decor-root.html',
    ];
    const hash = crypto.createHash('sha256');
    for (const f of filesToHash) {
        const fp = path.join(ROOT, f);
        if (fs.existsSync(fp)) hash.update(fs.readFileSync(fp));
    }
    return hash.digest('hex').slice(0, 8);
}

const swPath = path.join(ROOT, 'sw.js');
if (fs.existsSync(swPath)) {
    let swContent = fs.readFileSync(swPath, 'utf-8');
    const newVersion = `xpert-${computeSiteHash()}`;
    const before = swContent;
    swContent = swContent.replace(/const CACHE_NAME = '[^']*';/, `const CACHE_NAME = '${newVersion}';`);
    if (swContent !== before) {
        fs.writeFileSync(swPath, swContent);
        console.log(`✅ sw.js: CACHE_NAME تحدّث تلقائياً إلى '${newVersion}'`);
    }
}

console.log('\n✅ البناء انتهى بنجاح!');
console.log('💡 تذكّر: شغّل node utils/validate.js للتحقق من صحة الملفات قبل النشر.');
