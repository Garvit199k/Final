// Game variables
let canvas, ctx;
let gameLoop;
let isGameActive = false;
let score = 0;
let dogsRescued = 0;

// Game objects
let player = {
    x: 0,
    y: 0,
    width: 50,
    height: 50,
    speed: 5
};

let dogs = [];
let obstacles = [];

// Game settings
const GAME_SPEED = 2;
const DOG_SPAWN_RATE = 3000;
const OBSTACLE_SPAWN_RATE = 2000;

// Initialize game
function initGame() {
    canvas = document.getElementById('game-canvas');
    ctx = canvas.getContext('2d');

    // Set canvas size
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Reset player position
    player.x = canvas.width / 2 - player.width / 2;
    player.y = canvas.height - player.height - 10;

    // Reset game state
    score = 0;
    dogsRescued = 0;
    dogs = [];
    obstacles = [];
    updateGameStats();
}

// Resize canvas
function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}

// Start game
function startDogRescue() {
    if (isGameActive) return;
    
    isGameActive = true;
    initGame();

    // Start game loops
    gameLoop = setInterval(updateGame, 1000 / 60);
    setInterval(spawnDog, DOG_SPAWN_RATE);
    setInterval(spawnObstacle, OBSTACLE_SPAWN_RATE);

    // Add keyboard controls
    window.addEventListener('keydown', handleKeyPress);
}

// Handle keyboard input
function handleKeyPress(e) {
    if (!isGameActive) return;

    switch(e.key) {
        case 'ArrowLeft':
            player.x = Math.max(0, player.x - player.speed);
            break;
        case 'ArrowRight':
            player.x = Math.min(canvas.width - player.width, player.x + player.speed);
            break;
    }
}

// Spawn a dog
function spawnDog() {
    if (!isGameActive) return;

    dogs.push({
        x: Math.random() * (canvas.width - 30),
        y: -30,
        width: 30,
        height: 30,
        speed: 2
    });
}

// Spawn an obstacle
function spawnObstacle() {
    if (!isGameActive) return;

    obstacles.push({
        x: Math.random() * (canvas.width - 40),
        y: -40,
        width: 40,
        height: 40,
        speed: 3
    });
}

// Update game state
function updateGame() {
    if (!isGameActive) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw player
    drawPlayer();

    // Update and draw dogs
    updateDogs();

    // Update and draw obstacles
    updateObstacles();

    // Check collisions
    checkCollisions();
}

// Draw player
function drawPlayer() {
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Update dogs
function updateDogs() {
    for (let i = dogs.length - 1; i >= 0; i--) {
        const dog = dogs[i];
        dog.y += dog.speed;

        // Remove dogs that are off screen
        if (dog.y > canvas.height) {
            dogs.splice(i, 1);
            continue;
        }

        // Draw dog
        ctx.fillStyle = '#795548';
        ctx.fillRect(dog.x, dog.y, dog.width, dog.height);
    }
}

// Update obstacles
function updateObstacles() {
    for (let i = obstacles.length - 1; i >= 0; i--) {
        const obstacle = obstacles[i];
        obstacle.y += obstacle.speed;

        // Remove obstacles that are off screen
        if (obstacle.y > canvas.height) {
            obstacles.splice(i, 1);
            continue;
        }

        // Draw obstacle
        ctx.fillStyle = '#F44336';
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    }
}

// Check collisions
function checkCollisions() {
    // Check dog collisions
    for (let i = dogs.length - 1; i >= 0; i--) {
        const dog = dogs[i];
        if (isColliding(player, dog)) {
            dogs.splice(i, 1);
            score += 100;
            dogsRescued++;
            updateGameStats();
        }
    }

    // Check obstacle collisions
    for (let i = obstacles.length - 1; i >= 0; i--) {
        const obstacle = obstacles[i];
        if (isColliding(player, obstacle)) {
            endGame();
            return;
        }
    }
}

// Collision detection
function isColliding(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// Update game statistics
function updateGameStats() {
    document.getElementById('score').textContent = `Score: ${score}`;
    document.getElementById('dogs-rescued').textContent = `Dogs Rescued: ${dogsRescued}`;
}

// End game
async function endGame() {
    isGameActive = false;
    clearInterval(gameLoop);
    window.removeEventListener('keydown', handleKeyPress);

    // Save score
    try {
        const response = await fetch('/api/scores', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader()
            },
            body: JSON.stringify({
                type: 'dogRescue',
                score: {
                    score: score
                }
            })
        });

        if (!response.ok) {
            throw new Error('Failed to save score');
        }
    } catch (error) {
        console.error('Error saving score:', error);
    }

    alert(`Game Over! Final Score: ${score} | Dogs Rescued: ${dogsRescued}`);
} 