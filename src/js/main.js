document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mainNav = document.getElementById('mainNav');
    const headerActions = document.getElementById('headerActions');

    if (mobileMenuBtn && mainNav && headerActions) {
        mobileMenuBtn.addEventListener('click', () => {
            mainNav.classList.toggle('nav-active');
            headerActions.classList.toggle('actions-active');

            // Toggle hamburger icon (☰ to ✕)
            if (mainNav.classList.contains('nav-active')) {
                mobileMenuBtn.innerHTML = '&#10005;'; // Close icon
            } else {
                mobileMenuBtn.innerHTML = '&#9776;'; // Hamburger icon
            }
        });
    }
});

/* ── Premium Loading Screen ── */
window.addEventListener('load', () => {
    const loader = document.getElementById('global-loader');
    if (loader) {
        // Start fade out transition
        loader.classList.add('loader-hidden');
        
        // Remove from DOM flow after transition completes
        setTimeout(() => {
            loader.style.display = 'none';
        }, 600); // Wait for the 0.6s CSS transition
    }
});
