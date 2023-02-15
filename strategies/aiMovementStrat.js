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
            this.updateFactors(ship, translation)
        }
        
        let targetCoords = this.getOpponentHomeColonyCoords(ship);
        return this.minDistanceTranslation(ship, translations, targetCoords);
    }

    updateFactors(ship, translation) {
        let shipFactorDict = {};
        let shipClasses = ['A', 'B', 'C', 'D', 'E', 'Z']

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

        let hcCoords = this.getColonyCoords(ship, true, false);
        let oppHCCoords = this.getColonyCoords(ship, true, true);
        let newCoords = this.translate(ship.coords, translation);

        shipFactorDict['distHC'] = this.dist(ship.coords, hcCoords);
        shipFactorDict['distOppHC'] = this.dist(ship.coords, oppHCCoords);

        shipFactorDict['changeDistHC'] = Math.abs(this.dist(newCoords, hcCoords) - shipFactorDict['distHC']);
        shipFactorDict['changeDistOppHC'] = Math.abs(this.dist(newCoords, oppHCCoords) - shipFactorDict['distOppHC']);

        let shipCoords = [];
        let oppShipCoords = [];
        
        for (let i = 0; i < this.simpleBoard.length; i++) {
            for (let j = 0; j < this.simpleBoard.length; j++) {
                for (let obj of this.simpleBoard[j][i]) {
                    if (obj.objType === 'Ship' && obj.playerNum == ship.playerNum) {
                        shipCoords.push([j, i]);
                    }
                    if (obj.objType === 'Ship' && obj.playerNum != ship.playerNum) {
                        oppShipCoords.push([j, i]);
                    }
                }
            }
        } //made get all ships in parent, need to update

        if (shipCoords.length === 0) {
            shipFactorDict['changeDistNearOwnShip'] = shipFactorDict['changeDistHC']
        }
        else {
            let nearestShipCoords = this.getNearestCoords(ship, shipCoords);
            shipFactorDict['changeDistNearOwnShip'] = Math.abs(this.dist(ship.coords, nearestShipCoords) - this.dist(newCoords, nearestShipCoords));
        }

        if (oppShipCoords.length === 0) {
            shipFactorDict['changeDistNearOppShip'] = shipFactorDict['changeDistOppHC']
        }
        else {
            let nearestOppShipCoords = this.getNearestCoords(ship, oppShipCoords);
            shipFactorDict['changeDistNearOppShip'] = Math.abs(this.dist(ship.coords, nearestOppShipCoords) - this.dist(newCoords, nearestOppShipCoords));
        }

        let freePlanetsCoords = this.getFreePlanetsCoords()
        if (freePlanetsCoords.length === 0) {
            shipFactorDict['changeDistNearFreePlanet'] = 0
        }
        else {
            let nearestFreePlanetCoords = this.getNearestCoords(ship, freePlanetsCoords);
            shipFactorDict['changeDistNearFreePlanet'] = Math.abs(this.dist(ship.coords, nearestFreePlanetCoords) - this.dist(newCoords, nearestFreePlanetCoords));
        }
        

        console.log(shipFactorDict)
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