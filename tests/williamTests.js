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
const testStrats = require('./williamTestStrat');
const Buy100 = testStrats.Buy100;
const BuyNone = testStrats.BuyNone;
const Strategy = require('../strategy');
const players = [new Player(1, new Strategy()), new Player(2, new Strategy())];
const maxTurns = 10;
var assert = require('assert');


const game = new Game(clientSockets=null, [new Player(1, new Buy100()), new Player(2, new Strategy())], {'Scout': 1});
game.initializeGame();

player = game.players[0]
game.economicPhase();
assert(len(player.ships) == 1, 'Player was able to buy ship without enough CP')


const game2 = new Game(clientSockets=null, [new Player(1, new BuyNone()), new Player(2, new Strategy())], {'Scout': 1});
game2.initializeGame();

player = game2.players[0];
player.cp = -10;
game2.economicPhase();

assert(len(player.ships) == 0);
