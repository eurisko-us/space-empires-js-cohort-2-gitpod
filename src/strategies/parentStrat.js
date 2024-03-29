class ParentStrat {
    
    constructor() {
        this.simpleBoard = null;
        this.turn = 0;
        this.playerNum = null;
        this.isManual = false;
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

    getColonyCoords(ship, hc, opp) { // hc & opp = booleans
        
        let colonyCoords = [];
        let playerNum = opp * (3 - 2 * ship.playerNum) + ship.playerNum;
        
        for (let i = 0; i < this.simpleBoard.length; i++) {
            for (let j = 0; j < this.simpleBoard.length; j++) {
                for (let obj of this.simpleBoard[j][i]) {

                    if (obj.objType === 'Colony' && obj.playerNum == playerNum) {
                        if (obj.isHomeColony === hc) {
                            return [j, i];
                        } else if (!obj.isHomeColony) {
                            colonyCoords.push([j, i]);
                        }
                    }
                    
                }
            }
        }

        return colonyCoords;

    }

    getFreePlanetsCoords() {

        let freePlanetCoords = [];

        for (let i = 0; i < this.simpleBoard.length; i++) {
            for (let j = 0; j < this.simpleBoard.length; j++) {
                for (let obj of this.simpleBoard[j][i]) {
                    if (obj.objType === 'Planet' && obj.colony == null) {
                        freePlanetCoords.push([j, i]);
                    }
                }
            }
        }

        return freePlanetCoords;
    }

    getNearestCoords(ship, chosenSetofCoords) {
        
        let minDistance = 999999;
        let nearestCoords = null;

        for (let coord of chosenSetofCoords) {
            let distance = this.dist(ship.coords, coord);
            if (distance < minDistance) {
                nearestCoords = coord;
            }
        }

        return nearestCoords;

    }

    getAllShips(coords=null, playerNum=null) {
        
        if (playerNum) {

            let shipList = [];

            for (let i = 0; i < this.simpleBoard.length; i++) {
                for (let j = 0; j < this.simpleBoard.length; j++) {
                    for (let obj of this.simpleBoard[j][i]) {
                        if (obj.objType === 'Ship' && obj.playerNum === playerNum && obj.hp > 0) {
                            shipList.push(obj.coords);
                        }
                    }
                }
            }

            return shipList;

        }
        
        else if (coords) {
            console.log('coord');
            return this.simpleBoard[coords[1]][coords[0]].filter(obj => obj.objType === 'Ship' && obj.hp > 0);
        }

    }

    
    dist(coords1, coords2) {
        return Math.hypot(coords2[0] - coords1[0], coords2[1] - coords1[1]);
    }

    maintOrder(ships) {
        return ships.sort((a, b) => a.maintCost - b.maintCost);
    }
    
    random(list) {
        return list[Math.floor(Math.random() * list.length)];
    }

    chooseTranslation(ship, translations) { return; }
    chooseTarget(shipInfo, combatOrder) { return; }
    buyShips(cpBudget) { return []; }
    maintOrder(ships) { return ships.sort((a, b) => a.maintCost - b.maintCost); }
    buyTech(cpBudget) {return [];}

}

export default ParentStrat;