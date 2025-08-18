// Timeline Presentation - Progressive Enhancement
(function() {
    'use strict';
    
    const timelineItems = document.querySelectorAll('.timeline-item');
    const filterButtons = document.querySelectorAll('.filter-btn');
    let isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Intersection Observer for scroll animations
    function initializeScrollAnimations() {
        if (isReducedMotion) {
            // If reduced motion is preferred, make all items visible immediately
            timelineItems.forEach(item => {
                item.classList.add('visible');
            });
            return;
        }
        
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        timelineItems.forEach(item => {
            observer.observe(item);
        });
    }
    
    // Filter functionality
    function initializeFilters() {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Filter timeline items
                filterTimelineItems(filter);
                
                // Announce filter change to screen readers
                announceFilterChange(filter);
            });
            
            // Keyboard support
            button.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });
    }
    
    // Filter timeline items based on tags
    function filterTimelineItems(filter) {
        timelineItems.forEach(item => {
            if (filter === 'all') {
                showTimelineItem(item);
            } else {
                const tags = item.querySelectorAll('.tag');
                let hasMatchingTag = false;
                
                tags.forEach(tag => {
                    if (tag.classList.contains(filter)) {
                        hasMatchingTag = true;
                    }
                });
                
                if (hasMatchingTag) {
                    showTimelineItem(item);
                } else {
                    hideTimelineItem(item);
                }
            }
        });
    }
    
    // Show timeline item with animation
    function showTimelineItem(item) {
        item.classList.remove('hidden');
        
        if (!isReducedMotion) {
            // Add a small delay for staggered animation
            setTimeout(() => {
                item.classList.add('visible');
            }, 100);
        } else {
            item.classList.add('visible');
        }
    }
    
    // Hide timeline item with animation
    function hideTimelineItem(item) {
        if (!isReducedMotion) {
            item.classList.remove('visible');
            setTimeout(() => {
                item.classList.add('hidden');
            }, 300);
        } else {
            item.classList.add('hidden');
        }
    }
    
    // Announce filter changes to screen readers
    function announceFilterChange(filter) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        
        const filterText = filter === 'all' ? 'all items' : `items filtered by ${filter}`;
        announcement.textContent = `Timeline filtered to show ${filterText}`;
        
        document.body.appendChild(announcement);
        
        // Remove after announcement
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }
    
    // Keyboard navigation for timeline
    function initializeKeyboardNavigation() {
        let currentFocus = 0;
        const focusableItems = Array.from(timelineItems).filter(item => 
            !item.classList.contains('hidden')
        );
        
        document.addEventListener('keydown', function(e) {
            // Only handle navigation if focus is on timeline area
            if (!document.querySelector('.timeline-container').contains(document.activeElement)) {
                return;
            }
            
            switch(e.key) {
                case 'ArrowDown':
                case 'ArrowRight':
                    e.preventDefault();
                    navigateTimeline('next');
                    break;
                case 'ArrowUp':
                case 'ArrowLeft':
                    e.preventDefault();
                    navigateTimeline('prev');
                    break;
                case 'Home':
                    e.preventDefault();
                    navigateTimeline('first');
                    break;
                case 'End':
                    e.preventDefault();
                    navigateTimeline('last');
                    break;
            }
        });
        
        function navigateTimeline(direction) {
            const visibleItems = Array.from(timelineItems).filter(item => 
                !item.classList.contains('hidden')
            );
            
            switch(direction) {
                case 'next':
                    currentFocus = Math.min(currentFocus + 1, visibleItems.length - 1);
                    break;
                case 'prev':
                    currentFocus = Math.max(currentFocus - 1, 0);
                    break;
                case 'first':
                    currentFocus = 0;
                    break;
                case 'last':
                    currentFocus = visibleItems.length - 1;
                    break;
            }
            
            if (visibleItems[currentFocus]) {
                visibleItems[currentFocus].scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
                
                // Add focus indicator
                visibleItems.forEach(item => item.classList.remove('keyboard-focus'));
                visibleItems[currentFocus].classList.add('keyboard-focus');
            }
        }
    }
    
    // Add CSS for keyboard focus indicator
    function addKeyboardFocusStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .timeline-item.keyboard-focus .timeline-content {
                outline: 3px solid #667eea;
                outline-offset: 2px;
            }
            
            .sr-only {
                position: absolute;
                width: 1px;
                height: 1px;
                padding: 0;
                margin: -1px;
                overflow: hidden;
                clip: rect(0, 0, 0, 0);
                white-space: nowrap;
                border: 0;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Enhanced scroll progress indicator
    function initializeScrollProgress() {
        const timelineContainer = document.querySelector('.timeline-container');
        const timelineLine = document.querySelector('.timeline-line');
        
        if (!timelineContainer || !timelineLine) return;
        
        function updateScrollProgress() {
            const containerRect = timelineContainer.getBoundingClientRect();
            const scrollTop = window.pageYOffset;
            const windowHeight = window.innerHeight;
            
            // Calculate how much of the timeline is visible
            const timelineTop = containerRect.top + scrollTop;
            const timelineHeight = containerRect.height;
            
            const scrollProgress = Math.max(0, Math.min(1, 
                (scrollTop + windowHeight - timelineTop) / timelineHeight
            ));
            
            // Update timeline line gradient to show progress
            timelineLine.style.background = `linear-gradient(to bottom, 
                #667eea 0%, 
                #667eea ${scrollProgress * 100}%, 
                #e1e5e9 ${scrollProgress * 100}%, 
                #e1e5e9 100%)`;
        }
        
        let ticking = false;
        function handleScroll() {
            if (!ticking) {
                requestAnimationFrame(() => {
                    updateScrollProgress();
                    ticking = false;
                });
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', handleScroll, { passive: true });
        updateScrollProgress(); // Initial call
    }
    
    // Initialize all features
    function initialize() {
        addKeyboardFocusStyles();
        initializeScrollAnimations();
        initializeFilters();
        initializeKeyboardNavigation();
        initializeScrollProgress();
        
        // Add loaded class for CSS enhancements
        document.body.classList.add('timeline-loaded');
        
        // Initial filter application
        filterTimelineItems('all');
    }
    
    // Handle reduced motion preference changes
    const motionMediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    motionMediaQuery.addListener((e) => {
        isReducedMotion = e.matches;
        if (isReducedMotion) {
            timelineItems.forEach(item => {
                item.classList.add('visible');
            });
        }
    });
    
    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();