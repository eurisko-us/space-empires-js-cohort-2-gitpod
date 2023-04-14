const socket = io();

const NUM_HEXAGONS = 49;
const INVIS_CHAR = "‎";

let game;
let gameIsStarted = false;

let hexagonHTMLs;
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
    (hexagonHTMLs.length == 0) ? createBoard() : resetBoard();
    createEventListeners();
});

socket.on('update UI', (gameState) => {
    game = gameState;
    updateElementsById();
    resetBoard();
    updateObjType('Ship', ['red', 'blue'], 'Ship');
    updateObjType('Colony', ['#ff8080', '#a080ff'], 'HC');
    updateLogs();
});

function updateElementsById() {

    hexagonHTMLs   = document.getElementsByClassName("hexagon");
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
    for (let i = 0; i < NUM_HEXAGONS; i++) {
        
        let hexagonDiv = document.createElement("div");
        hexagonDiv.classList.add("hexagon");
        hexagonDiv.id = i + 1;

        let textDiv = document.createElement("div");
        textDiv.classList.add("hexagonText");
        textDiv.innerHTML = INVIS_CHAR;

        hexagonDiv.appendChild(textDiv);
        document.getElementById("container").appendChild(hexagonDiv);
    
    }
}

function resetBoard() {
    for (let hexagonHTML of hexagonHTMLs) {
        hexagonHTML.style.backgroundColor = 'black';
        hexagonHTML.innerHTML = INVIS_CHAR;        
    }
}

function createEventListeners() {
    
    for (let hexagonHTML of hexagonHTMLs) {
        hexagonHTML.addEventListener("click", e => {
            if (gameIsStarted) updateSquareInfo(hexagonHTML.id);
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

    for (let hexagonHTML of hexagonHTMLs) {
        
        let [x, y] = convertIDtoCoords(hexagonHTML.id);

        for (let obj of game.board[y][x]) {
            if (obj.objType === objType) {
                hexagonHTML.style.backgroundColor = colors[game.board[y][x][0].playerNum - 1];
                hexagonHTML.firstChild.innerHTML = innerHTML;
            }
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

function convertIDtoCoords(id) {
    x = (id - 1) % 7;
    y = Math.floor((id - 1) / 7);
    return [x, y];
}

function updateSquareInfo(id) {

    let [x, y] = convertIDtoCoords(id);
    squareInfoHTML.innerHTML = `Objects on coordinate (${x}, ${y}):<br><br>`;
    
    for (let obj of game.board[y][x]) {

        squareInfoHTML.innerHTML += `<strong>${obj.id}</strong>: hp: ${obj.hp}`;

        if (obj.objType == 'Ship') {
            squareInfoHTML.innerHTML += `, attack: ${obj.atk}, defense: ${obj.df}, cp cost: ${obj.cpCost}, maintenance cost: ${obj.maintCost}`;
        }

        squareInfoHTML.innerHTML += `<br>`;

    }

}