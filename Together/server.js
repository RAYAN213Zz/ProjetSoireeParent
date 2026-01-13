const http = require('http');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

// Créer le serveur HTTP
const server = http.createServer((req, res) => {
    let filePath = '.' + req.url;

    // Si la racine est demandée, rediriger vers niveau1.html
    if (filePath === './') {
        filePath = './niveau1.html'; // Changez ceci si votre fichier HTML a un nom différent
    }

    // Gérer la requête pour favicon.ico
    if (filePath === './favicon.ico') {
        res.writeHead(204); // Pas de contenu
        return res.end();
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        // Ajoutez d'autres types MIME si nécessaire
    };

    const contentType = mimeTypes[extname] || 'application/octet-stream';

    // Lire le fichier demandé
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404);
                res.end(`404 Not Found: ${filePath}`);
            } else {
                console.error(`Erreur interne du serveur : ${error.message}`);
                res.writeHead(500);
                res.end(`Désolé, une erreur s'est produite : ${error.code}`);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

// Initialiser le serveur WebSocket
const wss = new WebSocket.Server({ server });
const clients = [];

wss.on('connection', (ws) => {
    console.log('Un client est connecté');
    const playerIndex = clients.length; // Assigner un index au joueur
    clients.push(ws); // Ajouter le nouveau client à la liste

    // Informer le client de son index
    ws.send(JSON.stringify({ type: 'playerIndex', index: playerIndex }));

    // Lorsque le client envoie un message
    ws.on('message', (message) => {
        console.log(`Message reçu: ${message}`);
        const data = JSON.parse(message);

        // Transmettre le mouvement du joueur aux autres clients
        if (data.type === 'playerMove') {
            // Envoyer le mouvement à tous les autres clients
            clients.forEach((client, index) => {
                if (client !== ws) {
                    client.send(JSON.stringify({
                        type: 'playerMove',
                        playerIndex: playerIndex,
                        x: data.x,
                        y: data.y
                    }));
                }
            });
        }
    });

    // Lorsque le client se déconnecte
    ws.on('close', () => {
        console.log('Un client s\'est déconnecté');
        // Retirer le client de la liste
        clients.splice(playerIndex, 1);
        // Mettre à jour les indices des clients restants
        clients.forEach((client, index) => {
            client.send(JSON.stringify({ type: 'playerIndex', index }));
        });
    });
});

// Démarrer le serveur
server.listen(8080, () => {
    console.log('Serveur WebSocket démarré sur ws://localhost:8080');
});
