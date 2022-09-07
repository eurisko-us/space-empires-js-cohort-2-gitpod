class Buy100 {
    
    constructor() {
        this.simpleBoard = null;
        this.turn = 0;
        this.player = null;
    }

    buyShips() {
        return [["Scout", 100]]
    }  
}

class BuyNone {
    
    constructor() {
        this.simpleBoard = null;
        this.turn = 0;
        this.player = null;
    }

    buyShips() {
        return []
    }  
}

module.exports.Buy100 = Buy100;
module.exports.BuyNone = BuyNone;
