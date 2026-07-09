// ============================================================
// lesson-animation.js - تأثيرات GSAP موحدة للدروس
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    
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
    // استخدام from بدلاً من to لضمان الظهور
    
    // ====== زر العودة ======
    gsap.from('.back-btn', {
        opacity: 0,
        x: -20,
        duration: 0.5,
        ease: 'power2.out',
        delay: 0.5
    });
    
    // ====== عنوان الدرس ======
    gsap.from('.lesson-title', {
        opacity: 0,
        y: -30,
        scale: 0.95,
        duration: 0.9,
        ease: 'back.out(1.8)',
        delay: 0.8
    });
    
    // ====== الأقسام (sections) ======
    gsap.from('.section', {
        opacity: 0,
        y: 30,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power3.out',
        delay: 1.0
    });
    
    // ====== صناديق التمارين ======
    gsap.from('.exercice-box', {
        opacity: 0,
        y: 20,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        delay: 1.3
    });
    
    // ====== أزرار الحل ======
    gsap.from('.toggle-sol', {
        opacity: 0,
        scale: 0.8,
        duration: 0.5,
        stagger: 0.08,
        ease: 'back.out(1.4)',
        delay: 1.5
    });
    
    // ====== بطاقات الأقسام (part-link, ex-link) ======
    gsap.from('.part-link, .ex-link', {
        opacity: 0,
        y: 20,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power3.out',
        delay: 0.9
    });
    
    // ====== بطاقات الأوامر (command-card) ======
    gsap.from('.command-card', {
        opacity: 0,
        y: 20,
        scale: 0.95,
        duration: 0.6,
        stagger: 0.08,
        ease: 'back.out(1.4)',
        delay: 1.1
    });
    
    // ====== عناوين السلاسل ======
    gsap.from('.serie-title, .exercice-count', {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: 'power2.out',
        delay: 0.7
    });
    
    // ====== قوائم السلاسل ======
    gsap.from('.section-list', {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: 'power2.out',
        delay: 0.8
    });
    
    // ====== صناديق المعلومات ======
    gsap.from('.highlight-box', {
        opacity: 0,
        y: 20,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power2.out',
        delay: 1.2
    });
    
    // ====== الصيغ الرياضية ======
    gsap.from('.formula-block', {
        opacity: 0,
        y: 20,
        scale: 0.95,
        duration: 0.6,
        stagger: 0.06,
        ease: 'back.out(1.4)',
        delay: 1.4
    });
    
    // ====== الجداول ======
    gsap.from('.table-wrap', {
        opacity: 0,
        y: 20,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power2.out',
        delay: 1.3
    });
    
    // ====== الخطوات ======
    gsap.from('.step', {
        opacity: 0,
        x: -10,
        duration: 0.5,
        stagger: 0.06,
        ease: 'power2.out',
        delay: 1.2
    });
    
    // ====== أزرار التنقل ======
    gsap.from('.nav-buttons', {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: 'power2.out',
        delay: 1.6
    });
    
    // ====== المحتوى العام ======
    gsap.from('.lesson-container', {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out',
        delay: 0.3
    });
    
    // ====== حركات مستمرة ======
    gsap.to('.moroccan-star', {
        rotation: 360,
        duration: 30,
        repeat: -1,
        ease: 'none'
    });
    
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
    
    console.log('✅ Lesson animation loaded successfully');
});
