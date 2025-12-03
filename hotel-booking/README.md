# Luxury Hotel Booking Website

A comprehensive, bilingual hotel booking website built with vanilla HTML5, CSS3, and JavaScript. Features English and Arabic language support with RTL/LTR switching, responsive design, and modern UI/UX.

## 🌟 Features

### 🌐 Bilingual Support
- **English (LTR)** and **Arabic (RTL)** languages
- Seamless language switching
- Proper RTL layout support
- Localized content and date formats

### 📱 Responsive Design
- Mobile-first approach
- Tablet and desktop optimizations
- Touch-friendly interface
- Adaptive layouts for all screen sizes

### 🎨 Modern UI/UX
- Clean, professional design
- Smooth animations and transitions
- Interactive components
- Accessibility features (ARIA labels, keyboard navigation)

### 🔍 Search & Booking
- Advanced search filters
- Real-time availability
- Guest counter with adults/children/rooms
- Date picker with validation
- Price range slider

### 🏨 Hotel Features
- Image galleries with lightbox
- Room comparisons
- Star ratings and reviews
- Amenities display
- Location maps

### 💳 Booking Process
- Multi-step checkout
- Form validation
- Price calculations
- Booking confirmation

## 🚀 Quick Start

### Prerequisites
- Modern web browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Local web server (optional but recommended)

### Installation

1. **Clone or download the project**
   ```bash
   # If using git
   git clone <repository-url>
   cd hotel-booking
   
   # Or download and extract the ZIP file
   ```

2. **Set up a local server** (recommended)
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   
   # Using Live Server extension in VS Code
   Right-click index.html → "Open with Live Server"
   ```

3. **Open in browser**
   - With local server: `http://localhost:8000`
   - Without server: Open `index.html` directly (some features may be limited)

## 📁 Project Structure

```
hotel-booking/
├── index.html                 # Home page
├── pages/                     # Additional pages
│   ├── search.html           # Search results
│   ├── hotel-detail.html     # Hotel details
│   ├── login.html           # User login
│   ├── register.html        # User registration
│   ├── profile.html         # User dashboard
│   ├── about.html           # About us
│   ├── contact.html         # Contact page
│   ├── blog.html            # Blog listing
│   ├── blog-post.html       # Individual blog post
│   └── faq.html            # FAQ page
├── assets/                   # Static assets
│   ├── css/                 # Stylesheets
│   │   ├── main.css        # Main styles
│   │   ├── components.css  # Component styles
│   │   └── responsive.css  # Media queries
│   ├── js/                  # JavaScript files
│   │   ├── main.js         # Main functionality
│   │   ├── components.js   # Reusable components
│   │   ├── language.js     # Language system
│   │   ├── booking.js      # Booking functionality
│   │   └── utils.js       # Utility functions
│   └── images/              # Images
│       ├── hotels/          # Hotel images
│       ├── rooms/           # Room images
│       └── ui/              # UI elements
└── data/                    # Mock data
    ├── hotels.json          # Hotel data
    └── translations.json    # Language translations
```

## 🎯 Usage Guide

### Language Switching
- Click the language toggle in the navigation bar
- Switches between English (EN) and Arabic (AR)
- Page layout automatically adjusts for RTL/LTR

### Searching Hotels
1. Select check-in and check-out dates
2. Choose number of adults, children, and rooms
3. Click "Search Hotels"
4. Use filters to narrow results:
   - Price range slider
   - Star rating
   - Room type
   - Amenities

### Booking Process
1. Select a hotel from search results
2. Choose a room type
3. Review hotel details and amenities
4. Fill in guest information
5. Enter payment details
6. Confirm booking

### User Account
- Create an account or login
- View booking history
- Manage personal information
- Save favorite hotels

## 🛠️ Customization

### Adding New Hotels
Edit `data/hotels.json`:
```json
{
  "id": 7,
  "name": "New Hotel",
  "rating": 4.5,
  "location": {
    "city": "City Name",
    "country": "Country",
    "address": "Full Address"
  },
  "images": ["image1.jpg", "image2.jpg"],
  "price": 200,
  "amenities": ["WiFi", "Pool", "Gym"],
  "rooms": [...],
  "reviews": [...]
}
```

### Adding Translations
Edit `data/translations.json`:
```json
{
  "en": {
    "newKey": "English Translation"
  },
  "ar": {
    "newKey": "Arabic Translation"
  }
}
```

### Styling Customization
- Modify CSS variables in `assets/css/main.css`
- Colors, fonts, spacing are all customizable
- Responsive breakpoints in `assets/css/responsive.css`

## 🔧 Technical Details

### Technologies Used
- **HTML5**: Semantic markup, accessibility features
- **CSS3**: Flexbox, Grid, animations, custom properties
- **JavaScript ES6+**: Modern syntax, modules, async/await
- **No frameworks**: Pure vanilla implementation

### Key Features
- **Component-based architecture**: Reusable JavaScript components
- **CSS Grid/Flexbox**: Modern layout systems
- **CSS Custom Properties**: Consistent theming
- **Intersection Observer**: Lazy loading, animations
- **Local Storage**: User preferences, booking data
- **Form Validation**: Client-side validation with error handling

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Android Chrome)

## 📱 Responsive Breakpoints

- **Mobile**: < 576px
- **Tablet**: 576px - 991px
- **Desktop**: 992px - 1199px
- **Large Desktop**: ≥ 1200px

## 🎨 Design System

### Colors
- Primary Blue: #007BFF
- Accent Gold: #FFC107
- Success Green: #28A745
- Warning Yellow: #FFC107
- Danger Red: #DC3545

### Typography
- Primary Font: Inter
- Heading Font: Playfair Display
- Base Size: 16px
- Scale: 0.75rem to 3rem

### Spacing
- Based on 4px grid system
- Range: 4px to 80px
- Consistent margins and padding

## ♿ Accessibility Features

- Semantic HTML5 structure
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- Focus indicators
- Skip links
- Color contrast compliance
- Touch targets (44px minimum)

## 🚀 Performance Optimizations

- Lazy loading for images
- Debounced search inputs
- Throttled scroll events
- Optimized animations
- Minimal DOM manipulation
- Efficient event delegation

## 🔒 Security Considerations

- Input sanitization
- XSS prevention
- Form validation
- Secure data handling
- No sensitive data in localStorage

## 📝 License

This project is for demonstration purposes. Feel free to use and modify for your own projects.

## 🤝 Contributing

1. Fork the project
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For questions or issues:
- Check the browser console for errors
- Ensure all files are correctly linked
- Verify local server is running
- Test in different browsers

## 🎉 Enjoy!

This hotel booking website demonstrates modern web development practices with a focus on user experience, accessibility, and performance. Feel free to explore, modify, and learn from the code!