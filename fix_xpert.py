#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
fix_xpert.py
============
سكريبت واحد كيصلح 3 مشاكل تقنية فمشروع Xpert:

  1) SEO      : كيزيد/كيصلح <meta name="description"> و <link rel="canonical">
                فكل صفحة HTML، وكيفرّق العناوين <title> المكررة.
  2) DEDUP    : كيلقى <style>/<script> inline اللي مكررين بزاف بين الصفحات،
                كيطلعهم لملف مشترك واحد (assets/css/shared-inline.css و
                assets/js/shared-inline.js) وكيبدلهم بـ <link>/<script src>.
  3) ZOOM/UX  : كيصلح protection.js (كيحيد منع الزووم الكامل، كيخلي غير
                حماية الصور) وكيصلح meta viewport (كيحيد maximum-scale=1.0
                و user-scalable=no من 346 صفحة).

الاستعمال (من جوج Termux، فـ روت المشروع /storage/emulated/0/Web):

    python3 fix_xpert.py --root .                    # تجربة بلا أي تعديل (dry-run، الوضعية الافتراضية)
    python3 fix_xpert.py --root . --apply             # تطبيق التعديلات فعليا (كيدير .bak أولا)
    python3 fix_xpert.py --root . --apply --only seo
    python3 fix_xpert.py --root . --apply --only dedup --min-shared 8
    python3 fix_xpert.py --root . --apply --only zoom

ملاحظة مهمة: دير --dry-run أولا وشوف التقرير قبل ما دير --apply.
بعد --apply، خدم:  node utils/build.js && node utils/validate.js
"""

import argparse
import hashlib
import os
import re
import sys
from collections import defaultdict, Counter

DOMAIN = "https://jd-xpert.com"

SUBJECT_LABELS = {
    "math": "Mathématiques",
    "physique": "Physique",
    "chimie": "Chimie",
}
TYPE_LABELS = {
    "lessons": "Cours",
    "exercises": "Exercices corrigés",
    "series": "Série d'exercices",
    "devoirs": "Devoir surveillé",
}

HTML_EXT = ".html"


# ============================================================
# أدوات عامة
# ============================================================

def read(path):
    with open(path, "r", encoding="utf-8", errors="replace") as f:
        return f.read()


def write(path, content, backup=True, apply_changes=False):
    if not apply_changes:
        return
    if backup:
        bak = path + ".bak"
        if not os.path.exists(bak):
            with open(path, "r", encoding="utf-8", errors="replace") as f:
                original = f.read()
            with open(bak, "w", encoding="utf-8") as f:
                f.write(original)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)


def slug_to_title(slug):
    return slug.replace("-", " ").replace("_", " ").strip().capitalize()


def find_html_files(root):
    out = []
    for dirpath, dirnames, filenames in os.walk(root):
        # تفادي فولدرات ماشي منطقية نديرو عليها تعديل
        dirnames[:] = [d for d in dirnames if d not in (".git", "node_modules")]
        for fn in filenames:
            if fn.endswith(HTML_EXT):
                out.append(os.path.join(dirpath, fn))
    return out


def relpath_prefix(html_path, root):
    """كيحسب عدد ../ اللازمة باش نرجعو لروت المشروع، بلا ما نخمنو، غير كنعدو الفولدرات."""
    rel = os.path.relpath(html_path, root)
    depth = rel.count(os.sep)
    return "../" * depth


# ============================================================
# 1) SEO: description + canonical + عناوين مكررة
# ============================================================

def parse_content_path(rel_path):
    """
    كيحاول يقرا البنية: content/<subject>/<type>/<topic>/[modelN/]file.html
    كيرجع dict أو None إلا الملف ماشي تحت content/
    """
    parts = rel_path.replace("\\", "/").split("/")
    if len(parts) < 5 or parts[0] != "content":
        return None
    subject, ftype, topic = parts[1], parts[2], parts[3]
    model = None
    if len(parts) >= 6 and re.match(r"^model\d+$", parts[4]):
        model = parts[4]
        fname = parts[5]
    else:
        fname = parts[4]
    return {
        "subject": subject,
        "type": ftype,
        "topic": topic,
        "model": model,
        "fname": fname,
    }


def build_description(meta):
    subject_lbl = SUBJECT_LABELS.get(meta["subject"], meta["subject"].capitalize())
    type_lbl = TYPE_LABELS.get(meta["type"], meta["type"].capitalize())
    topic_lbl = slug_to_title(meta["topic"])
    model_part = f" (modèle {meta['model'][5:]})" if meta["model"] else ""
    desc = (
        f"{type_lbl} : {topic_lbl}{model_part} — {subject_lbl}, "
        f"1ère Bac Sciences Expérimentales. Corrigé détaillé sur Xpert."
    )
    return desc[:158]


def build_canonical(rel_path):
    url_path = rel_path.replace("\\", "/")
    if url_path.endswith("index.html"):
        url_path = url_path[: -len("index.html")]
    return f"{DOMAIN}/{url_path}" if url_path else f"{DOMAIN}/"


def upsert_head_tag(html, tag_regex, new_tag):
    """كيبدل التاغ إلا كاين، أو كيزيده بعد </title> إلا ماكاينش."""
    if re.search(tag_regex, html):
        return re.sub(tag_regex, new_tag, html, count=1)
    return re.sub(r"(</title>)", r"\1\n    " + new_tag, html, count=1)


def fix_seo(root, apply_changes, report):
    files = find_html_files(root)
    titles = []
    file_info = []

    for fp in files:
        rel = os.path.relpath(fp, root)
        content = read(fp)
        if "<html" not in content:  # partials/fragments، منديروش عليهم
            continue
        tmatch = re.search(r"<title>(.*?)</title>", content, re.S)
        title = tmatch.group(1).strip() if tmatch else None
        titles.append(title)
        file_info.append((fp, rel, content, title))

    dup_titles = {t for t, c in Counter(titles).items() if t and c > 1}

    for fp, rel, content, title in file_info:
        meta = parse_content_path(rel)
        changed = False
        new_content = content

        # --- عنوان مكرر: نزيدو تمييز (Modèle N + رقم التمرين/الجزء إلا كاين) ---
        if title and title in dup_titles and meta:
            parts_suffix = []
            if meta["model"]:
                parts_suffix.append(f"Modèle {meta['model'][5:]}")
            fnum = re.match(r"(exercice|serie|part)(\d+)\.html$", meta["fname"])
            if fnum:
                label = {"exercice": "Exercice", "serie": "Série", "part": "Partie"}[fnum.group(1)]
                parts_suffix.append(f"{label} {fnum.group(2)}")
            suffix = " – " + " / ".join(parts_suffix) if parts_suffix else ""
            if suffix and "Modèle" not in title and "modèle" not in title and "Exercice " not in title.split("|")[0]:
                new_title = title.replace(" | Xpert", f"{suffix} | Xpert")
                if new_title == title:  # مافيهاش "| Xpert"
                    new_title = title + suffix
                new_content = new_content.replace(
                    f"<title>{title}</title>", f"<title>{new_title}</title>", 1
                )
                changed = True
                report["titles_fixed"].append((rel, title, new_title))

        # --- description و canonical: غير للصفحات تحت content/ (فين عندنا معلومات كافية) ---
        if meta:
            desc = build_description(meta)
            canon = build_canonical(rel)

            desc_tag = f'<meta name="description" content="{desc}">'
            canon_tag = f'<link rel="canonical" href="{canon}">'

            has_desc = re.search(r'<meta\s+name="description"[^>]*>', new_content)
            has_canon = re.search(r'<link\s+rel="canonical"[^>]*>', new_content)

            if not has_desc:
                new_content = upsert_head_tag(
                    new_content, r'<meta\s+name="description"[^>]*>', desc_tag
                )
                changed = True
                report["desc_added"] += 1
            if not has_canon:
                new_content = upsert_head_tag(
                    new_content, r'<link\s+rel="canonical"[^>]*>', canon_tag
                )
                changed = True
                report["canonical_added"] += 1

        if changed:
            report["files_touched_seo"].add(rel)
            write(fp, new_content, apply_changes=apply_changes)


# ============================================================
# 2) DEDUP: طلوع الـ CSS/JS inline المكرر لملف مشترك
# ============================================================

STYLE_RE = re.compile(r"<style[^>]*>(.*?)</style>", re.S)
SCRIPT_RE = re.compile(r"<script(?![^>]*\bsrc=)[^>]*>(.*?)</script>", re.S)


def norm_block(text):
    return text.strip()


def dedup_pass(root, apply_changes, report, min_shared, kind):
    """
    kind = 'style' or 'script'
    كيدير جوج مرات:
      Pass 1: كيجمع كل block ومعاه hash، كيحسب عدد التكرار
      Pass 2: أي block تكرر >= min_shared، كيطلعو لملف مشترك وكيبدلو بمرجع
    """
    pattern = STYLE_RE if kind == "style" else SCRIPT_RE
    shared_path = (
        "assets/css/shared-inline.css" if kind == "style" else "assets/js/shared-inline.js"
    )
    shared_abs = os.path.join(root, shared_path)

    files = find_html_files(root)
    block_files = defaultdict(set)  # hash -> set(files)
    block_text = {}

    for fp in files:
        content = read(fp)
        for m in pattern.finditer(content):
            b = norm_block(m.group(1))
            if len(b) < 40:  # تفادي بلوكات صغيرة بلا فائدة
                continue
            h = hashlib.sha1(b.encode("utf-8")).hexdigest()
            block_files[h].add(fp)
            block_text[h] = b

    shared_hashes = sorted({h for h, fps in block_files.items() if len(fps) >= min_shared})
    if not shared_hashes:
        report[f"{kind}_shared_blocks"] = 0
        return

    # كتب الملف المشترك (مرة وحدة، بكل البلوكات المشتركة مفصولة)
    shared_content_parts = []
    for h in shared_hashes:
        shared_content_parts.append(
            f"/* --- shared block {h[:8]} (used in {len(block_files[h])} files) --- */\n"
            + block_text[h]
        )
    shared_file_content = "\n\n".join(shared_content_parts) + "\n"

    if apply_changes:
        os.makedirs(os.path.dirname(shared_abs), exist_ok=True)
        with open(shared_abs, "w", encoding="utf-8") as f:
            f.write(shared_file_content)

    report[f"{kind}_shared_blocks"] = len(shared_hashes)
    report[f"{kind}_shared_bytes"] = len(shared_file_content)

    # Pass 2: بدّل فكل ملف
    for fp in files:
        rel = os.path.relpath(fp, root)
        content = read(fp)
        original = content
        prefix = relpath_prefix(fp, root)
        ref_href = prefix + shared_path

        def repl(m):
            b = norm_block(m.group(1))
            h = hashlib.sha1(b.encode("utf-8")).hexdigest()
            if h in shared_hashes:
                report[f"{kind}_blocks_removed"] += 1
                return ""  # كنحيدو البلوك، الرابط للملف المشترك كنزيدوه مرة وحدة تحت
            return m.group(0)

        content = pattern.sub(repl, content)

        if content != original:
            tag = (
                f'<link rel="stylesheet" href="{ref_href}">'
                if kind == "style"
                else f'<script src="{ref_href}"></script>'
            )
            if ref_href not in content:
                if kind == "style":
                    content = re.sub(r"(</title>)", r"\1\n    " + tag, content, count=1)
                else:
                    content = re.sub(r"(</head>)", "    " + tag + r"\n\1", content, count=1)
            report[f"{kind}_files_touched"].add(rel)
            write(fp, content, apply_changes=apply_changes)


# ============================================================
# 3) ZOOM/UX: protection.js + meta viewport
# ============================================================

def fix_protection_js(root, apply_changes, report):
    path = os.path.join(root, "assets", "js", "protection.js")
    if not os.path.exists(path):
        report["protection_js_found"] = False
        return
    report["protection_js_found"] = True
    content = read(path)
    original = content

    # 3.1 حيد قاعدة html { touch-action: pan-x pan-y !important; } كاملة
    content = re.sub(
        r"\n\s*html\s*\{\s*touch-action:\s*pan-x pan-y !important;\s*\}\n?",
        "\n",
        content,
    )

    # 3.2 حيد قسم "منع التكبير - الهاتف" (pinch + double-tap) كاملة
    content = re.sub(
        r"\n\s*//.*منع التكبير \(زووم\) - الهاتف.*?(?=\n\s*//.*=====|\n\s*console\.log)",
        "\n",
        content,
        flags=re.S,
    )

    # 3.3 حيد قسم "منع التكبير - الكمبيوتر" كاملة
    content = re.sub(
        r"\n\s*//.*منع التكبير \(زووم\) - الكمبيوتر.*?(?=\n\s*console\.log)",
        "\n",
        content,
        flags=re.S,
    )

    content = content.replace(
        "حماية الصور + منع الزووم فـ جميع الأجهزة",
        "حماية الصور فقط (الزووم بقى مسموح بالكامل للمستخدم)",
    )
    content = re.sub(
        r"\+ منع الزووم بجميع الطرق.*?\n",
        "",
        content,
    )

    if content != original:
        report["protection_js_changed"] = True
        write(path, content, apply_changes=apply_changes)
    else:
        report["protection_js_changed"] = False


def fix_viewport(root, apply_changes, report):
    files = find_html_files(root)
    old = 'content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"'
    new = 'content="width=device-width, initial-scale=1.0, viewport-fit=cover"'
    for fp in files:
        content = read(fp)
        if old in content:
            content = content.replace(old, new)
            report["viewport_fixed"] += 1
            write(fp, content, apply_changes=apply_changes)


# ============================================================
# MAIN
# ============================================================

def main():
    ap = argparse.ArgumentParser(description="إصلاح SEO + dedup + zoom لمشروع Xpert")
    ap.add_argument("--root", default=".", help="مسار جذر المشروع (فيه content/, assets/)")
    ap.add_argument("--apply", action="store_true", help="طبق التعديلات فعليا (بلا هاد الفلاق = dry-run)")
    ap.add_argument(
        "--only",
        choices=["seo", "dedup", "zoom", "all"],
        default="all",
        help="دير غير جزء معين",
    )
    ap.add_argument("--min-shared", type=int, default=6, help="عتبة التكرار باش نطلعو block لملف مشترك")
    args = ap.parse_args()

    root = os.path.abspath(args.root)
    apply_changes = args.apply

    if not os.path.isdir(os.path.join(root, "content")):
        print(f"⚠️  ماكايناش content/ فـ {root} — تأكد من --root")
        sys.exit(1)

    report = defaultdict(int)
    report["titles_fixed"] = []
    report["files_touched_seo"] = set()
    report["style_files_touched"] = set()
    report["script_files_touched"] = set()

    mode = "APPLY (كيتكتب فالملفات)" if apply_changes else "DRY-RUN (غير تجربة، بلا تعديل)"
    print(f"🔧 وضعية: {mode}")
    print(f"📁 روت: {root}\n")

    if args.only in ("seo", "all"):
        fix_seo(root, apply_changes, report)

    if args.only in ("dedup", "all"):
        dedup_pass(root, apply_changes, report, args.min_shared, "style")
        dedup_pass(root, apply_changes, report, args.min_shared, "script")

    if args.only in ("zoom", "all"):
        fix_protection_js(root, apply_changes, report)
        fix_viewport(root, apply_changes, report)

    # ====== تقرير نهائي ======
    print("=" * 60)
    print("📊 التقرير")
    print("=" * 60)

    if args.only in ("seo", "all"):
        print(f"\n[SEO]")
        print(f"  meta description مزيدة : {report.get('desc_added', 0)}")
        print(f"  canonical مزيد          : {report.get('canonical_added', 0)}")
        print(f"  عناوين مصلحة (مكررة)    : {len(report.get('titles_fixed', []))}")
        for rel, old_t, new_t in report.get("titles_fixed", [])[:15]:
            print(f"    - {rel}\n      '{old_t}' -> '{new_t}'")
        print(f"  مجموع الملفات لي تبدلو : {len(report.get('files_touched_seo', []))}")

    if args.only in ("dedup", "all"):
        print(f"\n[DEDUP CSS]")
        print(f"  blocks مشتركة موجودة  : {report.get('style_shared_blocks', 0)}")
        print(f"  حجم الملف المشترك      : {report.get('style_shared_bytes', 0)/1024:.1f} KB")
        print(f"  blocks تحيدو من الصفحات: {report.get('style_blocks_removed', 0)}")
        print(f"  عدد الصفحات لي تبدلو   : {len(report.get('style_files_touched', []))}")

        print(f"\n[DEDUP JS]")
        print(f"  blocks مشتركة موجودة  : {report.get('script_shared_blocks', 0)}")
        print(f"  حجم الملف المشترك      : {report.get('script_shared_bytes', 0)/1024:.1f} KB")
        print(f"  blocks تحيدو من الصفحات: {report.get('script_blocks_removed', 0)}")
        print(f"  عدد الصفحات لي تبدلو   : {len(report.get('script_files_touched', []))}")

    if args.only in ("zoom", "all"):
        print(f"\n[ZOOM/UX]")
        print(f"  protection.js موجود؟   : {report.get('protection_js_found', False)}")
        print(f"  protection.js تصلح؟    : {report.get('protection_js_changed', False)}")
        print(f"  صفحات viewport تصلحو   : {report.get('viewport_fixed', 0)}")

    print("\n" + "=" * 60)
    if not apply_changes:
        print("ℹ️  هادشي كان غير dry-run. باش تطبق فعلا زيد --apply")
    else:
        print("✅ تم التطبيق. كل ملف تبدل عندو نسخة احتياطية بـ .bak")
        print("   خدم دابا: node utils/build.js && node utils/validate.js")
    print("=" * 60)


if __name__ == "__main__":
    main()
