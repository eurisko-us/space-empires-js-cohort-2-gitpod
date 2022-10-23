import { nullInstances } from '../src/ships.js';
import ParentStrat from './parentStrat.js';

// moves towards opponent home colony, buys random ship

class ShopperStrat extends ParentStrat {
    
    constructor() {
        super(ParentStrat);
    }

    chooseTranslation(ship, translations) {
        let targetCoords = this.getOpponentHomeColonyCoords(ship);
        return this.minDistanceTranslation(ship, translations, targetCoords);
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

}

export default ShopperStrat;