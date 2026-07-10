#!/bin/bash
echo "🧹 تنظيف كاش المتصفح..."
rm -rf /storage/emulated/0/Android/data/com.android.chrome/cache/* 2>/dev/null
rm -rf /storage/emulated/0/Android/data/com.android.browser/cache/* 2>/dev/null
echo "✅ كاش المتصفح تم تنظيفه"
