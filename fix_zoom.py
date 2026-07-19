#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
fix_zoom.py
يبحث فـ جميع ملفات .html داخل مشروع Xpert (ROOT) ويصلح
وسم <meta name="viewport"> باش يمنع تكبير اللمس (pinch-zoom)
فـ جميع الصفحات (دروس، تمارين، سلاسل، إلخ) بشكل موحّد.

الاستعمال:
    python3 fix_zoom.py

ملاحظة: بدّل ROOT تحت إلا كان مسار مشروعك مختلف.
"""

import re
import pathlib
import sys

# 👇 بدّل هاد المسار إلا كان مختلف عندك
ROOT = pathlib.Path("/storage/emulated/0/Web")

# الوسم الجديد اللي غادي يعوض أي <meta name="viewport" ...>
NEW_VIEWPORT = (
    '<meta name="viewport" content="width=device-width, initial-scale=1.0, '
    'maximum-scale=1.0, user-scalable=no, viewport-fit=cover">'
)

VIEWPORT_RE = re.compile(r'<meta\s+name=["\']viewport["\']\s+content=["\'][^"\']*["\']\s*/?>')


def fix_file(path: pathlib.Path) -> bool:
    try:
        text = path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        print(f"⚠️  تعذّرت قراءة (encoding): {path}")
        return False

    if VIEWPORT_RE.search(text):
        new_text = VIEWPORT_RE.sub(NEW_VIEWPORT, text)
    else:
        # ما كايناش meta viewport فهاد الملف -> نزيدوها جوج <head>
        if "<head>" in text:
            new_text = text.replace("<head>", "<head>\n    " + NEW_VIEWPORT, 1)
        else:
            print(f"⚠️  ما لقيتش <head> فـ: {path}")
            return False

    if new_text != text:
        path.write_text(new_text, encoding="utf-8")
        return True
    return False


def main():
    if not ROOT.exists():
        print(f"❌ المسار ماكاينش: {ROOT}")
        sys.exit(1)

    html_files = list(ROOT.rglob("*.html"))
    print(f"📄 تم العثور على {len(html_files)} ملف HTML.\n")

    fixed = 0
    for f in html_files:
        if fix_file(f):
            fixed += 1
            print(f"✔ تم الإصلاح: {f.relative_to(ROOT)}")

    print(f"\n✅ تم إصلاح {fixed} من أصل {len(html_files)} ملف.")
    print("📌 لا تنسى تعوّض ملف assets/js/protection.js بالنسخة الجديدة")
    print("   باش يتمنع الزووم فـ الكمبيوتر أيضا (Ctrl+Scroll, Ctrl+/-, trackpad).")


if __name__ == "__main__":
    main()
