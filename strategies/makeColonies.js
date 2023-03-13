import ParentStrat from './parentStrat.js';

class MakeColonies extends ParentStrat {
    
    constructor() {
        super(ParentStrat);
        this.name = 'make colonies';
    }

    chooseTranslation(ship, translations) {
        
        if ((ship.shipNum == 3 && this.turn > 19) || (ship.name != "ColonyShip" && this.turn > 19)) {
            let opponentColonyCoords = this.getOpponentRegularColonyCoords(ship);
            let nearestOpponentColonyCoord = this.getNearestCoords(ship, opponentColonyCoords);
            return this.minDistanceTranslation(ship, translations, nearestOpponentColonyCoord);
        }

        if (ship.shipNum != 3) {
            let freePlanets = this.getFreePlanetsCoords(ship);
            let nearestFreePlanet = this.getNearestCoords(ship, freePlanets);
            return this.minDistanceTranslation(ship, translations, nearestFreePlanet);
        }

        return [0, 0];
        
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