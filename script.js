// DICE GAME RULES ***
//region [Gray]
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
//#region [Gray]
// Creates Die objects for use in play
class Die {
	constructor(faceValue, div, held = false, scoring = false, group, ui) {
		this.faceValue = faceValue; // the rolled value of the die
		this.div = div; // reference to visual element in window
		this.held = held; // bool, is die in the held area?
		this.scoring = scoring; // bool, is die currently worth any points?
		this.group = group; // reference to the scoringGroup this die is in, if any
        this.ui = ui;

		this.div = document.createElement('div');
		this.div.classList.add('die');

		const val = Math.floor(Math.random() * 6 + 1);
		this.faceValue = val;
		
        // Assign default values for scoringGroup that will be overriden when actually in a group
		this.group = new ScoringGroup(0, 'None', []);

        // create UI element and append as child
        // ui = document.createElement('h1');
        // ui.classList.add('ui');
        // this.div.appendChild(ui);
        
	}

    // updates text on the die for testing
	updateUI() {
        // ui.innerText = this.faceValue;
		 this.div.innerText = this.faceValue;
	}
}

//#endregion

//#region [Violet]
// Controls game flow and functions
class Game {
	constructor() {}

	throw(num) {
		dice.length = 0;
		// Create num dice in play area
		write(`Throwing ${num} dice`, 'blue');
		for (let i = 0; i < num; i++) {
			const newDie = new Die();
			// Manually set the dice value for testing
			if (useRiggedDice) {
				newDie.faceValue = riggedDice[i];
			}
			//console.log(`Rolled ${newDie.faceValue}`);
			dice.push(newDie);
			diceInPlay.push(newDie);
			playArea.appendChild(newDie.div);
		}
	}

	startPlayerTurn() {
		playersTurn = true;
		write("== Start of Player's turn", 'bg-green');
	}

    startCPUTurn() {
        write("== Start of CPU's turn", 'bg-red');
        disable(buttonRoll);
        disable(buttonEnd);
        this.cpuTurn();
    }

	// Control computer's turn
	cpuTurn() {
        // throw dice, checkScoring, and updateScoreboard
        this.handleDiceThrow();
        // Get all scoring dice and move them to held area
        this.moveScoringGroups();

		console.log(`CPU Round total: ${roundTotal}`);
        //console.log(`diceInPlay.length: ${diceInPlay.length}`);
		// Check remaining dice, if more than 2, roll again
		if (diceInPlay.length > 2) {
            this.cpuTurn();
		}
		// Otherwise end turn
		else {
			this.endTurn();
		}
	}

	handleDiceThrow() {

		if (playersTurn) {
			disable(buttonRoll);
		}

        const remainingDice = diceInPlay.length;
		clearPlayArea();

        // First turn throw 6 dice, otherwise throw remaining dice
		if (diceInHeld.length === 0) {
			game.throw(6);
		} else {
			game.throw(remainingDice);
		}

		checkScoring();
		updateDiceUI();
		this.updateScoreboard();
	}

	updateScoreboard() {
		if (playersTurn) {
			roundText.innerText = roundTotal;
		} else {
			roundText.innerText = roundTotal;
		}

		scoreText.innerText = playerScore;
		computerScoreText.innerText = computerScore;
	}

	endTurn() {
		resetBoard();

		if (playersTurn) {
			playArea.style.background = 'darkRed';
			heldArea.style.background = 'darkRed';
			playerScore += roundTotal;
			write(`Player's turn ended. Earned ${roundTotal} points.`, 'green');
			roundTotal = 0;
			disable(buttonRoll);
			disable(buttonEnd);
            playersTurn = false;
			this.startCPUTurn();
		} else {
			playArea.style.background = 'black';
			heldArea.style.background = 'black';
			computerScore += roundTotal;
			write(`CPU's turn ended. Earned ${roundTotal} points.`, 'red');
			roundTotal = 0;
			enable(buttonRoll);
			disable(buttonEnd);
            playersTurn = true;
            this.startPlayerTurn();
		}

		this.updateScoreboard();
	}

	// Method for the computer to move all scoring dice over to the held area
	moveScoringGroups() {
		console.log(`ScoringGroupsInPlay: ${scoringGroupsInPlay.length}`);
		scoringGroupsInPlay.forEach((scoringGroup) => {
			if (scoringGroup.type === 'Single') {
				console.log('CPU picks a single');
				roundTotal += scoringGroup.value;
				moveDie(scoringGroup.members[0].div);
			} else {
				scoringGroup.members.forEach((die) => {
					moveDie(die.div);
				});
				roundTotal += scoringGroup.value;
				console.log(`CPU picks a group: ${scoringGroup.type}`);
			}
		});
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

// DECLARATIONS
//#region [Blue]
// Global variables
const game = new Game();
const dice = [];
const diceInPlay = [];
const diceInHeld = [];
const scoringGroupsInPlay = [];
let playersTurn = true;
let roundTotal = 0;
let playerScore = 0;
let computerScore = 0;

// Dev tools
const useRiggedDice = false;
const riggedDice = [1,2,2,3,3,6];

// Element references
const playArea = document.querySelector('#play-area');
const heldArea = document.querySelector('#held-area');
const buttonRoll = document.querySelector('#button-roll');
const buttonEnd = document.querySelector('#button-end');
const runCPU = document.querySelector('#button-runCPU');
const roundText = document.querySelector('#round');
const scoreText = document.querySelector('#score');
const computerScoreText = document.querySelector('#computer-score');

// Start game
game.startPlayerTurn();
//#endregion


// BUTTONS & EVENTS
//#region [Blue]
// CLICK ON DICE IN PLAY AREA
playArea.addEventListener('click', (e) => {
	e.preventDefault();

	const targetDie = getDieByDiv(e.target);

	if (e.target.classList.contains('die') && targetDie.scoring) {

        enable(buttonEnd);
        enable(buttonRoll);

		if (targetDie.group.type === 'Single') {
			moveDie(e.target);
		} else {
			targetDie.group.members.forEach((die) => {
				moveDie(die.div);
			});
		}
        // Add total point value of dice held to running total for the round 
		roundTotal += targetDie.group.value;

		console.log(`Player round total: ${roundTotal}`);
		game.updateScoreboard();
	}
});

// ROLL BUTTON
buttonRoll.addEventListener('click', (e) => {
	e.preventDefault();
    game.handleDiceThrow();

});

// END TURN BUTTON
// End turn, lock in your points
buttonEnd.addEventListener('click', (e) => {
    e.preventDefault();
    game.endTurn();
})

// COMPUTER TURN BUTTON
runCPU.addEventListener('click', (e) => {
    e.preventDefault();
    game.cpuTurn();
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
	
    // PATTERN RECOGNITION and ASSIGNING GROUPS

    // THREE OR MORE OF A KIND
	// Iterate through Sorted object's properties (the arrays sorted by dice face value)
    // 'Sorted' is an object with this format-- { ones: [], twos: [], etc }
	Object.entries(sorted).forEach((entry) => {
		// Iterate through the sorted arrays
		if (entry[1].length >= 3) {

            // Make an empty scoring group to assign values to to describe this group of dice

            // TODO: Make a function out of this called assignScoringGroup
            const thisGroup = new ScoringGroup(0, '', []);
            scoringGroupsInPlay.push(thisGroup);    //'register' this group
            console.log(`Registered scoring group ${thisGroup}`);

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
			});
            //console.log(`Rolled ${entry[1].length} ${entry[0]}!`);
		}
	});

    // STRAIGHTS
    // TODO: DRY THIS UP, consolidate into one function
    const one = getDieByFaceValue(1);
    const two = getDieByFaceValue(2);
    const three = getDieByFaceValue(3);
    const four = getDieByFaceValue(4);
    const five = getDieByFaceValue(5);
    const six = getDieByFaceValue(6);

    if (two && three && four && five) {

        if (one && six) {

        const thisGroup = new ScoringGroup(0, '', []);
        scoringGroupsInPlay.push(thisGroup);    //'register' this group
        console.log(`Registered scoring group ${thisGroup}`);
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

        const thisGroup = new ScoringGroup(0, '', []);
        scoringGroupsInPlay.push(thisGroup);    //'register' this group
        console.log(`Registered scoring group ${thisGroup}`);
            console.log('Partial Straight 1-5');
            const array = [one, two, three, four, five];
            array.forEach((die) => {
							die.scoring = true;
							die.div.classList.add('scoring-straight');

							// Assign values to the scoring group
							thisGroup.members.push(die);
							thisGroup.type = 'Partial Straight 1-5';
							thisGroup.value = 500;
    						// give each die a reference to the group it's in
							die.group = thisGroup;
						});

        } else if (six) {

        const thisGroup = new ScoringGroup(0, '', []);
        scoringGroupsInPlay.push(thisGroup);    //'register' this group
        console.log(`Registered scoring group ${thisGroup}`);
            console.log('Partial Straight 2-6');
            const array = [two, three, four, five, six];
            array.forEach((die) => {
							die.scoring = true;
							die.div.classList.add('scoring-straight');

							// Assign values to the scoring group
							thisGroup.members.push(die);
							thisGroup.type = 'Partial Straight 2-6';
							thisGroup.value = 750;
							// give each die a reference to the group it's in
							die.group = thisGroup;
						});
        }
    }

    // SINGLE DICE
	// Check for single 1's
	if (sorted.ones.length > 0 && sorted.ones.length < 3) {

		sorted.ones.forEach((die) => {
			if (die.group.type === 'None') {
                const thisGroup = new ScoringGroup(0, '', []);

				thisGroup.value = 100;
				thisGroup.type = 'Single 1';
				thisGroup.members.push(die);
                scoringGroupsInPlay.push(thisGroup);    //'register' this group
                console.log(`Registered scoring group ${thisGroup.type}`);

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
				thisGroup.type = 'Single 5';
				thisGroup.members.push(die);
                scoringGroupsInPlay.push(thisGroup);    //'register' this group
                console.log(`Registered scoring group ${thisGroup.type}`);

				die.group = thisGroup;
				die.scoring = true;
				die.div.classList.add('scoring-solo');
			}
		});
  	}

	updateDiceUI();

	// If no scoring dice were produced during the roll, end turn and gain 0 points 
	if (!anyScoring(diceInPlay)) {
		console.log('NO SCORING DICE ROLLED!');
        roundScore = 0;
        game.endTurn();
	}
}
	//#endregion

// CALCULATE "OF-A-KIND" VALUES
//#region [DarkGray]
function ofAKindValue(dice) {
// TODO: DRY this up! consolidate conditionals, write generic formula to arrive at end value

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
//#endregion

// FUNCTIONS
//#region [DarkGray]
// TODO: move this to Game class
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

        if (playersTurn && diceInHeld.length === 6) {
            disable(buttonRoll);
        }
	}
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
function anyScoring(array) {
    let found = false;
    array.forEach((die) => {
        if (die.scoring === true || die.scoring === 'true') {
            found = true;
        }
    })
    return found;
}

// TODO: Use .find();
function getAllScoringDice() {
    let found = [];
    diceInPlay.forEach((die) => {
        if (die.scoring === true || die.scoring === 'true') {
            found.push(die);
        }
    })
    console.log(`getAllScoringDice: ${found.length}`);
    return found;

}

// Reset board
function clearPlayArea() {
	// Clear dice from array and board
	diceInPlay.forEach((die) => {
		if (diceInPlay.length > 0) die.div.remove();
	});

	diceInPlay.length = 0;
    scoringGroupsInPlay.length = 0;
   // console.log(`Clearing diceInPlay: ${diceInPlay.length} and scoringGroups`);
   // console.log('Cleared diceInPlay and scoringGroupsInPlay arrays');
}

function resetBoard() {
    //console.log('Reset Board');

	diceInPlay.forEach((die) => {
		if (diceInPlay.length > 0) die.div.remove();
	});

	diceInPlay.length = 0;
    scoringGroupsInPlay.length = 0;

    diceInHeld.forEach((die) => {
		if (diceInHeld.length > 0) die.div.remove();
	});

	diceInHeld.length = 0;
    //console.log(`Clearing diceInHeld: ${diceInHeld.length}`);
    dice.length = 0;
}

function enable(element) {
    element.classList.remove('disabled');
}

function disable(element) {
	element.classList.add('disabled');
}
// Print styled text to the console
// TODO: allow this to accept multiple css 'classes' as arguments
function write(text, style) {
	let css = '';
	switch (style) {
		case 'red':
			css = 'color: red;';
			break;

		case 'bg-red':
			css = 'background: red; color: white';
			break;

		case 'green':
			css = 'color: chartreuse;';
			break;

		case 'bg-green':
			css = 'background: chartreuse; color: black';
			break;

		case 'blue':
			css = 'color: cyan;';
			break;

		case 'pink':
			css = 'color: magenta;';
			break;

		case 'purple':
			css = 'color: purple;';
			break;
	}

	console.log(`%c${text}`, css);
}
//#endregion