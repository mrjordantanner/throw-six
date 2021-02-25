// GAME.JS handles game flow and states

function initialize() {
	labelNameCpu.classList.remove('turn-indicator');
	labelNamePlayer.classList.add('turn-indicator');

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

	text.clear();
	disable(messageText);
	resetBoard();
	updateUI();
	enable(buttonRoll);
	startPlayerTurn();
}

// Create and 'throw' num dice
function throwDice(num) {
	dice.length = 0;
	let rolledMessage = `Rolled `;
	// Create num dice in play area
	text.write(`Throwing ${num} dice`, 'white');
	for (let i = 0; i < num; i++) {
		const newDie = new Die();

		// Create dots on the die depending on what the face value is
		switch (newDie.faceValue) {
			case 1:
				newDie.div.classList.add('first-face');
				newDie.div.innerHTML = html_dice1;
				break;
			case 2:
				newDie.div.classList.add('second-face');
				newDie.div.innerHTML = html_dice2;
				break;
			case 3:
				newDie.div.classList.add('third-face');
				newDie.div.innerHTML = html_dice3;
				break;
			case 4:
				newDie.div.classList.add('fourth-face');
				newDie.div.innerHTML = html_dice4;
				break;
			case 5:
				newDie.div.classList.add('fifth-face');
				newDie.div.innerHTML = html_dice5;
				break;
			case 6:
				newDie.div.classList.add('sixth-face');
				newDie.div.innerHTML = html_dice6;
				break;
		}

		rolledMessage += newDie.faceValue.toString() + ' ';
		dice.push(newDie);
		diceInPlay.push(newDie);
		playArea.appendChild(newDie.div);

		newDie.div.addEventListener('animationend', () => {
			newDie.div.classList.remove('no-click');
		});
	}

	text.write(rolledMessage, 'white-bold');
}

function startPlayerTurn() {
	disable(messageText);
	busted = false;
	playersTurn = true;
	text.write("Start of Player's turn", 'black');
	document.body.style.background = playerTurnColor;
	buttonRoll.style.color = 'white';
	buttonRoll.style.border = '4px solid white';
}

function startCPUTurn() {
	disable(messageText);
	busted = false;
	playersTurn = false;
	text.write("Start of CPU's turn", 'black');
	disable(buttonRoll);
	disable(buttonStand);
	setTimeout(cpuTurn, 1000);
	document.body.style.background = cpuTurnColor;
}

// Control Cpu's turn
function cpuTurn() {
	const remainingDice = diceInPlay.length;
	clearPlayArea();

	// First turn throw 6 dice, otherwise throw remaining dice
	if (diceInHeld.length === 0) {
		throwDice(6);
	} else {
		throwDice(remainingDice);
	}

	setTimeout(checkScoring, 1200);
}

// Called on PLAYER turns from the roll button
function handleDiceThrow() {
	snd_tic2.play();

	disable(buttonRoll);
	disable(buttonStand);

	const remainingDice = diceInPlay.length;
	clearPlayArea();

	// First turn throw 6 dice, otherwise throw remaining dice
	if (diceInHeld.length === 0) {
		throwDice(6);
	} else {
		throwDice(remainingDice);
	}
	setTimeout(checkScoring, 1500);
}

// Called on CPU turn
// Method for the cpu to move all scoring dice over to the held area
function moveScoringGroups() {
	scoringGroupsInPlay.forEach((scoringGroup) => {
		if (scoringGroup.type === 'Single') {
			roundTotal += scoringGroup.value;
			moveDie(scoringGroup.members[0].div);
		} else {
			scoringGroup.members.forEach((die) => {
				moveDie(die.div);
			});
			roundTotal += scoringGroup.value;
		}
	});

	// "Decide" for the CPU when to stop rolling the dice and end the turn
	const rollThreshold = randomWeighted(1, 2, 3, 15, 85);

	if (diceInPlay.length > rollThreshold) {
		setTimeout(cpuTurn, 1000);
	} else {
		setTimeout(endTurn, 1000);
	}
}

function endTurn() {
	resetBoard();
	
	if (playersTurn) {
		// End Player turn
		labelNameCpu.classList.add('turn-indicator');
		labelNamePlayer.classList.remove('turn-indicator');
		document.body.style.background = cpuTurnColor;
		playerScore += roundTotal;
		text.write('Player ended their turn.', 'chartreuse');
		text.write(`Earned ${roundTotal} points.`, 'chartreuse');
		disable(buttonRoll);
		disable(buttonStand);
		roundTotal = 0;
		checkForWin();
		if (gameOver) {
			setTimeout(initialize, 5000);
		} else {
			startCPUTurn();
		}
	} else {
		// End CPU turn
		labelNameCpu.classList.remove('turn-indicator');
		labelNamePlayer.classList.add('turn-indicator');
		document.body.style.background = playerTurnColor;
		cpuScore += roundTotal;
		text.write(`CPU ended their turn.`, 'red');
		text.write(`Earned ${roundTotal} points.`, 'red');
		enable(buttonRoll);
		roundTotal = 0;
		checkForWin();
		if (gameOver) {
			setTimeout(initialize, 5000);
		} else {
			startPlayerTurn();
		}
	}

	updateUI();
}

function checkForWin() {
	// Player wins
	if (playerScore >= scoreGoal) {
		enable(messageText);
		messageText.innerText = `You reached ${scoreGoal} points. YOU WIN!`;
   		messageText.style.color = 'white';
		text.write(`You have reached ${scoreGoal} points.`, 'chartreuse');
		text.write('YOU WIN!', 'bg-green');
		gameOver = true;

	}
	// Cpu wins
	else if (cpuScore >= scoreGoal) {
		enable(messageText);
		messageText.innerText = `CPU reached ${scoreGoal} points. You Lose.`;
		messageText.style.color = 'red';

		disable(buttonRoll);
		text.write(`CPU has reached ${scoreGoal} points.`, 'red');
		text.write('YOU LOSE.', 'bg-red');
		gameOver = true;

	}
}


function bustCheck() {
	// Either enter bust state if no scoring dice rolled, or select scoring dice
	if (anyScoring(diceInPlay)) {
		busted = false;
		if (!playersTurn) {
			setTimeout(moveScoringGroups, 1200);
		}
	} else {
		setTimeout(handleBust, 750);
	}
}

// Handle 'Bust' and 'End Turn' states for player and cpu
function handleBust() {
	busted = true;
	roundTotal = 0;
	document.body.style.background = bustedColor;
	disable(buttonStand);
	snd_bloop1.play();

	if (playersTurn) {
		enable(messageText);
		messageText.innerText = 'Busted!  No scoring dice rolled.';
   		messageText.style.color = 'white';
		text.write('Busted! No scoring dice rolled.', 'black');
	} else {
		text.write('CPU Busted! No scoring dice rolled.', 'black');
	}

	setTimeout(endTurn, 2500);
}
