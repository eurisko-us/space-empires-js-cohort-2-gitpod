const socket = io();
let turn = 0;

socket.on('gameState', (data) => {
    updateUI(data.gameState);
});

function updateUI(gameState) {
    let board = gameState.board;
    updateBoard(board);            
}

function updateBoard(board) {

    let logs = {
        "purple": [0, []],
        "orange": [0, []],
        "yellow": [0, []],
        "green" : [0, []]
    }

    // turn counter

    const turnCounter = document.getElementById("turn");
    turnCounter.innerHTML = `turn: ${turn}`;
    turn++;

    // board

    let boardTable = document.getElementById('board');

    // if board is empty, fill board with empty cells

    if (boardTable.rows.length == 0) {

        for(let i = 0; i < board.numRows; i++) {
            let row = boardTable.insertRow();

            for(let j = 0; j < board.numCols; j++) {

                let cell = row.insertCell();
                cell.className = 'boardSpace';
                cell.innerHTML = '';
                cell.style.backgroundColor = 'gray';

            }
        }

    } else { // if board is not empty, update board

        for(let i = 0; i < board.numRows; i++) {
            let row = boardTable.rows[i];

            for(let j = 0; j < board.numCols; j++) {

                let cell = row.cells[j];
                cell.innerHTML = '';
                
                let spaceValue = board.spaces[i][j];
                let updateLogs = false;

                if ((i < 2 || i >= board.numRows - 2) && (j < 2 || j >= board.numCols - 2)) {

                    cell.style.backgroundColor = 'black';

                } else if (spaceValue === 1) {

                    cell.style.backgroundColor = 'orange';
                    cell.innerHTML = 'O';
                    updateLogs = true;

                } else if (spaceValue === 2)  {

                    cell.style.backgroundColor = 'purple';
                    cell.innerHTML = 'P';
                    updateLogs = true;

                } else if (spaceValue === 3)  {

                    cell.style.backgroundColor = 'yellow';
                    cell.innerHTML = 'Y';
                    updateLogs = true;

                } else if (spaceValue === 4)  {

                    cell.style.backgroundColor = 'green';
                    cell.innerHTML = 'G';
                    updateLogs = true;

                } else {

                    cell.style.backgroundColor = 'gray';
                }

                if (updateLogs) {
                    logs[cell.style.backgroundColor][0]++;
                    logs[cell.style.backgroundColor][1].push(` (${j}, ${i})`);
                }

            }
        }

    }

    // logs

    const logsHTML = document.getElementById("logs");
    logsHTML.innerHTML = '';

    for (const color in logs) {
        logsHTML.innerHTML += `${logs[color][0]} ${color} boxes: ${logs[color][1]} <br>`;
    }

}