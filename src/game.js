import { readFile } from 'fs';
import { allShips } from './ships.js';
import Player from './player.js';
import Colony from './colony.js';
import Logger from './logger.js';
import assert from 'assert';

class Game {
    
    constructor(clientSockets, strategies, refreshRate=1000, maxTurns=1000, cpPerRound=10) {
        
        this.clientSockets = clientSockets;
        this.boardSize = 7;
        this.maxTurns = maxTurns;
        this.refreshRate = refreshRate;
        this.cpPerRound = cpPerRound;
        this.stopInterval = null;
    
        this.log = new Logger();
        this.log.clear();
        this.log.initialize();

        this.players = strategies.map((strategy, i) => new Player(i + 1, strategy));

        this.board = [];
        this.turn = 0;
        this.winner = null;

        this.boardRange = [...Array(this.boardSize).keys()];
        this.allCoords = [...this.boardRange.flatMap(y => this.boardRange.map(x => [x, y]))];

    }

    start() {
        this.stopInterval = setInterval(() => this.run(), this.refreshRate);
        // this.refreshRate is how often this.run() runs, in milliseconds
    }

    translate(x, y) {
        return x.map((_, i) => x[i] + y[i]);
    }

    checkInBounds(coords) {
        return coords.every(coord => this.boardRange.includes(coord));
    }

    possibleTranslations(coords) {
        let allTranslations = [[0,0], [0,1], [1,0], [-1,0], [0,-1]];
        return allTranslations.filter(t => this.checkInBounds(this.translate(t, coords)));
    }

    removeObjFromBoard(obj) {
        let [x, y] = [...obj.coords];
        let index = this.board[y][x].indexOf(obj);
        this.board[y][x].splice(index, 1);
        // the first parameter sets the array index, the second sets how many are removed
    }

    addToBoard(obj) {
        let [x, y] = [...obj.coords];
        this.board[y][x].push(obj);
    }

    getShipNum(newShipName, player) { //gets new ship num to prevent repeats within 
        player.shipCounter[newShipName] += 1
        return player.shipCounter[newShipName]
    }

    getNewShip(shipName, i) { // i is the player index
    
        const shipNum = this.getShipNum(shipName, this.players[i]);

        const spawnLocationMap = {
            '1': [3, 0],
            '2': [3, 6],
            '3': [0, 3],
            '4': [0, 6]
        }

        for (let shipClass of allShips) {
            if (shipName == shipClass.name) {
                return new shipClass(spawnLocationMap[(i+1).toString()], i+1, shipNum);
            }
        }

    }

    initializeGame() {

        // make board

        for (let i = 0; i < this.boardSize; i++) {
            this.board.push([]);
            for (let j = 0; j < this.boardSize; j++) {
                this.board[i].push([]);
            }
        }

        // If more players added, we'll need to change some stuff dependent on i

        for (let i = 0; i < this.players.length; i++) {
            this.buyShips(this.players[i])

            // Creates home colony for each player
            let homeColony = new Colony([3,6*i], i+1);
            homeColony.isHomeColony = true;
            this.players[i].homeColony = homeColony;
            this.addToBoard(homeColony);

        }
        this.turn = 1
        this.updateSimpleBoard();

    }

    getSimpleObj(obj) {
        let simpleObj = {};
        for (const [attr, v] of Object.entries(Object.getOwnPropertyDescriptors(obj))) {
            simpleObj[attr] = v.value;
        }
        return simpleObj;
    }

    updateSimpleBoard() { // prevents strategies from cheating
    
        let simpleBoard = this.boardRange.map(
            i => this.boardRange.map(
                j => this.board[j][i].map(
                    obj => this.getSimpleObj(obj)
                )
            )
        );

        for (let player of this.players) {
            player.strategy.simpleBoard = simpleBoard;
            player.strategy.turn = this.turn;
        }

    }

    movementPhase() {

        this.log.beginPhase('Movement');

        for (let player of this.players) {
            for (let ship of player.ships) {

                let oldCoords = [...ship.coords]; // ... accesses each element of the array. It can also be used for functions
                let translations = this.possibleTranslations(ship.coords);
                let translation = player.strategy.chooseTranslation(ship, translations);            
                let newCoords = this.translate(oldCoords, translation);
                
                if (this.checkForOpponentShips(ship)) continue;
                if (newCoords[0] < 0 || newCoords[0] > 6 || newCoords[1] < 0 || newCoords[1] > 6) continue;

                this.removeObjFromBoard(ship);
                ship.coords = newCoords;
                this.addToBoard(ship);
                this.log.shipMovement(oldCoords, ship);
                this.updateSimpleBoard();

            }
        }

        this.log.endPhase('Movement');

    }

    roll(attacker, defender) {

        let roll = Math.floor(Math.random() * 10);

        if (roll <= attacker.atk - defender.df || roll === 1) {
            this.log.shipHit(defender);
            return true;
        } else {
            this.log.shipMiss();
            return false;
        }

    }

    combatPhase() {

        this.log.beginPhase('Combat');

        for (let coords of this.getCombatCoords()) {
            
            let combatOrder = this.sortCombatOrder(coords); 
            
            while (this.numPlayersOnCoords(combatOrder) > 1) {
            // while (this.checkForCombat(coords) > 1) {
                for (let ship of combatOrder) {

                    if (this.numPlayersOnCoords(combatOrder) == 1) break;
                    // if (this.checkForCombat(coords) == 1) break;

                    if (this.board[coords[1]][coords[0]].includes(ship)) {
                        
                        let attacker = this.players[ship.playerNum - 1];
                        let target = attacker.strategy.chooseTarget(ship, combatOrder);
                        let defender = this.players[target.playerNum - 1];
                        this.log.combat(ship, target);
                        
                        assert (ship.hp > 0, 'Aborting... attacker is dead');
                        assert (target.hp > 0, 'Aborting... defender is already dead');

                        if (this.roll(ship, target)) {
                            target.hp -= 1;
                            if (target.hp <= 0) {
                                this.log.shipDestroyed(target);
                                combatOrder.splice(combatOrder.indexOf(target), 1)
                                this.removeObjFromBoard(target);
                                this.removeShipFromPlayer(defender, target);
                            }
                        }

                    }

                }
            }

        }

        this.log.endPhase('Combat');

    }

    getAllShips(coords) {
        return this.board[coords[1]][coords[0]].filter(obj => obj.objType === 'Ship' && obj.hp > 0);
    }

    numPlayersOnCoords(combatOrder) {
        return (new Set(combatOrder.map(ship => ship.playerNum))).size;
    }

    checkForOpponentShips(obj) {
        let ships = this.getAllShips(obj.coords);
        return !ships.every(ship => ship.playerNum === obj.playerNum);
    }

    checkForCombat(coords) {
        let ships = this.getAllShips(coords);
        if (ships.length == 0) return false;
        return !ships.every(obj => obj.playerNum === ships[0].playerNum);
    }

    getCombatCoords() {
        return this.allCoords.filter(coords => this.checkForCombat(coords));
    }

    sortCombatOrder(coords) {
        let combatOrder = this.getAllShips(coords);
        combatOrder.sort((a, b) => a.shipClass.localeCompare(b.shipClass));
        return [...combatOrder];
    }

    removeShipFromPlayer(player, ship) {
        let index = player.ships.indexOf(ship);
        player.ships.splice(index, 1);
    }

    removePlayer(player) {
        player.ships.forEach(ship => this.removeObjFromBoard(ship));
        this.removeObjFromBoard(player.homeColony);
        this.players.splice(this.players.indexOf(player), 1);
    }

    sum(list) {
        let total = 0;
        for (const elem of list) {
            total += elem;
        }
        return total;
    }

    maintOrder(ships) {
        return ships.sort((a, b) => a.maintCost - b.maintCost);
    }

    calcMaintCost(ships) {
        const maintCosts = ships.map((ship) => ship.maintCost);
        return this.sum(maintCosts);
    }

    maintenance(player) {

        let totalCost = this.calcMaintCost(player.ships);
        let orderedShips = this.maintOrder(player.ships);

        while (totalCost > player.cp) {
            
            this.log.shipIsNotMaintained(player, orderedShips[0]);
            this.removeObjFromBoard(orderedShips[0])
            assert (!(this.board[orderedShips[0].coords[1]][orderedShips[0].coords[0]].includes(orderedShips[0])), 'Ship lost to maintenance is still on the board');
            
            orderedShips.shift();
            totalCost = this.calcMaintCost(orderedShips);
        
        }

        player.cp -= totalCost;
        assert (player.cp >= 0, 'Player did not give up enough ships for maintenance, has negative CP');
        player.ships = orderedShips;

    }

    calcShipCost(shipName) {
        for (let shipClass of allShips) {
            if (shipName == shipClass.name) {
                return new shipClass([0, 0], 0, 0).cpCost;
            }
        }
    }

    calcTotalCost(ships) {

        let totalCost = 0;

        for (const ship of ships) {
            const [shipName, numShips] = Object.entries(ship)[0];
            for (let i = 0; i < numShips; i++) {
                totalCost += this.calcShipCost(shipName);
            }
        }

        return totalCost;

    }

    buyShips(player) {
        
        let playerShips = player.buyShips(); // returns a list of dicts: [{"Scout", 1}, {"Battleship", 2}, ...]
        let totalCost = this.calcTotalCost(playerShips);

        if (totalCost > player.cp) {
            this.log.playerWentOverBudget(player); // the player gets nothing if they go over budget
            return;
        }

        player.cp -= totalCost;
        assert (player.cp >= 0, 'Player has negative CP, was allowed to go over budget when buying ships');

        if (playerShips) {
            for (let ship of playerShips) {
                for (let shipName in ship) {
                    for (let i = 0; i < ship[shipName]; i++) {
                        
                        let ship = this.getNewShip(shipName, player.playerNum - 1); // creates a new ship
                        if (!ship) continue;

                        player.addShip(ship);
                        assert (player.ships.includes(ship), 'Ship was not added to player.ships');
                        
                        this.addToBoard(ship);
                        assert (this.board[ship.coords[1]][ship.coords[0]].includes(ship), 'Ship was not added to board');
                        
                        this.log.buyShip(player, ship);

                    }
                }
            }

        }
        

        this.log.playerCPRemaining(player);

    }

    economicPhase() { 
        
        this.log.beginPhase('Economic');

        for (let player of this.players) {
            
            this.log.playerCP(player); // gain cp
            player.cp += this.cpPerRound; 
            this.log.newPlayerCP(player, this.cpPerRound);

            this.maintenance(player); // pay maintenance
            this.log.playerCPAfterMaintenance(player);

            this.buyShips(player); // buy ships

        }

        this.log.endPhase("Economic");

    }

    checkForWinner() {

        this.players.filter(player => this.checkForOpponentShips(player.homeColony))
                    .forEach(player => this.removePlayer(player));

        if(this.players.length === 1) return this.players[0].playerNum;
        if(this.players.length === 0) return 'Tie';

    }

    getLogs(data) {

        let decoder = new TextDecoder("utf-8");
        let decodedData = decoder.decode(data);

        let logs = [];
        let currentLine = '';
        let turn = [];

        for (let i = 0; i < decodedData.length; i++) {
            
            if (decodedData[i] === '\n') {
                turn.push(currentLine);
                currentLine = '';
            } else {
                currentLine += decodedData[i];
            }

            if (decodedData.slice(i, i+4) === 'Turn' || i == decodedData.length - 1) {
                logs.push(turn);
                turn = [];
            }

        }
        
        if (this.winner) logs.push([`Winner: Player ${this.winner}<br>`]);
        return logs;

    }

    display() {
        for (let socketId in this.clientSockets) {
            let socket = this.clientSockets[socketId];
            readFile('log.txt', (_, data) => {               
                socket.emit('state', {
                    board: this.board,
                    logs: this.getLogs(data)
                });
            });
        }
    }

    run() {

        this.display();

        if (this.winner) {
            this.log.playerWin(this.winner);
            clearInterval(this.stopInterval);
            return;
        }

        if (this.turn < this.maxTurns) {
            this.log.turn(this.turn);
            this.movementPhase();
            this.combatPhase();
            this.economicPhase();
            this.winner = this.checkForWinner();
            this.turn++;
        } else {
            this.winner = 'Tie';
        }

    }

    getRandomInteger(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

};

export default Game;