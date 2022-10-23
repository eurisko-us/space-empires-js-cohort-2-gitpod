import { nullInstances } from '../src/ships.js';
import ParentStrat from './parentStrat.js';
// import promptSync from 'prompt-sync';
// const prompt = promptSync();

class InputStrat extends ParentStrat {
    
    constructor(clientSockets) {
        super(ParentStrat);
        this.clientSockets = clientSockets;
    }

    chooseTranslation(ship, translations) {

        console.log('\n\n');
        console.log(`${ship.shipId} is at ${ship.coords}`);
        console.log(`Possible movements are Check The Damn Board`);

        let translation = this.getInputTranslation(ship, translations);
        if (translations.find(el => this.sameArray(translation, el)) == undefined) {
            console.log('That doesnt work, turn forfeit');
            return [0, 0];
        }

        return translation;

    }

    sameArray(array1, array2) {
        for (let i = 0; i < array1.length; i++) {
            if (array1[i] != array2[i]) {
                return false;
            }
        }
        return true;
    }

    getInputFromUI(inputText, errorText, successFunction) {

        let waitingForInput = true;
        let input;

        while (waitingForInput) {

            document.getElementById("inputText").innerHTML = inputText;
            
            for (let socketId in this.clientSockets) {
                let socket = this.clientSockets[socketId];
                socket.on("send input", (inputFromUI) => {

                    if (waitingForInput) {

                        try {
                            waitingForInput = false;
                            input = successFunction(inputFromUI);
                        } catch {
                            waitingForInput = true;
                            document.getElementById("errorText").innerHTML = errorText;
                        }

                        if (input == 'input again') {
                            waitingForInput = true;
                            document.getElementById("errorText").innerHTML = errorText;
                        }

                    }

                });
            }

        }

        return input;

    }

    getInputTranslation() {

        let inputMap = {
            'up':    [0, -1],
            'down':  [0, 1],
            'left':  [-1, 0],
            'right': [1, 0],
            'stay':  [0, 0],
        };

        // let input = prompt("Pick a direction (up, down, left, right, stay) : ");

        return this.getInputFromUI(
            "Where you do want to move? (up, down, left, right, stay)",
            "Not an available move. Try again!",
            (input) => {
                return inputMap[input.input];
            }
        );

        // let waitingForInput = true;
        // let move;

        // while (waitingForInput) {

        //     document.getElementById("inputText").innerHTML = "Where you do want to move? (up, down, left, right, stay)";
            
        //     socket.on("send input", (input) => {

        //         if (waitingForInput) {
        //             try {
        //                 move = inputMap[input.input];
        //                 waitingForInput = false;
        //             } catch {
        //                 waitingForInput = true;
        //                 document.getElementById("errorText").innerHTML = "Not an available move. Try again!";
        //             }
        //         }

        //     });

        // }

        // return move;

    }

    chooseTarget(shipInfo, combatOrder) {
        console.log(`${shipInfo.shipId} is in combat at ${shipInfo.coords}`);
        let opponentShips = combatOrder.filter(ship => ship.playerNum != shipInfo.playerNum && ship.hp > 0);
        return this.combatInput(opponentShips);
    }

    combatInput(opponentShips) {

        return this.getInputFromUI(
            'Pick an opponent ship to fight (Format: "<shipType> <shipNum>")',
            "Not an available opponent. Try again!",
            (input) => {
                opponent = input.input.split(' ');
                for (let ship of opponentShips) {
                    if (ship.name == opponent[0] && ship.shipNum == opponent[1]) {
                        return ship;
                    }
                }
            }
        );

        // let waitingForInput = true;
        // let opponent;

        // while (waitingForInput) {

        //     document.getElementById("inputText").innerHTML = 'Pick an opponent ship to fight (Format: "<shipType> <shipNum>")';
            
        //     socket.on("send input", (input) => {

        //         if (waitingForInput) {
        //             try {

        //                 opponent = input.input.split(' ');
        //                 waitingForInput = false;

        //                 for (let ship of opponentShips) {
        //                     if (ship.name == opponent[0] && ship.shipNum == opponent[1]) {
        //                         return ship;
        //                     }
        //                 }

        //             } catch {
        //                 waitingForInput = true;
        //                 document.getElementById("errorText").innerHTML = "Not an available opponent. Try again!";
        //             }
        //         }

        //     });

        // }

        // let opponent = prompt('Pick an opponent (Format: "<shipType> <shipNum>"): '); // Auto assumes enemy player
        // let opponent = opponent.split(' ');
        // console.log(opponentShips);

        // for (let ship of opponentShips) {
        //     if (ship.name == opponent[0] && ship.shipNum == opponent[1]) {
        //         return ship;
        //     }
        // }

        // console.log(`Opponent does not have a ${opponent}, try again`);
        // console.log('just gonna skip that for now');
        // return opponentShips[Math.floor(Math.random() * opponentShips.length)];

    }

    buyShips(cpBudget) {

        let shipList = [];
        let spent = 0;

        while (true) {

            console.log(`You currently have ${cpBudget - spent} CP`);
            this.printBoughtShips(shipList);

            let input = this.buyInput();
            if (input == 'Done') break;

            let shipDict = {};
            shipDict[input[0].name] = input[1];
            shipList.push(shipDict);

        }

        return shipList;

    }

    buyInput() {

        let cart = this.getInputFromUI(
            'Which ships would you like to buy? (Format: "<shipType> <amount>" OR "Done")',
            "Please type a valid ship name and number",
            (input) => {

                let cart = input.split(' ');
                if (cart[0] == "Done") return "Done";
                if (typeof cart[1] != "number") return "input again";

                for (let ship of nullInstances) {
                    if (cart[0] == ship.name) {
                        return [ship, cart[1]];
                    }
                }

            }
        );

        // let input = prompt('Please choose a ship and amount to buy (Format: "<shipType> <amount>") OR "Done": ');
        // let cart = input.split(' ');

        // while (cart.length == 1) {
        //     return 'Done';
        // }

        // cart[1] = + cart[1];

        // while (cart[1] === NaN) {
        //     cart[1] = prompt('Please type a valid number');
        //     cart[1] = + cart[1];
        // }

        // let bought = this.findBought(cart[0]);

        return this.getInputFromUI(
            `You would like to buy ${cart[1]} ${cart[0].name} for ${cart[0].cpCost * cart[1]} CP? (Y/N)`,
            "Please only respond with Y or N",
            (input) => {
                if (input == 'Y') return cart;
            }
        );

        // let bought = this.findBought(cart[0]);
        // let confirm = prompt(`You would like to buy ${cart[1]} ${bought.name} for ${bought.cpCost * cart[1]} CP? (Y/N): `);
        // if (confirm == 'Y') return [bought, cart[1]];
        // return this.buyInput();

    }
    
    findBought(cart) {

        for (let ship of nullInstances) {
            if (cart == ship.name) {
                return ship;
            }
        }

        // let input = prompt('Please type a valid ship type: ');
        // return this.findBought(input);

    }

    printBoughtShips(shipList) {
        
        console.log('You have bought...');
        if (shipList.length == 0) console.log('Nothing');
        
        for (const ship of shipList) {
            const [shipName, numShips] = Object.entries(ship)[0];
            console.log(numShips, shipName);
        }
    
    }

}


export default InputStrat;