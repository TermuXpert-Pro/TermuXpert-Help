#!/usr/bin/env node
/**
 * apply-pwa-btn-patch.js
 * ------------------------------------------------------------
 * كيحل المشكلة: زر "تثبيت التطبيق" كان مكتوب يدوياً فـ5 صفحات غير
 * (about/installation/terms/support/calendrier) بدل ما يكون فـpartials/
 * navbar.html، فـbuild.js كان كيمسحو من الصفحات الأخرى (108+ index.html،
 * subject.html، subjects.html، وكل صفحات content/) فكل مرة كيبني الموقع.
 *
 * هاد السكريبت كيدير 3 حوايج:
 * 1) كيزيد الزر مرة وحدة فـ partials/navbar.html → build.js من بعد
 *    غايحقنو أوتوماتيكياً فـ *كل* الصفحات (240+).
 * 2) كيزيد الـCSS ديالو فـ assets/css/style.css (اللي محملة فكل صفحة)
 *    والـJS ديالو (deferredPrompt, beforeinstallprompt...) فـ
 *    assets/js/script.js (محملة فكل صفحة) - عوض ما تكون مكررة.
 * 3) كينضف النسخ اليدوية المكررة (CSS + <script>) من الصفحات الخمسة،
 *    وكيزيد فـinstallation.html زر تحميل حقيقي كبير كيستدعي نفس منطق
 *    التثبيت (window.XpertPWAInstall).
 *
 * الاستخدام: node utils/apply-pwa-btn-patch.js
 * من بعد: node utils/build.js && node utils/inject-pwa-head.js &&
 *          node utils/generate-sitemap.js && node utils/validate.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

function read(p) { return fs.readFileSync(path.join(ROOT, p), 'utf-8'); }
function write(p, content) { fs.writeFileSync(path.join(ROOT, p), content); }

let report = [];

// ============================================================
// 1) partials/navbar.html - زيادة الزر بين themeToggle و menuToggle
// ============================================================
{
    const p = 'partials/navbar.html';
    let content = read(p);
    if (content.includes('id="pwaInstallBtn"')) {
        report.push(`⏭️  ${p} - الزر موجود ديجا`);
    } else {
        const anchor = `        </button>

        <!-- أيقونة القائمة الجانبية -->`;
        const injected = `        </button>

        <!-- زر تثبيت PWA -->
        <button class="pwa-install-btn" id="pwaInstallBtn" aria-label="ثبّت التطبيق" type="button">
            <i class="fas fa-download" aria-hidden="true"></i>
        </button>

        <!-- أيقونة القائمة الجانبية -->`;
        if (!content.includes(anchor)) throw new Error(`❌ ${p}: ماقدرتش نلقى النقطة المرجعية، تحقق يدوياً`);
        content = content.replace(anchor, injected);
        write(p, content);
        report.push(`✅ ${p} - تزاد الزر`);
    }
}

// ============================================================
// 2) assets/css/style.css - زيادة .pwa-install-btn (نفس ستايل .theme-toggle)
// ============================================================
{
    const p = 'assets/css/style.css';
    let content = read(p);
    if (content.includes('.pwa-install-btn')) {
        report.push(`⏭️  ${p} - CSS ديال الزر موجود ديجا`);
    } else {
        const anchor = `@media (max-width: 480px) {
    .theme-toggle { width: 38px; height: 38px; border-radius: 10px; font-size: 14px; }
}`;
        const injected = `${anchor}

/* ====== PWA Install Button (مركزي - نفس ستايل .theme-toggle) ====== */
.pwa-install-btn {
    display: none;
    width: 44px;
    height: 44px;
    background: rgba(var(--overlay-rgb), 0.04);
    border: 1px solid rgba(var(--overlay-rgb), 0.06);
    border-radius: 12px;
    cursor: pointer;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    flex-shrink: 0;
    padding: 0;
    color: var(--gold-text);
    font-size: 16px;
    margin-inline-end: 6px;
}
.pwa-install-btn.show { display: flex; }
.pwa-install-btn:hover {
    background: rgba(244, 208, 63, 0.1);
    border-color: rgba(244, 208, 63, 0.25);
}
.pwa-install-btn:active { transform: scale(0.92); }
@media (max-width: 480px) {
    .pwa-install-btn { width: 38px; height: 38px; border-radius: 10px; font-size: 14px; }
}`;
        if (!content.includes(anchor)) throw new Error(`❌ ${p}: ماقدرتش نلقى النقطة المرجعية، تحقق يدوياً`);
        content = content.replace(anchor, injected);
        write(p, content);
        report.push(`✅ ${p} - تزاد CSS`);
    }
}

// ============================================================
// 3) assets/js/script.js - زيادة منطق التثبيت المركزي
// ============================================================
{
    const p = 'assets/js/script.js';
    let content = read(p);
    if (content.includes('XpertPWAInstall')) {
        report.push(`⏭️  ${p} - JS ديال الزر موجود ديجا`);
    } else {
        const anchor = `    window.addEventListener('load', function() {
        navigator.serviceWorker.register(swUrl, { scope: base })
            .then(function(reg) { console.log('✅ Service Worker enregistré'); })
            .catch(function(err) { console.log('❌ Service Worker échoué:', err); });
    });
})();`;
        const injected = `${anchor}

// ============================================================
// PWA INSTALL BUTTON (مركزي - كيخدم فكل الصفحات، بلا تكرار)
// window.XpertPWAInstall() معروضة عالمياً باش أي زر آخر (بحال
// الزر الكبير فـ installation.html) يقدر يستدعيها.
// ============================================================
(function () {
    var installBtn = document.getElementById('pwaInstallBtn');
    var deferredPrompt = null;
    var isIOS = /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase());
    var isStandalone = window.matchMedia('(display-mode: standalone)').matches
        || navigator.standalone === true;

    function showBtn() { if (installBtn) installBtn.classList.add('show'); }
    function hideBtn() { if (installBtn) installBtn.classList.remove('show'); }

    if (!isStandalone) {
        window.addEventListener('beforeinstallprompt', function (e) {
            e.preventDefault();
            deferredPrompt = e;
            showBtn();
        });

        window.addEventListener('appinstalled', function () {
            hideBtn();
            deferredPrompt = null;
        });

        // iOS Safari : ماكاينش beforeinstallprompt → نعرضو الزر ديما
        if (isIOS) showBtn();
    }

    async function triggerInstall() {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            var choice = await deferredPrompt.userChoice;
            console.log('PWA install: ' + choice.outcome);
            deferredPrompt = null;
            hideBtn();
            return choice.outcome;
        } else if (isIOS) {
            alert('لتثبيت التطبيق على iPhone/iPad:\\n1. اضغط على أيقونة المشاركة (Share) بالأسفل\\n2. اختر "إضافة إلى الشاشة الرئيسية"');
            return 'ios-instructions';
        } else if (isStandalone) {
            alert('التطبيق مثبّت ديجا! ✅');
            return 'already-installed';
        } else {
            alert('التثبيت غير متاح حالياً فهاد المتصفح. جرّب من قائمة المتصفح (⋮) واختر "تثبيت التطبيق".');
            return 'unavailable';
        }
    }

    window.XpertPWAInstall = triggerInstall;
    if (installBtn) installBtn.addEventListener('click', triggerInstall);
})();`;
        if (!content.includes(anchor)) throw new Error(`❌ ${p}: ماقدرتش نلقى النقطة المرجعية، تحقق يدوياً`);
        content = content.replace(anchor, injected);
        write(p, content);
        report.push(`✅ ${p} - تزاد JS`);
    }
}

// ============================================================
// 4) تنضيف التكرار من الصفحات الخمسة (about/installation/terms/
//    support/calendrier) - CSS + <script> اليدويين
// ============================================================
const DUP_CSS_RE = /\s*\/\* ====== زر تثبيت PWA ====== \*\/\s*\.pwa-install-btn\{[\s\S]*?\.pwa-install-btn\.show\{ display:inline-flex; \}\s*/;
const DUP_SCRIPT_RE = /\s*<!-- ====== زر تثبيت PWA ====== -->\s*<script>\s*\(function \(\) \{\s*const installBtn = document\.getElementById\('pwaInstallBtn'\);[\s\S]*?\}\)\(\);\s*<\/script>\s*/;

const PAGES_TO_CLEAN = ['about.html', 'installation.html', 'terms.html', 'support.html', 'calendrier.html'];

for (const file of PAGES_TO_CLEAN) {
    if (!fs.existsSync(path.join(ROOT, file))) {
        report.push(`⚠️  ${file} - ماكاينش، تجاوزتو`);
        continue;
    }
    let content = read(file);
    let changed = false;

    if (DUP_CSS_RE.test(content)) {
        content = content.replace(DUP_CSS_RE, '\n');
        changed = true;
    }
    if (DUP_SCRIPT_RE.test(content)) {
        content = content.replace(DUP_SCRIPT_RE, '\n');
        changed = true;
    }

    if (changed) {
        write(file, content);
        report.push(`✅ ${file} - تنضاف الـCSS/JS المكررين`);
    } else {
        report.push(`⏭️  ${file} - ماكانش فيه تكرار (ولا تنضاف قبل)`);
    }
}

// ============================================================
// 5) installation.html - زر تحميل حقيقي كبير فـ legal-hero
// ============================================================
{
    const p = 'installation.html';
    if (fs.existsSync(path.join(ROOT, p))) {
        let content = read(p);

        if (content.includes('id="installPageBtn"')) {
            report.push(`⏭️  ${p} - زر التحميل الكبير موجود ديجا`);
        } else {
            // 5.a - CSS ديال الزر الكبير (كيتزاد فـ<style> ديال الصفحة نفسها)
            const styleAnchor = `        .pwa-install-btn:hover{ transform:scale(1.08); background:rgba(244,208,63,0.1); }
        .pwa-install-btn.show{ display:inline-flex; }
    </style>`;
            const cssBlock = `    <style>
        /* ====== زر تحميل كبير (CTA) فصفحة التثبيت ====== */
        .install-cta-btn{
            display:inline-flex; align-items:center; gap:10px;
            margin-top:20px; padding:14px 28px;
            background:linear-gradient(135deg, var(--legal-teal), #45A29E);
            color:#0B0C10; font-weight:800; font-size:15px;
            border:none; border-radius:14px; cursor:pointer;
            font-family:'Cairo','Tajawal',sans-serif;
            box-shadow:0 6px 24px rgba(78,205,196,0.28);
            transition:transform 0.2s ease, box-shadow 0.2s ease;
        }
        .install-cta-btn:hover{ transform:translateY(-2px); box-shadow:0 10px 30px rgba(78,205,196,0.35); }
        .install-cta-btn:active{ transform:translateY(0) scale(0.97); }
        .install-cta-btn i{ font-size:16px; }
        .install-cta-note{
            margin-top:10px; font-size:12px; color:var(--text-muted);
            font-family:'Cairo','Tajawal',sans-serif;
        }
    </style>`;
            // نبدلو إغلاق `</style>` الأصلي بـCSS block جديد كيحتوي نفس المحتوى + الزيادة
            // (الإغلاق مكتوب بلا مسافات فبداية السطر فكل الصفحات: "</style>")
            if (content.includes(styleAnchor)) {
                content = content.replace(
                    styleAnchor,
                    styleAnchor.replace('    </style>', '') + cssBlock.replace('    <style>\n', '')
                );
            } else if (content.includes('</style>')) {
                // fallback: من بعد ما تنضاف CSS المكررة (الخطوة 4)، نزيدو مباشرة قبل </style>
                content = content.replace('</style>', cssBlock.replace('    <style>\n', ''));
            } else {
                report.push(`⚠️  ${p} - ماقدرتش نلقى </style> باش نزيد CSS ديال الزر الكبير`);
            }

            // 5.b - زر الـHTML فـlegal-hero + ملاحظة
            const heroAnchor = `<p>ثبّت Xpert كتطبيق على هاتفك أو حاسوبك في بضع خطوات بسيطة</p>
        </div>`;
            const heroInjected = `<p>ثبّت Xpert كتطبيق على هاتفك أو حاسوبك في بضع خطوات بسيطة</p>
            <button class="install-cta-btn" id="installPageBtn" type="button">
                <i class="fas fa-download"></i> حمّل التطبيق الآن
            </button>
            <p class="install-cta-note" id="installPageBtnNote">اضغط الزر وسيظهر تنبيه التثبيت مباشرة (Android/Chrome/Edge)، أو تعليمات يدوية على iPhone/iPad.</p>
        </div>`;
            if (content.includes(heroAnchor)) {
                content = content.replace(heroAnchor, heroInjected);
            }

            // 5.c - JS كيربط الزر بـwindow.XpertPWAInstall (بعد تحميل script.js)
            const scriptAnchor = `    <script src="assets/js/protection.js"></script>
    <script src="assets/js/script.js"></script>`;
            const scriptInjected = `${scriptAnchor}

    <!-- ====== زر التحميل الكبير - كيستعمل نفس منطق script.js ====== -->
    <script>
    document.addEventListener('DOMContentLoaded', function () {
        var btn = document.getElementById('installPageBtn');
        if (!btn) return;
        btn.addEventListener('click', function () {
            if (window.XpertPWAInstall) {
                window.XpertPWAInstall();
            } else {
                alert('التثبيت غير متاح حالياً، جرّب من قائمة المتصفح (⋮) → "تثبيت التطبيق".');
            }
        });
    });
    </script>`;
            if (content.includes(scriptAnchor)) {
                content = content.replace(scriptAnchor, scriptInjected);
            }

            write(p, content);
            report.push(`✅ ${p} - تزاد زر التحميل الكبير`);
        }
    } else {
        report.push(`⚠️  ${p} - ماكاينش`);
    }
}

console.log('\n📋 نتيجة الباتش:\n');
report.forEach(l => console.log('   ' + l));
console.log('\n✅ سالات! دابا خاصك تشغل:');
console.log('   node utils/build.js');
console.log('   node utils/inject-pwa-head.js');
console.log('   node utils/generate-sitemap.js');
console.log('   node utils/validate.js');
console.log('   git add . && git commit -m "fix: زر تثبيت PWA مركزي فكل الصفحات + زر تحميل فـinstallation.html" && git push');
