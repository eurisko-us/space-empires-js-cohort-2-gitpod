import express from 'express';
import Game from './game.js';
import Strategy from './strategy.js';

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static('public'));
app.get('/', (req, res) => res.sendFile(`${__dirname}/public/index.html`));

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

http.listen(3000, console.log('Listening on *:3000'));

const strategies = {1: new Strategy(), 2: new Strategy()};
const initialShips = {'Scout': 1, 'Cruiser': 1};

const game = new Game(clientSockets, strategies, initialShips);
game.initializeGame();
game.start();