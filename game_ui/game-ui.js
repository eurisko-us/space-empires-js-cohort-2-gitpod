const socket = io();

let state;
let gameIsStarted = false;

let boardHTML;
let logsHTML;
let gameInfoHTML;
let squareInfoHTML;

let initGameButton;
let nextTurnButton;
let autoRunButton;
let endGameButton;

socket.on('initialize UI', () => {
    updateElementsById();
    (boardHTML.rows.length === 0) ? createBoard() : resetBoard();
    createEventListeners();
});

socket.on('state', (gameState) => {
    state = gameState;
    updateElementsById();
    resetBoard();
    updateObjType('Ship', ['red', 'blue'], 'P');
    updateObjType('Colony', ['#ff8080', '#a080ff'], 'PC');
    updateLogs();
});

function updateElementsById() {

    boardHTML      = document.getElementById("board");
    logsHTML       = document.getElementById("logs");
    gameInfoHTML   = document.getElementById("gameInfo");
    squareInfoHTML = document.getElementById("squareInfo");
    
    initGameButton = document.getElementById("initGame");
    endGameButton  = document.getElementById("endGame");
    nextTurnButton = document.getElementById("nextTurn");
    autoRunButton  = document.getElementById("autoRun");

}

function createBoard() {
    for (let i = 0; i < 7; i++) {
        let row = boardHTML.insertRow();
        for (let j = 0; j < 7; j++) {
            let cell = row.insertCell();
            cell.className = 'cell';
            cell.style.backgroundColor = 'gray';
        }
    }
}

function createEventListeners() {
    
    for (const cell of document.getElementsByClassName('cell')) {
        cell.addEventListener('click', e => {
            if (gameIsStarted) updateSquareInfo(e.target.cellIndex, e.target.parentElement.rowIndex);
        });
    }

    initGameButton.addEventListener("click", () => {
        if (!gameIsStarted) {
            socket.emit('initialize game');
            gameIsStarted = true;
        }
    });

    endGameButton.addEventListener("click", () => {
        if (gameIsStarted) {
            
            updateElementsById();
            resetBoard();

            logsHTML.innerHTML = '';
            squareInfoHTML.innerHTML = '';
            gameIsStarted = false;

            socket.emit('end game');

        }
    });

    nextTurnButton.addEventListener("click", () => {
        if (gameIsStarted) {
            socket.emit('next turn');
        }
    });

    autoRunButton.addEventListener("click", () => {
        if (gameIsStarted) {
            socket.emit('auto run');
        }
    });

}

function updateObjType(objType, colors, innerHTML) {

    for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 7; j++) {
            for (let obj of state.board[j][i]) {
                if (obj.objType === objType) {

                    let shipNum = state.board[j][i][0].playerNum;
                    let cell = boardHTML.rows[j].cells[i];

                    cell.style.backgroundColor = colors[shipNum - 1];
                    cell.innerHTML = `${innerHTML}${shipNum}`;

                }
            }
        }
    }

}

function resetBoard() {
    for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 7; j++) {
            let cell = boardHTML.rows[i].cells[j];
            cell.style.backgroundColor = 'gray';
            cell.innerHTML = '';
        }
    }
}

function updateLogs() {
    logsHTML.innerHTML = '';
    for (let turn of state.logs.reverse()) {
        for (let line of turn) {
            logsHTML.innerHTML += `  ${line}<br>`;
        }
    }
}

function updateSquareInfo(x, y) {
    squareInfoHTML.innerHTML = `Ships on coordinate (${x}, ${y}):<br><br>`;
    for (let obj of state.board[y][x]) {
        if (obj.objType == 'Ship') {
            squareInfoHTML.innerHTML += `${obj.shipId}<br>`;
        }
    }
}