import { allShips } from './ships.js';

class Player {

    constructor(playerNum, strategy, cp=150) {
        
        this.playerNum = playerNum;
        this.ships = [];
        this.homeColony = null;
        this.isManual = false
        
        this.strategy = strategy;
        this.strategy.playerNum = this.playerNum;
        
        this.cp = cp;
        this.technology = {
            "attack": 0,
            "defense": 0,
            "movement": 1
        };
        
        this.shipCounter = {};

        for (let shipClass of allShips) {
            this.shipCounter[shipClass.name] = 0;
        }

        this.allColonies = [];
        this.aliveColonies = [];
        this.colonyCounter = 0;
    
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