const Game = require('./game');
const Player = require('./player');
const TestPlayer = require('./testPlayer')
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

// test friendly fire
// test that ships cant move off board
// test win condition
// test that dead ship cant attack
// test tie condition


