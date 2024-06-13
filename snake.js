const canvas = document.getElementById('snake-canvas');
const ctx = canvas.getContext('2d');
const scale = 10;
const width = canvas.width / scale;
const height = canvas.height / scale;
let score = 0;

let snake = [{ x: 2, y: 2 }];
let direction = { x: 1, y: 0 };
let food = { x: Math.floor(Math.random() * width), y: Math.floor(Math.random() * height) };

document.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' && direction.x === 0) {
        direction = { x: -1, y: 0 };
    } else if (event.key === 'ArrowRight' && direction.x === 0) {
        direction = { x: 1, y: 0 };
    } else if (event.key === 'ArrowUp' && direction.y === 0) {
        direction = { x: 0, y: -1 };
    } else if (event.key === 'ArrowDown' && direction.y === 0) {
        direction = { x: 0, y: 1 };
    }
});

function update() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        food = { x: Math.floor(Math.random() * width), y: Math.floor(Math.random() * height) };
        score++;
        document.getElementById('score').innerText = '分數: ' + score;
    } else {
        snake.pop();
    }

    if (head.x < 0 || head.x >= width || head.y < 0 || head.y >= height || snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)) {
        clearInterval(gameInterval);
        document.getElementById('game-over').classList.remove('hidden');
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * scale, food.y * scale, scale, scale);

    ctx.fillStyle = 'green';
    snake.forEach(segment => {
        ctx.fillRect(segment.x * scale, segment.y * scale, scale, scale);
    });
}

function gameLoop() {
    update();
    draw();
}

function restartGame() {
    snake = [{ x: 2, y: 2 }];
    direction = { x: 1, y: 0 };
    food = { x: Math.floor(Math.random() * width), y: Math.floor(Math.random() * height) };
    score = 0;
    document.getElementById('score').innerText = '分數: ' + score;
    document.getElementById('game-over').classList.add('hidden');
    gameInterval = setInterval(gameLoop, 100);
}

let gameInterval = setInterval(gameLoop, 100);
