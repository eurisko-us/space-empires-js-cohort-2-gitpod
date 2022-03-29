class Ship {

    constructor() {
        this.objType = "Ship"
    }

    updateCoords(newCoords) {
        this.coords = newCoords;
    }
    
};

class Scout extends Ship {
    constructor(playerNum, coords, num) {
        super(Ship);
        this.hp = 1
        this.atk = 3
        this.df = 0
        this.name = 'Scout'
        this.playerNum = playerNum
        this.shipClass = "E"
        this.coords = coords
        this.shipNum = num
        this.cpCost = 6
        this.maintCost = 1
    }

}


module.exports = Ship;
