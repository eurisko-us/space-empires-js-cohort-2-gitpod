const Ship = require('./ships');
const Player = require('./player');

class Game {
    constructor(clientSockets, dimensions, players) {
        this.clientSockets = clientSockets;
        this.dims = dimensions
        this.board = [];
        this.turn = 0
        this.players = players
        this.winner = null;
    }

    start() {
        setInterval(() => {
            this.state = this.generateRandomGameState();

            for(let socketId in this.clientSockets) {
                let socket = this.clientSockets[socketId];

                socket.emit('gameState', { 
                    gameBoard: this.board,
                    gameTurn: this.turn
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

    addShipToBoard(ship){
        x = ship.coords[0]
        y = ship.coords[1]

        this.board[y][x].push(ship)
    }

    initializeGame() {
        //make board
        x_bound = this.bounds[0]
        y_bound = this.bounds[1]

        for(let i = 0; i < x_bound; i++){
            this.board.push([])
            
            for(let j = 0; j < y_bound; j++){
                this.board[i].push([])
            }
        }
        //give ships to players
        for (let i = 0; i<this.players.length; i++) {
            this.players[i].addShip(new Ship([3,6*i]))
            this.addShipToBoard(ship)
        }
        
    }

    movementPhase() {
        for (let player in this.players) {
            for (let ship in player.ships) {
                player.chooseTranslation()
            }
        }

        this.turn ++
    }

    checkForWinner() {
        for (let player in this.players) {
            for (let ship in player.ships) {
                if (player.playerNum === 1) {
                    if (ship.coords === [6, 3]) {
                        this.winner = 1
                    }
                
                if (player.playerNum === 2) {
                    if (ship.coords === )
                }

                }
            }
        }
    }

    run(numTurns) {
        this.initializeGame()
        for(let i = 0; i < numTurns; i++){
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
