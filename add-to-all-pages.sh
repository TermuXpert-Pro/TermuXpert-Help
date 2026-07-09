#!/bin/bash

echo "🚀 بدء إضافة الخلفية المغربية لجميع الصفحات..."

# ====== الدروس الرئيسية (logique.html) ======
echo "📚 معالجة الدروس الرئيسية..."
for file in /storage/emulated/0/Web/lessons/*.html; do
    if [ -f "$file" ] && ! grep -q "add-moroccan-bg.js" "$file"; then
        sed -i 's|</body>|<script src="../js/add-moroccan-bg.js"></script>\n</body>|g' "$file"
        echo "   ✅ $(basename "$file")"
    fi
done

# ====== دوال (fonctions) ======
echo "📚 معالجة دروس الدوال..."
for file in /storage/emulated/0/Web/lessons/fonctions/*.html; do
    if [ -f "$file" ] && ! grep -q "add-moroccan-bg.js" "$file"; then
        sed -i 's|</body>|<script src="../../js/add-moroccan-bg.js"></script>\n</body>|g' "$file"
        echo "   ✅ fonctions/$(basename "$file")"
    fi
done

# ====== مركز الثقل (barycentre) ======
echo "📚 معالجة دروس مركز الثقل..."
for file in /storage/emulated/0/Web/lessons/barycentre/*.html; do
    if [ -f "$file" ] && ! grep -q "add-moroccan-bg.js" "$file"; then
        sed -i 's|</body>|<script src="../../js/add-moroccan-bg.js"></script>\n</body>|g' "$file"
        echo "   ✅ barycentre/$(basename "$file")"
    fi
done

# ====== تمارين المنطق ======
echo "📝 معالجة تمارين المنطق..."
for file in /storage/emulated/0/Web/exercices/logique/*.html; do
    if [ -f "$file" ] && ! grep -q "add-moroccan-bg.js" "$file"; then
        sed -i 's|</body>|<script src="../../js/add-moroccan-bg.js"></script>\n</body>|g' "$file"
        echo "   ✅ exercices/logique/$(basename "$file")"
    fi
done

# ====== تمارين الدوال ======
echo "📝 معالجة تمارين الدوال..."
for file in /storage/emulated/0/Web/exercices/fonctions/*.html; do
    if [ -f "$file" ] && ! grep -q "add-moroccan-bg.js" "$file"; then
        sed -i 's|</body>|<script src="../../js/add-moroccan-bg.js"></script>\n</body>|g' "$file"
        echo "   ✅ exercices/fonctions/$(basename "$file")"
    fi
done

# ====== سلاسل المنطق ======
echo "📋 معالجة سلاسل المنطق..."
for file in /storage/emulated/0/Web/series/logique/*.html; do
    if [ -f "$file" ] && ! grep -q "add-moroccan-bg.js" "$file"; then
        sed -i 's|</body>|<script src="../../js/add-moroccan-bg.js"></script>\n</body>|g' "$file"
        echo "   ✅ series/logique/$(basename "$file")"
    fi
done

# ====== سلاسل الدوال ======
echo "📋 معالجة سلاسل الدوال..."
for file in /storage/emulated/0/Web/series/fonctions/*.html; do
    if [ -f "$file" ] && ! grep -q "add-moroccan-bg.js" "$file"; then
        sed -i 's|</body>|<script src="../../js/add-moroccan-bg.js"></script>\n</body>|g' "$file"
        echo "   ✅ series/fonctions/$(basename "$file")"
    fi
done

echo ""
echo "🎉 انتهى! جميع الصفحات تم تحديثها."
echo ""
echo "📊 عدد الملفات المحدثة:"
grep -l "add-moroccan-bg.js" /storage/emulated/0/Web/**/*.html 2>/dev/null | wc -l
