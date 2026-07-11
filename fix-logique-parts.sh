#!/bin/bash

# ============================================================
# سكربت تعديل أجزاء المنطق لتكون متناسقة مع الدروس الأخرى
# إزالة بطاقات 1 Bac و Chapitre
# تعديل أزرار العودة في الأسفل
# ============================================================

echo "🔄 بدء تعديل أجزاء المنطق..."

cd /storage/emulated/0/Web/content/math/lessons/logique

# ============================================================
# دالة تعديل ملف part
# ============================================================
fix_part() {
    local file=$1
    echo "📝 تعديل $file..."
    
    # ====== 1. إزالة بطاقة "1 Bac Sc. expérimentale" ======
    sed -i '/<span class="badge-part".*1 Bac Sc. expérimentale/d' "$file"
    sed -i '/<span class="badge-part".*Chapitre/d' "$file"
    
    # ====== 2. إزالة السطر الذي يحتوي على البادجات ======
    sed -i '/<p style="text-align:center; color:var(--text-muted); font-size:13px; margin-bottom:16px;">/,/<\/p>/ {
        /<span class="badge-part"/d
        /1 Bac Sc/d
        /Chapitre/d
    }' "$file"
    
    # ====== 3. تعديل أزرار التنقل في الأسفل ======
    # تغيير "Partie X" إلى "Partie X" في زر العودة
    sed -i 's/Partie précédente/Partie précédente/g' "$file"
    sed -i 's/Partie suivante/Partie suivante/g' "$file"
    
    # ====== 4. التأكد من وجود class="back-btn" في أزرار العودة ======
    sed -i 's/<a href="part[0-9]\.html" class="prev-btn"/<a href="part[0-9]\.html" class="back-btn"/g' "$file"
    sed -i 's/<a href="part[0-9]\.html" class="next-btn"/<a href="part[0-9]\.html" class="back-btn"/g' "$file"
    
    # ====== 5. إزالة أيقونات إضافية من أزرار العودة ======
    sed -i 's/<i class="fas fa-arrow-right"><\/i> //g' "$file"
    sed -i 's/ <i class="fas fa-arrow-left"><\/i>//g' "$file"
    
    # ====== 6. توحيد أزرار العودة ======
    sed -i 's/class="back-btn"/class="back-btn"/g' "$file"
    
    echo "✅ تم تعديل $file"
}

# ============================================================
# تعديل جميع الأجزاء
# ============================================================

fix_part "part1.html"
fix_part "part2.html"
fix_part "part3.html"
fix_part "part4.html"
fix_part "part5.html"

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
echo "   ✅ إزالة بطاقة '1 Bac Sc. expérimentale'"
echo "   ✅ إزالة بطاقة 'Chapitre'"
echo "   ✅ توحيد أزرار العودة في الأسفل"
echo "   ✅ إزالة الأيقونات الإضافية من الأزرار"
echo "=================================================="
echo ""
echo "📤 لرفع التغييرات إلى GitHub:"
echo "   cd /storage/emulated/0/Web"
echo "   git add ."
echo "   git commit -m '🎨 توحيد تصميم أجزاء المنطق مع الدروس الأخرى'"
echo "   git pull --rebase origin main"
echo "   git push"
echo "=================================================="

