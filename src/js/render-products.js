document.addEventListener('DOMContentLoaded', async () => {
    const track = document.getElementById('bentoGrid');
    const prevBtn = document.getElementById('carouselPrevBtn');
    const nextBtn = document.getElementById('carouselNextBtn');
    if (!track) return;

    try {
        const res = await fetch('/src/data/products.json');
        const categories = await res.json();

        // Build the card HTML
        const buildCard = (c) => `
            <a href="${c.href || '#'}" class="carousel-item" style="text-decoration:none;">
                <div class="carousel-image-box">
                    <img src="${c.image}" alt="${c.title}" loading="lazy">
                </div>
                <h3>${c.title}</h3>
            </a>`;

        // Triple the items for infinite illusion (prev-set | real-set | next-set)
        const html = categories.map(buildCard).join('');
        track.innerHTML = html + html + html;

        if (window.updateDOM) window.updateDOM();

        // Calculate sizes
        const gap = 20;
        const totalOriginal = categories.length;
        let itemWidth = track.querySelector('.carousel-item').offsetWidth + gap;
        let currentIndex = totalOriginal; // Start at the beginning of the middle set

        // Jump to the middle set instantly (no transition)
        track.style.transition = 'none';
        track.style.transform = `translateX(-${currentIndex * itemWidth}px)`;

        // Force reflow before re-enabling transitions
        track.offsetHeight;
        track.style.transition = 'transform 0.5s ease';

        let isAnimating = false;
        let animationSafetyTimer;

        const slide = (direction) => {
            if (isAnimating) return;
            isAnimating = true;
            currentIndex += direction;
            track.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
            
            // Safety fallback in case transitionend does not fire (e.g. due to resize)
            clearTimeout(animationSafetyTimer);
            animationSafetyTimer = setTimeout(() => {
                isAnimating = false;
            }, 600);
        };

        // Auto-scroll logic
        let autoScrollInterval;
        const startAutoScroll = () => {
            autoScrollInterval = setInterval(() => {
                slide(1);
            }, 3000); // 3 seconds interval
        };
        const resetAutoScroll = () => {
            clearInterval(autoScrollInterval);
            startAutoScroll();
        };

        // Start initially
        startAutoScroll();

        // After each transition ends, silently jump if we've gone past the boundaries
        track.addEventListener('transitionend', () => {
            isAnimating = false;
            // If scrolled past the end of the middle set, jump back to middle
            if (currentIndex >= totalOriginal * 2) {
                track.style.transition = 'none';
                currentIndex -= totalOriginal;
                track.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
                track.offsetHeight;
                track.style.transition = 'transform 0.5s ease';
            }
            // If scrolled before the start of the middle set, jump forward to middle
            if (currentIndex < totalOriginal) {
                track.style.transition = 'none';
                currentIndex += totalOriginal;
                track.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
                track.offsetHeight;
                track.style.transition = 'transform 0.5s ease';
            }
        });

        if (prevBtn) prevBtn.addEventListener('click', () => {
            slide(-1);
            resetAutoScroll();
        });
        if (nextBtn) nextBtn.addEventListener('click', () => {
            slide(1);
            resetAutoScroll();
        });

        // Recalculate on resize
        window.addEventListener('resize', () => {
            itemWidth = track.querySelector('.carousel-item').offsetWidth + gap;
            track.style.transition = 'none';
            track.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
            track.offsetHeight;
            track.style.transition = 'transform 0.5s ease';
        });

    } catch (err) {
        console.error('Failed to load products:', err);
        track.innerHTML = '<p style="text-align:center;color:#999;">Could not load categories.</p>';
    }
});
