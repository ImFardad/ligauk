// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase, ref, onValue, query, orderByChild } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCaFMxwo5xoMYOA_eJX0lr5kp_XboxBRIk",
  authDomain: "ligauk-b0e5d.firebaseapp.com",
  databaseURL: "https://ligauk-b0e5d-default-rtdb.firebaseio.com",
  projectId: "ligauk-b0e5d",
  storageBucket: "ligauk-b0e5d.firebasestorage.app",
  messagingSenderId: "915162997207",
  appId: "1:915162997207:web:82809eb59795e0e68b2b92"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

document.addEventListener('DOMContentLoaded', () => {
    const refreshButton = document.getElementById('refresh-btn');
    const scoreBoard = document.getElementById('score-board');

    // Fetch and update the scoreboard from Firebase
    function fetchAndUpdateScoreBoard() {
        // Query teams ordered by score (ascending). We reverse later for descending.
        const teamsQuery = query(ref(db, 'teams'), orderByChild('score'));
        onValue(teamsQuery, (snapshot) => {
            const teamsData = snapshot.val();
            const teams = teamsData ? Object.keys(teamsData).map(id => ({ id, ...teamsData[id] })) : [];
            // Reverse to get descending order
            teams.sort((a, b) => b.score - a.score);
            updateScoreBoard(teams);
        }, { onlyOnce: true });
    }

    // Update scoreboard table
    function updateScoreBoard(teams) {
        let tbody = scoreBoard.querySelector('tbody');
        if (!tbody) {
            tbody = document.createElement('tbody');
            scoreBoard.appendChild(tbody);
        } else {
            tbody.innerHTML = '';
        }
        teams.forEach(team => {
            const row = document.createElement('tr');
            const nameCell = document.createElement('td');
            nameCell.textContent = team.name;
            const scoreCell = document.createElement('td');
            scoreCell.textContent = team.score;
            const statusCell = document.createElement('td');
            statusCell.textContent = team.status || '';
            row.appendChild(nameCell);
            row.appendChild(scoreCell);
            row.appendChild(statusCell);
            tbody.appendChild(row);
        });
    }

    // Event listener for refresh button
    if (refreshButton) {
        refreshButton.addEventListener('click', fetchAndUpdateScoreBoard);
    } else {
        console.error('Refresh button not found.');
    }

    // Initial load
    fetchAndUpdateScoreBoard();
});
