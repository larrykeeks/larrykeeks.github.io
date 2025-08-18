/* Dark Theme Toggle Pattern JavaScript
   Theme switching with system preference detection and persistence
   Based on patterns from technical portfolios in corpus */

class ThemeManager {
    constructor() {
        this.storageKey = 'theme-preference';
        this.themes = ['light', 'dark', 'auto'];
        this.currentTheme = this.getStoredTheme() || 'auto';
        this.init();
    }

    init() {
        // Apply initial theme
        this.applyTheme(this.currentTheme);
        
        // Set up toggle button
        const toggleBtn = document.querySelector('.theme-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.cycleTheme());
            
            // Keyboard shortcut (Ctrl/Cmd + Shift + L)
            document.addEventListener('keydown', (e) => {
                if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'L') {
                    e.preventDefault();
                    this.cycleTheme();
                }
            });
        }

        // Listen for system theme changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addListener(() => {
            if (this.currentTheme === 'auto') {
                this.updateThemeDisplay();
            }
        });
    }

    cycleTheme() {
        // Cycle through: auto -> light -> dark -> auto
        const currentIndex = this.themes.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % this.themes.length;
        this.currentTheme = this.themes[nextIndex];
        
        this.applyTheme(this.currentTheme);
        this.storeTheme(this.currentTheme);
        this.announceThemeChange();
    }

    applyTheme(theme) {
        // Remove existing theme attributes
        document.documentElement.removeAttribute('data-theme');
        
        if (theme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
        } else if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            // Auto theme - let CSS media queries handle it
            // No data-theme attribute means CSS prefers-color-scheme will take effect
        }
        
        this.updateThemeDisplay();
    }

    updateThemeDisplay() {
        const toggleBtn = document.querySelector('.theme-toggle');
        if (!toggleBtn) return;

        // Determine effective theme for display
        let effectiveTheme = this.currentTheme;
        if (this.currentTheme === 'auto') {
            effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }

        // Update button title with current state
        const themeNames = {
            'auto': 'auto (follows system)',
            'light': 'light mode',
            'dark': 'dark mode'
        };
        
        toggleBtn.title = `Current: ${themeNames[this.currentTheme]} (effective: ${effectiveTheme}). Click to cycle.`;
        
        // Update button text to show current state
        const stateText = toggleBtn.querySelector('.theme-state') || this.createStateText();
        stateText.textContent = this.currentTheme.toUpperCase();
        
        // Update icon visibility based on effective theme
        const lightIcon = toggleBtn.querySelector('.light-icon');
        const darkIcon = toggleBtn.querySelector('.dark-icon');
        
        if (effectiveTheme === 'dark') {
            lightIcon.style.opacity = '0';
            darkIcon.style.opacity = '1';
        } else {
            lightIcon.style.opacity = '1';
            darkIcon.style.opacity = '0';
        }
    }

    getStoredTheme() {
        try {
            return localStorage.getItem(this.storageKey);
        } catch (e) {
            // localStorage might not be available
            return null;
        }
    }

    storeTheme(theme) {
        try {
            localStorage.setItem(this.storageKey, theme);
        } catch (e) {
            // localStorage might not be available
        }
    }

    announceThemeChange() {
        // Announce theme change to screen readers
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.className = 'sr-only';
        
        const themeNames = {
            'auto': 'automatic theme (follows system preference)',
            'light': 'light theme',
            'dark': 'dark theme'
        };
        
        announcement.textContent = `Switched to ${themeNames[this.currentTheme]}`;
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            if (document.body.contains(announcement)) {
                document.body.removeChild(announcement);
            }
        }, 1000);
    }

    createStateText() {
        const toggleBtn = document.querySelector('.theme-toggle');
        if (!toggleBtn) return null;
        
        const stateText = document.createElement('span');
        stateText.className = 'theme-state';
        stateText.setAttribute('aria-hidden', 'true');
        toggleBtn.appendChild(stateText);
        return stateText;
    }
}

// Screen reader only utility class
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

// Initialize theme manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
});

// Progressive enhancement - works without JavaScript
// Defaults to system preference via CSS prefers-color-scheme