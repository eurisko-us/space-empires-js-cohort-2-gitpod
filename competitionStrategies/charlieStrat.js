import ParentStrat from './parentStrat.js';

class CharlieStrat extends ParentStrat {
    
    constructor() {
        super(ParentStrat);
        this.name = 'charlie';
        this.numShips = 0;
        this.firstShipId = null;
        this.secondShipId = null;
    }

    chooseTranslation(ship, translations) {
        
        if (!this.firstShipId) {
            this.firstShipId = ship.id;
            return [1, 0];
        }

        if (!this.secondShipId) {
            this.secondShipId = ship.id;
            return [-1, 0];
        }

        if (ship.id == this.firstShipId || ship.id == this.secondShipId) {

            for (let [tx, ty] of translations) {
                if (this.player.playerNum == 1 && tx == 0 && ty == 1) return [0, 1];
                if (this.player.playerNum == 2 && tx == 0 && ty == -1) return [0, -1];
            }
            
            if (ship.id == this.firstShipId)  return [-1, 0];
            if (ship.id == this.secondShipId) return [1, 0];

        }

        let targetCoords = this.getOpponentHomeColonyCoords(ship);
        return this.minDistanceTranslation(ship, translations, targetCoords);
    
    }

    chooseTarget(shipInfo, combatOrder) {
        let opponentShips = combatOrder.filter(ship => ship.playerNum != shipInfo.playerNum && ship.hp > 0);
        return opponentShips[0];
    }

    buyShips(cpBudget) {
        if (this.turn == 0) return [{"Scout": 2}, {"Dreadnaught": 4}];
        if (this.player.ships.length < 3) return [{"Dreadnaught": 1}];
        return [];
    }

}

export default CharlieStrat;
