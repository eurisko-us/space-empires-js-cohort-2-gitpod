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

    chooseTarget(shipInfo, combatOrder) {
        
        let opponentShips = [];
        for (let opponentShip of combatOrder) {
            if (opponentShip.playerNum != shipInfo.playerNum && opponentShip.hp > 0) {
                opponentShips.push(opponentShip);
            }
        }

        return opponentShips[Math.floor(Math.random() * opponentShips.length)];

    }

    getRandomInteger(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
};

module.exports = Player;