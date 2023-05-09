class Planet {

    constructor(coords, planetNum) {
        this.coords = coords;
        this.colony = null;
        this.planetNum = planetNum;
        this.objType = 'Planet';
        this.id = `Planet ${this.planetNum}`;
    }

    updateId() {
        if (this.colony != null) {
            this.id = `Planet ${this.planetNum} with ${this.colony.id}`;
        } else {
            this.id = `Planet ${this.planetNum}`;
        }
    }

}

export default Planet;