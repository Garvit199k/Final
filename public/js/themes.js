// Theme management
function applyTheme(gender) {
    document.body.className = `theme-${gender}`;
    localStorage.setItem('theme', gender);
}

// Preview theme
function previewTheme(gender) {
    document.body.className = `theme-${gender}`;
    
    // Update button states
    const maleBtn = document.querySelector('.male-theme');
    const femaleBtn = document.querySelector('.female-theme');
    
    if (gender === 'male') {
        maleBtn.classList.add('active');
        femaleBtn.classList.remove('active');
    } else {
        femaleBtn.classList.add('active');
        maleBtn.classList.remove('active');
    }
    
    // Save the theme preference
    localStorage.setItem('theme', gender);
}

// Initialize theme
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        applyTheme(savedTheme);
        
        // Update button states
        const activeBtn = document.querySelector(`.${savedTheme}-theme`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
    }

    // Add click handlers for theme buttons
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const gender = e.target.closest('.theme-btn').classList.contains('male-theme') ? 'male' : 'female';
            previewTheme(gender);
        });
    });
}); 