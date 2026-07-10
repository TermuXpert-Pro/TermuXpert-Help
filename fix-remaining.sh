#!/bin/bash

echo "=========================================="
echo "🔧 إصلاح المشاكل المتبقية"
echo "=========================================="

cd /storage/emulated/0/Web

# 1. إزالة تكرار script.js من part1-5
echo ""
echo "📦 1. إزالة تكرار script.js من part1-5..."
for i in 1 2 3 4 5; do
    # حذف جميع أسطر script.js باستثناء الأول
    sed -i '/<script src="..\/..\/..\/..\/assets\/js\/script.js"><\/script>/d' content/math/lessons/fonctions/part${i}.html
    # إضافة سطر واحد فقط بعد footer
    sed -i '/<\/footer>/a \ \n    <script src="..\/..\/..\/..\/assets\/js/script.js"><\/script>' content/math/lessons/fonctions/part${i}.html
done
echo "   ✅ script.js duplicates removed"

# 2. إزالة تكرار runZellijAnimation من part1-5
echo ""
echo "📦 2. إزالة تكرار runZellijAnimation من part1-5..."
for i in 1 2 3 4 5; do
    sed -i '/document.addEventListener("DOMContentLoaded"/,/^[[:space:]]*}[[:space:]]*$/d' content/math/lessons/fonctions/part${i}.html
done
echo "   ✅ runZellijAnimation removed"

# 3. حذف ملفات .backup
echo ""
echo "📦 3. حذف ملفات .backup..."
find content -name "*.backup" -delete
echo "   ✅ Backup files deleted"

# 4. تغيير MathJax من async إلى defer
echo ""
echo "📦 4. تغيير MathJax من async إلى defer..."
find content -name "*.html" -exec sed -i 's|src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js" async|src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js" defer|g' {} \;
echo "   ✅ MathJax async → defer"

# 5. إزالة CSS المكرر من part1-5
echo ""
echo "📦 5. إزالة CSS المكرر من part1-5..."
for i in 1 2 3 4 5; do
    sed -i '/\.exercice-box {/,/^[[:space:]]*}/d' content/math/lessons/fonctions/part${i}.html
    sed -i '/\.solution-box .sol-content {/,/^[[:space:]]*}/d' content/math/lessons/fonctions/part${i}.html
    sed -i '/\.toggle-sol {/,/^[[:space:]]*}/d' content/math/lessons/fonctions/part${i}.html
    sed -i '/\.footer p {/,/^[[:space:]]*}/d' content/math/lessons/fonctions/part${i}.html
    sed -i '/\.nav-buttons {/,/^[[:space:]]*}/d' content/math/lessons/fonctions/part${i}.html
    sed -i '/\.back-btn, .next-btn {/,/^[[:space:]]*}/d' content/math/lessons/fonctions/part${i}.html
    sed -i '/\.lesson-container {/,/^[[:space:]]*}/d' content/math/lessons/fonctions/part${i}.html
    sed -i '/\.glow-orb {/,/^[[:space:]]*}/d' content/math/lessons/fonctions/part${i}.html
    sed -i '/\.bg-grid {/,/^[[:space:]]*}/d' content/math/lessons/fonctions/part${i}.html
    sed -i '/details summary {/,/^[[:space:]]*}/d' content/math/lessons/fonctions/part${i}.html
    sed -i '/details div {/,/^[[:space:]]*}/d' content/math/lessons/fonctions/part${i}.html
    sed -i '/\.navbar.scrolled {/,/^[[:space:]]*}/d' content/math/lessons/fonctions/part${i}.html
    sed -i '/\.progress-bar {/,/^[[:space:]]*}/d' content/math/lessons/fonctions/part${i}.html
    sed -i '/\.scroll-top-btn {/,/^[[:space:]]*}/d' content/math/lessons/fonctions/part${i}.html
done
echo "   ✅ Duplicate CSS removed"

echo ""
echo "=========================================="
echo "✅ جميع الإصلاحات المتبقية تمت!"
echo "=========================================="
