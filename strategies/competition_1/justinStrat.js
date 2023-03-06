import ParentStrat from '../parentStrat.js';

class JustinStrat extends ParentStrat {

    constructor() {
        super(ParentStrat);
        this.name = 'justin';
    }

    getClosestOpponentShipCoords(ship) {

        let closestDist = 999;
        let closestCoord = null;
        
        for (let i = 0; i < this.simpleBoard.length; i++) {
            for (let j = 0; j < this.simpleBoard.length; j++) {

                for (let obj of this.simpleBoard[j][i]) {
                    if (obj.objType === 'Ship' && obj.playerNum != ship.playerNum) {
                       
                        const dist = this.dist(ship.coords, [j, i]);
                        
                        if (closestDist === null && closestCoord === null) {
                            closestDist = dist;
                            closestCoord = [j, i];
                            continue;
                        }
                        
                        if (dist < closestDist) {
                            closestDist = dist;
                            closestCoord = [j, i];
                        }

                    }
                }

            }
        }

        return closestCoord;

    }

    minDistanceTranslationSemirandom(ship, translations, targetCoords) {
            
        let minTranslation = null;
        let minDistance = 999;

        for (let translation of translations) {

            let newPoint = [ship.coords[0] + translation[0], ship.coords[1] + translation[1]];
            let distance = this.dist(newPoint, targetCoords);

            if (distance < minDistance) {
                minDistance = distance;
                minTranslation = [...translation];
            }

            if (distance == minDistance) {
                const randChoice = Math.floor(Math.random() * 1.9999999999);
                if (randChoice == 0) {
                    continue;
                }
                if(randChoice == 1) {
                    minDistance = distance;
                    minTranslation = [...translation];
                }
            }

        }

        return minTranslation;

    }

    arrAdd(arr1, arr2) {
        let newArr = [];
        for (let i = 0; i < arr1.length; i++) {
            newArr.push(arr1[i] + arr2[i]);
        }
        return newArr;
    }

    indexOfArr(bigArr, smallArr) {
        
        for (let arrIdx in bigArr) {

            let arr = bigArr[arrIdx];
            let matchCount = 0;

            for (let i in smallArr) {
                if (smallArr[i] == arr[i]) {
                    matchCount++;
                }
            }

            if (matchCount == smallArr.length) {
                return arrIdx;
            }

        }
        
        return false;

    }

    chooseTranslation(ship, translations) {

        if (ship.name == 'Scout') {
            
            let translationCopy = [...translations];
            const delIndex = this.indexOfArr(translationCopy, [0, 0]);
            translationCopy.splice(delIndex, 1);
            
            while (true) {
                
                const targetCoords = this.getOpponentHomeColonyCoords(ship);
                const translation = this.minDistanceTranslationSemirandom(ship, translationCopy, targetCoords);
                const newCoords = this.arrAdd(ship.coords, translation);
                const coordObjs = this.simpleBoard[newCoords[0]][newCoords[1]];
                let enemyInNewCoord = false;
                
                for (let obj of coordObjs) {
                    if (obj['objType'] == 'Ship' && obj['playerNum'] != this.playerNum) {
                        const badTranslationIdx = this.indexOfArr(translationCopy, translation);
                        translationCopy.splice(badTranslationIdx, 1);
                        enemyInNewCoord = true;
                        break;
                    }
                }

                if (!enemyInNewCoord) return translation;

            }

        }

        if (ship.name == 'Dreadnaught') {
            let targetCoords = this.getClosestOpponentShipCoords(ship);
            if (targetCoords == null) targetCoords = this.getOpponentHomeColonyCoords(ship);
            return this.minDistanceTranslation(ship, translations, targetCoords);
        }

    }

    checkCoordStuff(ship) {
        const shipCoords = ship.coords;
        console.log('CHECKING SHIP IN COORDINATE:');
        console.log(shipCoords);
        console.log(this.simpleBoard[shipCoords[0]][shipCoords[1]]);
        console.log(this.simpleBoard[shipCoords[1]][shipCoords[0]]);
    }

    chooseTarget(shipInfo, combatOrder) {
        let opponentShips = combatOrder.filter(ship => ship.playerNum != shipInfo.playerNum && ship.hp > 0);
        return opponentShips[0];
    }

    buyShips(cpBudget) {
        if (this.turn == 0) return [{"Scout": 1}, {"Dreadnaught": 4}];
        if (this.turn > 3 && cpBudget > 52) return [{"Dreadnaught": 2}];
        return [];
    }
}

export default JustinStrat;