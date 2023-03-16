import ParentStrat from './parentStrat.js';

class RushStrat extends ParentStrat {
    
    constructor() {
        super(ParentStrat);
        this.name = 'rush';
    }

    chooseTranslation(ship, translations) {
        let targetCoords = this.getColonyCoords(ship, true, true);
        return this.minDistanceTranslation(ship, translations, targetCoords);
    }

    chooseTarget(shipInfo, combatOrder) {
        let opponentShips = combatOrder.filter(ship => ship.playerNum != shipInfo.playerNum && ship.hp > 0);
        return opponentShips[0];
    }

    buyShips(cpBudget) {
        if (this.turn == 0) return [{"Battleship": 5}];
        if (cpBudget > 45) return [{"Battleship": 1}];
        return [];
    }

}

export default RushStrat;