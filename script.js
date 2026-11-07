const board = document.querySelector('.board');

const startButton = document.querySelector('.btn-start');
const restartButton = document.querySelector('.btn-restart');

const modal = document.querySelector('.modal');
const startGameModal = document.querySelector('.start-game');
const gameOverModal = document.querySelector('.game-over');

const highScoreElement = document.querySelector('#high-score');
const scoreElement = document.querySelector('#score');
const timeElement = document.querySelector('#time');

const blockHeight = 30;
const blockWidth = 30;

let highScore = Number(localStorage.getItem('highScore')) || 0;
let score = 0;
let time = 0;

highScoreElement.innerText = highScore;

const rows = Math.floor(board.clientHeight / blockHeight);
const cols = Math.floor(board.clientWidth / blockWidth);

let intervalId = null;
let timerIntervalId = null;

let food = {
    x: 5,
    y: 5
};

let snake = [
    { x: 1, y: 3 }
];

let direction = 'down';

const blocks = [];

// Creating blocks
for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {

        const block = document.createElement('div');

        block.classList.add('block');

        board.appendChild(block);

        blocks[`${row}-${col}`] = block;
    }
}

// Generate food
function generateFood() {

    let newFood;

    do {
        newFood = {
            x: Math.floor(Math.random() * rows),
            y: Math.floor(Math.random() * cols)
        };

    } while (
        snake.some(segment =>
            segment.x === newFood.x &&
            segment.y === newFood.y
        )
    );

    food = newFood;
}

// Render game
function render() {

    let head;

    if (direction === 'left') {
        head = {
            x: snake[0].x,
            y: snake[0].y - 1
        };

    } else if (direction === 'right') {
        head = {
            x: snake[0].x,
            y: snake[0].y + 1
        };

    } else if (direction === 'down') {
        head = {
            x: snake[0].x + 1,
            y: snake[0].y
        };

    } else if (direction === 'up') {
        head = {
            x: snake[0].x - 1,
            y: snake[0].y
        };
    }

    // Wall collision
    if (
        head.x < 0 ||
        head.x >= rows ||
        head.y < 0 ||
        head.y >= cols
    ) {
        gameOver();
        return;
    }

    // Food collision
    const isEating =
        head.x === food.x &&
        head.y === food.y;

    // Self collision
    const body = isEating ? snake : snake.slice(0, -1);

    const collision = body.some(segment =>
        segment.x === head.x &&
        segment.y === head.y
    );

    if (collision) {
        gameOver();
        return;
    }

    // Remove previous snake position
    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`]
            .classList.remove('fill');
    });

    // Eating food
    if (isEating) {

        score += 10;

        scoreElement.innerText = score;

        if (score > highScore) {

            highScore = score;

            localStorage.setItem(
                'highScore',
                highScore.toString()
            );

            highScoreElement.innerText = highScore;
        }

        blocks[`${food.x}-${food.y}`]
            .classList.remove('food');

        generateFood();

    } else {

        snake.pop();
    }

    // Add new head
    snake.unshift(head);

    // Render snake
    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`]
            .classList.add('fill');
    });

    // Render food
    blocks[`${food.x}-${food.y}`]
        .classList.add('food');
}

// Start game
function startGame() {

    modal.style.display = 'none';

    clearInterval(intervalId);
    clearInterval(timerIntervalId);

    intervalId = setInterval(render, 100);

    timerIntervalId = setInterval(() => {

        time++;

        const minutes = Math.floor(time / 60);
        const seconds = time % 60;

        timeElement.innerText =
            `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    }, 1000);
}

// Game Over
function gameOver() {

    clearInterval(intervalId);
    clearInterval(timerIntervalId);

    modal.style.display = 'flex';

    startGameModal.style.display = 'none';
    gameOverModal.style.display = 'flex';
}

// Restart game
function restartGame() {

    clearInterval(intervalId);
    clearInterval(timerIntervalId);

    // Remove old snake
    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`]
            .classList.remove('fill');
    });

    // Remove old food
    blocks[`${food.x}-${food.y}`]
        .classList.remove('food');

    // Reset score and time
    score = 0;
    time = 0;

    scoreElement.innerText = score;
    timeElement.innerText = '00:00';
    highScoreElement.innerText = highScore;

    // Reset snake
    snake = [
        { x: 1, y: 3 }
    ];

    direction = 'down';

    // Generate new food
    generateFood();

    // Restart
    startGame();
}

// Button events
startButton.addEventListener('click', () => {

    generateFood();

    startGame();

});

restartButton.addEventListener('click', restartGame);

// Keyboard controls
document.addEventListener('keydown', (event) => {

    if (event.key === 'ArrowUp' && direction !== 'down') {
        direction = 'up';
    }

    else if (event.key === 'ArrowDown' && direction !== 'up') {
        direction = 'down';
    }

    else if (event.key === 'ArrowLeft' && direction !== 'right') {
        direction = 'left';
    }

    else if (event.key === 'ArrowRight' && direction !== 'left') {
        direction = 'right';
    }

});

// Mobile Controls

const upButton = document.querySelector('.up');
const downButton = document.querySelector('.down');
const leftButton = document.querySelector('.left');
const rightButton = document.querySelector('.right');

// Direction change function

function changeDirection(newDirection) {

    if (newDirection === 'up' && direction !== 'down') {
        direction = 'up';
    }

    else if (newDirection === 'down' && direction !== 'up') {
        direction = 'down';
    }

    else if (newDirection === 'left' && direction !== 'right') {
        direction = 'left';
    }

    else if (newDirection === 'right' && direction !== 'left') {
        direction = 'right';
    }
}

// Button clicks

upButton.addEventListener('click', () => {
    changeDirection('up');
});

downButton.addEventListener('click', () => {
    changeDirection('down');
});

leftButton.addEventListener('click', () => {
    changeDirection('left');
});

rightButton.addEventListener('click', () => {
    changeDirection('right');
});


let touchStartX = 0;
let touchStartY = 0;

board.addEventListener('touchstart', (event) => {

    touchStartX = event.changedTouches[0].screenX;
    touchStartY = event.changedTouches[0].screenY;

}, { passive: true });


board.addEventListener('touchend', (event) => {

    const touchEndX = event.changedTouches[0].screenX;
    const touchEndY = event.changedTouches[0].screenY;

    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;

    if (Math.abs(diffX) < 30 && Math.abs(diffY) < 30) return;

    if (Math.abs(diffX) > Math.abs(diffY)) {

        changeDirection(diffX > 0 ? 'right' : 'left');

    } else {

        changeDirection(diffY > 0 ? 'down' : 'up');

    }

}, { passive: true });

