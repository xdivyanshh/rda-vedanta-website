document.addEventListener('DOMContentLoaded', () => {
    const langSelect = document.getElementById('langSelect');
    if (!langSelect) return;

    let currentLang = localStorage.getItem('siteLang') || 'en';
    let translations = {};

    function updateDOM() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[key] && translations[key][currentLang]) {
                el.textContent = translations[key][currentLang];
            }
        });
        
        // Update select value explicitly to match DOM
        langSelect.value = currentLang;
        document.documentElement.lang = currentLang;
    }

    fetch('/src/data/translations.json')
        .then(res => res.json())
        .then(data => {
            translations = data;
            langSelect.value = currentLang;
            if (currentLang !== 'en') {
                updateDOM();
            }
        })
        .catch(err => console.error("Error loading translations", err));

    langSelect.addEventListener('change', (e) => {
        currentLang = e.target.value;
        localStorage.setItem('siteLang', currentLang);
        updateDOM();
    });
});
