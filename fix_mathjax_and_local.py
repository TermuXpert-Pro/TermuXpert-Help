#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
سكريبت شامل يصلح 2 مشاكل فمشروع Xpert:

1) صفحات كتحمل MathJax (محلي أو external) بلا كتلة الإعدادات
   MathJax = { tex: {...}, svg: {...} }
   => كتبان الرياضيات كنص خام ($...$) بدل ما تتحول.

2) صفحات كتعتمد على الأنترنت (Google Fonts CDN + jsdelivr MathJax CDN)
   بدل الملفات المحلية => ما خدماش خالص بلا واي فاي/بيانات.

الاستعمال (Termux):
    python3 fix_mathjax_and_local.py /storage/emulated/0/Web --dry-run
    python3 fix_mathjax_and_local.py /storage/emulated/0/Web
"""

import os
import re
import sys
import shutil

MATHJAX_CONFIG = """    <script>
        MathJax = {
            tex: {
                inlineMath: [['$', '$'], ['\\\\(', '\\\\)']],
                displayMath: [['$$', '$$'], ['\\\\[', '\\\\]']]
            },
            svg: { fontCache: 'global' }
        };
    </script>
"""

MATH_PATTERN = re.compile(
    r'\\(forall|exists|frac|mathbb|Rightarrow|Leftrightarrow|sqrt|leq|geq|neq)'
)
CDN_MATHJAX_RE = re.compile(
    r'<script[^>]*src="https://cdn\.jsdelivr\.net/npm/mathjax@?[^"]*"[^>]*></script>\s*\n?'
)
LOCAL_MATHJAX_SCRIPT_RE = re.compile(
    r'<script src="([^"]*assets/js/vendor/mathjax-tex-svg\.js)"[^>]*></script>'
)
CDN_FONTS_RE = re.compile(
    r'<link href="https://fonts\.googleapis\.com/css2\?[^"]*"[^>]*>\s*\n?'
)
PRECONNECT_RE = re.compile(
    r'[ \t]*<link rel="(?:preconnect|dns-prefetch)" href="https://(?:fonts\.googleapis\.com|fonts\.gstatic\.com|cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net)"[^>]*>[ \t]*\n?'
)


def rel_assets_prefix(html_path, base_dir):
    """يحسب المسار النسبي رجوعاً لمجلد assets/ حسب عمق الملف."""
    file_dir = os.path.dirname(html_path)
    assets_dir = os.path.join(base_dir, 'assets')
    rel = os.path.relpath(assets_dir, file_dir)
    return rel.replace(os.sep, '/')


def fix_file(path, base_dir):
    with open(path, encoding='utf-8') as f:
        text = f.read()
    original = text
    changes = []

    prefix = rel_assets_prefix(path, base_dir)

    # 1) استبدال MathJax الخارجي (jsdelivr) بالمحلي
    if CDN_MATHJAX_RE.search(text):
        local_tag = f'    <script src="{prefix}/js/vendor/mathjax-tex-svg.js" defer></script>\n'
        text = CDN_MATHJAX_RE.sub(local_tag, text)
        changes.append("MathJax: CDN -> محلي")

    # 2) استبدال Google Fonts الخارجي بالمحلي (كملف CSS)
    if CDN_FONTS_RE.search(text):
        text = CDN_FONTS_RE.sub('', text)
        if f'{prefix}/css/google-fonts.css' not in text:
            local_font_link = f'    <link rel="stylesheet" href="{prefix}/css/google-fonts.css">\n'
            if 'fontawesome-subset.css' in text:
                text = re.sub(
                    r'([ \t]*)(<link rel="stylesheet" href="[^"]*fontawesome-subset\.css">)',
                    r'\1' + local_font_link.rstrip('\n') + r'\n\1\2',
                    text, count=1
                )
            else:
                text = text.replace('</head>', local_font_link + '</head>', 1)
        changes.append("Google Fonts: CDN -> محلي")

    # 3) حذف preconnect/dns-prefetch لينكات ماعادش محتاجينها
    if PRECONNECT_RE.search(text):
        text = PRECONNECT_RE.sub('', text)
        changes.append("حذف preconnect/dns-prefetch الخارجية")

    # 4) إضافة كتلة MathJax = {...} إلا كانت ناقصة
    has_config = ('MathJax = {' in text) or ('MathJax={' in text)
    m = LOCAL_MATHJAX_SCRIPT_RE.search(text)
    uses_math = bool(MATH_PATTERN.search(text))
    if m and not has_config and uses_math:
        insert_at = m.start()
        text = text[:insert_at] + MATHJAX_CONFIG + text[insert_at:]
        changes.append("إضافة MathJax config الناقصة")

    return text, original, changes


def main():
    args = sys.argv[1:]
    dry_run = '--dry-run' in args
    args = [a for a in args if not a.startswith('-')]
    base_dir = args[0] if args else '/storage/emulated/0/Web'

    if not os.path.isdir(base_dir):
        print(f"❌ المسار غير موجود: {base_dir}")
        sys.exit(1)

    total_files = 0
    changed_files = 0
    change_log = []

    for root, dirs, files in os.walk(base_dir):
        for fn in files:
            if not fn.endswith('.html'):
                continue
            path = os.path.join(root, fn)
            total_files += 1
            new_text, old_text, changes = fix_file(path, base_dir)
            if changes:
                changed_files += 1
                rel = os.path.relpath(path, base_dir)
                change_log.append((rel, changes))
                if not dry_run:
                    shutil.copy2(path, path + '.bak')
                    with open(path, 'w', encoding='utf-8') as f:
                        f.write(new_text)

    print(f"📄 فحصت {total_files} ملف html")
    print(f"🔧 {'غادي يتصلحو' if dry_run else 'تصلحو'} {changed_files} ملف:\n")
    for rel, changes in change_log:
        print(f"  - {rel}")
        for c in changes:
            print(f"      • {c}")

    if dry_run:
        print("\n(--dry-run) ما تبدل حتى ملف، هادشي غير معاينة.")
    else:
        print("\n✔️ خلص. نسخة قديمة .bak تدارت لكل ملف تبدل.")


if __name__ == '__main__':
    main()
