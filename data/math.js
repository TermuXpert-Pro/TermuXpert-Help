
// ============================================================
// بيانات مادة الرياضيات
// لإضافة درس/تمرين/سلسلة جديدة: زيد سطر جديد فـ المصفوفة المناسبة
// ============================================================
window.subjectsData = window.subjectsData || {};

window.subjectsData.math = {
    title: "Mathématiques",
    desc: "Cours, exercices, séries, devoirs et examens régionaux",
    lessons: [
        { semester: 1, title: "Logique mathématique", file: "content/math/lessons/logique/index.html", desc: "Propositions, opérateurs, quantificateurs, raisonnements" },
        { semester: 1, title: "Généralités sur les fonctions", file: "content/math/lessons/fonctions/index.html", desc: "Fonctions numériques, parité, monotonie, études de fonctions" },
        { semester: 1, title: "Barycentre dans le plan", file: "content/math/lessons/barycentre/index.html", desc: "Barycentre de deux, trois et quatre points pondérés" },
        { semester: 1, title: "Le produit scalaire et ses applications", file: "content/math/lessons/produit-scalaire/index.html", desc: "قيد الإعداد 🔧" },
        { semester: 1, title: "Les suites numériques", file: "content/math/lessons/suites-numeriques/index.html", desc: "قيد الإعداد 🔧" },
        { semester: 1, title: "Calcul trigonométrique", file: "content/math/lessons/calcul-trigonometrique/index.html", desc: "قيد الإعداد 🔧" },
        { semester: 2, title: "La rotation dans le plan", file: "content/math/lessons/rotation-plan/index.html", desc: "قيد الإعداد 🔧" },
        { semester: 2, title: "Les limites d'une fonction", file: "content/math/lessons/limites-fonctions/index.html", desc: "قيد الإعداد 🔧" },
        { semester: 2, title: "La dérivation", file: "content/math/lessons/derivation/index.html", desc: "قيد الإعداد 🔧" },
        { semester: 2, title: "Étude des fonctions numériques", file: "content/math/lessons/etude-fonctions/index.html", desc: "قيد الإعداد 🔧" },
        { semester: 2, title: "Géométrie dans l'espace", file: "content/math/lessons/geometrie-espace/index.html", desc: "قيد الإعداد 🔧" }
    ],
    // كل موضوع عندو "modeles": مصفوفة نماذج - نموذج 1 دابا، ونموذج 2/3... يتزادو
    // بلا ما نبدلو بنية الكود، غير نزيدو عنصر جديد فمصفوفة modeles.
    exercices: [
        { title: "Logique mathématique", desc: "8 exercices avec solutions", modeles: [
            { title: "Modèle 1", file: "content/math/exercises/logique/model1/index.html" }
        ] },
        { title: "Généralités sur les fonctions", desc: "10 exercices avec solutions", modeles: [
            { title: "Modèle 1", file: "content/math/exercises/fonctions/model1/index.html" }
        ] },
        { title: "Barycentre dans le plan", desc: "8 exercices avec solutions", modeles: [
            { title: "Modèle 1", file: "content/math/exercises/barycentre/model1/index.html" }
        ] }
    ],
    series: [
        { title: "Logique mathématique", desc: "5 séries (54 exercices)", modeles: [
            { title: "Modèle 1", file: "content/math/series/logique/model1/index.html" }
        ] },
        { title: "Généralités sur les fonctions", desc: "7 séries", modeles: [
            { title: "Modèle 1", file: "content/math/series/fonctions/model1/index.html" }
        ] },
        { title: "Barycentre dans le plan", desc: "6 séries", modeles: [
            { title: "Modèle 1", file: "content/math/series/barycentre/model1/index.html" }
        ] }
    ],
    exams: []
};

