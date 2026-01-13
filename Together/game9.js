const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const canvasColor = getComputedStyle(canvas).backgroundColor;

const originalWidth = 1000; // Original width of the game
const originalHeight = 600; // Original height of the game

function resizeCanvas() {
    const scale = Math.min(window.innerWidth / originalWidth, window.innerHeight / originalHeight);
    canvas.width = originalWidth * scale;
    canvas.height = originalHeight * scale;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const keys = {};

// Add event listeners for key press and release
window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});
window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

const player1Start = { x: 50, y: originalHeight / 2.5 };
const player2Start = { x: 100, y: originalHeight / 2.5 };

const player1 = { ...player1Start, width: 20, height: 50, color: 'red', velocityY: 0, jumping: false };
const player2 = { ...player2Start, width: 20, height: 50, color: 'blue', velocityY: 0, jumping: false };

const groundHeight = 100;
const groundLevel = 600;

const speed = 5;
const gravity = 0.5; 
const jumpPower = -10;

// Porte toujours ouverte
const door = { x: 200, y:300, width: 50, height: 100, color: 'gray', open: true };

const obstacles = [
    { x: 300, y: groundLevel - 195, width: 200, height: 150, color: 'gray' },
    { x: 650, y: groundLevel - 160, width: 200, height: 150, color: 'gray' },
];

let mergedPlayer = null;
let mergingStartTime = null;

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

function goToNextLevel() {
  if (player1.x > 1010|| player2.x > 1010) {
    
  
    window.location.href = 'niveau10.html'; 

  }
}

function splitPlayers() {
    if (mergedPlayer) {
        player1.width = mergedPlayer.width / 2;
        player1.height = mergedPlayer.height / 2; 
        player2.width = mergedPlayer.width / 2;
        player2.height = mergedPlayer.height / 2;

        player1.x = mergedPlayer.x - player1.width / 2;
        player2.x = mergedPlayer.x + player2.width / 2;
        player1.y = player2.y = mergedPlayer.y;

        mergedPlayer = null;
        player1.jumping = false;
        player2.jumping = false;
    }
}

function checkObstacleCollision(player) {
    for (const obstacle of obstacles) {
        const isAboveBottomLeft = player.y + player.height > obstacle.y;

        if (
            isAboveBottomLeft &&
            player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height
        ) {
            return true;
        }
    }
    return false;
}

function update() {
    if (mergedPlayer) {
        if (keys['a']) mergedPlayer.x -= speed;
        if (keys['d']) mergedPlayer.x += speed;
        if (keys['w'] && !mergedPlayer.jumping && mergedPlayer.y === groundLevel - mergedPlayer.height) {
            mergedPlayer.velocityY = jumpPower;
            mergedPlayer.jumping = true;
        }
        mergedPlayer.velocityY += gravity;
        mergedPlayer.y += mergedPlayer.velocityY;

        if (mergedPlayer.y > groundLevel - mergedPlayer.height) {
            mergedPlayer.y = groundLevel - mergedPlayer.height;
            mergedPlayer.velocityY = 0;
            mergedPlayer.jumping = false;
        }

        if (checkObstacleCollision(mergedPlayer)) {
            mergedPlayer.x = mergedPlayer.x - 5; // Adjust to avoid overlap
        }

        if (keys['s']) {
            splitPlayers();
        }
    } else {
        if (keys['a']) player1.x -= speed;
        if (keys['d']) player1.x += speed;
        if (keys['w'] && !player1.jumping && player1.y === groundLevel - player1.height) {
            player1.velocityY = jumpPower;
            player1.jumping = true;
        }

        if (keys['ArrowLeft']) player2.x -= speed;
        if (keys['ArrowRight']) player2.x += speed;
        if (keys[' '] && !player2.jumping && player2.y === groundLevel - player2.height) {
            player2.velocityY = jumpPower;
            player2.jumping = true;
        }

        player1.velocityY += gravity;
        player2.velocityY += gravity;

        player1.y += player1.velocityY;
        player2.y += player2.velocityY;

        if (player1.y > groundLevel - player1.height) {
            player1.y = groundLevel - player1.height;
            player1.velocityY = 0;
            player1.jumping = false;
        }

        if (player2.y > groundLevel - player2.height) {
            player2.y = groundLevel - player2.height;
            player2.velocityY = 0;
            player2.jumping = false;
        }

        if (checkObstacleCollision(player1)) {
            player1.x = player1.x - 5; // Adjust to avoid overlap
        }
        if (checkObstacleCollision(player2)) {
            player2.x = player2.x - 5; // Adjust to avoid overlap
        }

        if (arePlayersOnTopOfEachOther()) {
            if (!mergingStartTime) {
                mergingStartTime = Date.now();
            } else if (Date.now() - mergingStartTime >= 3000) {
                mergedPlayer = {
                    x: (player1.x + player2.x) / 2,
                    y: player1.y,
                    width: player1.width, // Combine widths
                    height: Math.max(player1.height, player2.height),
                    color: 'purple',
                    velocityY: 0,
                    jumping: false
                };
            }
            console.log("x1:" + player1.x);
            console.log("y1:" + player1.y);
            console.log("dooor : " + door.x);
            console.log("doorY:" + door.y);
        } else {
            mergingStartTime = null;
        }
    }

    render();
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the ground
    ctx.fillStyle = 'green';
    ctx.fillRect(0, groundLevel , canvas.width, groundHeight); // Dessine le sol
   
    
    if (mergedPlayer) {
        ctx.fillStyle = mergedPlayer.color;
        ctx.fillRect(mergedPlayer.x, mergedPlayer.y, mergedPlayer.width, mergedPlayer.height);
    } else {
        ctx.fillStyle = player1.color;
        ctx.fillRect(player1.x, player1.y, player1.width, player1.height);

        ctx.fillStyle = player2.color;
        ctx.fillRect(player2.x, player2.y, player2.width, player2.height);
    }

    for (const obstacle of obstacles) {
        ctx.fillStyle = obstacle.color;
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    }
}

function gameLoop() {
    update();
    requestAnimationFrame(gameLoop);
    goToNextLevel();
}

gameLoop();
