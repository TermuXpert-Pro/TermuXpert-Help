#!/usr/bin/env python3
"""
fix_back_buttons.py
--------------------
كيصلح زر "Retour" (back-btn) فكل ملفات model*/index.html
تحت content/, باش يرجع لصفحة الـ"model" (../index.html)
بدل ما يقفز مباشرة لـ subject.html.

الاستعمال (من داخل مجلد Web، عبر Termux مثلا):
    python fix_back_buttons.py
أو بتحديد المسار يدويا:
    python fix_back_buttons.py /storage/emulated/0/Web
"""
import os
import re
import sys

# المسار الجذري ديال الموقع (افتراضي: نفس المجلد اللي فيه السكريبت)
ROOT = sys.argv[1] if len(sys.argv) > 1 else os.getcwd()
CONTENT_DIR = os.path.join(ROOT, "content")

# الرابط الخاطئ: أي عدد من "../" ملاي بـ subject.html?subject=xxx
# داخل زر عندو class="back-btn" بالضبط
PATTERN = re.compile(
    r'href="(?:\.\./)+subject\.html\?subject=(?:math|physique|chimie)"(\s+class="back-btn")'
)
REPLACEMENT = r'href="../index.html"\1'


def find_model_index_files(content_dir):
    """كيرجع لائحة كل ملفات model*/index.html تحت content/"""
    matches = []
    for dirpath, dirnames, filenames in os.walk(content_dir):
        folder_name = os.path.basename(dirpath)
        if folder_name.startswith("model") and "index.html" in filenames:
            matches.append(os.path.join(dirpath, "index.html"))
    return matches


def fix_file(path):
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    new_content, n = PATTERN.subn(REPLACEMENT, content)

    if n == 0:
        return None  # ماكاينش شي حاجة نصلحوها فهاد الملف

    with open(path, "w", encoding="utf-8") as f:
        f.write(new_content)

    return n


def main():
    if not os.path.isdir(CONTENT_DIR):
        print(f"❌ ماكايناش مجلد content/ فـ: {ROOT}")
        print("   دير: python fix_back_buttons.py /path/to/Web")
        sys.exit(1)

    files = find_model_index_files(CONTENT_DIR)
    print(f"🔍 لقيت {len(files)} ملف model*/index.html")

    fixed = 0
    unchanged = 0
    for path in files:
        result = fix_file(path)
        rel = os.path.relpath(path, ROOT)
        if result:
            print(f"✅ تصلح: {rel} ({result}x)")
            fixed += 1
        else:
            unchanged += 1

    print("\n---")
    print(f"✅ تصلحو {fixed} ملف")
    print(f"➖ بلا تغيير: {unchanged} ملف (كانو صحاح أصلا)")


if __name__ == "__main__":
    main()
