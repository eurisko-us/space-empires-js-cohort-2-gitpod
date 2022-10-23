import Game from '../src/game.js';
import { Scout, Cruiser, Dreadnaught } from '../src/ships.js';
import OnlyP2MovesStrat from '../strategies/onlyP2MovesStrat.js';
import BasicStrat from '../strategies/basicStrat.js';
import assert, { deepEqual } from 'assert';

// test 1, defenders first rule

const strats1 = [new BasicStrat(), new BasicStrat()];
const game = new Game(null, strats1, {'Scout': 1});
game.initializeGame();

let turn = 0;

for (let i = 0; i < 3; i++) {
    game.log.turn(turn);
    game.movementPhase();
    turn++;
}

let combatCoords = game.getCombatCoords();
let combatOrder = game.sortCombatOrder(combatCoords[0]);
assert (combatOrder[0].playerNum == 1);
console.log("Defenders First Rule Works Correctly");

// test 2, ship class combat priority

const strats2 = [new OnlyP2MovesStrat(), new OnlyP2MovesStrat()];
const game2 = new Game(null, strats2, {'Scout': 1});
game2.initializeGame();

for (let i = 0; i < game2.players.length; i++) {

    game2.removeObjFromBoard(game2.players[i].ships[0]);
    game2.players[i].ships.splice(0, 1);

    if (i == 0) {
        let ship = new Scout([3, 3], 1, 1);
        game2.players[i].addShip(ship);
        game2.addToBoard(ship);
    }
    
    if (i == 1) { 
        let ship = new Cruiser([3, 4], 2, 1);
        game2.players[i].addShip(ship);
        game2.addToBoard(ship);
    }

}

game2.movementPhase();
let combatCoords2 = game2.getCombatCoords();
let combatOrder2 = game2.sortCombatOrder(combatCoords2[0]);
assert (combatOrder2[0].name == "Cruiser", "High class ship did not attack first");
console.log("Higher class ships attack first");

// test 3, combat on colony coord

const strats3 = [new OnlyP2MovesStrat(), new OnlyP2MovesStrat()];
const game3 = new Game(null, strats3, {'Scout': 1});
game3.initializeGame();

for (let i = 0; i < game3.boardSize; i++) {
    game3.movementPhase()
    game3.combatPhase()
    game3.checkForWinner()
}

let playerNums = [];

for (let ship of game3.getAllShips([3, 0])) {
    if (!playerNums.includes(ship.playerNum)) {
        playerNums.push(ship.playerNum);
    }
}

assert (playerNums.length == 1, "There is no combat on colony square");
console.log("There is combat on colony square");

// test 4, friendly fire

const strats4 = [new BasicStrat(), new BasicStrat()];
const game4 = new Game(null, strats3, {'Scout': 1});
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

// test 5, dead ships can't attack

const strats5 = [new BasicStrat(), new BasicStrat()];
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
}

let s1 = new Scout([3,4], 2, 1);
game5.players[1].addShip(s1);
game5.addToBoard(s1);

function containsObject(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i] === obj) {
            return true;
        }
    }

    return false;
}

game5.run()
const combatOrderCurr = game5.sortCombatOrder([3,3])
assert(!containsObject(s1, combatOrderCurr))
console.log('dead ships are not in combat order')