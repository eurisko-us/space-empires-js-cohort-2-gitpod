import WilliamStrat from './competitionStrategies/williamStrat.js';
import RandomStrat from './strategies/randomStrat.js';
import TurtleStrat from './strategies/turtleStrat.js';
import RushStrat from './strategies/rushStrat.js';
import BasicStrat from './strategies/basicStrat.js';
import ShopperStrat from './strategies/shopperStrat.js';
import HunterStrat from './strategies/hunterStrat.js';
import Game from './src/game.js';


// Starting Positions: P1: [3,0], P2: [3,6], Starting CP 150, 10 CP per round

//// Run 1 Game

// let strats = [new WilliamStrat(), new RushStrat()]
// const game = new Game(null, strats, 1);
// game.initializeGame();
// while (game.winner == null) {
//     game.run()
// }
// console.log(game.winner);

//// Run Multiple

let winners = {1:0, 2:0, 'Tie':0};
for (let i = 0; i < 100; i++) {
    let strats = [new WilliamStrat(), new RushStrat()]
    // console.log(i)
    const game = new Game(null, strats, 1);
    game.initializeGame();
    while (game.winner == null) {
        game.run()
    }
    winners[game.winner] += 1;
    // if (game.winner == 2) {
    //     break
    // }
}
console.log(winners)
