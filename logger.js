const fs = require('fs');

class Logger {
    
    constructor(filename='log.txt') {
        this.filename = filename;
    }

    clear() {
        fs.writeFileSync(this.filename, '', err => {
            if (err) {
              console.error(err);
              return;
            }
        });
    }

    write(string) {
        fs.appendFileSync(this.filename, string, err => {
            if (err) {
              console.error(err);
              return;
            }
        });
    }

    initialize() {
        this.write(`Begin Game\n`);
    }

    turn(turnNum) {
        this.write(`Turn ${turnNum}\n`);
    }

    beginPhase(phase) {
        this.write(`\tBegin ${phase} Phase\n`);
    }

    endPhase(phase) {
        this.write(`\tEnd ${phase} Phase\n\n`);
    }

    shipMovement(oldCoords, ship) {
        this.write(`\t\t${ship.shipId} moved from (${oldCoords[0]}, ${oldCoords[1]}) to (${ship.coords[0]}, ${ship.coords[1]})\n`);
    }

    combatLocation(coords) {
        this.write(`\tCombat at: ${coords}\n\n`);
    }

    combat(attacker, defender) {
        this.write(`\t\tAttacker: ${attacker.shipId}\n`);
        this.write(`\t\tDefender: ${defender.shipId}\n`);
    }

    shipHit(defender) {
        this.write(`\t\tHit!\n`);
        this.write(`\t\t${defender.shipId} hp: ${defender.hp} -> ${defender.hp - 1}\n`);
    }

    shipMiss() {
        this.write(`\t\tMiss!\n`);
    }

    shipDestroyed(ship) {
        this.write(`\t\t${ship.shipId} was destroyed\n`);
    }

    playerWin(winner) {
        this.write(`Winner: Player ${winner}`);
    }

}

module.exports = Logger;