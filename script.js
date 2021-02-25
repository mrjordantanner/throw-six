// "Throw Six"
// Dice Game by Jordan T. Smith
// General Assmebly SEIR-201, Unit 1

// CLASSES
class Die {
	constructor(
		faceValue,
		div,
		held = false,
		scoring = false,
		group,
		uiFaceValue,
		uiPointValue
	) {
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

		if (!playersTurn) {
			this.div.classList.add('no-click');
		}

		// Assign default values for scoringGroup that will later be overidden
		this.group = new ScoringGroup(0, 'None', []);

		// create UI element and append as child
		//this.uiPointValue = document.createElement('div');
		//this.uiPointValue.classList.add('point-value');
		//this.div.appendChild(this.uiPointValue);

		// Set the color of the dice according to user preferences
		if (playersTurn) {
			this.div.style.background = playerDieColor;
		} else {
			this.div.style.background = cpuDieColor;
		}

		this.randomizeDieThrow();
	}

	randomizeDieThrow() {
		this.div.classList.add('absolute');
		this.div.classList.add('no-click');
		this.div.classList.add('die-animation');
		
		const randomRot = getRandomInt(800, 1400) * -1;
		const randomX = getRandomInt(-100, 600);
		const randomY = getRandomInt(50, 500);
		const randomTime = getRandomRange(0.2, 1);

		// --throw-origin-x: -200px;
		// --throw-origin-y: 550px;

		// set beginning and end point of throw depending on player
		this.div.style.setProperty('--throw-origin-x', '-200px');
		this.div.style.setProperty('--throw-origin-y', '500px');

		// Player throw
		this.div.style.setProperty('--random-point-x', randomX + 'px');
		this.div.style.setProperty('--random-point-y', randomY + 'px');
		this.div.style.setProperty('--random-rotation', randomRot + 'deg');
		this.div.style.setProperty('--throw-animation-time', randomTime + 's');
	}
}

class ScoringGroup {
	constructor(value, type, members) {
		this.value = value; // how many points the group as a whole is worth
		this.type = type; // type of pattern, e.g three of a kind, flush
		this.members = members; // dice that are members of this group
	}
}

// DECLARATIONS
// Global variables
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

// Element references
const playArea = document.querySelector('#play-area');
const heldArea = document.querySelector('#held-area');
const buttonRoll = document.querySelector('#button-roll');
const buttonStand = document.querySelector('#button-stand');
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
const scoreGoal = 4000;
const playerTurnColor = '#333333';
const cpuTurnColor = '#111111';
const playerDieColor = 'black';
const cpuDieColor = 'red';
const bustedColor = '#c4002e';

// Dev tools
const useRiggedDice = false;
const riggedDice = [2, 2, 3, 3, 6, 6];

// Start game
initialize();

// BUTTONS & EVENTS
// Click on dice
playArea.addEventListener('click', (e) => {
	e.preventDefault();

	if (!playersTurn) {
		return;
	}

	if (e.target.classList.contains('die')) {
		let targetDie = getDieByDiv(e.target);

		if (!targetDie.scoring || targetDie.held) {
			return;
		}

		enable(buttonStand);
		enable(buttonRoll);

		snd_tic1.play();

		if (
			targetDie.group.type === 'Single 1' ||
			targetDie.group.type === 'Single 5'
		) {
			moveDie(e.target);
		} else {
			targetDie.group.members.forEach((die) => {
				moveDie(die.div);
			});
		}

		roundTotal += targetDie.group.value;
		updateUI();
	}
});

// Roll/throw button
buttonRoll.addEventListener('click', (e) => {
	e.preventDefault();

	disable(buttonRoll);
	snd_tic2.play();

	if (busted) {
		endTurn();
	} else {
		handleDiceThrow();
	}
});

// Stand button
buttonStand.addEventListener('click', (e) => {
	e.preventDefault();
	snd_tic2.play();
	endTurn();
});

// FUNCTIONS
function moveDie(div) {
	// If in play area, move to held area
	if (checkParent(playArea, div)) {
		const die = getDieByDiv(div);
		die.div.classList.remove('die-animation');
		die.div.classList.remove('absolute');
		heldArea.appendChild(div);
		die.held = true;
		div.classList.remove('scoring');

		diceInPlay.splice(diceInPlay.indexOf(die), 1);
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
	// grand totals
	scoreText.innerText = playerScore;
	cpuScoreText.innerText = cpuScore;

	// button text
	buttonStand.innerText = `Stand at ${roundTotal}`;
	buttonRoll.innerText = `Throw ${6 - diceInHeld.length}`;

	// scorebar fills
	const playerFill = (playerScore / scoreGoal) * 100;
	const cpuFill = (cpuScore / scoreGoal) * 100;
	playerScoreBar.style.width = `${playerFill}%`;
	cpuScoreBar.style.width = `${cpuFill}%`;
}

// UTILITY FUNCTIONS
// https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomRange(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.random() * (max - min + 1) + min;
}

// https://stackoverflow.com/questions/8435183/generate-a-weighted-random-number
function randomWeighted(num1, num2, num3, weight1, weight2) {
	var n = Math.floor(Math.random() * 100);
	switch (n) {
		case n < weight1:
			return num1;
		case n < weight2:
			return num2;
		case n < 100:
			return num3;
		default:
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

function getDieByDiv(div) {
	for (let i = 0; i < dice.length; i++) {
		if (dice[i].div === div) {
			return dice[i];
		}
	}
}

function anyScoring(array) {
	let found = false;
	array.forEach((die) => {
		if (die.scoring === true || die.scoring === 'true') {
			found = true;
		}
	});
	return found;
}

function getAllScoringDice() {
	let found = [];
	diceInPlay.forEach((die) => {
		if (die.scoring === true || die.scoring === 'true') {
			found.push(die);
		}
	});
	return found;
}

function clearPlayArea() {
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

// HTML for dice faces
const html_dice1 = '<span class="dot"></span>';
const html_dice2 = '<span class="dot"></span>' + '<span class="dot"></span>';
const html_dice3 =
	'<span class="dot"></span>' +
	'<span class="dot"></span>' +
	'<span class="dot"></span>';
const html_dice4 =
	'<div class="column">' +
	'<span class="dot"></span>' +
	'<span class="dot"></span>' +
	'</div>' +
	'<div class="column">' +
	'<span class="dot"></span>' +
	'<span class="dot"></span>' +
	'</div>';
const html_dice5 =
	'<div class="column">' +
	'<span class="dot"></span>' +
	'<span class="dot"></span>' +
	'</div>' +
	'<div class="column">' +
	'<span class="dot"></span>' +
	'</div>' +
	'<div class="column">' +
	'<span class="dot"></span>' +
	'<span class="dot"></span>' +
	'</div>';
const html_dice6 =
	'<div class="column">' +
	'<span class="dot"></span>' +
	'<span class="dot"></span>' +
	'<span class="dot"></span>' +
	'</div>' +
	'<div class="column">' +
	'<span class="dot"></span>' +
	'<span class="dot"></span>' +
	'<span class="dot"></span>' +
	'</div>';

// AUDIO
// https://www.w3schools.com/graphics/game_sound.asp
function sound(src) {
	this.sound = document.createElement('audio');
	this.sound.src = src;
	this.sound.setAttribute('preload', 'auto');
	this.sound.setAttribute('controls', 'none');
	this.sound.style.display = 'none';
	document.body.appendChild(this.sound);
	this.play = function () {
		this.sound.play();
	};
	this.stop = function () {
		this.sound.pause();
	};
}

snd_tic1 = new sound('tic-1.wav');
snd_tic2 = new sound('tic-2.wav');
snd_bloop1 = new sound('bloop-1.wav');