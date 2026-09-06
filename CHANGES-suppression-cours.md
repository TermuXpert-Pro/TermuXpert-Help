# حذف قسم "دروس" (Cours) - ملخص التعديلات

## 1. الملفات/المجلدات المحذوفة كليا
- `content/math/lessons/` (11 موضوع)
- `content/physique/lessons/` (13 موضوع)
- `content/chimie/lessons/` (12 موضوع)
- `templates/lesson-template.html`

## 2. ملفات البيانات (data/*.js)
- تمت إزالة مصفوفة `lessons: [...]` كليا من `data/math.js`, `data/physique.js`, `data/chimie.js`
- تحديث `desc` (الوصف العام للمادة): "Cours, exercices..." → "Exercices, séries, devoirs et examens régionaux"
- ملاحظة: مصفوفة `exams[].lessons` بقات كما هي (شيبس/تاغات وصفية فقط فوق بطاقة الفرض، ماشي روابط لصفحات دروس)

## 3. partials/navbar.html (المصدر المشترك للسايدبار)
- بدّلت "11 cours" / "13 cours" / "12 cours" بـ "26 exercices" / "23 exercices" / "13 exercices"
- **مهم**: هاد التعديل غادي يتنشر تلقائياً لكل الصفحات (index, about, subjects, subject, recherche, installation, support, terms) بمجرد ما تشغل `node utils/build.js`

## 4. subject.html
- حذف زر تبويب "Cours" (data-tab="lessons")
- التبويب الافتراضي بدّل من `lessons` إلى `exercices`
- حذف كود عرض بطاقات الدروس (renderContent) بالكامل
- حذف `lessons` من TAB_TO_CATEGORY / TAB_LABELS / validTabs
- JSON-LD: `@type` بدّل من `Course` إلى `EducationalOrganization`، ووصف الصفحة تحدّث

## 5. subjects.html
- حذف زر "Cours" من أزرار الوصول السريع لكل مادة
- حذف بادج "X cours" من بطاقة المادة (بقات غير بادج exercices)
- حذف حقل `lessons` من مصفوفة `subjects`
- التبويب الافتراضي فـ `goToSubject()` بدّل لـ `exercices`

## 6. recherche.html
- حذف خيار "Cours" من قائمة أنواع البحث
- حذف `lessons` من كائن `SEARCH_CATEGORIES`

## 7. نصوص تسويقية/وصفية (index.html, about.html, support.html, terms.html)
- تحديث كل الجمل التي تذكر "cours" (meta description, JSON-LD, أوصاف الميزات) باش تعكس بأن المحتوى دابا هو Exercices + Séries + Devoirs فقط
- فـ index.html: بطاقة الميزة "Cours structurés" تبدّلت بـ "Corrections détaillées"

## 8. تصحيح خلل قديم (غير مرتبط مباشرة بالطلب لكن كان كيبين "Cours")
كاين 4 صفحات hub ديال exercises كان عندهم عنوان/title متبقي من قالب دروس قديم:
- `content/math/exercises/produit-scalaire/index.html`
- `content/physique/exercises/circuit-electrique/index.html`
- `content/physique/exercises/comportement-global-circuit/index.html`
- `content/physique/exercises/energie-potentielle-mecanique/index.html`

تصحّح العنوان (`<title>` و `<h1>`) من "Cours - ..." إلى "Exercices - ..." والأيقونة من fa-book إلى fa-pencil.

## ما بقاش محتاج تعديل يدوي
- `assets/css/lesson-common.css` - CSS مشترك كيستعملوه Exercices/Séries/Base/Devoirs، ماشي خاص بالدروس فقط → ما تمسوش
- `sw.js` - ماكاين حتى مسار درس محفوظ يدويا فيه، الكاش ديناميكي
- `utils/build.js`, `utils/generate-sitemap.js` - ديناميكيين، كيمسحو الملفات الموجودة فعليا، ما محتاجينش تعديل

## خطوات لازم تديرها من بعد نسخ هاد الملفات فالمشروع الحقيقي ديالك
```bash
node utils/build.js              # باش ينشر تعديل navbar.html لكل الصفحات
node utils/generate-sitemap.js   # باش يعاود يبني sitemap بلا صفحات الدروس المحذوفة
node utils/validate.js           # (إلا كان موجود) للتأكد من صحة الملفات قبل النشر
```

كنصيحة: بعد `build.js`، دير بحث سريع `grep -rn "cours" .` (case-insensitive) على المشروع كامل باش تتأكد بلي ما بقاش حتى ذكر ظاهر للمستخدم.

---

# المرحلة 2: حذف Base/Autres و دمج Séries مع Exercices

## 1. حذف قسم "Autres" (Essentiels/Fiches/Formulaire/...) كليا
- حذفت `data/autres.js` بالكامل (كان فيه بطاقات: Essentiels, Fiches de révision, Formulaire, Méthodologie, Glossaire, Jeux, Quiz - معظمها "قيد الإعداد")
- حذفت `content/math/base/` (كانت فيها 3 مجلدات: logique, fonctions, barycentre)
- حذفت مصفوفة `base: [...]` من `data/math.js`
- حذفت زر تبويب "Autres" من `subject.html` (كان مخفي `display:none` أصلا)
- حذفت كود تحميل `data/autres.js` ديناميكيا (`loadAutresThenRender`) وبسّطت `loadSubject()`
- حذفت الفرع ديال renderContent(tab === 'autres')

## 2. دمج "Séries" مع "Exercices" فقسم واحد
- فـ `data/math.js`, `data/physique.js`, `data/chimie.js`: دمجت مصفوفة `series` جوج `exercices` (مصفوفة وحدة، العناصر مرتبة: تمرين ثم سلسلة لكل موضوع)
- حذفت زر تبويب "Séries" من `subject.html`, `subjects.html`, `recherche.html`
- حذفت الفرع ديال renderContent(tab === 'series') (البطاقات ديال السلاسل دابا كتبان فتبويب "Exercices" بنفس التصميم)
- بقاو الملفات الفيزيائية (`content/*/series/...`) فبلاصتهم بلا تغيير - غير التصنيف/الاسم فالواجهة هو اللي تبدل
- عدّلت TAB_TO_CATEGORY / TAB_LABELS / validTabs فـ subject.html باش يبقى غير: exercices + exams
- عدّلت SEARCH_CATEGORIES فـ recherche.html بنفس المنطق

## 3. تحديث الأرقام (بادجات "X exercices")
دابا كتعكس مجموع (تمارين + سلاسل) بدل تمارين بوحدها:
- math: 55 (كانت 26)
- physique: 26 (كانت 23)
- chimie: 22 (كانت 13)

هاد الأرقام محسوبة من مجموع الأرقام المكتوبة فـ desc (مثلا "8 exercices" + "5 séries" = 13)، وتأكدت أنها كتطابق عدد الملفات الفعلي بالنسبة لـ math.

## خلاصة البنية الجديدة لتبويبات subject.html
قبل: Cours (محذوف فالمرحلة 1) | Autres (محذوف) | Exercices | Séries (مدموج) | Devoirs & Examens
دابا: **Exercices** | **Devoirs & Examens** — بس تبويبين.
