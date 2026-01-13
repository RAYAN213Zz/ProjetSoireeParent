const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const canvasColor = getComputedStyle(canvas).backgroundColor;


function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Gestion des touches
const keys = {};

// Positions initiales des joueurs
const player1Start = { x: 50, y: canvas.height / 2.1 };
const player2Start = { x: 100, y: canvas.height / 2.5 };

// Propriétés des joueurs
const player1 = { 
    ...player1Start, 
    width: 20, 
    height: 50, 
    color: 'red', 
    velocityY: 0, 
    jumping: false, 
    jumpsRemaining: 1, 
    canDoubleJump: false 
};

const player2 = { 
    ...player2Start, 
    width: 20, 
    height: 50, 
    color: 'blue', 
    velocityY: 0, 
    jumping: false, 
    jumpsRemaining: 1, 
    canDoubleJump: false 
};

// Définition des éléments du terrain
const groundHeight = 100;
const groundLevel = canvas.height / 2 + groundHeight;

// Création des trous
const holes = [
    { x: 300, y: groundLevel - 1, width: 600, height: 120, color: canvasColor },
    { x: 600, y: groundLevel - 1, width: 80, height: 120, color: canvasColor }
];

const button = {
    x: 100,
    y: groundLevel -550,
    width: 50,
    height: 20,
    color: 'yellow',
    isPressed: false // State to check if the button is pressed
};

// Zones de double saut
const doubleJumpZones = [
    { x: 400, y: groundLevel - 100, width: 20, height: 20, color: 'orange' },
    { x: 500, y: groundLevel - 150, width: 20, height: 20, color: 'orange' },
    { x: 600, y: groundLevel - 200, width: 20, height: 20, color: 'orange' },
    { x: 700, y: groundLevel - 250, width: 20, height: 20, color: 'orange' },
    {x: 400, y: groundLevel - 400, width: 20, height: 20, color: 'orange' },
    { x: 500, y: groundLevel - 350, width: 20, height: 20, color: 'orange' },
    { x: 600, y: groundLevel - 300, width: 20, height: 20, color: 'orange' },
    {x: 300, y: groundLevel - 450, width: 20, height: 20, color: 'orange' },
    {x: 200, y: groundLevel - 500, width: 20, height: 20, color: 'orange' }
];

// Ajout de plateformes mobiles (montent et descendent)
const movingPlatforms = [
    { x: 900, y: groundLevel - 160, width: 100, height: 10, color: 'gray', direction: -1, speed: 1, range:50, startY: groundLevel - 160 },
    { x: 1050, y: groundLevel - 270, width: 100, height: 10, color: 'gray', direction: -1, speed: 1, range: 50, startY: groundLevel - 270 },
    {x: 1050, y: groundLevel - 50, width: 100, height: 10, color: 'gray', direction: 1, speed: 1, range: 50, startY: groundLevel - 50},
   { x: 900, y: groundLevel - 400, width: 100, height: 10, color: 'gray', direction: -1, speed: 1, range: 50, startY: groundLevel - 400},
   {x: 1050, y: groundLevel - 500, width: 1000, height: 10, color: 'gray', direction: -1, speed: 1, range: 50, startY: groundLevel }
];

// Autres éléments du jeu (portes)
const doors = [
    { x: 1250, y: groundLevel - 580, width: 50, height: 80, color: 'brown', open: false }
];

// Éléments avec lesquels les joueurs peuvent entrer en collision
const collidableElements = [...doubleJumpZones, ...movingPlatforms];

// Constantes de jeu
const speed = 5;
const gravity = 0.5;
const jumpPower = -12;
// Function to check button collision and open the door
function checkButtonCollision(player) {
    if (player.x < button.x + button.width &&
        player.x + player.width > button.x &&
        player.y < button.y + button.height &&
        player.y + player.height > button.y) {
  
            
        if (!button.isPressed) {
            button.isPressed = true; 
            doors.forEach(door => {
                door.open = true; 
            });
        }
    }
}

// Fonction de vérification des collisions

function checkCollisions(player) {
    for (let element of collidableElements) {
        // Ignorer les zones de double saut
        if (doubleJumpZones.includes(element)) {
            continue;
        }

        if (element.width && element.height) {
            if (player.x < element.x + element.width &&
                player.x + player.width > element.x &&
                player.y + player.height >= element.y &&
                player.y + player.height <= element.y + element.height &&
                player.velocityY >= 0) {

                // Gérer les plateformes mobiles
                player.y = element.y - player.height; // Aligner le joueur au-dessus de l'élément
                player.velocityY = 0; // Réinitialiser la vitesse verticale
                player.jumping = false; // Ne pas permettre le saut
                player.jumpsRemaining = 1; // Réinitialiser les sauts

                // Vérifier les zones de double saut
                if (doubleJumpZones.some(zone => zone.x === element.x && zone.y === element.y)) {
                    player.canDoubleJump = true; // Permettre le double saut
                }

                return true; // Collision détectée
            }
        }
    }
    return false; // Pas de collision
}



// Réinitialiser les joueurs
function resetPlayers() {
    const resetPlayer = (player, start) => {
        player.x = start.x;
        player.y = start.y;
        player.velocityY = 0;
        player.jumping = false;
        player.jumpsRemaining = 1;
        player.canDoubleJump = false; // Réinitialiser le double saut
    };

    resetPlayer(player1, player1Start);
    resetPlayer(player2, player2Start);
}

// Vérifier si un joueur tombe dans un trou
function checkHoleCollision(player) {
    for (let hole of holes) {
        if (player.x < hole.x + hole.width &&
            player.x + player.width > hole.x &&
            player.y + player.height >= hole.y &&
            player.y <= hole.y + hole.height) {
            return true; // Le joueur est tombé dans un trou
        }
    }
    return false;
}
function updateMovingPlatforms() {
    movingPlatforms.forEach(platform => {
        platform.y += platform.direction * platform.speed; // Mettre à jour la position

        // Changer la direction si la plateforme atteint sa limite
        if (platform.y <= platform.startY - platform.range) {
            platform.direction = 1; // Direction vers le bas
        } else if (platform.y >= platform.startY) {
            platform.direction = -1; // Direction vers le haut
        }
    });
}


// Mettre à jour les joueurs
function updatePlayers() {
    // Mettre à jour le joueur 1
    if (keys['a']) player1.x -= speed;
    if (keys['d']) player1.x += speed;
    if (keys['w']) {
        if (!player1.jumping && (checkCollisions(player1) || player1.y === groundLevel - player1.height)) {
            player1.velocityY = jumpPower;
            player1.jumping = true;
        } else if (player1.jumping && player1.jumpsRemaining > 0 && player1.canDoubleJump) {
            player1.velocityY = jumpPower;
            player1.jumpsRemaining--;
            player1.canDoubleJump = false; // Désactiver le double saut après utilisation
        }
    }
    checkButtonCollision(player1);
    checkButtonCollision(player2);
    // Mettre à jour le joueur 2
    if (keys['ArrowLeft']) player2.x -= speed;
    if (keys['ArrowRight']) player2.x += speed;
    if (keys[' ']) {
        if (!player2.jumping && (checkCollisions(player2) || player2.y === groundLevel - player2.height)) {
            player2.velocityY = jumpPower;
            player2.jumping = true;
        } else if (player2.jumping && player2.jumpsRemaining > 0 && player2.canDoubleJump) {
            player2.velocityY = jumpPower;
            player2.jumpsRemaining--;
            player2.canDoubleJump = false; // Désactiver le double saut après utilisation
        }
    }

    // Appliquer la gravité
    player1.velocityY += gravity;
    player1.y += player1.velocityY;

    player2.velocityY += gravity;
    player2.y += player2.velocityY;

    // Vérifier les collisions avec le sol
    if (player1.y + player1.height >= groundLevel) {
        player1.y = groundLevel - player1.height; // Alignement au sol
        player1.velocityY = 0; // Réinitialiser la vitesse verticale
        player1.jumping = false; // Ne pas permettre le saut
        player1.jumpsRemaining = 1; // Réinitialiser les sauts
        player1.canDoubleJump = false; // Réinitialiser le double saut
    }

    if (player2.y + player2.height >= groundLevel) {
        player2.y = groundLevel - player2.height; // Alignement au sol
        player2.velocityY = 0; // Réinitialiser la vitesse verticale
        player2.jumping = false; // Ne pas permettre le saut
        player2.jumpsRemaining = 1; // Réinitialiser les sauts
        player2.canDoubleJump = false; // Réinitialiser le double saut
    }

    // Vérifier les collisions avec les éléments collisibles
    checkCollisions(player1);
    checkCollisions(player2);

    // Vérifiez si le joueur est dans une zone de double saut après les collisions
    if (doubleJumpZones.some(zone => player1.x < zone.x + zone.width && player1.x + player1.width > zone.x && player1.y < zone.y + zone.height && player1.y + player1.height > zone.y)) {
        player1.canDoubleJump = true; // Permettre le double saut
        player1.jumpsRemaining = 1; // Réinitialiser le nombre de sauts restants
    }
    if (doubleJumpZones.some(zone => player2.x < zone.x + zone.width && player2.x + player2.width > zone.x && player2.y < zone.y + zone.height && player2.y + player2.height > zone.y)) {
        player2.canDoubleJump = true; // Permettre le double saut
        player2.jumpsRemaining = 1; // Réinitialiser le nombre de sauts restants
    }

    // Vérifiez si un joueur tombe dans un trou
    if (checkHoleCollision(player1)) resetPlayers();
    if (checkHoleCollision(player2)) resetPlayers();

    // Mise à jour des plateformes mobiles
    movingPlatforms.forEach(platform => {
        platform.y += platform.direction * platform.speed;
        if (platform.y <= platform.startY - platform.range || platform.y >= platform.startY) {
            platform.direction *= -1; // Inverser la direction
        }
    });
}




// Fonction de dessin
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'green';
    ctx.fillRect(0, groundLevel, canvas.width, canvas.height - groundLevel);

    // Dessiner les trous
    holes.forEach(hole => {
        ctx.fillStyle = hole.color;
        ctx.fillRect(hole.x, hole.y, hole.width, hole.height);
    });

    // Dessiner les éléments collisibles
    collidableElements.forEach(element => {
        ctx.fillStyle = element.color;
        ctx.fillRect(element.x, element.y, element.width, element.height);
    });

    // Dessiner les plateformes mobiles
    movingPlatforms.forEach(platform => {
        ctx.fillStyle = platform.color;
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    });

    ctx.fillStyle = button.color;
    ctx.fillRect(button.x, button.y, button.width, button.height);
    // Dessine la porte avant les joueurs
    doors.forEach(door => {
        if (!door.open) {
            ctx.fillStyle = door.color; // Porte fermée
        } else {
            ctx.fillStyle = 'lightgray'; // Change la couleur en lightgray si la porte est ouverte
        }
        ctx.fillRect(door.x, door.y, door.width, door.height);
    });

    // Dessiner les joueurs
    ctx.fillStyle = player1.color;
    ctx.fillRect(player1.x, player1.y, player1.width, player1.height);

    ctx.fillStyle = player2.color;
    ctx.fillRect(player2.x, player2.y, player2.width, player2.height);
}
function checkBothPlayersInDoor() {
    // Vérifiez si les joueurs sont dans les limites de la porte
    const bothInDoor = doors.every(door => {
        return player1.x < door.x + door.width &&
               player1.x + player1.width > door.x &&
               player1.y < door.y + door.height &&
               player1.y + player1.height > door.y &&
               player2.x < door.x + door.width &&
               player2.x + player2.width > door.x &&
               player2.y < door.y + door.height &&
               player2.y + player2.height > door.y;
    });

    if (bothInDoor) {
        window.location.href = 'niveau9.html'; // Redirige vers niveau9.html
    }
}
// Boucle de jeu
function gameLoop() {
    updatePlayers();
    updateMovingPlatforms();
    draw();
    requestAnimationFrame(gameLoop);
    checkBothPlayersInDoor();
}

document.addEventListener('keydown', (event) => {
    keys[event.key] = true;
});

document.addEventListener('keyup', (event) => {
    keys[event.key] = false;
});

gameLoop();
