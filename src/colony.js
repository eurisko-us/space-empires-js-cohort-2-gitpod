class Colony {

    constructor(coords, playerNum, isHomeColony) {
        this.coords = coords;
        this.playerNum = playerNum;
        this.isHomeColony = isHomeColony;
        this.objType = "Colony";
        this.hp = this.isHomeColony ? 4 : 3;
    }

    setColonyId(colonyNum) {
        this.id = `Player ${this.playerNum} Colony ${this.colonyNum}
    }
    
    setHomeColonyId() {
        this.id =`Player ${this.playerNum} Home Colony`
    }

}

export default Colony;