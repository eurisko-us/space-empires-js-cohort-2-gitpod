import AIStrat  from './strategies/aiStrat.js';
import { allShips } from './src/ships.js';
import { existsSync } from 'fs';
import Player from './src/player.js';
import RandomStrat from './strategies/randomStrat.js';

// Maybe want to normalize data
const shipClasses = {'A': 6,'B': 5,'C': 4,'D': 3,'E': 2,'Z': 1}

function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function computeWorth(ship) {
    return ship.hp*(ship.atk + ship.df + shipClasses[ship.shipClass] + ship.cpCost + (ship.df*ship.hp) + (ship.atk*shipClasses[ship.shipClass]))
}

function computeTotalWorth(shipList) {
    let sum = shipList.map(function(e) { 
        return computeWorth(e); 
    }).reduce((a, b) => a + b, 0);

    return sum;
}

function computePayoff(ownShips, oppShips) {
    return computeTotalWorth(ownShips) - computeTotalWorth(oppShips)
}

function addShipsToPlayers(players, playerNumShips) {
    for (let p = 0; p < 2; p++) {
        for (let i = 0; i < playerNumShips[p+1]; i++) {
            const shipIdx = getRandom(0, allShips.length-1);
            let shipClass = allShips[shipIdx]
            const count = players[p].ships.filter(obj => obj instanceof shipClass).length + 1;
            players[p].ships.push(new shipClass(null, p+1, count));
        }
    }
}

function combatPhase(players) {
    let allShipList = players[0].ships.concat(players[1].ships);
    allShipList.sort((a, b) => a.shipClass.localeCompare(b.shipClass));
    let combatOrder = [...allShipList];
    let ship = combatOrder[0];

    let attacker = players[ship.playerNum - 1];
    let target = attacker.strategy.chooseTarget(convertShipToDict(ship), combatOrder);
    let defender = players[target.playerNum - 1];

    if (roll(ship, target)) {
        target.hp -= 1;
        if (target.hp <= 0) {
            defender.ships = defender.ships.filter(plrShip => !(plrShip.id == ship.id));
        }
    }
}

function roll(attacker, defender) {
    let roll = Math.floor(Math.random() * 10);

    if (roll <= attacker.atk - defender.df || roll === 1) {
        return true;
    } else {
        return false;
    }
}

function convertShipToDict(ship) {
    let shipInfo = {};
    for (let key of Object.keys(ship)) {
        shipInfo[key] = ship[key];
    }
    return shipInfo;
}

function runSimulation() {
    // let players = [new Player(1, new AIStrat()), new Player(2, new AIStrat())]
    let players = [new Player(1, new RandomStrat()), new Player(2, new RandomStrat())];
    let playerNumShips = {1: getRandom(3,10), 2: getRandom(3,10)};

    addShipsToPlayers(players, playerNumShips);

    while (true) {
        if (players[0].ships.length == 0 || players[1].ships.length == 0) {
            break;
        }

        combatPhase(players);
        for (let player of players) {
            player.ships = player.ships.filter(plrShip => (plrShip.hp > 0));
        }
    }

    return computePayoff(players[0].ships, players[1].ships);
}

let balance = {1:0, 2:0}
for (let i = 0; i < 25; i++) {
    let players = [new Player(1, new RandomStrat()), new Player(2, new RandomStrat())];
    let playerNumShips = {1: getRandom(3,10), 2: getRandom(3,10)};
    addShipsToPlayers(players, playerNumShips);
    let worths = [];
    for (let player of players) {
        worths.push(computeTotalWorth(player.ships))
    }
    
    if (worths[0] > worths[1]) {
        balance[1] += 1
    }
    else {
        balance[2] += 1
    }
    
}
console.log(balance)






// let sim = {'pos':0, 'neg':0, 'zero':0};

// for (let i = 0; i < 1000; i++) {
//     let payoff = runSimulation()
//     if (payoff > 0) {
//         sim['pos'] += 1
//     }
//     if (payoff < 0) {
//         sim['neg'] += 1
//     }
//     if (payoff == 0) {
//         sim['zero'] += 1
//     }
// }

// console.log(sim)