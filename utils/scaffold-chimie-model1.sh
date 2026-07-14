#!/data/data/com.termux/files/usr/bin/bash
# ============================================================
# scaffold-chimie-model1.sh
# كينشئ هيكل فارغ (model1/) لـ exercises/ و series/ ديال
# أول 3 دروس فالكيمياء غير (بحال ما كاين فـ math و physique).
#
# ⚠️ كيدير غير المجلدات (mkdir -p) + .gitkeep باش git يتبعهم.
# ⚠️ ماكيمسش الدروس (lessons/) - راهي كاينة ديجا.
# ⚠️ ماكيكتبش والو فـ data/chimie.js - خاصك تزيدها يدوياً من بعد.
#
# الاستخدام: bash utils/scaffold-chimie-model1.sh
# ============================================================
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "📂 المجلد الجذري: $ROOT"
echo ""

# أول 3 دروس فـ data/chimie.js (بالترتيب):
# 1. Importance de la mesure en chimie      -> mesure-chimie
# 2. Grandeurs physiques (quantité matière) -> quantite-matiere
# 3. Concentration et solutions électrolytiques -> concentration-solutions
TOPICS=(
    "mesure-chimie"
    "quantite-matiere"
    "concentration-solutions"
)

TYPES=("exercises" "series")

TOTAL=0

for topic in "${TOPICS[@]}"; do
    for type in "${TYPES[@]}"; do
        dir="content/chimie/${type}/${topic}/model1"

        if [ -d "$dir" ]; then
            echo "⏭️  تخطي (كاين ديجا): $dir"
            continue
        fi

        mkdir -p "$dir"
        touch "$dir/.gitkeep"   # git ماكيتبعش المجلدات الفارغة بلا ملف جوها

        echo "✅ تنشأ: $dir"
        TOTAL=$((TOTAL + 1))
    done
done

echo ""
echo "============================================================"
echo "✅ خلص! $TOTAL مجلد model1 تنشأ (فارغ)."
echo ""
echo "⚠️ الخطوات الجاية (يدوياً):"
echo "  1. حط الملفات ديالك جوا كل model1/ :"
echo "     index.html (hub ديال النموذج) + exercice1.html, exercice2.html..."
echo "     أو serie1.html, serie2.html... (بحال templates/exercise-template.html"
echo "     و templates/series-template.html)"
echo "  2. من بعد ما تكمل الملفات، شغّل:"
echo "     node utils/generate-model-hub.js"
echo "     (كيقرا العنوان والعدد من model1/index.html ديالك ويبني"
echo "      content/chimie/<type>/<topic>/index.html تلقائياً)"
echo "  3. زيد فـ data/chimie.js جوج entries جداد فـ exercices[] و series[]"
echo "     كيشيرو لـ content/chimie/exercises/<topic>/index.html"
echo "     و content/chimie/series/<topic>/index.html (بحال math.js بالضبط)"
echo "  4. node utils/build.js            (navbar/footer/décor)"
echo "  5. node utils/generate-sitemap.js (يحدث sitemap.xml)"
echo "============================================================"
