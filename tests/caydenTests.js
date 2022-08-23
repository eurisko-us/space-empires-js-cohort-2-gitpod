const Game = require('../game');
const Player = require('../player');
const TestStrat = require('./TestStrat')
let assert = require('assert');

// const ships = require('../ships');
// const Scout = ships.Scout;
// const Cruiser = ships.Cruiser;
// const boardSize = 7;
// const Strategy = require('../strategy');
// const players = [new Player(1, new Strategy()), new Player(2, new Strategy())];
// const maxTurns = 10;

// const game = new Game(clientSockets=null, players, {'Scout': 1});
// game.initializeGame();

// let turn = 0;

// for (let i = 0; i < 3; i++) {
//     game.log.turn(turn);
//     game.movementPhase();
//     turn ++;
// }

// let combatCoords = game.getCombatCoords();
// let combatOrder = game.sortCombatOrder(combatCoords[0]);
// assert (combatOrder[0].playerNum == 1);
// console.log("Defenders First Rule Works Correctly");

// const players3 = [new Player(1, new TestStrat()), new Player(2, new TestStrat())];
// const game3 = new Game(clientSockets=null, players3, {'Scout': 1});
// game3.initializeGame();

// for (let i = 0; i < game3.players.length; i++) {
//     game3.removeObjFromBoard(game3.players[i].ships[0]);
//     game3.players[i].ships.splice(0, 1);

//     if (i == 0) {
//         let ship = new Scout([3, 3], 1, 1);
//         game3.players[i].addShip(ship);
//         game3.addToBoard(ship);
//     }
//     if (i == 1) { 
//         let ship = new Cruiser([3, 4], 2, 1);
//         game3.players[i].addShip(ship);
//         game3.addToBoard(ship);
//     }

// }

// game3.movementPhase();
// let combatCoords2 = game3.getCombatCoords();
// let combatOrder2 = game3.sortCombatOrder(combatCoords2[0]);
// assert (combatOrder2[0].name == "Cruiser", "High class ship did not attack first");
// console.log("Higher class ships attack first");

const players = [new Player(1, new TestStrat()), new Player(2, new TestStrat())];
const game = new Game(clientSockets=null, players, {'Scout': 1});
game.initializeGame();

for (let i = 0; i < 7; i++) {
    game.movementPhase()
    game.combatPhase()
    game.checkForWinner()
}

let playerNums = [];

for (let ship of game.getAllShips([3, 0])) {
    if (!playerNums.includes(ship.playerNum)) {
        playerNums.push(ship.playerNum);
    }
}

console.log(game.winner);

// assert (playerNums.length == 1, "Combat did not run properly");
// console.log("Combat ran properly");

// const players2 = [new Player(1, new Strategy()), new Player(2, new Strategy())];
// const game2 = new Game(clientSockets=null, players2, {'Scout': 1});
// game2.initializeGame();

// for (let i = 0; i < game2.players.length; i++) {
//     game2.removeObjFromBoard(game2.players[i].ships[0]);
//     game2.players[i].ships.splice(0, 1);

//     if (i == 0) {
//         let ship = new Dreadnaught([3, 3], 1, 1);
//         ship.setShipId();
//         game2.players[i].addShip(ship);
//         game2.addToBoard(ship);
//     }
//     if (i == 1) { 
//         let ship = new Dreadnaught([3, 4], 2, 1);
//         ship.setShipId();
//         game2.players[i].addShip(ship);
//         game2.addToBoard(ship);
//     }

// }

// game2.movementPhase();
// assert (game2.players[1].ships[0].coords == [3, 4], "Player 2 can still move if player 1 has moved into their space");
// console.log("Player 2 Cannot Move if Player 1 Has Moved Into Their Space");