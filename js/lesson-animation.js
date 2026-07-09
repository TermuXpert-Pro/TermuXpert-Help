// ============================================================
// lesson-animation.js - تأثيرات GSAP موحدة للدروس
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ====== خلفية زليج ======
    gsap.to('.moroccan-bg', {
        opacity: 0.4,
        duration: 1.5,
        ease: 'power1.out'
    });
    
    gsap.to('.moroccan-shadow', {
        opacity: 0.06,
        duration: 1.5,
        ease: 'power1.out',
        delay: 0.3
    });
    
    gsap.to('.moroccan-star', {
        opacity: 0.03,
        duration: 1.5,
        ease: 'power1.out',
        delay: 0.4
    });
    
    gsap.to('.geo-pattern', {
        opacity: 0.02,
        duration: 1.5,
        stagger: 0.1,
        ease: 'power1.out',
        delay: 0.5
    });
    
    // ====== عنوان الدرس ======
    gsap.from('.lesson-title', {
        opacity: 0,
        y: -30,
        scale: 0.95,
        duration: 0.8,
        ease: 'back.out(1.7)',
        delay: 0.3
    });
    
    // ====== الأقسام (sections) ======
    gsap.from('.section', {
        opacity: 0,
        y: 40,
        scale: 0.97,
        duration: 0.6,
        stagger: 0.12,
        ease: 'power3.out',
        delay: 0.5
    });
    
    // ====== صناديق التمارين ======
    gsap.from('.exercice-box', {
        opacity: 0,
        x: -20,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power2.out',
        delay: 0.8
    });
    
    // ====== أزرار الحل ======
    gsap.from('.toggle-sol', {
        opacity: 0,
        scale: 0.8,
        duration: 0.4,
        stagger: 0.06,
        ease: 'back.out(1.4)',
        delay: 1.0
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
    
    // ====== Hover على الصناديق ======
    document.querySelectorAll('.highlight-box').forEach(box => {
        box.addEventListener('mouseenter', function() {
            gsap.to(this, {
                scale: 1.01,
                duration: 0.3,
                ease: 'power2.out',
                boxShadow: '0 4px 20px rgba(78, 205, 196, 0.05)'
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
    
    console.log('✅ Lesson animation loaded');
});
