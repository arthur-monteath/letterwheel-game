

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const wheel = document.getElementById("wheel");
const timerElement = document.getElementById("time");

let timeLeft = 5;
let currentPlayer = 0;
let players = []; // Array to store players' names and colors
let currentLetterBoxes = [];
let interval = null; // Store the interval globally to manage clearing

// Handle pre-game setup
document.getElementById("numPlayers").addEventListener("change", setupPlayerInputs);
document.getElementById("startGame").addEventListener("click", startGame);

setupPlayerInputs();

function setupPlayerInputs() {
    const playerSetupDiv = document.getElementById("playerSetup");
    const numPlayers = document.getElementById("numPlayers").value;
    playerSetupDiv.innerHTML = "";

    for (let i = 0; i < numPlayers; i++) {
        playerSetupDiv.innerHTML += `
            <div>
                <label>Name: </label>
                <input class="name-input" type="text" id="playerName${i}" value="Player ${i + 1}" />
                <label>Color: </label>
                <input type="color" id="playerColor${i}" value="#${Math.floor(Math.random()*16777215).toString(16)}" />
            </div>
        `;
    }
}

// Start game after setup
function startGame() {
    const numPlayers = document.getElementById("numPlayers").value;

    // Collect player names and colors
    for (let i = 0; i < numPlayers; i++) {
        const playerName = document.getElementById(`playerName${i}`).value;
        const playerColor = document.getElementById(`playerColor${i}`).value;
        players.push({ name: playerName, color: playerColor, score: 0 });
    }

    // Hide setup and show game
    document.getElementById("setup").style.display = "none";
    document.getElementById("game").style.display = "block";

    updatePlayerIndicator();
    createWheel();
    startTurn();
}

function createWheel() {
    const wheelWidth = wheel.clientWidth;  // Dynamically get the current width of the wheel
    const wheelHeight = wheel.clientHeight; // Dynamically get the current height of the wheel
    const radius = wheelWidth * 0.55;       // Radius is 40% of the wheel's width

    const centerX = wheelWidth / 2;        // Center X is half of the wheel's width
    const centerY = wheelHeight / 2;       // Center Y is half of the wheel's height

    letters.forEach((letter, index) => {
        const angle = (index / letters.length) * 2 * Math.PI; // Calculate angle in radians for each letter
        const x = centerX + radius * Math.cos(angle);         // X position based on cos
        const y = centerY + radius * Math.sin(angle);         // Y position based on sin

        let letterBox = document.createElement("div");
        letterBox.classList.add("letter-box");
        letterBox.dataset.letter = letter;
        letterBox.innerText = letter;
        letterBox.style.left = `${x - 25}px`; // Subtract half the letter box size (50px) to center
        letterBox.style.top = `${y - 25}px`;  // Subtract half the letter box size (50px) to center

        // Rotate the letter box so it faces outward
        const angleDegrees = (angle * 180) / Math.PI; // Convert radians to degrees
        letterBox.style.transform = `rotate(${angleDegrees + -90}deg)`; // Rotate letter box (+90 to correct orientation)

        letterBox.onclick = () => handleLetterClick(letterBox);

        wheel.appendChild(letterBox);
        currentLetterBoxes.push(letterBox);
    });
}

// Timer function
function startTurn() {
    if (interval) {
        clearInterval(interval); // Clear the previous interval if it exists
    }

    timeLeft = 5;
    updateTimer();
    interval = setInterval(() => {
        timeLeft--;
        updateTimer();
        if (timeLeft <= 0) {
            clearInterval(interval);
            endTurn();
        }
    }, 1000);
}

// Update timer display
function updateTimer() {
    timerElement.innerText = timeLeft;
}

// Handle letter click
function handleLetterClick(letterBox) {
    if (!letterBox.classList.contains("used")) {
        letterBox.classList.add("used");
        players[currentPlayer].score++; // Increase score for the current player
        if (currentLetterBoxes.every(box => box.classList.contains("used"))) {
            endGame(); // End game if all letters are pressed
        } else {
            endTurn();
        }
    }
}

// End current turn and move to next player
function endTurn() {
    currentPlayer = (currentPlayer + 1) % players.length;
    updatePlayerIndicator();
    startTurn(); // Start the next player's turn
}

// Update the corner gradients to indicate the current player
function updatePlayerIndicator() {
    const currentPlayerDisplay = document.getElementById("currentPlayer");
    currentPlayerDisplay.innerHTML = `<span style="color: ${players[currentPlayer].color}">${players[currentPlayer].name}</span>`;
}

function endGame() {
    clearInterval(interval);
    
    // Sort players by score in descending order
    players.sort((a, b) => b.score - a.score);
    
    // Prepare the results text with colors
    const resultsText = players.map(player => 
        `<span style="color: ${player.color}; font-weight: bold">${player.name}: ${player.score}</span>`
    ).join('<br>');
    
    // Display results in the results div
    const resultsDiv = document.getElementById("results");
    const resultsTextDiv = document.getElementById("resultsText");
    
    resultsTextDiv.innerHTML = resultsText; // Update the results text
    resultsDiv.style.display = "block";      // Show the results div
    
    // Hide the game section
    document.getElementById("game").style.display = "none";

    // Add click event for the OK button to reset the game
    document.getElementById("okButton").onclick = resetGame;
}

function resetGame() {
    // Reset scores of each player
    players.forEach(player => player.score = 0); // Reset scores to 0
    currentPlayer = 0; // Reset current player index

    // Reset letter boxes
    currentLetterBoxes.forEach(box => box.classList.remove("used"));

    // Hide results and show game section
    document.getElementById("results").style.display = "none"; // Hide results div
    document.getElementById("game").style.display = "block";   // Show game section

    updatePlayerIndicator(); // Update player indicator
    startTurn(); // Start the first player's turn
}
