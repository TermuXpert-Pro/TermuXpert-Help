#!/usr/bin/env bash
# ============================================================
# archive-old-scripts.sh
# كينقل السكريبتات القديمة (خدمو مرة وحدة وخلصات) لفولدر أرشيف
# بدل ما يمسحهم نهائيا - باش تبقى محفوظة كمرجع تاريخي بلا ما
# تخلط مع الأدوات النشطة فـ utils/.
#
# الاستعمال (من جذر المشروع فـ Termux):
#   bash archive-old-scripts.sh
#
# إلا بغيتي فعلا تمسحهم نهائيا بلا أرشفة، بدل المتغير
# MODE تحت من "archive" لـ "delete".
# ============================================================

set -e

MODE="archive"   # "archive" (النقل لأرشيف، أنصح بيه) أو "delete" (حذف نهائي)

# ملفات utils/ اللي خدمو مرة وحدة وخلصات
UTILS_FILES=(
  "utils/apply-pwa-btn-patch.js"
  "utils/fix-animations.js"
  "utils/fix-gold-color.js"
  "utils/fix-theme-colors.js"
  "utils/replace-cdn-assets.js"
  "utils/replace-privacy-with-support.js"
  "utils/replace-profile-image.js"
  "utils/speed-up-calendrier-intro.js"
  "utils/speed-up-hero-intro.js"
  "utils/update-favicon-tags.js"
)

# ملفات فالجذر (.py / .sh) اللي خدمو مرة وحدة وخلصات
ROOT_FILES=(
  "fix_back_buttons.py"
  "fix_zoom.py"
  "fix-toc-summary-design.sh"
)

if [ "$MODE" = "archive" ]; then
    mkdir -p utils/archive
    echo "📦 كننقل الملفات لـ utils/archive/ ..."

    for f in "${UTILS_FILES[@]}"; do
        if [ -f "$f" ]; then
            mv "$f" "utils/archive/$(basename "$f")"
            echo "  ✅ $f"
        else
            echo "  ⚠️  $f غير موجود، تخطيته"
        fi
    done

    for f in "${ROOT_FILES[@]}"; do
        if [ -f "$f" ]; then
            mv "$f" "utils/archive/$(basename "$f")"
            echo "  ✅ $f"
        else
            echo "  ⚠️  $f غير موجود، تخطيته"
        fi
    done

    echo ""
    echo "✅ تمت الأرشفة. الملفات دابا فـ utils/archive/"

elif [ "$MODE" = "delete" ]; then
    echo "🗑️  كنمسحو الملفات نهائيا..."

    for f in "${UTILS_FILES[@]}" "${ROOT_FILES[@]}"; do
        if [ -f "$f" ]; then
            rm "$f"
            echo "  ✅ تمسح: $f"
        else
            echo "  ⚠️  $f غير موجود، تخطيته"
        fi
    done

    echo ""
    echo "✅ تم الحذف النهائي."
fi

echo ""
echo "📦 كنرفعو التغيير لـ Git..."
git add .
git commit -m "تنظيف: أرشفة/حذف سكريبتات utils القديمة اللي خلصات"
git push

echo ""
echo "🚀 تم!"
