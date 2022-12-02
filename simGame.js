import Game from './src/game.js';

import BasicStrat       from './strategies/basicStrat.js';
import Buy100Strat      from './strategies/buy100Strat.js';
import BuyNoneStrat     from './strategies/buyNoneStrat.js';
import HunterStrat      from './strategies/hunterStrat.js'
import OnlyP2MovesStrat from './strategies/onlyP2MovesStrat.js';
import RandomStrat      from './strategies/randomStrat.js';
import RushStrat        from './strategies/rushStrat.js';
import ShopperStrat     from './strategies/shopperStrat.js';
import TurtleStrat      from './strategies/turtleStrat.js';
import InputStrat       from './strategies/inputStrat.js';

const strategies = [new BasicStrat(), new BasicStrat()];
let game = new Game([], strategies);
game.initializeGame();
