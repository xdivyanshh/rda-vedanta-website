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

    /* ── Theme Toggle Logic ── */
    const themeToggleBtn = document.getElementById('themeToggle');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('rda-theme', newTheme);
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
const installBtn = document.getElementById('installPwaBtn');

window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    // Update UI notify the user they can install the PWA
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

// iOS Manual PWA Prompt Fallback
const isIos = () => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(userAgent);
};
// Detect if running inside the installed PWA
const isInStandaloneMode = () => ('standalone' in window.navigator) && (window.navigator.standalone);

if (isIos() && !isInStandaloneMode()) {
    if (installBtn) {
        installBtn.style.display = 'inline-flex';
        
        installBtn.onclick = () => {
            const iosModal = document.createElement('div');
            iosModal.style.position = 'fixed';
            iosModal.style.bottom = '20px';
            iosModal.style.left = '50%';
            iosModal.style.transform = 'translateX(-50%)';
            iosModal.style.background = 'var(--color-white)';
            iosModal.style.color = 'var(--color-charcoal)';
            iosModal.style.padding = '20px';
            iosModal.style.borderRadius = '12px';
            iosModal.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
            iosModal.style.zIndex = '10000';
            iosModal.style.width = '90%';
            iosModal.style.maxWidth = '350px';
            iosModal.style.border = '1px solid var(--color-border)';
            
            const shareIcon = `<svg style="display:inline; width:16px; transform:translateY(3px); margin:0 4px;" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M336 192L256 112l-80 80M256 112v256"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M192 208v128c0 35.35 28.65 64 64 64h0c35.35 0 64-28.65 64-64V208"/></svg>`;

            iosModal.innerHTML = `
                <h4 style="margin-bottom: 10px; font-family: var(--font-heading); color: var(--brand-red); text-align:center;">Install on iOS</h4>
                <p style="font-size: 0.9rem; margin-bottom: 15px; line-height: 1.5; text-align:center;">To install the RDA Vedanta App on your iPhone/iPad:</p>
                <ol style="text-align: left; font-size: 0.85rem; margin-bottom: 20px; padding-left: 20px; line-height:1.6;">
                    <li style="margin-bottom: 8px;">Tap the <strong>Share</strong> button ${shareIcon} inside Safari.</li>
                    <li>Scroll down and tap <strong>"Add to Home Screen"</strong>.</li>
                </ol>
                <button id="closeIosModal" style="background:var(--brand-red); color:white; border:none; padding:10px 16px; border-radius:6px; cursor:pointer; width:100%; font-weight:bold;">Got it!</button>
            `;
            
            document.body.appendChild(iosModal);
            document.getElementById('closeIosModal').addEventListener('click', () => {
                iosModal.remove();
            });
        };
    }
}
