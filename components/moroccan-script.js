/* ============================================================
   moroccan-script.js - سكريبت الزليج المغربي والأنميشن
   ============================================================ */

document.addEventListener('DOMContentLoaded', function() {
    
    // ====== حركات مستمرة للخلفيات ======
    gsap.to('.moroccan-bg', { 
        opacity: 0.8, 
        duration: 4, 
        repeat: -1, 
        yoyo: true, 
        ease: 'sine.inOut' 
    });
    
    gsap.to('.moroccan-star', { 
        rotation: 360, 
        duration: 30, 
        repeat: -1, 
        ease: 'none' 
    });
    
    // ====== حركات الزخارف ======
    gsap.to('.geo-pattern-1', { 
        x: 25, y: 12, 
        duration: 5, 
        repeat: -1, 
        yoyo: true, 
        ease: 'sine.inOut' 
    });
    gsap.to('.geo-pattern-2', { 
        x: -25, y: -12, 
        duration: 5, 
        repeat: -1, 
        yoyo: true, 
        ease: 'sine.inOut', 
        delay: 1.2 
    });
    gsap.to('.geo-pattern-3', { 
        x: 15, y: -15, 
        duration: 5, 
        repeat: -1, 
        yoyo: true, 
        ease: 'sine.inOut', 
        delay: 0.5 
    });
    gsap.to('.geo-pattern-4', { 
        x: -15, y: 15, 
        duration: 5, 
        repeat: -1, 
        yoyo: true, 
        ease: 'sine.inOut', 
        delay: 1.5 
    });
    
    // ====== وظائف لإظهار الخلفيات ======
    window.showMoroccanBg = function(duration = 1.8) {
        const tl = gsap.timeline();
        tl
            .to('.moroccan-bg', { opacity: 0.6, duration: duration, ease: 'power1.out' })
            .to('.moroccan-shadow', { opacity: 0.08, duration: duration, ease: 'power1.out' }, '-=1.2')
            .to('.moroccan-star', { opacity: 0.04, duration: duration, ease: 'power1.out' }, '-=1.2')
            .to('.geo-pattern', { opacity: 0.03, duration: duration, stagger: 0.08, ease: 'power1.out' }, '-=1.4');
        return tl;
    };
    
    // ====== وظائف لإخفاء الخلفيات ======
    window.hideMoroccanBg = function(duration = 0.5) {
        const tl = gsap.timeline();
        tl
            .to('.moroccan-bg', { opacity: 0, duration: duration })
            .to('.moroccan-shadow', { opacity: 0, duration: duration }, '-=0.3')
            .to('.moroccan-star', { opacity: 0, duration: duration }, '-=0.3')
            .to('.geo-pattern', { opacity: 0, duration: duration }, '-=0.3');
        return tl;
    };
    
    console.log('✅ Moroccan background components loaded!');
});
