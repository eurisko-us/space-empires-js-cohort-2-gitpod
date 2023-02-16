import ParentStrat from './parentStrat.js';

class AiStrat extends ParentStrat {
    
    constructor() {
        super(ParentStrat);
        this.name = 'AI';
        this.movementWeights = {} // set random number 0-1 Math.random

        let movementFactors = ["hp", "atk", "df", "shipClass", "coords", 
                                "playerNum", "shipNum", "cpCost", "maintCost", 
                                "distHC", "distOppHC", "changeDistHC", "changeDistOppHC", 
                                "changeDistNearOwnShip", "changeDistNearOppShip", 
                                "changeDistNearFreePlanet"]

        for (let factor of movementFactors){ //input list of movement factors here
            this.movementWeights[factor] = Math.random()
        }
    }

    movementScore(factors) {
        let score = 0

        for (let factor of factors) {
            score += this.movementWeights[factor] *  factors[factor]
        }

        return score
    }

    getAllScores(shipInfo, options, phase){ //make a generalized get phase scores function sometime
        let scores = {};

        for (let option of options) {

            if (phase == "movement") {
                let factors = this.getMovementFactors(shipInfo, options);
                scores[`${option}`] == this.movementScore(factors)
            }

            if (phase == "combat") {
                let factors = this.getCombatFactors(shipInfo, options);
                scores[option["id"]] == this.combatScore(factors)
            }

        }

        return scores
    }

    getMaxScoreMove(scores){
        let maxScoreMove = Object.keys(scores)[0]

        for (let key of scores){
            if (scores[key] > scores[maxScoreMove]){
                maxScoreMove = key
            }
        }

        if ("[" in maxScoreMove) {
            return JSON.parse(maxScoreMove)
        } 

        else {
            return maxScoreTargetId
        }

    }

    changeInDistance(start, end, coords) { 
        return Math.abs(this.dist(start, coords) - this.dist(end, coords));
    }

    translate(x, y) {
        return x.map((_, i) => x[i] + y[i]);
    }

    getMovementFactors(ship, translation) {
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
        
        return shipFactorDict;
    }

    chooseTranslation(ship, translations) {
        let movementScores = this.getAllScores(shipInfo, translations, "movement")
        let maxScoreMove = this.getMaxScoreMove(movementScores)
        return maxScoreMove
    }

    getCombatFactors(shipInfo, opponentShipInfo) {
        let factors = {};
        let shipClasses = ["A", "B", "C", "D", "E", "Z"]

        for (let factor of ["hp", "atk", "def", "shipClass"]) {
            if (factor == "shipClass") {
                factors[`own ship ${factor}`] = shipClasses.indexOf(shipInfo[factor])
                factors[`opponent ship ${factor}`] = shipClasses.indexOf(opponentShipInfo[factor])
            }

            else {
                factors[`own ship ${factor}`] = shipInfo[factor]
                factors[`opponent ship ${factor}`] = opponentShipInfo[factor]
            }
            
        }

        factors["probability of hit"] = (shipInfo["atk"] - opponentShipInfo["def"]) / 10

        return factors
    }

    chooseTarget(shipInfo, combatOrder) {
        let opponentShips = combatOrder.filter(ship => ship.playerNum != shipInfo.playerNum && ship.hp > 0);
        let combatScores = this.getAllScores(shipInfo, opponentShips, "combat")
        let maxScoreTargetId = this.getMaxScoreMove(combatScores)

        for (let ship of opponentShips){
            if (maxScoreTargetId == ship["id"]) {
                return ship
            }
        }
    }

    buyShips(cpBudget) {

    }

}

export default AiStrat;