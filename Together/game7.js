const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const canvasColor = getComputedStyle(canvas).backgroundColor;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const keys = {};
const player1Start = { x: 50, y: canvas.height / 2.2 };
const player2Start = { x: 100, y: canvas.height / 2.5 };

const player1 = { ...player1Start, width: 20, height: 50, color: 'red', velocityY: 0, jumping: false, jumpsRemaining: 1 };
const player2 = { ...player2Start, width: 20, height: 50, color: 'blue', velocityY: 0, jumping: false, jumpsRemaining: 1 };

const groundHeight = 100;
const groundLevel = canvas.height / 2 + groundHeight;

const holes = [
    { x: 300, y: groundLevel - 1, width: 600, height: 120, color: canvasColor },
    { x: 600, y: groundLevel - 1, width: 80, height: 120, color: canvasColor }
];

const platforms = [
    { x: 200, y: groundLevel - 50, width: 100, height: 20, color: 'purple', moving: true, direction: 'horizontal', speed: 2, minX: 200, maxX: 600 },
    { x: 400, y: groundLevel - 100, width: 100, height: 20, color: 'orange', moving: true, direction: 'horizontal', speed: 2.5, minX: 400, maxX: 800 },
    { x: 600, y: groundLevel - 150, width: 100, height: 20, color: 'blue', moving: true, direction: 'horizontal', speed: 3, minX: 600, maxX: 1000 },
    { x: 900, y: groundLevel - 500, width: 500, height: 20, color: 'lightblue', moving: false, direction: 'vertical', speed: 3, minX: 600, maxX: 1000 },
    { x: 0, y: groundLevel - 500, width: 500, height: 20, color: 'lightblue', moving: false, direction: 'vertical', speed: 3, minX: 600, maxX: 1000 },
    { x: 400, y: groundLevel - 200, width: 100, height: 20, color: 'orange', moving: true, direction: 'horizontal', speed: 3.5, minX: 400, maxX: 800 },
    { x: 200, y: groundLevel - 250, width: 100, height: 20, color: 'purple', moving: true, direction: 'horizontal', speed: 4, minX: 200, maxX: 600 },
    { x: 600, y: groundLevel - 300, width: 100, height: 20, color: 'blue', moving: true, direction: 'horizontal', speed: 4.5, minX: 600, maxX: 1000 },
    { x: 200, y: groundLevel - 350, width: 100, height: 20, color: 'purple', moving: true, direction: 'horizontal', speed: 5, minX: 200, maxX: 600 },
    { x: 400, y: groundLevel - 400, width: 100, height: 20, color: 'orange', moving: true, direction: 'horizontal', speed: 5.5, minX: 400, maxX: 800 }
];

const buttons = [
    { x: 950, y: groundLevel - 60, width: 20, height: 60, color: 'cyan', activated: false }
];

const doors = [
    { x: 1200, y: groundLevel - 600, width: 50, height: 100, color: 'brown', open: false }
];

const teleporters = [
    { x: 10, y: groundLevel - 600, width: 50, height: 100, targetIndex: 1, color: "red" },
    { x: 950, y: groundLevel - 640, width: 30, height: 100, targetIndex: 0 }
];

const collidableElements = [...platforms, ...buttons, ...doors, ...teleporters];

const speed = 5;
const gravity = 0.5;
const jumpPower = -12;

function updatePlatform(platform) {
    if (platform.moving) {
        if (platform.direction === 'horizontal') {
            platform.x += platform.speed;
            if (platform.x < platform.minX || platform.x + platform.width > platform.maxX) {
                platform.speed *= -1;
            }
        } else if (platform.direction === 'vertical') {
            platform.y += platform.speed;
            if (platform.y < platform.minY || platform.y + platform.height > platform.maxY) {
                platform.speed *= -1;
            }
        }
    }
}

function checkCollisions(player) {
    let collidedPlatform = null;

    for (let element of collidableElements) {
        if (element.width && element.height) {
            if (player.x < element.x + element.width &&
                player.x + player.width > element.x &&
                player.y + player.height >= element.y &&
                player.y + player.height <= element.y + element.height &&
                player.velocityY >= 0) {

                if (platforms.includes(element)) {
                    collidedPlatform = element;  
                    player.y = element.y - player.height;
                    player.velocityY = 0;
                    player.jumping = false;
                    player.jumpsRemaining = 1; // Reset jumps on landing
                }

                if (buttons.includes(element)) {
                    element.activated = true;
                    doors.forEach(door => door.open = true); // Open the door when the button is pressed
                    console.log("Porte ouverte !"); // Debug
                }

                if (teleporters.includes(element)) {
                    const targetTeleporter = teleporters[element.targetIndex];
                    player.x = targetTeleporter.x;
                    player.y = targetTeleporter.y + targetTeleporter.height; // Adjust position on teleport
                }
            }
        }
    }

    return collidedPlatform;
}

function resetPlayers() {
    player1.x = player1Start.x;
    player1.y = player1Start.y;
    player1.velocityY = 0;
    player1.jumping = false;
    player1.jumpsRemaining = 1;

    player2.x = player2Start.x;
    player2.y = player2Start.y;
    player2.velocityY = 0;
    player2.jumping = false;
    player2.jumpsRemaining = 1;
    
 
}

function checkHoleCollision(player) {
    for (let hole of holes) {
        if (player.x < hole.x + hole.width &&
            player.x + player.width > hole.x &&
            player.y + player.height >= hole.y &&
            player.y <= hole.y + hole.height) {
            return true; // Player fell into a hole
        }
    }
    return false;
}

function checkPlayersOnDoor() {
    const door = doors[0];
    const player1OnDoor = player1.x < door.x + door.width && player1.x + player1.width > door.x && player1.y + player1.height === door.y + door.height;
    const player2OnDoor = player2.x < door.x + door.width && player2.x + player2.width > door.x && player2.y + player2.height === door.y + door.height;

    if (player1OnDoor && player2OnDoor) {
        window.location.href = 'niveau8.html';
    }
}

function checkButtonCollision(player) {
    const button = buttons[0]; // Assuming there is only one button

    if (player.x < button.x + button.width &&
        player.x + player.width > button.x &&
        player.y + player.height >= button.y &&
        player.y + player.height <= button.y + button.height) {
        return true; // Player is on the button
    }
    return false;
}

function update() {
    // Update player1
    if (keys['a']) player1.x -= speed;
    if (keys['d']) player1.x += speed;
    if (keys['w']) {
        if (!player1.jumping && (checkCollisions(player1) || player1.y === groundLevel - player1.height)) {
            player1.velocityY = jumpPower;
            player1.jumping = true;
        } else if (player1.jumping && player1.jumpsRemaining > 0) {
            player1.velocityY = jumpPower;
            player1.jumpsRemaining--;
        }
    }

    // Update player2
    if (keys['ArrowLeft']) player2.x -= speed;
    if (keys['ArrowRight']) player2.x += speed;
    if (keys[' ']) {
        if (!player2.jumping && (checkCollisions(player2) || player2.y === groundLevel - player2.height)) {
            player2.velocityY = jumpPower;
            player2.jumping = true;
        } else if (player2.jumping && player2.jumpsRemaining > 0) {
            player2.velocityY = jumpPower;
            player2.jumpsRemaining--;
        }
    }

    // Gravity
    player1.velocityY += gravity;
    player1.y += player1.velocityY;

    player2.velocityY += gravity;
    player2.y += player2.velocityY;

    // Check collisions with the ground
    if (player1.y + player1.height >= groundLevel) {
        player1.y = groundLevel - player1.height; // Align to the ground
        player1.velocityY = 0;
        player1.jumping = false;
        player1.jumpsRemaining = 1; // Reset jumps on landing
    }

    if (player2.y + player2.height >= groundLevel) {
        player2.y = groundLevel - player2.height; // Align to the ground
        player2.velocityY = 0;
        player2.jumping = false;
        player2.jumpsRemaining = 1; // Reset jumps on landing
    }

    // Check collisions with platforms
    checkCollisions(player1);
    checkCollisions(player2);

    if (checkHoleCollision(player1)) resetPlayers();
    if (checkHoleCollision(player2)) resetPlayers();

    checkPlayersOnDoor();

    // Update platforms
    platforms.forEach(updatePlatform);

    // Check button press
    if (checkButtonCollision(player1) && keys['Enter']) {
        buttons[0].activated = true;
        doors.forEach(door => door.open = true); // Ouvre la porte
        console.log("Porte ouverte par joueur 1"); // Debug
    }

    if (checkButtonCollision(player2) && keys['Enter']) {
        buttons[0].activated = true;
        doors.forEach(door => door.open = true); // Ouvre la porte
        console.log("Porte ouverte par joueur 2"); // Debug
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'green';
    ctx.fillRect(0, groundLevel, canvas.width, canvas.height - groundLevel);

    // Dessine les trous
    holes.forEach(hole => {
        ctx.fillStyle = hole.color;
        ctx.fillRect(hole.x, hole.y, hole.width, hole.height);
    });

    // Dessine les éléments collisibles
    collidableElements.forEach(element => {
        ctx.fillStyle = element.color;
        ctx.fillRect(element.x, element.y, element.width, element.height);
    });

    // Dessine la porte avant les joueurs
    doors.forEach(door => {
        if (!door.open) {
            ctx.fillStyle = door.color; // Porte fermée
        } else {
            ctx.fillStyle = 'lightgray'; // Change la couleur en lightgray si la porte est ouverte
        }
        ctx.fillRect(door.x, door.y, door.width, door.height);
    });

    // Dessine les joueurs après la porte pour qu'ils soient en premier plan
    [player1, player2].forEach(player => {
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x, player.y, player.width, player.height);
    });
}




window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
