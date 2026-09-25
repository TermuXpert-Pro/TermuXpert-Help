#!/usr/bin/env bash
# ============================================================
# cleanup_scripts.sh
# كيمسح السكريبتات القديمة "لمرة واحدة" (fixes/migrations لي خلاص
# تطبقات على مشروع Xpert) وكيخلي غير السكريبتات المتكررة/الأساسية
# (deploy.sh, utils/build.js, utils/validate.js...).
#
# الاستعمال (فـ Termux، من جذر المشروع /storage/emulated/0/Web):
#
#   bash cleanup_scripts.sh                 → dry-run (كيوري غير
#                                              شنو غادي يتحذف، بلا
#                                              ما يمس شي حاجة)
#   bash cleanup_scripts.sh --backup        → كيدير نسخة احتياطية
#                                              (zip) للملفات قبل
#                                              ما يحذفهم
#   bash cleanup_scripts.sh --apply         → كيحذف فعليا (بلا نسخة)
#   bash cleanup_scripts.sh --apply --backup → الأحسن: نسخة + حذف
#
# ⚠️ ماشي مضمنين فهاد اللائحة (خاصهم فحص يدوي قبل):
#    fix_xpert.py، fix_conflicts.py، clean_conflicts.py
#    (fix_xpert.py فيه علامات تعارض Git <<<<<<< HEAD ماتصلحاتش
#     بعد جوا الملف نفسه، خاصك تتأكد بلي المشكل خلاص قبل ما تمسح
#     الأدوات اللي كتصلحو)
# ============================================================

set -e

ROOT_DIR="${ROOT_DIR:-/storage/emulated/0/Web}"
APPLY=false
BACKUP=false

for arg in "$@"; do
    case "$arg" in
        --apply) APPLY=true ;;
        --backup) BACKUP=true ;;
        *) echo "خيار غير معروف: $arg" && exit 1 ;;
    esac
done

if [ ! -d "$ROOT_DIR" ]; then
    echo "❌ المجلد $ROOT_DIR ماكاينش. عدّل ROOT_DIR فراس هاد السكريبت أو ديرها:"
    echo "   ROOT_DIR=/path/to/Web bash cleanup_scripts.sh"
    exit 1
fi

cd "$ROOT_DIR"

# ------------------------------------------------------------
# 1) ملفات فرادى للحذف (سكريبتات fix/apply/migration خلاص طُبّقت)
# ------------------------------------------------------------
FILES_TO_DELETE=(
    "add_toc.py"
    "apply_fixes.py"
    "fix_badge_spacing.py"
    "fix_mathjax.py"
    "fix_mathjax_and_local.py"
    "fix_model_counts.py"
    "fix_seo.py"
    "fix_solution_toggle_v2.py"
    "fix_toc.py"
    "reduce_physique_chimie.py"
    "apply-direct-sections.js"
    "fix-cloudflare-duplicates.js"
    "xpert_hide_autres_tab.js"
    "xpert_remove_exam_mode.js"
    "devoir-exam.clean.js"
    "utils/fix-xpert-loader.js"
    "utils/fix-xpert-loader-v2.js"
    "utils/fix-retour-to-subject.js"
    "utils/speed-up-loader.js"
    "utils/upgrade-sections-fab.js"
    "utils/replace-fontawesome-cdn.js"
    "utils/inject-theme-init.js"
    "scripts/unify-nav-buttons.js"
)

# ------------------------------------------------------------
# 2) مجلدات كاملة للحذف (utils/archive/ خلاص مؤرشف من قبلك)
# ------------------------------------------------------------
DIRS_TO_DELETE=(
    "utils/archive"
)

# ------------------------------------------------------------
# جمع الملفات الموجودة فعلا (تفادي الأخطاء على الي ماكايناش)
# ------------------------------------------------------------
EXISTING_FILES=()
for f in "${FILES_TO_DELETE[@]}"; do
    [ -f "$f" ] && EXISTING_FILES+=("$f")
done

EXISTING_DIRS=()
for d in "${DIRS_TO_DELETE[@]}"; do
    [ -d "$d" ] && EXISTING_DIRS+=("$d")
done

TOTAL=$((${#EXISTING_FILES[@]} + ${#EXISTING_DIRS[@]}))

echo "============================================================"
echo "  فحص: $TOTAL عنصر غادي يتحذف من $ROOT_DIR"
echo "============================================================"
for f in "${EXISTING_FILES[@]}"; do echo "  🗑️  $f"; done
for d in "${EXISTING_DIRS[@]}"; do echo "  🗑️  $d/  (مجلد كامل)"; done
echo "============================================================"

if [ "$TOTAL" -eq 0 ]; then
    echo "ماكاين حتى ملف من اللائحة فهاد المجلد. راه خلاص متمسحين؟"
    exit 0
fi

# ------------------------------------------------------------
# نسخة احتياطية (اختياري)
# ------------------------------------------------------------
if [ "$BACKUP" = true ]; then
    TS=$(date +%Y%m%d_%H%M%S)
    BACKUP_FILE="$ROOT_DIR/cleanup_backup_$TS.zip"
    echo "📦 كنديرو نسخة احتياطية فـ: $BACKUP_FILE"
    zip -q -r "$BACKUP_FILE" "${EXISTING_FILES[@]}" "${EXISTING_DIRS[@]}" 2>/dev/null || true
    echo "✅ النسخة الاحتياطية تزادت."
fi

# ------------------------------------------------------------
# الحذف الفعلي أو dry-run
# ------------------------------------------------------------
if [ "$APPLY" = false ]; then
    echo ""
    echo "👀 هادي dry-run غير — ماتحذفش والو."
    echo "   باش تحذف فعليا: bash cleanup_scripts.sh --apply"
    echo "   (أو مع نسخة احتياطية: bash cleanup_scripts.sh --apply --backup)"
    exit 0
fi

for f in "${EXISTING_FILES[@]}"; do
    rm -f "$f"
    echo "✅ تحذف: $f"
done

for d in "${EXISTING_DIRS[@]}"; do
    rm -rf "$d"
    echo "✅ تحذف المجلد: $d"
done

echo ""
echo "============================================================"
echo "🎉 خلص الحذف. تحذف $TOTAL عنصر."
echo "============================================================"
echo ""
echo "السكريبتات اللي بقات (خاصها تبقى، ماشي لمرة واحدة):"
echo "  - deploy.sh"
echo "  - utils/build.js"
echo "  - utils/inject-pwa-head.js"
echo "  - utils/generate-sitemap.js"
echo "  - utils/validate.js"
echo "  - utils/generate-fa-subset.js"
echo "  - utils/add-xpert-loader.js"
echo "  - check-icons.sh"
echo "  - count_chars.sh"
echo ""
echo "⚠️ ماتمسحاتش (خاصهم فحص يدوي قبل):"
echo "  - fix_xpert.py  (فيه علامات تعارض Git ماتصلحاتش بعد)"
echo "  - fix_conflicts.py"
echo "  - clean_conflicts.py"

