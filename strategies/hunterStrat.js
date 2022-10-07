class HunterStrat {
    
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

    randomChoose(arr) {
        const index = Math.floor(Math.random() * arr.length);
        return arr[index];
    }

    getClosestOppShipCoords(ship) {
        let closestDist = null
        let closestCoord = null
        for (let i=0; i<this.simpleBoard.length; i++) {
            for (let j=0; j<this.simpleBoard.length; j++) {
                for (let obj of this.simpleBoard[j][i]) {
                    if (obj.objType==='Ship' && obj.playerNum!=ship.playerNum) {
                        const dist = this.dist(ship.coords,[j,i])
                        if (closestDist===null && closestCoord===null) {
                            closestDist = dist
                            closestCoord = [j,i]
                            continue
                        }
                        if (dist < closestDist) {
                            closestDist = dist
                            closestCoord = [j,i]
                        }
                        if (dist===closestDist) {
                            const choices = [[dist,[j,i]],[closestDist,closestCoord]]
                            const choice = this.randomChoose(choices)
                            closestDist = choice[0]
                            closestCoord = choice[1]
                        }
                    }
                }
            }
        }
        return closestCoord
    }

    chooseTranslation(ship, translations) {
        let targetCoords = this.getClosestOppShipCoords(ship);
        if (targetCoords===null) {
            return translations[Math.floor(Math.random() * translations.length)];
        }
        return this.minDistanceTranslation(ship, translations, targetCoords);
    }

    chooseTarget(shipInfo, combatOrder) {
        let opponentShips = combatOrder.filter(ship => ship.playerNum != shipInfo.playerNum && ship.hp > 0);
        return opponentShips[0];
    }

    buyShips(cpBudget) {
        if (this.turn == 0) return [{"Dreadnaught": 4}];

        if (this.turn>3 && cpBudget>47) return [{"Dreadnaught": 1}];

        return []
    }

}

export default HunterStrat;