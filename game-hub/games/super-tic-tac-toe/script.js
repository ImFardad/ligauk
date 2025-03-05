// script.js
const boards = document.querySelectorAll('.mini-board');
const resetButton = document.getElementById('reset');
let currentPlayer = 'X';
let gameState = Array(9).fill(null).map(() => Array(9).fill(null));
let mainBoardState = Array(9).fill(null);
let activeBoardIndex = null;

// Function to check win condition for a mini-board
function checkWin(board) {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    return winningCombinations.some(combination => {
        const [a, b, c] = combination;
        return board[a] && board[a] === board[b] && board[a] === board[c];
    });
}

// Function to handle a move
function handleCellClick(e) {
    const cell = e.target;
    const boardIndex = parseInt(cell.parentElement.getAttribute('data-board-index'));
    const cellIndex = parseInt(cell.getAttribute('data-cell-index'));

    if (activeBoardIndex !== null && activeBoardIndex !== boardIndex) return; // Enforce board restriction
    if (gameState[boardIndex][cellIndex] !== null) return; // Cell already taken

    gameState[boardIndex][cellIndex] = currentPlayer;
    cell.textContent = currentPlayer;

    // Check if the current mini-board has a winner
    if (checkWin(gameState[boardIndex])) {
        boards[boardIndex].classList.add('won');
        mainBoardState[boardIndex] = currentPlayer;
        // Check if the main board has a winner
        if (checkWin(mainBoardState)) {
            setTimeout(() => alert(`${currentPlayer} wins the game!`), 100);
            resetGame();
            return;
        }
    }

    // Check if there are any empty cells left in the active mini-board
    const anyEmptyCells = gameState[boardIndex].some(cell => cell === null);
    if (!anyEmptyCells) {
        mainBoardState[boardIndex] = 'T'; // Mark the mini-board as a tie
        if (checkWin(mainBoardState)) {
            setTimeout(() => alert('The game is a tie!'), 100);
            resetGame();
            return;
        }
    }

    // Update the active board index
    activeBoardIndex = anyEmptyCells ? cellIndex : null;
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

// Function to reset the game
function resetGame() {
    gameState = Array(9).fill(null).map(() => Array(9).fill(null));
    mainBoardState = Array(9).fill(null);
    boards.forEach(board => {
        board.classList.remove('won');
        board.querySelectorAll('.cell').forEach(cell => {
            cell.textContent = '';
        });
    });
    currentPlayer = 'X';
    activeBoardIndex = null;
}

// Add event listeners
boards.forEach((board, boardIndex) => {
    board.setAttribute('data-board-index', boardIndex);
    board.querySelectorAll('.cell').forEach((cell, cellIndex) => {
        cell.setAttribute('data-cell-index', cellIndex);
        cell.addEventListener('click', handleCellClick);
    });
});
resetButton.addEventListener('click', resetGame);
