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

// Initialize UI
document.addEventListener('DOMContentLoaded', () => {
    // Add click handlers for navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const section = btn.dataset.section;
            if (section === 'typing-test') {
                showTypingTest();
            }
        });
    });
}); 