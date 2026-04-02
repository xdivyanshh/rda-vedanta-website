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
                    <div class="modal-img-col" style="position: relative;">
                        <img id="modalImg" src="" alt="Product Image">
                        <div id="modalGalleryControls" style="display: none;">
                            <button id="modalPrev" class="gallery-nav" style="position: absolute; left: 15px; top: 50%; transform: translateY(-50%); background: white; border: none; border-radius: 50%; width: 40px; height: 40px; font-size: 24px; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.15); transition: background 0.2s; color: #333;">&lsaquo;</button>
                            <button id="modalNext" class="gallery-nav" style="position: absolute; right: 15px; top: 50%; transform: translateY(-50%); background: white; border: none; border-radius: 50%; width: 40px; height: 40px; font-size: 24px; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.15); transition: background 0.2s; color: #333;">&rsaquo;</button>
                        </div>
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

        // ── Removed Sidebar Layout per user request ──
        
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
            // Determine initial image
            let initialImage = p.image || "";
            let baseVariantIdx = 0;
            
            // Find true default variant based on database routing
            if (p.variants && p.variants.length > 0) {
                const matchIdx = p.variants.findIndex(v => v.image === initialImage);
                if (matchIdx !== -1) {
                    baseVariantIdx = matchIdx;
                } else if (!initialImage) {
                    initialImage = p.variants[0].image || "";
                }
            }

            // Build color swatches
            let swatchesHtml = '';
            if (p.variants && p.variants.length > 0) {
                swatchesHtml = '<div class="color-swatches" style="margin-top: 10px; justify-content: center;">';
                p.variants.forEach((v, idx) => {
                    swatchesHtml += `<button class="swatch-btn ${idx === baseVariantIdx ? 'active' : ''}" 
                        style="background-color: ${v.colorCode};" 
                        data-variant-idx="${idx}"
                        title="${v.colorName}"></button>`;
                });
                swatchesHtml += '</div>';
            }

            // Encode product safely for modal
            const initialProductData = { ...p };
            if (p.variants && p.variants.length > 0) {
                if (p.variants[baseVariantIdx].image) initialProductData.image = p.variants[baseVariantIdx].image;
                if (p.variants[baseVariantIdx].gallery) initialProductData.gallery = p.variants[baseVariantIdx].gallery;
            }
            const safeProductJson = encodeURIComponent(JSON.stringify(initialProductData));

            const imageHtml = initialImage 
                ? `<img src="${initialImage}" alt="${p.name}" loading="lazy">` 
                : `<div style="width: 100%; height: 100%; color: #ccc; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; text-transform: uppercase;">Image Pending</div>`;

            return `
                <div class="product-card" data-product="${safeProductJson}" tabindex="0">
                    <div class="product-image-box">
                        ${imageHtml}
                    </div>
                    <div class="product-info-minimal">
                        <h3 class="product-title">${p.name}</h3>
                        ${swatchesHtml}
                    </div>
                </div>
            `;
        }).join('');

        grid.innerHTML = cardsHtml;

        // ── 3.5. Attach Event Listeners for Color Swatches ──
        grid.querySelectorAll('.product-card').forEach(card => {
            const swatchBtns = card.querySelectorAll('.swatch-btn');
            if (swatchBtns.length === 0) return;

            const imgBox = card.querySelector('.product-image-box');
            // Extract the original JSON out of the original state array to avoid encoding mutation bugs
            const originalProductDataStr = decodeURIComponent(card.getAttribute('data-product'));
            const originalProductData = JSON.parse(originalProductDataStr); // It's currently mapped to variant 0

            // But we actually need the real unmutated product to fetch all galleries
            const baseProductData = filtered.find(item => item.id === originalProductData.id);

            swatchBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation(); // Stop card click (modal)
                    
                    // Update active state
                    swatchBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');

                    // Update Image
                    const vIdx = parseInt(btn.getAttribute('data-variant-idx'), 10);
                    const variant = baseProductData.variants[vIdx];
                    
                    if (variant && variant.image) {
                        imgBox.innerHTML = `<img src="${variant.image}" alt="${baseProductData.name}" loading="lazy">`;
                    } else {
                        imgBox.innerHTML = `<div style="width: 100%; height: 100%; color: #ccc; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; text-transform: uppercase;">Image Pending</div>`;
                    }
                    
                    // Mutate the local attribute so the modal sees the new variant's gallery
                    let updatedData = { ...baseProductData };
                    if (variant && variant.image) updatedData.image = variant.image;
                    if (variant && variant.gallery && variant.gallery.length > 0) {
                        updatedData.gallery = variant.gallery;
                    } else if (variant && variant.image) {
                        updatedData.gallery = [variant.image];
                    }
                    
                    card.setAttribute('data-product', encodeURIComponent(JSON.stringify(updatedData)));
                });
            });
        });

        // ── 4. Attach Event Listeners for Modal ──
        let currentGallery = [];
        let currentGalleryIdx = 0;
        const modalImgEl = document.getElementById('modalImg');
        const galleryControls = document.getElementById('modalGalleryControls');

        const updateGalleryImage = () => {
            if (currentGallery.length > 0) {
                modalImgEl.classList.add('fade-out');
                setTimeout(() => {
                    modalImgEl.src = currentGallery[currentGalleryIdx];
                    modalImgEl.onload = () => {
                        modalImgEl.classList.remove('fade-out');
                    };
                }, 200);
            }
        };

        document.getElementById('modalNext').addEventListener('click', () => {
            if (currentGallery.length > 1) {
                currentGalleryIdx = (currentGalleryIdx + 1) % currentGallery.length;
                updateGalleryImage();
            }
        });

        document.getElementById('modalPrev').addEventListener('click', () => {
            if (currentGallery.length > 1) {
                currentGalleryIdx = (currentGalleryIdx - 1 + currentGallery.length) % currentGallery.length;
                updateGalleryImage();
            }
        });

        const productCards = grid.querySelectorAll('.product-card');
        productCards.forEach(card => {
            card.addEventListener('click', function() {
                const p = JSON.parse(decodeURIComponent(this.getAttribute('data-product')));
                
                // Populate Modal Image
                if (p.gallery && p.gallery.length > 0) {
                    currentGallery = p.gallery;
                    currentGalleryIdx = 0;
                    modalImgEl.src = currentGallery[0];
                    modalImgEl.style.display = "block";
                    galleryControls.style.display = p.gallery.length > 1 ? "block" : "none";
                } else if (p.image) {
                    currentGallery = [p.image];
                    currentGalleryIdx = 0;
                    modalImgEl.src = p.image;
                    modalImgEl.style.display = "block";
                    galleryControls.style.display = "none";
                } else {
                    currentGallery = [];
                    currentGalleryIdx = 0;
                    modalImgEl.src = "";
                    modalImgEl.style.display = "none";
                    galleryControls.style.display = "none";
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
