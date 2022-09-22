import Game from '../src/game.js';
import Strategy from '../strategies/strategy.js';
import { setTimeout } from "timers/promises";
import RandomStrategy from '../strategies/randomStrat.js';

// let strats = [new Strategy(), new Strategy()]
let strats = [new RandomStrategy(), new RandomStrategy()]

// const game = new Game(null, strats, 1);
// game.initializeGame();
// game.start();

let allGames = [];

for (let i = 0; i < 100; i++) { // each game is roughly 1.5 - 2 seconds

    const game = new Game(null, strats, 1);
    game.initializeGame();
    game.start();
    allGames.push(game)

}

//while loop that every time it runs, gets all the winners, 
//if every game has a winner, break, otherwise delay for 5 sec, run while again

let finishedTests = [];

while (finishedTests.length < 100) {
    for (let game of allGames) {
        if (game.winner != null) {
            if (!finishedTests.includes(game)) {
                finishedTests.push(game)
            }
        }
    }
    console.log(`${finishedTests.length} games finished`)
    await setTimeout(2000)
  }


console.log('Success');
console.log(finishedTests.length)
