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
            };
        })
    }

    write(string) {
        fs.appendFileSync(this.filename, string, err => {
            if (err) {
                console.error(err);
                return;
            };
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

    shipMovement(oldCoords, ship) {
        this.write(`\t\tPlayer ${ship.playerNum} ${ship.name} ${ship.shipNum} moved from (${oldCoords}) to (${ship.coords})\n`);

    }

}

module.exports = Logger;

/*

    def log_move_ship(self, ship, orig, new):
      self.write(f'\tPlayer {ship.player_num}, {ship.name} {ship.ship_num}: {orig} -> {new}\n')
    
    def log_combat_location(self, coords):
      self.write(f'\tCombat at: {coords}\n\n')
          
    def combat_ships(self, attacker, defender):
      self.write(f'\t\tAttacker: Player {attacker.player_num} {attacker.name} {attacker.ship_num}\n')
      self.write(f'\t\tDefender: Player {defender.player_num} {defender.name} {defender.ship_num}\n')
    
    def ship_hit(self, attacker, defender, dmg):
      self.write(f'\t\tPlayer {attacker.player_num} {attacker.name} {attacker.ship_num} dealt {dmg} dmg to Player {defender.player_num} {defender.name} {defender.ship_num}\n\n')

    def ship_destroyed(self, ship):
      self.write(f'\t\tPlayer {ship.player_num} {ship.name} {ship.ship_num} was destroyed\n\n')

    def player_win(self, winner_num):
      self.write(f'\nWinner: Player {winner_num}')

*/