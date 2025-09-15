const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const gameOverDialog = document.getElementById('gameOverDialog');
const finalScoreElement = document.getElementById('finalScore');
const restartYesButton = document.getElementById('restartYes');
const restartNoButton = document.getElementById('restartNo');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake, food, score, dx, dy, isGameOver, gameInterval;

function initGame() {
    snake = [{ x: 10, y: 10 }];
    score = 0;
    dx = 0;
    dy = 0;
    isGameOver = false;
    scoreElement.textContent = score;
    gameOverDialog.style.display = 'none';

    generateFood();
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, 100);
}

function generateFood() {
    food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
    // Pastikan makanan tidak muncul di dalam tubuh ular
    for (const segment of snake) {
        if (segment.x === food.x && segment.y === food.y) {
            generateFood();
            return;
        }
    }
}

function drawSnake() {
    snake.forEach(segment => {
        ctx.fillStyle = 'green';
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
        ctx.strokeStyle = 'darkgreen';
        ctx.strokeRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
    });
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
    ctx.strokeStyle = 'darkred';
    ctx.strokeRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

function checkCollision() {
    const head = snake[0];

    // Cek tabrakan dengan dinding
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        return true;
    }

    // Cek tabrakan dengan diri sendiri
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }

    return false;
}

function gameLoop() {
    if (isGameOver) {
        clearInterval(gameInterval);
        finalScoreElement.textContent = score;
        gameOverDialog.style.display = 'flex';
        return;
    }

    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreElement.textContent = score;
        generateFood();
    } else {
        snake.pop();
    }

    if (checkCollision()) {
        isGameOver = true;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawFood();
    drawSnake();
}

document.addEventListener('keydown', e => {
    if (isGameOver) return; // Abaikan input jika game sudah berakhir
    
    switch (e.key) {
        case 'ArrowUp':
            if (dy === 0) { dx = 0; dy = -1; }
            break;
        case 'ArrowDown':
            if (dy === 0) { dx = 0; dy = 1; }
            break;
        case 'ArrowLeft':
            if (dx === 0) { dx = -1; dy = 0; }
            break;
        case 'ArrowRight':
            if (dx === 0) { dx = 1; dy = 0; }
            break;
    }
});

restartYesButton.addEventListener('click', () => {
    initGame();
});

restartNoButton.addEventListener('click', () => {
    alert('Terima kasih sudah bermain!');
    gameOverDialog.style.display = 'none';
});

// Mulai permainan saat halaman dimuat
initGame();