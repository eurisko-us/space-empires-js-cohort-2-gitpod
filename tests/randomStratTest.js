import Game from '../src/game.js';
import Strategy from '../strategies/strategy.js';

let date = new Date();
let currentTime = date.getMinutes();
let endTime = (currentTime + 5) % 60;

let i = 0;

while (currentTime < endTime) {

    if (i % 10000 == 0) console.log(`${i} games run...`);

    const game = new Game(null, [new Strategy(), new Strategy()], {'Scout': 1});
    game.initializeGame();
    game.start();

    date = new Date();
    currentTime = date.getMinutes();

    i++;

}

console.log('Success');