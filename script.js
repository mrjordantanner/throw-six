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
		this.div.classList.add('draggable');

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
        
		this.randomizePosition();
		this.randomizeRotation();
		//this.reverseRotation();
	}

	randomizePosition() {

		//from http://jsfiddle.net/redler/QcUPk/8/
		let posx = (Math.random() * ($(playArea).width() - 300));
		let posy = (Math.random() * ($(playArea).height() - 50));

		this.div.classList.add('absolute');
		this.div.style.left = `${posx}px`;
		this.div.style.top = `${posy}px`;
	}

	randomizeRotation() {
		const num = Math.random() * diceRotationAmount;
		this.div.style.transform = 'rotate('+num+'2deg)';
	}

	reverseRotation() {
		this.div.classList.remove('absolute');
		this.div.style.transform = 'none';
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

// DECLARATIONS
//#region [Blue]
// Global variables
//const game = new Game();
const text = new Text();
let dice = [];
let diceInPlay = [];
let diceInHeld = [];
let scoringGroupsInPlay = [];
let consoleLines = [];
let playersTurn = true;
let busted = false;
let roundTotal = 0;
let playerScore = 0;
let computerScore = 0;
let gameOver = false;

// Dev tools
let printToConsole = true;   // print to dev console or not
const useRiggedDice = true;
const riggedDice = [1,2,3,4,5,6];
const diceRotationAmount = 90;

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

// Preferences
const gameSpeed = 1000;       // delay in ms between cpu moves
const scoreGoal = 5000;     // when a player reaches this score, they win
const cpuTurnColor = 'transparent';
// Print rules
// text.write('DICE GAME RULES', 'bg-green');

// Start game
initialize();
//#endregion


// BUTTONS & EVENTS
//#region [Red]
// CLICK ON DICE IN PLAY AREA
playArea.addEventListener('click', (e) => {
	e.preventDefault();

	if (!playersTurn) {
		return;
	}

	const targetDie = getDieByDiv(e.target);

	if (e.target.classList.contains('die') && targetDie.scoring) {

		if (targetDie.held) {
			return;
		}
		enable(buttonEnd);
        enable(buttonRoll);


		if (targetDie.group.type === 'Single 1' || targetDie.group.type === 'Single 5') {
			moveDie(e.target);
		} else {
			targetDie.group.members.forEach((die) => {
				moveDie(die.div);
				console.log(`click event moving die: ${die.faceValue}`);
			});
			console.log(`held dice: ${diceInHeld.length}`)
		}
        // Add total point value of dice held to running total for the round 
		roundTotal += targetDie.group.value;

		console.log(`Player round total: ${roundTotal}`);
		updateUI();

	//	targetDie.reverseRotation();

	}
});

// ROLL BUTTON
buttonRoll.addEventListener('click', (e) => {
	e.preventDefault();
	disable(buttonRoll);
    handleDiceThrow();

});

// END TURN BUTTON
// End turn, lock in your points
buttonEnd.addEventListener('click', (e) => {
    e.preventDefault();
	console.clear();
    endTurn();

})
//#endregion


// FUNCTIONS
//#region [Blue]
// TODO: move this to Game class
// 'moves' the die and re-appends its corresponding div to playArea (or heldArea)
function moveDie(div) {
	// If in play area, move to held area
	if (checkParent(playArea, div)) {
		// reset dice rotation
		const die = getDieByDiv(div);
		die.reverseRotation();
		// append
		heldArea.appendChild(div);

		die.held = true; // TODO: this is buggy
		die.updateUI();
		// div.classList.remove('absolute');
		// div.classList.add('reset-transform');
		div.classList.remove('scoring');


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

function initialize() {
	gameOver = false;
	roundTotal = 0;
	playerScore = 0;
	cpuScore = 0;
	busted = false;
	dice = [];
	diceInPlay = [];
	diceInHeld = [];
	scoringGroupsInPlay = [];
	consoleLines = [];
	disable(messageText);
	resetBoard();
	updateUI();
	enable(buttonRoll);
	startPlayerTurn();
}

function updateUI() {

	// Score for the round
	// if (playersTurn) {
	// 	roundText.innerText = roundTotal;
	// } else {
	// 	roundText.innerText = roundTotal;
	// }

	// grand totals
	scoreText.innerText = playerScore;
	computerScoreText.innerText = computerScore;

	// button text
	buttonEnd.innerText = `Cashout ${roundTotal}`;
	buttonRoll.innerText = `Throw ${6 - diceInHeld.length}`;

    dice.forEach((die) => {
        die.updateUI();
    })

}

// https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// https://stackoverflow.com/questions/8435183/generate-a-weighted-random-number
function randomWeighted(num1, num2, num3, weight1, weight2) {
	var n = Math.floor(Math.random()*100)
	switch(n){
	  case n < weight1:
		return num1;
	  case n < weight2:
		return num2;
	  case n < 100:
		return num3;
		default:
			console.log('randomWeighted default')
		return num2;
	}
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
}

function resetBoard() {

	diceInPlay.forEach((die) => {
		if (diceInPlay.length > 0) die.div.remove();
	});

	diceInPlay.length = 0;
    scoringGroupsInPlay.length = 0;

    diceInHeld.forEach((die) => {
		if (diceInHeld.length > 0) die.div.remove();
	});

	diceInHeld.length = 0;
    dice.length = 0;
	
}

function enable(element) {
    element.classList.remove('disabled');
}

function disable(element) {
	element.classList.add('disabled');
}

//#endregion