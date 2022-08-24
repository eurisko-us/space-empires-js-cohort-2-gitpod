class Ship {

    constructor() {
        this.objType = 'Ship';
        this.shipId = null;
    }

    updateCoords(newCoords) {
        this.coords = newCoords;
    }

    setShipId() {
        this.shipId = `Player ${this.playerNum} ${this.name} ${this.shipNum}`;
    }
    
};

//extends makes the class a child class
//super makes it so that the child class inherits and constructs everything from the parent clasd

//When checking, ships are refered to by player number, ship name, ship number
class Scout extends Ship {
    constructor(coords, playerNum, shipNum) {

        super(Ship);

        this.hp = 1;
        this.atk = 3;
        this.df = 0;

        this.name = 'Scout';
        this.shipClass = 'E';

        this.coords = coords;
        this.playerNum = playerNum;
        this.shipNum = shipNum;

        this.cpCost = 6;
        this.maintCost = 1;

    }
}

class BattleCruiser extends Ship {
    constructor(coords, playerNum, shipNum) {

        super(Ship);

        this.hp = 2;
        this.atk = 5;
        this.df = 1;

        this.name = 'BattleCruiser';
        this.shipClass = 'B';

        this.coords = coords;
        this.playerNum = playerNum;
        this.shipNum = shipNum;
        
        this.cpCost = 15;
        this.maintCost = 2;

    }
}

class Battleship extends Ship {
    constructor(coords, playerNum, shipNum) {
        
        super(Ship);
        
        this.hp = 3;
        this.atk = 5;
        this.df = 2;
        
        this.name = 'Battleship';
        this.shipClass = 'A';
        
        this.coords = coords;
        this.playerNum = playerNum;
        this.shipNum = shipNum;
        
        this.cpCost = 20;
        this.maintCost = 3;

    }
}

class Cruiser extends Ship {
    constructor(coords, playerNum, shipNum) {

        super(Ship);

        this.hp = 2;
        this.atk = 4;
        this.df = 1;

        this.name = 'Cruiser';
        this.shipClass = 'C';

        this.coords = coords;
        this.playerNum = playerNum;
        this.shipNum = shipNum;

        this.cpCost = 12;
        this.maintCost = 2;

    }
}

class Destroyer extends Ship {
    constructor(coords, playerNum, shipNum) {

        super(Ship);

        this.hp = 1;
        this.atk = 4;
        this.df = 0;

        this.name = 'Destroyer';
        this.shipClass = 'D';

        this.coords = coords;
        this.playerNum = playerNum;
        this.shipNum = shipNum;

        this.cpCost = 9;
        this.maintCost = 1;

    }
}


class Dreadnaught extends Ship {
    constructor(coords, playerNum, shipNum) {
        
        super(Ship);

        this.hp = 3;
        this.atk = 6;
        this.df = 3;

        this.name = 'Dreadnaught';
        this.shipClass = 'A';

        this.coords = coords;
        this.playerNum = playerNum;
        this.shipNum = shipNum;

        this.cpCost = 24;
        this.maintCost = 3;

    }
}

let allShips = [Scout, BattleCruiser, Battleship, Cruiser, Destroyer, Dreadnaught];

module.exports.Ship = Ship;
module.exports.Scout = Scout;
module.exports.BattleCruiser = BattleCruiser;
module.exports.Battleship = Battleship;
module.exports.Cruiser = Cruiser;
module.exports.Destroyer = Destroyer;
module.exports.Dreadnaught = Dreadnaught;
module.exports.allShips = allShips;