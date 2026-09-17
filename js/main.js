// AlpherTech Solutions

document.documentElement.classList.add('js');

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

    // Mobile Products Dropdown Toggle
    const mobileDropdownToggle = document.querySelector('.mobile-dropdown-toggle');
    if (mobileDropdownToggle) {
        mobileDropdownToggle.addEventListener('click', function(e) {
            e.preventDefault();
            const parent = this.closest('.mobile-dropdown');
            parent.classList.toggle('active');
            const isExpanded = parent.classList.contains('active');
            this.setAttribute('aria-expanded', isExpanded);
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
    initHeroCounters();
    initHeroMotion();
    
    // Form handling
    initForms();
    
    // Portfolio filtering
    initPortfolio();
    
    // Testimonials carousel
    initTestimonials();
    
    // Lazy loading for images
    initLazyLoading();

    // Plexus product showcase slider
    initPlexusSlider();
});

// Plexus Product Showcase Slider (fade in/out, random order)
function initPlexusSlider() {
    const slider = document.getElementById('plexusSliderTrack');
    const dotsContainer = document.getElementById('plexusSliderDots');
    if (!slider) return;

    const slides = Array.from(slider.querySelectorAll('.plexus-slide'));
    if (slides.length === 0 || !dotsContainer) return;

    // Hide all slides initially
    slides.forEach(slide => {
        slide.classList.remove('active');
        slide.style.opacity = '0';
    });

    let currentIndex = -1;
    let order = [];
    let autoplayInterval;
    let autoplayPaused = false;

    // Build a randomized order of indices (no immediate repeat)
    function buildRandomOrder() {
        const indices = slides.map((_, i) => i);
        // Fisher-Yates shuffle
        for (let i = indices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [indices[i], indices[j]] = [indices[j], indices[i]];
        }
        // Ensure first item isn't the same as last shown
        if (order.length > 0 && indices[0] === order[order.length - 1]) {
            // swap first with a random other position
            const swapIdx = 1 + Math.floor(Math.random() * (indices.length - 1));
            [indices[0], indices[swapIdx]] = [indices[swapIdx], indices[0]];
        }
        order = indices;
    }

    function showSlide(index) {
        const slideIndex = order[index];
        slides.forEach((slide, i) => {
            if (i === slideIndex) {
                slide.classList.add('active');
                slide.style.opacity = '1';
            } else {
                slide.classList.remove('active');
                slide.style.opacity = '0';
            }
        });

        // Update active dot
        const dots = dotsContainer.querySelectorAll('button');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === slideIndex);
        });
    }

    function nextRandomSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        if (currentIndex === 0) {
            buildRandomOrder();
        }
        showSlide(currentIndex);
        resetAutoplay();
    }

    function pauseAutoplay() {
        autoplayPaused = true;
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
            autoplayInterval = null;
        }
    }

    function resumeAutoplay() {
        autoplayPaused = false;
        resetAutoplay();
    }

    function resetAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
            autoplayInterval = null;
        }
        if (!autoplayPaused && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            autoplayInterval = setInterval(nextRandomSlide, 3500);
        }
    }

    // Create dots (one per image)
    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.setAttribute('aria-label', `Show image ${index + 1}`);
        dot.addEventListener('click', () => {
            // Jump to that image directly
            const slideIndex = order.indexOf(index);
            if (slideIndex !== -1) {
                currentIndex = slideIndex;
            } else {
                // Rebuild order starting with this index
                buildRandomOrder();
                // Move clicked index to front
                const pos = order.indexOf(index);
                [order[0], order[pos]] = [order[pos], order[0]];
                currentIndex = 0;
            }
            showSlide(currentIndex);
            resetAutoplay();
        });
        dotsContainer.appendChild(dot);
    });

    // Initialize: build order and show first
    buildRandomOrder();
    showSlide(0);

    // Pause autoplay when the showcase is not being viewed
    slider.addEventListener('mouseenter', () => {
        pauseAutoplay();
    });

    slider.addEventListener('mouseleave', () => {
        resumeAutoplay();
    });

    slider.addEventListener('focusin', () => {
        pauseAutoplay();
    });

    slider.addEventListener('focusout', () => {
        resumeAutoplay();
    });

    dotsContainer.addEventListener('mouseenter', () => {
        pauseAutoplay();
    });

    dotsContainer.addEventListener('mouseleave', () => {
        resumeAutoplay();
    });

    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
            pauseAutoplay();
        } else {
            resumeAutoplay();
        }
    });

    // Start autoplay
    resetAutoplay();

    // Reveal on scroll - observe the outer slider container
    const sliderContainer = slider.closest('.plexus-showcase-slider');
    if (sliderContainer) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.remove('hidden');
                    observer.unobserve(entry.target);
                } else {
                    entry.target.classList.add('hidden');
                }
            });
        }, { threshold: 0.2 });

        observer.observe(sliderContainer);
    }
}

// Animations
function initAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in, .slide-up');
    if (!('IntersectionObserver' in window)) {
        animatedElements.forEach(el => el.classList.add('animated'));
        return;
    }

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

function initHeroCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    if (counters.length === 0) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const animateCounter = (element) => {
        const target = Number(element.dataset.count) || 0;
        const suffix = element.dataset.suffix || '';
        if (reduceMotion) {
            element.textContent = `${target}${suffix}`;
            return;
        }

        const duration = 1400;
        const startTime = performance.now();
        const updateCounter = (now) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            element.textContent = `${Math.round(target * easedProgress)}${suffix}`;
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };
        requestAnimationFrame(updateCounter);
    };

    if (!('IntersectionObserver' in window)) {
        counters.forEach(counter => animateCounter(counter));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.45 });

    counters.forEach(counter => observer.observe(counter));
}

function initHeroMotion() {
    const hero = document.querySelector('.hero');
    const motionLayer = document.querySelector('.hero-motion');
    if (!hero || !motionLayer) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    let frameId = null;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const renderMotion = () => {
        currentX += (targetX - currentX) * 0.075;
        currentY += (targetY - currentY) * 0.075;
        motionLayer.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0)`;

        if (Math.abs(targetX - currentX) > 0.1 || Math.abs(targetY - currentY) > 0.1) {
            frameId = requestAnimationFrame(renderMotion);
        } else {
            frameId = null;
        }
    };

    const queueMotion = () => {
        if (!frameId) {
            frameId = requestAnimationFrame(renderMotion);
        }
    };

    hero.addEventListener('pointermove', (event) => {
        const bounds = hero.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        targetX = x * 18;
        targetY = y * 12;
        queueMotion();
    });

    hero.addEventListener('pointerleave', () => {
        targetX = 0;
        targetY = 0;
        queueMotion();
    });

    window.addEventListener('scroll', queueMotion, { passive: true });
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

function openMailto(mailtoLink) {
    window.location.href = mailtoLink;
}

function handleContactSubmit(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    const required = ['name', 'email', 'message'];
    const missing = required.filter(field => !data[field]?.trim());
    
    if (missing.length > 0) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        showNotification('Thank you! Your message has been sent successfully.', 'success');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        form.reset();
        
        const mailtoLink = `mailto:alphertech@gmail.com?subject=${encodeURIComponent(data.subject || 'Contact Form Submission')}&body=${encodeURIComponent(
            `Name: ${data.name}\n` +
            `Email: ${data.email}\n` +
            `Phone: ${data.phone || 'Not provided'}\n` +
            `Company: ${data.company || 'Not provided'}\n\n` +
            `Message:\n${data.message}`
        )}`;
        
        openMailto(mailtoLink);
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
    
    showNotification('Thank you for subscribing to our newsletter!', 'success');
    form.reset();
    
    const mailtoLink = `mailto:alphertech@gmail.com?subject=${encodeURIComponent('Newsletter Subscription')}&body=${encodeURIComponent(`New newsletter subscription:\nEmail: ${email}`)}`;
    openMailto(mailtoLink);
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

// Testimonials animations
function initTestimonials() {
    const cards = document.querySelectorAll('.testimonial-cards .card');
    if (!cards.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    cards.forEach((card, index) => {
        card.style.animation = `slideUp 0.6s ease ${index * 0.15}s forwards`;
        card.style.animationPlayState = 'paused';
        observer.observe(card);
    });
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
        'seo': { base: 200000, unit: 'month' },
        'freelance': { base: 50000, unit: 'hour' },
        'audit': { base: 1000000, unit: 'audit' },
        'devops': { base: 800000, unit: 'setup' }
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
    
    const submitBtn = calculator.querySelector('#pricingSubmitBtn');
    if (submitBtn) {
        submitBtn.addEventListener('click', function(e) {
            const service = serviceSelect.value;
            
            if (!service) {
                showNotification('Please select a service', 'error');
                e.preventDefault();
                return;
            }
            
            const serviceName = serviceSelect.options[serviceSelect.selectedIndex].text;
            const quantity = parseInt(quantityInput.value) || 1;
            const duration = parseInt(durationSelect.value) || 1;
            const total = totalElement.textContent;
            const durationText = duration > 1 ? `${duration} Months` : '1 Month';
            
            const serviceNameField = calculator.querySelector('#serviceName');
            const quantityField = calculator.querySelector('#quantityHidden');
            const durationField = calculator.querySelector('#durationHidden');
            const costField = calculator.querySelector('#estimatedCostHidden');
            
            if (serviceNameField) serviceNameField.value = serviceName;
            if (quantityField) quantityField.value = quantity;
            if (durationField) durationField.value = durationText;
            if (costField) costField.value = total;
        });
    }
    
    calculator.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const service = serviceSelect.value;
        if (!service) {
            showNotification('Please select a service', 'error');
            return;
        }
        
        const serviceName = serviceSelect.options[serviceSelect.selectedIndex].text;
        const quantity = parseInt(quantityInput.value) || 1;
        const duration = parseInt(durationSelect.value) || 1;
        const total = totalElement.textContent;
        const durationText = duration > 1 ? `${duration} Months` : '1 Month';
        
        const mailtoLink = `mailto:alphertech@gmail.com?subject=${encodeURIComponent('Pricing Quote Request')}&body=${encodeURIComponent(
            `Pricing Quote Request\n` +
            `Service: ${serviceName}\n` +
            `Quantity/Scale: ${quantity}\n` +
            `Duration: ${durationText}\n` +
            `Estimated Cost: ${total}\n\n` +
            `Please contact me with a detailed quote and timeline.`
        )}`;
        
        openMailto(mailtoLink);
    });
    
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
