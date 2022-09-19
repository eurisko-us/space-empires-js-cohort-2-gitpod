import Game from '../src/game.js';
import Strategy from '../strategies/strategy.js';
import RandomStrategy from '../strategies/randomStrat.js';

// let strats = [new Strategy(), new Strategy()]
let strats = [new RandomStrategy(), new RandomStrategy()]

for (let i = 0; i < 1000; i++) {

    const game = new Game(null, strats, {'Scout': 1}, 1);
    game.initializeGame();
    game.start();

}

console.log('Success');