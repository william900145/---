const boardElement = document.getElementById('minesweeper-board');
const timerElement = document.getElementById('timer');
let timer, seconds = 0;

const difficultySettings = {
    easy: { rows: 9, cols: 9, mines: 10 },
    medium: { rows: 16, cols: 16, mines: 40 },
    hard: { rows: 16, cols: 30, mines: 99 }
};

let board, rows, cols, mines, revealedCells;

function startGame() {
    const difficulty = document.getElementById('difficulty').value;
    const settings = difficultySettings[difficulty];
    rows = settings.rows;
    cols = settings.cols;
    mines = settings.mines;
    revealedCells = 0;
    seconds = 0;
    timerElement.textContent = `時間: 0 秒`;
    clearInterval(timer);

    board = createBoard(rows, cols, mines);
    renderBoard(board);

    document.getElementById('minesweeper-board').style.gridTemplateColumns = `repeat(${cols}, 30px)`;
    timer = setInterval(() => {
        seconds++;
        timerElement.textContent = `時間: ${seconds} 秒`;
    }, 1000);
}

function createBoard(rows, cols, mines) {
    const board = Array.from({ length: rows }, () => Array.from({ length: cols }, () => ({
        mine: false,
        revealed: false,
        flagged: false,
        adjacentMines: 0
    })));

    let placedMines = 0;
    while (placedMines < mines) {
        const row = Math.floor(Math.random() * rows);
        const col = Math.floor(Math.random() * cols);
        if (!board[row][col].mine) {
            board[row][col].mine = true;
            placedMines++;
        }
    }

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (!board[row][col].mine) {
                const adjacentCells = getAdjacentCells(board, row, col);
                board[row][col].adjacentMines = adjacentCells.filter(cell => cell.mine).length;
            }
        }
    }

    return board;
}

function getAdjacentCells(board, row, col) {
    const adjacentCells = [];
    for (let r = -1; r <= 1; r++) {
        for (let c = -1; c <= 1; c++) {
            if (r === 0 && c === 0) continue;
            const newRow = row + r;
            const newCol = col + c;
            if (newRow >= 0 && newRow < board.length && newCol >= 0 && newCol < board[0].length) {
                adjacentCells.push(board[newRow][newCol]);
            }
        }
    }
    return adjacentCells;
}

function renderBoard(board) {
    boardElement.innerHTML = '';
    board.forEach((row, rIdx) => {
        row.forEach((cell, cIdx) => {
            const cellElement = document.createElement('div');
            cellElement.className = 'cell';
            cellElement.dataset.row = rIdx;
            cellElement.dataset.col = cIdx;
            cellElement.addEventListener('click', () => revealCell(rIdx, cIdx));
            cellElement.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                flagCell(rIdx, cIdx);
            });
            boardElement.appendChild(cellElement);
        });
    });
}

function revealCell(row, col) {
    if (board[row][col].revealed || board[row][col].flagged) return;

    board[row][col].revealed = true;
    revealedCells++;
    const cellElement = boardElement.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    cellElement.classList.add('revealed');
    if (board[row][col].mine) {
        cellElement.textContent = '💣';
        clearInterval(timer);
        alert('遊戲結束');
        revealAllMines();
    } else {
        cellElement.textContent = board[row][col].adjacentMines > 0 ? board[row][col].adjacentMines : '';
        if (board[row][col].adjacentMines === 0) {
            getAdjacentCells(board, row, col).forEach((adjacentCell, i) => {
                const adjRow = row + Math.floor(i / 3) - 1;
                const adjCol = col + (i % 3) - 1;
                if (adjRow >= 0 && adjRow < rows && adjCol >= 0 && adjCol < cols) {
                    revealCell(adjRow, adjCol);
                }
            });
        }
    }

    if (revealedCells === rows * cols - mines) {
        clearInterval(timer);
        alert('恭喜你贏了！');
    }
}

function flagCell(row, col) {
    if (board[row][col].revealed) return;

    board[row][col].flagged = !board[row][col].flagged;
    const cellElement = boardElement.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    if (board[row][col].flagged) {
        cellElement.classList.add('flagged');
        cellElement.textContent = '🚩';
    } else {
        cellElement.classList.remove('flagged');
        cellElement.textContent = '';
    }
}

function revealAllMines() {
    board.forEach((row, rIdx) => {
        row.forEach((cell, cIdx) => {
            if (cell.mine) {
                const cellElement = boardElement.querySelector(`.cell[data-row="${rIdx}"][data-col="${cIdx}"]`);
                cellElement.textContent = '💣';
                cellElement.classList.add('revealed');
            }
        });
    });
}
