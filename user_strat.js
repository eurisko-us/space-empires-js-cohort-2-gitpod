const prompt = require('prompt-sync')();

class UserStrategy {
    
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
        console.log('\n\n')
        console.log(`${ship.shipId} is at ${ship.coords}`)
        console.log(`Possible movements are Check The Damn Board`)

        let trans = this.transInput(ship, translations);
        //let targetCoords = this.getOpponentHomeColonyCoords(ship);
        if (translations.find(el => this.sameArray(trans, el)) == undefined) {
            console.log('That doesnt work, turn forfit')
            trans = [0,0]
        }
        return trans
    }

    sameArray(array1, array2) {
        for (let i=0; i < array1.length; i++){
            if (array1[i] != array2[i]) {
                return false
            }
        }
        return true
    }

    directionFromTrans (trans) {
        switch (trans) {
            case this.sameArray([0,-1], trans) :
                return 'up';
            case this.sameArray([0,1],trans) :
                return 'down';
            case this.sameArray([-1,0],trans) :
                return 'left';
            case this.sameArray([1,0],trans) :
                return 'right';
            case this.sameArray([0,0],trans) :
                return 'stay';
        }
    }

    transInput() {
        console.log('')
        let input = prompt("Pick a direction (up, down, left, right, stay) : ");
        switch (input) {
            case 'up' :
                return [0,-1];
            case 'down' :
                return [0,1];
            case 'left' :
                return [-1,0];
            case 'right' :
                return [1,0];
            case 'stay' :
                return [0,0];
            default :
                console.log('ye')
                return [0,0]
                //console.log('Try again, it might be mispelled');
                //return this.transInput()
        }
        
        //let input = prompt("USER INPUT: Choose your move? ");
        //console.log(`Received user input "${input}"`);
    }

    chooseTarget(shipInfo, combatOrder) {
        let opponentShips = combatOrder.filter(ship => ship.playerNum != shipInfo.playerNum && ship.hp > 0);
        return opponentShips[Math.floor(Math.random() * opponentShips.length)];
    }

}

module.exports = UserStrategy;