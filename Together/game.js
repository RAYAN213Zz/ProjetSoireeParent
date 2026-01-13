// Configuration du canvas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Constantes du jeu
const GRAVITY = 0.5;
const JUMP_FORCE = -12;
const MOVE_SPEED = 5;
const TRAMPOLINE_BOOST = -20;

// Objets globaux
let keys = {};
let doorActivated = false;

// Gestion des événements
window.addEventListener('keydown', (event) => keys[event.key] = true);
window.addEventListener('keyup', (event) => keys[event.key] = false);

// Fonctions utilitaires
function updateUI() {
    const player1Info = document.getElementById("player1-position");
    const player2Info = document.getElementById("player2-position");
    const levelDisplay = document.getElementById("level");

    if (player1Info) player1Info.innerText = `Position : (${window.players[0].x.toFixed(2)}, ${window.players[0].y.toFixed(2)})`;
    if (player2Info) player2Info.innerText = `Position : (${window.players[1].x.toFixed(2)}, ${window.players[1].y.toFixed(2)})`;
    if (levelDisplay) levelDisplay.innerText = `Level : ${window.level}`;
}

function nextLevel() {
    const currentLevel = window.level;
    const unlockedLevel = parseInt(localStorage.getItem('niveauDebloque')) || 1;
    if (currentLevel >= unlockedLevel) {
        localStorage.setItem('niveauDebloque', currentLevel + 1);
    }
    window.location.href = `niveau${currentLevel + 1}.html`;
}

function respawnPlayer(player) {
    player.x = player.startX || 50;
    player.y = player.startY || 800;
    player.velocityY = 0;
    player.jumping = false;
}

function checkCollision(obj1, obj2) {
    if (!obj1 || !obj2) return false;
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
}

function updateMovingPlatforms() {
    if (window.movingPlatforms) {
        window.movingPlatforms.forEach(platform => {
            if (platform.direction === 'horizontal') {
                platform.x += platform.speed;
                if (platform.x < platform.minX || platform.x + platform.width > platform.maxX) {
                    platform.speed *= -1;
                }
            }
            // Ajoutez ici d'autres directions si nécessaire
        });
    }
}

function update() {
    window.players.forEach((player) => {
        // Déplacement horizontal
        if ((keys['a'] && player === window.players[0]) || (keys['ArrowLeft'] && player === window.players[1])) {
            player.x -= MOVE_SPEED;
        }
        if ((keys['d'] && player === window.players[0]) || (keys['ArrowRight'] && player === window.players[1])) {
            player.x += MOVE_SPEED;
        }

        // Saut
        if (((keys['w'] && player === window.players[0]) || (keys['ArrowUp'] && player === window.players[1])) && !player.jumping) {
            player.velocityY = JUMP_FORCE;
            player.jumping = true;
        }

        // Appliquer la gravité
        player.velocityY += GRAVITY;
        player.y += player.velocityY;

        let onGround = false;

        // Gestion des plateformes fixes et mouvantes
        [...(window.platformsGround || []), ...(window.movingPlatforms || [])].forEach(platform => {
            if (checkCollision(player, platform) && player.velocityY > 0) {
                onGround = true;
                player.jumping = false;
                player.velocityY = 0;
                player.y = platform.y - player.height; // Positionner le joueur au-dessus de la plateforme
            }
        });

        // Réinitialisation de l'état de saut si le joueur est sur le sol
        if (onGround) {
            player.jumping = false;
            if (player.velocityY > 0) {
                player.velocityY = 0; // Empêcher le rebond
            }
        }

        // Limiter le mouvement horizontal dans le canvas
        player.x = Math.max(0, Math.min(player.x, canvas.width - player.width));

        // Respawn si le joueur tombe hors de l'écran par le bas
        if (player.y > canvas.height) {
            respawnPlayer(player);
        }
    });

    // Vérification des boutons
    if (window.buttons) {
        const allButtonsPressed = window.buttons.every(button => 
            window.players.some(player => checkCollision(player, button))
        );

        if (allButtonsPressed && !doorActivated) {
            doorActivated = true;
            window.doors.forEach(door => door.open = true);
        }
    }

    updateMovingPlatforms();

    // Vérification de la fin du niveau
    if (window.doors && window.doors.length > 0) {
        const allPlayersAtDoor = window.players.every(player => checkCollision(player, window.doors[0]));
        if (allPlayersAtDoor && window.doors[0].open) {
            console.log("Niveau terminé !");
            nextLevel();
        }
    }
}
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dessiner les plateformes fixes et mouvantes
    [...window.platformsGround, ...(window.movingPlatforms || [])].forEach(platform => {
        ctx.fillStyle = platform.color;
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    });

    // Dessiner les trampolines
    if (window.trampolines) {
        window.trampolines.forEach(trampoline => {
            if (trampoline.visible !== false) {
                ctx.fillStyle = trampoline.color;
                ctx.fillRect(trampoline.x, trampoline.y, trampoline.width, trampoline.height);
            }
        });
    }

    // Dessiner les murs
    if (window.walls) {
        window.walls.forEach(wall => {
            ctx.fillStyle = wall.color;
            ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
        });
    }

    // Dessiner les boutons
    if (window.buttons) {
        window.buttons.forEach(button => {
            ctx.fillStyle = button.color;
            ctx.fillRect(button.x, button.y, button.width, button.height);
        });
    }

    // Dessiner les portes
    if (window.doors) {
        window.doors.forEach(door => {
            ctx.fillStyle = door.open ? 'gray' : door.color;
            ctx.fillRect(door.x, door.y, door.width, door.height);
        });
    }

    // Dessiner les joueurs
    window.players.forEach(player => {
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x, player.y, player.width, player.height);
    });

    updateUI();
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Initialiser le jeu
gameLoop();