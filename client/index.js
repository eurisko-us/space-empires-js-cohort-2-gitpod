/*

    Current bugs:
    
    - the hexagons are only in a 7 by 7 grid if the window is the right size
    - board is not vertically OR horizontally centered
    - board isn't always cleared when the game is ended

*/

const socket = io();

const NUM_HEXAGONS = 49;
const INVIS_CHAR = "‎";

let game;
let gameIsStarted = false;

let hexagonHTMLs;
let logsHTML;
let squareInfoHTML;
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

    updateObjType('Ship', ['#FF0000', '#0000FF'], 'Ship');
    updateObjType('Colony', ['#FF8080', '#89CFF0'], 'HC');
    updateObjType('Planet', ['#008000', '#008000'], 'Planet');

    updateLogs();

});

function updateElementsById() {
    hexagonHTMLs = document.getElementsByClassName("hexagon");
    logsHTML = document.getElementById("logs");
    squareInfoHTML = document.getElementById("squareInfo");
    inputTextHTML = document.getElementById("inputText");
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
        hexagonHTML.firstChild.innerHTML = INVIS_CHAR;
    }
}

function createEventListeners() {
    
    for (let hexagonHTML of hexagonHTMLs) {
        hexagonHTML.addEventListener("click", _ => {
            if (gameIsStarted) {
                updateSquareInfo(hexagonHTML.id);
            }
        });
    }

    document.getElementById("initGame").addEventListener("click", () => {
        if (!gameIsStarted) {
            socket.emit('initialize game');
            gameIsStarted = true;
        }
    });

    document.getElementById("endGame").addEventListener("click", () => {
        if (gameIsStarted) {

            socket.emit('end game');

            updateElementsById();
            resetBoard();

            logsHTML.innerHTML = '';
            squareInfoHTML.innerHTML = '';
            gameIsStarted = false;

        }
    });

    document.getElementById("nextTurn").addEventListener("click", () => {
        if (gameIsStarted) {
            socket.emit('next turn');
        }
    });

    document.getElementById("autoRun").addEventListener("click", () => {
        if (gameIsStarted) {
            socket.emit('auto run');
        }
    });

    document.getElementById("inputForm").addEventListener('submit', (e) => {

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

function updateObjType(objType, colors, text) {

    for (let hexagonHTML of hexagonHTMLs) {
        
        let [x, y] = convertIDtoCoords(hexagonHTML.id);

        for (let obj of game.board[y][x]) {
            if (obj.objType === objType) {
                let colorIndex = (objType == "Planet") ? 0 : (game.board[y][x][0].playerNum - 1);
                hexagonHTML.style.backgroundColor = colors[colorIndex];
                hexagonHTML.firstChild.innerHTML = text;
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

        squareInfoHTML.innerHTML += `<strong>${obj.id}</strong>`;

        if (obj.objType == 'Ship') {
            squareInfoHTML.innerHTML += `: 
                hp: ${obj.hp}, 
                attack: ${obj.atk}, 
                defense: ${obj.df}, 
                cp cost: ${obj.cpCost}, 
                maintenance cost: ${obj.maintCost}
            `;
        }
        
        else if (obj.objType == 'Colony') {
            squareInfoHTML.innerHTML += `: hp: ${obj.hp}`;
        }

        squareInfoHTML.innerHTML += `<br>`;

    }

}