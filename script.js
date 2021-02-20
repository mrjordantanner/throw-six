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
	constructor(faceValue, div, held = false, scoring = false, group) {
		this.faceValue = faceValue; // the rolled value of the die
		this.div = div; // reference to visual element in window
		this.held = held; // bool, is die in the held area?
		this.scoring = scoring; // bool, is die currently worth any points?
		this.group = group; // reference to the scoringGroup this die is in, if any

		this.div = document.createElement('div');
		this.div.classList.add('die');
		const val = Math.floor(Math.random() * 6 + 1);
		this.faceValue = val;
		//this.updateUI();
		// Assign default values for scoringGroup that will be overriden when actually in a group
		this.group = new ScoringGroup(0, 'none', []);
	}

	// updates text on the die for testing
	updateUI() {
		this.div.innerText = `Value: ${this.faceValue}, Held: ${this.held}, Scoring: ${this.scoring}`;
	}
}
// Controls game flow and functions
class Game {
	constructor() {}

    throw(num) {
		dice.length = 0;
		// Create num dice in play area
		console.log(`Throwing ${num} dice`);
		for (let i = 0; i < num; i++) {
			const newDie = new Die();
            // Manually set the dice value for testing
            if (useRiggedDice) {
                newDie.faceValue = riggedDice[i];
            }
            console.log(`rolled a ${newDie.faceValue}`);
			dice.push(newDie);
			diceInPlay.push(newDie);
			playArea.appendChild(newDie.div);
		}
	}
}

class ScoringGroup {
	constructor(value, type, members) {
		this.value = value;        // how many points the group as a whole is worth
		this.type = type;          // type of pattern, e.g three of a kind, flush
		this.members = members;    // dice that are members of this group
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

// Dev tools
useRiggedDice = true;
riggedDice = [4, 4, 4, 5, 5, 5];

// Elements
const playArea = document.querySelector('#play-area');
const heldArea = document.querySelector('#held-area');
const buttonRoll = document.querySelector('#button-roll');
const roundText = document.querySelector('#round');
const scoreText = document.querySelector('#score');

// Event listeners
playArea.addEventListener('click', (e) => {
    e.preventDefault();

    const targetDie = getDieByDiv(e.target);

    if (e.target.classList.contains('die') && targetDie.scoring) {
			//  console.log(targetDie.group);

			// If not in a group, move by itself
			if (targetDie.group === 'none') {
				moveDie(e.target);
				//playerRoundTotal += calculateSoloValue(targetDie); // || 0;
                // put solo dice in a group by themselves

			} else {
				// move all dice in the group
				const all = allInGroup(targetDie.group);
				//console.log(all);
				all.forEach((die) => {
					moveDie(die.div);
				});
				//playerRoundTotal += calculateGroupValue(all); // || 0;
			}

            playerRoundTotal += targetDie.group.value;

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
   updateDiceUI();
   updateScoreboard();

});
//#endregion


// SORTING & PATTERN RECOGNITION
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
		switch (die.faceValue) {
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


	// PROCESSING

    // SINGLE DICE
	// Check for single 1's
	if (sorted.ones.length > 0 && sorted.ones.length < 3) {
		sorted.ones.forEach((die) => {
            const thisGroup = new ScoringGroup(0, '', []);
            thisGroup.value = 100;
            thisGroup.type = 'Single';
            thisGroup.members.push(die);
            die.group = thisGroup;
			die.scoring = true;
			die.div.classList.add('scoring');

		});

	}
	// Check for single 5's
	if (sorted.fives.length > 0 && sorted.fives.length < 3) {
		sorted.fives.forEach((die) => {
            const thisGroup = new ScoringGroup(0, '', []);
            thisGroup.value = 50;
            thisGroup.type = 'Single';
            thisGroup.members.push(die);
            die.group = thisGroup;
			die.scoring = true;
			die.div.classList.add('scoring');
		});

	}

    // THREE OR MORE OF A KIND
	// Iterate through Sorted object's properties (the arrays sorted by dice face value)
	Object.entries(sorted).forEach((entry) => {
		//console.log(entry);
		if (entry[1].length >= 3) {

            // Make an empty scoring group to assign values to to describe this group of dice
            const thisGroup = new ScoringGroup(0, 'none', []);  

			entry[1].forEach((die) => {

				die.scoring = true;
				die.div.classList.add('scoring-group');

                // Assign values to the scoring group
                thisGroup.members.push(die);
                thisGroup.type = '';
                thisGroup.value = ofAKind(entry[1]);
                // give each die a reference to the group it's in
                die.group = thisGroup;

                console.log(die.group);
				console.log(`Rolled ${entry[1].length} ${entry[0]}!`);


			});

    
		}
	});

    // STRAIGHTS
    console.log(anyInPlay(1));
    console.log(anyInPlay(2));
    console.log(anyInPlay(3));
    console.log(anyInPlay(4));
    console.log(anyInPlay(5));
    console.log(anyInPlay(6));


    if (anyInPlay(2) && anyInPlay(3) && anyInPlay(4) && anyInPlay(5)) {
        if (anyInPlay(1) && anyInPlay(6)) {
            // full straight
            console.log('Full Straight');
            return 1500;
        }
        
        else if (anyInPlay(1)) {
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
		die.held = true; // TODO: this is buggy
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

function updateDiceUI() {
    console.log('dice ui updated');
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

function anyInPlay(faceValue) {
	const test = (die) => die.faceValue === faceValue;
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

function allInGroup(group) {
    const test = (die) => die.group=== group;
	return diceInPlay.filter(test);
}

// Determines the value of a single die as it is being held and adds it to roundTotal
// function calculateSoloValue(die) {

//     if (die.faceValue === 1) {
//         return 100;
//     }

//     if (die.faceValue === 5) {
//         return 50;
//     }

// }

// TODO: DRY this up!  consolidate conditionals, write generic formula to arrive at end value
// Rework this so it returns an array, a pair of values e.g. ['Three of a Kind', 300]

//#region [Violet]
function ofAKind(dice) {

    // Check for multiple 1's first bc they have higher point values
	const onesTest = (die) => die.faceValue === 1;
	if (dice.some(onesTest)) {
		switch (dice.length) {
			case 3:
				// return ["Three 1's", 1000];
                return 1000;
				break;

			case 4:
				// return ["Four 1's", 2000];
                return 2000;
				break;

			case 5:
				// return ["Five 1's", 4000];
                return 4000;
				break;

			case 6:
				// return ["Six 1's", 8000];
                return 8000;
				break;
		}
	}

	// Check for other 'of-a-kind's
	switch (dice.length) {
		case 3:
			// return [`Three ${dice[0].faceValue}'s`, dice[0].faceValue * 100 * 1];
			return dice[0].faceValue * 100 * 1;
			break;

		case 4:
			// return [`Four ${dice[0].faceValue}'s`, dice[0].faceValue * 100 * 2];
			return dice[0].faceValue * 100 * 2;
			break;

		case 5:
			// return [`Five ${dice[0].faceValue}'s`, dice[0].faceValue * 100 * 4];
			return ice[0].faceValue * 100 * 4;
			break;

		case 6:
			// return [`Six ${dice[0].faceValue}'s`, dice[0].faceValue * 100 * 4];
			return dice[0].faceValue * 100 * 4;
			break;
	}


}
//#endregion
