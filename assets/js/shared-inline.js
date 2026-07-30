/* --- shared block 1df40cce (used in 48 files) --- */
window.addEventListener('scroll', function() {
            var navbar = document.getElementById('navbar');
            if (navbar) {
                navbar.classList.toggle('scrolled', window.scrollY > 30);
            }
        });

/* --- shared block 2c911eb1 (used in 29 files) --- */
window.addEventListener('scroll', function() {
            var navbar = document.getElementById('navbar');
            if (navbar) { navbar.classList.toggle('scrolled', window.scrollY > 30); }
        });

/* --- shared block 365fa8f4 (used in 68 files) --- */
window.addEventListener('scroll', function() {
            var navbar = document.getElementById('navbar');
            if (navbar) {
                navbar.classList.toggle('scrolled', window.scrollY > 30);
            }
        });

        function toggleSolution(id) {
            var el = document.getElementById(id);
            var btn = el.previousElementSibling;
            if (el.classList.contains('show')) {
                el.classList.remove('show');
                btn.textContent = 'Voir la solution';
            } else {
                el.classList.add('show');
                btn.textContent = 'Cacher la solution';
            }
        }

/* --- shared block 6fed5230 (used in 336 files) --- */
window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-XVMNBPXC9D');

/* --- shared block a963e4fe (used in 215 files) --- */
{
        "@context": "https://schema.org",
        "@type": "EducationalOrganization",
        "name": "Xpert",
        "description": "Cours de 1 Bac Sciences Expérimentales"
    }

/* --- shared block b442a327 (used in 6 files) --- */
window.addEventListener('scroll', function() {
            var navbar = document.getElementById('navbar');
            if (navbar) { navbar.classList.toggle('scrolled', window.scrollY > 30); }
        });

        function toggleSolution(id) {
            var el = document.getElementById(id);
            var btn = el.previousElementSibling;
            if (el.classList.contains('show')) {
                el.classList.remove('show');
                if (btn) btn.innerHTML = btn.innerHTML.replace('Masquer', 'Afficher');
            } else {
                el.classList.add('show');
                if (btn) btn.innerHTML = btn.innerHTML.replace('Afficher', 'Masquer');
            }
        }

/* --- shared block d8da514a (used in 346 files) --- */
(function(){try{var t=localStorage.getItem('xpert-theme');if(t==='light'){document.documentElement.setAttribute('data-theme','light');}}catch(e){}})();

/* --- shared block dbc0df2f (used in 291 files) --- */
MathJax = {
            tex: {
                inlineMath: [['$', '$'], ['\\(', '\\)']],
                displayMath: [['$$', '$$'], ['\\[', '\\]']]
            },
            svg: { fontCache: 'global' }
        };
