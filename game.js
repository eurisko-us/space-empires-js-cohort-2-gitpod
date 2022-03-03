const Logger = require('./logger.js')

class Ship {
    constructor(coords) {
        this.coords = coords;
    }
};

class Game {
    constructor(clientSockets) {
        this.clientSockets = clientSockets;

        this.log = new Logger
        this.log.clear()

        this.log.initialize()

        this.board = [];

        for(let i = 0; i < 7; i++){
            this.board.push([])
            
            for(let j = 0; j < 7; j++){
                this.board[i].push([])
            }
        }
        this.ships = []
    }

    start() {
        setInterval(() => {
            this.state = this.generateRandomGameState();

            for(let socketId in this.clientSockets) {
                let socket = this.clientSockets[socketId];

                socket.emit('gameState', { 
                    gameState: this.state
                });        
            }
        }, 200);  
    }

    initializeGame() {
        //make board
        //give ships to players
        let board = []

        for(let i = 0; i < board.numRows; i++) {
            for(let j = 0; j < board.numCols; j++) {
                board[j][i] = [];
            }
        }
        
        this.ships.push(new Ship([3,0]))
    }

    movementPhase() {
        this.log.begin_phase('Movement')
        let orig_coords = this.ships[0].coords 
        this.ships[0].coords[1] += 1
        
        this.log.ship_movement(orig_coords, this.ships[0].coords)

        this.log.end_phase('Movement')

    }

    run(numTurns) {
        this.initializeGame()
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
