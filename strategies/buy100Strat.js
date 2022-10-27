import ParentStrat from './parentStrat.js';

class Buy100Strat extends ParentStrat {
    
    constructor() {
        super(ParentStrat);
        this.name = 'buy100';
    }

    buyShips(cpBudget) {
        if (this.turn == 0) return [{"Scout": 1}];
        return [{"Scout": 100}];
    }  

}

export default Buy100Strat;