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
        })
    }

    write(string) {
        fs.appendFileSync(this.filename, string, err => {
            if (err) {
              console.error(err);
              return;
            }
        })
    }

    initialize() {
        this.write('Begin Game\n');
    }

    turn(turnNum) {
        this.write(`\nTurn ${turnNum}\n`);
    }

    beginPhase(phase) {
        this.write(`\tBegin ${phase} Phase\n`);
    }

    endPhase(phase) {
        this.write(`\tEnd ${phase} Phase\n`);
    }

    shipMovement(oldCoords, newCoords) {
        this.write(`\t\tShip moved from ${oldCoords} to ${newCoords}\n`);
    }

    combatLocation(coords) {
        this.write(`\tCombat at: ${coords}\n\n`);
    }

    combat(attacker, defender) {
        this.write(`\t\tAttacker: Player ${attacker.playerNum} ${attacker.name} ${attacker.shipNum}\n`);
        this.write(`\t\tDefender: Player ${defender.playerNum} ${defender.name} ${defender.shipNum}\n`);
    }

    shipHit(defender) {
        this.write('\t\tHit!\n');
        this.write(`\t\tPlayer ${defender.playerNum} ${defender.name} ${defender.shipNum}: ${defender.hp} -> ${defender.hp - 1}`);
    }

    shipMiss() {
        this.write('\t\tMiss!\n');
    }

    shipDestroyed(ship) {
        self.write(`\t\tPlayer ${ship.playerNum} ${ship.name} ${ship.shipNum} was destroyed\n\n`);
    }

    playerWin(self, winnerNum) {
        self.write(`\nWinner: Player ${winnerNum}`);
    }

}

module.exports = Logger;