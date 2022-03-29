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

class BattleCruiser extends Ship {
    constructor(playerNum, coords, num){
        super(Ship)
        this.hp = 2
        this.atk = 5
        this.df = 1
        this.name = 'BattleCruiser'
        this.playerNum = playerNum
        this.shipClass = "B"
        this.coords = coords
        this.shipNum = num
        this.cpCost = 15
        this.maintCost = 2
    }
}

class BattleShip extends Ship {
    constructor(playerNum, coords, num){
        super(Ship)
        this.hp = 3
        this.atk = 5
        this.df = 2
        this.name = 'BattleShip'
        this.playerNum = playerNum
        this.shipClass = "A"
        this.coords = coords
        this.shipNum = num
        this.cpCost = 20
        this.maintCost = 3
    }
}

class Cruiser extends Ship {
    constructor(playerNum, coords, num){
        super(Ship)
        this.hp = 2
        this.atk = 4
        this.df = 1
        this.name = 'Cruiser'
        this.playerNum = playerNum
        this.shipClass = "C"
        this.coords = coords
        this.shipNum = num
        this.cpCost = 12
        this.maintCost = 2
    }
}


class Destroyer extends Ship {
    constructor(playerNum, coords, num){
        super(Ship)
        this.hp = 1
        this.atk = 4
        this.df = 0
        this.name = 'Destroyer'
        this.playerNum = playerNum
        this.shipClass = "D"
        this.coords = coords
        this.shipNum = num
        this.cpCost = 9
        this.maintCost = 1
    }
}


class Dreadnaught extends Ship {
    constructor(playerNum, coords, num){
        super(Ship)
        this.hp = 3
        this.atk = 6
        this.df = 3
        this.name = 'Dreadnaught'
        this.playerNum = playerNum
        this.shipClass = "A"
        this.coords = coords
        this.shipNum = num
        this.cpCost = 24
        this.maintCost = 3
    }
}

module.exports = Ship;
