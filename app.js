import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

import Game from './src/game.js';
import BasicStrat from './strategies/basicStrat.js';
import RushStrat from './strategies/rushStrat.js';
import HunterStrat from './strategies/hunterStrat.js'
import RandomStrat from './strategies/randomStrat.js';
import ShopperStrat from './strategies/shopperStrat.js';

// import { readdirSync } from 'fs';
// import { dirname, join } from 'path';
// import { fileURLToPath } from 'url';

// const __dirname = dirname(fileURLToPath(import.meta.url));
// const strategiesPath = join(__dirname, "strategies");

// const allStrats = [];

// for (const file of readdirSync(strategiesPath)) {
//     const filePath = join(strategiesPath, file);
//     const strat = await import(filePath);
//     allStrats.push(strat.default);
// }

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
        const strategies = [new BasicStrat(), new BasicStrat()];
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