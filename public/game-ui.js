const socket = io();

let board;
let turn;
let logs;

socket.on('gameState', (data) => {
    board = data.gameBoard;
    turn = data.gameTurn;
    logs = data.gameLogs;
    updateUI();
});

let boardHTML;
let turnHTML;
let logsHTML;

function updateUI() {

    boardHTML = document.getElementById("board");
    turnHTML  = document.getElementById("turn");
    logsHTML  = document.getElementById("logs");

    if (boardHTML.rows.length === 0) { createBoard(); }
    
    resetBoard();
    updateShips();
    updateColonies();
    // updateTurn();
    updateLogs();

}

function createBoard() {

    for(let i = 0; i < board.length; i++) {

        let row = boardHTML.insertRow();

        for(let j = 0; j < board.length; j++) {
        
            let cell = row.insertCell();
            cell.className = 'cell';
            cell.style.backgroundColor = 'gray';

        }
    }

}

function updateShips() {

    for(let i = 0; i < board.length; i++) {
        for(let j = 0; j < board.length; j++) {
            for(let obj of board[j][i]) {
                if (obj.objType == "Ship") {

                    let shipColorMap = {
                        1: 'red',
                        2: 'blue'
                    }

                    let shipNum = board[j][i][0].playerNum;
                    let cell = boardHTML.rows[j].cells[i];

                    cell.style.backgroundColor = shipColorMap[shipNum];
                    cell.innerHTML = `P${shipNum}`;

                }
            }
        }
    }

}

function updateColonies() {
    
    for(let i = 0; i < board.length; i++) {
        for(let j = 0; j < board.length; j++) {
            for(let obj of board[j][i]) {
                if (obj.objType == "Colony") {

                    let colonyColorMap = {
                        1: '#ff8080',
                        2: '#a080ff'
                    }

                    let colonyNum = board[j][i][0].playerNum;
                    let cell = boardHTML.rows[j].cells[i];

                    cell.style.backgroundColor = colonyColorMap[colonyNum];
                    cell.innerHTML = `PC${colonyNum}`;

                }
            }

        }
    }
}

function resetBoard() {
    for(let i = 0; i < board.length; i++) {
        for(let j = 0; j < board.length; j++) {
            let cell = boardHTML.rows[i].cells[j];
            cell.style.backgroundColor = 'gray';
            cell.innerHTML = '';
        }
    }
};

function updateTurn() {
    turnHTML.innerHTML = `turn: ${turn}`;
}

function updateLogs() {
    logsHTML.innerHTML = '';
    for (let turn of logs.reverse()) {
        for (let line of turn) {
            logsHTML.innerHTML += `  ${line}<br>`;
        }
    }
}