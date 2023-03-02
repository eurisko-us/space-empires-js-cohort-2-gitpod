import ParentStrat from './parentStrat.js';

class AiStrat extends ParentStrat {
    
    constructor() {
        super(ParentStrat);
        this.name = 'AI';
        this.movementWeights = {}
        this.combatWeights = {}
        this.technology = null

        let movementFactors = ["hp", "atk", "df", "shipClass", "coords", 
                                "playerNum", "shipNum", "cpCost", "maintCost", 
                                "distHC", "distOppHC", "changeDistHC", "changeDistOppHC", 
                                "changeDistNearOwnShip", "changeDistNearOppShip", 
                                "changeDistNearFreePlanet", "technology"]

        for (let factor of movementFactors){
            this.movementWeights[factor] = Math.random()
        }

        let combatFactors = ["own ship hp", "own ship atk", "own ship df", "own ship shipClass", 
                            "opponent ship hp", "opponent ship atk", "opponent ship df", 
                            "opponent ship shipClass", "probability of hit", "own ship atk tech", 
                            "opponent ship atk tech", "own ship df tech", "opponent ship df tech"]

        for (let factor of combatFactors){
            this.combatWeights[factor] = Math.random()
        }
    }

    movementScore(factors) {
        let score = 0

        for (let factor in factors) {
            score += this.movementWeights[factor] *  factors[factor]
        }

        return score
    }

    getAllScores(shipInfo, options, phase){ //make a generalized get phase scores function sometime
        let scores = {};

        for (let option of options) {

            if (phase == "movement") {
                let factors = this.getMovementFactors(shipInfo, option);
                scores[`${option}`] = this.movementScore(factors)
            }

            if (phase == "combat") {
                let factors = this.getCombatFactors(shipInfo, option);
                scores[option["id"]] = this.combatScore(factors)
            }

        }

        return scores
    }

    getMaxScoreMove(scores){
        let maxScoreMove = Object.keys(scores)[0]

        for (let key in scores){
            if (scores[key] > scores[maxScoreMove]){
                maxScoreMove = key
            }
        }


        if (maxScoreMove.includes("[") == true) {
            return JSON.parse(maxScoreMove)
        } 

        else {
            return maxScoreMove
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

                    if (prop == 'technology') {
                        shipFactorDict[prop] = ship[prop]['movement']
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

    chooseTranslation(shipInfo, translations) {
        let movementScores = this.getAllScores(shipInfo, translations, "movement")
        let maxScoreMove = this.getMaxScoreMove(movementScores)
        return [Number(maxScoreMove[0]), Number(maxScoreMove[2])]
    }

    getCombatFactors(shipInfo, opponentShipInfo) {
        let factors = {};
        let shipClasses = ["A", "B", "C", "D", "E", "Z"]

        for (let factor of ["hp", "atk", "df", "shipClass", "atk tech", "df tech"]) {
            if (factor == "shipClass") {
                factors[`own ship ${factor}`] = shipClasses.indexOf(shipInfo[factor])
                factors[`opponent ship ${factor}`] = shipClasses.indexOf(opponentShipInfo[factor])

            } else if (factor == "atk tech") {
                factors[`own ship atk tech`] = shipInfo['technology']['attack']
                factors[`opponent ship atk tech`] = opponentShipInfo['technology']['attack']

            } else if (factor == "df tech"){
                factors[`own ship df tech`] = shipInfo['technology']['defense']
                factors[`opponent ship df tech`] = opponentShipInfo['technology']['defense']

            } else {
                factors[`own ship ${factor}`] = shipInfo[factor]
                factors[`opponent ship ${factor}`] = opponentShipInfo[factor]
            }
        }

        factors["probability of hit"] = (shipInfo["atk"] - opponentShipInfo["df"]) / 10
        return factors
    }

    combatScore(factors) {
        let score = 0

        for (let factor in factors) {
            score += this.combatWeights[factor] *  factors[factor]
        }

        return score
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

    buyTech(cpBudget, technologyData) {
        this.technology = technologyData
        return []
    }

    buyShips(cpBudget) {
        let numColonies = 0
        let numScouts = 0

        if (this.turn > 0) {
            for (let i = 0; i < this.simpleBoard.length; i++) {
                for (let j = 0; j < this.simpleBoard.length; j++) {
                    for (let obj of this.simpleBoard[j][i]) {
                        if (obj["objType"] == "Colony") {
                            numColonies += 1
                        }
                        if (obj["objType"] == "Ship" && obj["name"] == "Scout" && obj["playerNum"] == this.playerNum) {
                            numScouts += 1
                        }
                    }
                }
            }
        }

        else {
            numColonies = 1
        }

        return [{"Scout": Math.floor((1 / 7) * (cpBudget + 10 * numColonies - 2 * numScouts))}]
    }

    maintOrder(ships) {
        return ships.sort(function(a,b) {return a.hp - b.hp});
    }
}

export default AiStrat;