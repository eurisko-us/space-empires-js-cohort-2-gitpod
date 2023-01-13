import ParentStrat from './parentStrat.js';

class MakeColonies extends ParentStrat {
    
    constructor() {
        super(ParentStrat);
        this.name = 'make colonies';
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
        if (this.turn == 0) return [{"ColonyShip": 3}];
        return [];
    } 

}

export default MakeColonies;