// DICE GAME RULES ***
//region [White]
// a single 1 is worth 100 points;
// a single 5 is worth 50 points;
// three of a kind is worth 100 points multiplied by the given number, e.g. three 4s are worth 400 points;
// three 1's are worth 1,000 points;
// four or more of a kind is worth double the points of three of a kind, so four 4s are worth 800 points, five 4s are worth 1,600 points etc.
// full straight 1-6 is worth 1500 points.
// partial straight 1-5 is worth 500 points.
// partial straight 2-6 is worth 750 points.
//#endregion

// CLASSES
//#region [Purple]
// Creates Die objects for use in play
class Die {

    constructor(value, div, held = false, scoring = false, groupCode = groupCodes[0]) {
			this.value = value;         // the rolled value of the die
			this.div = div;             // reference to visual element in window
            this.held = held;           // bool, is die in the held area?
            this.scoring = scoring;     // bool, is die currently worth any points?
            this.groupCode = groupCode;    // helps designate what group certain dice are members of e.g. the three dice that make up "three of a kind"     


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
	constructor() {}

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
		for (let i = 0; i < num; i++) {
			const newDie = new Die();
            // dev option that assigns values to dice manually
            if (useRiggedDice) {
                newDie.value = riggedDice[i];
            }
			dice.push(newDie);
			diceInPlay.push(newDie);
			playArea.appendChild(newDie.div);
		}
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
playerRoundTotal = 0;
playerScore = 0;
computerRoundTotal = 0;
computerScore = 0;

const groupCodes = ['None', 'OfAKind', 'Partial', 'Straight', 'OfAKind 2']

// Dev tools
useRiggedDice = true;
riggedDice = [1, 2, 3, 4, 5, 6];

// Elements
const playArea = document.querySelector('#play-area');
const heldArea = document.querySelector('#held-area');
const buttonRoll = document.querySelector('#button-roll');
const roundText = document.querySelector('#round');
const scoreText = document.querySelector('#score');

//game.throw(6);

// Event listeners
playArea.addEventListener('click', (e) => {
    e.preventDefault();

    const targetDie = getDieByDiv(e.target);

    if (e.target.classList.contains('die') && targetDie.scoring) {

          //  console.log(targetDie.group);

        // If not in a group, move by itself
        if (targetDie.groupCode === groupCodes[0]) {  // no group code
            moveDie(e.target);
            playerRoundTotal += calculateSoloValue(targetDie);// || 0;
        }
        else {   // move all dice in the group
            const all = allInGroup(targetDie.groupCode);
            //console.log(all);
            all.forEach((die) => {
                moveDie(die.div);
                die.groupCode = groupCodes[1];   // group "OfAKind"
            })


            // iterate through all groupCodes
                // foreach one, 
                //  calculateGroup value and add it to round total

                // dont forget to be assiging these groupCodes

                // are they really necessary?  
                // why use logic to determine what group theyre in,
                        // assign them a code
                        // then use the code to find them again?
                            // do we need to find them again, or can we just do everythjing
                            // once upon determing the scoring pattern?

                            // YES

                            // identify them after rolling
                                // 
                            // indentity them when clicking

                            // have an array of scoring groups
                            //


            playerRoundTotal += calculateGroupValue(all);// || 0;
        }

        // console.log(`In Play: ${diceInPlay.length}`);
        // console.log(`In Held: ${diceInHeld.length}`);
        console.log(`Player round total: ${playerRoundTotal}`);
        updateScoreboard();
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
		if (diceInPlay.length > 0) 
            die.div.remove();
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
   updateScoreboard();

});
//#endregion

function updateScoreboard() {
    roundText.innerText = playerRoundTotal;
    scoreText.innerText = playerScore;
}


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

	// SORTING
	//#region [Purple]
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

	//console.log(`Checking dice in play: ${diceInPlay.length}`);

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

	// PROCESSING

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
		//console.log(entry);
		if (entry[1].length >= 3) {
			entry[1].forEach((die) => {
				die.scoring = true;
				die.div.classList.add('scoring-group');

				// Assign each die a groupCode
				if (die.groupCode === groupCodes[0]) {
					die.groupCode = groupCodes[1];
				}
				// for the rare occasion that a player rolled two separate three-of-a-kinds at once
				else if (die.groupCode === groupCodes[1]) {
					// group "of-a-kind"
					die.groupCode = groupCodes[4];   // group "of-a-kind 2"
				}
			});
			console.log(`Rolled ${entry[1].length} ${entry[0]}!`);
		}
	});

	updateDiceUI();

	// If no scoring dice were produced during the  roll, end turn and gain 0 points 
	if (!anyScoring()) {
		console.log('NO SCORING DICE. END OF ROUND');
		playerRoundTotal = 0;
		buttonRoll.classList.add('disabled');
        updateScoreboard();
	}

	// console.log(`Ones: ${ones.length}`);
	// console.log(`Twos: ${twos.length}`);.
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

// TODO: Use .find()
function anyScoring() {
    let found = false;
    diceInPlay.forEach((die) => {
        if (die.scoring === true || die.scoring === 'true') {
            found = true;
        }
    })
    return found;
}

function allInGroup(groupCode) {
    const test = (die) => die.groupCode === groupCode;
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

// TODO: DRY this up!  consolidate conditionals, write generic formula to arrive at end value
function calculateGroupValue(dice) {
	// Check for a group of 1's bc they're special
	const onesTest = (die) => die.value === 1;
	if (dice.some(onesTest)) {
		switch (dice.length) {
			case 3:
				return 1000;
				break;

			case 4:
				return 2000;
				break;

			case 5:
				return 4000;
				break;

			case 6:
				return 8000;
				break;
		}
	}

	// Check for 'of-a-kind'
	switch (dice.length) {
		case 3:
			return dice[0].value * 100 * 1;
			break;

		case 4:
			return dice[0].value * 100 * 2;
			break;

		case 5:
			return dice[0].value * 100 * 4;
			break;

		case 6:
			return dice[0].value * 100 * 8;
			break;
	}


	// Check for Straights
    console.log(`AnyInPlay1: ${anyInplay(1)}`);
    console.log(`AnyInPlay2: ${anyInplay(2)}`);
    console.log(`AnyInPlay3: ${anyInplay(3)}`);
    console.log(`AnyInPlay4: ${anyInplay(4)}`);
    console.log(`AnyInPlay5: ${anyInplay(5)}`);
    console.log(`AnyInPlay6: ${anyInplay(6)}`);


    if (anyInPlay(2) && anyInPlay(3) && anyInPlay(4) && anyInPlay(5)) {
        if (anyInplay(1) && anyInplay(6)) {
            // full straight
            console.log('Full Straight');
            return 1500;
        }
        
        else if (anyInplay(1)) {
            // low partial straight
            console.log('Low Partial Straight');
            return 500;
        }

        else if (anyInPlay(6)) {
            // high partial straight
            console.log('High Partial Straight')
            return 750;
        }


    }




}
