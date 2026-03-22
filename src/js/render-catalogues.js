document.addEventListener('DOMContentLoaded', async () => {
    const grid = document.getElementById('catalogueGrid');
    if (!grid) return;

    try {
        const res = await fetch('/src/data/catalogues.json');
        const catalogues = await res.json();

        grid.innerHTML = catalogues.map((c, i) => `
            <div class="catalogue-card reveal reveal-delay-${(i % 4) + 1}">
                <div class="cat-icon">${c.icon}</div>
                <h3 data-i18n="${c.nameKey}">${c.name}</h3>
                <div class="catalogue-actions">
                    <a href="/${c.pdf}" class="btn-view" target="_blank" data-i18n="btn-view">View</a>
                    <a href="/${c.pdf}" class="btn-download" download data-i18n="btn-download">Download</a>
                </div>
            </div>
        `).join('');

        if (window.updateDOM) window.updateDOM();
    } catch (err) {
        console.error('Failed to load catalogues:', err);
        grid.innerHTML = '<p style="text-align:center;color:#999;">Could not load catalogues.</p>';
    }
});
