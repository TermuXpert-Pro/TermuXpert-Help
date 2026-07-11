#!/bin/bash

# ============================================================
# سكربت إعادة ترتيب أجزاء الباريوسانتر
# Partie 4 = Résumé, Partie 6 devient Partie 4
# ============================================================

echo "🔄 بدء إعادة ترتيب أجزاء الباريوسانتر..."

cd /storage/emulated/0/Web/content/math/lessons/barycentre

# ============================================================
# 1. تغيير اسم part6.html إلى part4.html
# ============================================================
echo "📝 تغيير اسم part6.html → part4.html..."

if [ -f "part6.html" ]; then
    mv part6.html part4.html
    echo "✅ part6.html → part4.html"
else
    echo "❌ part6.html غير موجود!"
    exit 1
fi

# ============================================================
# 2. تعديل part4.html (Résumé) - تغيير العنوان
# ============================================================
echo "📝 تعديل part4.html (Résumé)..."

sed -i 's/Partie 6 : Résumé complet/Partie 4 : Résumé complet/g' part4.html
sed -i 's/Partie 6 - Résumé complet/Partie 4 - Résumé complet/g' part4.html
sed -i 's/<title>Résumé complet - Barycentre dans le plan | Xpert<\/title>/<title>Partie 4 - Résumé complet | Xpert<\/title>/g' part4.html

echo "✅ part4.html modifié"

# ============================================================
# 3. تعديل أزرار التنقل في part4.html (Résumé)
# ============================================================
echo "📝 تعديل أزرار التنقل في part4.html..."

sed -i '/<div class="nav-buttons">/,/<\/div>/c\
            <!-- ============================================================ -->\
            <!-- Navigation -->\
            <!-- ============================================================ -->\
            <div class="nav-buttons">\
                <a href="part3.html" class="back-btn" style="margin-bottom:0;"><i class="fas fa-arrow-right"></i> Partie 3</a>\
                <a href="index.html" class="next-btn">Accueil <i class="fas fa-arrow-left"></i></a>\
            </div>' part4.html

echo "✅ أزرار التنقل في part4.html معدلة"

# ============================================================
# 4. تعديل index.html - إزالة Partie 6 وإضافة Partie 4
# ============================================================
echo "📝 تعديل index.html..."

# حذف Partie 6 القديمة
sed -i '/<!-- Partie 6 -->/,/<\/a>/d' index.html

# حذف Partie 4 القديمة إن وجدت
sed -i '/<!-- Partie 4 -->/,/<\/a>/d' index.html

# إضافة Partie 4 الجديدة (Résumé) بعد Partie 3
sed -i '/<!-- Partie 3 -->/a\
                <!-- Partie 4 -->\
                <a href="part4.html" class="part-link" style="display:block; background:var(--bg-card); border:1px solid var(--border); border-radius:8px; padding:8px 12px; margin-bottom:8px; color:var(--text-primary); text-decoration:none; transition:all 0.3s ease; cursor:pointer;">\
                    <div style="display:flex; align-items:center; gap:10px;">\
                        <span style="color:#F4D03F; font-size:18px; flex-shrink:0;"><i class="fas fa-book-open"></i></span>\
                        <div style="flex:1;">\
                            <div style="color:#F4D03F; font-weight:700; font-size:13px;">Partie 4</div>\
                            <div style="color:var(--text-secondary); font-size:12px; line-height:1.4;">Résumé complet - Synthèse du cours</div>\
                        </div>\
                        <span style="color:var(--text-muted); font-size:12px; flex-shrink:0;"><i class="fas fa-chevron-left"></i></span>\
                    </div>\
                </a>' index.html

echo "✅ index.html modifié"

# ============================================================
# 5. تعديل أزرار التنقل في part3.html
# ============================================================
echo "📝 تعديل part3.html (Partie 3 → Résumé)..."

sed -i '/<div class="nav-buttons">/,/<\/div>/c\
            <!-- ============================================================ -->\
            <!-- Navigation -->\
            <!-- ============================================================ -->\
            <div class="nav-buttons">\
                <a href="part2.html" class="back-btn" style="margin-bottom:0;"><i class="fas fa-arrow-right"></i> Partie 2</a>\
                <a href="part4.html" class="next-btn">Résumé <i class="fas fa-arrow-left"></i></a>\
            </div>' part3.html

echo "✅ part3.html modifié (→ Résumé)"

# ============================================================
# 6. عرض النتيجة
# ============================================================
echo ""
echo "=================================================="
echo "✅ تم إعادة ترتيب الأجزاء بنجاح!"
echo ""
echo "📋 الترتيب الجديد:"
echo "   Partie 1 → Barycentre de deux points pondérés"
echo "   Partie 2 → Barycentre de trois points pondérés"
echo "   Partie 3 → Barycentre de quatre points pondérés"
echo "   Partie 4 → Résumé complet - Synthèse du cours  ✨"
echo ""
echo "🔗 التنقل الجديد:"
echo "   Partie 3 → Résumé (Partie 4) → Accueil"
echo ""
echo "📁 الملفات المعدلة:"
ls -la part*.html
echo ""
echo "=================================================="
echo ""
echo "📤 لرفع التغييرات إلى GitHub:"
echo "   cd /storage/emulated/0/Web"
echo "   git add ."
echo "   git commit -m '🔄 إعادة ترتيب أجزاء الباريوسانتر: Résumé devient Partie 4'"
echo "   git pull --rebase origin main"
echo "   git push"
echo "=================================================="

