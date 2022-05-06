class Strategy {
    
    constructor() {
        this.simpleBoard = null;
        this.turn = 0;
        this.player = null;
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
                    if (obj.objType === 'Colony' && obj.isHomeColony && obj.playerNum != ship.playerNum) {
                        return [j, i];
                    }
                }

            }
        }
        
    }

    chooseTranslation(ship, translations) {
        let targetCoords = this.getOpponentHomeColonyCoords(ship);
        return this.minDistanceTranslation(ship, translations, targetCoords);
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

}

module.exports = Strategy;