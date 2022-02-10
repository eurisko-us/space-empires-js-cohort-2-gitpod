const socket = io();

socket.on('gameState', (data) => {
    updateUI(data.gameState);
});

function updateUI(gameState) {
    let board = gameState.board;
    updateBoard(board);            
}

let turn = 0;

function updateBoard(board) {

    let numBoxes = {
        numPurpleBoxes: 0,
        numGreenBoxes: 0,
        numOrangeBoxes: 0,
        numYellowBoxes: 0
    };
    let boxesCoords = {
        purpleBoxesCoords: [],
        greenBoxesCoords: [],
        orangeBoxesCoords: [],
        yellowBoxesCoords: []
    }

    // turn counter

    let turnCounter = document.getElementById('turn counter');
    if (turnCounter) {
        document.body.removeChild(turnCounter);
    }

    turnCounter = document.createElement("div");
    turnCounter.id = 'turn counter';
    document.body.appendChild(turnCounter);

    turnCounter.textContent = `turn: ${turn}`
    turn++;

    // Delete board table if it already exists because we're just going to recreate it
    let boardTable = document.getElementById('board');
    if (boardTable) {
        document.body.removeChild(boardTable);
    }

    boardTable = document.createElement('table');
    boardTable.id = 'board';
    document.body.appendChild(boardTable);

    for(let i = 0; i < board.numRows; i++) {
        let row = boardTable.insertRow();

        for(let j = 0; j < board.numCols; j++) {
            let spaceValue = board.spaces[i][j];

            let cell = row.insertCell();
            cell.className = 'boardSpace';

            let coords = [i, j];
            // let coords = `(${i}, ${j})`;

            if ((i < 2 || i >= board.numRows - 2) && (j < 2 || j >= board.numCols - 2)) {

                cell.style.backgroundColor = 'black';

            } else if (spaceValue === 1) {

                cell.style.backgroundColor = 'orange';
                cell.textContent = 'O';
                numBoxes.numOrangeBoxes += 1;
                boxesCoords.orangeBoxesCoords.push(coords);

            } else if (spaceValue === 2)  {

                cell.style.backgroundColor = 'purple';
                cell.textContent = 'P';
                numBoxes.numPurpleBoxes += 1;
                boxesCoords.purpleBoxesCoords.push(coords);

            } else if (spaceValue === 3)  {

                cell.style.backgroundColor = 'yellow';
                cell.textContent = 'Y';
                numBoxes.numYellowBoxes += 1;
                boxesCoords.yellowBoxesCoords.push(coords);

            } else if (spaceValue === 4)  {

                cell.style.backgroundColor = 'green';
                cell.textContent = 'G';
                numBoxes.numGreenBoxes += 1;
                boxesCoords.greenBoxesCoords.push(coords);

            } else {

                cell.style.backgroundColor = 'gray';
            }

        }
    }

    // logs
    
    let numBoxesLog = document.getElementById('numBoxesLog');
    if (numBoxesLog) {
        document.body.removeChild(numBoxesLog);
    }
    numBoxesLog = document.createElement("div");
    numBoxesLog.id = 'numBoxesLog';
    document.body.appendChild(numBoxesLog);
    numBoxesLog.textContent = JSON.stringify(numBoxes);

    // for (const [key, value] of Object.entries(numBoxes)) {
    //     numBoxesLog.textContent += `${key}: ${value} `;
    // }

    let boxesCoordsLog = document.getElementById('boxesCoordsLog');
    if (boxesCoordsLog) {
        document.body.removeChild(boxesCoordsLog);
    }
    boxesCoordsLog = document.createElement("div");
    boxesCoordsLog.id = 'boxesCoordsLog';
    document.body.appendChild(boxesCoordsLog);
    boxesCoordsLog.textContent = JSON.stringify(boxesCoords);

}