#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
fix_seo.py
==========
سكريبت كيصلح غير مشاكل الـ SEO فمشروع Xpert:

  1) meta description ناقصة  -> كيزيدها، مبنية أوتوماتيكيا من مسار الصفحة
                                 (المادة + نوع المحتوى + اسم الدرس)
  2) rel="canonical" ناقص    -> كيزيدو بـ https://jd-xpert.com/...
  3) <title> مكرر بين صفحات  -> كيزيد تمييز (Modèle N / Exercice N)

كيخدم غير على الصفحات تحت content/ (فين البنية subject/type/topic/model
معروفة). الصفحات لي ماشي تحت content/ (about.html, subjects.html...)
كيتخطاهم، خاصك تزيدهم بيدك.

الاستعمال (من جوج Termux، فـ روت المشروع):

    python3 fix_seo.py --root .            # dry-run (تجربة، بلا تعديل)
    python3 fix_seo.py --root . --apply    # تطبيق فعلي (كيدير .bak لكل ملف قبل)

بعد --apply:
    node utils/build.js && node utils/validate.js
"""

import argparse
import os
import re
import sys
from collections import Counter

DOMAIN = "https://jdxpert.pages.dev"

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

# صفحات جذر المشروع (ماشي تحت content/) — description مكتوبة يدويا لكل وحدة
ROOT_PAGE_DESCRIPTIONS = {
    "about.html": "À propos de Xpert : plateforme éducative gratuite pour les élèves de "
                  "1ère Bac Sciences Expérimentales (Maroc) — cours, exercices et séries.",
    "index.html": "Xpert : cours, exercices corrigés et séries en mathématiques, physique "
                  "et chimie pour la 1ère Bac Sciences Expérimentales au Maroc.",
    "calendrier.html": "Calendrier scolaire et planning de révision pour les élèves de "
                       "1ère Bac Sciences Expérimentales sur Xpert.",
    "installation.html": "Comment installer l'application Xpert (PWA) sur votre téléphone "
                         "ou ordinateur pour réviser hors ligne.",
    "subjects.html": "Toutes les matières disponibles sur Xpert : mathématiques, physique "
                     "et chimie pour la 1ère Bac Sciences Expérimentales.",
    "subject.html": "Cours, exercices corrigés et séries classés par matière sur Xpert, "
                    "pour la 1ère Bac Sciences Expérimentales.",
    "support.html": "Contactez l'équipe Xpert pour toute question, suggestion ou "
                    "signalement de problème sur la plateforme.",
    "terms.html": "Conditions d'utilisation et mentions légales de la plateforme "
                  "éducative Xpert.",
    "recherche.html": "Recherchez un cours, un exercice ou une série sur Xpert par "
                      "matière, niveau ou mot-clé.",
}

# فولدرات فيهم ملفات HTML ماشي صفحات حقيقية (templates ديال البناء، fragments)
SKIP_PREFIXES = ("templates/", "partials/")


# ============================================================
# أدوات عامة
# ============================================================

def read(path):
    with open(path, "r", encoding="utf-8", errors="replace") as f:
        return f.read()


def write(path, content, apply_changes):
    if not apply_changes:
        return
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
        dirnames[:] = [d for d in dirnames if d not in (".git", "node_modules")]
        for fn in filenames:
            if fn.endswith(".html"):
                out.append(os.path.join(dirpath, fn))
    return out


def parse_content_path(rel_path):
    """
    كيقرا البنية: content/<subject>/<type>/<topic>/[modelN/]file.html
    كيرجع dict، أو None إلا الصفحة ماشي تحت content/
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
    return {"subject": subject, "type": ftype, "topic": topic, "model": model, "fname": fname}


# ============================================================
# بناء description / canonical / title
# ============================================================

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
    """كيبدل التاغ إلا كاين، أو كيزيدو بعد </title> إلا ماكانش."""
    if re.search(tag_regex, html):
        return re.sub(tag_regex, new_tag, html, count=1)
    return re.sub(r"(</title>)", r"\1\n    " + new_tag, html, count=1)


def build_title_suffix(meta):
    parts_suffix = []
    if meta["model"]:
        parts_suffix.append(f"Modèle {meta['model'][5:]}")
    fnum = re.match(r"(exercice|serie|part)(\d+)\.html$", meta["fname"])
    if fnum:
        label = {"exercice": "Exercice", "serie": "Série", "part": "Partie"}[fnum.group(1)]
        parts_suffix.append(f"{label} {fnum.group(2)}")
    return " – " + " / ".join(parts_suffix) if parts_suffix else ""


# ============================================================
# المعالجة الرئيسية
# ============================================================

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
        rel_norm = rel.replace("\\", "/")
        if rel_norm.startswith(SKIP_PREFIXES):
            continue  # templates/partials: ماشي صفحات حقيقية، مانديروش عليهم

        meta = parse_content_path(rel)
        changed = False
        new_content = content

        # --- 1) عنوان مكرر: نزيدو تمييز إلا ماكانش موجود (غير لصفحات content/) ---
        if title and title in dup_titles and meta:
            suffix = build_title_suffix(meta)
            if suffix and "Modèle" not in title and "modèle" not in title and \
               "Exercice " not in title.split("|")[0]:
                new_title = title.replace(" | Xpert", f"{suffix} | Xpert")
                if new_title == title:  # مافيهاش "| Xpert" فالعنوان
                    new_title = title + suffix
                new_content = new_content.replace(
                    f"<title>{title}</title>", f"<title>{new_title}</title>", 1
                )
                changed = True
                report["titles_fixed"].append((rel, title, new_title))

        # --- 2) description ---
        desc = None
        if meta:
            desc = build_description(meta)
        elif rel_norm in ROOT_PAGE_DESCRIPTIONS:
            desc = ROOT_PAGE_DESCRIPTIONS[rel_norm]
        elif os.path.basename(rel_norm) in ROOT_PAGE_DESCRIPTIONS:
            desc = ROOT_PAGE_DESCRIPTIONS[os.path.basename(rel_norm)]

        has_desc = re.search(r'<meta\s+name="description"[^>]*>', new_content)
        if desc and not has_desc:
            new_content = upsert_head_tag(
                new_content, r'<meta\s+name="description"[^>]*>',
                f'<meta name="description" content="{desc}">'
            )
            changed = True
            report["desc_added"] += 1
        elif not desc and not has_desc:
            report["desc_skipped_unknown"].append(rel)

        # --- 3) canonical: كيتبنى من المسار، صالح لأي صفحة (content/ أو root) ---
        canon = build_canonical(rel)
        has_canon = re.search(r'<link\s+rel="canonical"[^>]*>', new_content)
        if not has_canon:
            new_content = upsert_head_tag(
                new_content, r'<link\s+rel="canonical"[^>]*>',
                f'<link rel="canonical" href="{canon}">'
            )
            changed = True
            report["canonical_added"] += 1

        if changed:
            report["files_touched"].add(rel)
            write(fp, new_content, apply_changes)


# ============================================================
# تصليح دومين غلط تزاد فـ تشغيلة سابقة (مثلا jd-xpert.com الخاطئ)
# ============================================================

def fix_wrong_domain(root, apply_changes, report, old_domain):
    old_domain = old_domain.rstrip("/")
    pattern = re.compile(
        r'(<link\s+rel="canonical"\s+href=")' + re.escape(old_domain) + r'(/[^"]*")'
    )
    files = find_html_files(root)
    for fp in files:
        rel = os.path.relpath(fp, root)
        content = read(fp)
        new_content, n = pattern.subn(r"\1" + DOMAIN + r"\2", content)
        if n:
            report["domain_fixed"] += n
            report["domain_fixed_files"].add(rel)
            write(fp, new_content, apply_changes)


# ============================================================
# MAIN
# ============================================================

def main():
    ap = argparse.ArgumentParser(description="إصلاح meta description + canonical + عناوين مكررة لمشروع Xpert")
    ap.add_argument("--root", default=".", help="مسار جذر المشروع (فيه content/)")
    ap.add_argument("--apply", action="store_true", help="طبق فعليا (بلا هاد الفلاق = dry-run)")
    ap.add_argument("--fix-domain", metavar="OLD_DOMAIN", default=None,
                     help="صلح canonical links غلط تزادو بدومين قديم، مثلا: --fix-domain https://jd-xpert.com")
    args = ap.parse_args()

    root = os.path.abspath(args.root)
    apply_changes = args.apply

    if not os.path.isdir(os.path.join(root, "content")):
        print(f"⚠️  ماكايناش content/ فـ {root} — تأكد من --root")
        sys.exit(1)

    report = {"desc_added": 0, "canonical_added": 0, "titles_fixed": [], "files_touched": set(),
               "desc_skipped_unknown": [], "domain_fixed": 0, "domain_fixed_files": set()}

    mode = "APPLY (كيتكتب فالملفات)" if apply_changes else "DRY-RUN (غير تجربة، بلا تعديل)"
    print(f"🔧 وضعية: {mode}")
    print(f"📁 روت: {root}\n")

    if args.fix_domain:
        fix_wrong_domain(root, apply_changes, report, args.fix_domain)
        print(f"دومين مصلح ({args.fix_domain} -> {DOMAIN}): {report['domain_fixed']} رابط "
              f"فـ {len(report['domain_fixed_files'])} صفحة\n")

    fix_seo(root, apply_changes, report)

    print("=" * 60)
    print("📊 التقرير")
    print("=" * 60)
    print(f"meta description مزيدة : {report['desc_added']}")
    print(f"canonical مزيد          : {report['canonical_added']}")
    print(f"عناوين مصلحة (مكررة)    : {len(report['titles_fixed'])}")
    for rel, old_t, new_t in report["titles_fixed"][:20]:
        print(f"  - {rel}\n    '{old_t}' -> '{new_t}'")
    print(f"مجموع الملفات لي تبدلو : {len(report['files_touched'])}")
    if report["desc_skipped_unknown"]:
        print(f"\n⚠️  صفحات ماعرفناش نبنيو ليها description أوتوماتيك ({len(report['desc_skipped_unknown'])}):")
        for rel in report["desc_skipped_unknown"]:
            print(f"  - {rel}")

    print("\n" + "=" * 60)
    if not apply_changes:
        print("ℹ️  هادشي كان غير dry-run. باش تطبق فعلا زيد --apply")
    else:
        print("✅ تم التطبيق. كل ملف تبدل عندو نسخة احتياطية بـ .bak")
        print("   خدم دابا: node utils/build.js && node utils/validate.js")
    print("=" * 60)


if __name__ == "__main__":
    main()
