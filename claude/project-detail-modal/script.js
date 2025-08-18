// Project Detail Modal - Progressive Enhancement
(function() {
    'use strict';
    
    // Project data
    const projectsData = {
        'digital-installation': {
            title: 'Digital Installation',
            meta: '2024 • Interactive Installation',
            description: '<p>An immersive digital installation that explores the complex relationship between humans and machines in contemporary society. Using motion sensors, computer vision, and generative audio, the piece responds to visitors\' movements and creates unique soundscapes.</p><p>The installation was exhibited at the Museum of Digital Art and received recognition for its innovative use of machine learning in artistic expression. Visitors become collaborators in creating an ever-evolving digital ecosystem.</p>',
            tags: ['Interactive Media', 'Digital Art', 'Human-Computer Interaction', 'Machine Learning'],
            link: '#',
            image: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        },
        'research-publication': {
            title: 'Research Publication',
            meta: '2024 • Academic Research',
            description: '<p>A comprehensive study on computational creativity in collaborative environments, published in the Journal of Creative Technologies. The research investigates how artificial intelligence can enhance rather than replace human creativity.</p><p>The publication includes case studies from various creative domains including music composition, visual art, and interactive design. Findings suggest that human-AI collaboration produces more innovative outcomes than either working independently.</p>',
            tags: ['Computational Creativity', 'AI Research', 'Collaboration', 'Academic Writing'],
            link: '#',
            image: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
        },
        'web-application': {
            title: 'Web Application',
            meta: '2023 • Software Development',
            description: '<p>A collaborative platform for music composition that enables multiple users to create musical pieces together in real-time. Built with modern web technologies including WebRTC for real-time communication and Web Audio API for synthesis.</p><p>The application features an intuitive interface for both musicians and non-musicians, with AI-assisted harmony suggestions and rhythm generation. Used by over 500 musicians worldwide for collaborative compositions.</p>',
            tags: ['Web Development', 'Music Technology', 'Real-time Collaboration', 'WebRTC'],
            link: '#',
            image: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
        },
        'sound-performance': {
            title: 'Sound Performance',
            meta: '2023 • Live Performance',
            description: '<p>A live coding performance that explores algorithmic composition through real-time programming. The performance combines traditional musical elements with computational processes, creating unique sonic experiences.</p><p>Performed at the International Computer Music Conference and featured in several avant-garde music festivals. The piece challenges traditional notions of musical performance by making the programming process itself part of the artistic expression.</p>',
            tags: ['Live Coding', 'Algorithmic Composition', 'Performance', 'Sound Art'],
            link: '#',
            image: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
        }
    };
    
    // DOM elements
    const modalOverlay = document.getElementById('modalOverlay');
    const modalContent = modalOverlay.querySelector('.modal-content');
    const modalClose = modalOverlay.querySelector('.modal-close');
    const modalTitle = document.getElementById('modalTitle');
    const modalMeta = document.getElementById('modalMeta');
    const modalDescription = document.getElementById('modalDescription');
    const modalTags = document.getElementById('modalTags');
    const modalImage = document.getElementById('modalImage');
    const modalLink = document.getElementById('modalLink');
    const prevBtn = document.getElementById('prevProject');
    const nextBtn = document.getElementById('nextProject');
    const projectCards = document.querySelectorAll('.project-card');
    
    let currentProjectIndex = 0;
    let projectKeys = Object.keys(projectsData);
    let focusedElementBeforeModal;
    
    // Open modal with project data
    function openModal(projectKey) {
        const project = projectsData[projectKey];
        if (!project) return;
        
        // Store the currently focused element
        focusedElementBeforeModal = document.activeElement;
        
        // Update modal content
        modalTitle.textContent = project.title;
        modalMeta.textContent = project.meta;
        modalDescription.innerHTML = project.description;
        modalImage.style.background = project.image;
        modalLink.href = project.link;
        
        // Update tags
        modalTags.innerHTML = project.tags.map(tag => 
            `<span class="tag">${tag}</span>`
        ).join('');
        
        // Update current project index
        currentProjectIndex = projectKeys.indexOf(projectKey);
        updateNavigationButtons();
        
        // Show modal
        modalOverlay.classList.add('active');
        modalOverlay.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
        
        // Focus management
        setTimeout(() => {
            modalClose.focus();
        }, 300);
    }
    
    // Close modal
    function closeModal() {
        modalOverlay.classList.remove('active');
        modalOverlay.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');
        
        // Restore focus to the element that opened the modal
        if (focusedElementBeforeModal) {
            focusedElementBeforeModal.focus();
        }
    }
    
    // Navigate to previous/next project
    function navigateProject(direction) {
        const newIndex = direction === 'next' 
            ? (currentProjectIndex + 1) % projectKeys.length
            : (currentProjectIndex - 1 + projectKeys.length) % projectKeys.length;
        
        const newProjectKey = projectKeys[newIndex];
        openModal(newProjectKey);
    }
    
    // Update navigation button states
    function updateNavigationButtons() {
        // In this implementation, we loop through projects, so buttons are always enabled
        // In a linear navigation, you might disable buttons at the ends
        prevBtn.disabled = false;
        nextBtn.disabled = false;
        
        // Update aria-labels with project names
        const prevIndex = (currentProjectIndex - 1 + projectKeys.length) % projectKeys.length;
        const nextIndex = (currentProjectIndex + 1) % projectKeys.length;
        
        prevBtn.setAttribute('aria-label', `Previous project: ${projectsData[projectKeys[prevIndex]].title}`);
        nextBtn.setAttribute('aria-label', `Next project: ${projectsData[projectKeys[nextIndex]].title}`);
    }
    
    // Keyboard navigation
    function handleKeyDown(e) {
        if (!modalOverlay.classList.contains('active')) return;
        
        switch(e.key) {
            case 'Escape':
                e.preventDefault();
                closeModal();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                navigateProject('prev');
                break;
            case 'ArrowRight':
                e.preventDefault();
                navigateProject('next');
                break;
            case 'Tab':
                // Trap focus within modal
                trapFocus(e);
                break;
        }
    }
    
    // Focus trapping for accessibility
    function trapFocus(e) {
        const focusableElements = modalContent.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey && document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable.focus();
        } else if (!e.shiftKey && document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable.focus();
        }
    }
    
    // Share functionality
    function shareProject() {
        const project = projectsData[projectKeys[currentProjectIndex]];
        
        if (navigator.share) {
            navigator.share({
                title: project.title,
                text: project.meta,
                url: window.location.href
            }).catch(err => console.log('Error sharing:', err));
        } else {
            // Fallback: copy to clipboard
            const shareText = `${project.title} - ${project.meta}`;
            navigator.clipboard.writeText(shareText).then(() => {
                // Show temporary feedback
                const shareBtn = document.getElementById('modalShare');
                const originalText = shareBtn.textContent;
                shareBtn.textContent = 'Copied!';
                setTimeout(() => {
                    shareBtn.textContent = originalText;
                }, 2000);
            }).catch(err => {
                console.log('Could not copy text:', err);
            });
        }
    }
    
    // Initialize event listeners
    function initialize() {
        // Project card click handlers
        projectCards.forEach(card => {
            const button = card.querySelector('.view-project-btn');
            const projectKey = card.getAttribute('data-project');
            
            button.addEventListener('click', (e) => {
                e.preventDefault();
                openModal(projectKey);
            });
            
            // Allow clicking the entire card
            card.addEventListener('click', (e) => {
                if (e.target === button) return; // Don't double-trigger
                openModal(projectKey);
            });
            
            // Keyboard support for cards
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openModal(projectKey);
                }
            });
            
            // Make cards focusable
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
        });
        
        // Modal close handlers
        modalClose.addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
        
        // Navigation handlers
        prevBtn.addEventListener('click', () => navigateProject('prev'));
        nextBtn.addEventListener('click', () => navigateProject('next'));
        
        // Share button
        document.getElementById('modalShare').addEventListener('click', shareProject);
        
        // Global keyboard handler
        document.addEventListener('keydown', handleKeyDown);
        
        // Prevent background scrolling when modal is open
        modalOverlay.addEventListener('wheel', (e) => {
            if (modalOverlay.classList.contains('active')) {
                e.preventDefault();
            }
        }, { passive: false });
    }
    
    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();