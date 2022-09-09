import { allShips } from './ships.js';

class Player {

    constructor(playerNum, strategy, cp=150) {
        
        this.playerNum = playerNum;
        this.ships = [];
        this.homeColony = null;
        
        this.strategy = strategy;
        this.strategy.player = this;
        
        this.cp = cp;
        
        this.shipCounter = {}; //used to get new ship nums when buying ships
        for (let shipClass of allShips) {
            this.shipCounter[shipClass.name] = 0;
        }
    
    }
    
    addShip(ship) {
        ship.playerNum = this.playerNum;
        this.ships.push(ship);
    }

    buyShips() {
        return this.strategy.buyShips(this.cp);
    }

    getRandomInteger(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

};

export default Player;