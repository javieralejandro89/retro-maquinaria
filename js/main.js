// ==== MAIN JAVASCRIPT FOR RETRO MAQUINARIA ====

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initLoader();
    initNavigation();
    initScrollEffects();
    initAnimations();
    initForms();
    initWhatsAppButton();
    initBackToTop();
    initCounters();
    initTypingEffect();
    initParallax();
});

// ===== LOADING SCREEN =====
function initLoader() {
    const loadingScreen = document.getElementById('loading-screen');
    
    window.addEventListener('load', function() {
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                document.body.style.overflow = 'visible';
            }, 500);
        }, 1000);
    });
}

// ===== NAVIGATION =====
function initNavigation() {
    const navbar = document.querySelector('.custom-navbar');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(href);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });

                    // Close mobile menu if open
                    if (navbarCollapse.classList.contains('show')) {
                        navbarToggler.click();
                    }

                    // Update active link
                    updateActiveNavLink(href);
                }
            }
        });
    });

    // Update active navigation link based on scroll position
    window.addEventListener('scroll', updateActiveNavLinkOnScroll);
}

function updateActiveNavLink(activeHref) {
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === activeHref) {
            link.classList.add('active');
        }
    });
}

function updateActiveNavLinkOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            updateActiveNavLink(`#${sectionId}`);
        }
    });
}

// ===== SCROLL EFFECTS =====
function initScrollEffects() {
    // Initialize AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            easing: 'ease-in-out',
            once: true,
            mirror: false,
            offset: 100
        });
    }

    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        const heroSection = document.querySelector('.hero-section');
        
        if (heroSection) {
            heroSection.style.transform = `translateY(${rate}px)`;
        }
    });
}

// ===== ANIMATIONS =====
function initAnimations() {
    // Add hover effects to cards
    const cards = document.querySelectorAll('.service-card, .machinery-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    // Observe all cards and sections
    const elementsToAnimate = document.querySelectorAll('.service-card, .machinery-card, .feature-item, .stat-item');
    elementsToAnimate.forEach(el => observer.observe(el));
}

// ===== FORMS =====
function initForms() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        // Form validation
        const formInputs = contactForm.querySelectorAll('input[required], select[required], textarea[required]');
        
        formInputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearValidation);
        });

        // Form submission
        contactForm.addEventListener('submit', function(e) {
            if (!validateForm()) {
                e.preventDefault();
                showNotification('Por favor, completa todos los campos requeridos.', 'error');
                return;
            }

            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            submitBtn.disabled = true;

            // FormSubmit will handle the actual submission
            showNotification('Enviando mensaje...', 'info');
        });
    }
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    // Remove existing feedback
    clearValidation(e);

    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'Este campo es requerido.');
        return false;
    }

    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Por favor, ingresa un email válido.');
            return false;
        }
    }

    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(value)) {
            showFieldError(field, 'Por favor, ingresa un teléfono válido.');
            return false;
        }
    }

    showFieldSuccess(field);
    return true;
}

function clearValidation(e) {
    const field = e.target;
    field.classList.remove('is-valid', 'is-invalid');
    
    const feedback = field.parentNode.querySelector('.invalid-feedback, .valid-feedback');
    if (feedback) {
        feedback.remove();
    }
}

function showFieldError(field, message) {
    field.classList.add('is-invalid');
    field.classList.remove('is-valid');
    
    const feedback = document.createElement('div');
    feedback.className = 'invalid-feedback';
    feedback.textContent = message;
    field.parentNode.appendChild(feedback);
}

function showFieldSuccess(field) {
    field.classList.add('is-valid');
    field.classList.remove('is-invalid');
}

function validateForm() {
    const form = document.getElementById('contactForm');
    const requiredFields = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!validateField({ target: field })) {
            isValid = false;
        }
    });

    return isValid;
}

// ===== WHATSAPP BUTTON =====
function initWhatsAppButton() {
    const whatsappBtn = document.querySelector('.whatsapp-btn');
    
    if (whatsappBtn) {
        // Add click tracking
        whatsappBtn.addEventListener('click', function() {
            // Track WhatsApp click
            if (typeof gtag !== 'undefined') {
                gtag('event', 'whatsapp_click', {
                    'event_category': 'contact',
                    'event_label': 'floating_button'
                });
            }
        });        
    }
}

// ===== BACK TO TOP BUTTON =====
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });

            // Track back to top click
            if (typeof gtag !== 'undefined') {
                gtag('event', 'back_to_top_click', {
                    'event_category': 'navigation'
                });
            }
        });
    }
}

// ===== COUNTERS =====
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    if (counters.length > 0) {
        const observerOptions = {
            threshold: 0.7
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    animateCounter(entry.target);
                    entry.target.classList.add('counted');
                }
            });
        }, observerOptions);

        counters.forEach(counter => observer.observe(counter));
    }
}

function animateCounter(element) {
    const target = parseInt(element.textContent.replace(/\D/g, ''));
    const suffix = element.textContent.replace(/[\d]/g, '');
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + suffix;
    }, 16);
}

// ===== TYPING EFFECT =====
function initTypingEffect() {
    const heroSubtitle = document.querySelector('.hero-subtitle');
    
    if (heroSubtitle) {
        const text = heroSubtitle.textContent;
        heroSubtitle.textContent = '';
        heroSubtitle.style.borderRight = '2px solid #FDB900';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroSubtitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            } else {
                setTimeout(() => {
                    heroSubtitle.style.borderRight = 'none';
                }, 1000);
            }
        };

        setTimeout(typeWriter, 1500);
    }
}

// ===== PARALLAX EFFECT =====
function initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    if (parallaxElements.length > 0) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const rate = scrolled * -0.5;
                element.style.transform = `translateY(${rate}px)`;
            });
        });
    }
}

// ===== NOTIFICATIONS =====
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        backgroundColor: getNotificationColor(type),
        color: 'white',
        padding: '15px 20px',
        borderRadius: '10px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        zIndex: '10000',
        minWidth: '300px',
        animation: 'slideInRight 0.3s ease'
    });

    // Add to page
    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);

    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

function getNotificationColor(type) {
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8'
    };
    return colors[type] || '#17a2b8';
}

// ===== LAZY LOADING =====
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if (lazyImages.length > 0 && 'IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }
}

// ===== UTILITY FUNCTIONS =====

// Debounce function for performance optimization
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

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Add event listeners with performance optimization
window.addEventListener('scroll', throttle(() => {
    // Optimized scroll handling
}, 16));

window.addEventListener('resize', debounce(() => {
    // Handle resize events
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
}, 250));

// ===== ANALYTICS TRACKING =====
function trackEvent(action, category, label) {
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            'event_category': category,
            'event_label': label
        });
    }
}

// Track CTA button clicks
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-cta') || e.target.closest('.btn-cta')) {
        trackEvent('cta_click', 'conversion', e.target.textContent.trim());
    }
    
    if (e.target.classList.contains('service-link') || e.target.closest('.service-link')) {
        trackEvent('service_click', 'engagement', e.target.textContent.trim());
    }
});

// ===== ACCESSIBILITY =====
function initAccessibility() {
    // Add focus indicators
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('using-keyboard');
        }
    });

    document.addEventListener('mousedown', function() {
        document.body.classList.remove('using-keyboard');
    });

    // Improve contrast for better readability
    const highContrastMode = localStorage.getItem('highContrast') === 'true';
    if (highContrastMode) {
        document.body.classList.add('high-contrast');
    }
}

// ===== PERFORMANCE MONITORING =====
function initPerformanceMonitoring() {
    // Monitor page load performance
    window.addEventListener('load', function() {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            if (perfData && typeof gtag !== 'undefined') {
                gtag('event', 'page_load_time', {
                    'event_category': 'performance',
                    'value': Math.round(perfData.loadEventEnd - perfData.fetchStart)
                });
            }
        }, 0);
    });
}

// Initialize performance monitoring
initPerformanceMonitoring();
initAccessibility();

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    
    // Track errors in analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'javascript_error', {
            'event_category': 'error',
            'event_label': e.message
        });
    }
});

// Console message for developers
console.log('%c🚧 Retro Maquinaria Website', 'color: #FDB900; font-size: 24px; font-weight: bold;');
console.log('%cDesarrollado con ❤️ para Retro Maquinaria', 'color: #1a1a1a; font-size: 14px;');

// Export functions for global access
window.RetroMaquinaria = {
    showNotification,
    trackEvent,
    validateForm
};