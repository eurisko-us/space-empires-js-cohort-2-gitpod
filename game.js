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
        setInterval(() => this.run(), 100); //second number sets delay
    }

    checkInBounds(coords) {
        let [x, y] = [coords[0], coords[1]];
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
        let [x, y] = [obj.coords[0], obj.coords[1]];
        let index = this.board[y][x].indexOf(obj);
        this.board[y][x].splice(index, 1); //first sets array index, second sets how many are removed from there
    }

    addToBoard(obj) {
        let [x, y] = [obj.coords[0], obj.coords[1]];
        this.board[y][x].push(obj);
    }

    initializeGame() {

        // make board

        for(let i = 0; i < this.boardSize; i++){
            this.board.push([]);
            for(let j = 0; j < this.boardSize; j++){
                this.board[i].push([]);
            }
        }

        for (let i = 0; i < this.players.length; i++) {
            //if more players added, need to change the stuff dependent on i
            
            // ships
            let ship = new Scout([3,6*i], i+1, 1);
            this.players[i].addShip(ship);
            this.addToBoard(ship);

            let cruiser = new Cruiser([3,6*i], i+1, 1);
            this.players[i].addShip(cruiser);
            this.addToBoard(cruiser);

            // home colony

            let homeColony = new Colony([3,6*i], i+1);
            this.players[i].homeColony = homeColony;
            this.addToBoard(homeColony);

        }

    }

    movementPhase() {

        this.log.beginPhase('Movement');

        for (let player of this.players) {
            for (let ship of player.ships) {

                let oldCoords = [...ship.coords]; //more or less creates a copy of the array
                let options = this.possibleTranslations(ship.coords);
                let option = player.chooseTranslation(ship, options);
                
                this.removeFromBoard(ship);
                
                ship.coords[0] += option[0];
                ship.coords[1] += option[1];
                this.log.shipMovement(oldCoords, ship);

                ship.updateCoords(ship.coords);
                this.addToBoard(ship);
                
            }
        }

        this.log.endPhase('Movement');

    }

    isAShip(obj) {
        return obj instanceof ships.Ship; 
        //child classes are an instance of the parent, this is checking if the object passed is a of the ship class
    }

    getAllShips(coords) {
        return this.board[coords[1]][coords[0]].filter(elem => this.isAShip(elem));
    }

    checkForOpponentShips(obj) {
        //for (let elem of this.board[obj.coords[1]][obj.coords[0]]) {
        for (let elem of this.getAllShips(obj.coords)) {
            if (elem.playerNum != obj.playerNum) {
                return true;
            }
        }
    }
    
    removePlayer(player) {

        for(let ship of player.ships) {
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

        if(this.players.length == 1) {
            return this.players[0].playerNum;
        }
        if(this.players.length == 0) return 'Tie';

    }

    getLogs(data) {

        let decoder = new TextDecoder("utf-8");
        let decodedData = decoder.decode(data);

        let logs = [];
        let currentLine = '';
        let turn = [];

        for(let i = 0; i < decodedData.length; i++) {
            
            let letter = decodedData[i];
            
            if (letter == '\n') {
                turn.push(currentLine);
                currentLine = '';
            } else {
                currentLine += letter;
            }

            if (letter == 'T' && decodedData[i+1] == 'u' && decodedData[i+2] == "r" && decodedData[i+3] == "n" || i == decodedData.length-1) {
                //if you don't add that 'end letter' section, it doesn't write the final turn as there is no "turn" afterwards
                logs.push(turn);
                turn = [];
            }

        }
        
        return logs;

    }

    display() {

        for(let socketId in this.clientSockets) {
            let socket = this.clientSockets[socketId];
            
            fs.readFile('log.txt', (err, data) => {                
                socket.emit('gameState', { 
                    gameBoard: this.board,
                    gameTurn: this.turn,
                    gameLogs: this.getLogs(data)
                });
            });

        }
    }

    run() {
        this.display()
        
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