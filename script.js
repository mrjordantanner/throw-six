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
            dice.length = 0;
            // Create num dice in play area
            console.log(`Throwing ${num} dice`);
            for (let i = 1; i <= num; i++) {
                const newDie = new Die();
                dice.push(newDie);
                diceInPlay.push(newDie);
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
const diceInPlay = [];
const diceInHeld = [];
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

    //const numberOfDice = playArea.querySelectorAll('.die').length;
    const numberOfDice = diceInPlay.length;
    console.log(`Dice in playArea: ${numberOfDice}`)

    // Clear dice from array and board
    diceInPlay.forEach((die) => {
			if (diceInPlay.length > 0) die.div.remove();
		});

    diceInPlay.length = 0;

    // const notHeld = dice.filter((die) => die.held === false);
    // //console.log(`dice: ${dice.length}`);
    // console.log(`notHeld: ${notHeld.length}`);

    // notHeld.forEach((die) => {
    //     console.log(die);
    //     die.remove();
    // })


    // If board is empty, throw 6 die, otherwise throw remaining die already on board
    if (numberOfDice === 0 && diceInHeld.length === 0) {
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

    //console.log(`Ones in play? ${anyInPlay(1)}`);



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

        // remove from diceInPlay array 
        const index = diceInPlay.indexOf(die);
        diceInPlay.splice(index, 1);
        // put in diceInHeld array
        diceInHeld.push(die);
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

	// Make an object of arrays to hold our dice sorted by their rolled values
	const sorted = {
		ones: [],
		twos: [],
		threes: [],
		fours: [],
		fives: [],
		sixes: [],
	};

	console.log(`Checking dice in play: ${diceInPlay.length}`);

	diceInPlay.forEach((die) => {
		//console.log(die);

		// SORT
		// take inventory of how many of each number there are
		switch (die.value) {
			case 1:
				sorted.ones.push(die);
				break;

			case 2:
				sorted.twos.push(die);
				break;

			case 3:
				sorted.threes.push(die);
				break;
			case 4:
				sorted.fours.push(die);
				break;

			case 5:
				sorted.fives.push(die);
				break;

			case 6:
				sorted.sixes.push(die);
				break;
		}
	});

	// PROCESS

	// are there any 1's and 5's?
	// if so, die.scoring = true;
	// add styling class to dice to indicate they are scoring dice

	// Check for single 1's 
	if (sorted.ones.length > 0 && sorted.ones.length < 3) {
		sorted.ones.forEach((die) => {
			die.scoring = true;
			die.div.classList.add('scoring');
		});
	}
    // Check for single 5's
	if (sorted.fives.length > 0 && sorted.fives.length < 3) {
		sorted.fives.forEach((die) => {
			die.scoring = true;
			die.div.classList.add('scoring');
		});
	}

	// Iterate through sorted object's properties (the sorted arrays)
	Object.entries(sorted).forEach((entry) => {
		console.log(entry);
		if (entry[1].length >= 3) {
			entry[1].forEach((die) => {
				die.scoring = true;
				die.div.classList.add('scoring-group');
				// scoringGroup.push(die);
			});
            console.log(`Rolled ${entry[1].length} ${entry[0]}!`);
		}
	});

	updateDiceUI();


    // how will "scoring groups" work?  i.e How will the grouping of similar dice work? 
        // 1) Have a scoringGroup property on each dice object that we set, and compare with e.g. 'A' or 'B' etc
        // 2) DESIGNATE the existing array as a scoring group 
            // e.g. this group of three 4's 



	// are there any three's of a kind (not of 1's and 5's)?
	// if so, die.scoring = true;
	// const scoringGroup = [];
	// scoringGroup.push(each die);

	// At the end of processing, if there are no dice.scoring = true, end turn and lose points

	// Print
	// console.log(`Ones: ${ones.length}`);
	// console.log(`Twos: ${twos.length}`);
	// console.log(`Threes: ${threes.length}`);
	// console.log(`Fours: ${fours.length}`);
	// console.log(`Fives: ${fives.length}`);
	// console.log(`Sixes: ${sixes.length}`);
}


function updateDiceUI() {
    dice.forEach((die) => {
        die.updateUI();
    })
}

function checkParent(parent, child) {
	if (parent.contains(child)) return true;
	return false;
} 

function anyInPlay(value) {

    const test = (die) => die.value === value;
    return diceInPlay.some(test);
    
}
