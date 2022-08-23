## How to run a game
- node.js file is where the game will be run unless you are doing tests
- game class requires clientSockets, players, and initialShips as inputs
  - If you are running node app.js, clientSockets is already defined in the file. If you are writing tests, put null for the clientSockets input
  - players is a list of 2 players, which each require a strategy as an input
  - initialShips is a dictionary {"Ship name": Number of this type of ship you want}
 - game.run() will run a single turn of the game, but will only show in log.txt but not have a display on another tab
 - game.start() will run the full game, default maxTurns is 1000 and will have a display in another tab


## What are the main classes/groups of interacting functions and how they get used
-

## How does game UI work
-

## What are the next things we should implement
-
