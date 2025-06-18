// Portfolio website JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initMobileNavigation();
    initSmoothScrolling();
    initBlogSearch();
    initContactForm();
    initResumeDownload();
    initScrollAnimations();
    initBlogPostInteractions();
});

// Mobile Navigation Toggle
function initMobileNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Animate hamburger menu
            const spans = navToggle.querySelectorAll('span');
            spans.forEach((span, index) => {
                if (navMenu.classList.contains('active')) {
                    if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
                    if (index === 1) span.style.opacity = '0';
                    if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
                } else {
                    span.style.transform = '';
                    span.style.opacity = '';
                }
            });
        });

        // Close mobile menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('.nav__link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                const spans = navToggle.querySelectorAll('span');
                spans.forEach(span => {
                    span.style.transform = '';
                    span.style.opacity = '';
                });
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
                navMenu.classList.remove('active');
                const spans = navToggle.querySelectorAll('span');
                spans.forEach(span => {
                    span.style.transform = '';
                    span.style.opacity = '';
                });
            }
        });
    }
}

// Smooth Scrolling for Navigation
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav__link[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Update active navigation link based on scroll position
    window.addEventListener('scroll', updateActiveNavLink);
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link[href^="#"]');
    const headerHeight = document.querySelector('.header').offsetHeight;
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - headerHeight - 50;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Blog Search Functionality
function initBlogSearch() {
    const searchInput = document.getElementById('blog-search');
    const blogGrid = document.getElementById('blog-grid');
    const blogPosts = blogGrid ? blogGrid.querySelectorAll('.blog-post') : [];
    
    if (searchInput && blogPosts.length > 0) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            
            blogPosts.forEach(post => {
                const title = post.querySelector('.blog-post__title').textContent.toLowerCase();
                const excerpt = post.querySelector('.blog-post__excerpt').textContent.toLowerCase();
                const tags = Array.from(post.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase());
                
                const matchesSearch = title.includes(searchTerm) || 
                                    excerpt.includes(searchTerm) || 
                                    tags.some(tag => tag.includes(searchTerm));
                
                if (matchesSearch || searchTerm === '') {
                    post.style.display = 'block';
                    post.style.opacity = '1';
                    post.style.transform = 'scale(1)';
                } else {
                    post.style.display = 'none';
                }
            });
            
            // Show no results message if needed
            const visiblePosts = Array.from(blogPosts).filter(post => post.style.display !== 'none');
            
            let noResultsMessage = blogGrid.querySelector('.no-results');
            if (visiblePosts.length === 0 && searchTerm !== '') {
                if (!noResultsMessage) {
                    noResultsMessage = document.createElement('div');
                    noResultsMessage.className = 'no-results';
                    noResultsMessage.innerHTML = `
                        <div style="text-align: center; padding: 2rem; color: var(--color-text-secondary);">
                            <p>No blog posts found matching "${searchTerm}"</p>
                            <p style="font-size: var(--font-size-sm);">Try searching for different keywords or browse all posts.</p>
                        </div>
                    `;
                    blogGrid.appendChild(noResultsMessage);
                }
                noResultsMessage.style.display = 'block';
            } else if (noResultsMessage) {
                noResultsMessage.style.display = 'none';
            }
        });
    }
}

// Contact Form Handling
function initContactForm() {
    const contactForm = document.querySelector('.contact__form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('contact-name').value,
                email: document.getElementById('contact-email').value,
                subject: document.getElementById('contact-subject').value,
                message: document.getElementById('contact-message').value
            };
            
            // Validate form
            if (validateContactForm(formData)) {
                // Simulate form submission
                showFormFeedback('success', 'Thank you for your message! I\'ll get back to you soon.');
                contactForm.reset();
            }
        });
    }
}

function validateContactForm(data) {
    const errors = [];
    
    if (!data.name.trim()) errors.push('Name is required');
    if (!data.email.trim()) errors.push('Email is required');
    if (!isValidEmail(data.email)) errors.push('Please enter a valid email address');
    if (!data.subject.trim()) errors.push('Subject is required');
    if (!data.message.trim()) errors.push('Message is required');
    
    if (errors.length > 0) {
        showFormFeedback('error', errors.join(', '));
        return false;
    }
    
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showFormFeedback(type, message) {
    // Remove existing feedback
    const existingFeedback = document.querySelector('.form-feedback');
    if (existingFeedback) {
        existingFeedback.remove();
    }
    
    // Create new feedback element
    const feedback = document.createElement('div');
    feedback.className = `form-feedback status status--${type === 'success' ? 'success' : 'error'}`;
    feedback.textContent = message;
    feedback.style.marginTop = 'var(--space-16)';
    
    // Insert after contact form
    const contactForm = document.querySelector('.contact__form');
    contactForm.parentNode.insertBefore(feedback, contactForm.nextSibling);
    
    // Remove feedback after 5 seconds
    setTimeout(() => {
        if (feedback.parentNode) {
            feedback.remove();
        }
    }, 5000);
}

// Resume PDF Download Simulation - Fixed to show proper feedback
function initResumeDownload() {
    const downloadBtn = document.getElementById('download-resume');
    
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Show immediate visual feedback
            const originalText = downloadBtn.textContent;
            const originalDisabled = downloadBtn.disabled;
            
            // Update button state
            downloadBtn.textContent = 'Generating PDF...';
            downloadBtn.disabled = true;
            downloadBtn.style.opacity = '0.7';
            downloadBtn.style.cursor = 'not-allowed';
            
            // Show loading feedback message
            showDownloadFeedback('Preparing your resume for download...');
            
            // Simulate PDF generation delay
            setTimeout(() => {
                // Reset button state
                downloadBtn.textContent = originalText;
                downloadBtn.disabled = originalDisabled;
                downloadBtn.style.opacity = '';
                downloadBtn.style.cursor = '';
                
                // Show success message
                showDownloadFeedback('PDF ready! In a real implementation, download would start now.', 'success');
                
                // In a real implementation, you would trigger the actual download here
                console.log('PDF download would be triggered here');
            }, 2000);
        });
    }
}

function showDownloadFeedback(message, type = 'info') {
    // Remove existing feedback
    const existingFeedback = document.querySelector('.download-feedback');
    if (existingFeedback) {
        existingFeedback.remove();
    }
    
    // Create feedback element
    const feedback = document.createElement('div');
    feedback.className = `download-feedback status status--${type}`;
    feedback.textContent = message;
    feedback.style.marginTop = 'var(--space-16)';
    feedback.style.textAlign = 'center';
    
    // Insert after download button
    const downloadBtn = document.getElementById('download-resume');
    downloadBtn.parentNode.insertBefore(feedback, downloadBtn.nextSibling);
    
    // Remove feedback after 4 seconds
    setTimeout(() => {
        if (feedback.parentNode) {
            feedback.style.opacity = '0';
            feedback.style.transform = 'translateY(-10px)';
            feedback.style.transition = 'all 0.3s ease';
            
            setTimeout(() => {
                if (feedback.parentNode) {
                    feedback.remove();
                }
            }, 300);
        }
    }, 4000);
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Add fade-in class to elements that should animate
    const animatedElements = document.querySelectorAll('.card, .publication, .education__item');
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// Blog Post Interactions
function initBlogPostInteractions() {
    const readMoreBtns = document.querySelectorAll('.blog-post__read-more');
    
    readMoreBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const blogPost = this.closest('.blog-post');
            const title = blogPost.querySelector('.blog-post__title').textContent;
            
            // Simulate opening blog post
            showBlogPostModal(title);
        });
    });
}

function showBlogPostModal(title) {
    // Create modal for blog post preview
    const modal = document.createElement('div');
    modal.className = 'blog-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        padding: var(--space-20);
    `;
    
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modalContent.style.cssText = `
        background: var(--color-surface);
        border-radius: var(--radius-lg);
        padding: var(--space-24);
        max-width: 600px;
        width: 100%;
        max-height: 80vh;
        overflow-y: auto;
        position: relative;
    `;
    
    modalContent.innerHTML = `
        <button class="modal-close" style="
            position: absolute;
            top: var(--space-16);
            right: var(--space-16);
            background: none;
            border: none;
            font-size: var(--font-size-xl);
            cursor: pointer;
            color: var(--color-text-secondary);
        ">&times;</button>
        <h2 style="margin-bottom: var(--space-16); color: var(--color-text);">${title}</h2>
        <p style="color: var(--color-text-secondary); margin-bottom: var(--space-16);">
            This is a preview of the blog post content. In a full implementation, 
            this would display the complete article with rich formatting, code examples, 
            and interactive elements.
        </p>
        <p style="color: var(--color-text-secondary);">
            The blog post would cover advanced topics in signal processing, machine learning applications, 
            and practical implementation details with code examples and visualizations.
        </p>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => modal.remove());
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
    
    // Close with Escape key
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
}

// Utility Functions
function debounce(func, wait) {
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

// Add CSS for active nav links and additional styles
const additionalStyles = `
    .nav__link.active {
        color: var(--color-primary) !important;
        position: relative;
    }
    
    .nav__link.active::after {
        content: '';
        position: absolute;
        bottom: -8px;
        left: 0;
        right: 0;
        height: 2px;
        background-color: var(--color-primary);
        border-radius: 1px;
    }
    
    .blog-modal {
        animation: fadeIn 0.3s ease-out;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    .modal-content {
        animation: slideIn 0.3s ease-out;
    }
    
    @keyframes slideIn {
        from { 
            opacity: 0;
            transform: translateY(-20px);
        }
        to { 
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .download-feedback {
        animation: slideInUp 0.3s ease-out;
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Performance optimization: Debounce scroll events
const debouncedUpdateActiveNavLink = debounce(updateActiveNavLink, 100);
window.removeEventListener('scroll', updateActiveNavLink);
window.addEventListener('scroll', debouncedUpdateActiveNavLink);