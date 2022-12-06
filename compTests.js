import AntonStrat from './competitionStrategies/antonStrat.js'
import CaydenStrat from "./competitionStrategies/caydenStrat.js";
import JustinStrat from "./competitionStrategies/justinStrat.js";
import WilliamStrat from "./competitionStrategies/williamStrat.js";
import Game from "./src/game.js";

const players1 = [new AntonStrat(), new JustinStrat()]
const players2 = [new JustinStrat(), new AntonStrat()]
const game = new Game(null, players2)
game.initializeGame()
game.start()