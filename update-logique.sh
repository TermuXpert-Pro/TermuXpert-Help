#!/bin/bash

# ============================================================
# سكربت تحديث مسار درس المنطق
# إزالة الملف القديم وإضافة المسار الجديد
# ============================================================

echo "🔄 بدء تحديث درس المنطق..."

# ====== 1. حذف الملف القديم ======
echo "📁 حذف الملف القديم..."
rm -f /storage/emulated/0/Web/content/math/lessons/logique/logique.html

# ====== 2. إنشاء المجلد إذا لم يكن موجوداً ======
echo "📁 التأكد من وجود المجلد..."
mkdir -p /storage/emulated/0/Web/content/math/lessons/logique

# ====== 3. التحقق من وجود الملفات الجديدة ======
echo "🔍 التحقق من الملفات الجديدة..."
if [ -f "/storage/emulated/0/Web/content/math/lessons/logique/index.html" ]; then
    echo "✅ index.html موجود"
else
    echo "❌ index.html غير موجود! يرجى إنشاؤه أولاً."
    exit 1
fi

if [ -f "/storage/emulated/0/Web/content/math/lessons/logique/part1.html" ]; then
    echo "✅ part1.html موجود"
else
    echo "❌ part1.html غير موجود! يرجى إنشاؤه أولاً."
    exit 1
fi

if [ -f "/storage/emulated/0/Web/content/math/lessons/logique/part2.html" ]; then
    echo "✅ part2.html موجود"
else
    echo "❌ part2.html غير موجود! يرجى إنشاؤه أولاً."
    exit 1
fi

if [ -f "/storage/emulated/0/Web/content/math/lessons/logique/part3.html" ]; then
    echo "✅ part3.html موجود"
else
    echo "❌ part3.html غير موجود! يرجى إنشاؤه أولاً."
    exit 1
fi

if [ -f "/storage/emulated/0/Web/content/math/lessons/logique/part4.html" ]; then
    echo "✅ part4.html موجود"
else
    echo "❌ part4.html غير موجود! يرجى إنشاؤه أولاً."
    exit 1
fi

if [ -f "/storage/emulated/0/Web/content/math/lessons/logique/part5.html" ]; then
    echo "✅ part5.html موجود"
else
    echo "❌ part5.html غير موجود! يرجى إنشاؤه أولاً."
    exit 1
fi

# ====== 4. تحديث ملف subjects.json ======
echo "📝 تحديث subjects.json..."
cd /storage/emulated/0/Web

# ====== 5. التحقق من صحة الروابط ======
echo "🔗 التحقق من الروابط..."

# التحقق من الرابط في subject.html
if grep -q "content/math/lessons/logique/logique.html" subject.html; then
    echo "⚠️  يوجد رابط قديم في subject.html"
    echo "🔄 تحديث الرابط القديم إلى المسار الجديد..."
    sed -i 's|content/math/lessons/logique/logique.html|content/math/lessons/logique/index.html|g' subject.html
    echo "✅ تم تحديث الرابط في subject.html"
fi

# التحقق من الرابط في sitemap.xml
if [ -f "sitemap.xml" ]; then
    if grep -q "content/math/lessons/logique/logique.html" sitemap.xml; then
        echo "⚠️  يوجد رابط قديم في sitemap.xml"
        sed -i 's|content/math/lessons/logique/logique.html|content/math/lessons/logique/index.html|g' sitemap.xml
        echo "✅ تم تحديث الرابط في sitemap.xml"
    fi
fi

# ====== 6. عرض النتيجة ======
echo ""
echo "=================================================="
echo "✅ تحديث درس المنطق اكتمل بنجاح!"
echo ""
echo "📁 الملفات الموجودة:"
ls -la /storage/emulated/0/Web/content/math/lessons/logique/
echo ""
echo "🔗 المسار الجديد:"
echo "   content/math/lessons/logique/index.html"
echo "   content/math/lessons/logique/part1.html"
echo "   content/math/lessons/logique/part2.html"
echo "   content/math/lessons/logique/part3.html"
echo "   content/math/lessons/logique/part4.html"
echo "   content/math/lessons/logique/part5.html"
echo ""
echo "🗑️  الملف القديم المحذوف:"
echo "   content/math/lessons/logique/logique.html ❌"
echo "=================================================="

# ====== 7. اقتراح رفع التغييرات ======
echo ""
echo "📤 لرفع التغييرات إلى GitHub:"
echo "   cd /storage/emulated/0/Web"
echo "   git add ."
echo "   git commit -m '🔄 تحديث درس المنطق - إضافة 5 أجزاء + ملخص'"
echo "   git pull --rebase origin main"
echo "   git push"
echo "=================================================="

