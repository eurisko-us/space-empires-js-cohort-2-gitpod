import { nullInstances } from '../src/ships.js';
import promptSync from 'prompt-sync';
const prompt = promptSync();

class InputStrat {
    
    constructor() {
        this.simpleBoard = null;
        this.turn = 0;
        this.player = null;
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


    getInputTranslation() {

        let inputMap = {
            'up':    [0, -1],
            'down':  [0, 1],
            'left':  [-1, 0],
            'right': [1, 0],
            'stay':  [0, 0],
        };

        let input = prompt("Pick a direction (up, down, left, right, stay) : ");
        return inputMap[input];

        // switch (input) {
        //     case 'up' :
        //         return [0,-1];
        //     case 'down' :
        //         return [0,1];
        //     case 'left' :
        //         return [-1,0];
        //     case 'right' :
        //         return [1,0];
        //     case 'stay' :
        //         return [0,0];
        //     // default :
        //         // console.log('ye');
        //         // return [0, 0];
        //         // console.log('Try again, it might be mispelled');
        //         // return this.getInputTranslation();
        // }

        // let input = prompt("USER INPUT: Choose your move? ");
        // console.log(`Received user input "${input}"`);

    }

    chooseTarget(shipInfo, combatOrder) {
        console.log(`${shipInfo.shipId} is in combat at ${shipInfo.coords}`);
        let opponentShips = combatOrder.filter(ship => ship.playerNum != shipInfo.playerNum && ship.hp > 0);
        // console.log('(Auto assumes enemy player)');
        return this.combatInput(opponentShips);
        //return opponentShips[Math.floor(Math.random() * opponentShips.length)];
    }

    combatInput(enemyShips) {

        let input = prompt('Pick an enemy (Format: "<shipType> <shipNum>"): '); // Auto assumes enemy player
        let enemy = input.split(' ');
        console.log(enemyShips);

        for (let ship of enemyShips) {
            //console.log(ship)
            if (ship.name == enemy[0] && ship.shipNum == enemy[1]) {
                return ship;
            }
        }

        console.log(`Enemy Player does not have a ${input}, try again`);
        // return this.combatInput(enemyShips);
        console.log('just gonna skip that for now');
        return enemyShips[Math.floor(Math.random() * enemyShips.length)];

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

        let input = prompt('Please choose a ship and amount to buy (Format: "<shipType> <amount>") OR "Done": ');
        let cart = input.split(' ');

        while (cart.length == 1) {
            return 'Done';
            // if (cart == 'Done') return 'Done';
            // input = prompt('That is not a valid option, try again: ');
            // cart = input.split(' ');
        }

        let bought = this.findBought(cart[0]);
        cart[1] = + cart[1];

        while (cart[1] === NaN) {
            cart[1] = prompt('Please type a valid number');
            cart[1] = + cart[1];
        } 

        let confirm = prompt(`You would like to buy ${cart[1]} ${bought.name} for ${bought.cpCost * cart[1]} CP? (Y/N): `);
        if (confirm == 'Y') return [bought, cart[1]];
        return this.buyInput();

    }
    
    findBought(cart) {

        for (let ship of nullInstances) {
            if (cart == ship.name) {
                return ship;
            }
        }

        let input = prompt('Please type a valid ship type: ');
        return this.findBought(input);

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