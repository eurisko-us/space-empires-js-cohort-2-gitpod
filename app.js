import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

import Game from './src/game.js';

import BasicStrat       from './strategies/basicStrat.js';
import Buy100Strat      from './strategies/buy100Strat.js';
import BuyNoneStrat     from './strategies/buyNoneStrat.js';
import HunterStrat      from './strategies/hunterStrat.js'
import OnlyP2MovesStrat from './strategies/onlyP2MovesStrat.js';
import RandomStrat      from './strategies/randomStrat.js';
import RushStrat        from './strategies/rushStrat.js';
import ShopperStrat     from './strategies/shopperStrat.js';
import TurtleStrat      from './strategies/turtleStrat.js';
import InputStrat       from './strategies/inputStrat.js';

const app = express();
const httpServer = http.Server(app);
const io = new Server(httpServer);

app.use(express.static('game_ui'));
app.get('/', (_, res) => res.sendFile(`${__dirname}/game_ui/index.html`));

io.on('connection', (socket) => {

    console.log(`Client socket connected: ${socket.id}`);
    socket.on('disconnect', () => console.log(`Client socket disconnected: ${socket.id}`));

    // below is our code

    let game;

    socket.emit('initialize UI');

    socket.on('initialize game', () => {
        const strategies = [new BasicStrat(), new InputStrat(socket)];
        game = new Game(socket, strategies);
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
        // let inputStrat = game.strategies.filter(strat => strat.name == 'input');
        // if (inputStrat.length > 1) console.log("game doesn't work with 2 input players yet");
        // inputStrat[0].input = input;
    });

});

httpServer.listen(3000, () => console.log('Listening on *:3000'));