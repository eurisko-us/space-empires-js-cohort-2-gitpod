class Ship {

    constructor(coords, playerNum, shipNum) {
        this.coords = coords;
        this.playerNum = playerNum;
        this.shipNum = shipNum;
    }

    updateCoords(newCoords) {
        this.coords = newCoords;
    }
    
};

module.exports = Ship;
