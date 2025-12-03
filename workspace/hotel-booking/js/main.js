// ===================================
// Main JavaScript File
// ===================================

// Global Variables
let currentLanguage = localStorage.getItem('language') || 'en';
let translations = {};
let hotels = [];

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize Application
function initializeApp() {
    loadTranslations();
    loadHotels();
    initializeNavigation();
    initializeLanguageSwitcher();
    initializeSearchForm();
    initializeGuestSelector();
    initializeHeroSlider();
    initializeTestimonials();
    loadFeaturedDeals();
    loadDestinations();
    initializeNewsletterForm();
    
    // Set initial language
    setLanguage(currentLanguage);
}

// Load Translations
async function loadTranslations() {
    try {
        const response = await fetch('./data/translations.json');
        translations = await response.json();
    } catch (error) {
        console.error('Error loading translations:', error);
    }
}

// Load Hotels Data
async function loadHotels() {
    try {
        const response = await fetch('./data/hotels.json');
        hotels = await response.json();
    } catch (error) {
        console.error('Error loading hotels:', error);
    }
}

// Initialize Navigation
function initializeNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }
}

// Initialize Language Switcher
function initializeLanguageSwitcher() {
    const langToggle = document.getElementById('lang-toggle');
    
    if (langToggle) {
        langToggle.addEventListener('click', function() {
            currentLanguage = currentLanguage === 'en' ? 'ar' : 'en';
            setLanguage(currentLanguage);
        });
    }
}

// Set Language
function setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    
    // Update HTML attributes
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    
    // Update language button text
    const langText = document.querySelector('.lang-text');
    if (langText) {
        langText.textContent = lang.toUpperCase();
    }
    
    // Update all translatable elements
    updateTranslations();
}

// Update Translations
function updateTranslations() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = getNestedTranslation(translations[currentLanguage], key);
        
        if (translation) {
            if (element.tagName === 'INPUT' && element.type === 'email') {
                element.placeholder = translation;
            } else {
                element.innerHTML = translation;
            }
        }
    });
}

// Get Nested Translation
function getNestedTranslation(obj, key) {
    return key.split('.').reduce((o, i) => o && o[i], obj);
}

// Initialize Search Form
function initializeSearchForm() {
    const searchForm = document.getElementById('search-form');
    
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(searchForm);
            const searchData = {
                checkin: formData.get('checkin'),
                checkout: formData.get('checkout'),
                adults: document.getElementById('adults-count').textContent,
                children: document.getElementById('children-count').textContent,
                rooms: document.getElementById('rooms-count').textContent
            };
            
            // Store search data and redirect
            localStorage.setItem('searchData', JSON.stringify(searchData));
            window.location.href = 'pages/search.html';
        });
        
        // Set default dates
        setDefaultDates();
    }
}

// Set Default Dates
function setDefaultDates() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const checkinInput = document.getElementById('checkin');
    const checkoutInput = document.getElementById('checkout');
    
    if (checkinInput) {
        checkinInput.valueAsDate = tomorrow;
        checkinInput.min = today.toISOString().split('T')[0];
    }
    
    if (checkoutInput) {
        checkoutInput.valueAsDate = nextWeek;
        checkoutInput.min = tomorrow.toISOString().split('T')[0];
    }
}

// Initialize Guest Selector
function initializeGuestSelector() {
    const guestBtn = document.getElementById('guest-btn');
    const guestDropdown = document.getElementById('guest-dropdown');
    const counterBtns = document.querySelectorAll('.counter-btn');
    
    if (guestBtn && guestDropdown) {
        guestBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            guestDropdown.classList.toggle('show');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function() {
            guestDropdown.classList.remove('show');
        });
        
        guestDropdown.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    
    // Counter buttons
    counterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            const countElement = document.getElementById(`${target}-count`);
            let count = parseInt(countElement.textContent);
            
            if (this.classList.contains('plus')) {
                count++;
            } else if (this.classList.contains('minus') && count > 0) {
                count--;
            }
            
            countElement.textContent = count;
            updateGuestText();
        });
    });
}

// Update Guest Text
function updateGuestText() {
    const adults = document.getElementById('adults-count').textContent;
    const children = document.getElementById('children-count').textContent;
    const rooms = document.getElementById('rooms-count').textContent;
    
    const guestText = document.getElementById('guest-text');
    if (guestText) {
        const totalGuests = parseInt(adults) + parseInt(children);
        let text = `${totalGuests} ${totalGuests === 1 ? 'Guest' : 'Guests'}, ${rooms} ${rooms === '1' ? 'Room' : 'Rooms'}`;
        
        if (currentLanguage === 'ar') {
            text = `${totalGuests} ${totalGuests === 1 ? 'ضيف' : 'ضيوف'}, ${rooms} ${rooms === '1' ? 'غرفة' : 'غرف'}`;
        }
        
        guestText.textContent = text;
    }
}

// Initialize Hero Slider
function initializeHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    const dotsContainer = document.getElementById('slider-dots');
    const prevBtn = document.getElementById('slider-prev');
    const nextBtn = document.getElementById('slider-next');
    
    if (slides.length === 0) return;
    
    let currentSlide = 0;
    
    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = `dot ${index === 0 ? 'active' : ''}`;
        dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
    
    const dots = dotsContainer.querySelectorAll('.dot');
    
    // Functions
    function goToSlide(slideIndex) {
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        
        currentSlide = slideIndex;
        
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }
    
    function nextSlide() {
        const nextIndex = (currentSlide + 1) % slides.length;
        goToSlide(nextIndex);
    }
    
    function prevSlide() {
        const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
        goToSlide(prevIndex);
    }
    
    // Event listeners
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    
    // Auto-play
    setInterval(nextSlide, 5000);
}

// Initialize Testimonials
function initializeTestimonials() {
    const testimonials = [
        {
            text: "Absolutely amazing stay! The staff was incredibly attentive and the room was spotless. The location is perfect for exploring Manhattan.",
            author: "John Smith",
            title: "Business Traveler",
            avatar: "https://picsum.photos/seed/user1/60/60"
        },
        {
            text: "Beautiful hotel with excellent amenities. The rooftop pool has stunning views. Would definitely stay here again.",
            author: "Emily Johnson",
            title: "Leisure Traveler",
            avatar: "https://picsum.photos/seed/user2/60/60"
        },
        {
            text: "Perfect location and luxurious rooms. The concierge service helped us plan amazing activities. Highly recommended!",
            author: "Michael Chen",
            title: "Family Vacation",
            avatar: "https://picsum.photos/seed/user3/60/60"
        }
    ];
    
    const track = document.getElementById('testimonial-track');
    const dotsContainer = document.getElementById('testimonial-dots');
    const prevBtn = document.getElementById('testimonial-prev');
    const nextBtn = document.getElementById('testimonial-next');
    
    if (!track) return;
    
    let currentTestimonial = 0;
    
    // Create testimonial cards
    testimonials.forEach((testimonial, index) => {
        const card = document.createElement('div');
        card.className = 'testimonial-card';
        card.innerHTML = `
            <div class="testimonial-content">
                <p class="testimonial-text">"${testimonial.text}"</p>
                <div class="testimonial-author">
                    <img src="${testimonial.avatar}" alt="${testimonial.author}" class="testimonial-avatar">
                    <div class="testimonial-info">
                        <h4>${testimonial.author}</h4>
                        <p class="testimonial-title">${testimonial.title}</p>
                        <div class="testimonial-rating">
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                        </div>
                    </div>
                </div>
            </div>
        `;
        track.appendChild(card);
    });
    
    const cards = track.querySelectorAll('.testimonial-card');
    
    // Create dots
    testimonials.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = `testimonial-dot ${index === 0 ? 'active' : ''}`;
        dot.setAttribute('aria-label', `Go to testimonial ${index + 1}`);
        dot.addEventListener('click', () => goToTestimonial(index));
        dotsContainer.appendChild(dot);
    });
    
    const dots = dotsContainer.querySelectorAll('.testimonial-dot');
    
    // Functions
    function goToTestimonial(index) {
        cards[currentTestimonial].style.display = 'none';
        dots[currentTestimonial].classList.remove('active');
        
        currentTestimonial = index;
        
        cards[currentTestimonial].style.display = 'block';
        dots[currentTestimonial].classList.add('active');
    }
    
    function nextTestimonial() {
        const nextIndex = (currentTestimonial + 1) % cards.length;
        goToTestimonial(nextIndex);
    }
    
    function prevTestimonial() {
        const prevIndex = (currentTestimonial - 1 + cards.length) % cards.length;
        goToTestimonial(prevIndex);
    }
    
    // Initialize
    cards.forEach((card, index) => {
        card.style.display = index === 0 ? 'block' : 'none';
    });
    
    // Event listeners
    if (prevBtn) prevBtn.addEventListener('click', prevTestimonial);
    if (nextBtn) nextBtn.addEventListener('click', nextTestimonial);
    
    // Auto-play
    setInterval(nextTestimonial, 6000);
}

// Load Featured Deals
function loadFeaturedDeals() {
    const dealsGrid = document.getElementById('deals-grid');
    if (!dealsGrid || hotels.length === 0) return;
    
    // Get first 4 hotels with discounts
    const featuredHotels = hotels.filter(hotel => hotel.discount).slice(0, 4);
    
    featuredHotels.forEach(hotel => {
        const dealCard = document.createElement('div');
        dealCard.className = 'deal-card';
        dealCard.innerHTML = `
            <div class="deal-image">
                <img src="./assets/images/hotels/${hotel.images[0]}" alt="${hotel.name}">
                <div class="deal-badge">${hotel.discount}% OFF</div>
            </div>
            <div class="deal-content">
                <h3 class="deal-title">${hotel.name}</h3>
                <div class="deal-location">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${hotel.location.city}, ${hotel.location.country}</span>
                </div>
                <div class="deal-pricing">
                    <div class="deal-price">$${hotel.price}</div>
                    <div class="deal-original">$${hotel.originalPrice}</div>
                    <div class="deal-savings">Save ${hotel.discount}%</div>
                </div>
                <div class="deal-features">
                    <span><i class="fas fa-wifi"></i> WiFi</span>
                    <span><i class="fas fa-swimming-pool"></i> Pool</span>
                    <span><i class="fas fa-spa"></i> Spa</span>
                </div>
                <div class="deal-footer">
                    <div class="deal-rating">
                        <div class="stars">
                            ${generateStars(hotel.rating)}
                        </div>
                        <span class="rating-text">${hotel.rating}</span>
                    </div>
                    <a href="pages/hotel-detail.html?id=${hotel.id}" class="btn btn-primary">View Deal</a>
                </div>
            </div>
        `;
        dealsGrid.appendChild(dealCard);
    });
}

// Load Destinations
function loadDestinations() {
    const destinations = [
        {
            name: "New York",
            country: "USA",
            hotels: 156,
            image: "hotel1-hero.jpg"
        },
        {
            name: "Miami",
            country: "USA", 
            hotels: 89,
            image: "hotel2-hero.jpg"
        },
        {
            name: "Aspen",
            country: "USA",
            hotels: 67,
            image: "hotel3-hero.jpg"
        },
        {
            name: "San Francisco",
            country: "USA",
            hotels: 124,
            image: "hotel-spa.jpg"
        },
        {
            name: "Lake Tahoe",
            country: "USA",
            hotels: 45,
            image: "hotel-restaurant.jpg"
        },
        {
            name: "Scottsdale",
            country: "USA",
            hotels: 78,
            image: "hotel-gym.jpg"
        }
    ];
    
    const destinationsGrid = document.getElementById('destinations-grid');
    if (!destinationsGrid) return;
    
    destinations.forEach(destination => {
        const destinationCard = document.createElement('div');
        destinationCard.className = 'destination-card';
        destinationCard.innerHTML = `
            <img src="./assets/images/hotels/${destination.image}" alt="${destination.name}" class="destination-image">
            <div class="destination-overlay">
                <h3 class="destination-name">${destination.name}</h3>
                <div class="destination-info">
                    <span><i class="fas fa-hotel"></i> ${destination.hotels} Hotels</span>
                    <span><i class="fas fa-map-marker-alt"></i> ${destination.country}</span>
                </div>
            </div>
        `;
        destinationsGrid.appendChild(destinationCard);
    });
}

// Generate Stars HTML
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let starsHTML = '';
    
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }
    
    return starsHTML;
}

// Initialize Newsletter Form
function initializeNewsletterForm() {
    const newsletterForm = document.getElementById('newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('input[type="email"]').value;
            
            // Show success message
            showNotification('Thank you for subscribing!', 'success');
            
            // Reset form
            this.reset();
        });
    }
}

// Show Notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '16px 24px',
        backgroundColor: type === 'success' ? '#28A745' : '#007BFF',
        color: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        zIndex: '9999',
        fontSize: '16px',
        fontWeight: '500',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease-in-out'
    });
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
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

function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(price);
}

function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(new Date(date));
}

// Export functions for use in other files
window.HotelBooking = {
    setLanguage,
    showNotification,
    formatPrice,
    formatDate,
    generateStars,
    hotels,
    currentLanguage
};