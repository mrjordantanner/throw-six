// Handles game flow and controls states
// Create and 'throw' num dice
function throwDice(num) {
	dice.length = 0;
	let rolledMessage = `Rolled `;
	// Create num dice in play area
	text.write(`Throwing ${num} dice`, 'blue');
	for (let i = 0; i < num; i++) {
		const newDie = new Die();

		// Dev tools: Manually set the dice value for testing
		if (useRiggedDice) {
			newDie.faceValue = riggedDice[i];
		}

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

	text.write(rolledMessage, 'cyan');
}

function startPlayerTurn() {
	busted = false;
	playersTurn = true;
	text.write("== Start of Player's turn", 'bg-green');
	document.body.style.background = playerTurnColor;
	buttonRoll.style.color = 'white';
	buttonRoll.style.border = '4px solid white';
}

function startCPUTurn() {
	busted = false;
	playersTurn = false;
	text.write("== Start of CPU's turn", 'bg-red');
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

	disable(messageText);
	updateUI();
}

function checkForWin() {
	// Player wins
	if (playerScore >= scoreGoal) {
		disable(buttonRoll);
		text.write(`You have reached ${scoreGoal} points.`, 'green');
		text.write('YOU WIN!', 'bg-green');
		messageText.innerText = `You reached ${scoreGoal} points. YOU WIN!`;
		messageText.style.color = 'white';
		enable(messageText);
		gameOver = true;
	}
	// Cpu wins
	else if (cpuScore >= scoreGoal) {
		disable(buttonRoll);
		text.write(`CPU has reached ${scoreGoal} points.`, 'red');
		text.write('YOU LOSE.', 'bg-red');
		messageText.innerText = `CPU reached ${scoreGoal} points. You Lose.`;
		messageText.style.color = 'red';
		enable(messageText);
		gameOver = true;
	}
}
