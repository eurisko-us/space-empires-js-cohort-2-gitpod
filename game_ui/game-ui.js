const socket = io();

let board;
let logs;

socket.on('gameState', (data) => {
    board = data.gameBoard;
    logs = data.gameLogs;
    updateUI();
});

let boardHTML;
let logsHTML;
let infoHTML;

let clicked = null;

function updateUI() {

    boardHTML = document.getElementById("board");
    logsHTML  = document.getElementById("logs");
    infoHTML  = document.getElementById("info");

    if (boardHTML.rows.length === 0) {
        createBoard();
        createEventListener();
    }
    
    resetBoard();
    updateObjType('Ship', ['red', 'blue'], 'P');
    updateObjType('Colony', ['#ff8080', '#a080ff'], 'PC');
    updateLogs();

    if (clicked) updateInfo();

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

function createEventListener() {

    boardHTML.addEventListener('click', e => {
        clicked = [
            e.target.parentElement.rowIndex,
            e.target.cellIndex
        ];
    });

}

function updateObjType(objType, colors, innerHTML) {

    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
            for (let obj of board[j][i]) {
                if (obj.objType === objType) {

                    let shipNum = board[j][i][0].playerNum;
                    let cell = boardHTML.rows[j].cells[i];

                    cell.style.backgroundColor = colors[shipNum - 1];
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
}

function updateLogs() {
    logsHTML.innerHTML = '';
    for (let turn of logs.reverse()) {
        for (let line of turn) {
            logsHTML.innerHTML += `  ${line}<br>`;
        }
    }
}

function updateInfo() {
    const [y, x] = clicked;
    infoHTML.innerHTML = `Ships on coordinate (${x}, ${y}):<br><br>`;
    for (let obj of board[y][x]) {
        if (obj.objType == 'Ship') {
            infoHTML.innerHTML += `${obj.shipId}<br>`;
        }
    }
}