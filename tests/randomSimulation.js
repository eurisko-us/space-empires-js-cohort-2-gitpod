const Game = require('../game');
const Player = require('../player');
const Strategy = require('../strategy');
const players = [new Player(1, new Strategy()), new Player(2, new Strategy())];



let date = new Date()
let currTime = date.getMinutes()
let endTime = (currTime + 5) % 60

while (currTime < endTime) {
    const game = new Game(clientSockets=null, players, {'Scout': 1});
    game.initializeGame();
    game.run()

    date = new Date()
    currTime = date.getMinutes()
}

console.log('Success')