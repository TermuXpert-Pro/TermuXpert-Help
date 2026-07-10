#!/bin/bash

echo "=========================================="
echo "🔍 التحقق من مشاكل الموقع"
echo "=========================================="

cd /storage/emulated/0/Web

ISSUES=0
FIXED=0

# ============================================
# 1. التحقق من تكرار script.js
# ============================================
echo ""
echo "📦 1. التحقق من تكرار script.js..."

for i in 1 2 3 4 5; do
    COUNT=$(grep -c '<script src="..\/..\/..\/..\/assets\/js\/script.js"><\/script>' content/math/lessons/fonctions/part${i}.html 2>/dev/null || echo 0)
    if [ "$COUNT" -gt 1 ]; then
        echo "   ❌ part${i}.html: $COUNT مرات (يجب أن يكون 1)"
        ISSUES=$((ISSUES + 1))
    elif [ "$COUNT" -eq 0 ]; then
        echo "   ❌ part${i}.html: 0 مرات (يجب أن يكون 1)"
        ISSUES=$((ISSUES + 1))
    else
        echo "   ✅ part${i}.html: $COUNT مرة"
        FIXED=$((FIXED + 1))
    fi
done

# ============================================
# 2. التحقق من تكرار runZellijAnimation
# ============================================
echo ""
echo "📦 2. التحقق من تكرار runZellijAnimation..."

for i in 1 2 3 4 5; do
    if grep -q "runZellijAnimation" content/math/lessons/fonctions/part${i}.html 2>/dev/null; then
        echo "   ❌ part${i}.html: لا يزال يحتوي على runZellijAnimation"
        ISSUES=$((ISSUES + 1))
    else
        echo "   ✅ part${i}.html: تمت إزالة runZellijAnimation"
        FIXED=$((FIXED + 1))
    fi
done

# ============================================
# 3. التحقق من ملفات .backup
# ============================================
echo ""
echo "📦 3. التحقق من ملفات .backup..."

BACKUP_FILES=$(find content -name "*.backup" 2>/dev/null)
if [ -n "$BACKUP_FILES" ]; then
    echo "   ❌ توجد ملفات .backup:"
    echo "$BACKUP_FILES" | sed 's/^/      /'
    ISSUES=$((ISSUES + 1))
else
    echo "   ✅ لا توجد ملفات .backup"
    FIXED=$((FIXED + 1))
fi

# ============================================
# 4. التحقق من MathJax (async vs defer)
# ============================================
echo ""
echo "📦 4. التحقق من MathJax..."

ASYNC_COUNT=$(find content -name "*.html" -exec grep -l 'tex-svg.js" async' {} \; 2>/dev/null | wc -l)
DEFER_COUNT=$(find content -name "*.html" -exec grep -l 'tex-svg.js" defer' {} \; 2>/dev/null | wc -l)

if [ "$ASYNC_COUNT" -gt 0 ]; then
    echo "   ❌ $ASYNC_COUNT ملفات لا تزال تستخدم async"
    ISSUES=$((ISSUES + 1))
else
    echo "   ✅ $DEFER_COUNT ملفات تستخدم defer"
    FIXED=$((FIXED + 1))
fi

# ============================================
# 5. التحقق من CSS المكرر
# ============================================
echo ""
echo "📦 5. التحقق من CSS المكرر..."

for i in 1 2 3 4 5; do
    DUPLICATE_CSS=$(grep -c '\.exercice-box {' content/math/lessons/fonctions/part${i}.html 2>/dev/null || echo 0)
    if [ "$DUPLICATE_CSS" -gt 0 ]; then
        echo "   ❌ part${i}.html: لا يزال يحتوي على CSS مكرر"
        ISSUES=$((ISSUES + 1))
    else
        echo "   ✅ part${i}.html: CSS مكرر تمت إزالته"
        FIXED=$((FIXED + 1))
    fi
done

# ============================================
# 6. التحقق من sitemap.xml
# ============================================
echo ""
echo "📦 6. التحقق من sitemap.xml..."

if [ -f "sitemap.xml" ]; then
    SIZE=$(stat -c%s sitemap.xml 2>/dev/null || stat -f%z sitemap.xml 2>/dev/null)
    if [ "$SIZE" -gt 1000 ]; then
        echo "   ✅ sitemap.xml موجود وحجمه $SIZE بايت"
        FIXED=$((FIXED + 1))
    else
        echo "   ❌ sitemap.xml صغير جداً ($SIZE بايت)"
        ISSUES=$((ISSUES + 1))
    fi
else
    echo "   ❌ sitemap.xml غير موجود"
    ISSUES=$((ISSUES + 1))
fi

# ============================================
# 7. التحقق من فيزياء/كيمياء
# ============================================
echo ""
echo "📦 7. التحقق من ملفات فيزياء/كيمياء..."

if [ -f "content/physique/lessons/mecanique/index.html" ]; then
    echo "   ✅ physique/lessons/mecanique/index.html موجود"
    FIXED=$((FIXED + 1))
else
    echo "   ❌ physique/lessons/mecanique/index.html غير موجود"
    ISSUES=$((ISSUES + 1))
fi

if [ -f "content/chimie/lessons/atome/index.html" ]; then
    echo "   ✅ chimie/lessons/atome/index.html موجود"
    FIXED=$((FIXED + 1))
else
    echo "   ❌ chimie/lessons/atome/index.html غير موجود"
    ISSUES=$((ISSUES + 1))
fi

# ============================================
# 8. التحقق من GSAP
# ============================================
echo ""
echo "📦 8. التحقق من GSAP في content..."

GSAP_COUNT=$(find content -name "*.html" -exec grep -l 'gsap' {} \; 2>/dev/null | wc -l)
if [ "$GSAP_COUNT" -eq 0 ]; then
    echo "   ✅ لا يوجد GSAP في content/"
    FIXED=$((FIXED + 1))
else
    echo "   ❌ $GSAP_COUNT ملفات لا تزال تحتوي على GSAP"
    ISSUES=$((ISSUES + 1))
fi

# ============================================
# 9. التحقق من protection.js في content
# ============================================
echo ""
echo "📦 9. التحقق من protection.js في content..."

PROTECTION_COUNT=$(find content -name "*.html" -exec grep -l 'protection.js' {} \; 2>/dev/null | wc -l)
if [ "$PROTECTION_COUNT" -eq 0 ]; then
    echo "   ✅ لا يوجد protection.js في content/"
    FIXED=$((FIXED + 1))
else
    echo "   ❌ $PROTECTION_COUNT ملفات لا تزال تحتوي على protection.js"
    ISSUES=$((ISSUES + 1))
fi

# ============================================
# 10. التحقق من preconnect في index.html
# ============================================
echo ""
echo "📦 10. التحقق من preconnect في index.html..."

if grep -q 'preconnect.*cdnjs.cloudflare.com' index.html 2>/dev/null; then
    echo "   ✅ preconnect للـ CDNs موجود"
    FIXED=$((FIXED + 1))
else
    echo "   ❌ preconnect غير موجود"
    ISSUES=$((ISSUES + 1))
fi

# ============================================
# الملخص النهائي
# ============================================
echo ""
echo "=========================================="
echo "📊 الملخص النهائي"
echo "=========================================="
echo ""
echo "   ✅ تم الإصلاح: $FIXED من 10"
echo "   ❌ مشاكل متبقية: $ISSUES من 10"
echo ""

if [ "$ISSUES" -eq 0 ]; then
    echo "🎉 جميع المشاكل تم إصلاحها!"
else
    echo "⚠️  هناك $ISSUES مشكلة متبقية تحتاج إلى إصلاح"
    echo ""
    echo "لتشغيل الإصلاح: bash fix-remaining.sh"
fi

echo "=========================================="
