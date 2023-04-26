import { nullInstances } from '../src/ships.js';
import ParentStrat from './parentStrat.js';
//import promptSync from 'prompt-sync';
//const prompt = promptSync();

class InputStrat {
    constructor(){
        this.name = 'input';
        this.isManual = true;
        this.strat = 'blank';
    }

    // Required Functions

    chooseTranslation(translations, shipCoords, plrInput){
        if (!plrInput) {return;}

        let translation = this.getInputTranslation(plrInput, shipCoords[1])
        /*
        if (translations.find(el => this.sameArray(translation, el)) == undefined) {
            console.log('That doesnt work, turn forfeit');
            return [0, 0];
        }*/
        return translation;
    }

    chooseTarget(shipInfo, combatOrder, plrInput){
        if (!plrInput) {return;}

        let [targName, targNum] = plrInput.split(' ');
        let opponentShips = combatOrder.filter(ship => ship.playerNum != shipInfo.playerNum && ship.hp > 0);
        
        for (let ship of opponentShips) {
            if (ship.name == targName && ship.shipNum == targNum) {return ship;}
        }

        console.log(`Opponent does not have ${targName} ${targNum}, try again`);
        console.log('just gonna skip that for now');
        return opponentShips[Math.floor(Math.random() * opponentShips.length)];
    }

    buyShips(plrInput){
        if (!plrInput) {return;}
        if (plrInput == 'None') {return [];}

        let cart = plrInput.split(', ');
        let shipList = [];
        for (let item of cart) {
            let recipt = this.makeRecipt(item);
            if (!recipt) {continue;}
            shipList.push(recipt);
        }

        return shipList;
    }

    maintOrder(ships, plrInput){
        if (ships.length == 0) {return [];}
        if (!plrInput) {return;}

        if (plrInput == 'auto') {return ships.sort((a, b) => a.maintCost - b.maintCost);}

        if (plrInput.split(': ')[1]) {
            let remove = plrInput.split(': ')[1]
            remove = this.splitMaintOrder(ships, remove);
            let maint = ships.filter(plrShip => !remove.some(ordShip => ordShip.id == plrShip.id));
            return maint.sort((a, b) => a.maintCost - b.maintCost);
        }

        return this.splitMaintOrder(ships, plrInput);
        
    }

    buyTech(plrInput){
        if (!plrInput) {return;}
        if (plrInput == 'None') {return [];}

        let tech = plrInput.split(', ');
        let cart = [];
        for (let item of tech) {
            if (item == 'atk') {cart.push('attack');}
            else if (item == 'def') {cart.push('defense');}
            else if (item == 'mvmt') {cart.push('movement');}
        }
        return cart;
    }

    // Helper && Translator Functions

    getInputTranslation(input, col) {
        /*
        let inputMap = {
            'up':    [0, -1],
            'down':  [0, 1],
            'left':  [-1, 0],
            'right': [1, 0],
            'stay':  [0, 0],
        };
        //*/
        ///*
        let inputMap = {
            'ur':    [(col)%2, -1],
            'ul':   [(col+1)%2, -1],
            'l':  [-1, 0],
            'r': [1, 0],
            'dr':  [(col)%2, 1],
            'dl': [(col+1)%2, 1],
            'stay': [0, 0],
        };
        //*/

        return inputMap[input];
    }

    sameArray(array1, array2) {
        for (let i = 0; i < array1.length; i++) {
            if (array1[i] != array2[i]) {return false;}
        }
        return true;
    }

    makeRecipt(item) {
        let [name, amt] = item.split(' ');
        amt = + amt; //turns to number
        if (amt === NaN) {amt = 1;}

        if (!this.findBought(name)) {return;}

        let recipt = {};
        recipt[name] = amt;
        return recipt;
    }

    findBought(name) {
        for (let ship of nullInstances) {
            if (name == ship.name) {return ship;}
        }
        return;
    }

    splitMaintOrder(ships, maintOrder) {
        let queue = maintOrder.split(', ');
        let order = [];
        for (let shipId of queue) {
            let [name, id] = shipId.split(' ');
            let foundShip = ships.filter(ship => ship.name == name && ship.shipNum == id);
            if (foundShip.length == 0) {
                console.log(`Something wrong was written for ${name} ${id}}`);
                continue;
            }
            order.push(...foundShip);
        }

        return order;
    }

}

class InputStrat2 extends ParentStrat {
    
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