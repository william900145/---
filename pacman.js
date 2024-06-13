const canvas = document.getElementById('pacman-canvas');
const ctx = canvas.getContext('2d');
const scale = 10;
const width = canvas.width / scale;
const height = canvas.height / scale;

let pacman = {
    x: 1,
    y: 1,
    dx: 1,
    dy: 0,
};

let food = {
    x: Math.floor(Math.random() * width),
    y: Math.floor(Math.random() * height),
};

let walls = [
    { x: 5, y: 5 },
    { x: 5, y: 6 },
    { x: 5, y: 7 },
    { x: 6, y: 5 },
    { x: 7, y: 5 },
];

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawWalls();
    drawFood();
    drawPacman();
}

function drawWalls() {
    ctx.fillStyle = 'blue';
    walls.forEach(wall => {
        ctx.fillRect(wall.x * scale, wall.y * scale, scale, scale);
    });
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * scale, food.y * scale, scale, scale);
}

function drawPacman() {
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(pacman.x * scale + scale / 2, pacman.y * scale + scale / 2, scale / 2, 0.2 * Math.PI, 1.8 * Math.PI);
    ctx.lineTo(pacman.x * scale + scale / 2, pacman.y * scale + scale / 2);
    ctx.fill();
}

function movePacman() {
    pacman.x += pacman.dx;
    pacman.y += pacman.dy;

    if (pacman.x >= width) pacman.x = 0;
    if (pacman.y >= height) pacman.y = 0;
    if (pacman.x < 0) pacman.x = width - 1;
    if (pacman.y < 0) pacman.y = height - 1;

    if (pacman.x === food.x && pacman.y === food.y) {
        food.x = Math.floor(Math.random() * width);
        food.y = Math.floor(Math.random() * height);
    }
}

document.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' && pacman.dx === 0) {
        pacman.dx = -1;
        pacman.dy = 0;
    } else if (event.key === 'ArrowRight' && pacman.dx === 0) {
        pacman.dx = 1;
        pacman.dy = 0;
    } else if (event.key === 'ArrowUp' && pacman.dy === 0) {
        pacman.dx = 0;
        pacman.dy = -1;
    } else if (event.key === 'ArrowDown' && pacman.dy === 0) {
        pacman.dx = 0;
        pacman.dy = 1;
    }
});

function updateGame() {
    movePacman();
    draw();
}

setInterval(updateGame, 100);
