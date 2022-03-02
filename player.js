class Player {
    constructor(playerNum) {
        this.playerNum = playerNum;
        this.ships = []
    }
    
    addShip(ship){
        this.ships.push(ship)
    }

    getRandomInteger(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);

        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    chooseTranslation(translations){
        rand_i = this.getRandomInteger(0,translations.length-1)
        return translations[rand_i]
    }
};

module.exports = Player
