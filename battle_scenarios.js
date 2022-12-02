/*
Chances of hitting
S= 3atk 0df 1hp (5)
BC = 5atk 1df 2hp (2)
BS= 5atk 2df 3hp (1)
C= 4atk 1df 2hp (3)
D= 4atk 0df 1hp (4)
DN= 6atk 3df 3hp (1)

% of hit
SvS = 30% 
SvBC = 20%
SvBS = 10%
SvC = 20%
SvD = 30%
SvDN = 10%

BCvS = 50%
BCvBC = 40%
BCvBS = 30%
BCvC = 40%
BCvD = 50%
BCvDN = 20%

BS same as BC

CvS = 40%
CvBC = 30%
CvBS = 20%
CvC = 30%
CvD = 40%
CvDN = 10%

D same as C

DNvS = 60%
DNvBC = 50%
DNvBS = 40%
DNvC = 50%
DNvD = 60%
DNvDN = 30%


*/

function translate(array) {
    let trans = [];
    for (var ship of array) {
        trans.push(ship.name + ship.shipNum)
    }
    return trans
}

class Plr1 {
    
    constructor() {
        this.name = 'plr1';
    }

    random(list) {
        return list[Math.floor(Math.random() * list.length)];
    }

    chooseTranslation(ship, translations) {
        return [0,0]
    }

    //*
    chooseTarget(shipInfo, combatOrder) {
        let opponentShips = combatOrder.filter(ship => ship.playerNum != shipInfo.playerNum && ship.hp > 0);
        return this.random(opponentShips);
    }
    //*/

    /*
    chooseTarget(shipInfo, combatOrder) {
        let opponentShips = combatOrder.filter(ship => ship.playerNum != shipInfo.playerNum && ship.hp > 0);
        return opponentShips[Math.floor(Math.random() * opponentShips.length)];
    }
    //*/

    /*
    chooseTarget(shipInfo, combatOrder) {
        let opponentShips = combatOrder.filter(ship => ship.playerNum != shipInfo.playerNum && ship.hp > 0);
        return opponentShips[0];
    }
    //*/

    buyShips(cpBudget) {
        const plr1Ships = [
            {'Scout': Math.floor(Math.random() * 5)},
            {'BattleCruiser': Math.floor(Math.random() * 5)},
            {'Battleship': Math.floor(Math.random() * 5)},
            {'Cruiser': Math.floor(Math.random() * 5)},
            {'Destroyer': Math.floor(Math.random() * 5)},
            {'Dreadnaught': Math.floor(Math.random() * 5)}
        ]
        return plr1Ships
    }

}

class Plr2 {
    
    constructor() {
        this.name = 'plr2';
    }

    random(list) {
        return list[Math.floor(Math.random() * list.length)];
    }

    riskAssess(combatOrder){
        //Will need to add code for combat order
        //Could also just run brief simulation of 20 rounds of scenario
    }

    chooseTarget(shipInfo, combatOrder){
        let plrNum = shipInfo.playerNum;

        let oppShips = [[],[]];
        let shipId = combatOrder.findIndex(ship => ship == shipInfo);
        let place = 0;

        for (let i = 0; i < combatOrder.length; i++) {
            if (i == shipId) {
                place = 1;
            };
            if (combatOrder[i].playerNum != plrNum) oppShips[place].push(combatOrder[i]);
        };

        let priority = [...oppShips[1], ...oppShips[0]];
        priority.sort((a,b) => (shipInfo.atk - b.df) - (shipInfo.atk - a.df) );
        priority.sort((a,b) => a.hp - b.hp);
        //console.log(translate(priority))

        return priority[0];
    }

    buyShips(cpBudget) {
        const plr2Ships = [
            {'Scout': Math.floor(Math.random() * 5)},
            {'BattleCruiser': Math.floor(Math.random() * 5)},
            {'Battleship': Math.floor(Math.random() * 5)},
            {'Cruiser': Math.floor(Math.random() * 5)},
            {'Destroyer': Math.floor(Math.random() * 5)},
            {'Dreadnaught': Math.floor(Math.random() * 5)}
        ]
        return plr2Ships
    }

}

let strats = [new Plr1, new Plr2]
const trials = 20
const wins = {1: 0, 2: 0}


import Game from './fuck_you.js';

let game = new Game([], strats)
game.initializeGame()
console.log(strats[0].buyShips(1))
console.log(strats[1].buyShips(1))

//*
for (let i = 0; i < trials; i++) {
    game.combatPhase()
    for (let i2 = 0; i2 < game.players.length; i2++) {
        let empty = (game.players[i2].ships.length == 0)
        if (!empty) wins[i2+1] ++
        game.players[i2].ships = []
        game.buyShips(game.players[i2])
    }
    game.log.write('\n\n')
}
console.log(wins)
//*/