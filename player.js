class Player {

    constructor(playerNum, strategy) {
        this.playerNum = playerNum;
        this.ships = [];
        this.homeColony = null;
        this.strategy = strategy;
        this.strategy.player = this;
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
};

module.exports = Player;