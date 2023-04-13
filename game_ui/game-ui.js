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
        for (let j = 0; j < 8; j++) {
            
            let cell = row.insertCell();
            cell.className = 'cell';
            
            if (isBlank(i, j)) {
                cell.style.backgroundColor = "d9d9d9";
            } else {
                cell.style.backgroundColor = "black";
            }

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

function isBlank(i, j) {
    let modifiedIndex = j - i%2;
    return modifiedIndex == -1 || modifiedIndex == 7;
}

// function boardToUICoords(x, y) {
//     return [x, y + x%2];
// }

// function UIToBoardCoords(i, j) {
//     return [i, j - i%2];
// }

function updateObjType(objType, colors, innerHTML) {

    for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 7; j++) {
            for (let obj of game.board[j][i]) {
                if (obj.objType === objType) {

                    // let x, y = boardToUICoords(i, j);
                    let x = i; // 
                    let y = j; //
                    let shipNum = game.board[i][j][0].playerNum;
                    let cell = boardHTML.rows[x].cells[y];

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
            // let x, y = boardToUICoords(i, j);
            let x = i; // 
            let y = j; //
            let cell = boardHTML.rows[x].cells[y];
            cell.style.backgroundColor = 'gray';
            cell.innerHTML = '';
        }
    }
}

function updateLogs() {
    logsHTML.innerHTML = '';
    for (let turn of game.logs.reverse()) {
        for (let line of turn.reverse()) {
            logsHTML.innerHTML += `  ${line}<br>`;
        }
    }
}

function updateSquareInfo(i, j) {

    // let x, y = UIToBoardCoords(i, j);
    let x = i; // 
    let y = j; //

    squareInfoHTML.innerHTML = `Objects on coordinate (${x}, ${y}):<br><br>`;
    for (let obj of game.board[y][x]) {

        squareInfoHTML.innerHTML += `<strong>${obj.id}</strong>: hp: ${obj.hp}`;

        if (obj.objType == 'Ship') {
            squareInfoHTML.innerHTML += `, attack: ${obj.atk}, defense: ${obj.df}, cp cost: ${obj.cpCost}, maintenance cost: ${obj.maintCost}`;
        }

        squareInfoHTML.innerHTML += `<br>`;

    }
}

/*

<!DOCTYPE html>
<html>
<head>

<style>

.main {
  display: flex;
  --size: 100px;
  --margin: 4px;
  --gradient: calc(var(--size) * 1.732 + 4 * var(--margin) - 1px); 
}

.container {
  font-size: 0;
}

.container div {
  width: var(--size);
  margin: var(--margin);
  height: calc(var(--size) * 1.1547);
  display: inline-block;
  clip-path: polygon(0% 25%, 0% 75%, 50% 100%, 100% 75%, 100% 25%, 50% 0%);
  margin-bottom: calc(var(--margin) - var(--size) * 0.2886);
}

.container::before {
  content: "";
  width: calc(var(--size)/2 + var(--margin));
  float: left;
  height: 100%;
  shape-outside: repeating-linear-gradient(#0000 0 calc(var(--gradient) - 3px), #000 0 var(--gradient));
}

.hexagon {
  background-color: black;
}

</style>

</head>
<body>

<div class="main">
  <div class="container">
    <div class="hexagon"></div>
    <div class="hexagon"></div>
    <div class="hexagon"></div>
    <div class="hexagon"></div>
    <div class="hexagon"></div>
    <div class="hexagon"></div>
    <div class="hexagon"></div>
    <div class="hexagon"></div>
  </div>
</div>

</body>
</html>


*/