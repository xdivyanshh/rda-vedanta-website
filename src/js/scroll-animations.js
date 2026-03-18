document.addEventListener('DOMContentLoaded', () => {
    const revealElements = document.querySelectorAll('.reveal');
    if (!revealElements.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => observer.observe(el));

    // Re-observe dynamically added elements (from renderers)
    const grids = document.querySelectorAll('#bentoGrid, #catalogueGrid, #downloadGrid');
    grids.forEach(grid => {
        const mutationObserver = new MutationObserver(() => {
            grid.querySelectorAll('.reveal:not(.revealed)').forEach(el => {
                // If element is already in viewport upon dynamic insertion, reveal immediately
                if (el.getBoundingClientRect().top < window.innerHeight) {
                    // Small timeout to allow CSS to paint initial state before applying transition
                    setTimeout(() => {
                        el.classList.add('revealed');
                    }, 50);
                } else {
                    observer.observe(el);
                }
            });
        });
        mutationObserver.observe(grid, { childList: true });
    });
});
