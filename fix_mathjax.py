#!/usr/bin/env python3
# -*- coding: utf-8 -*-
r"""
fix_mathjax.py
==============
سكريبت لإصلاح مشكل عدم ظهور المعادلات الرياضية ($...$) فمشروع Xpert.

المشكل:
  بعض الصفحات كتستعمل صيغة $...$ / $$...$$ فالمحتوى ديالها،
  ولكن ماعندهاش تكوين MathJax (window.MathJax = {...}) اللي كيقول
  لـ MathJax أنها خاصها تفهم $ كـ delimiter. بدون هاد التكوين،
  MathJax كيدعم غير \( \) و \[ \]، فتبقى $...$ خام (نص عادي)
  ما كتتحولش لمعادلة منسقة.

الحل:
  السكريبت كيقلب على كل ملفات .html فالمشروع، كيلقى فين كاين
  <script src=".../mathjax-tex-svg.js" ...></script>
  بلا ما يكون قبلها تعريف MathJax = {...} فيه '$' كـ delimiter،
  ويزيد التعريف الصحيح قبل السكريبت مباشرة.

الاستعمال (فـ Termux):
  python3 fix_mathjax.py /storage/emulated/0/Web
  # أو تجربة بلا تعديل حقيقي (dry-run):
  python3 fix_mathjax.py /storage/emulated/0/Web --dry-run
"""

import os
import re
import sys
import argparse

# ---------- التكوين اللي غادي يتزاد ----------
MATHJAX_CONFIG_TEMPLATE = (
    "    <script>\n"
    "        MathJax = {\n"
    "            tex: {\n"
    "                inlineMath: [['$', '$'], ['\\\\(', '\\\\)']],\n"
    "                displayMath: [['$$', '$$'], ['\\\\[', '\\\\]']]\n"
    "            },\n"
    "            svg: { fontCache: 'global' }\n"
    "        };\n"
    "    </script>\n"
)

# ريجكس كيلقط أي وسم <script ...mathjax-tex-svg.js...></script>
# (كيدعم src قبل defer، أو defer قبل src، بأي مسافة/سطر)
SCRIPT_TAG_RE = re.compile(
    r'[ \t]*<script[^>]*mathjax-tex-svg\.js[^>]*></script>[ \t]*\n?',
    re.IGNORECASE
)

# ريجكس كيتأكد أن الملف عندو تكوين MathJax فيه '$' كـ delimiter بالفعل
HAS_DOLLAR_CONFIG_RE = re.compile(
    r"MathJax\s*=\s*\{.*?inlineMath.*?\['\\\$'.*?,.*?'\\\$'\]|"
    r"MathJax\s*=\s*\{.*?inlineMath.*?\[\s*\[\s*['\"]\$['\"]",
    re.DOTALL
)

# هل الملف فيه صيغة $...$ / $$...$$ حقيقية (ماشي جوج $ فـ template literals JS)
DOLLAR_MATH_RE = re.compile(r'\$[A-Za-z0-9\\^_{}\(\)\s\+\-=./,<>]{1,200}\$')


def file_uses_dollar_math(content: str) -> bool:
    """كشف تقريبي: واش الملف فيه على الأقل معادلة بصيغة $...$."""
    for m in DOLLAR_MATH_RE.finditer(content):
        if '${' in m.group(0):  # تفادي template literals ديال JS
            continue
        return True
    return False


def process_file(path: str, dry_run: bool = False) -> str:
    with open(path, 'r', encoding='utf-8', errors='replace') as f:
        content = f.read()

    script_match = SCRIPT_TAG_RE.search(content)
    if not script_match:
        return "skip_no_mathjax_script"

    if HAS_DOLLAR_CONFIG_RE.search(content):
        return "skip_already_configured"

    if not file_uses_dollar_math(content):
        return "skip_no_dollar_math_used"

    # نحسبو المسافة البادئة لسطر السكريبت باش نطابقوها
    line_start = content.rfind('\n', 0, script_match.start()) + 1
    indent_match = re.match(r'[ \t]*', content[line_start:script_match.start()])
    indent = indent_match.group(0) if indent_match else ''

    config_block = MATHJAX_CONFIG_TEMPLATE
    if indent:
        # نبدلو المسافة الافتراضية (4 مسافات) بالمسافة الحقيقية ديال السطر
        lines = config_block.split('\n')
        config_block = '\n'.join(
            (indent + l[4:]) if l.startswith('    ') else l
            for l in lines
        )

    new_content = content[:script_match.start()] + config_block + content[script_match.start():]

    if not dry_run:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new_content)

    return "fixed"


def main():
    parser = argparse.ArgumentParser(description="إصلاح تكوين MathJax الناقص فمشروع Xpert")
    parser.add_argument("root", help="المسار الجذري ديال المشروع (مثلا /storage/emulated/0/Web)")
    parser.add_argument("--dry-run", action="store_true", help="عرض النتائج بلا تعديل الملفات فعليا")
    args = parser.parse_args()

    if not os.path.isdir(args.root):
        print(f"❌ المسار ماكاينش: {args.root}")
        sys.exit(1)

    fixed, skipped_ok, skipped_no_script, skipped_no_dollar = [], 0, 0, 0

    for dirpath, dirs, files in os.walk(args.root):
        # تفادي مجلدات ماشي مهمة
        dirs[:] = [d for d in dirs if d not in ('.git', 'node_modules')]
        for fn in files:
            if not fn.endswith('.html'):
                continue
            fpath = os.path.join(dirpath, fn)
            result = process_file(fpath, dry_run=args.dry_run)
            rel = os.path.relpath(fpath, args.root)
            if result == "fixed":
                fixed.append(rel)
            elif result == "skip_already_configured":
                skipped_ok += 1
            elif result == "skip_no_mathjax_script":
                skipped_no_script += 1
            elif result == "skip_no_dollar_math_used":
                skipped_no_dollar += 1

    mode = "🧪 DRY-RUN (بلا تعديل حقيقي)" if args.dry_run else "✅ تعديل حقيقي"
    print(f"\n{mode}")
    print("=" * 50)
    print(f"📝 ملفات تصلحات: {len(fixed)}")
    for f in fixed:
        print(f"   + {f}")
    print(f"\n⏭️  ملفات عندها التكوين بالفعل: {skipped_ok}")
    print(f"⏭️  ملفات بلا MathJax أصلا: {skipped_no_script}")
    print(f"⏭️  ملفات بلا $...$ (ماشي محتاجة): {skipped_no_dollar}")
    print("=" * 50)

    if args.dry_run and fixed:
        print("\nℹ️  دير بلا --dry-run باش يتسجلو التعديلات فعليا.")


if __name__ == "__main__":
    main()
