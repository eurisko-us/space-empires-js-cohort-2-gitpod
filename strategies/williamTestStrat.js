class Buy100 {
    
    constructor() {
        this.simpleBoard = null;
        this.turn = 0;
        this.player = null;
    }

    buyShips(cpBudget) {
        return [{"Scout": 100}];
    }  

}

class BuyNone {
    
    constructor() {
        this.simpleBoard = null;
        this.turn = 0;
        this.player = null;
    }

    buyShips(cpBudget) {
        return [];
    }

}

export { Buy100, BuyNone };