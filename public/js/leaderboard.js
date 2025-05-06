// Leaderboard variables
let currentLeaderboardType = 'typing';

// Show leaderboard section
function showLeaderboard() {
    document.getElementById('typing-test').classList.add('hidden');
    document.getElementById('dog-rescue').classList.add('hidden');
    document.getElementById('leaderboard').classList.remove('hidden');
    showLeaderboardData('typing');
}

// Show typing test section
function showTypingTest() {
    document.getElementById('leaderboard').classList.add('hidden');
    document.getElementById('dog-rescue').classList.add('hidden');
    document.getElementById('typing-test').classList.remove('hidden');
    initTypingTest();
}

// Show dog rescue section
function showDogRescue() {
    document.getElementById('leaderboard').classList.add('hidden');
    document.getElementById('typing-test').classList.add('hidden');
    document.getElementById('dog-rescue').classList.remove('hidden');
}

// Fetch and display leaderboard data
async function showLeaderboardData(type) {
    currentLeaderboardType = type;
    const leaderboardBody = document.getElementById('leaderboard-body');
    leaderboardBody.innerHTML = '<tr><td colspan="3">Loading...</td></tr>';

    try {
        const response = await fetch(`/api/leaderboard/${type}`, {
            headers: getAuthHeader()
        });

        if (!response.ok) {
            throw new Error('Failed to fetch leaderboard data');
        }

        const data = await response.json();
        updateLeaderboardUI(data, type);
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        leaderboardBody.innerHTML = '<tr><td colspan="3">Failed to load leaderboard</td></tr>';
    }
}

// Update leaderboard UI
function updateLeaderboardUI(data, type) {
    const leaderboardBody = document.getElementById('leaderboard-body');
    leaderboardBody.innerHTML = '';

    if (data.length === 0) {
        leaderboardBody.innerHTML = '<tr><td colspan="3">No scores yet</td></tr>';
        return;
    }

    data.forEach((entry, index) => {
        const row = document.createElement('tr');
        
        // Rank cell
        const rankCell = document.createElement('td');
        rankCell.textContent = index + 1;
        row.appendChild(rankCell);

        // Username cell
        const usernameCell = document.createElement('td');
        usernameCell.textContent = entry.username;
        row.appendChild(usernameCell);

        // Score cell
        const scoreCell = document.createElement('td');
        if (type === 'typing') {
            scoreCell.textContent = `${entry.wpm} WPM (${entry.accuracy}% accuracy)`;
        } else {
            scoreCell.textContent = entry.score;
        }
        row.appendChild(scoreCell);

        leaderboardBody.appendChild(row);
    });
}

// Initialize leaderboard
document.addEventListener('DOMContentLoaded', () => {
    // Add click event listeners for leaderboard type buttons
    document.querySelectorAll('.leaderboard-controls button').forEach(button => {
        button.addEventListener('click', () => {
            const type = button.textContent.toLowerCase().replace(' ', '');
            showLeaderboardData(type);
        });
    });
}); 