/* Hamburger Menu Pattern JavaScript
   Mobile-first navigation with accessible menu management
   Common pattern across responsive portfolio sites */

class HamburgerMenu {
    constructor() {
        this.isOpen = false;
        this.init();
    }

    init() {
        // Cache DOM elements
        this.menuToggle = document.querySelector('.menu-toggle');
        this.mainNav = document.querySelector('.main-nav');
        this.menuOverlay = document.querySelector('.menu-overlay');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.body = document.body;

        if (!this.menuToggle || !this.mainNav) return;

        // Set up event listeners
        this.menuToggle.addEventListener('click', () => this.toggleMenu());
        this.menuOverlay.addEventListener('click', () => this.closeMenu());

        // Close menu when clicking nav links
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });

        // Keyboard event handlers
        document.addEventListener('keydown', (e) => this.handleKeydown(e));

        // Close menu on window resize to desktop
        window.addEventListener('resize', () => this.handleResize());

        // Focus management
        this.setupFocusManagement();
    }

    toggleMenu() {
        if (this.isOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    openMenu() {
        this.isOpen = true;
        this.updateMenuState();
        this.trapFocus();
        this.announceMenuState();
    }

    closeMenu() {
        this.isOpen = false;
        this.updateMenuState();
        this.releaseFocus();
        this.announceMenuState();
    }

    updateMenuState() {
        // Update ARIA attributes
        this.menuToggle.setAttribute('aria-expanded', this.isOpen.toString());
        this.menuOverlay.setAttribute('aria-hidden', (!this.isOpen).toString());

        // Update CSS classes
        this.mainNav.classList.toggle('open', this.isOpen);
        this.menuOverlay.classList.toggle('active', this.isOpen);

        // Prevent body scroll when menu is open
        this.body.style.overflow = this.isOpen ? 'hidden' : '';
    }

    setupFocusManagement() {
        // Get all focusable elements in the nav
        this.focusableElements = this.mainNav.querySelectorAll(
            'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        
        if (this.focusableElements.length > 0) {
            this.firstFocusable = this.focusableElements[0];
            this.lastFocusable = this.focusableElements[this.focusableElements.length - 1];
        }
    }

    trapFocus() {
        // Focus first nav link when menu opens
        if (this.firstFocusable) {
            this.firstFocusable.focus();
        }
    }

    releaseFocus() {
        // Return focus to menu toggle button
        this.menuToggle.focus();
    }

    handleKeydown(e) {
        if (!this.isOpen) return;

        switch (e.key) {
            case 'Escape':
                e.preventDefault();
                this.closeMenu();
                break;
                
            case 'Tab':
                this.handleTabNavigation(e);
                break;
        }
    }

    handleTabNavigation(e) {
        if (!this.focusableElements.length) return;

        if (e.shiftKey) {
            // Shift + Tab (backwards)
            if (document.activeElement === this.firstFocusable) {
                e.preventDefault();
                this.lastFocusable.focus();
            }
        } else {
            // Tab (forwards)
            if (document.activeElement === this.lastFocusable) {
                e.preventDefault();
                this.firstFocusable.focus();
            }
        }
    }

    handleResize() {
        // Close menu when resizing to desktop view
        if (window.innerWidth > 768 && this.isOpen) {
            this.closeMenu();
        }
    }

    announceMenuState() {
        // Announce menu state change to screen readers
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.className = 'sr-only';
        announcement.textContent = this.isOpen ? 'Menu opened' : 'Menu closed';
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            if (document.body.contains(announcement)) {
                document.body.removeChild(announcement);
            }
        }, 1000);
    }
}

// Screen reader utility class
const style = document.createElement('style');
style.textContent = `
    .sr-only {
        position: absolute !important;
        width: 1px !important;
        height: 1px !important;
        padding: 0 !important;
        margin: -1px !important;
        overflow: hidden !important;
        clip: rect(0, 0, 0, 0) !important;
        white-space: nowrap !important;
        border: 0 !important;
    }
`;
document.head.appendChild(style);

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new HamburgerMenu();
});

// Progressive enhancement - works without JavaScript
// Menu remains accessible via basic navigation fallback