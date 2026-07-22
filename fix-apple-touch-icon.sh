#!/usr/bin/env bash
# ============================================================
# fix-apple-touch-icon.sh
# كيحيد الشفافية من apple-touch-icon.png بإضافة خلفية صلبة
# (شرط iOS: بلا قناة alpha)
# ============================================================

set -e

python3 -c "import PIL" 2>/dev/null || pip install Pillow --break-system-packages -q

python3 << 'PYEOF'
from PIL import Image

path = "assets/images/apple-touch-icon.png"
# لون الخلفية: عدّلو إذا بغيتي لون آخر (هنا كحلي غامق قريب من هوية Xpert)
BG_COLOR = (13, 27, 42)  # عدّل هذا اللون حسب هوية موقعك

img = Image.open(path).convert("RGBA")
background = Image.new("RGBA", img.size, BG_COLOR + (255,))
flattened = Image.alpha_composite(background, img).convert("RGB")
flattened.save(path, "PNG")

print(f"✅ تم! {path} دابا بلا شفافية، بخلفية {BG_COLOR}")
PYEOF
