class Player {

    constructor(playerNum, strategy, cp=150) {
        this.playerNum = playerNum;
        this.ships = [];
        this.homeColony = null;
        this.strategy = strategy;
        this.cp = cp
        this.strategy.player = this;
        this.shipCounter = {'Scout': 0, 'BattleCruiser': 0, 'Battleship': 0,  'Cruiser': 0, 'Destroyer': 0, 'Dreadnaught': 0}
    }
    
    addShip(ship) {
        ship.playerNum = this.playerNum;
        this.ships.push(ship);
    }

    getRandomInteger(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    buyShips(cp_budget) {
        return this.strategy.buyShips(cp_budget)
    }
};

module.exports = Player;