// ============================================================
// lesson-animation.js - تأثيرات GSAP موحدة للدروس مع تأخير
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ====== إخفاء المحتوى مؤقتاً ======
    // نضيف class 'hidden' لكل العناصر التي ستظهر بالأنميشن
    const elementsToHide = [
        '.lesson-title',
        '.section',
        '.exercice-box',
        '.toggle-sol',
        '.command-card',
        '.ex-link',
        '.part-link',
        '.serie-title',
        '.exercice-count',
        '.section-list'
    ];
    
    elementsToHide.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
        });
    });
    
    // ====== خلفية زليج ======
    gsap.to('.moroccan-bg', {
        opacity: 0.4,
        duration: 1.2,
        ease: 'power1.out',
        delay: 0.2
    });
    
    gsap.to('.moroccan-shadow', {
        opacity: 0.06,
        duration: 1.2,
        ease: 'power1.out',
        delay: 0.4
    });
    
    gsap.to('.moroccan-star', {
        opacity: 0.03,
        duration: 1.2,
        ease: 'power1.out',
        delay: 0.5
    });
    
    gsap.to('.geo-pattern', {
        opacity: 0.02,
        duration: 1.2,
        stagger: 0.08,
        ease: 'power1.out',
        delay: 0.6
    });
    
    // ====== تأخير قبل ظهور المحتوى ======
    // 0.8 ثانية تأخير ثم ظهور بتأثير مبهر
    
    // ====== عنوان الدرس ======
    gsap.to('.lesson-title', {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'back.out(1.8)',
        delay: 0.8
    });
    
    // ====== الأقسام (sections) ======
    gsap.to('.section', {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power3.out',
        delay: 1.0
    });
    
    // ====== صناديق التمارين ======
    gsap.to('.exercice-box', {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        delay: 1.3
    });
    
    // ====== أزرار الحل ======
    gsap.to('.toggle-sol', {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: 'back.out(1.4)',
        delay: 1.5
    });
    
    // ====== بطاقات الأقسام (part-link, ex-link) ======
    gsap.to('.part-link, .ex-link', {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power3.out',
        delay: 0.9
    });
    
    // ====== بطاقات الأوامر (command-card) ======
    gsap.to('.command-card', {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.08,
        ease: 'back.out(1.4)',
        delay: 1.1
    });
    
    // ====== عناوين السلاسل ======
    gsap.to('.serie-title, .exercice-count', {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        delay: 0.7
    });
    
    // ====== قوائم السلاسل ======
    gsap.to('.section-list', {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        delay: 0.8
    });
    
    // ====== صناديق المعلومات ======
    gsap.to('.highlight-box', {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power2.out',
        delay: 1.2
    });
    
    // ====== الصيغ الرياضية ======
    gsap.to('.formula-block', {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.06,
        ease: 'back.out(1.4)',
        delay: 1.4
    });
    
    // ====== الجداول ======
    gsap.to('.table-wrap', {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power2.out',
        delay: 1.3
    });
    
    // ====== الخطوات ======
    gsap.to('.step', {
        opacity: 1,
        x: 0,
        duration: 0.5,
        stagger: 0.06,
        ease: 'power2.out',
        delay: 1.2
    });
    
    // ====== زر العودة ======
    gsap.to('.back-btn', {
        opacity: 1,
        x: 0,
        duration: 0.5,
        ease: 'power2.out',
        delay: 0.5
    });
    
    // ====== أزرار التنقل ======
    gsap.to('.nav-buttons', {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out',
        delay: 1.6
    });
    
    // ====== حركات مستمرة ======
    // دوران النجمة
    gsap.to('.moroccan-star', {
        rotation: 360,
        duration: 30,
        repeat: -1,
        ease: 'none'
    });
    
    // حركة الزخارف
    gsap.to('.geo-pattern-1', {
        x: 20,
        y: 10,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
    });
    gsap.to('.geo-pattern-2', {
        x: -20,
        y: -10,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 1.2
    });
    gsap.to('.geo-pattern-3', {
        x: 15,
        y: -15,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 0.5
    });
    gsap.to('.geo-pattern-4', {
        x: -15,
        y: 15,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 1.8
    });
    
    // ====== نبض خفيف للنجمة ======
    gsap.to('.moroccan-star', {
        scale: 1.05,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 0.5
    });
    
    // ====== Hover على الصناديق ======
    document.querySelectorAll('.highlight-box').forEach(box => {
        box.addEventListener('mouseenter', function() {
            gsap.to(this, {
                scale: 1.01,
                duration: 0.3,
                ease: 'power2.out',
                boxShadow: '0 4px 20px rgba(78, 205, 196, 0.08)'
            });
        });
        box.addEventListener('mouseleave', function() {
            gsap.to(this, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.inOut',
                boxShadow: 'none'
            });
        });
    });
    
    // ====== Hover على الجداول ======
    document.querySelectorAll('.table-wrap').forEach(table => {
        table.addEventListener('mouseenter', function() {
            gsap.to(this, {
                scale: 1.01,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        table.addEventListener('mouseleave', function() {
            gsap.to(this, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.inOut'
            });
        });
    });
    
    // ====== Hover على البطاقات ======
    document.querySelectorAll('.part-link, .ex-link, .command-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            gsap.to(this, {
                scale: 1.02,
                duration: 0.3,
                ease: 'power2.out',
                boxShadow: '0 8px 30px rgba(0,0,0,0.2)'
            });
        });
        card.addEventListener('mouseleave', function() {
            gsap.to(this, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.inOut',
                boxShadow: 'none'
            });
        });
    });
    
    console.log('✅ Lesson animation loaded with delay and stagger effects');
});
