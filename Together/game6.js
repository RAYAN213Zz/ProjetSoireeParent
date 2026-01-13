const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const canvasColor = getComputedStyle(canvas).backgroundColor;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}



function goToLevel6() {
    const currentLevel = 6;
    const unlockedLevel = parseInt(localStorage.getItem('niveauDebloque')) || 1;

    if (currentLevel >= unlockedLevel) {
        localStorage.setItem('niveauDebloque', currentLevel + 1);
    }
    else
    {
        window.location.href = "niveau5.html";
    }


    // Redirect to level 6
    window.location.href = "niveau7.html";
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const keys = [];

const player1Start = { x: 50, y: canvas.height / 2.5 };
const player2Start = { x: 100, y: canvas.height / 2.5 };

const player1 = { ...player1Start, width: 20, height: 50, color: 'red', velocityY: 0, jumping: false };
const player2 = { ...player2Start, width: 20, height: 50, color: 'blue', velocityY: 0, jumping: false };

const groundHeight = 100;
const groundLevel = canvas.height / 1.7 + groundHeight;

const speed = 5;
const gravity = 0.5;
const jumpPower = -10;

const door = { x: 1400, y: groundLevel - 100, width: 50, height: 100, color: 'brown', open: false };

// Colors for the squares to cycle through
const squareColors = ['red', 'blue', 'yellow', 'green'];

// Buttons and Squares above them (now tracking color index for cycling)
const buttons = [
    { x: 200, y: groundLevel - 20, width: 30, height: 10, color: 'cyan', activated: false, squareColor: 'gray', colorIndex: 0, lastPressTime: 0 },
    { x: 300, y: groundLevel - 20, width: 30, height: 10, color: 'cyan', activated: false, squareColor: 'gray', colorIndex: 0, lastPressTime: 0 },
    { x: 400, y: groundLevel - 20, width: 30, height: 10, color: 'cyan', activated: false, squareColor: 'gray', colorIndex: 0, lastPressTime: 0 },
    { x: 500, y: groundLevel - 20, width: 30, height: 10, color: 'cyan', activated: false, squareColor: 'gray', colorIndex: 0, lastPressTime: 0 }
];

// Function to check if both players are on the door
function checkPlayersOnDoor() {
    const player1OnDoor = (
        player1.x + player1.width > door.x &&
        player1.x < door.x + door.width &&
        player1.y + player1.height === door.y + door.height
    );

    const player2OnDoor = (
        player2.x + player2.width > door.x &&
        player2.x < door.x + door.width &&
        player2.y + player2.height === door.y + door.height
    );

    // If both players are on the door, teleport to niveau7.html
    if (player1OnDoor && player2OnDoor) {
        window.location.href = 'niveau7.html';
    }
}

// Function to check if the buttons match the correct combination
function checkCombination() {
    const correctCombination = ['blue', 'yellow', 'blue', 'green'];
    const currentCombination = buttons.map(button => button.squareColor);

    // Check if the current button colors match the correct combination
    if (JSON.stringify(currentCombination) === JSON.stringify(correctCombination)) {
        door.open = true; // Open the door if the combination matches
    }
}

// Function to check if a player presses a button and cycles its color with a delay
function checkButtonPress(player) {
    buttons.forEach((button) => {
        // Ensure player lands on top of the button
        if (
            player.x + player.width > button.x &&
            player.x < button.x + button.width &&
            player.y + player.height > button.y &&
            player.y < button.y + button.height + player.velocityY
        ) {
            // Get the current time
            const currentTime = Date.now();

            // Check if 1 second has passed since the last press
            if (currentTime - button.lastPressTime >= 1000) {
                // Cycle through the colors in the `squareColors` array
                button.colorIndex = (button.colorIndex + 1) % squareColors.length;
                button.squareColor = squareColors[button.colorIndex]; // Change the square's color
                button.lastPressTime = currentTime; // Update the last press time

                // After pressing the button, check if the combination is correct
                checkCombination();
            }
        }
    });
}

function update() {
    // Player 1 movement
    if (keys['a']) player1.x -= speed;
    if (keys['d']) player1.x += speed;
    if (keys['w'] && !player1.jumping && player1.y === groundLevel - player1.height) {
        player1.velocityY = jumpPower;
        player1.jumping = true;
    }

    // Player 2 movement
    if (keys['ArrowLeft']) player2.x -= speed;
    if (keys['ArrowRight']) player2.x += speed;
    if (keys[' '] && !player2.jumping && player2.y === groundLevel - player2.height) {
        player2.velocityY = jumpPower;
        player2.jumping = true;
    }

    // Apply gravity
    player1.velocityY += gravity;
    player2.velocityY += gravity;

    // Update player positions
    player1.y += player1.velocityY;
    player2.y += player2.velocityY;

    // Collision with the ground for player 1
    if (player1.y > groundLevel - player1.height) {
        player1.y = groundLevel - player1.height;
        player1.velocityY = 0;
        player1.jumping = false;
    }

    // Collision with the ground for player 2
    if (player2.y > groundLevel - player2.height) {
        player2.y = groundLevel - player2.height;
        player2.velocityY = 0;
        player2.jumping = false;
    }

    // Check if a player jumps on a button
    checkButtonPress(player1);
    checkButtonPress(player2);

    // Check if both players are on the door
    checkPlayersOnDoor();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the ground
    ctx.fillStyle = 'green';
    ctx.fillRect(0, groundLevel, canvas.width, groundHeight);

    // Draw the buttons and their squares
    buttons.forEach((button) => {
        // Draw button
        ctx.fillStyle = button.color;
        ctx.fillRect(button.x, button.y, button.width, button.height);

        // Draw the square higher above the button
        ctx.fillStyle = button.squareColor;
        ctx.fillRect(button.x, button.y - 100, button.width, 50); // Draw square higher above the button
    });

    // Draw the door (in the background, before players)
    ctx.fillStyle = door.open ? 'lightgray' : door.color;
    ctx.fillRect(door.x, door.y - door.height + groundHeight, door.width, door.height);

    // Draw the players (in the foreground, after the door)
    ctx.fillStyle = player1.color;
    ctx.fillRect(player1.x, player1.y, player1.width, player1.height);

    ctx.fillStyle = player2.color;
    ctx.fillRect(player2.x, player2.y, player2.width, player2.height);
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

gameLoop();
