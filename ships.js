class Ship {

    constructor(coords, shipNum) {
        this.coords = coords;
        this.playerNum = null;
        this.shipNum = shipNum;
    }

    updateCoords(newCoords) {
        this.coords = newCoords;
    }
    
};

module.exports = Ship;
