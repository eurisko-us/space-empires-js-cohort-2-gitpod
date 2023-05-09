import ParentStrat from '../parentStrat.js';

class CaydenStrat extends ParentStrat {
    
    constructor() {
        super(ParentStrat);
        this.name = 'cayden';
    }

    chooseTranslation(ship, translations) {
        let targetCoords = this.getOpponentHomeColonyCoords(ship);
        return this.minDistanceTranslation(ship, translations, targetCoords);
    }

    chooseTranslationV2(ship, translations) {

        let targetCoords = this.getOpponentHomeColonyCoords(ship);

        if (ship.shipNum <= 5) {
            return this.minDistanceTranslation(ship, translations, targetCoords);
        } else {

            let previousFleetsDead = false;
            let myShipNums = this.getMyShips(ship.playerNum);
            let maxShipNumLastFleet = ship.shipNum - ship.shipNum % 5;

            for (num of myShipNums) {
                if (num <= maxShipNumLastFleet) {
                    previousFleetsDead = true;
                }
            }

        }

    }

    getMyShips(myPlayerNum) {

        let myShips = [];

        for (let i = 0; i < this.simpleBoard.length; i++) {
            for (let j = 0; j < this.simpleBoard[i].length; j++) {
                if (this.simpleBoard[i][j].length > 0) {
                    for (let obj of this.simpleBoard[i][j]) {
                        if (obj.objType == "Ship" && obj.playerNum == myPlayerNum) {
                            myShips.push(obj.shipNum);
                        }
                    }
                }
            }
        }

        return myShips;

    }

    chooseTarget(shipInfo, combatOrder) {
        let opponentShips = combatOrder.filter(ship => ship.playerNum != shipInfo.playerNum && ship.hp > 0);
        return opponentShips[0];
    }

    buyShips(cpBudget) {
        if (this.turn == 0) return [{"Dreadnaught": 5}];
        if (cpBudget > 50) return [{"Dreadnaught": 1}];
        return [];
    } 

}

export default CaydenStrat;