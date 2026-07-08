// AlpherTech Solutions - Professional Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize current year
    const currentYear = document.getElementById('current-year');
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }
    
    // Mobile Navigation
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            mobileMenu.setAttribute('aria-hidden', mobileMenu.classList.contains('active') ? 'false' : 'true');
            mobileMenuBtn.setAttribute('aria-expanded', mobileMenuBtn.classList.contains('active'));
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });
        
        // Close menu when clicking links
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                mobileMenu.classList.remove('active');
                mobileMenu.setAttribute('aria-hidden', 'true');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
        
        // Close menu when pressing Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                mobileMenuBtn.click();
            }
        });
    }
    
    // Header scroll effect with enhanced detection
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.scrollY;
        
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScrollTop = currentScroll;
    });
    
    // Navigation links work directly without JavaScript override
    // Active states are set via hardcoded classes in HTML
    
    // Enhanced smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const headerHeight = header ? header.offsetHeight : 0;
                    const targetPosition = target.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Focus target for accessibility
                    target.focus();
                }
            }
        });
    });
    
    // Initialize animations
    initAnimations();
    
    // Form handling
    initForms();
    
    // Portfolio filtering
    initPortfolio();
    
    // Testimonials carousel
    initTestimonials();
    
    // Lazy loading for images
    initLazyLoading();
});

// Animations
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.fade-in, .slide-up').forEach(el => {
        observer.observe(el);
    });
}

// Form handling
function initForms() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleContactSubmit(this);
        });
    }
    
    // Newsletter form
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleNewsletterSubmit(this);
        });
    }
}

function handleContactSubmit(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Validate required fields
    const required = ['name', 'email', 'message'];
    const missing = required.filter(field => !data[field]?.trim());
    
    if (missing.length > 0) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Save to localStorage for demo
        const messages = JSON.parse(localStorage.getItem('santiago_messages') || '[]');
        const newMessage = {
            id: Date.now(),
            ...data,
            timestamp: new Date().toISOString(),
            status: 'unread'
        };
        messages.push(newMessage);
        localStorage.setItem('santiago_messages', JSON.stringify(messages));
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Show success
        showNotification('Thank you! Your message has been sent successfully.', 'success');
        
        // Reset form
        form.reset();
        
        // Open email client as backup
        const mailtoLink = `mailto:alphertech@gmail.com?subject=${encodeURIComponent(data.subject || 'Contact Form Submission')}&body=${encodeURIComponent(
            `Name: ${data.name}\n` +
            `Email: ${data.email}\n` +
            `Phone: ${data.phone || 'Not provided'}\n` +
            `Company: ${data.company || 'Not provided'}\n\n` +
            `Message:\n${data.message}`
        )}`;
        
        // Optional: uncomment to open email client
        // window.open(mailtoLink, '_blank');
        
    }, 1500);
}

function handleNewsletterSubmit(form) {
    const email = form.querySelector('input[type="email"]').value;
    
    if (!email) {
        showNotification('Please enter your email address', 'error');
        return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Save to localStorage
    const subscribers = JSON.parse(localStorage.getItem('santiago_newsletter') || '[]');
    if (!subscribers.includes(email)) {
        subscribers.push(email);
        localStorage.setItem('santiago_newsletter', JSON.stringify(subscribers));
    }
    
    showNotification('Thank you for subscribing to our newsletter!', 'success');
    form.reset();
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-message">${message}</div>
            <button class="notification-close" aria-label="Close notification">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add styles if not present
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--card-bg);
                border-left: 4px solid;
                border-radius: var(--radius-lg);
                padding: var(--space-md) var(--space-lg);
                box-shadow: var(--shadow-xl);
                z-index: 9999;
                max-width: 400px;
                animation: slideInRight 0.3s ease;
                border-color: var(--primary);
            }
            .notification-success { border-color: var(--success); }
            .notification-error { border-color: var(--error); }
            .notification-info { border-color: var(--primary); }
            .notification-content {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: var(--space-md);
            }
            .notification-message {
                flex: 1;
                color: var(--text-primary);
                font-size: var(--text-sm);
            }
            .notification-close {
                background: none;
                border: none;
                color: var(--text-muted);
                cursor: pointer;
                padding: var(--space-xs);
                transition: color var(--transition-fast);
            }
            .notification-close:hover {
                color: var(--text-primary);
            }
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
    
    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
}

// Portfolio filtering
function initPortfolio() {
    const filterButtons = document.querySelectorAll('.portfolio-filter');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    if (filterButtons.length === 0) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            let visibleCount = 0;
            
            // Filter items with smooth animation
            portfolioItems.forEach((item, index) => {
                const isVisible = filter === 'all' || item.dataset.category === filter;
                
                if (isVisible) {
                    visibleCount++;
                    item.style.display = 'block';
                    item.style.animation = `slideUp 0.6s ease forwards`;
                    item.style.animationDelay = `${index * 0.1}s`;
                } else {
                    item.style.animation = 'none';
                    item.style.display = 'none';
                }
            });
        });
    });
}

// Testimonials carousel
function initTestimonials() {
    const carousel = document.querySelector('.testimonials-carousel');
    if (!carousel) return;
    
    const slides = carousel.querySelectorAll('.testimonial-slide');
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');
    const dots = carousel.querySelectorAll('.carousel-dot');
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    function showSlide(index) {
        // Hide all slides
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Update dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Show current slide
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        currentSlide = index;
    }
    
    // Next slide
    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
    }
    
    // Previous slide
    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(currentSlide);
    }
    
    // Event listeners
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    
    // Dot click events
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
        });
    });
    
    // Auto slide every 5 seconds
    setInterval(nextSlide, 5000);
}

// Pricing calculator
function initPricingCalculator() {
    const calculator = document.getElementById('pricingCalculator');
    if (!calculator) return;
    
    const serviceSelect = calculator.querySelector('#service');
    const quantityInput = calculator.querySelector('#quantity');
    const durationSelect = calculator.querySelector('#duration');
    const totalElement = calculator.querySelector('#totalPrice');
    
    const prices = {
        'website': { base: 500000, unit: 'site' },
        'ecommerce': { base: 1200000, unit: 'store' },
        'software': { base: 2500000, unit: 'system' },
        'branding': { base: 300000, unit: 'package' },
        'seo': { base: 200000, unit: 'month' }
    };
    
    function calculateTotal() {
        const service = serviceSelect.value;
        const quantity = parseInt(quantityInput.value) || 1;
        const duration = parseInt(durationSelect.value) || 1;
        
        if (!prices[service]) return;
        
        const { base, unit } = prices[service];
        let total = base * quantity;
        
        // Apply duration multiplier for monthly services
        if (unit === 'month') {
            total *= duration;
        }
        
        // Format as currency
        const formatter = new Intl.NumberFormat('en-UG', {
            style: 'currency',
            currency: 'UGX',
            minimumFractionDigits: 0
        });
        
        totalElement.textContent = formatter.format(total);
    }
    
    // Event listeners
    serviceSelect.addEventListener('change', calculateTotal);
    quantityInput.addEventListener('input', calculateTotal);
    durationSelect.addEventListener('change', calculateTotal);
    
    // Initial calculation
    calculateTotal();
}

// Initialize calculator if exists
document.addEventListener('DOMContentLoaded', initPricingCalculator);

// Lazy loading for images
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// Export for global access
window.AlpherTech = {
    showNotification,
    handleContactSubmit,
    initPortfolio,
    initLazyLoading
};
