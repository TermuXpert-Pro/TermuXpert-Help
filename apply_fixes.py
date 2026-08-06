#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Correction des erreurs trouvées dans serie2.html, serie3.html, serie4.html, serie6.html
(Généralités sur les fonctions - 1 Bac Sciences Expérimentales)
"""
import sys, os

def load(path):
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

def save(path, content):
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

def apply_one(content, old, new, label, fname):
    count = content.count(old)
    if count == 0:
        print(f"  [ATTENTION] {fname}: motif introuvable pour « {label} » — fichier peut-être déjà corrigé ou modifié.")
        return content, False
    if count > 1:
        print(f"  [ATTENTION] {fname}: motif non unique ({count} occurrences) pour « {label} » — correction annulée par prudence.")
        return content, False
    content = content.replace(old, new)
    print(f"  [OK] {fname}: « {label} » corrigé.")
    return content, True

def fix_serie2(base):
    fname = 'serie2.html'
    path = os.path.join(base, fname)
    if not os.path.exists(path):
        print(f"  [ATTENTION] {fname} introuvable, ignoré.")
        return
    c = load(path)
    total_ok = 0

    old = r"""$g(x) = \sqrt{\dfrac{x-1}{x+3}}$ sont-elles égales ?"""
    new = r"""$g(x) = \dfrac{\sqrt{x-1}}{\sqrt{x+3}}$ sont-elles égales ?"""
    c, ok = apply_one(c, old, new, "Exercice 10 - énoncé de g(x)", fname); total_ok += ok

    old = r"""Étape 2 :</span> Le domaine de définition est déterminé par : $\dfrac{x-1}{x+3} \ge 0$"""
    new = r"""Étape 2 :</span> Domaine de $f$ : il faut $\dfrac{x-1}{x+3} \ge 0$"""
    c, ok = apply_one(c, old, new, "Exercice 10 - Étape 2", fname); total_ok += ok

    old = r"""Étape 4 :</span> $D_f = D_g = ]-\infty, -3[ \cup [1, +\infty[$"""
    new = r"""Étape 4 :</span> $D_f = ]-\infty, -3[ \cup [1, +\infty[$. Domaine de $g$ : il faut $x-1 \ge 0$ et $x+3 > 0$, soit $x \ge 1$ et $x > -3$, donc $D_g = [1, +\infty[$"""
    c, ok = apply_one(c, old, new, "Exercice 10 - Étape 4 (domaine de g)", fname); total_ok += ok

    old = r"""<p style="color:#4ECDC4; margin-top:4px;"><strong>Conclusion :</strong> $f$ et $g$ ont la même expression et le même domaine de définition, donc <strong>elles sont égales</strong>.</p>"""
    new = r"""<p style="color:#4ECDC4; margin-top:4px;"><strong>Conclusion :</strong> Bien que $f(x)=g(x)$ pour tout $x \in D_g$, les domaines de définition sont différents ($D_f \neq D_g$), donc <strong>$f$ et $g$ ne sont pas égales</strong>.</p>"""
    c, ok = apply_one(c, old, new, "Exercice 10 - Conclusion", fname); total_ok += ok

    save(path, c)
    print(f"  -> {fname}: {total_ok}/4 corrections appliquées.\n")

def fix_serie3(base):
    fname = 'serie3.html'
    path = os.path.join(base, fname)
    if not os.path.exists(path):
        print(f"  [ATTENTION] {fname} introuvable, ignoré.")
        return
    c = load(path)
    total_ok = 0

    old = r"""<li>$f(x) > 0$ sur $]-\dfrac{1}{2}, -\dfrac{1}{3}[ \cup ]2, +\infty[$</li>"""
    new = r"""<li>$f(x) > 0$ sur $]-\dfrac{1}{2}, -\dfrac{1}{3}[ \cup ]\dfrac{1}{2}, 2[$</li>"""
    c, ok = apply_one(c, old, new, "Exercice 15 - intervalle positif", fname); total_ok += ok

    old = r"""<li>$f(x) < 0$ sur $]-\infty, -\dfrac{1}{2}[ \cup ]-\dfrac{1}{3}, \dfrac{1}{2}[ \cup ]\dfrac{1}{2}, 2[$</li>"""
    new = r"""<li>$f(x) < 0$ sur $]-\infty, -\dfrac{1}{2}[ \cup ]-\dfrac{1}{3}, \dfrac{1}{2}[ \cup ]2, +\infty[$</li>"""
    c, ok = apply_one(c, old, new, "Exercice 15 - intervalle négatif", fname); total_ok += ok

    save(path, c)
    print(f"  -> {fname}: {total_ok}/2 corrections appliquées.\n")

def fix_serie4(base):
    fname = 'serie4.html'
    path = os.path.join(base, fname)
    if not os.path.exists(path):
        print(f"  [ATTENTION] {fname} introuvable, ignoré.")
        return
    c = load(path)
    total_ok = 0

    old = r"""                            <div class="step">
                                <span class="step-num">Étape 3 :</span> $\sqrt{x+1}+\sqrt{2} > \sqrt{2} \Rightarrow \dfrac{1}{\sqrt{x+1}+\sqrt{2}} < \dfrac{1}{\sqrt{2}}$
                            </div>
                            <p style="color:#FF6B6B; margin-top:4px;">Cette méthode ne donne pas le résultat souhaité.</p>
                            
                            <p style="margin-top:6px; font-weight:600; color:var(--gold-text);">Méthode correcte :</p>
                            <div class="step">
                                <span class="step-num">Étape 1 :</span> $f(x) = \dfrac{1}{\sqrt{x+1}+\sqrt{2}}$
                            </div>
                            <div class="step">
                                <span class="step-num">Étape 2 :</span> Pour $x > 1$, $\sqrt{x+1}+\sqrt{2} > \sqrt{2} \Rightarrow f(x) < \dfrac{1}{\sqrt{2}}$
                            </div>
                            <p style="color:#FF6B6B;">$\dfrac{\sqrt{2}}{4} \approx 0.353$ et $\dfrac{1}{\sqrt{2}} \approx 0.707$, donc $f(x)$ n'est pas majorée par $\dfrac{\sqrt{2}}{4}$.</p>
                            <p style="color:#FF6B6B; margin-top:4px;"><strong>Conclusion :</strong> L'énoncé contient une erreur, la majoration par $\dfrac{\sqrt{2}}{4}$ est <strong>fausse</strong>.</p>"""
    new = r"""                            <div class="step">
                                <span class="step-num">Étape 3 :</span> Pour $x > 1$, on a $x+1 > 2$, donc $\sqrt{x+1} > \sqrt{2}$, d'où $\sqrt{x+1}+\sqrt{2} > 2\sqrt{2}$
                            </div>
                            <div class="step">
                                <span class="step-num">Étape 4 :</span> $f(x) = \dfrac{1}{\sqrt{x+1}+\sqrt{2}} < \dfrac{1}{2\sqrt{2}} = \dfrac{\sqrt{2}}{4}$
                            </div>
                            <p style="color:#4ECDC4; margin-top:4px;"><strong>Conclusion :</strong> $f(x) < \dfrac{\sqrt{2}}{4}$ pour tout $x \in ]1;+\infty[$, donc $f$ est <strong>majorée par $\dfrac{\sqrt{2}}{4}$</strong>.</p>"""
    c, ok = apply_one(c, old, new, "Exercice 27 - majoration (solution corrigée)", fname); total_ok += ok

    save(path, c)
    print(f"  -> {fname}: {total_ok}/1 corrections appliquées.\n")

def fix_serie6(base):
    fname = 'serie6.html'
    path = os.path.join(base, fname)
    if not os.path.exists(path):
        print(f"  [ATTENTION] {fname} introuvable, ignoré.")
        return
    c = load(path)
    total_ok = 0

    old = r"""<li>$f(x) \le -x-3 \iff x \in [-1; 2] \cup [3; +\infty[$</li>"""
    new = r"""<li>$f(x) \le -x-3 \iff x \in ]-\infty; -1] \cup [2; 3]$</li>"""
    c, ok = apply_one(c, old, new, "Exercice 43.3 - intervalle solution", fname); total_ok += ok

    old = r"""                            <div class="step">
                                <span class="step-num">Étape 4 :</span> Après développement : $-x^3 - 4x^2 - x + 7 = 0$
                            </div>
                            <div class="step">
                                <span class="step-num">Étape 5 :</span> $x = 1$ n'est pas une racine : $-1 - 4 - 1 + 7 = 1 \ne 0$ ❌
                            </div>
                            <p style="color:#FF6B6B;">Les calculs sont complexes, la résolution graphique est plus simple.</p>
                            <p style="color:#4ECDC4; margin-top:4px;"><strong>Graphiquement :</strong> Les points d'intersection sont environ $x \approx -2.7$ et $x \approx 1.2$</p>"""
    new = r"""                            <div class="step">
                                <span class="step-num">Étape 4 :</span> Après développement : $-x^3 - 4x^2 - 2x + 7 = 0$, soit $x^3 + 4x^2 + 2x - 7 = 0$
                            </div>
                            <div class="step">
                                <span class="step-num">Étape 5 :</span> $x = 1$ est une racine : $1 + 4 + 2 - 7 = 0$ ✅
                            </div>
                            <div class="step">
                                <span class="step-num">Étape 6 :</span> $x^3 + 4x^2 + 2x - 7 = (x-1)(x^2+5x+7)$, avec $\Delta = 25-28 = -3 < 0$ (pas de racine réelle pour le second facteur)
                            </div>
                            <p style="color:#4ECDC4; margin-top:4px;"><strong>Conclusion :</strong> $(C_f)$ et $(C_g)$ se coupent en un seul point, d'abscisse $x = 1$ (on vérifie $f(1) = g(1) = 0$).</p>"""
    c, ok = apply_one(c, old, new, "Exercice 45.4a - intersection f et g", fname); total_ok += ok

    save(path, c)
    print(f"  -> {fname}: {total_ok}/2 corrections appliquées.\n")

def main():
    base = sys.argv[1] if len(sys.argv) > 1 else '.'
    print(f"Dossier cible : {os.path.abspath(base)}\n")
    print("== serie2.html (Exercice 10) ==")
    fix_serie2(base)
    print("== serie3.html (Exercice 15) ==")
    fix_serie3(base)
    print("== serie4.html (Exercice 27) ==")
    fix_serie4(base)
    print("== serie6.html (Exercices 43 et 45) ==")
    fix_serie6(base)
    print("Terminé.")

if __name__ == '__main__':
    main()
