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
            title: "Rotation d'un solide autour d'un axe fixe", 
            file: "content/physique/lessons/rotation-solide/index.html", 
            desc: "Mouvement de rotation, vitesse angulaire, période, fréquence" 
        },
        { 
            title: "Travail et énergie cinétique", 
            file: "content/physique/lessons/travail-energie-cinetique/index.html", 
            desc: "Énergie cinétique en translation et rotation, théorème de l'énergie cinétique" 
        },
        { 
            title: "Travail et puissance d'une force", 
            file: "content/physique/lessons/travail-puissance/index.html", 
            desc: "Travail d'une force, puissance, couple de forces" 
        },
        { title: "Le champ magnétique", file: "content/physique/lessons/champ-magnetique/index.html", desc: "قيد الإعداد 🔧" },
        { title: "Le champ magnétique créé par un courant électrique", file: "content/physique/lessons/champ-magnetique-courant/index.html", desc: "قيد الإعداد 🔧" },
        { title: "Transfert d'énergie dans un circuit électrique", file: "content/physique/lessons/circuit-electrique/index.html", desc: "قيد الإعداد 🔧" },
        { title: "Travail et énergie potentielle de pesanteur - Énergie mécanique", file: "content/physique/lessons/energie-potentielle-mecanique/index.html", desc: "قيد الإعداد 🔧" },
        { title: "Les forces électromagnétiques - La loi de Laplace", file: "content/physique/lessons/forces-laplace/index.html", desc: "قيد الإعداد 🔧" },
        { title: "Quelques instruments optiques", file: "content/physique/lessons/instruments-optiques/index.html", desc: "قيد الإعداد 🔧" },
        { title: "Les images formées par une lentille mince convergente", file: "content/physique/lessons/lentille-convergente/index.html", desc: "قيد الإعداد 🔧" },
        { title: "Les images formées par un miroir plan", file: "content/physique/lessons/miroir-plan/index.html", desc: "قيد الإعداد 🔧" },
        { title: "Visibilité d'un objet", file: "content/physique/lessons/visibilite-objet/index.html", desc: "قيد الإعداد 🔧" }
    ],
    exercices: [
        { 
            title: "Rotation d'un solide", 
            file: "content/physique/exercises/rotation-solide/index.html", 
            desc: "6 exercices avec solutions" 
        }
    ],
    series: [
        { 
            title: "Rotation d'un solide", 
            file: "content/physique/series/rotation-solide/index.html", 
            desc: "6 exercices avec solutions détaillées" 
        }
    ],
    exams: []
};
