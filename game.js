import { readFile } from 'fs';
import Player from './player.js';
import { Scout, BattleCruiser, Battleship, Cruiser, Destroyer, Dreadnaught } from './ships.js';
import Colony from './colony.js';
import Logger from './logger.js';

class Game {

    constructor(clientSockets, strategies, initialShips, boardSize=7, maxTurns=1000, refreshRate=1000) {

        this.clientSockets = clientSockets;
        this.initialShips = initialShips;
        this.boardSize = boardSize;
        this.maxTurns = maxTurns;
        this.refreshRate = refreshRate;
   
        this.strategies = strategies;
        this.players = [...Object.entries(this.strategies)].map(strategy => new Player(...strategy));

        this.log = new Logger();
        this.log.clear();
        this.log.initialize();

        this.board = [];
        this.turn = 0;
        this.winner = null;

        this.boardRange = [...Array(this.boardSize).keys()];
        this.allCoords = this.boardRange.flatMap(y => this.boardRange.map(x => [x, y]));

    }

    start() {
        setInterval(this.run(), this.refreshRate);
    }

    translate(x, y) {
        return [x[0] + y[0], x[1] + y[1]];
    }

    checkInBounds(coords) {
        return coords.every(coord => this.boardRange.includes(coord));
    }

    possibleTranslations(coords) {
        let allTranslations = [[0,0], [0,1], [1,0], [-1,0], [0,-1]];
        return allTranslations.filter(t => this.checkInBounds(this.translate(t, coords)));
    }

    removeObjFromBoard(obj) {
        let [x, y] = obj.coords;
        let index = this.board[y][x].indexOf(obj);
        this.board[y][x].splice(index, 1);
    }

    addToBoard(obj) {
        let [x, y] = obj.coords;
        this.board[y][x].push(obj);
    }

    getNewShip(shipName, i) {
        if (shipName === 'Scout') return new Scout([3,6*i], i+1, 1);
        if (shipName === 'BattleCruiser') return new BattleCruiser([3,6*i], i+1, 1);
        if (shipName === 'Battleship') return new Battleship([3,6*i], i+1, 1);
        if (shipName === 'Cruiser') return new Cruiser([3,6*i], i+1, 1);
        if (shipName === 'Destroyer') return new Destroyer([3,6*i], i+1, 1);
        if (shipName === 'Dreadnaught') return new Dreadnaught([3,6*i], i+1, 1);
    }

    initializeGame() {

        // make board

        for (let i = 0; i < this.boardSize; i++) {
            this.board.push([]);
            for (let j = 0; j < this.boardSize; j++) {
                this.board[i].push([]);
            }
        }

        for (let i = 0; i < this.players.length; i++) {
            
            // ships

            for (const [shipName, numOfShip] of Object.entries(this.initialShips)) {
                for (let j = 0; j < numOfShip; j++) {
                    let ship = this.getNewShip(shipName, i);
                    ship.setShipId();
                    this.players[i].addShip(ship);
                    this.addToBoard(ship);
                }
            }

            // home colony

            let homeColony = new Colony([3,6*i], i+1);
            homeColony.isHomeColony = true;
            this.players[i].homeColony = homeColony;
            this.addToBoard(homeColony);

        }

        this.updateSimpleBoard();

    }

    makeSimple(obj) {
        let attributes = {};
        for (const [attr, v] of Object.entries(Object.getOwnPropertyDescriptors(obj))) {
            attributes[attr] = v.value;
        }
        return attributes;
    }

    updateSimpleBoard() {

        let simpleBoard = [];

        for (let i = 0; i < this.boardSize; i++) {
            simpleBoard.push([]);
            for (let j = 0; j < this.boardSize; j++) {
                simpleBoard[i] = this.board[j][i].map(obj => makeSimple(obj));
            }
        }

        for (let player of this.players) {
            player.strategy.simpleBoard = simpleBoard;
            player.strategy.turn = this.turn;
        }

    }

    movementPhase() {

        this.log.beginPhase('Movement');

        for (let player of this.players) {
            for (let ship of player.ships) {

                let oldCoords = [...ship.coords];
                let translations = this.possibleTranslations(ship.coords);
                let translation = player.strategy.chooseTranslation(onlyAttributesOfObj(ship), translations);            
                let newCoords = this.translate(oldCoords, translation);

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

        let combatCoords = this.getCombatCoords();

        for (let coords of combatCoords) {

            let combatOrder = this.sortCombatOrder(coords);
            let simpleCombatOrder = combatOrder.map(ship => makeSimple(ship));

            while (this.checkForOpponentShips(coords)) {

                for (let ship of combatOrder) {
                    if (this.board[coords[1]][coords[0]].includes(ship)) {

                        let player = this.players[ship.playerNum - 1];
                        let target = player.strategy.chooseTarget(makeSimple(ship), simpleCombatOrder);
                        this.log.combat(ship, target);

                        if (this.roll(ship, target)) {
                            target.hp -= 1;
                            if (target.hp <= 0) {
                                this.log.shipDestroyed(target);
                                this.removeObjFromBoard(ship);
                                this.removeShipFromPlayer(player, ship);
                            }
                        }

                        this.updateSimpleBoard();

                    }
                }

            }

        }

        this.log.endPhase('Combat');

    }

    getAllShips(coords) {
        return this.board[coords[1]][coords[0]].filter(elem => elem.objType === 'Ship');
    }

    checkForOpponentShips(coords) {
        let objs = this.getAllShips(coords);
        return !objs.some(obj => obj.playerNum !== objs[0].playerNum);
    }

    getCombatCoords() {
        return this.allCoords.filter(coords => this.checkForOpponentShips(coords));
    }

    sortCombatOrder(coords) {
        let combatOrder = [...this.board[coords[1]][coords[0]]];
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

    checkForWinner() {

        this.players.filter(player => this.checkForOpponentShips(player.homeColony.coords))
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
            
            if (decodedData.slice(i, i+4) === 'Turn' || i === decodedData.length - 1) {
                logs.push(turn);
                turn = [];
            }
            
            if (decodedData[i] === '\n') {
                turn.push(currentLine);
                currentLine = '';
            } else {
                currentLine += decodedData[i];
            }

        }
        
        return logs;

    }

    display() {
        for (let socketId in this.clientSockets) {
            let socket = this.clientSockets[socketId];
            readFile('log.txt', (err, data) => {
                socket.emit('gameState', { 
                    gameBoard: this.board,
                    gameTurn: this.turn,
                    gameLogs: this.getLogs(data)
                });
            });
        }
    }

    run() {

        this.display();
        if (this.winner) return;

        if (this.turn < this.maxTurns && !this.winner) {
            this.log.turn(this.turn);
            this.movementPhase();
            this.combatPhase();
            this.winner = this.checkForWinner();
            this.turn++;
        }
        
        if (this.turn > this.maxTurns) this.winner = 'Tie';
        if (this.winner) this.log.playerWin(this.winner);

    }

    getRandomInteger(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    
};

export default Game;