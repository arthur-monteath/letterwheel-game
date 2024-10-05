const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const wheel = document.getElementById("wheel");
const timerElement = document.getElementById("time");

let timeLeft = 5;
let currentPlayer = 0;
let players = ["#ff0000", "#00ff00", "#0000ff"]; // Colors for players
let currentLetterBoxes = [];
let interval = null; // Store the interval globally to manage clearing

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
        endTurn();
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
    const topLeft = document.getElementById("corner-top-left");
    const topRight = document.getElementById("corner-top-right");
    const bottomLeft = document.getElementById("corner-bottom-left");
    const bottomRight = document.getElementById("corner-bottom-right");

    const playerColor = players[currentPlayer];
    topLeft.style.backgroundColor = playerColor;
    topRight.style.backgroundColor = playerColor;
    bottomLeft.style.backgroundColor = playerColor;
    bottomRight.style.backgroundColor = playerColor;
}

// Start the game
updatePlayerIndicator();
createWheel();  // Call the function to create the wheel with the letters
startTurn();
