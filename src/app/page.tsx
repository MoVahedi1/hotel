'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';

export default function Home() {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [hotels, setHotels] = useState([]);
  const [translations, setTranslations] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchData, setSearchData] = useState({
    checkin: '',
    checkout: '',
    guests: '2 Adults, 1 Room',
    adults: 2,
    children: 0,
    rooms: 1
  });
  const [guestDropdownOpen, setGuestDropdownOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');
  const [favorites, setFavorites] = useState([]);
  const [priceRange, setPriceRange] = useState([100, 500]);
  const [selectedRating, setSelectedRating] = useState(0);
  const dropdownRef = useRef(null);
  const heroRef = useRef(null);
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll();
  const headerY = useTransform(scrollYProgress, [0, 0.2], [0, -100]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const scale = useSpring(scrollYProgress, { stiffness: 100, damping: 20 });

  const heroSlides = [
    {
      image: "/assets/images/hotels/hotel1-hero.jpg",
      title: "Experience Luxury Redefined",
      subtitle: "Discover extraordinary hotels where every detail tells a story of excellence",
      description: "Immerse yourself in world-class accommodations with unparalleled service",
      cta: "Explore Collection"
    },
    {
      image: "/assets/images/hotels/hotel2-hero.jpg", 
      title: "Your Journey Begins Here",
      subtitle: "Unlock exclusive access to the world's most prestigious destinations",
      description: "From tropical paradises to urban sanctuaries, find your perfect escape",
      cta: "Discover More"
    },
    {
      image: "/assets/images/hotels/hotel3-hero.jpg",
      title: "Beyond Expectations",
      subtitle: "Where luxury meets innovation in perfect harmony",
      description: "Experience the future of hospitality with cutting-edge amenities",
      cta: "Start Journey"
    }
  ];

  // Enhanced mouse tracking for 3D effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 2;
      const y = (clientY / window.innerHeight - 0.5) * 2;
      setMousePosition({ x, y });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      // Update active section based on scroll position
      const sections = ['hero', 'deals', 'testimonials', 'destinations'];
      const scrollPosition = window.scrollY + 100;
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    // Load data with enhanced error handling
    const loadData = async () => {
      try {
        const [hotelsResponse, translationsResponse] = await Promise.all([
          fetch('/data/hotels.json'),
          fetch('/data/translations.json')
        ]);
        
        if (!hotelsResponse.ok || !translationsResponse.ok) {
          throw new Error('Failed to load data');
        }
        
        const [hotelsData, translationsData] = await Promise.all([
          hotelsResponse.json(),
          translationsResponse.json()
        ]);
        
        setHotels(hotelsData);
        setTranslations(translationsData);
      } catch (error) {
        console.error('Error loading data:', error);
        // Set fallback data
        setHotels([]);
        setTranslations({});
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setGuestDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Set default dates with enhanced logic
  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    setSearchData(prev => ({
      ...prev,
      checkin: tomorrow.toISOString().split('T')[0],
      checkout: nextWeek.toISOString().split('T')[0]
    }));
  }, []);

  // Auto-advance hero slider with pause on hover
  useEffect(() => {
    const interval = setInterval(() => {
      if (!guestDropdownOpen) {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
      }
    }, 6000);

    return () => clearInterval(interval);
  }, [guestDropdownOpen]);

  const t = useCallback((key) => {
    const keys = key.split('.');
    let value = translations[currentLanguage];
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  }, [translations, currentLanguage]);

  const handleGuestChange = (type, change) => {
    setSearchData(prev => {
      const newData = { ...prev };
      if (type === 'adults') {
        newData.adults = Math.max(1, prev.adults + change);
      } else if (type === 'children') {
        newData.children = Math.max(0, prev.children + change);
      } else if (type === 'rooms') {
        newData.rooms = Math.max(1, prev.rooms + change);
      }
      
      const totalGuests = newData.adults + newData.children;
      newData.guests = `${totalGuests} ${totalGuests === 1 ? 'Guest' : 'Guests'}, ${newData.rooms} ${newData.rooms === '1' ? 'Room' : 'Rooms'}`;
      
      return newData;
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate enhanced search with AI recommendations
    setTimeout(() => {
      setIsLoading(false);
      console.log('AI-powered search with:', searchData);
    }, 2000);
  };

  const toggleFavorite = (hotelId) => {
    setFavorites(prev => 
      prev.includes(hotelId) 
        ? prev.filter(id => id !== hotelId)
        : [...prev, hotelId]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center overflow-hidden">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-3xl opacity-50 animate-pulse"></div>
          <div className="relative text-center">
            <div className="relative w-32 h-32 mx-auto mb-8">
              <div className="absolute inset-0 border-4 border-blue-200/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
              <div className="absolute inset-2 border-4 border-transparent border-t-purple-600 rounded-full animate-spin animation-delay-150"></div>
              <div className="absolute inset-4 border-4 border-transparent border-pink-600 rounded-full animate-spin animation-delay-300"></div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Crafting Your Experience
            </h2>
            <p className="text-gray-300 text-lg">Preparing luxury accommodations...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{t('brand.name')} - Experience Luxury Redefined</title>
        <meta name="description" content="Discover extraordinary hotels where every detail tells a story of excellence. Experience luxury redefined with AI-powered recommendations." />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@400;700;900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden" ref={containerRef}>
        {/* Enhanced 3D Header with Parallax */}
        <motion.header 
          className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-2xl"
          style={{ y: headerY, opacity: headerOpacity }}
        >
          <nav className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <motion.div 
                className="flex items-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <a href="/" className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 flex items-center group">
                  <motion.i 
                    className="fas fa-hotel mr-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  />
                  {t('brand.name')}
                </a>
              </motion.div>
              
              <div className="hidden xl:flex items-center space-x-10">
                {['Home', 'Hotels', 'Deals', 'About', 'Contact'].map((item, index) => (
                  <motion.a
                    key={item}
                    href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                    className="relative text-gray-700 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 font-medium transition-all duration-300 group"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {item}
                    <motion.div
                      className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"
                      initial={{ width: 0 }}
                      whileHover={{ width: '100%' }}
                    />
                  </motion.a>
                ))}
              </div>
              
              <div className="flex items-center space-x-4">
                <motion.button 
                  onClick={() => setCurrentLanguage(currentLanguage === 'en' ? 'ar' : 'en')}
                  className="group relative px-6 py-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl hover:from-blue-100 hover:to-purple-100 transition-all duration-300 font-medium border border-blue-100/50"
                  whileHover={{ scale: 1.05, rotate: [0, 5, -5, 0] }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  <i className="fas fa-globe text-blue-600 mr-2 group-hover:rotate-12 transition-transform duration-300"></i>
                  <span className="font-semibold text-gray-700">{currentLanguage.toUpperCase()}</span>
                </motion.button>
                
                <motion.a 
                  href="/login" 
                  className="px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all duration-300 font-semibold relative overflow-hidden group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="absolute inset-0 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  <span className="relative z-10">Login</span>
                </motion.a>
                
                <motion.a 
                  href="/register" 
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-2xl hover:shadow-2xl transition-all duration-300 font-bold relative overflow-hidden group"
                  whileHover={{ scale: 1.05, rotate: [0, 2, -2, 0] }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                  <span className="relative z-10">Register</span>
                </motion.a>
              </div>
            </div>
          </nav>
        </motion.header>

        {/* Cinematic Hero Section with 3D Effects */}
        <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden" ref={heroRef}>
          <div className="absolute inset-0">
            {heroSlides.map((slide, index) => (
              <motion.div
                key={index}
                className={`absolute inset-0 ${index === currentSlide ? 'z-10' : 'z-0'}`}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ 
                  opacity: index === currentSlide ? 1 : 0,
                  scale: index === currentSlide ? 1 : 1.1
                }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              >
                <div 
                  className="w-full h-full bg-cover bg-center"
                  style={{ 
                    backgroundImage: `url("${slide.image}")`,
                    transform: `perspective(1000px) rotateY(${mousePosition.x * 5}deg) rotateX(${-mousePosition.y * 5}deg) scale(1.1)`
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Floating particles for enhanced visual effect */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white/20 rounded-full"
                animate={{
                  x: [0, Math.random() * 100 - 50],
                  y: [0, Math.random() * 100 - 50],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: Math.random() * 5 + 5,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                }}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              />
            ))}
          </div>
          
          <motion.div 
            className="relative z-20 container mx-auto px-6 text-center text-white max-w-6xl"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <motion.h1 
              className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7 }}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-200 to-purple-200">
                {heroSlides[currentSlide].title}
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl lg:text-3xl mb-4 text-gray-200 font-light leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.9 }}
            >
              {heroSlides[currentSlide].subtitle}
            </motion.p>
            
            <motion.p 
              className="text-lg md:text-xl mb-8 text-gray-300 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.1 }}
            >
              {heroSlides[currentSlide].description}
            </motion.p>
            
            <motion.div 
              className="flex flex-wrap gap-6 justify-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.3 }}
            >
              <motion.button 
                className="px-10 py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl hover:shadow-2xl transition-all duration-300 font-bold text-xl relative overflow-hidden group"
                whileHover={{ scale: 1.05, rotate: [0, 2, -2, 0] }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                <span className="relative z-10 flex items-center">
                  <i className="fas fa-rocket mr-3"></i>
                  {heroSlides[currentSlide].cta}
                </span>
              </motion.button>
              
              <motion.button 
                className="px-10 py-5 bg-white/10 backdrop-blur-md border-2 border-white/30 rounded-2xl hover:bg-white/20 transition-all duration-300 font-bold text-xl relative overflow-hidden group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="absolute inset-0 bg-white/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                <span className="relative z-10 flex items-center">
                  <i className="fas fa-play-circle mr-3"></i>
                  Watch Video
                </span>
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Enhanced Search Form with Glassmorphism */}
          <motion.div 
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent pt-32 pb-12"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.5 }}
          >
            <div className="container mx-auto px-6">
              <motion.div 
                className="bg-white/10 backdrop-blur-2xl rounded-3xl p-8 border border-white/20 shadow-2xl"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                  <motion.div 
                    className="space-y-3"
                    whileHover={{ scale: 1.02 }}
                  >
                    <label className="text-sm font-bold text-white/90 flex items-center uppercase tracking-wider">
                      <i className="fas fa-calendar-check mr-2 text-blue-400"></i>
                      {t('booking.checkIn')}
                    </label>
                    <input 
                      type="date" 
                      value={searchData.checkin}
                      onChange={(e) => setSearchData(prev => ({...prev, checkin: e.target.value}))}
                      className="w-full px-5 py-4 bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-2xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all duration-300 text-white placeholder-white/50"
                      required
                    />
                  </motion.div>
                  
                  <motion.div 
                    className="space-y-3"
                    whileHover={{ scale: 1.02 }}
                  >
                    <label className="text-sm font-bold text-white/90 flex items-center uppercase tracking-wider">
                      <i className="fas fa-calendar-times mr-2 text-purple-400"></i>
                      {t('booking.checkOut')}
                    </label>
                    <input 
                      type="date" 
                      value={searchData.checkout}
                      onChange={(e) => setSearchData(prev => ({...prev, checkout: e.target.value}))}
                      className="w-full px-5 py-4 bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-2xl focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 transition-all duration-300 text-white placeholder-white/50"
                      required
                    />
                  </motion.div>
                  
                  <motion.div className="space-y-3 relative" ref={dropdownRef}>
                    <label className="text-sm font-bold text-white/90 flex items-center uppercase tracking-wider">
                      <i className="fas fa-users mr-2 text-pink-400"></i>
                      {t('booking.guests')}
                    </label>
                    <motion.button
                      type="button"
                      onClick={() => setGuestDropdownOpen(!guestDropdownOpen)}
                      className="w-full px-5 py-4 bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-2xl focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-400/50 transition-all duration-300 text-left flex items-center justify-between hover:border-white/40"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="text-white font-medium">{searchData.guests}</span>
                      <motion.i 
                        className={`fas fa-chevron-${guestDropdownOpen ? 'up' : 'down'} text-white/60`}
                        animate={{ rotate: guestDropdownOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.button>
                    
                    <AnimatePresence>
                      {guestDropdownOpen && (
                        <motion.div 
                          className="absolute top-full left-0 right-0 mt-3 bg-white/95 backdrop-blur-2xl border-2 border-white/20 rounded-2xl shadow-2xl z-50 p-6"
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="space-y-4">
                            {[
                              { type: 'adults', label: t('booking.adults'), icon: 'fa-user' },
                              { type: 'children', label: t('booking.children'), icon: 'fa-child' },
                              { type: 'rooms', label: t('booking.rooms'), icon: 'fa-bed' }
                            ].map((item) => (
                              <div key={item.type} className="flex items-center justify-between">
                                <span className="font-semibold text-gray-800 flex items-center">
                                  <i className={`fas ${item.icon} mr-3 text-blue-600`}></i>
                                  {item.label}
                                </span>
                                <div className="flex items-center space-x-3">
                                  <motion.button 
                                    type="button" 
                                    onClick={() => handleGuestChange(item.type, -1)} 
                                    className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    <i className="fas fa-minus text-gray-600"></i>
                                  </motion.button>
                                  <span className="w-8 text-center font-bold text-lg text-gray-800">
                                    {searchData[item.type]}
                                  </span>
                                  <motion.button 
                                    type="button" 
                                    onClick={() => handleGuestChange(item.type, 1)} 
                                    className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white flex items-center justify-center transition-colors"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    <i className="fas fa-plus"></i>
                                  </motion.button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                  
                  <motion.div className="lg:col-span-2 flex items-end">
                    <motion.button 
                      type="submit" 
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-5 px-8 rounded-2xl hover:shadow-2xl transition-all duration-300 font-bold text-xl relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={{ scale: isLoading ? 1 : 1.02 }}
                      whileTap={{ scale: isLoading ? 1 : 0.98 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                      <span className="relative z-10 flex items-center justify-center">
                        {isLoading ? (
                          <>
                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                            AI Searching...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-search mr-3"></i>
                            {t('booking.search')}
                          </>
                        )}
                      </span>
                    </motion.button>
                  </motion.div>
                </form>
              </motion.div>
            </div>
          </motion.div>

          {/* Enhanced Slider Controls */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-30">
            {heroSlides.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'w-12 bg-gradient-to-r from-blue-600 to-purple-600' 
                    : 'w-3 bg-white/50 hover:bg-white/75'
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.8 }}
              />
            ))}
          </div>
        </section>

        {/* Enhanced Featured Deals with 3D Cards */}
        <section id="deals" className="py-24 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
          <div className="container mx-auto px-6">
            <motion.div 
              className="text-center mb-20"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl md:text-6xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
                {t('deals.title')}
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                {t('deals.subtitle')}
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {hotels.filter(hotel => hotel.discount).slice(0, 4).map((hotel, index) => (
                <motion.div
                  key={hotel.id}
                  className="group relative"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                >
                  <motion.div 
                    className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden"
                    whileHover={{ rotateY: 5, rotateX: -5 }}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <div className="relative h-64 overflow-hidden">
                      <motion.img 
                        src={`/assets/images/hotels/${hotel.images[0]}`} 
                        alt={hotel.name}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.7 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                      
                      {/* Enhanced badges */}
                      <div className="absolute top-4 left-4">
                        <motion.div 
                          className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg"
                          whileHover={{ scale: 1.1, rotate: [0, 5, -5, 0] }}
                        >
                          {hotel.discount}% OFF
                        </motion.div>
                      </div>
                      
                      <motion.div 
                        className="absolute top-4 right-4"
                        whileHover={{ scale: 1.2, rotate: 180 }}
                        transition={{ duration: 0.3 }}
                      >
                        <button 
                          onClick={() => toggleFavorite(hotel.id)}
                          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                            favorites.includes(hotel.id) 
                              ? 'bg-red-500 text-white' 
                              : 'bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white'
                          }`}
                        >
                          <i className={`fas fa-heart ${favorites.includes(hotel.id) ? '' : 'far'}`}></i>
                        </button>
                      </motion.div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="font-bold text-xl text-gray-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                          {hotel.name}
                        </h3>
                        <motion.div 
                          className="flex items-center bg-gradient-to-r from-yellow-400 to-orange-400 px-3 py-1 rounded-xl"
                          whileHover={{ scale: 1.1, rotate: [0, 10, -10, 0] }}
                        >
                          <i className="fas fa-star text-white text-sm mr-1"></i>
                          <span className="text-sm font-bold text-white">{hotel.rating}</span>
                        </motion.div>
                      </div>
                      
                      <div className="flex items-center text-gray-600 mb-6">
                        <i className="fas fa-map-marker-alt mr-2 text-blue-600"></i>
                        <span>{hotel.location.city}, {hotel.location.country}</span>
                      </div>
                      
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <div className="flex items-baseline">
                            <span className="text-3xl font-black text-blue-600">${hotel.price}</span>
                            <span className="text-lg text-gray-400 line-through ml-2">${hotel.originalPrice}</span>
                          </div>
                          <div className="text-sm font-semibold text-green-600">Save {hotel.discount}%</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex -space-x-3">
                          {hotel.amenities.slice(0, 3).map((amenity, i) => (
                            <motion.div 
                              key={i} 
                              className="w-10 h-10 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full flex items-center justify-center text-xs border-2 border-white shadow-md"
                              whileHover={{ scale: 1.2, rotate: 360 }}
                              transition={{ duration: 0.5 }}
                            >
                              {amenity === 'WiFi' && <i className="fas fa-wifi text-blue-600"></i>}
                              {amenity === 'Pool' && <i className="fas fa-swimming-pool text-blue-600"></i>}
                              {amenity === 'Spa' && <i className="fas fa-spa text-blue-600"></i>}
                            </motion.div>
                          ))}
                        </div>
                        
                        <motion.a 
                          href={`/hotel/${hotel.id}`} 
                          className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-6 py-3 rounded-2xl hover:shadow-xl transition-all duration-300 font-semibold relative overflow-hidden group"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                          <span className="relative z-10">View Deal</span>
                        </motion.a>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Testimonials with 3D Effects */}
        <section id="testimonials" className="py-24 bg-gradient-to-br from-white via-blue-50 to-purple-50">
          <div className="container mx-auto px-6">
            <motion.div 
              className="text-center mb-20"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl md:text-6xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600">
                {t('testimonials.title')}
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                {t('testimonials.subtitle')}
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Alexandra Chen",
                  title: "CEO, Tech Innovations",
                  avatar: "https://picsum.photos/seed/user1/150/150",
                  text: "Absolutely extraordinary! The attention to detail and personalized service exceeded all expectations. This is luxury redefined.",
                  rating: 5,
                  verified: true
                },
                {
                  name: "Marcus Williams", 
                  title: "Professional Photographer",
                  avatar: "https://picsum.photos/seed/user2/150/150",
                  text: "The most breathtaking hotel experience I've ever had. Every moment felt like a dream. Highly recommend to anyone seeking perfection.",
                  rating: 5,
                  verified: true
                },
                {
                  name: "Sophia Rodriguez",
                  title: "Fashion Designer", 
                  avatar: "https://picsum.photos/seed/user3/150/150",
                  text: "Stunning doesn't begin to describe it. The ambiance, service, and attention to detail created an unforgettable experience.",
                  rating: 5,
                  verified: true
                }
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  className="group"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <motion.div 
                    className="bg-gradient-to-br from-white via-blue-50 to-purple-50 p-8 rounded-3xl hover:shadow-2xl transition-all duration-500 border border-blue-100 relative overflow-hidden"
                    whileHover={{ y: -10, rotateY: 5 }}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-2xl"></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center mb-6">
                        <motion.img 
                          src={testimonial.avatar} 
                          alt={testimonial.name} 
                          className="w-16 h-16 rounded-2xl mr-4 border-3 border-white shadow-xl"
                          whileHover={{ scale: 1.1, rotate: 360 }}
                          transition={{ duration: 0.5 }}
                        />
                        <div>
                          <h4 className="font-bold text-xl text-gray-900">{testimonial.name}</h4>
                          <p className="text-gray-600">{testimonial.title}</p>
                        </div>
                      </div>
                      
                      <div className="flex text-yellow-400 mb-6">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <motion.i 
                            key={i} 
                            className="fas fa-star"
                            whileHover={{ scale: 1.2, rotate: 180 }}
                            transition={{ duration: 0.3 }}
                          />
                        ))}
                      </div>
                      
                      <p className="text-gray-700 italic leading-relaxed text-lg mb-6">
                        "{testimonial.text}"
                      </p>
                      
                      {testimonial.verified && (
                        <motion.div 
                          className="flex items-center text-blue-600 font-semibold"
                          whileHover={{ scale: 1.05 }}
                        >
                          <i className="fas fa-check-circle mr-2"></i>
                          Verified Guest
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Destinations with Parallax */}
        <section id="destinations" className="py-24 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
          {/* Background effects */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
          </div>
          
          <div className="container mx-auto px-6 relative z-10">
            <motion.div 
              className="text-center mb-20"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl md:text-6xl font-black mb-6 text-white">
                {t('destinations.title')}
              </h2>
              <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                {t('destinations.subtitle')}
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { name: "New York", country: "USA", hotels: 156, image: "hotel1-hero.jpg", description: "The city that never sleeps" },
                { name: "Miami", country: "USA", hotels: 89, image: "hotel2-hero.jpg", description: "Sun, sand, and sophistication" },
                { name: "Aspen", country: "USA", hotels: 67, image: "hotel3-hero.jpg", description: "Mountain paradise awaits" },
                { name: "San Francisco", country: "USA", hotels: 124, image: "hotel-spa.jpg", description: "Golden gate to luxury" },
                { name: "Lake Tahoe", country: "USA", hotels: 45, image: "hotel-restaurant.jpg", description: "Alpine beauty refined" },
                { name: "Scottsdale", country: "USA", hotels: 78, image: "hotel-gym.jpg", description: "Desert oasis luxury" }
              ].map((destination, index) => (
                <motion.div
                  key={index}
                  className="group relative cursor-pointer"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <motion.div 
                    className="relative h-80 overflow-hidden rounded-3xl"
                    whileHover={{ scale: 1.05, rotateY: 5 }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.img 
                      src={`/assets/images/hotels/${destination.image}`}
                      alt={destination.name}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.7 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    
                    {/* Hover overlay */}
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-t from-purple-600/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                    />
                    
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="flex items-center justify-between text-white">
                        <div>
                          <h3 className="text-2xl font-bold mb-2">{destination.name}</h3>
                          <p className="text-gray-300 text-sm mb-2">{destination.description}</p>
                          <p className="text-gray-300">{destination.hotels} Luxury Hotels</p>
                        </div>
                        <motion.div 
                          className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition-all duration-300"
                          whileHover={{ scale: 1.2, rotate: 360 }}
                          transition={{ duration: 0.5 }}
                        >
                          <i className="fas fa-arrow-right text-white text-xl"></i>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Footer with Glassmorphism */}
        <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white py-20 relative overflow-hidden">
          {/* Background decorations */}
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
          </div>
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
              <motion.div 
                className="lg:col-span-2"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center mb-8">
                  <motion.i 
                    className="fas fa-hotel text-3xl mr-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.5 }}
                  />
                  <h3 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                    {t('footer.about.title')}
                  </h3>
                </div>
                <p className="text-gray-300 mb-8 leading-relaxed text-lg">
                  {t('footer.about.description')}
                </p>
                <div className="flex space-x-4">
                  {[
                    { icon: 'fab fa-facebook-f', color: 'from-blue-600 to-blue-700' },
                    { icon: 'fab fa-twitter', color: 'from-blue-400 to-blue-500' },
                    { icon: 'fab fa-instagram', color: 'from-pink-600 to-purple-600' },
                    { icon: 'fab fa-linkedin-in', color: 'from-blue-700 to-blue-800' }
                  ].map((social, index) => (
                    <motion.a
                      key={index}
                      href="#"
                      className={`w-12 h-12 bg-gradient-to-r ${social.color} rounded-full flex items-center justify-center transition-all duration-300`}
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <i className={social.icon}></i>
                    </motion.a>
                  ))}
                </div>
              </motion.div>
              
              {[
                { title: t('footer.quickLinks.title'), links: ['About', 'Contact', 'FAQ', 'Blog'] },
                { title: t('footer.services.title'), links: ['Hotel Booking', 'Flight Booking', 'Car Rental', 'Travel Insurance'] }
              ].map((section, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <h4 className="text-xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                    {section.title}
                  </h4>
                  <ul className="space-y-4">
                    {section.links.map((link, i) => (
                      <motion.li key={i}>
                        <motion.a 
                          href="#" 
                          className="text-gray-300 hover:text-white transition-all duration-300 text-lg"
                          whileHover={{ x: 10 }}
                        >
                          {link}
                        </motion.a>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              ))}
              
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <h4 className="text-xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                  {t('footer.newsletter.title')}
                </h4>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  {t('footer.newsletter.description')}
                </p>
                <motion.form 
                  className="space-y-4"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <input 
                    type="email" 
                    placeholder={t('footer.newsletter.placeholder')}
                    className="w-full px-6 py-4 bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-2xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 text-white placeholder-gray-400 transition-all duration-300"
                  />
                  <motion.button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 py-4 rounded-2xl hover:shadow-2xl transition-all duration-300 font-bold text-lg relative overflow-hidden group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                    <span className="relative z-10">{t('footer.newsletter.subscribe')}</span>
                  </motion.button>
                </motion.form>
              </motion.div>
            </div>
            
            <motion.div 
              className="border-t border-white/20 mt-16 pt-8 text-center text-gray-400"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <p className="text-lg">&copy; 2024 {t('brand.name')}. {t('footer.allRights')}</p>
            </motion.div>
          </div>
        </footer>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@400;700;900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        html {
          scroll-behavior: smooth;
        }
        
        body {
          font-family: 'Inter', sans-serif;
          overflow-x: hidden;
        }
        
        .animation-delay-150 {
          animation-delay: 150ms;
        }
        
        .animation-delay-300 {
          animation-delay: 300ms;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 12px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 6px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
        }
        
        /* Selection */
        ::selection {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        
        /* Focus states */
        *:focus {
          outline: none;
        }
        
        *:focus-visible {
          outline: 2px solid #667eea;
          outline-offset: 2px;
        }
      `}</style>
    </>
  );
}