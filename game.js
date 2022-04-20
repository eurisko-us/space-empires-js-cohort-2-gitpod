let fs = require('fs');
const ships = require('./ships');
const Scout = ships.Scout;
const BattleCruiser = ships.BattleCruiser;
const Battleship = ships.Battleship;
const Cruiser = ships.Cruiser;
const Destroyer = ships.Destroyer;
const Dreadnaught = ships.Dreadnaught;
const Player = require('./player');
const Colony = require('./colony');
const Logger = require('./logger.js');

class Game {

    constructor(clientSockets, boardSize, players, maxTurns) {

        this.clientSockets = clientSockets;
        this.boardSize = boardSize;
        this.maxTurns = maxTurns;
   
        this.log = new Logger();
        this.log.clear();
        this.log.initialize();

        this.board = [];
        this.turn = 0;
        this.players = players;
        this.winner = null;

    }

    start() {
        setInterval(() => this.run(), 1000);
    }

    checkInBounds(coords) {
        let x = coords[0];
        let y = coords[1];
        return (0 <= x && x < this.boardSize) && (0 <= y && y < this.boardSize);
    }

    possibleTranslations(coords) {

        let options = [[0,0], [0,1], [1,0], [-1,0], [0,-1]];
        let translations = [];

        for (let option of options) {
            let newCoords = [option[0] + coords[0], option[1] + coords[1]];
            if (this.checkInBounds(newCoords)) {
                translations.push(option);
            }
        }

        return translations;

    }

    removeFromBoard(obj) {
        let x = obj.coords[0];
        let y = obj.coords[1];
        let index = this.board[y][x].indexOf(obj);
        this.board[y][x].splice(index, 1);
    }

    addToBoard(obj) {
        let x = obj.coords[0];
        let y = obj.coords[1];
        this.board[y][x].push(obj);
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

            let ship = new Scout([3,6*i], i+1, 1);
            this.players[i].addShip(ship);
            this.addToBoard(ship);

            let cruiser = new Cruiser([3,6*i], i+1, 1);
            this.players[i].addShip(cruiser);
            this.addToBoard(cruiser);

            // home colony

            let homeColony = new Colony([3,6*i], i+1);
            homeColony.isHomeColony = true;
            this.players[i].homeColony = homeColony;
            this.addToBoard(homeColony);

        }

        this.updateBoardInStrategy();

    }

    updateBoardInStrategy() {
        for (let player of this.players) {
            player.strategy.board = this.board;
            player.strategy.turn = this.turn;
        }
    }

    movementPhase() {

        this.log.beginPhase('Movement');

        for (let player of this.players) {
            for (let ship of player.ships) {

                let oldCoords = [...ship.coords];
                let options = this.possibleTranslations(ship.coords);
                let option = player.strategy.chooseTranslation(ship, options);
                
                this.removeFromBoard(ship);
                
                ship.coords[0] += option[0];
                ship.coords[1] += option[1];
                this.log.shipMovement(oldCoords, ship.coords, ship.playerNum, ship.name, ship.shipNum);

                ship.updateCoords(ship.coords);
                this.addToBoard(ship);

                this.updateBoardInStrategy();
                
            }
        }

        this.log.endPhase('Movement');

    }

    isAShip(obj) {
        return obj instanceof Scout 
            || obj instanceof BattleCruiser
            || obj instanceof Battleship
            || obj instanceof Cruiser
            || obj instanceof Destroyer
            || obj instanceof Dreadnaught;
    }

    getAllShips(coords) {
        return this.board[coords[1]][coords[0]].filter(elem => this.isAShip(elem));
    }

    checkForOpponentShips(obj) {
        for (let elem of this.board[obj.coords[1]][obj.coords[0]]) {
            if (this.isAShip(elem) && elem.playerNum != obj.playerNum) {
                return true;
            }
        }
    }
    
    removePlayer(player) {

        for (let ship of player.ships) {
            this.removeFromBoard(ship);
        }

        this.removeFromBoard(player.homeColony);

        let index = this.players.indexOf(player);
        this.players.splice(index, 1);

    }

    checkForWinner() {

        for (let player of this.players) {
            if (this.checkForOpponentShips(player.homeColony)) {
                this.removePlayer(player);
            }
        }

        if(this.players.length == 1) return this.players[0].playerNum;
        if(this.players.length == 0) return 'Tie';

    }

    getLogs(data) {

        let decoder = new TextDecoder("utf-8");
        let decodedData = decoder.decode(data);

        let logs = [];
        let currentLine = '';
        let turn = [];

        for (let i = 0; i < decodedData.length; i++) {
            
            let letter = decodedData[i];

            if (letter == 'T' && decodedData[i+1] == 'u' && decodedData[i+2] == "r" && decodedData[i+3] == "n") {
                logs.push(turn);
                turn = [];
            }
            
            if (letter == '\n') {
                turn.push(currentLine);
                currentLine = '';
            } else {
                currentLine += letter;
            }

        }
        
        return logs;

    }

    run() {

        for (let socketId in this.clientSockets) {
            let socket = this.clientSockets[socketId];
            
            fs.readFile('log.txt', (err, data) => {                
                socket.emit('gameState', { 
                    gameBoard: this.board,
                    gameTurn: this.turn,
                    gameLogs: this.getLogs(data)
                });
            });

        }

        this.winner = this.checkForWinner();

        if (this.turn < this.maxTurns) {
            if (!this.winner) {
                this.log.turn(this.turn);
                this.movementPhase();
                this.turn++;
            }
        } else if (!this.winner) {
            this.winner = "Tie";
        }
        
    }

    getRandomInteger(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    
};

module.exports = Game;