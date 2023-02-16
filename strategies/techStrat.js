import ParentStrat from './parentStrat.js';

class TechStrat extends ParentStrat {
    
    constructor() {
        super(ParentStrat);
        this.name = 'tech';
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
        return ["attack", "movement"];
    }

    buyShips(cpBudget) {
        return [{"Scout": 1}];
    }

}

export default TechStrat;