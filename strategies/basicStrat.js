import ParentStrat from './parentStrat.js';

class BasicStrat extends ParentStrat {
    
    constructor() {
        super(ParentStrat);
        this.name = 'basic';
    }

    chooseTranslation(ship, translations) {
        let targetCoords = this.getOpponentHomeColonyCoords(ship);
        return this.minDistanceTranslation(ship, translations, targetCoords);
    }

    chooseTarget(shipInfo, combatOrder) {
        let opponentShips = combatOrder.filter(ship => ship.playerNum != shipInfo.playerNum && ship.hp > 0);
        return this.random(opponentShips);
    }

    buyTech(cpBudget) {
        return ["movement"];
    }

    buyShips(cpBudget) {
        return [{"Scout": 1}];
    }

}

export default BasicStrat;