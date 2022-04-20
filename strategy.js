class Strategy {
    
    constructor() {
        this.simpleBoard = null;
        this.turn = 0;
        this.player = null;
    }

    dist(coords1, coords2) {
        return Math.hypot(coords2[0] - coords1[0], coords2[1] - coords1[1]);
    }

    minDistanceTranslation(ship, choices, targetCoords) {

        if (choices.length != 0) {
            
            let minChoice = null;
            let minDistance = 999;

            for (let choice of choices) {

                let newPoint = [ship.coords[0] + choice[0], ship.coords[1] + choice[1]];
                let distance = this.dist(newPoint, targetCoords);

                if (distance < minDistance) {
                    minDistance = distance;
                    minChoice = choice;
                }
            }

            return minChoice;

        }
    }

    getOpponentHomeColonyCoords(ship) {
        
        for (let i = 0; i < this.simpleBoard.length; i++) {
            for (let j = 0; j < this.simpleBoard.length; j++) {

                for (let obj of this.simpleBoard[j][i]) {
                    if (obj.objType === 'Colony' && obj.isHomeColony && obj.playerNum != ship.playerNum) {
                        return [i, j];
                    }
                }

            }
        }
        
    }

    chooseTranslation(ship, choices) {
        // let targetCoords = this.getOpponentHomeColonyCoords(ship);
        // return this.minDistanceTranslation(ship, choices, targetCoords);
        return [1, 0];
    }

}

module.exports = Strategy;