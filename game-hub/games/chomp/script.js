document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('game-board');
    const resetBtn = document.getElementById('reset-btn');
    const form = document.getElementById('settings-form');
    let boardSize = { rows: 5, cols: 5 };
    
    function createBoard(rows, cols) {
        board.innerHTML = ''; // پاک کردن محتوای قبلی
        board.style.gridTemplateColumns = `repeat(${cols}, 60px)`;
        board.style.gridTemplateRows = `repeat(${rows}, 60px)`;
        
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                cell.addEventListener('click', () => handleCellClick(row, col));
                board.appendChild(cell);
            }
        }
        updateBoard(rows, cols);
    }

    function handleCellClick(row, col) {
        if (!gameActive) return;

        for (let r = row; r < boardSize.rows; r++) {
            for (let c = col; c < boardSize.cols; c++) {
                gameBoard[r][c] = false; // سلول مصرف شده
            }
        }

        updateBoard(boardSize.rows, boardSize.cols);

        if (gameBoard[0][0] === false) {
            gameActive = false;
            alert("Game Over! Click 'Start New Game' to play again.");
        }
    }

    function updateBoard(rows, cols) {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);
            if (gameBoard[row][col]) {
                cell.classList.remove('selected');
            } else {
                cell.classList.add('selected');
            }
        });
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault(); // جلوگیری از ارسال فرم
        const rows = parseInt(document.getElementById('rows').value);
        const cols = parseInt(document.getElementById('cols').value);
        
        if (rows < 2 || rows > 10 || cols < 2 || cols > 10) {
            alert("Please enter a number between 2 and 10 for rows and columns.");
            return;
        }

        boardSize = { rows, cols };
        gameBoard = Array.from({ length: rows }, () => Array(cols).fill(true));
        gameActive = true;
        createBoard(rows, cols);
    });

    resetBtn.addEventListener('click', () => {
        gameBoard = Array.from({ length: boardSize.rows }, () => Array(boardSize.cols).fill(true));
        gameActive = true;
        createBoard(boardSize.rows, boardSize.cols);
    });

    // Initialize the game with default size
    let gameBoard = Array.from({ length: boardSize.rows }, () => Array(boardSize.cols).fill(true));
    let gameActive = true;
    createBoard(boardSize.rows, boardSize.cols);
});
