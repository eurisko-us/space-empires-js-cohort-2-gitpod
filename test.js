const Game = require('./game.js')
const Player = require('./player');

const clientSockets = {}

const game = new Game(clientSockets, [7, 7], [new Player(1), new Player(2)])

game.initializeGame();
game.run(5)
