#!/bin/bash

# ============================================================
# update_protection.sh
# سكربت لإضافة نظام الحماية المتكامل إلى جميع صفحات HTML
# ============================================================

echo "=========================================="
echo "🛡️  تحديث جميع صفحات HTML بنظام الحماية"
echo "=========================================="
echo ""

# ====== الانتقال إلى مجلد المشروع ======
cd /storage/emulated/0/Web || exit 1
echo "📂 المسار: $(pwd)"
echo ""

# ====== التأكد من وجود مجلد assets/js ======
mkdir -p assets/js
mkdir -p assets/css

# ====== 1. إنشاء ملف protection.js ======
echo "📄 1. إنشاء protection.js..."
cat > assets/js/protection.js << 'PROTECTION_EOF'
/**
 * ============================================================
 * protection.js - حماية متقدمة للمحتوى
 * منع النسخ، التحديد، القوائم، سحب الصور، الضغط المطول
 * ============================================================
 */

(function() {
    'use strict';

    // ============================================================
    // 1. منع تحديد النصوص (Selection)
    // ============================================================
    
    const style = document.createElement('style');
    style.textContent = `
        * {
            -webkit-user-select: none !important;
            -moz-user-select: none !important;
            -ms-user-select: none !important;
            user-select: none !important;
            -webkit-touch-callout: none !important;
            -webkit-tap-highlight-color: transparent !important;
        }
        input, textarea, [contenteditable="true"] {
            -webkit-user-select: text !important;
            -moz-user-select: text !important;
            -ms-user-select: text !important;
            user-select: text !important;
        }
        img, svg, canvas, video, iframe {
            -webkit-user-drag: none !important;
            -moz-user-drag: none !important;
            -ms-user-drag: none !important;
            user-drag: none !important;
            -webkit-touch-callout: none !important;
            pointer-events: none !important;
            touch-action: none !important;
        }
        img {
            -webkit-touch-callout: none !important;
            touch-callout: none !important;
            pointer-events: none !important;
        }
        body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }
    `;
    document.head.appendChild(style);

    // ============================================================
    // 2. منع تحديد النصوص
    // ============================================================
    
    document.addEventListener('selectstart', function(e) {
        e.preventDefault();
        return false;
    }, { passive: false });

    document.addEventListener('selectionchange', function(e) {
        if (window.getSelection) {
            window.getSelection().removeAllRanges();
        }
    }, { passive: true });

    document.querySelectorAll('*').forEach(function(el) {
        el.addEventListener('selectstart', function(e) {
            e.preventDefault();
            return false;
        }, { passive: false });
    });

    // ============================================================
    // 3. منع القائمة المختصرة (النقر الأيمن)
    // ============================================================
    
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }, { passive: false });

    document.querySelectorAll('*').forEach(function(el) {
        el.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }, { passive: false });
    });

    // ============================================================
    // 4. منع نسخ النصوص
    // ============================================================
    
    document.addEventListener('copy', function(e) {
        e.preventDefault();
        e.clipboardData.setData('text/plain', '');
        return false;
    }, { passive: false });

    document.addEventListener('cut', function(e) {
        e.preventDefault();
        e.clipboardData.setData('text/plain', '');
        return false;
    }, { passive: false });

    document.addEventListener('dragstart', function(e) {
        e.preventDefault();
        return false;
    }, { passive: false });

    document.addEventListener('drop', function(e) {
        e.preventDefault();
        return false;
    }, { passive: false });

    // ============================================================
    // 5. منع سحب الصور
    // ============================================================
    
    document.querySelectorAll('img, svg, canvas, video, iframe').forEach(function(el) {
        el.addEventListener('dragstart', function(e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }, { passive: false });
        el.addEventListener('drag', function(e) {
            e.preventDefault();
            return false;
        }, { passive: false });
        el.addEventListener('dragend', function(e) {
            e.preventDefault();
            return false;
        }, { passive: false });
    });

    // ============================================================
    // 6. منع الضغط المطول (Long Press)
    // ============================================================
    
    document.querySelectorAll('a, img, button, .card, .command-card').forEach(function(el) {
        el.addEventListener('touchstart', function(e) {
            this._touchTimer = setTimeout(function() {
                e.preventDefault();
                return false;
            }, 300);
        }, { passive: true });
        el.addEventListener('touchend', function(e) {
            if (this._touchTimer) {
                clearTimeout(this._touchTimer);
                this._touchTimer = null;
            }
        }, { passive: true });
        el.addEventListener('touchmove', function(e) {
            if (this._touchTimer) {
                clearTimeout(this._touchTimer);
                this._touchTimer = null;
            }
        }, { passive: true });
        el.addEventListener('touchcancel', function(e) {
            if (this._touchTimer) {
                clearTimeout(this._touchTimer);
                this._touchTimer = null;
            }
        }, { passive: true });
    });

    document.querySelectorAll('img').forEach(function(img) {
        img.addEventListener('touchstart', function(e) {
            e.preventDefault();
            return false;
        }, { passive: false });
        img.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            return false;
        }, { passive: false });
    });

    // ============================================================
    // 7. منع اختصارات لوحة المفاتيح
    // ============================================================
    
    document.addEventListener('keydown', function(e) {
        const ctrl = e.ctrlKey || e.metaKey;
        const key = e.key.toLowerCase();
        const forbidden = ['c', 'u', 's', 'p', 'v', 'x', 'a'];
        if (ctrl && forbidden.includes(key)) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
        if (e.key === 'F12') {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
        if (ctrl && e.shiftKey && (key === 'i' || key === 'j' || key === 'c')) {
            e.preventDefault();
            return false;
        }
        if (key === 'printscreen') {
            e.preventDefault();
            return false;
        }
    }, { passive: false });

    // ============================================================
    // 8. منع النسخ من القوائم
    // ============================================================
    
    document.addEventListener('copy', function(e) {
        e.preventDefault();
        return false;
    }, { capture: true, passive: false });

    // ============================================================
    // 9. منع حفظ الصور عبر السحب
    // ============================================================
    
    document.addEventListener('dragleave', function(e) {
        e.preventDefault();
        return false;
    }, { passive: false });

    document.addEventListener('dragover', function(e) {
        e.preventDefault();
        return false;
    }, { passive: false });

    // ============================================================
    // 10. منع فتح الصورة في تبويب جديد
    // ============================================================
    
    document.querySelectorAll('img').forEach(function(img) {
        img.addEventListener('click', function(e) {
            e.preventDefault();
            return false;
        }, { passive: false });
        img.addEventListener('mousedown', function(e) {
            if (e.button === 1 || e.button === 2) {
                e.preventDefault();
                return false;
            }
        }, { passive: false });
    });

    // ============================================================
    // 11. منع view-source:
    // ============================================================
    
    if (window.location.protocol === 'view-source:') {
        window.location.href = window.location.href.replace('view-source:', '');
    }

    console.log('✅ Protection.js - Système de protection avancé activé');

})();
PROTECTION_EOF

echo "✅ protection.js créé avec succès"
echo ""

# ====== 2. تحديث script.js ======
echo "📄 2. تحديث script.js..."
cat > assets/js/script.js << 'SCRIPT_EOF'
// ============================================================
// script.js - الوظائف العامة للموقع
// ============================================================

// ====== تحميل نظام الحماية ======
(function loadProtection() {
    const script = document.createElement('script');
    script.src = 'assets/js/protection.js';
    script.async = false;
    document.head.appendChild(script);
})();

// ====== زر العودة للأعلى ======
(function() {
    var scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-top-btn';
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollBtn.setAttribute('aria-label', 'Retour en haut');
    document.body.appendChild(scrollBtn);

    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });

    scrollBtn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();

// ====== شريط تقدم القراءة ======
(function() {
    var progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    progressBar.id = 'progressBar';
    document.body.appendChild(progressBar);

    function updateProgress() {
        var scrollTop = window.scrollY;
        var docHeight = document.documentElement.scrollHeight - window.innerHeight;
        var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = Math.min(progress, 100) + '%';
    }

    window.addEventListener('scroll', updateProgress);
    window.addEventListener('resize', updateProgress);
    updateProgress();
})();

// ====== تأثير القائمة عند التمرير ======
window.addEventListener('scroll', function() {
    var navbar = document.getElementById('navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});

// ====== تأثيرات عند تحميل الصفحة ======
document.addEventListener('DOMContentLoaded', function() {
    document.body.classList.add('page-transition');
    setTimeout(function() {
        document.body.classList.remove('page-transition');
    }, 1000);
});

console.log('✅ Xpert - Scripts chargés avec succès !');

// ============================================================
// خلفية الزليج
// ============================================================

function runZellijAnimation() {
    const overlay = document.getElementById('overlayProtection');
    if (overlay) overlay.classList.add('active');
    
    gsap.set('.moroccan-bg', { opacity: 0 });
    gsap.set('.moroccan-shadow', { opacity: 0 });
    gsap.set('.moroccan-star', { opacity: 0 });
    gsap.set('.geo-pattern', { opacity: 0 });
    
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    
    tl
        .to('.moroccan-bg', { opacity: 0.6, duration: 2, ease: 'power1.out' })
        .to('.moroccan-shadow', { opacity: 0.08, duration: 2, ease: 'power1.out' }, '-=1.4')
        .to('.moroccan-star', { opacity: 0.04, duration: 2, ease: 'power1.out' }, '-=1.4')
        .to('.geo-pattern', { opacity: 0.03, duration: 2, stagger: 0.08, ease: 'power1.out' }, '-=1.6')
        .call(() => {
            if (overlay) {
                overlay.classList.remove('active');
                overlay.classList.add('hidden');
                overlay.style.display = 'none';
                overlay.style.pointerEvents = 'none';
            }
        });
    
    gsap.to('.moroccan-bg', { opacity: 0.8, duration: 4, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('.moroccan-star', { rotation: 360, duration: 30, repeat: -1, ease: 'none' });
    gsap.to('.geo-pattern-1', { x: 25, y: 12, duration: 5, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('.geo-pattern-2', { x: -25, y: -12, duration: 5, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1.2 });
}

function showZellijDirect() {
    gsap.set('.moroccan-bg', { opacity: 0.6 });
    gsap.set('.moroccan-shadow', { opacity: 0.08 });
    gsap.set('.moroccan-star', { opacity: 0.04 });
    gsap.set('.geo-pattern', { opacity: 0.03 });
    
    gsap.to('.moroccan-bg', { opacity: 0.8, duration: 4, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('.moroccan-star', { rotation: 360, duration: 30, repeat: -1, ease: 'none' });
    gsap.to('.geo-pattern-1', { x: 25, y: 12, duration: 5, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('.geo-pattern-2', { x: -25, y: -12, duration: 5, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1.2 });
    
    const overlay = document.getElementById('overlayProtection');
    if (overlay) {
        overlay.classList.remove('active');
        overlay.classList.add('hidden');
        overlay.style.display = 'none';
        overlay.style.pointerEvents = 'none';
    }
}

console.log('✅ Zellij background functions loaded');
SCRIPT_EOF

echo "✅ script.js mis à jour"
echo ""

# ====== 3. تحديث style.css ======
echo "📄 3. تحديث style.css..."
cat >> assets/css/style.css << 'STYLE_EOF'

/* ============================================================
   حماية إضافية - منع التحديد والنسخ
   ============================================================ */

* {
    -webkit-user-select: none !important;
    -moz-user-select: none !important;
    -ms-user-select: none !important;
    user-select: none !important;
    -webkit-touch-callout: none !important;
    touch-callout: none !important;
    -webkit-tap-highlight-color: transparent !important;
}

input, textarea, [contenteditable="true"] {
    -webkit-user-select: text !important;
    -moz-user-select: text !important;
    -ms-user-select: text !important;
    user-select: text !important;
}

img, svg, canvas, video {
    -webkit-user-drag: none !important;
    -moz-user-drag: none !important;
    -ms-user-drag: none !important;
    user-drag: none !important;
    pointer-events: none !important;
    -webkit-touch-callout: none !important;
    touch-callout: none !important;
}

img::selection, svg::selection, canvas::selection {
    background: transparent !important;
    color: transparent !important;
}

a, button, .card, .command-card {
    -webkit-touch-callout: none !important;
    touch-callout: none !important;
}

body {
    -webkit-touch-callout: none !important;
    touch-callout: none !important;
}
STYLE_EOF

echo "✅ style.css mis à jour"
echo ""

# ====== 4. تحديث lesson-common.css ======
echo "📄 4. تحديث lesson-common.css..."
cat >> assets/css/lesson-common.css << 'LESSON_EOF'

/* ============================================================
   حماية إضافية للصور - منع التحميل والضغط المطول
   ============================================================ */

img, svg, canvas, video {
    -webkit-user-drag: none !important;
    -moz-user-drag: none !important;
    -ms-user-drag: none !important;
    user-drag: none !important;
    -webkit-touch-callout: none !important;
    touch-callout: none !important;
    pointer-events: none !important;
}

img {
    -webkit-touch-callout: none !important;
    touch-callout: none !important;
    -webkit-tap-highlight-color: transparent !important;
}

img::selection, svg::selection, canvas::selection {
    background: transparent !important;
    color: transparent !important;
}

* {
    -webkit-touch-callout: none !important;
    touch-callout: none !important;
    -webkit-tap-highlight-color: transparent !important;
}

* {
    -webkit-user-select: none !important;
    -moz-user-select: none !important;
    -ms-user-select: none !important;
    user-select: none !important;
}

input, textarea, [contenteditable="true"] {
    -webkit-user-select: text !important;
    -moz-user-select: text !important;
    -ms-user-select: text !important;
    user-select: text !important;
}

body {
    -webkit-touch-callout: none !important;
    touch-callout: none !important;
}

img[src] {
    -webkit-touch-callout: none !important;
    touch-callout: none !important;
    pointer-events: none !important;
}
LESSON_EOF

echo "✅ lesson-common.css mis à jour"
echo ""

# ====== 5. إضافة protection.js إلى جميع صفحات HTML ======
echo "📄 5. إضافة protection.js إلى جميع صفحات HTML..."

# ====== 5.1 index.html ======
echo "   - index.html..."
sed -i '/<script src="assets\/js\/script.js"><\/script>/i\    <script src="assets/js/protection.js"></script>' index.html 2>/dev/null || echo "   ⚠️ index.html non trouvé"

# ====== 5.2 subjects.html ======
echo "   - subjects.html..."
sed -i '/<script src="assets\/js\/script.js"><\/script>/i\    <script src="assets/js/protection.js"></script>' subjects.html 2>/dev/null || echo "   ⚠️ subjects.html non trouvé"

# ====== 5.3 subject.html ======
echo "   - subject.html..."
sed -i '/<script src="assets\/js\/script.js"><\/script>/i\    <script src="assets/js/protection.js"></script>' subject.html 2>/dev/null || echo "   ⚠️ subject.html non trouvé"

# ====== 5.4 جميع صفحات content ======
echo "   - content/ (جميع صفحات HTML)..."
find content -name "*.html" -type f 2>/dev/null | while read file; do
    sed -i '/<script src="..\/..\/..\/assets\/js\/script.js"><\/script>/i\    <script src="../../../assets/js/protection.js"></script>' "$file" 2>/dev/null
    sed -i '/<script src="..\/..\/..\/..\/assets\/js\/script.js"><\/script>/i\    <script src="../../../../assets/js/protection.js"></script>' "$file" 2>/dev/null
    sed -i '/<script src="..\/..\/..\/..\/..\/assets\/js\/script.js"><\/script>/i\    <script src="../../../../../assets/js/protection.js"></script>' "$file" 2>/dev/null
    echo "     ✅ $(basename "$file")"
done

echo ""
echo "=========================================="
echo "✅ تم تحديث جميع صفحات HTML بنظام الحماية!"
echo "=========================================="
echo ""
echo "📊 ملخص التحديثات:"
echo "   📄 assets/js/protection.js - تم الإنشاء"
echo "   📄 assets/js/script.js - تم التحديث"
echo "   📄 assets/css/style.css - تم التحديث"
echo "   📄 assets/css/lesson-common.css - تم التحديث"
echo "   📄 index.html - تم التحديث"
echo "   📄 subjects.html - تم التحديث"
echo "   📄 subject.html - تم التحديث"
echo "   📄 content/ - تم تحديث جميع صفحات HTML"
echo ""
echo "🛡️ الحماية المطبقة:"
echo "   ✅ منع تحديد النصوص (Selection)"
echo "   ✅ منع النسخ (Copy/Cut)"
echo "   ✅ منع القائمة المختصرة (Clic droit)"
echo "   ✅ منع سحب الصور (Drag & Drop)"
echo "   ✅ منع الضغط المطول (Long Press)"
echo "   ✅ منع اختصارات الكيبورد (Ctrl+C, Ctrl+S, F12...)"
echo "   ✅ منع حفظ الصور"
echo "   ✅ منع فتح الصورة في تبويب جديد"
echo "   ✅ منع أدوات المطور"
echo ""

