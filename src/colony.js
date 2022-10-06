class Colony {

    constructor(coords, playerNum, isHomeColony) {
        this.coords = coords;
        this.playerNum = playerNum;
        this.isHomeColony = isHomeColony;
        this.objType = "Colony";
        this.id = `Player ${this.playerNum} ${this.isHomeColony ? "Home" : ""} Colony`;
    }
    
}

export default Colony;