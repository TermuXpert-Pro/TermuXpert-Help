#!/usr/bin/env bash
# deploy.sh — سكريبت نشر واحد كيدير: build → validate → git add/commit/pull/push
# الاستخدام:
#   bash deploy.sh "رسالة الكوميت ديالك"
# إلا مادرتيش رسالة، غادي يستعمل رسالة بالتاريخ والوقت تلقائيا.

set -e  # وقف مباشرة إلا وقع أي خطأ

cd "$(dirname "$0")" 2>/dev/null || true
# ⚠️ بدل هاد السطر بمسار مشروعك الحقيقي إلا الملف ماشي جوا الفولدر
PROJECT_DIR="/storage/emulated/0/Web"
cd "$PROJECT_DIR"

echo "🔨 1) بناء الصفحات (build.js)..."
node utils/build.js

echo ""
echo "🔍 2) الفحص الشامل (validate.js)..."
if ! node utils/validate.js; then
    echo ""
    echo "❌ الفحص لقى أخطاء (errors) - النشر توقف. صلح الأخطاء وأعد المحاولة."
    exit 1
fi

echo ""
echo "📦 3) تجهيز الملفات للـ commit..."
git add -A

# إلا ماكاين والو تبدل، ماديرش commit فارغ
if git diff --cached --quiet; then
    echo "ℹ️  ماكاين حتى تعديل جديد - ماشي محتاج commit."
else
    MSG="${1:-تحديث تلقائي $(date '+%Y-%m-%d %H:%M')}"
    git commit -m "$MSG"
fi

echo ""
echo "⬇️  4) جلب آخر تحديثات من GitHub (rebase)..."
git pull --rebase origin main

echo ""
echo "⬆️  5) رفع التعديلات..."
git push origin main

echo ""
echo "✅ النشر كمّل بنجاح! تبع تبويب Actions فـ GitHub باش تتأكد من الـ deployment."
