const Game = require('./game');
const Player = require('./player');
const TestPlayer = require('./TestPlayer')
const ships = require('./ships');
const Scout = ships.Scout;
const BattleCruiser = ships.BattleCruiser;
const Battleship = ships.Battleship;
const Cruiser = ships.Cruiser;
const Destroyer = ships.Destroyer;
const Dreadnaught = ships.Dreadnaught;
const boardSize = 7;
const players = [new Player(1), new Player(2)];
const maxTurns = 10;
var assert = require('assert');


const game = new Game(clientSockets=null, boardSize, players, maxTurns);
game.initializeGame();

for (let i = 0; i < players.length; i++) {
    game.removeFromBoard(players[i].ships[0])
    game.removeFromBoard(players[i].ships[1])
    players[i].ships = []
    let ship = new Dreadnaught([3,6*i], i+1, 1);
    players[i].addShip(ship);
    game.addToBoard(ship);

}
game.start();

//check defender first rule and that combat runs until only one players ship is left, use desired_coord as [3, 3]
//assert player 2 ship is first in combat order

//combat on colony square test can be done with another player class, one where desired location is that of one of the colonies
//assert only one players ships is in the coordinate

//higher class attacks first, change initial starting ships and have them meet at a coordinate (player 1 has higher ship class than player 2)
//player 1 ship first in combat order

//initiate combat b4 player 2 moves, ie player 2 ships cant move off of coordinate if player 1 ship in there (can be down at same time as previous test)
//set ships in front of eachother, player 1 moves, run movement, make sure player 2 isnt moving