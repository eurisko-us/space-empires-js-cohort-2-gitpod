class Ship {

    constructor() {
        this.objType = 'Ship';
        this.id = null;
    }

    setId() {
        this.id = `Player ${this.playerNum} ${this.name} ${this.shipNum}`;
    }

};

// extends makes the class a child class of the parent class
// super () makes it so that the child class inherits and constructs everything from the parent class
// could remove shipNum later if never used, only being used to make id
// When checking, ships are referred to by player number (playerNum), ship name (name), and ship number (shipNum)

class Scout extends Ship {
    constructor(coords, playerNum, shipNum) {

        super(Ship);

        this.hullSize = 1;
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

        this.setId();

    }
}

class BattleCruiser extends Ship {
    constructor(coords, playerNum, shipNum) {

        super(Ship);

        this.hullSize = 2;
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

        this.setId();

    }
}

class Battleship extends Ship {
    constructor(coords, playerNum, shipNum) {
        
        super(Ship);
        
        this.hullSize = 3;
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

        this.setId();

    }
}

class Cruiser extends Ship {
    constructor(coords, playerNum, shipNum) {

        super(Ship);

        this.hullSize = 2;
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

        this.setId();

    }
}

class Destroyer extends Ship {
    constructor(coords, playerNum, shipNum) {

        super(Ship);

        this.hullSize = 1;
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

        this.setId();

    }
}

class Dreadnaught extends Ship {
    constructor(coords, playerNum, shipNum) {
        
        super(Ship);

        this.hullSize = 3;
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

        this.setId();

    }
}

class ColonyShip extends Ship {
    constructor(coords, playerNum, shipNum) {

        super(Ship);

        this.hullSize = 1;
        this.hp = 1;
        this.atk = 0;
        this.df = 0;

        this.name = 'ColonyShip';
        this.shipClass = 'Z'; //

        this.coords = coords;
        this.playerNum = playerNum;
        this.shipNum = shipNum;

        this.cpCost = 8;
        this.maintCost = 0;

        this.setId();

    }
}

const nullInstances = [
    new Scout(null, null, null),
    new BattleCruiser(null, null, null),
    new Battleship(null, null, null),
    new Cruiser(null, null, null),
    new Destroyer(null, null, null),
    new Dreadnaught(null, null, null),
    new ColonyShip(null, null, null)
];

const allShips = [Scout, BattleCruiser, Battleship, Cruiser, Destroyer, Dreadnaught, ColonyShip];
export { nullInstances, allShips, Scout, BattleCruiser, Battleship, Cruiser, Destroyer, Dreadnaught, ColonyShip };