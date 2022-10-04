import Game from '../src/game.js';
import TurtleStrat from '../strategies/turtleStrat.js';
import RandomStrategy from '../strategies/randomStrat.js';
import RushStrat from '../strategies/rush.js';
import Strategy from '../strategies/strategy.js';

let strats = [new Strategy(), new TurtleStrat()]

const game = new Game(null, strats, 1);
game.initializeGame();
game.start();
console.log(game.winner);