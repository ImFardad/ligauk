// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase, ref, onValue, update } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

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
    const updateScoreForm = document.getElementById('update-score-form');
    const updateTeamSelect = document.getElementById('update-team-select');
    const scoreBoard = document.getElementById('score-board');

    // Load teams from Firebase
    function loadTeams() {
        onValue(ref(db, 'teams'), (snapshot) => {
            const teamsData = snapshot.val();
            const teams = teamsData ? Object.keys(teamsData).map(id => ({ id, ...teamsData[id] })) : [];
            populateTeamSelects(teams);
            updateScoreBoard(teams);
        });
    }

    // Populate team select dropdown
    function populateTeamSelects(teams) {
        updateTeamSelect.innerHTML = '';
        teams.forEach(team => {
            const option = document.createElement('option');
            option.value = team.id;
            option.textContent = team.name;
            updateTeamSelect.appendChild(option);
        });
    }

    // Update the score board display (simple list view)
    function updateScoreBoard(teams) {
        scoreBoard.innerHTML = '';
        teams.sort((a, b) => b.score - a.score);
        teams.forEach(team => {
            const row = document.createElement('div');
            row.className = 'team';
            row.style.position = "relative"; // برای قرار دادن دکمه به صورت مطلق
            row.innerHTML = `
                <strong>Team:</strong> ${team.name} <br>
                <strong>Score:</strong> ${team.score} <br>
                <strong>Status:</strong> ${team.status || ''}
            `;
            // --- اضافه کردن دکمه اضافه کردن امتیاز برای هر گروه ---
            const addScoreBtn = document.createElement('button');
            addScoreBtn.textContent = 'Add Score';
            addScoreBtn.className = 'add-score-btn';
            // قرار دادن دکمه به صورت مطلق در سمت راست
            addScoreBtn.style.position = "absolute";
            addScoreBtn.style.right = "10px";
            addScoreBtn.style.top = "50%";
            addScoreBtn.style.transform = "translateY(-50%)";
            row.appendChild(addScoreBtn);
            
            // وقتی دکمه کلیک می‌شود، مدال نمایش داده می‌شود
            addScoreBtn.addEventListener('click', () => {
                currentTeamId = team.id;
                modalOverlay.style.display = 'flex';
            });
            // ---------------------------------------------------------
            scoreBoard.appendChild(row);
        });
    }

    // Update team score by adding the entered value to the current score (فرم بالایی)
    updateScoreForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = updateTeamSelect.value;
        const scoreVal = document.getElementById('update-team-score').value;
        const addedScore = scoreVal === "" ? 0 : parseInt(scoreVal, 10);
        const statusInput = document.getElementById('update-team-status').value;
        
        onValue(ref(db, `teams/${id}`), (snapshot) => {
            const team = snapshot.val();
            if (team) {
                const newScore = (team.score || 0) + addedScore;
                let updateObj = { score: newScore };
                // فقط در صورتی که وضعیت وارد شده وجود داشته باشد، آپدیت شود
                if (statusInput.trim() !== "") {
                    updateObj.status = statusInput;
                }
                update(ref(db, `teams/${id}`), updateObj)
                    .then(() => updateScoreForm.reset());
            }
        }, { onlyOnce: true });
    });

    loadTeams();

    // ================================
    // Modal برای اضافه کردن امتیاز و وضعیت به هر گروه
    // ================================
    let currentTeamId = null;
    const modalOverlay = document.createElement('div');
    modalOverlay.id = 'score-modal';
    modalOverlay.style.display = 'none';
    modalOverlay.style.position = 'fixed';
    modalOverlay.style.top = '0';
    modalOverlay.style.left = '0';
    modalOverlay.style.width = '100%';
    modalOverlay.style.height = '100%';
    modalOverlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
    modalOverlay.style.alignItems = 'center';
    modalOverlay.style.justifyContent = 'center';
    modalOverlay.style.zIndex = '1000';

    const modalContent = document.createElement('div');
    modalContent.style.background = '#fff';
    modalContent.style.padding = '20px';
    modalContent.style.borderRadius = '10px';
    modalContent.style.textAlign = 'center';
    modalContent.style.color = '#000';

    const modalTitle = document.createElement('h3');
    modalTitle.textContent = 'Add Score';
    modalContent.appendChild(modalTitle);

    const modalInput = document.createElement('input');
    modalInput.type = 'number';
    modalInput.id = 'modal-score-input';
    modalInput.placeholder = 'Enter score';
    modalInput.style.width = '80%';
    modalInput.style.margin = '10px auto';
    modalContent.appendChild(modalInput);

    // اضافه کردن فیلد وضعیت به مدال
    const modalStatusLabel = document.createElement('label');
    modalStatusLabel.textContent = 'Status:';
    modalStatusLabel.style.display = 'block';
    modalStatusLabel.style.marginTop = '10px';
    modalContent.appendChild(modalStatusLabel);

    const modalStatusInput = document.createElement('input');
    modalStatusInput.type = 'text';
    modalStatusInput.id = 'modal-status-input';
    modalStatusInput.placeholder = 'Enter status';
    modalStatusInput.style.width = '80%';
    modalStatusInput.style.margin = '10px auto';
    modalContent.appendChild(modalStatusInput);
    // ------------------------------------------

    const modalSubmitBtn = document.createElement('button');
    modalSubmitBtn.textContent = 'Submit';
    modalSubmitBtn.id = 'modal-submit-btn';
    modalSubmitBtn.style.margin = '10px';
    modalContent.appendChild(modalSubmitBtn);

    const modalCancelBtn = document.createElement('button');
    modalCancelBtn.textContent = 'Cancel';
    modalCancelBtn.id = 'modal-cancel-btn';
    modalCancelBtn.style.margin = '10px';
    modalContent.appendChild(modalCancelBtn);

    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);

    // Event listener برای دکمه Submit در مدال
    modalSubmitBtn.addEventListener('click', () => {
        const scoreValModal = modalInput.value;
        const scoreChange = scoreValModal === "" ? 0 : parseInt(scoreValModal, 10);
        const statusValModal = modalStatusInput.value;
        onValue(ref(db, `teams/${currentTeamId}`), (snapshot) => {
            const team = snapshot.val();
            if (team) {
                const newScore = (team.score || 0) + scoreChange;
                let updateObj = { score: newScore };
                if (statusValModal.trim() !== "") {
                    updateObj.status = statusValModal;
                }
                update(ref(db, `teams/${currentTeamId}`), updateObj)
                    .then(() => {
                        modalInput.value = '';
                        modalStatusInput.value = '';
                        modalOverlay.style.display = 'none';
                    });
            }
        }, { onlyOnce: true });
    });

    // Event listener برای دکمه Cancel در مدال
    modalCancelBtn.addEventListener('click', () => {
        modalInput.value = '';
        modalStatusInput.value = '';
        modalOverlay.style.display = 'none';
    });
});
