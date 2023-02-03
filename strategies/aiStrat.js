import ParentStrat from './parentStrat.js';

class AiStrat extends ParentStrat {
    
    constructor() {
        super(ParentStrat);
        this.name = 'AI';
    }

    chooseTranslation(ship, translations) {
        return 
    }

    getCombatFactors(shipInfo, opponentShipInfo) {
        let factors = {};
        let shipClasses = allShips.map(ship => ship.shipClass)
        shipClasses.sort((a, b) => a.shipClass.localeCompare(b.shipClass))

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


    getAllCombatScores(shipInfo, opponentShips) {
        let scores = {}

        for (let ship of opponentShips) {
            let factors = this.getCombatFactors(shipInfo, ship);
            scores[ship] == this.score(factors)
        }

        return scores
    }

    getMaxScoreTarget(scores){
        let maxScoreTarget = Object.keys(scores)[0]

        for (let target of scores){
            if (scores[target] > scores[maxScoreTarget]){
                maxScoreTarget = ship
            }
        }

        return maxScoreTarget
    }

    chooseTarget(shipInfo, combatOrder) {
        let opponentShips = combatOrder.filter(ship => ship.playerNum != shipInfo.playerNum && ship.hp > 0);
        let combatScores = this.getAllCombatScores(shipInfo, opponentShips)
        let maxScoreTarget = this.getMaxScoreTarget(combatScores)
        return maxScoreTarget
    }

    buyShips(cpBudget) {

    } 

}

export default AiStrat;