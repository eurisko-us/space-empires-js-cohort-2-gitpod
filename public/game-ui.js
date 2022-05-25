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

    if (boardHTML.rows.length === 0) createBoard();
    
    resetBoard();
    updateObjType('Ship', ['red', 'blue'], 'P');
    updateObjType('Colony', ['#ff8080', '#a080ff'], 'PC');
    // updateTurn();
    updateLogs();

}

function createBoard() {
    for (let i = 0; i < board.length; i++) {
        let row = boardHTML.insertRow();
        for (let j = 0; j < board.length; j++) {
            let cell = row.insertCell();
            cell.className = 'cell';
            cell.style.backgroundColor = 'gray';
        }
    }
}

function updateObjType(objType, colors, innerHTML) {

    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
            for (let obj of board[j][i]) {
                if (obj.objType === objType) {

                    let shipColorMap = {
                        1: colors[0],
                        2: colors[1]
                    }

                    let shipNum = board[j][i][0].playerNum;
                    let cell = boardHTML.rows[j].cells[i];

                    cell.style.backgroundColor = shipColorMap[shipNum];
                    cell.innerHTML = `${innerHTML}${shipNum}`;

                }
            }
        }
    }

}

function resetBoard() {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
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