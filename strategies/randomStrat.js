import { nullInstances } from '../src/objects/ships.js';
import ParentStrat from './parentStrat.js';

// moves randomly, buys random ship

class RandomStrat extends ParentStrat {
    
    constructor() {
        super(ParentStrat);
        this.name = 'random';
    }

    chooseTranslation(ship, translations) {
        return this.random(translations);
    }

    chooseTarget(shipInfo, combatOrder) {
        let opponentShips = combatOrder.filter(ship => ship.playerNum != shipInfo.playerNum && ship.hp > 0);
        return this.random(opponentShips);
    }

    buyShips(cpBudget) {

        const randCostLim = Math.floor(Math.random() * (cpBudget + 1));
        
        let shipList = [];
        let totalCost = 0;

        while (randCostLim >= totalCost) {
            
            let randomShip = this.random(nullInstances);
            
            totalCost += randomShip.cpCost;
            if (totalCost >= randCostLim) break;

            let shipDict = {};
            let shipName = randomShip.name;
            shipDict[shipName] = 1;
            shipList.push(shipDict);

        }

        if (this.turn == 0 && shipList.length == 0) return this.buyShips(cpBudget);
        return shipList;
    
    }

    maintOrder(ships) {
        return ships.sort(() => Math.random() - 0.5);
    }
    
}

export default RandomStrat;