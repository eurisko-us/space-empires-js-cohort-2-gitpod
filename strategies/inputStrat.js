import { nullInstances } from '../src/ships.js';
import ParentStrat from './parentStrat.js';
//import promptSync from 'prompt-sync';
//const prompt = promptSync();

class Adaptor {
    constructor(){
        this.name = 'input';
        this.isManual = true;
        this.strat = 'blank';
    }

    // Required Functions

    chooseTranslation(translations, plrInput){
        let [input, endStatement] = plrInput.split('!!');
        if (!endStatement) {
            return;
        }

        let translation = this.getInputTranslation(input)

        if (translations.find(el => this.sameArray(translation, el)) == undefined) {
            console.log('That doesnt work, turn forfeit');
            return [0, 0];
        }
        return translation;
    }

    chooseTarget(shipInfo, combatOrder, plrInput){
        let [input, endStatement] = plrInput.split('!!');
        if (!endStatement) {
            return;
        }

        let [targName, targNum] = input.split(' ');
        let opponentShips = combatOrder.filter(ship => ship.playerNum != shipInfo.playerNum && ship.hp > 0);
        
        for (let ship of opponentShips) {
            if (ship.name == targName && ship.shipNum == targNum) {
                return ship;
            }
        }

        console.log(`Opponent does not have a ${opponent}, try again`);
        console.log('just gonna skip that for now');
        return opponentShips[Math.floor(Math.random() * opponentShips.length)];
    }

    buyShips(plrInput){
        let [input, endStatement] = plrInput.split('!!');
        if (!endStatement) {
            return;
        }

        let cart = input.split(', ');
        let shipList = [];
        for (let item of cart) {
            recipt = this.makeRecipt(item);
            if (!recipt) {continue;}
            shipList.push(recipt);
        }

        return shipList;
    }

    maintOrder(ships, plrInput){
        let [input, endStatement] = plrInput.split('!!');
        if (!endStatement) {
            return;
        }

        let queue = input.split(', ');
        let order = [];
        for (let shipId of queue) {
            let [name, id] = shipId.split(' ');
            foundShip = ships.filter(ship => ship.name == name && ship.id == id);
            if (foundShip.length == 0) {
                console.log(`Something wrong was written for ${name} ${id}}`);
            }
            order.push(...foundShip);
        }

        return order;
        
    }

    buyTech(plrInput){
        let [input, endStatement] = plrInput.split('!!');
        if (!endStatement) {
            return;
        }
        let tech = input.split(', ')
        return tech
    }

    // Helper && Translator Functions

    getInputTranslation(input) {
        let inputMap = {
            'up':    [0, -1],
            'down':  [0, 1],
            'left':  [-1, 0],
            'right': [1, 0],
            'stay':  [0, 0],
        };

        return inputMap[input];
    }

    sameArray(array1, array2) {
        for (let i = 0; i < array1.length; i++) {
            if (array1[i] != array2[i]) {
                return false;
            }
        }
        return true;
    }

    makeRecipt(item) {
        let [name, amt] = item.split(' ');
        amt = + amt; //turns to number
        if (amt === NaN) {amt = 1;}

        if (!this.findBought(name)) {return;}

        return {name: amt};
    }

    findBought(name) {
        for (let ship of nullInstances) {
            if (name == ship.name) {return ship;}
        }
        return;
    }

}

class InputStrat extends ParentStrat {
    
    constructor() {
        super(ParentStrat);
        this.name = 'input';
        this.manual = true;
    }
/*
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

    getInputTranslation() {

        let inputMap = {
            'up':    [0, -1],
            'down':  [0, 1],
            'left':  [-1, 0],
            'right': [1, 0],
            'stay':  [0, 0],
        };

        //let input = prompt("Pick a direction (up, down, left, right, stay) : ");
        return inputMap[input];

    }

    sameArray(array1, array2) {
        for (let i = 0; i < array1.length; i++) {
            if (array1[i] != array2[i]) {
                return false;
            }
        }
        return true;
    }

    chooseTarget(shipInfo, combatOrder) {
        console.log(`${shipInfo.shipId} is in combat at ${shipInfo.coords}`);
        let opponentShips = combatOrder.filter(ship => ship.playerNum != shipInfo.playerNum && ship.hp > 0);
        return this.combatInput(opponentShips);
    }

    combatInput(opponentShips) {

        //let opponent = prompt('Pick an opponent (Format: "<shipType> <shipNum>"): '); // Auto assumes enemy player
        opponent = opponent.split(' ');
        console.log(opponentShips);

        for (let ship of opponentShips) {
            if (ship.name == opponent[0] && ship.shipNum == opponent[1]) {
                return ship;
            }
        }

        console.log(`Opponent does not have a ${opponent}, try again`);
        console.log('just gonna skip that for now');
        return opponentShips[Math.floor(Math.random() * opponentShips.length)];

    }
*/
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

        //let input = prompt('Please choose a ship and amount to buy (Format: "<shipType> <amount>") OR "Done": ');
        let cart = input.split(' ');

        while (cart.length == 1) {
            return 'Done';
        }

        cart[1] = + cart[1]; //turns to number

        while (cart[1] === NaN) {
            //cart[1] = prompt('Please type a valid number');
            cart[1] = + cart[1];
        }

        let bought = this.findBought(cart[0]);
        //let confirm = prompt(`You would like to buy ${cart[1]} ${bought.name} for ${bought.cpCost * cart[1]} CP? (Y/N): `);
        if (confirm == 'Y') return [bought, cart[1]];
        return this.buyInput();

    }
    
    findBought(cart) {

        for (let ship of nullInstances) {
            if (cart == ship.name) {
                return ship;
            }
        }

        //let input = prompt('Please type a valid ship type: ');
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