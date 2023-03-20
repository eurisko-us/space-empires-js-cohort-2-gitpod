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

// let players = [new Player(1, new AIStrat()), new Player(2, new AIStrat())]
let players = [new Player(1, new RandomStrat()), new Player(2, new RandomStrat())]
let playerNumShips = {1: getRandom(3,10), 2: getRandom(3,10)};

// NOT ADDING SHIPS TO FIRST PLAYER
for (let p = 0; p < 2; p++) {
    console.log('p', p)
    for (let i = 0; i < playerNumShips[p]; i++) {
        const shipIdx = getRandom(0, allShips.length-1);
        let shipClass = allShips[shipIdx]
        console.log(players[p].ships.length)
        const count = players[p].ships.filter(obj => obj instanceof shipClass).length + 1;
        console.log(players[p].ships.length)
        // console.log(p)
        players[p].ships.push(new shipClass(null, p+1, count));
    }
}

// console.log(players[1].ships)
exit

function combatPhase() {

    let allShipList = players[0].ships.concat(players[1].ships)
    allShipList.sort((a, b) => a.shipClass.localeCompare(b.shipClass));
    let combatOrder = [...allShipList];


    let ship = combatOrder[0];

    if (ship.name == "ColonyShip") {
        let id = combatOrder.indexOf(this.currentPart) + 1;
        this.currentPart = (id >= combatOrder.length) ? combatOrder[0] : combatOrder[id];
        return;
    };

    let attacker = players[ship.playerNum - 1];
    let target;
    target = attacker.strategy.chooseTarget(convertShipToDict(ship), combatOrder);
    console.log(target)
    let defender = players[target.playerNum - 1];

    if (this.roll(ship, target)) {
        target.hp -= 1;
        if (target.hp <= 0) {
            console.log(target)
            let index = defender.ships.indexOf(ship);
            defender.ships.splice(index, 1);
        }
    }

    let id = combatOrder.indexOf(this.currentPart) + 1;
    this.currentPart = (id >= combatOrder.length) ? combatOrder[0] : combatOrder[id];
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

combatPhase()
console.log(computePayoff(ownShips, oppShips))
