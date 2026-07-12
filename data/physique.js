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
        }
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
