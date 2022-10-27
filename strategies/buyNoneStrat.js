import ParentStrat from './parentStrat.js';

class BuyNoneStrat extends ParentStrat {
    
    constructor() {
        super(ParentStrat);
        this.name = 'buyNone';
    }

    buyShips(cpBudget) {
        if (this.turn == 0) return [{"Scout": 1}];
        return [];
    }

}

export default BuyNoneStrat;