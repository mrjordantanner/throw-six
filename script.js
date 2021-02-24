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
		this.faceValue = Math.floor(Math.random() * 6 + 1);
		
		// Create dots on the die face depending on what the face value is
		switch (this.faceValue) {
			case 1:
				this.div.classList.add('first-face');
				this.div.innerHTML = html_dice1;
				break;
			case 2:
				this.div.classList.add('second-face');
				this.div.innerHTML = html_dice2;
				break;
			case 3:
				this.div.classList.add('third-face');
				this.div.innerHTML = html_dice3;
				break;
			case 4:
				this.div.classList.add('fourth-face');
				this.div.innerHTML = html_dice4;
				break;
			case 5:
				this.div.classList.add('fifth-face');
				this.div.innerHTML = html_dice5;
				break;
			case 6:
				this.div.classList.add('sixth-face');
				this.div.innerHTML = html_dice6;
				break;
		}

        // Assign default values for scoringGroup that will later be overidden
		this.group = new ScoringGroup(0, 'None', []);

        // create UI element and append as child
        //this.uiFaceValue = document.createElement('div');
        //this.uiPointValue = document.createElement('div');
        //this.uiFaceValue.classList.add('face-value');
        //this.uiPointValue.classList.add('point-value');
        //this.div.appendChild(this.uiFaceValue);
        //this.div.appendChild(this.uiPointValue);

		if (playersTurn) {
			this.div.style.background = playerDieColor;
		}
		else {
			this.div.style.background = cpuDieColor;
		}

        this.updateUI();
        
		// create dice at set position and rotation, THEN assign them the value so they'll animate using CSS transition
		// const startLeft = buttonRoll.style.left;
		// const startTop = buttonRoll.style.top;
		// console.log(startLeft);
		// console.log(startTop);
		this.div.style.left ='0px';
		this.div.style.top = '0px';
		this.div.style.transform = 'rotate('+0+'2deg)';

		// setTimeout(this.randomizePosition, 350);
		// setTimeout(this.randomizeRotation, 350);
		this.randomizePosition();
		this.randomizeRotation();

		// setTimeout(function() {
		// 	this.randomizePosition(this.div);
		// }, 350)

		// setTimeout(function() {
		// 	this.randomizeRotation(this.div);
		// }, 350)

	}

	randomizePosition() {
	
		//below is from http://jsfiddle.net/redler/QcUPk/8/
		let posx = (Math.random() * ($(playArea).width() - 50));
		let posy = (Math.random() * ($(playArea).height() - 50));

		this.div.classList.add('absolute');
		this.div.style.left = `${posx}px`;
		this.div.style.top = `${posy}px`;


        $('.die').css({ x: '400px', y: '400px' });

		//this.div.translate(posx, posy);

		//$(this).css({"-webkit-transform":"translate(100px,100px)"});​
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
        // this.uiFaceValue.innerText = this.faceValue;
        // this.uiPointValue.innerText = this.group.value;
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
let cpuScore = 0;
let gameOver = false;

// Dev tools
let printToConsole = true;   // print to dev console or not
const useRiggedDice = false;
const riggedDice = [1,2,3,4,5,6];
const diceRotationAmount = 360;

// Element references
const playArea = document.querySelector('#play-area');
const heldArea = document.querySelector('#held-area');
const buttonRoll = document.querySelector('#button-roll');
const buttonStand = document.querySelector('#button-stand');
// const buttonEnd = document.querySelector('#button-end');
const roundText = document.querySelector('#round');
const scoreText = document.querySelector('#score-player');
const cpuScoreText = document.querySelector('#score-cpu');
const messageText = document.querySelector('#message');
const consoleContainer = document.querySelector('#console-container');
const playerScoreBar = document.querySelector('#scorebar-fill-player');
const cpuScoreBar = document.querySelector('#scorebar-fill-cpu');
const labelNameCpu = document.querySelector('#label-name-cpu');
const labelNamePlayer = document.querySelector('#label-name-player');

// Preferences
const gameSpeed = 750;       // delay in ms between cpu moves
const scoreGoal = 4000;     // when a player reaches this score, they win
const playerTurnColor = '##333333';
const cpuTurnColor = '#111111';
const playerDieColor = 'black;'
const cpuDieColor = 'red';
const bustedColor = 'red';
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

		console.log(e.target);

		if (targetDie.held) {
			return;
		}
		enable(buttonStand);
        enable(buttonRoll);

		snd_tic1.play();

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

	// If we've busted, this button ends the turn rather than throwing the dice
	if (busted) {
		disable(buttonRoll);
		console.clear();
		snd_tic2.play();
		endTurn();
	}
	else {
		disable(buttonRoll);
		snd_tic2.play();
		//setTimeout(handleDiceThrow, gameSpeed * 0.5);
		handleDiceThrow();
	}



});

// END TURN BUTTON
// End turn, lock in your points
buttonStand.addEventListener('click', (e) => {
    e.preventDefault();
	console.clear();
	snd_tic2.play();
    endTurn();

})
//#endregion


// FUNCTIONS
//#region [Orange]
// TODO: move this to Game class
// 'moves' the die and re-appends its corresponding div to playArea (or heldArea)
function moveDie(div) {
	// If in play area, move to held area
	if (checkParent(playArea, div)) {

		const die = getDieByDiv(div);
		die.reverseRotation();

		heldArea.appendChild(div);
		die.held = true; 
		die.updateUI();
		div.classList.remove('scoring');

		diceInPlay.splice(diceInPlay.indexOf(die), 1);
		diceInHeld.push(die);
		
        if (playersTurn && diceInHeld.length === 6) {
            disable(buttonRoll);
       }
	}
}

// Set/reset global variables and start the first turn
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
	labelNameCpu.classList.remove('turn-indicator');
	labelNamePlayer.classList.add('turn-indicator');
	document.body.style.background = playerTurnColor;
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
	cpuScoreText.innerText = cpuScore;

	// button text
	buttonStand.innerText = `Stand at ${roundTotal}`;
	buttonRoll.innerText = `Throw ${6 - diceInHeld.length}`;

	// scorebar fills
	const playerFill = (playerScore / scoreGoal ) * 100;
	const cpuFill = (cpuScore / scoreGoal ) * 100;

	playerScoreBar.style.width = `${playerFill}%`;
	cpuScoreBar.style.width = `${cpuFill}%`;

	// diceUI (point value)
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