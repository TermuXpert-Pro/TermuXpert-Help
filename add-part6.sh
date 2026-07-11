#!/bin/bash

# ============================================================
# سكربت إضافة Partie 6 إلى index.html
# ============================================================

echo "🔄 بدء إضافة Partie 6 إلى index.html..."

cd /storage/emulated/0/Web/content/math/lessons/logique

# ====== 1. عمل نسخة احتياطية ======
cp index.html index.html.bak
echo "✅ تم إنشاء نسخة احتياطية: index.html.bak"

# ====== 2. إضافة Partie 6 قبل </div> الختامي ======
sed -i '/<!-- Partie 5 -->/a\
                <!-- Partie 6 -->\
                <a href="part6.html" class="part-link" style="display:block; background:var(--bg-card); border:1px solid var(--border); border-radius:8px; padding:8px 12px; margin-bottom:8px; color:var(--text-primary); text-decoration:none; transition:all 0.3s ease; cursor:pointer;">\
                    <div style="display:flex; align-items:center; gap:10px;">\
                        <span style="color:#F4D03F; font-size:18px; flex-shrink:0;"><i class="fas fa-book-open"></i></span>\
                        <div style="flex:1;">\
                            <div style="color:#F4D03F; font-weight:700; font-size:13px;">Partie 6</div>\
                            <div style="color:var(--text-secondary); font-size:12px; line-height:1.4;">Résumé complet - Synthèse du cours</div>\
                        </div>\
                        <span style="color:var(--text-muted); font-size:12px; flex-shrink:0;"><i class="fas fa-chevron-left"></i></span>\
                    </div>\
                </a>' index.html

# ====== 3. التحقق من الإضافة ======
if grep -q "Partie 6" index.html; then
    echo "✅ تم إضافة Partie 6 بنجاح!"
else
    echo "❌ حدث خطأ أثناء الإضافة"
    exit 1
fi

# ====== 4. عرض النتيجة ======
echo ""
echo "=================================================="
echo "✅ تم تحديث index.html بنجاح!"
echo ""
echo "📋 التغييرات المطبقة:"
echo "   ✅ إضافة Partie 6 - Résumé complet"
echo "   ✅ أيقونة جديدة (fa-book-open)"
echo "   ✅ لون F4D03F (أصفر) مميز"
echo ""
echo "📁 الملفات:"
echo "   ✅ index.html (معدل)"
echo "   📦 index.html.bak (نسخة احتياطية)"
echo "=================================================="
echo ""
echo "📤 لرفع التغييرات إلى GitHub:"
echo "   cd /storage/emulated/0/Web"
echo "   git add ."
echo "   git commit -m '📝 إضافة Partie 6 - Résumé complet du cours'"
echo "   git pull --rebase origin main"
echo "   git push"
echo "=================================================="

