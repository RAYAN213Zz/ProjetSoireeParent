class Player {
    constructor(position, color) {
        this.x = position.x;
        this.y = position.y;
        this.width = 30;  // Width of the player
        this.height = 60; // Height of the player
        this.color = color;
        this.velocityY = 0; // Vertical velocity for jumping/falling
        this.isJumping = false; // To track if the player is jumping
        this.rotation = 0; // Rotation angle for falling effect
    }

    draw(ctx) {
        ctx.save(); // Sauvegarde l'état du contexte
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2); // Déplace le contexte au centre du joueur
        ctx.rotate(this.rotation); // Applique la rotation
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height); // Dessine le joueur centré
        ctx.restore(); // Restaure l'état du contexte

        // Dessine l'animation de saut
        if (this.isJumping) {
            ctx.fillStyle = 'yellow'; // Change color to indicate jump
            ctx.fillRect(this.x, this.y + this.height, this.width, 5); // Draw jump animation
        }
    }

    applyGravity(gravity, groundLevel) {
        if (this.y + this.height < groundLevel) {
            this.velocityY += gravity;
            this.y += this.velocityY;
            this.isJumping = true; // Set jumping flag

            // Ajuste la rotation pour simuler la chute
            this.rotation += 0.1; // Augmente la rotation
        } else {
            this.y = groundLevel - this.height; // Reset position to ground level
            this.velocityY = 0; // Reset vertical velocity
            this.isJumping = false; // Reset jumping flag
            this.rotation = 0; // Réinitialise la rotation quand le joueur touche le sol
        }
    }

    jump(jumpForce) {
        if (!this.isJumping) {
            this.velocityY = -jumpForce; // Apply jump force
            this.isJumping = true; // Set jumping flag
            this.rotation = 0; // Réinitialise la rotation lors du saut
        }
    }

    move(keys, speed, jumpForce) {
        if (keys.left) this.x -= speed;
        if (keys.right) this.x += speed;
        if (keys.space) this.jump(jumpForce); // Jump only if space is pressed
    }

    reset() {
        this.x = 50; // Reset to starting position
        this.y = canvas.height / 2.5; // Reset to starting vertical position
        this.velocityY = 0; // Reset vertical velocity
        this.isJumping = false; // Reset jumping flag
        this.rotation = 0; // Reset rotation
      
    }
}


// Check Button Press Function
function isPlayerOnButton(player, button) {
    return player.x < button.x + button.width &&
           player.x + player.width > button.x &&
           player.y < button.y + button.height &&
           player.y + player.height > button.y;
 }
 
 // Check Door Function
 function isPlayerAtDoor(player) {
    return player.x < door.x + door.width &&
           player.x + player.width > door.x &&
           player.y < door.y + door.height &&
           player.y + player.height > door.y;
 }
 function checkHoleCollision(player) {
    for (const hole of holes) {
        if (player.x +19 < hole.x + hole.width &&
            player.x + player.width > hole.x +19 &&
            player.y < hole.y + hole.height &&
            player.y + player.height > hole.y) {
            resetPlayer(player); // Reset le joueur en cas de chute dans un trou
            break;
        }
    }
}


// Move Player Function
function movePlayer(player) {
    if (player.color === 'red') {
        if (keys['a']) player.x -= CONFIG.PLAYER_SPEED; // Move left
        if (keys['d']) player.x += CONFIG.PLAYER_SPEED; // Move right
        if (keys['w']) jump(player); // Jump
    } else {
        if (keys['ArrowLeft']) player.x -= CONFIG.PLAYER_SPEED; // Move left
        if (keys['ArrowRight']) player.x += CONFIG.PLAYER_SPEED; // Move right
        if (keys[' ']) jump(player); // Jump
    }
}
