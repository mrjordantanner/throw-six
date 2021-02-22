// DICE GAME RULES
//#region [DarkGray]
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
//#region [Blue]
// Creates Die objects for use in play
class Die {
	constructor(faceValue, div, held = false, scoring = false, group, uiFaceValue, uiPointValue) {
		this.faceValue = faceValue; // the rolled value of the die
		this.div = div; // reference to visual element in window
		this.held = held; // bool, is die in the held area?
		this.scoring = scoring; // bool, is die currently worth any points?
		this.group = group; // reference to the scoringGroup this die is in, if any
        this.uiFaceValue = uiFaceValue;
        this.uiPointValue = uiPointValue;

        // Create div element to represent the die on screen
		this.div = document.createElement('div');
		this.div.classList.add('die');

        // Assign random face value to die, 1-6
		const val = Math.floor(Math.random() * 6 + 1);
		this.faceValue = val;
		
        // Assign default values for scoringGroup that will later be overidden
		this.group = new ScoringGroup(0, 'None', []);

        // create UI element and append as child
        this.uiFaceValue = document.createElement('div');
        this.uiPointValue = document.createElement('div');
        this.uiFaceValue.classList.add('face-value');
        this.uiPointValue.classList.add('point-value');
        this.div.appendChild(this.uiFaceValue);
        this.div.appendChild(this.uiPointValue);

        this.updateUI();
        
	}

    // updates text on the die for testing
	updateUI() {
        this.uiFaceValue.innerText = this.faceValue;
        this.uiPointValue.innerText = this.group.value;
	}
}

class ScoringGroup {
	constructor(value, type, members) {
		this.value = value;        // how many points the group as a whole is worth
		this.type = type;          // type of pattern, e.g three of a kind, flush
		this.members = members;    // dice that are members of this group
	}
}


// Handles text styling and output
class Text {

	constructor() {}

	clear() {
		let allConsoleLines = document.querySelectorAll('.console-line');
		let numberOfLines = allConsoleLines.length;
		if (numberOfLines > 0) {
			for (let i = 0; i < numberOfLines; i++) {
				allConsoleLines[i].remove();
			}
		}

		allConsoleLines = [];
		allConsoleLines.length = 0;
	}

	write(msg, style) {
		const newText = document.createTextNode(msg);
		const newLine = document.createElement('p');

		newLine.appendChild(newText);
		consoleContainer.appendChild(newLine);
		consoleLines.push(newLine);
		newLine.classList.add('console-line');
		newLine.innerText = msg;
		let css;

		switch (style) {
			default:
				css = 'color: gray;';
				newLine.classList.add('gray');
				break;
			case 'red':
				css = 'color: red; font-weight: bold;';
				newLine.classList.add('red');
				break;
			case 'white':
				css = 'color: white;';
				newLine.classList.add('white');
				break;
			case 'cyan':
				css = 'color: cyan; font-weight: bold;';
				newLine.classList.add('cyan');
				newLine.classList.add('bold');
				break;
			case 'bg-red':
				css = 'background: red; color: white;';
				newLine.classList.add('bg-red');
				break;

			case 'chartreuse':
				css = 'color: chartreuse;';
				newLine.classList.add('green');
				break;

			case 'bg-green':
				css = 'background: chartreuse; color: black;';
				newLine.classList.add('bg-green');
				newLine.classList.add('black');
				break;

			case 'red-bold':
				css = 'color: red; font-weight:bold';
				newLine.classList.add('red');
				newLine.classList.add('bold');
				break;

			case 'white-bold':
				css = 'color: white; font-weight:bold';
				newLine.classList.add('white');
				newLine.classList.add('bold');
				break;
		}

		if (printToConsole) {
			console.log('%c ' + msg, css);
		}

		consoleContainer.scrollTop = consoleContainer.scrollHeight;
	}
}
//#endregion

// DECLARATIONS
//#region [Blue]
// Global variables
//const game = new Game();
const text = new Text();
const dice = [];
const diceInPlay = [];
const diceInHeld = [];
const scoringGroupsInPlay = [];
let consoleLines = [];
let playersTurn = true;
let busted = false;
let roundTotal = 0;
let playerScore = 0;
let computerScore = 0;
const scoreGoal = 5000;     // when a player reaches this score, they win
const gameSpeed = 1000;       // delay in ms between cpu moves


// Dev tools
let printToConsole = true;   // print to dev console or not
const useRiggedDice = false;
const riggedDice = [1,2,3,4,5,6];

// Element references
const playArea = document.querySelector('#play-area');
const heldArea = document.querySelector('#held-area');
const buttonRoll = document.querySelector('#button-roll');
const buttonEnd = document.querySelector('#button-end');
const runCPU = document.querySelector('#button-runCPU');
const roundText = document.querySelector('#round');
const scoreText = document.querySelector('#score');
const computerScoreText = document.querySelector('#computer-score');
const messageText = document.querySelector('#message');
const consoleContainer = document.querySelector('#console-container');

// Print rules
// text.write('DICE GAME RULES', 'bg-green');

// Start game
startPlayerTurn();
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
		updateScoreboard();
	}
});

// ROLL BUTTON
buttonRoll.addEventListener('click', (e) => {
	e.preventDefault();
    handleDiceThrow();

});

// END TURN BUTTON
// End turn, lock in your points
buttonEnd.addEventListener('click', (e) => {
    e.preventDefault();
    endTurn();
})

// COMPUTER TURN BUTTON
// runCPU.addEventListener('click', (e) => {
//     e.preventDefault();
//     game.cpuTurn();
// })
//#endregion

// CALCULATE "OF-A-KIND" VALUES
//#region [DarkGray]
function ofAKindValue(dice) {
// TODO: DRY this up! consolidate conditionals, text.write generic formula to arrive at end value

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

//#endregion