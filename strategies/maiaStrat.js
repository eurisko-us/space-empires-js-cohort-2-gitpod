import ParentStrat from './parentStrat.js';

class MaiaComp extends ParentStrat {
    
    constructor() {
        super(ParentStrat);
        this.name = 'MaiaComp';
    }

    chooseTranslation(ship, translations) { 
        if (this.chosen_one(ship)) return this.chosen_one_mvmt(ship, translations);
        return this.gen_pop_mvmt(ship, translations);
    }

    buyShips(cpBudget) { return; }

    chooseTarget(shipInfo, combatOrder){
        let plrNum = shipInfo.playerNum;

        let oppShips = [[],[]];
        let shipId = combatOrder.findIndex(ship => ship == shipInfo);
        let place = 0;

        for (let i = 0; i < combatOrder.length; i++) {
            if (i == shipId) {
                place = 1;
            }
            if (combatOrder[i].playerNum != plrNum) oppShips[place].push(combatOrder[i]);
        }

        let priority = [...oppShips[1], ...oppShips[0]];
        priority.sort((a,b) => (shipInfo.atk - b.df) - (shipInfo.atk - a.df) );
        priority.sort((a,b) => a.hp - b.hp);
        //console.log(translate(priority))

        return priority[0];
    }

    riskAssess(combatOrder){
        //Will need to add code for combat order
        //Could also just run brief simulation of 20 rounds of scenario
    }

    chosenOne(candidate) {
        if (candidate.coords != this.findHomeCol(this.playerNum)) return true;

        let lowestHP = 100
        let chosenShip = None
        for (var ship of this.theGang(this.playerNum)) {
            if (ship.hp < lowestHP) {
                lowestHP = ship.hp;
                chosenShip = ship;
            }
            if (ship.coords != this.findHomeCol(this.playerNum)) return false;
        }
        if (candidate == chosenShip) return true;
        return false;
    }
    
    translate(shipDictList) {
        let readable = []
        for (var ship in shipDictList){
            ship_stuff = [ship.id, ship.hp]
            readable.push(ship_stuff)
        }
        console.log(readable)
    }
        
    findHomeCol(plrNum) {
        for (let i = 0; i < this.simpleBoard.length; i++) {
            for (let j = 0; j < this.simpleBoard.length; j++) {
                for (let obj of this.simpleBoard[j][i]) {
                    if (obj.objType === 'Colony' && obj.isHomeColony && obj.playerNum == plrNum) {
                        return [j, i];
                    }
                }
            }
        }
    }
    
    oppThere(plrNum, coord) {
        let test = this.simpleBoard[coord[0]][coord[1]].filter(obj => obj.objType == 'Ship' && obj.playerNum != plrNum);
        if (test.length != 0) return true;
        return false;
    }

    minDistanceTranslation(coords, targetCoords, translations) {
            
        let minTranslation = null;
        let minDistance = 999;

        for (let translation of translations) {

            let newPoint = [coords[0] + translation[0], coords[1] + translation[1]];
            let distance = this.dist(newPoint, targetCoords);

            if (distance < minDistance) {
                minDistance = distance;
                minTranslation = [...translation];
            }

        }

        return minTranslation;

    }

    theGang(coord, plrNum) {
        let gang = this.simpleBoard[coord[0]][coord[1]].filter(obj => obj.objType == 'Ship' && obj.playerNum != plrNum);
        return gang;
    }

    chosenOneMvmt(shipInfo, choices) {
        let coords = shipInfo.coords
        let altId = (this.playerNum % 2) + 1
        let altCol = this.findHomeCol(altId)

        if (this.allToMe) {
            //Do corrections here with same array funct
            if ([[0,0],[0,1],[1,0],[0,-1],[-1,0]].every(trans => !this.sameArray(coords, [altCol[0] + trans[0], altCol[1] + trans[1]]))){
                return this.gen_pop_mvmt(shipInfo, choices);
            }
            for (var ship of this.theGang(shipInfo.playerNum)) {
                if ([[0,0],[0,1],[1,0],[0,-1],[-1,0]].every(trans => !this.sameArray(ship.coords, [altCol[0] + trans[0], altCol[1] + trans[1]]))){
                    return [0,0];
                }
            return this.minDistanceTranslation(coords, altCol, choices);
            }
        }

        if (coords == this.findHomeCol(this.playerNum)) return this.minDistanceTranslation(coords, altCol, choices);
        
        let mvmt = this.minDistanceTranslation(coords, altCol, choices);
        
        let newCoords = [coords[0]+mvmt[0], coords[1]+mvmt[1]];

        let finishHim = false;

        if (newCoords == altCol) finishHim = true;
        
        while (this.theGang(newCoords, altId).length != 0) {
            if (finishHim) {
                this.allToMe = true;
                return [0,0];
            }
            choices.remove(mvmt)
            mvmt = this.minDistanceTranslation(coords, altCol, choices);
            if (this.sameArray(mvmt, [0,0])) {
                if (choices.some(trans => this.sameArray(trans, [0,0])))  {
                    choices.splice(choices.findIndex(trans => this.sameArray(trans, [0,0])), 1);
                }
                if (choices.length == 0) return [0,0];
                mvmt = choices[0];
            }

            newCoords = [coords[0]+mvmt[0], coords[1]+mvmt[1]]
        }
        return mvmt
    }

    gen_pop_mvmt(shipInfo, choices) {
        if (!this.allToMe) return [0,0];

        let home_col = this.findHomeCol(plrNum)
        let coords = shipInfo.coords
        let altId = (this.plrNum % 2) + 1
        let altCol = this.findHomeCol(altId)

        if (shipInfo in this.simpleBoard[home_col] && len(this.simpleBoard[home_col]) == 2) {
            for (var choice in choices) {
                if (this.theGang(altId, [home_col[0]+choice[0], home_col[1]+choice[1]]).length != 0) return [0,0];
            }
        }

        let mvmt = this.minDistanceTranslation(coords, altCol, choices);

        let newCoords = [coords[0]+mvmt[0], coords[1]+mvmt[1]]

        while (this.theGang(aldId, newCoords) != 0) {
            if (this.sameArray(newCoords, altCol)) return mvmt;
            choices.remove(mvmt);
            mvmt = this.minDistanceTranslation(coords, altCol, choices);
            if (this.sameArray(mvmt, [0,0])) {
                if (choices.some(trans => this.sameArray(trans, [0,0])))  {
                    choices.splice(choices.findIndex(trans => this.sameArray(trans, [0,0])), 1);
                }
                if (choices.length == 0) return [0,0];
                mvmt = choices[0];
            }
            newCoords = [coords[0]+mvmt[0], coords[1]+mvmt[1]]
        }
        return mvmt
    }

    sameArray(array1, array2) {
        for (let i = 0; i < array1.length; i++) {
            if (array1[i] != array2[i]) return false;
        }
        return true;
    }

}

export default MaiaComp;