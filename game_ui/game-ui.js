const socket = io();

let game;
let gameIsStarted = false;

let boardHTML;
let logsHTML;
let squareInfoHTML;

let initGameButton;
let nextTurnButton;
let autoRunButton;
let endGameButton;

let promptTextHTML;
let errorTextHTML;
let inputFormHTML;
let inputTextHTML;

socket.on('initialize UI', () => {
    updateElementsById();
    (boardHTML.rows.length === 0) ? createBoard() : resetBoard();
    createEventListeners();
});

socket.on('update UI', (gameState) => {
    game = gameState;
    updateElementsById();
    resetBoard();
    updateObjType('Ship', ['red', 'blue'], 'Ship');
    updateObjType('Colony', ['#ff8080', '#a080ff'], 'Home Colony');
    updateLogs();
});

function updateElementsById() {

    boardHTML      = document.getElementById("board");
    logsHTML       = document.getElementById("logs");
    squareInfoHTML = document.getElementById("squareInfo");
    
    initGameButton = document.getElementById("initGame");
    endGameButton  = document.getElementById("endGame");
    nextTurnButton = document.getElementById("nextTurn");
    autoRunButton  = document.getElementById("autoRun");

    promptTextHTML = document.getElementById("promptText");
    errorTextHTML  = document.getElementById("errorText");
    inputFormHTML  = document.getElementById("inputForm");
    inputTextHTML  = document.getElementById("inputText");

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

    inputFormHTML.addEventListener('submit', (e) => {

        if (gameIsStarted) {

            console.log(inputTextHTML.value);

            e.preventDefault();
            updateElementsById();

            if (inputTextHTML.value !== '') {
                socket.emit('submit input', inputTextHTML.value);
                inputTextHTML.value = '';
                errorText.innerHTML = '';
            } else {
                errorText.innerHTML = 'You must input something!';
            }

        }
    });

}

function updateObjType(objType, colors, innerHTML) {

    for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 7; j++) {
            for (let obj of game.board[j][i]) {
                if (obj.objType === objType) {

                    let shipNum = game.board[j][i][0].playerNum;
                    let cell = boardHTML.rows[j].cells[i];

                    cell.style.backgroundColor = colors[shipNum - 1];
                    cell.innerHTML = `${innerHTML}`;

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
    for (let turn of game.logs.reverse()) {
        for (let line of turn) {
            logsHTML.innerHTML += `  ${line}<br>`;
        }
    }
}

function updateSquareInfo(x, y) {
    squareInfoHTML.innerHTML = `Objects on coordinate (${x}, ${y}):<br><br>`;
    for (let obj of game.board[y][x]) {

        squareInfoHTML.innerHTML += `<strong>${obj.id}</strong>: hp: ${obj.hp}`;

        if (obj.objType == 'Ship') {
            squareInfoHTML.innerHTML += `, attack: ${obj.atk}, defense: ${obj.df}, cp cost: ${obj.cpCost}, maintenance cost: ${obj.maintCost}`;
        }

        squareInfoHTML.innerHTML += `<br>`;

    }
}