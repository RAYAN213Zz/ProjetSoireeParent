const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const canvasColor = getComputedStyle(canvas).backgroundColor;

// Redimensionner le canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Débloquer le niveau 5
function goToLevel5() {
    const currentLevel = 4;  
    const unlockedLevel = parseInt(localStorage.getItem('niveauDebloque')) || 1;

    if (currentLevel >= unlockedLevel) {
        localStorage.setItem('niveauDebloque', currentLevel + 1);  // Débloque le prochain niveau
    }

    window.location.href = "niveau5.html";
}

// Initialiser la taille du canvas
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Déclarations de clés et des joueurs
const keys = {};
const player1Start = { x: 50, y: canvas.height / 2.5 };
const player2Start = { x: 100, y: canvas.height / 2.5 };

const player1 = { ...player1Start, width: 20, height: 50, color: 'red', velocityY: 0, jumping: false };
const player2 = { ...player2Start, width: 20, height: 50, color: 'blue', velocityY: 0, jumping: false };

// Définition des plateformes, boutons et portes
let platforms = [
    { x: 200, y: canvas.height / 1.8 +80, width: 100, height: 20, color: 'purple', moving: true, direction: 'horizontal', speed: 2, minX: 200, maxX: 600 },
    { x: 400, y: canvas.height / 1.8, width: 100, height: 20, color: 'orange', moving: true, direction: 'horizontal', speed: 2.5, minX: 400, maxX: 800 },
    { x: 600, y: canvas.height / 1.8 - 50, width: 100, height: 20, color: 'blue', moving: true, direction: 'horizontal', speed: 3, minX: 600, maxX: 1200 }
];

const platformsground = [
    { x: 0, y: canvas.height / 1.5, width: 300, height: 120, color: 'green' },
    { x: 1200, y: canvas.height / 1.5, width: 1200, height: 20, color: 'green' },
];

const buttons = [
    { x: 1250, y: canvas.height /1.5 - 70, width: 80, height: 80, color: 'cyan', activated: false }
];

const doors = [
    { x: 1640, y: canvas.height / 1.5 - 100, width: 50, height: 100, color: 'brown', open: false }
];

// Élément collidable
const collidableElements = [...platforms, ...buttons, ...doors, ...platformsground];

// Variables de mouvement
const speed = 5;
const gravity = 0.5;
const jumpPower = -12;

// Réinitialiser les joueurs
function resetPlayers() {
    player1.x = player1Start.x;
    player1.y = player1Start.y;
    player1.velocityY = 0;
    player1.jumping = false;

    player2.x = player2Start.x;
    player2.y = player2Start.y;
    player2.velocityY = 0;
    player2.jumping = false;
}

// Mettre à jour la plateforme
function updatePlatform(platform) {
    if (platform.moving) {
        platform.x += platform.speed;
        if (platform.x < platform.minX || platform.x + platform.width > platform.maxX) {
            platform.speed *= -1; // Change la direction
        }
    }
}

// Vérification des collisions
function checkCollisions(player) {
    let collidedPlatform = null;

    for (let element of collidableElements) {
        if (element.width && element.height) {
            if (player.x < element.x + element.width &&
                player.x + player.width > element.x &&
                player.y + player.height >= element.y &&
                player.y + player.height <= element.y + element.height + Math.abs(element.speed) &&
                player.velocityY >= 0) {

                if (platforms.includes(element) || platformsground.includes(element)) {
                    collidedPlatform = element;
                    player.y = element.y - player.height; // Positionne le joueur sur la plateforme
                    player.velocityY = 0;
                    player.jumping = false;
                }
                if (buttons.includes(element)) {
                    element.activated = true; // Active le bouton
                    doors.forEach(door => door.open = true); // Ouvre la porte si un bouton est activé
                }
            }
        }
    }
    return collidedPlatform;
}

// Vérifier si les joueurs sont sur la porte
function checkPlayersOnDoor() {
    const door = doors[0];

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

    if (player1OnDoor && player2OnDoor) {
        goToLevel5(); // Aller au niveau suivant
    }
}

// Fonction pour vérifier les collisions avec les plateformes
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

// Fonction pour vérifier les collisions avec les plateformes de type sol
function checkPlatformGroundCollision(player) {
    for (let platform of platformsground) {  // Remplacez `platformsground` par `platform` dans la boucle
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

const deathZoneY = canvas.height + 100; 
// Mise à jour de la logique de jeu
// Mise à jour de la logique de jeu
function update() {
    // Vérification si les joueurs sont en dehors des limites de la zone de jeu
    if (player1.y > deathZoneY) {
        resetPlayer(player1);
    }

    if (player2.y > deathZoneY) {
        resetPlayer(player2);
    }

    // Contrôles du joueur 1
    if (keys['a']) player1.x -= speed;
    if (keys['d']) player1.x += speed;
    if (keys['w'] && !player1.jumping && (checkCollisions(player1) || player1.y >= canvas.height / 2)) {
        player1.velocityY = jumpPower;
        player1.jumping = true;
    }

    // Contrôles du joueur 2
    if (keys['ArrowLeft']) player2.x -= speed;
    if (keys['ArrowRight']) player2.x += speed;
    if (keys[' '] && !player2.jumping && (checkCollisions(player2) || player2.y >= canvas.height / 2)) {
        player2.velocityY = jumpPower;
        player2.jumping = true;
    }

    // Appliquer la gravité
    player1.velocityY += gravity;
    player2.velocityY += gravity;

    // Mise à jour des positions
    player1.y += player1.velocityY;
    player2.y += player2.velocityY;

    if (!checkPlatformCollision(player1)) player1.jumping = true;
    if (!checkPlatformCollision(player2)) player2.jumping = true;

    checkPlatformGroundCollision(player1);
    checkPlatformGroundCollision(player2);
    platforms.forEach(updatePlatform);

    // Vérification des collisions avec les plateformes
    checkPlayersOnDoor(); // Vérifier si les joueurs sont sur la porte
    checkPlayersOnButton(); // Vérifier si les deux joueurs sont sur le bouton

    animateDoor();
}


// Vérifier si les deux joueurs sont sur le bouton
function checkPlayersOnButton() {
    const button = buttons[0];

    const player1OnButton = (
        player1.x + player1.width > button.x &&
        player1.x < button.x + button.width &&
        player1.y + player1.height >= button.y &&
        player1.y <= button.y + button.height
    );

    const player2OnButton = (
        player2.x + player2.width > button.x &&
        player2.x < button.x + button.width &&
        player2.y + player2.height >= button.y &&
        player2.y <= button.y + button.height
    );

    if (player1OnButton && player2OnButton) {
        buttons[0].activated = true;  // Active le bouton
        doors.forEach(door => door.open = true);  // Ouvre la porte si les deux joueurs sont sur le bouton
    }
}


// Fonction de réinitialisation du joueur
function resetPlayer(player) {
    player.x = player === player1 ? player1Start.x : player2Start.x;
    player.y = player === player1 ? player1Start.y : player2Start.y;
    player.velocityY = 0;
    player.jumping = false;
}

// Fonction de dessin
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dessiner les plateformes
    platforms.forEach(platform => {
        ctx.fillStyle = platform.color;
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    });

    // Dessiner les boutons
    buttons.forEach(button => {
        ctx.fillStyle = button.color;
        ctx.fillRect(button.x, button.y, button.width, button.height);
    });

    // Dessiner les portes
    doors.forEach(door => {
        ctx.fillStyle = door.open ? 'gray' : door.color;
        ctx.fillRect(door.x, door.y, door.width, door.height);
    });

    // Dessiner les joueurs
    ctx.fillStyle = player1.color;
    ctx.fillRect(player1.x, player1.y, player1.width, player1.height);

    ctx.fillStyle = player2.color;
    ctx.fillRect(player2.x, player2.y, player2.width, player2.height);

    platformsground.forEach(platform => {
        ctx.fillStyle = platform.color;
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    });
}

// Fonction pour ouvrir la porte en animation
function animateDoor() {
    const door = doors[0];

    if (door.open && door.animationProgress < 100) {
        door.animationProgress += 2;  // Augmente l'animation (vous pouvez ajuster la vitesse)
    }
}


window.addEventListener('keydown', (e) => {
    keys[e.key] = true;

    if (e.key === 'Enter') {
        const button = buttons[0];
        if (player1.x + player1.width > button.x && player1.x < button.x + button.width &&
            player1.y + player1.height >= button.y && player1.y <= button.y + button.height) {
            button.activated = true;
            console.log("Button activated");
            doors.forEach(door => {
                door.open = true;
                console.log("Door opened");
            });
        }
    }    
});

// Écouteurs d'événements pour les touches
window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Boucle de jeu
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Démarrer la boucle de jeu
gameLoop();
