document.addEventListener('DOMContentLoaded', async () => {
    const grid = document.getElementById('bentoGrid');
    if (!grid) return;

    try {
        const res = await fetch('/src/data/products.json');
        const products = await res.json();

        grid.innerHTML = products.map((p, i) => `
            <div class="bento-card reveal reveal-delay-${i + 1}">
                <div class="card-icon">${p.icon}</div>
                <h3>${p.title}</h3>
                <p>${p.description}</p>
            </div>
        `).join('');
    } catch (err) {
        console.error('Failed to load products:', err);
        grid.innerHTML = '<p style="text-align:center;color:#999;">Could not load products.</p>';
    }
});
