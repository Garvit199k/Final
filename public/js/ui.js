// UI state management
let currentSection = null;

// UI Section Management
function showLanding() {
    document.getElementById('landing-section').classList.remove('hidden');
    document.getElementById('auth-section').classList.add('hidden');
    document.getElementById('game-section').classList.add('hidden');
}

function showLoginForm() {
    document.getElementById('login-form').classList.remove('hidden');
    document.getElementById('register-form').classList.add('hidden');
    document.getElementById('auth-title').textContent = 'Login';
}

function showRegisterForm() {
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('register-form').classList.remove('hidden');
    document.getElementById('auth-title').textContent = 'Register';
}

// Show typing test section
function showTypingTest() {
    hideAllSections();
    document.getElementById('typing-test').classList.remove('hidden');
    currentSection = 'typing-test';
    updateActiveNavButton('typing-test');
    initTypingTest();
}

// Show dog rescue section
function showDogRescue() {
    hideAllSections();
    document.getElementById('dog-rescue').classList.remove('hidden');
    currentSection = 'dog-rescue';
    updateActiveNavButton('dog-rescue');
    initGame();
}

// Show leaderboard section
function showLeaderboard() {
    hideAllSections();
    document.getElementById('leaderboard').classList.remove('hidden');
    currentSection = 'leaderboard';
    updateActiveNavButton('leaderboard');
    showLeaderboardData('typing');
}

// Show about section
function showAbout() {
    hideAllSections();
    document.getElementById('about').classList.remove('hidden');
    currentSection = 'about';
    updateActiveNavButton('about');
}

// Helper function to hide all sections
function hideAllSections() {
    document.querySelectorAll('.game-container').forEach(container => {
        container.classList.add('hidden');
    });
}

// Update active navigation button
function updateActiveNavButton(sectionId) {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    const activeBtn = document.querySelector(`.nav-btn[data-section="${sectionId}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
}

// Apply theme based on gender
function applyTheme(gender) {
    document.body.className = `theme-${gender || 'neutral'}`;
    // Store theme preference
    localStorage.setItem('theme', gender);
}

// Preview theme without applying it permanently
function previewTheme(gender) {
    document.body.className = `theme-${gender}`;
}

// Initialize UI
document.addEventListener('DOMContentLoaded', () => {
    // Add click handlers for navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const section = btn.dataset.section;
            switch (section) {
                case 'typing-test':
                    showTypingTest();
                    break;
                case 'dog-rescue':
                    showDogRescue();
                    break;
                case 'leaderboard':
                    showLeaderboard();
                    break;
                case 'about':
                    showAbout();
                    break;
            }
        });
    });

    // Apply stored theme if available
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
        applyTheme(storedTheme);
    }
}); 