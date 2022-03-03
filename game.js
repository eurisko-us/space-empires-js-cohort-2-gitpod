const Ship = require('./ships');
const Player = require('./player');
const Logger = require('./logger.js')


class Game {
    constructor(clientSockets, dimensions, players) {
        this.clientSockets = clientSockets;
        this.dims = dimensions
   
        this.log = new Logger
        this.log.clear()
        this.log.initialize()

        this.board = [];
        this.turn = 0;
        this.players = players
        this.winner = null;
    }

    start() {
        setInterval(() => {

            for(let socketId in this.clientSockets) {
                let socket = this.clientSockets[socketId];

                socket.emit('gameState', { 
                    gameBoard: this.board,
                    gameTurn: this.turn
                });        
            }
        }, 200);  
    }

    checkInBounds(coords){
        x = coords[0]
        y = coords[1]
        x_bound = this.dims[0]
        y_bound = this.dims[1]
        return (x >= 0 && x< x_bound) && (y >= 0 && y< y_bound)
    }

    possibleTranslations(coords){
        options = [[0,0],[0,1],[1,0],[-1,0],[0,-1]]
        translations = []

        for (let option in options) {
            new_coords = [option[0] + coords[0], option[1] + coords[1]]

            if (this.checkInBounds(new_coords)) {
                translations.push(option)
            }
        }

        return translations
    }

    removeFromBoard(obj, coords) {
        let x = coords[0]
        let y = coords[1]

        let index = this.board[y][x].indexOf(obj)

        this.board[y][x].splice(index, 1)
    }

    addToBoard(obj){
        let x = obj.coords[0]
        let y = obj.coords[1]

        this.board[y][x].push(obj)
    }

    initializeGame() {
        //make board
        const x_bound = this.dims[0]
        const y_bound = this.dims[1]

        for(let i = 0; i < x_bound; i++){
            this.board.push([])
            
            for(let j = 0; j < y_bound; j++){
                this.board[i].push([])
            }
        }
        //give ships to players
        for (let i = 0; i<this.players.length; i++) {
            let ship = new Ship([3,6*i])
            this.players[i].addShip(ship)
            this.addToBoard(ship)
        }

    initializeGame() {
        //make board
        //give ships to players
        
    }

    movementPhase() {
        for (let player in this.players) {
            for (let ship in player.ships) {
                old_coords = ship.coords
                
                options = this.possibleTranslations(ship.coords)
                option = player.chooseTranslation(ship, options)
                ship.coords[0] += option[0]
                ship.coords[1] += option[1]
                ship.updateCoords(ship.coords)
                this.addToBoard(ship)
                this.removeFromBoard(ship, old_coords)
            }
        }

        this.turn ++
    }

    checkForWinner() {
        for (let player in this.players) {
            for (let ship in player.ships) {
                if (player.playerNum == 1) {
                    if (ship.coords == [3, 6]) {
                        this.winner = 1
                    }
                }
                
                if (player.playerNum == 2) {
                    if (ship.coords == [3, 0]) {
                        this.winner = 2
                    }
                }
            
            }
        }

        this.log.begin_phase('Movement')
        let orig_coords = this.ships[0].coords 
        this.ships[0].coords[1] += 1
        
        this.log.ship_movement(orig_coords, this.ships[0].coords)

        this.log.end_phase('Movement')

    }

    run(maxTurns) {
        this.initializeGame()
        for(let i = 0; i < maxTurns; i++){
            if (this.checkForWinner() == null){
                this.movementPhase()
            }
        }

        if (this.winner == null) {
            this.winner = "Tie"
        for(let i = 0; i<numTurns; i++){
            this.log.turn(i+1)
            this.movementPhase()
            this.turn ++;
        }
    }

    getRandomInteger(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);

        return Math.floor(Math.random() * (max - min + 1) + min);
    }
};

module.exports = Game;
