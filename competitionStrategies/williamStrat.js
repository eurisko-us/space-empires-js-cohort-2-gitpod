import { existsSync } from 'fs';
import ParentStrat from '../strategies/parentStrat.js';

class WilliamStrat extends ParentStrat {
    
    constructor() {
        super(ParentStrat);
        this.name = 'william';
        this.defenders = [];
        this.ships = [];
    }

    chooseTranslation(ship, translations) {
        this.updateShips()
        if (this.defenders.length < 3) {
            for (let ship of this.ships) {
                if (!this.checkDefender(ship) && this.arrayEQ(ship.coords, this.getHCCoords(ship))) {
                    this.defenders.push(ship)
                    if (this.defenders.length >= 4) break
                }
            }
        }      
        
        const oppHC = this.getOpponentHomeColonyCoords(ship);
        if (!this.checkDefender(ship)) {
            if (ship.coords[0] == 3 && ship.coords != oppHC) { 
                return [1, 0];
            }

            if (ship.coords[1] == oppHC[1] && ship.coords[0] != oppHC[0]) {
                return [-1, 0];
            }

            return this.moveToOppHC(ship.coords, oppHC);
        }
        else {
            return [0, 0];
        }
    }

    checkDefender(ship) {
        for (let tempShip of this.defenders) {
            if (tempShip.id == ship.id) {
                return true;
            }
        }
        return false;
    }

    moveToOppHC(coords, oppHC) {
        if (coords[1] > oppHC[1]) {
            return [0, -1];
        }
        if (coords[1] < oppHC[1]) {
            return [0, 1];
        }
        else {
            return [0, 0];
        }
    }

    chooseTarget(shipInfo, combatOrder) {
        this.updateShips()
        let opponentShips = combatOrder.filter(ship => ship.playerNum != shipInfo.playerNum && ship.hp > 0);
        return opponentShips[0];
    }

    buyShips(cpBudget) {
        if (this.turn == 0) return [{"Dreadnaught": 4}];
        this.updateShips();
        if (cpBudget > 2*(this.calcMaintCost(this.ships))+10) return [{"Cruiser": 1}]; 
        return [];
    }

    updateShips() {
        this.ships = []
        for (let i of this.simpleBoard) {
            for (let j of i) {
                for (let obj of j) {
                    if (obj.objType == 'Ship' && obj.playerNum == this.playerNum) {
                            this.ships.push(obj)
                        }
                    }
                }
            }
        }

    getHCCoords(ship) {
        for (let i = 0; i < this.simpleBoard.length; i++) {
            for (let j = 0; j < this.simpleBoard.length; j++) {
                for (let obj of this.simpleBoard[j][i]) {
                    if (obj.objType === 'Colony' && obj.isHomeColony && obj.playerNum == ship.playerNum) {
                        return [j, i];
                    }
                }
            }
        }
    }

    calcMaintCost(ships) {
        const maintCosts = ships.map((ship) => ship.maintCost);
        return this.sum(maintCosts);
    }

    sum(list) {
        let total = 0;
        for (const elem of list) {
            total += elem;
        }
        return total;
    }

    arrayEQ(array1, array2) {
        return array1.length === array2.length && array1.every(function(value, index) { return value === array2[index]})
    }
}

export default WilliamStrat;