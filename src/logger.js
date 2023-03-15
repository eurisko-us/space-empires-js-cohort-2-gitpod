import { writeFileSync, appendFileSync } from 'fs';

class Logger {
    
    constructor(filename='log.txt') {
        this.filename = filename;
    }

    clear() {
        writeFileSync(this.filename, '', err => {
            if (err) {
                console.error(err);
                return;
            }
        });
    }

    write(string) {
        appendFileSync(this.filename, string, err => {
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
        this.write(`\t\t${ship.id} moved from (${oldCoords[0]}, ${oldCoords[1]}) to (${ship.coords[0]}, ${ship.coords[1]})\n`);
    }

    shipCantMove(ship){
        this.write(`\t\t${ship.id} cannot move because it is to be engaged in combat at (${ship.coords[0]}, ${ship.coords[1]})\n`)
    }

    combatLocation(coords) {
        this.write(`\tCombat at: ${coords}\n\n`);
    }

    combat(attacker, defender) {
        this.write(`\t\tAttacker: ${attacker.id}\n`);
        this.write(`\t\tDefender: ${defender.id}\n`);
    }

    shipHit(defender) {
        this.write(`\t\tHit!\n`);
        this.write(`\t\t${defender.id} hp: ${defender.hp} -> ${defender.hp - 1}\n`);
    }

    shipMiss() {
        this.write(`\t\tMiss!\n`);
    }

    shipDestroyed(ship) {
        this.write(`\t\t${ship.id} was destroyed\n`);
    }

    playerCP(player) {
        this.write(`\t\tPlayer ${player.playerNum} initially has ${player.cp} CP\n`);
    }

    newPlayerCP(player, cpPerRound) {
        this.write(`\t\tPlayer ${player.playerNum} gained ${cpPerRound} CP and now has ${player.cp} CP\n`);
    }

    playerCPAfterMaintenance(player) {
        this.write(`\t\tPlayer ${player.playerNum} now has ${player.cp} CP after paying maintenance\n`);
    }

    shipIsNotMaintained(player, ship) {
        this.write(`\t\tPlayer ${player.playerNum} lost ${ship.id} due to insufficient CP to pay maintenance\n`);
    }
    
    playerWentOverBudget(player, reason) {
        this.write(`\t\tPlayer ${player.playerNum} tried to go over budget while buying ${reason}\n`);
    }

    buyShip(player, ship) {
        this.write(`\t\tPlayer ${player.playerNum} bought a ${ship.name}\n`);
    }

    boughtNothing(player, thing) {
        this.write(`\t\tPlayer ${player.playerNum} didn't buy any ${thing}\n`);
    }

    madeColony(player, planet) {
        this.write(`\t\tPlayer ${player.playerNum} has colonized Planet ${planet.planetNum} at (${planet.coords})\n`);
    }

    playerCPRemaining(player) {
        this.write(`\t\tPlayer ${player.playerNum} has ${player.cp} CP remaining\n`);
    }

    playerWin(winner) {
        this.write(`Winner: Player ${winner}`);
    }

    spawnedPlanet(planet) {
        this.write(`\t\tSpawned planet at (${planet.coords})\n`);
    }

    uncolonizedPlanet(planet) {
        this.write(`\t\t${planet.id} has been uncolonized\n`);
    }

}

export default Logger;