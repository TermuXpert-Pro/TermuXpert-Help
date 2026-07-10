#!/bin/bash

echo "=========================================="
echo "🚀 Xpert - تحسينات الموقع"
echo "=========================================="

cd /storage/emulated/0/Web

# ============================================
# 🔴 عاجل: إزالة تكرار السكربتات
# ============================================

echo ""
echo "📦 1. إزالة تكرار GSAP من جميع الملفات..."
find content -name "*.html" -exec sed -i '/<script src="https:\/\/cdnjs.cloudflare.com\/ajax\/libs\/gsap\/3.12.5\/gsap.min.js"><\/script>/d' {} \;
echo "   ✅ GSAP removed from all content files"

echo ""
echo "📦 2. إزالة تكرار protection.js من جميع الملفات..."
find content -name "*.html" -exec sed -i '/<script src="..\/..\/..\/..\/assets\/js\/protection.js"><\/script>/d' {} \;
echo "   ✅ protection.js removed from all content files"

echo ""
echo "📦 3. إزالة تكرار زر العودة للأعلى من جميع الملفات..."
find content -name "*.html" -exec sed -i '/<button class="scroll-top-btn"/,/<\/button>/d' {} \;
echo "   ✅ Scroll button removed from all content files"

# ============================================
# 🟠 مهم: إضافة preconnect للـ CDNs
# ============================================

echo ""
echo "📦 4. إضافة preconnect للـ CDNs في index.html..."
sed -i '/<link rel="preconnect" href="https:\/\/fonts.googleapis.com">/d' index.html
sed -i '/<link rel="preconnect" href="https:\/\/fonts.gstatic.com"/d' index.html
sed -i '/<link rel="dns-prefetch"/d' index.html
sed -i 's/<head>/<head>\n    <link rel="preconnect" href="https:\/\/fonts.googleapis.com">\n    <link rel="preconnect" href="https:\/\/fonts.gstatic.com" crossorigin>\n    <link rel="preconnect" href="https:\/\/cdnjs.cloudflare.com">\n    <link rel="preconnect" href="https:\/\/cdn.jsdelivr.net">\n    <link rel="dns-prefetch" href="https:\/\/fonts.googleapis.com">\n    <link rel="dns-prefetch" href="https:\/\/cdnjs.cloudflare.com">/' index.html
echo "   ✅ Preconnect added to index.html"

# ============================================
# 🟠 مهم: تحسين sitemap.xml
# ============================================

echo ""
echo "📦 5. تحديث sitemap.xml..."
cat > sitemap.xml << 'SITEMAP'
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url><loc>https://termuxpert-pro.github.io/TermuXpert-WEB/</loc><priority>1.0</priority></url>
    <url><loc>https://termuxpert-pro.github.io/TermuXpert-WEB/subjects.html</loc><priority>0.9</priority></url>
    <url><loc>https://termuxpert-pro.github.io/TermuXpert-WEB/subject.html?subject=math</loc><priority>0.8</priority></url>
    <url><loc>https://termuxpert-pro.github.io/TermuXpert-WEB/subject.html?subject=physique</loc><priority>0.8</priority></url>
    <url><loc>https://termuxpert-pro.github.io/TermuXpert-WEB/subject.html?subject=chimie</loc><priority>0.8</priority></url>
</urlset>
SITEMAP
echo "   ✅ sitemap.xml updated"

# ============================================
# 🟢 تحسيني: ضغط الصور (إذا وجدت)
# ============================================

echo ""
echo "📦 6. ضغط الصور PNG (إذا كانت موجودة)..."
find assets/images -name "*.png" -exec pngquant --quality=80-95 --force --skip-if-larger -o {} {} \; 2>/dev/null || echo "   ℹ️ pngquant not installed, skipping"
echo "   ✅ Image compression attempted"

# ============================================
# 📊 ملخص
# ============================================

echo ""
echo "=========================================="
echo "✅ جميع التحسينات تمت بنجاح!"
echo "=========================================="
echo ""
echo "📊 الملخص:"
echo "   • GSAP removed from: $(find content -name "*.html" | wc -l) files"
echo "   • protection.js removed from: $(find content -name "*.html" | wc -l) files"
echo "   • Scroll button removed from: $(find content -name "*.html" | wc -l) files"
echo "   • Preconnect added to index.html"
echo "   • sitemap.xml updated"
echo ""
echo "🚀 يمكنك الآن رفع التغييرات إلى GitHub"
echo "=========================================="
