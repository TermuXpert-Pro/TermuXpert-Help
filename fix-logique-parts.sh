#!/bin/bash

# ============================================================
# سكربت تعديل أجزاء المنطق لتكون مطابقة تماماً لدروس fonctions
# ============================================================

echo "🔄 بدء تعديل أجزاء المنطق..."

cd /storage/emulated/0/Web/content/math/lessons/logique

# ============================================================
# دالة تعديل ملف part
# ============================================================
fix_part() {
    local file=$1
    local num=$2
    local prev=$3
    local next=$4
    local title=$5
    
    echo "📝 تعديل $file..."
    
    # ====== 1. إزالة جميع البادجات (badges) ======
    sed -i '/<span class="badge-part"/d' "$file"
    sed -i '/1 Bac Sc/d' "$file"
    sed -i '/Chapitre/d' "$file"
    
    # ====== 2. إزالة الأيقونات الإضافية من العنوان ======
    sed -i 's/<i class="fas fa-[^"]*"><\/i> //g' "$file"
    
    # ====== 3. تعديل هيكل العنوان ======
    sed -i "s/Partie $num : .*/Partie $num : $title/" "$file"
    
    # ====== 4. إزالة السطر الذي يحتوي على البادجات ======
    sed -i '/<p style="text-align:center; color:var(--text-muted); font-size:13px; margin-bottom:16px;">/,/<\/p>/d' "$file"
    
    # ====== 5. تعديل أزرار التنقل ======
    # حذف الأزرار القديمة بالكامل
    sed -i '/<div class="nav-buttons">/,/<\/div>/d' "$file"
    
    # ====== 6. إضافة أزرار جديدة مطابقة لـ fonctions ======
    cat >> "$file" << 'NAVEOF'
            <!-- ============================================================ -->
            <!-- Navigation -->
            <!-- ============================================================ -->
            <div class="nav-buttons">
NAVEOF
    
    # زر العودة إلى الفهرس
    if [ "$num" = "1" ]; then
        echo '                <a href="index.html" class="back-btn"><i class="fas fa-arrow-right"></i> Retour</a>' >> "$file"
    else
        echo "                <a href=\"part$prev.html\" class=\"back-btn\"><i class=\"fas fa-arrow-right\"></i> Partie $prev</a>" >> "$file"
    fi
    
    # زر التالي
    if [ "$num" = "5" ]; then
        echo '                <a href="index.html" class="next-btn">Accueil <i class="fas fa-arrow-left"></i></a>' >> "$file"
    else
        echo "                <a href=\"part$next.html\" class=\"next-btn\">Partie $next <i class=\"fas fa-arrow-left\"></i></a>" >> "$file"
    fi
    
    echo '            </div>' >> "$file"
    
    echo "✅ تم تعديل $file"
}

# ============================================================
# تعديل جميع الأجزاء
# ============================================================

fix_part "part1.html" "1" "" "2" "Rappels"
fix_part "part2.html" "2" "1" "3" "Fonction majorée - minorée - bornée - Extremums"
fix_part "part3.html" "3" "2" "4" "Comparaison de fonctions - Composée"
fix_part "part4.html" "4" "3" "5" "Étude des fonctions de référence"
fix_part "part5.html" "5" "4" "" "Exercices"

# ============================================================
# تنظيف الأسطر الفارغة المزدوجة
# ============================================================
echo "🧹 تنظيف الأسطر الفارغة..."

for file in part1.html part2.html part3.html part4.html part5.html; do
    sed -i '/^[[:space:]]*$/d' "$file"
done

# ============================================================
# عرض النتيجة
# ============================================================
echo ""
echo "=================================================="
echo "✅ تم تعديل جميع الأجزاء بنجاح!"
echo ""
echo "📁 الملفات المعدلة:"
ls -la part*.html
echo ""
echo "📋 التعديلات المطبقة:"
echo "   ✅ إزالة جميع البادجات (1 Bac, Chapitre)"
echo "   ✅ توحيد أزرار العودة مع fonctions"
echo "   ✅ إضافة أيقونات في الأزرار مثل fonctions"
echo "   ✅ التنقل الصحيح بين الأجزاء"
echo "=================================================="
echo ""
echo "📤 لرفع التغييرات إلى GitHub:"
echo "   cd /storage/emulated/0/Web"
echo "   git add ."
echo "   git commit -m '🎨 توحيد أجزاء المنطق مع fonctions'"
echo "   git pull --rebase origin main"
echo "   git push"
echo "=================================================="

