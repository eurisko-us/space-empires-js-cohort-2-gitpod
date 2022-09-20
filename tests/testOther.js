import Game from '../src/game.js';
import { Scout, Dreadnaught } from '../src/ships.js';
import testStrat from '../strategies/justinTestStrat.js';
import Strategy from '../strategies/strategy.js';
import assert, { deepEqual } from 'assert';

// If a player buys a ship, it is added to board and player’s ship list

const strats = [new Strategy(), new Strategy()];
const game1 = new Game(null, strats);
game1.initializeGame();

const player1 = game1.players[0];
const oldBoard = [];

for (let i = 0; i < game1.board.length; i++) {
    oldBoard.push([]);
    for (let j = 0; j < game1.board[i].length; j++) {
        oldBoard[i].push([]);
        for (let obj of game1.board[i][j]) {
            oldBoard[i][j].push(obj);
        }
    }
}

const oldPlayerShips = [];
for (let i = 0; i < player1.ships.length; i++) {
    oldPlayerShips.push(player1.ships[i]);
}

game1.run();

let newShipInBoard = false;

for (let i = 0; i < game1.board.length; i++) {
    for (let j = 0; j < game1.board[i].length; j++) {
        if (game1.board[i][j].length > oldBoard[i][j].length) {
            newShipInBoard = true;
        }
    }
}

assert (newShipInBoard, "ship is not added to board");
assert (oldPlayerShips != player1.ships.length, "ship is not added to player's ship list");
// test 2, tie condition

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

// test 3, win condition

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