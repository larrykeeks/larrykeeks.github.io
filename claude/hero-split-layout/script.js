// Hero Split Layout - Progressive Enhancement
(function() {
    'use strict';
    
    // Intersection Observer for scroll-triggered animations
    function initializeScrollAnimations() {
        // Only add animations if user hasn't requested reduced motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                } else {
                    entry.target.style.animationPlayState = 'paused';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -10% 0px'
        });
        
        // Observe hero sections
        const heroSections = document.querySelectorAll('.hero-split');
        heroSections.forEach(section => {
            observer.observe(section);
        });
    }
    
    // Smooth scroll for navigation links
    function initializeSmoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
    
    // Enhanced keyboard navigation for buttons
    function initializeKeyboardNavigation() {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            // Add keyboard interaction feedback
            button.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.style.transform = 'translateY(0px) scale(0.98)';
                    
                    // Restore transform after a short delay
                    setTimeout(() => {
                        this.style.transform = '';
                    }, 150);
                    
                    // Trigger click if it's a space bar press
                    if (e.key === ' ') {
                        this.click();
                    }
                }
            });
            
            // Handle focus states
            button.addEventListener('focus', function() {
                this.style.outline = '3px solid rgba(102, 126, 234, 0.3)';
                this.style.outlineOffset = '2px';
            });
            
            button.addEventListener('blur', function() {
                this.style.outline = '';
                this.style.outlineOffset = '';
            });
        });
    }
    
    // Parallax effect for images (subtle and respecting motion preferences)
    function initializeParallax() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }
        
        const images = document.querySelectorAll('.image-container');
        let ticking = false;
        
        function updateParallax() {
            const scrollY = window.pageYOffset;
            
            images.forEach(image => {
                const rect = image.getBoundingClientRect();
                const speed = 0.5;
                const yPos = -(scrollY * speed);
                
                // Only apply if element is in viewport
                if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
                    image.style.transform = `translateY(${yPos * 0.1}px)`;
                }
            });
            
            ticking = false;
        }
        
        function requestParallax() {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', requestParallax, { passive: true });
    }
    
    // Loading state management
    function initializeLoadingStates() {
        // Add loaded class when images would be ready
        const images = document.querySelectorAll('.placeholder-image');
        
        images.forEach((image, index) => {
            // Simulate loading delay for demo purposes
            setTimeout(() => {
                image.style.opacity = '1';
                image.style.transform = 'scale(1)';
            }, index * 200);
        });
    }
    
    // Initialize all features
    function initialize() {
        initializeScrollAnimations();
        initializeSmoothScroll();
        initializeKeyboardNavigation();
        initializeParallax();
        initializeLoadingStates();
        
        // Add loaded class to body for any CSS-based enhancements
        document.body.classList.add('js-loaded');
    }
    
    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
    
    // Handle resize events
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Recalculate any position-dependent features
            console.log('Layout adjusted for new viewport size');
        }, 250);
    });
})();