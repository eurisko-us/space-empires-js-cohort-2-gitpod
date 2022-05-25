import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = http.Server(app);
const io = new Server(httpServer);

import Game from './game.js';
import Strategy from './strategy.js';

app.use(express.static('public'));
app.get('/', (_, res) => res.sendFile(`${__dirname}/public/index.html`));

let clientSockets = {};

io.on('connection', (socket) => {

    let socketId = socket.id;
    clientSockets[socketId] = socket;

    console.log(`Client socket connected: ${socket.id}`);

    socket.on('disconnect', () => {
        console.log(`Client socket disconnected: ${socketId}`);
        delete clientSockets[socketId];
    });

});

httpServer.listen(3000, () => console.log('Listening on *:3000'));

const strategies = [new Strategy(), new Strategy()];
const initialShips = {'Scout': 1, 'Cruiser': 1};
const game = new Game(clientSockets, strategies, initialShips);

game.initializeGame();
game.start();