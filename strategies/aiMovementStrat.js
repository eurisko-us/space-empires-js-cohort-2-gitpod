import ParentStrat from './parentStrat.js';

class AIMovementStrat extends ParentStrat {
    
    constructor() {
        super(ParentStrat);
        this.name = 'AIMovement';
        this.movementFactors = {}
        this.movementWeights = {}
    }

    translate(x, y) {
        return x.map((_, i) => x[i] + y[i]);
    }

    chooseTranslation(ship, translations) {
        for (let translation of translations) {
            this.updateMovementFactors(ship, translation)
        }
        
        let targetCoords = this.getOpponentHomeColonyCoords(ship);
        return this.minDistanceTranslation(ship, translations, targetCoords);
    }

    changeInDistance(start, end, coords) { 
        return Math.abs(this.dist(start, coords) - this.dist(end, coords));
    }

    updateMovementFactors(ship, translation) {
        let shipFactorDict = {};
        let shipClasses = ['A', 'B', 'C', 'D', 'E', 'Z'];
        
        let newCoords = this.translate(ship.coords, translation);
        let shipCoords = this.getAllShips(null, ship.playerNum);
        let oppShipCoords = this.getAllShips(null, 3-ship.playerNum);
        let hcCoords = this.getColonyCoords(ship, true, false);
        let oppHCCoords = this.getColonyCoords(ship, true, true);
        let freePlanetsCoords = this.getFreePlanetsCoords();

        for (var prop in ship) {
            if (Object.prototype.hasOwnProperty.call(ship, prop)) {
                if (!['name', 'id', 'objType'].includes(prop)) {
                    if (prop == 'shipClass') {
                        shipFactorDict[prop] = shipClasses.indexOf(ship[prop])
                    }
                    else {
                        shipFactorDict[prop] = ship[prop];
                    }
                }
            }
        }

        shipFactorDict['distHC'] = this.dist(ship.coords, hcCoords);
        shipFactorDict['distOppHC'] = this.dist(ship.coords, oppHCCoords);

        shipFactorDict['changeDistHC'] = this.changeInDistance(newCoords, ship.coords, hcCoords);
        shipFactorDict['changeDistOppHC'] = this.changeInDistance(newCoords, ship.coords, oppHCCoords);

        if (shipCoords.length === 0) {
            shipFactorDict['changeDistNearOwnShip'] = shipFactorDict['changeDistHC'];
        }
        else {
            let nearestShipCoords = this.getNearestCoords(ship, shipCoords);
            shipFactorDict['changeDistNearOwnShip'] = this.changeInDistance(ship.coords, newCoords, nearestShipCoords);
        }

        if (oppShipCoords.length === 0) {
            shipFactorDict['changeDistNearOppShip'] = shipFactorDict['changeDistOppHC'];
        }
        else {
            let nearestOppShipCoords = this.getNearestCoords(ship, oppShipCoords);
            shipFactorDict['changeDistNearOppShip'] = this.changeInDistance(ship.coords, newCoords, nearestOppShipCoords);
        }

        if (freePlanetsCoords.length === 0) {
            shipFactorDict['changeDistNearFreePlanet'] = 0;
        }
        else {
            let nearestFreePlanetCoords = this.getNearestCoords(ship, freePlanetsCoords);
            shipFactorDict['changeDistNearFreePlanet'] = this.changeInDistance(ship.coords, newCoords, nearestFreePlanetCoords);
        }
        
        console.log(shipFactorDict);
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