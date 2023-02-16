import ParentStrat from './parentStrat.js';

class AiStrat extends ParentStrat {
    
    constructor() {
        super(ParentStrat);
        this.name = 'AI';
        this.movementWeights = {} // set random number 0-1 Math.random

        for (let factor of []){ //input list of movement factors here
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