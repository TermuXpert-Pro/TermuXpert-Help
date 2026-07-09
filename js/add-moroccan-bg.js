(function() {
    'use strict';

    if (typeof gsap === 'undefined') {
        var gsapScript = document.createElement('script');
        gsapScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js';
        gsapScript.onload = function() { init(); };
        document.head.appendChild(gsapScript);
    } else {
        init();
    }

    function init() {
        createMoroccanElements();
        addStyles();
        setTimeout(function() { runAnimation(); }, 100);
    }

    function createMoroccanElements() {
        var overlay = document.createElement('div');
        overlay.className = 'overlay-protection';
        overlay.id = 'overlayProtection';
        document.body.insertBefore(overlay, document.body.firstChild);

        var bg = document.createElement('div');
        bg.className = 'moroccan-bg';
        bg.innerHTML = '<svg viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="zellij" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse"><rect width="200" height="200" fill="none"/><polygon points="100,0 200,100 100,200 0,100" fill="none" stroke="#4ECDC4" stroke-width="0.5" opacity="0.3"/><polygon points="100,20 180,100 100,180 20,100" fill="none" stroke="#66FCF1" stroke-width="0.5" opacity="0.2"/><polygon points="100,40 160,100 100,160 40,100" fill="none" stroke="#F4D03F" stroke-width="0.5" opacity="0.2"/><polygon points="100,60 140,100 100,140 60,100" fill="none" stroke="#FF6B6B" stroke-width="0.5" opacity="0.2"/><text x="100" y="100" text-anchor="middle" dominant-baseline="central" font-size="8" fill="#F4D03F" opacity="0.2">✦</text><text x="50" y="50" text-anchor="middle" dominant-baseline="central" font-size="6" fill="#4ECDC4" opacity="0.15">✦</text><text x="150" y="50" text-anchor="middle" dominant-baseline="central" font-size="6" fill="#4ECDC4" opacity="0.15">✦</text><text x="50" y="150" text-anchor="middle" dominant-baseline="central" font-size="6" fill="#4ECDC4" opacity="0.15">✦</text><text x="150" y="150" text-anchor="middle" dominant-baseline="central" font-size="6" fill="#4ECDC4" opacity="0.15">✦</text><line x1="0" y1="0" x2="200" y2="200" stroke="#4ECDC4" stroke-width="0.3" opacity="0.1"/><line x1="200" y1="0" x2="0" y2="200" stroke="#4ECDC4" stroke-width="0.3" opacity="0.1"/><line x1="100" y1="0" x2="100" y2="200" stroke="#4ECDC4" stroke-width="0.3" opacity="0.05"/><line x1="0" y1="100" x2="200" y2="100" stroke="#4ECDC4" stroke-width="0.3" opacity="0.05"/></pattern></defs><rect width="800" height="800" fill="url(#zellij)"/></svg>';
        document.body.insertBefore(bg, document.body.firstChild);

        var shadow = document.createElement('div');
        shadow.className = 'moroccan-shadow';
        document.body.insertBefore(shadow, document.body.firstChild);

        var star = document.createElement('div');
        star.className = 'moroccan-star';
        star.textContent = '✦';
        document.body.insertBefore(star, document.body.firstChild);

        for (var i = 1; i <= 4; i++) {
            var pattern = document.createElement('div');
            pattern.className = 'geo-pattern geo-pattern-' + i;
            pattern.textContent = '✦ ✧ ✦ ✧ ✦';
            document.body.insertBefore(pattern, document.body.firstChild);
        }
    }

    function addStyles() {
        var style = document.createElement('style');
        style.textContent = '.overlay-protection{position:fixed;top:0;left:0;width:100%;height:100%;z-index:9999;background:transparent;pointer-events:all;cursor:default;opacity:0;display:none}.overlay-protection.active{display:block!important;opacity:1!important;pointer-events:all!important}.overlay-protection.hidden{display:none!important;opacity:0!important;pointer-events:none!important}.moroccan-bg{position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none;overflow:hidden;opacity:0}.moroccan-bg svg{width:100%;height:100%}.moroccan-shadow{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:600px;height:600px;z-index:0;pointer-events:none;opacity:0;background:radial-gradient(circle at center,#4ECDC4 0%,#FF6B6B 40%,#F4D03F 70%,transparent 100%);border-radius:50%;filter:blur(80px);animation:shadowPulse 8s ease-in-out infinite}@keyframes shadowPulse{0%,100%{transform:translate(-50%,-50%) scale(1);opacity:.08}50%{transform:translate(-50%,-50%) scale(1.2);opacity:.15}}.moroccan-star{position:fixed;z-index:0;pointer-events:none;opacity:0;font-size:120px;color:#4ECDC4;top:50%;left:50%;transform:translate(-50%,-50%);animation:starSpin 20s linear infinite}@keyframes starSpin{0%{transform:translate(-50%,-50%) rotate(0deg) scale(1)}50%{transform:translate(-50%,-50%) rotate(180deg) scale(1.1)}100%{transform:translate(-50%,-50%) rotate(360deg) scale(1)}}.geo-pattern{position:fixed;z-index:0;pointer-events:none;opacity:0;color:#F4D03F;font-size:20px;letter-spacing:20px}.geo-pattern-1{top:10%;left:5%;transform:rotate(-15deg)}.geo-pattern-2{bottom:10%;right:5%;transform:rotate(15deg)}.geo-pattern-3{top:50%;left:2%;transform:rotate(90deg)}.geo-pattern-4{top:50%;right:2%;transform:rotate(-90deg)}@media(max-width:768px){.moroccan-shadow{width:300px;height:300px}.moroccan-star{font-size:60px}.geo-pattern{font-size:14px;letter-spacing:12px}}@media(max-width:480px){.moroccan-shadow{width:200px;height:200px}.moroccan-star{font-size:40px}.geo-pattern{font-size:10px;letter-spacing:8px}}';
        document.head.appendChild(style);
    }

    function runAnimation() {
        var overlay = document.getElementById('overlayProtection');
        if (!overlay) return;
        overlay.classList.add('active');

        var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        tl
            .to('.moroccan-bg', { opacity: 0.6, duration: 1.8, ease: 'power1.out' })
            .to('.moroccan-shadow', { opacity: 0.08, duration: 1.8, ease: 'power1.out' }, '-=1.2')
            .to('.moroccan-star', { opacity: 0.04, duration: 1.8, ease: 'power1.out' }, '-=1.2')
            .to('.geo-pattern', { opacity: 0.03, duration: 1.8, stagger: 0.08, ease: 'power1.out' }, '-=1.4')
            .to('.lesson-container, .section-list, .lesson-title, .back-btn', { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power2.out' }, '-=0.5')
            .to('.section', { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: 'power3.out' }, '-=0.3')
            .to('.card, .command-card, .ex-link, .part-link, .sub-question', { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.1, ease: 'back.out(1.7)' }, '-=0.4')
            .to('.tab-btn, .tabs-wrapper', { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power2.out' }, '-=0.3')
            .call(function() {
                overlay.classList.remove('active');
                overlay.classList.add('hidden');
                overlay.style.display = 'none';
                overlay.style.pointerEvents = 'none';
            });

        gsap.to('.moroccan-bg', { opacity: 0.8, duration: 4, repeat: -1, yoyo: true, ease: 'sine.inOut' });
        gsap.to('.moroccan-star', { rotation: 360, duration: 30, repeat: -1, ease: 'none' });
        gsap.to('.geo-pattern-1', { x: 25, y: 12, duration: 5, repeat: -1, yoyo: true, ease: 'sine.inOut' });
        gsap.to('.geo-pattern-2', { x: -25, y: -12, duration: 5, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1.2 });
    }
})();
