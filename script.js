// CLASSES
//#region [Blue]
// Creates Die objects for use in play
class Die {

    constructor(value, div, held = false, scoring = false, group = '') {
			this.value = value;         // the rolled value of the die
			this.div = div;             // reference to visual element in window
            this.held = held;           // bool, is die in the held area?
            this.scoring = scoring;     // bool, is die currently worth any points?
            this.group = group;         // A or B, or blank, representing what scoring group

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


            console.log(anyScoring());
           // console.log(`Dice: ${dice}`);
        }
}
//#endregion




// INITIALIZATION & SETUP
//#region [Blue]

// Objects and arrays
const game = new Game();
const dice = [];
const diceInPlay = [];
const diceInHeld = [];

// Global variables
playerRoundScore = 0;
playerTotalScore = 0;
computerRoundScore = 0;
computerTotalScorre = 0;

// Elements
const playArea = document.querySelector('#play-area');
const heldArea = document.querySelector('#held-area');
const buttonRoll = document.querySelector('#button-roll');

//game.throw(6);

// Event listeners
playArea.addEventListener('click', (e) => {
    e.preventDefault();

    const targetDie = getDieByDiv(e.target);



    if (e.target.classList.contains('die') && targetDie.scoring) {

          //  console.log(targetDie.group);

        // If not in a scoring group, move by itself
        if (targetDie.group.length === 0) {
            moveDie(e.target);
            calculateSoloValue(targetDie);
        }
        else {   // move all dice in the group
            const all = allInGroup(targetDie.group);
            //console.log(all);
            all.forEach((die) => {
                moveDie(die.div);

            })
            calculateGroupValue(all);
        }

        console.log(`In Play: ${diceInPlay.length}`);
        console.log(`In Held: ${diceInHeld.length}`);
    }
})

// Click in held area
// heldArea.addEventListener('click', (e) => {
// 	e.preventDefault();

// 	if (e.target.classList.contains('die')) {
// 		moveDie(e.target);
// 	}
// });

// Roll Button
buttonRoll.addEventListener('click', (e) => {
	e.preventDefault();
   // console.clear();

    const numberOfDice = diceInPlay.length;
    console.log(`Dice in playArea: ${numberOfDice}`)

    // Clear dice from array and board
    diceInPlay.forEach((die) => {
			if (diceInPlay.length > 0) die.div.remove();
		});

    diceInPlay.length = 0;

    // If board is empty, throw 6 die, otherwise throw remaining die already on board
    if (numberOfDice === 0 && diceInHeld.length === 0) {
        game.throw(6);
    }
    else {
        game.throw(numberOfDice);
    }

   checkScoring();

});

//#endregion

// for grabbing the Die object that this div is a property of
function getDieByDiv(div) {
	for (let i = 0; i < dice.length; i++) {
		if (dice[i].div === div) {
			return dice[i];
		}
	}
}

// 'moves' the die and re-appends its corresponding div to playArea (or heldArea)
function moveDie(div) {

    // If in play area, move to held area
  if (checkParent(playArea, div)) {
       
       heldArea.appendChild(div);
        const die = getDieByDiv(div);
        die.held = true;   // TODO: this is buggy
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

    // SORTING
    //#region [Purple]
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
    //#endregion

	// PROCESS

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

                // Assign each die a group ID
                if (die.group === '') {
				    die.group = 'A';
                }
                // for the rare occasion that a player rolled two separate groups at once
                else if (die.group === 'A') {    
                    die.group = 'B';
                }
                   
                
			});
            console.log(`Rolled ${entry[1].length} ${entry[0]}!`);
		}
	});

	updateDiceUI();

    if (!anyScoring()) {
        console.log("NO SCORING DICE. END OF ROUND")
        playerRoundScore = 0;
        buttonRoll.classList.add('disabled');
    }
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
	if (parent.contains(child)) {
        return true;
    }
	return false;
} 

function anyInPlay(value) {
    const test = (die) => die.value === value;
    return diceInPlay.some(test);
    
}



function anyScoring() {
    let found = false;
    diceInPlay.forEach((die) => {
        if (die.scoring === true || die.scoring === 'true') {
            found = true;
        }
    })
    return found;
    // const test = (die) => die.scoring === 'true';
    // return diceInPlay.some(test);
    
}

function allInGroup(group) {
    const test = (die) => die.group === group;
	return diceInPlay.filter(test);
}

// Determines the value of a single die as it is being held and adds it to roundTotal
function calculateSoloValue(die) {

    if (die.value === 1) {
        return 100;
    }

    if (die.value === 5) {
        return 50;
    }

}


function calculateGroupValue(dice) {




}



// three of a kind is worth 100 points multiplied by the given number, e.g. three 4s are worth 400 points;
// three 1's are worth 1,000 points;
// four or more of a kind is worth double the points of three of a kind, so four 4s are worth 800 points, five 4s are worth 1,600 points etc.

// full straight 1-6 is worth 1500 points.
// partial straight 1-5 is worth 500 points.
// partial straight 2-6 is worth 750 points.