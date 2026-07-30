#!/usr/bin/env python3
"""
clean_conflicts.py
-------------------
كينظف علامات تعارض git (<<<<<<< HEAD / ======= / >>>>>>>) لي بقات
مكتوبة بالغلط جوه الملفات (تزادو فـ commit سابق بلا ما ينحلو).

الافتراضي: كيحتفظ بجانب HEAD (الجزء الأول، لي هو "ours" / النسخة المحلية)
ويمسح الجزء الآخر بالكامل مع العلامات الثلاثة.

الاستعمال:
    python3 clean_conflicts.py --root .                # dry-run (تجربة، بلا تعديل)
    python3 clean_conflicts.py --root . --apply         # يطبق فعليا (كيدير .bak)
    python3 clean_conflicts.py --root . --apply --keep-theirs   # يحتفظ بالجانب الثاني بدل HEAD
"""

import argparse
import os
import re
import sys

CONFLICT_RE = re.compile(
    r"<<<<<<< [^\n]*\n(?P<ours>.*?)\n=======\n(?P<theirs>.*?)\n>>>>>>> [^\n]*\n?",
    re.DOTALL,
)


def find_files(root, exts=(".html",)):
    out = []
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in (".git", "node_modules")]
        for fn in filenames:
            if fn.endswith(exts):
                out.append(os.path.join(dirpath, fn))
    return out


def clean_file(path, apply_changes, keep_theirs, report):
    with open(path, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()

    if "<<<<<<< " not in content:
        return

    def repl(m):
        return (m.group("theirs") if keep_theirs else m.group("ours")) + "\n"

    new_content, n = CONFLICT_RE.subn(repl, content)

    if n == 0:
        # كاين علامة <<<<<<< لكن الشكل ماطابقش الـ regex (نادر، خصو فحص يدوي)
        report["unmatched"].append(path)
        return

    report["fixed"][path] = n

    if apply_changes:
        bak = path + ".conflictbak"
        if not os.path.exists(bak):
            with open(bak, "w", encoding="utf-8") as f:
                f.write(content)
        with open(path, "w", encoding="utf-8") as f:
            f.write(new_content)


def main():
    ap = argparse.ArgumentParser(description="تنظيف علامات تعارض git لي بقات فالملفات")
    ap.add_argument("--root", default=".")
    ap.add_argument("--apply", action="store_true")
    ap.add_argument("--keep-theirs", action="store_true",
                     help="يحتفظ بالجزء الثاني (بعد =======) بدل الأول (HEAD)")
    args = ap.parse_args()

    root = os.path.abspath(args.root)
    apply_changes = args.apply
    report = {"fixed": {}, "unmatched": []}

    files = find_files(root)
    for fp in files:
        clean_file(fp, apply_changes, args.keep_theirs, report)

    mode = "APPLY" if apply_changes else "DRY-RUN"
    side = "theirs (بعد =======)" if args.keep_theirs else "HEAD (قبل =======)"
    print(f"🔧 وضعية: {mode} | كيحتفظ بـ: {side}")
    print(f"📁 روت: {root}\n")
    print(f"عدد الملفات المتضررة: {len(report['fixed'])}")
    total_blocks = sum(report["fixed"].values())
    print(f"عدد التعارضات المصلحة: {total_blocks}")

    if report["unmatched"]:
        print(f"\n⚠️  ملفات فيها '<<<<<<< ' لكن ماقدرش السكريبت يفهم الشكل ديالها "
              f"({len(report['unmatched'])}) — خصهم فحص يدوي:")
        for p in report["unmatched"]:
            print(f"  - {os.path.relpath(p, root)}")

    print("\n" + "=" * 60)
    if not apply_changes:
        print("ℹ️  هادشي كان غير dry-run. زيد --apply باش يتطبق فعلا")
    else:
        print("✅ تم. كل ملف تبدل عندو نسخة احتياطية بـ .conflictbak")
        print("   تحقق بعد: grep -rl '<<<<<<< ' --include='*.html' .")
    print("=" * 60)


if __name__ == "__main__":
    sys.exit(main())
