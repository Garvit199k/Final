// Typing test variables
let timeLeft;
let timer;
let isTestActive = false;
let startTime;
let wordCount;
let correctCharacters;
let totalCharacters;
let currentCharIndex;
let currentText;

// Sample texts for typing test
const sampleTexts = [
    "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the English alphabet at least once.",
    "In a world of digital communication, typing speed and accuracy are essential skills. Practice makes perfect.",
    "Programming is the art of telling another human what one wants the computer to do. It requires logical thinking.",
    "The best way to predict the future is to create it. Technology continues to evolve rapidly in our modern world.",
    "Learning to type efficiently is like learning to play a musical instrument. It takes practice and dedication."
];

// Initialize typing test
function initTypingTest() {
    const textDisplay = document.getElementById('text-display');
    currentText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    textDisplay.innerHTML = currentText.split('').map(char => 
        `<span class="char">${char}</span>`
    ).join('');
    
    const typingInput = document.getElementById('typing-input');
    typingInput.value = '';
    typingInput.disabled = false;
    typingInput.focus();
    
    currentCharIndex = 0;
    correctCharacters = 0;
    totalCharacters = 0;
    wordCount = 0;
    
    updateCharDisplay();
    resetStats();
}

// Start typing test
function startTypingTest() {
    if (isTestActive) return;
    
    const duration = parseInt(document.getElementById('time-select').value);
    timeLeft = duration;
    isTestActive = true;
    startTime = new Date();
    
    // Reset stats
    wordCount = 0;
    correctCharacters = 0;
    totalCharacters = 0;
    currentCharIndex = 0;
    
    // Reset and enable input
    const typingInput = document.getElementById('typing-input');
    typingInput.value = '';
    typingInput.disabled = false;
    typingInput.focus();
    
    // Start timer
    updateTimer();
    timer = setInterval(updateTimer, 1000);
    
    // Generate new text
    initTypingTest();
    
    // Update UI
    document.querySelector('.start-btn').disabled = true;
    document.getElementById('time-select').disabled = true;
}

// Update timer
function updateTimer() {
    if (timeLeft <= 0) {
        endTest();
        return;
    }
    
    timeLeft--;
    document.getElementById('time').textContent = `Time: ${timeLeft}s`;
}

// Calculate WPM and accuracy
function calculateStats() {
    const timePassed = (new Date() - startTime) / 1000 / 60; // in minutes
    const wpm = Math.round((correctCharacters / 5) / timePassed) || 0;
    const accuracy = Math.round((correctCharacters / Math.max(totalCharacters, 1)) * 100) || 0;
    
    document.getElementById('wpm').textContent = `WPM: ${wpm}`;
    document.getElementById('accuracy').textContent = `Accuracy: ${accuracy}%`;
    
    return { wpm, accuracy };
}

// Reset statistics
function resetStats() {
    document.getElementById('wpm').textContent = 'WPM: 0';
    document.getElementById('accuracy').textContent = 'Accuracy: 0%';
    document.getElementById('time').textContent = `Time: ${timeLeft || 0}s`;
}

// Update character display
function updateCharDisplay() {
    const chars = document.getElementsByClassName('char');
    Array.from(chars).forEach(char => char.classList.remove('current', 'correct', 'incorrect'));
    if (chars[currentCharIndex]) {
        chars[currentCharIndex].classList.add('current');
    }
}

// End typing test
async function endTest() {
    clearInterval(timer);
    isTestActive = false;
    
    const typingInput = document.getElementById('typing-input');
    typingInput.disabled = true;
    
    const stats = calculateStats();
    
    try {
        const response = await fetch('/api/scores', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader()
            },
            body: JSON.stringify({
                type: 'typing',
                score: {
                    wpm: stats.wpm,
                    accuracy: stats.accuracy,
                    duration: parseInt(document.getElementById('time-select').value)
                }
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to save score');
        }
        
        // Show completion message
        showCompletionMessage(stats);
        
        // Reset UI
        document.querySelector('.start-btn').disabled = false;
        document.getElementById('time-select').disabled = false;
    } catch (error) {
        console.error('Error saving score:', error);
    }
}

// Show completion message
function showCompletionMessage(stats) {
    const container = document.querySelector('.game-container');
    const existingMessage = container.querySelector('.completion-message');
    if (existingMessage) {
        container.removeChild(existingMessage);
    }
    
    const message = document.createElement('div');
    message.className = 'completion-message';
    message.innerHTML = `
        <h3>Test Complete!</h3>
        <div class="final-stats">
            <div class="stat-box">
                <div class="stat-label">WPM</div>
                <div class="stat-value">${stats.wpm}</div>
            </div>
            <div class="stat-box">
                <div class="stat-label">Accuracy</div>
                <div class="stat-value">${stats.accuracy}%</div>
            </div>
        </div>
        <button onclick="startTypingTest()" class="btn-primary">Try Again</button>
    `;
    container.appendChild(message);
}

// Event listener for typing input
document.getElementById('typing-input').addEventListener('input', (e) => {
    if (!isTestActive) {
        startTypingTest();
        return;
    }
    
    const typingInput = e.target;
    const inputText = typingInput.value;
    const chars = document.getElementsByClassName('char');
    
    // Update character count and accuracy
    totalCharacters = inputText.length;
    correctCharacters = 0;
    
    // Compare each character and update display
    for (let i = 0; i < chars.length; i++) {
        chars[i].classList.remove('correct', 'incorrect', 'current');
        
        if (i < inputText.length) {
            if (inputText[i] === currentText[i]) {
                chars[i].classList.add('correct');
                correctCharacters++;
            } else {
                chars[i].classList.add('incorrect');
            }
        }
    }
    
    // Update current character indicator
    currentCharIndex = inputText.length;
    if (currentCharIndex < chars.length) {
        chars[currentCharIndex].classList.add('current');
    }
    
    // Calculate and update stats
    calculateStats();
    
    // Check if completed
    if (inputText.length === currentText.length) {
        // Generate new text only if the current one is completed correctly
        if (correctCharacters === totalCharacters) {
            initTypingTest();
        }
    }
}); 