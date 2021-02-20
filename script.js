// CLASSES
//#region [Blue]
// Creates Die objects for use in play
class Die {

    constructor(value, div, held = false, scoring = false) {
			this.value = value;         // the rolled value of the die
			this.div = div;             // reference to visual element in window
            this.held = held;           // bool, is die in the held area?
            this.scoring = scoring;     // bool, is die currently worth any points?

            this.div = document.createElement('div');
            this.div.classList.add('die');

            const val = Math.floor(Math.random() * 6 + 1);
            this.value = val;

            this.updateUI();
           // console.log(this);
		}

        // updates text on the die for testing
        updateUI() {
            this.div.innerText = `Value: ${this.value}, Held: ${this.held}, Scoring: ${this.scoring}`;
        }
}

// Controls game flow and functions
class Game {

    constructor() {};

    // ROUND FLOW

    // user throws X = 6 dice
    // values of dice are displayed on screen, scoring dice highlighted matching colors or borders

    // if at least one scoring die rolled,

    // user can:
        // click Y scoring dice (or scoring group) to move them to held area
            // end turn, gaining Z+=value points
            // roll again with X-Y remaining dice
    
    // if no scoring dice rolled, end of turn with 0 points earned

    // if END TURN, end of turn with Z points earned

        throw(num) {
            // Create num dice in play area
            console.log(`Throwing ${num} dice`);
            for (let i = 1; i <= num; i++) {
                const newDie = new Die();
                dice.push(newDie);
                playArea.appendChild(newDie.div);
            }
        }

        // Removes die from array as well as play/held area
        removeDie() {




        }


}
//#endregion




// INITIALIZATION
//#region [Blue]

const game = new Game();
const dice = [];
const playArea = document.querySelector('#play-area');
const heldArea = document.querySelector('#held-area');
const buttonRoll = document.querySelector('#button-roll');

//game.throw(6);

// Event listeners
playArea.addEventListener('click', (e) => {
    e.preventDefault();

    if (e.target.classList.contains('die')) {
        //console.log(`button e.target: ${e.target}`);
        moveDie(e.target);
    }
})

heldArea.addEventListener('click', (e) => {
	e.preventDefault();

	if (e.target.classList.contains('die')) {
		moveDie(e.target);
	}
});

// Roll Button
buttonRoll.addEventListener('click', (e) => {
	e.preventDefault();

   // console.clear();

    const numberOfDice = playArea.querySelectorAll('.die').length;
    console.log(`Dice in playArea: ${numberOfDice}`)


    diceInPlay().forEach((die) => {
        if (diceInPlay().length > 0)
            die.div.remove();
    })

    // const notHeld = dice.filter((die) => die.held === false);
    // //console.log(`dice: ${dice.length}`);
    // console.log(`notHeld: ${notHeld.length}`);

    // notHeld.forEach((die) => {
    //     console.log(die);
    //     die.remove();
    // })


    // If board is empty, throw 6 die, otherwise throw remaining die already on board
    if (numberOfDice === 0 && diceInHeld().length === 0) {
        game.throw(6);
    }
    else {
        game.throw(numberOfDice);
    }

   checkScoring();


   // TESTING
    // dice.forEach((die) => {
    //    // console.log(die);
    // });

    //console.log(``)




});

//#endregion

function getDieByDiv(div) {
	// for grabbing the Die object that this div is a property of
	for (let i = 0; i <= dice.length; i++) {
		if (dice[i].div === div) {
			return dice[i];
		}
	}
}

// 'moves' the die and re-appends its corresponding div
function moveDie(div) {

    // If in play area, move to held area
    if (checkParent(playArea, div)) {

        heldArea.appendChild(div);
        const die = getDieByDiv(div);
        die.held = true;
        die.updateUI();

    }
    // Moving dice out of held area
    // else
    // {
    //     playArea.appendChild(die);
    //     die.held = false;
    // }

}



// a single 1 is worth 100 points;
// a single 5 is worth 50 points;
// three of a kind is worth 100 points multiplied by the given number, e.g. three 4s are worth 400 points;
// three 1's are worth 1,000 points;
// four or more of a kind is worth double the points of three of a kind, so four 4s are worth 800 points, five 4s are worth 1,600 points etc.
// full straight 1-6 is worth 1500 points.
// partial straight 1-5 is worth 500 points.
// partial straight 2-6 is worth 750 points.

// Checks the dice in the playing area for dice that are worth points
function checkScoring() {

    const diceToCheck = diceInPlay();
        const ones = [];
            const twos = [];
                const threes = [];
                    const fours = [];
                        const fives = [];
                            const sixes = [];

    console.log(`Checking dice in play: ${diceToCheck.length}`);

    diceToCheck.forEach((die) => {

        //console.log(die);

        // SORT
        // take inventory of how many of each number there are
        switch (die.value) {

					case 1:
						ones.push(die);
						break;

					case 2:
                        twos.push(die);
						break;

					case 3:
                        threes.push(die);
						break;
					case 4:
                        fours.push(die);
						break;

					case 5:
                        fives.push(die);
						break;

					case 6:
                        sixes.push(die);
						break;
    
				}

        // PROCESS

        // are there any 1's and 5's?
            // if so, die.scoring = true;
            // add styling class to dice to indicate they are scoring dice


        if (ones.length > 0) {
            ones.forEach((die) => {

                die.scoring = true;
                die.div.classList.add('scoring');
                die.updateUI();

            })
        }


        // are there any three's of a kind (not of 1's and 5's)?
            // if so, die.scoring = true;
            // const scoringGroup = [];
            // scoringGroup.push(each die);



    })


        // console.log(`Ones: ${ones.length}`);
        // console.log(`Twos: ${twos.length}`);
        // console.log(`Threes: ${threes.length}`);
        // console.log(`Fours: ${fours.length}`);
        // console.log(`Fives: ${fives.length}`);
        // console.log(`Sixes: ${sixes.length}`);





}



function checkParent(parent, child) {
	if (parent.contains(child)) return true;
	return false;
} 



// TODO:  Use filter instead
function diceInPlay() {
	const returnDice = [];

	dice.forEach((die) => {
		if (!die.held) {
			returnDice.push(die);
			//console.log(`${die.value} is in play`);
		}
	});
	return returnDice;
	//return playArea.querySelectorAll('.die');

}

function diceInHeld() {
    const returnDice = [];

    dice.forEach((die) => {
        if (die.held) {
            returnDice.push(die);
            console.log(`${die.value} is in held`);
        }
    });
    return returnDice;
	//return playArea.querySelectorAll('.die');
}
