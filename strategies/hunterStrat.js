import ParentStrat from './parentStrat.js';

class HunterStrat extends ParentStrat {
    
    constructor() {
        super(ParentStrat);
        this.name = 'hunter';
    }

    getClosestOpponentShipCoords(ship) {

        let closestDist = null;
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
                        
                        if (dist === closestDist) {
                            const choices = [[dist, [j, i]], [closestDist, closestCoord]];
                            const choice = this.random(choices);
                            closestDist, closestCoord = choice;
                        }

                    }
                }

            }
        }
        
        return closestCoord;

    }

    chooseTranslation(ship, translations) {
        let targetCoords = this.getClosestOpponentShipCoords(ship);
        if (!targetCoords) return this.random(translations);
        return this.minDistanceTranslation(ship, translations, targetCoords);
    }

    chooseTarget(shipInfo, combatOrder) {
        let opponentShips = combatOrder.filter(ship => ship.playerNum != shipInfo.playerNum && ship.hp > 0);
        return opponentShips[0];
    }

    buyShips(cpBudget) {
        if (this.turn == 0) return [{"Dreadnaught": 4}];
        if (this.turn > 3 && cpBudget > 47) return [{"Dreadnaught": 1}];
        return [];
    }

}

export default HunterStrat;