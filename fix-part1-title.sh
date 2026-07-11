#!/bin/bash

# ============================================================
# سكربت تعديل عنوان Partie 1
# تغيير "Rappels" إلى "Notions de base"
# ============================================================

echo "🔄 بدء تعديل عنوان Partie 1..."

cd /storage/emulated/0/Web/content/math/lessons/logique

# ====== 1. عمل نسخة احتياطية ======
cp part1.html part1.html.bak
echo "✅ تم إنشاء نسخة احتياطية: part1.html.bak"

# ====== 2. تغيير العنوان ======
sed -i 's/Partie 1 : Rappels/Partie 1 : Notions de base/g' part1.html

# ====== 3. تغيير العنوان في <title> ======
sed -i 's/Partie 1 - Rappels/Partie 1 - Notions de base/g' part1.html

# ====== 4. عرض النتيجة ======
echo ""
echo "=================================================="
echo "✅ تم تعديل عنوان Partie 1 بنجاح!"
echo ""
echo "📋 التغيير المطبق:"
echo "   ❌ Partie 1 : Rappels"
echo "   ✅ Partie 1 : Notions de base"
echo ""
echo "📁 الملفات:"
echo "   ✅ part1.html (معدل)"
echo "   📦 part1.html.bak (نسخة احتياطية)"
echo "=================================================="
echo ""
echo "📤 لرفع التغييرات إلى GitHub:"
echo "   cd /storage/emulated/0/Web"
echo "   git add ."
echo "   git commit -m '📝 تغيير عنوان Partie 1 إلى Notions de base'"
echo "   git pull --rebase origin main"
echo "   git push"
echo "=================================================="

