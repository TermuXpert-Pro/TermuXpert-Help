#!/usr/bin/env python3
# -*- coding: utf-8 -*-
r"""
fix_conflicts.py
=================
سكريبت لإصلاح "الكتابة البيضاء اللي كتبان فأسفل بعض الصفحات".

السبب الحقيقي (مؤكد من الصورة اللي بعثتي):
  هاد الصفحات فيها علامات "conflict" ديال Git ما تصلحاتش
  (<<<<<<< HEAD  /  =======  /  >>>>>>> 0c4ed322 ...) بقاو
  مكتوبين حرفيا فالـ HTML. المتصفح كيعرضهم كنص عادي (أبيض فالثيم
  المظلم)، هوما اللي كتشوفهم "كتابة بيضاء" فأسفل الصفحة.

⚠️ هاد الحالة ماشي بسيطة: قلبت فبزاف ديال هاد الملفات ولقيت أن
  الجانبين ديال الـ conflict (HEAD و 0c4ed322) عندهم فروقات
  حقيقية فالمحتوى، ماشي غير مسافات:
    - جانب HEAD:      عندو <title> و canonical و meta description
                       الصحيحين ديال كل صفحة.
    - جانب 0c4ed322:   عندو سكريبتات مهمة زايدة (theme-init باش
                       يتفادى flash ديال الثيم، gtag config,
                       json-ld, تأثير navbar عند scroll...) ولكن
                       فبعض الملفات (مثلا travail-puissance) الـ
                       title ديالو مغلوط (تبدل بـ "Rotation d'un
                       solide" بحال نسخ-لصق غالط من صفحة خرى!).

  فحل ساذج ("خد جانب واحد ديما") غادي إما يفقد سكريبتات مهمة، وإلا
  يدخل تايتل غالط فبعض الصفحات. هاد السكريبت كيدير merge ذكي:
    1. إيلا جانب واحد فارغ (أو تقريبا فارغ) → كنخدو الجانب الآخر.
    2. إيلا الجوج عندهم محتوى → كنخدو قاعدة 0c4ed322 (الأكمل من
       ناحية السكريبتات)، ولكن كنبدلو فيها <title> و canonical و
       meta description بالقيم الصحيحة اللي كانو فجانب HEAD،
       باش ما يبقاش أي عنوان مغلوط.

الاستعمال (فـ Termux):
  # 1) تجربة بلا تعديل (كيوري ليك شنو غادي يبدل فكل ملف)
  python3 fix_conflicts.py /storage/emulated/0/Web --dry-run

  # 2) التعديل الحقيقي
  python3 fix_conflicts.py /storage/emulated/0/Web

  # 3) الملفات اللي السكريبت ماقدرش يحلها بثقة كتبقى بحالها
  #    وكتبان فتقرير "NEEDS MANUAL REVIEW" فأخر الطباعة، خاصك
  #    تحلها بيدك (شوف القسم أسفل).
"""

import os
import re
import sys
import argparse

CONFLICT_RE = re.compile(
    r'<<<<<<< HEAD\r?\n(.*?)^=======\r?\n(.*?)^>>>>>>> [^\r\n]*\r?\n',
    re.DOTALL | re.MULTILINE
)

TITLE_RE = re.compile(r'<title>.*?</title>', re.DOTALL)
CANONICAL_RE = re.compile(r'<link[^>]*rel=["\']canonical["\'][^>]*>|<link[^>]*href=["\'][^"\']*["\'][^>]*rel=["\']canonical["\'][^>]*>')
DESCRIPTION_RE = re.compile(r'<meta[^>]*name=["\']description["\'][^>]*>|<meta[^>]*content=["\'][^"\']*["\'][^>]*name=["\']description["\'][^>]*>')


def is_trivial(side: str) -> bool:
    """جانب 'فارغ' فعليا: بلا محتوى، أو غير وسم إغلاق وحيد بحال </body>."""
    stripped = side.strip()
    if not stripped:
        return True
    if re.fullmatch(r'</?(body|html|head)>', stripped):
        return True
    return False


def smart_merge(head: str, incoming: str) -> tuple:
    """
    كيرجع (resolved_text, needs_review: bool)
    """
    head_trivial = is_trivial(head)
    incoming_trivial = is_trivial(incoming)

    if head_trivial and not incoming_trivial:
        return incoming, False
    if incoming_trivial and not head_trivial:
        return head, False
    if head_trivial and incoming_trivial:
        return "", False

    # الجوج عندهم محتوى: هل كاين <title> فالجانبين؟ (بحال الحالات
    # اللي شفناها فـ <head> ديال الصفحة)
    head_title = TITLE_RE.search(head)
    incoming_title = TITLE_RE.search(incoming)

    if head_title and incoming_title:
        # base = incoming (فيه السكريبتات الزايدة)، نبدلو فيه
        # title/canonical/description بالقيم الصحيحة ديال head
        merged = incoming

        merged = TITLE_RE.sub(head_title.group(0), merged, count=1)

        head_canon = CANONICAL_RE.search(head)
        if head_canon:
            if CANONICAL_RE.search(merged):
                merged = CANONICAL_RE.sub(head_canon.group(0), merged, count=1)
            else:
                # زيد canonical قبل meta description إيلا ماكانتش
                merged = merged.replace(
                    head_title.group(0),
                    head_title.group(0) + "\n    " + head_canon.group(0),
                    1
                )

        head_desc = DESCRIPTION_RE.search(head)
        if head_desc:
            if DESCRIPTION_RE.search(merged):
                merged = DESCRIPTION_RE.sub(head_desc.group(0), merged, count=1)
            else:
                merged = merged.replace(
                    head_title.group(0),
                    head_title.group(0) + "\n    " + head_desc.group(0),
                    1
                )

        return merged, False

    # ماكاينش <title> فحتى جانب: عادة كيبقى معناه بلوك ديال سكريبتات
    # / body (بحال navbar scroll listener، toggleSolution، إلخ).
    # فهاد الحالات اللي شفناها كاملين، incoming كان دايما الأكمل
    # (فيه محتوى head مكرر/ناقص). كنخدو incoming.
    if not head_title and not incoming_title:
        return incoming, False

    # حالة غامضة (title فجانب وحيد بلا الآخر فبلوك بلا "trivial")
    # → نخليوها للمراجعة اليدوية باش ما نخسروش شي حاجة بالغلط.
    return None, True


def process_file(path: str, dry_run: bool = False):
    with open(path, 'r', encoding='utf-8', errors='replace') as f:
        content = f.read()

    matches = list(CONFLICT_RE.finditer(content))
    if not matches:
        return "skip_no_conflict", 0, 0

    new_content = content
    resolved_count = 0
    review_count = 0

    # كنبدلو من الأخير للأول باش ما تتبدلش المواقع (offsets)
    for m in reversed(matches):
        head_side = m.group(1)
        incoming_side = m.group(2)
        resolved, needs_review = smart_merge(head_side, incoming_side)

        if needs_review:
            review_count += 1
            continue  # نخليو البلوك بحاله (بعلاماتو) للمراجعة اليدوية

        new_content = new_content[:m.start()] + resolved + new_content[m.end():]
        resolved_count += 1

    if resolved_count and not dry_run:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new_content)

    if review_count:
        return "partial_needs_review", resolved_count, review_count
    elif resolved_count:
        return "fixed", resolved_count, 0
    else:
        return "skip_no_conflict", 0, 0


def main():
    parser = argparse.ArgumentParser(description="إصلاح علامات conflict ديال Git الناقصة فمشروع Xpert")
    parser.add_argument("root", help="المسار الجذري ديال المشروع (مثلا /storage/emulated/0/Web)")
    parser.add_argument("--dry-run", action="store_true", help="عرض النتائج بلا تعديل الملفات فعليا")
    args = parser.parse_args()

    if not os.path.isdir(args.root):
        print(f"❌ المسار ماكاينش: {args.root}")
        sys.exit(1)

    fixed = []
    partial = []
    total_blocks_resolved = 0
    total_blocks_review = 0

    for dirpath, dirs, files in os.walk(args.root):
        dirs[:] = [d for d in dirs if d not in ('.git', 'node_modules')]
        for fn in files:
            if not fn.endswith(('.html', '.js', '.css')):
                continue
            fpath = os.path.join(dirpath, fn)
            status, n_resolved, n_review = process_file(fpath, dry_run=args.dry_run)
            rel = os.path.relpath(fpath, args.root)
            total_blocks_resolved += n_resolved
            total_blocks_review += n_review
            if status == "fixed":
                fixed.append((rel, n_resolved))
            elif status == "partial_needs_review":
                partial.append((rel, n_resolved, n_review))

    mode = "🧪 DRY-RUN (بلا تعديل حقيقي)" if args.dry_run else "✅ تعديل حقيقي"
    print(f"\n{mode}")
    print("=" * 60)
    print(f"📝 ملفات تصلحات بالكامل: {len(fixed)}")
    for rel, n in fixed:
        print(f"   + {rel}  ({n} بلوك)")

    if partial:
        print(f"\n⚠️  ملفات تصلحات جزئيا (فيها بلوك محتاج مراجعة يدوية): {len(partial)}")
        for rel, nr, nv in partial:
            print(f"   ! {rel}  (تصلح: {nr}, محتاج مراجعة: {nv})")

    print("\n" + "=" * 60)
    print(f"إجمالي البلوكات المصلحة: {total_blocks_resolved}")
    print(f"إجمالي البلوكات المحتاجة مراجعة يدوية: {total_blocks_review}")

    if total_blocks_review:
        print("\n📌 للبلوكات المحتاجة مراجعة يدوية: حل الـ conflict بيدك")
        print("   (بحال بغيتي تختار جانب HEAD ولا جانب 0c4ed322)، أو")
        print("   بعث ليا الملف ونشوفو فيه سوا.")

    if args.dry_run and (fixed or partial):
        print("\nℹ️  دير بلا --dry-run باش يتسجلو التعديلات فعليا.")


if __name__ == "__main__":
    main()

