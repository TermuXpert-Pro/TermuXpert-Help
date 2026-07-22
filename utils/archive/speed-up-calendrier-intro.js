#!/usr/bin/env node
/**
 * speed-up-calendrier-intro.js
 * كيقصر أنيميشن الدخول ديال calendrier.html (~2.5x أسرع)، بلا ما يحذفها.
 * هاد الصفحة عندها نفس مشكل index.html: الأنيميشن كتخدم دايما بلا شرط
 * (بلا animationAllowed/navType check بحال subjects.html)، يعني أي زيارة
 * مباشرة (بحال PageSpeed) كتعيش التأخر كامل.
 *
 * الاستخدام:
 *   node utils/speed-up-calendrier-intro.js          → dry-run
 *   node utils/speed-up-calendrier-intro.js --apply  → يطبق فعليا
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const APPLY = process.argv.includes('--apply');
const filePath = path.join(ROOT, 'calendrier.html');

if (!fs.existsSync(filePath)) {
    console.error('❌ ماقدرتش نلقى calendrier.html فـ', ROOT);
    process.exit(1);
}

const content = fs.readFileSync(filePath, 'utf-8');

const OLD_BLOCK = `        tl
            // 1. ظهور الخلفيات
            .to('.moroccan-bg', { opacity: 0.6, duration: 1.8, ease: 'power1.out' })
            .to('.moroccan-shadow', { opacity: 0.08, duration: 1.8, ease: 'power1.out' }, '-=1.2')
            .to('.moroccan-star', { opacity: 0.04, duration: 1.8, ease: 'power1.out' }, '-=1.2')
            .to('.geo-pattern', { opacity: 0.03, duration: 1.8, stagger: 0.08, ease: 'power1.out' }, '-=1.4')

            // 2. ظهور المحتوى الرئيسي
            .to('#calWrap', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.3')
            .to('.cal-hero', { opacity: 1, y: 0, duration: 0.7, ease: 'back.out(1.7)' }, '-=0.4')
            .to('.cal-section', {
                opacity: 1,
                y: 0,
                duration: 0.7,
                stagger: 0.15,
                ease: 'back.out(1.7)'
            }, '-=0.3')
            .to('.cal-cta-wrap', { opacity: 1, y: 0, duration: 0.7, ease: 'back.out(1.7)' }, '-=0.2')`;

const NEW_BLOCK = `        tl
            // 1. ظهور الخلفيات (مقصرة ~2.5x)
            .to('.moroccan-bg', { opacity: 0.6, duration: 0.7, ease: 'power1.out' })
            .to('.moroccan-shadow', { opacity: 0.08, duration: 0.7, ease: 'power1.out' }, '-=0.45')
            .to('.moroccan-star', { opacity: 0.04, duration: 0.7, ease: 'power1.out' }, '-=0.45')
            .to('.geo-pattern', { opacity: 0.03, duration: 0.7, stagger: 0.03, ease: 'power1.out' }, '-=0.5')

            // 2. ظهور المحتوى الرئيسي
            .to('#calWrap', { opacity: 1, y: 0, duration: 0.3, ease: 'power3.out' }, '-=0.1')
            .to('.cal-hero', { opacity: 1, y: 0, duration: 0.3, ease: 'back.out(1.7)' }, '-=0.15')
            .to('.cal-section', {
                opacity: 1,
                y: 0,
                duration: 0.3,
                stagger: 0.06,
                ease: 'back.out(1.7)'
            }, '-=0.1')
            .to('.cal-cta-wrap', { opacity: 1, y: 0, duration: 0.3, ease: 'back.out(1.7)' }, '-=0.1')`;

if (!content.includes(OLD_BLOCK)) {
    console.error('❌ ماقدرتش نلقى النص الأصلي بالضبط فـ calendrier.html.');
    console.error('   ربما تبدل الملف من بعد ما بعثتيه لي - بعثيه لي من جديد.');
    process.exit(1);
}

console.log(APPLY ? '=== تطبيق التعديل (--apply) ===\n' : '=== Dry-run: عرض التعديل بلا كتابة ===\n');
console.log('✅ لقيت البلوك ديال الأنيميشن فـ calendrier.html، غادي يتقصر ~2.5x.');

if (APPLY) {
    fs.writeFileSync(filePath, content.replace(OLD_BLOCK, NEW_BLOCK), 'utf-8');
    console.log('✅ تم التطبيق.');
    console.log('\n📋 الخطوة الجاية: node utils/build.js');
} else {
    console.log('\n⚠️  زيد "--apply" باش يتكتب الملف فعليا.');
}
