#!/bin/bash

# ============================================================
# سكربت إزالة البطاقة الزائدة في part4.html
# إزالة قسم "Résumé général du cours" المكرر
# ============================================================

echo "🔄 بدء تصحيح part4.html..."

cd /storage/emulated/0/Web/content/math/lessons/logique

# ====== 1. عمل نسخة احتياطية ======
cp part4.html part4.html.bak
echo "✅ تم إنشاء نسخة احتياطية: part4.html.bak"

# ====== 2. إزالة قسم "to-resume" بالكامل ======
sed -i '/<div class="to-resume">/,/<\/div>/d' part4.html

# ====== 3. إزالة الأسطر الفارغة المزدوجة ======
sed -i '/^[[:space:]]*$/d' part4.html

# ====== 4. عرض النتيجة ======
echo ""
echo "=================================================="
echo "✅ تم تعديل part4.html بنجاح!"
echo ""
echo "📋 التعديلات المطبقة:"
echo "   ✅ إزالة قسم 'Résumé général du cours' المكرر"
echo "   ✅ إزالة النص 'Retrouvez toutes les définitions...'"
echo "   ✅ إزالة زر 'Voir le résumé général'"
echo ""
echo "📁 الملفات:"
echo "   ✅ part4.html (معدل)"
echo "   📦 part4.html.bak (نسخة احتياطية)"
echo "=================================================="
echo ""
echo "📤 لرفع التغييرات إلى GitHub:"
echo "   cd /storage/emulated/0/Web"
echo "   git add ."
echo "   git commit -m '🗑️ إزالة البطاقة الزائدة من part4.html'"
echo "   git pull --rebase origin main"
echo "   git push"
echo "=================================================="

