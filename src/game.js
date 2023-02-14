import { readFile } from 'fs';
import assert from 'assert';

import { allShips } from './ships.js';
import Player from './player.js';
import Colony from './colony.js';
import Logger from './logger.js';

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

    // spawnPlanets(self, xRange, yRange, homeColonyCoords) {
    //     let options = [];
    //     this.addToBoard(homeColony);
    // }

    // Initializing and running the game

    initializeGame() {

        // create board

        for (let i = 0; i < this.boardSize; i++) {
            this.board.push([]);
            for (let j = 0; j < this.boardSize; j++) {
                this.board[i].push([]);
            }
        }

        for (let i = 0; i < this.players.length; i++) {
            
            // buy home colony
            
            const halfBoardSize = (this.boardSize - 1) / 2;

            const homeColonyCoordsMap = {
                0: [halfBoardSize, 0],
                1: [halfBoardSize, this.boardSize - 1],
                2: [0, halfBoardSize],
                3: [this.boardSize - 1, halfBoardSize]
            }

            let homeColony = new Colony(homeColonyCoordsMap[i], i+1, true);
            homeColony.setHomeColonyId();
            this.players[i].homeColony = homeColony;
            this.addToBoard(homeColony);

            // if (i == 0) {
            //     this.spawnPlanets([0, 6], [0, 2], [homeColonyCoordsMap[i]]);
            // }

            // if (i == 1) {
            //     this.spawnPlanets([0, 6], [4, 6], [homeColonyCoordsMap[i]]);
            // }

            // buy ships

            this.buyShips(this.players[i]);

        }

        this.turn = 1;
        this.updateSimpleBoard();

    }

    start() {
        this.stopInterval = setInterval(() => this.run(), this.refreshRate); // this.refreshRate is how often this.run() runs (in milliseconds)
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
            console.log(this.players[0].technology);
            console.log(this.players[1].technology);
            this.movementPhase();
            this.combatPhase();
            this.economicPhase();
            this.winner = this.checkForWinner();
            this.turn++;
        } else {
            this.winner = 'Tie';
        }

    }

    endGame() {
        clearInterval(this.stopInterval);
    }

    convertShipToDict(ship) {
        let shipInfo = {};
        for (let key of Object.keys(ship)) {
            shipInfo[key] = ship[key];
        }
        return shipInfo;
    }

    checkForWinner() {

        this.players.filter(player => this.checkForOpponentShips(player.homeColony))
                    .forEach(player => this.removePlayer(player));

        if (this.players.length === 1) return this.players[0].playerNum;
        if (this.players.length === 0) return 'Tie';

    }

    // Phases

    movementPhase() {

        this.log.beginPhase('Movement');

        for (let player of this.players) {
            for (let ship of player.ships) {
                let numMovesPerShip = this.calcNumMovesPerShip(ship.technology["movement"]);
                for (let i = 0; i < numMovesPerShip; i++) {
                    this.moveShip(player, ship);
                }
            }
        }

        this.log.endPhase('Movement');

    }

    combatPhase() {

        this.log.beginPhase('Combat');

        for (let coords of this.getCombatCoords()) {
            
            let combatOrder = this.sortCombatOrder(coords); 
            
            while (this.numPlayersInCombatOrder(combatOrder) > 1) {
                for (let ship of combatOrder) {

                    if (this.numPlayersInCombatOrder(combatOrder) == 1) break;

                    if (this.board[coords[1]][coords[0]].includes(ship)) {
                        
                        let attacker = this.players[ship.playerNum - 1];
                        let target = attacker.strategy.chooseTarget(this.convertShipToDict(ship), combatOrder);
                        let defender = this.players[target.playerNum - 1];
                        this.log.combat(ship, target);
                        
                        assert (ship.hp > 0, 'Aborting... attacker is dead');
                        assert (target.hp > 0, 'Aborting... defender is already dead');

                        if (this.roll(ship, target)) {
                            target.hp -= 1;
                            if (target.hp <= 0) {
                                this.log.shipDestroyed(target);
                                combatOrder.splice(combatOrder.indexOf(target), 1);
                                this.removeFromBoard(target);
                                this.removeShipFromPlayer(defender, target);
                            }
                        }

                        this.updateSimpleBoard();

                    }

                }
            }

        }

        this.log.endPhase('Combat');

    }

    economicPhase() { 
        
        this.log.beginPhase('Economic');

        for (let player of this.players) {
            
            this.log.playerCP(player); // gain cp
            player.cp += this.cpPerRound; 
            this.log.newPlayerCP(player, this.cpPerRound);

            this.maintenance(player); // pay maintenance
            this.log.playerCPAfterMaintenance(player);

            this.buyTech(player); // buy technology
            this.buyShips(player); // buy ships

        }

        this.log.endPhase("Economic");

    }


    // Object Manipulation / Calculation

    addToBoard(obj) {
        let [x, y] = [...obj.coords];
        this.board[y][x].push(obj);
    }

    removeFromBoard(obj) {
        let [x, y] = [...obj.coords];
        let index = this.board[y][x].indexOf(obj);
        this.board[y][x].splice(index, 1); // first parameter sets the array index, second sets how many are removed
    }

    getShipNum(newShipName, player) { // gets new ship num to prevent repeats within 
        player.shipCounter[newShipName] += 1;
        return player.shipCounter[newShipName];
    }

    getNewShip(shipName, i) { // i = player index
    
        let player = this.players[i];
        const shipNum = this.getShipNum(shipName, player);

        for (let shipClass of allShips) {
            if (shipName == shipClass.name) {
                return new shipClass(player.homeColony.coords, i+1, shipNum);
            }
        }

    }

    getSimpleObj(obj) {
        let simpleObj = {};
        for (const [attr, v] of Object.entries(Object.getOwnPropertyDescriptors(obj))) {
            simpleObj[attr] = v.value;
        }
        return simpleObj;
    }

    getAllShips(coords) {
        return this.board[coords[1]][coords[0]].filter(obj => obj.objType === 'Ship' && obj.hp > 0);
    }

    checkForOpponentShips(obj) {
        let ships = this.getAllShips(obj.coords);
        return !ships.every(ship => ship.playerNum === obj.playerNum);
    }

    removeShipFromPlayer(player, ship) {
        let index = player.ships.indexOf(ship);
        player.ships.splice(index, 1);
    }

    removePlayer(player) {
        player.ships.forEach(ship => this.removeFromBoard(ship));
        this.removeFromBoard(player.homeColony);
        this.players.splice(this.players.indexOf(player), 1);
    }


    // Movement

    calcNumMovesPerShip(technologyLevel) {
        let techOddsMap = { 1: 0, 2: 0.25, 3: 0.5, 4: 0.75, 5: 1 };
        return (Math.random() < techOddsMap[technologyLevel]) ? 2 : 1;
    }

    moveShip(player, ship) {

        let oldCoords = [...ship.coords];
        let translations = this.possibleTranslations(ship.coords);
        let translation = player.strategy.chooseTranslation(this.convertShipToDict(ship), translations);            
        let [newX, newY] = this.translate(oldCoords, translation);
        
        if (this.checkForOpponentShips(ship)) return;
        if (newX < 0 || newX > this.boardSize - 1 || newY < 0 || newY > this.boardSize - 1) return;

        this.removeFromBoard(ship);
        ship.coords = [newX, newY];
        this.addToBoard(ship);
        this.log.shipMovement(oldCoords, ship);
        this.updateSimpleBoard();

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


    // Combat

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

    numPlayersInCombatOrder(combatOrder) {
        return (new Set(combatOrder.map(ship => ship.playerNum))).size;
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


    // Economic

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
            this.removeFromBoard(orderedShips[0]);
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

    calcTotalShipCost(ships) {

        let totalCost = 0;

        for (const ship of ships) {
            const [shipName, numShips] = Object.entries(ship)[0];
            for (let i = 0; i < numShips; i++) {
                totalCost += this.calcShipCost(shipName);
            }
        }

        return totalCost;

    }

    calcTotalTechCost(currentTech, newTech) {
        
        let totalCost = 0;
        
        for (let tech of newTech) {

            let techMap = {
                "attack": {
                    0: 20, // +1 attack
                    1: 30, // +2 attack
                    2: 40  // +3 attack
                }, "defense": {
                    0: 20, // +1 defense
                    1: 30, // +2 defense
                    2: 40  // +3 defense
                }, "movement": {
                    1: 20, // 25% chance of moving twice
                    2: 30, // 50% chance of moving twice
                    3: 40, // 75% chance of moving twice
                    4: 50 // 100% chance of moving twice
                }
            }

            let techCost = techMap[tech][currentTech[tech]];
            if (techCost) totalCost += techCost;

        }

        return totalCost;

    }
    
    buyTech(player) {

        // buy technology

        let newTech = player.buyTech(); // list of strings (i.e. ["attack", "defense", etc])
        if (newTech.length == 0) this.log.boughtNothing(player, "technology");

        // pay for technology

        let totalCost = this.calcTotalTechCost(player.technology, newTech);

        if (totalCost > player.cp) {
            this.log.playerWentOverBudget(player, "technology"); // the player gets nothing if they go over budget
            return;
        }

        player.cp -= totalCost;

        // add technology to player

        for (let tech of newTech) {
            player.technology[tech]++;
        }

    }

    buyShips(player) {

        // buy ships

        let playerShips = player.buyShips(); // list of dicts (i.e [{"Scout", 1}, etc])
        if (playerShips.length == 0) this.log.boughtNothing(player, "ships");

        // pay for ships

        let totalCost = this.calcTotalShipCost(playerShips);

        if (totalCost > player.cp) {
            this.log.playerWentOverBudget(player, "ships"); // the player gets nothing if they go over budget
            return;
        }

        player.cp -= totalCost;

        // add ships to player + board

        if (playerShips) {
            for (let ship of playerShips) {
                for (let shipName in ship) {
                    for (let i = 0; i < ship[shipName]; i++) {

                        // get ship object

                        let ship = this.getNewShip(shipName, player.playerNum - 1); // creates a new ship
                        if (!ship) continue;

                        // add technology levels to ship

                        ship.technology = JSON.parse(JSON.stringify(player.technology)); // makes a deepcopy of the technology object
                        ship.atk += ship.technology["attack"];
                        ship.df  += ship.technology["defense"];

                        // add ship to player

                        player.addShip(ship);
                        assert (player.ships.includes(ship), 'Ship was not added to player.ships');

                        // add ship to board

                        this.addToBoard(ship);
                        assert (this.board[ship.coords[1]][ship.coords[0]].includes(ship), 'Ship was not added to board');

                        this.log.buyShip(player, ship);
                        this.updateSimpleBoard();

                    }
                }
            }
        }

        this.log.playerCPRemaining(player);

    }


    // Miscellaneous
    
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

    sum(list) {
        let total = 0;
        for (const elem of list) {
            total += elem;
        }
        return total;
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
                socket.emit('update UI', {
                    board: this.board,
                    logs: this.getLogs(data)
                });
            });
        }
    }

};

export default Game;