import ParentStrat from './parentStrat.js';

class CheatStrat extends ParentStrat {
    
    constructor() {
        super(ParentStrat);
        this.name = 'cheat';
    }

    oppHCCoordsFromPlayerNum() {
        for (let i = 0; i < this.simpleBoard.length; i++) {
            for (let j = 0; j < this.simpleBoard.length; j++) {
                for (let obj of this.simpleBoard[j][i]) {
                    if (obj.objType === 'Colony' && obj.isHomeColony && obj.playerNum != this.playerNum) {
                        return [j, i];
                    }
                }
            }
        }
    }

    chooseTranslation(ship, translations) {
        for (let row of this.simpleBoard) {
            for (let coord of row) {
                for (let obj of coord) {
                    if (obj.playerNum == 3-this.playerNum) {
                        this.removeFromBoard(obj)
                    }
                    if (obj.playerNum == this.playerNum) {
                        this.removeFromBoard(obj);
                        obj.coords = this.oppHCCoordsFromPlayerNum();
                        this.addToBoard(obj);
                    }
                }
            }
        }
        
        let targetCoords = this.getOpponentHomeColonyCoords(ship);
        return this.minDistanceTranslation(ship, translations, targetCoords);
    }

    removeFromBoard(obj) {
        let [x, y] = [...obj.coords];
        let index = this.simpleBoard[y][x].indexOf(obj);
        this.simpleBoard[y][x].splice(index, 1);
    }

    addToBoard(obj) {
        let [x, y] = [...obj.coords];
        this.simpleBoard[y][x].push(obj);
    }

    chooseTarget(shipInfo, combatOrder) {
        let opponentShips = combatOrder.filter(ship => ship.playerNum != shipInfo.playerNum && ship.hp > 0);
        return opponentShips[Math.floor(Math.random() * opponentShips.length)];
    }

    buyShips(cpBudget) {
        if (this.turn == 0) return [{"Scout": 5}];
        return [{"Dreadnaught": 5}];
    }

}

export default CheatStrat;