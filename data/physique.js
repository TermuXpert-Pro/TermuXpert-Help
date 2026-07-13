// ============================================================
// بيانات مادة الفيزياء
// لإضافة درس/تمرين/سلسلة جديدة: زيد سطر جديد فـ المصفوفة المناسبة
// ============================================================
window.subjectsData = window.subjectsData || {};

window.subjectsData.physique = {
    title: "Physique",
    desc: "Cours, exercices, séries, devoirs et examens régionaux",
    lessons: [
        {
            semester: 1,
            title: "Rotation d'un solide autour d'un axe fixe",
            file: "content/physique/lessons/rotation-solide/index.html",
            desc: "Mouvement de rotation, vitesse angulaire, période, fréquence"
        },
        {
            semester: 1,
            title: "Travail et puissance d'une force",
            file: "content/physique/lessons/travail-puissance/index.html",
            desc: "Travail d'une force, puissance, couple de forces"
        },
        {
            semester: 1,
            title: "Travail et énergie cinétique",
            file: "content/physique/lessons/travail-energie-cinetique/index.html",
            desc: "Énergie cinétique en translation et rotation, théorème de l'énergie cinétique"
        },
        {
            semester: 1,
            title: "Travail et énergie potentielle de pesanteur - Énergie mécanique",
            file: "content/physique/lessons/energie-potentielle-mecanique/index.html",
            desc: "قيد الإعداد 🔧"
        },
        {
            semester: 1,
            title: "Travail et énergie interne",
            file: "content/physique/lessons/travail-energie-interne/index.html",
            desc: "قيد الإعداد 🔧"
        },
        { semester: 2, title: "Transfert d'énergie dans un circuit électrique", file: "content/physique/lessons/circuit-electrique/index.html", desc: "قيد الإعداد 🔧" },
        { semester: 2, title: "Le champ magnétique", file: "content/physique/lessons/champ-magnetique/index.html", desc: "قيد الإعداد 🔧" },
        { semester: 2, title: "Le champ magnétique créé par un courant électrique", file: "content/physique/lessons/champ-magnetique-courant/index.html", desc: "قيد الإعداد 🔧" },
        { semester: 2, title: "Les forces électromagnétiques - La loi de Laplace", file: "content/physique/lessons/forces-laplace/index.html", desc: "قيد الإعداد 🔧" },
        { semester: 2, title: "Visibilité d'un objet", file: "content/physique/lessons/visibilite-objet/index.html", desc: "قيد الإعداد 🔧" },
        { semester: 2, title: "Les images formées par un miroir plan", file: "content/physique/lessons/miroir-plan/index.html", desc: "قيد الإعداد 🔧" },
        { semester: 2, title: "Les images formées par une lentille mince convergente", file: "content/physique/lessons/lentille-convergente/index.html", desc: "قيد الإعداد 🔧" },
        { semester: 2, title: "Quelques instruments optiques", file: "content/physique/lessons/instruments-optiques/index.html", desc: "قيد الإعداد 🔧" }
    ],
    // كل موضوع عندو "modeles": مصفوفة نماذج - نموذج 1 دابا، ونموذج 2/3... يتزادو
    // بلا ما نبدلو بنية الكود، غير نزيدو عنصر جديد فمصفوفة modeles.
    exercices: [
        {
            title: "Rotation d'un solide",
            desc: "6 exercices avec solutions",
            modeles: [
                { title: "Modèle 1", file: "content/physique/exercises/rotation-solide/model1/index.html" }
            ]
        },
        {
            title: "Travail et puissance d'une force",
            desc: "8 exercices avec solutions détaillées",
            modeles: [
                { title: "Modèle 1", file: "content/physique/exercises/travail-puissance/model1/index.html" }
            ]
        },
        {
            title: "Travail et énergie cinétique",
            desc: "9 exercices avec solutions détaillées",
            modeles: [
                { title: "Modèle 1", file: "content/physique/exercises/travail-energie-cinetique/model1/index.html" }
            ]
        }
    ],
    series: [
        {
            title: "Rotation d'un solide",
            desc: "6 exercices avec solutions détaillées",
            modeles: [
                { title: "Modèle 1", file: "content/physique/series/rotation-solide/model1/index.html" }
            ]
        },
        {
            title: "Travail et puissance d'une force",
            desc: "6 exercices avec solutions détaillées",
            modeles: [
                { title: "Modèle 1", file: "content/physique/series/travail-puissance/model1/index.html" }
            ]
        },
        {
            title: "Travail et énergie cinétique",
            desc: "6 exercices avec solutions détaillées",
            modeles: [
                { title: "Modèle 1", file: "content/physique/series/travail-energie-cinetique/model1/index.html" }
            ]
        }
    ],
    exams: []
};

