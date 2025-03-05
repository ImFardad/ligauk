document.addEventListener('DOMContentLoaded', () => {
    const playerInput = document.getElementById('player-input');
    const submitBtn = document.getElementById('submit-btn');
    const calculateBtn = document.getElementById('calculate-btn');
    const message = document.getElementById('message');
    const resultsDiv = document.getElementById('results');
    const playerNumbersDiv = document.getElementById('player-numbers');
    const averageDiv = document.getElementById('average');
    const targetDiv = document.getElementById('target');
    const winnerDiv = document.getElementById('winner');
    
    let playerNumbers = [];
    
    submitBtn.addEventListener('click', () => {
        const number = parseInt(playerInput.value, 10);
        if (number >= 0 && number <= 100) {
            playerNumbers.push(number);
            playerInput.value = '';
            message.textContent = `Number ${number} submitted. Total players: ${playerNumbers.length}`;
            if (playerNumbers.length > 1) {
                calculateBtn.style.display = 'inline-block';
            }
        } else {
            message.textContent = 'Please enter a number between 0 and 100.';
        }
    });
    
    calculateBtn.addEventListener('click', () => {
        const average = playerNumbers.reduce((a, b) => a + b, 0) / playerNumbers.length;
        const target = 2 / 3 * average;
        
        playerNumbersDiv.innerHTML = `Numbers submitted: ${playerNumbers.join(', ')}`;
        averageDiv.innerHTML = `Average: ${average.toFixed(2)}`;
        targetDiv.innerHTML = `Two-Thirds of the Average: ${target.toFixed(2)}`;
        
        const closestNumber = playerNumbers.reduce((prev, curr) => 
            Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev
        );
        
        const winners = playerNumbers.filter(num => num === closestNumber);
        winnerDiv.innerHTML = `Winner(s): ${winners.join(', ')}`;
        
        resultsDiv.style.display = 'block';
    });
});
