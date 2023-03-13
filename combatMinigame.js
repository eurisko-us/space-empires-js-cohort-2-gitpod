import AIStrat  from '../strategies/aiStrat.js';
import { allShips } from './ships.js';


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
    shipIdx = getRandom(0, allShips.length);
    let shipClass = allShips[shipIdx]
    const count = myArray.filter(obj => obj instanceof shipClass).length; 
    ownShipNum.push(new shipClass(null, 1, count));


}

console.log(ownShips)