// Minimal Portfolio Grid - Progressive Enhancement
(function() {
    'use strict';
    
    // Add keyboard navigation for project cards
    function initializeKeyboardNavigation() {
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach(card => {
            card.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    // In a real implementation, this would navigate to project detail
                    console.log('Opening project:', card.getAttribute('aria-label'));
                    
                    // Visual feedback
                    card.style.transform = 'scale(0.98)';
                    setTimeout(() => {
                        card.style.transform = '';
                    }, 150);
                }
            });
            
            // Click handler for mouse users
            card.addEventListener('click', function() {
                console.log('Opening project:', card.getAttribute('aria-label'));
            });
        });
    }
    
    // Smooth scroll for navigation links
    function initializeSmoothScroll() {
        const navLinks = document.querySelectorAll('nav a[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initializeKeyboardNavigation();
            initializeSmoothScroll();
        });
    } else {
        initializeKeyboardNavigation();
        initializeSmoothScroll();
    }
})();