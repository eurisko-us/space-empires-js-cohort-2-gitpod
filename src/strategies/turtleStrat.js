import ParentStrat from './parentStrat.js';

class TurtleStrat extends ParentStrat {
    
    constructor() {
        super(ParentStrat);
        this.name = 'turtle';
    }

    chooseTranslation(ship, translations) {
        if (this.turn == 1) {        
            let targetCoords = this.getOpponentHomeColonyCoords(ship);
            return this.minDistanceTranslation(ship, translations, targetCoords);
        }
        return [0, 0];
    }

    chooseTarget(shipInfo, combatOrder) {
        let opponentShips = combatOrder.filter(ship => ship.playerNum != shipInfo.playerNum && ship.hp > 0);
        return this.random(opponentShips);
    }

    buyShips(cpBudget) {
        if (this.turn == 0) return [{"Dreadnaught": 5}];
        if (cpBudget > 25) return [{"Scout": 2}];
        return [];
    }

}

export default TurtleStrat;