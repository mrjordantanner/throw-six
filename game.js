//#region [Violet]
// class Game {
// 	constructor() {}

// Create and 'throw' num dice
function throwDice(num) {
    console.log('3 - throwDice');
	dice.length = 0;
	let rolledMessage = `Rolled `;
	// Create num dice in play area
	text.write(`Throwing ${num} dice`, 'blue');
	for (let i = 0; i < num; i++) {
		const newDie = new Die();

        // it it's the cpu's turn, add a class to each die that prevents mouse pointer events
        if (!playersTurn) {
            newDie.div.classList.add('no-click');
        }

		// Manually set the dice value for testing
		if (useRiggedDice) {
			newDie.faceValue = riggedDice[i];
		}

		rolledMessage += newDie.faceValue.toString() + ' ';

		dice.push(newDie);
		diceInPlay.push(newDie);
		playArea.appendChild(newDie.div);
	}

	text.write(rolledMessage, 'cyan');
}

function startPlayerTurn() {
    busted = false;
	playersTurn = true;
	text.write("== Start of Player's turn", 'bg-green');
}

function startCPUTurn() {
    busted = false;
    playersTurn = false;
	text.write("== Start of CPU's turn", 'bg-red');
	disable(buttonRoll);
	disable(buttonEnd);
	setTimeout(cpuTurn, gameSpeed);
	console.log('1 - startCpuTurn');
}

// Control computer's turn
function cpuTurn() {
	console.log('2 - cpuTurn');

    const remainingDice = diceInPlay.length;
	clearPlayArea();

	// First turn throw 6 dice, otherwise throw remaining dice
	if (diceInHeld.length === 0) {
        throwDice(6);
	} else {
        throwDice(remainingDice);
	}

    checkScoring();
    if (busted) {
        roundTotal = 0;
        setTimeout(endTurn, gameSpeed);
        return;
    }
	updateUI();

    setTimeout(moveScoringGroups, gameSpeed);

}

// Called on player turns from the roll button
// TODO move this to event listener?
function handleDiceThrow() {

	disable(buttonRoll);
    disable(buttonEnd);

	const remainingDice = diceInPlay.length;
	clearPlayArea();

	// First turn throw 6 dice, otherwise throw remaining dice
	if (diceInHeld.length === 0) {
		throwDice(6);
	} else {
		throwDice(remainingDice);
	}

	checkScoring();
	updateUI();

    if (busted) {
        enable(buttonEnd);
    }
}

// Called on computer turn
// Method for the computer to move all scoring dice over to the held area
function moveScoringGroups() {
	console.log(`MovingScoringGroups: ${scoringGroupsInPlay.length}`);
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

	// "Decide" for the CPU when to stop rolling the dice and end the turn
	// Chooses from a pool of three possibilities with three weighted values 
	const rollThreshold = randomWeighted(1, 2, 3, 15, 85);
	console.log(`rollThreshold: ${rollThreshold}`)

    if (diceInPlay.length > rollThreshold) {
        setTimeout(cpuTurn, gameSpeed);

	} else {
        setTimeout(endTurn, gameSpeed);
	}
}

function endTurn() {
	resetBoard();
	disable(messageText);

	if (playersTurn) {
		playArea.style.background = cpuTurnColor;
		heldArea.style.background = cpuTurnColor;
		playerScore += roundTotal;
		text.write('Player ended their turn.', 'chartreuse');
		text.write(`Earned ${roundTotal} points.`, 'chartreuse');
		disable(buttonRoll);
		disable(buttonEnd);
		roundTotal = 0;
		checkForWin();
		if (gameOver) {
			//do gameover message, effects, etc
			setTimeout(initialize, 5000);
		}
		else {
			startCPUTurn();
		}
	} else {
		playArea.style.background = 'black';
		heldArea.style.background = 'black';
		computerScore += roundTotal;
		text.write(`CPU ended their turn.`, 'red');
		text.write(`Earned ${roundTotal} points.`, 'red');
		enable(buttonRoll);
		// disable(buttonEnd);
		roundTotal = 0;
		checkForWin();
		if (gameOver) {
			//do gameover message, effects, etc
			setTimeout(initialize, 5000);
		}
		else {
			startPlayerTurn();
		}
	}

	updateUI();
}

// If player 'busts' and doesn't roll any scoring die, enter this state
// function bust() {

// }

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
	// Computer wins
	else if (computerScore >= scoreGoal) {
		disable(buttonRoll);
		text.write(`CPU has reached ${scoreGoal} points.`, 'red');
		text.write('YOU LOSE.', 'bg-red');
		messageText.innerText = `CPU reached ${scoreGoal} points. You Lose.`;
		messageText.style.color = 'red';
		enable(messageText);
		gameOver = true;
	}

}

// }
//#endregion
