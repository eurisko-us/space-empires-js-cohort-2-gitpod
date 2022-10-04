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

let clientSockets = {};

io.on('connection', (socket) => {

    let socketId = socket.id;
    clientSockets[socketId] = socket;

    console.log(`Client socket connected: ${socket.id}`);

    socket.emit('initialize game');
    // console.log('socket emitted');

    socket.on('start game', () => {
        console.log('start game app.js');
        const strategies = [new Strategy(), new Strategy()];
        const game = new Game(clientSockets, strategies);
        game.initializeGame();
        game.start();
    });

    // socket.on('run game automatically', () => {
    //     console.log('run game automatically app.js');
    //     if (game) game.start();
    // });

    // socket.on('next turn', () => {
    //     console.log('next turn app.js');
    // });

    socket.on('disconnect', () => {
        console.log(`Client socket disconnected: ${socketId}`);
        delete clientSockets[socketId];
    });

});

httpServer.listen(3000, () => console.log('Listening on *:3000'));

// io.on('start game', () => {

//     console.log('start game');
//     const strategies = [new Strategy(), new Strategy()];
//     const game = new Game(clientSockets, strategies);
//     game.initializeGame();
//     game.start();

// });