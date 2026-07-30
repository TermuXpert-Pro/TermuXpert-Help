#!/data/data/com.termux/files/usr/bin/bash
echo "========================================="
echo "  عدد الأحرف في ملفات المشروع"
echo "========================================="
echo ""

total=0
for ext in html css js php py java; do
  count=$(find . -name "*.$ext" -exec cat {} \; 2>/dev/null | wc -c)
  if [ $count -gt 0 ]; then
    printf "  %-8s %15d حرف\n" "$ext" "$count"
    total=$((total + count))
  fi
done

echo "-----------------------------------------"
printf "  %-8s %15d حرف\n" "المجموع" "$total"
echo "========================================="
