// Global variables
let currentUser = null;
let selectedGender = null;
const API_URL = 'https://final-badzxgm5u-garvits-projects-5a47218e.vercel.app';  // Updated Vercel production URL

// Add event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add click handlers for auth buttons
    document.getElementById('register-btn')?.addEventListener('click', register);
    document.getElementById('login-btn')?.addEventListener('click', login);
    
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
        const gender = localStorage.getItem('gender');
        handleLoginSuccess({ token, gender });
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
        if (btn.id === `${gender}-btn`) {
            btn.classList.add('selected');
            btn.style.opacity = '1';
        } else {
            btn.classList.remove('selected');
            btn.style.opacity = '0.5';
        }
    });
}

// Registration
async function register() {
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
        console.log('Attempting registration...', {
            url: `${API_URL}/api/register`,
            username,
            gender: selectedGender
        }); // Enhanced debug log
        
        const response = await fetch(`${API_URL}/api/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ username, password, gender: selectedGender })
        });

        console.log('Registration response:', {
            status: response.status,
            statusText: response.statusText,
            headers: Object.fromEntries(response.headers.entries())
        }); // Enhanced debug log
        
        const data = await response.json();
        console.log('Registration data:', data); // Debug log

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

            // Redirect to login after 2 seconds
            setTimeout(() => {
                showLoginForm();
            }, 2000);
        } else {
            throw new Error(data.error || 'Registration failed');
        }
    } catch (error) {
        console.error('Registration error:', error); // Debug log
        showError('register-form', error.message);
    } finally {
        toggleLoading('register-btn', false);
    }
}

// Login
async function login() {
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;

    if (!username || !password) {
        showError('login-form', 'Please fill in all fields');
        return;
    }

    toggleLoading('login-btn', true);

    try {
        console.log('Attempting login...'); // Debug log
        const response = await fetch(`${API_URL}/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        console.log('Login response:', response.status); // Debug log
        const data = await response.json();

        if (response.ok) {
            handleLoginSuccess(data);
        } else {
            throw new Error(data.error || 'Invalid credentials');
        }
    } catch (error) {
        console.error('Login error:', error); // Debug log
        showError('login-form', error.message);
    } finally {
        toggleLoading('login-btn', false);
    }
}

// Handle successful login
function handleLoginSuccess(data) {
    currentUser = {
        token: data.token,
        gender: data.gender
    };

    // Store auth data
    localStorage.setItem('token', data.token);
    localStorage.setItem('gender', data.gender);

    // Hide all sections first
    document.getElementById('landing-section').classList.add('hidden');
    document.getElementById('auth-section').classList.add('hidden');
    
    // Show game section
    const gameSection = document.getElementById('game-section');
    gameSection.classList.remove('hidden');
    
    // Show typing test by default
    document.querySelectorAll('.game-container').forEach(container => {
        container.classList.add('hidden');
    });
    document.getElementById('typing-test').classList.remove('hidden');

    // Update username display
    document.getElementById('username-display').textContent = `Welcome back!`;

    // Apply theme
    document.body.className = `theme-${data.gender}`;

    // Reset forms
    document.getElementById('login-username').value = '';
    document.getElementById('login-password').value = '';

    console.log('Login successful, game section shown'); // Debug log
}

// Logout
function logout() {
    currentUser = null;
    localStorage.removeItem('token');
    localStorage.removeItem('gender');
    
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