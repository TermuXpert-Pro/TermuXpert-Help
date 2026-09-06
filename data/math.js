// ============================================================
// بيانات مادة الرياضيات
// لإضافة تمرين/سلسلة جديدة: زيد سطر جديد فمصفوفة exercices
// ============================================================
window.subjectsData = window.subjectsData || {};

window.subjectsData.math = {
    title: "Mathématiques",
    desc: "Exercices, devoirs et examens régionaux",

    exercices: [
        { models: 1, semester: 1, title: "Logique mathématique", file: "content/math/exercises/logique/model1/exercice1.html", desc: "8 exercices avec solutions" },
        { models: 1, semester: 1, title: "Logique mathématique", file: "content/math/series/logique/model1/serie1.html", desc: "5 séries" },
        { models: 1, semester: 1, title: "Généralités sur les fonctions", file: "content/math/exercises/fonctions/model1/exercice1.html", desc: "10 exercices avec solutions" },
        { models: 1, semester: 1, title: "Généralités sur les fonctions", file: "content/math/series/fonctions/model1/serie1.html", desc: "7 séries" },
        { models: 1, semester: 1, title: "Barycentre dans le plan", file: "content/math/exercises/barycentre/model1/exercice1.html", desc: "8 exercices avec solutions" },
        { models: 1, semester: 1, title: "Barycentre dans le plan", file: "content/math/series/barycentre/model1/serie1.html", desc: "6 séries" },
        { models: 1, semester: 1, title: "Le produit scalaire et ses applications", file: "content/math/exercises/produit-scalaire/model1/exercice1.html", desc: "11 exercices avec solutions" }
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
