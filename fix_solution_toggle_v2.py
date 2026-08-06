#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
fix_solution_toggle_v2.py
==========================
كنفس السكريبت السابق، غير هاد المرة كنستعملو التصميم **الرسمي** لزر
"Voir la solution" بالضبط كيفما هو موجود فصفحات التمارين
(content/*/exercises/*/model1/exerciceN.html) : نفس الأصناف
(.toggle-sol / .solution-box / .sol-title / .sol-content) ونفس دالة
toggleSolution()، بدل التصميم المؤقت ديال fix_solution_toggle.py.

الاستعمال:
    python3 fix_solution_toggle_v2.py part1.html part2.html ...
    python3 fix_solution_toggle_v2.py --dir "content/physique/lessons/rotation-solide/model1"
    python3 fix_solution_toggle_v2.py --dir dossier1 --dir dossier2 --outdir out/

ملاحظة: كنطبقو غير على ملفات الدروس (partX.html) اللي عندها بلوكات
".exemple-box" بحساب رقمي، أو بلوكات "highlight-box" رأسها "Solution".
ملفات التمارين (exerciceN.html) عندها هاد التصميم من الأصل، ما كنبدلوش فيها.
"""

import sys
import glob
import argparse
import os
from bs4 import BeautifulSoup

# ---------------------------------------------------------------------------
# CSS / JS مأخوذين حرفياً من exercice1.html (نفس التصميم الرسمي للموقع)
# ---------------------------------------------------------------------------

TOGGLE_CSS = """
<style id="sol-toggle-style">
.solution-box {
    background: var(--solution-bg);
    border: 1px solid var(--solution-border);
    border-radius: 6px;
    padding: 6px 10px;
    margin: 4px 0;
    display: none;
}
.solution-box.show { display: block; }
.solution-box .sol-title {
    color: var(--solution-title);
    font-weight: 700;
    font-size: 13px;
    margin-bottom: 2px;
}
.solution-box .sol-content {
    color: var(--text-secondary);
    font-size: 11.5px;
    line-height: 1.6;
}
.solution-box .sol-content .step {
    background: var(--bg-primary);
    border-right: 3px solid #FF6B6B;
    padding: 3px 10px;
    margin: 3px 0;
    border-radius: 4px;
    color: var(--text-secondary);
    font-size: 11px;
}
.solution-box .sol-content .step .step-num {
    color: #FF6B6B;
    font-weight: 700;
    margin-left: 6px;
    font-size: 11px;
}
.solution-box .sol-content .formula-block {
    background: var(--bg-primary);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 4px 8px;
    margin: 3px 0;
    text-align: center;
    overflow-x: auto;
    font-size: 12px;
}
.solution-box .sol-content .highlight-box {
    padding: 4px 8px;
    margin: 4px 0;
    border-right-width: 3px;
}
.solution-box .sol-content .highlight-box .label {
    font-size: 11px;
    padding: 1px 8px;
    margin-bottom: 2px;
}
.solution-box .sol-content .highlight-box.green { border-color: #4ECDC4; background: rgba(78, 205, 196, 0.08); }
.solution-box .sol-content .highlight-box.yellow { border-color: #F4D03F; background: rgba(244, 208, 63, 0.08); }
.solution-box .sol-content .highlight-box.purple { border-color: #BB8FCE; background: rgba(187, 143, 206, 0.08); }
.toggle-sol {
    background: var(--bg-card);
    border: 1px solid var(--border);
    color: #FF6B6B;
    padding: 3px 10px;
    border-radius: 6px;
    cursor: pointer;
    font-family: var(--font-main);
    font-size: 13px;
    font-weight: 600;
    transition: all 0.2s ease;
    margin-top: 4px;
}
.toggle-sol:hover {
    border-color: #FF6B6B;
    background: rgba(255, 107, 107, 0.1);
}
</style>
""".strip()

TOGGLE_JS = """
<script id="sol-toggle-script">
function toggleSolution(id) {
    var el = document.getElementById(id);
    var btn = el.previousElementSibling;
    if (el.classList.contains('show')) {
        el.classList.remove('show');
        if (btn) btn.textContent = 'Voir la solution';
    } else {
        el.classList.add('show');
        if (btn) btn.textContent = 'Cacher la solution';
        if (window.MathJax && window.MathJax.typesetPromise) {
            window.MathJax.typesetPromise([el]);
        }
    }
}
</script>
""".strip()

BOX_SELECTORS = ".exemple-box, .activity-box, .activite-box, .application-box, .exercise-box"


def find_solution_start(children):
    """أول عنصر من children كيبدا منو 'الحل' (خطوات Étape أو formula-block)."""
    for i, c in enumerate(children):
        classes = c.get("class") or []
        if "step" in classes or "step-num" in classes or "formula-block" in classes:
            return i
        if c.find(class_="step") is not None or c.find(class_="step-num") is not None:
            return i
        if c.find(class_="formula-block") is not None:
            return i
        t = c.get_text(strip=True)
        if t.startswith("Étape 1") or t.startswith("Solution") or t.startswith("✅"):
            return i
    return None


def find_solution_labeled_boxes(soup):
    """بلوكات highlight-box اللي عنوانها (span.label) هو 'Solution' بالضبط."""
    boxes = []
    for span in soup.find_all("span", class_="label"):
        if span.get_text(strip=True) == "Solution":
            parent = span.parent
            if parent is not None:
                boxes.append(parent)
    return boxes


def make_toggle_button(soup, sol_id):
    btn = soup.new_tag(
        "button",
        **{
            "class": "toggle-sol",
            "type": "button",
            "aria-label": "Afficher ou cacher la solution",
            "onclick": "toggleSolution('%s')" % sol_id,
        }
    )
    btn.string = "Voir la solution"
    return btn


def wrap_solution(soup, box, sol_id):
    """يحول محتوى الحل (الخطوات/formula-block) لبلوك .solution-box الرسمي."""
    children = list(box.find_all(recursive=False))
    start = find_solution_start(children)
    if start is None:
        return False

    sol_content = soup.new_tag("div", **{"class": "sol-content"})
    for c in children[start:]:
        sol_content.append(c.extract())

    sol_title = soup.new_tag("div", **{"class": "sol-title"})
    sol_title.string = "✅ Solution détaillée"

    solution_box = soup.new_tag("div", **{"class": "solution-box", "id": sol_id})
    solution_box.append(sol_title)
    solution_box.append(sol_content)

    box.append(make_toggle_button(soup, sol_id))
    box.append(solution_box)
    return True


def wrap_full_box_as_solution(soup, box, sol_id):
    """
    كيستعمل مع بلوكات Question/Solution (activite-box) — البلوك بأكمله
    (ما عدا span.label 'Solution') كيدخل لـ .sol-content داخل .solution-box.
    """
    if "solution-box" in (box.get("class") or []):
        return False  # تبدل من قبل

    children = list(box.find_all(recursive=False))
    sol_content = soup.new_tag("div", **{"class": "sol-content"})
    for c in children:
        # منخليوش span.label "Solution" (غادي نبدلوها بـ sol-title)
        if c.name == "span" and "label" in (c.get("class") or []) and c.get_text(strip=True) == "Solution":
            c.extract()
            continue
        sol_content.append(c.extract())

    sol_title = soup.new_tag("div", **{"class": "sol-title"})
    sol_title.string = "✅ Solution détaillée"

    solution_box = soup.new_tag("div", **{"class": "solution-box", "id": sol_id})
    solution_box.append(sol_title)
    solution_box.append(sol_content)

    btn = make_toggle_button(soup, sol_id)
    box.insert_before(btn)
    box.insert_before(solution_box)
    box.decompose()  # كنحيدو الصندوق الأصلي الفارغ (highlight-box green)
    return True


def process_file(path, outdir=None):
    with open(path, encoding="utf-8") as f:
        html = f.read()

    soup = BeautifulSoup(html, "html.parser")
    already = soup.find(id="sol-toggle-script") is not None

    if soup.head is not None and soup.find(id="sol-toggle-style") is None:
        soup.head.append(BeautifulSoup(TOGGLE_CSS, "html.parser"))
    if soup.body is not None and soup.find(id="sol-toggle-script") is None:
        soup.body.append(BeautifulSoup(TOGGLE_JS, "html.parser"))

    count = 0
    base = os.path.splitext(os.path.basename(path))[0]

    for i, box in enumerate(soup.select(BOX_SELECTORS), start=1):
        if box.find("button", class_="toggle-sol") is not None:
            continue
        sol_id = "autosol_%s_%d" % (base, i)
        if wrap_solution(soup, box, sol_id):
            count += 1

    for j, box in enumerate(find_solution_labeled_boxes(soup), start=1):
        sol_id = "autosolbox_%s_%d" % (base, j)
        if wrap_full_box_as_solution(soup, box, sol_id):
            count += 1

    out_path = path
    if outdir:
        os.makedirs(outdir, exist_ok=True)
        out_path = os.path.join(outdir, os.path.basename(path))

    with open(out_path, "w", encoding="utf-8") as f:
        f.write(str(soup))

    note = "(كان فيه toggle من قبل)" if already else ""
    print("%s -> %d بلوك(ات) تحولات للتصميم الرسمي 'Voir la solution' %s" % (path, count, note))


def main():
    ap = argparse.ArgumentParser(description="إضافة تصميم Voir la solution الرسمي لدروس Xpert")
    ap.add_argument("files", nargs="*")
    ap.add_argument("--dir", action="append", default=[])
    ap.add_argument("--outdir", default=None)
    args = ap.parse_args()

    targets = list(args.files)
    for d in args.dir:
        targets += sorted(glob.glob(os.path.join(d, "part*.html")))

    if not targets:
        print("ما كاين حتى ملف. مثال:\n"
              "  python3 fix_solution_toggle_v2.py part1.html part2.html\n"
              "  python3 fix_solution_toggle_v2.py --dir ./rotation-solide/model1")
        sys.exit(1)

    for path in targets:
        process_file(path, outdir=args.outdir)


if __name__ == "__main__":
    main()
