class Player {

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

    chooseTranslation(ship, translations) {
        let randonIndex = this.getRandomInteger(0, translations.length-1);
        return translations[randonIndex];
    }
};

module.exports = Player;