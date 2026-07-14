#!/usr/bin/env node
/**
 * build.js
 * أداة البناء المركزية: كتحقن الأجزاء المشتركة (navbar, footer, décor)
 * فكل صفحات الموقع انطلاقاً من partials/ بدل ما تكون مكررة يدوياً فكل ملف.
 *
 * كيفاش خدام:
 * - partials/navbar.html   → {{BASE}}
 * - partials/footer.html   → (بلا متغيرات)
 * - partials/decor.html    → {{BASE}}, {{ACCENT}}, {{ACCENT_LIGHT}}
 *
 * الاستخدام: node utils/build.js
 * خاصك تشغلها من بعد أي تعديل فـ partials/ أو من بعد ما تزيد صفحة جديدة،
 * وقبل كل نشر (deploy) - بحال validate.js بالضبط.
 *
 * ⚠️ الصفحات الجذرية (index.html, subject.html, subjects.html) عندها
 * décor خاص بيها (multicolore) وماشي مشمولة هنا عمداً - التوحيد كيدير
 * غير للـ navbar و footer ديالها.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PARTIALS_DIR = path.join(ROOT, 'partials');
const SKIP_DIRS = ['node_modules', '.git', 'partials', 'templates'];

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
            fileList.push(full);
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

// النافبار: أول <nav class="navbar" ... </nav>
const NAVBAR_RE = /<nav class="navbar"[\s\S]*?<\/nav>/;
// الفوتر
const FOOTER_RE = /<footer class="footer">[\s\S]*?<\/footer>/;
// الديكور: من التعليق أو overlay-protection حتى آخر glow-orb-2
const DECOR_RE = /(?:<!-- ====== طبقة الحماية[\s\S]*?-->\s*)?<div class="overlay-protection"[\s\S]*?<div class="glow-orb glow-orb-2"><\/div>/;

// ====== إدراج ملفات الـ Sidebar ======
// هذه الأنماط والسكريبتات تضاف في <head> قبل إغلاق </head>
const SIDEBAR_CSS = `<link rel="stylesheet" href="{{BASE}}assets/css/sidebar.css">`;
const SIDEBAR_JS = `<script src="{{BASE}}assets/js/sidebar.js" defer></script>`;

// نبحث عن </head> لإدراج الأنماط، وعن </body> لإدراج السكريبتات
const HEAD_END_RE = /<\/head>/i;
const BODY_END_RE = /<\/body>/i;

// نتأكد من أن الملفات غير مضمنة بالفعل (لتجنب التكرار)
function isSidebarIncluded(content) {
    return content.includes('sidebar.css') || content.includes('sidebar.js');
}

let updated = 0;
let skipped = 0;

for (const file of walk(ROOT)) {
    const rel = path.relative(ROOT, file);
    // الصفحات الجذرية: navbar + footer غير (décor خاص بيهم، ماشي مشمول)
    const isRoot = !rel.includes(path.sep);
    let content = fs.readFileSync(file, 'utf-8');
    const base = getBase(file);
    let changed = false;

    // 1. استبدال الـ navbar
    if (NAVBAR_RE.test(content)) {
        content = content.replace(NAVBAR_RE, render(navbarTpl, { BASE: base }));
        changed = true;
    }

    // 2. استبدال الـ footer
    if (FOOTER_RE.test(content)) {
        content = content.replace(FOOTER_RE, render(footerTpl, {}));
        changed = true;
    }

    // 3. استبدال الـ décor (لغير الصفحات الجذرية)
    if (!isRoot && DECOR_RE.test(content)) {
        const subject = getSubject(file);
        const colors = SUBJECT_COLORS[subject] || SUBJECT_COLORS.math;
        content = content.replace(
            DECOR_RE,
            render(decorTpl, { BASE: base, ACCENT: colors.accent, ACCENT_LIGHT: colors.accentLight })
        );
        changed = true;
    }

    // ====== 4. إدراج الـ Sidebar CSS و JS ======
    // نضيف الأنماط في <head>
    const sidebarCssWithBase = SIDEBAR_CSS.replace(/\{\{BASE\}\}/g, base);
    const sidebarJsWithBase = SIDEBAR_JS.replace(/\{\{BASE\}\}/g, base);

    // إدراج CSS قبل </head> إذا لم يكن موجوداً
    if (!isSidebarIncluded(content) && HEAD_END_RE.test(content)) {
        content = content.replace(HEAD_END_RE, `    ${sidebarCssWithBase}\n${'    '}${HEAD_END_RE.source}`);
        changed = true;
    }

    // إدراج JS قبل </body> إذا لم يكن موجوداً
    // نبحث عن مكان مناسب قبل </body>، ونتأكد من عدم وجوده
    if (!isSidebarIncluded(content) && BODY_END_RE.test(content)) {
        // نضع السكريبتات قبل </body> بمسافة مناسبة
        content = content.replace(BODY_END_RE, `    ${sidebarJsWithBase}\n${'    '}${BODY_END_RE.source}`);
        changed = true;
    }

    // 5. حفظ الملف إذا تغير
    if (changed) {
        fs.writeFileSync(file, content);
        updated++;
    } else {
        skipped++;
    }
}

console.log(`✅ build.js: ${updated} صفحة تحدّثت من partials/ و sidebar/, ${skipped} صفحة ما فيهاش تغيير.`);

// ============================================================
// تحديث تلقائي لرقم نسخة الكاش فـ sw.js (cache busting)
// ============================================================
const crypto = require('crypto');

function computeSiteHash() {
    const filesToHash = [
        'index.html', 'subjects.html', 'subject.html',
        'assets/css/style.css', 'assets/css/lesson-common.css', 'assets/css/global-control.css',
        'assets/css/sidebar.css', // نضيف ملف sidebar.css للتحديث
        'assets/js/script.js', 'assets/js/protection.js',
        'assets/js/sidebar.js', // نضيف ملف sidebar.js للتحديث
        'partials/navbar.html', 'partials/footer.html', 'partials/decor.html',
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