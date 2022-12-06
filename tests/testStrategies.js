import Game from './../src/game.js';

import CharlieStrat from '../strategies/competition_1/charlieStrat.js';
import WilliamStrat from '../strategies/competition_1/williamStrat.js';
import JustinStrat  from '../strategies/competition_1/justinStrat.js';
import CaydenStrat  from '../strategies/competition_1/caydenStrat.js';
import AntonStrat   from '../strategies/competition_1/antonStrat.js';
// import MaiaStrat    from './../competitionStrategies/maiaStrat.js';

import BasicStrat       from './../strategies/basicStrat.js';
import Buy100Strat      from './../strategies/buy100Strat.js';
import BuyNoneStrat     from './../strategies/buyNoneStrat.js';
import CheatStrat       from './../strategies/cheatStrat.js';
import HunterStrat      from './../strategies/hunterStrat.js'
import InputStrat       from './../strategies/inputStrat.js';
import OnlyP2MovesStrat from './../strategies/onlyP2MovesStrat.js';
import RandomStrat      from './../strategies/randomStrat.js';
import RushStrat        from './../strategies/rushStrat.js';
import ShopperStrat     from './../strategies/shopperStrat.js';
import TurtleStrat      from './../strategies/turtleStrat.js';

// don't edit this function

function runGame(strat1, strat2, numGames) {

    let numStrat1Wins = 0;
    let numStrat2Wins = 0;
    let numTies = 0;

    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < Math.floor(numGames / 2); j++) {

            let stratNames = (i % 2 == 1) ? [strat2, strat1] : [strat1, strat2];
            let strategies = [];

            // edit this for loop to add a strat

            for (let strat of stratNames) {

                if (strat === 'charlie') strategies.push(new CharlieStrat());
                if (strat === 'william') strategies.push(new WilliamStrat());
                if (strat === 'justin')  strategies.push(new JustinStrat());
                if (strat === 'cayden')  strategies.push(new CaydenStrat());
                if (strat === 'anton')   strategies.push(new AntonStrat());
                // if (strat === 'maia')    strategies.push(new MaiaStrat());

                if (strat === 'basic')       strategies.push(new BasicStrat());
                if (strat === 'buy100')      strategies.push(new Buy100Strat());
                if (strat === 'buyNone')     strategies.push(new BuyNoneStrat());
                if (strat === 'cheat')       strategies.push(new CheatStrat());
                if (strat === 'hunter')      strategies.push(new HunterStrat());
                if (strat === 'input')       strategies.push(new InputStrat());
                if (strat === 'onlyP2Moves') strategies.push(new OnlyP2MovesStrat());
                if (strat === 'random')      strategies.push(new RandomStrat());
                if (strat === 'rush')        strategies.push(new RushStrat());
                if (strat === 'shopper')     strategies.push(new ShopperStrat());
                if (strat === 'turtle')      strategies.push(new TurtleStrat());

            }

            // don't edit below

            const game = new Game(null, strategies);
            game.initializeGame();
            
            while(!game.winner) game.run();

            if (game.winner === i + 1) numStrat1Wins++;
            if (game.winner === 2 - i) numStrat2Wins++;
            if (game.winner === 'Tie') numTies++;

        }
    }

    console.log(`${strat1} vs ${strat2}: ${numStrat1Wins}-${numStrat2Wins}-${numTies}`);

}

function runTournament(strategies, numGamesPerRound) {
    for (let i = 0; i < strategies.length; i++) {
        for (let j = i + 1; j < strategies.length; j++) {
            runGame(strategies[i], strategies[j], numGamesPerRound);
        }
    }
}

// edit this code

let strategies = ['cayden', 'justin', 'anton', 'charlie', 'william'];
let numGamesPerRound = 500;

runTournament(strategies, numGamesPerRound);