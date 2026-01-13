const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const canvasColor = getComputedStyle(canvas).backgroundColor;

// Game Constants
const CONFIG = {
    PLAYER_SPEED: 5,
    JUMP_POWER: -11,
    GRAVITY: 0.5,
    FALL_SPEED: 5  // Adjustable fall speed for smoother fall animation
};

const platforms = [
    { x: 600, y: 850, width: 1200, height: 120, color: 'green', moving: false, direction: 'horizontal', speed: 3, minX: 600, maxX: 1000 },
    { x: 0, y: 850, width: 500, height: 120, color: 'green', moving: false, direction: 'horizontal', speed: 3, minX: 600, maxX: 1000 },
];

// Resize canvas to full window
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Game Elements
let player1 = { x: 50, y: canvas.height / 2.5, width: 20, height: 50, color: 'red', velocityY: 0, jumping: false, falling: false, frozen: false };
let player2 = { x: 100, y: canvas.height / 2.5, width: 20, height: 50, color: 'blue', velocityY: 0, jumping: false, falling: false, frozen: false };

const door = { x: 1200, y: 750, width: 50, height: 100, color: 'brown', open: false };

// Buttons for unlocking the door
const button1 = { x: 200, y: 790, width: 30, height: 60, color: 'orange', activated: false };
const button2 = { x: 1000, y: 790, width: 30, height: 60, color: 'orange', activated: false };

// Triangle obstacle
const obstacle = { x: 700, y: 790, width: 60, height: 60, color: 'purple' };

// Key states
const keys = {};

// Load level and check if unlocked
window.onload = function () {
    const currentLevel = 2;
    const unlockedLevel = parseInt(localStorage.getItem('niveauDebloque')) || 1;
    if (unlockedLevel < currentLevel) {
        alert("Ce niveau n'est pas encore débloqué !");
        window.location.href = "niveau1.html";
    }
};

// Reset Player
function resetPlayer(player) {
    player.x = 50; // Position initiale X
    player.y = canvas.height / 2.5; // Position initiale Y
    player.velocityY = 0;
    player.jumping = false;
    player.falling = false;
    player.frozen = false; // Reset frozen state
}

// Update game state
function update() {
    movePlayer(player1);
    movePlayer(player2);

    applyGravity(player1);
    applyGravity(player2);

    checkCollisions(player1);
    checkCollisions(player2);

    // Handle button activation
    checkButtonActivation(player1, button1);
    checkButtonActivation(player2, button2);

    handleDoor();

    // Reset players if they fall off the screen
    if (player1.y > canvas.height) {
        resetPlayer(player1);
    }
    if (player2.y > canvas.height) {
        resetPlayer(player2);
    }
}

// Jump Function
function jump(player) {
    if (!player.jumping && !player.falling && !player.frozen) {  // Freeze movement if falling
        player.velocityY = CONFIG.JUMP_POWER;
        player.jumping = true;
    }
}

// Apply Gravity
function applyGravity(player) {
    let onGround = false;  // Variable to check if player is on ground or platform
    
    player.y += player.velocityY;
    
    // Vérification avec les plateformes
    for (let platform of platforms) {
        if (player.x + player.width > platform.x && player.x < platform.x + platform.width &&
            player.y + player.height >= platform.y && player.y + player.height <= platform.y + platform.height && player.velocityY >= 0) {
            
            // Si le joueur est sur une plateforme
            player.y = platform.y - player.height;
            player.velocityY = 0;
            player.jumping = false;
            player.falling = false;
            onGround = true;
        }
    }
    
    // Si le joueur n'est pas sur une plateforme, appliquer la gravité
    if (!onGround) {
        player.velocityY += CONFIG.GRAVITY;
    }
}


// Handle collisions with platforms, holes, etc.
function checkCollisions(player) {
    // Vérifier les collisions avec les plateformes
    for (let platform of platforms) {
        // Collision avec une plateforme par-dessus (comme avant)
        if (player.x + player.width > platform.x && player.x < platform.x + platform.width &&
            player.y + player.height >= platform.y && player.y + player.height <= platform.y + platform.height && player.velocityY >= 0) {
            player.y = platform.y - player.height;
            player.velocityY = 0;
            player.jumping = false;
            player.falling = false;
            player.frozen = false;
        }
    }

    // Check for collision with the triangle obstacle
    if (player.x + player.width > obstacle.x && player.x < obstacle.x + obstacle.width &&
        player.y + player.height >= obstacle.y && player.y + player.height <= obstacle.y + obstacle.height) {
        resetPlayer(player);
    }
}

// Check if a player is on a button
function checkButtonActivation(player, button) {
    if (player.x + player.width > button.x && player.x < button.x + button.width &&
        player.y + player.height >= button.y && player.y + player.height <= button.y + button.height) {
        button.activated = true;
    } else {
        button.activated = false;
    }
}

// Handle door logic
function handleDoor() {
    if (button1.activated && button2.activated) {
        door.open = true;
    }

    if (isPlayerAtDoor(player1) && isPlayerAtDoor(player2)) {
        nextLevel();
    }
}

// Function to check if a player is at the door
function isPlayerAtDoor(player) {
    return (player.x < door.x + door.width &&
        player.x + player.width > door.x &&
        player.y < door.y + door.height &&
        player.y + player.height > door.y);
}

// Proceed to next level
function nextLevel() {
    console.log("Les deux joueurs sont à la porte ! Redirection vers le niveau 2.");
    window.location.href = "niveau3.html"; // Redirection vers le niveau 2
}

// Draw game elements
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw platforms instead of ground
    platforms.forEach(platform => {
        ctx.fillStyle = platform.color;
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    });

    // Draw buttons
    ctx.fillStyle = button1.activated ? 'green' : button1.color;
    ctx.fillRect(button1.x, button1.y, button1.width, button1.height);

    ctx.fillStyle = button2.activated ? 'green' : button2.color;
    ctx.fillRect(button2.x, button2.y, button2.width, button2.height);

    // Draw triangle obstacle
    ctx.fillStyle = obstacle.color;
    ctx.beginPath();
    ctx.moveTo(obstacle.x, obstacle.y + obstacle.height);
    ctx.lineTo(obstacle.x + obstacle.width / 2, obstacle.y);
    ctx.lineTo(obstacle.x + obstacle.width, obstacle.y + obstacle.height);
    ctx.closePath();
    ctx.fill();

    // Draw door
    ctx.fillStyle = door.open ? 'lightgray' : door.color;
    ctx.fillRect(door.x, door.y, door.width, door.height);

    // Draw players
    drawPlayer(player1);
    drawPlayer(player2);
}

// Draw Player Function
function drawPlayer(player) {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Main game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();

// Handle keyboard input
window.addEventListener('keydown', (event) => {
    keys[event.key] = true;
});

window.addEventListener('keyup', (event) => {
    keys[event.key] = false;
});

function movePlayer(player) {
    if (player.frozen) 
        {
            
            return
        }
        ; // Freeze the player movement when falling

    if (player.color === 'red') {
        if (keys['a']) player.x -= CONFIG.PLAYER_SPEED; // Déplacer à gauche
        if (keys['d']) player.x += CONFIG.PLAYER_SPEED; // Déplacer à droite
        if (keys['w']) jump(player); // Sauter
    } else {
        if (keys['ArrowLeft']) player.x -= CONFIG.PLAYER_SPEED; // Déplacer à gauche
        if (keys['ArrowRight']) player.x += CONFIG.PLAYER_SPEED; // Déplacer à droite
        if (keys[' ']) jump(player); // Sauter
    }
}
