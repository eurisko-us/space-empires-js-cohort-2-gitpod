const Game = require('../game');
const Player = require('../player');
const ships = require('../ships');
const Scout = ships.Scout;
const BattleCruiser = ships.BattleCruiser;
const Battleship = ships.Battleship;
const Cruiser = ships.Cruiser;
const Destroyer = ships.Destroyer;
const Dreadnaught = ships.Dreadnaught;
const boardSize = 7;
const testStrat = require('./justinTestStrat')
const strat = require('../strategy')
const players = [new Player(1, new testStrat()), new Player(2, new testStrat())];
const maxTurns = 10;
var assert = require('assert');

// test friendly fire - Done
// test that ships cant move off board - Done
// test win condition - Done
// test that dead ship cant attack - Combat doesnt work right
// test tie condition - Done

const game = new Game(clientSockets=null, players, {'Scout': 1});
game.initializeGame();

for (i=0; i<3; i++){
    game.run();
}

assert.deepEqual(game.players[0].ships[0].coords, [3,0]);
console.log("ship cannot move off of board");

const players2 = [new Player(1, new strat()), new Player(2, new strat())];
const game2 = new Game(clientSockets=null, players2, {'Scout': 1});
game2.initializeGame();

for (let i = 0; i < game2.players.length; i++) {
    game2.removeObjFromBoard(game2.players[i].ships[0]);
    game2.players[i].ships.splice(0, 1);

    if (i == 0) {
        let ship = new Dreadnaught([3, 6], 1, 1);
        ship.setShipId();
        game2.players[i].addShip(ship);
        game2.addToBoard(ship);
    }
    if (i == 1) { 
        let ship = new Dreadnaught([3, 0], 2, 1);
        ship.setShipId();
        game2.players[i].addShip(ship);
        game2.addToBoard(ship);
    }
}
game2.run();
assert.deepEqual(game2.winner, 'Tie');
console.log('tie condition met');

const players3 = [new Player(1, new strat()), new Player(2, new strat())];
const game3 = new Game(clientSockets=null, players3, {'Scout': 1});
game3.initializeGame();

for (let i = 0; i < game3.players.length; i++) {
    game3.removeObjFromBoard(game3.players[i].ships[0]);
    game3.players[i].ships.splice(0, 1);

    if (i == 0) {
        let ship = new Dreadnaught([3, 6], 1, 1);
        ship.setShipId();
        game3.players[i].addShip(ship);
        game3.addToBoard(ship);
    }
}
game3.run();
assert.deepEqual(game3.winner, 1)
console.log('win condition met')

const players4 = [new Player(1, new strat()), new Player(2, new strat())];
const game4 = new Game(clientSockets=null, players4, {'Scout': 1});
game4.initializeGame();

for (let i = 0; i < game4.players.length; i++) {
    game4.removeObjFromBoard(game4.players[i].ships[0]);
    game4.players[i].ships.splice(0, 1);

    if (i == 0) {
        let ship = new Dreadnaught([3, 6], 1, 1);
        ship.setShipId();
        game4.players[i].addShip(ship);
        game4.addToBoard(ship);
        let ship2 = new Dreadnaught([3,6], 1, 2);
        ship2.setShipId();
        game4.players[i].addShip(ship2);
        game4.addToBoard(ship2);
    }
}
assert(!game4.checkForCombat([3,6]))
console.log('friendly ships do not engage in combat')

const players5 = [new Player(1, new strat()), new Player(2, new strat())];
const game5 = new Game(clientSockets=null, players5, {'Scout': 1});
game5.initializeGame();

for (let i = 0; i < game5.players.length; i++) {
    game5.removeObjFromBoard(game5.players[i].ships[0]);
    game5.players[i].ships.splice(0, 1);

    if (i == 0) {
        let d1 = new Dreadnaught([3,2], 1, 1);
        d1.setShipId();
        game5.players[i].addShip(d1);
        game5.addToBoard(d1);
        let d2 = new Dreadnaught([3,2], 1, 2);
        d2.setShipId();
        game5.players[i].addShip(d2);
        game5.addToBoard(d2);
        let d3 = new Dreadnaught([3,2], 1, 3);
        d3.setShipId();
        game5.players[i].addShip(d3);
        game5.addToBoard(d3);
        let d4 = new Dreadnaught([3,2], 1, 4);
        d4.setShipId();
        game5.players[i].addShip(d4);
        game5.addToBoard(d4);
    }

    if (i==1) {
        let s1 = new Scout([3,4], 2, 1);
        s1.setShipId();
        game5.players[i].addShip(s1);
        game5.addToBoard(s1);
    }
}
game5.run()
// combat doesnt work if all opponents get destroyed
