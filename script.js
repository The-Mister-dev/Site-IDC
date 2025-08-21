// Main JavaScript file for IDC website

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Fade-in animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all elements with fade-in class
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(element => {
        observer.observe(element);
    });

    // Header background change on scroll
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.backdropFilter = 'blur(10px)';
            } else {
                header.style.background = 'var(--secondary-color)';
                header.style.backdropFilter = 'none';
            }
        });
    }

    // Active navigation link highlighting
    const currentLocation = window.location.pathname;
    const navLinksAll = document.querySelectorAll('.nav-link');
    
    navLinksAll.forEach(link => {
        link.classList.remove('active');
        const linkPath = new URL(link.href).pathname;
        
        if (linkPath === currentLocation || 
            (currentLocation === '/' && linkPath.includes('index.html')) ||
            (currentLocation.includes('index.html') && linkPath === '/')) {
            link.classList.add('active');
        }
    });

    // Form validation helper function
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function validatePhone(phone) {
        const re = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        return re.test(phone);
    }

    function showError(field, message) {
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
        field.classList.add('error');
    }

    function hideError(field) {
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
        field.classList.remove('error');
    }

    // Real-time form validation
    const formFields = document.querySelectorAll('input, textarea, select');
    formFields.forEach(field => {
        field.addEventListener('blur', function() {
            validateField(this);
        });

        field.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });

    function validateField(field) {
        const value = field.value.trim();
        const type = field.type;
        const name = field.name;
        const required = field.hasAttribute('required');

        hideError(field);

        if (required && !value) {
            showError(field, 'Ce champ est obligatoire');
            return false;
        }

        if (value) {
            switch (type) {
                case 'email':
                    if (!validateEmail(value)) {
                        showError(field, 'Veuillez entrer une adresse email valide');
                        return false;
                    }
                    break;
                case 'tel':
                    if (!validatePhone(value)) {
                        showError(field, 'Veuillez entrer un numéro de téléphone valide');
                        return false;
                    }
                    break;
                case 'number':
                    const min = parseFloat(field.min);
                    const max = parseFloat(field.max);
                    const numValue = parseFloat(value);
                    
                    if (min && numValue < min) {
                        showError(field, `La valeur doit être supérieure ou égale à ${min}`);
                        return false;
                    }
                    if (max && numValue > max) {
                        showError(field, `La valeur doit être inférieure ou égale à ${max}`);
                        return false;
                    }
                    break;
            }

            // Special validation for specific fields
            if (name === 'subject' && value.length < 3) {
                showError(field, 'Le sujet doit contenir au moins 3 caractères');
                return false;
            }

            if (name === 'message' && value.length < 10) {
                showError(field, 'Le message doit contenir au moins 10 caractères');
                return false;
            }

            if (name === 'firstName' || name === 'lastName' || name === 'name') {
                if (value.length < 2) {
                    showError(field, 'Ce champ doit contenir au moins 2 caractères');
                    return false;
                }
            }
        }

        return true;
    }

    // Form submission handling
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            const formFields = this.querySelectorAll('input, textarea, select');
            
            formFields.forEach(field => {
                if (!validateField(field)) {
                    isValid = false;
                }
            });

            // Check checkboxes specifically
            const requiredCheckboxes = this.querySelectorAll('input[type="checkbox"][required]');
            requiredCheckboxes.forEach(checkbox => {
                if (!checkbox.checked) {
                    showError(checkbox, 'Vous devez accepter ce champ');
                    isValid = false;
                }
            });

            if (isValid) {
                // Show success message
                showSuccessMessage('Votre message a été envoyé avec succès !');
                
                // Reset form
                this.reset();
                
                // Hide all error messages
                const errorMessages = this.querySelectorAll('.error-message');
                errorMessages.forEach(error => {
                    error.textContent = '';
                    error.style.display = 'none';
                });
                
                const errorFields = this.querySelectorAll('.error');
                errorFields.forEach(field => {
                    field.classList.remove('error');
                });
            } else {
                // Scroll to first error
                const firstError = this.querySelector('.error');
                if (firstError) {
                    firstError.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center' 
                    });
                }
            }
        });
    });

    function showSuccessMessage(message) {
        // Create success notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #27ae60;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 5px;
            z-index: 9999;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }

    // Lazy loading for images
    const images = document.querySelectorAll('img[loading="lazy"]');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Keyboard navigation improvements
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Close mobile menu
            if (navMenu && navMenu.classList.contains('active')) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
            
            // Close modals
            const openModals = document.querySelectorAll('.modal[style*="display: flex"], .lightbox[style*="display: flex"]');
            openModals.forEach(modal => {
                modal.style.display = 'none';
            });
        }
    });

    // Focus management for accessibility
    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    
    function trapFocus(element) {
        const focusableContent = element.querySelectorAll(focusableElements);
        const firstFocusableElement = focusableContent[0];
        const lastFocusableElement = focusableContent[focusableContent.length - 1];

        element.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusableElement) {
                        lastFocusableElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastFocusableElement) {
                        firstFocusableElement.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    }

    // Apply focus trapping to modals
    const modals = document.querySelectorAll('.modal, .lightbox');
    modals.forEach(modal => {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    if (modal.style.display === 'flex') {
                        trapFocus(modal);
                        // Focus first focusable element
                        const firstFocusable = modal.querySelector(focusableElements);
                        if (firstFocusable) {
                            firstFocusable.focus();
                        }
                    }
                }
            });
        });
        
        observer.observe(modal, {
            attributes: true,
            attributeFilter: ['style']
        });
    });

    console.log('IDC Website JavaScript loaded successfully');
});

// Utility functions
window.IDC = {
    // Scroll to top function
    scrollToTop: function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    },

    // Format currency
    formatCurrency: function(amount, currency = 'FCFA') {
        return `${amount}${currency}`;
    },

    // Format date
    formatDate: function(date, locale = 'fr-FR') {
        return new Date(date).toLocaleDateString(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    // Debounce function for performance
    debounce: function(func, wait, immediate) {
        let timeout;
        return function executedFunction() {
            const context = this;
            const args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    },

    // Throttle function for scroll events
    throttle: function(func, limit) {
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
};