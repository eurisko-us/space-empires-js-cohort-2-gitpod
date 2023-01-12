class ParentStrat {
    
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
                    if (obj.objType === 'Colony' && obj.isHomeColony && obj.playerNum != ship.playerNum) {
                        return [j, i];
                    }
                }
            }
        }
    }

    getOpponentRegularColonyCoords(ship) {
        let opponentRegularColonyCoords = [];

        for (let i = 0; i < this.simpleBoard.length; i++) {
            for (let j = 0; j < this.simpleBoard.length; j++) {
                for (let obj of this.simpleBoard[j][i]) {
                    if (obj.objType === 'Planet' && obj.playerNum != ship.playerNum && obj.colony == null) {
                        opponentRegularColonyCoords.push([j, i])
                    }
                }
            }
        }
        return opponentRegularColonyCoords
    }

    getNearestOpponentRegularColonyCoords(ship, opponentRegularColonyCoords){
        let minDistance = 999999
        let nearestColonyCoords = null

        for (let coord of opponentRegularColonyCoords) {
            let distance = this.dist(ship.coords, coord)

            if (distance < minDistance) {
                nearestColonyCoords = coord
            }
        }

        return nearestColonyCoords
    }

    random(list) {
        return list[Math.floor(Math.random() * list.length)];
    }

    chooseTranslation(ship, translations) { return; }
    chooseTarget(shipInfo, combatOrder) { return; }
    buyShips(cpBudget) { return; }

}

export default ParentStrat;