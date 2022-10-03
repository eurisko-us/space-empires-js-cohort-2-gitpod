//import prompt from ''
//const prompt = require('prompt-sync')();
import { nullInstances } from '../src/ships.js'

class UserStrategy {
    
    constructor() {
        this.simpleBoard = null;
        this.turn = 0;
        this.player = null;
    }

    chooseTranslation(ship, translations) {
        console.log('\n\n');
        console.log(`${ship.shipId} is at ${ship.coords}`);
        console.log(`Possible movements are Check The Damn Board`);

        let trans = this.transInput(ship, translations);
        if (translations.find(el => this.sameArray(trans, el)) == undefined) {
            console.log('That doesnt work, turn forfit');
            trans = [0,0];
        }
        return trans;
    }

    sameArray(array1, array2) {
        for (let i=0; i < array1.length; i++){
            if (array1[i] != array2[i]) {
                return false;
            }
        }
        return true;
    }

    transInput() {
        let input = prompt("Pick a direction (up, down, left, right, stay) : ");
        switch (input) {
            case 'up' :
                return [0,-1];
            case 'down' :
                return [0,1];
            case 'left' :
                return [-1,0];
            case 'right' :
                return [1,0];
            case 'stay' :
                return [0,0];
            //default :
            //    console.log('ye');
            //    return [0,0];
                //console.log('Try again, it might be mispelled');
                //return this.transInput();
        }
        
        //let input = prompt("USER INPUT: Choose your move? ");
        //console.log(`Received user input "${input}"`);
    }

    chooseTarget(shipInfo, combatOrder) {
        console.log(`${shipInfo.shipId} is in combat at ${shipInfo.coords}`)
        let opponentShips = combatOrder.filter(ship => ship.playerNum != shipInfo.playerNum && ship.hp > 0);
        //console.log('(Auto assumes enemy player)');
        let target = this.combatInput(opponentShips);
        return target;
        //return opponentShips[Math.floor(Math.random() * opponentShips.length)];
    }

    combatInput(enemyShips) {
        let input = prompt('Pick an enemy (shipType -space- shipNum): '); // Auto assumes enemy player
        let enemy = input.split(' ');
        console.log(enemyShips);
        for (var ship of enemyShips) {
            //console.log(ship)
            if (ship.name == enemy[0] && ship.shipNum == enemy[1]){
                return ship;
            }
        }
        console.log(`Enemy Player does not have a ${input}, try again`);
        //return this.combatInput(enemyShips);
        console.log('just gonna skip that for now');
        return enemyShips[Math.floor(Math.random() * enemyShips.length)];
    }

    buyShips(cpBudget) {
        const randCostLim = Math.floor(Math.random() * (cpBudget+1));
        let shipList = [];
        let totalCost = 0;
        while (randCostLim>=totalCost){
            let randomShip = nullInstances[Math.floor(Math.random() * nullInstances.length)];
            totalCost += randomShip.cpCost
            if (totalCost<randCostLim){
                let shipDict = {}
                let shipName = randomShip.name
                shipDict[shipName] = 1
                shipList.push(shipDict)
            }
            else{
                break;
            }
        }
        if (this.turn==0 && shipList.length==0) {
            return this.buyShips(cpBudget)
        }
        return shipList
    }

    buyInput() {
        let input = prompt('Please choose a ship and amount to buy "shipType -space- amount" OR "None": ');
        let cart = input.split(' ');
        let bought = this.findBought(cart[0])
    }
    
    findBought(cart) {
        for (var ship of nullInstances) {
            if (cart == ship.name){
                return ship
            }
        }
        input = prompt('Please type a valid ship type: ')
        return this.findBought(input)
    }

}

module.exports = UserStrategy;