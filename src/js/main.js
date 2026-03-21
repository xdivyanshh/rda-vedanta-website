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

/* ── PWA Installation ── */
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    // Update UI notify the user they can install the PWA
    const installBtn = document.getElementById('installPwaBtn');
    if (installBtn) {
        installBtn.style.display = 'inline-flex';
        
        installBtn.addEventListener('click', () => {
            // Hide the app provided install promotion
            installBtn.style.display = 'none';
            // Show the install prompt
            deferredPrompt.prompt();
            // Wait for the user to respond to the prompt
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the PWA install prompt');
                } else {
                    console.log('User dismissed the PWA install prompt');
                }
                deferredPrompt = null;
            });
        });
    }
});
