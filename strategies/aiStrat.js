import ParentStrat from './parentStrat.js';

class AiStrat extends ParentStrat {
    
    constructor() {
        super(ParentStrat);
        this.name = 'AI';
    }

    chooseTranslation(ship, translations) {
        return 
    }

    chooseTarget(shipInfo, combatOrder) {
        return
    }

    buyShips(cpBudget) {

}

export default AiStrat;