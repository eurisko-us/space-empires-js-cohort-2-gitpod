import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

import Game from './src/game.js';
import Strategy from './strategies/strategy.js';
import UserStrategy from './strategies/user_strat.js';

// connect to web socket (aka display on web browser)

const app = express();
const httpServer = http.Server(app);
const io = new Server(httpServer);

app.use(express.static('game_ui'));
app.get('/', (_, res) => res.sendFile(`${__dirname}/game_ui/index.html`));

let clientSockets = {};

const strategies = [new Strategy(), new UserStrategy()];
const game = new Game(clientSockets, strategies);

game.initializeGame();

io.on('connection', (socket) => {

    let socketId = socket.id;
    clientSockets[socketId] = socket;

    console.log(`Client socket connected: ${socket.id}`);

    socket.on('disconnect', () => {
        console.log(`Client socket disconnected: ${socketId}`);
        delete clientSockets[socketId];
        clearInterval(game.stopInterval);
    });

    game.start(); // so that game doesn't start until socket connects

});

httpServer.listen(3001, () => console.log('Listening on *:3000'));

