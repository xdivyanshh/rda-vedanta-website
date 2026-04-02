// Renders the products grid and sidebar based on the category of the page
document.addEventListener('DOMContentLoaded', async () => {
    const grid = document.getElementById('shopGrid');
    if (!grid) return;

    // Get the category from a data attribute on the grid container
    const targetCategory = grid.dataset.category || 'all';
    const titleElement = document.getElementById('shopCategoryTitle');

    try {
        const res = await fetch('/src/data/product-database.json');
        const products = await res.json();

        // ── 1. Create Modal Container ──
        const modalHtml = `
            <div id="productModal" class="product-modal">
                <div class="modal-content">
                    <button class="modal-close" id="modalClose">&times;</button>
                    <div class="modal-img-col">
                        <img id="modalImg" src="" alt="Product Image">
                    </div>
                    <div class="modal-info-col">
                        <div id="modalCategory" class="modal-category"></div>
                        <h2 id="modalTitle" class="modal-title"></h2>
                        <div id="modalFeaturesContainer"></div>
                        <div id="modalSpecsContainer"></div>
                        <a id="modalWhatsAppBtn" href="#" class="btn-whatsapp-inquiry" target="_blank">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884"/>
                            </svg>
                            Inquire Now
                        </a>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        const modal = document.getElementById('productModal');
        const modalClose = document.getElementById('modalClose');
        modalClose.addEventListener('click', () => modal.classList.remove('show'));
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('show');
        });

        // ── 2. Inject Sidebar Layout ──
        // Instead of having just the grid, we wrap it in RR style layout
        const parentContainer = grid.parentElement;
        const layoutWrapper = document.createElement('div');
        layoutWrapper.className = 'shop-container';
        
        const sidebarHtml = `
            <div class="shop-sidebar">
                <div class="sidebar-header">
                    <h3>Product Categories</h3>
                    <span class="sidebar-clear">Clear</span>
                </div>
                <div class="filter-group">
                    <button class="filter-toggle">BY TYPE</button>
                </div>
                <div class="filter-group">
                    <button class="filter-toggle">BY TANK CAPACITY</button>
                </div>
                <div class="filter-group">
                    <button class="filter-toggle">BY BODY TYPE</button>
                </div>
                <div class="filter-group">
                    <button class="filter-toggle">BY WATTAGE</button>
                </div>
            </div>
        `;
        layoutWrapper.insertAdjacentHTML('afterbegin', sidebarHtml);
        
        const mainWrapper = document.createElement('div');
        mainWrapper.className = 'shop-main';
        
        // Move grid into main wrapper
        parentContainer.insertBefore(layoutWrapper, grid);
        mainWrapper.appendChild(grid);
        layoutWrapper.appendChild(mainWrapper);

        // ── 3. Render Cards ──
        const filtered = targetCategory === 'all' 
            ? products 
            : products.filter(p => p.category === targetCategory);

        if (filtered.length > 0 && titleElement) {
            titleElement.textContent = filtered[0].parentCategory || targetCategory.toUpperCase();
        }

        if (filtered.length === 0) {
            grid.innerHTML = '<div class="empty-state"><h3>No products found</h3><p>We are still updating our catalogue for this category.</p></div>';
            return;
        }

        const cardsHtml = filtered.map((p, i) => {
            // Keep safe product data for modal
            const safeProductJson = encodeURIComponent(JSON.stringify(p));
            // Show image if provided, else just an empty container
            const imageHtml = p.image 
                ? `<img src="${p.image}" alt="${p.name}" loading="lazy">` 
                : `<div style="width: 100%; height: 100%; color: #ccc; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; text-transform: uppercase;">Image Pending</div>`;

            return `
                <div class="product-card" data-product="${safeProductJson}" tabindex="0">
                    <div class="product-image-box">
                        ${imageHtml}
                    </div>
                    <div class="product-info-minimal">
                        <h3 class="product-title">${p.name}</h3>
                    </div>
                </div>
            `;
        }).join('');

        grid.innerHTML = cardsHtml;

        // ── 4. Attach Event Listeners for Modal ──
        const productCards = grid.querySelectorAll('.product-card');
        productCards.forEach(card => {
            card.addEventListener('click', function() {
                const p = JSON.parse(decodeURIComponent(this.getAttribute('data-product')));
                
                // Populate Modal Image
                const modalImgEl = document.getElementById('modalImg');
                if (p.image) {
                    modalImgEl.src = p.image;
                    modalImgEl.style.display = "block";
                } else {
                    modalImgEl.src = "";
                    modalImgEl.style.display = "none";
                }
                
                document.getElementById('modalCategory').textContent = p.parentCategory || "PRODUCT";
                document.getElementById('modalTitle').textContent = p.name;
                
                // Features
                let featuresHtml = '';
                if (p.features && p.features.length > 0) {
                    featuresHtml = `<div class="modal-section-title">Key Highlights</div>
                                    <ul class="modal-features">` + 
                                    p.features.map(f => `<li>${f}</li>`).join('') + 
                                    `</ul>`;
                }
                document.getElementById('modalFeaturesContainer').innerHTML = featuresHtml;
                
                // Specs
                let specsHtml = '';
                if (p.specifications && Object.keys(p.specifications).length > 0) {
                    specsHtml = `<div class="modal-section-title">Technical Specifications</div>
                                 <div class="modal-specs">` + 
                                 Object.entries(p.specifications).map(([key, val]) => `
                                    <div class="modal-spec-item">
                                        <span class="modal-spec-key">${key}</span>
                                        <span class="modal-spec-val">${val}</span>
                                    </div>
                                 `).join('') + 
                                 `</div>`;
                }
                document.getElementById('modalSpecsContainer').innerHTML = specsHtml;
                
                // WhatsApp
                const waMessage = encodeURIComponent(`Hi, I am interested in your ${p.name} (${p.model || p.parentCategory}). Please share the pricing and details.`);
                document.getElementById('modalWhatsAppBtn').href = `https://wa.me/916392959815?text=${waMessage}`;
                
                // Show modal
                modal.classList.add('show');
            });
        });

        if (window.updateDOM) window.updateDOM();

    } catch (err) {
        console.error('Failed to load shop products:', err);
        grid.innerHTML = '<div class="empty-state"><p>Could not load products at this time.</p></div>';
    }
});
