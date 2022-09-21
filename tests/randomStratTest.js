import Game from '../src/game.js';
import Strategy from '../strategies/strategy.js';
import RandomStrategy from '../strategies/randomStrat.js';

// let strats = [new Strategy(), new Strategy()]
let strats = [new RandomStrategy(), new Strategy()]

// const game = new Game(null, strats, 1);
// game.initializeGame();
// game.start();

for (let i = 0; i < 30; i++) { // each game is roughly 1.5 - 2 seconds

    const game = new Game(null, strats, 1);
    game.initializeGame();
    game.start();

}

console.log('Success');