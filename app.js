import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

import Game from './src/game.js';

/* EDIT THIS */

import AIStrat          from './strategies/aiStrat.js';
import BasicStrat       from './strategies/basicStrat.js';
import Buy100Strat      from './strategies/buy100Strat.js';
import BuyNoneStrat     from './strategies/buyNoneStrat.js';
import CheatStrat       from './strategies/cheatStrat.js'
import HunterStrat      from './strategies/hunterStrat.js'
import InputStrat       from './strategies/inputStrat.js';
import MaintClosest     from './strategies/maintClosest.js';
import OnlyP2MovesStrat from './strategies/onlyP2MovesStrat.js';
import RandomStrat      from './strategies/randomStrat.js';
import RushStrat        from './strategies/rushStrat.js';
import ShopperStrat     from './strategies/shopperStrat.js';
import TechStrat        from './strategies/techStrat.js';
import TurtleStrat      from './strategies/turtleStrat.js';

/* DON'T EDIT THIS */

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

    socket.emit('initialize UI');

    /* EDIT THIS */

    socket.on('initialize game', () => {
        const strategies = [new RandomStrat(), new RandomStrat()];
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

    socket.on('submit input', (input) => {
        console.log(`new input: ${input}`);
        if (game) game.playerInput = input;
    });

});

/* DON'T EDIT THIS */

let port = 3000;
httpServer.listen(port, () => console.log(`Listening on *:${port}`));