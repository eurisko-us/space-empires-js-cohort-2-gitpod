import Game from '../src/game.js';
import { Scout, Dreadnaught } from '../ships.js';
import testStrat from '../strategies/justinTestStrat.js';
import Strategy from '../strategy.js';
import assert, { deepEqual } from 'assert';

// test friendly fire - Done
// test that ships cant move off board - Done
// test win condition - Done
// test that dead ship cant attack - Combat doesnt work right
// test tie condition - Done

// test 1

const strats = [new testStrat(), new testStrat()];
const game = new Game(null, strats, {'Scout': 1});
game.initializeGame();

for (let i = 0; i < 3; i++) {
    game.run();
}

deepEqual(game.players[0].ships[0].coords, [3, 0]);
console.log("ship cannot move off of board");

// test 2

const strats2 = [new Strategy(), new Strategy()];
const game2 = new Game(null, strats2, {'Scout': 1});
game2.initializeGame();

for (let i = 0; i < game2.players.length; i++) {

    game2.removeObjFromBoard(game2.players[i].ships[0]);
    game2.players[i].ships.splice(0, 1);

    if (i == 0) {
        let ship = new Dreadnaught([3, 6], 1, 1);
        game2.players[i].addShip(ship);
        game2.addToBoard(ship);
    }

    if (i == 1) { 
        let ship = new Dreadnaught([3, 0], 2, 1);
        game2.players[i].addShip(ship);
        game2.addToBoard(ship);
    }

}

game2.run();
deepEqual(game2.winner, 'Tie');
console.log('tie condition met');

// test 3

const strats3 = [new Strategy(), new Strategy()];
const game3 = new Game(null, strats3, {'Scout': 1});
game3.initializeGame();

for (let i = 0; i < game3.players.length; i++) {

    game3.removeObjFromBoard(game3.players[i].ships[0]);
    game3.players[i].ships.splice(0, 1);

    if (i == 0) {
        let ship = new Dreadnaught([3, 6], 1, 1);
        game3.players[i].addShip(ship);
        game3.addToBoard(ship);
    }

}

game3.run();
deepEqual(game3.winner, 1)
console.log('win condition met')

// test 4

const strats4 = [new Strategy(), new Strategy()];
const game4 = new Game(null, strats4, {'Scout': 1});
game4.initializeGame();

for (let i = 0; i < game4.players.length; i++) {

    game4.removeObjFromBoard(game4.players[i].ships[0]);
    game4.players[i].ships.splice(0, 1);

    if (i == 0) {

        let ship = new Dreadnaught([3, 6], 1, 1);
        game4.players[i].addShip(ship);
        game4.addToBoard(ship);

        let ship2 = new Dreadnaught([3,6], 1, 2);
        game4.players[i].addShip(ship2);
        game4.addToBoard(ship2);

    }

}

assert(!game4.checkForCombat([3,6]))
console.log('friendly ships do not engage in combat')

// test 5

const strats5 = [new Strategy(), new Strategy()];
const game5 = new Game(null, strats5, {'Scout': 1});
game5.initializeGame();

for (let i = 0; i < game5.players.length; i++) {
    
    game5.removeObjFromBoard(game5.players[i].ships[0]);
    game5.players[i].ships.splice(0, 1);

    if (i == 0) {

        let d1 = new Dreadnaught([3, 2], 1, 1);
        game5.players[i].addShip(d1);
        game5.addToBoard(d1);

        let d2 = new Dreadnaught([3, 2], 1, 2);
        game5.players[i].addShip(d2);
        game5.addToBoard(d2);

        let d3 = new Dreadnaught([3, 2], 1, 3);
        game5.players[i].addShip(d3);
        game5.addToBoard(d3);

        let d4 = new Dreadnaught([3, 2], 1, 4);
        game5.players[i].addShip(d4);
        game5.addToBoard(d4);

    }

    if (i == 1) {
        let s1 = new Scout([3,4], 2, 1);
        game5.players[i].addShip(s1);
        game5.addToBoard(s1);
    }
}

game5.run()

// combat doesnt work if all opponents get destroyed
