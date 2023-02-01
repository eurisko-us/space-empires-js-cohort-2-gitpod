import Game from '../src/game.js';
import RushStrat from '../strategies/rushStrat.js';
import CheatStrat from '../strategies/cheatStrat.js';
import BasicStrat       from './../strategies/basicStrat.js';
import RandomStrat from '../strategies/randomStrat.js';


const strats = [new RandomStrat(), new BasicStrat()];

const game = new Game(null, strats);
game.initializeGame();

while(!game.winner) game.run();
console.log(game.winner)