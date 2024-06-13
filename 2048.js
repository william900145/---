let boardSize = 4; // 默認大小為 4x4
let board = [];
let score = 0;
let gameStarted = false;

const gameBoard = document.getElementById('game-board');
const scoreDisplay = document.getElementById('score');

// Initialize the game board
function initBoard() {
    board = Array.from({ length: boardSize }, () => Array(boardSize).fill(0));
    gameBoard.style.gridTemplateRows = `repeat(${boardSize}, 100px)`;
    gameBoard.style.gridTemplateColumns = `repeat(${boardSize}, 100px)`;
    gameBoard.innerHTML = '';
    score = 0;
    scoreDisplay.innerText = `分數: ${score}`;
    addNewTile();
    addNewTile();
    drawBoard();
}

function drawBoard() {
    gameBoard.innerHTML = '';
    for (let r = 0; r < boardSize; r++) {
        for (let c = 0; c < boardSize; c++) {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            if (board[r][c] != 0) {
                tile.innerText = board[r][c];
                tile.setAttribute('data-value', board[r][c]);
            }
            gameBoard.appendChild(tile);
        }
    }
}

function addNewTile() {
    let emptyTiles = [];
    for (let r = 0; r < boardSize; r++) {
        for (let c = 0; c < boardSize; c++) {
            if (board[r][c] == 0) {
                emptyTiles.push({ r, c });
            }
        }
    }
    if (emptyTiles.length > 0) {
        const { r, c } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
        board[r][c] = Math.random() < 0.9 ? 2 : 4;
    }
}

function slide(row) {
    let arr = row.filter(val => val);
    let missing = boardSize - arr.length;
    let zeros = Array(missing).fill(0);
    arr = zeros.concat(arr);
    return arr;
}

function combine(row) {
    for (let i = boardSize - 1; i >= 1; i--) {
        let a = row[i];
        let b = row[i - 1];
        if (a == b) {
            row[i] = a + b;
            row[i - 1] = 0;
            score += row[i];
            scoreDisplay.innerText = `分數: ${score}`;
        }
    }
    return row;
}

function slideRowLeft(row) {
    row = slide(row);
    row = combine(row);
    row = slide(row);
    return row;
}

function slideRowRight(row) {
    row = row.reverse();
    row = slideRowLeft(row);
    row = row.reverse();
    return row;
}

function rotateBoardClockwise() {
    let newBoard = board.map((_, i) => board.map(row => row[i]));
    newBoard.forEach(row => row.reverse());
    return newBoard;
}

function rotateBoardCounterClockwise() {
    let newBoard = board.map((_, i) => board.map(row => row[i]));
    newBoard.reverse();
    return newBoard;
}

function slideLeft() {
    for (let r = 0; r < boardSize; r++) {
        board[r] = slideRowLeft(board[r]);
    }
}

function slideRight() {
    for (let r = 0; r < boardSize; r++) {
        board[r] = slideRowRight(board[r]);
    }
}

function slideUp() {
    board = rotateBoardCounterClockwise();
    slideLeft();
    board = rotateBoardClockwise();
}

function slideDown() {
    board = rotateBoardCounterClockwise();
    slideRight();
    board = rotateBoardClockwise();
}

function hasMoved(originalBoard, newBoard) {
    for (let r = 0; r < boardSize; r++) {
        for (let c = 0; c < boardSize; c++) {
            if (originalBoard[r][c] !== newBoard[r][c]) {
                return true;
            }
        }
    }
    return false;
}

function isGameOver() {
    for (let r = 0; r < boardSize; r++) {
        for (let c = 0; c < boardSize; c++) {
            if (board[r][c] == 0) {
                return false;
            }
            if (c != boardSize - 1 && board[r][c] == board[r][c + 1]) {
                return false;
            }
            if (r != boardSize - 1 && board[r][c] == board[r + 1][c]) {
                return false;
            }
        }
    }
    return true;
}

function showGameOver() {
    const gameOverButton = document.createElement('button');
    gameOverButton.innerText = '遊戲結束';
    gameOverButton.onclick = () => {
        gameStarted = false;
        initBoard();
    };
    gameBoard.appendChild(gameOverButton);
}

document.addEventListener('keydown', (event) => {
    if (!gameStarted) return;

    let originalBoard = board.map(row => [...row]);
    if (event.key === 'ArrowRight') {
        slideLeft();
    } else if (event.key === 'ArrowLeft') {
        slideRight();
    } else if (event.key === 'ArrowDown') {
        slideUp();
    } else if (event.key === 'ArrowUp') {
        slideDown();
    }
    if (hasMoved(originalBoard, board)) {
        addNewTile();
        drawBoard();
        if (isGameOver()) {
            drawBoard(); // 先繪製結束時的遊戲版面
            showGameOver(); // 然後顯示遊戲結束按鈕
        }
    }
});

function startGame() {
    const sizeSelect = document.getElementById('board-size');
    boardSize = parseInt(sizeSelect.value);
    gameStarted = true;
    initBoard();
}

