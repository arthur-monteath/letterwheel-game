const themes = [
    "Países",
    "Objetos",
    "Elogios",
    "Animais",
    "Cores",
    "Sentimentos",
    "Alimentos",
    "FLV (fruta, legume ou verdura)",
    "FNDS (filme, novela, desenho animado, série)",
    "MSE (minha sogra é...)",
    "JLR (jornal, livro ou revista)",
    "PCH (partes do corpo humano)",
    "Nomes próprios",
    "Profissões",
    "Esportes",
    "Times de futebol",
    "Celebridades",
    "Bandas",
    "Instrumentos musicais",
    "Personagens",
    "Marcas famosas",
    "Meios de transporte",
    "Flores",
    "Adjetivos",
    "Gentílicos (adjetivos pátrios)",
    "Verbos",
    "Games",
    "Super-heróis",
    "App ou sites",
    "Chamaria para um churrasco",
    "Coisa de mãe",
    "Representa o Brasil",
    "Perrengue chique",
    "Deveria ser crime",
    "Pior presente de aniversário",
    "Coisas estranhas que há na minha casa",
    "Tem na geladeira",
    "Tem na bolsa",
    "Tem no banheiro",
    "No meu casamento vai ter",
    "Qual seria meu superpoder",
    "Animais fantásticos",
    "Lugares assombrados",
    "O que não fazer em um primeiro encontro",
    "O que me irrita",
    "Antes de morrer quero...",
    "Não me orgulho de...",
    "Invenções malucas para facilitar a vida",
    "O que fazer ao me encontrar com um alienígena",
    "Medo de...",
    "Manias estranhas",
    "Música que acaba com qualquer festa",
    "Piores modas que já adotei",
    "Motivo para rir",
    "Comidas exóticas",
    "Hashtag inventada",
    "Nome de um reality show",
    "Minha banda se chama...",
    "Apelido de casal",
    "Nome de uma ilha deserta",
    "Personagem de um desenho animado inexistente",
    "Título para uma novela mexicana nova",
    "Nome do meu livro",
    "Termos científicos e técnicos",
    "Autores de livros clássicos",
    "Obras de arte famosas",
    "Invenções modernas",
    "Compositores",
    "Nomes ou sobrenomes de Presidentes",
    "Capitais dos países",
    "Expressões ou ditados populares",
    "Frutas ou objetos em inglês",
    "Gírias novas ou antigas"
];

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const wheel = document.getElementById("wheel");
const timerElement = document.getElementById("time");

let timeLeft = 5;
let currentPlayer = 0;
let players = []; // Array to store players' names and colors
let currentLetterBoxes = [];
let interval = null; // Store the interval globally to manage clearing
let letterPressedThisRound = false;

// Handle pre-game setup
document.getElementById("numPlayers").addEventListener("change", setupPlayerInputs);
document.getElementById("startGame").addEventListener("click", startGame);

document.addEventListener("keydown", handleKeyPress);

function handleKeyPress(event) {
    const pressedKey = event.key.toUpperCase();
    const letterBox = currentLetterBoxes.find(box => box.dataset.letter === pressedKey);

    // If the pressed key matches a letter box and it hasn't been used
    if (letterBox && !letterBox.classList.contains("used")) {
        handleLetterClick(letterBox);
    }
}

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

    // Randomly select a theme and display it
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];
    document.getElementById("themeDisplay").innerText = `Tema: ${randomTheme}`; // Display selected theme

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
        letterPressedThisRound = true;   // Mark that a letter has been pressed

        if (currentLetterBoxes.every(box => box.classList.contains("used"))) {
            endGame(); // End game if all letters are pressed
        } else {
            endTurn(); // Continue to the next player's turn
        }
    }
}

// End current turn and move to next player
function endTurn() {
    currentPlayer = (currentPlayer + 1) % players.length;
    updatePlayerIndicator();

    // Check if all players have had their turn without pressing any letter
    if (currentPlayer === 0)
    {
        if(!letterPressedThisRound)
        {
            endGame();
        }
        letterPressedThisRound = false;
    } else {
        startTurn(); // Start the next player's turn
    }
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

    const randomTheme = themes[Math.floor(Math.random() * themes.length)];
    document.getElementById("themeDisplay").innerText = `Tema: ${randomTheme}`;

    // Reset letter boxes
    currentLetterBoxes.forEach(box => box.classList.remove("used"));

    // Hide results and show game section
    document.getElementById("results").style.display = "none"; // Hide results div
    document.getElementById("game").style.display = "block";   // Show game section

    updatePlayerIndicator(); // Update player indicator
    startTurn(); // Start the first player's turn
}
