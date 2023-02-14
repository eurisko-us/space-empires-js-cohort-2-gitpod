import ParentStrat from './parentStrat.js';

class AIMovementStrat extends ParentStrat {
    
    constructor() {
        super(ParentStrat);
        this.name = 'AIMovement';
        this.movementFactors = {'changeDistNearOwnShip':0, 'changeDistNearOppShip':0, 'changeDistNearFreePlanet':0, 'moveTechLevel':0, 'hp':0, 'atk':0, 'df':0, 'name':0, 'shipClass':0, 'coords':0, 'playerNum':0, 'shipNum':0, 'cpCost':0, 'maintCost':0}
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

        for (var prop in ship) {
            if (Object.prototype.hasOwnProperty.call(ship, prop)) {
                shipFactorDict[prop] = ship[prop];
            }
        }
        
        console.log(ship.coords, translation);

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
                    if (obj.objType === 'Ship' && obj.playerNum == playerNum) {
                        shipCoords.push([j, i]);
                    }
                    if (obj.objType === 'Ship' && obj.playerNum != playerNum) {
                        oppShipCoords.push([j, i]);
                    }
                }
            }
        }

        nearestShipCoords = this.getNearestCoords(ship, shipCoords)
        nearestOppShipCoords = this.getNearestCoords(ship, oppShipCoords)

        shipFactorDict['changeDistNearOwnShip'] = Math.abs(this.dist(ship.coords, nearestShipCoords) - this.dist(newCoords, nearestShipCoords));
        shipFactorDict['changeDistNearOppShip'] = Math.abs(this.dist(ship.coords, nearestOppShipCoords) - this.dist(newCoords, nearestOppShipCoords));

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