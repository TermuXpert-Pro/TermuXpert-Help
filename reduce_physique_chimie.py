#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
سكريبت للاحتفاظ فقط بأول 3 دروس + أول 3 تمارين + أول 3 سلاسل
فمادتي الفيزياء و الكيمياء، وحذف الباقي من المشروع.

الاستعمال فـ Termux:
    python3 reduce_physique_chimie.py /storage/emulated/0/Web
    (إلا ما عطيتيش المسار غادي يستعمل /storage/emulated/0/Web بالضبط)

خيارات:
    --dry-run   يبين لك غير الي غادي يتحذف بلا ما يحذف والو
    -y          يدير الحذف مباشرة بلا ما يسولك تأكيد

⚠️ ديما دير نسخة احتياطية (backup/zip) للمشروع كامل قبل ما تخدم بيه.
"""

import os
import re
import sys
import shutil

KEEP_COUNT = 3
SUBJECTS = ["chimie", "physique"]
# مفتاح المصفوفة فـ data/*.js  ->  اسم المجلد الحقيقي فـ content/<subject>/...
CATEGORY_MAP = {
    "lessons": "lessons",
    "exercices": "exercises",
    "series": "series",
}


def find_array_span(text, key):
    """يرجع (بداية المفتاح, بداية القوس [, نهاية القوس ]) ديال مصفوفة key فالنص."""
    m = re.search(r'\b' + re.escape(key) + r'\s*:\s*\[', text)
    if not m:
        return None
    bracket_start = m.end() - 1
    depth = 0
    i = bracket_start
    while i < len(text):
        if text[i] == '[':
            depth += 1
        elif text[i] == ']':
            depth -= 1
            if depth == 0:
                return m.start(), bracket_start, i
        i += 1
    return None


def split_top_level_objects(inner_text):
    """يقسم محتوى المصفوفة إلى العناصر {...} كيفما كانت مكتوبة (سطر وحد أو بزاف)."""
    entries = []
    depth = 0
    start = None
    for i, ch in enumerate(inner_text):
        if ch == '{':
            if depth == 0:
                start = i
            depth += 1
        elif ch == '}':
            depth -= 1
            if depth == 0 and start is not None:
                entries.append(inner_text[start:i + 1])
                start = None
    return entries


def extract_topic(entry_text, subject, folder):
    m = re.search(r'file\s*:\s*"([^"]+)"', entry_text)
    if not m:
        return None
    parts = m.group(1).split('/')
    # المتوقع: content / subject / folder / topic / ...
    try:
        idx = parts.index(folder)
        return parts[idx + 1]
    except (ValueError, IndexError):
        return None


def process_data_file(js_path, base_dir, dry_run):
    with open(js_path, encoding='utf-8') as f:
        text = f.read()

    to_delete_dirs = []
    kept_summary = []

    for key, folder in CATEGORY_MAP.items():
        span = find_array_span(text, key)
        if not span:
            continue
        key_start, bstart, bend = span
        inner = text[bstart + 1: bend]
        entries = split_top_level_objects(inner)
        if not entries:
            continue

        subject = os.path.basename(js_path).replace('.js', '')

        all_topics = []
        for e in entries:
            t = extract_topic(e, subject, folder)
            if t:
                all_topics.append(t)

        keep_entries = entries[:KEEP_COUNT]
        keep_topics = set()
        for e in keep_entries:
            t = extract_topic(e, subject, folder)
            if t:
                keep_topics.add(t)

        delete_topics = [t for t in dict.fromkeys(all_topics) if t not in keep_topics]

        for t in delete_topics:
            d = os.path.join(base_dir, 'content', subject, folder, t)
            if os.path.isdir(d):
                to_delete_dirs.append(d)

        kept_summary.append((subject, key, [extract_topic(e, subject, folder) for e in keep_entries]))

        # إعادة بناء المصفوفة بأول 3 عناصر فقط
        new_inner = "\n        " + ",\n        ".join(keep_entries) + "\n    "
        new_array_text = text[key_start:bstart] + "[" + new_inner + "]"
        text = text[:key_start] + new_array_text + text[bend + 1:]

    return text, to_delete_dirs, kept_summary


def main():
    args = sys.argv[1:]
    dry_run = '--dry-run' in args
    auto_yes = '-y' in args
    args = [a for a in args if not a.startswith('-')]
    base_dir = args[0] if args else '/storage/emulated/0/Web'

    if not os.path.isdir(base_dir):
        print(f"❌ المسار غير موجود: {base_dir}")
        sys.exit(1)

    all_to_delete = []
    new_texts = {}

    for subject in SUBJECTS:
        js_path = os.path.join(base_dir, 'data', f'{subject}.js')
        if not os.path.isfile(js_path):
            print(f"⚠️ ملي لقيتش: {js_path}")
            continue
        new_text, to_delete, kept = process_data_file(js_path, base_dir, dry_run)
        new_texts[js_path] = new_text
        all_to_delete.extend(to_delete)

        print(f"\n=== {subject} ===")
        for subj, key, topics in kept:
            print(f"  {key}: غادي يبقاو → {topics}")

    print("\n📁 المجلدات اللي غادي يتحذفو:")
    if not all_to_delete:
        print("  (والو، ماكاين حتى حاجة زايدة)")
    for d in all_to_delete:
        print(f"  - {d}")

    if dry_run:
        print("\n(--dry-run) ما تحذف والو، هادشي غير معاينة.")
        return

    if not auto_yes:
        ans = input("\nمتأكد؟ اكتب yes باش نكمل: ").strip().lower()
        if ans != 'yes':
            print("تلغى.")
            return

    # نسخ احتياطية لملفات data/*.js قبل التعديل
    for js_path in new_texts:
        shutil.copy2(js_path, js_path + '.bak')

    # حذف المجلدات
    for d in all_to_delete:
        shutil.rmtree(d, ignore_errors=True)
        print(f"🗑️ تحذف: {d}")

    # كتابة الملفات data/*.js الجديدة
    for js_path, new_text in new_texts.items():
        with open(js_path, 'w', encoding='utf-8') as f:
            f.write(new_text)
        print(f"✅ تحدّث: {js_path} (نسخة قديمة محفوظة فـ {js_path}.bak)")

    print("\n✔️ خلص. بقاو غير أول 3 دروس/تمارين/سلاسل فالفيزياء و الكيمياء.")


if __name__ == '__main__':
    main()
