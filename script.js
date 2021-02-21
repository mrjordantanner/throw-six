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
		this.group = new ScoringGroup(0, 'None', []);
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
useRiggedDice = false;
riggedDice = [6,6,6,5,5,5];

// Elements
const playArea = document.querySelector('#play-area');
const heldArea = document.querySelector('#held-area');
const buttonRoll = document.querySelector('#button-roll');
const buttonEnd = document.querySelector('#button-end');
const roundText = document.querySelector('#round');
const scoreText = document.querySelector('#score');

// Event listeners
playArea.addEventListener('click', (e) => {
	e.preventDefault();

    buttonEnd.classList.remove('disabled');

	const targetDie = getDieByDiv(e.target);

	if (e.target.classList.contains('die') && targetDie.scoring) {
		if (targetDie.group.type === 'Single') {
			moveDie(e.target);
		} else {
			targetDie.group.members.forEach((die) => {
				moveDie(die.div);
			});
		}
        // Add total point value of dice held to running total for the round 
		playerRoundTotal += targetDie.group.value;

		// console.log(`In Play: ${diceInPlay.length}`);
		// console.log(`In Held: ${diceInHeld.length}`);
		console.log(`Player round total: ${playerRoundTotal}`);
		updateScoreboard();
	}
});

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

    clearPlayArea();

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

// End turn, lock in your points
buttonEnd.addEventListener('click', (e) => {
    e.preventDefault();


//  game.endTurn();
    //playersTurn = false;

    playerScore += playerRoundTotal;
    playerRoundTotal = 0;

    buttonRoll.classList.remove('disabled');
    buttonEnd.classList.add('disabled');

    clearPlayArea();
    clearHeldArea();

    updateScoreboard();

})
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
			if (die.group.type === 'None') {
				const thisGroup = new ScoringGroup(0, '', []);
				thisGroup.value = 100;
				thisGroup.type = 'Single';
				thisGroup.members.push(die);
				die.group = thisGroup;
				die.scoring = true;
				die.div.classList.add('scoring-solo');
			}
		});

	}
	// Check for single 5's
	if (sorted.fives.length > 0 && sorted.fives.length < 3) {
		sorted.fives.forEach((die) => {
			if (die.group.type === 'None') {
				const thisGroup = new ScoringGroup(0, '', []);
				thisGroup.value = 50;
				thisGroup.type = 'Single';
				thisGroup.members.push(die);
				die.group = thisGroup;
				die.scoring = true;
				die.div.classList.add('scoring-solo');
			}
		});
  

	}

    // THREE OR MORE OF A KIND
	// Iterate through Sorted object's properties (the arrays sorted by dice face value)
	Object.entries(sorted).forEach((entry) => {
		//console.log(entry);
		if (entry[1].length >= 3) {

            // Make an empty scoring group to assign values to to describe this group of dice

            // TODO: Make a function out of this called assignScoringGroup
            const thisGroup = new ScoringGroup(0, 'none', []);  
			entry[1].forEach((die) => {

				die.scoring = true;
				die.div.classList.add('scoring-group');

                // Assign values to the scoring group
                thisGroup.members.push(die);
                const typeText = `${entry[1].length} ${entry[0]}`;
                thisGroup.type = typeText;
                thisGroup.value = ofAKindValue(entry[1]);
                // give each die a reference to the group it's in
                die.group = thisGroup;

                console.log(die.group);
				console.log(`Rolled ${entry[1].length} ${entry[0]}!`);


			});

    
		}
	});

    // STRAIGHTS
    // console.log(anyInPlay(1));
    // console.log(anyInPlay(2));
    // console.log(anyInPlay(3));
    // console.log(anyInPlay(4));
    // console.log(anyInPlay(5));
    // console.log(anyInPlay(6));

    const one = getDieByFaceValue(1);
    const two = getDieByFaceValue(2);
    const three = getDieByFaceValue(3);
    const four = getDieByFaceValue(4);
    const five = getDieByFaceValue(5);
    const six = getDieByFaceValue(6);

    console.log(one);
    console.log(two);
    console.log(three);
    console.log(four);
    console.log(five);
    console.log(six);

    // TODO: DRY THIS UP
    const thisGroup = new ScoringGroup(0, 'None', []); 
    if (two && three && four && five) {
        if (one && six) {
            console.log('Full Straight');
            const array = [one, two, three, four, five, six];
            array.forEach((die) => {
							// we can use main array since all 6 die required
							die.scoring = true;
							die.div.classList.add('scoring-straight');

							// Assign values to the scoring group
							thisGroup.members.push(die);
							thisGroup.type = 'Full Straight';
							thisGroup.value = 1500;
							// give each die a reference to the group it's in
							die.group = thisGroup;
						});

        } else if (one) {
            console.log('Low Partial Straight');
            const array = [one, two, three, four, five];
            array.forEach((die) => {
							die.scoring = true;
							die.div.classList.add('scoring-straight');

							// Assign values to the scoring group
							thisGroup.members.push(die);
							thisGroup.type = 'Partial Straight Low';
							thisGroup.value = 500;
							// give each die a reference to the group it's in
							die.group = thisGroup;
						});

        } else if (two) {
            console.log('High Partial Straight');

            const array = [two, three, four, five, six];
            array.forEach((die) => {
							die.scoring = true;
							die.div.classList.add('scoring-straight');

							// Assign values to the scoring group
							thisGroup.members.push(die);
							thisGroup.type = 'Partial Straight High';
							thisGroup.value = 750;
							// give each die a reference to the group it's in
							die.group = thisGroup;
						});

        }
    }

	updateDiceUI();

	// If no scoring dice were produced during the  roll, end turn and gain 0 points 
	if (!anyScoring()) {
		console.log('NO SCORING DICE. END OF ROUND');
		playerRoundTotal = 0;
        clearHeldArea();
        updateScoreboard();
        buttonRoll.classList.add('disabled');
	}

	// console.log(`Ones: ${ones.length}`);
	// console.log(`Twos: ${twos.length}`);.
	// console.log(`Threes: ${threes.length}`);
	// console.log(`Fours: ${fours.length}`);
	// console.log(`Fives: ${fives.length}`);
	// console.log(`Sixes: ${sixes.length}`);
}
	//#endregion


// TODO: DRY this up! consolidate conditionals, write generic formula to arrive at end value
//#region [Gray]
// CALCULATE VALUES of the different pattern types
// Of A Kind
function ofAKindValue(dice) {

    // Check for multiple 1's first bc they have higher point values
	// Check for other 'of-a-kind's
	switch (dice.length) {
		case 3:
            if (dice.some((die) => die.faceValue === 1)) {
            	return 1000;
            }
			// return [`Three ${dice[0].faceValue}'s`, dice[0].faceValue * 100 * 1];
			else return dice[0].faceValue * 100 * 1;
			break;

		case 4:
            if (dice.some((die) => die.faceValue === 1)) {
			    return 2000;
			}
			// return [`Four ${dice[0].faceValue}'s`, dice[0].faceValue * 100 * 2];
			else return dice[0].faceValue * 100 * 2;
			break;

		case 5:
            if (dice.some((die) => die.faceValue === 1)) {
                return 4000;
            }
			// return [`Five ${dice[0].faceValue}'s`, dice[0].faceValue * 100 * 4];
			else return dice[0].faceValue * 100 * 4;
			break;

		case 6:
            if (dice.some((die) => die.faceValue === 1)) {
                return 8000;
            }
			// return [`Six ${dice[0].faceValue}'s`, dice[0].faceValue * 100 * 4];
			return dice[0].faceValue * 100 * 4;
			break;
	}
}

// Straights
// function straightsValue() {


//     // get die by facevalue
//     // use to check if it exists, also to


//     if (anyInPlay(2) && anyInPlay(3) && anyInPlay(4) && anyInPlay(5)) {
//         if (anyInPlay(1) && anyInPlay(6)) {
//             // full straight
//             console.log('Full Straight');
//             return 1500;
//         } else if (anyInPlay(1)) {
//             // low partial straight
//             console.log('Low Partial Straight');
//             return 500;
//         } else if (anyInPlay(6)) {
//             // high partial straight
//             console.log('High Partial Straight');
//             return 750;
//         }
//     }
//     return 0;
// }


//#endregion
    
//#region [Black]
function updateScoreboard() {
	roundText.innerText = playerRoundTotal;
	scoreText.innerText = playerScore;
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

        if (diceInHeld === 6) {
            buttonRoll.classList.add('disabled');
        }
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

function getDieByFaceValue(faceValue) {
    const test = (die) => die.faceValue === faceValue;
    return diceInPlay.filter(test)[0];
}

// for grabbing the Die object that this div is a property of
function getDieByDiv(div) {
	for (let i = 0; i < dice.length; i++) {
		if (dice[i].div === div) {
			return dice[i];
		}
	}
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

function clearPlayArea() {
	// Clear dice from array and board
	diceInPlay.forEach((die) => {
		if (diceInPlay.length > 0) die.div.remove();
	});

	diceInPlay.length = 0;
}

function clearHeldArea() {
	// Clear dice from array and board
	diceInHeld.forEach((die) => {
		if (diceInHeld.length > 0) die.div.remove();
	});

	diceInHeld.length = 0;
}

// function allInGroup(group) {
//     const test = (die) => die.group === group;
//     if (test) console.log('allinGroup true')
// 	return diceInPlay.filter(test);
// }
//#endregion