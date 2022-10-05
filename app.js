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

let game;
let clientSockets = {};

io.on('connection', (socket) => {

    let socketId = socket.id;
    clientSockets[socketId] = socket;

    console.log(`Client socket connected: ${socket.id}`);

    ///////////////////////////////////////////////////////////////////////////

    socket.emit('initialize game');

    socket.on('start game', () => {
        const strategies = [new Strategy(), new Strategy()];
        game = new Game(clientSockets, strategies);
        game.initializeGame();
        game.display();
    });

    socket.on('end game', () => {
        return;
    });

    socket.on('next turn', () => {
        return;
    });

    socket.on('auto run', () => {
        if (game) game.start();
    });

    ///////////////////////////////////////////////////////////////////////////

    socket.on('disconnect', () => {
        console.log(`Client socket disconnected: ${socketId}`);
        delete clientSockets[socketId];
    });

});

httpServer.listen(8080, () => console.log('Listening on *:8080'));