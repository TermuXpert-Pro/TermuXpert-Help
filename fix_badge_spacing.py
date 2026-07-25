#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
fix_badge_spacing.py
=====================
يصلح مشكلة التصاق البطاقات (badge-exercice) ببعضها عند الانتقال
لسطر جديد على الشاشات الصغيرة، في كل صفحات الموقع دفعة واحدة.

المشكلة:
    <p style="text-align:center; ...">
        <span class="badge-exercice">...</span>
        <span class="badge-exercice">...</span>
    </p>
لا يوجد "gap" ولا "flex-wrap" بين البطاقتين، فتلتصقان ببعضهما
عند نزول إحداهما لسطر جديد.

الحل:
    يبحث السكريبت عن أي وسم <p> يحتوي على بطاقتين (badge-exercice)
    أو أكثر ولا يملك بالفعل "display:flex"، ثم يضيف له:
    display:flex; flex-wrap:wrap; justify-content:center;
    align-items:center; gap:8px;
    مع الإبقاء على باقي الخصائص الأصلية (اللون، الحجم، الهامش...).

    السكريبت "idempotent": يمكن تشغيله عدة مرات بدون أي ضرر —
    أي ملف تم إصلاحه سابقًا سيُتجاهل تلقائيًا (لأنه يحوي
    display:flex بالفعل).

الاستخدام:
    python3 fix_badge_spacing.py                     (يستخدم المسار الافتراضي)
    python3 fix_badge_spacing.py /storage/emulated/0/Web/content
    python3 fix_badge_spacing.py /path/to/project --dry-run   (فحص بدون تعديل)
"""

import re
import os
import sys

DEFAULT_ROOT = "/storage/emulated/0/Web"

# أي وسم <p ...> ... </p> (غير جشع، يدعم أسطر متعددة)
TAG_RE = re.compile(r'(<p(\s[^>]*)?>)((?:(?!</p>).)*?)(</p>)', re.DOTALL)
STYLE_RE = re.compile(r'style="([^"]*)"')


def fix_style(style: str) -> str:
    """يبني قيمة style جديدة مع خصائص flex، مع الحفاظ على الخصائص القديمة."""
    if "display:flex" in style.replace(" ", ""):
        return style  # مُصلَح مسبقًا، لا تغيير

    # نزيل text-align:center لأنها أصبحت زائدة (justify-content تقوم بنفس الدور)
    parts = [p.strip() for p in style.split(";") if p.strip()]
    parts = [p for p in parts if not p.replace(" ", "").startswith("text-align:center")]

    new_props = [
        "display:flex",
        "flex-wrap:wrap",
        "justify-content:center",
        "align-items:center",
        "gap:8px",
    ]
    return "; ".join(new_props + parts) + ";"


def process_content(content: str):
    """يطبق الإصلاح على نص HTML كامل. يرجع (النص الجديد, هل تغيّر شيء)."""
    changed = False

    def repl(m: re.Match) -> str:
        nonlocal changed
        open_tag, attrs, inner, close_tag = m.group(1), m.group(2) or "", m.group(3), m.group(4)

        # نطبق الإصلاح فقط إذا كان هناك بطاقتان (badge-exercice) أو أكثر
        if inner.count("badge-exercice") < 2:
            return m.group(0)

        # تجاهل إن كان مُصلَحًا مسبقًا
        if "display:flex" in attrs.replace(" ", ""):
            return m.group(0)

        sm = STYLE_RE.search(open_tag)
        if not sm:
            # وسم <p> بدون style أصلاً: نضيف واحدة كاملة
            new_open = open_tag[:-1] + ' style="display:flex; flex-wrap:wrap; justify-content:center; align-items:center; gap:8px;">'
            changed = True
            return new_open + inner + close_tag

        new_style = fix_style(sm.group(1))
        new_open = open_tag[: sm.start()] + 'style="' + new_style + '"' + open_tag[sm.end():]
        changed = True
        return new_open + inner + close_tag

    new_content = TAG_RE.sub(repl, content)
    return new_content, changed


def process_file(path: str, dry_run: bool) -> bool:
    try:
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()
    except (UnicodeDecodeError, OSError):
        return False

    new_content, changed = process_content(content)
    if changed and not dry_run:
        with open(path, "w", encoding="utf-8") as f:
            f.write(new_content)
    return changed


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    dry_run = "--dry-run" in sys.argv
    root = args[0] if args else DEFAULT_ROOT

    if not os.path.isdir(root):
        print(f"❌ المسار غير موجود: {root}")
        sys.exit(1)

    fixed_files = []
    scanned = 0

    for dirpath, _dirnames, filenames in os.walk(root):
        for fn in filenames:
            if fn.endswith(".html"):
                full_path = os.path.join(dirpath, fn)
                scanned += 1
                if process_file(full_path, dry_run):
                    fixed_files.append(full_path)

    print(f"🔍 تم فحص {scanned} ملف HTML.")
    if dry_run:
        print(f"⚠️  وضع الفحص فقط (--dry-run) — لم يتم تعديل أي ملف.")
    print(f"✅ عدد الملفات {'التي يجب إصلاحها' if dry_run else 'التي تم إصلاحها'}: {len(fixed_files)}\n")

    for p in fixed_files:
        print("  -", p)


if __name__ == "__main__":
    try:
        main()
    except BrokenPipeError:
        try:
            sys.stdout.close()
        except Exception:
            pass
