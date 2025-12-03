// ===================================
// Language Management
// ===================================

class LanguageManager {
    constructor() {
        this.currentLanguage = localStorage.getItem('language') || 'en';
        this.translations = {};
        this.init();
    }
    
    async init() {
        await this.loadTranslations();
        this.setupLanguageToggle();
        this.setLanguage(this.currentLanguage);
    }
    
    async loadTranslations() {
        try {
            const response = await fetch('./data/translations.json');
            this.translations = await response.json();
        } catch (error) {
            console.error('Error loading translations:', error);
        }
    }
    
    setupLanguageToggle() {
        const langToggle = document.getElementById('lang-toggle');
        if (langToggle) {
            langToggle.addEventListener('click', () => {
                this.toggleLanguage();
            });
        }
    }
    
    toggleLanguage() {
        this.currentLanguage = this.currentLanguage === 'en' ? 'ar' : 'en';
        this.setLanguage(this.currentLanguage);
    }
    
    setLanguage(lang) {
        this.currentLanguage = lang;
        localStorage.setItem('language', lang);
        
        // Update HTML attributes
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        
        // Update language button
        const langText = document.querySelector('.lang-text');
        if (langText) {
            langText.textContent = lang.toUpperCase();
        }
        
        // Update all translatable elements
        this.updateTranslations();
        
        // Update date formats
        this.updateDateFormats();
        
        // Update numbers
        this.updateNumbers();
    }
    
    updateTranslations() {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.getTranslation(key);
            
            if (translation) {
                if (element.tagName === 'INPUT' && element.type === 'email') {
                    element.placeholder = translation;
                } else if (element.tagName === 'INPUT' && element.placeholder) {
                    element.placeholder = translation;
                } else {
                    element.innerHTML = translation;
                }
            }
        });
    }
    
    getTranslation(key) {
        return key.split('.').reduce((obj, i) => obj && obj[i], this.translations[this.currentLanguage]);
    }
    
    updateDateFormats() {
        const dateElements = document.querySelectorAll('[data-date]');
        dateElements.forEach(element => {
            const date = element.getAttribute('data-date');
            element.textContent = this.formatDate(new Date(date));
        });
    }
    
    updateNumbers() {
        const numberElements = document.querySelectorAll('[data-number]');
        numberElements.forEach(element => {
            const number = parseFloat(element.getAttribute('data-number'));
            element.textContent = this.formatNumber(number);
        });
    }
    
    formatDate(date) {
        const options = {
            year: 'numeric',
            month: this.currentLanguage === 'ar' ? 'long' : 'long',
            day: 'numeric'
        };
        
        if (this.currentLanguage === 'ar') {
            return date.toLocaleDateString('ar-SA', options);
        } else {
            return date.toLocaleDateString('en-US', options);
        }
    }
    
    formatNumber(number) {
        if (this.currentLanguage === 'ar') {
            return number.toLocaleDateString('ar-SA');
        } else {
            return number.toLocaleDateString('en-US');
        }
    }
    
    translateText(key, params = {}) {
        let translation = this.getTranslation(key) || key;
        
        // Replace parameters in translation
        Object.keys(params).forEach(param => {
            translation = translation.replace(`{${param}}`, params[param]);
        });
        
        return translation;
    }
}

// Initialize language manager
const languageManager = new LanguageManager();

// Export for use in other files
window.LanguageManager = languageManager;