import ParentStrat from './parentStrat.js';

class AiStrat extends ParentStrat {
    
    constructor() {
        super(ParentStrat);
        this.name = 'AI';
        this.movementWeights = {} // set random number 0-1 Math.random

        for (let factor of this.getMovementFactors()){
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
                scores[option] == this.movementScore(factors)
            }

            if (phase == "combat") {
                let factors = this.getCombatFactors(shipInfo, options);
                scores[option] == this.movementScore(factors)
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

        return maxScoreMove
    }

    chooseTranslation(ship, translations) {
        let movementScores = this.getAllScores(shipInfo, translations, "movement")
        let maxScoreMove = this.getMaxScoreTarget(movementScores)
        return maxScoreMove
    }

    chooseTarget(shipInfo, combatOrder) {
        let combatScores = this.getAllScores(shipInfo, translations, "combat")
        let maxScoreMove = this.getMaxScoreTarget(combatScores)
        return maxScoreMove
    }

    buyShips(cpBudget) {

}


}

export default AiStrat;