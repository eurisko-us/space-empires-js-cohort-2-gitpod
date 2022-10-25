class CheatStrat {
    
    constructor() {
        this.simpleBoard = null;
        this.turn = 0;
        this.playerNum = null;
    }

    dist(coords1, coords2) {
        return Math.hypot(coords2[0] - coords1[0], coords2[1] - coords1[1]);
    }

    minDistanceTranslation(ship, translations, targetCoords) {
            
        let minTranslation = null;
        let minDistance = 999;

        for (let translation of translations) {

            let newPoint = [ship.coords[0] + translation[0], ship.coords[1] + translation[1]];
            let distance = this.dist(newPoint, targetCoords);

            if (distance < minDistance) {
                minDistance = distance;
                minTranslation = [...translation];
            }

        }

        return minTranslation;

    }

    getOpponentHomeColonyCoords(ship) {
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
                        obj.coords = this.getOpponentHomeColonyCoords();
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