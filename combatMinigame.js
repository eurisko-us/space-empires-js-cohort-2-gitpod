import AIStrat  from './strategies/aiStrat.js';
import { allShips } from './src/ships.js';

// Maybe want to normalize data
const shipClasses = {'A': 6,'B': 5,'C': 4,'D': 3,'E': 2,'Z': 1}

function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function computeWorth(ship) {
    // console.log({'HP': ship.hp, 'ATK': ship.atk, 'DF': ship.df, 'SHIPCLASS': shipClasses[ship.shipClass], 'CP': ship.cpCost})
    return ship.hp*(ship.atk + ship.df + shipClasses[ship.shipClass] + ship.cpCost + (ship.df*ship.hp) + (ship.atk*shipClasses[ship.shipClass]))
}

function computePayoff(ownShips, oppShips) {
    let ownSum = ownShips.map(function(e) { 
        return computeWorth(e); 
    }).reduce((a, b) => a + b, 0);

    let oppSum = oppShips.map(function(e) {
        return computeWorth(e);
    }).reduce((a, b) => a + b, 0);

    return ownSum - oppSum
}

let ownShips = [];
let oppShips = [];

let ownShipNum = getRandom(3,10);
let oppShipNum = getRandom(3,10);

for (let i = 0; i < ownShipNum; i++) {
    const shipIdx = getRandom(0, allShips.length-1);
    let shipClass = allShips[shipIdx]
    const count = ownShips.filter(obj => obj instanceof shipClass).length + 1;
    ownShips.push(new shipClass(null, 1, count));
}

for (let i = 0; i < oppShipNum; i++) {
    const shipIdx = getRandom(0, allShips.length-1);
    let shipClass = allShips[shipIdx]
    const count = oppShips.filter(obj => obj instanceof shipClass).length + 1;
    oppShips.push(new shipClass(null, 1, count));
}





console.log(computePayoff(ownShips, oppShips))
