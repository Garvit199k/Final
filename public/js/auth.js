// Global variables
let currentUser = null;
let selectedGender = null;
const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:3000' : '';

// Add event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add click handlers for auth buttons
    document.getElementById('register-btn')?.addEventListener('click', register);
    document.getElementById('login-btn')?.addEventListener('click', login);
    
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
        const gender = localStorage.getItem('gender');
        const username = localStorage.getItem('username');
        handleLoginSuccess({ token, gender, username });
    } else {
        showLanding();
    }
});

// Helper function to show error message
function showError(formId, message) {
    const errorDiv = document.querySelector(`#${formId} .error-message`);
    if (!errorDiv) {
        const div = document.createElement('div');
        div.className = 'error-message';
        document.getElementById(formId).appendChild(div);
    }
    errorDiv.textContent = message;
    errorDiv.classList.add('visible');
    setTimeout(() => {
        errorDiv.classList.remove('visible');
    }, 3000);
}

// Helper function to toggle loading state
function toggleLoading(buttonId, isLoading) {
    const button = document.getElementById(buttonId);
    if (isLoading) {
        button.disabled = true;
        button.innerHTML = '<span class="loading"></span> Processing...';
    } else {
        button.disabled = false;
        button.innerHTML = buttonId === 'login-btn' ? 'Login' : 'Register';
    }
}

// Gender selection
function selectGender(gender) {
    selectedGender = gender;
    document.querySelectorAll('.gender-btn').forEach(btn => {
        if (btn.dataset.gender === gender) {
            btn.classList.add('selected');
            btn.style.opacity = '1';
        } else {
            btn.classList.remove('selected');
            btn.style.opacity = '0.5';
        }
    });
}

// Registration
async function register(e) {
    e?.preventDefault();
    const username = document.getElementById('register-username').value.trim();
    const password = document.getElementById('register-password').value;

    if (!username || !password) {
        showError('register-form', 'Please fill in all fields');
        return;
    }

    if (!selectedGender) {
        showError('register-form', 'Please select a gender');
        return;
    }

    toggleLoading('register-btn', true);

    try {
        const response = await fetch(`${API_URL}/api/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ username, password, gender: selectedGender })
        });

        const data = await response.json();

        if (response.ok) {
            // Show success message
            const successDiv = document.createElement('div');
            successDiv.className = 'success-message';
            successDiv.textContent = 'Registration successful! Redirecting to login...';
            document.getElementById('register-form').appendChild(successDiv);

            // Reset form
            document.getElementById('register-username').value = '';
            document.getElementById('register-password').value = '';
            selectedGender = null;
            document.querySelectorAll('.gender-btn').forEach(btn => {
                btn.classList.remove('selected');
                btn.style.opacity = '1';
            });

            // Switch to login form after 2 seconds
            setTimeout(() => {
                showLoginForm();
            }, 2000);
        } else {
            throw new Error(data.error || 'Registration failed');
        }
    } catch (error) {
        console.error('Registration error:', error);
        showError('register-form', error.message);
    } finally {
        toggleLoading('register-btn', false);
    }
}

// Login
async function login(e) {
    e?.preventDefault();
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;

    if (!username || !password) {
        showError('login-form', 'Please fill in all fields');
        return;
    }

    toggleLoading('login-btn', true);

    try {
        const response = await fetch(`${API_URL}/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            handleLoginSuccess({ ...data, username });
        } else {
            throw new Error(data.error || 'Invalid credentials');
        }
    } catch (error) {
        console.error('Login error:', error);
        showError('login-form', error.message);
    } finally {
        toggleLoading('login-btn', false);
    }
}

// Handle successful login
function handleLoginSuccess(data) {
    currentUser = {
        token: data.token,
        gender: data.gender,
        username: data.username
    };
    
    // Store auth data
    localStorage.setItem('token', data.token);
    localStorage.setItem('gender', data.gender);
    localStorage.setItem('username', data.username);

    // Show game section
    showGameSection();
}

// Show landing section
function showLanding() {
    document.getElementById('game-section').classList.add('hidden');
    document.getElementById('auth-section').classList.add('hidden');
    document.getElementById('landing-section').classList.remove('hidden');
}

// Show game section
function showGameSection() {
    document.getElementById('landing-section').classList.add('hidden');
    document.getElementById('auth-section').classList.add('hidden');
    document.getElementById('game-section').classList.remove('hidden');
    
    // Apply theme based on user's gender
    applyTheme(currentUser.gender);
    
    // Show typing test by default
    showTypingTest();
    
    // Update username display
    document.getElementById('username-display').textContent = `Welcome, ${currentUser.username}!`;
}

// Logout
function logout() {
    currentUser = null;
    localStorage.removeItem('token');
    localStorage.removeItem('gender');
    localStorage.removeItem('username');
    
    // Reset UI
    document.getElementById('game-section').classList.add('hidden');
    document.getElementById('landing-section').classList.remove('hidden');
    document.body.className = 'theme-neutral';
}

// Helper function to get auth header
function getAuthHeader() {
    return {
        'Authorization': `Bearer ${currentUser?.token}`
    };
}

// Event listeners for navigation
document.getElementById('get-started')?.addEventListener('click', () => {
    document.getElementById('landing-section').classList.add('hidden');
    document.getElementById('auth-section').classList.remove('hidden');
    showLoginForm();
});

document.getElementById('show-register')?.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('register-form').classList.remove('hidden');
});

document.getElementById('show-login')?.addEventListener('click', (e) => {
    e.preventDefault();
    showLoginForm();
}); 