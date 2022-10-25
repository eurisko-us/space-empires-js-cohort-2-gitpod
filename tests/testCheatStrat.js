import Game from '../src/game.js';
import RushStrat from '../strategies/rushStrat.js';
import CheatStrat from '../strategies/cheatStrat.js';
import assert, { deepEqual } from 'assert';


const strats1 = [new RushStrat(), new CheatStrat()];
const game = new Game(null, strats1);
game.initializeGame();
game.start();
assert (game.winner != 2, "Cheater Strategy won when it should have lost")