# برومبت رئيسي: تحويل أي صفحة من موقع Xpert إلى PDF دقيق ومتناسق مع تصميم الموقع

> انسخ هذا النص كاملاً وأعطه لأي مساعد ذكاء اصطناعي يتوفر على تنفيذ أكواد (Python + متصفح headless مثل Playwright). يصلح لتحويل: **درس (lesson)**، **تمرين (exercise)**، **سلسلة (série)**، أو **فرض محروس (devoir)**.

---

## 0. السياق الذي يجب إعطاؤه للمساعد

أعطِ المساعد:
1. الصفحة (أو الصفحات) المطلوب تحويلها، بصيغة HTML خام — إما كملف مرفوع مباشرة، أو كجزء من "dump" شامل بالصيغة:
   ```
   ========================================
   📄 الملف: <filename>
   📍 المسار: /storage/emulated/0/Web/<relative/path>
   📦 الحجم: <bytes> بايت
   ========================================

   <محتوى الملف>
   ```
2. ملفات الأصول العامة للموقع (إن وُجدت في نفس الـ dump):
   - `assets/css/style.css` (يحتوي على متغيرات `:root` — الألوان والخطوط)
   - `assets/css/lesson-common.css` (للدروس) أو `assets/css/devoir.css` (للفروض/التمارين إن كانت مختلفة)
   - `assets/css/root-decor.css`, `assets/css/global-control.css` (إن أثّرت على العرض)
   - `assets/js/vendor/mathjax-tex-svg.js` (حزمة MathJax كاملة، تعمل بدون إنترنت)
   - أي ملف `figuresvt*.js` أو `figures*.js` موجود بجانب صفحة الـ HTML المستهدفة (رسوم SVG تفاعلية خاصة بتلك الصفحة تحديدًا)

---

## 1. تحديد نوع الصفحة (حسب المسار)

| نوع الصفحة | نمط المسار (path pattern) | العدد المطلوب من ملفات PDF |
|---|---|---|
| **درس (Lesson)** | `content/<matiere>/lessons/<chapitre>/<model>/partN.html` أو `index.html` | ملف PDF **واحد لكل part** (أو مدموج إذا طُلب ذلك صراحة) — يحتوي على الشرح والحل معًا داخل نفس الملف (لا يوجد فصل بين سؤال وحل في الدروس) |
| **تمرين (Exercise)** | `content/<matiere>/exercises/<chapitre>/<model>/exerciceN.html` | **ملفان منفصلان**: `..._enonce.pdf` (بدون حلول) و `..._corrige.pdf` (مع الحلول) |
| **سلسلة (Série)** | `content/<matiere>/series/<chapitre>/<model>/serieN.html` | **ملفان منفصلان**: `..._enonce.pdf` (بدون حلول) و `..._corrige.pdf` (مع الحلول) |
| **فرض (Devoir)** | `content/<matiere>/devoirs/<devoir-name>/<model>/index.html` | **ملفان منفصلان**: `..._sujet.pdf` (الفرض فارغ بدون تصحيح) و `..._corrige.pdf` (الفرض مصححًا بالكامل) |

**قاعدة عامة:** أي صفحة تحتوي على العنصر `class="solution-box"` (سواء كانت تمرين، سلسلة، أو فرض) تُعامل بنفس المنطق: نسختان. أي صفحة **لا تحتوي** على `solution-box` (الدروس عادة) تُصدَّر كملف واحد فقط.

---

## 2. آلية فصل الأسئلة عن الحلول (Exercise / Série / Devoir)

كل سؤال في هذه الصفحات مبني على النمط التالي:
```html
<div class="section"> <!-- أو .sub-question في الفروض -->
    ... نص السؤال ...
    <button class="toggle-sol" onclick="toggleSolution('solX')">Voir la solution</button>
    <div id="solX" class="solution-box">
        <div class="sol-title">✅ Solution</div>  <!-- أو ✅ Correction في الفروض -->
        <div class="sol-content"> ... محتوى الحل ... </div>
    </div>
</div>
```
والـ CSS الافتراضي يجعل `.solution-box { display: none; }` و `.solution-box.show { display: block; }`.

### نسخة "بدون حلول" (énoncé)
- احذف بالكامل كل عنصر `<div class="solution-box">...</div>` (بمحتواه الكامل، الحل لا يظهر إطلاقًا).
- احذف كل زر `<button class="toggle-sol" ...>...</button>`.
- أبقِ نص السؤال، الجداول، الصور، ورموز الرياضيات كما هي.

### نسخة "مع الحلول" (corrigé)
- احذف أزرار `toggle-sol` (غير مفيدة في PDF ثابت).
- أجبر كل `.solution-box` على الظهور دائمًا عبر تعديل الـ CSS:
  ```css
  .solution-box { display: block !important; }
  ```
- (اختياري لتحسين القراءة) أضف تمييزًا بصريًا خفيفًا حول `.sol-content` ليتضح أنه جزء التصحيح، بنفس ألوان الموقع (`--solution-bg`, `--solution-border`, `--solution-title` من `:root`).

---

## 3. تنظيف الصفحة من عناصر واجهة الموقع (Site Chrome)

احذف قبل التحويل:
- `<nav>` / navbar، الهيدر، الـ hero section (إن وُجدت خارج `.lesson-container`)
- الفوتر بروابط الموقع (`support.html`, `installation.html`, `terms.html`...)
- زر/قائمة `xpert-sec-fab-btn` و `xpert-sec-menu` (الأقسام العائمة) بكل الـ `<style>` و `<script>` المرتبطة بها
- `.nav-buttons` (أزرار "Retour" / "Partie التالية" الخاصة بالتصفح بين الصفحات)
- سكريبتات لا فائدة منها في PDF ثابت: `protection.js`, `script.js` (تبديل الثيم)، `Cloudflare beacon`، أي `<script async src="googletagmanager...">`
- وسوم أيقونات Font Awesome `<i class="fas fa-...">...</i>` — **احذفها** ما لم يكن ملف خط الأيقونات (font file) متوفرًا فعليًا محليًا؛ عوّض عنها عند الحاجة برمز يونيكود بسيط أو نقطة ملونة بنفس لون التصميم. لا تترك الأيقونة كما هي إذا كان الخط غير متوفر (ستظهر كمربع فارغ/يفسد الدقة).
- أبقِ الرموز التعبيرية (emoji) مثل ✅ كما هي؛ الخطوط الملونة (Noto Color Emoji) تعرضها بشكل صحيح بدون الحاجة لأي إعداد إضافي.

---

## 4. بناء صفحة HTML مستقلة (standalone) لكل PDF

لكل ملف PDF مستهدف، أنشئ ملف HTML واحد يحتوي:

1. **`<head>`**:
   - `<meta charset="UTF-8">`
   - إعداد `window.MathJax` (نفس إعداد الموقع):
     ```js
     window.MathJax = {
       tex: { inlineMath: [['$','$'], ['\\(','\\)']], displayMath: [['$$','$$'], ['\\[','\\]']] },
       svg: { fontCache: 'global' },
       startup: { ready: function () {
         MathJax.startup.defaultReady();
         MathJax.startup.promise.then(function () {
           document.body.setAttribute('data-mathjax-done', 'true');
         });
       }}
     };
     ```
   - `<script src="mathjax-tex-svg.js" defer></script>` — **إلزامي تحميله فعليًا** (وليس فقط الإعداد)، وإلا لن تُرسم أي معادلة.
   - `<style>` يضم: متغيرات `:root` من `style.css`، قواعد `lesson-common.css` (أو `devoir.css`) ذات الصلة (`.section`, `.highlight-box`, `.table-wrap`, `.formula-block`, `.step`, `.solution-box`, `.sub-question`، إلخ)، بالإضافة إلى تنسيقات الطباعة (انظر القسم 5).

2. **`<body>`**:
   - صفحة غلاف (cover) بسيطة أنيقة: عنوان الصفحة (من `<h1 class="lesson-title">` أو `<title>`)، شارة المادة/المستوى، وشعار Xpert.
   - المحتوى الفعلي للصفحة (بعد التنظيف من القسم 2 و 3)، ملفوفًا داخل `<main class="lesson-container">`.
   - قبل `</body>`: كل ملفات `figuresvt*.js` / `figures*.js` **الخاصة بهذه الصفحة فقط** (تحقق من الأكواد `id="fig..."` في المحتوى وطابقها مع الدوال المعرَّفة داخل كل ملف JS قبل تضمينه — لا تُضمّن ملفات لا علاقة لها بالصفحة).

---

## 5. تنسيقات الطباعة (Print CSS) الموحّدة

```css
@page { size: A4; margin: 20mm 16mm 18mm 16mm; }
@page :first { margin: 0; } /* صفحة الغلاف تملأ الصفحة كاملة بدون هوامش */

* { box-sizing: border-box; }
html, body {
    margin: 0; background: var(--bg-primary); color: var(--text-secondary);
    font-family: 'Liberation Sans','DejaVu Sans',Arial,sans-serif;
    -webkit-print-color-adjust: exact; print-color-adjust: exact; /* إلزامي لطباعة الخلفيات الداكنة */
}
.section, .highlight-box, .table-wrap, .formula-block, .summary-card,
.graph-container, .toc, .sub-question { page-break-inside: avoid; }
.lesson-part { page-break-before: always; }
```
> **ملاحظة مهمة:** بدون `-webkit-print-color-adjust: exact` سيطبع المتصفح خلفية بيضاء ويتجاهل الألوان الداكنة — هذا أكثر خطأ شائع يفسد "تناسق" التصميم مع الموقع.

---

## 6. التحويل إلى PDF (الأداة المقترحة: Playwright + Chromium)

```python
from playwright.sync_api import sync_playwright
import time

def render_pdf(html_path, out_path):
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto(f"file://{html_path}", wait_until="load")
        # انتظار انتهاء MathJax فعليًا قبل الطباعة (إلزامي)
        page.wait_for_selector('body[data-mathjax-done="true"]', timeout=60000)
        time.sleep(1)  # مهلة قصيرة لترسم سكريبتات SVG الرسوم البيانية
        page.pdf(path=out_path, print_background=True, prefer_css_page_size=True)
        browser.close()
```

**تحقق دائمًا بعد التوليد** (لا تسلّم الملف دون فحص):
- افتح 2-3 صفحات من كل PDF كصورة (`pdftoppm -png -r 100 ...`) وتأكد بصريًا أن:
  - المعادلات ظهرت (وليست فارغة/مكسورة)
  - الرسوم SVG ظهرت
  - لا توجد أيقونات مكسورة (مربعات فارغة)
  - في نسخة "بدون حلول": لا يظهر أي أثر لحل
  - في نسخة "مع الحلول": كل الحلول ظاهرة فعلاً (وليست مخفية بسبب نسيان `!important`)

---

## 7. تسمية الملفات الناتجة (مقترح)

```
<matiere>-<chapitre>-lesson-part<N>.pdf                      # درس
<matiere>-<chapitre>-exercice<N>_enonce.pdf   / _corrige.pdf # تمرين
<matiere>-<chapitre>-serie<N>_enonce.pdf      / _corrige.pdf # سلسلة
<devoir-name>-<model>_sujet.pdf               / _corrige.pdf # فرض
```

---

## 8. ملخص الخطوات (Checklist سريعة)

1. حدد نوع الصفحة من مسارها (`lessons` / `exercises` / `series` / `devoirs`).
2. استخرج محتوى `.lesson-container` فقط، واحذف كل عناصر واجهة الموقع (§3).
3. إن كانت الصفحة تحتوي `solution-box` → أنشئ نسختين (بدون/مع حل، §2)؛ وإلا → نسخة واحدة.
4. ابنِ HTML مستقل لكل نسخة: CSS الموقع + MathJax محلي محمَّل فعليًا + سكريبتات SVG الخاصة بالصفحة فقط (§4).
5. أضف تنسيقات الطباعة الموحّدة مع `print-color-adjust: exact` (§5).
6. حوّل بواسطة Playwright مع انتظار `data-mathjax-done` (§6).
7. افحص بصريًا قبل التسليم، ثم سمِّ الملفات حسب الاتفاقية (§7).
