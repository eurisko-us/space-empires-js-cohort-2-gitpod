import AIStrat  from './strategies/aiStrat.js';
import { allShips } from './src/ships.js';


function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

let ownShips = [];
let oppShips = [];

let ownShipNum = getRandom(3,10);
let oppShipNum = getRandom(3,10);

for (let i = 0; i < ownShipNum; i++) {
    const shipIdx = getRandom(0, allShips.length-1);
    let shipClass = allShips[shipIdx]
    const count = ownShips.filter(obj => obj instanceof shipClass).length; 
    ownShips.push(new shipClass(null, 1, count));
}

console.log(ownShips)