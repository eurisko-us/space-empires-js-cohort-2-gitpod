let fs = require('fs');
const Ship = require('./ships');
const Player = require('./player');
const Logger = require('./logger.js');

class Game {

    constructor(clientSockets, dimensions, players, maxTurns) {

        this.clientSockets = clientSockets;
        this.dims = dimensions;
        this.maxTurns = maxTurns;
   
        this.log = new Logger();
        this.log.clear();
        this.log.initialize();

        this.board = [];
        this.turn = 0;
        this.players = players;
        this.winner = null;
        this.logs = null;

    }

    start() {
        setInterval(() => this.run(), 1000);
    }

    checkInBounds(coords) {
        let x = coords[0];
        let y = coords[1];
        let x_bound = this.dims[0];
        let y_bound = this.dims[1];
        return (0 <= x && x < x_bound) && (0 <= y && y < y_bound);
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

    removeFromBoard(obj, coords) {
        let x = coords[0];
        let y = coords[1];
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
        const x_bound = this.dims[0];
        const y_bound = this.dims[1];

        for(let i = 0; i < x_bound; i++){
            this.board.push([]);
            for(let j = 0; j < y_bound; j++){
                this.board[i].push([]);
            }
        }

        // give ships to players
        for (let i = 0; i < this.players.length; i++) {
            let ship = new Ship([3,6*i], 1);
            this.players[i].addShip(ship);
            this.addToBoard(ship);
        }

    }

    movementPhase() {

        this.log.begin_phase('Movement');

        for (let player of this.players) {
            for (let ship of player.ships) {

                let old_coords = [...ship.coords];
                let options = this.possibleTranslations(ship.coords);
                let option = player.chooseTranslation(ship, options);

                ship.coords[0] += option[0];
                ship.coords[1] += option[1];
                this.log.ship_movement(old_coords, ship.coords, ship.playerNum, ship.shipNum)

                ship.updateCoords(ship.coords);
                this.addToBoard(ship);
                this.removeFromBoard(ship, old_coords);

            }
        }

        this.log.end_phase('Movement');

    }

    checkForWinner() {

        for (let player of this.players) {
            for (let ship of player.ships) {

                if (player.playerNum == 1) {
                    if (ship.coords == [3, 6]) {
                        this.winner = 1;
                    }
                }
                
                if (player.playerNum == 2) {
                    if (ship.coords == [3, 0]) {
                        this.winner = 2;
                    }
                }
            
            }
        }

    }

    getLogs(data) {

        let logs = [];
        let currentLine = '';

        for (let letter of data) {
            if (letter == '\n') {
                logs.push(currentLine);
                currentLine = '';
            } else {
                currentLine += letter;
            }
        }

        return logs;

    }

    run() { // only 1 turn for game-ui connection purposes

        for(let socketId in this.clientSockets) {
            let socket = this.clientSockets[socketId];

            fs.readFile('log.txt', (err, data) => {

                let encoder = new TextDecoder("utf-8");
                this.logs = this.getLogs(encoder.decode(data));
                
                socket.emit('gameState', { 
                    gameBoard: this.board,
                    gameTurn: this.turn,
                    gameLogs: this.logs
                });

            });

        }

        this.checkForWinner();

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