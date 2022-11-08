import ParentStrat from './parentStrat.js';
import RandomStrat from './randomStrat.js';
import RushStrat from './rushStrat.js';
import ShopperStrat from './shopperStrat.js';
import TurtleStrat from './turtleStrat.js';
import HunterStrat from './hunterStrat.js';

class ModularStrat extends ParentStrat {
    
    constructor(stratDict) {
        super(ParentStrat);
        this.name = 'modular';
        this.strats = stratDict;
        this.move_strat = stratDict['movement'];
        this.combat_strat = stratDict['combat'];
        this.buy_strat = stratDict['economic'];
    }

    chooseTranslation(ship, translations) {
        let targetCoords = this.getOpponentHomeColonyCoords(ship);
        if (ship.playerNum == 1) return [0, 0];
        if (ship.playerNum == 2) return this.minDistanceTranslation(ship, translations, targetCoords);
    }

    chooseTarget(shipInfo, combatOrder) {
        let opponentShips = combatOrder.filter(ship => ship.playerNum != shipInfo.playerNum && ship.hp > 0);
        return this.random(opponentShips);
    }

    buyShips(cpBudget) {
        return [];
    }

}

export default ModularStrat;