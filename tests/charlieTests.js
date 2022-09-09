import Game from '../src/game.js';
import Strategy from '../strategy.js';
import assert from 'assert';

// If a player buys a ship, it is added to board and player’s ship list

const strats = [new Strategy(), new Strategy()];
const game1 = new Game(null, strats, {'Scout': 1});
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