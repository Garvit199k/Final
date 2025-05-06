// UI Section Management
function showLanding() {
    document.getElementById('landing-section').classList.remove('hidden');
    document.getElementById('auth-section').classList.add('hidden');
    document.getElementById('game-section').classList.add('hidden');
}

function showLoginForm() {
    document.getElementById('landing-section').classList.add('hidden');
    document.getElementById('auth-section').classList.remove('hidden');
    document.getElementById('login-form').classList.remove('hidden');
    document.getElementById('register-form').classList.add('hidden');
    document.getElementById('auth-title').textContent = 'Login';
}

function showRegisterForm() {
    document.getElementById('landing-section').classList.add('hidden');
    document.getElementById('auth-section').classList.remove('hidden');
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('register-form').classList.remove('hidden');
    document.getElementById('auth-title').textContent = 'Register';
}

function showTypingTest() {
    document.querySelectorAll('.game-container').forEach(container => {
        container.classList.add('hidden');
    });
    document.getElementById('typing-test').classList.remove('hidden');
}

function showDogRescue() {
    document.querySelectorAll('.game-container').forEach(container => {
        container.classList.add('hidden');
    });
    document.getElementById('dog-rescue').classList.remove('hidden');
}

function showLeaderboard() {
    document.querySelectorAll('.game-container').forEach(container => {
        container.classList.add('hidden');
    });
    document.getElementById('leaderboard').classList.remove('hidden');
}

function showAbout() {
    document.querySelectorAll('.game-container').forEach(container => {
        container.classList.add('hidden');
    });
    document.getElementById('about').classList.remove('hidden');
}

// Preview theme without applying it permanently
function previewTheme(gender) {
    document.body.className = `theme-${gender}`;
} 