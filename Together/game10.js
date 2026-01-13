const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Ajuster le canvas pour prendre toute la fenêtre
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Le point initial
let point = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,        // Rayon initial du point
    maxRadius: Math.max(canvas.width, canvas.height), // Taille maximale pour remplir l'écran
    growthIncrement: 10, // Taille ajoutée à chaque clic
    pulseAnimation: false, // Pour suivre l'état de l'animation
    gameStarted: false, // État pour vérifier si le jeu a commencé
};

// Fonction pour dessiner le point rouge
function drawPoint(scale = 1) {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Efface tout le canvas
    ctx.beginPath();
    ctx.arc(point.x, point.y, point.radius * scale, 0, Math.PI * 2); // Dessiner un cercle avec scale
    ctx.fillStyle = 'red'; // Couleur du point
    ctx.fill();
}

// Fonction pour agrandir le point sur chaque clic
function growPoint() {
    if (point.radius < point.maxRadius) {
        point.radius += point.growthIncrement; // Augmente le rayon
        if (point.radius > point.maxRadius) {
            point.radius = point.maxRadius; // Limite à la taille maximale
        }
    }
}

// Vérifier si le clic est à l'intérieur du point
function isClickInsidePoint(x, y) {
    const dx = x - point.x;
    const dy = y - point.y;
    return Math.sqrt(dx * dx + dy * dy) < point.radius;
}

// Gérer le clic pour agrandir le point à chaque clic
canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect(); // Récupérer la position du canvas
    const mouseX = event.clientX - rect.left; // Position X de la souris
    const mouseY = event.clientY - rect.top; // Position Y de la souris

    // Vérifier si le clic est à l'intérieur du point
    if (isClickInsidePoint(mouseX, mouseY)) {
        growPoint(); // Lancer la croissance à chaque clic
        point.pulseAnimation = true; // Activer l'animation de pulsation
    }
});

// Fonction d'animation
function animate() {
    if (point.pulseAnimation) {
        drawPoint(1.2); // Dessiner avec une échelle de 1.2
        setTimeout(() => {
            drawPoint(1); // Dessiner avec une échelle de 1
            point.pulseAnimation = false; // Désactiver l'animation après la pulsation
        }, 100); // Durée de l'animation
    } else {
        drawPoint(); // Dessiner normalement
    }

    // Réduire le rayon du point avec le temps après une seconde
    if (point.gameStarted) {
        if (point.radius > 0) {
            point.radius -= 0.2; // Réduction du rayon
        }

        // Vérifier si le point remplit l'écran
        if (point.radius >= point.maxRadius) {
            alert("Vous avez gagné !");
            resetGame(); // Réinitialiser le jeu après avoir gagné
        }
    }

    requestAnimationFrame(animate); // Continuer l'animation
}

// Réinitialiser le jeu
function resetGame() {
    point.radius = 10; // Réinitialiser le rayon
    point.gameStarted = false; // Réinitialiser l'état de démarrage du jeu
}

// Démarrer le jeu après une seconde
setTimeout(() => {
    point.gameStarted = true; // Commencer le jeu après une seconde
}, 2000);

// Démarrer l'animation
animate();
