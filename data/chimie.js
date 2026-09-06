
// ============================================================
// بيانات مادة الكيمياء
// لإضافة تمرين/سلسلة جديدة: زيد سطر جديد فمصفوفة exercices
// ============================================================
window.subjectsData = window.subjectsData || {};

window.subjectsData.chimie = {
    title: "Chimie",
    desc: "Exercices, devoirs et examens régionaux",

    exercices: [
        { models: 1, semester: 1, title: "Importance de la mesure en chimie", file: "content/chimie/exercises/mesure-chimie/model1/exercice1.html", desc: "2 exercices avec solutions détaillées" },
        { models: 1, semester: 1, title: "Importance de la mesure en chimie", file: "content/chimie/series/mesure-chimie/model1/serie1.html", desc: "1 séries" },
        { models: 1, semester: 1, title: "Grandeurs physiques liées à la quantité de matière", file: "content/chimie/exercises/quantite-matiere/model1/exercice1.html", desc: "5 exercices avec solutions détaillées" },
        { models: 1, semester: 1, title: "Grandeurs physiques liées à la quantité de matière", file: "content/chimie/series/quantite-matiere/model1/serie1.html", desc: "4 séries" },
        { models: 1, semester: 1, title: "La concentration et les solutions électrolytiques", file: "content/chimie/exercises/concentration-solutions/model1/exercice1.html", desc: "6 exercices avec solutions détaillées" },
        { models: 1, semester: 1, title: "La concentration et les solutions électrolytiques", file: "content/chimie/series/concentration-solutions/model1/serie1.html", desc: "4 séries" },
        { models: 1, semester: 1, title: "Suivi d'une transformation chimique", file: "content/chimie/exercises/suivi-transformation/model1/index.html", desc: "قيد الإعداد 🔧" },
        { models: 1, semester: 1, title: "Suivi d'une transformation chimique", file: "content/chimie/series/suivi-transformation/model1/index.html", desc: "قيد الإعداد 🔧" },
        { models: 1, semester: 1, title: "Mesure des quantités de matière en solution par conductimétrie", file: "content/chimie/exercises/conductimetrie/model1/index.html", desc: "قيد الإعداد 🔧" },
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
