// ============================================================
// SEO - JSON-LD Schema.org
// ============================================================

(function() {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "EducationalOrganization",
        "name": "Xpert",
        "description": "Plateforme éducative pour 1 Bac Sciences Expérimentales. Cours, exercices, séries et examens en Mathématiques, Physique et Chimie.",
        "url": "https://termuxpert-pro.github.io/TermuXpert-WEB/",
        "logo": "https://termuxpert-pro.github.io/TermuXpert-WEB/assets/images/profile.png",
        "sameAs": [],
        "address": {
            "@type": "PostalAddress",
            "addressCountry": "MA"
        }
    });
    document.head.appendChild(script);
    console.log('✅ JSON-LD Schema.org ajouté');
})();
