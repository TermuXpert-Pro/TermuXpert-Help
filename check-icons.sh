#!/usr/bin/env bash
# ============================================================
# check-icons.sh
# فحص شامل لكل أيقونات وصور الموقع: الوجود، الأبعاد، المربعية،
# والمطابقة مع معايير Google لسنة 2026.
#
# الاستعمال (فـ Termux، من جذر المشروع):
#   pkg install python -y
#   pip install Pillow --break-system-packages
#   bash check-icons.sh
# ============================================================

set -e

# تأكد من وجود Pillow
python3 -c "import PIL" 2>/dev/null || {
    echo "📦 كنثبت Pillow..."
    pip install Pillow --break-system-packages -q
}

python3 << 'PYEOF'
import os
from PIL import Image

# كل ملف متوقع، مساره، والأبعاد المثالية حسب معايير Google/Apple/PWA 2026
expected = [
    ("favicon.ico",                          None,       "أيقونة legacy - يفضل تحتوي 32x32 (و16x16 اختياري)"),
    ("assets/images/icon-16.png",             (16, 16),   "أيقونة تبويب المتصفح الصغيرة"),
    ("assets/images/icon-32.png",             (32, 32),   "أيقونة تبويب المتصفح"),
    ("assets/images/icon-48.png",             (48, 48),   "الحد الأدنى الموصى به من Google لنتائج البحث"),
    ("assets/images/icon-192.png",            (192, 192), "PWA / Android home screen"),
    ("assets/images/icon-512.png",            (512, 512), "PWA splash screen / installer"),
    ("assets/images/icon-maskable-512.png",   (512, 512), "PWA maskable icon (Android adaptive)"),
    ("assets/images/apple-touch-icon.png",    (180, 180), "iOS home screen - يجب ألا تحتوي شفافية"),
    ("assets/images/profile.webp",            None,       "صورة بروفايل - لا قيود صارمة"),
    ("assets/images/favicon.webp",            None,       "⚠️ غير مستعمل في أي وسم <link> حاليا"),
]

print("=" * 70)
print(f"{'الملف':<42} {'الحالة':<12} {'التفاصيل'}")
print("=" * 70)

issues = []

for relpath, expected_size, note in expected:
    if not os.path.exists(relpath):
        print(f"{relpath:<42} {'❌ ناقص':<12} {note}")
        issues.append(f"الملف {relpath} غير موجود")
        continue

    try:
        img = Image.open(relpath)
        w, h = img.size
        fmt = img.format
        mode = img.mode
        has_alpha = mode in ("RGBA", "LA") or (mode == "P" and "transparency" in img.info)

        status = "✅ سليم"
        detail_parts = [f"{w}x{h}px", fmt]

        # فحص المربعية
        if w != h:
            status = "⚠️ غير مربعة"
            issues.append(f"{relpath}: الأبعاد {w}x{h} غير مربعة (Google يرفض الأيقونات غير المربعة)")

        # فحص الحجم المتوقع
        if expected_size and (w, h) != expected_size:
            status = "⚠️ حجم مختلف"
            issues.append(f"{relpath}: الحجم {w}x{h} بينما المتوقع {expected_size[0]}x{expected_size[1]}")

        # فحص خاص بـ apple-touch-icon: يجب ألا تحتوي شفافية
        if "apple-touch-icon" in relpath and has_alpha:
            status = "⚠️ فيها شفافية"
            issues.append(f"{relpath}: تحتوي قناة شفافية (alpha) - iOS كيزيد خلفية بيضاء تلقائيا، الأفضل تحطها يدويا")

        # فحص الحد الأدنى لـ favicon الرئيسي حسب Google (48x48+)
        if relpath == "favicon.ico" and (w < 48 or h < 48):
            status = "⚠️ صغيرة"
            issues.append(f"favicon.ico: {w}x{h} أصغر من 48x48 الموصى بها من Google لنتائج البحث")

        detail_parts.append("شفافية" if has_alpha else "بدون شفافية")
        print(f"{relpath:<42} {status:<12} {' | '.join(detail_parts)} - {note}")

    except Exception as e:
        print(f"{relpath:<42} {'❌ خطأ':<12} تعذرت قراءة الملف: {e}")
        issues.append(f"{relpath}: خطأ في القراءة - {e}")

print("=" * 70)
print(f"\n📊 الخلاصة: {len(issues)} مشكلة" if issues else "\n✅ كل الصور سليمة ومطابقة للمعايير!")
if issues:
    print("\nالتفاصيل:")
    for i, issue in enumerate(issues, 1):
        print(f"  {i}. {issue}")
PYEOF
