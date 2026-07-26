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
            file: "content/physique/lessons/rotation-solide/model1/index.html",
            desc: "Mouvement de rotation, vitesse angulaire, période, fréquence"
        },
        {
            semester: 1,
            title: "Travail et puissance d'une force",
            file: "content/physique/lessons/travail-puissance/model1/index.html",
            desc: "Travail d'une force, puissance, couple de forces"
        },
        {
            semester: 1,
            title: "Travail et énergie cinétique",
            file: "content/physique/lessons/travail-energie-cinetique/model1/index.html",
            desc: "Énergie cinétique en translation et rotation, théorème de l'énergie cinétique"
        },
        {
            semester: 1,
            title: "Travail et énergie potentielle de pesanteur - Énergie mécanique",
            file: "content/physique/lessons/energie-potentielle-mecanique/model1/index.html",
            desc: "Énergie potentielle de pesanteur, énergie mécanique, conservation et non-conservation, travail du poids"
        },
        { semester: 1, title: "Transfert d'énergie dans un circuit électrique", file: "content/physique/lessons/circuit-electrique/model1/index.html", desc: "Effet Joule, énergie et puissance électriques, générateur et récepteur, bilan énergétique" },
        { semester: 1, title: "Comportement global d'un circuit électrique", file: "content/physique/lessons/comportement-global-circuit/model1/index.html", desc: "Loi de Pouillet, loi d'Ohm du générateur et du récepteur, rendement, bilan de puissance" },
        { semester: 2, title: "Le champ magnétique", file: "content/physique/lessons/champ-magnetique/model1/index.html", desc: "قيد الإعداد 🔧" },
        { semester: 2, title: "Le champ magnétique créé par un courant électrique", file: "content/physique/lessons/champ-magnetique-courant/model1/index.html", desc: "قيد الإعداد 🔧" },
        { semester: 2, title: "Les forces électromagnétiques - La loi de Laplace", file: "content/physique/lessons/forces-laplace/model1/index.html", desc: "قيد الإعداد 🔧" },
        { semester: 2, title: "Visibilité d'un objet", file: "content/physique/lessons/visibilite-objet/model1/index.html", desc: "قيد الإعداد 🔧" },
        { semester: 2, title: "Les images formées par un miroir plan", file: "content/physique/lessons/miroir-plan/model1/index.html", desc: "قيد الإعداد 🔧" },
        { semester: 2, title: "Les images formées par une lentille mince convergente", file: "content/physique/lessons/lentille-convergente/model1/index.html", desc: "قيد الإعداد 🔧" },
        { semester: 2, title: "Quelques instruments optiques", file: "content/physique/lessons/instruments-optiques/model1/index.html", desc: "قيد الإعداد 🔧" }
    ],
    exercices: [
        {
            models: 1, semester: 1,
            title: "Rotation d'un solide",
            file: "content/physique/exercises/rotation-solide/index.html",
            desc: "6 exercices avec solutions"
        },
        {
            models: 1, semester: 1,
            title: "Travail et puissance d'une force",
            file: "content/physique/exercises/travail-puissance/index.html",
            desc: "8 exercices avec solutions détaillées"
        },
        {
            models: 1, semester: 1,
            title: "Travail et énergie cinétique",
            file: "content/physique/exercises/travail-energie-cinetique/index.html",
            desc: "9 exercices avec solutions détaillées"
        },
        {
            models: 1, semester: 1,
            title: "Travail et énergie potentielle de pesanteur - Énergie mécanique",
            file: "content/physique/exercises/energie-potentielle-mecanique/index.html",
            desc: "Énergie potentielle de pesanteur, énergie mécanique, conservation et non-conservation, travail du poids"
        },
        { models: 1, semester: 1, title: "Transfert d'énergie dans un circuit électrique", file: "content/physique/exercises/circuit-electrique/index.html", desc: "Effet Joule, énergie et puissance électriques, générateur et récepteur, bilan énergétique" },
        { models: 1, semester: 1, title: "Comportement global d'un circuit électrique", file: "content/physique/exercises/comportement-global-circuit/index.html", desc: "Loi de Pouillet, loi d'Ohm du générateur et du récepteur, rendement, bilan de puissance" }
    
    ],
    series: [
        {
            models: 1, semester: 1,
            title: "Rotation d'un solide",
            file: "content/physique/series/rotation-solide/index.html",
            desc: "1 séries"
        },
        {
            models: 1, semester: 1,
            title: "Travail et puissance d'une force",
            file: "content/physique/series/travail-puissance/index.html",
            desc: "1 séries"
        },
        {
            models: 1, semester: 1,
            title: "Travail et énergie cinétique",
            file: "content/physique/series/travail-energie-cinetique/index.html",
            desc: "1 séries"
        }
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
