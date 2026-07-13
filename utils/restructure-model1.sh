#!/data/data/com.termux/files/usr/bin/bash
# ============================================================
# restructure-model1.sh
# كينقل كل ملفات content/<subject>/exercises/<topic>/ و
# content/<subject>/series/<topic>/ إلى مجلد model1/ جواها،
# ويصلح المسارات النسبية (زيادة مستوى واحد فالعمق)،
# ويحدث data/*.js باش يشيرو لـ model1/index.html.
#
# ⚠️ ماشي يهم الدروس (lessons/) - غير التمارين والسلاسل.
# ⚠️ دير نسخة احتياطية قبل ما تشغلها.
#
# الاستخدام: bash utils/restructure-model1.sh
# ============================================================
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "📂 المجلد الجذري: $ROOT"
echo ""

TOTAL_TOPICS=0
TOTAL_FILES=0

restructure_dir() {
    local type_dir="$1"   # مثال: content/math/exercises

    for topic_path in "$type_dir"/*/; do
        [ -d "$topic_path" ] || continue
        topic_path="${topic_path%/}"
        model_dir="$topic_path/model1"

        # إلا كان model1 موجود ديجا، يعني الطوبيك هاذا تهجّر من قبل - تخطاه
        if [ -d "$model_dir" ]; then
            echo "⏭️  تخطي (model1 كاين ديجا): $topic_path"
            continue
        fi

        mkdir -p "$model_dir"

        # نحرك غير ملفات .html اللي مباشرة جوا الطوبيك (ماشي جوا مجلدات فرعية)
        local moved=0
        while IFS= read -r -d '' f; do
            mv "$f" "$model_dir/"
            moved=$((moved + 1))
        done < <(find "$topic_path" -maxdepth 1 -type f -name "*.html" -print0)

        if [ "$moved" -eq 0 ]; then
            echo "⚠️  ماكاينش ملفات .html فـ: $topic_path"
            rmdir "$model_dir" 2>/dev/null || true
            continue
        fi

        # نصلح المسارات النسبية: عمق زاد بمستوى واحد
        # ../../../../assets/...  →  ../../../../../assets/...
        find "$model_dir" -maxdepth 1 -type f -name "*.html" -print0 | \
            xargs -0 sed -i 's#\.\./\.\./\.\./\.\./#../../../../../#g'

        echo "✅ $topic_path → model1/ ($moved ملف تحرك وتصلح)"
        TOTAL_TOPICS=$((TOTAL_TOPICS + 1))
        TOTAL_FILES=$((TOTAL_FILES + moved))
    done
}

echo "===== الخطوة 1: نقل الملفات لـ model1/ ====="
for subj_dir in content/*/; do
    for type in exercises series; do
        d="${subj_dir}${type}"
        [ -d "$d" ] && restructure_dir "$d"
    done
done

echo ""
echo "===== الخطوة 2: تحديث data/*.js ====="
for f in data/*.js; do
    before_hash=$(md5sum "$f" | cut -d' ' -f1)
    # content/<subject>/(exercises|series)/<topic>/index.html → .../model1/index.html
    sed -i -E 's#(content/[a-zA-Z]+/(exercises|series)/[a-zA-Z0-9_-]+)/index\.html#\1/model1/index.html#g' "$f"
    after_hash=$(md5sum "$f" | cut -d' ' -f1)
    if [ "$before_hash" != "$after_hash" ]; then
        echo "✅ $f: تحدث"
    else
        echo "➖ $f: بلا تغيير"
    fi
done

echo ""
echo "============================================================"
echo "✅ خلص! $TOTAL_TOPICS طوبيك تهجّر ($TOTAL_FILES ملف)."
echo ""
echo "⚠️ باقي خاصك دير يدوياً:"
echo "  1. node utils/build.js            (يصلح navbar/footer/decor + cache version)"
echo "  2. node utils/generate-sitemap.js  (يحدث sitemap.xml بالمسارات الجداد)"
echo "  3. راجع sw.js يدوياً - urlsToCache فيه مكتوبة بالكامل يدوياً"
echo "     وماغاتتحدثش أوتوماتيكياً، خاصها تصلح لـ .../model1/... يدوياً"
echo "     (أو نبنيو سكريبت يولدها أوتوماتيكياً بحال generate-sitemap.js)"
echo "  4. افتح شي صفحة تمرين/سلسلة فالمتصفح تأكد أن CSS/JS كيتحملو مزيان"
echo "============================================================"
