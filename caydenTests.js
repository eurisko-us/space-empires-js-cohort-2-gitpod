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
const Strategy = require('./strategy');
const players = [new Player(1, new Strategy()), new Player(2, new Strategy())];
const maxTurns = 10;
var assert = require('assert');


const game = new Game(clientSockets=null, players, {'Scout': 1});
game.initializeGame();

let turn = 0

for (let i = 0; i < 3; i++) {
    game.log.turn(turn);
    game.movementPhase();
    turn ++
}
let combatCoords = game.getCombatCoords()
let combatOrder = game.sortCombatOrder(combatCoords[0])
assert (combatOrder[0].playerNum == 1)
console.log("Defenders First Rule Works Correctly")


//initiate combat b4 player 2 moves, ie player 2 ships cant move off of coordinate if player 1 ship in there (can be down at same time as previous test)
//set ships in front of eachother, player 1 moves, run movement, make sure player 2 isnt moving


//combat on colony square test can be done with another player class, one where desired location is that of one of the colonies
//assert only one players ships is in the coordinate
//higher class attacks first, change initial starting ships and have them meet at a coordinate (player 1 has higher ship class than player 2)
//player 1 ship first in combat order