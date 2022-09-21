import Game from '../src/game.js';
import Strategy from '../strategies/strategy.js';
import { Buy100, BuyNone } from '../strategies/buyNone100TestStrat.js';
import assert from 'assert';

// test 1

const game = new Game(null, [new Buy100(), new Strategy()]);
game.initializeGame();

let player1 = game.players[0];
game.economicPhase();
assert(player1.ships.length == 1, 'Player was able to buy ship without enough CP');

// test 2

const game2 = new Game(null, [new BuyNone(), new Strategy()]);
game2.initializeGame();

let player2 = game2.players[0];
player2.cp = -10;
game2.economicPhase();

assert(player2.ships.length == 0, 'Player ship survived without paying maintenence cost');