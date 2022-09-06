const Game = require('../game');
const Player = require('../player');
const ships = require('../ships');
const Scout = ships.Scout;
const BattleCruiser = ships.BattleCruiser;
const Battleship = ships.Battleship;
const Cruiser = ships.Cruiser;
const Destroyer = ships.Destroyer;
const Dreadnaught = ships.Dreadnaught;
const boardSize = 7;
const Strategy = require('../strategy');
const TestStrat = require('./testStrat')
const players = [new Player(1, new Strategy()), new Player(2, new Strategy())];
const maxTurns = 10;
var assert = require('assert');


const game = new Game(clientSockets=null, players, {'Scout': 1});
game.initializeGame();

// let turn = 0

// for (let i = 0; i < 3; i++) {
//     game.log.turn(turn);
//     game.economicPhase();
//     turn ++
// }

players[0].cp = 15



