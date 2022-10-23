## How to run a game
- app.js file is where the game will be run unless you are doing tests
- game class requires clientSockets and strategies as parameters
    - If you are running node app.js, clientSockets is already defined in the file. If you are writing tests, put null for the clientSockets input
    - strategies is a list of 2 strategies
- game.run() will run a single turn of the game, but will only show in log.txt but not have a display on another tab
- game.start() will run the full game, default maxTurns is 1000 and will have a display in another tab

## What are the main classes/groups of interacting functions and how they get used
- 

## I/O formatting
- In strategy.buyShips(), it returns a list of dictionaries of the ships you want. i.e [{"Scout": 1}, {"Destroyer": 2}], do not include ships you don't want. If you don't want to buy any ships, return []
- Name new strategy files as functionStrat, and the class name as FunctionStrat, where function is the function of the strategy (this convention can be deviated in special circumstances)

## What are the next things we should implement

- make input player
- make it so you are able to choose strategies from game UI