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
    const htmlFiles = walk(path.join(ROOT), '.html', [], ['node_modules', '.git', 'templates']);
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

console.log('\n' + '='.repeat(60));
if (errorCount === 0) {
    console.log(`✅ الفحص كامل: 0 أخطاء${warnCount ? `, ${warnCount} تحذير(ات)` : ''}. الموقع جاهز للنشر.`);
    process.exit(0);
} else {
    console.log(`❌ الفحص كامل: ${errorCount} خطأ/أخطاء، ${warnCount} تحذير(ات). خاصك تصلحهم قبل النشر.`);
    process.exit(1);
}
