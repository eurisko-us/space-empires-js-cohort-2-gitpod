import Game from '../src/game.js';
import RushStrat from '../strategies/rushStrat.js';

const strats1 = [new RushStrat(), new BasicStrat()];
const game = new Game(null, strats1, {'Scout': 1});
game.initializeGame();
game.start();
assert (game.winner != 2, "Cheater Strategy won when it should have lost")