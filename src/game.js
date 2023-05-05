import fs from 'fs';
import assert, { throws } from 'assert';
import { allShips } from './ships.js';
import Player from './player.js';
import Colony from './colony.js';
import Logger from './logger.js';
import Planet from './planet.js'

class Game {
    
    constructor(clientSockets, strategies, refreshRate=200, maxTurns=1000, cpPerRound=10) {
        
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
        this.planets = []
        this.winner = null;

        this.boardRange = [...Array(this.boardSize).keys()];
        this.allCoords = [...this.boardRange.flatMap(y => this.boardRange.map(x => [x, y]))];
        
        // state based stuff
        this.playerTurn = 0;
        this.currentPart = null;
        this.playerInput = '';
        this.phase = null;
        this.timesMvmt = 0;
        this.shipMoves = 0;
        this.loggedCombatCoords = [];

    }

    // Initializing and running the game

    initializeGame() {

        // create board

        for (let i = 0; i < this.boardSize; i++) {
            this.board.push([]);
            for (let j = 0; j < this.boardSize; j++) {
                this.board[i].push([]);
            }
        }

        const planetRanges = {
            0: [[0, 1, 2], [0, 1, 2]],
            1: [[0, 1, 2], [4, 5, 6]],
            2: [[4, 5, 6], [0, 1, 2]],
            3: [[4, 5, 6], [4, 5, 6]]
        };

        for (let i = 0; i < 4; i++) {
            this.spawnPlanets(planetRanges[i][0], planetRanges[i][1]);
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
            this.players[i].aliveColonies.push(homeColony);
            this.addToBoard(homeColony);

        }

        this.turn = 1;
        this.updateSimpleBoard();

    }

    start() {
        // this.refreshRate is how often this.run() runs (in milliseconds)
        if (!this.stopInterval) {
            this.stopInterval = setInterval(() => this.run(), this.refreshRate);
        }
    }

    run() {

        this.display();

        if (this.winner) {
            this.log.playerWin(this.winner);
            this.endGame();
            return;
        }

        if (this.phase == null) {
            this.log.turn(this.turn);
            this.phase = 'econ';
        }

        else if (this.phase == 'econ') this.economicPhase();
        else if (this.phase == 'mvmt') this.movementPhase();
        else if (this.phase == 'combat') this.combatPhase();

        if (this.phase == null) {
            this.turn++;
            this.winner = this.checkForWinner();
        }

        if (!this.winner && this.turn >= this.maxTurns) {
            this.winner = 'Tie';
        }

    }

    endGame() {
        clearInterval(this.stopInterval);
        this.stopInterval = null;
    }

    checkForWinner() {

        this.players.filter(player => this.checkForOpponentShips(player.homeColony))
                    .forEach(player => this.removePlayer(player));

        if (this.players.length === 1) return this.players[0].playerNum;
        if (this.players.length === 0) return 'Tie';

    }

    // Phases

    movementPhase() {

        if (this.playerTurn > 1) {
            this.log.endPhase('Movement');
            this.playerTurn = 0;
            this.currentPart = null;
            this.playerInput = '';
            this.phase = 'combat';
            return;
        }

        if (this.currentPart == null) {
            this.log.beginPhase('Movement');
            this.currentPart = 0; // tracks ship by list index
            this.timesMvmt = 0; // tracks how many times a ship moved
            this.shipMoves = 0;
        }

        let player = this.players[this.playerTurn];
        let ship = player.ships[this.currentPart];

        if (!ship){
            this.currentPart = 0;
            this.playerTurn++;
            this.playerInput = '';
            return;
        }

        if (this.shipMoves == 0) {
            this.shipMoves = this.calcNumMovesPerShip(ship.technology["movement"]);
        }

        if (this.timesMvmt < this.shipMoves) {
            this.moveShip(player, ship);
            this.timesMvmt++;
        } else {
            this.timesMvmt = 0;
            this.shipMoves = 0
            this.playerInput = '';
            this.currentPart++;
        }

    }
    
    combatPhase() {

        if (this.currentPart == null) {
            this.log.beginPhase('Combat');
            this.currentPart = 0;
        }

        let combat = this.getCombatCoords()[0];

        if (!combat) {
            this.loggedCombatCoords = [];
            this.log.endPhase('Combat');
            this.uncolonizePlanets();
            this.playerTurn = 0;
            this.currentPart = null;
            this.phase = null;
            return;
        }

        if (!this.checkIfCoordInList(combat, this.loggedCombatCoords)) {
            this.log.combatHappening(combat);
            this.loggedCombatCoords.push(combat);
        }

        let combatOrder = this.sortCombatOrder(combat);

        if (this.currentPart == null || combatOrder.indexOf(this.currentPart) == -1) {
            this.currentPart = combatOrder[0];
        }

        let ship = this.currentPart;

        if (ship.name == "ColonyShip") {
            let id = combatOrder.indexOf(this.currentPart) + 1;
            this.currentPart = (id >= combatOrder.length) ? combatOrder[0] : combatOrder[id];
            return;
        }

        let attacker = this.players[ship.playerNum - 1];
        let target;

        if (attacker.isManual) {
            // Do manual stuff!
            // this.displayText(`Player ${this.playerTurn}: Please select a target for ${ship_id}`)
            target = attacker.strategy.chooseTarget(this.convertShipToDict(ship), combatOrder);
        } else {
            target = attacker.strategy.chooseTarget(this.convertShipToDict(ship), combatOrder);
        }

        let defender = this.players[target.playerNum - 1];
        this.log.combat(ship, target);

        assert(ship.hp > 0, 'Aborting... attacker is dead');
        assert(target.hp > 0, 'Aborting... defender is already dead');

        if (this.roll(ship, target)) {
            target.hp -= 1;
            if (target.hp <= 0) {
                this.log.shipDestroyed(target);
                this.removeFromBoard(target);
                this.removeShipFromPlayer(defender, target);
            }
        }

        this.updateSimpleBoard();

        let id = combatOrder.indexOf(this.currentPart) + 1;
        this.currentPart = (id >= combatOrder.length) ? combatOrder[0] : combatOrder[id];

    }

    economicPhase() { 
        
        this.display();

        if (this.playerTurn > 1) {
            this.log.endPhase('Economic');
            this.playerTurn = 0;
            this.currentPart = null;
            this.phase = 'mvmt';
            return;
        }

        let player = this.players[this.playerTurn];

        if (this.currentPart == null) {
            this.log.beginPhase('Economic');
            this.createColonies();
            this.currentPart = 'pay';
        }

        if (this.currentPart == 'pay') {
            this.log.playerCP(player); // gain cp
            player.cp += this.cpPerRound; 
            this.log.newPlayerCP(player, this.cpPerRound);
            this.currentPart = 'maint';
        }

        if (this.currentPart == 'maint') {

            if (player.isManual) {
                // Do manual stuff!
                this.maintenance(player); // pay maintenance
            } else {
                this.maintenance(player);
            }

            this.currentPart = 'buyTech';

        }

        if (this.currentPart == 'buyTech') {
            
            if (player.isManual) {
                // Do manual stuff!
                // Must buy ALL tech at once
                this.buyTech(player);
            } else{
                this.buyTech(player);
            }

            this.currentPart = 'buyShips';

        }

        if (this.currentPart == 'buyShips') {
            
            if (player.isManual) {
                // Do manual stuff!
                // Must buy ALL ships at once
                this.buyShips(player);
            } else {
                this.buyShips(player);
            }

            this.playerTurn++;
            this.currentPart = 'pay';
        }

    }

    // Object Manipulation / Calculation

    spawnPlanets(xOptions, yOptions) {
        let newPlanetCoords = [this.randomChoice(xOptions), this.randomChoice(yOptions)];
        let newPlanet = new Planet(newPlanetCoords, this.planets.length + 1);
        this.planets.push(newPlanet);
        this.addToBoard(newPlanet);
        this.log.spawnedPlanet(newPlanet);
    }

    convertShipToDict(ship) {
        let shipInfo = {};
        for (let key of Object.keys(ship)) {
            shipInfo[key] = ship[key];
        }
        return shipInfo;
    }

    checkForDefendingUnits(colonizedPlanet) {
        for (let ship of this.getAllShips(colonizedPlanet.coords)) {
            if (ship.name != "ColonyShip") {
                return true;
            }
        }
        return false;
    }

    uncolonizePlanets() {
    
        for (let planet of this.planets) {
            if (planet.colony) {
                for (let ship of this.getAllShips(planet.coords)) {
                    if (ship.name != "ColonyShip" && ship.playerNum != planet.colony.playerNum) {
                    
                        let player = this.players[planet.colony.playerNum - 1];
                        
                        let index = player.aliveColonies.indexOf(planet.colony);
                        player.aliveColonies.splice(index, 1);
                        
                        planet.colony = null;
                        planet.updateId();
                        this.log.uncolonizedPlanet(planet);
                        
                    }
                }
            }
        }
        
    }

    createColonies() {
    
        for (let planet of this.planets) {

            let x = planet.coords[0];
            let y = planet.coords[1];
            
            for (let obj of this.board[y][x]) {
                if (obj.name == "ColonyShip" && planet.colony == null) {
                
                    let newColony = new Colony([...obj.coords], obj.playerNum, false);
                    let player = this.players[obj.playerNum - 1];
                    
                    newColony.setColonyId(player.allColonies.length + 1);
                    planet.colony = newColony;
                    planet.updateId();
                    
                    player.aliveColonies.push(newColony);
                    player.allColonies.push(newColony);
                    
                    this.addToBoard(newColony);
                    this.log.madeColony(player, planet);
                    
                    this.removeFromBoard(obj);
                    this.removeShipFromPlayer(this.players[obj.playerNum - 1], obj);
                    
                }
            }  
        }
        
    }

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
        player.shipCounter[newShipName]++;
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

        // Coords work [column, row]

        let oldCoords = [...ship.coords];
        let translations = this.possibleTranslations(ship.coords);
        let translation;

        if (player.isManual) {
            // Do manual stuff!
            // this.displayText(`Player ${this.playerTurn}: Please type move for ship`)
            translation = player.strategy.chooseTranslation(this.convertShipToDict(ship), translations); 
        } else {
            translation = player.strategy.chooseTranslation(this.convertShipToDict(ship), translations);
        }
           
        let [newX, newY] = this.translate(oldCoords, translation);

        // Need to make a log for ships that can't move!

        if (!this.canShipMove(ship)) {
            this.currentPart++;
            return;
        }

        if (newX < 0 || newX > this.boardSize - 1 || newY < 0 || newY > this.boardSize - 1) {
            this.currentPart++;
            return;
        }

        this.removeFromBoard(ship);
        ship.coords = [newX, newY];
        this.addToBoard(ship);
        this.log.shipMovement(oldCoords, ship);
        this.updateSimpleBoard();

    }

    checkInBounds(coords) {
        return coords.every(coord => this.boardRange.includes(coord));
    }

    possibleTranslations(coords) {
        
        let allTranslations = [[0,0], [0,1], [1,0], [-1,0], [0,-1]];
        
        if (coords[1] % 2 == 0) {
            allTranslations.push([-1, 1]);
            allTranslations.push([-1, -1]);
        } else {
            allTranslations.push([1, 1]);
            allTranslations.push([1, -1]);
        }

        return allTranslations.filter(t => this.checkInBounds(this.translate(t, coords)));
    
    }

    canShipMove(ship) {
        let ships = this.getAllShips(ship.coords);
        // let filteredShips = ships.filter(ship => ship.name != "ColonyShip");
        if (!ships.every(otherShip => otherShip.playerNum === ship.playerNum)) {
            this.log.shipCantMove(ship);
            return false;
        }
        return true;
    }

    // Combat
    
    checkForCombat(coords) {
    
        let ships = this.getAllShips(coords);
        if (ships.length == 0) return false;

        let xs = Array.from(new Set(ships.map(ship => ship.name)));
        let ys = new Set(["ColonyShip"]);

        if (xs.size === ys.size && xs.every(x => ys.has(x))) return false;
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
        let playerNums = [];
        for (let ship of combatOrder) {
            playerNums.push(ship.playerNum);
        }
        return (new Set(playerNums)).size;
        // return (new Set(combatOrder.map(ship => ship.playerNum))).size;   
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

    calcMaintCost(ships) {
        const maintCosts = ships.map((ship) => ship.maintCost);
        return this.sum(maintCosts);
    }

    maintenance(player) {

        let totalCost = this.calcMaintCost(player.ships);
        
        let shipList = [];
        for (let ship of player.ships) {
            shipList.push(this.getSimpleObj(ship));
        }
        
        let orderedShips = player.strategy.maintOrder(shipList);

        while (totalCost > player.cp) {
            
            this.log.shipIsNotMaintained(player, orderedShips[0]);
            this.removeFromBoard(orderedShips[0]);
            assert (!(this.board[orderedShips[0].coords[1]][orderedShips[0].coords[0]].includes(orderedShips[0])), 'Ship lost to maintenance is still on the board');
            
            orderedShips.shift();
            totalCost = this.calcMaintCost(orderedShips);
        
        }

        player.cp -= totalCost;
        this.log.playerCPAfterMaintenance(player);

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
    
    checkIfCoordInList(inputCoord, coordList) {
        for (let coord of coordList) {
            if (coord[0] == inputCoord[0] && coord[1] == inputCoord[1]) {
                return true;
            }
        }

        return false;
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

    sum(list) {
        let total = 0;
        for (const elem of list) {
            total += elem;
        }
        return total;
    }
    
    randomChoice(list) {
        return list[Math.floor(Math.random() * list.length)];
    }
    
    translate(x, y) {
        return x.map((_, i) => x[i] + y[i]);
    }
    
    // Logs & Display

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
            let data = fs.readFileSync('log.txt');	             	
            socket.emit('update UI', {	
                board: this.board,	
                logs: this.getLogs(data)
            });
        }
    }

};

export default Game;