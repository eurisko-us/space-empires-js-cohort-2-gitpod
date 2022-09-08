const Game = require('../game');
const Player = require('../player');
const Strategy = require('../strategy');
const assert = require('assert');

// If a player buys a ship, it is added to board and player’s ship list

const players1 = [new Player(1, new Strategy()), new Player(2, new Strategy())];
const game1 = new Game(clientSockets=null, players1, {'Scout': 1});
game1.initializeGame();

const player1 = game1.players[0];

const old_board = [];
for (let i = 0; i < game1.board.length; i++) {
    old_board.push([]);
    for (let j = 0; j < game1.board[i].length; j++) {
        old_board[i].push([]);
        for (let obj of game1.board[i][j]) {
            old_board[i][j].push(obj);
        }
    }
}

const old_player_ships = [];
for (let i = 0; i < player1.ships.length; i++) {
    old_player_ships.push(player1.ships[i]);
}

game1.run();

let newShipInBoard = false;

for (let i = 0; i < game1.board.length; i++) {
    for (let j = 0; j < game1.board[i].length; j++) {
        if (game1.board[i][j].length > old_board[i][j].length) {
            newShipInBoard = true;
        }
    }
}

assert (newShipInBoard, "ship is not added to board");
assert (old_player_ships != player1.ships.length, "ship is not added to player's ship list");