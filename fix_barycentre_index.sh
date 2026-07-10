#!/bin/bash

# ============================================================
# fix_barycentre_index.sh
# إزالة البطاقة "Cliquez sur une partie..." من barycentre/index.html
# ============================================================

echo "=========================================="
echo "🔧 إصلاح صفحة index الخاصة بدرس barycentre"
echo "=========================================="
echo ""

cd /storage/emulated/0/Web || exit 1

FILE="content/math/lessons/barycentre/index.html"

if [ ! -f "$FILE" ]; then
    echo "❌ الملف غير موجود: $FILE"
    exit 1
fi

echo "📂 الملف: $FILE"
echo ""

# ====== نسخ احتياطي ======
cp "$FILE" "$FILE.backup"
echo "📦 نسخة احتياطية: $FILE.backup"
echo ""

# ====== إزالة البطاقة ======
echo "🗑️ إزالة البطاقة 'Cliquez sur une partie...'..."

sed -i '/<div style="text-align:center; margin-top:16px; padding:10px; background:var(--bg-card); border-radius:10px; border:1px solid var(--border);">/,/<\/div>/d' "$FILE"

echo "✅ تم إزالة البطاقة"
echo ""

# ====== التحقق ======
echo "📋 التحقق من التعديلات:"
if grep -q "Cliquez sur une partie" "$FILE" 2>/dev/null; then
    echo "⚠️ البطاقة لا تزال موجودة"
else
    echo "✅ البطاقة تمت إزالتها بنجاح"
fi

echo ""
echo "=========================================="
echo "✅ تم إصلاح الصفحة!"
echo "=========================================="
echo ""
echo "📂 الملف المعدل: $FILE"
echo "📦 النسخة الاحتياطية: $FILE.backup"
echo ""
echo "🔄 يمكنك استعادة النسخة الأصلية بـ:"
echo "   cp $FILE.backup $FILE"
