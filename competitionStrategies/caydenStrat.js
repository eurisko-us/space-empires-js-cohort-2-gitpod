import ParentStrat from '../strategies/parentStrat.js';

class CaydenStrat extends ParentStrat {
    
    constructor() {
        super(ParentStrat);
        this.name = 'rush';
    }

    chooseTranslation(ship, translations) {
        let targetCoords = this.getOpponentHomeColonyCoords(ship);
        return this.minDistanceTranslation(ship, translations, targetCoords);
    }

    chooseTarget(shipInfo, combatOrder) {
        let opponentShips = combatOrder.filter(ship => ship.playerNum != shipInfo.playerNum && ship.hp > 0);
        return opponentShips[0];
    }

    buyShips(cpBudget) {
        if (this.turn == 0) return [{"Dreadnaught": 5}];
        if (cpBudget > 50) return [{"Dreadnaught": 1}];
        return [];
    } 

}

export default CaydenStrat;