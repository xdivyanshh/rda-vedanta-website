document.addEventListener('DOMContentLoaded', () => {
    const langToggleBtn = document.getElementById('langToggleBtn');
    if (!langToggleBtn) return;

    let currentLang = localStorage.getItem('siteLang') || 'en';
    let translations = {};

    function updateDOM() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[key] && translations[key][currentLang]) {
                // If element has SVG elements inside, we don't want to wipe them if possible.
                // However, most tags we target will just have text.
                // For the 'Sales Inquiry' button which has an SVG, we will target an inner span in index.html.
                el.textContent = translations[key][currentLang];
            }
        });
        
        // Update toggle button text
        langToggleBtn.textContent = currentLang === 'en' ? 'अ/A (Hindi)' : 'A/अ (English)';
        document.documentElement.lang = currentLang;
    }

    fetch('/src/data/translations.json')
        .then(res => res.json())
        .then(data => {
            translations = data;
            if (currentLang !== 'en') {
                updateDOM();
            } else {
                langToggleBtn.textContent = 'अ/A (Hindi)';
            }
        })
        .catch(err => console.error("Error loading translations", err));

    langToggleBtn.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'hi' : 'en';
        localStorage.setItem('siteLang', currentLang);
        updateDOM();
    });
});
