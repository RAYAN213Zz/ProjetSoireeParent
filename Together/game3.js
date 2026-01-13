const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const canvasColor = getComputedStyle(canvas).backgroundColor;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.onload = function() {
    const currentLevel = 3;  
    const unlockedLevel = parseInt(localStorage.getItem('niveauDebloque')) || 1;

    if (unlockedLevel < currentLevel) {
        alert("Ce niveau n'est pas encore débloqué !");
        window.location.href = "niveau2.html";
    }
};
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const keys = {};
const player1Start = { x: 50, y: canvas.height / 2.5 };
const player2Start = { x: 100, y: canvas.height / 2.5 };

window.players = [
    { x: 50, y: canvas.height / 2.5, width: 20, height: 50, color: 'red', velocityY: 0, jumping: false },
    { x: 100, y: canvas.height / 2.5, width: 20, height: 50, color: 'blue', velocityY: 0, jumping: false }
  ];

const platforms = [
    { x: 0, y: canvas.height / 1.5, width: 300, height: 120, color: 'green' },
    { x: 400, y: canvas.height / 1.5, width: 200, height: 20, color: 'green' },
    { x: 700, y: canvas.height / 1.5, width: 1200, height: 20, color: 'green' },
];

// Définition de la zone de saut (trampoline)
const jumpZone = { x: 430, y: platforms[0].y - 20, width: 50, height: 20, color: 'yellow', jumpBoost: -15 };

// Trampoline supplémentaire
let extraJumpZone = { x: 1100, y: platforms[2].y - 20, width: 100, height: 20, color: 'pink', jumpBoost: -20, visible: false };

// Mur et boutons
const wall = { x: 500, y: platforms[1].y - 175, width: 20, height: 180, color: 'gray' };
const wall2 = { x: 600, y: platforms[2].y - 200, width: 270, height: 20, color: 'gray' };

const button1 = { x: 100, y: platforms[0].y - 20, width: 14, height: 20, color: 'orange' };
const button2 = { x: 700, y: platforms[2].y - 20, width: 14, height: 20, color: 'orange' };
const door = { x: 820, y: platforms[2].y - 300, width: 50, height: 100, color: 'brown', open: false };
let doorActivated = false;

const speed = 5;
const gravity = 0.5;
const jumpPower = -12;

// Vérification de collision avec les plateformes
function checkPlatformCollision(player) {
    for (let platform of platforms) {
        if (player.x < platform.x + platform.width &&
            player.x + player.width > platform.x &&
            player.y + player.height >= platform.y &&
            player.y + player.height <= platform.y + platform.height) {
            player.y = platform.y - player.height;
            player.velocityY = 0;
            player.jumping = false;
            return true;
        }
    }
    return false;
}

function checkWallCollision(player) {
    if (player.x + player.width > wall.x && player.x < wall.x + wall.width &&
        player.y + player.height > wall.y && player.y < wall.y + wall.height) {
        if (player.x + player.width > wall.x && player.x < wall.x) {
            player.x = wall.x - player.width;
        }
        if (player.x < wall.x + wall.width && player.x + player.width > wall.x + wall.width) {
            player.x = wall.x + wall.width;
        }
        return true;
    }

    if (player.x < wall2.x + wall2.width &&
        player.x + player.width > wall2.x &&
        player.y < wall2.y + wall2.height &&
        player.y + player.height > wall2.y) {
        if (player.y + player.height > wall2.y && player.y < wall2.y) {
            player.y = wall2.y - player.height;
            player.velocityY = 0;
            player.jumping = false;
        }
        return true;
    }
    return false;
}

function checkJumpZoneCollision(player, jumpZone) {
    if (
        player.x < jumpZone.x + jumpZone.width &&
        player.x + player.width > jumpZone.x &&
        player.y + player.height >= jumpZone.y &&
        player.y + player.height <= jumpZone.y + jumpZone.height
    ) {
        player.velocityY = jumpZone.jumpBoost;  // appliquer l'effet de rebond
        return true;
    }
    return false;
}

function isPlayerOnButton(player, button) {
    return player.x < button.x + button.width &&
           player.x + player.width > button.x &&
           player.y + player.height > button.y &&
           player.y < button.y + button.height;
}

function isPlayerAtDoor(player) {
    return player.x < door.x + door.width &&
           player.x + player.width > door.x &&
           player.y + player.height > door.y &&
           player.y < door.y + door.height;
}

// Mise à jour de la fonction update() pour inclure le trampoline et le respawn
function update() {
    // Mouvement du joueur 1
    if (keys['a']) player1.x -= speed;
    if (keys['d']) player1.x += speed;
    if (keys['w'] && !player1.jumping) {
        player1.velocityY = jumpPower;
        player1.jumping = true;
    }

    // Mouvement du joueur 2
    if (keys['ArrowLeft']) player2.x -= speed;
    if (keys['ArrowRight']) player2.x += speed;
    if (keys['ArrowUp'] && !player2.jumping) {
        player2.velocityY = jumpPower;
        player2.jumping = true;
    }

    // Appliquer la gravité
    player1.velocityY += gravity;
    player2.velocityY += gravity;

    // Mettre à jour les positions verticales
    player1.y += player1.velocityY;
    player2.y += player2.velocityY;

    // Collision avec les plateformes
    if (!checkPlatformCollision(player1)) player1.jumping = true;
    if (!checkPlatformCollision(player2)) player2.jumping = true;

    // Collision avec les murs
    checkWallCollision(player1);
    checkWallCollision(player2);

    // Collision avec la zone de saut (trampoline)
    checkJumpZoneCollision(player1, jumpZone);
    checkJumpZoneCollision(player2, jumpZone);
    if (extraJumpZone.visible) {
        checkJumpZoneCollision(player1, extraJumpZone);
        checkJumpZoneCollision(player2, extraJumpZone);
    }

    // Vérifier si les joueurs ont appuyé sur les deux boutons
    const button1Pressed = isPlayerOnButton(player1, button1) || isPlayerOnButton(player2, button1);
    const button2Pressed = isPlayerOnButton(player1, button2) || isPlayerOnButton(player2, button2);
    if (button1Pressed && button2Pressed && !doorActivated) {
        door.open = true;
        doorActivated = true;
        extraJumpZone.visible = true;  // Rendre le trampoline supplémentaire visible
    }

    // Vérifier si les deux joueurs sont à la porte
    if (isPlayerAtDoor(player1) && isPlayerAtDoor(player2)) {
        console.log("Niveau terminé !");
        goToLevel4();
    }

    // Respawn si un joueur tombe en dessous du canvas
    if (player1.y > canvas.height) {
        player1.x = player1Start.x;
        player1.y = player1Start.y;
        player1.velocityY = 0;
        player1.jumping = false;
    }
    if (player2.y > canvas.height) {
        player2.x = player2Start.x;
        player2.y = player2Start.y;
        player2.velocityY = 0;
        player2.jumping = false;
    }
}
function goToLevel4() {
    const currentLevel = 3;  
    const unlockedLevel = parseInt(localStorage.getItem('niveauDebloque')) || 1;
   
    if (currentLevel >= unlockedLevel) {
        localStorage.setItem('niveauDebloque', currentLevel + 1); 
    }
    window.location.href = "niveau4.html";
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    platforms.forEach(platform => {
        ctx.fillStyle = platform.color;
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    });

    ctx.fillStyle = wall.color;
    ctx.fillRect(wall.x, wall.y, wall.width, wall.height);

    ctx.fillStyle = wall2.color;
    ctx.fillRect(wall2.x, wall2.y, wall2.width, wall2.height);

    ctx.fillStyle = button1.color;
    ctx.fillRect(button1.x, button1.y, button1.width, button1.height);
    ctx.fillRect(button2.x, button2.y, button2.width, button2.height);

    ctx.fillStyle = door.open ? 'lightgray' : door.color;
    ctx.fillRect(door.x, door.y, door.width, door.height);

    ctx.fillStyle = jumpZone.color;
    ctx.fillRect(jumpZone.x, jumpZone.y, jumpZone.width, jumpZone.height);

    if (extraJumpZone.visible) {
        ctx.fillStyle = extraJumpZone.color;
        ctx.fillRect(extraJumpZone.x, extraJumpZone.y, extraJumpZone.width, extraJumpZone.height);
    }

    [player1, player2].forEach(player => {
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x, player.y, player.width, player.height);
    });
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();

window.addEventListener('keydown', (event) => {
    keys[event.key] = true;
});

window.addEventListener('keyup', (event) => {
    keys[event.key] = false;
});
