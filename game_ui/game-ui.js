const socket = io();

let board;
let logs;

let gameHasStarted = false;

let boardHTML;
let logsHTML;
let gameInfoHTML;
let squareInfoHTML;

let consoleHTML;

let startGameButton;
let nextTurnButton;
let runGameAutomaticallyButton;

socket.on('initialize game', () => {

    document.getElementById("console").innerHTML += '<br>initialize game start';
    
    document.getElementById("startGame").addEventListener("click", () => {
        if (!gameHasStarted) {
            document.getElementById("console").innerHTML += '<br>start game button is clicked';
            socket.emit('start game');
            gameHasStarted = true;
        }
    });
    
    updateElementsById();
    createBoard();
    createEventListeners();

    document.getElementById("console").innerHTML += '<br>initialize game end';
});

socket.on('state', (data) => {
    board = data.board;
    logs = data.logs;
    updateUI();
});

// function initializeUI() {
//     updateElementsById();
//     createBoard();
//     createEventListeners();
// }

function updateUI() {
    updateElementsById();
    resetBoard();
    updateObjType('Ship', ['red', 'blue'], 'P');
    updateObjType('Colony', ['#ff8080', '#a080ff'], 'PC');
    updateLogs();
}

function updateElementsById() {

    boardHTML      = document.getElementById("board");
    logsHTML       = document.getElementById("logs");
    gameInfoHTML   = document.getElementById("gameInfo");
    squareInfoHTML = document.getElementById("squareInfo");
    
    consoleHTML = document.getElementById("console");

    startGameButton            = document.getElementById("startGame");
    nextTurnButton             = document.getElementById("nextTurn");
    runGameAutomaticallyButton = document.getElementById("runGameAutomatically");

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

function createEventListeners() {
    
    boardHTML.addEventListener('click', e => {
        if (gameHasStarted) updateSquareInfo(e.target.cellIndex, e.target.parentElement.rowIndex);
    });

    // startGameButton.addEventListener("click", () => {
    //     if (!gameHasStarted) {
    //         consoleHTML.innerHTML += '<br>start game button is clicked';
    //         socket.emit('start game');
    //         gameHasStarted = true;
    //     }
    // });

    nextTurnButton.addEventListener("click", () => {
        if (gameHasStarted) {
            consoleHTML.innerHTML += '<br>next turn button is clicked';
            // socket.emit('next turn');
        }
    });

    runGameAutomaticallyButton.addEventListener("click", () => {
        if (gameHasStarted) {
            consoleHTML.innerHTML += '<br>run game automatically button is clicked';
            // socket.emit('run game automatically');
        }
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

function updateSquareInfo(x, y) {
    squareInfoHTML.innerHTML = `Ships on coordinate (${x}, ${y}):<br><br>`;
    for (let obj of board[y][x]) {
        if (obj.objType == 'Ship') {
            squareInfoHTML.innerHTML += `${obj.shipId}<br>`;
        }
    }
}