
class Ship {
    constructor(coords) {
        this.coords = coords;
    }
};

class Game {
    constructor(clientSockets) {
        this.clientSockets = clientSockets;

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

    // generateRandomGameState() {
    //     let board = {
    //         numRows: 20,
    //         numCols: 20,
    //         spaces: []
    //     };

    //     board.spaces = new Array(board.numRows);
    //     for(let i = 0; i < board.numRows; i++) {
    //         board.spaces[i] = new Array(board.numCols);
    //     }

    //     for(let i = 0; i < board.numRows; i++) {
    //         for(let j = 0; j < board.numCols; j++) {        
    //             let r = this.getRandomInteger(1, 20);
    //             board.spaces[i][j] = r;
    //         }
    //     }    

    //     let gameState = {
    //         board
    //     };

    //     return gameState;
    // }

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
        this.ships[0].coords[1] += 1 
    }

    run(numTurns) {
        this.initializeGame()
        for(let i = 0; i<numTurns; i++){
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

