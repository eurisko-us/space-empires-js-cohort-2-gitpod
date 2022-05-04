const fs = require('fs')

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

    turn(turn_num) {
        this.write(`\nTurn ${turn_num}\n`);
    }

    begin_phase(phase) {
        this.write(`\tBegin ${phase} Phase\n`);
    }

    end_phase(phase) {
        this.write(`\tEnd ${phase} Phase\n`);
    }

    ship_movement(orig_coords, new_coords) {
        this.write(`\t\tShip moved from ${orig_coords} to ${new_coords}\n`);
    }

    combat_location(coords) {
        this.write(`\tCombat at: ${coords}\n\n`);
    }

    combat(attacker, defender) {
        this.write(`\t\tAttacker: Player ${attacker.playerNum} ${attacker.name} ${attacker.shipNum}\n`);
        this.write(`\t\tDefender: Player ${defender.playerNum} ${defender.name} ${defender.shipNum}\n`);
    }

    ship_hit(defender) {
        this.write('\t\tHit!\n');
        this.write(`\t\tPlayer ${defender.playerNum} ${defender.name} ${defender.shipNum}: ${defender.hp+1} -> ${defender.hp}`);
    }

    ship_destroyed(ship) {
        self.write(`\t\tPlayer ${ship.playerNum} ${ship.name} ${ship.shipNum} was destroyed\n\n`);
    }

    player_win(self, winner_num) {
        self.write(`\nWinner: Player ${winner_num}`);
    }
}

module.exports = Logger;
