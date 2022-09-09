import Game from '../src/game.js';
import { Scout, Cruiser, Dreadnaught } from '../src/ships.js';
import TestStrat from '../strategies/testStrat.js';
import Strategy from '../strategies/strategy.js';
import assert, { deepEqual } from 'assert';

// test 1, cannot move if opp in coord

const strats1 = [new Strategy(), new Strategy()];
const game1 = new Game(null, strats1, {'Scout': 1});
game1.initializeGame();

for (let i = 0; i < game1.players.length; i++) {
    
    game1.removeObjFromBoard(game1.players[i].ships[0]);
    game1.players[i].ships.splice(0, 1);

    if (i == 0) {
        let ship = new Dreadnaught([3, 3], 1, 1);
        game1.players[i].addShip(ship);
        game1.addToBoard(ship);
    }

    if (i == 1) { 
        let ship = new Dreadnaught([3, 4], 2, 1);
        game1.players[i].addShip(ship);
        game1.addToBoard(ship);
    }

}

game1.movementPhase();
assert (game1.players[1].ships[0].coords[0] == 3 && game1.players[1].ships[0].coords[1] == 4, "Player 2 can still move if player 1 has moved into their space");
console.log("Player 2 Cannot Move if Player 1 Has Moved Into Their Space");

