import Game from '../src/game.js';
import Strategy from '../strategies/strategy.js';

for (let i = 0; i < 1000; i++) {

    const game = new Game(null, [new Strategy(), new Strategy()], {'Scout': 1}, 1);
    game.initializeGame();
    game.start();

}

console.log('Success');