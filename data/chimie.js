
// ============================================================
// بيانات مادة الكيمياء
// لإضافة درس/تمرين/سلسلة جديدة: زيد سطر جديد فـ المصفوفة المناسبة
// ============================================================
window.subjectsData = window.subjectsData || {};

window.subjectsData.chimie = {
    title: "Chimie",
    desc: "Cours, exercices, séries, devoirs et examens régionaux",

    // ============================================================
    // ملاحظة: بطاقات زر "Autres" دابا مركزين فملف data/autres.js
    // ============================================================

    lessons: [
        { semester: 1, title: "Importance de la mesure en chimie", file: "content/chimie/lessons/mesure-chimie/model1/part1.html", desc: "Mesurer pour informer, surveiller/protéger et agir : concentration massique, densité" },
        { semester: 1, title: "Grandeurs physiques liées à la quantité de matière", file: "content/chimie/lessons/quantite-matiere/model1/part1.html", desc: "Quantité de matière, masse molaire, volume molaire, concentration molaire" },
        { semester: 1, title: "La concentration et les solutions électrolytiques", file: "content/chimie/lessons/concentration-solutions/model1/part1.html", desc: "Dissolution, dilution, préparation des solutions électrolytiques" },
        { semester: 1, title: "Suivi d'une transformation chimique", file: "content/chimie/lessons/suivi-transformation/model1/index.html", desc: "قيد الإعداد 🔧" },
        { semester: 1, title: "Mesure des quantités de matière en solution par conductimétrie", file: "content/chimie/lessons/conductimetrie/model1/index.html", desc: "قيد الإعداد 🔧" },
        { semester: 1, title: "Les réactions acido-basiques", file: "content/chimie/lessons/reactions-acido-basiques/model1/index.html", desc: "قيد الإعداد 🔧" },
        { semester: 1, title: "Les réactions d'oxydo-réduction", file: "content/chimie/lessons/reactions-oxydoreduction/model1/index.html", desc: "قيد الإعداد 🔧" },
        { semester: 1, title: "Les dosages (ou titrages) directs", file: "content/chimie/lessons/dosages-directs/model1/index.html", desc: "قيد الإعداد 🔧" },
        { semester: 2, title: "Expansion de la chimie organique", file: "content/chimie/lessons/chimie-organique/model1/index.html", desc: "قيد الإعداد 🔧" },
        { semester: 2, title: "Les molécules organiques et les squelettes carbonés", file: "content/chimie/lessons/molecules-organiques/model1/index.html", desc: "قيد الإعداد 🔧" },
        { semester: 2, title: "Modification du squelette carboné", file: "content/chimie/lessons/modification-squelette/model1/index.html", desc: "قيد الإعداد 🔧" },
        { semester: 2, title: "Les groupes caractéristiques en chimie organique - La réactivité des alcools", file: "content/chimie/lessons/groupes-caracteristiques/model1/index.html", desc: "قيد الإعداد 🔧" }
    ],
    exercices: [
        { models: 1, semester: 1, title: "Importance de la mesure en chimie", file: "content/chimie/exercises/mesure-chimie/model1/exercice1.html", desc: "2 exercices avec solutions détaillées" },
        { models: 1, semester: 1, title: "Grandeurs physiques liées à la quantité de matière", file: "content/chimie/exercises/quantite-matiere/model1/exercice1.html", desc: "5 exercices avec solutions détaillées" },
        { models: 1, semester: 1, title: "La concentration et les solutions électrolytiques", file: "content/chimie/exercises/concentration-solutions/model1/exercice1.html", desc: "6 exercices avec solutions détaillées" },
        { models: 1, semester: 1, title: "Suivi d'une transformation chimique", file: "content/chimie/exercises/suivi-transformation/model1/index.html", desc: "قيد الإعداد 🔧" },
        { models: 1, semester: 1, title: "Mesure des quantités de matière en solution par conductimétrie", file: "content/chimie/exercises/conductimetrie/model1/index.html", desc: "قيد الإعداد 🔧" }
    ],
    series: [
        { models: 1, semester: 1, title: "Importance de la mesure en chimie", file: "content/chimie/series/mesure-chimie/model1/serie1.html", desc: "1 séries" },
        { models: 1, semester: 1, title: "Grandeurs physiques liées à la quantité de matière", file: "content/chimie/series/quantite-matiere/model1/serie1.html", desc: "4 séries" },
        { models: 1, semester: 1, title: "La concentration et les solutions électrolytiques", file: "content/chimie/series/concentration-solutions/model1/serie1.html", desc: "4 séries" },
        { models: 1, semester: 1, title: "Suivi d'une transformation chimique", file: "content/chimie/series/suivi-transformation/model1/index.html", desc: "قيد الإعداد 🔧" },
        { models: 1, semester: 1, title: "Mesure des quantités de matière en solution par conductimétrie", file: "content/chimie/series/conductimetrie/model1/index.html", desc: "قيد الإعداد 🔧" }
    ],
    exams: [
    {
        id: "ds1-rotation-travail-mesure",
        type: "Devoir",
        number: 1,
        semester: 1,
        title: "Devoir Surveillé N°1",
        desc: "Importance de la mesure en chimie + Grandeurs physiques liées à la quantité de matière",
        lessons: ["Importance de la mesure en chimie", "Grandeurs physiques liées à la quantité de matière"],
        duration: 120,
        hub: "content/physique/devoirs/ds1-rotation-travail-mesure/index.html",
        models: 1
    }
]
};


