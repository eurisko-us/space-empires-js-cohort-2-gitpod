import Game from '../src/game.js';
import TurtleStrat from '../strategies/turtleStrat.js';
import RandomStrategy from '../strategies/randomStrat.js';

let strats = [new RandomStrategy(), new TurtleStrat()]

const game = new Game(null, strats, 1);
game.initializeGame();
game.start();
console.log(game.winner);