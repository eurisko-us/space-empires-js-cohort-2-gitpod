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
    updateShips();
    //updateTurn();
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

    resetBoard();

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

function placeColonies() {
    
    for(let i = 0; i < board.length; i++) {
        for(let j = 0; j < board.length; j++) {
            for(let obj of board[j][i]) {
                if (obj.objType == "Colony") {

                    let colonyColorMap = {
                        1: 'red',
                        2: 'blue'
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
    placeColonies();
}

function updateTurn() {
    turnHTML.innerHTML = `turn: ${turn}`;

    //var scrollbox = document.getElementById('scrollbox');

    // Create some element, e.g. div
    //var newElement = document.createElement('div');
    //newElement.innerHTML = 'New element has been added!';

    //scrollbox.appendChild(newElement);
}

function updateLogs() {
    logsHTML.innerHTML = '';
    for (let turn of logs.reverse()) {
        for (let line of turn) {
            logsHTML.innerHTML += `  ${line}<br>`;
        }
    }
}