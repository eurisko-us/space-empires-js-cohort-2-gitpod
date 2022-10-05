import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

import Game from './src/game.js';
import Strategy from './strategies/strategy.js';

const app = express();
const httpServer = http.Server(app);
const io = new Server(httpServer);

app.use(express.static('game_ui'));
app.get('/', (_, res) => res.sendFile(`${__dirname}/game_ui/index.html`));

let game = null;
let clientSockets = {};

io.on('connection', (socket) => {

    let socketId = socket.id;
    clientSockets[socketId] = socket;

    console.log(`Client socket connected: ${socket.id}`);

    socket.on('disconnect', () => {
        console.log(`Client socket disconnected: ${socketId}`);
        delete clientSockets[socketId];
    });

    // below is our code

    socket.emit('initialize UI');

    socket.on('initialize game', () => {
        const strategies = [new Strategy(), new Strategy()];
        game = new Game(clientSockets, strategies);
        game.initializeGame();
        game.display();
    });

    socket.on('end game', () => {
        if (game) {
            game.endGame();
            game = null;
        }
    });

    socket.on('next turn', () => {
        if (game) game.run();
    });

    socket.on('auto run', () => {
        if (game) game.start();
    });

});

httpServer.listen(3000, () => console.log('Listening on *:3000'));