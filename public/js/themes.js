// Theme management
const ThemeManager = {
    // Current theme state
    currentTheme: 'neutral',
    
    // Initialize theme system
    init() {
        // Load saved theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            this.applyTheme(savedTheme, true);
        }
        
        // Add event listeners for theme buttons
        document.querySelectorAll('.gender-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const gender = btn.dataset.gender;
                this.previewTheme(gender);
            });
        });
        
        // Add event listener for theme persistence after login
        document.addEventListener('userLoggedIn', (e) => {
            const { gender } = e.detail;
            if (gender) {
                this.applyTheme(gender, true);
            }
        });
    },
    
    // Apply theme permanently
    applyTheme(theme, persist = false) {
        if (!theme) return;
        
        this.currentTheme = theme;
        document.body.className = `theme-${theme}`;
        
        // Update button states
        document.querySelectorAll('.gender-btn').forEach(btn => {
            if (btn.dataset.gender === theme) {
                btn.classList.add('selected');
                btn.style.opacity = '1';
            } else {
                btn.classList.remove('selected');
                btn.style.opacity = '0.5';
            }
        });
        
        // Persist theme if requested
        if (persist) {
            localStorage.setItem('theme', theme);
        }
        
        // Dispatch theme change event
        document.dispatchEvent(new CustomEvent('themeChanged', { 
            detail: { theme } 
        }));
    },
    
    // Preview theme temporarily
    previewTheme(theme) {
        if (!theme) return;
        document.body.className = `theme-${theme}`;
    },
    
    // Get current theme
    getCurrentTheme() {
        return this.currentTheme;
    },
    
    // Reset theme to neutral
    resetTheme() {
        this.applyTheme('neutral', true);
    }
};

// Initialize theme system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.init();
}); 