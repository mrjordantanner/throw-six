//#region [Violet]
// class Game {
// 	constructor() {}

// Create and 'throw' num dice
function throwDice(num) {
	dice.length = 0;
	let rolledMessage = `Rolled `;
	// Create num dice in play area
	text.write(`Throwing ${num} dice`, 'blue');
	for (let i = 0; i < num; i++) {
		const newDie = new Die();
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
	// setTimeout(game.cpuTurn(), 1000);
	cpuTurn();
}

// Control computer's turn
function cpuTurn() {

// Handle dice throw
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
        return endTurn();
    }
	updateDiceUI();
	updateScoreboard();
////
    moveScoringGroups();
  
  	if (diceInPlay.length > 2) {
		cpuTurn();
	} else {
		endTurn();
	}
}

// Called on player turns from the roll button
// TODO move this to event listener?
function handleDiceThrow() {

	disable(buttonRoll);
	const remainingDice = diceInPlay.length;
	clearPlayArea();

	// First turn throw 6 dice, otherwise throw remaining dice
	if (diceInHeld.length === 0) {
		throwDice(6);
	} else {
		throwDice(remainingDice);
	}

	checkScoring();
	updateDiceUI();
	updateScoreboard();
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
}

function endTurn() {
	resetBoard();
	disable(messageText);

	if (playersTurn) {
		playArea.style.background = 'darkRed';
		heldArea.style.background = 'darkRed';
		playerScore += roundTotal;
		text.write('Player ended their turn.', 'chartreuse');
		text.write(`Earned ${roundTotal} points.`, 'chartreuse');
		disable(buttonRoll);
		disable(buttonEnd);
		roundTotal = 0;
		startCPUTurn();
	} else {
		playArea.style.background = 'black';
		heldArea.style.background = 'black';
		computerScore += roundTotal;
		text.write(`CPU ended their turn.`, 'red');
		text.write(`Earned ${roundTotal} points.`, 'red');
		enable(buttonRoll);
		disable(buttonEnd);
		roundTotal = 0;
		startPlayerTurn();
	}

	updateScoreboard();
	checkForWin();
}

// If player 'busts' and doesn't roll any scoring die, enter this state
// function bust() {

// }

function checkForWin() {
	// Player wins
	if (playerScore >= scoreGoal) {
		text.write(`You have reached ${scoreGoal} points.`, 'green');
		text.write('YOU WIN!', 'bg-green');
	}
	// Computer wins
	else if (computerScore >= scoreGoal) {
		text.write(`CPU has reached ${scoreGoal} points.`, 'red');
		text.write('YOU LOSE.', 'bg-red');
	}
}

function updateScoreboard() {
	if (playersTurn) {
		roundText.innerText = roundTotal;
	} else {
		roundText.innerText = roundTotal;
	}

	scoreText.innerText = playerScore;
	computerScoreText.innerText = computerScore;
}
// }
//#endregion
