document.addEventListener('DOMContentLoaded', async () => {
    const grid = document.getElementById('downloadGrid');
    if (!grid) return;

    const pdfIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`;

    const downloadSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`;

    try {
        const res = await fetch('/src/data/downloads.json');
        const downloads = await res.json();

        grid.innerHTML = downloads.map((d, i) => `
            <div class="download-card reveal reveal-delay-${i + 1}">
                <div class="download-card-icon">${pdfIconSVG}</div>
                <h3>${d.title}</h3>
                <p class="download-meta">${d.meta}</p>
                <a href="${d.pdf}" class="btn-download-pdf" download>
                    ${downloadSVG} Download PDF
                </a>
            </div>
        `).join('');
    } catch (err) {
        console.error('Failed to load downloads:', err);
        grid.innerHTML = '<p style="text-align:center;color:#999;">Could not load downloads.</p>';
    }
});
