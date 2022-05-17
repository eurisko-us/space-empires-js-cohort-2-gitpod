const Game = require('./game');
const Player = require('./player');
const ships = require('./ships');
const Scout = ships.Scout;
const BattleCruiser = ships.BattleCruiser;
const Battleship = ships.Battleship;
const Cruiser = ships.Cruiser;
const Destroyer = ships.Destroyer;
const Dreadnaught = ships.Dreadnaught;
const boardSize = 7;
const testStrat = require('./justinTestStrat')
const players = [new Player(1, new testStrat()), new Player(2, new testStrat())];
const maxTurns = 10;
var assert = require('assert');

// test friendly fire
// test that ships cant move off board
// test win condition
// test that dead ship cant attack
// test tie condition

const game = new Game(clientSockets=null, players, {'Scout': 1});
game.initializeGame();

game.start()