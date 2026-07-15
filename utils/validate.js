#!/usr/bin/env node
/**
 * validate.js
 * فحص آلي شامل للموقع قبل كل نشر (deploy)
 * كيتشيك على: تكرار </html>، أقواس CSS، أخطاء JS، الروابط المكسورة
 *
 * الاستخدام: node utils/validate.js
 * كود الخروج: 0 = كلشي نظيف، 1 = كاين أخطاء (يقدر يوقف CI/CD)
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
let errorCount = 0;
let warnCount = 0;

function error(msg) {
    console.log(`❌ ${msg}`);
    errorCount++;
}
function warn(msg) {
    console.log(`⚠️  ${msg}`);
    warnCount++;
}
function ok(msg) {
    console.log(`✅ ${msg}`);
}

function walk(dir, ext, fileList = [], skipDirs = []) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        if (skipDirs.includes(entry.name)) continue;
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            walk(fullPath, ext, fileList, skipDirs);
        } else if (entry.name.endsWith(ext)) {
            fileList.push(fullPath);
        }
    }
    return fileList;
}

// ============================================================
// 1. فحص تكرار المحتوى فملفات HTML (</html> مكرر، EOF متسرب)
// ============================================================
function checkHtmlDuplication() {
    console.log('\n--- 1) فحص التكرار/الملفات المشوهة (HTML) ---');
    const htmlFiles = walk(path.join(ROOT), '.html', [], ['node_modules', '.git']);
    let clean = true;
    for (const fp of htmlFiles) {
        const rel = path.relative(ROOT, fp);
        const content = fs.readFileSync(fp, 'utf-8');
        const htmlCloseCount = (content.match(/<\/html>/g) || []).length;
        if (htmlCloseCount > 1) {
            error(`${rel}: يحتوي على ${htmlCloseCount} علامات </html> (خاصو يكون واحدة فقط - محتوى مكرر)`);
            clean = false;
        }
        if (/^EOF$/m.test(content)) {
            error(`${rel}: كلمة "EOF" متسربة فالملف (بقية من سكريبت bash)`);
            clean = false;
        }
        // فحص <script> فارغة/مكسورة (مثل <script>});</script>)
        const brokenScript = /<script>\s*[\}\);\s]{1,15}\s*<\/script>/.exec(content);
        if (brokenScript && brokenScript[0].replace(/[\s<>\/script]/g, '').length > 0) {
            error(`${rel}: script block مشبوه/مكسور: ${JSON.stringify(brokenScript[0])}`);
            clean = false;
        }
    }
    if (clean) ok(`${htmlFiles.length} ملف HTML - بلا تكرار أو محتوى مشوه`);
}

// ============================================================
// 2. فحص توازن الأقواس فملفات CSS
// ============================================================
function checkCssBalance() {
    console.log('\n--- 2) فحص توازن الأقواس (CSS) ---');
    const cssFiles = walk(path.join(ROOT, 'assets', 'css'), '.css');
    let clean = true;
    for (const fp of cssFiles) {
        const rel = path.relative(ROOT, fp);
        const content = fs.readFileSync(fp, 'utf-8');
        const open = (content.match(/{/g) || []).length;
        const close = (content.match(/}/g) || []).length;
        if (open !== close) {
            error(`${rel}: أقواس غير متوازنة ({ = ${open}, } = ${close})`);
            clean = false;
        }
        // فحص أسطر يتيمة مشبوهة (بقايا truncation)
        const orphanLine = /^\s*[a-z]{1,10};\s*$/m.exec(content);
        if (orphanLine) {
            warn(`${rel}: سطر مشبوه يبان بقية من قاعدة CSS مقطوعة: ${JSON.stringify(orphanLine[0].trim())}`);
        }
    }
    if (clean) ok(`${cssFiles.length} ملف CSS - الأقواس متوازنة`);
}

// ============================================================
// 3. فحص أخطاء Syntax فكل <script> (JS) داخل صفحات HTML
// ============================================================
function checkInlineScripts() {
    console.log('\n--- 3) فحص أخطاء JavaScript (inline + خارجية) ---');
    const htmlFiles = walk(path.join(ROOT), '.html', [], ['node_modules', '.git']);
    const scriptTagPattern = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
    let clean = true;
    let checkedCount = 0;

    for (const fp of htmlFiles) {
        const rel = path.relative(ROOT, fp);
        const content = fs.readFileSync(fp, 'utf-8');
        let m;
        while ((m = scriptTagPattern.exec(content)) !== null) {
            const attrs = m[1];
            const body = m[2];
            if (/type\s*=\s*["']application\/ld\+json["']/i.test(attrs)) continue; // JSON-LD ماشي JS
            if (/\bsrc\s*=/.test(attrs)) continue; // سكريبت خارجي، كيتفحص وحدو
            if (!body.trim()) continue;
            checkedCount++;
            try {
                new vm.Script(body, { filename: rel });
            } catch (e) {
                error(`${rel}: خطأ JS داخل <script>: ${e.message}`);
                clean = false;
            }
        }
    }

    // الملفات الخارجية (.js)
    const jsFiles = [
        ...walk(path.join(ROOT, 'assets', 'js'), '.js'),
        ...walk(path.join(ROOT, 'data'), '.js'),
        ...walk(path.join(ROOT, 'utils'), '.js'),
        path.join(ROOT, 'sw.js'),
    ].filter(fs.existsSync);

    for (const fp of jsFiles) {
        const rel = path.relative(ROOT, fp);
        const content = fs.readFileSync(fp, 'utf-8');
        checkedCount++;
        try {
            new vm.Script(content, { filename: rel });
        } catch (e) {
            error(`${rel}: خطأ JS: ${e.message}`);
            clean = false;
        }
    }

    if (clean) ok(`${checkedCount} كتلة JS (inline + خارجية) - بلا أخطاء syntax`);
}

// ============================================================
// 4. فحص الروابط الداخلية المكسورة (href/src)
// ============================================================
function checkBrokenLinks() {
    console.log('\n--- 4) فحص الروابط الداخلية المكسورة ---');
    const htmlFiles = walk(path.join(ROOT), '.html', [], ['node_modules', '.git', 'templates', 'partials']);
    const linkPattern = /(?:href|src)="([^"]+)"/g;
    let clean = true;
    let checkedCount = 0;

    for (const fp of htmlFiles) {
        const rel = path.relative(ROOT, fp);
        const baseDir = path.dirname(fp);
        const content = fs.readFileSync(fp, 'utf-8');
        let m;
        while ((m = linkPattern.exec(content)) !== null) {
            let url = m[1];
            if (/^(https?:|mailto:|tel:|#|javascript:|data:)/.test(url)) continue;
            url = url.split('?')[0].split('#')[0];
            if (!url) continue;
            checkedCount++;
            const target = path.normalize(path.join(baseDir, decodeURIComponent(url)));
            if (!fs.existsSync(target)) {
                error(`${rel}: رابط مكسور "${url}" → ${path.relative(ROOT, target)} غير موجود`);
                clean = false;
            }
        }
    }
    if (clean) ok(`${checkedCount} رابط داخلي - كلهم شغالين`);
}

// ============================================================
// 5. فحص صحة JSON (manifest.json, data/*.json)
// ============================================================
function checkJsonFiles() {
    console.log('\n--- 5) فحص صحة ملفات JSON ---');
    const jsonFiles = [
        path.join(ROOT, 'manifest.json'),
        ...walk(path.join(ROOT, 'data'), '.json'),
    ].filter(fs.existsSync);
    let clean = true;
    for (const fp of jsonFiles) {
        const rel = path.relative(ROOT, fp);
        try {
            JSON.parse(fs.readFileSync(fp, 'utf-8'));
        } catch (e) {
            error(`${rel}: JSON غير صحيح: ${e.message}`);
            clean = false;
        }
    }
    if (clean) ok(`${jsonFiles.length} ملف JSON - صحيحين`);

    // ====== أيقونات manifest.json خاصهم يكونوا موجودين فعلياً ======
    const manifestPath = path.join(ROOT, 'manifest.json');
    if (fs.existsSync(manifestPath)) {
        try {
            const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
            for (const icon of (manifest.icons || [])) {
                const iconPath = path.join(ROOT, icon.src);
                if (!fs.existsSync(iconPath)) {
                    error(`manifest.json: أيقونة "${icon.src}" غير موجودة`);
                    clean = false;
                }
            }
        } catch (e) { /* الخطأ تلقط ديجا فوق */ }
    }
}

// ============================================================
// 6. فحص "drift": صفحات ماشي محدّثة بآخر نسخة ديال partials/
//    (خاصك تشغل node utils/build.js قبل النشر إلا طلع تحذير هنا)
// ============================================================
function checkPartialsDrift() {
    console.log('\n--- 6) فحص التوافق مع partials/ (build.js) ---');
    const partialsDir = path.join(ROOT, 'partials');
    if (!fs.existsSync(partialsDir)) {
        warn('مجلد partials/ ماكاينش - تخطيت هاد الفحص');
        return;
    }
    const navbarTpl = fs.readFileSync(path.join(partialsDir, 'navbar.html'), 'utf-8').trim();
    const footerTpl = fs.readFileSync(path.join(partialsDir, 'footer.html'), 'utf-8').trim();
    // ⚠️ لازم يطابق بالضبط نفس الحدود اللي كيستعملها utils/build.js
    // (نفس NAVBAR_RE) - navbar.html فيه <nav class="navbar"> رئيسي
    // ومن بعد <nav class="sidebar-nav"> منفصل + sidebarOverlay، فخاص
    // الفحص يمسك البلوك الكامل ماشي غير أول </nav> - وإلا كايقارن جزء
    // بكامل الملف وكيعطي تحذير كاذب حتى ولو build.js خدم صحيح.
    const NAVBAR_RE = /<nav class="navbar"[\s\S]*?<div id="sidebarOverlay" class="sidebar-overlay"><\/div>/;
    const FOOTER_RE = /<footer class="footer"[^>]*>[\s\S]*?<\/footer>/;

    function getBase(fp) {
        const rel = path.relative(ROOT, path.dirname(fp));
        if (!rel) return '';
        return '../'.repeat(rel.split(path.sep).length);
    }
    function render(tpl, base) {
        return tpl.split('{{BASE}}').join(base);
    }

    const htmlFiles = walk(ROOT, '.html', [], ['node_modules', '.git', 'partials', 'templates']);
    let driftCount = 0;
    for (const fp of htmlFiles) {
        const rel = path.relative(ROOT, fp);
        const content = fs.readFileSync(fp, 'utf-8');
        const base = getBase(fp);
        const navMatch = content.match(NAVBAR_RE);
        if (navMatch && navMatch[0] !== render(navbarTpl, base)) {
            warn(`${rel}: navbar ماشي متوافق مع partials/navbar.html - شغّل node utils/build.js`);
            driftCount++;
        }
        const footMatch = content.match(FOOTER_RE);
        if (footMatch && footMatch[0] !== render(footerTpl, base)) {
            warn(`${rel}: footer ماشي متوافق مع partials/footer.html - شغّل node utils/build.js`);
            driftCount++;
        }
    }
    if (driftCount === 0) ok(`${htmlFiles.length} صفحة - كلهم متوافقين مع partials/`);
}

// ============================================================
// 7. فحص الروابط المكسورة جوا data/*.js (حقل file: "...")
//    هاذ الفحص ماشي مشمول فـ checkBrokenLinks() لأن الروابط
//    هنا داخل نصوص JS (string) ماشي href/src فـ HTML.
// ============================================================
function checkDataFileLinks() {
    console.log('\n--- 7) فحص الروابط المكسورة فـ data/*.js ---');
    const dataDir = path.join(ROOT, 'data');
    if (!fs.existsSync(dataDir)) {
        warn('مجلد data/ ماكاينش - تخطيت هاد الفحص');
        return;
    }
    const dataFiles = walk(dataDir, '.js');
    let clean = true;
    let checkedCount = 0;

    for (const fp of dataFiles) {
        const rel = path.relative(ROOT, fp);
        const content = fs.readFileSync(fp, 'utf-8');
        const fileRefPattern = /file:\s*"([^"]+)"/g;
        let m;
        while ((m = fileRefPattern.exec(content)) !== null) {
            const refPath = m[1];
            checkedCount++;
            const target = path.join(ROOT, refPath);
            if (!fs.existsSync(target)) {
                error(`${rel}: رابط مكسور "${refPath}" غير موجود على القرص`);
                clean = false;
            }
        }
    }
    if (clean) ok(`${checkedCount} رابط فـ data/*.js - كلهم شغالين`);
}

// ============================================================
// تشغيل الفحوصات كاملة
// ============================================================
console.log('🔍 بدء الفحص الشامل للموقع قبل النشر...');

checkHtmlDuplication();
checkCssBalance();
checkInlineScripts();
checkBrokenLinks();
checkJsonFiles();
checkPartialsDrift();
checkDataFileLinks();

console.log('\n' + '='.repeat(60));
if (errorCount === 0) {
    console.log(`✅ الفحص كامل: 0 أخطاء${warnCount ? `, ${warnCount} تحذير(ات)` : ''}. الموقع جاهز للنشر.`);
    process.exit(0);
} else {
    console.log(`❌ الفحص كامل: ${errorCount} خطأ/أخطاء، ${warnCount} تحذير(ات). خاصك تصلحهم قبل النشر.`);
    process.exit(1);
}
