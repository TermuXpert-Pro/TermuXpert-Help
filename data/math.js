

// ============================================================
// بيانات مادة الرياضيات
// لإضافة درس/تمرين/سلسلة جديدة: زيد سطر جديد فـ المصفوفة المناسبة
// ============================================================
window.subjectsData = window.subjectsData || {};

window.subjectsData.math = {
    title: "Mathématiques",
    desc: "Cours, exercices, séries, devoirs et examens régionaux",
    lessons: [
        { semester: 1, title: "Logique mathématique", file: "content/math/lessons/logique/model1/index.html", desc: "Propositions, opérateurs, quantificateurs, raisonnements" },
        { semester: 1, title: "Généralités sur les fonctions", file: "content/math/lessons/fonctions/model1/index.html", desc: "Fonctions numériques, parité, monotonie, études de fonctions" },
        { semester: 1, title: "Barycentre dans le plan", file: "content/math/lessons/barycentre/model1/index.html", desc: "Barycentre de deux, trois et quatre points pondérés" },
        { semester: 1, title: "Le produit scalaire et ses applications", file: "content/math/lessons/produit-scalaire/model1/index.html", desc: "Expression analytique, trigonométrie, droites, inégalité de Cauchy-Schwarz, étude du cercle" },
        { semester: 1, title: "Les suites numériques", file: "content/math/lessons/suites-numeriques/model1/index.html", desc: "Suites arithmétiques et géométriques, monotonie, majoration/minoration, terme général, somme des termes" },
        { semester: 1, title: "Calcul trigonométrique", file: "content/math/lessons/calcul-trigonometrique/model1/index.html", desc: "Cercle trigonométrique, formules d'addition et de duplication, équations et inéquations trigonométriques" },
        { semester: 2, title: "La rotation dans le plan", file: "content/math/lessons/rotation-plan/model1/index.html", desc: "قيد الإعداد 🔧" },
        { semester: 2, title: "Les limites d'une fonction", file: "content/math/lessons/limites-fonctions/model1/index.html", desc: "قيد الإعداد 🔧" },
        { semester: 2, title: "La dérivation", file: "content/math/lessons/derivation/model1/index.html", desc: "قيد الإعداد 🔧" },
        { semester: 2, title: "Étude des fonctions numériques", file: "content/math/lessons/etude-fonctions/model1/index.html", desc: "قيد الإعداد 🔧" },
        { semester: 2, title: "Géométrie dans l'espace", file: "content/math/lessons/geometrie-espace/model1/index.html", desc: "قيد الإعداد 🔧" }
    ],
    exercices: [
        { models: 1, semester: 1, title: "Logique mathématique", file: "content/math/exercises/logique/index.html", desc: "8 exercices avec solutions" },
        { models: 1, semester: 1, title: "Généralités sur les fonctions", file: "content/math/exercises/fonctions/index.html", desc: "10 exercices avec solutions" },
        { models: 1, semester: 1, title: "Barycentre dans le plan", file: "content/math/exercises/barycentre/index.html", desc: "8 exercices avec solutions" },
        { models: 1, semester: 1, title: "Le produit scalaire et ses applications", file: "content/math/exercises/produit-scalaire/index.html", desc: "11 exercices avec solutions" }
    ],
    series: [
        { models: 1, semester: 1, title: "Logique mathématique", file: "content/math/series/logique/index.html", desc: "5 séries" },
        { models: 1, semester: 1, title: "Généralités sur les fonctions", file: "content/math/series/fonctions/index.html", desc: "7 séries" },
        { models: 1, semester: 1, title: "Barycentre dans le plan", file: "content/math/series/barycentre/index.html", desc: "6 séries" }
    ],
    // ============================================================
    // بيانات الفروض والامتحانات
    // لإضافة فرض جديد: زيد عنصر جديد بنفس الهيكل (id, type, number,
    // semester, title, desc, lessons, duration, hub, models)
    //
    // ملاحظة: بطاقة الفرض فـ subject.html كتستعمل هاد الحقول:
    //   - semester -> كيحدد تحت أي فاصل "Semestre 1/2" غادي تبان البطاقة
    //                 (خاصها تكون مرتبة: كلشي ديال 1 قبل كلشي ديال 2)
    //   - models   -> بادج "X modèle(s)" فالركن الأيمن الأعلى (بنفسجي، هوية الفروض)
    //   - lessons  -> شيبس (chips) تحت العنوان
    //   - duration -> محفوظة فالداتا، ما كتبانش فالبطاقة حاليا
    // ============================================================
    exams: [
        {
            id: "ds1-logique-fonctions",
            type: "Devoir",
            number: 1,
            semester: 1,
            title: "Devoir Surveillé N°1",
            desc: "Logique mathématique et Généralités sur les fonctions",
            lessons: ["Logique mathématique", "Généralités sur les fonctions"],
            duration: 120,
            hub: "content/math/devoirs/ds1-logique-fonctions/index.html",
            models: 1
        }
    ]
};


