#!/data/data/com.termux/files/usr/bin/bash
# يصلح مشكلة: Table des matières بلا خلفية + أرقامها زرق (لون افتراضي للينكات)
# بسبب نقصان كلاسات CSS (.toc, .summary-card, .formula-card, .highlight-box.gold, .label.summary)
# اللي كاينة فالملفات ولكن ماشي معرّفة فـ <style>

set -e

CSS_BLOCK='insert_toc.sed'
cat > "$CSS_BLOCK" << 'SEDEOF'
/<\/style>/i\
        .highlight-box .label.summary { background: #F4D03F44; color:var(--gold-text); font-size: 14px; }\
        .highlight-box.gold { border-color: #F4D03F; background: rgba(244, 208, 63, 0.12); }\
        .summary-card { background: rgba(244, 208, 63, 0.03); border: 1px solid #F4D03F22; border-radius: 8px; padding: 8px 12px; margin: 6px 0; }\
        .summary-card .s-title { color: #FF6B6B; font-weight: 700; font-size: 13px; margin-bottom: 2px; }\
        .summary-card .s-content { color: var(--text-secondary); font-size: 12px; line-height: 1.6; }\
        .toc { background: var(--bg-card); border: 1px solid var(--border); border-radius: 8px; padding: 10px 14px; margin-bottom: 12px; }\
        .toc h3 { color:var(--gold-text); font-size: 13px; font-weight: 700; margin-bottom: 6px; }\
        .toc ul { list-style: none; padding: 0; }\
        .toc ul li { margin-bottom: 2px; }\
        .toc ul li a { color: var(--text-secondary); font-size: 12px; text-decoration: none; transition: color 0.2s; display: flex; align-items: center; gap: 6px; }\
        .toc ul li a:hover { color: #FF6B6B; }\
        .toc ul li a .num { color: #FF6B6B; font-weight: 700; font-size: 11px; min-width: 20px; }\
        .formula-card { background: rgba(255, 107, 107, 0.05); border: 1px solid #FF6B6B22; border-radius: 6px; padding: 6px 10px; margin: 3px 0; }
SEDEOF

FILES=(
  "content/physique/lessons/comportement-global-circuit/model1/part5.html"
  "content/math/lessons/produit-scalaire/model1/part6.html"
)

for f in "${FILES[@]}"; do
  if [ -f "$f" ]; then
    if grep -q 'class="toc"' "$f"; then
      sed -i -f "$CSS_BLOCK" "$f"
      echo "✅ تصلاح: $f"
    else
      echo "⚠️ ماكايناش class=\"toc\" فـ: $f (تحقق منه يدوياً)"
    fi
  else
    echo "❌ ماكاينش الملف: $f (شغل السكريبت من جذر Web/)"
  fi
done

rm -f "$CSS_BLOCK"
echo "🎉 تم. دابا رد بلد build:"
echo "node utils/build.js && node utils/inject-pwa-head.js && node utils/generate-sitemap.js && node utils/validate.js"
