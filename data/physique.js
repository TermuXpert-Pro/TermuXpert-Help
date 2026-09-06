// ============================================================
// بيانات مادة الفيزياء
// لإضافة تمرين/سلسلة جديدة: زيد سطر جديد فمصفوفة exercices
// ============================================================
window.subjectsData = window.subjectsData || {};

window.subjectsData.physique = {
    title: "Physique",
    desc: "Exercices, devoirs et examens régionaux",

    exercices: [
        {
            semester: 1,
            title: "Rotation d'un solide",
            exercice: { file: "content/physique/exercises/rotation-solide/model1/exercice1.html", desc: "6 exercices avec solutions" },
            serie: { file: "content/physique/series/rotation-solide/model1/serie1.html", desc: "1 séries" }
        },
        {
            semester: 1,
            title: "Travail et puissance d'une force",
            exercice: { file: "content/physique/exercises/travail-puissance/model1/exercice1.html", desc: "8 exercices avec solutions détaillées" },
            serie: { file: "content/physique/series/travail-puissance/model1/serie1.html", desc: "1 séries" }
        },
        {
            semester: 1,
            title: "Travail et énergie cinétique",
            exercice: { file: "content/physique/exercises/travail-energie-cinetique/model1/exercice1.html", desc: "9 exercices avec solutions détaillées" },
            serie: { file: "content/physique/series/travail-energie-cinetique/model1/serie1.html", desc: "1 séries" }
        },
        {
            semester: 1,
            title: "Travail et énergie potentielle de pesanteur - Énergie mécanique",
            exercice: { file: "content/physique/exercises/energie-potentielle-mecanique/model1/index.html", desc: "قيد الإعداد 🔧" }
        },
        { semester: 1, title: "Transfert d'énergie dans un circuit électrique",
          exercice: { file: "content/physique/exercises/circuit-electrique/model1/index.html", desc: "قيد الإعداد 🔧" } },
        { semester: 1, title: "Comportement global d'un circuit électrique",
          exercice: { file: "content/physique/exercises/comportement-global-circuit/model1/index.html", desc: "قيد الإعداد 🔧" } }
    ],
    exams: [
    {
        id: "ds1-rotation-travail-mesure",
        type: "Devoir",
        number: 1,
        semester: 1,
        title: "Devoir Surveillé N°1",
        desc: "Rotation d'un solide, Travail et énergie + Chimie (mesure et quantité de matière)",
        lessons: ["Rotation d'un solide autour d'un axe fixe", "Travail et puissance d'une force"],
        duration: 120,
        hub: "content/physique/devoirs/ds1-rotation-travail-mesure/index.html",
        models: 1
    }
]
};
