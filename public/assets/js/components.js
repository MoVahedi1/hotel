// ===================================
// Reusable Components
// ===================================

// Gallery Component
class ImageGallery {
    constructor(container) {
        this.container = container;
        this.images = [];
        this.currentIndex = 0;
        this.init();
    }
    
    init() {
        this.setupImages();
        this.setupThumbnails();
        this.setupControls();
        this.setupFullscreen();
        this.setupKeyboardNavigation();
    }
    
    setupImages() {
        const mainImage = this.container.querySelector('#main-hotel-image');
        const slides = this.container.querySelectorAll('.hero-slide');
        
        if (mainImage) {
            this.images = Array.from(slides).map(slide => {
                const bgImage = slide.style.backgroundImage;
                return bgImage.slice(5, -2); // Extract URL from background-image
            });
        }
    }
    
    setupThumbnails() {
        const thumbnailStrip = document.getElementById('thumbnail-strip');
        if (!thumbnailStrip) return;
        
        this.images.forEach((image, index) => {
            const thumbnail = document.createElement('div');
            thumbnail.className = `thumbnail ${index === 0 ? 'active' : ''}`;
            thumbnail.innerHTML = `<img src="${image}" alt="Hotel image ${index + 1}">`;
            
            thumbnail.addEventListener('click', () => this.goToImage(index));
            thumbnailStrip.appendChild(thumbnail);
        });
    }
    
    setupControls() {
        const prevBtn = document.getElementById('gallery-prev');
        const nextBtn = document.getElementById('gallery-next');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.previousImage());
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextImage());
        }
    }
    
    setupFullscreen() {
        const fullscreenBtn = document.getElementById('fullscreen-btn');
        const mainImage = document.querySelector('#main-hotel-image');
        
        if (fullscreenBtn && mainImage) {
            fullscreenBtn.addEventListener('click', () => {
                this.openFullscreen(mainImage.src);
            });
        }
    }
    
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.previousImage();
            } else if (e.key === 'ArrowRight') {
                this.nextImage();
            } else if (e.key === 'Escape') {
                this.closeFullscreen();
            }
        });
    }
    
    goToImage(index) {
        const mainImage = document.querySelector('#main-hotel-image');
        const thumbnails = document.querySelectorAll('.thumbnail');
        
        if (mainImage) {
            mainImage.src = this.images[index];
        }
        
        thumbnails.forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
        });
        
        this.currentIndex = index;
    }
    
    nextImage() {
        const nextIndex = (this.currentIndex + 1) % this.images.length;
        this.goToImage(nextIndex);
    }
    
    previousImage() {
        const prevIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.goToImage(prevIndex);
    }
    
    openFullscreen(imageSrc) {
        const fullscreenDiv = document.createElement('div');
        fullscreenDiv.className = 'fullscreen-gallery';
        fullscreenDiv.innerHTML = `
            <div class="fullscreen-overlay">
                <img src="${imageSrc}" alt="Fullscreen image">
                <button class="fullscreen-close">&times;</button>
                <button class="fullscreen-prev">&lt;</button>
                <button class="fullscreen-next">&gt;</button>
            </div>
        `;
        
        document.body.appendChild(fullscreenDiv);
        document.body.style.overflow = 'hidden';
        
        // Setup controls
        const closeBtn = fullscreenDiv.querySelector('.fullscreen-close');
        const prevBtn = fullscreenDiv.querySelector('.fullscreen-prev');
        const nextBtn = fullscreenDiv.querySelector('.fullscreen-next');
        const img = fullscreenDiv.querySelector('img');
        
        closeBtn.addEventListener('click', () => this.closeFullscreen());
        prevBtn.addEventListener('click', () => {
            this.previousImage();
            img.src = this.images[this.currentIndex];
        });
        nextBtn.addEventListener('click', () => {
            this.nextImage();
            img.src = this.images[this.currentIndex];
        });
        
        // Close on overlay click
        fullscreenDiv.addEventListener('click', (e) => {
            if (e.target === fullscreenDiv || e.target.classList.contains('fullscreen-overlay')) {
                this.closeFullscreen();
            }
        });
    }
    
    closeFullscreen() {
        const fullscreenDiv = document.querySelector('.fullscreen-gallery');
        if (fullscreenDiv) {
            fullscreenDiv.remove();
            document.body.style.overflow = '';
        }
    }
}

// Tabs Component
class Tabs {
    constructor(container) {
        this.container = container;
        this.tabButtons = container.querySelectorAll('.tab-btn');
        this.tabPanes = container.querySelectorAll('.tab-pane');
        this.init();
    }
    
    init() {
        this.tabButtons.forEach((button, index) => {
            button.addEventListener('click', () => this.showTab(index));
        });
        
        // Show first tab by default
        if (this.tabButtons.length > 0) {
            this.showTab(0);
        }
    }
    
    showTab(index) {
        // Update buttons
        this.tabButtons.forEach((btn, i) => {
            btn.classList.toggle('active', i === index);
            btn.setAttribute('aria-selected', i === index);
        });
        
        // Update panes
        this.tabPanes.forEach((pane, i) => {
            pane.classList.toggle('active', i === index);
        });
    }
}

// Accordion Component
class Accordion {
    constructor(container) {
        this.container = container;
        this.items = container.querySelectorAll('.accordion-item');
        this.init();
    }
    
    init() {
        this.items.forEach(item => {
            const header = item.querySelector('.accordion-header');
            const content = item.querySelector('.accordion-content');
            
            if (header && content) {
                header.addEventListener('click', () => this.toggleItem(item));
            }
        });
    }
    
    toggleItem(targetItem) {
        const isActive = targetItem.classList.contains('active');
        
        // Close all items
        this.items.forEach(item => {
            item.classList.remove('active');
            const content = item.querySelector('.accordion-content');
            if (content) {
                content.style.maxHeight = null;
            }
        });
        
        // Open target item if it wasn't active
        if (!isActive) {
            targetItem.classList.add('active');
            const content = targetItem.querySelector('.accordion-content');
            if (content) {
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        }
    }
}

// Modal Component
class Modal {
    constructor(trigger) {
        this.trigger = trigger;
        this.modalId = trigger.getAttribute('data-modal');
        this.modal = document.getElementById(this.modalId);
        this.init();
    }
    
    init() {
        if (!this.modal) return;
        
        this.trigger.addEventListener('click', () => this.open());
        
        // Close buttons
        const closeButtons = this.modal.querySelectorAll('.modal-close, .modal-overlay');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => this.close());
        });
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.close();
            }
        });
    }
    
    open() {
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus management
        const focusableElements = this.modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusableElements.length > 0) {
            focusableElements[0].focus();
        }
    }
    
    close() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
        this.trigger.focus();
    }
}

// Loading Spinner Component
class LoadingSpinner {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            size: 'medium',
            text: 'Loading...',
            overlay: false,
            ...options
        };
        this.spinner = null;
    }
    
    show() {
        if (this.spinner) return;
        
        const sizeClass = `spinner--${this.options.size}`;
        const overlayClass = this.options.overlay ? 'spinner-overlay' : '';
        
        this.spinner = document.createElement('div');
        this.spinner.className = `loading-spinner ${overlayClass}`;
        this.spinner.innerHTML = `
            <div class="spinner ${sizeClass}">
                <div class="spinner-circle"></div>
            </div>
            ${this.options.text ? `<div class="spinner-text">${this.options.text}</div>` : ''}
        `;
        
        this.container.appendChild(this.spinner);
    }
    
    hide() {
        if (this.spinner) {
            this.spinner.remove();
            this.spinner = null;
        }
    }
}

// Form Validator Component
class FormValidator {
    constructor(form, rules) {
        this.form = form;
        this.rules = rules;
        this.errors = {};
        this.init();
    }
    
    init() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.validate()) {
                this.form.submit();
            }
        });
        
        // Real-time validation
        this.form.addEventListener('input', (e) => {
            this.validateField(e.target);
        });
        
        this.form.addEventListener('blur', (e) => {
            this.validateField(e.target);
        }, true);
    }
    
    validate() {
        this.errors = {};
        let isValid = true;
        
        Object.keys(this.rules).forEach(fieldName => {
            const field = this.form.querySelector(`[name="${fieldName}"]`);
            if (field && !this.validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    validateField(field) {
        const fieldName = field.name;
        const rules = this.rules[fieldName];
        const value = field.value.trim();
        
        if (!rules) return true;
        
        let isValid = true;
        let errorMessage = '';
        
        // Required validation
        if (rules.required && !value) {
            isValid = false;
            errorMessage = `${fieldName} is required`;
        }
        
        // Email validation
        if (rules.email && value && !this.isValidEmail(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
        
        // Min length validation
        if (rules.minLength && value.length < rules.minLength) {
            isValid = false;
            errorMessage = `${fieldName} must be at least ${rules.minLength} characters`;
        }
        
        // Max length validation
        if (rules.maxLength && value.length > rules.maxLength) {
            isValid = false;
            errorMessage = `${fieldName} must not exceed ${rules.maxLength} characters`;
        }
        
        // Pattern validation
        if (rules.pattern && value && !rules.pattern.test(value)) {
            isValid = false;
            errorMessage = rules.message || `${fieldName} is not valid`;
        }
        
        this.showFieldError(field, isValid, errorMessage);
        
        if (!isValid) {
            this.errors[fieldName] = errorMessage;
        } else {
            delete this.errors[fieldName];
        }
        
        return isValid;
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    showFieldError(field, isValid, errorMessage) {
        const errorElement = field.parentNode.querySelector('.field-error');
        
        if (!isValid) {
            field.classList.add('error');
            if (errorElement) {
                errorElement.textContent = errorMessage;
            } else {
                const error = document.createElement('div');
                error.className = 'field-error';
                error.textContent = errorMessage;
                field.parentNode.appendChild(error);
            }
        } else {
            field.classList.remove('error');
            if (errorElement) {
                errorElement.remove();
            }
        }
    }
}

// Lazy Loading Component
class LazyLoader {
    constructor() {
        this.images = document.querySelectorAll('img[data-src]');
        this.init();
    }
    
    init() {
        if ('IntersectionObserver' in window) {
            this.setupIntersectionObserver();
        } else {
            this.loadAllImages();
        }
    }
    
    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '50px'
        });
        
        this.images.forEach(img => observer.observe(img));
    }
    
    loadImage(img) {
        const src = img.getAttribute('data-src');
        if (src) {
            img.src = src;
            img.classList.add('loaded');
            img.removeAttribute('data-src');
        }
    }
    
    loadAllImages() {
        this.images.forEach(img => this.loadImage(img));
    }
}

// Initialize components when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize galleries
    const galleries = document.querySelectorAll('.hotel-gallery');
    galleries.forEach(gallery => new ImageGallery(gallery));
    
    // Initialize tabs
    const tabsContainers = document.querySelectorAll('.tabs-container');
    tabsContainers.forEach(container => new Tabs(container));
    
    // Initialize accordions
    const accordions = document.querySelectorAll('.accordion');
    accordions.forEach(accordion => new Accordion(accordion));
    
    // Initialize modals
    const modalTriggers = document.querySelectorAll('[data-modal]');
    modalTriggers.forEach(trigger => new Modal(trigger));
    
    // Initialize lazy loading
    new LazyLoader();
});

// Export components for use in other files
window.Components = {
    ImageGallery,
    Tabs,
    Accordion,
    Modal,
    LoadingSpinner,
    FormValidator,
    LazyLoader
};