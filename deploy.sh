#!/usr/bin/env bash
# ============================================================
# deploy.sh
# كيدير سلسلة البناء الكاملة بأمر واحد:
#   build.js → inject-pwa-head.js → generate-sitemap.js → validate.js
#   → git add/commit/push
#
# إلا فشل شي خطوة (بحال validate.js لقى مشكل)، السكريبت كيوقف
# مباشرة (set -e) وماغاديش يكمل لـgit push بكود معطوب.
#
# الاستعمال:
#   npm run deploy -- "رسالة الكوميت"
#   أو مباشرة: bash deploy.sh "رسالة الكوميت"
#   إلا ما عطيتيش رسالة، غايستعمل رسالة بالتاريخ أوتوماتيكياً.
# ============================================================

set -e  # وقف مباشرة عند أي خطأ

MSG="${1:-تحديث: $(date '+%Y-%m-%d %H:%M')}"

echo "🔨 1/4 - build.js (حقن navbar/footer/decor فكل الصفحات)..."
node utils/build.js

echo ""
echo "📱 2/4 - inject-pwa-head.js (رأس الـPWA)..."
node utils/inject-pwa-head.js

echo ""
echo "🗺️  3/4 - generate-sitemap.js..."
node utils/generate-sitemap.js

echo ""
echo "✅ 4/4 - validate.js (التحقق قبل النشر)..."
node utils/validate.js

echo ""
echo "📦 كلشي صافي! كنرفعو لـGit..."
git add .

if git diff --cached --quiet; then
    echo "ℹ️  ماكاينش شي تغيير باش يتكوميتا - وقفت هنا (بلا push)."
    exit 0
fi

git commit -m "$MSG"
git push

echo ""
echo "🚀 تم النشر بنجاح! (\"$MSG\")"
