import { allShips } from './ships.js';

class Player {

    constructor(playerNum, strategy, cp=150) {
        
        this.playerNum = playerNum;
        this.ships = [];
        this.homeColony = null;
        
        this.strategy = strategy;
        this.strategy.playerNum = this.playerNum;
        
        this.cp = cp;
        this.technology = {
            "attack": 1,
            "defense": 1
        };
        
        this.shipCounter = {}; // used to get new ship nums when
        for (let shipClass of allShips) {
            this.shipCounter[shipClass.name] = 0;
        }

        this.colonies = []
        this.colonyCounter = 0
    
    }
    
    addShip(ship) {
        ship.playerNum = this.playerNum;
        this.ships.push(ship);
    }

    buyTech() {
        return this.strategy.buyTech(this.cp);
    }

    buyShips() {
        return this.strategy.buyShips(this.cp);
    }

};

export default Player;