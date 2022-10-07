class Buy100 {
    
    constructor() {
        this.simpleBoard = null;
        this.turn = 0;
        this.player = null;
    }

    buyShips(cpBudget) {
        if (this.turn == 0) {
            return [{"Scout": 1}]
        }
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
        if (this.turn == 0) {
            return [{"Scout": 1}]
        }
        return [];
    }

}

export { Buy100, BuyNone };