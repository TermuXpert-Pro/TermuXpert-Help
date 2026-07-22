#!/usr/bin/env node
/**
 * speed-up-hero-intro.js
 * كيقصر مدة أنيميشن الدخول ديال index.html (~2.5x أسرع) بلا ما يحذفها -
 * نفس الترتيب والحركة، غير سريعة بزاف، باش العنوان الرئيسي (#title)
 * يوصل opacity:1 فأقل من ثانية بدل ~3-4 ثواني، وهادشي كيهبط LCP بزاف.
 *
 * ملاحظة: subjects.html ماشي محتاجة نفس التعديل - فيها ديجا فحص
 * (animationAllowed + navType) كيخلي المحتوى يبان فورا عند زيارة مباشرة
 * (بحال PageSpeed)، والأنيميشن كتخدم غير جاي من زر "Commencer".
 *
 * الاستخدام:
 *   node utils/speed-up-hero-intro.js          → dry-run
 *   node utils/speed-up-hero-intro.js --apply  → كيطبق التعديل فعليا
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const APPLY = process.argv.includes('--apply');
const filePath = path.join(ROOT, 'index.html');

if (!fs.existsSync(filePath)) {
    console.error('❌ ماقدرتش نلقى index.html فـ', ROOT);
    process.exit(1);
}

const content = fs.readFileSync(filePath, 'utf-8');

const OLD_BLOCK = `            // ====== 1. ظهور الخلفيات ======
            tl
                .to('.moroccan-bg', { opacity: 0.6, duration: 1.8, ease: 'power1.out' })
                .to('.moroccan-shadow', { opacity: 0.08, duration: 1.8, ease: 'power1.out' }, '-=1.2')
                .to('.moroccan-star', { opacity: 0.04, duration: 1.8, ease: 'power1.out' }, '-=1.2')
                .to('.geo-pattern', { opacity: 0.03, duration: 1.8, stagger: 0.08, ease: 'power1.out' }, '-=1.4')

            // ====== 2. ظهور الهيرو ======
            .to('#heroSection', { opacity: 1, duration: 0.8, ease: 'power2.out' }, '-=0.5')

            // ====== 3. ظهور البروفايل ======
            .to('#profileWrapper', { opacity: 1, y: 0, duration: 1, ease: 'back.out(1.7)' }, '-=0.3')
            .to('#profileImg', { 
                scale: 1, 
                opacity: 1, 
                duration: 0.8, 
                ease: 'back.out(2)',
                rotation: 0
            }, '-=0.6')

            // ====== 4. ظهور البطاقة ======
            .to('#heroCard', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.3')

            // ====== 5. ظهور الشعار ======
            .to('#logo', { opacity: 1, y: 0, duration: 0.8, ease: 'back.out(1.7)' }, '-=0.4')
            .fromTo('.name-center', 
                { scale: 0.8, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(2)' },
                '-=0.4'
            )

            // ====== 6. ظهور باقي العناصر ======
            .to('.hero-label', { opacity: 1, y: 0, duration: 0.6 }, '-=0.3')
            .to('#title', { opacity: 1, y: 0, duration: 0.6 }, '-=0.3')
            .to('#desc', { opacity: 1, y: 0, duration: 0.6 }, '-=0.3')
            .to('#buttons', { opacity: 1, y: 0, duration: 0.6 }, '-=0.3')
            
            // ====== نبض النقطة ======
            .to('.dot', {
                scale: 1.2,
                duration: 0.5,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            }, '-=0.2')`;

const NEW_BLOCK = `            // ====== 1. ظهور الخلفيات (مقصرة ~2.5x) ======
            tl
                .to('.moroccan-bg', { opacity: 0.6, duration: 0.7, ease: 'power1.out' })
                .to('.moroccan-shadow', { opacity: 0.08, duration: 0.7, ease: 'power1.out' }, '-=0.45')
                .to('.moroccan-star', { opacity: 0.04, duration: 0.7, ease: 'power1.out' }, '-=0.45')
                .to('.geo-pattern', { opacity: 0.03, duration: 0.7, stagger: 0.03, ease: 'power1.out' }, '-=0.5')

            // ====== 2. ظهور الهيرو ======
            .to('#heroSection', { opacity: 1, duration: 0.3, ease: 'power2.out' }, '-=0.2')

            // ====== 3. ظهور البروفايل ======
            .to('#profileWrapper', { opacity: 1, y: 0, duration: 0.4, ease: 'back.out(1.7)' }, '-=0.1')
            .to('#profileImg', { 
                scale: 1, 
                opacity: 1, 
                duration: 0.3, 
                ease: 'back.out(2)',
                rotation: 0
            }, '-=0.2')

            // ====== 4. ظهور البطاقة ======
            .to('#heroCard', { opacity: 1, y: 0, duration: 0.3, ease: 'power3.out' }, '-=0.1')

            // ====== 5. ظهور الشعار ======
            .to('#logo', { opacity: 1, y: 0, duration: 0.3, ease: 'back.out(1.7)' }, '-=0.15')
            .fromTo('.name-center', 
                { scale: 0.8, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(2)' },
                '-=0.15'
            )

            // ====== 6. ظهور باقي العناصر ======
            .to('.hero-label', { opacity: 1, y: 0, duration: 0.25 }, '-=0.1')
            .to('#title', { opacity: 1, y: 0, duration: 0.25 }, '-=0.1')
            .to('#desc', { opacity: 1, y: 0, duration: 0.25 }, '-=0.1')
            .to('#buttons', { opacity: 1, y: 0, duration: 0.25 }, '-=0.1')
            
            // ====== نبض النقطة (تبقى عادية - decorative بعد الظهور) ======
            .to('.dot', {
                scale: 1.2,
                duration: 0.5,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            }, '-=0.1')`;

if (!content.includes(OLD_BLOCK)) {
    console.error('❌ ماقدرتش نلقى النص الأصلي بالضبط فـ index.html.');
    console.error('   ربما index.html تبدل من بعد ما بعثتيه لي - بعثيلي نسخة جديدة.');
    process.exit(1);
}

console.log(APPLY ? '=== تطبيق التعديل (--apply) ===\n' : '=== Dry-run: عرض التعديل بلا كتابة (زيد --apply باش تطبقو) ===\n');
console.log('✅ لقيت البلوك ديال الأنيميشن فـ index.html، غادي يتقصر ~2.5x.');

if (APPLY) {
    const newContent = content.replace(OLD_BLOCK, NEW_BLOCK);
    fs.writeFileSync(filePath, newContent, 'utf-8');
    console.log('✅ تم التطبيق على index.html.');
    console.log('\n📋 الخطوة الجاية: node utils/build.js (باش يتجدد رقم نسخة الكاش)');
} else {
    console.log('\n⚠️  هادي غير معاينة (dry-run). زيد "--apply" باش يتكتب الملف فعليا.');
}
