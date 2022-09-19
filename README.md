## How to run a game
- node.js file is where the game will be run unless you are doing tests
- game class requires clientSockets and strategies as parameters
    - If you are running node app.js, clientSockets is already defined in the file. If you are writing tests, put null for the clientSockets input
    - strategies is a list of 2 strategies
    - initialShips is a dictionary {"Ship name": Number of this type of ship you want}
- game.run() will run a single turn of the game, but will only show in log.txt but not have a display on another tab
- game.start() will run the full game, default maxTurns is 1000 and will have a display in another tab

## What are the main classes/groups of interacting functions and how they get used
-

## How does game UI work
-

## What are the next things we should implement

- write tests for random strategy
- make input player
- get rid of initialShips
- rearrange game file so methods are in order of use
- make sure simpleBoard is fully/correctly implemented
- add all of maia's comments
- update UI
    - make game look better (because now we'll have multiple ships in one coord, which don't all show up currently)
    - make logs update on time (instead of 1 or more turns late)