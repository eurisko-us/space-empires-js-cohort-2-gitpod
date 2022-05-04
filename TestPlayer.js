class TestPlayer {

    constructor(playerNum) {
        this.playerNum = playerNum;
        this.ships = [];
        this.homeColony = null;
    }
    
    addShip(ship){
        ship.playerNum = this.playerNum;
        this.ships.push(ship);
    }

    getRandomInteger(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    getDistance(point1, point2) {
        let dx = Math.pow((point1[0] - point2[0]), 2)
        let dy = Math.pow((point1[1] - point2[1]), 2)
    
        return Math.sqrt(dx + dy)
    
    }

    getDesiredLocation(desiredLocation, ship, possibleTranslations){
        let minDistance = 100000;
        let minDistanceTranslation = possibleTranslations[0];

        for (let translation of possibleTranslations) {
            let shipCoords = [...ship.coords];

            let newCoords = [shipCoords[0] + translation[0], shipCoords[1] + translation[1]]
            let newDistance = this.getDistance(newCoords, desiredLocation)

            if (newDistance < minDistance){
                minDistance = newDistance
                minDistanceTranslation = translation
            }

        }

        return minDistanceTranslation
    }

    chooseTranslation(ship, translations) {
        if (this.playerNum == 1) {
            return this.getDesiredLocation([3, 6], ship, translations)
        }

        if (this.playerNum == 2) {
            return this.getDesiredLocation([3, 0], ship, translations)
        }
    }
};


module.exports = TestPlayer;