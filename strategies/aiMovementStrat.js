import ParentStrat from './parentStrat.js';

class AIMovementStrat extends ParentStrat {
    
    constructor() {
        super(ParentStrat);
        this.name = 'AIMovement';
        this.movementFactors = {}
        this.movementWeights = {}
    }

    chooseTranslation(ship, translations) {
        this.updateFactors(ship)
        let targetCoords = this.getOpponentHomeColonyCoords(ship);
        return this.minDistanceTranslation(ship, translations, targetCoords);
    }

    updateFactors(ship) {
        let shipFactorDict = {}
        for 

    }

    chooseTarget(shipInfo, combatOrder) {
        let opponentShips = combatOrder.filter(ship => ship.playerNum != shipInfo.playerNum && ship.hp > 0);
        return this.random(opponentShips);
    }

    buyShips(cpBudget) {
        if (this.turn == 0) return [{"Scout": 5}];
        return [{"Dreadnaught": 5}];
    }



}

export default AIMovementStrat;