class Ship {
    constructor(coords) {
        this.coords = coords;
        this.playerNum = null;
    }

    updateCoords(new_coords) {
        this.coords = new_coords
    }
};

module.exports = Ship;
