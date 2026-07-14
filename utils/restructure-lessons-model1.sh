#!/data/data/com.termux/files/usr/bin/bash
# ============================================================
# restructure-lessons-model1.sh
# نسخة من restructure-model1.sh غير خاصة بـ content/<subject>/lessons/<topic>/
# كينقل كل ملفات .html (index.html + part*.html) لمجلد model1/ جواها،
# ويصلح المسارات النسبية (زيادة مستوى واحد فالعمق).
#
# ⚠️ ماشي حاجة تبدل data/*.js: المسارات ديال lessons فـ data/*.js
#    كتشير ديما لـ content/<subject>/lessons/<topic>/index.html، وهاذ
#    الملف باقي كاين فنفس المكان (غير غيّر المحتوى ديالو من "الدرس"
#    إلى "hub" كيعرض النماذج) - بحال exercises/series بالضبط.
# ⚠️ دير نسخة احتياطية قبل ما تشغلها.
# ⚠️ بعد هاذ السكريبت، خاصك تشغّل: node utils/generate-model-hub.js
#    (بعد ما تزيد دعم lessons فيه - شوف الملف المرفق).
#
# الاستخدام: bash utils/restructure-lessons-model1.sh
# ============================================================
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "📂 المجلد الجذري: $ROOT"
echo ""

TOTAL_TOPICS=0
TOTAL_FILES=0

restructure_dir() {
    local type_dir="$1"   # مثال: content/math/lessons

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

        # نحرك غير ملفات .html اللي مباشرة جوا الطوبيك (index.html + part*.html)
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

echo "===== نقل ملفات الدروس لـ model1/ ====="
for subj_dir in content/*/; do
    d="${subj_dir}lessons"
    [ -d "$d" ] && restructure_dir "$d"
done

echo ""
echo "============================================================"
echo "✅ خلص! $TOTAL_TOPICS درس تهجّر ($TOTAL_FILES ملف)."
echo ""
echo "⚠️ باقي خاصك دير يدوياً:"
echo "  1. تأكد generate-model-hub.js فيه دعم lessons (راجع النسخة المحدثة)"
echo "  2. node utils/generate-model-hub.js   (يولد hub لكل درس تهجّر)"
echo "  3. node utils/build.js                (يصلح navbar/footer/decor + cache version)"
echo "  4. node utils/generate-sitemap.js     (يحدث sitemap.xml)"
echo "  5. راجع sw.js يدوياً إلا كان فيه مسارات ديال lessons مكتوبة بالكامل"
echo "  6. افتح شي درس فالمتصفح تأكد أن كولشي كيتحمل مزيان (الـ hub + model1)"
echo "============================================================"
