import Game from '../src/game.js';

import RushStrat       from '../strategies/rushStrat.js';
import CheatStrat      from '../strategies/cheatStrat.js';
import BasicStrat      from '../strategies/basicStrat.js';
import RandomStrat     from '../strategies/randomStrat.js';
import AIMovementStrat from '../strategies/aiMovementStrat.js';


const strats = [new AIMovementStrat(), new AIMovementStrat()];

const game = new Game(null, strats);
game.initializeGame();

while(!game.winner) {
    game.run();
}

console.log(game.winner);