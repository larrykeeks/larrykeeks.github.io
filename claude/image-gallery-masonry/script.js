/* Image Gallery Masonry Pattern JavaScript
   Pinterest-style masonry grid with filtering and view options
   Common pattern in visual portfolio sites */

class MasonryGallery {
    constructor() {
        this.currentFilter = 'all';
        this.currentView = 'masonry';
        this.galleryItems = [];
        this.init();
    }

    init() {
        // Cache DOM elements
        this.galleryGrid = document.getElementById('gallery-grid');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.viewButtons = document.querySelectorAll('.view-btn');
        this.galleryItems = Array.from(document.querySelectorAll('.gallery-item'));

        if (!this.galleryGrid) return;

        // Set up event listeners
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilterClick(e));
        });

        this.viewButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleViewClick(e));
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));

        // Initialize display
        this.updateDisplay();
        
        // Handle window resize for masonry adjustment
        window.addEventListener('resize', () => this.debounce(() => this.adjustMasonry(), 250));
        
        // Initial masonry setup
        setTimeout(() => this.adjustMasonry(), 100);
    }

    handleFilterClick(e) {
        const filter = e.currentTarget.dataset.filter;
        this.setFilter(filter);
    }

    handleViewClick(e) {
        const view = e.currentTarget.dataset.view;
        this.setView(view);
    }

    handleKeyboardShortcuts(e) {
        // Number keys for quick filtering
        const filterMap = {
            '1': 'all',
            '2': 'photography',
            '3': 'digital',
            '4': 'installation',
            '5': 'print'
        };

        // View switching with 'v' key
        if (e.key === 'v' && e.altKey) {
            e.preventDefault();
            const newView = this.currentView === 'masonry' ? 'grid' : 'masonry';
            this.setView(newView);
        }

        if (e.altKey && filterMap[e.key]) {
            e.preventDefault();
            this.setFilter(filterMap[e.key]);
        }
    }

    setFilter(filter) {
        if (filter === this.currentFilter) return;
        
        this.currentFilter = filter;
        this.updateFilterButtons();
        this.updateDisplay();
        this.announceFilterChange(filter);
    }

    setView(view) {
        if (view === this.currentView) return;
        
        this.currentView = view;
        this.updateViewButtons();
        this.updateViewLayout();
        this.announceViewChange(view);
    }

    updateFilterButtons() {
        this.filterButtons.forEach(btn => {
            const isActive = btn.dataset.filter === this.currentFilter;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-pressed', isActive.toString());
        });
    }

    updateViewButtons() {
        this.viewButtons.forEach(btn => {
            const isActive = btn.dataset.view === this.currentView;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-pressed', isActive.toString());
        });
    }

    updateViewLayout() {
        // Toggle between masonry and uniform grid
        this.galleryGrid.className = `gallery-grid ${this.currentView}`;
        
        if (this.currentView === 'masonry') {
            setTimeout(() => this.adjustMasonry(), 50);
        }
    }

    updateDisplay() {
        let visibleCount = 0;
        
        this.galleryItems.forEach(item => {
            const categories = item.dataset.category ? item.dataset.category.split(' ') : [];
            const shouldShow = this.currentFilter === 'all' || categories.includes(this.currentFilter);
            
            if (shouldShow) {
                item.classList.remove('hidden');
                visibleCount++;
            } else {
                item.classList.add('hidden');
            }
        });

        // Update masonry layout after filtering
        if (this.currentView === 'masonry') {
            setTimeout(() => this.adjustMasonry(), 300);
        }
        
        return visibleCount;
    }

    adjustMasonry() {
        // Simple CSS Grid masonry approximation
        if (this.currentView !== 'masonry') return;
        
        const visibleItems = this.galleryItems.filter(item => !item.classList.contains('hidden'));
        
        // Reset any previous positioning
        visibleItems.forEach(item => {
            item.style.gridRowEnd = 'auto';
        });

        // Calculate optimal row spans based on content height
        setTimeout(() => {
            visibleItems.forEach(item => {
                const itemHeight = item.getBoundingClientRect().height;
                const rowHeight = parseInt(window.getComputedStyle(this.galleryGrid).gridAutoRows) || 10;
                const rowSpan = Math.ceil((itemHeight + 24) / (rowHeight + 24)); // 24px gap
                item.style.gridRowEnd = `span ${rowSpan}`;
            });
        }, 10);
    }

    announceFilterChange(filter) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.className = 'sr-only';
        
        const filterNames = {
            'all': 'all work',
            'photography': 'photography',
            'digital': 'digital art',
            'installation': 'installations',
            'print': 'print design'
        };
        
        announcement.textContent = `Now showing ${filterNames[filter]}`;
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            if (document.body.contains(announcement)) {
                document.body.removeChild(announcement);
            }
        }, 1000);
    }

    announceViewChange(view) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.className = 'sr-only';
        announcement.textContent = `Switched to ${view} view`;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            if (document.body.contains(announcement)) {
                document.body.removeChild(announcement);
            }
        }, 1000);
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Screen reader utility
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
    new MasonryGallery();
});

// Progressive enhancement - works without JavaScript
// Items remain visible and accessible via pure CSS grid