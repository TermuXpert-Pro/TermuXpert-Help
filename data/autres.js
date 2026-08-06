// ============================================================
// بيانات زر "Autres" - مصدر واحد لكل بطاقات هاد التبويب فتلات المواد
// هاد الملف كيتحمل من subject.html من بعد ملف المادة (math.js/physique.js/chimie.js)
// و كيتلصق أوتوماتيكيا فـ currentSubject.others
//
// لإضافة بطاقة جديدة: زيد عنصر جديد فمصفوفة المادة المعنية بنفس الهيكل:
//   title -> عنوان البطاقة
//   file  -> مسار الصفحة اللي غادي توديك ليها
//   desc  -> وصف مختصر
//   icon  -> أيقونة Font Awesome (بدون "fas")
//   color -> هوية لونية للبطاقة (hex)
//   label -> نص البادج
// ترتيب العناصر فالمصفوفة هو نفسو ترتيب ظهورهم فالصفحة
// ============================================================
window.autresData = window.autresData || {};

// ============================================================
// Autres - Mathématiques
// ============================================================
window.autresData.math = [
    {
        title: "Essentiels",
        file: "content/math/base/index.html",
        desc: "Les règles et formules essentielles à connaître par cœur",
        icon: "fa-bolt",
        color: "#79B8E8",
        label: "Voir les essentiels"
    },
    {
        title: "Fiches de révision",
        file: "content/math/fiches/index.html",
        desc: "Résumés condensés de chaque leçon pour réviser rapidement",
        icon: "fa-note-sticky",
        color: "#BB8FCE",
        label: "Voir les fiches"
    },
    {
        title: "Formulaire",
        file: "content/math/formulaire/index.html",
        desc: "Toutes les formules de mathématiques réunies dans une seule page",
        icon: "fa-square-root-variable",
        color: "#E8873A",
        label: "Voir le formulaire"
    },
    {
        title: "Méthodologie",
        file: "content/math/methodologie/index.html",
        desc: "Comment résoudre chaque type d'exercice, étape par étape",
        icon: "fa-diagram-project",
        color: "#58D68D",
        label: "Voir la méthodologie"
    },
    {
        title: "Glossaire",
        file: "content/math/glossaire/index.html",
        desc: "Définitions des termes et notions clés de la matière",
        icon: "fa-book-open",
        color: "#F1948A",
        label: "Voir le glossaire"
    },
    {
        title: "Jeux",
        file: "content/math/jeux/index.html",
        desc: "Apprends en t'amusant avec des jeux mathématiques",
        icon: "fa-gamepad",
        color: "#F4D03F",
        label: "Jouer"
    },
    {
        title: "Quiz",
        file: "content/math/quiz/index.html",
        desc: "Teste tes connaissances avec des questions à choix multiples",
        icon: "fa-question-circle",
        color: "#4ECDC4",
        label: "Lancer le quiz"
    }
];

// ============================================================
// Autres - Physique
// ============================================================
window.autresData.physique = [
    {
        title: "Essentiels",
        file: "content/physique/base/index.html",
        desc: "Les formules et règles essentielles à connaître par cœur",
        icon: "fa-bolt",
        color: "#79B8E8",
        label: "Voir les essentiels"
    },
    {
        title: "Fiches de révision",
        file: "content/physique/fiches/index.html",
        desc: "Résumés condensés de chaque leçon pour réviser rapidement",
        icon: "fa-note-sticky",
        color: "#BB8FCE",
        label: "Voir les fiches"
    },
    {
        title: "Formulaire",
        file: "content/physique/formulaire/index.html",
        desc: "Toutes les formules de physique réunies dans une seule page",
        icon: "fa-square-root-variable",
        color: "#E8873A",
        label: "Voir le formulaire"
    },
    {
        title: "Méthodologie",
        file: "content/physique/methodologie/index.html",
        desc: "Comment résoudre chaque type d'exercice, étape par étape",
        icon: "fa-diagram-project",
        color: "#58D68D",
        label: "Voir la méthodologie"
    },
    {
        title: "Glossaire",
        file: "content/physique/glossaire/index.html",
        desc: "Définitions des termes et notions clés de la matière",
        icon: "fa-book-open",
        color: "#F1948A",
        label: "Voir le glossaire"
    },
    {
        title: "Jeux",
        file: "content/physique/jeux/index.html",
        desc: "Apprends en t'amusant avec des jeux de physique",
        icon: "fa-gamepad",
        color: "#F4D03F",
        label: "Jouer"
    },
    {
        title: "Quiz",
        file: "content/physique/quiz/index.html",
        desc: "Teste tes connaissances avec des questions à choix multiples",
        icon: "fa-question-circle",
        color: "#4ECDC4",
        label: "Lancer le quiz"
    }
];

// ============================================================
// Autres - Chimie
// ============================================================
window.autresData.chimie = [
    {
        title: "Essentiels",
        file: "content/chimie/base/index.html",
        desc: "Les définitions et formules essentielles à connaître par cœur",
        icon: "fa-bolt",
        color: "#79B8E8",
        label: "Voir les essentiels"
    },
    {
        title: "Fiches de révision",
        file: "content/chimie/fiches/index.html",
        desc: "Résumés condensés de chaque leçon pour réviser rapidement",
        icon: "fa-note-sticky",
        color: "#BB8FCE",
        label: "Voir les fiches"
    },
    {
        title: "Formulaire",
        file: "content/chimie/formulaire/index.html",
        desc: "Toutes les formules de chimie réunies dans une seule page",
        icon: "fa-square-root-variable",
        color: "#E8873A",
        label: "Voir le formulaire"
    },
    {
        title: "Méthodologie",
        file: "content/chimie/methodologie/index.html",
        desc: "Comment résoudre chaque type d'exercice, étape par étape",
        icon: "fa-diagram-project",
        color: "#58D68D",
        label: "Voir la méthodologie"
    },
    {
        title: "Glossaire",
        file: "content/chimie/glossaire/index.html",
        desc: "Définitions des termes et notions clés de la matière",
        icon: "fa-book-open",
        color: "#F1948A",
        label: "Voir le glossaire"
    },
    {
        title: "Jeux",
        file: "content/chimie/jeux/index.html",
        desc: "Apprends en t'amusant avec des jeux de chimie",
        icon: "fa-gamepad",
        color: "#F4D03F",
        label: "Jouer"
    },
    {
        title: "Quiz",
        file: "content/chimie/quiz/index.html",
        desc: "Teste tes connaissances avec des questions à choix multiples",
        icon: "fa-question-circle",
        color: "#4ECDC4",
        label: "Lancer le quiz"
    }
];
