#!/usr/bin/env node
/**
 * fix-animations.js
 * كيدير 3 إصلاحات دفعة وحدة:
 *
 * 1) 🔴 CRITICAL: كيزيد الدالة XpertAnimateLegalPage() الناقصة فـ
 *    assets/js/script.js - بلاها، صفحات support/about/installation/terms
 *    محتواها مخفي opacity:0 بشكل دائم (شوف legal.css) لأن الدالة اللي
 *    خاصها تكشفه ماكانتش موجودة.
 *
 * 2) كيقصر أنيميشن الدخول ديال subjects.html (~2.5x أسرع)
 * 3) كيقصر أنيميشن الدخول ديال subject.html (~2.5x أسرع)
 *
 * ملاحظة: subjects.html و subject.html عندهم ديجا حماية (animationAllowed
 * + navType) كتخلي المحتوى يبان فورا عند زيارة مباشرة (بحال PageSpeed) -
 * التسريع هنا لتحسين التجربة وقت التنقل العادي (زر Commencer/الكارط).
 *
 * الاستخدام:
 *   node utils/fix-animations.js          → dry-run
 *   node utils/fix-animations.js --apply  → يطبق فعليا
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const APPLY = process.argv.includes('--apply');

function log(ok, msg) {
    console.log((ok ? '✅ ' : '❌ ') + msg);
}

// ============================================================
// 1) إضافة الدالة الناقصة XpertAnimateLegalPage() فـ script.js
// ============================================================
function fixLegalAnimation() {
    const filePath = path.join(ROOT, 'assets', 'js', 'script.js');
    if (!fs.existsSync(filePath)) { log(false, 'ماقدرتش نلقى assets/js/script.js'); return; }

    const content = fs.readFileSync(filePath, 'utf-8');

    if (content.includes('function XpertAnimateLegalPage')) {
        log(true, 'script.js: XpertAnimateLegalPage() موجودة ديجا - ماخصنيش نزيدها.');
        return;
    }

    const FUNCTION_CODE = `
// ============================================================
// XpertAnimateLegalPage() - أنيميشن دخول مشتركة لصفحات المعلومات
// القانونية/الثابتة (terms.html / installation.html / support.html /
// about.html). القيم الابتدائية (opacity:0) معرّفة فـ legal.css،
// وهاد الدالة هي اللي كتكشفها. سريعة عمدا (~0.7s إجمالي) باش ماتأثرش
// على LCP.
// ============================================================
function XpertAnimateLegalPage(pageName) {
    if (typeof gsap === 'undefined') {
        document.querySelectorAll('#legalWrap, .legal-hero, .legal-section').forEach(function (el) {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
        console.warn('⚠️ GSAP غير محمل - عرض مباشر لـ ' + pageName);
        return;
    }

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.to('#legalWrap', { opacity: 1, y: 0, duration: 0.4 })
      .to('.legal-hero', { opacity: 1, y: 0, duration: 0.35 }, '-=0.2')
      .to('.legal-section', { opacity: 1, y: 0, duration: 0.3, stagger: 0.08 }, '-=0.15')
      .call(function () {
          console.log('✅ ' + pageName + ' - Animation jouée');
      });
}
window.XpertAnimateLegalPage = XpertAnimateLegalPage;
`;

    if (APPLY) {
        fs.writeFileSync(filePath, content.trimEnd() + '\n' + FUNCTION_CODE, 'utf-8');
    }
    log(true, `script.js: ${APPLY ? 'تمت إضافة' : '[dry-run] غادي تتزاد'} XpertAnimateLegalPage() (bug حرج - محتوى 4 صفحات كان مخفي).`);
}

// ============================================================
// 2) و 3) تسريع أنيميشن subjects.html و subject.html
// ============================================================
function speedUpPage(fileName, oldBlock, newBlock) {
    const filePath = path.join(ROOT, fileName);
    if (!fs.existsSync(filePath)) { log(false, `ماقدرتش نلقى ${fileName}`); return; }

    const content = fs.readFileSync(filePath, 'utf-8');
    if (!content.includes(oldBlock)) {
        log(false, `${fileName}: ماقدرتش نلقى النص الأصلي بالضبط (ربما تبدل الملف). بعثيه لي من جديد.`);
        return;
    }

    if (APPLY) {
        fs.writeFileSync(filePath, content.replace(oldBlock, newBlock), 'utf-8');
    }
    log(true, `${fileName}: ${APPLY ? 'تم تسريع' : '[dry-run] غادي يتسرع'} أنيميشن الدخول (~2.5x).`);
}

const SUBJECTS_OLD = `                tl
                    .to('.moroccan-bg', { opacity: 0.6, duration: 2, ease: 'power1.out' })
                    .to('.moroccan-shadow', { opacity: 0.08, duration: 2, ease: 'power1.out' }, '-=1.4')
                    .to('.moroccan-star', { opacity: 0.04, duration: 2, ease: 'power1.out' }, '-=1.4')
                    .to('.geo-pattern', { opacity: 0.03, duration: 2, stagger: 0.08, ease: 'power1.out' }, '-=1.6')
                    .to('#heroWrapper', { opacity: 1, duration: 0.8, ease: 'power2.out' }, '-=0.5')
                    .to('#mainTitle', { opacity: 1, scale: 1, duration: 1.4, ease: 'back.out(2)' }, '-=0.3')
                    .to('#subTitle', { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, '-=0.5')
                    .to('#mainTitle', { opacity: 0, y: -60, scale: 0.8, duration: 1.6, ease: 'power3.inOut', delay: 1.8 })
                    .to('#subTitle', { opacity: 0, y: -40, duration: 1.4, ease: 'power3.inOut', delay: 1.6 }, '-=0.8')
                    .to('#heroWrapper', { 
                        opacity: 0, 
                        duration: 0.6, 
                        ease: 'power2.in',
                        onComplete: function() {
                            gsap.set('#heroWrapper', { display: 'none' });
                        }
                    }, '-=0.4')
                    .to('#cardsWrapper', { opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.2')
                    .to('.card', {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 1.2,
                        stagger: { each: 0.2, from: 'start', ease: 'back.out(1.8)' },
                        ease: 'power3.out'
                    }, '-=0.3')`;

const SUBJECTS_NEW = `                tl
                    .to('.moroccan-bg', { opacity: 0.6, duration: 0.8, ease: 'power1.out' })
                    .to('.moroccan-shadow', { opacity: 0.08, duration: 0.8, ease: 'power1.out' }, '-=0.55')
                    .to('.moroccan-star', { opacity: 0.04, duration: 0.8, ease: 'power1.out' }, '-=0.55')
                    .to('.geo-pattern', { opacity: 0.03, duration: 0.8, stagger: 0.03, ease: 'power1.out' }, '-=0.6')
                    .to('#heroWrapper', { opacity: 1, duration: 0.3, ease: 'power2.out' }, '-=0.2')
                    .to('#mainTitle', { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' }, '-=0.1')
                    .to('#subTitle', { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }, '-=0.2')
                    .to('#mainTitle', { opacity: 0, y: -60, scale: 0.8, duration: 0.6, ease: 'power3.inOut', delay: 0.5 })
                    .to('#subTitle', { opacity: 0, y: -40, duration: 0.5, ease: 'power3.inOut', delay: 0.4 }, '-=0.3')
                    .to('#heroWrapper', { 
                        opacity: 0, 
                        duration: 0.25, 
                        ease: 'power2.in',
                        onComplete: function() {
                            gsap.set('#heroWrapper', { display: 'none' });
                        }
                    }, '-=0.15')
                    .to('#cardsWrapper', { opacity: 1, duration: 0.25, ease: 'power2.out' }, '-=0.1')
                    .to('.card', {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.5,
                        stagger: { each: 0.08, from: 'start', ease: 'back.out(1.8)' },
                        ease: 'power3.out'
                    }, '-=0.1')`;

const SUBJECT_OLD = `                tl
                    .to('.moroccan-bg', { opacity: 0.6, duration: 2, ease: 'power1.out' })
                    .to('.moroccan-shadow', { opacity: 0.08, duration: 2, ease: 'power1.out' }, '-=1.4')
                    .to('.moroccan-star', { opacity: 0.04, duration: 2, ease: 'power1.out' }, '-=1.4')
                    .to('.geo-pattern', { opacity: 0.03, duration: 2, stagger: 0.08, ease: 'power1.out' }, '-=1.6')
                    .to('#heroWrapper', { opacity: 1, duration: 0.8, ease: 'power2.out' }, '-=0.5')
                    .to('#mainTitle', { opacity: 1, scale: 1, duration: 1.4, ease: 'back.out(2)' }, '-=0.3')
                    .to('#subTitle', { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, '-=0.5')
                    .to('#mainTitle', { opacity: 0, y: -80, scale: 0.7, duration: 1.6, ease: 'power3.inOut', delay: 1.8 })
                    .to('#subTitle', { opacity: 0, y: -50, duration: 1.4, ease: 'power3.inOut', delay: 1.6 }, '-=0.8')
                    .to('#heroWrapper', { 
                        opacity: 0, 
                        duration: 0.6, 
                        ease: 'power2.in',
                        onComplete: function() {
                            gsap.set('#heroWrapper', { display: 'none' });
                        }
                    }, '-=0.4')
                    .to('#contentWrapper', { opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.2')
                    .to('#tabsWrapper', { opacity: 1, y: 0, duration: 0.8, ease: 'back.out(1.2)' }, '-=0.3')`;

const SUBJECT_NEW = `                tl
                    .to('.moroccan-bg', { opacity: 0.6, duration: 0.8, ease: 'power1.out' })
                    .to('.moroccan-shadow', { opacity: 0.08, duration: 0.8, ease: 'power1.out' }, '-=0.55')
                    .to('.moroccan-star', { opacity: 0.04, duration: 0.8, ease: 'power1.out' }, '-=0.55')
                    .to('.geo-pattern', { opacity: 0.03, duration: 0.8, stagger: 0.03, ease: 'power1.out' }, '-=0.6')
                    .to('#heroWrapper', { opacity: 1, duration: 0.3, ease: 'power2.out' }, '-=0.2')
                    .to('#mainTitle', { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' }, '-=0.1')
                    .to('#subTitle', { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }, '-=0.2')
                    .to('#mainTitle', { opacity: 0, y: -80, scale: 0.7, duration: 0.6, ease: 'power3.inOut', delay: 0.5 })
                    .to('#subTitle', { opacity: 0, y: -50, duration: 0.5, ease: 'power3.inOut', delay: 0.4 }, '-=0.3')
                    .to('#heroWrapper', { 
                        opacity: 0, 
                        duration: 0.25, 
                        ease: 'power2.in',
                        onComplete: function() {
                            gsap.set('#heroWrapper', { display: 'none' });
                        }
                    }, '-=0.15')
                    .to('#contentWrapper', { opacity: 1, duration: 0.25, ease: 'power2.out' }, '-=0.1')
                    .to('#tabsWrapper', { opacity: 1, y: 0, duration: 0.3, ease: 'back.out(1.2)' }, '-=0.1')`;

console.log(APPLY ? '=== تطبيق الإصلاحات (--apply) ===\n' : '=== Dry-run: عرض التعديلات بلا كتابة (زيد --apply باش تطبقهم) ===\n');

fixLegalAnimation();
speedUpPage('subjects.html', SUBJECTS_OLD, SUBJECTS_NEW);
speedUpPage('subject.html', SUBJECT_OLD, SUBJECT_NEW);

if (!APPLY) {
    console.log('\n⚠️  هادي غير معاينة. زيد "--apply" باش تتكتب الملفات فعليا.');
} else {
    console.log('\n📋 الخطوة الجاية: node utils/build.js');
}
