import { nullInstances } from '../src/ships.js'

class RandomStrat {
    
    constructor() {
        this.simpleBoard = null;
        this.turn = 0;
        this.player = null;
    }

    dist(coords1, coords2) {
        return Math.hypot(coords2[0] - coords1[0], coords2[1] - coords1[1]);
    }

    getOpponentHomeColonyCoords(ship) {
        for (let i = 0; i < this.simpleBoard.length; i++) {
            for (let j = 0; j < this.simpleBoard.length; j++) {
                for (let obj of this.simpleBoard[j][i]) {
                    if (obj.objType === 'Colony' && obj.isHomeColony && obj.playerNum != ship.playerNum) {
                        return [j, i];
                    }
                }
            }
        }
    }

    chooseTranslation(ship, translations) {
        return translations[Math.floor(Math.random() * translations.length)];
    }

    chooseTarget(shipInfo, combatOrder) {
        let opponentShips = combatOrder.filter(ship => ship.playerNum != shipInfo.playerNum && ship.hp > 0);
        return opponentShips[Math.floor(Math.random() * opponentShips.length)];
    }

    buyShips(cpBudget) {
        
        const randCostLim = Math.floor(Math.random() * (cpBudget + 1));
        let shipList = [];
        let totalCost = 0;
        
        while (randCostLim >= totalCost) {
            
            let randomShip = nullInstances[Math.floor(Math.random() * nullInstances.length)];
            totalCost += randomShip.cpCost;
            
            if (totalCost >= randCostLim) break;

            let randomShipName = randomShip.name;
            shipList.push({ randomShipName: 1 });

        }

        if (this.turn == 0 && shipList.length == 0) {
            return this.buyShips(cpBudget);
        }
        
        return shipList;
    
    }

}

export default RandomStrat;