import Game from '../src/game.js';
import TurtleStrat from '../strategies/turtleStrat.js';
import RandomStrat from '../strategies/randomStrat.js';
import RushStrat from '../strategies/rushStrat.js';
import BasicStrat from '../strategies/basicStrat.js';
import CheatStrat from '../strategies/cheatStrat.js';

// let strats = [new BasicStrat(), new BasicStrat()]
let strats = [new CheatStrat(), new RandomStrat()]
// let strats = [new BasicStrat(), new TurtleStrat()]


// Run 1 Game
const game = new Game(null, strats, 1);
game.initializeGame();
game.start();


// Run Multiple Games

// let allGames = [];

// for (let i = 0; i < 100; i++) { // each game is roughly 1.5 - 2 seconds

//     const game = new Game(null, strats, 1);
//     game.initializeGame();
//     game.start();
//     allGames.push(game);

// }

// // while loop that every time it runs, gets all the winners, 
// // if every game has a winner, break; otherwise delay for 5 sec, run while again

// let finishedTests = [];

// while (finishedTests.length < 100) {
    
//     for (let game of allGames) {
//         if (game.winner) {
//             if (!finishedTests.includes(game)) {
//                 finishedTests.push(game);
//             }
//         }
//     }

//     console.log(`${finishedTests.length} games finished`);
//     await setTimeout(2000);

//   }


// console.log('Success');
// console.log(finishedTests.length);
