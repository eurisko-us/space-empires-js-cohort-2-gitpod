const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const Game = require('./game');
const Player = require('./player');
const Strategy = require('./strategy');

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

http.listen(3000, () => console.log('Listening on *:3000'));

const players = [new Player(1, new Strategy()), new Player(2, new Strategy())];
const initialShips = {'Scout': 1, 'Cruiser': 1};
const game = new Game(clientSockets, players, initialShips);

game.initializeGame();
game.start();