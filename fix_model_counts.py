#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
fix_model_counts.py — يضيف/يصلح السطر:
    <div style="color:var(--text-secondary); font-size:12px;">N parties disponibles</div>
(أو "N exercices disponibles" / "N séries disponibles") فبطاقات "Modèle N"
جوا كل ملفات content/<matiere>/(lessons|exercises|series)/<leçon>/index.html

المنطق:
  - كيدور على كل بطاقة <a href="modelX/index.html" ...>...</a>
  - كيعد الملفات الحقيقية جوا modelX/ (part*.html / exercice*.html / serie*.html)
  - إلا كان العدد 0 (درس مازال قيد الإعداد بلا محتوى) -> ما كيمسوش، كيخلي الصفحة كيفما هي
  - إلا كان العدد >= 1 -> كيزيد أو كيصلح السطر بالعدد الصحيح (مفرد/جمع صحيح:
        "1 partie disponible" / "3 parties disponibles"
        "1 exercice disponible" / "5 exercices disponibles"
        "1 série disponible"    / "4 séries disponibles")

الاستعمال:
    python3 fix_model_counts.py /storage/emulated/0/Web --dry-run
    python3 fix_model_counts.py /storage/emulated/0/Web
    python3 fix_model_counts.py /storage/emulated/0/Web --no-backup
"""

import re
import sys
import argparse
from pathlib import Path

TYPE_CONFIG = {
    "lessons":   {"prefix": "part",     "singular": "partie",   "plural": "parties"},
    "exercises": {"prefix": "exercice", "singular": "exercice", "plural": "exercices"},
    "series":    {"prefix": "serie",    "singular": "série",    "plural": "séries"},
}

CARD_RE = re.compile(r'<a href="model(\d+)/index\.html".*?</a>', re.S)
TITLE_RE_TMPL = (
    r'(Modèle {n}</div>)\s*'
    r'(?:<div style="color:var\(--text-secondary\); font-size:12px;">[^<]*</div>)?\s*'
    r'(</div>)'
)


def make_count_text(n: int, cfg: dict) -> str:
    word = cfg["singular"] if n == 1 else cfg["plural"]
    adj = "disponible" if n == 1 else "disponibles"
    return f"{n} {word} {adj}"


def fix_index_html(html: str, slug_dir: Path, type_key: str):
    cfg = TYPE_CONFIG[type_key]
    changed = [False]

    def repl(m):
        n = m.group(1)
        model_dir = slug_dir / f"model{n}"
        if not model_dir.is_dir():
            return m.group(0)
        part_files = sorted(
            model_dir.glob(f"{cfg['prefix']}*.html"),
            key=lambda p: int(re.search(r'\d+', p.stem).group())
        )
        count = len(part_files)
        if count == 0:
            return m.group(0)  # leçon/modèle encore vide -> ne pas afficher de compteur

        # Pour les leçons : ne pas compter le résumé (dernière partie) dans "N parties disponibles"
        if type_key == "lessons" and part_files:
            try:
                last_html = part_files[-1].read_text(encoding="utf-8")
                title_m = re.search(r'<h1 class="lesson-title">(.*?)</h1>', last_html, re.S)
                title_txt = re.sub(r'<[^>]+>', '', title_m.group(1)) if title_m else ""
                if "Résumé" in title_txt:
                    count -= 1
            except Exception:
                pass

        if count == 0:
            return m.group(0)  # ne restait que le résumé -> pas de compteur

        block = m.group(0)
        title_re = re.compile(TITLE_RE_TMPL.format(n=re.escape(n)))
        count_div = (
            f'<div style="color:var(--text-secondary); font-size:12px;">'
            f'{make_count_text(count, cfg)}</div>'
        )

        def title_repl(tm):
            return f'{tm.group(1)}\n{" "*28}{count_div}\n{" "*24}{tm.group(2)}'

        new_block, n_sub = title_re.subn(title_repl, block, count=1)
        if n_sub and new_block != block:
            changed[0] = True
            return new_block
        return block

    new_html = CARD_RE.sub(repl, html)
    return new_html, changed[0]


def main():
    parser = argparse.ArgumentParser(description="Ajoute/corrige le compteur de parties/exercices/séries dans les cartes modèle.")
    parser.add_argument("root", help="Dossier racine du site (ex: /storage/emulated/0/Web)")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--no-backup", action="store_true")
    args = parser.parse_args()

    root = Path(args.root)
    if not root.exists():
        print(f"Dossier introuvable: {root}")
        sys.exit(1)

    targets = []
    for type_key in TYPE_CONFIG:
        targets += sorted(root.glob(f"content/*/{type_key}/*/index.html"))

    print(f"{len(targets)} fichiers index.html trouvés (lessons + exercises + series).\n")

    fixed, untouched, errors = 0, 0, 0

    for fpath in targets:
        type_key = fpath.parent.parent.parent.name  # .../<type>/<slug>/index.html -> parent.parent = <type> dir's child? recompute below
        # chemin: content/<matiere>/<type>/<slug>/index.html
        parts = fpath.parts
        try:
            type_idx = parts.index("content") + 2
            type_key = parts[type_idx]
        except (ValueError, IndexError):
            continue
        if type_key not in TYPE_CONFIG:
            continue

        slug_dir = fpath.parent
        try:
            html = fpath.read_text(encoding="utf-8")
        except Exception as e:
            print(f"✗ ERREUR lecture {fpath}: {e}")
            errors += 1
            continue

        new_html, changed = fix_index_html(html, slug_dir, type_key)
        rel = fpath.relative_to(root)

        if not changed:
            untouched += 1
            continue

        print(f"✓ {rel}")
        fixed += 1

        if not args.dry_run:
            if not args.no_backup:
                bak = fpath.with_suffix(fpath.suffix + ".bak3")
                if not bak.exists():
                    bak.write_text(html, encoding="utf-8")
            fpath.write_text(new_html, encoding="utf-8")

    print("\n" + "=" * 50)
    print(f"Corrigés    : {fixed}")
    print(f"Déjà OK/vide: {untouched}")
    print(f"Erreurs     : {errors}")
    if args.dry_run:
        print("\n(mode --dry-run : aucun fichier n'a été modifié)")


if __name__ == "__main__":
    main()
