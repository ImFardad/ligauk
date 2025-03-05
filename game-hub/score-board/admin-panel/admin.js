// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase, ref, set, push, update, remove, onValue } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

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
    const createTeamForm = document.getElementById('create-team-form');
    const updateTeamForm = document.getElementById('update-team-form');
    const deleteTeamForm = document.getElementById('delete-team-form');
    const teamBoard = document.getElementById('team-board');
    const updateTeamSelect = document.getElementById('update-team-select');
    const deleteTeamSelect = document.getElementById('delete-team-select');

    // Load teams from Firebase
    function loadTeams() {
        onValue(ref(db, 'teams'), (snapshot) => {
            const teamsData = snapshot.val();
            const teams = teamsData ? Object.keys(teamsData).map(id => ({ id, ...teamsData[id] })) : [];
            populateTeamSelects(teams);
            updateTeamBoard(teams);
        });
    }

    // Populate select dropdowns with teams
    function populateTeamSelects(teams) {
        updateTeamSelect.innerHTML = '';
        deleteTeamSelect.innerHTML = '';
        teams.forEach(team => {
            const option1 = document.createElement('option');
            option1.value = team.id;
            option1.textContent = team.name;
            updateTeamSelect.appendChild(option1);

            const option2 = document.createElement('option');
            option2.value = team.id;
            option2.textContent = team.name;
            deleteTeamSelect.appendChild(option2);
        });
    }

    // Update the team board display
    function updateTeamBoard(teams) {
        teamBoard.innerHTML = '';
        teams.forEach(team => {
            const teamDiv = document.createElement('div');
            teamDiv.textContent = `Name: ${team.name}, Score: ${team.score}, Status: ${team.status || '-'}`;
            teamBoard.appendChild(teamDiv);
        });
    }

    // Create Team
    createTeamForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('create-team-name').value;
        // Use push to generate a unique key for the team
        const newTeamRef = push(ref(db, 'teams'));
        set(newTeamRef, { name, score: 0, status: null })
            .then(() => createTeamForm.reset());
    });

    // Update Team
    updateTeamForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = updateTeamSelect.value;
        const score = parseInt(document.getElementById('update-team-score').value, 10);
        const status = document.getElementById('update-team-status').value;
        // Update with new score and status (score is replaced with the new value)
        update(ref(db, `teams/${id}`), { score, status })
            .then(() => updateTeamForm.reset());
    });

    // Delete Team
    deleteTeamForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = deleteTeamSelect.value;
        remove(ref(db, `teams/${id}`))
            .then(() => deleteTeamForm.reset());
    });

    loadTeams();
});
