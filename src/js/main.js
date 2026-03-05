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
