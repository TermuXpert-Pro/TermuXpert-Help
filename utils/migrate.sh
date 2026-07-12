#!/bin/bash
# migrate.sh - ترحيل المحتوى القديم إلى الهيكل الجديد

echo "🔄 بدء الترحيل إلى الهيكل الجديد..."

cd /storage/emulated/0/Web

# 1. إنشاء المجلدات الجديدة
mkdir -p assets/{css,js,images/background}
mkdir -p content/math/lessons/{logique,fonctions,barycentre}
mkdir -p content/math/exercises/{logique,fonctions,barycentre}
mkdir -p content/math/series/{logique,fonctions,barycentre}
mkdir -p content/physique/lessons/mecanique
mkdir -p content/physique/exercises/mecanique
mkdir -p content/physique/series/mecanique
mkdir -p content/chimie/lessons/atome
mkdir -p content/chimie/exercises/atome
mkdir -p content/chimie/series/atome
mkdir -p templates data utils

# 2. نقل الملفات
echo "📦 نقل الملفات..."
mv style.css assets/css/ 2>/dev/null
mv script.js assets/js/ 2>/dev/null
mv photos/* assets/images/ 2>/dev/null

# 3. نقل المحتوى
echo "📚 نقل المحتوى التعليمي..."
mv lessons/logique.html content/math/lessons/logique/ 2>/dev/null
mv lessons/fonctions/* content/math/lessons/fonctions/ 2>/dev/null
mv lessons/barycentre/* content/math/lessons/barycentre/ 2>/dev/null
mv exercices/logique/* content/math/exercises/logique/ 2>/dev/null
mv exercices/fonctions/* content/math/exercises/fonctions/ 2>/dev/null
mv series/logique/* content/math/series/logique/ 2>/dev/null
mv series/fonctions/* content/math/series/fonctions/ 2>/dev/null

# 4. تحديث الروابط
echo "🔗 تحديث الروابط..."
find . -name "*.html" -type f -exec sed -i 's|href="style.css"|href="assets/css/style.css"|g' {} \;
find . -name "*.html" -type f -exec sed -i 's|href="../style.css"|href="../../assets/css/style.css"|g' {} \;
find . -name "*.html" -type f -exec sed -i 's|src="script.js"|src="assets/js/script.js"|g' {} \;
find . -name "*.html" -type f -exec sed -i 's|photos/|assets/images/|g' {} \;

# 5. حذف المجلدات الفارغة
rmdir lessons exercices series 2>/dev/null

echo "✅ الترحيل اكتمل بنجاح!"


