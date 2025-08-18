// Sticky Navigation - Progressive Enhancement
(function() {
    'use strict';
    
    const header = document.getElementById('header');
    const scrollProgress = document.getElementById('scrollProgress');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    let ticking = false;
    
    // Update scroll progress indicator
    function updateScrollProgress() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = scrollTop / docHeight;
        
        scrollProgress.style.transform = `scaleX(${Math.min(scrollPercent, 1)})`;
    }
    
    // Add scrolled class to header for styling
    function updateHeaderState() {
        const scrollTop = window.pageYOffset;
        
        if (scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    // Highlight active section in navigation
    function updateActiveSection() {
        const scrollTop = window.pageYOffset;
        const scrollOffset = 100; // Offset for header height
        
        let activeSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - scrollOffset;
            const sectionHeight = section.offsetHeight;
            
            if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
                activeSection = section.getAttribute('id');
            }
        });
        
        // Update active nav link
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${activeSection}`) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    // Throttled scroll handler
    function handleScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateScrollProgress();
                updateHeaderState();
                updateActiveSection();
                ticking = false;
            });
            ticking = true;
        }
    }
    
    // Smooth scroll for navigation links
    function initializeSmoothScroll() {
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerHeight = header.offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // Keyboard navigation improvements
    function initializeKeyboardNavigation() {
        // Skip to main content link (invisible but accessible)
        const skipLink = document.createElement('a');
        skipLink.href = '#main';
        skipLink.textContent = 'Skip to main content';
        skipLink.style.cssText = `
            position: absolute;
            left: -9999px;
            z-index: 1000;
            padding: 8px;
            background: #000;
            color: #fff;
            text-decoration: none;
        `;
        skipLink.addEventListener('focus', function() {
            this.style.left = '0';
        });
        skipLink.addEventListener('blur', function() {
            this.style.left = '-9999px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
        
        // Improve focus management for nav links
        navLinks.forEach((link, index) => {
            link.addEventListener('keydown', function(e) {
                let targetIndex;
                
                switch(e.key) {
                    case 'ArrowLeft':
                        e.preventDefault();
                        targetIndex = index > 0 ? index - 1 : navLinks.length - 1;
                        navLinks[targetIndex].focus();
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        targetIndex = index < navLinks.length - 1 ? index + 1 : 0;
                        navLinks[targetIndex].focus();
                        break;
                    case 'Home':
                        e.preventDefault();
                        navLinks[0].focus();
                        break;
                    case 'End':
                        e.preventDefault();
                        navLinks[navLinks.length - 1].focus();
                        break;
                }
            });
        });
    }
    
    // Initialize everything when DOM is ready
    function initialize() {
        // Set initial state
        updateScrollProgress();
        updateHeaderState();
        updateActiveSection();
        
        // Add event listeners
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleScroll, { passive: true });
        
        // Initialize features
        initializeSmoothScroll();
        initializeKeyboardNavigation();
    }
    
    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();