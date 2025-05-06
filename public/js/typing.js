// Typing test variables
let timeLeft;
let timer;
let isTestActive = false;
let startTime;
let wordCount;
let correctCharacters;
let totalCharacters;

// Sample texts for typing test
const sampleTexts = [
    "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the English alphabet at least once. Pangrams are often used to display font samples and test keyboards.",
    "In a world of digital communication, typing speed and accuracy are essential skills. Practice makes perfect, and regular typing tests can help improve both speed and precision.",
    "Programming is the art of telling another human what one wants the computer to do. It requires logical thinking, problem-solving skills, and attention to detail.",
    "The best way to predict the future is to create it. Technology continues to evolve, and staying updated with the latest developments is crucial for success in the modern world.",
    "Learning to type efficiently is like learning to play a musical instrument. It takes practice, dedication, and muscle memory to become proficient at it."
];

// Initialize typing test
function initTypingTest() {
    const textDisplay = document.getElementById('text-display');
    const randomText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    textDisplay.innerHTML = randomText.split('').map(char => 
        `<span class="char">${char}</span>`
    ).join('');
    document.getElementById('typing-input').value = '';
    document.getElementById('typing-input').disabled = true;
    resetStats();
}

// Start typing test
function startTypingTest() {
    if (isTestActive) return;

    const duration = parseInt(document.getElementById('time-select').value);
    timeLeft = duration;
    isTestActive = true;
    startTime = new Date();
    wordCount = 0;
    correctCharacters = 0;
    totalCharacters = 0;

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
    const wpm = Math.round((wordCount / timePassed) || 0);
    const accuracy = Math.round((correctCharacters / totalCharacters) * 100) || 0;

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

// End typing test
async function endTest() {
    clearInterval(timer);
    isTestActive = false;

    const typingInput = document.getElementById('typing-input');
    typingInput.disabled = true;

    const stats = calculateStats();
    
    // Save score
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
        const message = document.createElement('div');
        message.className = 'completion-message';
        message.innerHTML = `
            <h3>Test Complete!</h3>
            <p>WPM: ${stats.wpm}</p>
            <p>Accuracy: ${stats.accuracy}%</p>
            <button onclick="startTypingTest()" class="btn-primary">Try Again</button>
        `;
        document.querySelector('.game-container').appendChild(message);
    } catch (error) {
        console.error('Error saving score:', error);
    }
}

// Event listener for typing input
document.getElementById('typing-input').addEventListener('input', (e) => {
    if (!isTestActive) return;

    const typingInput = e.target;
    const textDisplay = document.getElementById('text-display');
    const targetText = textDisplay.textContent;
    const chars = textDisplay.getElementsByClassName('char');

    totalCharacters = typingInput.value.length;
    correctCharacters = 0;

    // Compare input with target text and update character styling
    for (let i = 0; i < chars.length; i++) {
        if (i < typingInput.value.length) {
            if (typingInput.value[i] === targetText[i]) {
                chars[i].className = 'char correct';
                correctCharacters++;
            } else {
                chars[i].className = 'char incorrect';
            }
        } else {
            chars[i].className = 'char';
        }
    }

    // Count words (space-delimited)
    wordCount = typingInput.value.trim().split(/\s+/).length;

    // Calculate and update stats
    calculateStats();

    // Check if reached end of text
    if (typingInput.value.length === targetText.length) {
        initTypingTest(); // Generate new text
    }
}); 