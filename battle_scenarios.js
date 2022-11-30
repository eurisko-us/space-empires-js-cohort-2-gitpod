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
            {'Scout': 0},
            {'BattleCruiser': 0},
            {'Battleship': 5},
            {'Cruiser': 0},
            {'Destroyer': 0},
            {'Dreadnaught': 0}
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

    targetChoice(shipInfo, combatOrder){
        let order = [[]]
        let curTurn = combatOrder[0].playerNum
        let section = 0
        for (var ship of combatOrder){
            if (curTurn != ship.playerNum){
                curTurn = ship.playerNum
                section += 1
                order.push([])
            }
            order[section].push(ship)
        }
        let self = order.map((sect,id) => {if (sect[0].playerNum == 2) return id})
    }

    chooseTarget(shipInfo, combatOrder) {
        let opponentShips = combatOrder.filter(ship => ship.playerNum != shipInfo.playerNum && ship.hp > 0);
        return this.random(opponentShips); 
    }

    buyShips(cpBudget) {
        const plr2Ships = [
            {'Scout': 0},
            {'BattleCruiser': 0},
            {'Battleship': 0},
            {'Cruiser': 0},
            {'Destroyer': 0},
            {'Dreadnaught': 5}
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