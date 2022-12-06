import ParentStrat from '../strategies/parentStrat.js';

class CharlieStrat extends ParentStrat {
    
    constructor() {

        super(ParentStrat);

        this.name = 'charlie';
        this.numShips = 0;
        
        this.leftFlankId = null;
        this.rightFlankId = null;

    }

    chooseTranslation(shipInfo, translations) {
        
        // move initial flank ships to the left/right

        if (!this.leftFlankId) {
            this.leftFlankId = shipInfo.id;
            return [-1, 0];
        }

        if (!this.rightFlankId) {
            this.rightFlankId = shipInfo.id;
            return [1, 0];
        }

        // move flank ships

        if (shipInfo.id == this.leftFlankId || shipInfo.id == this.rightFlankId) {

            for (let [tx, ty] of translations) {
                if (this.playerNum == 1 && tx == 0 && ty == 1)  return [0, 1];
                if (this.playerNum == 2 && tx == 0 && ty == -1) return [0, -1];
            }

            if (shipInfo.id == this.leftFlankId)  return [1, 0];
            if (shipInfo.id == this.rightFlankId) return [-1, 0];

        }

        // move dreadnaughts

        let targetCoords = this.getOpponentHomeColonyCoords(shipInfo);
        return this.minDistanceTranslation(shipInfo, translations, targetCoords);
    
    }

    chooseTarget(shipInfo, combatOrder) {
        let opponentShips = combatOrder.filter(ship => ship.playerNum != shipInfo.playerNum && ship.hp > 0);
        return opponentShips[0];
    }

    buyShips(cpBudget) {
        if (this.turn == 0) return [{"Scout": 2}, {"Dreadnaught": 4}];
        if (this.playerNum == 1 && this.getShips().length < 7) return [{"Scout": 1}];
        if (this.playerNum == 2 && this.getShips().length < 3) return [{"Dreadnaught": 1}]
        return [];
    }

    getHomeColonyCoords(shipInfo) {

        for (let i = 0; i < this.simpleBoard.length; i++) {
            for (let j = 0; j < this.simpleBoard.length; j++) {
                for (let obj of this.simpleBoard[j][i]) {

                    if (obj.objType === 'Colony' && obj.isHomeColony && obj.playerNum == shipInfo.playerNum) {
                        return [j, i];
                    }

                }
            }
        }

    }

    getShips() {

        let ships = [];

        for (let i = 0; i < this.simpleBoard.length; i++) {
            for (let j = 0; j < this.simpleBoard.length; j++) {
                for (let obj of this.simpleBoard[j][i]) {

                    if (obj.objType === 'Ship' && obj.playerNum === this.playerNum) {
                        ships.push(obj);
                    }

                }
            }
        }

        return ships;

    }

    shipIsDead(id) {

        let isDead = true;

        for (let i = 0; i < this.simpleBoard.length; i++) {
            for (let j = 0; j < this.simpleBoard.length; j++) {
                for (let obj of this.simpleBoard[j][i]) {

                    if (obj.id === id) {
                        isDead = false;
                    }

                }
            }
        }

        return isDead;

    }

    listsAreEqual(list1, list2) {
        
        if (list1.length != list2.length) return false;
        
        for (let i = 0; i < list1.length; i++) {
            if (list1[i] != list2[i]) {
                return false;
            }
        }

        return true;

    }

}

export default CharlieStrat;
