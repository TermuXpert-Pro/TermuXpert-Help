#!/bin/bash

# ============================================================
# سكربت إعادة ترتيب أجزاء الدوال
# Partie 4 → Résumé → Exercices → index
# ============================================================

echo "🔄 بدء إعادة ترتيب أجزاء الدوال..."

cd /storage/emulated/0/Web/content/math/lessons/fonctions

# ============================================================
# 1. تعديل part4.html (زر الانتقال إلى Résumé)
# ============================================================
echo "📝 تعديل part4.html..."

sed -i '/<div class="nav-buttons">/,/<\/div>/c\
            <!-- ============================================================ -->\
            <!-- Navigation -->\
            <!-- ============================================================ -->\
            <div class="nav-buttons">\
                <a href="part3.html" class="back-btn" style="margin-bottom:0;"><i class="fas fa-arrow-right"></i> Partie 3</a>\
                <a href="part6.html" class="next-btn">Résumé <i class="fas fa-arrow-left"></i></a>\
            </div>' part4.html

echo "✅ part4.html modifié (→ Résumé)"

# ============================================================
# 2. تعديل part6.html (Résumé → Exercices)
# ============================================================
echo "📝 تعديل part6.html..."

sed -i '/<div class="nav-buttons">/,/<\/div>/c\
            <!-- ============================================================ -->\
            <!-- Navigation -->\
            <!-- ============================================================ -->\
            <div class="nav-buttons">\
                <a href="part4.html" class="back-btn" style="margin-bottom:0;"><i class="fas fa-arrow-right"></i> Partie 4</a>\
                <a href="part5.html" class="next-btn">Exercices <i class="fas fa-arrow-left"></i></a>\
            </div>' part6.html

echo "✅ part6.html modifié (Résumé → Exercices)"

# ============================================================
# 3. تعديل part5.html (Exercices → index)
# ============================================================
echo "📝 تعديل part5.html..."

sed -i '/<div class="nav-buttons">/,/<\/div>/c\
            <!-- ============================================================ -->\
            <!-- Navigation -->\
            <!-- ============================================================ -->\
            <div class="nav-buttons">\
                <a href="part6.html" class="back-btn" style="margin-bottom:0;"><i class="fas fa-arrow-right"></i> Résumé</a>\
                <a href="index.html" class="next-btn">Accueil <i class="fas fa-arrow-left"></i></a>\
            </div>' part5.html

echo "✅ part5.html modifié (Exercices → Accueil)"

# ============================================================
# 4. تعديل index.html (إعادة ترتيب Partie 5 و 6)
# ============================================================
echo "📝 تعديل index.html..."

# حذف Partie 5 و Partie 6 الحالية
sed -i '/<!-- Partie 5 -->/,/<\/a>/d' index.html
sed -i '/<!-- Partie 6 -->/,/<\/a>/d' index.html

# إضافة Partie 5 (Résumé) و Partie 6 (Exercices) بالترتيب الجديد
sed -i '/<!-- Partie 4 -->/a\
                <!-- Partie 5 -->\
                <a href="part6.html" class="part-link" style="display:block; background:var(--bg-card); border:1px solid var(--border); border-radius:8px; padding:8px 12px; margin-bottom:8px; color:var(--text-primary); text-decoration:none; transition:all 0.3s ease; cursor:pointer;">\
                    <div style="display:flex; align-items:center; gap:10px;">\
                        <span style="color:#F4D03F; font-size:18px; flex-shrink:0;"><i class="fas fa-book-open"></i></span>\
                        <div style="flex:1;">\
                            <div style="color:#F4D03F; font-weight:700; font-size:13px;">Partie 5</div>\
                            <div style="color:var(--text-secondary); font-size:12px; line-height:1.4;">Résumé complet - Synthèse du cours</div>\
                        </div>\
                        <span style="color:var(--text-muted); font-size:12px; flex-shrink:0;"><i class="fas fa-chevron-left"></i></span>\
                    </div>\
                </a>\
\
                <!-- Partie 6 -->\
                <a href="part5.html" class="part-link" style="display:block; background:var(--bg-card); border:1px solid var(--border); border-radius:8px; padding:8px 12px; margin-bottom:8px; color:var(--text-primary); text-decoration:none; transition:all 0.3s ease; cursor:pointer;">\
                    <div style="display:flex; align-items:center; gap:10px;">\
                        <span style="color:#4ECDC4; font-size:18px; flex-shrink:0;"><i class="fas fa-pencil"></i></span>\
                        <div style="flex:1;">\
                            <div style="color:#4ECDC4; font-weight:700; font-size:13px;">Partie 6</div>\
                            <div style="color:var(--text-secondary); font-size:12px; line-height:1.4;">Exercices</div>\
                        </div>\
                        <span style="color:var(--text-muted); font-size:12px; flex-shrink:0;"><i class="fas fa-chevron-left"></i></span>\
                    </div>\
                </a>' index.html

echo "✅ index.html modifié (Partie 5: Résumé, Partie 6: Exercices)"

# ============================================================
# 5. عرض النتيجة
# ============================================================
echo ""
echo "=================================================="
echo "✅ تم إعادة ترتيب الأجزاء بنجاح!"
echo ""
echo "📋 الترتيب الجديد:"
echo "   Partie 1 → Rappels"
echo "   Partie 2 → Fonction majorée - minorée - bornée - Extremums"
echo "   Partie 3 → Comparaison - Composée"
echo "   Partie 4 → Étude des fonctions de référence"
echo "   Partie 5 → Résumé complet - Synthèse du cours  ✨"
echo "   Partie 6 → Exercices  ✨"
echo ""
echo "🔗 التنقل الجديد:"
echo "   Partie 4 → Résumé (Partie 5) → Exercices (Partie 6) → Accueil"
echo ""
echo "=================================================="
echo ""
echo "📤 لرفع التغييرات إلى GitHub:"
echo "   cd /storage/emulated/0/Web"
echo "   git add ."
echo "   git commit -m '🔄 إعادة ترتيب أجزاء الدوال: Résumé avant Exercices'"
echo "   git pull --rebase origin main"
echo "   git push"
echo "=================================================="

