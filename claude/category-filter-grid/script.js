/* Category Filter Grid Pattern JavaScript
   Filtering and organizing projects by categories
   Common pattern across portfolio sites */

class CategoryFilter {
    constructor() {
        this.currentFilter = 'all';
        this.projects = [];
        this.init();
    }

    init() {
        // Cache DOM elements
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.projectCards = document.querySelectorAll('.project-card');
        this.resultCount = document.getElementById('resultCount');
        this.projectsGrid = document.getElementById('projectsGrid');
        
        // Build projects data
        this.buildProjectsData();
        
        // Set up event listeners
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilterClick(e));
        });
        
        // Keyboard shortcuts for filtering
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
        
        // Initialize display
        this.updateDisplay();
    }

    buildProjectsData() {
        this.projects = Array.from(this.projectCards).map(card => {
            const categories = card.dataset.categories ? card.dataset.categories.split(' ') : [];
            const title = card.querySelector('h3').textContent;
            return {
                element: card,
                categories: categories,
                title: title
            };
        });
    }

    handleFilterClick(e) {
        const category = e.currentTarget.dataset.category;
        this.setFilter(category);
    }

    handleKeyboardShortcuts(e) {
        // Number keys 1-6 for quick filtering
        const keyMap = {
            '1': 'all',
            '2': 'interactive',
            '3': 'research',
            '4': 'software',
            '5': 'performance',
            '6': 'teaching'
        };
        
        if (e.altKey && keyMap[e.key]) {
            e.preventDefault();
            this.setFilter(keyMap[e.key]);
        }
    }

    setFilter(category) {
        if (category === this.currentFilter) return;
        
        this.currentFilter = category;
        this.updateButtons();
        this.updateDisplay();
        this.announceFilterChange(category);
    }

    updateButtons() {
        this.filterButtons.forEach(btn => {
            const isActive = btn.dataset.category === this.currentFilter;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-pressed', isActive.toString());
        });
    }

    updateDisplay() {
        let visibleCount = 0;
        
        this.projects.forEach(project => {
            const shouldShow = this.currentFilter === 'all' || 
                             project.categories.includes(this.currentFilter);
            
            if (shouldShow) {
                project.element.classList.remove('hidden');
                visibleCount++;
            } else {
                project.element.classList.add('hidden');
            }
        });
        
        this.updateCount(visibleCount);
        this.handleEmptyState(visibleCount);
    }

    updateCount(count) {
        if (this.resultCount) {
            this.resultCount.textContent = count;
        }
    }

    handleEmptyState(count) {
        // Remove any existing empty state
        const existingEmpty = this.projectsGrid.querySelector('.empty-state');
        if (existingEmpty) {
            existingEmpty.remove();
        }

        // Add empty state if no projects visible
        if (count === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.innerHTML = `
                <h3>No projects found</h3>
                <p>Try selecting a different category to see more projects.</p>
            `;
            this.projectsGrid.appendChild(emptyState);
        }
    }

    announceFilterChange(category) {
        // Announce filter change to screen readers
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.className = 'sr-only';
        
        const categoryNames = {
            'all': 'all projects',
            'interactive': 'interactive media projects',
            'research': 'research projects',
            'software': 'software projects',
            'performance': 'performance projects',
            'teaching': 'teaching projects'
        };
        
        announcement.textContent = `Now showing ${categoryNames[category]}`;
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            if (document.body.contains(announcement)) {
                document.body.removeChild(announcement);
            }
        }, 1000);
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
    new CategoryFilter();
});

// Progressive enhancement - works without JavaScript
// Projects remain visible and accessible via CSS grid