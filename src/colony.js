class Colony {

    constructor(coords, playerNum, isHomeColony) {
        this.coords = coords;
        this.playerNum = playerNum;
        this.isHomeColony = isHomeColony;
        this.objType = "Colony";
        this.id = `Player ${this.playerNum} ${this.isHomeColony ? "Home" : ""} Colony`;
        this.hp = this.isHomeColony ? 4 : 3;
    }
    
}

export default Colony;