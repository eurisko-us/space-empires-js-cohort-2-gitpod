class Ship {

    constructor(coords) {
        this.coords = coords;
        this.playerNum = null;
    }

    updateCoords(newCoords) {
        this.coords = newCoords;
    }
    
};

module.exports = Ship;
