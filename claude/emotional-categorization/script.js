/* Emotional Categorization Pattern JavaScript
   Filtering and organizing projects by emotional themes
   Inspired by Aaron Demby Jones (Studio Demby) innovation */

class EmotionalFilter {
    constructor() {
        this.currentFilter = 'all';
        this.projects = [];
        this.init();
    }

    init() {
        // Cache DOM elements
        this.filterButtons = document.querySelectorAll('.emotion-btn');
        this.projectCards = document.querySelectorAll('.project-card');
        this.countDisplay = document.getElementById('count-display');
        
        // Build projects data
        this.buildProjectsData();
        
        // Set up event listeners
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilterClick(e));
        });
        
        // Keyboard shortcuts for quick filtering
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
        
        // Initialize display
        this.updateDisplay();
    }

    buildProjectsData() {
        this.projects = Array.from(this.projectCards).map(card => {
            const emotions = card.dataset.emotions ? card.dataset.emotions.split(' ') : [];
            const title = card.querySelector('h3').textContent;
            return {
                element: card,
                emotions: emotions,
                title: title
            };
        });
    }

    handleFilterClick(e) {
        const emotion = e.currentTarget.dataset.emotion;
        this.setFilter(emotion);
    }

    handleKeyboardShortcuts(e) {
        // Number keys 1-6 for quick filtering
        const keyMap = {
            '1': 'all',
            '2': 'resonant', 
            '3': 'contemplative',
            '4': 'energetic',
            '5': 'melancholic',
            '6': 'playful'
        };
        
        if (e.altKey && keyMap[e.key]) {
            e.preventDefault();
            this.setFilter(keyMap[e.key]);
        }
    }

    setFilter(emotion) {
        if (emotion === this.currentFilter) return;
        
        this.currentFilter = emotion;
        this.updateButtons();
        this.updateDisplay();
        this.announceFilterChange(emotion);
    }

    updateButtons() {
        this.filterButtons.forEach(btn => {
            const isActive = btn.dataset.emotion === this.currentFilter;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-pressed', isActive.toString());
        });
    }

    updateDisplay() {
        let visibleCount = 0;
        
        this.projects.forEach(project => {
            const shouldShow = this.currentFilter === 'all' || 
                             project.emotions.includes(this.currentFilter);
            
            if (shouldShow) {
                project.element.classList.remove('hidden');
                visibleCount++;
            } else {
                project.element.classList.add('hidden');
            }
        });
        
        this.updateCount(visibleCount);
    }

    updateCount(count) {
        const projectText = count === 1 ? 'project' : 'projects';
        const emotionText = this.currentFilter === 'all' ? '' : ` (${this.currentFilter})`;
        this.countDisplay.textContent = `${count} ${projectText}${emotionText}`;
    }

    announceFilterChange(emotion) {
        // Announce filter change to screen readers
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.className = 'sr-only';
        
        const emotionNames = {
            'all': 'all projects',
            'resonant': 'resonant projects',
            'contemplative': 'contemplative projects', 
            'energetic': 'energetic projects',
            'melancholic': 'melancholic projects',
            'playful': 'playful projects'
        };
        
        announcement.textContent = `Now showing ${emotionNames[emotion]}`;
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
    new EmotionalFilter();
});

// Progressive enhancement - works without JavaScript
// Projects are visible by default, filtering gracefully degrades