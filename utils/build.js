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

let updated = 0;
let skipped = 0;

// ============================================================
// معالجة ملفات CSS و JS لإضافة أكواد الـ Sidebar
// ============================================================
function injectSidebarAssets() {
    console.log('\n📦 حقن أكواد الـ Sidebar في الملفات...');

    // ====== 1. إضافة CSS إلى style.css ======
    const cssPath = path.join(ROOT, 'assets', 'css', 'style.css');
    if (fs.existsSync(cssPath)) {
        let cssContent = fs.readFileSync(cssPath, 'utf-8');
        
        // التحقق إذا كان الكود مضافاً مسبقاً
        if (!cssContent.includes('/* ====== SIDEBAR ====== */')) {
            const sidebarCSS = `

/* ============================================================
   SIDEBAR - القائمة الجانبية
   ============================================================ */

/* ====== Menu Toggle ====== */
.menu-toggle {
    font-size: 1.5rem;
    color: var(--text-primary);
    cursor: pointer;
    padding: 6px 10px;
    transition: color 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}
.menu-toggle:hover {
    color: var(--accent-light);
}

/* ====== Sidebar ====== */
.sidebar {
    position: fixed;
    top: 0;
    left: -300px;
    width: 290px;
    height: 100%;
    background: var(--bg-card);
    border-right: 1px solid var(--border);
    box-shadow: 4px 0 30px rgba(0, 0, 0, 0.4);
    transition: left 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 10000;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
}
.sidebar.open {
    left: 0;
}

.sidebar::-webkit-scrollbar {
    width: 4px;
}
.sidebar::-webkit-scrollbar-track {
    background: var(--bg-primary);
}
.sidebar::-webkit-scrollbar-thumb {
    background: var(--border);
    border-radius: 4px;
}

/* ====== Sidebar Header ====== */
.sidebar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 18px 22px;
    border-bottom: 1px solid var(--border);
    background: var(--bg-primary);
    flex-shrink: 0;
}
.sidebar-logo {
    font-size: 1.3rem;
    font-weight: 900;
    color: var(--accent-light);
    font-family: var(--font-main);
    letter-spacing: 0.5px;
}
.sidebar-logo span {
    color: var(--text-primary);
}
.sidebar-close {
    background: none;
    border: none;
    color: var(--text-muted);
    font-size: 2rem;
    cursor: pointer;
    line-height: 1;
    transition: color 0.2s ease, transform 0.2s ease;
    padding: 0 6px;
}
.sidebar-close:hover {
    color: var(--text-primary);
    transform: rotate(90deg);
}

/* ====== Sidebar Menu ====== */
.sidebar-menu {
    list-style: none;
    padding: 8px 0;
    margin: 0;
    flex: 1;
}
.sidebar-menu li {
    padding: 0;
}
.sidebar-menu li a {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 13px 24px;
    color: var(--text-secondary);
    text-decoration: none;
    font-size: 0.95rem;
    font-weight: 500;
    transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
    border-left: 3px solid transparent;
    border-bottom: 1px solid transparent;
}
.sidebar-menu li a:hover {
    background: rgba(78, 205, 196, 0.06);
    color: var(--text-primary);
    border-left-color: var(--accent);
}
.sidebar-menu li a:active {
    transform: scale(0.97);
}
.sidebar-menu li a i {
    width: 24px;
    text-align: center;
    font-size: 1.1rem;
    color: var(--accent-light);
    flex-shrink: 0;
}
.sidebar-menu li a .fa-house {
    color: #4ECDC4;
}
.sidebar-menu li a .fa-book-open {
    color: #F4D03F;
}
.sidebar-menu li a .fa-calculator {
    color: #4ECDC4;
}
.sidebar-menu li a .fa-atom {
    color: #FF6B6B;
}
.sidebar-menu li a .fa-flask {
    color: #BB8FCE;
}

/* ====== Sidebar Divider ====== */
.sidebar-divider {
    height: 1px;
    background: var(--border);
    margin: 6px 18px;
    flex-shrink: 0;
}

/* ====== Sidebar Footer ====== */
.sidebar-footer {
    padding: 16px 24px;
    border-top: 1px solid var(--border);
    font-size: 0.75rem;
    color: var(--text-muted);
    text-align: center;
    flex-shrink: 0;
}

/* ====== Sidebar Overlay ====== */
.sidebar-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.55);
    z-index: 9999;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.35s ease, visibility 0.35s ease;
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
}
.sidebar-overlay.active {
    opacity: 1;
    visibility: visible;
}

/* ====== Responsive ====== */
@media (max-width: 480px) {
    .sidebar {
        width: 260px;
        left: -270px;
    }
    .sidebar-header {
        padding: 14px 18px;
    }
    .sidebar-logo {
        font-size: 1.1rem;
    }
    .sidebar-menu li a {
        padding: 11px 18px;
        font-size: 0.9rem;
    }
    .sidebar-menu li a i {
        width: 20px;
        font-size: 1rem;
    }
}
`;
            fs.appendFileSync(cssPath, sidebarCSS);
            console.log(`✅ assets/css/style.css: تم إضافة أكواد الـ Sidebar`);
        } else {
            console.log(`➖ assets/css/style.css: الـ Sidebar موجود مسبقاً`);
        }
    }

    // ====== 2. إضافة JavaScript إلى script.js ======
    const jsPath = path.join(ROOT, 'assets', 'js', 'script.js');
    if (fs.existsSync(jsPath)) {
        let jsContent = fs.readFileSync(jsPath, 'utf-8');
        
        // التحقق إذا كان الكود مضافاً مسبقاً
        if (!jsContent.includes('// ====== SIDEBAR ======')) {
            const sidebarJS = `

// ============================================================
// SIDEBAR - القائمة الجانبية
// ============================================================

document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const closeBtn = document.getElementById('sidebarClose');

    // التأكد من وجود العناصر
    if (!menuToggle || !sidebar || !overlay || !closeBtn) return;

    function openSidebar() {
        sidebar.classList.add('open');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeSidebar() {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // فتح القائمة
    menuToggle.addEventListener('click', openSidebar);

    // إغلاق القائمة
    closeBtn.addEventListener('click', closeSidebar);
    overlay.addEventListener('click', closeSidebar);

    // إغلاق عند الضغط على ESC
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeSidebar();
        }
    });

    // إغلاق القائمة عند تغيير حجم النافذة
    let resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            if (window.innerWidth > 768 && sidebar.classList.contains('open')) {
                closeSidebar();
            }
        }, 300);
    });

    // منع إغلاق القائمة عند النقر داخلها
    sidebar.addEventListener('click', function (e) {
        e.stopPropagation();
    });

    // إغلاق القائمة عند النقر على رابط داخلها
    document.querySelectorAll('.sidebar-menu a').forEach(function (link) {
        link.addEventListener('click', function () {
            setTimeout(closeSidebar, 150);
        });
    });

    // ====== تفعيل الرابط النشط ======
    // تحديد المادة الحالية من URL
    const currentUrl = new URL(window.location.href);
    const subjectParam = currentUrl.searchParams.get('subject');
    
    if (subjectParam) {
        document.querySelectorAll('.sidebar-menu a').forEach(function (link) {
            if (link.href.includes('subject=' + subjectParam)) {
                link.style.borderLeftColor = 'var(--accent)';
                link.style.color = 'var(--text-primary)';
                link.style.background = 'rgba(78, 205, 196, 0.06)';
            }
        });
    }

    console.log('✅ Sidebar initialisée');
});
`;
            fs.appendFileSync(jsPath, sidebarJS);
            console.log(`✅ assets/js/script.js: تم إضافة أكواد الـ Sidebar`);
        } else {
            console.log(`➖ assets/js/script.js: الـ Sidebar موجود مسبقاً`);
        }
    }
}

// ============================================================
// تشغيل البناء
// ============================================================

console.log('🔨 بدء بناء الموقع...\n');

// حقن أكواد الـ Sidebar
injectSidebarAssets();

console.log('\n📄 تحديث صفحات HTML...');

for (const file of walk(ROOT)) {
    const rel = path.relative(ROOT, file);
    // الصفحات الجذرية: navbar + footer غير (décor خاص بيهم، ماشي مشمول)
    const isRoot = !rel.includes(path.sep);
    let content = fs.readFileSync(file, 'utf-8');
    const base = getBase(file);
    let changed = false;

    if (NAVBAR_RE.test(content)) {
        content = content.replace(NAVBAR_RE, render(navbarTpl, { BASE: base }));
        changed = true;
    }
    if (FOOTER_RE.test(content)) {
        content = content.replace(FOOTER_RE, render(footerTpl, {}));
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

    if (changed) {
        fs.writeFileSync(file, content);
        updated++;
    } else {
        skipped++;
    }
}

console.log(`✅ build.js: ${updated} صفحة تحدّثت من partials/, ${skipped} صفحة ما فيهاش تغيير.`);

// ============================================================
// تحديث تلقائي لرقم نسخة الكاش فـ sw.js (cache busting)
// بدل ما تكون يدوية (v3, v4...)، كنحسبو hash انطلاقاً من محتوى
// أهم ملفات الموقع - كي تبدل شي حاجة فيهم، الكاش كيتجدد وحدو.
// ============================================================
const crypto = require('crypto');

function computeSiteHash() {
    const filesToHash = [
        'index.html', 'subjects.html', 'subject.html',
        'assets/css/style.css', 'assets/css/lesson-common.css', 'assets/css/global-control.css',
        'assets/js/script.js', 'assets/js/protection.js',
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

console.log('\n✅ البناء انتهى بنجاح!');
console.log('💡 تذكّر: شغّل node utils/validate.js للتحقق من صحة الملفات قبل النشر.');