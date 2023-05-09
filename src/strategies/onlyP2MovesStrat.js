import ParentStrat from './parentStrat.js';

class OnlyP2MovesStrat extends ParentStrat {
    
    constructor() {
        super(ParentStrat);
        this.name = 'onlyP2Moves';
    }

    chooseTranslation(ship, translations) {
        let targetCoords = this.getOpponentHomeColonyCoords(ship);
        if (ship.playerNum == 1) return [0, 0];
        if (ship.playerNum == 2) return this.minDistanceTranslation(ship, translations, targetCoords);
    }

    chooseTarget(shipInfo, combatOrder) {
        let opponentShips = combatOrder.filter(ship => ship.playerNum != shipInfo.playerNum && ship.hp > 0);
        return this.random(opponentShips);
    }

    buyShips(cpBudget) {
        return [];
    }

}

export default OnlyP2MovesStrat;