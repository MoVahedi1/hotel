// ===================================
// Booking System Components
// ===================================

class BookingSystem {
    constructor() {
        this.searchData = this.loadSearchData();
        this.selectedHotel = null;
        this.selectedRoom = null;
        this.init();
    }
    
    init() {
        this.setupSearchForms();
        this.setupRoomSelection();
        this.setupGuestCounters();
        this.setupDatePickers();
        this.setupPriceCalculations();
    }
    
    loadSearchData() {
        const data = localStorage.getItem('searchData');
        return data ? JSON.parse(data) : {
            checkin: '',
            checkout: '',
            adults: 2,
            children: 0,
            rooms: 1
        };
    }
    
    setupSearchForms() {
        const searchForms = document.querySelectorAll('.search-form, .booking-form');
        
        searchForms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSearchSubmit(form);
            });
        });
    }
    
    handleSearchSubmit(form) {
        const formData = new FormData(form);
        const searchData = {
            checkin: formData.get('checkin') || document.getElementById('checkin')?.value,
            checkout: formData.get('checkout') || document.getElementById('checkout')?.value,
            adults: document.getElementById('adults-count')?.textContent || 2,
            children: document.getElementById('children-count')?.textContent || 0,
            rooms: document.getElementById('rooms-count')?.textContent || 1
        };
        
        // Validate dates
        if (!this.validateDates(searchData.checkin, searchData.checkout)) {
            this.showErrorMessage('Please select valid dates');
            return;
        }
        
        // Save search data
        localStorage.setItem('searchData', JSON.stringify(searchData));
        
        // Redirect if needed
        if (form.classList.contains('search-form')) {
            window.location.href = 'pages/search.html';
        } else {
            this.processBooking(searchData);
        }
    }
    
    validateDates(checkin, checkout) {
        if (!checkin || !checkout) return false;
        
        const checkinDate = new Date(checkin);
        const checkoutDate = new Date(checkout);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        return checkinDate >= today && checkoutDate > checkinDate;
    }
    
    setupRoomSelection() {
        const roomCards = document.querySelectorAll('.room-card');
        
        roomCards.forEach(card => {
            const selectBtn = card.querySelector('.select-room-btn');
            if (selectBtn) {
                selectBtn.addEventListener('click', () => {
                    this.selectRoom(card);
                });
            }
        });
    }
    
    selectRoom(roomCard) {
        // Remove previous selection
        document.querySelectorAll('.room-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // Add selection to current room
        roomCard.classList.add('selected');
        
        // Get room data
        const roomId = roomCard.getAttribute('data-room-id');
        const roomPrice = roomCard.getAttribute('data-room-price');
        
        this.selectedRoom = {
            id: roomId,
            price: parseFloat(roomPrice)
        };
        
        // Update booking summary
        this.updateBookingSummary();
    }
    
    setupGuestCounters() {
        const counterBtns = document.querySelectorAll('.counter-btn');
        
        counterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.getAttribute('data-target');
                const countElement = document.getElementById(`${target}-count`);
                let count = parseInt(countElement.textContent);
                
                if (btn.classList.contains('plus')) {
                    count++;
                } else if (btn.classList.contains('minus') && count > 0) {
                    count--;
                }
                
                countElement.textContent = count;
                this.updateGuestText();
                this.updateBookingSummary();
            });
        });
    }
    
    updateGuestText() {
        const adults = document.getElementById('adults-count')?.textContent || 2;
        const children = document.getElementById('children-count')?.textContent || 0;
        const rooms = document.getElementById('rooms-count')?.textContent || 1;
        
        const guestText = document.getElementById('guest-text');
        if (guestText) {
            const totalGuests = parseInt(adults) + parseInt(children);
            const lang = document.documentElement.lang;
            
            let text;
            if (lang === 'ar') {
                text = `${totalGuests} ${totalGuests === 1 ? 'ضيف' : 'ضيوف'}, ${rooms} ${rooms === '1' ? 'غرفة' : 'غرف'}`;
            } else {
                text = `${totalGuests} ${totalGuests === 1 ? 'Guest' : 'Guests'}, ${rooms} ${rooms === '1' ? 'Room' : 'Rooms'}`;
            }
            
            guestText.textContent = text;
        }
    }
    
    setupDatePickers() {
        const dateInputs = document.querySelectorAll('input[type="date"]');
        
        dateInputs.forEach(input => {
            // Set minimum date to today
            const today = new Date().toISOString().split('T')[0];
            input.min = today;
            
            // Add change event listener
            input.addEventListener('change', () => {
                this.updateDateConstraints();
                this.updateBookingSummary();
            });
        });
        
        this.updateDateConstraints();
    }
    
    updateDateConstraints() {
        const checkinInput = document.getElementById('checkin');
        const checkoutInput = document.getElementById('checkout');
        
        if (checkinInput && checkoutInput) {
            const checkinDate = checkinInput.value;
            if (checkinDate) {
                const minCheckout = new Date(checkinDate);
                minCheckout.setDate(minCheckout.getDate() + 1);
                checkoutInput.min = minCheckout.toISOString().split('T')[0];
            }
        }
    }
    
    setupPriceCalculations() {
        // Calculate total price when dates or room selection changes
        const priceElements = document.querySelectorAll('[data-price]');
        
        priceElements.forEach(element => {
            element.addEventListener('change', () => {
                this.updateBookingSummary();
            });
        });
    }
    
    updateBookingSummary() {
        const summaryElement = document.getElementById('booking-summary');
        if (!summaryElement) return;
        
        const checkin = document.getElementById('checkin')?.value;
        const checkout = document.getElementById('checkout')?.value;
        const nights = this.calculateNights(checkin, checkout);
        const roomPrice = this.selectedRoom?.price || 0;
        const total = roomPrice * nights;
        
        summaryElement.innerHTML = `
            <div class="summary-item">
                <span>Room Price:</span>
                <span>$${roomPrice} per night</span>
            </div>
            <div class="summary-item">
                <span>Number of Nights:</span>
                <span>${nights}</span>
            </div>
            <div class="summary-item">
                <span>Subtotal:</span>
                <span>$${roomPrice * nights}</span>
            </div>
            <div class="summary-item">
                <span>Taxes & Fees:</span>
                <span>$${(roomPrice * nights * 0.15).toFixed(2)}</span>
            </div>
            <div class="summary-total">
                <span>Total:</span>
                <span>$${(total * 1.15).toFixed(2)}</span>
            </div>
        `;
    }
    
    calculateNights(checkin, checkout) {
        if (!checkin || !checkout) return 0;
        
        const checkinDate = new Date(checkin);
        const checkoutDate = new Date(checkout);
        const diffTime = Math.abs(checkoutDate - checkinDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        return diffDays;
    }
    
    processBooking(searchData) {
        if (!this.selectedRoom) {
            this.showErrorMessage('Please select a room');
            return;
        }
        
        // Create booking object
        const booking = {
            id: this.generateBookingId(),
            hotel: this.selectedHotel,
            room: this.selectedRoom,
            ...searchData,
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        
        // Save booking
        this.saveBooking(booking);
        
        // Redirect to checkout
        localStorage.setItem('currentBooking', JSON.stringify(booking));
        window.location.href = 'pages/checkout.html';
    }
    
    generateBookingId() {
        return 'BK' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();
    }
    
    saveBooking(booking) {
        let bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        bookings.push(booking);
        localStorage.setItem('bookings', JSON.stringify(bookings));
    }
    
    showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #DC3545;
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            z-index: 9999;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
    }
}

// Price Filter Component
class PriceFilter {
    constructor() {
        this.minPrice = 0;
        this.maxPrice = 500;
        this.currentMin = 0;
        this.currentMax = 500;
        this.init();
    }
    
    init() {
        this.setupSlider();
        this.setupInputs();
    }
    
    setupSlider() {
        const slider = document.getElementById('price-slider');
        if (!slider) return;
        
        const minThumb = slider.querySelector('.slider-thumb.min');
        const maxThumb = slider.querySelector('.slider-thumb.max');
        const range = slider.querySelector('.slider-range');
        
        let isDragging = null;
        
        const updateSlider = () => {
            const percentMin = (this.currentMin / this.maxPrice) * 100;
            const percentMax = (this.currentMax / this.maxPrice) * 100;
            
            range.style.left = percentMin + '%';
            range.style.width = (percentMax - percentMin) + '%';
            
            minThumb.style.left = percentMin + '%';
            maxThumb.style.left = percentMax + '%';
        };
        
        const handleMouseMove = (e) => {
            if (!isDragging) return;
            
            const rect = slider.getBoundingClientRect();
            const percent = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
            const value = Math.round((percent / 100) * this.maxPrice);
            
            if (isDragging === 'min') {
                this.currentMin = Math.min(value, this.currentMax - 50);
            } else {
                this.currentMax = Math.max(value, this.currentMin + 50);
            }
            
            document.getElementById('min-price').value = this.currentMin;
            document.getElementById('max-price').value = this.currentMax;
            
            updateSlider();
        };
        
        minThumb.addEventListener('mousedown', () => isDragging = 'min');
        maxThumb.addEventListener('mousedown', () => isDragging = 'max');
        
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', () => isDragging = null);
        
        updateSlider();
    }
    
    setupInputs() {
        const minInput = document.getElementById('min-price');
        const maxInput = document.getElementById('max-price');
        
        if (minInput) {
            minInput.addEventListener('change', (e) => {
                this.currentMin = Math.max(0, Math.min(parseInt(e.target.value) || 0, this.currentMax - 50));
                e.target.value = this.currentMin;
                this.setupSlider();
            });
        }
        
        if (maxInput) {
            maxInput.addEventListener('change', (e) => {
                this.currentMax = Math.max(this.currentMin + 50, parseInt(e.target.value) || this.maxPrice);
                e.target.value = this.currentMax;
                this.setupSlider();
            });
        }
    }
    
    getValues() {
        return {
            min: this.currentMin,
            max: this.currentMax
        };
    }
}

// Initialize booking system
const bookingSystem = new BookingSystem();
const priceFilter = new PriceFilter();

// Export for use in other files
window.BookingSystem = bookingSystem;
window.PriceFilter = priceFilter;