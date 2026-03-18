document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('priceAccordion');
    if (!container) return;

    try {
        const res = await fetch('src/data/price-list.json');
        const categories = await res.json();

        container.innerHTML = categories.map(cat => `
            <details class="price-details">
                <summary class="price-summary">${cat.title}</summary>
                <div class="price-content">
                    ${cat.sections.map(sec => renderSection(sec)).join('')}
                </div>
            </details>
        `).join('');
    } catch (err) {
        console.error('Failed to load price list:', err);
        container.innerHTML = '<p style="text-align:center;color:#999;">Could not load price list.</p>';
    }
});

function renderSection(section) {
    let html = `<h4>${section.heading}</h4>`;

    if (section.type === 'table') {
        html += `
            <table class="price-table">
                <thead>
                    <tr>${section.headers.map(h => `<th>${h}</th>`).join('')}</tr>
                </thead>
                <tbody>
                    ${section.rows.map(row =>
                        `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`
                    ).join('')}
                </tbody>
            </table>`;
    } else if (section.type === 'list') {
        html += `
            <ul class="price-list-text">
                ${section.items.map(item => `<li>${item}</li>`).join('')}
            </ul>`;
    }

    if (section.note) {
        html += `<p class="note">${section.note}</p>`;
    }

    return html;
}
