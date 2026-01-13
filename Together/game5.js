const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const canvasColor = getComputedStyle(canvas).backgroundColor;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
/*window.onload = function() {
    const currentLevel = 5;  
    const unlockedLevel = parseInt(localStorage.getItem('niveauDebloque')) || 1;

    // Check if level is unlocked
    if (unlockedLevel < currentLevel) {
        alert("Ce niveau n'est pas encore débloqué !");
        window.location.href = "niveau4.html"; 
    }
};*/
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

const door = { x: 1600, y: groundLevel - 100, width: 50, height: 100, color: 'brown', open: false };

let mergedPlayer = null;
let mergingStartTime = null;

function isPlayerAtDoor(player) {
    // Check if player reaches the open door
    if (door.open &&
        player.x < door.x + door.width &&
        player.x + player.width > door.x &&
        player.y + player.height > door.y) {
        goToLevel6();
    }
}

function goToLevel6() {
    const currentLevel = 5;
    const unlockedLevel = parseInt(localStorage.getItem('niveauDebloque')) || 1;

    // Unlock the next level
    if (currentLevel >= unlockedLevel) {
        localStorage.setItem('niveauDebloque', currentLevel + 1);
    }

    // Redirect to level 6
    window.location.href = "niveau6.html";
}

function resetPlayer(player) {
    player.x = player === player1 ? player1Start.x : player2Start.x;
    player.y = groundLevel - player.height;
    player.velocityY = 0;
    player.jumping = false;
}

function arePlayersOnTopOfEachOther() {
    return (
        player1.x < player2.x + player2.width &&
        player1.x + player1.width > player2.x &&
        player1.y === player2.y
    );
}

function isPlayerCollidingWithObstacle(player) {
    return (
        player.x < obstacle.x + obstacle.width &&
        player.x + player.width > obstacle.x &&
        player.y + player.height > obstacle.y &&
        player.y < obstacle.y + obstacle.height
    );
}

function handleObstacleCollision(player) {
    if (player.velocityY > 0) {
        // Si le joueur tombe
        player.y = obstacle.y - player.height; // Positionne le joueur juste au-dessus de l'obstacle
        player.velocityY = 0; // Réinitialise la vitesse verticale
        player.jumping = false; // Réinitialise l'état de saut
    } else if (player.velocityY < 0) {
        // Si le joueur saute
        player.y = obstacle.y + obstacle.height; // Positionne le joueur juste en dessous de l'obstacle
        player.velocityY = 0; // Réinitialise la vitesse verticale
    }
}


function update() {
    if (mergedPlayer) {
        // Controls for the merged player
        if (keys['a']) mergedPlayer.x -= speed;
        if (keys['d']) mergedPlayer.x += speed;
        if (keys['w'] && !mergedPlayer.jumping && mergedPlayer.y === groundLevel - mergedPlayer.height) {
            mergedPlayer.velocityY = jumpPower;
            mergedPlayer.jumping = true;
        }
        mergedPlayer.velocityY += gravity;
        mergedPlayer.y += mergedPlayer.velocityY;

        // Collision with the ground for merged player
        if (mergedPlayer.y > groundLevel - mergedPlayer.height) {
            mergedPlayer.y = groundLevel - mergedPlayer.height;
            mergedPlayer.velocityY = 0;
            mergedPlayer.jumping = false;
        }

        // Check if the merged player reaches the door
        isPlayerAtDoor(mergedPlayer);
    } else {
        // Movement for player 1
        if (keys['a']) player1.x -= speed;
        if (keys['d']) player1.x += speed;
        if (keys['w'] && !player1.jumping && player1.y === groundLevel - player1.height) {
            player1.velocityY = jumpPower;
            player1.jumping = true;
        }

        // Movement for player 2
        if (keys['ArrowLeft']) player2.x -= speed;
        if (keys['ArrowRight']) player2.x += speed;
        if (keys[' '] && !player2.jumping && player2.y === groundLevel - player2.height) {
            player2.velocityY = jumpPower;
            player2.jumping = true;
        }

        // Apply gravity
        player1.velocityY += gravity;
        player2.velocityY += gravity;

        // Update positions
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

        // Check if the players are on top of each other
        if (arePlayersOnTopOfEachOther()) {
            if (!mergingStartTime) {
                mergingStartTime = Date.now();  // Start 3-second countdown
            } else if (Date.now() - mergingStartTime >= 3000) {
                // After 3 seconds, merge players
                door.open = true;
                mergedPlayer = {
                    x: (player1.x + player2.x) / 2,
                    y: player1.y,
                    width: 20,
                    height: 50,
                    color: 'purple',
                    velocityY: 0,
                    jumping: false
                };
            }
        } else {
            mergingStartTime = null;  // Reset if players are no longer on top of each other
            door.open = false;
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the ground
    ctx.fillStyle = 'green';
    ctx.fillRect(0, groundLevel, canvas.width, groundHeight);

        // Draw the door
        ctx.fillStyle = door.open ? 'lightgray' : door.color;
        ctx.fillRect(door.x, door.y - door.height + groundHeight, door.width, door.height);

    // Draw players
    if (!mergedPlayer) {
        ctx.fillStyle = player1.color;
        ctx.fillRect(player1.x, player1.y, player1.width, player1.height);

        ctx.fillStyle = player2.color;
        ctx.fillRect(player2.x, player2.y, player2.width, player2.height);
    }

    // Draw merged player if present
    if (mergedPlayer) {
        ctx.fillStyle = mergedPlayer.color;
        ctx.fillRect(mergedPlayer.x, mergedPlayer.y, mergedPlayer.width, mergedPlayer.height);
    }


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
